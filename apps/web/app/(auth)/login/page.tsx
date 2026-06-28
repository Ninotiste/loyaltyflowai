'use client'

import { useState } from 'react'
import type { Route } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        setError(
          authError.message === 'Invalid login credentials'
            ? 'Email ou mot de passe incorrect.'
            : authError.message
        )
        return
      }
      router.push('/dashboard' as Route)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h2 className="font-display text-3xl font-bold text-zinc-900">Bon retour 👋</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Pas encore de compte ?{' '}
          <Link
            href="/register"
            className="font-semibold text-violet-600 transition-colors hover:text-violet-700"
          >
            Créer un compte gratuit
          </Link>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2.5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <Input
          label="Email professionnel"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="contact@monrestaurant.fr"
          required
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
        />

        <div className="flex flex-col gap-1.5">
          <Input
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            leftIcon={<Lock className="h-4 w-4" />}
          />
          <div className="flex justify-end">
            <Link
              href={'/forgot-password' as Route}
              className="text-xs font-medium text-violet-600 transition-colors hover:text-violet-700"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        <Button type="submit" size="lg" loading={loading} className="group mt-1 w-full">
          {!loading && (
            <>
              Se connecter
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
          {loading && 'Connexion en cours…'}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-xs text-zinc-400">
        En vous connectant, vous acceptez nos{' '}
        <a href="#" className="underline hover:text-zinc-600">
          CGU
        </a>{' '}
        et notre{' '}
        <a href="#" className="underline hover:text-zinc-600">
          Politique de confidentialité
        </a>
        .
      </p>
    </div>
  )
}
