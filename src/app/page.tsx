'use client'

import { useEffect, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import AchievementsScreen from '@/components/AchievementsScreen'
import ChallengesPanel from '@/components/ChallengesPanel'
import ChatPanel from '@/components/ChatPanel'
import CompletionScreen from '@/components/CompletionScreen'
import DashboardPanel from '@/components/DashboardPanel'
import HistoryPanel from '@/components/HistoryPanel'
import HomeScreen from '@/components/HomeScreen'
import ProfileForm from '@/components/ProfileForm'
import SettingsPanel from '@/components/SettingsPanel'
import Sidebar from '@/components/Sidebar'
import StatisticsScreen from '@/components/StatisticsScreen'
import TrainingHub from '@/components/TrainingHub'
import { useAppContext } from '@/context/AppContext'
import type { ActiveTab } from '@/context/AppContext'

// The 5 primary destinations reachable from the left nav sidebar — the same set that used
// to live in the bottom tab bar. Every other tab (Workout, Challenges, Statistics,
// Achievements, Completion) is a "pushed" detail screen reached contextually and already
// owns its own ScreenHeader back button, so it doesn't get the menu button too — mirrors
// the native pattern of a drawer trigger on root/tab screens vs. a back arrow on detail
// screens, never both in the same corner.
const ROOT_TABS: ActiveTab[] = ['home', 'planner', 'coach', 'history', 'settings']

export default function HomePage() {
  const { profile, history, activeTab, setActiveTab, saveProfile } = useAppContext()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Every screen should always open at the top, never wherever the previous screen
  // happened to be scrolled to — the one exception (a freshly generated workout replacing
  // an already-visible plan without a tab change) is handled separately inside
  // TrainingHub, keyed on the plan's own id. Also re-fires on the ProfileForm -> HomeScreen
  // transition specifically: activeTab is already 'home' by default, so onboarding's
  // `setActiveTab('home')` is a same-value no-op that wouldn't otherwise re-trigger this —
  // without the extra dependency, a scroll position left over from filling out the profile
  // form (mobile browsers auto-scroll focused inputs into view) would carry straight into
  // Home, cutting off content — and now the top-left menu button — at the top of the screen.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [activeTab, Boolean(profile)])

  const content = !profile ? (
    <ProfileForm onSave={(nextProfile) => {
      saveProfile(nextProfile)
      setActiveTab('home')
    }} profile={profile} />
  ) : activeTab === 'home' ? (
    <HomeScreen />
  ) : activeTab === 'planner' ? (
    <DashboardPanel />
  ) : activeTab === 'dashboard' ? (
    <TrainingHub />
  ) : activeTab === 'coach' ? (
    <ChatPanel />
  ) : activeTab === 'history' ? (
    <HistoryPanel entries={history} />
  ) : activeTab === 'challenges' ? (
    <ChallengesPanel profile={profile} />
  ) : activeTab === 'statistics' ? (
    <StatisticsScreen />
  ) : activeTab === 'achievements' ? (
    <AchievementsScreen />
  ) : activeTab === 'completion' ? (
    <CompletionScreen />
  ) : (
    <SettingsPanel />
  )

  const showTopHeader = profile && ROOT_TABS.includes(activeTab)

  // Mobile-first shell: a single phone-width column (max-w-md), no desktop-style wide
  // hero header — each screen owns its own title/header so the chrome never competes
  // with the content for a small viewport's vertical space. Navigation is a left-side
  // drawer (see Sidebar.tsx) opened via the top-left menu button, replacing the old fixed
  // bottom tab bar entirely — no reserved bottom clearance needed anymore.
  return (
    <main className="min-h-screen bg-bg">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pt-6 sm:px-5">
        {showTopHeader ? (
          // Relative/absolute pairing rather than flex justify-between: the ⋮ button's
          // width alone would otherwise pull a flex-centered logo off true center. The
          // logo is centered on the header's own midpoint (left-1/2 + -translate-x-1/2),
          // sized to its own content rather than a full-width overlay, so it stays
          // mathematically centered without ever overlapping the ⋮ button's click area.
          <div className="relative mb-4 h-11">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="tap-shrink flex h-11 w-11 flex-none items-center justify-center rounded-full border border-border bg-surface text-ink shadow-card"
            >
              <MoreVertical className="h-5 w-5" strokeWidth={2.4} />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              aria-label="Go to Home"
              className="tap-shrink absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1.5 whitespace-nowrap text-xs font-bold uppercase tracking-[0.18em] text-ink"
            >
              🏀 Elite Drill
            </button>
          </div>
        ) : null}
        <div key={activeTab} className="screen-transition flex-1 pb-[calc(env(safe-area-inset-bottom)+2rem)]">
          {content}
        </div>
      </div>

      {profile ? (
        <Sidebar open={sidebarOpen} activeTab={activeTab} onNavigate={setActiveTab} onClose={() => setSidebarOpen(false)} />
      ) : null}
    </main>
  )
}
