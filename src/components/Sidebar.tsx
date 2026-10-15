'use client'

import { useEffect } from 'react'
import { Home, CalendarClock, MessageCircle, History, Settings, X } from 'lucide-react'
import type { ActiveTab } from '@/context/AppContext'

interface SidebarProps {
  open: boolean
  activeTab: ActiveTab
  onNavigate: (tab: ActiveTab) => void
  onClose: () => void
}

// The 5 primary destinations, moved over verbatim from the old BottomNav — see
// page.tsx's ROOT_TABS comment for why the other tabs (Workout, Challenges, Statistics,
// Achievements, Completion) aren't listed here.
const NAV_ITEMS: { id: ActiveTab; label: string; Icon: typeof Home }[] = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'planner', label: 'Plan', Icon: CalendarClock },
  { id: 'coach', label: 'Coach', Icon: MessageCircle },
  { id: 'history', label: 'Recent Workouts', Icon: History },
  { id: 'settings', label: 'Settings', Icon: Settings },
]

// Left-side navigation drawer, replacing the old fixed bottom tab bar. Always mounted
// (never conditionally rendered) so the slide/fade is a real CSS transition rather than
// an abrupt mount/unmount — open state only toggles transform/opacity classes.
export default function Sidebar({ open, activeTab, onNavigate, onClose }: SidebarProps) {
  // Lock background scroll and allow Escape-to-close while the drawer is open — standard
  // modal/drawer behavior, matches the overlay-tap-to-close requirement in spirit.
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  const handleNavigate = (tab: ActiveTab) => {
    onNavigate(tab)
    onClose()
  }

  return (
    <>
      {/* Overlay — subtle dark scrim over the rest of the screen, tap to close. */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ease-out ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Panel — slides in from the left, ~80% width, never full-screen. */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-y-0 left-0 z-50 flex w-[80%] max-w-[320px] flex-col rounded-r-card bg-surface shadow-elevated transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Branding + close — same gradient language as the Home Hero card, so the drawer
            reads as part of the same premium identity rather than a plain utility menu. */}
        <div className="relative overflow-hidden rounded-tr-card bg-gradient-to-br from-accent-light via-accent to-accent-dark px-5 pb-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] shadow-card">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center justify-between">
            {/* Branding doubles as a Home shortcut — tapping it from anywhere routes home
                through the same setActiveTab used by the nav list below and closes the
                drawer, exactly like selecting "Home" from the list. Visual markup below is
                untouched; only wrapped in a button so it's tappable. */}
            <button
              type="button"
              onClick={() => handleNavigate('home')}
              aria-label="Go to Home"
              className="tap-shrink flex items-center gap-2.5 text-left"
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full glass text-lg">🏀</span>
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-white">Elite Drill</p>
                <p className="text-[11px] font-medium text-white/75">Basketball Training</p>
              </div>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="glass tap-shrink flex h-9 w-9 flex-none items-center justify-center rounded-full text-white"
            >
              <X className="h-4 w-4" strokeWidth={2.4} />
            </button>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 pb-6">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleNavigate(id)}
                className={`tap-shrink flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left transition-colors ${
                  active ? 'bg-accent/15' : 'hover:bg-surface2'
                }`}
              >
                <span
                  className={`flex h-10 w-10 flex-none items-center justify-center rounded-full transition-colors ${
                    active ? 'bg-accent text-white' : 'bg-surface2 text-ink-muted'
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
                </span>
                <span className={`text-[15px] font-semibold ${active ? 'text-accent' : 'text-ink'}`}>{label}</span>
                {active ? <span className="ml-auto h-2 w-2 flex-none rounded-full bg-accent" /> : null}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-5 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <p className="text-center text-[11px] font-medium text-ink-faint">Train with purpose. 🏀</p>
        </div>
      </aside>
    </>
  )
}
