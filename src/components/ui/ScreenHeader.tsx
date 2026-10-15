'use client'

import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  trailing?: ReactNode
}

// Header for "pushed" screens reached from an action rather than a permanent bottom-nav
// tab (e.g. the generated Workout screen, Challenges) — a back chevron plus title, the
// pattern every native app uses for a non-root screen.
export default function ScreenHeader({ title, subtitle, onBack, trailing }: ScreenHeaderProps) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="tap-shrink mt-0.5 flex h-11 w-11 flex-none items-center justify-center rounded-full border border-border bg-surface text-ink"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
          </button>
        ) : null}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-ink-muted">{subtitle}</p> : null}
        </div>
      </div>
      {trailing}
    </div>
  )
}
