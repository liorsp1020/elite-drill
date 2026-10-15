'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { DrillCategory, Profile, UserProgress, WorkoutCompletionResult, WorkoutHistoryEntry, WorkoutPlan, WorkoutPreferences } from '@/types'
import {
  loadProfile as loadProfileFromStorage,
  loadPreferences as loadPreferencesFromStorage,
  loadWorkoutPlan as loadWorkoutPlanFromStorage,
  loadWorkoutHistory as loadWorkoutHistoryFromStorage,
  loadCoachMemory as loadCoachMemoryFromStorage,
  loadUserProgress as loadUserProgressFromStorage,
  savePreferences as savePreferencesToStorage,
  saveProfile as saveProfileToStorage,
  saveWorkoutPlan as saveWorkoutPlanToStorage,
  saveWorkoutHistory as saveWorkoutHistoryToStorage,
  saveCoachMemory as saveCoachMemoryToStorage,
  saveUserProgress as saveUserProgressToStorage,
} from '@/utils/storage'
import { buildWorkoutPlan } from '@/utils/workouts'
import { completeWorkout as computeWorkoutCompletion, defaultUserProgress } from '@/utils/progress'

export type ActiveTab = 'home' | 'planner' | 'dashboard' | 'coach' | 'history' | 'settings' | 'challenges' | 'statistics' | 'achievements' | 'completion'

// How the current workoutPlan got into context — 'generated' preserves the existing,
// already-validated flow (Workout screen opens straight into the interactive session);
// 'library' means it was reopened from Recent Workouts, which gates the Workout screen
// behind a read-only preview + explicit "Start Workout" button (see TrainingHub).
export type WorkoutSource = 'generated' | 'library'

