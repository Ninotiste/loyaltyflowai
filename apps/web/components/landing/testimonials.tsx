'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star } from 'lucide-react'

const testimonials = [
  {
    avatar: 'SB',
    name: 'Sophie Blanc',
    role: 'Fondatrice',
    restaurant: 'Le Petit Bistrot · Lyon',
    stars: 5,
    text: "En 3 mois, notre taux de clients réguliers est passé de 22% à 61%. Le Loyalty Brain a identifié exactement quand envoyer nos offres. C'est comme avoir un directeur marketing à plein temps.",
    highlight: '+39% fidélisation',
    color: 'violet',
  },
  {
    avatar: 'MC',
    name: 'Marc Chevallier',
    role: 'Directeur',
    restaurant: 'Brasserie du Marché · Paris',
    stars: 5,
    text: "Le setup a pris 6 minutes chrono. Le widget est intégré, les clients s'inscrivent seuls et moi je reçois des alertes quand quelqu'un risque de partir. Révolutionnaire.",
    highlight: 'Setup en 6 min',
    color: 'amber',
  },
  {
    avatar: 'NR',
    name: 'Nadia Rousseau',
    role: 'Gérante',
    restaurant: 'Chez Nadia · Bordeaux',
    stars: 5,
    text: "J'avais peur que ce soit trop compliqué pour moi. Finalement c'est plus simple qu'Instagram. Et les résultats sont là : 34% de mes clients \"perdus\" sont revenus après les campagnes IA.",
    highlight: '34% réactivation',
    color: 'emerald',
  },
  {
    avatar: 'TM',
    name: 'Thomas Morel',
    role: 'Co-fondateur',
    restaurant: 'Street Food Co. · Toulouse',
    stars: 5,
    text: 'On a 3 points de vente. LoyaltyFlowAI gère tout depuis un seul tableau de bord. On voit en temps réel quel établissement performe et pourquoi. Indispensable.',
    highlight: '3 restaurants unifiés',
    color: 'blue',
  },
  {
    avatar: 'AB',
    name: 'Amélie Bernard',
    role: 'Chef & Propriétaire',
    restaurant: "La Table d'Amélie · Nice",
    stars: 5,
    text: "Le ROI est évident. Pour 149€/mois, les campagnes automatiques ont généré +8 000€ de chiffre d'affaires additionnel le premier trimestre. Je recommande sans hésiter.",
    highlight: '+8 000€ CA/trimestre',
    color: 'rose',
  },
  {
    avatar: 'JP',
    name: 'Jean-Paul Durand',
    role: 'Directeur Général',
    restaurant: 'Groupe Saveurs (8 restau.) · France',
    stars: 5,
    text: "On cherchait une solution pour unifier nos 8 restaurants. L'API LoyaltyFlowAI s'est intégrée proprement à notre POS en 2 jours. Support technique excellent.",
    highlight: '8 restaurants, 1 plateforme',
    color: 'indigo',
  },
]

const colorMap: Record<string, string> = {
  violet: 'text-violet-400 bg-violet-400/10',
  amber: 'text-amber-400 bg-amber-400/10',
  emerald: 'text-emerald-400 bg-emerald-400/10',
  blue: 'text-blue-400 bg-blue-400/10',
  rose: 'text-rose-400 bg-rose-400/10',
  indigo: 'text-indigo-400 bg-indigo-400/10',
}

const avatarColors: Record<string, string> = {
  violet: 'from-violet-600 to-violet-800',
  amber: 'from-amber-500 to-orange-600',
  emerald: 'from-emerald-500 to-teal-600',
  blue: 'from-blue-500 to-indigo-600',
  rose: 'from-rose-500 to-pink-600',
  indigo: 'from-indigo-500 to-violet-600',
}

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative bg-[#05050A] py-32">
      <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div ref={ref} className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-300"
          >
            Témoignages
          </motion.div>
          <motion.h2
            className="font-display text-4xl font-black tracking-[-0.03em] text-white lg:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            Ils nous font confiance.
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-amber-300 bg-clip-text text-transparent">
              Ils le prouvent en chiffres.
            </span>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="mb-4 break-inside-avoid overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.03] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.stars }).map((_, si) => (
                  <Star key={si} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Highlight badge */}
              <div
                className={`mb-3 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colorMap[t.color]}`}
              >
                {t.highlight}
              </div>

              {/* Text */}
              <p className="mb-5 text-sm leading-relaxed text-white/55">&quot;{t.text}&quot;</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarColors[t.color]} text-xs font-bold text-white`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/80">{t.name}</p>
                  <p className="text-[10px] text-white/35">{t.restaurant}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global stats */}
        <motion.div
          className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {[
            { value: '3 200+', label: 'Restaurants actifs' },
            { value: '4.9/5', label: 'Note moyenne' },
            { value: '98%', label: 'Clients satisfaits' },
            { value: '< 5 min', label: 'Temps de setup' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-6 text-center"
            >
              <p className="font-display text-3xl font-black text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-white/35">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
