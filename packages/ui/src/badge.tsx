import type { ChurnLevel } from '@loyaltyflowai/types'
import * as React from 'react'

const churnConfig: Record<ChurnLevel, { label: string; className: string }> = {
  LOW: { label: 'Fidèle', className: 'bg-green-100 text-green-800' },
  MEDIUM: { label: 'À surveiller', className: 'bg-orange-100 text-orange-800' },
  HIGH: { label: 'À risque', className: 'bg-red-100 text-red-800' },
}

interface ChurnBadgeProps {
  level: ChurnLevel
}

export function ChurnBadge({ level }: ChurnBadgeProps) {
  const config = churnConfig[level]
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}

