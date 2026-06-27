import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Inscription — LoyaltyFlowAI' }

export default function RegisterPage() {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
        <p className="mt-1 text-sm text-gray-500">
          Déjà inscrit ?{' '}
          <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Se connecter
          </Link>
        </p>
      </div>

      {/* Le formulaire sera implémenté avec Supabase Auth en Phase 1 */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nom de l&apos;établissement
          </label>
          <input
            type="text"
            placeholder="Le Petit Bistrot"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email professionnel</label>
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
            placeholder="8 caractères minimum"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Créer mon compte — Essai gratuit 14 jours
        </button>
        <p className="text-center text-xs text-gray-500">
          Pas de carte bancaire requise. Aucun engagement.
        </p>
      </div>
    </div>
  )
}
