'use client'

import { useMemo } from 'react'
import { Dumbbell, Clock, Trophy, ListChecks, Settings as SettingsIcon, Award, Lock, RotateCcw } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'
import { formatTrainingMinutes, relativeDateLabel, ACHIEVEMENTS } from '@/utils/progress'
import { getRandomMotivationalQuote } from '@/utils/motivation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import SectionTitle from '@/components/ui/SectionTitle'
import StatTile from '@/components/ui/StatTile'
import ProgressBar from '@/components/ui/ProgressBar'
import CountUp from '@/components/ui/CountUp'

const MAX_SKILL_LEVEL = 7

export default function HomeScreen() {
  const { profile, history, userProgress, preferences, generateWorkout, openHistoryEntry, setActiveTab } = useAppContext()

  const firstName = useMemo(() => profile?.name?.split(' ')[0] ?? 'Player', [profile?.name])
  // A fresh motivational line each time the Home screen loads — see utils/motivation.ts.
  const quote = useMemo(() => getRandomMotivationalQuote(), [])
  const now = useMemo(() => new Date(), [])
  const skillLevel = profile?.skillLevel ?? 4
  const lastWorkout = history[0]

  const lastAchievementId = userProgress.unlockedAchievementIds[userProgress.unlockedAchievementIds.length - 1]
  const lastAchievement = lastAchievementId ? ACHIEVEMENTS.find((a) => a.id === lastAchievementId) : undefined
  const lastAchievementDate = lastAchievementId ? userProgress.achievementUnlockedDates[lastAchievementId] : undefined

  // Reconstructs the most recent session using its saved preferences (see
  // WorkoutHistoryEntry.preferences); falls back to the current preferences for history
  // entries saved before that field existed, so the button still does something sensible.
  // Deliberately distinct from opening the card itself (below): this generates a FRESH
  // session from the same settings, it doesn't reopen the exact saved one.
  const handleRepeat = () => {
    const target = lastWorkout?.preferences ?? preferences
    if (!target) return
    generateWorkout(target, true)
    setActiveTab('dashboard')
  }

  // Tapping the card itself reopens the exact saved workout (same exercises, order, and
  // durations) rather than regenerating — see AppContext.openHistoryEntry.
  const handleOpenLastWorkout = () => {
    if (!lastWorkout?.plan) return
    openHistoryEntry(lastWorkout.id)
  }

  return (
    <div className="space-y-7 pb-2">
      {/* Hero Card — the visual focus of the screen: branding, welcome message, a rotating
          motivational line, and (via small glass icon buttons) quick access to Challenges
          and Settings so removing the old header/quick-link cards doesn't lose reachability. */}
      <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-accent-light via-accent to-accent-dark p-6 shadow-elevated animate-card-in">
        <div className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-black/10 blur-2xl" />
        {/* Faint basketball court arc — a subtle sports texture, not a graphic element that
            competes with the copy; kept low-opacity and clipped by the card's own corners. */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 text-white/10"
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="2" />
          <path d="M100 30 A70 70 0 0 1 100 170" stroke="currentColor" strokeWidth="2" />
        </svg>

        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
            🏀 Elite Drill
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('challenges')}
              aria-label="Weekly Challenges"
              className="glass tap-shrink flex h-9 w-9 items-center justify-center rounded-full text-white"
            >
              <Award className="h-4 w-4" strokeWidth={2.25} />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              aria-label="Settings"
              className="glass tap-shrink flex h-9 w-9 items-center justify-center rounded-full text-white"
            >
              <SettingsIcon className="h-4 w-4" strokeWidth={2.25} />
            </button>
          </div>
        </div>

        <h1 className="relative mt-5 text-3xl font-extrabold tracking-tight text-white">Welcome Back, {firstName}!</h1>
        <p className="relative mt-2 text-sm font-medium leading-relaxed text-white/85">{quote}</p>
      </div>

      {/* Primary CTA — larger, elevated, with a small basketball icon chip. */}
      <div>
        <Button size="lg" fullWidth onClick={() => setActiveTab('planner')} className="h-[4.5rem] text-lg shadow-elevated">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-lg">🏀</span>
          Generate Workout
        </Button>
        <p className="mt-2.5 text-center text-xs text-ink-faint">Personalized workout based on your skill level</p>
      </div>

      {/* Player Progress — basketball Skill Level (1-7) as the headline progress bar, plus
          lifetime training totals underneath. No points/level system of any kind — every
          number here is a direct, real training total. Taps through to the Statistics
          screen, which is otherwise only reachable from here (edit Skill Level via the
          Settings gear icon above, or the Quick Stats tile below). */}
      <div>
        <SectionTitle>Player Progress</SectionTitle>
        <Card interactive onClick={() => setActiveTab('statistics')}>
          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-ink">Lv {skillLevel}</span>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-faint">Skill Level</span>
            </div>
            <span className="text-xs font-semibold text-ink-muted">{skillLevel} / {MAX_SKILL_LEVEL}</span>
          </div>
          <ProgressBar value={(skillLevel / MAX_SKILL_LEVEL) * 100} className="mt-2.5" animateOnMount />

          <div className="mt-5 flex items-center gap-6 border-t border-border pt-4">
            <div className="flex items-center gap-2.5">
              <Trophy className="h-4 w-4 text-accent" strokeWidth={2.25} />
              <p className="text-sm text-ink-muted">
                <span className="font-bold text-ink"><CountUp value={userProgress.totalWorkoutsCompleted} /></span>{' '}
                {userProgress.totalWorkoutsCompleted === 1 ? 'workout' : 'workouts'} completed
              </p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-accent" strokeWidth={2.25} />
            <p className="text-sm text-ink-muted">
              <span className="font-bold text-ink">{formatTrainingMinutes(userProgress.totalTrainingMinutes)}</span> trained total
            </p>
          </div>
        </Card>
      </div>

      {/* Quick Stats — a horizontally-scrolling strip so each card gets room for a larger
          icon instead of being squeezed into a cramped grid. */}
      <div>
        <SectionTitle>Quick Stats</SectionTitle>
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
          <button type="button" onClick={() => setActiveTab('settings')} className="w-[130px] flex-none text-left">
            <StatTile
              size="lg"
              tone="accent"
              icon={<Dumbbell className="h-5 w-5" strokeWidth={2.25} />}
              label="Skill Level"
              value={`Lv ${skillLevel}`}
              sub="out of 7"
            />
          </button>
          <div className="w-[130px] flex-none">
            <StatTile
              size="lg"
              tone="green"
              icon={<Trophy className="h-5 w-5" strokeWidth={2.25} />}
              label="Total Workouts"
              value={<CountUp value={userProgress.totalWorkoutsCompleted} />}
            />
          </div>
          <div className="w-[130px] flex-none">
            <StatTile
              size="lg"
              tone="neutral"
              icon={<Clock className="h-5 w-5" strokeWidth={2.25} />}
              label="Training Time"
              value={formatTrainingMinutes(userProgress.totalTrainingMinutes)}
            />
          </div>
          <div className="w-[130px] flex-none">
            <StatTile
              size="lg"
              tone="accent"
              icon={<ListChecks className="h-5 w-5" strokeWidth={2.25} />}
              label="Exercises Done"
              value={<CountUp value={userProgress.totalExercisesCompleted} />}
            />
          </div>
        </div>
      </div>

      {/* Recent Workout — the card itself reopens the exact saved session (same exercises,
          order, durations); "Repeat Workout" stays a separate action that generates a fresh
          one from the same settings. "View All" reaches the full Recent Workouts list. */}
      <div>
        <SectionTitle>Recent Workout</SectionTitle>
        {lastWorkout ? (
          <Card interactive={Boolean(lastWorkout.plan)} onClick={lastWorkout.plan ? handleOpenLastWorkout : undefined}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-bold text-ink">{lastWorkout.focus}</p>
              <Badge tone="accent">{lastWorkout.duration} min</Badge>
            </div>
            <p className="mt-1 text-xs text-ink-faint">{lastWorkout.date}</p>
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              className="mt-4"
              onClick={(event) => {
                event.stopPropagation()
                handleRepeat()
              }}
              icon={<RotateCcw className="h-4 w-4" strokeWidth={2.25} />}
            >
              Repeat Workout
            </Button>
          </Card>
        ) : (
          <Card className="text-center">
            <p className="text-sm text-ink-muted">No workouts yet — generate your first session to see it here.</p>
          </Card>
        )}
        <Button variant="ghost" size="sm" fullWidth className="mt-2" onClick={() => setActiveTab('history')}>
          View All Recent Workouts
        </Button>
      </div>

      {/* Achievement Preview — the most recently unlocked achievement, in gold to keep the
          "important elements only" orange rule and give achievements their own identity.
          Every achievement here is based on real training totals, never XP or a streak. */}
      <div>
        <SectionTitle>Achievements</SectionTitle>
        <Card className="flex items-center gap-3">
          <div className={`flex h-12 w-12 flex-none items-center justify-center rounded-full ${lastAchievement ? 'bg-gold/15 text-gold' : 'bg-surface2 text-ink-faint'}`}>
            {lastAchievement ? <Trophy className="h-6 w-6" strokeWidth={2} /> : <Lock className="h-5 w-5" strokeWidth={2} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold text-ink">{lastAchievement?.title ?? 'No achievements yet'}</p>
            <p className="text-xs text-ink-faint">
              {lastAchievement
                ? `Completed ${lastAchievementDate ? relativeDateLabel(lastAchievementDate, now) : 'recently'}`
                : 'Finish a workout to unlock your first'}
            </p>
          </div>
        </Card>
        <Button variant="ghost" size="sm" fullWidth className="mt-2" onClick={() => setActiveTab('achievements')}>
          View All Achievements
        </Button>
      </div>
    </div>
  )
}
