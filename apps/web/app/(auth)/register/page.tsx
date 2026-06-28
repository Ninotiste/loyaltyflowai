'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Route } from 'next'
import { createClient } from '@/lib/supabase/client'

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

      // Create the organization for new restaurateurs
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
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {isInvitation ? "Rejoindre l'équipe" : 'Créer un compte'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Déjà inscrit ?{' '}
          <Link href="/login" className="text-brand-600 hover:text-brand-700 font-medium">
            Se connecter
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="focus:ring-brand-500 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="focus:ring-brand-500 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
            />
          </div>
        </div>
        {!isInvitation && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nom de l&apos;établissement
            </label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Le Petit Bistrot"
              required
              className="focus:ring-brand-500 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
            />
          </div>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email professionnel
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contact@monrestaurant.fr"
            required
            readOnly={isInvitation}
            autoComplete="email"
            className="focus:ring-brand-500 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm read-only:bg-gray-50 focus:outline-none focus:ring-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8 caractères minimum"
            required
            autoComplete="new-password"
            className="focus:ring-brand-500 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-600 hover:bg-brand-700 w-full rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading
            ? 'Création...'
            : isInvitation
              ? 'Rejoindre le restaurant'
              : 'Créer mon compte — Essai gratuit 14 jours'}
        </button>
        {!isInvitation && (
          <p className="text-center text-xs text-gray-500">
            Pas de carte bancaire requise. Aucun engagement.
          </p>
        )}
      </form>
    </div>
  )
}
