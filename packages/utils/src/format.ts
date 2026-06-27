export function formatPoints(points: number): string {
  return `${points.toLocaleString('fr-FR')} pts`
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return email
  const masked = local.slice(0, 2) + '***'
  return `${masked}@${domain}`
}
