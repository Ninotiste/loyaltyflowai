import { db } from '@/lib/db'
import { requireAuth, requireRole, apiError, apiSuccess } from '@/lib/auth'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request)
    requireRole(auth, ['ADMIN', 'MANAGER'])
    const { id } = await params

    const customer = await db.customer.findFirst({
      where: { id, organization_id: auth.orgId, deleted_at: null, anonymized_at: null },
    })

    if (!customer) return apiError(404, 'NOT_FOUND', 'Customer not found or already anonymized')

    // RGPD Art.17 — right to erasure (right to be forgotten)
    // PII removed, transactions kept for accounting/legal obligations (Art.6.1.c)
    await db.$transaction([
      db.customer.update({
        where: { id },
        data: {
          email: `anonymized-${id}@deleted.invalid`,
          first_name: null,
          last_name: null,
          phone: null,
          anonymized_at: new Date(),
          deleted_at: new Date(),
        },
      }),
      db.churnScore.deleteMany({ where: { customer_id: id } }),
    ])

    return apiSuccess({ success: true, anonymized_at: new Date().toISOString() })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to anonymize customer')
  }
}
