import type { Metadata } from 'next'
import type { Route } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Connexion — LoyaltyFlowAI' }

export default function LoginPage() {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
        <p className="mt-1 text-sm text-gray-500">
          Pas encore de compte ?{' '}
          <Link href="/register" className="font-medium text-brand-600 hover:text-brand-700">
            S&apos;inscrire
          </Link>
        </p>
      </div>

      {/* Le formulaire sera implémenté avec Supabase Auth en Phase 1 */}
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="contact@monrestaurant.fr"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            type="password"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="flex items-center justify-between">
          <div />
          <Link href={'/forgot-password' as Route} className="text-sm text-brand-600 hover:text-brand-700">
            Mot de passe oublié ?
          </Link>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          Se connecter
        </button>
      </div>
    </div>
  )
}
