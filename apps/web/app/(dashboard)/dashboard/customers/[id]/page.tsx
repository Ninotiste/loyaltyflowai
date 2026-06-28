'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { Route } from 'next'

interface Transaction {
  id: string
  type: string
  amount: number
  reason: string | null
  created_at: string
}

interface CustomerDetail {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  total_points: number
  last_visit_at: string | null
  created_at: string
  churn_score: string | null
  churn_days: number | null
  point_transactions: Transaction[]
}

const TX_LABEL: Record<string, string> = {
  EARN_VISIT: 'Visite',
  EARN_AMOUNT: 'Achat',
  EARN_MANUAL: 'Manuel',
  REDEEM_REWARD: 'Récompense',
  ADJUST_MANUAL: 'Ajustement',
}

const CHURN_META = {
  LOW: {
    label: 'Actif',
    color: 'text-green-600',
    bg: 'bg-green-50',
    desc: 'Visite récente (< 30 jours)',
  },
  MEDIUM: {
    label: 'À risque',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    desc: 'Inactif depuis 30 à 60 jours',
  },
  HIGH: {
    label: 'Inactif',
    color: 'text-red-600',
    bg: 'bg-red-50',
    desc: 'Inactif depuis plus de 60 jours',
  },
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [customer, setCustomer] = useState<CustomerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [pointsModal, setPointsModal] = useState(false)
  const [pointsAmount, setPointsAmount] = useState('')
  const [pointsReason, setPointsReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/v1/customers/${id}`)
      .then((r) => r.json())
      .then((d) => setCustomer(d.customer))
      .finally(() => setLoading(false))
  }, [id])

  async function handleAddPoints(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch(`/api/v1/customers/${id}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'manual',
          points: parseInt(pointsAmount),
          reason: pointsReason,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setCustomer((prev) => (prev ? { ...prev, total_points: data.customer.total_points } : prev))
        setPointsModal(false)
        setPointsAmount('')
        setPointsReason('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleExport() {
    const res = await fetch(`/api/v1/customers/${id}/export`)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `export-${id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleAnonymize() {
    if (
      !confirm('Cette action est irréversible. Confirmer la suppression des données personnelles ?')
    )
      return
    const res = await fetch(`/api/v1/customers/${id}/anonymize`, { method: 'POST' })
    if (res.ok) router.push('/dashboard/customers' as Route)
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-brand-600 h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    )
  }

  if (!customer) {
    return <div className="text-center text-gray-500">Client introuvable.</div>
  }

  const name =
    [customer.first_name, customer.last_name].filter(Boolean).join(' ') || 'Client anonyme'
  const churnMeta = customer.churn_score
    ? CHURN_META[customer.churn_score as keyof typeof CHURN_META]
    : null

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
          <p className="text-sm text-gray-500">{customer.email}</p>
          {customer.phone && <p className="text-sm text-gray-500">{customer.phone}</p>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPointsModal(true)}
            className="bg-brand-600 hover:bg-brand-700 rounded-lg px-3 py-2 text-sm font-medium text-white"
          >
            + Points
          </button>
          <button
            onClick={handleExport}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Exporter (RGPD)
          </button>
          <button
            onClick={handleAnonymize}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Anonymiser
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
          <p className="text-sm text-gray-500">Points totaux</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {customer.total_points.toLocaleString('fr-FR')}
          </p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
          <p className="text-sm text-gray-500">Dernière visite</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {formatDate(customer.last_visit_at)}
          </p>
          {customer.churn_days && (
            <p className="text-sm text-gray-400">il y a {customer.churn_days} j</p>
          )}
        </div>
        <div
          className={`rounded-xl p-5 shadow-sm ring-1 ring-gray-200 ${churnMeta?.bg ?? 'bg-white'}`}
        >
          <p className="text-sm text-gray-500">Statut fidélité</p>
          <p className={`mt-1 text-lg font-semibold ${churnMeta?.color ?? 'text-gray-900'}`}>
            {churnMeta?.label ?? '—'}
          </p>
          {churnMeta && <p className="text-xs text-gray-500">{churnMeta.desc}</p>}
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Historique des transactions</h2>
        </div>
        {customer.point_transactions.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-sm text-gray-500">
            Aucune transaction
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Date</th>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Type</th>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Raison</th>
                <th className="px-5 py-3 text-right font-medium text-gray-600">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customer.point_transactions.map((t) => (
                <tr key={t.id}>
                  <td className="px-5 py-3 text-gray-500">{formatDate(t.created_at)}</td>
                  <td className="px-5 py-3 text-gray-700">{TX_LABEL[t.type] ?? t.type}</td>
                  <td className="px-5 py-3 text-gray-500">{t.reason ?? '—'}</td>
                  <td
                    className={`px-5 py-3 text-right font-semibold ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {t.amount >= 0 ? '+' : ''}
                    {t.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pointsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Attribuer des points manuellement
            </h3>
            <form onSubmit={handleAddPoints} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Points à attribuer
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={pointsAmount}
                  onChange={(e) => setPointsAmount(e.target.value)}
                  required
                  className="focus:ring-brand-500 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Raison (optionnel)
                </label>
                <input
                  type="text"
                  value={pointsReason}
                  onChange={(e) => setPointsReason(e.target.value)}
                  placeholder="Ex: Correction, événement spécial..."
                  className="focus:ring-brand-500 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPointsModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-600 hover:bg-brand-700 flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  {submitting ? 'En cours...' : 'Attribuer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
