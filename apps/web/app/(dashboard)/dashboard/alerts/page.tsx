'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Route } from 'next'
import { Sparkles, Send, CheckCircle, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Avatar } from '@/components/ui/avatar'

interface ChurnCustomer {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  total_points: number
  churn_days: number | null
  churn_score: string | null
  last_visit_at: string | null
}

interface AiSuggestion {
  title: string
  message: string
  send_at: string
  reason: string
  estimated_roi: string
}

function formatRelativeDate(iso: string | null) {
  if (!iso) return 'jamais'
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24))
  if (days === 0) return "aujourd'hui"
  if (days === 1) return 'hier'
  return `il y a ${days} jours`
}

export default function AlertsPage() {
  const [customers, setCustomers] = useState<ChurnCustomer[]>([])
  const [suggestion, setSuggestion] = useState<AiSuggestion | null>(null)
  const [loading, setLoading] = useState(true)
  const [suggestLoading, setSuggestLoading] = useState(false)
  const [sendingAll, setSendingAll] = useState(false)
  const [sentCount, setSentCount] = useState(0)

  useEffect(() => {
    fetch('/api/v1/customers?churn=HIGH&limit=50')
      .then((r) => r.json())
      .then((d) => setCustomers(d.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  async function fetchSuggestion() {
    setSuggestLoading(true)
    try {
      const res = await fetch('/api/v1/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ high_churn_count: customers.length }),
      })
      if (res.ok) {
        const d = await res.json()
        setSuggestion(d.suggestion)
      }
    } finally {
      setSuggestLoading(false)
    }
  }

  async function sendReactivationCampaign() {
    setSendingAll(true)
    let count = 0
    for (const customer of customers.slice(0, 20)) {
      await fetch('/api/v1/alerts/send-reactivation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: customer.id }),
      })
      count++
    }
    setSentCount(count)
    setSendingAll(false)
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Alertes Churn"
        description="Clients inactifs depuis plus de 60 jours — à risque de vous quitter définitivement."
      />

      {customers.length === 0 ? (
        <div className="panel flex flex-col items-center p-12 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="font-display mb-2 text-xl font-bold text-zinc-900">
            Excellente rétention !
          </h2>
          <p className="text-sm text-zinc-500">
            Aucun client inactif détecté. Votre programme de fidélité fonctionne parfaitement.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Loyalty Brain AI Panel */}
          <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-violet-50/30 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-violet-100">
                  <Sparkles className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <div className="mb-0.5 flex items-center gap-2">
                    <h2 className="font-display text-base font-bold text-violet-900">
                      Loyalty Brain
                    </h2>
                    <Badge variant="primary" size="sm">
                      IA
                    </Badge>
                  </div>
                  <p className="text-sm text-violet-700">
                    {customers.length} client{customers.length > 1 ? 's' : ''} à risque détecté
                    {customers.length > 1 ? 's' : ''}. Générez une campagne personnalisée.
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={fetchSuggestion}
                loading={suggestLoading}
              >
                {!suggestLoading && <Sparkles className="h-3.5 w-3.5" />}
                {suggestLoading ? 'Génération…' : 'Suggérer une campagne'}
              </Button>
            </div>

            {suggestion && (
              <div className="mt-5 space-y-4 border-t border-violet-200 pt-5">
                <div className="grid gap-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
                    Campagne suggérée
                  </p>
                  <p className="font-semibold text-violet-900">{suggestion.title}</p>
                  <p className="text-xs text-violet-600">À envoyer : {suggestion.send_at}</p>
                </div>
                <div className="rounded-xl border border-violet-100 bg-white/60 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-400">
                    Message
                  </p>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-violet-800">
                    {suggestion.message}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-violet-500">Raison : {suggestion.reason}</p>
                    <p className="mt-0.5 text-xs font-semibold text-violet-700">
                      Impact estimé : {suggestion.estimated_roi}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={sendReactivationCampaign}
                    loading={sendingAll}
                    className="gap-2"
                  >
                    {!sendingAll && <Send className="h-3.5 w-3.5" />}
                    {sendingAll ? 'Envoi en cours…' : 'Envoyer à tous'}
                  </Button>
                </div>
                {sentCount > 0 && (
                  <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    {sentCount} email{sentCount > 1 ? 's' : ''} envoyé{sentCount > 1 ? 's' : ''}{' '}
                    avec succès !
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Churn table */}
          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
              <h3 className="font-display text-sm font-semibold text-zinc-900">Clients inactifs</h3>
              <Badge variant="churn-high" dot>
                {customers.length} client{customers.length > 1 ? 's' : ''}
              </Badge>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50/50">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Client
                  </th>
                  <th className="hidden px-5 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:table-cell">
                    Points
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Dernière visite
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Inactivité
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {customers.map((c) => {
                  const name =
                    [c.first_name, c.last_name].filter(Boolean).join(' ') || c.email.split('@')[0]
                  return (
                    <tr key={c.id} className="group transition-colors hover:bg-zinc-50/70">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar fallback={name} size="sm" />
                          <div>
                            <p className="font-medium text-zinc-900">{name}</p>
                            <p className="text-xs text-zinc-400">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-5 py-3.5 sm:table-cell">
                        <span className="tabular font-semibold text-zinc-900">
                          {c.total_points}
                        </span>
                        <span className="ml-1 text-xs text-zinc-400">pts</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-zinc-500">
                        {formatRelativeDate(c.last_visit_at)}
                      </td>
                      <td className="px-5 py-3.5">
                        {c.churn_days && (
                          <Badge variant="churn-high" size="sm">
                            {c.churn_days}j
                          </Badge>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/dashboard/customers/${c.id}` as Route}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 opacity-0 transition-all hover:text-violet-700 group-hover:opacity-100"
                        >
                          Profil
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
