import { NextResponse } from 'next/server'
import type { PointTransaction, ChurnScore } from '@prisma/client'
import { db } from '@/lib/db'
import { requireAuth, apiError } from '@/lib/auth'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params

    const customer = await db.customer.findFirst({
      where: { id, organization_id: auth.orgId, deleted_at: null },
      include: {
        point_transactions: { orderBy: { created_at: 'asc' } },
        churn_scores: { orderBy: { calculated_at: 'desc' } },
      },
    })

    if (!customer) return apiError(404, 'NOT_FOUND', 'Customer not found')

    const exportData = {
      export_date: new Date().toISOString(),
      export_type: 'RGPD_ART15_PORTABILITY',
      subject: {
        id: customer.id,
        email: customer.anonymized_at ? '[ANONYMISÉ]' : customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
        created_at: customer.created_at,
        consent_at: customer.consent_at,
        last_visit_at: customer.last_visit_at,
        total_points: customer.total_points,
        anonymized_at: customer.anonymized_at,
      },
      transactions: customer.point_transactions.map((t: PointTransaction) => ({
        date: t.created_at,
        type: t.type,
        amount: t.amount,
        reason: t.reason,
      })),
      churn_analysis: customer.churn_scores.map((s: ChurnScore) => ({
        date: s.calculated_at,
        score: s.score,
        days_since_last_visit: s.days_since_last_visit,
      })),
      retention: {
        days: 365,
        legal_basis: 'Intérêt légitime — gestion du programme de fidélité (RGPD art.6.1.f)',
      },
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="export-${customer.id}-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to export customer data')
  }
}
