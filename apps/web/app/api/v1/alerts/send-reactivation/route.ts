import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAuth, requireRole, apiError, apiSuccess } from '@/lib/auth'
import { sendReactivationEmail } from '@/lib/email'
import { generateReactivationMessage } from '@/lib/ai'
import { createLogger } from '@loyaltyflowai/logger'
import { getDaysSinceLastVisit } from '@loyaltyflowai/utils'

const logger = createLogger('api:alerts')

const sendSchema = z.object({
  customer_id: z.string().uuid(),
})

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)
    requireRole(auth, ['ADMIN', 'MANAGER'])

    const body = await request.json()
    const parsed = sendSchema.safeParse(body)
    if (!parsed.success) return apiError(400, 'VALIDATION_ERROR', 'Invalid input')

    const customer = await db.customer.findFirst({
      where: {
        id: parsed.data.customer_id,
        organization_id: auth.orgId,
        deleted_at: null,
        anonymized_at: null,
      },
      select: { id: true, email: true, first_name: true },
    })

    if (!customer) return apiError(404, 'NOT_FOUND', 'Customer not found')

    const org = await db.organization.findUnique({
      where: { id: auth.orgId },
      select: { name: true },
    })

    const lastVisit = await db.customer.findUnique({
      where: { id: customer.id },
      select: { last_visit_at: true },
    })

    const rawDays = lastVisit?.last_visit_at ? getDaysSinceLastVisit(lastVisit.last_visit_at) : 60
    const days = isFinite(rawDays) ? rawDays : 60

    const message = await generateReactivationMessage(
      customer.first_name ?? 'Cher client',
      org?.name ?? 'le restaurant',
      days
    )

    sendReactivationEmail(
      customer.email,
      customer.first_name ?? 'Cher client',
      org?.name ?? 'Le restaurant',
      message
    ).catch((err) => logger.error('Failed to send reactivation email', { error: String(err) }))

    return apiSuccess({ sent: true })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to send reactivation email')
  }
}
