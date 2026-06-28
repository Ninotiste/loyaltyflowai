'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Brain, TrendingDown, MessageSquare, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: Brain,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    label: 'Analyse',
    desc: "L'IA analyse la fréquence de visite, les achats, et les habitudes de chaque client",
  },
  {
    icon: TrendingDown,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    label: 'Détection',
    desc: 'Score de churn calculé en temps réel. Alerte 7 jours avant le départ prédit',
  },
  {
    icon: MessageSquare,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    label: 'Action',
    desc: 'Message personnalisé envoyé automatiquement avec offre adaptée au profil',
  },
]

const capabilities = [
  'Prédiction de churn avec 87% de précision',
  'Segmentation automatique des clients',
  'Suggestions de campagnes personnalisées',
  'Optimisation automatique des récompenses',
  'Analyse des pics de fréquentation',
  "Recommandations d'horaires promotions",
]

export function LoyaltyBrain() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative bg-[#05050A] py-32">
      <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-violet-800/12 absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full blur-[120px]" />
        <div className="bg-amber-700/8 absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full blur-[100px]" />
      </div>

      <div ref={ref} className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Left — Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="order-2 lg:order-1"
          >
            {/* Brain orb */}
            <div className="relative flex items-center justify-center">
              {/* Outer rings */}
              <div className="absolute h-[360px] w-[360px] animate-[spin_20s_linear_infinite] rounded-full border border-violet-500/[0.08]" />
              <div className="absolute h-[280px] w-[280px] animate-[spin_14s_linear_infinite_reverse] rounded-full border border-violet-400/[0.12]" />
              <div className="absolute h-[200px] w-[200px] animate-[spin_9s_linear_infinite] rounded-full border border-violet-300/[0.1]" />

              {/* Center orb */}
              <div className="relative flex h-36 w-36 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-violet-600/20 blur-xl" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-violet-800 shadow-[0_0_60px_rgba(124,58,237,0.5)]">
                  <Brain className="h-10 w-10 text-white" strokeWidth={1.5} />
                </div>
              </div>

              {/* Satellite cards */}
              {[
                { label: 'Churn prédit', value: '-42%', color: 'emerald', angle: -60 },
                { label: 'Réactivation', value: '34%', color: 'amber', angle: 60 },
                { label: 'Précision IA', value: '87%', color: 'violet', angle: 180 },
              ].map((sat) => {
                const rad = (sat.angle * Math.PI) / 180
                const r = 160
                const x = Math.cos(rad) * r
                const y = Math.sin(rad) * r
                return (
                  <div
                    key={sat.label}
                    className="absolute flex flex-col items-center gap-1 rounded-2xl border border-white/[0.08] bg-zinc-950/80 px-3 py-2.5 text-center backdrop-blur-xl"
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                  >
                    <span className={`font-display text-lg font-black text-${sat.color}-400`}>
                      {sat.value}
                    </span>
                    <span className="text-[9px] text-white/40">{sat.label}</span>
                  </div>
                )
              })}
            </div>

            {/* Steps */}
            <div className="mt-12 space-y-4">
              {steps.map((step, i) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.label}
                    className="flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
                    initial={{ opacity: 0, x: -24 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  >
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${step.bg}`}
                    >
                      <Icon className={`h-5 w-5 ${step.color}`} />
                    </div>
                    <div>
                      <p className="mb-0.5 text-sm font-bold text-white">{step.label}</p>
                      <p className="text-xs leading-relaxed text-white/40">{step.desc}</p>
                    </div>
                    <div className="ml-auto flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-[10px] font-bold text-white/30">
                      {i + 1}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Right — Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="order-1 lg:order-2"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-300">
              <Sparkles className="h-3 w-3 text-amber-400" />
              Intelligence Artificielle
            </div>
            <h2 className="font-display text-4xl font-black leading-tight tracking-[-0.03em] text-white lg:text-5xl">
              Votre Loyalty Brain.
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-amber-300 bg-clip-text text-transparent">
                Il pense à votre place.
              </span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/45">
              Notre IA analyse en continu le comportement de chaque client et prend les actions
              correctives avant que vous n&apos;ayez même besoin de vous connecter.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {capabilities.map((cap, i) => (
                <motion.div
                  key={cap}
                  className="flex items-center gap-2.5"
                  initial={{ opacity: 0, x: 16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
                >
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-violet-400" />
                  <span className="text-sm text-white/55">{cap}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="/register"
                className="shadow-glow-violet group inline-flex h-12 items-center gap-2 rounded-2xl bg-violet-600 px-7 text-sm font-bold text-white transition-all hover:bg-violet-500"
              >
                Activer le Loyalty Brain
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Quote */}
            <div className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <p className="mb-3 text-sm italic leading-relaxed text-white/50">
                &quot;En 3 mois, notre taux de clients réguliers est passé de 22% à 61%. Le Loyalty
                Brain a identifié exactement quand envoyer nos offres.&quot;
              </p>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600/30 text-xs font-bold text-violet-300">
                  SB
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/70">Sophie B.</p>
                  <p className="text-[10px] text-white/35">Le Petit Bistrot, Lyon</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
