import { CircleDot, Target, Dumbbell, Shield, Zap, Star } from 'lucide-react'
import type { DrillCategory } from '@/types'

// Single source of truth for "which icon represents each category" — used everywhere a
// category needs a visual (Home, Plan, Settings, ProfileForm) instead of each screen
// picking its own. Lucide (professional, consistently-weighted line icons) throughout.
export const CATEGORY_ICONS: Record<DrillCategory, typeof Target> = {
  'Ball Handling': CircleDot,
  Shooting: Target,
  Strength: Dumbbell,
  Defense: Shield,
  Athleticism: Zap,
  Skills: Star,
}

export const CATEGORY_OPTIONS: { id: DrillCategory; label: string; description: string }[] = [
  { id: 'Ball Handling', label: 'Ball Handling', description: 'Dribbling control, moves & handles' },
  { id: 'Shooting', label: 'Shooting', description: 'Form, release & shot-making reps' },
  { id: 'Strength', label: 'Strength', description: 'Power, core & conditioning work' },
  { id: 'Defense', label: 'Defense', description: 'Footwork, stance & on-ball defense' },
  { id: 'Athleticism', label: 'Athleticism', description: 'Speed, agility & explosiveness' },
  { id: 'Skills', label: 'All-Around', description: 'Balanced mix across every area' },
]

export function CategoryIcon({ category, className = 'h-4 w-4' }: { category: DrillCategory; className?: string }) {
  const Icon = CATEGORY_ICONS[category]
  return <Icon className={className} strokeWidth={2.25} />
}
