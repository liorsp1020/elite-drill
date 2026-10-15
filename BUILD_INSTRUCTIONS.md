# Elite Drill — Build Instructions

A complete specification for building **Elite Drill**, a mobile-first, NBA-styled personal
basketball coaching web app. Follow this document top to bottom to recreate the app from
scratch: stack, data model, screen-by-screen behavior, design system, and the drill content
itself.

---

## 1. Tech stack

| Layer      | Choice |
|------------|--------|
| Framework  | Next.js 14 (App Router), React 18, TypeScript 5 |
| Styling    | Tailwind CSS 3 (utility classes only, no component library) |
| State      | React Context (`AppContext`) — no external state library |
| Persistence| Browser `localStorage` (no backend/database) |
| Rendering  | Client components everywhere (`'use client'`) — this is a single-page app behind one route |

### Project scaffold

```bash
npx create-next-app@14.2.5 elite-drill --typescript --tailwind --app --no-src-dir=false
```

`package.json` dependencies:

```json
{
  "dependencies": {
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "@types/node": "20.14.2",
    "@types/react": "18.3.3",
    "@types/react-dom": "18.3.0",
    "autoprefixer": "10.4.19",
    "eslint": "8.57.0",
    "eslint-config-next": "14.2.5",
    "postcss": "8.4.40",
    "tailwindcss": "3.4.5",
    "typescript": "5.6.2"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

`tsconfig.json` needs a path alias so imports can use `@/`:

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

`tailwind.config.js` — plain default config, content glob over `src`:

```js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

### Folder layout

```
src/
  app/
    layout.tsx        # root shell, wraps everything in AppProvider
    page.tsx           # single route; switches panels by activeTab
    globals.css        # NBA theme tokens, background imagery
  components/
    BottomNav.tsx           # sticky tab bar (6 tabs)
    ProfileForm.tsx         # first-run onboarding gate
    DashboardPanel.tsx      # "Workout Planner" tab — selection UI
    TrainingHub.tsx         # "Dashboard" tab — generated plan browser
    ChatPanel.tsx            # "AI Coach" tab — chat UI
    ChallengesPanel.tsx     # weekly challenge cards
    HistoryPanel.tsx        # past-session timeline
    SettingsPanel.tsx       # edit profile + preferences directly
    DrillAnimation.tsx      # text-only cue-card breakdown for a single drill
    WorkoutDisplay.tsx      # full generated-plan renderer (checklist table)
    WorkoutCard.tsx          # legacy simple drill list card
    WorkoutAnimationPlaceholder.tsx
    WorkoutCreatorChat.tsx  # secondary chat used inline in the creator flow
    OnboardingForm.tsx      # legacy minimal name-only onboarding (superseded by ProfileForm)
  context/
    AppContext.tsx     # single source of truth: profile, preferences, plan, chat memory
  types/
    index.ts           # all shared TypeScript types
  utils/
    storage.ts          # localStorage read/write helpers
    workouts.ts          # workout-plan generation engine
    coach.ts             # AI coach reply generation + chat-driven preference tuning
    drillLibrary.ts      # the structured drill database (30 professional drills)
```

---

## 2. Data model (`src/types/index.ts`)

```ts
export type WorkoutGoal = 'Strength' | 'Skills' | 'Conditioning'
export type IntensityLevel = 'Low' | 'Medium' | 'High'
export type EquipmentOption = 'None' | 'Full Gym' | 'Weights' | 'Resistance Bands'
export type EnvironmentOption = 'Home' | 'Court' | 'Gym'
export type DrillCategory = 'Ball Handling' | 'Shooting' | 'Strength' | 'Defense' | 'Athleticism' | 'Skills'

export interface Profile {
  name: string
  age: number
  skillLevel: number        // 1–7
  goals: string
  equipment?: EquipmentOption
}

export interface WorkoutPreferences {
  goal: WorkoutGoal
  duration: 20 | 30 | 45 | 60 | 90
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
  section: string          // 'Warm-up' | '<Goal> Drills' — no Cool-down section anymore
  items: Drill[]
}

export interface WorkoutPlan {
  id: string
  goal: WorkoutGoal
  duration: 20 | 30 | 45 | 60 | 90
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
}
```

---

## 3. Persistence (`src/utils/storage.ts`)

