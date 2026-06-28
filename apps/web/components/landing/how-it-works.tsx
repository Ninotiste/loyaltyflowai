'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Zap, Code2, Users, TrendingUp } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Zap,
    color: 'from-violet-600 to-violet-500',
    glow: 'shadow-[0_0_32px_rgba(124,58,237,0.5)]',
    title: 'Créez votre compte',
    description:
      'Inscription en 2 minutes. Ajoutez vos informations de restaurant et personnalisez votre programme de fidélité — points, tampons, récompenses.',
    detail: "Aucune carte bancaire requise pour l'essai de 14 jours.",
  },
  {
    number: '02',
    icon: Code2,
    color: 'from-amber-500 to-orange-500',
    glow: 'shadow-[0_0_32px_rgba(245,158,11,0.4)]',
    title: 'Installez le widget',
    description:
      'Copiez une ligne de code sur votre site web. Compatible avec WordPress, Wix, Squarespace et tous les autres CMS.',
    detail: "Temps d'installation moyen : 4 minutes.",
  },
  {
    number: '03',
    icon: Users,
    color: 'from-emerald-500 to-teal-500',
    glow: 'shadow-[0_0_32px_rgba(16,185,129,0.4)]',
    title: "Vos clients s'inscrivent",
    description:
      "Le widget apparaît sur votre site. Vos visiteurs s'inscrivent avec leur email en quelques secondes. Aucune app à télécharger.",
    detail: 'Taux de conversion moyen : 38% des visiteurs.',
  },
  {
    number: '04',
    icon: TrendingUp,
    color: 'from-blue-500 to-indigo-500',
    glow: 'shadow-[0_0_32px_rgba(59,130,246,0.4)]',
    title: "L'IA travaille pour vous",
    description:
      'Le Loyalty Brain analyse chaque client, détecte les risques de départ et envoie automatiquement les bons messages aux bons moments.',
    detail: 'ROI moyen constaté en 90 jours : 4x.',
  },
]

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative bg-[#05050A] py-32">
      <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-300"
          >
            Comment ça marche
          </motion.div>
          <motion.h2
            className="font-display text-4xl font-black tracking-[-0.03em] text-white lg:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            Opérationnel en
            <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
              {' '}
              5 minutes.
            </span>
          </motion.h2>
          <motion.p
            className="mx-auto mt-4 max-w-xl text-lg text-white/40"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Pas de complexité technique. Pas de formations interminables. Un setup guidé et vous
            êtes live.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/[0.06] to-transparent lg:block" />

          <div className="space-y-8 lg:space-y-0">
            {steps.map((step, i) => {
              const Icon = step.icon
              const isEven = i % 2 === 0

              return (
                <motion.div
                  key={step.number}
                  className={`flex flex-col items-center gap-8 lg:flex-row lg:gap-16 ${
                    isEven ? '' : 'lg:flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, y: 32 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                >
                  {/* Content */}
                  <div className={`flex-1 ${isEven ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div
                      className={`mb-4 flex items-center gap-3 ${
                        isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'
                      } flex-row`}
                    >
                      <span className="font-display text-5xl font-black text-white/[0.06]">
                        {step.number}
                      </span>
                      <h3 className="font-display text-2xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="mb-3 text-base leading-relaxed text-white/45">
                      {step.description}
                    </p>
                    <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400/80">
                      <span className="h-1 w-1 rounded-full bg-amber-400" />
                      {step.detail}
                    </p>
                  </div>

                  {/* Center icon */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="absolute inset-0 animate-pulse rounded-full opacity-30 blur-xl"
                      style={{
                        background: `conic-gradient(from 0deg, transparent, rgba(124,58,237,0.3), transparent)`,
                      }}
                    />
                    <div
                      className={`relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${step.color} ${step.glow}`}
                    >
                      <Icon className="h-9 w-9 text-white" strokeWidth={1.75} />
                    </div>
                  </div>

                  {/* Empty side for zigzag */}
                  <div className="hidden flex-1 lg:block" />
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <a
            href="/register"
            className="group inline-flex h-14 items-center gap-3 rounded-2xl bg-violet-600 px-10 text-base font-bold text-white shadow-[0_0_48px_rgba(124,58,237,0.4)] transition-all hover:bg-violet-500 hover:shadow-[0_0_64px_rgba(124,58,237,0.55)]"
          >
            Commencer maintenant — c&apos;est gratuit
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
          <p className="mt-3 text-sm text-white/30">
            14 jours d&apos;essai · Aucune carte bancaire · Annulation à tout moment
          </p>
        </motion.div>
      </div>
    </section>
  )
}
