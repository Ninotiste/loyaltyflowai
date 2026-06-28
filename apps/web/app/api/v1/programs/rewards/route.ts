import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAuth, apiError } from '@/lib/auth'

const createSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(300).optional(),
  points_required: z.number().int().min(1),
})

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)
    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(400, 'VALIDATION_ERROR', 'Invalid input')
    }

    const program = await db.loyaltyProgram.findUnique({ where: { organization_id: auth.orgId } })
    if (!program) {
      return apiError(404, 'NO_PROGRAM', 'Create a loyalty program first')
    }

    const reward = await db.reward.create({
      data: {
        loyalty_program_id: program.id,
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        points_required: parsed.data.points_required,
      },
    })

    return NextResponse.json({ reward }, { status: 201 })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to create reward')
  }
}
