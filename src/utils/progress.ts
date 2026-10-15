import type {
  AchievementDefinition,
  DrillCategory,
  UserProgress,
  WorkoutCompletionResult,
  WorkoutPlan,
} from '@/types'

export function formatTrainingMinutes(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes} min`
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`
}

export const defaultUserProgress: UserProgress = {
  totalWorkoutsCompleted: 0,
  totalTrainingMinutes: 0,
  totalExercisesCompleted: 0,
  categoryCompletionCounts: {},
  unlockedAchievementIds: [],
  achievementUnlockedDates: {},
  completionDates: [],
}

// Rolling cap on the completion-date log (see UserProgress.completionDates) — comfortably
// covers a year+ of daily training without the stored record growing unbounded.
const COMPLETION_LOG_LIMIT = 400

// A short, varied congratulatory line for the Completion screen — scaled to how many
// workouts the athlete has now completed in total, with no XP/streak involved.
export function workoutCompletionMessage(totalWorkoutsAfter: number): string {
  if (totalWorkoutsAfter === 1) return 'Your first workout is in the books!'
  if (totalWorkoutsAfter < 10) return 'Solid work — keep building the habit.'
  if (totalWorkoutsAfter < 50) return `${totalWorkoutsAfter} workouts down. Real progress.`
  return `${totalWorkoutsAfter} workouts completed. That's elite-level dedication.`
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function daysBetween(fromKey: string, toKey: string): number {
  const [fy, fm, fd] = fromKey.split('-').map(Number)
  const [ty, tm, td] = toKey.split('-').map(Number)
  const from = Date.UTC(fy, fm - 1, fd)
  const to = Date.UTC(ty, tm - 1, td)
  return Math.round((to - from) / (1000 * 60 * 60 * 24))
}

// Human-friendly relative label for a YYYY-MM-DD date key — "Today" / "Yesterday" / "N
// days ago" / falls back to the raw date once it's far enough in the past that a relative
// label stops being useful. Used by the Home screen's achievement/recent-workout previews.
export function relativeDateLabel(dateKey: string, now: Date): string {
  const gap = daysBetween(dateKey, toDateKey(now))
  if (gap === 0) return 'Today'
  if (gap === 1) return 'Yesterday'
  if (gap > 1 && gap <= 6) return `${gap} days ago`
  return dateKey
}

// --- Achievements -------------------------------------------------------------------------
// Every achievement here depends only on lifetime training totals — none reference XP or
// a day-streak, by design.

export const ACHIEVEMENTS: (AchievementDefinition & { check: (progress: UserProgress) => boolean })[] = [
  { id: 'first-workout', title: 'First Workout', description: 'Complete your first workout', check: (p) => p.totalWorkoutsCompleted >= 1 },
  { id: 'workouts-5', title: '5 Workouts Completed', description: 'Complete 5 workouts', check: (p) => p.totalWorkoutsCompleted >= 5 },
  { id: 'workouts-25', title: '25 Workouts Completed', description: 'Complete 25 workouts', check: (p) => p.totalWorkoutsCompleted >= 25 },
  { id: 'workouts-50', title: '50 Workouts Completed', description: 'Complete 50 workouts', check: (p) => p.totalWorkoutsCompleted >= 50 },
  { id: 'workouts-100', title: '100 Workouts Completed', description: 'Complete 100 workouts', check: (p) => p.totalWorkoutsCompleted >= 100 },
  { id: 'minutes-500', title: '500 Minutes Trained', description: 'Train for 500 total minutes', check: (p) => p.totalTrainingMinutes >= 500 },
  { id: 'minutes-1000', title: '1000 Minutes Trained', description: 'Train for 1000 total minutes', check: (p) => p.totalTrainingMinutes >= 1000 },
  { id: 'ball-handling-100', title: '100 Ball Handling Workouts', description: 'Complete 100 workouts including Ball Handling', check: (p) => (p.categoryCompletionCounts['Ball Handling'] ?? 0) >= 100 },
  { id: 'shooting-100', title: '100 Shooting Workouts', description: 'Complete 100 workouts including Shooting', check: (p) => (p.categoryCompletionCounts['Shooting'] ?? 0) >= 100 },
]

function unlockNewAchievements(progress: UserProgress): AchievementDefinition[] {
  const unlocked = ACHIEVEMENTS.filter((a) => !progress.unlockedAchievementIds.includes(a.id) && a.check(progress))
  return unlocked.map(({ id, title, description }) => ({ id, title, description }))
}

// --- Statistics helpers -------------------------------------------------------------------

// Counts completed workouts whose date falls within the last `days` days (inclusive of
// today), using the same local-date-key comparison used elsewhere.
export function countCompletionsInLastDays(completionDates: string[], days: number, now: Date): number {
  const todayKey = toDateKey(now)
  return completionDates.filter((dateKey) => {
    const gap = daysBetween(dateKey, todayKey)
    return gap >= 0 && gap < days
  }).length
}

// One entry per of the last `days` days (oldest first), each with how many workouts were
// completed that day — the data source for the Statistics screen's activity bar graph.
export function dailyActivityForLastDays(completionDates: string[], days: number, now: Date): { dateKey: string; count: number }[] {
  const counts = new Map<string, number>()
  completionDates.forEach((dateKey) => {
    counts.set(dateKey, (counts.get(dateKey) ?? 0) + 1)
  })

  const result: { dateKey: string; count: number }[] = []
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = toDateKey(d)
    result.push({ dateKey: key, count: counts.get(key) ?? 0 })
  }
  return result
}

