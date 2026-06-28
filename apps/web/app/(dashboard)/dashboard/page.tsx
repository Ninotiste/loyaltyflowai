import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { Users, AlertTriangle, TrendingUp, Gift, Calendar, ArrowUpRight, Zap } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
  trend?: 'up' | 'down' | 'neutral'
  trendLabel?: string
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
  trendLabel,
}: StatCardProps) {
  return (
    <div className="panel hover:shadow-card-hover duration-250 flex flex-col gap-4 p-6 transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-500">{title}</p>
        <div className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
      <div>
        <p className="font-display tabular text-3xl font-bold text-zinc-900">{value}</p>
        {description && (
          <div className="mt-1 flex items-center gap-1.5">
            {trend === 'up' && (
              <span className="stat-card-delta-up">
                <ArrowUpRight className="h-3 w-3" />
                {trendLabel ?? description}
              </span>
            )}
            {trend === 'down' && (
              <span className="stat-card-delta-down">{trendLabel ?? description}</span>
            )}
            {(trend === 'neutral' || !trend) && (
              <span className="text-xs text-zinc-400">{description}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const metrics = await fetchMetrics()
  const isEmpty = !metrics || metrics.total_customers === 0

  return (
    <div>
      <PageHeader
        title="Vue d'ensemble"
        description="Performances de votre programme de fidélité"
        actions={
          metrics?.high_churn_count && metrics.high_churn_count > 0 ? (
            <Link href={'/dashboard/alerts' as Route}>
              <Button variant="amber" size="sm" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                {metrics.high_churn_count} alerte{metrics.high_churn_count > 1 ? 's' : ''}
              </Button>
            </Link>
          ) : undefined
        }
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total clients"
          value={metrics?.total_customers ?? 0}
          description={`+${metrics?.new_customers_this_month ?? 0} ce mois`}
          icon={Users}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
          trend="up"
          trendLabel={`+${metrics?.new_customers_this_month ?? 0} ce mois`}
        />
        <StatCard
          title="Clients à risque"
          value={metrics?.high_churn_count ?? 0}
          description="Score churn élevé"
          icon={AlertTriangle}
          iconColor={(metrics?.high_churn_count ?? 0) > 0 ? 'text-red-500' : 'text-green-500'}
          iconBg={(metrics?.high_churn_count ?? 0) > 0 ? 'bg-red-50' : 'bg-green-50'}
          trend={(metrics?.high_churn_count ?? 0) > 0 ? 'down' : 'neutral'}
          trendLabel="Score churn élevé"
        />
        <StatCard
          title="Taux d'activation"
          value={`${metrics?.activation_rate_30d ?? 0}%`}
          description="Actifs sur 30 jours"
          icon={TrendingUp}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          trend="neutral"
        />
        <StatCard
          title="Récompenses"
          value={metrics?.rewards_redeemed_this_month ?? 0}
          description="Utilisées ce mois"
          icon={Gift}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
          trend="neutral"
        />
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="panel mt-8 overflow-hidden">
          <div className="flex flex-col items-center p-8 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50">
              <Zap className="h-8 w-8 text-violet-600" />
            </div>
            <h2 className="font-display mb-2 text-xl font-bold text-zinc-900">
              Lancez votre programme
            </h2>
            <p className="mb-6 max-w-md text-sm text-zinc-500">
              Configurez vos règles de points et activez votre widget pour commencer à fidéliser vos
              clients. Moins de 10 minutes pour tout mettre en place.
            </p>
            <div className="flex items-center gap-3">
              <Link href={'/dashboard/program' as Route}>
                <Button size="md">Configurer mon programme</Button>
              </Link>
              <Link href={'/dashboard/settings' as Route}>
                <Button variant="outline" size="md">
                  Installer le widget
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Churn alert banner */}
      {metrics && metrics.high_churn_count > 0 && (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-50/50 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-amber-900">
                  {metrics.high_churn_count} client{metrics.high_churn_count > 1 ? 's' : ''} à
                  risque de partir
                </h2>
                <p className="mt-0.5 text-sm text-amber-700">
                  Meilleur jour pour communiquer :{' '}
                  <strong className="capitalize">{metrics.top_day_of_week}</strong>. Lancez une
                  campagne de réactivation maintenant.
                </p>
              </div>
            </div>
            <Link href={'/dashboard/alerts' as Route} className="flex-shrink-0">
              <Button variant="amber" size="sm" className="gap-1.5">
                Voir les alertes
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Top day insight */}
      {metrics && metrics.top_day_of_week && metrics.total_customers > 0 && (
        <div className="panel mt-5 flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-violet-50">
            <Calendar className="h-6 w-6 text-violet-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-zinc-900">
              Meilleur jour :{' '}
              <span className="capitalize text-violet-600">{metrics.top_day_of_week}</span>
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">
              Programmez vos campagnes sur ce jour pour maximiser l&apos;impact.
            </p>
          </div>
          <Badge variant="primary" size="md">
            Loyalty Brain
          </Badge>
        </div>
      )}
    </div>
  )
}