Wrap every read/write in `typeof window === 'undefined'` guards (SSR safety) and `try/catch`
around `JSON.parse`. Five independent `localStorage` keys, each with its own
save/load pair:

| Key                     | Shape                    |
|--------------------------|---------------------------|
| `eliteDrillProfile`      | `Profile`                |
| `eliteDrillPreferences`  | `WorkoutPreferences`      |
| `eliteDrillPlan`         | `WorkoutPlan`             |
| `eliteDrillHistory`      | `WorkoutHistoryEntry[]`   |
| `eliteDrillCoachMemory`  | `string`                  |

No backend, no auth — everything lives on-device.

---

## 4. Global state (`src/context/AppContext.tsx`)

A single `AppProvider` wraps the whole app in `layout.tsx` and exposes one context consumed
via `useAppContext()`. This is the **only** place workout generation and persistence happen.

State held:
- `profile`, `preferences`, `workoutPlan`, `selectedCategories`, `history`, `coachMemory`, `activeTab`

On mount, hydrate all five pieces from `localStorage` via `utils/storage.ts`.

Exposed actions:

```ts
saveProfile(profile)            // sets profile + merges equipment into preferences, persists both
savePreferences(preferences)    // sets preferences + selectedCategories, persists
appendCoachMemory(note)         // rolling last-6-notes memory string, persists
generateWorkout(preferences, recordHistory?) // builds a plan via utils/workouts.ts, persists plan,
                                              // optionally appends a history entry
toggleCategory(category)        // ⚠️ selection ONLY — see rule below
clearCategories()               // empties selection and clears the current plan
```

> **Critical rule — do not violate this:** `toggleCategory` must **only** flip membership in
> `selectedCategories`. It must never call `generateWorkout`. Generation is triggered from
> exactly one place in the whole app: the explicit "Generate Workout" button's click handler
> in `DashboardPanel`. (An earlier version of this app called `generateWorkout` directly from
> `toggleCategory`, which produced a live-generating workout on every single category click —
> that is a bug, not a feature, and must not be reintroduced.)

`activeTab` union: `'planner' | 'dashboard' | 'coach' | 'history' | 'settings' | 'challenges'`.
Note the naming: the **`planner`** tab renders `DashboardPanel` (the selection/setup screen,
labeled "Workout Planner" in the nav) and the **`dashboard`** tab renders `TrainingHub` (the
generated-plan browser, labeled "Dashboard" in the nav). Keep this pairing — it's
counter-intuitive but consistent throughout the codebase.

---

## 5. App shell

### `layout.tsx`
Single `<html lang="en">` / `<body>` wrapping `{children}` in `<AppProvider>`. Body background
is `bg-slate-950 text-slate-100`. Metadata: title `"Elite Drill"`.

### `page.tsx`
One route. Reads `profile, history, activeTab, setActiveTab, saveProfile` from context.

- If `!profile`: render `ProfileForm` (first-run gate). Saving it calls `saveProfile` then
  `setActiveTab('planner')`.
- Else switch on `activeTab` to render one of: `DashboardPanel`, `TrainingHub`, `ChatPanel`,
  `HistoryPanel`, `ChallengesPanel`, `SettingsPanel`.

Layout: a hero header (basketball court photo background at low opacity + gradient overlay,
headline, dynamic subtitle built from the profile), the active panel below it with bottom
padding to clear the nav bar, then a sticky `BottomNav`.

### `BottomNav.tsx`
Sticky bottom tab bar, 6 tabs with emoji icons:

```
🏀 Workout Planner (planner)
📊 Dashboard        (dashboard)
💬 AI Coach          (coach)
🏅 Challenges        (challenges)
🕘 History           (history)
⚙️ Settings          (settings)
```

Active tab gets an amber pill (`bg-amber-500/20 text-amber-300`); inactive tabs are slate with
a subtle hover state.

---

## 6. Screen specs

### 6.1 Onboarding — `ProfileForm.tsx`

Shown only when no profile exists. Collects: full name (required, >1 char to be valid),
age, skill level (1–7, default 4), available equipment (select: None / Full Gym / Weights /
Resistance Bands), training goals (free text). Submit button disabled until name is valid.
On submit, call `onSave(profile)` (parent wires this to `saveProfile` + navigate to
`'planner'`).

### 6.2 Workout Planner — `DashboardPanel.tsx` (the `planner` tab)

