'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, ChevronDown, Flag, Play } from 'lucide-react'
import { useAppContext } from '@/context/AppContext'
import { CategoryIcon } from '@/utils/categoryIcons'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ProgressBar from '@/components/ui/ProgressBar'
import ScreenHeader from '@/components/ui/ScreenHeader'

export default function TrainingHub() {
  const { profile, workoutPlan, workoutSource, setActiveTab, finishWorkout } = useAppContext()
  const [selectedDrillId, setSelectedDrillId] = useState<string | null>(null)
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  // A workout reopened from Recent Workouts opens into a read-only preview first — "Choose
  // saved workout -> See complete workout + all exercises -> START WORKOUT" — rather than
  // straight into the interactive session. Freshly generated workouts are unaffected: this
  // page fully remounts on every navigation to it (page.tsx keys its content wrapper on
  // activeTab), so `started` naturally resets to false each time regardless of source.
  const [started, setStarted] = useState(false)
  const showPreview = workoutSource === 'library' && !started

  // Every newly generated plan gets a fresh id (see createId('plan') in workouts.ts), so
  // this fires exactly once per new workout — resetting the view to the top regardless of
  // wherever the page happened to be scrolled to before generation (e.g. mid-way down the
  // Dashboard form), and clearing completion checkmarks from any previous session.
  useEffect(() => {
    if (!workoutPlan) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    setSelectedDrillId(null)
    setCompletedIds(new Set())
  }, [workoutPlan?.id])

  const drills = useMemo(() => workoutPlan?.checklist.flatMap((section) => section.items) ?? [], [workoutPlan])
  const activeIndex = useMemo(() => {
    if (!selectedDrillId) return 0
    const index = drills.findIndex((item) => item.id === selectedDrillId)
    return index === -1 ? 0 : index
  }, [drills, selectedDrillId])
  const activeDrillId = drills[activeIndex]?.id ?? null

  if (!workoutPlan) {
    return (
      <div className="space-y-4 pt-1">
        <h1 className="text-3xl font-bold tracking-tight text-ink">Workout</h1>
        <Card className="text-center">
          <p className="text-sm text-ink-muted">Select categories on the Plan tab to generate a professional workout plan.</p>
          <Button className="mt-4" fullWidth onClick={() => setActiveTab('planner')}>Go to Plan</Button>
        </Card>
      </div>
    )
  }

  const goToIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(drills.length - 1, index))
    setSelectedDrillId(drills[clamped]?.id ?? null)
  }

  const toggleCompleted = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleFinish = () => {
    finishWorkout(completedIds.size)
  }

  return (
    <div className="space-y-6">
      <ScreenHeader title={`${workoutPlan.goal} Workout`} onBack={() => setActiveTab('home')} />

      {/* Duration + difficulty summary, required at the top of the screen. */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">Duration</p>
          <p className="mt-1.5 text-2xl font-bold text-ink">{workoutPlan.duration} <span className="text-sm font-medium text-ink-muted">min</span></p>
        </Card>
        <Card className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">Difficulty</p>
          <p className="mt-1.5 text-2xl font-bold text-ink">Lv {profile?.skillLevel ?? 4} <span className="text-sm font-medium text-ink-muted">/ 7</span></p>
        </Card>
      </div>

      <p className="text-sm leading-6 text-ink-muted">{workoutPlan.summary}</p>

      {/* Progress indicator — only once the session has actually started; a reopened saved
          workout is still in its read-only preview at this point, so there's no "current
          exercise" to track yet. */}
      {!showPreview ? (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Exercise {activeIndex + 1} of {drills.length}</p>
            <p className="text-sm font-semibold text-accent">✓ {completedIds.size}/{drills.length} done</p>
          </div>
          <ProgressBar value={((activeIndex + 1) / Math.max(drills.length, 1)) * 100} />
          <div className="mt-3 flex gap-2.5">
            <Button variant="secondary" size="sm" className="flex-1" onClick={() => goToIndex(activeIndex - 1)} disabled={activeIndex === 0}>
              ← Previous
            </Button>
            <Button variant="secondary" size="sm" className="flex-1" onClick={() => goToIndex(activeIndex + 1)} disabled={activeIndex === drills.length - 1}>
              Next →
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-faint">{drills.length} exercises • scroll to preview the full workout</p>
      )}

      {/* Exercise list — one card per section, each exercise an expandable accordion card
          showing every requested field without a separate desktop-style preview panel. */}
      <div className="space-y-6">
        {workoutPlan.checklist.map((section) => (
          <div key={section.section}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-ink-muted">{section.section}</h3>
              <span className="text-xs text-ink-faint">{section.items.length} drills</span>
            </div>

            <div className="space-y-3">
              {section.items.map((item, index) => {
                const expanded = activeDrillId === item.id
                const done = completedIds.has(item.id)
                return (
                  <Card
                    key={item.id}
                    interactive
                    animateIndex={index}
                    onClick={() => setSelectedDrillId((prev) => (prev === item.id ? prev : item.id))}
                    className={expanded ? 'border-accent/40' : done ? 'border-accent/25' : ''}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checking off exercises is a "performing the workout" action — hidden
                          during the read-only preview, before the user has pressed Start. */}
                      {!showPreview ? (
                        <button
                          type="button"
                          aria-label={done ? 'Mark exercise incomplete' : 'Mark exercise complete'}
                          onClick={(event) => {
                            event.stopPropagation()
                            toggleCompleted(item.id)
                          }}
                          className={`tap-shrink mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 transition-colors ${
                            done ? 'border-accent bg-accent text-white' : 'border-border text-transparent'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </button>
                      ) : (
                        <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-surface2 text-xs font-bold text-ink-faint">
                          {index + 1}
                        </span>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className={`text-base font-bold ${done ? 'text-ink-muted line-through decoration-accent/60' : 'text-ink'}`}>{item.title}</h4>
                          <ChevronDown className={`mt-1 h-4 w-4 flex-none text-ink-faint transition-transform ${expanded ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {item.difficultyScore ? <Badge tone="accent">Lv {item.difficultyScore}</Badge> : null}
                          <Badge>{item.durationMinutes ?? 0} min</Badge>
                          {item.category ? <Badge tone="outline" icon={<CategoryIcon category={item.category} className="h-3 w-3" />}>{item.category}</Badge> : null}
                        </div>

                        {expanded ? (
                          <div className="mt-4 space-y-4 border-t border-border pt-4">
                            <p className="text-sm leading-6 text-ink-muted">{item.description}</p>

                            {item.equipmentNeeded?.length ? (
                              <div>
                                <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink-faint">Equipment</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {item.equipmentNeeded.map((eq, index) => <Badge key={`${eq}-${index}`} tone="outline">{eq}</Badge>)}
                                </div>
                              </div>
                            ) : null}

                            {item.executionSteps?.length ? (
                              <div>
                                <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink-faint">Execution Steps</p>
                                <ol className="space-y-1.5">
                                  {item.executionSteps.map((step, stepIndex) => (
                                    <li key={`${item.id}-step-${stepIndex}`} className="flex gap-2 text-sm leading-6 text-ink-muted">
                                      <span className="flex-none font-semibold text-accent">{stepIndex + 1}.</span>
                                      {step}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            ) : null}

                            {item.correctiveCue ? (
                              <div className="rounded-2xl bg-surface2 p-3.5">
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-light">Technical Tip</p>
                                <p className="mt-1 text-sm leading-6 text-ink">{item.correctiveCue}</p>
                              </div>
                            ) : null}

                            {item.commonTechnicalMistake ? (
                              <p className="text-xs leading-5 text-ink-faint">⚠ Avoid: {item.commonTechnicalMistake}</p>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {showPreview ? (
        /* Begins the interactive session for a reopened saved workout — exercise 1, same
           order and durations as saved, never regenerated. */
        <Button
          size="lg"
          fullWidth
          className="shadow-elevated"
          onClick={() => {
            setStarted(true)
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
          }}
          icon={<Play className="h-5 w-5" strokeWidth={2.25} fill="currentColor" />}
        >
          Start Workout
        </Button>
      ) : (
        /* Finish — the entry point into the Completion screen. Always available, even if the
           user hasn't checked off every exercise, so a partial session can still be logged. */
        <Button size="lg" fullWidth onClick={handleFinish} icon={<Flag className="h-5 w-5" strokeWidth={2.25} />}>
          Finish Workout
        </Button>
      )}
    </div>
  )
}
