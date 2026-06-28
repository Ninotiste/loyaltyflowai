import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAuth, apiError, apiSuccess } from '@/lib/auth'

const updateSchema = z.object({
  first_name: z.string().min(1).max(100).optional(),
  last_name: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
})

async function getCustomerOrFail(id: string, orgId: string) {
  const customer = await db.customer.findFirst({
    where: { id, organization_id: orgId, deleted_at: null },
  })
  if (!customer) throw { status: 404, code: 'NOT_FOUND', message: 'Customer not found' }
  return customer
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params

    const customer = await db.customer.findFirst({
      where: { id, organization_id: auth.orgId, deleted_at: null },
      include: {
        point_transactions: {
          orderBy: { created_at: 'desc' },
          take: 50,
        },
        churn_scores: {
          orderBy: { calculated_at: 'desc' },
          take: 1,
        },
      },
    })

    if (!customer) return apiError(404, 'NOT_FOUND', 'Customer not found')

    return NextResponse.json({
      customer: {
        ...customer,
        churn_score: customer.churn_scores[0]?.score ?? null,
        churn_days: customer.churn_scores[0]?.days_since_last_visit ?? null,
        churn_scores: undefined,
      },
    })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to fetch customer')
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) return apiError(400, 'VALIDATION_ERROR', 'Invalid input')

    await getCustomerOrFail(id, auth.orgId)
    const updated = await db.customer.update({ where: { id }, data: parsed.data })
    return apiSuccess({ customer: updated })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to update customer')
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params
    await getCustomerOrFail(id, auth.orgId)
    await db.customer.update({ where: { id }, data: { deleted_at: new Date() } })
    return apiSuccess({ success: true })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to delete customer')
  }
}
