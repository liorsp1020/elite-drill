'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import type { EquipmentOption, EnvironmentOption, Profile, WorkoutPreferences } from '@/types'
import { getAvailableDurations } from '@/utils/workouts'
import { CATEGORY_OPTIONS, CategoryIcon } from '@/utils/categoryIcons'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import SectionTitle from '@/components/ui/SectionTitle'

const durationOptions = [30, 60, 90] as const
const equipmentOptions: EquipmentOption[] = ['None', 'Full Gym', 'Weights', 'Resistance Bands']
const environmentOptions: EnvironmentOption[] = ['Home', 'Court', 'Gym']
const goalOptions: WorkoutPreferences['goal'][] = ['Skills', 'Strength', 'Conditioning']
const intensityOptions: WorkoutPreferences['intensity'][] = ['Low', 'Medium', 'High']
const skillLevels = [1, 2, 3, 4, 5, 6, 7]

function ChipRow<T extends string | number>({ options, value, onChange, render }: { options: T[]; value: T; onChange: (v: T) => void; render?: (v: T) => string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = value === option
        return (
          <button
            key={String(option)}
            type="button"
            onClick={() => onChange(option)}
            className={`tap-shrink rounded-pill border px-4 py-2.5 text-sm font-semibold transition-colors ${
              active ? 'border-accent bg-accent/15 text-accent-light' : 'border-border bg-surface2 text-ink-muted'
            }`}
          >
            {render ? render(option) : option}
          </button>
        )
      })}
    </div>
  )
}

