import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAuth, apiError } from '@/lib/auth'
import { sendRewardUnlocked } from '@/lib/email'
import { createLogger } from '@loyaltyflowai/logger'

const logger = createLogger('api:points')

const pointsSchema = z.union([
  z.object({
    mode: z.literal('amount'),
    amount_spent: z.number().positive(),
  }),
  z.object({
    mode: z.literal('manual'),
    points: z.number().int().min(1).max(10000),
    reason: z.string().max(200).optional(),
  }),
])

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request)
    const { id: customerId } = await params
    const body = await request.json()
    const parsed = pointsSchema.safeParse(body)
    if (!parsed.success) return apiError(400, 'VALIDATION_ERROR', 'Invalid input')

    const [customer, program] = await Promise.all([
      db.customer.findFirst({
        where: { id: customerId, organization_id: auth.orgId, deleted_at: null },
      }),
      db.loyaltyProgram.findUnique({
        where: { organization_id: auth.orgId },
        include: {
          earning_rules: { where: { is_active: true } },
          rewards: { where: { is_active: true } },
        },
      }),
    ])

    if (!customer) return apiError(404, 'NOT_FOUND', 'Customer not found')
    if (!program) return apiError(404, 'NO_PROGRAM', 'No active program found')

    let pointsToAdd = 0
    let transactionType: 'EARN_VISIT' | 'EARN_AMOUNT' | 'EARN_MANUAL' = 'EARN_MANUAL'
    let reason: string | null = null

    if (parsed.data.mode === 'amount') {
      const amountRule = program.earning_rules.find((r) => r.type === 'PER_AMOUNT_SPENT')
      const visitRule = program.earning_rules.find((r) => r.type === 'PER_VISIT')

      if (amountRule) {
        pointsToAdd = Math.floor(parsed.data.amount_spent / amountRule.points_per_unit)
        transactionType = 'EARN_AMOUNT'
      } else if (visitRule) {
        pointsToAdd = visitRule.points_per_unit
        transactionType = 'EARN_VISIT'
      }

      if (pointsToAdd === 0) pointsToAdd = 1 // minimum 1 point per visit
    } else {
      pointsToAdd = parsed.data.points
      reason = parsed.data.reason ?? null
    }

    const newTotal = customer.total_points + pointsToAdd

    const [updatedCustomer] = await db.$transaction([
      db.customer.update({
        where: { id: customerId },
        data: { total_points: newTotal, last_visit_at: new Date() },
      }),
      db.pointTransaction.create({
        data: {
          customer_id: customerId,
          amount: pointsToAdd,
          type: transactionType,
          reason,
          performed_by: auth.userId,
        },
      }),
    ])

    // Check if any reward is now unlocked
    const unlockedReward = program.rewards.find(
      (r) => newTotal >= r.points_required && customer.total_points < r.points_required
    )

    if (unlockedReward && customer.email && !customer.anonymized_at) {
      sendRewardUnlocked(
        customer.email,
        customer.first_name ?? 'Cher client',
        program.name,
        unlockedReward.name
      ).catch((err) => logger.error('Failed to send reward email', { error: String(err) }))
    }

    return NextResponse.json({
      customer: updatedCustomer,
      points_added: pointsToAdd,
      reward_unlocked: unlockedReward ?? null,
    })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    logger.error('POST points failed', { error: String(err) })
    return apiError(500, 'INTERNAL_ERROR', 'Failed to add points')
  }
}
