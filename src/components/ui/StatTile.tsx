'use client'

import type { ReactNode } from 'react'

type Tone = 'accent' | 'green' | 'gold' | 'neutral'

interface StatTileProps {
  icon: ReactNode
  label: string
  value: ReactNode
  sub?: string
  tone?: Tone
  size?: 'md' | 'lg'
}

const TONE_CLASSES: Record<Tone, string> = {
  accent: 'bg-accent/15 text-accent',
  green: 'bg-success/15 text-success',
  gold: 'bg-gold/15 text-gold',
  neutral: 'bg-surface2 text-ink-muted',
}

// Compact stat display used across the Home and Statistics screens (total workouts,
// training time, exercises completed, ...) — one consistent shape for every "number +
// label" tile in the app instead of each screen inventing its own. `tone` defaults to the
// original accent-only look so existing callers render unchanged; `size="lg"` gives the
// Home screen's Quick Stats strip room for larger icons.
export default function StatTile({ icon, label, value, sub, tone = 'accent', size = 'md' }: StatTileProps) {
  const iconBox = size === 'lg' ? 'h-11 w-11' : 'h-9 w-9'
  return (
    <div className={`rounded-card border border-border bg-surface p-4 ${size === 'lg' ? 'shadow-card' : ''}`}>
      <div className={`flex items-center justify-center rounded-full ${iconBox} ${TONE_CLASSES[tone]}`}>{icon}</div>
      <p className="mt-3 text-2xl font-bold text-ink">{value}</p>
      <p className="text-xs font-semibold text-ink-muted">{label}</p>
      {sub ? <p className="mt-0.5 text-[11px] text-ink-faint">{sub}</p> : null}
    </div>
  )
}
