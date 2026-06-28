import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, apiError } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [
      totalCustomers,
      newThisMonth,
      recentlyActive,
      highChurnCount,
      rewardsRedeemed,
      allCustomers,
    ] = await Promise.all([
      db.customer.count({
        where: { organization_id: auth.orgId, deleted_at: null, anonymized_at: null },
      }),
      db.customer.count({
        where: { organization_id: auth.orgId, deleted_at: null, created_at: { gte: startOfMonth } },
      }),
      db.customer.count({
        where: {
          organization_id: auth.orgId,
          deleted_at: null,
          last_visit_at: { gte: thirtyDaysAgo },
        },
      }),
      db.churnScore.count({
        where: {
          score: 'HIGH',
          customer: { organization_id: auth.orgId, deleted_at: null },
          calculated_at: { gte: thirtyDaysAgo },
        },
      }),
      db.pointTransaction.count({
        where: {
          type: 'REDEEM_REWARD',
          created_at: { gte: startOfMonth },
          customer: { organization_id: auth.orgId, deleted_at: null },
        },
      }),
      db.customer.findMany({
        where: { organization_id: auth.orgId, deleted_at: null, last_visit_at: { not: null } },
        select: { last_visit_at: true },
      }),
    ])

    // Activation rate: % with at least 1 visit in 30 days
    const activationRate =
      totalCustomers > 0 ? Math.round((recentlyActive / totalCustomers) * 100) : 0

    // Top day of week from last_visit_at data
    const dayCounts = [0, 0, 0, 0, 0, 0, 0]
    for (const c of allCustomers) {
      if (c.last_visit_at) dayCounts[c.last_visit_at.getDay()]++
    }
    const topDayIdx = dayCounts.indexOf(Math.max(...dayCounts))
    const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
    const topDayOfWeek = dayNames[topDayIdx] ?? 'samedi'

    return NextResponse.json({
      total_customers: totalCustomers,
      new_customers_this_month: newThisMonth,
      high_churn_count: highChurnCount,
      activation_rate_30d: activationRate,
      rewards_redeemed_this_month: rewardsRedeemed,
      top_day_of_week: topDayOfWeek,
    })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to fetch metrics')
  }
}
