import type { Route } from 'next'
import Link from 'next/link'

const navItems: Array<{ href: Route; label: string }> = [
  { href: '/dashboard' as Route, label: "Vue d'ensemble" },
  { href: '/dashboard/customers' as Route, label: 'Clients' },
  { href: '/dashboard/program' as Route, label: 'Programme' },
  { href: '/dashboard/alerts' as Route, label: 'Alertes' },
  { href: '/dashboard/settings' as Route, label: 'Paramètres' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm">
        <div className="p-6">
          <span className="text-lg font-bold text-gray-900">LoyaltyFlow</span>
          <span className="ml-1 text-xs font-medium text-brand-600">AI</span>
        </div>
        <nav className="px-3 pb-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
