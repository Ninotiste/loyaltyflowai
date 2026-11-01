import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LoyaltyFlowAI',
  description: 'Fidélisation client intelligente pour la restauration',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      style={{
        '--font-inter': 'Inter, Arial, sans-serif',
        '--font-jakarta': '"Plus Jakarta Sans", Inter, Arial, sans-serif',
      } as React.CSSProperties}
    >
      <body className="font-sans">{children}</body>
    </html>
  )
}
