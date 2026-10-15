'use client'

import { useState } from 'react'
import { Trash2, ListChecks, CalendarClock, ChevronRight } from 'lucide-react'
import type { WorkoutHistoryEntry } from '@/types'
import { useAppContext } from '@/context/AppContext'
import { CategoryIcon } from '@/utils/categoryIcons'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface HistoryPanelProps {
  entries: WorkoutHistoryEntry[]
}

export default function HistoryPanel({ entries }: HistoryPanelProps) {
  const { openHistoryEntry, deleteHistoryEntry, setActiveTab } = useAppContext()
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  return (
    <div className="space-y-5">
      <div className="pt-1">
        <h1 className="text-3xl font-bold tracking-tight text-ink">Recent Workouts</h1>
        <p className="mt-1 text-sm text-ink-muted">Your saved training sessions — open any of them exactly as generated.</p>
      </div>

      {entries.length === 0 ? (
        <Card className="text-center">
          <p className="text-base font-bold text-ink">Your Recent Workouts</p>
          <p className="mt-2 text-sm text-ink-muted">No workouts yet.</p>
          <p className="mt-1 text-sm text-ink-muted">Generate your first workout and it will appear here.</p>
          <Button className="mt-5" fullWidth onClick={() => setActiveTab('planner')}>
            Generate Workout
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => {
            const exercises = entry.plan?.checklist.flatMap((section) => section.items)
            const exerciseCount = exercises?.length
            const categories = entry.preferences?.selectedCategories ?? []
            const openable = Boolean(entry.plan)
            // Skill/difficulty range for this saved workout, derived from its own exercises
            // (the plan doesn't separately store the skill level it was generated for).
            const difficultyScores = exercises?.map((item) => item.difficultyScore).filter((v): v is number => Boolean(v)) ?? []
            const minDifficulty = difficultyScores.length ? Math.min(...difficultyScores) : null
            const maxDifficulty = difficultyScores.length ? Math.max(...difficultyScores) : null

            return (
              <Card
                key={entry.id}
                animateIndex={index}
                interactive={openable}
                onClick={openable ? () => openHistoryEntry(entry.id) : undefined}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-bold text-ink">{entry.focus}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-faint">
                      <CalendarClock className="h-3.5 w-3.5" strokeWidth={2.25} />
                      {entry.date}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Delete workout"
                    onClick={(event) => {
                      event.stopPropagation()
                      setPendingDeleteId(entry.id)
                    }}
                    className="tap-shrink flex h-9 w-9 flex-none items-center justify-center rounded-full border border-border bg-surface2 text-ink-faint hover:border-red-500/40 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2.25} />
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <Badge tone="accent">{entry.duration} min</Badge>
                  {exerciseCount !== undefined ? (
                    <Badge icon={<ListChecks className="h-3 w-3" strokeWidth={2.25} />}>{exerciseCount} exercises</Badge>
                  ) : null}
                  {minDifficulty !== null ? (
                    <Badge>{minDifficulty === maxDifficulty ? `Lv ${minDifficulty}` : `Lv ${minDifficulty}–${maxDifficulty}`}</Badge>
                  ) : null}
                  {categories.map((category) => (
                    <Badge key={category} tone="outline" icon={<CategoryIcon category={category} className="h-3 w-3" />}>
                      {category}
                    </Badge>
                  ))}
                </div>

                {openable ? (
                  <div className="mt-3 flex items-center gap-1 border-t border-border pt-3 text-xs font-bold uppercase tracking-[0.08em] text-accent-light">
                    View Workout
                    <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-ink-faint">Saved before this workout's exact plan was recorded — generate a new one to reopen it later.</p>
                )}
              </Card>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete this workout?"
        description="This workout will be permanently removed."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) deleteHistoryEntry(pendingDeleteId)
          setPendingDeleteId(null)
        }}
      />
    </div>
  )
}
