import { db } from '@/lib/db'
import { requireAuth, apiError, apiSuccess } from '@/lib/auth'

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params

    const rule = await db.earningRule.findFirst({
      where: { id },
      include: { loyalty_program: { select: { organization_id: true } } },
    })

    if (!rule || rule.loyalty_program.organization_id !== auth.orgId) {
      return apiError(404, 'NOT_FOUND', 'Earning rule not found')
    }

    await db.earningRule.update({ where: { id }, data: { is_active: false } })
    return apiSuccess({ success: true })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to delete rule')
  }
}