interface AppContextValue {
  profile: Profile | null
  preferences: WorkoutPreferences | null
  workoutPlan: WorkoutPlan | null
  workoutSource: WorkoutSource
  selectedCategories: DrillCategory[]
  history: WorkoutHistoryEntry[]
  coachMemory: string
  activeTab: ActiveTab
  userProgress: UserProgress
  lastCompletion: WorkoutCompletionResult | null
  setActiveTab: (tab: ActiveTab) => void
  saveProfile: (profile: Profile) => void
  savePreferences: (preferences: WorkoutPreferences) => void
  appendCoachMemory: (note: string) => void
  generateWorkout: (preferences: WorkoutPreferences, recordHistory?: boolean) => WorkoutPlan | undefined
  toggleCategory: (category: DrillCategory) => void
  clearCategories: () => void
  finishWorkout: (exercisesCompleted: number) => WorkoutCompletionResult | undefined
  openHistoryEntry: (entryId: string) => void
  deleteHistoryEntry: (entryId: string) => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

const defaultPreferences: WorkoutPreferences = {
  goal: 'Skills',
  duration: 45,
  intensity: 'Medium',
  equipment: 'None',
  environment: 'Court',
  selectedCategories: [],
  customGoal: undefined,
}

// Recent Workouts keeps considerably more than the old "last few sessions" preview needed —
// it's now the primary saved-workout list, browsable and reopenable, so it deserves real
// depth rather than the previous 8-entry cap.
const HISTORY_LIMIT = 30

function getHistoryEntry(profile: Profile, preferences: WorkoutPreferences, plan: WorkoutPlan): WorkoutHistoryEntry {
  return {
    id: plan.id,
    date: new Date().toLocaleDateString(),
    focus: preferences.customGoal?.trim() ? preferences.customGoal : preferences.goal,
    duration: preferences.duration,
    preferences,
    plan,
    summary: plan.summary,
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<Profile | null>(null)
  const [preferences, setPreferencesState] = useState<WorkoutPreferences | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<DrillCategory[]>([])
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null)
  const [workoutSource, setWorkoutSource] = useState<WorkoutSource>('generated')
  const [history, setHistory] = useState<WorkoutHistoryEntry[]>([])
  const [coachMemory, setCoachMemory] = useState('')
  const [activeTab, setActiveTab] = useState<ActiveTab>('home')
  const [userProgress, setUserProgress] = useState<UserProgress>(defaultUserProgress)
  const [lastCompletion, setLastCompletion] = useState<WorkoutCompletionResult | null>(null)

  useEffect(() => {
    const storedProfile = loadProfileFromStorage()
    const storedPreferences = loadPreferencesFromStorage()
    const storedPlan = loadWorkoutPlanFromStorage()
    const storedHistory = loadWorkoutHistoryFromStorage()
    const storedCoachMemory = loadCoachMemoryFromStorage()
    const storedProgress = loadUserProgressFromStorage()

    if (storedProfile) setProfileState(storedProfile)
    if (storedPreferences) {
      setPreferencesState(storedPreferences)
      setSelectedCategories(storedPreferences.selectedCategories ?? [])
    }
    if (storedPlan) setWorkoutPlan(storedPlan)
    if (storedHistory.length) setHistory(storedHistory)
    if (storedCoachMemory) setCoachMemory(storedCoachMemory)
    setUserProgress(storedProgress)
  }, [])

  const saveProfile = (nextProfile: Profile) => {
    setProfileState(nextProfile)
    const nextPreferences = preferences ?? defaultPreferences
    const mergedPreferences: WorkoutPreferences = {
      ...nextPreferences,
      equipment: nextProfile.equipment ?? nextPreferences.equipment,
    }
    setPreferencesState(mergedPreferences)
    savePreferencesToStorage(mergedPreferences)
    saveProfileToStorage(nextProfile)
  }

  const savePreferences = (nextPreferences: WorkoutPreferences) => {
    setPreferencesState(nextPreferences)
    setSelectedCategories(nextPreferences.selectedCategories ?? [])
    savePreferencesToStorage(nextPreferences)
  }

  const appendCoachMemory = (note: string) => {
    const cleaned = note.trim()
    if (!cleaned) return

    setCoachMemory((prev) => {
      const next = [prev, cleaned].filter(Boolean).slice(-6).join(' • ')
      saveCoachMemoryToStorage(next)
      return next
    })
  }

  const generateWorkout = (nextPreferences: WorkoutPreferences, recordHistory = true) => {
    if (!profile) return undefined

    savePreferences(nextPreferences)
    const plan = buildWorkoutPlan(profile, nextPreferences)
    appendCoachMemory(`Generated ${nextPreferences.duration}-min ${nextPreferences.goal} session with ${nextPreferences.selectedCategories.join(', ') || 'balanced focus'}`)
    setWorkoutPlan(plan)
    setWorkoutSource('generated')
    saveWorkoutPlanToStorage(plan)

    if (recordHistory) {
      setHistory((prev) => {
        const entry = getHistoryEntry(profile, nextPreferences, plan)
        const next = [entry, ...prev].slice(0, HISTORY_LIMIT)
        saveWorkoutHistoryToStorage(next)
        return next
      })
    }

    return plan
  }

  // Reopens a previously generated workout exactly as it was saved — sets workoutPlan
  // directly from the stored entry rather than calling generateWorkout/buildWorkoutPlan, so
  // the exercises, order, and durations are never rebuilt or re-randomized. Distinct from
  // Home's "Repeat Workout", which intentionally generates a fresh session from the same
  // preferences.
  const openHistoryEntry = (entryId: string) => {
    const entry = history.find((item) => item.id === entryId)
    if (!entry?.plan) return

    setWorkoutPlan(entry.plan)
    setWorkoutSource('library')
    saveWorkoutPlanToStorage(entry.plan)
    setActiveTab('dashboard')
  }

  const deleteHistoryEntry = (entryId: string) => {
    setHistory((prev) => {
      const next = prev.filter((item) => item.id !== entryId)
      saveWorkoutHistoryToStorage(next)
      return next
    })
  }

  // Toggling a category only updates the selection. It must NEVER trigger workout
  // generation — the plan is only built when the user explicitly clicks "Generate Workout".
  const toggleCategory = (category: DrillCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category],
    )
  }

  const clearCategories = () => {
    setSelectedCategories([])
    setWorkoutPlan(null)
  }

  // The single entry point for finishing a workout: updates lifetime training stats and
  // unlocks any newly-earned achievements — all derived from the CURRENT workoutPlan,
  // never a stale/cached copy. Returns the result so the caller
  // (the Workout screen's "Finish Workout" button) can navigate straight to the Completion
  // screen with it; the result is also stored on context so the Completion screen itself
  // can read it after navigation.
  const finishWorkout = (exercisesCompleted: number): WorkoutCompletionResult | undefined => {
    if (!workoutPlan) return undefined

    const { nextProgress, result } = computeWorkoutCompletion(userProgress, workoutPlan, exercisesCompleted, new Date())
    setUserProgress(nextProgress)
    saveUserProgressToStorage(nextProgress)
    setLastCompletion(result)
    setActiveTab('completion')
    return result
  }

  const value = useMemo(
    () => ({
      profile,
      preferences,
      workoutPlan,
      workoutSource,
      selectedCategories,
      history,
      coachMemory,
      activeTab,
      userProgress,
      lastCompletion,
      setActiveTab,
      saveProfile,
      savePreferences,
      appendCoachMemory,
      generateWorkout,
      toggleCategory,
      clearCategories,
      finishWorkout,
      openHistoryEntry,
      deleteHistoryEntry,
    }),
    [profile, preferences, workoutPlan, workoutSource, selectedCategories, history, coachMemory, activeTab, userProgress, lastCompletion],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