export default function SettingsPanel() {
  const { profile, preferences, saveProfile, savePreferences } = useAppContext()
  const [name, setName] = useState(profile?.name ?? '')
  const [age, setAge] = useState(profile?.age ? String(profile.age) : '')
  const [skillLevel, setSkillLevel] = useState(profile?.skillLevel ? String(profile.skillLevel) : '4')
  const [goals, setGoals] = useState(profile?.goals ?? '')
  const [equipment, setEquipment] = useState<EquipmentOption>(preferences?.equipment ?? 'None')
  const [environment, setEnvironment] = useState<EnvironmentOption>(preferences?.environment ?? 'Court')
  const [goal, setGoal] = useState<WorkoutPreferences['goal']>(preferences?.goal ?? 'Skills')
  const [duration, setDuration] = useState<WorkoutPreferences['duration']>(preferences?.duration ?? 30)
  const [intensity, setIntensity] = useState<WorkoutPreferences['intensity']>(preferences?.intensity ?? 'Medium')
  const [selectedCategories, setSelectedCategories] = useState<WorkoutPreferences['selectedCategories']>(preferences?.selectedCategories ?? [])
  const [customGoal, setCustomGoal] = useState(preferences?.customGoal ?? '')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setName(profile?.name ?? '')
    setAge(profile?.age ? String(profile.age) : '')
    setSkillLevel(profile?.skillLevel ? String(profile.skillLevel) : '4')
    setGoals(profile?.goals ?? '')
    setEquipment(preferences?.equipment ?? 'None')
    setEnvironment(preferences?.environment ?? 'Court')
    setGoal(preferences?.goal ?? 'Skills')
    setDuration(preferences?.duration ?? 30)
    setIntensity(preferences?.intensity ?? 'Medium')
    setSelectedCategories(preferences?.selectedCategories ?? [])
    setCustomGoal(preferences?.customGoal ?? '')
  }, [profile, preferences])

  const isValid = useMemo(() => name.trim().length > 1, [name])

  // Which durations are offered depends on the current category selection: Ball Handling
  // alone unlocks a short-format set, 2+ categories unlock 75 min on top of the base set.
  const availableDurations = useMemo(
    () => getAvailableDurations(selectedCategories, durationOptions),
    [selectedCategories],
  )

  // If the category selection changes and the current duration falls outside the newly
  // available options, snap to the closest still-available option.
  useEffect(() => {
    if (availableDurations.includes(duration)) return
    const closest = availableDurations.reduce((best, option) =>
      Math.abs(option - duration) < Math.abs(best - duration) ? option : best,
    )
    setDuration(closest)
  }, [availableDurations, duration])

  const toggleCategory = (category: WorkoutPreferences['selectedCategories'][number]) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category],
    )
  }

  const handleSave = () => {
    if (!isValid) return

    const nextProfile: Profile = {
      name: name.trim(),
      age: Number(age) || 0,
      skillLevel: Number(skillLevel) || 4,
      goals: goals.trim(),
    }

    const nextPreferences: WorkoutPreferences = {
      goal,
      duration,
      intensity,
      equipment,
      environment,
      selectedCategories,
      customGoal: customGoal.trim() ? customGoal.trim() : undefined,
    }

    saveProfile(nextProfile)
    savePreferences(nextPreferences)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 pb-2">
      <div className="pt-1">
        <h1 className="text-3xl font-bold tracking-tight text-ink">Settings</h1>
        <p className="mt-1 text-sm text-ink-muted">Your profile, skill level, and training preferences.</p>
      </div>

      <Card className="space-y-4">
        <SectionTitle>Profile</SectionTitle>
        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-ink-muted">Full name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} className="rounded-2xl border border-border bg-surface2 px-4 py-3 text-ink" />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-ink-muted">Age</span>
          <input type="number" min="8" max="40" value={age} onChange={(event) => setAge(event.target.value)} className="rounded-2xl border border-border bg-surface2 px-4 py-3 text-ink" />
        </label>
      </Card>

      <Card className="space-y-3">
        <SectionTitle>Skill Level</SectionTitle>
        <p className="text-sm text-ink-muted">Controls which exercises the generator selects for you.</p>
        <div className="grid grid-cols-7 gap-1.5">
          {skillLevels.map((level) => {
            const active = Number(skillLevel) === level
            return (
              <button
                key={level}
                type="button"
                onClick={() => setSkillLevel(String(level))}
                className={`tap-shrink flex aspect-square w-full items-center justify-center rounded-full border text-sm font-bold transition-colors ${
                  active ? 'border-accent bg-accent text-white' : 'border-border bg-surface2 text-ink-muted'
                }`}
              >
                {level}
              </button>
            )
          })}
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle>Categories</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map(({ id, label }) => {
            const active = selectedCategories.includes(id)
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleCategory(id)}
                className={`tap-shrink flex items-center gap-1.5 rounded-pill border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  active ? 'border-accent bg-accent/15 text-accent-light' : 'border-border bg-surface2 text-ink-muted'
                }`}
              >
                <CategoryIcon category={id} />
                {label}
              </button>
            )
          })}
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle>App Preferences</SectionTitle>

        <div>
          <p className="mb-2 text-sm font-medium text-ink-muted">Equipment</p>
          <ChipRow options={equipmentOptions} value={equipment} onChange={setEquipment} />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink-muted">Environment</p>
          <ChipRow options={environmentOptions} value={environment} onChange={setEnvironment} />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink-muted">Workout Goal</p>
          <ChipRow options={goalOptions} value={goal} onChange={setGoal} />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink-muted">Default Session Length</p>
          <ChipRow options={[...availableDurations]} value={duration} onChange={setDuration} render={(v) => `${v} min`} />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-ink-muted">Default Intensity</p>
          <ChipRow options={intensityOptions} value={intensity} onChange={setIntensity} />
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionTitle>Training Goals</SectionTitle>
        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-ink-muted">Custom training goal</span>
          <textarea value={customGoal} onChange={(event) => setCustomGoal(event.target.value)} rows={3} className="rounded-2xl border border-border bg-surface2 px-4 py-3 text-ink" />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-ink-muted">Training goals</span>
          <textarea value={goals} onChange={(event) => setGoals(event.target.value)} rows={4} className="rounded-2xl border border-border bg-surface2 px-4 py-3 text-ink" />
        </label>
      </Card>

      <Button size="lg" fullWidth onClick={handleSave} disabled={!isValid}>
        {saved ? '✓ Saved' : 'Save changes'}
      </Button>
    </div>
  )
}
