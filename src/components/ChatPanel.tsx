'use client'

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useAppContext } from '@/context/AppContext'
import { buildCoachResponse, buildCoachSummary, getCoachGreeting } from '@/utils/coach'

type ChatMessage = {
  role: 'coach' | 'user'
  text: string
}

export default function ChatPanel() {
  const { profile, preferences, workoutPlan, generateWorkout, history, coachMemory, appendCoachMemory } = useAppContext()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [isSending, setIsSending] = useState(false)

  // Greeting must be seeded once per profile, not every time `preferences` changes
  // reference. sendMessage -> generateWorkout -> savePreferences creates a brand new
  // preferences object on every reply, so keying this effect on `preferences` was wiping
  // the entire conversation back to the greeting right after each message — that's what
  // made the chat look "unresponsive". Track initialization with a ref keyed on the
  // profile identity instead.
  const greetedForRef = useRef<string | null>(null)

  useEffect(() => {
    if (!profile) return
    if (greetedForRef.current === profile.name) return
    greetedForRef.current = profile.name

    const greeting = getCoachGreeting(profile.name, preferences)
    const startMessages: ChatMessage[] = [greeting]

    if (preferences) {
      const historyNote = history[0] ? `Recent focus: ${history[0].focus} on ${history[0].date}.` : ''
      const memoryNote = coachMemory ? `Memory: ${coachMemory}.` : ''
      startMessages.push({
        role: 'coach',
        text: `Profile loaded: ${buildCoachSummary(preferences)}. ${historyNote} ${memoryNote} Ask me for a sharper plan or a new emphasis.`,
      })
    }

    setMessages(startMessages)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  const sendMessage = (rawMessage: string) => {
    const trimmed = rawMessage.trim()
    if (!trimmed) return
    if (!profile || !preferences) {
      setMessages((prev) => [...prev, { role: 'coach', text: 'Save your profile first so I can build you a real plan.' }])
      return
    }
    if (isSending) return

    // Append the user's message and clear the input immediately so the UI never
    // appears to freeze, then compute the AI reply without blocking the main thread.
    setIsSending(true)
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
    setDraft('')
    appendCoachMemory(`User asked: ${trimmed}`)

    Promise.resolve()
      .then(() => buildCoachResponse(trimmed, profile, preferences, history, coachMemory, workoutPlan))
      .then((response) => {
        const nextPreferences = response.nextPreferences ?? preferences
        const plan = generateWorkout(nextPreferences, true)

        setMessages((prev) => [
          ...prev,
          {
            role: 'coach',
            text: plan ? response.reply : 'I’m locking in a sharper block for you now.',
          },
        ])
      })
      .catch(() => {
        setMessages((prev) => [...prev, { role: 'coach', text: 'Something interrupted that response — try asking again.' }])
      })
      .finally(() => setIsSending(false))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    sendMessage(draft)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage(draft)
    }
  }

  return (
    <div className="flex h-[calc(100vh-7.5rem)] flex-col">
      <div className="pb-4 pt-1">
        <h1 className="text-3xl font-bold tracking-tight text-ink">AI Coach</h1>
        <p className="mt-1 text-sm text-ink-muted">Ask for a sharper block, a different focus, or a recovery reset.</p>
      </div>

      <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto rounded-card border border-border bg-surface p-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 ${message.role === 'coach' ? 'bg-surface2 text-ink' : 'ml-auto bg-accent text-white'}`}
          >
            <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${message.role === 'coach' ? 'text-ink-faint' : 'text-white/70'}`}>
              {message.role === 'coach' ? 'Coach' : profile?.name ?? 'Player'}
            </p>
            <p className="mt-1.5">{message.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2 pb-1">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your coach..."
          className="flex-1 rounded-pill border border-border bg-surface px-4 py-3.5 text-sm text-ink placeholder:text-ink-faint"
        />
        <button
          type="submit"
          disabled={isSending}
          aria-label="Send"
          className="tap-shrink flex h-[52px] w-[52px] flex-none items-center justify-center rounded-full bg-accent text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </form>
    </div>
  )
}
