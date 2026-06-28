'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { TrendingUp, Users, Gift, AlertCircle, LayoutDashboard, Zap, Star } from 'lucide-react'

const mockCustomers = [
  { name: 'Sophie Martin', points: 2840, churn: 'low', visits: 18, avatar: 'SM' },
  { name: 'Marc Dubois', points: 1220, churn: 'medium', visits: 7, avatar: 'MD' },
  { name: 'Julie Petit', points: 480, churn: 'high', visits: 2, avatar: 'JP' },
  { name: 'Antoine Roux', points: 3550, churn: 'low', visits: 26, avatar: 'AR' },
]

const churnColors: Record<string, string> = {
  low: 'bg-emerald-400/15 text-emerald-400',
  medium: 'bg-amber-400/15 text-amber-400',
  high: 'bg-red-400/15 text-red-400',
}

const churnLabels: Record<string, string> = {
  low: 'Fidèle',
  medium: 'À risque',
  high: 'Critique',
}

function MiniChart({ values }: { values: number[] }) {
  const max = Math.max(...values)
  const w = 200
  const h = 60
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w
      const y = h - (v / max) * h * 0.85 - 4
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={pts}
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill="url(#chartGrad)" />
    </svg>
  )
}

export function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="dashboard" className="relative overflow-hidden bg-[#05050A] py-32">
      <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-800/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div ref={ref} className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-300"
          >
            <LayoutDashboard className="h-3 w-3" />
            Dashboard
          </motion.div>
          <motion.h2
            className="font-display text-4xl font-black tracking-[-0.03em] text-white lg:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            Tout votre business,
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-amber-300 bg-clip-text text-transparent">
              en un regard.
            </span>
          </motion.h2>
        </div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-zinc-950/60 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.8)] backdrop-blur-sm"
        >
          {/* Browser bar */}
          <div className="flex h-11 items-center gap-2.5 border-b border-white/[0.06] bg-white/[0.02] px-5">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-amber-500/70" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
            </div>
            <div className="mx-auto flex h-6 w-64 items-center justify-center rounded-md bg-white/[0.04] px-3 text-[11px] text-white/25">
              app.loyaltyflow.ai/dashboard
            </div>
          </div>

          <div className="flex">
            {/* Sidebar mini */}
            <div className="hidden w-52 flex-shrink-0 border-r border-white/[0.05] bg-white/[0.015] p-4 lg:block">
              <div className="mb-4 flex items-center gap-2 px-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-violet-600">
                  <Zap className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-xs font-bold text-white">
                  LoyaltyFlow<span className="text-amber-400">AI</span>
                </span>
              </div>
              {[
                { icon: LayoutDashboard, label: 'Tableau de bord', active: true },
                { icon: Users, label: 'Clients', active: false },
                { icon: Gift, label: 'Programme', active: false },
                { icon: AlertCircle, label: 'Alertes', active: false },
                { icon: TrendingUp, label: 'Analytics', active: false },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.label}
                    className={`mb-1 flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs ${
                      item.active
                        ? 'bg-violet-600/20 font-semibold text-violet-300'
                        : 'text-white/35'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                    {item.label}
                  </div>
                )
              })}
              {/* Plan badge */}
              <div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/10 p-3">
                <div className="mb-1 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-semibold text-emerald-400">Essai gratuit</span>
                </div>
                <p className="text-[10px] text-white/30">12 jours restants</p>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-hidden p-6">
              {/* KPI row */}
              <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  {
                    icon: Users,
                    label: 'Clients totaux',
                    value: '1 248',
                    change: '+12',
                    positive: true,
                  },
                  {
                    icon: TrendingUp,
                    label: 'Actifs ce mois',
                    value: '842',
                    change: '+8%',
                    positive: true,
                  },
                  {
                    icon: AlertCircle,
                    label: 'En risque',
                    value: '73',
                    change: '-5',
                    positive: true,
                  },
                  { icon: Gift, label: 'Récompenses', value: '234', change: '+19', positive: true },
                ].map((kpi) => {
                  const Icon = kpi.icon
                  return (
                    <div
                      key={kpi.label}
                      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <Icon className="h-4 w-4 text-white/30" />
                        <span
                          className={`text-[10px] font-semibold ${kpi.positive ? 'text-emerald-400' : 'text-red-400'}`}
                        >
                          {kpi.change}
                        </span>
                      </div>
                      <p className="font-display text-xl font-black text-white">{kpi.value}</p>
                      <p className="text-[10px] text-white/35">{kpi.label}</p>
                    </div>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Chart */}
                <div className="col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white/80">Nouveaux clients</p>
                    <span className="rounded-full bg-violet-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-violet-300">
                      12 semaines
                    </span>
                  </div>
                  <div className="h-20">
                    <MiniChart values={[22, 28, 19, 35, 42, 38, 45, 52, 48, 61, 58, 72]} />
                  </div>
                </div>

                {/* AI Alert */}
                <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/15 to-violet-800/5 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-violet-500/20">
                      <Zap className="h-3.5 w-3.5 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Loyalty Brain</p>
                      <p className="text-[9px] text-violet-400">IA · Actif</p>
                    </div>
                  </div>
                  <p className="mb-3 text-[11px] leading-relaxed text-white/50">
                    <strong className="text-amber-300">3 clients</strong> à fort potentiel
                    n&apos;ont pas commandé depuis 28 jours. Une offre personnalisée pourrait les
                    réactiver.
                  </p>
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 animate-ping rounded-full bg-amber-400" />
                    <span className="text-[10px] text-amber-400/70">Campagne recommandée</span>
                  </div>
                </div>
              </div>

              {/* Customers table */}
              <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
                <p className="mb-3 text-sm font-semibold text-white/80">Clients récents</p>
                <div className="space-y-2.5">
                  {mockCustomers.map((c) => (
                    <div key={c.name} className="flex items-center gap-3">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-violet-600/20 text-[10px] font-bold text-violet-300">
                        {c.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-white/80">{c.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="hidden text-[10px] text-white/30 sm:inline">
                          {c.points.toLocaleString('fr-FR')} pts
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${churnColors[c.churn]}`}
                        >
                          {churnLabels[c.churn]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom proof */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-white/30"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {[
            'Mise à jour en temps réel',
            'Aucun développeur requis',
            'Setup en 5 minutes',
            'Support 7j/7',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Star className="h-3 w-3 fill-amber-400/50 text-amber-400/50" />
              <span>{item}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
