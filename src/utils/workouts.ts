import type { DrillCategory, Profile, WorkoutPreferences, WorkoutPlan, Drill } from '@/types'
import { drillLibrary } from '@/utils/drillLibrary'

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

// Ball Handling as the ONLY selected category swaps in a short-format duration set,
// since Ball Handling sessions skip the warm-up block (see isBallHandlingOnlyWorkout
// below) and are built for quick, focused reps rather than a full multi-phase session.
const BALL_HANDLING_ONLY_DURATIONS: WorkoutPreferences['duration'][] = [10, 20, 30]

// Two or more selected categories (a combined workout) additionally unlock a 75-minute
// option on top of whichever base durations the caller already offers. Single-category
// selections other than Ball Handling keep their base options unchanged.
export function getAvailableDurations(
  selectedCategories: DrillCategory[],
  baseOptions: readonly WorkoutPreferences['duration'][],
): WorkoutPreferences['duration'][] {
  if (selectedCategories.length === 1 && selectedCategories[0] === 'Ball Handling') {
    return [...BALL_HANDLING_ONLY_DURATIONS]
  }
  if (selectedCategories.length >= 2) {
    return [...baseOptions, 75]
  }
  return [...baseOptions]
}

function buildDrill(id: string, title: string, durationMinutes: number, executionSteps: string[], animationGuide: string): Drill {
  return {
    id,
    title,
    description: executionSteps.join(' '),
    durationMinutes,
    executionSteps,
    animationGuide,
  }
}

function filterByEquipment(entry: typeof drillLibrary[number], preferences: WorkoutPreferences) {
  const env = preferences.environment
  const equip = preferences.equipment
  const equipmentText = entry.equipment.join(' ').toLowerCase()

  if (env === 'Home' && /(box|step|weights|bands)/i.test(equipmentText)) {
    return false
  }
  if (!['Full Gym', 'Weights'].includes(equip) && /(weights|squat rack|barbell)/i.test(equipmentText)) {
    return false
  }
  return true
}

function categoryDefaults(goal: WorkoutPreferences['goal']) {
  switch (goal) {
    case 'Strength':
      return ['Strength', 'Athleticism', 'Defense'] as DrillCategory[]
    case 'Skills':
      return ['Ball Handling', 'Shooting', 'Athleticism'] as DrillCategory[]
    case 'Conditioning':
      return ['Athleticism', 'Defense', 'Ball Handling'] as DrillCategory[]
    default:
      return ['Ball Handling', 'Shooting', 'Strength', 'Defense', 'Athleticism'] as DrillCategory[]
  }
}

function normalizeCategories(selectedCategories: WorkoutPreferences['selectedCategories'], goal: WorkoutPreferences['goal']) {
  const allCategories: DrillCategory[] = ['Ball Handling', 'Shooting', 'Strength', 'Defense', 'Athleticism']
  if (selectedCategories.includes('Skills')) return allCategories
  if (selectedCategories.length) return selectedCategories
  return categoryDefaults(goal)
}

// Ball Handling drills carry no warmupRef and Ball Handling sessions skip the warm-up
// section entirely (see buildWorkoutPlan below). A workout only qualifies when Ball
// Handling is the sole category in play — a mixed session (e.g. Ball Handling + Shooting)
// keeps its normal warm-up, since that warm-up still serves the other categories.
function isBallHandlingOnlyWorkout(preferences: WorkoutPreferences) {
  const categories = normalizeCategories(preferences.selectedCategories, preferences.goal)
  return categories.length === 1 && categories[0] === 'Ball Handling'
}

function scoreDrillForCustomGoal(entry: typeof drillLibrary[number], customGoal: string) {
  const text = `${entry.name} ${entry.description} ${entry.objective} ${entry.executionSteps.join(' ')}`.toLowerCase()
  const query = customGoal.toLowerCase()
  let score = 0
  if (text.includes('jump') || text.includes('vertical') || query.includes('vertical')) score += 40
  if (text.includes('crossover') || text.includes('dribble') || query.includes('crossover')) score += 35
  if (text.includes('layup') || text.includes('finish') || query.includes('finish')) score += 30
  if (entry.category === 'Athleticism' && query.includes('vertical')) score += 20
  if (entry.category === 'Ball Handling' && query.includes('crossover')) score += 20
  if (entry.category === 'Shooting' && query.includes('finish')) score += 15
  return score
}

