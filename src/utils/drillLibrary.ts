import type { DrillCategory } from '@/types'

export interface ProfessionalDrillLibraryEntry {
  name: string
  category: DrillCategory
  // 1–7, matched against profile.skillLevel by the progressive workout engine
  // (see BUILD_INSTRUCTIONS.md §7). Roughly: 1-2 = Foundation, 3-4 = Integration,
  // 5-7 = Game-Speed / High Complexity.
  difficultyScore: number
  // Optional: Ball Handling drills intentionally omit this — that category has no
  // per-drill warm-up reference and its workouts skip the warm-up section entirely
  // (see buildWorkoutPlan in workouts.ts).
  warmupRef?: string
  executionSteps: string[]
  duration: number
  objective: string
  equipment: string[]
  description: string
  commonTechnicalMistake: string
  correctiveCue: string
  goalReps: string
}

// 75 drills (15 Ball Handling, 12 each of Shooting / Strength / Defense / Athleticism / Skills),
// spanning the full 1–7 difficulty range so the progressive engine in workouts.ts always has
// genuine, distinct options at every skill level and every phase (Foundation / Integration /
// Game-Speed) — see BUILD_INSTRUCTIONS.md §7/§9.
export const drillLibrary: ProfessionalDrillLibraryEntry[] = [
  // ---------------------------------------------------------------------------------------
  // Ball Handling
  // ---------------------------------------------------------------------------------------
  {
    name: 'Fingertip Control Taps',
    category: 'Ball Handling',
    difficultyScore: 1,
    executionSteps: [
      'Hold the ball at chest height with fingers spread and palms off the ball.',
      'Tap the ball rapidly between both hands using only the fingertips.',
      'Keep the wrists loose and the movement small and controlled.',
      'Increase speed gradually without losing contact control.',
      'Finish with 5 seconds of maximum-speed taps and a clean catch.'
    ],
    duration: 3,
    objective: 'Build fingertip strength and basic hand-eye feel for the ball.',
    equipment: ['Basketball'],
    description: 'A foundational hand-control drill that sharpens touch before any dribble work begins.',
    commonTechnicalMistake: 'Using the palms instead of the fingertips.',
    correctiveCue: 'Keep the palms open and let only the fingers touch the ball.',
    goalReps: '3 rounds of 20 seconds.'
  },
  {name: 'Two-Ball Alternate Pound & High-Low',
    category: 'Ball Handling',
    difficultyScore: 5,
    executionSteps: [
      'Take a strong athletic stance holding a basketball in each hand.',
      'Dribble the right ball high at waist level while keeping the left ball low at knee level.',
      'Reverse the heights simultaneously on your command: bring the right ball low and the left ball high.',
      'Maintain an unbroken, alternating rhythm without letting the balls collide or lose control.',
      'Keep your eyes up and your core braced throughout the exercise.'
    ],
    duration: 3,
    objective: 'Develop independent neural processing and hand-eye autonomy for complex dribble variations.',
    equipment: ['Basketball', 'Basketball'],
    description: 'A rigorous dual-ball exercise that forces each hand to operate at a completely different tempo and height.',
    commonTechnicalMistake: 'Losing control of one ball while trying to focus on changing the height of the other.',
    correctiveCue: 'Keep your wrists relaxed and isolate the downward pushing force in each hand independently.',
    goalReps: '3 sets of 30 seconds.'
  },
  {name: 'Pound Dribble Series',
    category: 'Ball Handling',
    difficultyScore: 2,
    executionSteps: [
      'Set your feet shoulder-width apart and keep the chest tall.',
      'Pound the ball at knee level with quick, compact contacts.',
      'Keep your head up and eyes scanning the floor.',
      'Alternate hands every 20 seconds while maintaining rhythm.',
      'Finish with a crossover into retreat and reset your stance.'
    ],
    duration: 4,
    objective: 'Improve hand speed, posture, and dribble control under pressure.',
    equipment: ['Basketball'],
    description: 'A high-speed stationary dribble drill that sharpens ball control and body posture.',
    commonTechnicalMistake: 'Looking down at the ball and letting the shoulders drift.',
    correctiveCue: 'Keep the ball below the knee, head up, and push with the fingertips.',
    goalReps: '4 rounds of 20 seconds with 10 seconds rest.'
  },
  {name: 'Two-Ball Alternating Leg-Pass Flow',
    category: 'Ball Handling',
    difficultyScore: 7,
    executionSteps: [
      'Start in a wide, low stance holding two basketballs.',
      'Perform continuous alternating through-the-legs passes where both balls move dynamically.',
      'As the right ball goes through the legs to the back, the left ball replaces it or crosses over in an alternating dance.',
      'Maintain an unbroken, fluid sequence of leg passes and crossovers with both balls active at game speed.',
      'Keep your chest high, eyes scanning forward, and posture strong.'
    ],
    duration: 4,
    objective: 'Achieve supreme elite-tier mastery, hand speed, and spatial awareness using two balls simultaneously.',
    equipment: ['Basketball', 'Basketball'],
    description: 'The ultimate pinnacle of dual-ball handling mechanics designed for advanced guards seeking unmatched finger touch and coordination.',
    commonTechnicalMistake: 'Rushing the movement and losing control of the rhythm, causing the balls to fly out of bounds.',
    correctiveCue: 'Slow down the rhythm until the pattern is locked in, then build back up to maximum speed.',
    goalReps: '4 sets of 25 continuous cycles.'
  },
  {
    name: 'Figure-8 Leg Weave',
    category: 'Ball Handling',
    difficultyScore: 2,
    executionSteps: [
      'Start in a wide, athletic stance with the ball in one hand.',
      'Weave the ball in a figure-8 pattern through and around the legs.',
      'Keep the head up and the dribble low throughout the pattern.',
      'Increase pace once the pattern feels smooth and controlled.',
      'Reverse direction and repeat with the same control.'
    ],
    duration: 3,
    objective: 'Develop hand-to-hand transfer speed and low-dribble control.',
    equipment: ['Basketball'],
    description: 'A classic combo-movement drill that builds the foundation for real change-of-direction dribbling.',
    commonTechnicalMistake: 'Standing too upright and losing the low dribble height.',
    correctiveCue: 'Bend the knees, drop the hips, and keep the ball below waist height.',
    goalReps: '3 rounds of 30 seconds.'
  },
  {
    name: 'Two-Ball Front & Back Split',
    category: 'Ball Handling',
    difficultyScore: 7,
    executionSteps: [
      'Stand in a staggered athletic stance with a basketball in each hand.',
      'Dribble the right ball continuously in front of your body while sending the left ball behind your back.',
      'Reverse the positions simultaneously on command: bring the left ball to the front and the right ball behind your back.',
      'Keep your center of gravity low and maintain a consistent rhythm without pausing.',
      'Switch the leading hands halfway through the set to balance development.'
    ],
    duration: 3,
    objective: 'Master split-zone control where front and back spaces are managed simultaneously.',
    equipment: ['Basketball', 'Basketball'],
    description: 'An elite coordination test that splits spatial awareness between the front and rear body frames.',
    commonTechnicalMistake: 'Standing up straight, which causes the ball moving behind the back to hit your legs or hips.',
    correctiveCue: 'Drop your hips deep and use a wide arm sweep for the behind-the-back motion.',
    goalReps: '3 sets of 30 seconds.'
  },
  {
    name: 'Between-the-Legs Rhythm Series',
    category: 'Ball Handling',
    difficultyScore: 3,
    executionSteps: [
      'Start walking slowly forward with a controlled dribble.',
      'Send the ball between the legs on every third step.',
      'Keep the rhythm even and the ball control tight through the transfer.',
      'Increase to a jog once the pattern is clean.',
      'Finish with a hard push dribble and a balanced stop.'
    ],
    duration: 3,
    objective: 'Combine locomotion with a between-the-legs change while keeping rhythm.',
    equipment: ['Basketball'],
    description: 'A rhythm-based dribble drill that adds forward movement to a core ball-handling pattern.',
    commonTechnicalMistake: 'Slapping at the ball instead of guiding it through the legs.',
    correctiveCue: 'Use a soft push with the fingertips and let the ball travel in a controlled line.',
    goalReps: '4 lengths of the court or 40-second sets.'
  },
  {
    name: 'Two-Ball Low-to-High Dribble',
    category: 'Ball Handling',
    difficultyScore: 3,
    executionSteps: [
      'Start with one ball in each hand and knees bent.',
      'Low dribble for 20 seconds with a tight handle.',
      'Transition to high dribble and keep the rhythm even.',
      'Change direction with a quick crossover between each rep.',
      'Finish with a hard push and a balanced stop.'
    ],
    duration: 4,
    objective: 'Develop ambidexterity and clean hand transitions.',
    equipment: ['2 Basketballs'],
    description: 'A progressive dribble drill for keeping both hands active under tempo.',
    commonTechnicalMistake: 'Losing control and letting the ball bounce too high.',
    correctiveCue: 'Stay compact and keep the dribbles tight to the body.',
    goalReps: '3 sets of 30 seconds per side.'
  },
  {
    name: 'Behind-the-Back Change of Pace',
    category: 'Ball Handling',
    difficultyScore: 4,
    executionSteps: [
      'Start at a moderate dribble pace with the ball in the lead hand.',
      'Whip the ball behind the back on a change-of-pace cue.',
      'Accelerate immediately after the transfer to simulate a burst past a defender.',
      'Decelerate under control and reset the stance.',
      'Repeat on both sides, alternating the acceleration direction.'
    ],
    duration: 4,
    objective: 'Train a behind-the-back move paired with a real speed change, not just the mechanic alone.',
    equipment: ['Basketball'],
    description: 'A change-of-pace drill that turns a flashy move into a functional scoring tool.',
    commonTechnicalMistake: 'Performing the move at one constant speed with no burst afterward.',
    correctiveCue: 'Treat the transfer as the setup and the acceleration after it as the actual point of the rep.',
    goalReps: '8 reps each direction.'
  },
  {
    name: 'Crossover Escape Series',
    category: 'Ball Handling',
    difficultyScore: 4,
    executionSteps: [
      'Begin in a stance with the ball in the right hand.',
      'Perform a hard crossover and change pace immediately.',
      'Retreat to a balanced stance after each crossover.',
      'Repeat on both sides with a sharp first step.',
      'Keep the ball low and the eyes up at every rep.'
    ],
    duration: 4,
    objective: 'Teach fast escape moves and controlled change-of-direction dribbles.',
    equipment: ['Basketball'],
    description: 'A rapid change-of-direction drill that builds confidence and pace.',
    commonTechnicalMistake: 'Over-rotating the hips and losing balance.',
    correctiveCue: 'Keep the hips square and the shoulders quiet through the change.',
    goalReps: '6 clean reps each side.'
  },
  {
    name: 'Two-Ball Reactive Pound',
    category: 'Ball Handling',
    difficultyScore: 5,
    executionSteps: [
      'Dribble two balls simultaneously at knee height.',
      'Have a partner or coach call out a number or color as a reaction cue.',
      'React by picking up your dribble, clapping, or switching rhythm on the call.',
      'Return immediately to the two-ball pound without losing either ball.',
      'Increase the frequency of cues as control improves.'
    ],
    duration: 4,
    objective: 'Layer reactive decision-making on top of advanced two-ball control.',
    equipment: ['2 Basketballs', 'Partner or Coach'],
    description: 'A reactive two-ball drill that trains split attention between ball control and a live cue.',
    commonTechnicalMistake: 'Losing control of one ball while focusing on the reaction cue.',
    correctiveCue: 'Keep both dribbles automatic and let the reaction be the only conscious thought.',
    goalReps: '5 rounds of 20 seconds with 3 reactions per round.'
  },
  {
    name: 'Chair-Driven Push Dribble',
    category: 'Ball Handling',
    difficultyScore: 5,
    executionSteps: [
      'Set a chair or cone as a visual barrier.',
      'Drive forward with a low push dribble.',
      'Change direction around the obstacle without losing control.',
      'Attack the cone and retreat into a strong base.',
      'Repeat for tempo and clean body position.'
    ],
    duration: 4,
    objective: 'Build first-step speed, agility, and control in tight spaces.',
    equipment: ['Basketball', 'Chair or Cone'],
    description: 'A constraint-based dribble drill for creating real game-like body control.',
    commonTechnicalMistake: 'Taking too large a step and losing the ball.',
    correctiveCue: 'Use a compact first step and keep the ball tight to your body.',
    goalReps: '8 reps per side.'
  },
  {
    name: 'Live Dribble Attack vs. Shifting Defender',
    category: 'Ball Handling',
    difficultyScore: 6,
    executionSteps: [
      'Start at the top of the key facing a live or shadow defender.',
      'Attack downhill and read the defender’s hip position in real time.',
      'Counter with a crossover, hesitation, or spin based on what the defense gives.',
      'Finish the attack at the rim or pull into a mid-range shot.',
      'Reset and repeat with the defender applying real ball pressure.'
    ],
    duration: 3,
    objective: 'Apply advanced ball-handling moves against live, unpredictable defensive pressure.',
    equipment: ['Basketball', 'Live Defender or Partner'],
    description: 'A game-speed attacking drill that forces real decision-making under contested dribble pressure.',
    commonTechnicalMistake: 'Attacking with a pre-decided move instead of reading the defender.',
    correctiveCue: 'Let the defender’s hips and balance dictate which counter move you use.',
    goalReps: '10 live attacks, alternating direction.'
  },
  {
    name: 'Pressure-Close Protection Drill',
    category: 'Ball Handling',
    difficultyScore: 6,
    executionSteps: [
      'Start in a stance with the ball protected on the outside.',
      'Simulate a defender by using a hand or pad at the ball.',
      'Keep the dribble low and the body between the defender and the ball.',
      'Change direction and protect the ball with your body.',
      'Reset and repeat with a sharp pace.'
    ],
    duration: 3,
    objective: 'Teach ball protection and control under contact.',
    equipment: ['Basketball', 'Pad or Hand'],
    description: 'A defensive-pressure dribble drill for simulating real game pressure.',
    commonTechnicalMistake: 'Protecting the ball with the forearm instead of the body.',
    correctiveCue: 'Keep the body angled to shield and the ball low and protected.',
    goalReps: '5 reps each side.'
  },
  {
  name: 'Between-the-Legs Tennis Exchange',
  category: 'Ball Handling',
  difficultyScore: 6,
  executionSteps: [
    'Hold a tennis ball in your non-dribbling hand.',
    'Take one hard pound dribble.',
    'Throw the tennis ball to your opposite hand.',
    'While the tennis ball is in the air, perform a between-the-legs dribble.',
    'Catch the tennis ball before it touches the ground.',
    'Repeat continuously while alternating sides.'
  ],
  duration: 3,
  objective: 'Develop elite coordination and timing while maintaining advanced dribble control.',
  equipment: ['Basketball', 'Tennis Ball'],
  description: 'A high-level coordination drill requiring simultaneous hand independence.',
  commonTechnicalMistake: 'Watching the basketball instead of tracking the tennis ball.',
  correctiveCue: 'Trust your dribble and keep your eyes on the tennis ball.',
  goalReps: '40 successful exchanges.'
  },
  {
  name: 'Walking Between-the-Legs',
  category: 'Ball Handling',
  difficultyScore: 4,
  executionSteps: [
    'Walk forward while dribbling.',
    'Perform one between-the-legs dribble every two steps.',
    'Stay low after every move.',
    'Alternate the lead foot throughout the drill.',
    'Finish each trip with a layup.'
  ],
  duration: 3,
  objective: 'Learn to perform between-the-legs moves while moving.',
  equipment: ['Basketball'],
  description: 'Introduces one of the most effective game moves.',
  commonTechnicalMistake: 'Crossing too early.',
  correctiveCue: 'Step first, then move the ball.',
  goalReps: '8 court lengths.'
},
 { name: 'Side V-Dribbles',
  category: 'Ball Handling',
  difficultyScore: 3,
  executionSteps: [
    'Stand in an athletic stance.',
    'Move the ball in a V pattern beside your body.',
    'Stay low throughout the drill.',
    'Switch hands after one minute.'
  ],
  duration: 2,
  objective: 'Develop side-ball control and hand quickness.',
  equipment: ['Basketball'],
  description: 'Builds comfort protecting the basketball.',
  commonTechnicalMistake: 'Allowing the ball to drift too far away.',
  correctiveCue: 'Keep the ball close to your hip.',
  goalReps: '1 minute per hand.'
},
 { name: 'Front V-Dribbles',
  category: 'Ball Handling',
  difficultyScore: 2,
  executionSteps: [
    'Start with the basketball in front of your body.',
    'Push the ball diagonally from side to side to form a V pattern.',
    'Keep the ball below your waist.',
    'Perform the drill with your right hand.',
    'Repeat with your left hand.'
  ],
  duration: 2,
  objective: 'Improve wrist control and ball movement.',
  equipment: ['Basketball'],
  description: 'A classic drill for developing hand control.',
  commonTechnicalMistake: 'Using the whole arm instead of the wrist.',
  correctiveCue: 'Snap your wrist and control the ball with your fingertips.',
  goalReps: '45 seconds each hand.'
},
 { name: 'Alternating Low and High Dribbles',
  category: 'Ball Handling',
  difficultyScore: 2,
  executionSteps: [
    'Start in an athletic stance.',
    'Dribble the ball below your knees five times.',
    'Immediately switch to five shoulder-height dribbles.',
    'Continue alternating between low and high dribbles.',
    'Repeat with the opposite hand.'
  ],
  duration: 2,
  objective: 'Develop control at different dribble heights.',
  equipment: ['Basketball'],
  description: 'Improves comfort controlling the basketball at multiple heights.',
  commonTechnicalMistake: 'Changing body posture instead of controlling the dribble.',
  correctiveCue: 'Stay balanced and adjust the force with your fingertips.',
  goalReps: '2 rounds per hand.'
},
 { name: 'Tennis Ball Toss Dribble',
  category: 'Ball Handling',
  difficultyScore: 3,
  executionSteps: [
    'Dribble the basketball with your dominant hand.',
    'Hold a tennis ball in your free hand.',
    'Toss the tennis ball a short distance upward.',
    'Catch it while maintaining your dribble.',
    'Switch hands after each round.'
  ],
  duration: 3,
  objective: 'Improve hand independence and coordination.',
  equipment: ['Basketball', 'Tennis Ball'],
  description: 'Introduces reaction training while maintaining ball control.',
  commonTechnicalMistake: 'Stopping the dribble to catch the tennis ball.',
  correctiveCue: 'Keep the basketball bouncing at a steady rhythm.',
  goalReps: '40 successful catches.'
},
 { name: 'Cone Zig-Zag Dribble',
  category: 'Ball Handling',
  difficultyScore: 4,
  executionSteps: [
    'Place five cones in a zig-zag pattern.',
    'Attack each cone with a crossover.',
    'Accelerate after every move.',
    'Stay low throughout the drill.',
    'Finish with a controlled layup.'
  ],
  duration: 3,
  objective: 'Learn to attack defenders using controlled changes of direction.',
  equipment: ['Basketball', '5 Cones'],
  description: 'Develops game-like movement around obstacles.',
  commonTechnicalMistake: 'Making the move too early.',
  correctiveCue: 'Attack the cone before changing direction.',
  goalReps: '12 attacks.'
},
 { name: 'Multi-Level Pound Dribbles',
  category: 'Ball Handling',
  difficultyScore: 2,
  executionSteps: [
    'Start in an athletic stance and dribble with your right hand at knee height for 15 seconds.',
    'Without stopping, raise the dribble to waist height for 15 seconds.',
    'Continue dribbling at shoulder height for 15 seconds while maintaining full control.',
    'Switch to your left hand and repeat the same sequence: 15 seconds at knee height, 15 seconds at waist height, and 15 seconds at shoulder height.',
    'Focus on keeping your eyes forward and controlling the ball with your fingertips throughout the drill.'
  ],
  duration: 2,
  objective: 'Develop ball control and confidence by mastering dribbles at multiple heights with both hands.',
  equipment: ['Basketball'],
  description: 'A fundamental ball-handling drill that builds control, hand strength, and comfort dribbling at different heights.',
  commonTechnicalMistake: 'Looking down at the basketball or changing dribble height by lifting the shoulder instead of controlling the ball.',
  correctiveCue: 'Stay in an athletic stance, keep your eyes up, and control the dribble using your fingertips.',
  goalReps: 'Complete the full sequence twice.'
},
{ name: 'Stationary Crossovers',
  category: 'Ball Handling',
  difficultyScore: 1,
  executionSteps: [
    'Start in a low athletic stance.',
    'Cross the basketball from hand to hand.',
    'Keep every dribble below your waist.',
    'Maintain a steady rhythm.',
    'Increase speed while staying in control.'
  ],
  duration: 3,
  objective: 'Develop basic crossover mechanics.',
  equipment: ['Basketball'],
  description: 'Introduces one of the most important dribble moves.',
  commonTechnicalMistake: 'Standing too upright.',
  correctiveCue: 'Stay low and push the ball across your body.',
  goalReps: '100 crossovers.'
},
  {name: 'Figure-8 Tennis Toss',
  category: 'Ball Handling',
  difficultyScore: 7,
  executionSteps: [
    'Hold a tennis ball in your free hand.',
    'Perform continuous figure-8 dribbles through your legs.',
    'Throw the tennis ball from one hand to the other every time the basketball changes sides.',
    'Never stop the figure-8 motion.',
    'Increase your speed while maintaining control.'
  ],
  duration: 3,
  objective: 'Develop elite coordination through complex movement patterns.',
  equipment: ['Basketball', 'Tennis Ball'],
  description: 'An advanced drill requiring complete independence between both hands.',
  commonTechnicalMistake: 'Breaking the figure-8 rhythm while catching the tennis ball.',
  correctiveCue: 'Prioritize smooth rhythm before increasing speed.',
  goalReps: '3 rounds of 60 seconds.'
},
  {name: 'Reaction Bounce Catch',
  category: 'Ball Handling',
  difficultyScore: 5,
  executionSteps: [
    'Continuously dribble the basketball with one hand.',
    'Bounce a tennis ball off the floor using your free hand.',
    'Catch the tennis ball after one bounce without interrupting your dribble.',
    'Switch hands every 20 seconds.'
  ],
  duration: 3,
  objective: 'Improve hand independence and reaction speed.',
  equipment: ['Basketball', 'Tennis Ball'],
  description: 'Combines dribble consistency with unpredictable visual tracking.',
  commonTechnicalMistake: 'Pausing the dribble while catching the tennis ball.',
  correctiveCue: 'Maintain a steady dribble rhythm at all times.',
  goalReps: '50 successful catches.'
},  
  {name: 'Double Crossover Tennis Catch',
  category: 'Ball Handling',
  difficultyScore: 7,
  executionSteps: [
    'Start with the basketball in one hand and the tennis ball in the other.',
    'Throw the tennis ball straight up.',
    'Complete two quick crossover dribbles.',
    'Catch the tennis ball before it lands.',
    'Repeat while alternating dribbling hands.'
  ],
  duration: 3,
  objective: 'Develop lightning-fast hand speed and advanced coordination.',
  equipment: ['Basketball', 'Tennis Ball'],
  description: 'Forces rapid dribble execution under a strict time constraint.',
  commonTechnicalMistake: 'Rushing the crossovers and losing ball control.',
  correctiveCue: 'Keep every dribble sharp but controlled.',
  goalReps: '25 successful repetitions.'
},
 { name: 'Behind-the-Back Tennis Toss',
  category: 'Ball Handling',
  difficultyScore: 7,
  executionSteps: [
    'Hold a tennis ball in your free hand.',
    'Take one explosive dribble.',
    'Toss the tennis ball upward.',
    'Perform a behind-the-back dribble before catching the tennis ball.',
    'Alternate hands every repetition.'
  ],
  duration: 3,
  objective: 'Improve reaction time while executing advanced dribble moves.',
  equipment: ['Basketball', 'Tennis Ball'],
  description: 'Challenges hand speed and body coordination under time pressure.',
  commonTechnicalMistake: 'Throwing the tennis ball too high.',
  correctiveCue: 'Keep the toss controlled and focus on quick hands.',
  goalReps: '30 clean repetitions.'
},
    { name: 'Full-Speed Coast-to-Coast Attack Series',
    category: 'Ball Handling',
    difficultyScore: 7,
    executionSteps: [
      'Start under your own basket in a full sprint dribble.',
      'Attack full-court at game speed while maintaining a tight, controlled handle.',
      'Read a trailing or waiting defender and counter with a live move at contact speed.',
      'Finish strong at the rim through contact.',
      'Sprint back and repeat immediately to simulate transition fatigue.'
    ],
    duration: 3,
    objective: 'Combine elite ball control, top-speed movement, and finishing under fatigue.',
    equipment: ['Basketball', 'Full Court'],
    description: 'An elite transition drill that stress-tests ball control at maximum speed and under fatigue.',
    commonTechnicalMistake: 'Losing dribble control as speed increases toward the rim.',
    correctiveCue: 'Shorten the dribble height as speed increases to keep the ball on a string.',
    goalReps: '6 full-court reps with minimal rest.'
  },

  // ---------------------------------------------------------------------------------------
  // Shooting
  // ---------------------------------------------------------------------------------------
  {
    name: 'Two-Hand Form Shot Close Range',
    category: 'Shooting',
    difficultyScore: 1,
    warmupRef: 'Two-hand chest pass holds',
    executionSteps: [
      'Stand two feet from the rim with both hands on the ball.',
      'Push the ball straight up using both hands with equal pressure.',
      'Land the shot softly off the glass or through the net.',
      'Reset your feet and repeat with a consistent release point.',
      'Focus on a smooth, symmetric push with no wrist flick yet.'
    ],
    duration: 5,
    objective: 'Introduce the most basic shooting push pattern before isolating the shooting hand.',
    equipment: ['Basketball'],
    description: 'The most foundational shooting drill, used to teach balance and a consistent release before adding technique.',
    commonTechnicalMistake: 'Pushing the ball with uneven pressure between the two hands.',
    correctiveCue: 'Keep both hands moving together in one smooth, even motion.',
    goalReps: '20 makes before progressing.'
  },
  {
    name: 'One-Hand Form Shooting Ladder',
    category: 'Shooting',
    difficultyScore: 1,
    warmupRef: 'Free-throw form holds',
    executionSteps: [
      'Start 3 feet from the rim with your shooting hand relaxed.',
      'Raise the ball with the elbow under it and the knees bent.',
      'Release with a smooth motion and hold the follow-through.',
      'Hold the finished pose until the ball hits the floor.',
      'Repeat for 10 reps before moving back to the line.'
    ],
    duration: 7,
    objective: 'Improve release mechanics and balance in simple form shots.',
    equipment: ['Basketball'],
    description: 'A precise form-shooting drill focused on the release and follow-through.',
    commonTechnicalMistake: 'Rushing the shot and letting the elbow flare out.',
    correctiveCue: 'Keep the elbow in and hold the follow-through until the ball lands.',
    goalReps: '50 reps with a pause on each finish.'
  },
  {
    name: 'Free-Throw Routine Reps',
    category: 'Shooting',
    difficultyScore: 2,
    warmupRef: 'Deep breaths and stance setup at the line',
    executionSteps: [
      'Step to the line and build a consistent pre-shot routine.',
      'Take the same number of dribbles and the same breath every time.',
      'Rise into the shot with balanced feet and a square body.',
      'Release with a full follow-through and hold the finish.',
      'Repeat the exact same routine on every single rep.'
    ],
    duration: 7,
    objective: 'Build a repeatable, calm pre-shot routine for high-pressure moments.',
    equipment: ['Basketball'],
    description: 'A routine-based free-throw drill that removes variability from your most controllable shot.',
    commonTechnicalMistake: 'Changing the routine slightly from rep to rep.',
    correctiveCue: 'Treat every free throw exactly the same, especially under fatigue.',
    goalReps: '25 free throws, tracking makes.'
  },
  {
    name: 'Spot-Up Footwork Reps',
    category: 'Shooting',
    difficultyScore: 3,
    warmupRef: 'Shot prep and stance work',
    executionSteps: [
      'Start on a specific spot with the ball in your hands.',
      'Use a small step-in footwork pattern before the shot.',
      'Square the body and release with a clean motion.',
      'Hold the finish for a beat before resetting.',
      'Repeat from five spots with a steady pace.'
    ],
    duration: 7,
    objective: 'Improve shot preparation and footwork consistency.',
    equipment: ['Basketball'],
    description: 'A detailed footwork drill for cleaner shot prep and better balance.',
    commonTechnicalMistake: 'Leaning forward and rushing the footwork.',
    correctiveCue: 'Take a smooth, compact step and stay balanced through the release.',
    goalReps: '5 spots x 8 makes.'
  },
  {
    name: 'Elbow Extension Series',
    category: 'Shooting',
    difficultyScore: 3,
    warmupRef: 'Mid-range footwork walk-throughs',
    executionSteps: [
      'Start at the elbow of the free-throw line with the ball ready.',
      'Square up quickly and rise into a mid-range jump shot.',
      'Focus on a full leg extension paired with a clean release.',
      'Land in the same spot you jumped from, balanced.',
      'Move to the opposite elbow and repeat.'
    ],
    duration: 7,
    objective: 'Build reliable mid-range shot-making with a full, balanced extension.',
    equipment: ['Basketball'],
    description: 'A mid-range shooting drill focused on connecting leg power to a clean release point.',
    commonTechnicalMistake: 'Shooting off one leg or fading away without a clear reason.',
    correctiveCue: 'Jump straight up and come straight down under the shot.',
    goalReps: '10 makes per elbow.'
  },
  {
    name: 'Catch-and-Shoot Corner Series',
    category: 'Shooting',
    difficultyScore: 3,
    warmupRef: 'Quick feet and stationary form',
    executionSteps: [
      'Start at the corner with your knees bent and shoulders square.',
      'Receive the pass in a triple-threat position.',
      'Quickly pivot to the shot and square the hips.',
      'Fire with a compact motion and hold the finish.',
      'Reset after each rep and keep the feet balanced.'
    ],
    duration: 8,
    objective: 'Train rapid catch-and-shoot rhythm and balance.',
    equipment: ['Basketball', 'Partner or Rebounder'],
    description: 'A game-like shooting drill for creating quick release under rhythm.',
    commonTechnicalMistake: 'Drifting off the line and losing the shooting pocket.',
    correctiveCue: 'Catch in the pocket, square the shoulders, and fire with balance.',
    goalReps: '12 makes per side.'
  },
  {
    name: 'Off-the-Dribble Pull-Up Series',
    category: 'Shooting',
    difficultyScore: 4,
    warmupRef: 'One-dribble pull-up walk-throughs',
    executionSteps: [
      'Start at the wing with the ball live in your hands.',
      'Attack with one or two hard dribbles toward the middle.',
      'Plant and rise into a pull-up jump shot at the top of the move.',
      'Keep the shoulders square and the base balanced through the release.',
      'Repeat from both wings with equal reps.'
    ],
    duration: 8,
    objective: 'Convert dribble momentum into a clean, balanced pull-up jump shot.',
    equipment: ['Basketball'],
    description: 'A combo drill linking live dribble movement directly into a game-realistic shot.',
    commonTechnicalMistake: 'Drifting sideways on the pull-up instead of stopping under control.',
    correctiveCue: 'Stick the plant foot and rise straight up before releasing.',
    goalReps: '8 makes per side.'
  },
  {
    name: 'Mikan Contact Finish',
    category: 'Shooting',
    difficultyScore: 4,
    warmupRef: 'Layup approach and touch drill',
    executionSteps: [
      'Begin under the rim and alternate right- and left-hand finishes.',
      'Use a soft touch and keep your body between the defender and the ball.',
      'Add a light touch or pad on the finish.',
      'Finish through contact and hold the pose briefly.',
      'Reset and attack the rim with the same footwork.'
    ],
    duration: 8,
    objective: 'Increase finishing touch and contact awareness.',
    equipment: ['Basketball', 'Pad or Partner'],
    description: 'A finishing drill for developing contact confidence at the rim.',
    commonTechnicalMistake: 'Rushing the finish and losing body control.',
    correctiveCue: 'Use your body as a shield and keep the finish soft and controlled.',
    goalReps: '10 finishes each side.'
  },
  {
    name: 'Step-Back Three Series',
    category: 'Shooting',
    difficultyScore: 5,
    warmupRef: 'Step-back footwork without a shot',
    executionSteps: [
      'Start facing the rim with the ball live at the three-point line.',
      'Take one hard dribble and push off to create step-back separation.',
      'Land balanced behind the three-point line with the shoulders square.',
      'Rise immediately into a controlled release.',
      'Reset and repeat with the same footwork pattern.'
    ],
    duration: 8,
    objective: 'Build separation-creation and balance on an advanced perimeter shot.',
    equipment: ['Basketball'],
    description: 'An advanced separation-shooting drill that mirrors a common modern scoring weapon.',
    commonTechnicalMistake: 'Fading backward off balance instead of landing under control.',
    correctiveCue: 'Push back with control and stick the landing before you release the shot.',
    goalReps: '10 makes, alternating sides.'
  },
  {
    name: 'Movement Shooting (Relocate-and-Fire)',
    category: 'Shooting',
    difficultyScore: 5,
    warmupRef: 'Light relocation footwork without a ball',
    executionSteps: [
      'Start away from the ball in a spaced position.',
      'Relocate along the perimeter as a pass is delivered.',
      'Catch in rhythm without breaking stride and rise into the shot.',
      'Keep the feet set before the catch completes.',
      'Reset to a new spot and repeat the relocation pattern.'
    ],
    duration: 8,
    objective: 'Train the timing of catching and shooting in rhythm while constantly moving.',
    equipment: ['Basketball', 'Partner or Rebounder'],
    description: 'A game-realistic shooting drill built around off-ball movement and perfect catch timing.',
    commonTechnicalMistake: 'Catching with the feet still moving and rushing the shot.',
    correctiveCue: 'Get the feet set a half-step before the catch so the shot is already loaded.',
    goalReps: '15 makes from five relocation spots.'
  },
  {
    name: 'Form Shot Under Pressure',
    category: 'Shooting',
    difficultyScore: 6,
    warmupRef: 'Breathing and shot prep',
    executionSteps: [
      'Set a target and start with shorter-range form shots.',
      'Use a small amount of pressure from a defender or countdown clock.',
      'Keep the motion smooth and the follow-through long.',
      'Stay calm and don’t rush the release.',
      'Repeat while maintaining consistent mechanics.'
    ],
    duration: 7,
    objective: 'Build composure and repeatable mechanics under pressure.',
    equipment: ['Basketball', 'Partner or Timer'],
    description: 'A pressure-based shooting drill that trains calm decision-making.',
    commonTechnicalMistake: 'Panicking and losing the shooting motion.',
    correctiveCue: 'Slow down the rhythm, keep the elbow in, and finish with control.',
    goalReps: '3 rounds of 12 reps.'
  },
  {
    name: 'Contested Pull-Up Under Fatigue',
    category: 'Shooting',
    difficultyScore: 7,
    warmupRef: 'Conditioning sprint into a shot rep',
    executionSteps: [
      'Sprint a full-court length to elevate your heart rate before the rep.',
      'Attack live off the dribble against a closing defender.',
      'Create separation and rise into a contested pull-up jump shot.',
      'Hold your follow-through despite the fatigue and contest.',
      'Sprint back and repeat immediately for the next rep.'
    ],
    duration: 9,
    objective: 'Maintain elite shooting mechanics under real fatigue and defensive contest.',
    equipment: ['Basketball', 'Live Defender or Partner'],
    description: 'An elite pressure-shooting drill that simulates late-game fatigue and a real contest.',
    commonTechnicalMistake: 'Letting mechanics break down as fatigue and contest increase.',
    correctiveCue: 'Slow your breathing before the release and trust the same mechanics every time.',
    goalReps: '8 contested makes.'
  },

  // ---------------------------------------------------------------------------------------
  // Strength
  // ---------------------------------------------------------------------------------------
  
    {
    name: 'Bodyweight Squat Hold & Reset',
    category: 'Strength',
    difficultyScore: 1,
    warmupRef: 'Bodyweight squats without a hold',
    executionSteps: [
      'Stand with feet shoulder-width apart and chest tall.',
      'Lower into a controlled squat until the thighs are near parallel.',
      'Hold the bottom position for two full seconds.',
      'Drive back up through the whole foot to a standing reset.',
      'Repeat with a consistent tempo on every rep.'
    ],
    duration: 6,
    objective: 'Build foundational squat mechanics and lower-body control.',
    equipment: ['None'],
    description: 'A basic bodyweight strength drill that teaches proper squat depth and control before adding load.',
    commonTechnicalMistake: 'Letting the knees cave inward on the descent.',
    correctiveCue: 'Push the knees out in line with the toes throughout the movement.',
    goalReps: '3 sets of 10 reps.'
  },
  {
    name: 'Glute Bridge March',
    category: 'Strength',
    difficultyScore: 1,
    warmupRef: 'Glute bridge holds without marching',
    executionSteps: [
      'Lie on your back with knees bent and feet flat on the floor.',
      'Lift the hips into a bridge and hold the top position.',
      'March one knee toward the chest without dropping the hips.',
      'Return the foot down and repeat on the other side.',
      'Keep the core braced through every rep.'
    ],
    duration: 5,
    objective: 'Activate the glutes and core together to build a stable athletic base.',
    equipment: ['None'],
    description: 'A foundational activation drill for hip stability that supports every jumping and cutting movement.',
    commonTechnicalMistake: 'Letting the hips drop while marching the leg.',
    correctiveCue: 'Keep the hips level and only move from the hip of the marching leg.',
    goalReps: '3 sets of 10 per side.'
  },
  {
    name: 'Wall Sit Endurance Hold',
    category: 'Strength',
    difficultyScore: 2,
    warmupRef: 'Bodyweight squats and quad activation',
    executionSteps: [
      'Set your back against a wall and slide down to a 90-degree knee bend.',
      'Hold the position with the thighs parallel to the floor.',
      'Keep the core braced and breathing steady throughout the hold.',
      'Push through discomfort while maintaining the correct angle.',
      'Stand up slowly and reset before the next round.'
    ],
    duration: 6,
    objective: 'Build lower-body muscular endurance to support a full game or session.',
    equipment: ['None'],
    description: 'A foundational isometric strength drill that builds the endurance base under every explosive movement.',
    commonTechnicalMistake: 'Letting the knees drift past the toes or the hips rise during the hold.',
    correctiveCue: 'Keep the thighs parallel to the floor and the back flat against the wall.',
    goalReps: '3 rounds of 30-45 seconds.'
  },
  {
    name: 'Core Anti-Rotation Hold',
    category: 'Strength',
    difficultyScore: 2,
    warmupRef: 'Dead bug and breathing',
    executionSteps: [
      'Start in a tall kneeling or half-kneeling position.',
      'Brace your core and resist rotation from the arms.',
      'Hold the posture while keeping the rib cage down.',
      'Add a band or light resistance if available.',
      'Reset and repeat without letting the body twist.'
    ],
    duration: 7,
    objective: 'Increase core strength and rotational control for basketball movement.',
    equipment: ['Resistance Band or None'],
    description: 'A core drill that builds the trunk strength needed for balance and deceleration.',
    commonTechnicalMistake: 'Arching the lower back and twisting too early.',
    correctiveCue: 'Brace the core and keep the rib cage stacked over the pelvis.',
    goalReps: '3 rounds of 30 seconds.'
  },
  {
    name: 'Band Pull-Through Strength',
    category: 'Strength',
    difficultyScore: 3,
    warmupRef: 'Scapular pull and arm circles',
    executionSteps: [
      'Set a band around the feet and hold the tension.',
      'Pull through the hips and keep the torso tall.',
      'Drive the hips back and then forcefully through.',
      'Control the return to the start.',
      'Repeat with a smooth, strong tempo.'
    ],
    duration: 7,
    objective: 'Train explosive hip extension and posterior chain control.',
    equipment: ['Resistance Band'],
    description: 'A strength-focused drill for building power and posture.',
    commonTechnicalMistake: 'Using the lower back instead of the hips.',
    correctiveCue: 'Drive through the hips and keep the posture tall.',
    goalReps: '10 controlled reps.'
  },
  {
    name: 'Step-Up Power Circuit',
    category: 'Strength',
    difficultyScore: 3,
    warmupRef: 'Marching and balance activation',
    executionSteps: [
      'Place a step or sturdy box in front of you.',
      'Drive through the lead leg and step up explosively.',
      'Land softly and stay balanced before the next rep.',
      'Repeat for controlled reps and a strong torso.',
      'Alternate legs without rushing the motion.'
    ],
    duration: 8,
    objective: 'Build unilateral leg power and clean mechanics.',
    equipment: ['Box or Step'],
    description: 'A strength drill that teaches explosive stepping and controlled landing.',
    commonTechnicalMistake: 'Using the arms too much and rushing the step.',
    correctiveCue: 'Punch the knee up and stay tall through the takeoff.',
    goalReps: '10 reps each leg.'
  },
  {
    name: 'Single-Leg Jump and Stick',
    category: 'Strength',
    difficultyScore: 4,
    warmupRef: 'Ankle circles and hip mobility',
    executionSteps: [
      'Start in a balanced stance with the knee soft.',
      'Jump off one leg and stick the landing cleanly.',
      'Absorb the jump with your hips and core tight.',
      'Hold the landing for two seconds before the reset.',
      'Repeat on both sides with controlled power.'
    ],
    duration: 8,
    objective: 'Teach explosive power and controlled landing mechanics.',
    equipment: ['Basketball'],
    description: 'A unilateral strength drill focused on landing quality and force absorption.',
    commonTechnicalMistake: 'Collapsing the knee and landing too flat.',
    correctiveCue: 'Use the whole foot, push through the floor, and hold the landing.',
    goalReps: '8 reps each side.'
  },
  {
    name: 'Lateral Bound + Hold',
    category: 'Strength',
    difficultyScore: 4,
    warmupRef: 'Lateral shuffle and hip mobility',
    executionSteps: [
      'Start in a low stance and explode laterally.',
      'Stick the landing with the hips over the feet.',
      'Hold the position for two full breaths.',
      'Return to the start and repeat with speed.',
      'Keep the trunk stable and the chest proud.'
    ],
    duration: 7,
    objective: 'Improve lateral power and stability.',
    equipment: ['Basketball'],
    description: 'A lateral explosive drill for footwork and strength under speed.',
    commonTechnicalMistake: 'Letting the hips open and collapsing the ankle.',
    correctiveCue: 'Stay low and push the outside edge of the foot into the floor.',
    goalReps: '6 reps each side.'
  },
  {
    name: 'Depth Drop Stick Landing',
    category: 'Strength',
    difficultyScore: 5,
    warmupRef: 'Single-leg jump and stick reps',
    executionSteps: [
      'Step off a low box or step and drop to the floor with both feet.',
      'Absorb the landing with bent knees and a braced core.',
      'Stick the landing with zero extra steps or wobble.',
      'Hold the stuck position for two full seconds.',
      'Reset on the box and repeat with control.'
    ],
    duration: 7,
    objective: 'Train force absorption and landing control before adding a reactive jump.',
    equipment: ['Box or Step'],
    description: 'A landing-mechanics drill that builds the deceleration strength needed to protect the knees at speed.',
    commonTechnicalMistake: 'Landing stiff-legged or letting the knees collapse inward.',
    correctiveCue: 'Absorb through the hips and knees together and land as quietly as possible.',
    goalReps: '6 clean landings.'
  },
  {
    name: 'Broad Jump Triple Series',
    category: 'Strength',
    difficultyScore: 5,
    warmupRef: 'Single broad jumps with a full reset',
    executionSteps: [
      'Start in an athletic stance with arms loaded behind you.',
      'Explode forward into a broad jump and land balanced.',
      'Immediately chain a second jump without a pause.',
      'Chain a third jump, focusing on maintaining distance and control.',
      'Stick the final landing and hold for two seconds.'
    ],
    duration: 7,
    objective: 'Build repeated horizontal power output with maintained landing control.',
    equipment: ['None'],
    description: 'A chained plyometric drill for building explosive horizontal power under fatigue.',
    commonTechnicalMistake: 'Losing landing control on the second or third jump as power fades.',
    correctiveCue: 'Reset the base quickly between jumps rather than rushing the next takeoff.',
    goalReps: '5 sets of triple jumps.'
  },
  {
    name: 'Loaded Split-Squat Power',
    category: 'Strength',
    difficultyScore: 6,
    warmupRef: 'Bodyweight split squats',
    executionSteps: [
      'Set up in a staggered stance with light weight in each hand.',
      'Lower into a split squat with the back knee just off the floor.',
      'Drive up explosively through the front heel.',
      'Control the descent on the way back down.',
      'Complete all reps on one side before switching legs.'
    ],
    duration: 8,
    objective: 'Build single-leg power output using external load once bodyweight mechanics are solid.',
    equipment: ['Weights'],
    description: 'A loaded unilateral strength drill for building real game-speed leg power.',
    commonTechnicalMistake: 'Letting the front knee travel too far past the toes under load.',
    correctiveCue: 'Keep the shin close to vertical and drive through the whole front foot.',
    goalReps: '3 sets of 6 per leg.'
  },
  {
    name: 'Reactive Depth Jump to Sprint',
    category: 'Strength',
    difficultyScore: 7,
    warmupRef: 'Depth drop stick landings',
    executionSteps: [
      'Step off a box and land with both feet, absorbing the impact.',
      'Immediately explode into a maximum-effort vertical jump on contact.',
      'Land the jump under control and transition instantly into a sprint.',
      'Sprint 10 yards at full effort.',
      'Walk back to reset fully before the next rep.'
    ],
    duration: 8,
    objective: 'Convert elastic landing power directly into an explosive jump and sprint.',
    equipment: ['Box or Step'],
    description: 'An elite reactive-strength drill that chains landing power, a jump, and a sprint into one explosive sequence.',
    commonTechnicalMistake: 'Pausing too long on the ground before the reactive jump, losing the elastic response.',
    correctiveCue: 'Treat the ground contact as a trampoline — spend as little time on the floor as possible.',
    goalReps: '5 reps with full recovery between each.'
  },

  // ---------------------------------------------------------------------------------------
  // Defense
  // ---------------------------------------------------------------------------------------
  {
    name: 'Stance Hold & Slide Basics',
    category: 'Defense',
    difficultyScore: 1,
    warmupRef: 'Bodyweight squats and stance holds',
    executionSteps: [
      'Set a low defensive stance with feet wider than shoulder-width.',
      'Hold the stance with hands active and chest up.',
      'Take three slow slides to one side without rising up.',
      'Return to the middle and slide the other direction.',
      'Focus on staying low the entire time.'
    ],
    duration: 6,
    objective: 'Build the foundational defensive stance and basic lateral movement.',
    equipment: ['Basketball'],
    description: 'The most fundamental defensive drill, used to build stance endurance before adding speed or reads.',
    commonTechnicalMistake: 'Standing up out of the stance while sliding.',
    correctiveCue: 'Keep the hips low and the head at a consistent height throughout the slide.',
    goalReps: '4 rounds of 20 seconds.'
  },
  {
    name: 'Mirror Defensive Slide',
    category: 'Defense',
    difficultyScore: 2,
    warmupRef: 'Slide and stance reset',
    executionSteps: [
      'Face a coach or partner and mirror their movement.',
      'Slide with a low base and active hands.',
      'Mirror each direction with a short, clean step.',
      'Recover to the stance after each slide.',
      'Keep your eyes on the hips and the ball.'
    ],
    duration: 8,
    objective: 'Improve defensive agility and movement precision.',
    equipment: ['Basketball', 'Partner'],
    description: 'A mirror drill that sharpens defensive patience and reaction.',
    commonTechnicalMistake: 'Overreaching and losing the stance.',
    correctiveCue: 'Stay compact and make each slide with a balanced push.',
    goalReps: '6 reps with a clean recover.'
  },
  {
    name: 'Defensive Triangle Positioning',
    category: 'Defense',
    difficultyScore: 2,
    warmupRef: 'Stance holds with ball-side pointing',
    executionSteps: [
      'Set up in a help position between your assigned player and the ball.',
      'Point one hand at the ball and one at your player to confirm the triangle.',
      'Shift position as a coach moves the ball to a new spot.',
      'Recheck the triangle every time the ball moves.',
      'Repeat with increasing speed of ball movement.'
    ],
    duration: 6,
    objective: 'Teach proper off-ball positioning relative to the ball and the assigned player.',
    equipment: ['Basketball', 'Coach or Partner'],
    description: 'A positioning-focused drill for building basic team-defense awareness.',
    commonTechnicalMistake: 'Watching only the ball or only the assigned player, not both.',
    correctiveCue: 'Use peripheral vision to see the ball while keeping the body oriented to your player.',
    goalReps: '10 position checks.'
  },
  {
    name: 'On-Ball Containment vs. One Live Move',
    category: 'Defense',
    difficultyScore: 3,
    warmupRef: 'Shell rotation shuffle at half speed',
    executionSteps: [
      'Start in a stance facing a live ball handler.',
      'Contain the dribbler through one live move of their choice.',
      'Stay low and slide your feet instead of reaching with the hands.',
      'Recover to the stance immediately after the move.',
      'Repeat with the attacker using a different move each rep.'
    ],
    duration: 7,
    objective: 'Build containment discipline against a single live offensive move.',
    equipment: ['Basketball', 'Partner'],
    description: 'An entry-level live-defense drill that isolates containment against one predictable move.',
    commonTechnicalMistake: 'Reaching for the ball instead of moving the feet.',
    correctiveCue: 'Keep the hands active but let the feet do the actual containing work.',
    goalReps: '8 live reps.'
  },
  {
    name: 'Shell Rotation Shuffle',
    category: 'Defense',
    difficultyScore: 3,
    warmupRef: 'Drop step and slide',
    executionSteps: [
      'Set your stance with your feet split and chest square.',
      'Slide to the ball and rotate your shoulders inside the line.',
      'Recover with a short step and stay balanced.',
      'Repeat with a strong push and controlled deceleration.',
      'Keep the hands active and eyes on the ball handler.'
    ],
    duration: 7,
    objective: 'Train shell rotations and defensive stance control.',
    equipment: ['Basketball', 'Cones'],
    description: 'A defensive shell drill focused on movement precision under pressure.',
    commonTechnicalMistake: 'Sliding too wide and losing the stance.',
    correctiveCue: 'Stay square, keep the hips low, and cut the steps short.',
    goalReps: '5 rotations per side.'
  },
  {
    name: 'Jump to Contest Drill',
    category: 'Defense',
    difficultyScore: 4,
    warmupRef: 'Stance drops and hand placement',
    executionSteps: [
      'Start in a low defensive stance and watch the ball.',
      'Jump to the ball with hands up and a tight base.',
      'Contest the pass and stay balanced on the landing.',
      'Recover to the stance without losing the line.',
      'Repeat with fast hands and a strong body angle.'
    ],
    duration: 7,
    objective: 'Build defensive reactions and contest timing.',
    equipment: ['Basketball', 'Partner'],
    description: 'A quick reaction drill for timing the contest and staying balanced.',
    commonTechnicalMistake: 'Jumping too high and losing the stance.',
    correctiveCue: 'Stay low, use the hands, and land under control.',
    goalReps: '10 contests per side.'
  },
  {
    name: 'Closeout + Recover',
    category: 'Defense',
    difficultyScore: 4,
    warmupRef: 'Low stance slide and shuffle',
    executionSteps: [
      'Start in a help-side stance with hands high.',
      'Sprint to the ball to make a strong closeout.',
      'Decelerate with short, choppy steps.',
      'Recover to a strong stance and square the hips.',
      'Repeat from different angles and keep your feet active.'
    ],
    duration: 8,
    objective: 'Improve closeout speed and short-area recovery.',
    equipment: ['Basketball', 'Cones'],
    description: 'A defensive movement drill for controlling space and recovering quickly.',
    commonTechnicalMistake: 'Closing out too upright and lunging too far.',
    correctiveCue: 'Stay low, hands high, and recover with short steps.',
    goalReps: '6 reps per side.'
  },
  {
    name: 'Full-Court Ball Denial',
    category: 'Defense',
    difficultyScore: 5,
    warmupRef: 'Denial stance holds at half court',
    executionSteps: [
      'Line up in a denial stance one pass away from the ball.',
      'Deny the pass with an active hand and full-court awareness.',
      'React and slide as the ball and your player move up the court.',
      'Maintain the denial position through multiple cuts.',
      'Recover immediately if the pass is completed.'
    ],
    duration: 8,
    objective: 'Train full-court denial defense and sustained defensive intensity.',
    equipment: ['Basketball', 'Partner'],
    description: 'A high-intensity denial drill that builds full-court defensive stamina and positioning.',
    commonTechnicalMistake: 'Losing the denial position while transitioning up the floor.',
    correctiveCue: 'Stay a half-step ahead of your player and keep the passing lane hand active at all times.',
    goalReps: '4 full-court denial reps.'
  },
  {
    name: 'Help-Side Read Drill',
    category: 'Defense',
    difficultyScore: 5,
    warmupRef: 'Quick feet and stance resets',
    executionSteps: [
      'Begin in a help-side position with the chest square.',
      'Read the ball and react to a simple drive or pass.',
      'Shift quickly to the correct defensive angle.',
      'Recover into a strong stance immediately.',
      'Repeat with a fast mental and physical read.'
    ],
    duration: 8,
    objective: 'Sharpen defensive reads and help-side communication.',
    equipment: ['Basketball', 'Partner'],
    description: 'A live-read defensive drill built around balance and reaction.',
    commonTechnicalMistake: 'Over-rotating and giving up the angle.',
    correctiveCue: 'Stay balanced, read the hips, and recover to the middle.',
    goalReps: '8 reads with a clean recover.'
  },
  {
    name: 'Screen Navigation (Fight-Through)',
    category: 'Defense',
    difficultyScore: 6,
    warmupRef: 'Shell rotation shuffle with a stationary screen',
    executionSteps: [
      'Start in a stance guarding a live player near a set screen.',
      'Read the screen early and fight through with a low, tight path.',
      'Keep contact with the screener’s hip to avoid getting fully picked off.',
      'Recover to the stance immediately after clearing the screen.',
      'Repeat with screens set from different angles.'
    ],
    duration: 8,
    objective: 'Build the technical skill of fighting through ball screens without losing the assignment.',
    equipment: ['Basketball', 'Two Partners'],
    description: 'An advanced screen-navigation drill built around real contact and recovery speed.',
    commonTechnicalMistake: 'Going too far around the screen and losing ground on the ball handler.',
    correctiveCue: 'Take the tightest legal path through the screen, brushing the screener’s shoulder.',
    goalReps: '8 screen navigations.'
  },
  {
    name: 'Live 1-on-1 Containment Series',
    category: 'Defense',
    difficultyScore: 6,
    warmupRef: 'On-ball containment vs. one live move',
    executionSteps: [
      'Start in a full defensive stance against a live, unpredictable ball handler.',
      'Contain the attacker for a full possession using only feet and positioning.',
      'React to combination moves without committing to the first fake.',
      'Force the attacker into a difficult, contested shot.',
      'Reset immediately and go again with fresh intensity.'
    ],
    duration: 8,
    objective: 'Test full defensive containment skill against unscripted, live offense.',
    equipment: ['Basketball', 'Live Defender or Partner'],
    description: 'A true live 1-on-1 drill that combines every prior containment skill under real pressure.',
    commonTechnicalMistake: 'Committing fully to the first move and losing balance on the counter.',
    correctiveCue: 'Stay patient, trust your stance, and only close the gap when the attacker slows down.',
    goalReps: '6 full possessions.'
  },
  {
    name: 'Multi-Effort Closeout & Recover Chain',
    category: 'Defense',
    difficultyScore: 7,
    warmupRef: 'Closeout + recover at moderate pace',
    executionSteps: [
      'Start in a help position away from the ball.',
      'Sprint to closeout on a live catch-and-shoot threat.',
      'Contest and recover, then immediately close out on a second live pass.',
      'Chain a third closeout without a break in intensity.',
      'Finish with a live 1-on-1 containment rep at full speed.'
    ],
    duration: 9,
    objective: 'Combine multiple closeouts and a live containment rep into one continuous defensive sequence.',
    equipment: ['Basketball', 'Multiple Partners'],
    description: 'An elite conditioning-and-technique chain that mirrors the non-stop demands of real defensive possessions.',
    commonTechnicalMistake: 'Losing stance quality and hand activity as fatigue builds through the chain.',
    correctiveCue: 'Reset your breathing between each closeout and keep the same stance standard on every rep.',
    goalReps: '5 full chains.'
  },

  // ---------------------------------------------------------------------------------------
  // Athleticism
  // ---------------------------------------------------------------------------------------
  {
    name: 'Marching High-Knee Drill',
    category: 'Athleticism',
    difficultyScore: 1,
    warmupRef: 'Ankle bounces and posture holds',
    executionSteps: [
      'Stand tall with arms relaxed at your sides.',
      'March one knee up to hip height while driving the opposite arm.',
      'Pause briefly at the top of each knee drive.',
      'Alternate sides with a slow, controlled tempo.',
      'Keep the posture tall and the core braced throughout.'
    ],
    duration: 5,
    objective: 'Build basic running posture and knee-drive mechanics.',
    equipment: ['None'],
    description: 'A foundational movement-prep drill that teaches proper running posture before adding speed.',
    commonTechnicalMistake: 'Leaning backward or letting the posture collapse.',
    correctiveCue: 'Stay tall through the chest and drive the knee straight up, not out to the side.',
    goalReps: '3 rounds of 20 reps.'
  },
  {
    name: 'Jump Rope Rhythm Set',
    category: 'Athleticism',
    difficultyScore: 1,
    warmupRef: 'Low-impact foot taps',
    executionSteps: [
      'Start with a simple two-foot jump and steady rhythm.',
      'Increase the tempo without breaking your posture.',
      'Add lateral movement and changes every 20 seconds.',
      'Stay relaxed and keep the arms tight.',
      'Finish with a controlled stop and reset.'
    ],
    duration: 7,
    objective: 'Develop foot speed, rhythm, and conditioning.',
    equipment: ['Jump Rope'],
    description: 'A rhythm-based athletic drill for footwork and conditioning.',
    commonTechnicalMistake: 'Jumping too high and over-striding.',
    correctiveCue: 'Stay light on the feet and keep the motion compact.',
    goalReps: '3 rounds of 45 seconds.'
  },
  {
    name: 'Ladder Quick-Feet Basics',
    category: 'Athleticism',
    difficultyScore: 2,
    warmupRef: 'Standing foot taps',
    executionSteps: [
      'Set an agility ladder or line taps on the floor.',
      'Run through with one foot in each box, staying light on the toes.',
      'Keep the arms moving in rhythm with the feet.',
      'Focus on quiet, quick ground contacts rather than raw speed.',
      'Repeat through the full ladder with consistent rhythm.'
    ],
    duration: 6,
    objective: 'Build basic foot speed and rhythm before adding complex patterns.',
    equipment: ['Agility Ladder or Floor Tape'],
    description: 'A foundational quick-feet drill for developing the base rhythm used in every later athletic pattern.',
    commonTechnicalMistake: 'Looking down at the feet instead of forward.',
    correctiveCue: 'Keep the eyes up and trust the feet to find each box.',
    goalReps: '4 passes through the ladder.'
  },
  {
    name: 'Acceleration Hops',
    category: 'Athleticism',
    difficultyScore: 3,
    warmupRef: 'Dynamic skips and low skips',
    executionSteps: [
      'Start in a low stance and explode forward.',
      'Take three quick steps and accelerate through the finish.',
      'Land softly and maintain control.',
      'Reset and repeat with a strong posture.',
      'Drive the arms and stay forward on the toes.'
    ],
    duration: 7,
    objective: 'Improve acceleration and explosive first-step movement.',
    equipment: ['Basketball'],
    description: 'An acceleration drill for first-step quickness and body alignment.',
    commonTechnicalMistake: 'Leaning too far and losing the first step.',
    correctiveCue: 'Stay tall, push the floor away, and keep the first step compact.',
    goalReps: '8 accelerations.'
  },
  {
    name: 'Box-to-Box Shuttle Series',
    category: 'Athleticism',
    difficultyScore: 3,
    warmupRef: 'Short acceleration starts',
    executionSteps: [
      'Set two markers about 15 feet apart.',
      'Sprint to the first marker and touch the ground.',
      'Change direction and sprint back to the start.',
      'Repeat the pattern to the second marker without pausing.',
      'Finish with a controlled deceleration.'
    ],
    duration: 6,
    objective: 'Build repeated-effort conditioning combined with change-of-direction speed.',
    equipment: ['Cones'],
    description: 'A shuttle-run drill that mirrors the stop-start conditioning demands of a real game.',
    commonTechnicalMistake: 'Rounding the turns instead of touching the marker and driving back hard.',
    correctiveCue: 'Get low on the touch and explode back in the opposite direction immediately.',
    goalReps: '6 shuttle rounds.'
  },
  {
    name: 'Court-Transition Sprints',
    category: 'Athleticism',
    difficultyScore: 3,
    warmupRef: 'Short acceleration starts',
    executionSteps: [
      'Sprint to the first line with full intent.',
      'Decelerate into a strong stance at the line.',
      'Backpedal to the next point with control.',
      'Accelerate again on the next call.',
      'Stay low and use the arms to drive the rhythm.'
    ],
    duration: 8,
    objective: 'Build basketball-specific conditioning and transition speed.',
    equipment: ['Basketball', 'Cones'],
    description: 'A court-conditioning drill built around acceleration and deceleration.',
    commonTechnicalMistake: 'Overstriding and losing balance in the transition.',
    correctiveCue: 'Drive through the first step and stay low through the stop.',
    goalReps: '6 transitions.'
  },
  {
    name: 'Resisted Sprint Starts',
    category: 'Athleticism',
    difficultyScore: 4,
    warmupRef: 'Unresisted acceleration starts',
    executionSteps: [
      'Attach a light resistance band around the waist, anchored behind you.',
      'Start in a low sprint stance against the resistance.',
      'Drive out explosively for 10 yards against the band tension.',
      'Focus on strong arm drive and a forward body lean.',
      'Walk back to reset fully before the next rep.'
    ],
    duration: 7,
    objective: 'Overload the acceleration phase to build a faster, more powerful first step.',
    equipment: ['Resistance Band'],
    description: 'A resisted-sprint drill that builds explosive first-step power beyond bodyweight speed alone.',
    commonTechnicalMistake: 'Standing up too early out of the low drive position.',
    correctiveCue: 'Stay low and drive forward for the first three to four steps before rising.',
    goalReps: '6 resisted starts.'
  },
  {
    name: 'Change-of-Direction Reactive Runs',
    category: 'Athleticism',
    difficultyScore: 5,
    warmupRef: 'Lateral hops and fast feet',
    executionSteps: [
      'Start on a line and sprint to the first cone.',
      'Cut hard and change direction on command.',
      'Accelerate out of the cut with a strong body position.',
      'Recover and repeat immediately.',
      'Keep the hips low and the chest forward.'
    ],
    duration: 8,
    objective: 'Train agility, body control, and fast re-acceleration.',
    equipment: ['Basketball', 'Cones'],
    description: 'A reactive athletic drill built around quick cuts and clean body control.',
    commonTechnicalMistake: 'Cutting too wide and losing the inside step.',
    correctiveCue: 'Plant the outside foot and drive through the cut with control.',
    goalReps: '6 clean cuts each side.'
  },
  {
    name: 'Multi-Directional Cone Reactive Series',
    category: 'Athleticism',
    difficultyScore: 5,
    warmupRef: 'Change-of-direction reactive runs at half speed',
    executionSteps: [
      'Set four cones in a cross pattern around a center point.',
      'Start in the middle in an athletic stance.',
      'React to a coach or partner pointing at a cone and sprint to touch it.',
      'Recover to the center immediately after each touch.',
      'Continue reacting to random cone calls for the full round.'
    ],
    duration: 7,
    objective: 'Train reactive multi-directional speed based on an external, unpredictable cue.',
    equipment: ['Cones', 'Partner or Coach'],
    description: 'A reactive agility drill that builds the unpredictable, game-like movement patterns basketball demands.',
    commonTechnicalMistake: 'Anticipating the next cone instead of truly reacting to the cue.',
    correctiveCue: 'Stay still and balanced in the center until the cue actually happens.',
    goalReps: '15 reactive touches.'
  },
  {
    name: 'Reactive Cut and Recover',
    category: 'Athleticism',
    difficultyScore: 6,
    warmupRef: 'Open-stance shuffle',
    executionSteps: [
      'Start in an athletic stance and react to a cue.',
      'Cut to the side and recover into the next position.',
      'Keep the hips low and the torso stable.',
      'Push to the next cut without losing balance.',
      'Repeat with a quick, silent reset.'
    ],
    duration: 7,
    objective: 'Improve body control and reactive movement quality.',
    equipment: ['Basketball', 'Partner'],
    description: 'A reactive athletic drill for game-speed changes of direction.',
    commonTechnicalMistake: 'Cutting too early and losing your center.',
    correctiveCue: 'Stay balanced and cut on the outside foot with control.',
    goalReps: '8 reps.'
  },
  {
    name: 'Full-Court Sprint Repeats',
    category: 'Athleticism',
    difficultyScore: 6,
    warmupRef: 'Court-transition sprints at moderate pace',
    executionSteps: [
      'Line up on the baseline in a ready sprint stance.',
      'Sprint the full length of the court at maximum effort.',
      'Walk back to the baseline as your only recovery.',
      'Repeat immediately for the prescribed number of rounds.',
      'Hold your sprint form even as fatigue builds late in the set.'
    ],
    duration: 8,
    objective: 'Build elite basketball-specific conditioning through repeated maximal sprints.',
    equipment: ['Full Court'],
    description: 'A high-intensity conditioning drill that mirrors the repeated sprint demands of a real game.',
    commonTechnicalMistake: 'Letting sprint mechanics break down badly on the later reps.',
    correctiveCue: 'Shorten your stride slightly late in the set rather than letting your form collapse.',
    goalReps: '8 full-court sprints.'
  },
  {
    name: 'Max-Effort Reactive Sprint-Cut-Jump Chain',
    category: 'Athleticism',
    difficultyScore: 7,
    warmupRef: 'Reactive cut and recover at moderate pace',
    executionSteps: [
      'Start in an athletic stance ready to react to a live cue.',
      'Sprint 10 yards at full effort on the signal.',
      'Cut hard to a called direction without losing speed.',
      'Explode into a maximum vertical jump at the end of the cut.',
      'Land under control and reset fully before the next chain.'
    ],
    duration: 9,
    objective: 'Combine top-end speed, reactive agility, and explosive power into one continuous elite sequence.',
    equipment: ['Cones', 'Partner or Coach'],
    description: 'The most demanding athletic combination drill in the library, chaining every quality trained in isolation elsewhere.',
    commonTechnicalMistake: 'Rushing through the chain and sacrificing quality on the final jump.',
    correctiveCue: 'Treat the final jump as the most important part of the chain, not an afterthought.',
    goalReps: '5 full chains with complete recovery.'
  },

  // ---------------------------------------------------------------------------------------
  // Skills
  // ---------------------------------------------------------------------------------------
  {
    name: 'Triple-Threat Fundamentals',
    category: 'Skills',
    difficultyScore: 1,
    warmupRef: 'Stance holds with the ball at the hip',
    executionSteps: [
      'Catch the ball and immediately set a triple-threat stance.',
      'Keep the ball secured at the hip with knees bent.',
      'Practice a shot fake without actually shooting.',
      'Practice a jab step without committing to a drive.',
      'Reset to the stance and repeat the sequence.'
    ],
    duration: 5,
    objective: 'Build the foundational catch position that every scoring option starts from.',
    equipment: ['Basketball'],
    description: 'The most basic skill drill in the library, teaching the stance every other move is built from.',
    commonTechnicalMistake: 'Standing upright with the ball held away from the body.',
    correctiveCue: 'Bend the knees and keep the ball tucked tightly at the hip.',
    goalReps: '10 clean reps.'
  },
  {
    name: 'Jab-Step Read Series',
    category: 'Skills',
    difficultyScore: 2,
    warmupRef: 'Triple-threat fundamentals',
    executionSteps: [
      'Set a triple-threat stance facing a defender or cone.',
      'Jab step hard with the non-pivot foot.',
      'Read whether the defender reacts or stays still.',
      'Counter with either a shot or a drive based on the read.',
      'Reset and repeat with the opposite read each time.'
    ],
    duration: 6,
    objective: 'Teach basic one-on-one decision-making from a simple jab-step read.',
    equipment: ['Basketball'],
    description: 'A read-based skill drill that introduces decision-making off the most basic offensive move.',
    commonTechnicalMistake: 'Always making the same choice regardless of the defender’s reaction.',
    correctiveCue: 'Actually watch the defender’s feet before deciding whether to shoot or drive.',
    goalReps: '10 reads, split evenly between shot and drive.'
  },
  {
    name: 'Balance and Finish Ladder',
    category: 'Skills',
    difficultyScore: 2,
    warmupRef: 'Balance holds and foot taps',
    executionSteps: [
      'Start on one leg and balance before each finish.',
      'Complete a simple finishing move with control.',
      'Hold the finish and reset the balance.',
      'Repeat on the other side with a strong base.',
      'Keep the finish smooth and your body controlled.'
    ],
    duration: 7,
    objective: 'Combine balance, footwork, and finishing under control.',
    equipment: ['Basketball'],
    description: 'A balance-driven skill drill for finishing with a strong base.',
    commonTechnicalMistake: 'Falling off the balance leg and rushing the finish.',
    correctiveCue: 'Stay tall, keep the balance leg strong, and finish with control.',
    goalReps: '6 reps each side.'
  },
  {
    name: 'Two-Man Pass-and-Cut Timing',
    category: 'Skills',
    difficultyScore: 3,
    warmupRef: 'Stationary chest pass reps',
    executionSteps: [
      'Start facing a partner about 15 feet apart.',
      'Pass the ball and cut immediately toward the basket.',
      'Time the cut so you are open exactly as you arrive.',
      'Receive the return pass in rhythm and finish.',
      'Switch roles and repeat.'
    ],
    duration: 7,
    objective: 'Build the timing between a pass and a cut that creates easy scoring chances.',
    equipment: ['Basketball', 'Partner'],
    description: 'A two-player timing drill that teaches the give-and-go, one of basketball’s most fundamental actions.',
    commonTechnicalMistake: 'Cutting too early, before the pass is even released.',
    correctiveCue: 'Release the pass first, then explode into the cut a half-beat later.',
    goalReps: '10 give-and-go reps each.'
  },
  {
    name: 'Skill-Read Passing Ladder',
    category: 'Skills',
    difficultyScore: 3,
    warmupRef: 'Ball taps and footwork',
    executionSteps: [
      'Start with a simple passing motion and a balanced stance.',
      'Read the movement and make a crisp pass on command.',
      'Move to the next point and reset your feet.',
      'Focus on the release point and body angle.',
      'Repeat at a high quality and a steady tempo.'
    ],
    duration: 7,
    objective: 'Train decision-making and passing touch under rhythm.',
    equipment: ['Basketball', 'Partner'],
    description: 'A skill drill that teaches passing rhythm and movement awareness.',
    commonTechnicalMistake: 'Rushing the pass and losing the angle.',
    correctiveCue: 'Step to the pass, keep the hands soft, and release with intention.',
    goalReps: '10 clean passes each side.'
  },
  {
    name: 'Reaction Catch and Pivot',
    category: 'Skills',
    difficultyScore: 3,
    warmupRef: 'Pivot footwork and touch',
    executionSteps: [
      'Receive a pass with the body square and knees bent.',
      'Pivot and move into the next action quickly.',
      'Keep the hands active and the chest up.',
      'Repeat with a balanced finish and a crisp step.',
      'Stay calm and read the movement on the first touch.'
    ],
    duration: 8,
    objective: 'Develop catch-and-go skill and body awareness.',
    equipment: ['Basketball', 'Partner'],
    description: 'A skill drill for reacting smoothly after the catch.',
    commonTechnicalMistake: 'Turning too early and getting flat on the pivot.',
    correctiveCue: 'Use a strong pivot, keep the chest tall, and finish with balance.',
    goalReps: '8 reps each side.'
  },
  {
    name: 'Footwork + Finish Combo',
    category: 'Skills',
    difficultyScore: 4,
    warmupRef: 'Stance and jab steps',
    executionSteps: [
      'Begin with a sharp footwork pattern into a finish.',
      'Drive the lead foot and stay low through the move.',
      'Finish cleanly with the body controlled.',
      'Reset and repeat with a smooth rhythm.',
      'Keep your eyes up through the full sequence.'
    ],
    duration: 7,
    objective: 'Build clean finishing mechanics from a skill-based entry.',
    equipment: ['Basketball'],
    description: 'A combination drill for footwork and finishing under rhythm.',
    commonTechnicalMistake: 'Breaking the line and losing the pace.',
    correctiveCue: 'Keep the steps compact and finish with the body tall.',
    goalReps: '8 reps per side.'
  },
  {
    name: 'Live Read-and-React Attack Series',
    category: 'Skills',
    difficultyScore: 4,
    warmupRef: 'Reaction catch and pivot at moderate pace',
    executionSteps: [
      'Catch the ball in triple threat against a live defender.',
      'Read the defender’s distance and stance in real time.',
      'React with a shot, drive, or pass based purely on what you see.',
      'Finish the chosen action with full effort.',
      'Reset and repeat with the defender varying their approach.'
    ],
    duration: 8,
    objective: 'Train real-time decision-making across all three scoring options against live pressure.',
    equipment: ['Basketball', 'Live Defender or Partner'],
    description: 'A live decision-making drill that ties shooting, driving, and passing together under real pressure.',
    commonTechnicalMistake: 'Deciding the action before actually catching and reading the defense.',
    correctiveCue: 'Catch first, read second, and only then commit to an action.',
    goalReps: '10 live reps.'
  },
  {
    name: 'Wall-React Skill Circuit',
    category: 'Skills',
    difficultyScore: 5,
    warmupRef: 'Wall passes and call-outs',
    executionSteps: [
      'Start facing the wall and read each rep first.',
      'React with a pass, pivot, or dribble based on the cue.',
      'Keep the body balanced through each response.',
      'Move crisply to the next cue and recover.',
      'Stay sharp and keep the rhythm consistent.'
    ],
    duration: 8,
    objective: 'Train reaction speed and skill decision-making.',
    equipment: ['Basketball', 'Wall or Partner'],
    description: 'A skill-reactive drill for fast choices and sharp execution.',
    commonTechnicalMistake: 'Overthinking and losing the first movement.',
    correctiveCue: 'Read the cue, move quickly, and keep the base solid.',
    goalReps: '10 reactions.'
  },
  {
    name: 'Pick-and-Roll Read Series',
    category: 'Skills',
    difficultyScore: 5,
    warmupRef: 'Live dribble moves off a stationary screen',
    executionSteps: [
      'Start with the ball live and a screener setting a ball screen.',
      'Read how the defense covers the screen in real time.',
      'Counter with a drive, pull-up, or pass to the roller based on the read.',
      'Finish the chosen option with a clean, decisive action.',
      'Reset and repeat with the coverage changing each time.'
    ],
    duration: 8,
    objective: 'Build advanced pick-and-roll decision-making against live, varied coverage.',
    equipment: ['Basketball', 'Two Partners'],
    description: 'An advanced two-man skill drill built around the most common action in modern basketball.',
    commonTechnicalMistake: 'Using the screen but ignoring how the defense actually covered it.',
    correctiveCue: 'Use the screener’s defender’s decision as the direct trigger for your read.',
    goalReps: '10 pick-and-roll reps.'
  },
  {
    name: 'Advanced Live Scrimmage Reads',
    category: 'Skills',
    difficultyScore: 6,
    warmupRef: 'Live read-and-react attack series',
    executionSteps: [
      'Play live 2-on-2 or 3-on-3 in a small, controlled space.',
      'Apply every prior read (jab step, pick-and-roll, give-and-go) as it naturally occurs.',
      'Communicate verbally with teammates during every possession.',
      'Play at full effort and full speed for a set number of possessions.',
      'Debrief one key read after each possession before continuing.'
    ],
    duration: 9,
    objective: 'Apply every trained skill simultaneously in a live, small-sided game context.',
    equipment: ['Basketball', 'Multiple Partners'],
    description: 'A live small-sided game drill that forces every trained skill to show up under real, unscripted pressure.',
    commonTechnicalMistake: 'Reverting to only one comfortable move regardless of what the defense gives.',
    correctiveCue: 'Force yourself to use whichever read the defense is actually giving you, not your favorite one.',
    goalReps: '8 live possessions.'
  },
  {
    name: 'Elite Multi-Skill Combo Series',
    category: 'Skills',
    difficultyScore: 7,
    warmupRef: 'Advanced live scrimmage reads',
    executionSteps: [
      'Start full speed with a live catch against defensive pressure.',
      'Chain together a jab-step read, a live dribble attack, and a finish or pull-up.',
      'Immediately transition into a defensive closeout and containment rep.',
      'Sprint to the next spot and repeat the full chain again.',
      'Maintain full technical quality despite the accumulated fatigue.'
    ],
    duration: 9,
    objective: 'Combine offensive skill, live decision-making, and a defensive transition into one elite continuous sequence.',
    equipment: ['Basketball', 'Live Defender or Partner'],
    description: 'The most demanding skill drill in the library, chaining offense and defense together under full fatigue.',
    commonTechnicalMistake: 'Letting technique degrade on the defensive transition after the offensive chain.',
    correctiveCue: 'Treat the defensive closeout as equally important as the offensive finish, not a formality.',
    goalReps: '5 full chains.'
  }
]
