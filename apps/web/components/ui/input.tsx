'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, type, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="select-none text-sm font-medium text-zinc-700">
            {label}
            {props.required && <span className="ml-0.5 text-red-500">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 flex items-center text-zinc-400">
              {leftIcon}
            </span>
          )}
          <input
            type={type}
            id={inputId}
            ref={ref}
            className={cn(
              'duration-250 h-10 w-full rounded-xl border bg-white px-3.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400',
              'border-zinc-200 hover:border-zinc-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20',
              'disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400',
              error && 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 flex items-center text-zinc-400">{rightIcon}</span>
          )}
        </div>
        {error && <p className="flex items-center gap-1 text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-zinc-400">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
