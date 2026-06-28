import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'

export const metadata: Metadata = { title: 'Tableau de bord — LoyaltyFlowAI' }
export const dynamic = 'force-dynamic'

interface DashboardApiMetrics {
  total_customers: number
  new_customers_this_month: number
  high_churn_count: number
  activation_rate_30d: number
  rewards_redeemed_this_month: number
  top_day_of_week: string
}

async function fetchMetrics(): Promise<DashboardApiMetrics | null> {
  try {
    const cookieStore = await cookies()
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/v1/dashboard/metrics`,
      {
        headers: { Cookie: cookieStore.toString() },
        next: { revalidate: 60 },
      }
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  trend?: 'up' | 'down' | 'neutral'
}

function MetricCard({ title, value, description, trend }: MetricCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {description && (
        <p
          className={`mt-1 text-sm ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}
        >
          {description}
        </p>
      )}
    </div>
  )
}

export default async function DashboardPage() {
  const metrics = await fetchMetrics()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Vue d&apos;ensemble</h1>
        <p className="mt-1 text-sm text-gray-500">Performances de votre programme de fidélité</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total clients"
          value={metrics?.total_customers ?? 0}
          description={`+${metrics?.new_customers_this_month ?? 0} ce mois`}
          trend="up"
        />
        <MetricCard
          title="Clients à risque"
          value={metrics?.high_churn_count ?? 0}
          description="Score churn élevé"
          trend={metrics && metrics.high_churn_count > 0 ? 'down' : 'neutral'}
        />
        <MetricCard
          title="Taux d'activation"
          value={`${metrics?.activation_rate_30d ?? 0}%`}
          description="Actifs sur 30 jours"
        />
        <MetricCard
          title="Récompenses"
          value={metrics?.rewards_redeemed_this_month ?? 0}
          description="Utilisées ce mois-ci"
        />
      </div>

      {metrics && metrics.total_customers === 0 && (
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Commencer</h2>
          <p className="text-sm text-gray-500">
            Votre programme de fidélité n&apos;est pas encore actif. Configurez vos règles de points
            et activez votre widget pour commencer à fidéliser vos clients.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href={'/program' as Route}
              className="bg-brand-600 hover:bg-brand-700 rounded-lg px-4 py-2 text-sm font-medium text-white"
            >
              Configurer mon programme
            </Link>
          </div>
        </div>
      )}

      {metrics && metrics.high_churn_count > 0 && (
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="mb-2 text-lg font-semibold text-amber-900">
            Attention — {metrics.high_churn_count} client{metrics.high_churn_count > 1 ? 's' : ''} à
            risque
          </h2>
          <p className="text-sm text-amber-700">
            Jour le plus fréquenté : <strong>{metrics.top_day_of_week}</strong>. Lancez une campagne
            de réactivation avant qu&apos;il soit trop tard.
          </p>
          <Link
            href={'/alerts' as Route}
            className="mt-4 inline-block rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            Voir les alertes
          </Link>
        </div>
      )}
    </div>
  )
}
