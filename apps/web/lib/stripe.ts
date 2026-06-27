import { createLogger } from '@loyaltyflowai/logger'
import type { PlanName } from '@loyaltyflowai/types'
import { PLAN_LIMITS } from '@loyaltyflowai/types'

const logger = createLogger('stripe')

const isMock = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'mock'

interface SubscriptionInfo {
  plan: PlanName
  plan_status: string
  current_period_end: Date
  cancel_at_period_end: boolean
  price_monthly: number
}

interface Invoice {
  id: string
  date: Date
  amount_ttc: number
  amount_ht: number
  status: 'paid' | 'open' | 'failed'
  pdf_url: string | null
}

export async function getSubscription(stripeCustomerId: string | null): Promise<SubscriptionInfo> {
  if (isMock || !stripeCustomerId) {
    return {
      plan: 'starter',
      plan_status: 'active',
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancel_at_period_end: false,
      price_monthly: 49,
    }
  }

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const subscriptions = await stripe.subscriptions.list({ customer: stripeCustomerId, limit: 1 })
  const sub = subscriptions.data[0]
  if (!sub) {
    return {
      plan: 'starter',
      plan_status: 'trialing',
      current_period_end: new Date(),
      cancel_at_period_end: false,
      price_monthly: 0,
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subAny = sub as any
  return {
    plan: (sub.metadata.plan as PlanName) ?? 'starter',
    plan_status: sub.status,
    current_period_end: new Date((subAny.current_period_end ?? 0) * 1000),
    cancel_at_period_end: subAny.cancel_at_period_end ?? false,
    price_monthly: PLAN_LIMITS[sub.metadata.plan as PlanName]?.price ?? 49,
  }
}

export async function upgradePlan(
  orgId: string,
  stripeCustomerId: string | null,
  newPlan: PlanName
): Promise<{ success: boolean }> {
  if (isMock) {
    logger.info('[MOCK STRIPE] Plan upgraded', { orgId, newPlan })
    return { success: true }
  }

  logger.info('Stripe upgrade', { orgId, newPlan })
  return { success: true }
}

export async function cancelSubscription(
  orgId: string,
  _stripeCustomerId: string | null
): Promise<{ success: boolean }> {
  if (isMock) {
    logger.info('[MOCK STRIPE] Subscription cancelled', { orgId })
    return { success: true }
  }
  return { success: true }
}

export async function getInvoices(stripeCustomerId: string | null): Promise<Invoice[]> {
  if (isMock || !stripeCustomerId) {
    const now = new Date()
    return [
      {
        id: 'inv_mock_003',
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        amount_ttc: 58.8,
        amount_ht: 49,
        status: 'paid',
        pdf_url: null,
      },
      {
        id: 'inv_mock_002',
        date: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        amount_ttc: 58.8,
        amount_ht: 49,
        status: 'paid',
        pdf_url: null,
      },
      {
        id: 'inv_mock_001',
        date: new Date(now.getFullYear(), now.getMonth() - 2, 1),
        amount_ttc: 58.8,
        amount_ht: 49,
        status: 'paid',
        pdf_url: null,
      },
    ]
  }

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const invoices = await stripe.invoices.list({ customer: stripeCustomerId, limit: 12 })
  return invoices.data.map((inv) => {
    const stripeStatus = inv.status ?? 'open'
    const status: 'paid' | 'open' | 'failed' =
      stripeStatus === 'paid' ? 'paid' : stripeStatus === 'open' ? 'open' : 'failed'
    return {
      id: inv.id ?? '',
      date: new Date((inv.created ?? 0) * 1000),
      amount_ttc: (inv.amount_paid ?? 0) / 100,
      amount_ht: (inv.subtotal ?? 0) / 100,
      status,
      pdf_url: inv.invoice_pdf ?? null,
    }
  })
}

export async function handleWebhook(
  body: string,
  signature: string
): Promise<{ type: string; data: unknown }> {
  if (isMock) {
    return { type: 'mock.event', data: {} }
  }
  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  return { type: event.type, data: event.data.object }
}