// Always uses the drill's own predefined `duration` — never a computed/stretched value.
// See pickDrillsForDuration below for how the total session time is met instead: by
// adding whole drills together, not by resizing any individual one.
function buildDrillFromEntry(entry: typeof drillLibrary[number], preferences: WorkoutPreferences) {
  const instructionTail = preferences.equipment === 'Weights'
    ? 'Use weight only when your technique is perfect.'
    : preferences.equipment === 'Resistance Bands'
      ? 'Keep resistance manageable and form clean.'
      : 'Use bodyweight or light props suited to home training.'

  const baseDrill = buildDrill(
    createId(entry.name),
    entry.name,
    entry.duration,
    entry.executionSteps,
    `${entry.description} ${instructionTail} ${preferences.environment === 'Gym' ? 'Train with crisp transitions and spacing.' : preferences.environment === 'Court' ? 'Keep the ball moving and use real court rhythm.' : 'Adapt to your home layout with short, sharp movements.'}`,
  )

  return {
    ...baseDrill,
    category: entry.category,
    difficultyScore: entry.difficultyScore,
    objective: entry.objective,
    equipmentNeeded: entry.equipment,
    executionSteps: entry.executionSteps,
    tips: [entry.commonTechnicalMistake, entry.correctiveCue],
    commonTechnicalMistake: entry.commonTechnicalMistake,
    correctiveCue: entry.correctiveCue,
    goalReps: entry.goalReps,
    warmupRef: entry.warmupRef,
  }
}

// --- Progressive difficulty engine (BUILD_INSTRUCTIONS.md §7) -----------------------------
//
// The main workout block must never jump straight from a foundational drill to an elite one.
// Two rules enforce that: (1) only drills within the athlete's skill-level difficulty range
// are eligible — see SKILL_LEVEL_DIFFICULTY_RANGES below — and (2) the eligible drills are
// grouped into three ascending complexity phases and the final selection is always re-sorted
// so Phase 1 (Foundation & Activation) executes before Phase 2 (Integration & Moderate Speed)
// before Phase 3 (Game-Speed / High Complexity).

// Explicit skill-level (1-7) -> allowed difficultyScore range mapping. This is a hard rule,
// not a starting point to widen from: a generated workout must NEVER include a drill outside
// the athlete's current level's range, even if that leaves fewer candidates to pick from.
const SKILL_LEVEL_DIFFICULTY_RANGES: Record<number, readonly [number, number]> = {
  1: [1, 2],
  2: [1, 3],
  3: [2, 4],
  4: [3, 5],
  5: [4, 6],
  6: [5, 7],
  7: [6, 7],
}

function difficultyRangeForSkillLevel(skillLevel: number): readonly [number, number] {
  const clamped = Math.min(7, Math.max(1, Math.round(skillLevel)))
  return SKILL_LEVEL_DIFFICULTY_RANGES[clamped]
}

// Narrows a candidate pool to drills whose difficultyScore falls within the athlete's
// skill-level range. Strict and non-negotiable: if too few (or zero) drills qualify, the
// caller gets a thin (or empty) pool rather than this function reaching outside the range
// to pad it out. See pickDrillsForDuration for how a thin pool is still turned into the best
// possible workout (repeating eligible drills) without ever crossing the range boundary.
export function levelFilteredCandidates(pool: typeof drillLibrary, skillLevel: number) {
  const [min, max] = difficultyRangeForSkillLevel(skillLevel)
  return pool.filter((entry) => entry.difficultyScore >= min && entry.difficultyScore <= max)
}

// Splits a candidate pool into the three progression phases, sorted ascending by difficulty.
function splitIntoPhases(candidates: typeof drillLibrary) {
  const sorted = [...candidates].sort((a, b) => a.difficultyScore - b.difficultyScore)
  const third = Math.ceil(sorted.length / 3) || 1
  return [sorted.slice(0, third), sorted.slice(third, third * 2), sorted.slice(third * 2)].filter((phase) => phase.length)
}

