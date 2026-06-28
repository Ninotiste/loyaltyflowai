'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Route } from 'next'
import Link from 'next/link'
import { Search, Users, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Avatar } from '@/components/ui/avatar'

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

const CHURN_VARIANT = {
  LOW: { variant: 'churn-low' as const, label: 'Actif' },
  MEDIUM: { variant: 'churn-medium' as const, label: 'À risque' },
  HIGH: { variant: 'churn-high' as const, label: 'Inactif' },
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24))
  if (days === 0) return "aujourd'hui"
  if (days === 1) return 'hier'
  if (days < 7) return `il y a ${days}j`
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
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
    async (cursor?: string | null, append = false) => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ limit: '50' })
        if (search) params.set('search', search)
        if (churnFilter) params.set('churn', churnFilter)
        if (cursor) params.set('cursor', cursor)

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

  return (
    <div>
      <PageHeader
        title="Clients"
        description={`${meta.total} client${meta.total > 1 ? 's' : ''} au total`}
      />

      {/* Filters */}
      <div className="mb-5 flex gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            placeholder="Rechercher par email, prénom, nom…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>
        <select
          value={churnFilter}
          onChange={(e) => setChurnFilter(e.target.value)}
          className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 outline-none transition-all hover:border-zinc-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
        >
          <option value="">Tous les statuts</option>
          <option value="LOW">Actifs seulement</option>
          <option value="MEDIUM">À risque</option>
          <option value="HIGH">Inactifs</option>
        </select>
      </div>

      {/* Table */}
      <div className="panel overflow-hidden">
        {loading && customers.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <Spinner size="md" />
          </div>
        ) : customers.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2">
            <Users className="h-8 w-8 text-zinc-300" />
            <p className="text-sm text-zinc-500">Aucun client trouvé</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50/50">
              <tr>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Client
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Points
                </th>
                <th className="hidden px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:table-cell">
                  Dernière visite
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Statut
                </th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {customers.map((c) => {
                const churn = c.churn_score
                  ? CHURN_VARIANT[c.churn_score as keyof typeof CHURN_VARIANT]
                  : null
                const name = [c.first_name, c.last_name].filter(Boolean).join(' ') || '—'
                const initials = name !== '—' ? name : c.email.split('@')[0]

                return (
                  <tr key={c.id} className="group transition-colors hover:bg-zinc-50/70">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar fallback={initials} size="sm" />
                        <div>
                          <p className="font-medium text-zinc-900">{name}</p>
                          <p className="text-xs text-zinc-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="tabular font-semibold text-zinc-900">
                        {c.total_points.toLocaleString('fr-FR')}
                      </span>
                      <span className="ml-1 text-xs text-zinc-400">pts</span>
                    </td>
                    <td className="hidden px-5 py-3.5 text-zinc-500 sm:table-cell">
                      {formatDate(c.last_visit_at)}
                    </td>
                    <td className="px-5 py-3.5">
                      {churn ? (
                        <Badge variant={churn.variant} dot size="md">
                          {churn.label}
                        </Badge>
                      ) : (
                        <span className="text-zinc-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/dashboard/customers/${c.id}` as Route}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 opacity-0 transition-colors hover:text-violet-700 group-hover:opacity-100"
                      >
                        Voir
                        <ChevronRight className="h-3.5 w-3.5" />
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchCustomers(meta.next_cursor, true)}
            loading={loading}
          >
            Charger plus
          </Button>
        </div>
      )}
    </div>
  )
}
