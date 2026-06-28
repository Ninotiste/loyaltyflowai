'use client'

import { motion } from 'framer-motion'
import { Star, TrendingUp, Users, Zap } from 'lucide-react'

const features = [
  { icon: TrendingUp, text: 'Churn réduit de 40% en moyenne' },
  { icon: Users, text: 'Widget installé en 5 minutes' },
  { icon: Zap, text: 'IA qui identifie vos clients à risque' },
]

const testimonials = [
  {
    quote: 'Mes clients reviennent 2× plus souvent. LoyaltyFlowAI a transformé mon restaurant.',
    name: 'Marie D.',
    role: 'Le Petit Bistrot, Lyon',
  },
  {
    quote: 'Setup en 10 min, résultats dès la première semaine. Impressionnant.',
    name: 'Thomas R.',
    role: 'Brasserie du Marché, Paris',
  },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Left panel — dark brand */}
      <div className="bg-gradient-violet-dark relative hidden flex-col overflow-hidden lg:flex lg:w-[55%]">
        {/* Background orbs */}
        <div className="pointer-events-none absolute left-[-5%] top-[-10%] h-[500px] w-[500px] rounded-full bg-violet-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-5%] right-[-10%] h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute left-[60%] top-[40%] h-[300px] w-[300px] rounded-full bg-violet-400/15 blur-2xl" />

        {/* Dot grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 flex h-full flex-col p-12 xl:p-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
              <Zap className="h-5 w-5 text-amber-400" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">
              LoyaltyFlowAI
            </span>
          </motion.div>

          {/* Main pitch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-auto"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-400/15 px-3 py-1.5 ring-1 ring-amber-400/20">
              <span className="animate-pulse-slow h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                Essai gratuit 14 jours
              </span>
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight text-white xl:text-5xl">
              Fidélisez vos clients.
              <br />
              <span className="text-amber-400">Automatiquement.</span>
            </h1>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-violet-200">
              L&apos;IA qui prédit le churn et réactive vos clients avant qu&apos;ils ne partent.
              Conçue pour les restaurants français.
            </p>

            {/* Features */}
            <div className="mt-8 flex flex-col gap-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.text}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <f.icon className="h-4 w-4 text-amber-400" />
                  </div>
                  <span className="text-sm text-violet-200">{f.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white/8 mt-10 rounded-2xl p-6 ring-1 ring-white/10 backdrop-blur-sm"
          >
            <div className="mb-3 flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm italic leading-relaxed text-violet-100">
              &ldquo;{testimonials[0].quote}&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-400">
                <span className="text-xs font-bold text-white">M</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{testimonials[0].name}</p>
                <p className="text-xs text-violet-400">{testimonials[0].role}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right panel — light form */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto p-6 lg:p-12">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-lg font-bold text-zinc-900">LoyaltyFlowAI</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
