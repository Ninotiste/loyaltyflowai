import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { apiError } from '@/lib/auth'
import { signWidgetToken } from '@/lib/widget-token'
import { widgetRatelimit } from '@/lib/redis'

const identifySchema = z.object({
  email: z.string().email().toLowerCase(),
  public_key: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous'
    const { success } = await widgetRatelimit.limit(ip).catch(() => ({ success: true }))
    if (!success)
      return apiError(429, 'RATE_LIMIT', 'Too many requests. Please wait before trying again.')

    const body = await request.json()
    const parsed = identifySchema.safeParse(body)
    if (!parsed.success) return apiError(400, 'VALIDATION_ERROR', 'Invalid input')

    const { email, public_key } = parsed.data

    const program = await db.loyaltyProgram.findUnique({
      where: { public_key },
      select: { id: true, organization_id: true, status: true },
    })

    if (!program || program.status !== 'ACTIVE') {
      return apiError(404, 'PROGRAM_NOT_FOUND', 'No active program found for this key')
    }

    const customer = await db.customer.findFirst({
      where: {
        organization_id: program.organization_id,
        email,
        deleted_at: null,
        anonymized_at: null,
      },
      select: { id: true, first_name: true, total_points: true, last_visit_at: true },
    })

    if (!customer) return apiError(404, 'CUSTOMER_NOT_FOUND', 'Customer not registered')

    const token = await signWidgetToken(customer.id, program.organization_id)

    return NextResponse.json({ token, customer })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to identify customer')
  }
}