export function favoriteCategory(categoryCompletionCounts: UserProgress['categoryCompletionCounts']): DrillCategory | null {
  const entries = Object.entries(categoryCompletionCounts) as [DrillCategory, number][]
  if (!entries.length) return null
  return entries.reduce((best, current) => (current[1] > best[1] ? current : best))[0]
}

// --- Completing a workout -------------------------------------------------------------------
//
// The single entry point that turns a finished WorkoutPlan into an updated UserProgress plus
// a display-ready result for the Workout Completion screen. Pure function — callers (see
// AppContext.finishWorkout) own reading/writing the persisted UserProgress. Purely additive
// training totals — no XP, no streak, nothing that can be "broken" by missing a day.

export function completeWorkout(
  progress: UserProgress,
  plan: WorkoutPlan,
  exercisesCompleted: number,
  now: Date,
): { nextProgress: UserProgress; result: WorkoutCompletionResult } {
  const todayKey = toDateKey(now)

  const categoriesInPlan = new Set<DrillCategory>()
  plan.checklist.forEach((section) => section.items.forEach((item) => {
    if (item.category) categoriesInPlan.add(item.category)
  }))
  const nextCategoryCounts = { ...progress.categoryCompletionCounts }
  categoriesInPlan.forEach((category) => {
    nextCategoryCounts[category] = (nextCategoryCounts[category] ?? 0) + 1
  })

  const nextProgressBeforeAchievements: UserProgress = {
    totalWorkoutsCompleted: progress.totalWorkoutsCompleted + 1,
    totalTrainingMinutes: progress.totalTrainingMinutes + plan.duration,
    totalExercisesCompleted: progress.totalExercisesCompleted + exercisesCompleted,
    categoryCompletionCounts: nextCategoryCounts,
    unlockedAchievementIds: progress.unlockedAchievementIds,
    achievementUnlockedDates: progress.achievementUnlockedDates,
    completionDates: [...progress.completionDates, todayKey].slice(-COMPLETION_LOG_LIMIT),
  }

  const newlyUnlocked = unlockNewAchievements(nextProgressBeforeAchievements)
  const nextAchievementDates = { ...progress.achievementUnlockedDates }
  newlyUnlocked.forEach((a) => {
    nextAchievementDates[a.id] = todayKey
  })
  const nextProgress: UserProgress = {
    ...nextProgressBeforeAchievements,
    unlockedAchievementIds: [...progress.unlockedAchievementIds, ...newlyUnlocked.map((a) => a.id)],
    achievementUnlockedDates: nextAchievementDates,
  }

  const result: WorkoutCompletionResult = {
    totalWorkoutsAfter: nextProgress.totalWorkoutsCompleted,
    totalTrainingMinutesAfter: nextProgress.totalTrainingMinutes,
    exercisesCompleted,
    workoutMinutes: plan.duration,
    newlyUnlockedAchievements: newlyUnlocked,
    planGoal: plan.goal,
  }

  return { nextProgress, result }
}
