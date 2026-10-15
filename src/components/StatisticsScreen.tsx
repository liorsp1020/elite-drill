'use client'

import { useMemo } from 'react'
import { Trophy, Clock, ListChecks, CalendarDays, CalendarRange, Star } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'
import {
  formatTrainingMinutes,
  countCompletionsInLastDays,
  dailyActivityForLastDays,
  favoriteCategory,
} from '@/utils/progress'
import { CategoryIcon } from '@/utils/categoryIcons'
import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import ScreenHeader from '@/components/ui/ScreenHeader'
import StatTile from '@/components/ui/StatTile'

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MAX_SKILL_LEVEL = 7

export default function StatisticsScreen() {
  const { profile, userProgress, setActiveTab } = useAppContext()

  const now = useMemo(() => new Date(), [])
  const skillLevel = profile?.skillLevel ?? 4
  const weeklyWorkouts = useMemo(() => countCompletionsInLastDays(userProgress.completionDates, 7, now), [userProgress.completionDates, now])
  const monthlyWorkouts = useMemo(() => countCompletionsInLastDays(userProgress.completionDates, 30, now), [userProgress.completionDates, now])
  const activity = useMemo(() => dailyActivityForLastDays(userProgress.completionDates, 7, now), [userProgress.completionDates, now])
  const favorite = useMemo(() => favoriteCategory(userProgress.categoryCompletionCounts), [userProgress.categoryCompletionCounts])
  const maxDaily = Math.max(1, ...activity.map((a) => a.count))

  return (
    <div className="space-y-6">
      <ScreenHeader title="Statistics" onBack={() => setActiveTab('home')} />

      <Card>
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-ink">Lv {skillLevel}</span>
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-faint">Skill Level</span>
          </div>
          <span className="text-xs font-semibold text-ink-muted">{skillLevel} / {MAX_SKILL_LEVEL}</span>
        </div>
        <ProgressBar value={(skillLevel / MAX_SKILL_LEVEL) * 100} className="mt-2.5" />
      </Card>

      {/* 7-day activity graph */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">Last 7 Days</p>
        <div className="mt-4 flex items-stretch justify-between gap-2" style={{ height: '96px' }}>
          {activity.map((day, index) => {
            const heightPct = Math.max(6, (day.count / maxDaily) * 100)
            const weekday = new Date(day.dateKey + 'T00:00:00').getDay()
            return (
              <div key={day.dateKey} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end">
                  <div
                    className={`w-full rounded-md transition-[height] duration-500 ease-out ${day.count > 0 ? 'bg-accent' : 'bg-surface2'}`}
                    style={{ height: `${heightPct}%`, transitionDelay: `${index * 60}ms` }}
                  />
                </div>
                <span className="text-[10px] font-semibold text-ink-faint">{WEEKDAY_LABELS[weekday]}</span>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <StatTile icon={<Trophy className="h-4 w-4" strokeWidth={2.25} />} label="Total Workouts" value={String(userProgress.totalWorkoutsCompleted)} />
        <StatTile icon={<Clock className="h-4 w-4" strokeWidth={2.25} />} label="Total Training Time" value={formatTrainingMinutes(userProgress.totalTrainingMinutes)} />
        <StatTile icon={<CalendarDays className="h-4 w-4" strokeWidth={2.25} />} label="Weekly Workouts" value={String(weeklyWorkouts)} />
        <StatTile icon={<CalendarRange className="h-4 w-4" strokeWidth={2.25} />} label="Monthly Workouts" value={String(monthlyWorkouts)} />
        <StatTile icon={<ListChecks className="h-4 w-4" strokeWidth={2.25} />} label="Exercises Completed" value={String(userProgress.totalExercisesCompleted)} />
        <StatTile
          icon={favorite ? <CategoryIcon category={favorite} className="h-4 w-4" /> : <Star className="h-4 w-4" strokeWidth={2.25} />}
          label="Favorite Category"
          value={favorite ?? '—'}
        />
      </div>
    </div>
  )
}
