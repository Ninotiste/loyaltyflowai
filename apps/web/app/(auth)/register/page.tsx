'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Route } from 'next'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Store, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const perks = [
  '14 jours gratuits, sans carte bancaire',
  'Installation du widget en 5 minutes',
  'Support par email inclus',
]

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const invitationEmail = searchParams.get('email') ?? ''
  const invitationToken = searchParams.get('invitation')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [restaurantName, setRestaurantName] = useState('')
  const [email, setEmail] = useState(invitationEmail)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isInvitation = Boolean(invitationToken)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { first_name: firstName, last_name: lastName } },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }
      if (!data.session) {
        setError('Veuillez vérifier votre email pour confirmer votre compte.')
        return
      }

      if (isInvitation && invitationToken) {
        router.push(`/api/v1/team/accept/${invitationToken}` as Route)
        return
      }

      const res = await fetch('/api/v1/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurant_name: restaurantName || `Restaurant de ${firstName}` }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setError(err.message ?? 'Erreur lors de la création du compte.')
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
        <h2 className="font-display text-3xl font-bold text-zinc-900">
          {isInvitation ? "Rejoindre l'équipe" : 'Créer votre compte'}
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Déjà inscrit ?{' '}
          <Link
            href="/login"
            className="font-semibold text-violet-600 transition-colors hover:text-violet-700"
          >
            Se connecter
          </Link>
        </p>
      </div>

      {/* Perks (registration only) */}
      {!isInvitation && (
        <div className="flex flex-col gap-2">
          {perks.map((p) => (
            <div key={p} className="flex items-center gap-2 text-sm text-zinc-600">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
              {p}
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Prénom"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
            leftIcon={<User className="h-4 w-4" />}
          />
          <Input
            label="Nom"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
          />
        </div>

        {!isInvitation && (
          <Input
            label="Nom de l'établissement"
            type="text"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            placeholder="Le Petit Bistrot"
            required
            leftIcon={<Store className="h-4 w-4" />}
          />
        )}

        <Input
          label="Email professionnel"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="contact@monrestaurant.fr"
          required
          readOnly={isInvitation}
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
        />

        <Input
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="8 caractères minimum"
          required
          autoComplete="new-password"
          leftIcon={<Lock className="h-4 w-4" />}
          hint="Au moins 8 caractères"
        />

        <Button type="submit" size="lg" loading={loading} className="group mt-2 w-full">
          {!loading && (
            <>
              {isInvitation ? 'Rejoindre le restaurant' : 'Commencer — Essai gratuit 14 jours'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
          {loading && 'Création du compte…'}
        </Button>

        {!isInvitation && (
          <p className="text-center text-xs text-zinc-400">
            Pas de carte bancaire requise. Annulation à tout moment.
          </p>
        )}
      </form>
    </div>
  )
}