This is the most behaviorally important screen — **read the flow rule carefully.**

**Controls (all of these only update local component state — none of them generate anything):**
- **Elements to work on** — a grid of toggle buttons for the 6 `DrillCategory` values
  (`Ball Handling`, `Shooting`, `Strength`, `Defense`, `Athleticism`, `Skills`). Multi-select.
  Clicking calls `toggleCategory` from context — selection only, nothing else.
- **Duration** — `<select>` of `20 / 45 / 60` minutes. Local state only.
- **Intensity** — `<select>` of `Low / Medium / High`. Local state only.
- **Custom notes** — free-text `<textarea>` for a specific focus (e.g. "vertical jump").
  Local state only — **no `onBlur` side effects.**

**Coach Preview panel** (right column) mirrors the current selection back to the user in
plain language: selected categories, duration + intensity, and the custom note (or a
placeholder). This is read-only — a preview, not a trigger.

**The one and only generation trigger:**
```
"Generate Workout (צור אימון)"
```
A dedicated, explicitly-labeled button. Its click handler is the *sole* code path allowed to
call `generateWorkout`:

```ts
const handleGenerate = () => {
  if (!profile) return
  const nextPreferences = buildPreferences() // assembles goal/duration/intensity/
                                              // equipment/environment/selectedCategories/
                                              // customGoal from current local + context state
  generateWorkout(nextPreferences, true)     // true = record a history entry
  setActiveTab('dashboard')                   // jump to TrainingHub to show the new plan
}
```

A secondary "Clear selection" button resets `selectedCategories` and clears `workoutPlan`
(via `clearCategories`).

Below the setup card: if `workoutPlan` exists, show a small "Live Plan" summary card;
otherwise show a dashed empty-state prompting the user to select categories and generate.

> **Regression to avoid:** do not wire `onClick`/`onChange`/`onBlur` on any of the category
> buttons, the duration select, the intensity select, or the notes textarea to call
> `generateWorkout` or `setActiveTab`. Only the Generate button does both.

### 6.3 Dashboard — `TrainingHub.tsx` (the `dashboard` tab)

Read-only browser for the current `workoutPlan`. If no plan exists yet, show an empty-state
card telling the user to go generate one. Otherwise:
- Header card: goal + "routine" title, plan summary.
- On mount and whenever a newly generated plan lands (new `workoutPlan.id`), the page resets
  scroll to the top so the workout title is always the first thing the user sees.
- Two-column layout: left column lists every `WorkoutSection` (Warm-up / `<Goal>` Drills) as
  cards, each drill a clickable row (title, description, duration badge); right column shows
  `DrillAnimation` (text-only drill breakdown — no video) for whichever drill is currently
  selected (defaults to the first drill).

### 6.4 AI Coach — `ChatPanel.tsx` (the `coach` tab)

A chat UI, message list above a single-line input + Send button, wrapped in a `<form>`.

**State:** `messages: {role: 'coach'|'user', text}[]`, `draft: string`, `isSending: boolean`.

**Greeting / seeding (do this once per profile, not on every render):**
Use a `useRef<string | null>` keyed on `profile.name` to guard the seeding effect so it fires
exactly once when a profile becomes available:

```ts
const greetedForRef = useRef<string | null>(null)
useEffect(() => {
  if (!profile) return
  if (greetedForRef.current === profile.name) return
  greetedForRef.current = profile.name
  // build greeting via getCoachGreeting(profile.name, preferences)
  // + a "profile loaded" summary line if preferences already exist
  // setMessages([...])
}, [profile])
```

> **Why the ref guard matters:** sending a message calls `generateWorkout`, which calls
> `savePreferences`, which creates a **new** `preferences` object reference in context on
> every reply. If this effect's dependency array includes `preferences` (or fires on every
> object-identity change), it will silently wipe the entire conversation back to the greeting
> right after every message — the chat will look completely unresponsive even though state
> updates are actually happening. Keying strictly off `profile.name` via the ref avoids this.

**Sending a message — single code path, used by both the Send button and Enter key:**

