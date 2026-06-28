'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number
  color?: 'violet' | 'amber' | 'green' | 'red'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const colorMap = {
  violet: 'bg-violet-600',
  amber: 'bg-amber-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
}

const sizeMap = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

function Progress({
  value = 0,
  color = 'violet',
  size = 'md',
  showLabel = false,
  className,
  ...props
}: ProgressProps) {
  return (
    <div className="flex w-full items-center gap-3">
      <ProgressPrimitive.Root
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-zinc-100',
          sizeMap[size],
          className
        )}
        value={value}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            'ease-smooth h-full rounded-full transition-all duration-500',
            colorMap[color]
          )}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </ProgressPrimitive.Root>
      {showLabel && (
        <span className="tabular w-8 flex-shrink-0 text-right text-xs font-semibold text-zinc-500">
          {Math.round(value)}%
        </span>
      )}
    </div>
  )
}

export { Progress }
