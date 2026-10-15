import type { IntensityLevel, Profile, WorkoutGoal, WorkoutPreferences, WorkoutHistoryEntry, DrillCategory, WorkoutPlan } from '@/types'
import { drillLibrary, type ProfessionalDrillLibraryEntry } from './drillLibrary'
import { levelFilteredCandidates } from './workouts'

export type CoachStepId = 'goal' | 'duration' | 'intensity'

export interface CoachOption {
  value: string
  label: string
  detail: string
}

export interface CoachStep {
  id: CoachStepId
  prompt: string
  options: CoachOption[]
}

const goalOptions: CoachOption[] = [
  { value: 'Strength', label: 'Focus: Strength', detail: 'Power, explosiveness, and first-step speed.' },
  { value: 'Skills', label: 'Focus: Skills', detail: 'Shot touch, footwork, and ball control.' },
  { value: 'Conditioning', label: 'Focus: Conditioning', detail: 'Endurance, movement, and repeated effort.' },
]

const durationOptions: CoachOption[] = [
  { value: '30', label: '30 min', detail: 'High-intensity reset.' },
  { value: '60', label: '60 min', detail: 'Balanced performance block.' },
  { value: '90', label: '90 min', detail: 'Full development session.' },
]

const intensityOptions: CoachOption[] = [
  { value: 'Low', label: 'Low', detail: 'Controlled pace and recovery.' },
  { value: 'Medium', label: 'Medium', detail: 'Game-ready effort and focus.' },
  { value: 'High', label: 'High', detail: 'Max output and intensity.' },
]

export function getCoachSteps(profile: Profile): CoachStep[] {
  const levelText = `Level ${profile.skillLevel}/7`
  const goalsText = profile.goals || 'general improvement'

  return [
    {
      id: 'goal',
      prompt: `Coach here, ${profile.name}. Your ${levelText} profile and ${goalsText} focus are loaded. What is your primary focus today?`,
      options: goalOptions,
    },
    {
      id: 'duration',
      prompt: 'How much time do you have for the session?',
      options: durationOptions,
    },
    {
      id: 'intensity',
      prompt: 'Choose the intensity that matches your energy level.',
      options: intensityOptions,
    },
  ]
}

export function getCoachGreeting(name: string, initialPreferences: WorkoutPreferences | null) {
  if (initialPreferences) {
    const environment = initialPreferences.environment ?? 'Court'
    const equipment = initialPreferences.equipment ?? 'None'

    return {
      role: 'coach' as const,
      text: `Welcome back, ${name}. I’m your Coach, and I’m ready to refine your last session into a sharper plan using your ${environment.toLowerCase()} setup and ${equipment.toLowerCase()} availability.`,
    }
  }

  return {
    role: 'coach' as const,
    text: `Welcome to the court, ${name}. I’m Coach, and I’m building a pro-level session around your goals.`,
  }
}

export function buildCoachSummary(preferences: WorkoutPreferences) {
  const environment = preferences.environment ?? 'Court'
  const equipment = preferences.equipment ?? 'None'
  return `${preferences.goal} focus • ${preferences.duration} min • ${preferences.intensity} intensity • ${environment} • ${equipment}`
}

function pickDrillForRequest(request: string): ProfessionalDrillLibraryEntry | undefined {
  const trimmed = request.toLowerCase()
  if (/(shoot|shot|release|form|touch)/i.test(trimmed)) {
    return drillLibrary.find((entry) => entry.name.toLowerCase().includes('form shot')) || drillLibrary.find((entry) => entry.category === 'Shooting')
  }
  if (/(handle|dribble|crossover|pound|ball control)/i.test(trimmed)) {
    return drillLibrary.find((entry) => entry.name.toLowerCase().includes('pound dribble')) || drillLibrary.find((entry) => entry.category === 'Ball Handling')
  }
  if (/(finish|layup|rim|contact|touch)/i.test(trimmed)) {
    return drillLibrary.find((entry) => entry.name.toLowerCase().includes('mikan')) || drillLibrary.find((entry) => entry.category === 'Shooting')
  }
  if (/(defense|closeout|guard|footwork|reaction)/i.test(trimmed)) {
    return drillLibrary.find((entry) => entry.name.toLowerCase().includes('closeout')) || drillLibrary.find((entry) => entry.category === 'Defense')
  }
  if (/(strength|jump|power|landing|vertical)/i.test(trimmed)) {
    return drillLibrary.find((entry) => entry.name.toLowerCase().includes('single-leg')) || drillLibrary.find((entry) => entry.category === 'Strength')
  }
  return drillLibrary.find((entry) => entry.category === 'Shooting' || entry.category === 'Ball Handling')
}

