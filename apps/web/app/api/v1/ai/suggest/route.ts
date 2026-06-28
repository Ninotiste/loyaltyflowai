import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAuth, apiError } from '@/lib/auth'
import { suggestCampaign } from '@/lib/ai'

const suggestSchema = z.object({
  high_churn_count: z.number().int().min(0),
})

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)
    const body = await request.json()
    const parsed = suggestSchema.safeParse(body)
    if (!parsed.success) return apiError(400, 'VALIDATION_ERROR', 'Invalid input')

    const [org, program] = await Promise.all([
      db.organization.findUnique({ where: { id: auth.orgId }, select: { name: true } }),
      db.loyaltyProgram.findUnique({
        where: { organization_id: auth.orgId },
        include: {
          rewards: { where: { is_active: true }, take: 1, orderBy: { points_required: 'asc' } },
        },
      }),
    ])

    const suggestion = await suggestCampaign({
      restaurantName: org?.name ?? 'Le restaurant',
      restaurantType: 'restaurant indépendant',
      atRiskCount: parsed.data.high_churn_count,
      programName: program?.name ?? 'Programme fidélité',
      rewardName: program?.rewards[0]?.name ?? 'une récompense',
      topDayOfWeek: 'vendredi',
    })

    return NextResponse.json({ suggestion })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to generate suggestion')
  }
}
