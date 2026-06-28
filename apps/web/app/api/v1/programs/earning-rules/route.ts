import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAuth, apiError } from '@/lib/auth'
import { createLogger } from '@loyaltyflowai/logger'

const logger = createLogger('api:earning-rules')

const createRuleSchema = z.object({
  type: z.enum(['PER_VISIT', 'PER_AMOUNT_SPENT']),
  points_per_unit: z.number().int().min(1).max(1000),
  unit_description: z.string().max(100).optional(),
  minimum_amount: z.number().int().min(0).optional(),
})

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)
    const body = await request.json()
    const parsed = createRuleSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(400, 'VALIDATION_ERROR', 'Invalid input')
    }

    const program = await db.loyaltyProgram.findUnique({ where: { organization_id: auth.orgId } })
    if (!program) {
      return apiError(404, 'NO_PROGRAM', 'Create a loyalty program first')
    }

    const rule = await db.earningRule.create({
      data: {
        loyalty_program_id: program.id,
        type: parsed.data.type,
        points_per_unit: parsed.data.points_per_unit,
        unit_description: parsed.data.unit_description ?? null,
        minimum_amount: parsed.data.minimum_amount ?? null,
      },
    })

    return NextResponse.json({ rule }, { status: 201 })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    logger.error('POST earning-rule failed', { error: String(err) })
    return apiError(500, 'INTERNAL_ERROR', 'Failed to create rule')
  }
}
