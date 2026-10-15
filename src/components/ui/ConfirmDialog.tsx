'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

// Small centered confirmation modal — same dark-scrim overlay language as Sidebar's drawer
// (fixed inset-0 bg-black/60), but a centered card instead of a side panel, for the one-off
// "are you sure?" moments (currently just Recent Workouts' delete action).
export default function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel }: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-6 animate-fade-in" onClick={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-xs animate-pop-in rounded-card border border-border bg-surface p-5 shadow-elevated"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-base font-bold text-ink">{title}</p>
        <p className="mt-1.5 text-sm leading-6 text-ink-muted">{description}</p>
        <div className="mt-5 flex gap-2.5">
          <Button variant="secondary" size="md" fullWidth onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" size="md" fullWidth onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
