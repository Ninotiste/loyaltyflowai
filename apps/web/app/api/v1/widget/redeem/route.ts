import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { apiError } from '@/lib/auth'
import { verifyWidgetToken } from '@/lib/widget-token'
import { widgetRatelimit } from '@/lib/redis'
import { randomUUID } from 'crypto'

const redeemSchema = z.object({
  reward_id: z.string().uuid(),
})

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous'
    const { success } = await widgetRatelimit.limit(ip).catch(() => ({ success: true }))
    if (!success)
      return apiError(429, 'RATE_LIMIT', 'Too many requests. Please wait before trying again.')

    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) return apiError(401, 'UNAUTHORIZED', 'Widget token required')

    const { sub: customerId, org: orgId } = await verifyWidgetToken(token)
    const body = await request.json()
    const parsed = redeemSchema.safeParse(body)
    if (!parsed.success) return apiError(400, 'VALIDATION_ERROR', 'Invalid input')

    const [customer, reward] = await Promise.all([
      db.customer.findFirst({
        where: { id: customerId, organization_id: orgId, deleted_at: null, anonymized_at: null },
      }),
      db.reward.findFirst({
        where: { id: parsed.data.reward_id, is_active: true },
        include: { loyalty_program: { select: { organization_id: true } } },
      }),
    ])

    if (!customer) return apiError(404, 'NOT_FOUND', 'Customer not found')
    if (!reward || reward.loyalty_program.organization_id !== orgId) {
      return apiError(404, 'NOT_FOUND', 'Reward not found')
    }
    if (customer.total_points < reward.points_required) {
      return apiError(
        400,
        'INSUFFICIENT_POINTS',
        `Need ${reward.points_required} pts, have ${customer.total_points}`
      )
    }

    const newTotal = customer.total_points - reward.points_required
    const redeemCode = randomUUID().split('-')[0]!.toUpperCase()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await db.$transaction([
      db.customer.update({ where: { id: customerId }, data: { total_points: newTotal } }),
      db.pointTransaction.create({
        data: {
          customer_id: customerId,
          amount: -reward.points_required,
          type: 'REDEEM_REWARD',
          reason: `Widget — ${reward.name}`,
        },
      }),
    ])

    return NextResponse.json({
      code: redeemCode,
      reward_name: reward.name,
      expires_at: expiresAt.toISOString(),
      new_total: newTotal,
    })
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Invalid widget token') {
      return apiError(401, 'INVALID_TOKEN', 'Invalid or expired widget token')
    }
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to redeem reward')
  }
}
