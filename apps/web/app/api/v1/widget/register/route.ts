import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { apiError } from '@/lib/auth'
import { signWidgetToken } from '@/lib/widget-token'
import { widgetRatelimit } from '@/lib/redis'
import { sendWelcomeCustomer } from '@/lib/email'
import { createLogger } from '@loyaltyflowai/logger'

const logger = createLogger('api:widget:register')

const registerSchema = z.object({
  email: z.string().email().toLowerCase(),
  first_name: z.string().min(1).max(100).optional(),
  public_key: z.string().min(1),
  consent: z.boolean(),
})

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous'
    const { success } = await widgetRatelimit.limit(ip).catch(() => ({ success: true }))
    if (!success)
      return apiError(429, 'RATE_LIMIT', 'Too many requests. Please wait before trying again.')

    const body = await request.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) return apiError(400, 'VALIDATION_ERROR', 'Invalid input')

    const { email, first_name, public_key, consent } = parsed.data

    if (!consent)
      return apiError(400, 'CONSENT_REQUIRED', 'Customer consent is required to register')

    const program = await db.loyaltyProgram.findUnique({
      where: { public_key },
      include: { organization: { select: { name: true } } },
    })

    if (!program || program.status !== 'ACTIVE') {
      return apiError(404, 'PROGRAM_NOT_FOUND', 'No active program found for this key')
    }

    const customer = await db.customer.upsert({
      where: { organization_id_email: { organization_id: program.organization_id, email } },
      update: {
        first_name: first_name ?? undefined,
        consent_at: consent ? new Date() : undefined,
        deleted_at: null,
        anonymized_at: null,
      },
      create: {
        organization_id: program.organization_id,
        email,
        first_name: first_name ?? null,
        consent_at: new Date(),
      },
    })

    const token = await signWidgetToken(customer.id, program.organization_id)

    sendWelcomeCustomer(
      email,
      first_name ?? 'Cher client',
      program.organization.name,
      program.name
    ).catch((err) => logger.error('Failed to send welcome email', { error: String(err) }))

    return NextResponse.json({ token, customer }, { status: 201 })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to register customer')
  }
}