// Fisher-Yates shuffle. Used so repeated "Generate Workout" clicks with identical
// preferences don't always surface the exact same drill from a phase — with the library
// expanded to 12 drills/category (~4 per phase in a typical window), picking a fixed index
// every time made the plan feel static no matter how much content existed. Shuffling means
// every generation still respects the level window and Foundation -> Integration -> Game-Speed
// ordering, but rotates which specific drill fills each slot.
function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Picks drills by round-robin across the three phases — so a session always draws from
// Foundation, Integration, and Game-Speed rather than clustering at one difficulty —
// optionally ranking drills within each phase by relevance via `scoreFn` for custom-goal
// requests. Each phase is shuffled first (see `shuffle` above) for variety across repeated
// generations; when `scoreFn` is given the shuffle only breaks ties, since the subsequent
// stable sort still orders distinct scores by true relevance.
//
// Drills are added one at a time — each keeping its own real `duration` — until their
// combined duration reaches `targetMinutes`. The drill that crosses the target is kept in
// full even if that overshoots by a few minutes: overshooting is expected and preferred
// over resizing any drill to fit (see BUILD_INSTRUCTIONS.md workout-generation notes).
// Every unique candidate is used at most once (Stage 1); only once the entire pool has
// been exhausted and the target still isn't met does Stage 2 begin repeating drills.
// The final selection is always re-sorted ascending by difficultyScore so playback order
// is a smooth Phase 1 -> 2 -> 3 progression, never an abrupt jump.
function pickDrillsForDuration(
  candidates: typeof drillLibrary,
  targetMinutes: number,
  scoreFn?: (entry: typeof drillLibrary[number]) => number,
) {
  if (!candidates.length || targetMinutes <= 0) return []

  const phases = splitIntoPhases(candidates).map((phase) => {
    const shuffled = shuffle(phase)
    return scoreFn ? shuffled.sort((a, b) => scoreFn(b) - scoreFn(a)) : shuffled
  })
  if (!phases.length) return []

  const picks: typeof drillLibrary = []
  let total = 0

  // Stage 1: round-robin across phases, each unique drill used at most once.
  const cursors = phases.map(() => 0)
  let phaseIndex = 0
  while (total < targetMinutes && cursors.some((cursor, i) => cursor < phases[i].length)) {
    const idx = phaseIndex % phases.length
    if (cursors[idx] < phases[idx].length) {
      const entry = phases[idx][cursors[idx]]
      picks.push(entry)
      total += entry.duration
      cursors[idx] += 1
    }
    phaseIndex += 1
  }

  // Stage 2: every unique candidate has already been used but the target still isn't
  // met — only now start repeating drills, cycling back through the full pool.
  if (total < targetMinutes) {
    const pool = shuffle(candidates)
    const maxRepeats = pool.length * 50 // generous safety cap, avoids any pathological loop
    let i = 0
    while (total < targetMinutes && i < maxRepeats) {
      const entry = pool[i % pool.length]
      picks.push(entry)
      total += entry.duration
      i += 1
    }
  }

  return picks.sort((a, b) => a.difficultyScore - b.difficultyScore)
}

function getGoalDrills(preferences: WorkoutPreferences, level: number, harder?: boolean): Drill[] {
  const categories = normalizeCategories(preferences.selectedCategories, preferences.goal)
  const matchedLibrary = drillLibrary.filter((entry) => categories.includes(entry.category as DrillCategory) && filterByEquipment(entry, preferences))
  const rankedLibrary = harder ? matchedLibrary.filter((entry) => !/foundational/i.test(entry.description)) : matchedLibrary
  const pool = rankedLibrary.length ? rankedLibrary : matchedLibrary
  const levelCandidates = levelFilteredCandidates(pool, level)

  const selected = pickDrillsForDuration(levelCandidates, preferences.duration)
  return selected.map((entry) => buildDrillFromEntry(entry, preferences))
}

function buildCustomGoalDrills(preferences: WorkoutPreferences, profile: Profile) {
  const query = preferences.customGoal?.toLowerCase() ?? ''
  const categories = normalizeCategories(preferences.selectedCategories, preferences.goal)
  const candidates = drillLibrary.filter((entry) => categories.includes(entry.category as DrillCategory) && filterByEquipment(entry, preferences))
  const levelCandidates = levelFilteredCandidates(candidates, profile.skillLevel)

  const selections = pickDrillsForDuration(
    levelCandidates,
    preferences.duration,
    (entry) => scoreDrillForCustomGoal(entry, query),
  )

  if (!selections.length) {
    // Same fallback pool as before (category defaults + equipment), but still never allowed
    // to cross the athlete's skill-level difficulty range — see levelFilteredCandidates.
    const fallbackPool = drillLibrary.filter((entry) => categoryDefaults(preferences.goal).includes(entry.category) && filterByEquipment(entry, preferences))
    return levelFilteredCandidates(fallbackPool, profile.skillLevel)
      .slice(0, 4)
      .map((entry) => buildDrillFromEntry(entry, preferences))
  }

  return selections.map((entry) => buildDrillFromEntry(entry, preferences))
}

