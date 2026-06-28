import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, apiError } from '@/lib/auth'
import { getSubscription } from '@/lib/stripe'

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    const org = await db.organization.findUnique({
      where: { id: auth.orgId },
      select: { plan: true, plan_status: true, stripe_subscription_id: true, created_at: true },
    })

    if (!org) return apiError(404, 'NOT_FOUND', 'Organization not found')

    const customerCount = await db.customer.count({
      where: { organization_id: auth.orgId, deleted_at: null, anonymized_at: null },
    })

    const subscription = org.stripe_subscription_id
      ? await getSubscription(org.stripe_subscription_id)
      : null

    const LIMITS: Record<string, number> = { starter: 500, growth: 5000, pro: Infinity }
    const limit = LIMITS[org.plan] ?? 500

    return NextResponse.json({
      plan: org.plan,
      plan_status: org.plan_status,
      subscription,
      usage: {
        customers: customerCount,
        limit,
        percentage: limit === Infinity ? 0 : Math.round((customerCount / limit) * 100),
      },
    })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to fetch subscription')
  }
}
