export type WorkoutGoal = 'Strength' | 'Skills' | 'Conditioning'
export type IntensityLevel = 'Low' | 'Medium' | 'High'
export type EquipmentOption = 'None' | 'Full Gym' | 'Weights' | 'Resistance Bands'
export type EnvironmentOption = 'Home' | 'Court' | 'Gym'

export type DrillCategory = 'Ball Handling' | 'Shooting' | 'Strength' | 'Defense' | 'Athleticism' | 'Skills'

export interface Profile {
  name: string
  age: number
  // 1-7, matched against ProfessionalDrillLibraryEntry.difficultyScore by the progressive
  // workout engine in utils/workouts.ts (see BUILD_INSTRUCTIONS.md §7).
  skillLevel: number
  goals: string
  equipment?: EquipmentOption
}

export interface WorkoutPreferences {
  goal: WorkoutGoal
  // 10 and 75 are conditional: 10/20/30 apply when Ball Handling is the sole selected
  // category, and 75 unlocks only for combined workouts (2+ categories selected) — see
  // getAvailableDurations in utils/workouts.ts.
  duration: 10 | 20 | 30 | 45 | 60 | 75 | 90
  intensity: IntensityLevel
  equipment: EquipmentOption
  environment: EnvironmentOption
  selectedCategories: DrillCategory[]
  customGoal?: string
}

export interface Drill {
  id: string
  title: string
  description: string
  category?: DrillCategory
  durationMinutes?: number
  // 1-7, display-only passthrough of the source library entry's difficultyScore (see
  // ProfessionalDrillLibraryEntry). Never used to influence selection — that filtering
  // already happened before the Drill was built (see utils/workouts.ts).
  difficultyScore?: number
  objective?: string
  equipmentNeeded?: string[]
  executionSteps?: string[]
  tips?: string[]
  animationGuide?: string
  commonTechnicalMistake?: string
  correctiveCue?: string
  goalReps?: string
  warmupRef?: string
}

export interface WorkoutSection {
  section: string
  items: Drill[]
}

export interface WorkoutPlan {
  id: string
  goal: WorkoutGoal
  duration: 10 | 20 | 30 | 45 | 60 | 75 | 90
  intensity: IntensityLevel
  summary: string
  checklist: WorkoutSection[]
  createdAt: string
}

export interface WorkoutHistoryEntry {
  id: string
  date: string
  focus: string
  duration: number
  summary: string
  // The exact preferences used to generate this session, so the Home screen's "Repeat
  // Workout" action can reproduce it precisely. Optional because history entries saved
  // before this field existed won't have it — callers fall back to current preferences.
  preferences?: WorkoutPreferences
  // The exact generated plan (exercises, order, durations), so the Recent Workouts page
  // can reopen this session exactly as it was without rebuilding it — see
  // AppContext.openHistoryEntry. Optional for the same reason preferences is: older saved
  // entries won't have it, and the Recent Workouts card just omits the "Open" action then.
  plan?: WorkoutPlan
}

// --- Training progress (see utils/progress.ts) --------------------------------------------
//
// Lifetime basketball-training stats and achievements. Deliberately does NOT include any
// XP or streak concept — progress here is measured directly in real training terms
// (workouts, minutes, exercises) rather than a derived points/level system.

export interface UserProgress {
  totalWorkoutsCompleted: number
  totalTrainingMinutes: number
  totalExercisesCompleted: number
  // How many completed workouts included each category — powers "100 Shooting Workouts"
  // style achievements and the Statistics screen's "favorite category".
  categoryCompletionCounts: Partial<Record<DrillCategory, number>>
  // Achievement ids already unlocked (see ACHIEVEMENTS in utils/progress.ts).
  unlockedAchievementIds: string[]
  // Local-date (YYYY-MM-DD) each achievement was unlocked on, keyed by achievement id —
  // powers the Home screen's "last unlocked achievement" preview date.
  achievementUnlockedDates: Record<string, string>
  // One local-date (YYYY-MM-DD) entry per completed workout, most recent last, capped at
  // COMPLETION_LOG_LIMIT (see utils/progress.ts) — powers the Statistics screen's
  // weekly/monthly counts and activity graph without needing a full workout-by-workout log.
  completionDates: string[]
}

export interface AchievementDefinition {
  id: string
  title: string
  description: string
}

export interface WorkoutCompletionResult {
  totalWorkoutsAfter: number
  totalTrainingMinutesAfter: number
  exercisesCompleted: number
  workoutMinutes: number
  newlyUnlockedAchievements: AchievementDefinition[]
  planGoal: WorkoutGoal
}