```ts
const sendMessage = (raw: string) => {
  const trimmed = raw.trim()
  if (!trimmed) return
  if (!profile || !preferences) { /* push a "save your profile first" coach message */; return }
  if (isSending) return

  setIsSending(true)
  setMessages(prev => [...prev, { role: 'user', text: trimmed }])
  setDraft('')                                   // clear input immediately
  appendCoachMemory(`User asked: ${trimmed}`)

  Promise.resolve()
    .then(() => buildCoachResponse(trimmed, profile, preferences, history, coachMemory, workoutPlan))
    .then((response) => {
      const nextPreferences = response.nextPreferences ?? preferences
      const plan = generateWorkout(nextPreferences, true)
      setMessages(prev => [...prev, { role: 'coach', text: plan ? response.reply : '…' }])
    })
    .catch(() => setMessages(prev => [...prev, { role: 'coach', text: 'Something interrupted that response — try asking again.' }]))
    .finally(() => setIsSending(false))
}
```

Wire it up so there is exactly one way in from the UI, both ending at `sendMessage`:
- `<form onSubmit={(e) => { e.preventDefault(); sendMessage(draft) }}>`
- `<input onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(draft) } }}>`
- Send `<button type="submit" disabled={isSending}>`

Message bubbles: coach messages left-aligned (`bg-slate-900`), user messages right-aligned
(`bg-amber-400 text-slate-950`), each labeled with role + name and rendered with
`white-space` preserved for multi-line coach replies.

### 6.5 Challenges — `ChallengesPanel.tsx`
Renders `buildWeeklyChallenges(profile)` (two skill-scaled challenge cards: a shooting
challenge and a ball-handling challenge, each with title/description/target/difficulty that
scale with `profile.skillLevel`).

### 6.6 History — `HistoryPanel.tsx`
Simple list of `WorkoutHistoryEntry` (focus, summary, duration, date), newest first, capped
at 8 entries by the context (`generateWorkout` truncates with `.slice(0, 8)`). Empty state
when no history yet.

### 6.7 Settings — `SettingsPanel.tsx`
A full form mirroring `Profile` + `WorkoutPreferences` fields (name, age, skill level,
equipment, environment, goal, duration, intensity, category multi-select, custom goal,
training goals). A single "Save changes" button calls `saveProfile` + `savePreferences`
together. This screen intentionally *does* save directly on click — it's an explicit edit
form, not a generation trigger, so this is fine as-is.

---

## 7. Progressive Workout Generation Engine (`src/utils/workouts.ts`)

`buildWorkoutPlan(profile, preferences, options?: { harder?: boolean }): WorkoutPlan`

Implemented in `workouts.ts` via `levelFilteredCandidates` + `pickAcrossPhases`, called from
both `getGoalDrills` (category-driven sessions) and `buildCustomGoalDrills` (free-text goal
sessions).

### Strict progressive ordering rules (crucial fix for smooth transitions)

1. **Level-based filtering & scaling.**
   - Every drill in the database carries a `difficultyScore` from `1` to `7`.
   - Drills selected for the main workout block must strictly match or build progressively
     toward the user's `profile.skillLevel`, within a window of `skillLevel - 1` to
     `skillLevel + 1`.
   - Example: a user at skill level 3 will never jump straight from level-1 static form
     shooting to level-7 elite pull-up shooting under defensive pressure — everything
     offered sits inside the `[2, 4]` window for that user.
2. **Stepped progression structure (no abrupt jumps).** The main workout block must be
   mathematically sorted and sequenced in ascending order of technical complexity and
   intensity:
   - **Phase 1 — Foundation & Activation:** low-complexity, controlled or stationary
     execution (e.g. one-hand form shooting close to the rim).
   - **Phase 2 — Integration & Moderate Speed:** rhythm, footwork, or dynamic movement added
     (e.g. form shooting with a 1–2 step setup, or basic stationary ball-handling combos).
   - **Phase 3 — Game-Speed / High Complexity:** advanced combinations, full-speed execution,
     or resistance/pressure drills matching the user's requested intensity and skill level.
3. **Custom goal relevance.** If `preferences.customGoal` is provided, candidate drills are
   still filtered and scored by semantic keyword relevance (as in `buildCustomGoalDrills`
   today), but the ascending Phase 1 → 2 → 3 difficulty curve above must be preserved — score
   for relevance *within* each phase, never let a high-relevance/high-difficulty drill jump
   ahead of the progression.