export function buildCoachResponse(
  request: string,
  profile: Profile | null,
  preferences: WorkoutPreferences | null,
  history: WorkoutHistoryEntry[],
  coachMemory: string,
  workoutPlan?: WorkoutPlan | null,
) {
  if (!profile || !preferences) {
    return {
      reply: 'I’m ready to shape a sharper session once your profile is loaded.',
      nextPreferences: null,
    }
  }

  const trimmed = request.trim()
  const recentFocus = history[0]?.focus || preferences.customGoal || preferences.goal
  const wantsHarder = /(harder|challeng|advanced|intense|upgrade|pro|elite|pressure|sharper|edge)/i.test(trimmed)
  const wantsRecovery = /(recovery|lighter|easy|reset|rest|recharge)/i.test(trimmed)
  const wantsShooting = /(shoot|shot|range|form|touch)/i.test(trimmed)
  const wantsHandles = /(crossover|handle|dribble|ball|control|moves|pound)/i.test(trimmed)
  const wantsFinishing = /(finish|layup|rim|contact|finishing)/i.test(trimmed)
  const wantsDefense = /(defense|defend|closeout|footwork|guard)/i.test(trimmed)
  const wantsConditioning = /(condition|endurance|stamina|cardio|wind|run)/i.test(trimmed)

  let goal: WorkoutGoal = preferences.goal
  let selectedCategories = preferences.selectedCategories
  let duration = preferences.duration
  let intensity = preferences.intensity
  let customGoal = preferences.customGoal

  if (wantsConditioning) {
    goal = 'Conditioning'
    selectedCategories = ['Athleticism', 'Defense', 'Ball Handling'] as DrillCategory[]
    duration = wantsHarder ? 60 : 45
    intensity = wantsHarder ? 'High' : 'Medium'
    customGoal = 'Conditioning and stamina'
  } else if (wantsDefense) {
    goal = 'Skills'
    selectedCategories = ['Defense', 'Athleticism'] as DrillCategory[]
    duration = wantsHarder ? 60 : 45
    intensity = wantsHarder ? 'High' : 'Medium'
    customGoal = 'Defensive footwork and reactions'
  } else if (wantsFinishing) {
    goal = 'Skills'
    selectedCategories = ['Shooting', 'Athleticism'] as DrillCategory[]
    duration = wantsHarder ? 60 : 45
    intensity = wantsHarder ? 'High' : 'Medium'
    customGoal = 'Finishing pressure and rim control'
  } else if (wantsHandles) {
    goal = 'Skills'
    selectedCategories = ['Ball Handling', 'Athleticism'] as DrillCategory[]
    duration = wantsHarder ? 60 : 45
    intensity = wantsHarder ? 'High' : 'Medium'
    customGoal = 'Ball control and crossover pace'
  } else if (wantsShooting) {
    goal = 'Skills'
    selectedCategories = ['Shooting', 'Athleticism'] as DrillCategory[]
    duration = wantsHarder ? 60 : 45
    intensity = wantsHarder ? 'High' : 'Medium'
    customGoal = 'Shot-making and release quality'
  } else if (wantsHarder) {
    duration = Math.min(90, preferences.duration + 15) as WorkoutPreferences['duration']
    intensity = 'High'
    customGoal = trimmed
  } else if (wantsRecovery) {
    duration = 30
    intensity = 'Low'
    customGoal = 'Recovery and reset'
  }

  const drill = pickDrillForRequest(trimmed)
  const cueLines = drill?.correctiveCue
    ? `- ${drill.correctiveCue}`
    : '- Keep your base stable, keep the ball tight, and finish each rep with control.'
  const progression = drill?.description ? `${drill.description}` : 'Start simple, then add pressure once your rhythm is clean.'
  const regression = `If the rep feels too difficult, reduce the set to ${drill?.goalReps || 'a shorter block'} and stay in a slower rhythm.`
  const fix = drill?.correctiveCue || 'If the rep breaks down, reset your feet and focus on your first step before adding speed.'
  const memorySnippet = coachMemory
    ? `I’m folding in your note about “${coachMemory.split(' • ').slice(-1)[0]}”`
    : 'I’m using your profile and recent training context'
  const levelCue = profile.skillLevel >= 6
    ? 'For an elite rhythm, I’d keep the reps sharp and the pace aggressive.'
    : profile.skillLevel >= 4
      ? 'I’d emphasize clean mechanics and repeatable pace.'
      : 'I’d keep the structure simple and the reps crisp.'
  const focusLine = customGoal && customGoal !== preferences.customGoal
    ? `I’m tuning the next block around “${customGoal}”`
    : `I’m sharpening the plan around ${recentFocus}`
  const drillLine = drill ? `Primary drill: ${drill.name}.` : 'Primary drill: a controlled skill block built around your current focus.'
  const activePlanNote = workoutPlan?.goal
    ? `Your current plan is a ${workoutPlan.goal.toLowerCase()} block with ${workoutPlan.checklist.length} sections, so I’m preserving that structure while adjusting the emphasis.`
    : 'I’m building from your current setup and tying the adjustment to your active plan.'
  const technicalBreakdown = drill?.executionSteps?.length
    ? `Technical breakdown: ${drill.executionSteps.slice(0, 3).join(' ')}`
    : 'Technical breakdown: stay low, keep the center of gravity over your base, and make every rep clean before adding speed.'

  const reply = [
    `${profile.name}, ${focusLine}. ${memorySnippet}, and I’m building a ${duration}-minute ${goal.toLowerCase()} block around ${preferences.environment.toLowerCase()} conditions.`,
    `${activePlanNote}`,
    `Technical Objective: ${drillLine} ${drill?.objective || 'Make the movement cleaner and more repeatable.'}`,
    `Technical Breakdown: ${technicalBreakdown}`,
    `Common Mistake to Avoid: ${drill?.commonTechnicalMistake || 'Rushing the rep or losing your base.'}`,
    `The Goal Repetition Count: ${duration >= 60 ? '4 sets of 8-10 reps' : duration >= 45 ? '3 sets of 8-10 reps' : '2 sets of 8-10 reps'}.`,
    `Technical Cues:\n${cueLines}`,
    `Progression: ${progression}`,
    `Regression / Easier Version: ${regression}`,
    `Fix / Technical Tip: ${fix}`,
    `${levelCue}`,
    `Feedback Checkpoint: Tell me how the rep felt — release point, balance, elbow alignment, or pace — and I’ll adjust the next set immediately like a pro trainer.`,
  ].join('\n\n')

  return {
    reply,
    nextPreferences: {
      ...preferences,
      goal,
      duration,
      intensity,
      customGoal,
      selectedCategories,
    },
  }
}

