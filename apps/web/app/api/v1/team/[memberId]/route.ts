import { db } from '@/lib/db'
import { requireAuth, requireRole, apiError, apiSuccess } from '@/lib/auth'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const auth = await requireAuth(request)
    requireRole(auth, ['ADMIN'])
    const { memberId } = await params

    const member = await db.teamMember.findFirst({
      where: { id: memberId, organization_id: auth.orgId },
    })

    if (!member) return apiError(404, 'NOT_FOUND', 'Team member not found')
    if (member.user_id === auth.userId)
      return apiError(400, 'SELF_DELETE', 'You cannot remove yourself')
    if (member.role === 'ADMIN') return apiError(403, 'FORBIDDEN', 'Cannot remove an ADMIN member')

    await db.teamMember.delete({ where: { id: memberId } })

    return apiSuccess({ success: true })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to remove team member')
  }
}
