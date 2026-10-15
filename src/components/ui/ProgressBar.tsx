'use client'

import { useEffect, useState } from 'react'

interface ProgressBarProps {
  value: number // 0-100
  className?: string
  // When true, the bar starts at 0 and animates up to `value` right after mount instead of
  // snapping straight to it — used where a "filling up" moment should feel earned (e.g. the
  // Skill Level bar on Home), as opposed to routine navigation progress that should just be
  // correct immediately.
  animateOnMount?: boolean
}

// Single progress-bar primitive — used for workout progress ("Exercise 3 of 8"), skill
// level, achievement completion, and anywhere else a linear completion state needs to
// render. Always the app's single accent color.
export default function ProgressBar({ value, className = '', animateOnMount = false }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  const [displayValue, setDisplayValue] = useState(animateOnMount ? 0 : clamped)

  useEffect(() => {
    if (!animateOnMount) {
      setDisplayValue(clamped)
      return
    }
    const frame = requestAnimationFrame(() => setDisplayValue(clamped))
    return () => cancelAnimationFrame(frame)
    // Only re-run the "animate from 0" entrance on mount; subsequent value changes while
    // mounted should still update smoothly via the value dependency below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (animateOnMount) setDisplayValue(clamped)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clamped])

  return (
    <div className={`h-2 w-full overflow-hidden rounded-pill bg-surface2 ${className}`}>
      <div
        className="h-full rounded-pill bg-accent transition-[width] duration-700 ease-out"
        style={{ width: `${displayValue}%` }}
      />
    </div>
  )
}
