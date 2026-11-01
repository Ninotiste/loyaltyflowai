'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star, TrendingDown, Users, Zap } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

const HeroScene = dynamic(
  () => import('@/components/3d/hero-scene').then((m) => ({ default: m.HeroScene })),
  { ssr: false }
)

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1400
          const start = performance.now()

          const tick = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const ease = 1 - Math.pow(1 - progress, 3)
            setDisplay(Math.round(ease * value))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref}>
      {display.toLocaleString('fr-FR')}
      {suffix}
    </span>
  )
}

const stats = [
  { value: 68, suffix: '%', label: 'de clients qui reviennent' },
  { value: 3200, suffix: '+', label: 'restaurants équipés' },
  { value: 4, suffix: 'x', label: 'ROI moyen en 90 jours' },
]

const floatingCards = [
  {
    icon: TrendingDown,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20',
    title: 'Churn réduit',
    value: '-42%',
    sub: 'ce mois',
  },
  {
    icon: Users,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
    title: 'Clients actifs',
    value: '1 248',
    sub: "+12 aujourd'hui",
  },
  {
    icon: Star,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    title: 'Score fidélité',
    value: '94/100',
    sub: 'Excellent',
  },
]

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#05050A]">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-violet-700/20 blur-[120px]" />
        <div className="absolute -left-48 top-1/3 h-[400px] w-[400px] rounded-full bg-violet-900/15 blur-[100px]" />
        <div className="absolute -right-48 bottom-1/4 h-[350px] w-[350px] rounded-full bg-amber-500/10 blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-32 lg:px-8">
        <div className="grid min-h-[75vh] grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Left — Text */}
          <div className="flex flex-col items-start">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-300">
                <Zap className="h-3 w-3 text-amber-400" strokeWidth={2.5} />
                Powered by AI · Conçu pour la restauration
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="font-display text-5xl font-black leading-[1.04] tracking-[-0.04em] text-white lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              Vos clients{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-violet-400 via-violet-300 to-amber-300 bg-clip-text text-transparent">
                  reviennent.
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-violet-500 to-amber-400 opacity-60" />
              </span>
              <br />
              <span className="text-white/90">Grâce à l&apos;IA.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="mt-7 max-w-xl text-lg leading-relaxed text-white/50"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              LoyaltyFlowAI détecte automatiquement les clients sur le point de partir et envoie le
              bon message, au bon moment. Programme de fidélité complet en 5 minutes.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="mt-10 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <Link
                href="/register"
                className="group relative inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-2xl bg-violet-600 px-7 text-sm font-bold text-white shadow-[0_0_32px_0_rgb(124_58_237_/_0.45)] transition-all duration-300 hover:bg-violet-500 hover:shadow-[0_0_48px_0_rgb(124_58_237_/_0.6)]"
              >
                <span>Démarrer gratuitement</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="#dashboard"
                className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.04] px-7 text-sm font-semibold text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.18] hover:bg-white/[0.08] hover:text-white"
              >
                Voir la démo
              </Link>
            </motion.div>

            {/* Product status — avoid presenting demo metrics as customer results */}
            <motion.p
              className="mt-12 text-xs font-medium tracking-wide text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Aperçu produit · Les chiffres présentés sont des données de démonstration
            </motion.p>
          </div>

          {/* Right — 3D Scene */}
          <motion.div
            className="relative h-[520px] lg:h-[640px]"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            {/* 3D Canvas */}
            <div className="absolute inset-0 rounded-3xl">
              <HeroScene />
            </div>

            {/* Floating stat cards */}
            {floatingCards.map((card, i) => {
              const Icon = card.icon
              const positions = [
                'bottom-6 left-0 lg:-left-12',
                'top-6 right-0 lg:-right-12',
                'bottom-28 right-0 lg:-right-8',
              ]
              return (
                <motion.div
                  key={card.title}
                  className={`absolute ${positions[i]} z-20`}
                  initial={{ opacity: 0, x: i === 1 || i === 2 ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + i * 0.12 }}
                  style={{
                    animation: `float ${5 + i}s ease-in-out infinite`,
                    animationDelay: `${i * 0.8}s`,
                  }}
                >
                  <div
                    className={`flex items-center gap-3 rounded-2xl border ${card.border} bg-zinc-950/80 px-4 py-3 backdrop-blur-xl`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl ${card.bg}`}
                    >
                      <Icon className={`h-4 w-4 ${card.color}`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-white/40">{card.title}</p>
                      <p className="text-sm font-bold text-white">{card.value}</p>
                      <p className="text-[10px] text-white/30">{card.sub}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.04] sm:grid-cols-3"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center gap-1 px-8 py-7"
            >
              <p className="font-display text-4xl font-black tracking-tight text-white">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-center text-sm text-white/40">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 pt-2">
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-white/40"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
