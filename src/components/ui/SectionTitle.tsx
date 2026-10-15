'use client'

import type { ReactNode } from 'react'

interface SectionTitleProps {
  children: ReactNode
  trailing?: ReactNode
}

// Medium section-title used to break up a screen into clearly labeled groups
// (e.g. "Categories", "Duration", "Last Workout") with generous surrounding space.
export default function SectionTitle({ children, trailing }: SectionTitleProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-ink-muted">{children}</h2>
      {trailing}
    </div>
  )
}
