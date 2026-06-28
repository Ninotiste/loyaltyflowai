'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Route } from 'next'
import {
  LayoutDashboard,
  Users,
  Gift,
  Bell,
  Settings,
  Zap,
  BarChart3,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard' as Route, label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: '/dashboard/customers' as Route, label: 'Clients', icon: Users },
  { href: '/dashboard/program' as Route, label: 'Programme', icon: Gift },
  { href: '/dashboard/alerts' as Route, label: 'Alertes', icon: Bell },
  { href: '/dashboard/analytics' as Route, label: 'Analytiques', icon: BarChart3 },
  { href: '/dashboard/settings' as Route, label: 'Paramètres', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 hidden h-screen w-60 flex-shrink-0 overflow-y-auto border-r border-zinc-200 bg-white lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-16 flex-shrink-0 items-center gap-2.5 border-b border-zinc-100 px-5">
        <div className="shadow-sm-violet flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-violet-700">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="font-display text-sm font-bold leading-none text-zinc-900">LoyaltyFlowAI</p>
          <p className="mt-0.5 text-[10px] font-medium text-zinc-400">Programme fidélité IA</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-violet-50 text-violet-700'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              )}
            >
              <item.icon
                className={cn(
                  'flex-shrink-0 transition-colors',
                  isActive ? 'text-violet-600' : 'text-zinc-400 group-hover:text-zinc-600'
                )}
                style={{ height: '1.125rem', width: '1.125rem' }}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="h-3.5 w-3.5 text-violet-400" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer — plan info */}
      <div className="flex-shrink-0 px-3 pb-4">
        <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-violet-100/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="animate-pulse-slow h-1.5 w-1.5 rounded-full bg-green-500" />
            <span className="text-xs font-semibold text-violet-700">Plan Starter</span>
          </div>
          <p className="text-xs text-violet-500">Essai gratuit · 12 jours restants</p>
          <Link
            href={'/dashboard/settings' as Route}
            className="mt-3 inline-flex items-center text-xs font-semibold text-violet-600 transition-colors hover:text-violet-700"
          >
            Passer à Pro
            <ChevronRight className="ml-0.5 h-3 w-3" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
