import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAuth, apiError } from '@/lib/auth'

const redeemSchema = z.object({
  reward_id: z.string().uuid(),
})

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request)
    const { id: customerId } = await params
    const body = await request.json()
    const parsed = redeemSchema.safeParse(body)
    if (!parsed.success) return apiError(400, 'VALIDATION_ERROR', 'Invalid input')

    const [customer, reward] = await Promise.all([
      db.customer.findFirst({
        where: { id: customerId, organization_id: auth.orgId, deleted_at: null },
      }),
      db.reward.findFirst({
        where: { id: parsed.data.reward_id },
        include: { loyalty_program: { select: { organization_id: true } } },
      }),
    ])

    if (!customer) return apiError(404, 'NOT_FOUND', 'Customer not found')
    if (!reward || reward.loyalty_program.organization_id !== auth.orgId) {
      return apiError(404, 'NOT_FOUND', 'Reward not found')
    }
    if (customer.total_points < reward.points_required) {
      return apiError(
        400,
        'INSUFFICIENT_POINTS',
        `Customer needs ${reward.points_required} points but has ${customer.total_points}`
      )
    }

    const newTotal = customer.total_points - reward.points_required

    const [updatedCustomer] = await db.$transaction([
      db.customer.update({ where: { id: customerId }, data: { total_points: newTotal } }),
      db.pointTransaction.create({
        data: {
          customer_id: customerId,
          amount: -reward.points_required,
          type: 'REDEEM_REWARD',
          reason: `Récompense utilisée : ${reward.name}`,
          performed_by: auth.userId,
        },
      }),
    ])

    return NextResponse.json({
      customer: updatedCustomer,
      reward_redeemed: reward,
      points_spent: reward.points_required,
      new_total: newTotal,
    })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to redeem reward')
  }
}
