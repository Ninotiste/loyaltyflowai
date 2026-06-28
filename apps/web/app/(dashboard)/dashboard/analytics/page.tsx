'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, Gift, Calendar, Zap, ArrowUpRight } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'

interface MetricsData {
  total_customers: number
  new_customers_this_month: number
  high_churn_count: number
  activation_rate_30d: number
  rewards_redeemed_this_month: number
  top_day_of_week: string
}

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
  highlight?: boolean
}

function StatCard({ label, value, sub, icon: Icon, iconColor, iconBg, highlight }: StatCardProps) {
  return (
    <div
      className={`panel flex items-center gap-4 p-5 ${highlight ? 'ring-2 ring-violet-500/20' : ''}`}
    >
      <div
        className={`h-12 w-12 rounded-xl ${iconBg} flex flex-shrink-0 items-center justify-center`}
      >
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-zinc-500">{label}</p>
        <p className="font-display tabular text-2xl font-bold text-zinc-900">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-zinc-400">{sub}</p>}
      </div>
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
        <Spinner size="lg" />
      </div>
    )
  }

  if (!metrics) {
    return <p className="text-zinc-500">Impossible de charger les métriques.</p>
  }

  const retentionRate =
    metrics.total_customers > 0
      ? Math.round(
          ((metrics.total_customers - metrics.high_churn_count) / metrics.total_customers) * 100
        )
      : 0

  const activeCount = Math.max(
    0,
    metrics.total_customers - metrics.high_churn_count - Math.round(metrics.total_customers * 0.2)
  )
  const mediumCount = Math.round(metrics.total_customers * 0.2)

  const segments = [
    {
      label: 'Actifs (< 30 jours)',
      count: activeCount,
      color: 'green' as const,
      variant: 'churn-low' as const,
    },
    {
      label: 'À risque (30-60 jours)',
      count: mediumCount,
      color: 'amber' as const,
      variant: 'churn-medium' as const,
    },
    {
      label: 'Inactifs (> 60 jours)',
      count: metrics.high_churn_count,
      color: 'red' as const,
      variant: 'churn-high' as const,
    },
  ]

  const recommendations: string[] = []
  if (metrics.activation_rate_30d < 50) {
    recommendations.push(
      "Taux d'activation faible — envisagez une campagne de rappel pour les clients inactifs."
    )
  }
  if (metrics.high_churn_count > 0) {
    recommendations.push(
      `${metrics.high_churn_count} client${metrics.high_churn_count > 1 ? 's' : ''} à haut risque — lancez une campagne de réactivation depuis la page Alertes.`
    )
  }
  if (metrics.rewards_redeemed_this_month === 0 && metrics.total_customers > 10) {
    recommendations.push(
      "Aucune récompense utilisée ce mois — réduisez le seuil de points pour encourager l'engagement."
    )
  }
  if (metrics.activation_rate_30d >= 70) {
    recommendations.push(
      "Excellent taux d'activation ! Pensez à ajouter une récompense premium pour les clients les plus fidèles."
    )
  }

  return (
    <div>
      <PageHeader title="Analytiques" description="Vue d'ensemble de votre programme de fidélité" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-3">
        <StatCard
          label="Total clients"
          value={metrics.total_customers}
          sub={`+${metrics.new_customers_this_month} ce mois`}
          icon={Users}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
          highlight
        />
        <StatCard
          label="Taux d'activation"
          value={`${metrics.activation_rate_30d}%`}
          sub="Actifs sur 30 jours"
          icon={TrendingUp}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          label="Taux de rétention"
          value={`${retentionRate}%`}
          sub="Clients non inactifs"
          icon={ArrowUpRight}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <StatCard
          label="Clients à risque"
          value={metrics.high_churn_count}
          sub="Score churn élevé"
          icon={Users}
          iconColor={metrics.high_churn_count > 0 ? 'text-red-500' : 'text-green-500'}
          iconBg={metrics.high_churn_count > 0 ? 'bg-red-50' : 'bg-green-50'}
        />
        <StatCard
          label="Récompenses utilisées"
          value={metrics.rewards_redeemed_this_month}
          sub="Ce mois-ci"
          icon={Gift}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
        />
        <StatCard
          label="Meilleur jour"
          value={metrics.top_day_of_week}
          sub="Le plus de visites"
          icon={Calendar}
          iconColor="text-zinc-600"
          iconBg="bg-zinc-100"
        />
      </div>

      {/* Segments distribution */}
      <div className="panel mt-6 p-6">
        <h2 className="font-display mb-5 text-base font-bold text-zinc-900">
          Distribution des clients
        </h2>
        <div className="space-y-5">
          {segments.map((seg) => {
            const pct =
              metrics.total_customers > 0
                ? Math.round((seg.count / metrics.total_customers) * 100)
                : 0
            return (
              <div key={seg.label} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={seg.variant} size="sm" dot>
                      {seg.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="tabular text-sm font-semibold text-zinc-900">{seg.count}</span>
                    <span className="text-xs text-zinc-400">({pct}%)</span>
                  </div>
                </div>
                <Progress value={pct} color={seg.color} size="md" />
              </div>
            )
          })}
        </div>
      </div>

      {/* Loyalty Brain recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-5 rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-violet-50/20 p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100">
              <Zap className="h-4 w-4 text-violet-600" />
            </div>
            <h2 className="font-display text-sm font-bold text-violet-900">
              Recommandations Loyalty Brain
            </h2>
            <Badge variant="primary" size="sm">
              IA
            </Badge>
          </div>
          <ul className="space-y-2.5">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-violet-700">
                <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-violet-200 text-[10px] font-bold text-violet-600">
                  {i + 1}
                </span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
