'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'lg' | 'md' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  icon?: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-white shadow-card hover:bg-accent-light disabled:bg-accent/40',
  secondary: 'bg-surface2 text-ink border border-border hover:border-accent/50 disabled:opacity-40',
  ghost: 'bg-transparent text-ink-muted hover:bg-surface2 hover:text-ink disabled:opacity-40',
  danger: 'bg-surface2 text-red-400 border border-red-500/30 hover:bg-red-500/10 disabled:opacity-40',
}

const sizeClasses: Record<Size, string> = {
  lg: 'h-14 px-6 text-base rounded-[1.1rem]',
  md: 'h-12 px-5 text-sm rounded-2xl',
  sm: 'h-10 px-4 text-sm rounded-xl',
}

// The single button primitive for the whole app — every tappable action should route
// through this so sizing, radius, and press-feedback stay consistent everywhere.
export default function Button({
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  icon,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`tap-shrink inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
