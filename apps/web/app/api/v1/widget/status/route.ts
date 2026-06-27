import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { apiError } from '@/lib/auth'
import { verifyWidgetToken } from '@/lib/widget-token'
import { widgetRatelimit } from '@/lib/redis'

export async function GET(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous'
    const { success } = await widgetRatelimit.limit(ip).catch(() => ({ success: true }))
    if (!success)
      return apiError(429, 'RATE_LIMIT', 'Too many requests. Please wait before trying again.')

    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) return apiError(401, 'UNAUTHORIZED', 'Widget token required')

    const { sub: customerId, org: orgId } = await verifyWidgetToken(token)

    const customer = await db.customer.findFirst({
      where: { id: customerId, organization_id: orgId, deleted_at: null, anonymized_at: null },
      select: { id: true, first_name: true, total_points: true, last_visit_at: true },
    })

    if (!customer) return apiError(404, 'NOT_FOUND', 'Customer not found')

    const [program, recentTransactions] = await Promise.all([
      db.loyaltyProgram.findUnique({
        where: { organization_id: orgId },
        include: {
          rewards: { where: { is_active: true }, orderBy: { points_required: 'asc' } },
        },
      }),
      db.pointTransaction.findMany({
        where: { customer_id: customerId },
        orderBy: { created_at: 'desc' },
        take: 10,
        select: { type: true, amount: true, reason: true, created_at: true },
      }),
    ])

    const nextReward =
      program?.rewards.find((r) => r.points_required > customer.total_points) ?? null

    return NextResponse.json({
      customer,
      points: customer.total_points,
      next_reward: nextReward,
      available_rewards:
        program?.rewards.filter((r) => r.points_required <= customer.total_points) ?? [],
      recent_transactions: recentTransactions,
    })
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Invalid widget token') {
      return apiError(401, 'INVALID_TOKEN', 'Invalid or expired widget token')
    }
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to fetch status')
  }
}
