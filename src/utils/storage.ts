import type { Profile, WorkoutPreferences, WorkoutPlan, WorkoutHistoryEntry, UserProgress } from '@/types'
import { defaultUserProgress } from '@/utils/progress'

const PROFILE_KEY = 'eliteDrillProfile'
const WORKOUT_PREF_KEY = 'eliteDrillPreferences'
const WORKOUT_PLAN_KEY = 'eliteDrillPlan'
const WORKOUT_HISTORY_KEY = 'eliteDrillHistory'
const COACH_MEMORY_KEY = 'eliteDrillCoachMemory'
const USER_PROGRESS_KEY = 'eliteDrillProgress'

export function saveProfile(profile: Profile) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function loadProfile(): Profile | null {
  if (typeof window === 'undefined') return null
  const value = window.localStorage.getItem(PROFILE_KEY)
  if (!value) return null

  try {
    return JSON.parse(value) as Profile
  } catch {
    return null
  }
}

export function savePreferences(preferences: WorkoutPreferences) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(WORKOUT_PREF_KEY, JSON.stringify(preferences))
}

export function loadPreferences(): WorkoutPreferences | null {
  if (typeof window === 'undefined') return null
  const value = window.localStorage.getItem(WORKOUT_PREF_KEY)
  if (!value) return null

  try {
    return JSON.parse(value) as WorkoutPreferences
  } catch {
    return null
  }
}

export function saveWorkoutPlan(plan: WorkoutPlan) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(WORKOUT_PLAN_KEY, JSON.stringify(plan))
}

export function loadWorkoutPlan(): WorkoutPlan | null {
  if (typeof window === 'undefined') return null
  const value = window.localStorage.getItem(WORKOUT_PLAN_KEY)
  if (!value) return null

  try {
    return JSON.parse(value) as WorkoutPlan
  } catch {
    return null
  }
}

export function saveWorkoutHistory(history: WorkoutHistoryEntry[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(history))
}

export function loadWorkoutHistory(): WorkoutHistoryEntry[] {
  if (typeof window === 'undefined') return []
  const value = window.localStorage.getItem(WORKOUT_HISTORY_KEY)
  if (!value) return []

  try {
    return JSON.parse(value) as WorkoutHistoryEntry[]
  } catch {
    return []
  }
}

export function saveUserProgress(progress: UserProgress) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(progress))
}

export function loadUserProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultUserProgress
  const value = window.localStorage.getItem(USER_PROGRESS_KEY)
  if (!value) return defaultUserProgress

  try {
    // Merge over the default so any fields added in a later release (or missing from an
    // older saved record) always have a safe value instead of becoming undefined.
    return { ...defaultUserProgress, ...(JSON.parse(value) as Partial<UserProgress>) }
  } catch {
    return defaultUserProgress
  }
}

export function saveCoachMemory(memory: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(COACH_MEMORY_KEY, memory)
}

export function loadCoachMemory(): string {
  if (typeof window === 'undefined') return ''
  const value = window.localStorage.getItem(COACH_MEMORY_KEY)
  return value ?? ''
}
