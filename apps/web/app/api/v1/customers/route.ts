import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAuth, apiError } from '@/lib/auth'
import { createLogger } from '@loyaltyflowai/logger'
import type { ChurnLevel } from '@loyaltyflowai/types'

const logger = createLogger('api:customers')

const createSchema = z.object({
  email: z.string().email().toLowerCase(),
  first_name: z.string().min(1).max(100).optional(),
  last_name: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  consent: z.boolean().default(false),
})

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') ?? ''
    const churnFilter = searchParams.get('churn') as ChurnLevel | null
    const cursor = searchParams.get('cursor')
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100)

    const where = {
      organization_id: auth.orgId,
      deleted_at: null,
      anonymized_at: null,
      ...(search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' as const } },
              { first_name: { contains: search, mode: 'insensitive' as const } },
              { last_name: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    }

    const [customers, total] = await Promise.all([
      db.customer.findMany({
        where,
        include: {
          churn_scores: {
            orderBy: { calculated_at: 'desc' },
            take: 1,
          },
        },
        orderBy: { last_visit_at: { sort: 'desc', nulls: 'last' } },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      }),
      db.customer.count({ where }),
    ])

    const hasMore = customers.length > limit
    const data = customers.slice(0, limit).map((c) => ({
      ...c,
      churn_score: c.churn_scores[0]?.score ?? null,
      churn_days: c.churn_scores[0]?.days_since_last_visit ?? null,
      churn_scores: undefined,
    }))

    // Apply churn filter after fetching (simple MVP approach)
    const filtered = churnFilter ? data.filter((c) => c.churn_score === churnFilter) : data

    return NextResponse.json({
      data: filtered,
      meta: {
        total,
        limit,
        next_cursor: hasMore ? customers[limit - 1]?.id : null,
      },
    })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    logger.error('GET /customers failed', { error: String(err) })
    return apiError(500, 'INTERNAL_ERROR', 'Failed to fetch customers')
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

    // Upsert — if customer exists, update; otherwise create
    const customer = await db.customer.upsert({
      where: {
        organization_id_email: {
          organization_id: auth.orgId,
          email: parsed.data.email,
        },
      },
      update: {
        first_name: parsed.data.first_name ?? undefined,
        last_name: parsed.data.last_name ?? undefined,
        phone: parsed.data.phone ?? undefined,
        deleted_at: null, // reactivate if soft-deleted
        ...(parsed.data.consent ? { consent_at: new Date() } : {}),
      },
      create: {
        organization_id: auth.orgId,
        email: parsed.data.email,
        first_name: parsed.data.first_name ?? null,
        last_name: parsed.data.last_name ?? null,
        phone: parsed.data.phone ?? null,
        consent_at: parsed.data.consent ? new Date() : null,
      },
    })

    return NextResponse.json({ customer }, { status: 201 })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    logger.error('POST /customers failed', { error: String(err) })
    return apiError(500, 'INTERNAL_ERROR', 'Failed to create customer')
  }
}
