import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAuth, apiError } from '@/lib/auth'
import { createLogger } from '@loyaltyflowai/logger'
import { generatePublicKey } from '@loyaltyflowai/utils'

const logger = createLogger('api:programs')

const createSchema = z.object({
  name: z.string().min(1).max(100),
  primary_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  welcome_message: z.string().max(300).optional(),
  button_text: z.string().max(50).optional(),
  inactivity_threshold_days: z.number().int().min(7).max(365).optional(),
})

const updateSchema = createSchema.partial()

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)
    const program = await db.loyaltyProgram.findUnique({
      where: { organization_id: auth.orgId },
      include: {
        earning_rules: { where: { is_active: true }, orderBy: { created_at: 'asc' } },
        rewards: { where: { is_active: true }, orderBy: { created_at: 'asc' } },
      },
    })
    if (!program) {
      return NextResponse.json({ program: null })
    }
    return NextResponse.json({ program })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    logger.error('GET /programs/current failed', { error: String(err) })
    return apiError(500, 'INTERNAL_ERROR', 'Failed to fetch program')
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)
    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(400, 'VALIDATION_ERROR', 'Invalid input')
    }

    const existing = await db.loyaltyProgram.findUnique({ where: { organization_id: auth.orgId } })
    if (existing) {
      return apiError(409, 'PROGRAM_EXISTS', 'A program already exists for this organization')
    }

    const program = await db.loyaltyProgram.create({
      data: {
        organization_id: auth.orgId,
        name: parsed.data.name,
        public_key: generatePublicKey(),
        status: 'ACTIVE',
        primary_color: parsed.data.primary_color ?? '#2563EB',
        welcome_message: parsed.data.welcome_message ?? null,
        button_text: parsed.data.button_text ?? 'Mes points 🎁',
        inactivity_threshold_days: parsed.data.inactivity_threshold_days ?? 30,
      },
    })

    return NextResponse.json({ program }, { status: 201 })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    logger.error('POST /programs/current failed', { error: String(err) })
    return apiError(500, 'INTERNAL_ERROR', 'Failed to create program')
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireAuth(request)
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(400, 'VALIDATION_ERROR', 'Invalid input')
    }

    const program = await db.loyaltyProgram.findUnique({ where: { organization_id: auth.orgId } })
    if (!program) {
      return apiError(404, 'NOT_FOUND', 'Program not found')
    }

    const updated = await db.loyaltyProgram.update({
      where: { id: program.id },
      data: parsed.data,
    })

    return NextResponse.json({ program: updated })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to update program')
  }
}
