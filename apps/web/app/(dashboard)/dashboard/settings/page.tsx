'use client'

import { useState, useEffect } from 'react'

type Tab = 'restaurant' | 'equipe' | 'abonnement' | 'rgpd'

interface TeamMember {
  id: string
  email: string
  role: string
  created_at: string
}

interface Invitation {
  id: string
  email: string
  role: string
  expires_at: string
}

const PLAN_LABELS: Record<string, { name: string; price: string; limit: string }> = {
  starter: { name: 'Starter', price: '49€/mois', limit: '500 clients' },
  growth: { name: 'Growth', price: '149€/mois', limit: '5 000 clients' },
  pro: { name: 'Pro', price: '299€/mois', limit: 'Clients illimités' },
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employé',
  MEMBER: 'Membre',
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('restaurant')
  const [members, setMembers] = useState<TeamMember[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'MANAGER' | 'EMPLOYEE'>('EMPLOYEE')
  const [inviting, setInviting] = useState(false)
  const [inviteSuccess, setInviteSuccess] = useState(false)

  useEffect(() => {
    if (tab === 'equipe') {
      fetch('/api/v1/team')
        .then((r) => r.json())
        .then((d) => {
          setMembers(d.members ?? [])
          setInvitations(d.pending_invitations ?? [])
        })
    }
  }, [tab])

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviting(true)
    try {
      const res = await fetch('/api/v1/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })
      if (res.ok) {
        setInviteSuccess(true)
        setInviteEmail('')
        const d = await res.json()
        setInvitations((prev) => [d.invitation, ...prev])
        setTimeout(() => setInviteSuccess(false), 3000)
      }
    } finally {
      setInviting(false)
    }
  }

  async function revokeAccess(memberId: string) {
    if (!confirm("Révoquer l'accès de ce membre ?")) return
    const res = await fetch(`/api/v1/team/${memberId}`, { method: 'DELETE' })
    if (res.ok) setMembers((prev) => prev.filter((m) => m.id !== memberId))
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'restaurant', label: 'Restaurant' },
    { id: 'equipe', label: 'Équipe' },
    { id: 'abonnement', label: 'Abonnement' },
    { id: 'rgpd', label: 'RGPD' },
  ]

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
      </div>

      <div className="mb-6 flex gap-1 rounded-xl bg-gray-100 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'restaurant' && (
        <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="font-semibold text-gray-900">Informations du restaurant</h2>
          <p className="text-sm text-gray-500">
            Les modifications seront disponibles dans une prochaine mise à jour.
          </p>
          <div className="pointer-events-none space-y-3 opacity-60">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nom de l&apos;établissement
              </label>
              <input
                type="text"
                placeholder="Le Petit Bistrot"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email de contact
              </label>
              <input
                type="email"
                placeholder="contact@monrestaurant.fr"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {tab === 'equipe' && (
        <div className="space-y-6">
          <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="font-semibold text-gray-900">Membres de l&apos;équipe</h2>
            {members.length === 0 ? (
              <p className="text-sm text-gray-500">Aucun membre.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {members.map((m) => (
                  <li key={m.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{m.email}</p>
                      <p className="text-xs text-gray-500">{ROLE_LABELS[m.role] ?? m.role}</p>
                    </div>
                    {m.role !== 'ADMIN' && (
                      <button
                        onClick={() => revokeAccess(m.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Révoquer
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {invitations.length > 0 && (
            <div className="space-y-2 rounded-xl bg-amber-50 p-6 ring-1 ring-amber-200">
              <h2 className="font-semibold text-amber-800">Invitations en attente</h2>
              <ul className="space-y-1">
                {invitations.map((inv) => (
                  <li key={inv.id} className="text-sm text-amber-700">
                    {inv.email} — {ROLE_LABELS[inv.role] ?? inv.role}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="font-semibold text-gray-900">Inviter un membre</h2>
            {inviteSuccess && (
              <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-200">
                Invitation envoyée avec succès !
              </div>
            )}
            <form onSubmit={handleInvite} className="flex gap-3">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@employe.fr"
                required
                className="focus:ring-brand-500 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as typeof inviteRole)}
                className="focus:ring-brand-500 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
              >
                <option value="EMPLOYEE">Employé</option>
                <option value="MANAGER">Manager</option>
              </select>
              <button
                type="submit"
                disabled={inviting}
                className="bg-brand-600 hover:bg-brand-700 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {inviting ? 'Envoi...' : 'Inviter'}
              </button>
            </form>
          </div>
        </div>
      )}

      {tab === 'abonnement' && (
        <div className="space-y-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="font-semibold text-gray-900">Votre abonnement</h2>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(PLAN_LABELS).map(([key, plan]) => (
              <div
                key={key}
                className={`rounded-xl border-2 p-4 ${key === 'starter' ? 'border-brand-500 bg-brand-50' : 'border-gray-200'}`}
              >
                <p className="font-semibold text-gray-900">{plan.name}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{plan.price}</p>
                <p className="text-sm text-gray-500">{plan.limit}</p>
                {key !== 'starter' && (
                  <button
                    onClick={() => alert('Fonctionnalité de paiement bientôt disponible')}
                    className="bg-brand-600 hover:bg-brand-700 mt-3 w-full rounded-lg px-3 py-1.5 text-sm font-medium text-white"
                  >
                    Passer à {plan.name}
                  </button>
                )}
                {key === 'starter' && (
                  <p className="text-brand-600 mt-3 text-xs font-medium">Plan actuel</p>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            Tarifs HT. TVA 20% applicable. Facturation mensuelle. Résiliation possible à tout
            moment.
          </p>
        </div>
      )}

      {tab === 'rgpd' && (
        <div className="space-y-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="font-semibold text-gray-900">Conformité RGPD</h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
              <strong>Rappel :</strong> En tant que responsable de traitement (RGPD Art.4), vous
              êtes responsable des données de vos clients. LoyaltyFlowAI agit comme sous-traitant
              (Art.28). Un DPA (Data Processing Agreement) est disponible sur demande.
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-800">
                Droits des personnes concernées
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Droit d&apos;accès (Art.15) — Export JSON disponible sur chaque fiche client
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Droit d&apos;effacement (Art.17) — Anonymisation disponible sur chaque fiche
                  client
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Droit à la portabilité (Art.20) — Export JSON structuré
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500">~</span>
                  Registre des activités (Art.30) — À documenter par votre DPO
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-800">Durée de conservation</h3>
              <p className="text-sm text-gray-600">
                Les données clients sont conservées 12 mois après la dernière visite, puis
                supprimées automatiquement. Les transactions sont conservées 5 ans (obligation
                comptable, Art.6.1.c RGPD).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