function getWarmupDrills(goal: WorkoutPreferences['goal'], intensity: WorkoutPreferences['intensity'], level: number, equipment: WorkoutPreferences['equipment'], environment: WorkoutPreferences['environment'], goals: string): Drill[] {
  const skillLabel = level >= 6 ? 'advanced' : level >= 4 ? 'balanced' : 'foundational'
  return [
    buildDrill(createId('warmup1'), `${goal} Activation`, 6, [`Prepare your body for a ${intensity.toLowerCase()} ${goal.toLowerCase()} session. Open the hips, ankles, and shoulders so your movement is crisp and efficient.`], `A 2D character moving through dynamic warm-up patterns tailored for ${goal.toLowerCase()} training.`),
    buildDrill(createId('warmup2'), 'Mobility & Rhythm', 4, [`Use a few low-stress reps to sharpen your posture and timing before the main block. Your ${skillLabel} profile and ${goals || 'training focus'} should guide the tempo.`], `A 2D character flowing through mobility and coordination work in a clean athletic posture.`),
    buildDrill(createId('warmup3'), `${equipment === 'None' ? 'Court-Based' : equipment} Setup`, 3, [`Set up your space for ${environment.toLowerCase()} work. If you have limited equipment, use cones, a chair, or a line on the floor to create structure.`], `A 2D character arranging a training environment for a focused practice session.`),
  ]
}

export function buildWorkoutPlan(profile: Profile, preferences: WorkoutPreferences, options?: { harder?: boolean }): WorkoutPlan {
  const goalDrills = preferences.customGoal?.trim()
    ? buildCustomGoalDrills(preferences, profile)
    : getGoalDrills(preferences, profile.skillLevel, options?.harder)
  const skipWarmup = isBallHandlingOnlyWorkout(preferences)
  const warmupDrills = skipWarmup
    ? []
    : getWarmupDrills(preferences.goal, preferences.intensity, profile.skillLevel, preferences.equipment, preferences.environment, profile.goals)

  const warmupMinutes = skipWarmup ? 0 : preferences.duration >= 60 && preferences.intensity === 'High' ? 10 : 6
  const mainBlockMinutes = preferences.duration - warmupMinutes

  const enrichedGoalDrills = goalDrills.map((drill, index) => ({
    ...drill,
    description: `${drill.description} ${drill.commonTechnicalMistake ? `Mistake: ${drill.commonTechnicalMistake}` : ''}`.trim(),
    commonTechnicalMistake: drill.commonTechnicalMistake,
    correctiveCue: drill.correctiveCue,
    goalReps: drill.goalReps,
    warmupRef: drill.warmupRef,
  }))

  return {
    id: createId('plan'),
    goal: preferences.goal,
    duration: preferences.duration,
    intensity: preferences.intensity,
    summary: `Professional ${preferences.duration}-minute ${preferences.goal.toLowerCase()} session for ${profile.name} in ${preferences.environment.toLowerCase()} with ${preferences.equipment.toLowerCase()} availability. High-intensity blocks are expanded to ${mainBlockMinutes} minutes${skipWarmup ? '' : ' with a structured warm-up'}.`,
    createdAt: new Date().toISOString(),
    checklist: [
      ...(skipWarmup ? [] : [{ section: 'Warm-up', items: warmupDrills }]),
      { section: `${preferences.goal} Drills`, items: enrichedGoalDrills },
    ],
  }
}

export function buildWeeklyChallenges(profile: Profile) {
  const level = profile.skillLevel
  const baseChallenges = [
    {
      title: level >= 6 ? 'Steph Curry 20-Make Challenge' : level >= 4 ? 'Form Shooting Flow' : 'Shot-Make Ladder',
      description: level >= 6 ? 'Run a high-paced shot-making circuit from five spots with a strict release and footwork standard.' : 'Stay disciplined with your form and keep your release clean under pressure.',
      target: level >= 6 ? '20 makes in 3 spots in under 4 minutes' : level >= 4 ? '15 makes from 5 spots with 2 breaths between reps' : '10 makes from 4 spots with a still finish',
      difficulty: level >= 6 ? 'Elite' : level >= 4 ? 'Advanced' : 'Foundational',
    },
    {
      title: level >= 6 ? 'Two-Ball Handle Pressure Set' : level >= 4 ? 'Crossover + Finish Ladder' : 'Low-Dribble Control Circuit',
      description: level >= 6 ? 'Use two balls and force a clean change of direction every rep while maintaining pace.' : 'Create efficient dribbles and complete a finishing move at the end of each rep.',
      target: level >= 6 ? '60 seconds of clean two-ball reps with zero drops' : level >= 4 ? '8 clean reps with a finish on both sides' : '6 clean reps with steady rhythm and posture',
      difficulty: level >= 6 ? 'Elite' : level >= 4 ? 'Advanced' : 'Foundational',
    },
  ]

  return baseChallenges
}
