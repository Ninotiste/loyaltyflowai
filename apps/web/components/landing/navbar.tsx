'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Zap, Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Tarifs', href: '#pricing' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { scrollY } = useScroll()

  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.9])
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 0.12])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {mounted && (
        <motion.div
          className="absolute inset-0 backdrop-blur-xl"
          style={{
            background: `rgba(5,5,10,${bgOpacity.get()})`,
            borderBottom: `1px solid rgba(255,255,255,${borderOpacity.get()})`,
          }}
        />
      )}
      {!mounted && <div className="absolute inset-0" />}

      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="shadow-glow-violet relative flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600 transition-transform duration-300 group-hover:scale-105">
            <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-base font-bold text-white">
            LoyaltyFlow
            <span className="text-amber-400">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white/60 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="shadow-glow-violet group relative inline-flex h-9 items-center gap-2 overflow-hidden rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition-all duration-300 hover:bg-violet-500 hover:shadow-[0_0_32px_0_rgb(124_58_237_/_0.5)]"
          >
            <span className="relative z-10">Essai gratuit</span>
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mx-4 mb-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/95 p-4 backdrop-blur-2xl md:hidden"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-white/[0.06] pt-3">
              <Link
                href="/login"
                className="rounded-xl px-4 py-3 text-center text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-violet-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-violet-500"
              >
                Essai gratuit — 14 jours
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
