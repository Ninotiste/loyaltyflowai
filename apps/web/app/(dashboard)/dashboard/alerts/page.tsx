'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Route } from 'next'

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

interface SuggestionsResponse {
  suggestion: AiSuggestion | null
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
        const d: SuggestionsResponse = await res.json()
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
        <div className="border-brand-600 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alertes Churn</h1>
        <p className="mt-1 text-sm text-gray-500">
          Clients inactifs depuis plus de 60 jours — à risque de vous quitter définitivement.
        </p>
      </div>

      {customers.length === 0 ? (
        <div className="rounded-xl bg-green-50 p-8 text-center ring-1 ring-green-200">
          <p className="text-2xl font-bold text-green-700">Excellente rétention !</p>
          <p className="mt-2 text-sm text-green-600">
            Aucun client inactif détecté. Continuez comme ça.
          </p>
        </div>
      ) : (
        <>
          {/* AI Suggestion Box */}
          <div className="rounded-xl bg-indigo-50 p-6 ring-1 ring-indigo-200">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-indigo-900">Loyalty Brain — Suggestion IA</h2>
                <p className="mt-1 text-sm text-indigo-700">
                  {customers.length} client{customers.length > 1 ? 's' : ''} à risque détecté
                  {customers.length > 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={fetchSuggestion}
                disabled={suggestLoading}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {suggestLoading ? 'Génération...' : 'Suggérer une campagne'}
              </button>
            </div>

            {suggestion && (
              <div className="mt-4 space-y-3 border-t border-indigo-200 pt-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                    Campagne suggérée
                  </p>
                  <p className="text-sm font-medium text-indigo-900">{suggestion.title}</p>
                  <p className="mt-0.5 text-xs text-indigo-600">À envoyer : {suggestion.send_at}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                    Message
                  </p>
                  <p className="whitespace-pre-line text-sm text-indigo-800">
                    {suggestion.message}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-indigo-600">
                    Impact estimé : {suggestion.estimated_roi}
                  </p>
                  <button
                    onClick={sendReactivationCampaign}
                    disabled={sendingAll}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {sendingAll ? 'Envoi...' : 'Envoyer à tous'}
                  </button>
                </div>
                {sentCount > 0 && (
                  <p className="text-sm font-medium text-green-600">
                    {sentCount} email{sentCount > 1 ? 's' : ''} envoyé{sentCount > 1 ? 's' : ''}{' '}
                    avec succès !
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Churn customer list */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Client</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Points</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Dernière visite</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Inactivité</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c) => {
                  const name = [c.first_name, c.last_name].filter(Boolean).join(' ') || c.email
                  return (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{name}</p>
                        <p className="text-xs text-gray-500">{c.email}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {c.total_points} pts
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatRelativeDate(c.last_visit_at)}
                      </td>
                      <td className="px-4 py-3">
                        {c.churn_days && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                            {c.churn_days} jours
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/dashboard/customers/${c.id}` as Route}
                          className="text-brand-600 hover:underline"
                        >
                          Profil
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
