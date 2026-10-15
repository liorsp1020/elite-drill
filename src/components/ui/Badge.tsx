'use client'

import type { ReactNode } from 'react'

type Tone = 'accent' | 'neutral' | 'outline'

interface BadgeProps {
  children: ReactNode
  tone?: Tone
  icon?: ReactNode
}

const toneClasses: Record<Tone, string> = {
  accent: 'bg-accent/15 text-accent-light',
  neutral: 'bg-surface2 text-ink-muted',
  outline: 'border border-border text-ink-muted',
}

// Small rounded pill used for difficulty, duration, category, equipment tags —
// anywhere a short label needs to sit inline without competing with body text.
export default function Badge({ children, tone = 'neutral', icon }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-pill px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}>
      {icon}
      {children}
    </span>
  )
}
