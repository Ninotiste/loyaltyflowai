'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Route } from 'next'
import { LayoutDashboard, Users, Gift, Bell, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard' as Route, label: 'Accueil', icon: LayoutDashboard },
  { href: '/dashboard/customers' as Route, label: 'Clients', icon: Users },
  { href: '/dashboard/program' as Route, label: 'Programme', icon: Gift },
  { href: '/dashboard/alerts' as Route, label: 'Alertes', icon: Bell },
  { href: '/dashboard/settings' as Route, label: 'Réglages', icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="pb-safe fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white/95 backdrop-blur lg:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive =
            item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex min-w-0 flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-200',
                isActive ? 'text-violet-600' : 'text-zinc-400'
              )}
            >
              <item.icon
                style={{ height: '1.25rem', width: '1.25rem' }}
                className={cn('transition-transform', isActive && 'scale-110')}
              />
              <span className={cn('truncate text-[10px] font-medium', isActive && 'font-semibold')}>
                {item.label}
              </span>
              {isActive && <span className="absolute top-1 h-0.5 w-6 rounded-full bg-violet-600" />}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
