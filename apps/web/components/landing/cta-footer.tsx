'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { Zap, ArrowRight, Twitter, Linkedin, Mail } from 'lucide-react'

const footerLinks = {
  Produit: ['Fonctionnalités', 'Dashboard', 'Widget', 'API', 'Tarifs'],
  Ressources: ['Documentation', 'Blog', 'Changelog', 'Statut système'],
  Entreprise: ['À propos', 'Contact', 'Presse', 'Partenaires'],
  Légal: ['Confidentialité', 'CGU', 'RGPD', 'Cookies'],
}

export function CtaFooter() {
  const ctaRef = useRef<HTMLDivElement>(null)
  const ctaInView = useInView(ctaRef, { once: true, margin: '-80px' })

  return (
    <>
      {/* CTA Section */}
      <section className="relative overflow-hidden bg-[#05050A] py-32">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Radial glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-violet-700/18 absolute left-1/2 top-1/2 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]" />
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[80px]" />
        </div>

        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div ref={ctaRef} className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-300">
              <Zap className="h-3 w-3 text-amber-400" />
              Prêt à démarrer ?
            </div>

            <h2 className="font-display text-5xl font-black leading-tight tracking-[-0.04em] text-white lg:text-6xl">
              Vos clients méritent
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-violet-300 to-amber-300 bg-clip-text text-transparent">
                mieux que l&apos;oubli.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/45">
              Rejoignez 3 200 restaurants qui utilisent LoyaltyFlowAI pour transformer leurs clients
              occasionnels en habitués fidèles.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="group inline-flex h-14 items-center gap-2.5 rounded-2xl bg-violet-600 px-10 text-base font-bold text-white shadow-[0_0_60px_rgba(124,58,237,0.5)] transition-all hover:bg-violet-500 hover:shadow-[0_0_80px_rgba(124,58,237,0.65)]"
              >
                Démarrer gratuitement
                <ArrowRight className="h-4.5 w-4.5 h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-14 items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.04] px-10 text-base font-semibold text-white/70 backdrop-blur-sm transition-all hover:border-white/[0.18] hover:bg-white/[0.08] hover:text-white"
              >
                Connexion
              </Link>
            </div>

            <p className="mt-5 text-sm text-white/25">
              14 jours d&apos;essai gratuit · Aucune carte bancaire · Annulation immédiate
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.06] bg-[#030308] py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            {/* Brand */}
            <div className="col-span-2">
              <Link href="/" className="group inline-flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600">
                  <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-display text-base font-bold text-white">
                  LoyaltyFlow<span className="text-amber-400">AI</span>
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/35">
                La plateforme de fidélisation IA conçue pour les restaurants indépendants français.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <a
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/40 transition-all hover:border-white/[0.15] hover:bg-white/[0.07] hover:text-white"
                >
                  <Twitter className="h-3.5 w-3.5" />
                </a>
                <a
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/40 transition-all hover:border-white/[0.15] hover:bg-white/[0.07] hover:text-white"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                </a>
                <a
                  href="mailto:hello@loyaltyflow.ai"
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/40 transition-all hover:border-white/[0.15] hover:bg-white/[0.07] hover:text-white"
                >
                  <Mail className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">
                  {category}
                </p>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-white/40 transition-colors hover:text-white"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.05] pt-8 sm:flex-row">
            <p className="text-xs text-white/20">
              © 2026 LoyaltyFlowAI. Tous droits réservés. Fait avec ♥ en France.
            </p>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs text-white/25">Tous les systèmes opérationnels</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
