import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAuth, requireRole, apiError, apiSuccess } from '@/lib/auth'
import { upgradePlan } from '@/lib/stripe'

const upgradeSchema = z.object({
  plan: z.enum(['growth', 'pro']),
})

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)
    requireRole(auth, ['ADMIN'])

    const body = await request.json()
    const parsed = upgradeSchema.safeParse(body)
    if (!parsed.success) return apiError(400, 'VALIDATION_ERROR', 'Invalid plan')

    const org = await db.organization.findUnique({ where: { id: auth.orgId } })
    if (!org) return apiError(404, 'NOT_FOUND', 'Organization not found')

    await upgradePlan(auth.orgId, org.stripe_customer_id, parsed.data.plan)

    await db.organization.update({
      where: { id: auth.orgId },
      data: { plan: parsed.data.plan },
    })

    return apiSuccess({ plan: parsed.data.plan })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to upgrade plan')
  }
}
