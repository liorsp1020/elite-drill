'use client'

import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  interactive?: boolean
  animateIndex?: number
}

// The single card primitive — rounded corners, soft elevation, comfortable internal
// spacing. `interactive` adds a tap affordance (plus keyboard/role semantics, since it
// stands in for a button in several screens) for cards that act as buttons.
// `animateIndex` staggers the card-in entrance animation for lists (see globals.css).
export default function Card({ children, interactive = false, animateIndex, className = '', style, onClick, onKeyDown, ...rest }: CardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (!interactive || !onClick) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      ;(onClick as unknown as (e: typeof event) => void)(event)
    }
  }

  return (
    <div
      className={`animate-card-in rounded-card border border-border bg-surface p-5 shadow-card ${interactive ? 'tap-shrink cursor-pointer active:border-accent/40' : ''} ${className}`}
      style={animateIndex !== undefined ? { animationDelay: `${Math.min(animateIndex, 8) * 60}ms`, ...style } : style}
      onClick={onClick}
      onKeyDown={interactive ? handleKeyDown : onKeyDown}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...rest}
    >
      {children}
    </div>
  )
}
