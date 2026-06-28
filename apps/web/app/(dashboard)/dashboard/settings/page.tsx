'use client'

import { useState, useEffect } from 'react'
import { Mail, Shield, Users, CreditCard, CheckCircle, Store } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

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

const PLAN_LABELS: Record<
  string,
  { name: string; price: string; limit: string; popular?: boolean }
> = {
  starter: { name: 'Starter', price: '49€', limit: '500 clients' },
  growth: { name: 'Growth', price: '149€', limit: '5 000 clients', popular: true },
  pro: { name: 'Pro', price: '299€', limit: 'Clients illimités' },
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employé',
  MEMBER: 'Membre',
}

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'restaurant', label: 'Restaurant', icon: Store },
  { id: 'equipe', label: 'Équipe', icon: Users },
  { id: 'abonnement', label: 'Abonnement', icon: CreditCard },
  { id: 'rgpd', label: 'RGPD', icon: Shield },
]

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

  return (
    <div className="max-w-3xl">
      <PageHeader title="Paramètres" />

      {/* Tab switcher */}
      <div className="mb-6 flex gap-1 rounded-2xl bg-zinc-100 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
              tab === t.id
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            )}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Restaurant tab */}
      {tab === 'restaurant' && (
        <div className="panel space-y-5 p-6">
          <h2 className="font-display text-base font-bold text-zinc-900">
            Informations du restaurant
          </h2>
          <p className="-mt-2 text-sm text-zinc-500">
            Les modifications sont disponibles dans la prochaine mise à jour.
          </p>
          <div className="pointer-events-none space-y-4 opacity-50">
            <Input label="Nom de l'établissement" type="text" placeholder="Le Petit Bistrot" />
            <Input label="Email de contact" type="email" placeholder="contact@monrestaurant.fr" />
          </div>
        </div>
      )}

      {/* Equipe tab */}
      {tab === 'equipe' && (
        <div className="space-y-5">
          <div className="panel space-y-4 p-6">
            <h2 className="font-display text-base font-bold text-zinc-900">
              Membres de l&apos;équipe
            </h2>
            {members.length === 0 ? (
              <p className="text-sm italic text-zinc-400">Aucun membre pour le moment.</p>
            ) : (
              <ul className="divide-y divide-zinc-100">
                {members.map((m) => (
                  <li key={m.id} className="flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar fallback={m.email} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{m.email}</p>
                        <p className="text-xs text-zinc-400">{ROLE_LABELS[m.role] ?? m.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={m.role === 'ADMIN' ? 'primary' : 'default'} size="sm">
                        {ROLE_LABELS[m.role] ?? m.role}
                      </Badge>
                      {m.role !== 'ADMIN' && (
                        <button
                          onClick={() => revokeAccess(m.id)}
                          className="text-xs text-zinc-400 transition-colors hover:text-red-500"
                        >
                          Révoquer
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {invitations.length > 0 && (
            <div className="space-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="text-sm font-semibold text-amber-800">Invitations en attente</h3>
              <ul className="space-y-1.5">
                {invitations.map((inv) => (
                  <li key={inv.id} className="flex items-center gap-2 text-sm text-amber-700">
                    <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                    {inv.email}
                    <span className="text-amber-500">—</span>
                    {ROLE_LABELS[inv.role] ?? inv.role}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="panel space-y-4 p-6">
            <h2 className="font-display text-base font-bold text-zinc-900">Inviter un membre</h2>
            {inviteSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-200">
                <CheckCircle className="h-4 w-4" />
                Invitation envoyée avec succès !
              </div>
            )}
            <form onSubmit={handleInvite} className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@employe.fr"
                  required
                  leftIcon={<Mail className="h-4 w-4" />}
                />
              </div>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as typeof inviteRole)}
                className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              >
                <option value="EMPLOYEE">Employé</option>
                <option value="MANAGER">Manager</option>
              </select>
              <Button type="submit" loading={inviting}>
                {!inviting && 'Inviter'}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Abonnement tab */}
      {tab === 'abonnement' && (
        <div className="panel space-y-5 p-6">
          <h2 className="font-display text-base font-bold text-zinc-900">Votre abonnement</h2>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(PLAN_LABELS).map(([key, plan]) => {
              const isCurrent = key === 'starter'
              return (
                <div
                  key={key}
                  className={cn(
                    'flex flex-col gap-3 rounded-2xl border-2 p-5 transition-shadow',
                    isCurrent
                      ? 'shadow-md-violet border-violet-500 bg-violet-50'
                      : plan.popular
                        ? 'border-amber-300 bg-amber-50/50'
                        : 'border-zinc-200 bg-white'
                  )}
                >
                  <div>
                    <div className="mb-0.5 flex items-center justify-between">
                      <p className="font-display font-bold text-zinc-900">{plan.name}</p>
                      {plan.popular && (
                        <Badge variant="warning" size="sm">
                          Populaire
                        </Badge>
                      )}
                      {isCurrent && (
                        <Badge variant="primary" size="sm">
                          Actuel
                        </Badge>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-zinc-900">
                      {plan.price}
                      <span className="text-sm font-normal text-zinc-400">/mois</span>
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">{plan.limit}</p>
                  </div>
                  {!isCurrent && (
                    <Button
                      variant={plan.popular ? 'amber' : 'outline'}
                      size="sm"
                      className="w-full"
                      onClick={() => alert('Fonctionnalité de paiement bientôt disponible')}
                    >
                      Passer à {plan.name}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
          <p className="text-xs text-zinc-400">
            Tarifs HT. TVA 20% applicable. Facturation mensuelle. Résiliation possible à tout
            moment.
          </p>
        </div>
      )}

      {/* RGPD tab */}
      {tab === 'rgpd' && (
        <div className="panel space-y-6 p-6">
          <h2 className="font-display text-base font-bold text-zinc-900">Conformité RGPD</h2>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
            <strong>Rappel :</strong> En tant que responsable de traitement (RGPD Art.4), vous êtes
            responsable des données de vos clients. LoyaltyFlowAI agit comme sous-traitant (Art.28).
            Un DPA est disponible sur demande.
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-800">
              Droits des personnes concernées
            </h3>
            <ul className="space-y-2.5">
              {[
                {
                  ok: true,
                  text: "Droit d'accès (Art.15) — Export JSON disponible sur chaque fiche client",
                },
                {
                  ok: true,
                  text: "Droit d'effacement (Art.17) — Anonymisation disponible sur chaque fiche client",
                },
                { ok: true, text: 'Droit à la portabilité (Art.20) — Export JSON structuré' },
                { ok: false, text: 'Registre des activités (Art.30) — À documenter par votre DPO' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-600">
                  <span
                    className={`mt-0.5 flex-shrink-0 ${item.ok ? 'text-green-500' : 'text-amber-500'}`}
                  >
                    {item.ok ? '✓' : '~'}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-zinc-800">Durée de conservation</h3>
            <p className="text-sm leading-relaxed text-zinc-600">
              Les données clients sont conservées 12 mois après la dernière visite, puis supprimées
              automatiquement. Les transactions sont conservées 5 ans (obligation comptable,
              Art.6.1.c RGPD).
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
