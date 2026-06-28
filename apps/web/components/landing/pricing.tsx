'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Check, Zap, Building2, Rocket } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    icon: Zap,
    monthlyPrice: 49,
    yearlyPrice: 39,
    description: 'Parfait pour démarrer et tester la fidélisation.',
    color: 'from-zinc-600 to-zinc-700',
    features: [
      "Jusqu'à 300 clients",
      'Programme de points basique',
      'Widget web inclus',
      'Alertes churn simples',
      'Support email',
      '1 utilisateur',
    ],
    cta: 'Commencer gratuitement',
    highlighted: false,
  },
  {
    name: 'Growth',
    icon: Rocket,
    monthlyPrice: 149,
    yearlyPrice: 119,
    description: "L'IA qui travaille pour vous 24h/24.",
    color: 'from-violet-600 to-violet-700',
    features: [
      'Clients illimités',
      'Loyalty Brain IA complet',
      'Campagnes automatisées',
      'Analytics avancés',
      'Segmentation IA',
      'Support prioritaire',
      '5 utilisateurs',
      'Export RGPD',
    ],
    cta: "Démarrer l'essai gratuit",
    highlighted: true,
    badge: 'Le plus populaire',
  },
  {
    name: 'Pro',
    icon: Building2,
    monthlyPrice: 299,
    yearlyPrice: 239,
    description: 'Pour les groupes multi-restaurants.',
    color: 'from-amber-500 to-orange-600',
    features: [
      'Tout Growth inclus',
      'Multi-établissements',
      'API complète',
      'White-label widget',
      'Onboarding dédié',
      'SLA 99.9%',
      'Utilisateurs illimités',
      'Facturation centralisée',
    ],
    cta: "Contacter l'équipe",
    highlighted: false,
  },
]

export function Pricing() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [yearly, setYearly] = useState(false)

  return (
    <section id="pricing" className="relative bg-[#05050A] py-32">
      <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-violet-900/12 absolute left-1/2 top-1/3 h-[600px] w-[700px] -translate-x-1/2 rounded-full blur-[130px]" />
      </div>

      <div ref={ref} className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-300"
          >
            Tarifs
          </motion.div>
          <motion.h2
            className="font-display text-4xl font-black tracking-[-0.03em] text-white lg:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            Simple et transparent.
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-amber-300 bg-clip-text text-transparent">
              Aucune surprise.
            </span>
          </motion.h2>
          <motion.p
            className="mx-auto mt-4 max-w-xl text-lg text-white/40"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            14 jours d&apos;essai gratuit sur tous les plans. Aucune carte bancaire requise.
          </motion.p>

          {/* Toggle */}
          <motion.div
            className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-1.5"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={() => setYearly(false)}
              className={`rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
                !yearly ? 'bg-white text-zinc-900' : 'text-white/40 hover:text-white'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
                yearly ? 'bg-white text-zinc-900' : 'text-white/40 hover:text-white'
              }`}
            >
              Annuel
              <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] font-bold text-white">
                -20%
              </span>
            </button>
          </motion.div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((plan, i) => {
            const Icon = plan.icon
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={`relative overflow-hidden rounded-3xl border p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? 'border-violet-500/40 bg-gradient-to-b from-violet-600/10 to-violet-900/5 shadow-[0_0_80px_rgba(124,58,237,0.2)]'
                    : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
                }`}
              >
                {/* Popular badge */}
                {plan.badge && (
                  <div className="absolute right-6 top-6 rounded-full bg-violet-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {plan.badge}
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${plan.color}`}
                >
                  <Icon className="h-5.5 w-5.5 h-[22px] w-[22px] text-white" />
                </div>

                <h3 className="font-display mb-1 text-xl font-bold text-white">{plan.name}</h3>
                <p className="mb-6 text-sm text-white/40">{plan.description}</p>

                {/* Price */}
                <div className="mb-6 flex items-end gap-1">
                  <span className="font-display text-5xl font-black text-white">{price}€</span>
                  <span className="mb-1.5 text-sm text-white/35">/mois</span>
                </div>
                {yearly && (
                  <p className="-mt-4 mb-4 text-xs text-emerald-400">
                    Économisez {(plan.monthlyPrice - plan.yearlyPrice) * 12}€/an
                  </p>
                )}

                {/* CTA */}
                <Link
                  href={plan.name === 'Pro' ? '#contact' : '/register'}
                  className={`mb-8 flex h-11 w-full items-center justify-center rounded-xl text-sm font-bold transition-all ${
                    plan.highlighted
                      ? 'shadow-glow-violet bg-violet-600 text-white hover:bg-violet-500'
                      : 'border border-white/[0.1] bg-white/[0.04] text-white/80 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {plan.cta}
                </Link>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <Check
                        className={`h-4 w-4 flex-shrink-0 ${
                          plan.highlighted ? 'text-violet-400' : 'text-white/30'
                        }`}
                      />
                      <span className="text-sm text-white/55">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Trust line */}
        <motion.p
          className="mt-12 text-center text-sm text-white/25"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Paiement sécurisé · Annulation en 1 clic · Données hébergées en France (OVH Cloud)
        </motion.p>
      </div>
    </section>
  )
}
