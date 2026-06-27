'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Route } from 'next'
import Link from 'next/link'

interface Customer {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  total_points: number
  last_visit_at: string | null
  created_at: string
  churn_score: string | null
  churn_days: number | null
}

interface CustomersResponse {
  data: Customer[]
  meta: { total: number; limit: number; next_cursor: string | null }
}

const CHURN_BADGE = {
  LOW: { label: 'Actif', className: 'bg-green-100 text-green-700' },
  MEDIUM: { label: 'À risque', className: 'bg-amber-100 text-amber-700' },
  HIGH: { label: 'Inactif', className: 'bg-red-100 text-red-700' },
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [meta, setMeta] = useState<{ total: number; next_cursor: string | null }>({
    total: 0,
    next_cursor: null,
  })
  const [search, setSearch] = useState('')
  const [churnFilter, setChurnFilter] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchCustomers = useCallback(
    async (newCursor?: string | null, append = false) => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ limit: '50' })
        if (search) params.set('search', search)
        if (churnFilter) params.set('churn', churnFilter)
        if (newCursor) params.set('cursor', newCursor)

        const res = await fetch(`/api/v1/customers?${params}`)
        if (!res.ok) return
        const data: CustomersResponse = await res.json()
        setCustomers((prev) => (append ? [...prev, ...data.data] : data.data))
        setMeta({ total: data.meta.total, next_cursor: data.meta.next_cursor })
      } finally {
        setLoading(false)
      }
    },
    [search, churnFilter]
  )

  useEffect(() => {
    fetchCustomers(null)
  }, [search, churnFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  function loadMore() {
    if (meta.next_cursor) {
      fetchCustomers(meta.next_cursor, true)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="mt-1 text-sm text-gray-500">
            {meta.total} client{meta.total > 1 ? 's' : ''} au total
          </p>
        </div>
      </div>

      <div className="mb-4 flex gap-3">
        <input
          type="search"
          placeholder="Rechercher par email, prénom, nom..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="focus:ring-brand-500 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
        />
        <select
          value={churnFilter}
          onChange={(e) => setChurnFilter(e.target.value)}
          className="focus:ring-brand-500 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2"
        >
          <option value="">Tous les statuts</option>
          <option value="LOW">Actifs</option>
          <option value="MEDIUM">À risque</option>
          <option value="HIGH">Inactifs</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        {loading && customers.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <div className="border-brand-600 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        ) : customers.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-gray-500">
            Aucun client trouvé
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Client</th>
                <th className="px-4 py-3 font-medium text-gray-600">Points</th>
                <th className="px-4 py-3 font-medium text-gray-600">Dernière visite</th>
                <th className="px-4 py-3 font-medium text-gray-600">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c) => {
                const badge = c.churn_score
                  ? CHURN_BADGE[c.churn_score as keyof typeof CHURN_BADGE]
                  : null
                const name = [c.first_name, c.last_name].filter(Boolean).join(' ') || '—'
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{name}</div>
                      <div className="text-gray-500">{c.email}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {c.total_points.toLocaleString('fr-FR')} pts
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(c.last_visit_at)}</td>
                    <td className="px-4 py-3">
                      {badge ? (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/dashboard/customers/${c.id}` as Route}
                        className="text-brand-600 hover:text-brand-700 hover:underline"
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {meta.next_cursor && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {loading ? 'Chargement...' : 'Charger plus'}
          </button>
        </div>
      )}
    </div>
  )
}
