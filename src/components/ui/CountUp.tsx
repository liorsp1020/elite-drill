'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  value: number
  duration?: number
  format?: (n: number) => string
}

// Animates a number counting up to `value` (from 0 on first mount, from the previous
// displayed value on subsequent changes) using an eased requestAnimationFrame loop —
// the "numbers count up" premium touch used across the Home screen's stats.
export default function CountUp({ value, duration = 800, format }: CountUpProps) {
  const [display, setDisplay] = useState(0)
  const fromRef = useRef(0)

  useEffect(() => {
    const from = fromRef.current
    const to = value
    let start: number | null = null
    let raf: number

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(1, elapsed / duration)
      const eased = 1 - (1 - progress) ** 3
      setDisplay(from + (to - from) * eased)
      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration])

  const rounded = Math.round(display)
  return <>{format ? format(rounded) : rounded}</>
}
