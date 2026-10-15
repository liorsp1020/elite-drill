// Rotating Hero Card subtitles — picked randomly each time the Home screen loads, so the
// app has a little personality instead of one static tagline.
const MOTIVATIONAL_QUOTES: string[] = [
  'Become better every day.',
  'Small improvements create great players.',
  'Champions train when nobody is watching.',
  "Today's workout builds tomorrow's game.",
  'One more workout. One step closer.',
  'Discipline beats motivation every time.',
  'Your only competition is who you were yesterday.',
  'Great players are built one rep at a time.',
  'Show up. Put in the work. Repeat.',
]

export function getRandomMotivationalQuote(): string {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
}
