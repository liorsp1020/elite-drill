'use client'

import { useEffect, useMemo, useState } from 'react'
import { saveProfile } from '@/utils/storage'
import type { EquipmentOption, Profile } from '@/types'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

interface ProfileFormProps {
  onSave: (profile: Profile) => void
  profile: Profile | null
}

const initialProfile = {
  name: '',
  age: 0,
  skillLevel: 4,
  goals: '',
  equipment: 'None' as EquipmentOption,
}

const equipmentOptions: EquipmentOption[] = ['None', 'Full Gym', 'Weights', 'Resistance Bands']
const skillLevels = [1, 2, 3, 4, 5, 6, 7]

export default function ProfileForm({ onSave, profile }: ProfileFormProps) {
  const [name, setName] = useState(profile?.name ?? initialProfile.name)
  const [age, setAge] = useState(profile?.age ? String(profile.age) : '')
  const [skillLevel, setSkillLevel] = useState(profile?.skillLevel ? String(profile.skillLevel) : '4')
  const [goals, setGoals] = useState(profile?.goals ?? '')
  const [equipment, setEquipment] = useState<EquipmentOption>(profile?.equipment ?? 'None')

  const isValid = useMemo(() => name.trim().length > 1, [name])

  useEffect(() => {
    if (typeof window !== 'undefined' && profile === null && isValid) {
      saveProfile({ name: name.trim(), age: Number(age) || 0, skillLevel: Number(skillLevel) || 4, goals: goals.trim(), equipment })
    }
  }, [age, equipment, goals, isValid, name, profile, skillLevel])

  return (
    <div className="flex min-h-[80vh] flex-col justify-center space-y-6 py-8">
      <div className="text-center">
        <p className="text-4xl">🏀</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink">Welcome, Player</h1>
        <p className="mt-2 text-sm text-ink-muted">Set up your profile so your coach can personalize every session.</p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (!isValid) return
          onSave({ name: name.trim(), age: Number(age) || 0, skillLevel: Number(skillLevel) || 4, goals: goals.trim(), equipment })
        }}
        className="space-y-4"
      >
        <Card className="space-y-4">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-ink-muted">Full name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} className="rounded-2xl border border-border bg-surface2 px-4 py-3 text-ink" placeholder="Enter your name" />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-ink-muted">Age</span>
            <input type="number" min="8" max="40" value={age} onChange={(event) => setAge(event.target.value)} className="rounded-2xl border border-border bg-surface2 px-4 py-3 text-ink" placeholder="Age" />
          </label>

          <div>
            <p className="mb-2 text-sm font-medium text-ink-muted">Skill level</p>
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
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-ink-muted">Available equipment</p>
            <div className="flex flex-wrap gap-2">
              {equipmentOptions.map((option) => {
                const active = equipment === option
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setEquipment(option)}
                    className={`tap-shrink rounded-pill border px-4 py-2.5 text-sm font-semibold transition-colors ${
                      active ? 'border-accent bg-accent/15 text-accent-light' : 'border-border bg-surface2 text-ink-muted'
                    }`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-ink-muted">Training goals</span>
            <textarea value={goals} onChange={(event) => setGoals(event.target.value)} rows={3} className="rounded-2xl border border-border bg-surface2 px-4 py-3 text-ink" placeholder="Example: build explosiveness and improve footwork" />
          </label>
        </Card>

        <Button type="submit" size="lg" fullWidth disabled={!isValid}>Save profile</Button>
      </form>
    </div>
  )
}