4. **Environment & equipment filtering.** Unchanged from before: exclude drills requiring
   unauthorized equipment or that are home-incompatible, based on `preferences.equipment` and
   `preferences.environment`.
5. **Warm-up integration.** Prepend 3 progressive warm-up drills matching the chosen
   categories — except when the only selected category is Ball Handling, which skips the
   warm-up section entirely (see `isBallHandlingOnlyWorkout` in `workouts.ts`). There is no
   cool-down/recovery drill of any kind; every workout ends with the last main-block drill.
6. **Time allocation.** Session length dictates drill count and phase distribution, e.g.
   20 min = 2 main-block drills + warm-up; 60 min = 5–6 progressive drills spanning all three
   phases + warm-up.
7. **Rotation across generations.** Each phase's candidates are shuffled before selection
   (`shuffle` in `workouts.ts`), so clicking "Generate Workout" again with identical
   preferences draws a *different* drill from each phase rather than deterministically
   returning the same plan every time. This only rotates *which* drill fills a phase slot —
   it never breaks the level window or the ascending phase order, and for custom-goal
   requests the shuffle only breaks ties between equally-relevant drills, never overrides
   the relevance ranking itself. This is what makes the expanded library in §9 actually felt
   as variety, not just unused inventory.

`buildWeeklyChallenges(profile)` returns two skill-scaled challenge objects (shooting +
ball-handling), independent of the workout plan.

---

## 8. AI Coach reply engine (`src/utils/coach.ts`)

- `getCoachGreeting(name, preferences)` — returns a welcome-back message referencing saved
  environment/equipment if preferences exist, otherwise a first-time welcome.
- `buildCoachSummary(preferences)` — one-line `"<goal> focus • <duration> min • <intensity>
  intensity • <environment> • <equipment>"` recap.
- `buildCoachResponse(request, profile, preferences, history, coachMemory, workoutPlan)` —
  the core reply generator:
  1. Guard: if no `profile`/`preferences`, return a stock "loading" reply with
     `nextPreferences: null`.
  2. Regex-classify the free-text request into intents: harder/challenge, recovery/lighter,
     shooting, handles, finishing, defense, conditioning. Each matched intent rewrites
     `goal`, `selectedCategories`, `duration`, `intensity`, and `customGoal` accordingly (e.g.
     asking about "crossover" sets `selectedCategories = ['Ball Handling', 'Athleticism']`
     and `customGoal = 'Ball control and crossover pace'`).
  3. Pick one representative drill from `drillLibrary` matching the request via
     `pickDrillForRequest` (keyword → category/name lookup) to ground the reply in a real,
     named drill rather than generic advice.
  4. Compose a long-form, structured coach reply: focus line, active-plan continuity note,
     Technical Objective, Technical Breakdown (first 3 execution steps), Common Mistake to
     Avoid, Goal Repetition Count (scaled by duration), Technical Cues, Progression,
     Regression/Easier Version, Fix/Technical Tip, a skill-level-scaled coaching cue, and a
     closing feedback checkpoint prompt.
  5. Return `{ reply, nextPreferences }` — the caller (`ChatPanel`) feeds `nextPreferences`
     straight into `generateWorkout` so the plan updates to match the conversation.

This is what makes the AI Coach feel like a real trainer instead of a canned FAQ bot — every
reply is grounded in a specific drill from the structured library and references the
athlete's actual profile/history/memory.

---

## 9. Drill library (`src/utils/drillLibrary.ts`)

A flat array of **75 professional drills**, **15 per category**, across all 6
`DrillCategory` values (`Ball Handling`, `Shooting`, `Strength`, `Defense`, `Athleticism`,
`Skills`). Each category's 15 drills span the full 1–7 `difficultyScore` range with
genuinely distinct movement patterns per tier — not reworded duplicates — e.g. Shooting runs
from a two-hand close-range form shot (1) through mid-range and pull-up work up to a
fatigue-contested pull-up three (7). This range is what makes §7's level-window + phase
selection meaningful instead of starved for options. Each entry conforms to:

```ts
interface ProfessionalDrillLibraryEntry {
  Name: string
  Category: DrillCategory
  difficultyScore: number    // 1–7, matched against profile.skillLevel — see §7
  WarmupRef?: string         // what to do to prep for this specific drill — omitted for Ball Handling
  ExecutionSteps: string[]   // ordered, numbered-in-UI coaching cues
  Duration: number           // minutes, used as a default block size
  Objective: string
  Equipment: string[]
  Description: string
  CommonTechnicalMistake: string
  CorrectiveCue: string
  GoalReps: string
}
```

