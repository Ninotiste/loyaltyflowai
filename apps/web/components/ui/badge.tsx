import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-semibold transition-colors select-none',
  {
    variants: {
      variant: {
        default: 'bg-zinc-100 text-zinc-700',
        primary: 'bg-violet-100 text-violet-700',
        secondary: 'bg-zinc-100 text-zinc-600',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-amber-100 text-amber-700',
        danger: 'bg-red-100 text-red-600',
        outline: 'border border-zinc-200 text-zinc-600 bg-transparent',
        'churn-low': 'bg-green-100 text-green-700',
        'churn-medium': 'bg-amber-100 text-amber-700',
        'churn-high': 'bg-red-100 text-red-600',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-xs px-2.5 py-0.5',
        lg: 'text-sm px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean
}

function Badge({ className, variant, size, dot = false, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size, className }))} {...props}>
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 flex-shrink-0 rounded-full',
            variant === 'success' || variant === 'churn-low' ? 'bg-green-500' : '',
            variant === 'warning' || variant === 'churn-medium' ? 'bg-amber-500' : '',
            variant === 'danger' || variant === 'churn-high' ? 'bg-red-500' : '',
            variant === 'primary' ? 'bg-violet-500' : '',
            ![
              'success',
              'churn-low',
              'warning',
              'churn-medium',
              'danger',
              'churn-high',
              'primary',
            ].includes(variant ?? '')
              ? 'bg-zinc-400'
              : ''
          )}
        />
      )}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
