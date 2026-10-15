'use client'

import { useMemo } from 'react'
import { Trophy, Lock } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'
import { ACHIEVEMENTS, relativeDateLabel } from '@/utils/progress'
import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import ScreenHeader from '@/components/ui/ScreenHeader'

export default function AchievementsScreen() {
  const { userProgress, setActiveTab } = useAppContext()

  const now = useMemo(() => new Date(), [])
  const unlockedCount = userProgress.unlockedAchievementIds.length
  const pct = useMemo(() => (unlockedCount / ACHIEVEMENTS.length) * 100, [unlockedCount])

  return (
    <div className="space-y-6">
      <ScreenHeader title="Achievements" onBack={() => setActiveTab('home')} />

      <Card>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">{unlockedCount} of {ACHIEVEMENTS.length} unlocked</p>
          <p className="text-sm font-semibold text-gold">{Math.round(pct)}%</p>
        </div>
        <ProgressBar value={pct} className="mt-2.5" animateOnMount />
      </Card>

      {/* Gold matches the treatment already used for achievements on the Home preview and
          Completion screen — kept consistent rather than the generic accent orange, so
          achievements read as their own category of "special" moment. */}
      <div className="space-y-3">
        {ACHIEVEMENTS.map((achievement, index) => {
          const unlocked = userProgress.unlockedAchievementIds.includes(achievement.id)
          const unlockedDate = userProgress.achievementUnlockedDates[achievement.id]
          return (
            <Card key={achievement.id} animateIndex={index} className={`flex items-center gap-3 ${unlocked ? 'border-gold/30' : 'opacity-60'}`}>
              <div className={`flex h-12 w-12 flex-none items-center justify-center rounded-full ${unlocked ? 'bg-gold text-white' : 'bg-surface2 text-ink-faint'}`}>
                {unlocked ? <Trophy className="h-6 w-6" strokeWidth={2} /> : <Lock className="h-5 w-5" strokeWidth={2} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-base font-bold ${unlocked ? 'text-ink' : 'text-ink-muted'}`}>{achievement.title}</p>
                <p className="text-xs text-ink-faint">{achievement.description}</p>
              </div>
              {unlocked ? (
                <span className="flex-none text-right text-xs font-bold uppercase tracking-[0.1em] text-gold">
                  {unlockedDate ? relativeDateLabel(unlockedDate, now) : 'Done'}
                </span>
              ) : null}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