`difficultyScore` is set on all entries today (1–7 scale, consistent with
`profile.skillLevel`'s own range) and is what the level-window and phase-sequencing logic in
§7 filters and sorts on.

When adding drills, keep every field filled in with real, specific coaching content (no
placeholder text) — this structured detail is what feeds both the generated workout
checklist and the AI Coach's "Technical Breakdown / Common Mistake / Fix" reply sections.
Every drill must have a proper warm-up reference, with one deliberate exception: Ball
Handling drills omit it, and a workout whose only selected category is Ball Handling skips
the warm-up section entirely (see §7, rule 5 — enforced structurally in `buildWorkoutPlan`,
not left to chance). Every other category always gets a warm-up section.

Drills carry no video reference of any kind — the app is text-only (name, description,
execution steps, duration); see §10.

---

## 10. Drill preview — `DrillAnimation.tsx`

Given a drill's `title`, `description`, `instructions`:
- Text-only. No video/iframe of any kind — the app never embeds exercise videos anywhere.
- Single panel: numbered "Training cues" list (split from `instructions` on newlines).

---

## 11. Design system — NBA aesthetic

This is a hard requirement to preserve on any future change: the app must always read as a
premium, dark, arena-lit basketball product, not a generic light SaaS UI.

**Palette**
- Base background: near-black navy gradient — `bg-slate-950` / `from-slate-950 via-slate-900
  to-slate-950`-style gradients, with a fixed low-opacity court-photo background layer
  (`body::before` in `globals.css`) plus a radial amber glow in the top-left.
- Accent: **amber/orange** (`amber-400`/`amber-500`) for every primary action, active state,
  focus ring, and highlight — never blue or green as the primary accent.
- Text: `slate-100`/`white` headings, `slate-300`/`slate-400` body/secondary text.

**Shape language**
- Large, soft corner radii everywhere: `rounded-[2rem]` for cards/sections, `rounded-2xl` /
  `rounded-3xl` for inputs, buttons, pills.
- Heavy, soft drop shadows on cards: `shadow-[0_24px_80px_rgba(0,0,0,0.45)]`.
- Thin 1px borders in `border-slate-800` / `border-white/10` to separate dark-on-dark
  surfaces.

**Typography**
- Font: Inter (fallback `'Segoe UI', sans-serif`).
- Section eyebrows: `text-sm font-semibold uppercase tracking-[0.35em] text-amber-400`.
- Headlines: `text-3xl`–`text-4xl font-semibold text-white`.

**Motifs**
- Header hero uses a real basketball court/arena photo at low opacity behind a dark gradient.
- Emoji icons in the bottom nav (🏀 📊 💬 🏅 🕘 ⚙️) instead of an icon library — keep this,
  it's intentional and lightweight.
- Every interactive control gets `focus:ring-2 focus:ring-amber-500` (set globally in
  `globals.css` on `button, input, select, textarea`).

Do not swap the accent color, lighten the base theme, or strip the court imagery when making
functional changes — the "elite NBA" feel is a first-class requirement, equal in priority to
the functional bug fixes.

---

## 12. Non-negotiable behavioral rules (recap)

1. **No side-effect generation.** Selecting a category, duration, intensity, or typing/
   blurring the custom-notes field must never call `generateWorkout`. Only the explicit
   "Generate Workout (צור אימון)" button does.
2. **Chat must never self-wipe.** The AI Coach's message-seeding effect must be guarded so it
   runs once per profile, not on every `preferences` object-identity change (which happens on
   every reply). Send must work identically from the Send button and the Enter key, through
   one shared `sendMessage` function.
3. **Every generated plan has a warm-up** (except a Ball-Handling-only session, which skips
   it). `buildWorkoutPlan` prepends 3 warm-up drills ahead of the goal-specific main block —
   there is no cool-down; the plan ends with the last main-block drill.
4. **Drills are real, structured content**, not lorem-ipsum — every drill carries execution
   steps, an objective, equipment, a common mistake, and a corrective cue, sourced from
   `drillLibrary.ts`.
5. **Keep the NBA dark/amber theme** on every screen (see §11).
