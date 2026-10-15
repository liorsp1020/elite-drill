'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import type { DrillCategory, WorkoutPreferences } from '@/types'
import { getAvailableDurations } from '@/utils/workouts'
import { CATEGORY_OPTIONS, CategoryIcon } from '@/utils/categoryIcons'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import SectionTitle from '@/components/ui/SectionTitle'

const durationOptions = [20, 45, 60] as const
const intensityOptions: WorkoutPreferences['intensity'][] = ['Low', 'Medium', 'High']

export default function DashboardPanel() {
  const { profile, preferences, selectedCategories, toggleCategory, clearCategories, workoutPlan, generateWorkout, setActiveTab } = useAppContext()
  const [duration, setDuration] = useState<WorkoutPreferences['duration']>(preferences?.duration ?? 45)
  const [intensity, setIntensity] = useState<WorkoutPreferences['intensity']>(preferences?.intensity ?? 'Medium')
  const [customGoal, setCustomGoal] = useState(preferences?.customGoal ?? '')

  useEffect(() => {
    if (preferences?.duration) setDuration(preferences.duration)
    if (preferences?.intensity) setIntensity(preferences.intensity)
    if (preferences?.customGoal) setCustomGoal(preferences.customGoal)
  }, [preferences?.duration, preferences?.intensity, preferences?.customGoal])

  // Which durations are offered depends on the current category selection: Ball Handling
  // alone unlocks a short-format set, 2+ categories unlock 75 min on top of the base set.
  const availableDurations = useMemo(
    () => getAvailableDurations(selectedCategories, durationOptions),
    [selectedCategories],
  )

  // If the category selection changes and the current duration falls outside the newly
  // available options (e.g. switching from a multi-category 90-min session down to
  // Ball-Handling-only), snap to the closest still-available option instead of leaving
  // the select showing a value that's no longer a valid choice.
  useEffect(() => {
    if (availableDurations.includes(duration)) return
    const closest = availableDurations.reduce((best, option) =>
      Math.abs(option - duration) < Math.abs(best - duration) ? option : best,
    )
    setDuration(closest)
  }, [availableDurations, duration])

  const selectedSummary = useMemo(() => {
    if (!selectedCategories.length) return 'No focus areas selected yet'
    return selectedCategories.join(' • ')
  }, [selectedCategories])

  const buildPreferences = (): WorkoutPreferences => ({
    goal: preferences?.goal ?? 'Skills',
    duration,
    intensity,
    equipment: preferences?.equipment ?? profile?.equipment ?? 'None',
    environment: preferences?.environment ?? 'Court',
    selectedCategories,
    customGoal: customGoal.trim() ? customGoal.trim() : undefined,
  })

  // The ONLY place a workout is generated. Everything else below just records the
  // user's selections; this fires exclusively from the explicit "Generate Workout" click.
  const handleGenerate = () => {
    if (!profile) return

    const nextPreferences = buildPreferences()
    generateWorkout(nextPreferences, true)
    setActiveTab('dashboard')
  }

  // Selecting a category (Ball Handling, Shooting, Strength, ...) only toggles it in/out
  // of the selection — it must never generate a workout or navigate away.
  const handleCategoryToggle = (category: DrillCategory) => {
    toggleCategory(category)
  }

  // Choosing a duration only updates local state until Generate Workout is pressed.
  const handleDurationChange = (value: WorkoutPreferences['duration']) => {
    setDuration(value)
  }

  // Choosing an intensity only updates local state until Generate Workout is pressed.
  const handleIntensityChange = (value: WorkoutPreferences['intensity']) => {
    setIntensity(value)
  }

  return (
    <div className="space-y-7">
      <div className="pt-1">
        <h1 className="text-3xl font-bold tracking-tight text-ink">Plan Your Workout</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {profile?.name ?? 'Player'} • Level {profile?.skillLevel ?? 4}/7 • {profile?.equipment ?? preferences?.equipment ?? 'None'}
        </p>
      </div>

      <div>
        <SectionTitle>Categories</SectionTitle>
        <div className="grid grid-cols-2 gap-2.5">
          {CATEGORY_OPTIONS.map(({ id, label, description }) => {
            const active = selectedCategories.includes(id)
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleCategoryToggle(id)}
                className={`tap-shrink flex flex-col gap-1.5 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                  active ? 'border-accent bg-accent/15' : 'border-border bg-surface'
                }`}
              >
                <span className={`flex items-center gap-2 text-sm font-semibold ${active ? 'text-accent-light' : 'text-ink-muted'}`}>
                  <CategoryIcon category={id} />
                  {label}
                </span>
                <span className={`text-xs leading-4 ${active ? 'text-accent-light/80' : 'text-ink-faint'}`}>{description}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <SectionTitle>Duration</SectionTitle>
        <div className="flex gap-2.5">
          {availableDurations.map((option) => {
            const active = duration === option
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleDurationChange(option)}
                className={`tap-shrink flex-1 rounded-2xl border py-3.5 text-center text-sm font-bold transition-colors ${
                  active ? 'border-accent bg-accent/15 text-accent-light' : 'border-border bg-surface text-ink-muted'
                }`}
              >
                {option}<span className="ml-1 text-xs font-medium">min</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <SectionTitle>Intensity</SectionTitle>
        <div className="flex gap-2.5">
          {intensityOptions.map((option) => {
            const active = intensity === option
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleIntensityChange(option)}
                className={`tap-shrink flex-1 rounded-2xl border py-3.5 text-center text-sm font-bold transition-colors ${
                  active ? 'border-accent bg-accent/15 text-accent-light' : 'border-border bg-surface text-ink-muted'
                }`}
              >
                {option}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <SectionTitle>Custom Notes (optional)</SectionTitle>
        <textarea
          value={customGoal}
          onChange={(event) => setCustomGoal(event.target.value)}
          rows={3}
          className="w-full rounded-card border border-border bg-surface px-4 py-3.5 text-sm text-ink placeholder:text-ink-faint"
          placeholder="Example: focus on vertical jump or game-speed crossover"
        />
      </div>

      <Card className="bg-surface2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">Session Preview</p>
        <p className="mt-2 text-base font-semibold text-ink">{selectedSummary}</p>
        <p className="mt-1 text-sm text-ink-muted">{duration} min • {intensity} intensity</p>
      </Card>

      <div className="space-y-3">
        <Button size="lg" fullWidth onClick={handleGenerate} className="h-16 text-lg">
          🏀 Generate Workout
        </Button>
        <Button variant="ghost" size="md" fullWidth onClick={clearCategories}>
          Clear selection
        </Button>
      </div>

      {workoutPlan ? (
        <Card className="border-accent/30 bg-accent/10">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-light">Live Plan</p>
          <p className="mt-2 text-base font-semibold text-ink">Latest generated routine is ready</p>
          <p className="mt-1 text-sm text-ink-muted">{workoutPlan.summary}</p>
        </Card>
      ) : null}
    </div>
  )
}
