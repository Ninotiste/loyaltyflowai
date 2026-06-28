import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth, apiError } from '@/lib/auth'
import { getInvoices } from '@/lib/stripe'

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    const org = await db.organization.findUnique({
      where: { id: auth.orgId },
      select: { stripe_customer_id: true },
    })

    const invoices = await getInvoices(org?.stripe_customer_id ?? null)

    return NextResponse.json({ invoices })
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to fetch invoices')
  }
}
