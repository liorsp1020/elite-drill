<!-- Workspace-specific custom instructions for Elite Basketball Training App -->

## Project Overview
Elite Basketball Training is a Next.js web application designed to provide personalized basketball training sessions for players of all ages and skill levels.

## Current Status
- [x] Verify copilot-instructions.md file created
- [ ] Scaffold Next.js project
- [ ] Create project structure
- [ ] Build core components
- [ ] Install dependencies
- [ ] Test and run project

## Key Features
- User onboarding (name, age, skill level)
- Personalized workout generation
- User profile storage
- Animation guides for drills
- Responsive web design

## Tech Stack
- Next.js with TypeScript
- Tailwind CSS
- React for UI components
- localStorage for profile persistence

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Project Structure
```
src/
├── app/
│   ├── page.tsx (main page)
│   ├── onboarding/ (onboarding flow)
│   ├── workouts/ (workout display)
│   └── profile/ (profile management)
├── components/
│   ├── OnboardingForm.tsx
│   ├── WorkoutCard.tsx
│   ├── AnimationGuide.tsx
│   └── ProfileSelector.tsx
├── utils/
│   ├── profiles.ts (profile management)
│   ├── workouts.ts (workout generation)
│   └── storage.ts (localStorage utilities)
└── types/
    └── index.ts (TypeScript interfaces)
```
