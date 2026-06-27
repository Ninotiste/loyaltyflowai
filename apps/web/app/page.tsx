import { redirect } from 'next/navigation'

// La page racine redirige vers le dashboard (ou login si non authentifié —
// géré par le middleware)
export default function RootPage() {
  redirect('/dashboard')
}
