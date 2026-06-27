import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'
import type { DashboardMetrics } from '@loyaltyflowai/types'

export const metadata: Metadata = { title: 'Tableau de bord — LoyaltyFlowAI' }

// Données de démo — seront remplacées par des appels API réels en Phase 1
const mockMetrics: DashboardMetrics = {
  active_customers: 0,
  at_risk_customers: 0,
  points_issued_30d: 0,
  rewards_redeemed_30d: 0,
  return_rate: 0,
  active_customers_change: 0,
  at_risk_customers_change: 0,
  points_issued_change: 0,
}

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  description?: string
}

function MetricCard({ title, value, change, description }: MetricCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {change !== undefined && (
        <p className={`mt-1 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '+' : ''}{change}% vs mois dernier
        </p>
      )}
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const metrics = mockMetrics

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Vue d&apos;ensemble</h1>
        <p className="mt-1 text-sm text-gray-500">
          Performances de votre programme de fidélité sur les 30 derniers jours
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Clients actifs"
          value={metrics.active_customers}
          change={metrics.active_customers_change}
          description="Ayant visité dans les 30 derniers jours"
        />
        <MetricCard
          title="Clients à risque"
          value={metrics.at_risk_customers}
          change={metrics.at_risk_customers_change}
          description="Score de churn élevé"
        />
        <MetricCard
          title="Points émis"
          value={metrics.points_issued_30d.toLocaleString('fr-FR')}
          change={metrics.points_issued_change}
        />
        <MetricCard
          title="Récompenses distribuées"
          value={metrics.rewards_redeemed_30d}
          description="Ce mois-ci"
        />
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Commencer</h2>
        <p className="text-sm text-gray-500">
          Votre programme de fidélité n&apos;est pas encore actif. Configurez vos règles de points
          et activez votre widget pour commencer à fidéliser vos clients.
        </p>
        <div className="mt-4 flex gap-3">
          <Link
            href={'/dashboard/program' as Route}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Configurer mon programme
          </Link>
        </div>
      </div>
    </div>
  )
}
