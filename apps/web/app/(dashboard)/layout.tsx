import { Sidebar } from '@/components/layout/sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 p-6 pb-24 lg:p-8 lg:pb-8">{children}</main>
      </div>

      <MobileNav />
    </div>
  )
}
