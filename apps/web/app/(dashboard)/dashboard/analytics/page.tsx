'use client'

import { useState, useEffect } from 'react'

interface MetricsData {
  total_customers: number
  new_customers_this_month: number
  high_churn_count: number
  activation_rate_30d: number
  rewards_redeemed_this_month: number
  top_day_of_week: string
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  )
}

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/v1/dashboard/metrics')
      .then((r) => r.json())
      .then(setMetrics)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-brand-600 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    )
  }

  if (!metrics) return <p className="text-gray-500">Impossible de charger les métriques.</p>

  const retentionRate =
    metrics.total_customers > 0
      ? Math.round(
          ((metrics.total_customers - metrics.high_churn_count) / metrics.total_customers) * 100
        )
      : 0

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytiques</h1>
        <p className="mt-1 text-sm text-gray-500">
          Vue d&apos;ensemble de votre programme de fidélité.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total clients"
          value={metrics.total_customers}
          sub={`+${metrics.new_customers_this_month} ce mois`}
        />
        <StatCard
          label="Taux d'activation"
          value={`${metrics.activation_rate_30d}%`}
          sub="Actifs sur 30 jours"
        />
        <StatCard label="Taux de rétention" value={`${retentionRate}%`} sub="Non inactifs" />
        <StatCard
          label="Clients à risque"
          value={metrics.high_churn_count}
          sub="Score churn élevé"
        />
        <StatCard
          label="Récompenses utilisées"
          value={metrics.rewards_redeemed_this_month}
          sub="Ce mois-ci"
        />
        <StatCard label="Meilleur jour" value={metrics.top_day_of_week} sub="Le plus de visites" />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-4 font-semibold text-gray-900">Distribution des clients</h2>
        <div className="space-y-3">
          {[
            {
              label: 'Actifs (< 30 jours)',
              count: Math.max(
                0,
                metrics.total_customers -
                  metrics.high_churn_count -
                  Math.round(metrics.total_customers * 0.2)
              ),
              color: 'bg-green-500',
            },
            {
              label: 'À risque (30-60 jours)',
              count: Math.round(metrics.total_customers * 0.2),
              color: 'bg-amber-400',
            },
            {
              label: 'Inactifs (> 60 jours)',
              count: metrics.high_churn_count,
              color: 'bg-red-400',
            },
          ].map((seg) => {
            const pct =
              metrics.total_customers > 0
                ? Math.round((seg.count / metrics.total_customers) * 100)
                : 0
            return (
              <div key={seg.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-gray-600">{seg.label}</span>
                  <span className="font-medium text-gray-900">
                    {seg.count} ({pct}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full ${seg.color} rounded-full transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl bg-indigo-50 p-6 ring-1 ring-indigo-200">
        <h2 className="mb-2 font-semibold text-indigo-900">Recommandations Loyalty Brain</h2>
        <ul className="space-y-2 text-sm text-indigo-700">
          {metrics.activation_rate_30d < 50 && (
            <li>
              • Taux d&apos;activation faible — envisagez une campagne de rappel pour les clients
              inactifs.
            </li>
          )}
          {metrics.high_churn_count > 0 && (
            <li>
              • {metrics.high_churn_count} client{metrics.high_churn_count > 1 ? 's' : ''} à haut
              risque — lancez une campagne de réactivation depuis la page Alertes.
            </li>
          )}
          {metrics.rewards_redeemed_this_month === 0 && metrics.total_customers > 10 && (
            <li>
              • Aucune récompense utilisée ce mois — réduisez le seuil de points requis pour
              encourager l&apos;engagement.
            </li>
          )}
          {metrics.activation_rate_30d >= 70 && (
            <li>
              • Excellent taux d&apos;activation ! Pensez à ajouter une récompense premium pour les
              clients les plus fidèles.
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
