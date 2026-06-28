'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Brain, BarChart3, Gift, Bell, Zap, Shield, Globe, Smartphone } from 'lucide-react'

const features = [
  {
    icon: Brain,
    color: 'from-violet-600 to-violet-500',
    glow: 'rgba(124,58,237,0.3)',
    title: 'Loyalty Brain IA',
    description:
      "Notre IA analyse le comportement de chaque client et prédit son départ 7 jours avant qu'il ne parte. Score de churn en temps réel.",
    tag: 'Exclusif',
  },
  {
    icon: Bell,
    color: 'from-amber-500 to-orange-500',
    glow: 'rgba(245,158,11,0.3)',
    title: 'Alertes proactives',
    description:
      'Notifications automatiques quand un client fidèle est sur le point de vous quitter. Intervenez au bon moment.',
    tag: 'Automatique',
  },
  {
    icon: Gift,
    color: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.3)',
    title: 'Programme sur-mesure',
    description:
      "Créez votre programme en 5 minutes. Points, tampons, récompenses. Règles d'attribution personnalisables par type de plat.",
    tag: 'Flexible',
  },
  {
    icon: BarChart3,
    color: 'from-blue-500 to-indigo-500',
    glow: 'rgba(59,130,246,0.3)',
    title: 'Analytics avancés',
    description:
      "Visualisez l'évolution de votre base client, identifiez vos meilleurs clients, optimisez votre programme.",
    tag: 'Insights',
  },
  {
    icon: Globe,
    color: 'from-rose-500 to-pink-500',
    glow: 'rgba(244,63,94,0.3)',
    title: 'Widget universel',
    description:
      'Intégrez votre programme sur votre site en une ligne de code. Compatible avec tous les CMS et outils de caisse.',
    tag: '1 ligne de code',
  },
  {
    icon: Smartphone,
    color: 'from-purple-500 to-violet-500',
    glow: 'rgba(168,85,247,0.3)',
    title: 'Sans app à télécharger',
    description:
      "Vos clients s'inscrivent via le widget web. Pas d'app, pas de friction. Taux d'inscription 3x supérieur.",
    tag: 'Frictionless',
  },
  {
    icon: Zap,
    color: 'from-yellow-500 to-amber-500',
    glow: 'rgba(234,179,8,0.3)',
    title: 'Campagnes automatisées',
    description:
      "L'IA rédige et envoie des messages personnalisés à vos clients dormants. Taux de réactivation moyen : 34%.",
    tag: 'IA-powered',
  },
  {
    icon: Shield,
    color: 'from-slate-500 to-zinc-500',
    glow: 'rgba(100,116,139,0.3)',
    title: 'RGPD & Sécurité',
    description:
      'Hébergé en France. Chiffrement bout-en-bout. Conformité RGPD native. Vos données et celles de vos clients sont protégées.',
    tag: 'Certifié',
  },
]

function FeatureCard({ feature, index }: { feature: (typeof features)[number]; index: number }) {
  const Icon = feature.icon
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.55,
        delay: (index % 4) * 0.08,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.03] p-6 transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.05]"
    >
      {/* Hover glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at 50% 0%, ${feature.glow} 0%, transparent 60%)`,
        }}
      />

      {/* Icon */}
      <div
        className={`relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}
        style={{ boxShadow: `0 8px 24px ${feature.glow}` }}
      >
        <Icon className="h-5.5 w-5.5 h-[22px] w-[22px] text-white" strokeWidth={2} />
      </div>

      {/* Tag */}
      <div className="mb-3 inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/40">
        {feature.tag}
      </div>

      <h3 className="font-display mb-2.5 text-base font-bold text-white">{feature.title}</h3>
      <p className="text-sm leading-relaxed text-white/45">{feature.description}</p>
    </motion.div>
  )
}

export function Features() {
  const headingRef = useRef<HTMLDivElement>(null)
  const headingInView = useInView(headingRef, { once: true })

  return (
    <section id="features" className="relative bg-[#05050A] py-32">
      {/* Subtle separator */}
      <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div ref={headingRef} className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-300">
              Fonctionnalités
            </div>
          </motion.div>
          <motion.h2
            className="font-display text-4xl font-black tracking-[-0.03em] text-white lg:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            Tout ce dont vous avez besoin.
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-amber-300 bg-clip-text text-transparent">
              Rien de superflu.
            </span>
          </motion.h2>
          <motion.p
            className="mx-auto mt-5 max-w-2xl text-lg text-white/40"
            initial={{ opacity: 0 }}
            animate={headingInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Une plateforme complète conçue spécifiquement pour les restaurants indépendants. Pas de
            complexité inutile, que de la valeur.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
