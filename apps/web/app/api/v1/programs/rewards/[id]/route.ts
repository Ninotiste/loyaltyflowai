import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAuth, apiError, apiSuccess } from '@/lib/auth'

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(300).optional(),
  points_required: z.number().int().min(1).optional(),
  is_active: z.boolean().optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(400, 'VALIDATION_ERROR', 'Invalid input')
    }

    const reward = await db.reward.findFirst({
      where: { id },
      include: { loyalty_program: { select: { organization_id: true } } },
    })

    if (!reward || reward.loyalty_program.organization_id !== auth.orgId) {
      return apiError(404, 'NOT_FOUND', 'Reward not found')
    }

    const updated = await db.reward.update({ where: { id }, data: parsed.data })
    return apiSuccess({ reward: updated })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to update reward')
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params

    const reward = await db.reward.findFirst({
      where: { id },
      include: { loyalty_program: { select: { organization_id: true } } },
    })

    if (!reward || reward.loyalty_program.organization_id !== auth.orgId) {
      return apiError(404, 'NOT_FOUND', 'Reward not found')
    }

    await db.reward.update({ where: { id }, data: { is_active: false } })
    return apiSuccess({ success: true })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to delete reward')
  }
}
