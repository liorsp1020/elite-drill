'use client'

import { Trophy, Clock, ListChecks, CalendarCheck, Sparkles, RotateCcw } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'
import { workoutCompletionMessage, formatTrainingMinutes } from '@/utils/progress'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import StatTile from '@/components/ui/StatTile'

export default function CompletionScreen() {
  const { workoutPlan, lastCompletion, setActiveTab } = useAppContext()

  if (!lastCompletion) {
    return (
      <div className="space-y-4 pt-1">
        <h1 className="text-3xl font-bold tracking-tight text-ink">Workout</h1>
        <Card className="text-center">
          <p className="text-sm text-ink-muted">No workout was just completed.</p>
          <Button className="mt-4" fullWidth onClick={() => setActiveTab('home')}>Back to Home</Button>
        </Card>
      </div>
    )
  }

  const r = lastCompletion

  return (
    <div className="space-y-7 pb-4 pt-1">
      {/* Celebration header */}
      <div className="flex flex-col items-center pt-4 text-center">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <span className="absolute inset-0 animate-ring-pulse rounded-full bg-accent/30" />
          <span className="absolute inset-0 animate-ring-pulse rounded-full bg-accent/20 [animation-delay:0.4s]" />
          <div className="relative flex h-20 w-20 animate-celebrate-bounce items-center justify-center rounded-full bg-accent text-white shadow-elevated">
            <Trophy className="h-10 w-10" strokeWidth={2} />
          </div>
          <Sparkles className="absolute -right-1 -top-1 h-6 w-6 animate-sparkle text-accent-light [animation-delay:0.2s]" />
          <Sparkles className="absolute -bottom-1 -left-2 h-5 w-5 animate-sparkle text-accent-light [animation-delay:0.9s]" />
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-tight text-ink">Workout Complete!</h1>
        <p className="mt-1.5 text-sm text-ink-muted">{workoutCompletionMessage(r.totalWorkoutsAfter)}</p>
      </div>

      {/* Stats grid — real training totals, this session and lifetime. */}
      <div className="grid grid-cols-2 gap-3">
        <StatTile icon={<Clock className="h-4 w-4" strokeWidth={2.25} />} label="Workout Time" value={`${r.workoutMinutes} min`} />
        <StatTile icon={<ListChecks className="h-4 w-4" strokeWidth={2.25} />} label="Exercises Completed" value={String(r.exercisesCompleted)} />
        <StatTile icon={<Trophy className="h-4 w-4" strokeWidth={2.25} />} label="Total Workouts" value={String(r.totalWorkoutsAfter)} />
        <StatTile icon={<CalendarCheck className="h-4 w-4" strokeWidth={2.25} />} label="Total Training Time" value={formatTrainingMinutes(r.totalTrainingMinutesAfter)} />
      </div>

      {/* Newly unlocked achievements */}
      {r.newlyUnlockedAchievements.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-ink-muted">Achievement Unlocked</p>
          {r.newlyUnlockedAchievements.map((achievement, index) => (
            <Card
              key={achievement.id}
              className="flex items-center gap-3 border-gold/40 bg-gold/10 animate-pop-in"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-gold text-white">
                <Trophy className="h-6 w-6" strokeWidth={2} />
              </div>
              <div>
                <p className="text-base font-bold text-ink">{achievement.title}</p>
                <p className="text-xs text-ink-muted">{achievement.description}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      {/* Reusing this one Completion screen for every finish — reopened-saved-workout or
          freshly generated — with three ways forward: repeat the exact same workout (goes
          through the same "reopen from library" preview gate if that's how this session
          started, or straight back in if it was freshly generated — see TrainingHub),
          browse the saved library, or head home. workoutPlan is untouched by finishing a
          workout, so "Start Again" needs nothing more than navigating back to it. */}
      <div className="space-y-2.5">
        {workoutPlan ? (
          <Button size="lg" fullWidth onClick={() => setActiveTab('dashboard')} icon={<RotateCcw className="h-5 w-5" strokeWidth={2.25} />}>
            Start Again
          </Button>
        ) : null}
        {/* No icons on this row — "Recent Workouts" is long enough at half-width that an
            icon would force it onto two lines; the primary action above already carries one. */}
        <div className="flex gap-2.5">
          <Button variant="secondary" size="md" fullWidth className="whitespace-nowrap text-sm" onClick={() => setActiveTab('history')}>
            Recent Workouts
          </Button>
          <Button variant="ghost" size="md" fullWidth onClick={() => setActiveTab('home')}>
            Home
          </Button>
        </div>
      </div>
    </div>
  )
}