export function getGoalLabel(value: string): WorkoutGoal | undefined {
  return goalOptions.find((option) => option.value === value)?.value as WorkoutGoal | undefined
}

export function getIntensityLabel(value: string): IntensityLevel | undefined {
  return intensityOptions.find((option) => option.value === value)?.value as IntensityLevel | undefined
}

export type DrillJSON = {
  id: string
  title: string
  category: string
  durationMinutes: number
  objective: string
  equipmentNeeded: string[]
  executionSteps: string[]
  tips: string[]
}

function filterByEquipment(drill: ProfessionalDrillLibraryEntry, preferences: WorkoutPreferences) {
  const env = preferences.environment
  const equip = preferences.equipment
  const equipmentText = drill.equipment.join(' ').toLowerCase()
  if (env === 'Home' && /(box|step|weights|bands)/i.test(equipmentText)) return false
  if (equip !== 'Full Gym' && equip !== 'Weights' && /(weights|squat rack|barbell)/i.test(equipmentText)) return false
  return true
}

export function generateDrillPlanJSON(requestedFocus: string, preferences: WorkoutPreferences, profile: Profile) {
  const focus = requestedFocus.toLowerCase()
  const duration = preferences.duration || 45
  const equipment = preferences.equipment

  // Helper to pick drills by category, restricted to the athlete's skill-level difficulty range.
  const pickByCategory = (cat: string, count = 1) =>
    levelFilteredCandidates(
      drillLibrary.filter((d) => d.category.toLowerCase() === cat.toLowerCase() && filterByEquipment(d, preferences)),
      profile.skillLevel,
    ).slice(0, count)

  let drills: any[] = []

  if (focus.includes('finishing')) {
    // Explicit 45-minute finishing progression
    const progression = [
      { title: 'Mikan Progression', category: 'Finishing', minutes: 6 },
      { title: 'Touch & Angle Finishes', category: 'Finishing', minutes: 12 },
      { title: 'Contact Layups Progression', category: 'Finishing', minutes: 12 },
      { title: 'Live Advantage Series', category: 'Finishing', minutes: 15 },
    ]

    progression.forEach((p) => {
      const source = pickByCategory(p.category, 1)[0]
      if (source) {
        // Use the real drill's own predefined duration — never the progression's
        // planning estimate — once a real library entry backs this slot.
        drills.push({
          id: source.name,
          title: p.title,
          category: source.category,
          durationMinutes: source.duration,
          objective: source.objective || source.description,
          equipmentNeeded: source.equipment || [],
          executionSteps: source.executionSteps || [],
          tips: [source.commonTechnicalMistake, source.correctiveCue],
        })
      } else {
        drills.push({ id: `custom-${p.title.replace(/\s+/g, '-').toLowerCase()}`, title: p.title, category: p.category, durationMinutes: p.minutes, objective: p.title, equipmentNeeded: [], executionSteps: [], tips: [] })
      }
    })
  } else {
    // Generic mapping for other focuses: map to categories
    const map: Record<string, string[]> = {
      shooting: ['Shooting'],
      handles: ['Handles'],
      defense: ['Defense'],
      strength: ['Strength'],
    }

    const keys = Object.keys(map)
    const matched = keys.find((k) => focus.includes(k)) || 'shooting'
    const cats = map[matched]

    // Fill the session by adding whole drills, each keeping its own predefined duration,
    // until the requested time is reached. The drill that crosses the target is kept in
    // full — overshooting slightly is expected and preferred over shrinking a drill to fit.
    let remaining = duration
    cats.forEach((cat) => {
      const picks = pickByCategory(cat, 3)
      picks.forEach((p) => {
        if (remaining <= 0) return
        drills.push({ id: p.name, title: p.name, category: p.category, durationMinutes: p.duration, objective: p.objective, equipmentNeeded: p.equipment, executionSteps: p.executionSteps, tips: [p.commonTechnicalMistake, p.correctiveCue] })
        remaining -= p.duration
      })
    })
  }

  const payload = {
    session: {
      focus: requestedFocus,
      durationMinutes: duration,
      intensity: preferences.intensity,
      environment: preferences.environment,
      equipment: equipment,
      drills,
      generatedAt: new Date().toISOString(),
    },
  }

  // Return strict JSON (no extra commentary)
  return JSON.stringify(payload, null, 2)
}
