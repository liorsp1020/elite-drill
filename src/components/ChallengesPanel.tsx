'use client'

import { useMemo } from 'react'
import type { Profile } from '@/types'
import { buildWeeklyChallenges } from '@/utils/workouts'
import { useAppContext } from '@/context/AppContext'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import ScreenHeader from '@/components/ui/ScreenHeader'

interface ChallengesPanelProps {
  profile: Profile
}

export default function ChallengesPanel({ profile }: ChallengesPanelProps) {
  const { setActiveTab } = useAppContext()
  const challenges = useMemo(() => buildWeeklyChallenges(profile), [profile])

  return (
    <div className="space-y-5">
      <ScreenHeader
        title="Weekly Challenges"
        subtitle="Two fresh targets each week, matched to your skill level."
        onBack={() => setActiveTab('home')}
        trailing={<Badge tone="accent">Lv {profile.skillLevel}/7</Badge>}
      />

      <div className="space-y-4">
        {challenges.map((challenge, index) => (
          <Card key={`${challenge.title}-${index}`} animateIndex={index}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-faint">Challenge {index + 1}</p>
              <Badge tone="accent">{challenge.difficulty}</Badge>
            </div>
            <h3 className="mt-3 text-lg font-bold text-ink">{challenge.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{challenge.description}</p>
            <div className="mt-4 rounded-2xl bg-surface2 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-faint">Target</p>
              <p className="mt-1 text-sm font-semibold text-ink">{challenge.target}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
