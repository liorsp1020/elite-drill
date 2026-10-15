/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design-system tokens — single source of truth for the app's dark theme.
        // Use these (bg-surface, text-ink-muted, bg-accent/15, etc.) instead of raw
        // slate-*/amber-* utilities so the whole app stays visually consistent.
        bg: '#121212',
        surface: '#1C1C1E',
        surface2: '#242426',
        border: '#2E2E31',
        ink: '#F5F5F7',
        'ink-muted': '#9A9AA1',
        'ink-faint': '#6B6B70',
        accent: '#FF6A1A',
        'accent-light': '#FF8A47',
        'accent-dark': '#D9540F',
        // Secondary semantic colors — used sparingly and intentionally (never as a base
        // theme color) so the accent orange keeps meaning "important/primary action".
        success: '#2ECC71',
        gold: '#F0B429',
        'gold-light': '#FBD670',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        card: '1.25rem',
        pill: '999px',
      },
      boxShadow: {
        card: '0 8px 24px rgba(0, 0, 0, 0.35)',
        elevated: '0 16px 40px rgba(0, 0, 0, 0.45)',
      },
      keyframes: {
        'card-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'press': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.97)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.82)' },
          '60%': { opacity: '1', transform: 'scale(1.04)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'celebrate-bounce': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '30%': { transform: 'translateY(-10px) scale(1.08)' },
          '55%': { transform: 'translateY(0) scale(0.98)' },
          '75%': { transform: 'translateY(-4px) scale(1.02)' },
        },
        'ring-pulse': {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'sparkle': {
          '0%, 100%': { opacity: '0', transform: 'scale(0.4) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1) rotate(20deg)' },
        },
      },
      animation: {
        'card-in': 'card-in 0.35s ease-out both',
        'fade-in': 'fade-in 0.25s ease-out both',
        'pop-in': 'pop-in 0.45s cubic-bezier(0.34,1.56,0.64,1) both',
        'celebrate-bounce': 'celebrate-bounce 1.1s ease-in-out 1',
        'ring-pulse': 'ring-pulse 1.6s ease-out infinite',
        'sparkle': 'sparkle 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
