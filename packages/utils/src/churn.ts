import type { ChurnLevel } from '@loyaltyflowai/types'

export function getDaysSinceLastVisit(lastVisitAt: Date | null): number {
  if (!lastVisitAt) return Infinity
  const now = new Date()
  const diffMs = now.getTime() - lastVisitAt.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

export function calculateChurnLevel(
  lastVisitAt: Date | null,
  thresholdDays: number
): ChurnLevel {
  const days = getDaysSinceLastVisit(lastVisitAt)
  if (days < thresholdDays / 2) return 'LOW'
  if (days < thresholdDays) return 'MEDIUM'
  return 'HIGH'
}
