'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        primary:
          'bg-violet-600 text-white shadow-md-violet hover:bg-violet-700 active:bg-violet-800 active:scale-[0.98]',
        secondary:
          'bg-white text-violet-700 border border-violet-200 shadow-sm hover:bg-violet-50 hover:border-violet-300 active:scale-[0.98]',
        ghost: 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 active:scale-[0.98]',
        destructive:
          'bg-red-500 text-white shadow-sm hover:bg-red-600 active:bg-red-700 active:scale-[0.98]',
        outline:
          'border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:bg-zinc-50 hover:text-zinc-900 active:scale-[0.98]',
        amber:
          'bg-amber-500 text-white shadow-sm hover:bg-amber-600 active:bg-amber-700 active:scale-[0.98]',
        link: 'text-violet-600 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        xs: 'h-7 rounded-lg px-2.5 text-xs',
        sm: 'h-8 rounded-lg px-3 text-sm',
        md: 'h-10 rounded-xl px-4 text-sm',
        lg: 'h-11 rounded-xl px-6 text-base',
        xl: 'h-12 rounded-2xl px-8 text-base',
        icon: 'h-10 w-10 rounded-xl',
        'icon-sm': 'h-8 w-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, children, disabled, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
