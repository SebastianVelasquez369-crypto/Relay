import { useState, useEffect, useMemo, createContext, useContext } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'

// ─── Accent ───────────────────────────────────────────────────────────────────
const A = '#E07828' // dark-mode default; components use T.ACC for mode-aware accent

// ─── Theme definitions ────────────────────────────────────────────────────────
const DARK = {
  BG:     '#141414',
  SURF:   '#1E1E1E',
  SURF2:  '#272727',
  BORDER: '#303030',
  TEXT:   '#F5F5F0',
  MUTED:  '#6B6B6B',
  DIM:    '#3D3D3D',
  ACC:    '#E07828',
}
// Warm parchment / Porsche cognac-leather aesthetic
const LIGHT = {
  BG:     '#F4EDE0',
  SURF:   '#EBE1CF',
  SURF2:  '#E0D4BF',
  BORDER: '#C9B99A',
  TEXT:   '#1A0E06',
  MUTED:  '#7D6248',
  DIM:    '#B09C84',
  ACC:    '#7A5C3A',
}

const ThemeCtx = createContext({ colors: DARK, mode: 'dark', toggle: () => {} })
const useT    = () => useContext(ThemeCtx).colors
const useMode = () => { const c = useContext(ThemeCtx); return { mode: c.mode, toggle: c.toggle } }
const makeS   = T => ({
  pg:   { padding: '32px 18px' },
  card: { background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 22, padding: '20px 18px' },
  inp:  { width: '100%', background: T.SURF2, border: `1px solid ${T.BORDER}`, borderRadius: 12, color: T.TEXT, fontSize: 14, padding: '12px 14px', outline: 'none', boxSizing: 'border-box' },
})

// ─── Icons ────────────────────────────────────────────────────────────────────
function Svg({ size = 24, stroke = 'currentColor', sw = 1.5, fill = 'none', children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
      stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}
function IconToday({ size = 22, color = 'currentColor' }) {
  return (
    <Svg size={size} stroke={color}>
      <circle cx="12" cy="12" r="8" />
      <line x1="12" y1="5" x2="12" y2="7.5" />
      <line x1="12" y1="16.5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="7.5" y2="12" />
      <line x1="16.5" y1="12" x2="19" y2="12" />
      <circle cx="12" cy="12" r="2" />
    </Svg>
  )
}
function IconTrain({ size = 22, color = 'currentColor' }) {
  return (
    <Svg size={size} stroke={color}>
      <rect x="2" y="9.5" width="4" height="5" rx="1" />
      <rect x="18" y="9.5" width="4" height="5" rx="1" />
      <line x1="6" y1="12" x2="18" y2="12" />
      <rect x="9.5" y="8" width="5" height="8" rx="1" />
    </Svg>
  )
}
function IconEat({ size = 22, color = 'currentColor' }) {
  return (
    <Svg size={size} stroke={color}>
      <line x1="9" y1="3" x2="9" y2="9" />
      <line x1="12" y1="3" x2="12" y2="9" />
      <line x1="15" y1="3" x2="15" y2="9" />
      <path d="M9 9 C9 11.5 15 11.5 15 9" />
      <line x1="12" y1="11.5" x2="12" y2="21" />
    </Svg>
  )
}
function IconLog({ size = 22, color = 'currentColor' }) {
  return (
    <Svg size={size} stroke={color}>
      <line x1="3" y1="21" x2="21" y2="21" />
      <line x1="3" y1="3" x2="3" y2="21" />
      <polyline points="3 17 8 11 13 14 18 6 21 3" />
    </Svg>
  )
}
function IconRun({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="15.5" cy="3.5" r="2.2" fill={color} />
      <path fill={color} stroke="none" d="
        M 13.5 5.8
        L 7.5 9 L 7 10.5 L 11 10
        L 9.5 13
        L 8 20 L 7 22.5 L 8.5 23 L 10.5 19.5
        L 13.5 21.5 L 15.5 22.5 L 16.5 21.5 L 14.5 18.5
        L 11.5 13
        L 18 7.5 L 18.5 6 L 15 7.5
        Z
      " />
    </svg>
  )
}
function IconBike({ size = 22, color = 'currentColor' }) {
  return (
    <Svg size={size} stroke={color}>
      <circle cx="6" cy="16" r="4" />
      <circle cx="18" cy="16" r="4" />
      <path d="M6 16 L10 9 L14 9 L18 16" />
      <path d="M10 9 L12 7 L15 7" />
      <line x1="10" y1="9" x2="10" y2="13" />
    </Svg>
  )
}
function IconSwim({ size = 22, color = 'currentColor' }) {
  return (
    <Svg size={size} stroke={color} sw={1.6}>
      <path d="M2 10 Q5.5 7 9 10 Q12.5 13 16 10 Q18 8.5 20.5 9.5" />
      <path d="M2 15.5 Q5.5 12.5 9 15.5 Q12.5 18.5 16 15.5 Q18 14 20.5 15" />
    </Svg>
  )
}
function IconCheck({ size = 14, color = 'currentColor' }) {
  return <Svg size={size} stroke={color} sw={2}><polyline points="4 12 9 17 20 6" /></Svg>
}
function IconX({ size = 16, color = '#666' }) {
  return (
    <Svg size={size} stroke={color} sw={1.5}>
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </Svg>
  )
}
function IconArrow({ size = 14, color = '#666' }) {
  return <Svg size={size} stroke={color} sw={1.5}><polyline points="5 12 19 12 13 6" /><polyline points="13 18 19 12" /></Svg>
}
function IconDot({ size = 8, color }) {
  return <div style={{ width: size, height: size, borderRadius: '50%', background: color, flexShrink: 0 }} />
}
function IconInfo({ size = 15, color = '#666' }) {
  return (
    <Svg size={size} stroke={color} sw={1.5}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="8.5" r="0.6" fill={color} stroke="none" />
      <line x1="12" y1="11.5" x2="12" y2="16" />
    </Svg>
  )
}
function IconBack({ size = 20, color = 'currentColor' }) {
  return <Svg size={size} stroke={color} sw={2}><polyline points="15 18 9 12 15 6" /></Svg>
}
function IconForm({ size = 14, color = 'currentColor' }) {
  return (
    <Svg size={size} stroke={color} sw={1.5}>
      <circle cx="12" cy="5.5" r="2" />
      <line x1="12" y1="7.5" x2="12" y2="15" />
      <line x1="8"  y1="11"  x2="16" y2="11" />
      <line x1="12" y1="15"  x2="9.5" y2="20" />
      <line x1="12" y1="15"  x2="14.5" y2="20" />
    </Svg>
  )
}
function IconYoga({ size = 22, color = 'currentColor' }) {
  return (
    <Svg size={size} stroke={color} sw={1.5}>
      <circle cx="12" cy="4.5" r="2" />
      <line x1="12" y1="6.5" x2="12" y2="12" />
      <path d="M6 9 Q9 12.5 12 12 Q15 12.5 18 9" />
      <path d="M6.5 19.5 Q10 14 12 12 Q14 14 17.5 19.5" />
    </Svg>
  )
}
function IconMapPin({ size = 22, color = 'currentColor' }) {
  return (
    <Svg size={size} stroke={color} sw={1.5}>
      <path d="M12 21 C12 21 5 14 5 9 C5 5.1 8.1 2 12 2 C15.9 2 19 5.1 19 9 C19 14 12 21 12 21 Z" />
      <circle cx="12" cy="9" r="2.5" />
    </Svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const SESSIONS = {
  1: { name: 'Push A',   day: 'Monday',    focus: 'Chest · Shoulders · Triceps', badge: 'HEAVY',    exercises: 8, duration: '65–75', preview: ['Incline Barbell Bench', 'Weighted Dips', 'Overhead Cable Extension'] },
  2: { name: 'Pull A',   day: 'Tuesday',   focus: 'Back · Biceps',               badge: 'HEAVY',    exercises: 9, duration: '65–75', preview: ['Weighted Pull-ups', 'Barbell Row', 'Face Pulls']                    },
  3: { name: 'Legs',     day: 'Wednesday', focus: 'Quads · Hamstrings · Calves', badge: 'ATHLETIC', exercises: 5, duration: '≤45',   preview: ['RDL', 'Bulgarian Split Squat', 'Lying Leg Curl']                   },
  4: { name: 'Push B',   day: 'Thursday',  focus: 'Chest · Shoulders · Triceps', badge: 'VOLUME',   exercises: 9, duration: '60–70', preview: ['Incline DB Bench', 'Pec Deck', 'Overhead Press DB']                 },
  5: { name: 'Pull B',   day: 'Friday',    focus: 'Back · Biceps · Rear Delts',  badge: 'VOLUME',   exercises: 9, duration: '60–70', preview: ['Lat Pulldown', 'Seated Cable Row', 'Incline DB Curl']               },
  6: { name: 'Arms',     day: 'Saturday',  focus: 'Biceps · Triceps',            badge: null,       exercises: 8, duration: '50–60', preview: ['EZ Bar Curl', 'Overhead Cable Extension', 'Cable Curl']             },
  0: { name: 'Recovery', day: 'Sunday',    focus: 'Yoga · Zone 2 Bike',          badge: null,       exercises: 0, duration: null,    preview: []                                                                    },
}
const CARDIO = {
  0: { label: 'Long Bike', detail: '75 min · Zone 2', Icon: IconBike },
  1: { label: 'Bike',      detail: '40 min · Zone 2', Icon: IconBike },
  2: { label: 'Run',       detail: '35 min · Zone 2', Icon: IconRun  },
  3: { label: 'Swim',      detail: '35 min',           Icon: IconSwim },
  4: { label: 'Bike',      detail: '40 min · Zone 2', Icon: IconBike },
  5: { label: 'Run',       detail: '35 min · Zone 2', Icon: IconRun  },
  6: { label: 'Swim',      detail: '35 min',           Icon: IconSwim },
}
const CARDIO_ICONS = { run: IconRun, bike: IconBike, swim: IconSwim }

const SESSION_EXERCISES = {
  1: [
    { name: 'Incline Barbell Bench',    sets: 3, reps: '4–6',     info: 'Primary upper chest compound; barbell allows maximum load and mechanical tension.' },
    { name: 'Weighted Dips',            sets: 3, reps: '6–8',     info: 'Lower chest and heaviest tricep compound simultaneously — a different angle from incline.' },
    { name: 'Overhead Cable Extension', sets: 3, reps: '8–10',    info: 'Long head fully stretched overhead; constant cable tension is superior to skull crushers for elbow health.' },
    { name: 'Lateral Raises',           sets: 2, reps: '12–15',   info: 'The only movement that directly loads the medial delt — non-negotiable for shoulder width.' },
    { name: 'Cable Crunch',             sets: 3, reps: '12–15',   info: 'Best overloaded flexion movement for abs; progressive overload is possible like any other muscle.' },
    { name: 'Ab Wheel Rollout',         sets: 3, reps: '8–10',    info: 'Highest rectus abdominis activation in EMG studies.' },
    { name: 'Hanging Leg Raises',       sets: 3, reps: '10–12',   info: 'Lower ab emphasis; hip flexor strength directly improves run cadence.' },
    { name: 'Pallof Press',             sets: 2, reps: '12 each', info: 'Anti-rotation core; protects the spine and is the most functionally relevant exercise for athletic performance.' },
  ],
  2: [
    { name: 'Weighted Pull-ups',        sets: 4, reps: '4–6',     info: 'Primary lat width movement; produces fuller scapular retraction than pulldowns.' },
    { name: 'Barbell Row',              sets: 3, reps: '4–6',     info: 'Horizontal pull for back thickness — a completely different stimulus from vertical pulling.' },
    { name: 'Face Pulls',               sets: 3, reps: '15–20',   info: 'Rear delt and rotator cuff; counterbalances all pressing and is critical for shoulder health.' },
    { name: 'Preacher Curls',           sets: 3, reps: '6–8',     info: 'Bicep fully loaded in its most stretched position, eliminating momentum and cheating.' },
    { name: 'Hammer Curls',             sets: 2, reps: '8–10',    info: 'Brachialis development that physically pushes the bicep peak higher.' },
    { name: 'Cable Crunch',             sets: 3, reps: '12–15',   info: 'Best overloaded flexion movement for abs; progressive overload is possible like any other muscle.' },
    { name: 'Ab Wheel Rollout',         sets: 3, reps: '8–10',    info: 'Highest rectus abdominis activation in EMG studies.' },
    { name: 'Hanging Leg Raises',       sets: 3, reps: '10–12',   info: 'Lower ab emphasis; hip flexor strength directly improves run cadence.' },
    { name: 'Pallof Press',             sets: 2, reps: '12 each', info: 'Anti-rotation core; protects the spine and is the most functionally relevant exercise for athletic performance.' },
  ],
  3: [
    { name: 'RDL',                      sets: 3, reps: '6–8',        info: 'Hip hinge strength for running power and hamstring injury prevention.' },
    { name: 'Bulgarian Split Squat',    sets: 3, reps: '8–10 each',  info: 'Mirrors running gait mechanics and exposes bilateral strength imbalances.' },
    { name: 'Lying Leg Curl',           sets: 3, reps: '8–10',       info: 'Hamstring isolation with hip extended — protects the knee under run and bike volume.' },
    { name: 'Leg Extension',            sets: 2, reps: '12–15',      info: 'VMO isolation that stabilises the patella for run and bike volume.' },
    { name: 'Heavy Calf Raises',        sets: 4, reps: '12–15',      info: 'Gastrocnemius absorbs 3× bodyweight per running stride — running economy lives here.' },
  ],
  4: [
    { name: 'Incline DB Bench',         sets: 3, reps: '8–10',    info: 'Better stretch than barbell with a different resistance curve; complements rather than repeats Push A.' },
    { name: 'Pec Deck',                 sets: 3, reps: '10–12',   info: 'Chest isolation in the stretched position; belongs on volume day, not heavy day.' },
    { name: 'Overhead Press DB',        sets: 3, reps: '8–10',    info: 'Dumbbell allows a more natural wrist path; shoulder compound on volume day so it doesn\'t compete with heavy bench on Push A.' },
    { name: 'JM Press',                 sets: 3, reps: '8–10',    info: 'Bridges the gap between a press and skull crusher; volume day keeps it away from Push A fatigue.' },
    { name: 'Lateral Raises',           sets: 2, reps: '15–20',   info: 'The only movement that directly loads the medial delt — non-negotiable for shoulder width.' },
    { name: 'Cable Crunch',             sets: 3, reps: '12–15',   info: 'Best overloaded flexion movement for abs; progressive overload is possible like any other muscle.' },
    { name: 'Ab Wheel Rollout',         sets: 3, reps: '8–10',    info: 'Highest rectus abdominis activation in EMG studies.' },
    { name: 'Hanging Leg Raises',       sets: 3, reps: '10–12',   info: 'Lower ab emphasis; hip flexor strength directly improves run cadence.' },
    { name: 'Pallof Press',             sets: 2, reps: '12 each', info: 'Anti-rotation core; protects the spine and is the most functionally relevant exercise for athletic performance.' },
  ],
  5: [
    { name: 'Lat Pulldown',             sets: 3, reps: '8–10',    info: 'Width volume with a longer stretch at the top than pull-ups, creating a different resistance curve.' },
    { name: 'Seated Cable Row',         sets: 3, reps: '10–12',   info: 'Back thickness with constant tension through full scapular retraction.' },
    { name: 'Incline DB Curl',          sets: 3, reps: '10–12',   info: 'Long head under maximum tension — highest bicep activation in EMG research.' },
    { name: 'Spider Curls',             sets: 3, reps: '10–12',   info: 'Peak contraction with short head emphasis — complements the incline curl.' },
    { name: 'Rear Delt Fly',            sets: 3, reps: '12–15',   info: 'Rear delt volume; critical for swim stroke power and long-term shoulder balance.' },
    { name: 'Cable Crunch',             sets: 3, reps: '12–15',   info: 'Best overloaded flexion movement for abs; progressive overload is possible like any other muscle.' },
    { name: 'Ab Wheel Rollout',         sets: 3, reps: '8–10',    info: 'Highest rectus abdominis activation in EMG studies.' },
    { name: 'Hanging Leg Raises',       sets: 3, reps: '10–12',   info: 'Lower ab emphasis; hip flexor strength directly improves run cadence.' },
    { name: 'Pallof Press',             sets: 2, reps: '12 each', info: 'Anti-rotation core; protects the spine and is the most functionally relevant exercise for athletic performance.' },
  ],
  6: [
    { name: 'EZ Bar Curl',                  sets: 3, reps: '6–8',   info: 'Heavy bicep compound performed fresh at the start of a dedicated arm session.' },
    { name: 'Overhead Cable Extension',     sets: 3, reps: '6–8',   info: 'Long head fully stretched overhead; constant cable tension is superior to skull crushers for elbow health.' },
    { name: 'Cable Curl',                   sets: 3, reps: '10–12', info: 'Constant tension through a different resistance curve from the EZ bar; avoids repeating incline curl from Pull B.' },
    { name: 'Rope Pushdown',                sets: 3, reps: '10–12', info: 'Lateral head tricep isolation; spreading the rope at the bottom maximises contraction.' },
    { name: 'Concentration Curl',           sets: 3, reps: '12–15', info: 'Peak contraction finisher where zero momentum is possible.' },
    { name: 'Cable Pushdown Straight Bar',  sets: 3, reps: '12–15', info: 'Medial head emphasis — completes all three tricep heads in one session.' },
    { name: 'Reverse Curl EZ Bar',          sets: 3, reps: '10–12', info: 'Brachioradialis and forearm extensor development — adds visible thickness from the top.' },
    { name: 'Wrist Roller',                 sets: 3, reps: '15–20', info: 'Direct forearm flexor development through full ROM, superior to static holds.' },
  ],
  0: [],
}
const SETUP_CUES = {
  'Incline Barbell Bench':       'Set bench to 30-45°, grip just outside shoulder-width. Tuck elbows to 45° and lower to upper chest, then drive up through a full press.',
  'Weighted Dips':               'Lean slightly forward throughout for chest emphasis. Lower until shoulders drop below elbows, then press to full lockout.',
  'Overhead Cable Extension':    'Face away from cable with a slight forward hinge; keep elbows pointed forward and completely still. Extend to lockout and feel the long-head stretch at the bottom.',
  'Lateral Raises':              'Lead with your elbow, not your hand, and stop at shoulder height. Lower slowly—the eccentric is where shoulder width is built.',
  'Cable Crunch':                'Kneel and flex your spine downward—do not hip-hinge. Drive elbows toward your knees on every rep.',
  'Ab Wheel Rollout':            'Brace your core hard before rolling out. Only extend as far as you can return without your lower back arching.',
  'Hanging Leg Raises':          'Tilt your pelvis back first, then curl hips up to raise your legs. Avoid swinging—control the full descent.',
  'Pallof Press':                'Stand perpendicular to the cable and press straight out. Resist any rotation and hold briefly at full extension before returning.',
  'Weighted Pull-ups':           'Start from a dead hang, then drive your elbows toward your hips. Chin must fully clear the bar on every rep.',
  'Barbell Row':                 'Hinge to 45° and brace hard, then pull the bar to your lower sternum. Squeeze shoulder blades together at the top.',
  'Face Pulls':                  'Pull the rope to eye level with elbows high throughout. Externally rotate fully at the end—wrists should finish higher than elbows.',
  'Preacher Curls':              'Keep your upper arm fully flat on the pad at all times. Lower to full extension and pause briefly at the top squeeze.',
  'Hammer Curls':                'Neutral grip with elbow pinned to your side. Only the forearm moves—no elbow drift forward.',
  'RDL':                         'Soft knee, hinge from hips with the bar close to your legs. Stop when you feel a deep hamstring stretch—not when your back rounds.',
  'Bulgarian Split Squat':       'Front shin stays near vertical, torso upright. Lower straight down under control—no forward knee cave.',
  'Lying Leg Curl':              'Keep your hips pressed into the pad throughout. Curl heels toward glutes and hold briefly at peak contraction.',
  'Leg Extension':               'Sit fully back in the seat with toes pointing up slightly. Extend to lockout and hold for a beat before lowering.',
  'Heavy Calf Raises':           'Get a full stretch at the bottom on every rep. Rise onto the ball of your foot and pause at the top.',
  'Incline DB Bench':            'Maintain a 45° arm angle and feel a full stretch at the bottom. Press in an arc, bringing the dumbbells slightly together at the top.',
  'Pec Deck':                    'Keep a slight bend in your elbows and lead with your elbows—not your hands. Squeeze hard at full contraction and control the opening.',
  'Overhead Press DB':           'Elbows slightly in front of your torso, neutral grip. Press straight up without flaring elbows wide.',
  'JM Press':                    'Keep elbows at 45°, lower the bar toward your cheek or throat area. Drive back up explosively—this bridges pressing and skull crushers.',
  'Lat Pulldown':                'Lean back slightly and pull the bar to your upper chest. Let it rise with control to feel a full lat stretch at the top.',
  'Seated Cable Row':            'Sit tall with core braced, grip neutral handles. Drive elbows straight back and squeeze shoulder blades together at the end.',
  'Incline DB Curl':             'Lie fully reclined on the bench with arms hanging perpendicular to the floor. Curl without moving your upper arm—keep it stationary.',
  'Spider Curls':                'Lie prone on the incline with upper arms hanging straight down. Curl to full contraction and lower to full extension every rep.',
  'Rear Delt Fly':               'Hinge forward with a flat back and a slight bend in elbows. Raise arms to shoulder height leading with your elbows, not your hands.',
  'EZ Bar Curl':                 'Elbows pinned to your sides, grip the outer curves of the bar. Full extension at the bottom, peak squeeze at the top.',
  'Cable Curl':                  'Stand close to the low cable with elbows fixed at your sides. Supinate your wrist fully at the top for maximum contraction.',
  'Rope Pushdown':               'Keep elbows tucked and stationary, then spread the rope apart at the bottom. Extend to full lockout—no shoulder involvement.',
  'Concentration Curl':          'Brace your elbow firmly against your thigh and lower to full extension. Curl and hold the peak squeeze on every rep.',
  'Cable Pushdown Straight Bar': 'Elbows at your sides, drive the bar straight to your thighs. Focus on locking out fully and squeezing the tricep hard.',
  'Reverse Curl EZ Bar':         'Overhand grip with elbows pinned to your sides. Lift with forearm extensors and avoid winging elbows outward.',
  'Wrist Roller':                'Hold arms parallel to the floor and roll the weight up by alternating wrists. Control the complete unroll.',
}
const TARGETS  = { calories: 2900, protein: 205, carbs: 290, fat: 100 }
const TIMING   = [
  { time: '7:00 AM',  meal: 'Water only',         protein: null },
  { time: '8:00 AM',  meal: 'Banana + Whey',       protein: 25   },
  { time: '9:30 AM',  meal: 'Hotel breakfast',      protein: 45   },
  { time: '12:30 PM', meal: 'Chicken, rice & veg', protein: 55   },
  { time: '6:30 PM',  meal: 'Dinner',              protein: 45   },
  { time: '9:00 PM',  meal: 'Cottage cheese',      protein: 30   },
]
const LIFT_EXERCISES = [
  'Incline Barbell Bench', 'Weighted Pull-ups', 'Barbell Row',
  'RDL', 'Bulgarian Split Squat', 'Overhead Press DB', 'Weighted Dips', 'EZ Bar Curl',
]
const MILES_PER_MIN = { run: 0.1, bike: 0.25, swim: 0.025 }
const HRV_MAP = {
  green:  { label: 'Ready',    color: '#30D158' },
  orange: { label: 'Moderate', color: '#FF9F0A' },
  red:    { label: 'Low',      color: '#FF453A' },
}
const TABS = [
  { id: 'today', label: 'Today', Icon: IconToday },
  { id: 'train', label: 'Train', Icon: IconTrain },
  { id: 'eat',   label: 'Eat',   Icon: IconEat   },
  { id: 'log',   label: 'Log',   Icon: IconLog   },
]
const CARDIO_TO_MODALITY = { 0: 'bike', 1: 'bike', 2: 'run', 3: 'swim', 4: 'bike', 5: 'run', 6: 'swim' }

// ─── Helpers ──────────────────────────────────────────────────────────────────
const todayKey = () => new Date().toISOString().slice(0, 10)
function dateOffset(n) {
  const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10)
}
function lsLoad(key, fb) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb } catch { return fb }
}
function lsSave(key, val) { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }

function loadAllDailyLogs() {
  const out = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k?.startsWith('daily_')) out.push({ date: k.slice(6), ...lsLoad(k, {}) })
  }
  return out.sort((a, b) => a.date.localeCompare(b.date))
}
function computeStreak(logs) {
  const dates = new Set(logs.filter(l => l.weight || l.hrv || l.cardio?.length).map(l => l.date))
  let s = 0
  for (let i = 0; i < 365; i++) { if (dates.has(dateOffset(-i))) s++; else break }
  return s
}
function computeWeeklyBars() {
  return Array.from({ length: 7 }, (_, i) => {
    const date = dateOffset(i - 6)
    const log  = lsLoad(`daily_${date}`, {})
    const mins = (log.cardio || []).reduce((s, c) => s + (Number(c.duration) || 0), 0)
    const d    = new Date(); d.setDate(d.getDate() - (6 - i))
    return { day: d.toLocaleDateString('en-US', { weekday: 'short' }), mins, hasLog: !!(log.weight || log.hrv || log.cardio?.length), hrv: log.hrv }
  })
}
function computeBodyweightData(logs) {
  return logs.filter(l => l.weight && !isNaN(parseFloat(l.weight))).map(l => ({ date: l.date.slice(5), kg: parseFloat(l.weight) })).slice(-60)
}
function computeLiftData(exercise) {
  const data = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (!k?.startsWith('lifts_')) continue
    const sets = lsLoad(k, {})[exercise] || []
    const max = sets.length ? Math.max(...sets.map(s => Number(s.weight) || 0)) : 0
    if (max > 0) data.push({ date: k.slice(6, 11), kg: max })
  }
  return data.sort((a, b) => a.date.localeCompare(b.date)).slice(-30)
}
function computeAnalytics() {
  const mealDays = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (!k?.startsWith('meals_')) continue
    const meals = lsLoad(k, [])
    if (!meals.length) continue
    const t = meals.reduce((a, m) => ({ cal: a.cal + (Number(m.calories) || 0), prot: a.prot + (Number(m.protein) || 0) }), { cal: 0, prot: 0 })
    mealDays.push(t)
  }
  const macroAdherence = mealDays.length ? Math.round((mealDays.filter(d => Math.abs(d.cal - TARGETS.calories) / TARGETS.calories <= 0.1).length / mealDays.length) * 100) : 0
  const avgProtein = mealDays.length ? Math.round(mealDays.reduce((s, d) => s + d.prot, 0) / mealDays.length) : 0
  let cardioDays = 0
  for (let i = 0; i < 28; i++) { if (lsLoad(`daily_${dateOffset(-i)}`, {}).cardio?.length) cardioDays++ }
  return { macroAdherence, avgProtein, cardioConsistency: Math.round((cardioDays / 28) * 100) }
}
function computeReadiness(hrv, allLogs) {
  let score = hrv === 'green' ? 84 : hrv === 'orange' ? 56 : hrv === 'red' ? 30 : 65
  const recentLoad = allLogs.filter(l => l.date > dateOffset(-4) && l.date < todayKey() && (l.cardio?.length || l.hrv)).length
  return Math.max(15, Math.min(100, Math.round(score - recentLoad * 5)))
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function SectionLabel({ children, style }) {
  const { MUTED } = useT()
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: MUTED, textTransform: 'uppercase', marginBottom: 12, ...style }}>{children}</div>
}
function MacroStat({ label, consumed, target, unit }) {
  const T = useT()
  const A = T.ACC
  const pct = Math.min((consumed / target) * 100, 100)
  return (
    <div style={{ background: T.SURF2, borderRadius: 18, padding: '16px 14px' }}>
      <div style={{ fontSize: 20, fontWeight: 900, color: T.TEXT, letterSpacing: '-0.5px', lineHeight: 1 }}>{Math.round(consumed)}</div>
      <div style={{ fontSize: 10, color: T.MUTED, marginTop: 3, marginBottom: 9 }}>/ {target}{unit}</div>
      <div style={{ background: T.BORDER, borderRadius: 4, height: 4 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: A, borderRadius: 4, transition: 'width .5s ease' }} />
      </div>
      <div style={{ fontSize: 11, color: T.MUTED, fontWeight: 600, marginTop: 7 }}>{label}</div>
    </div>
  )
}
function StatCard({ label, value, sub }) {
  const T = useT()
  const A = T.ACC
  return (
    <div style={{ background: T.SURF2, borderRadius: 18, padding: '16px 14px' }}>
      <div style={{ fontSize: 26, fontWeight: 900, color: T.TEXT, letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: A, fontWeight: 600, marginTop: 4 }}>{sub}</div>}
      <div style={{ fontSize: 11, color: T.MUTED, marginTop: 6, fontWeight: 600 }}>{label}</div>
    </div>
  )
}
function ChartTooltip({ active, payload, label }) {
  const T = useT()
  const A = T.ACC
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: T.SURF, border: `1px solid ${T.BORDER}`, borderRadius: 12, padding: '8px 12px', fontSize: 12 }}>
      <div style={{ color: T.MUTED, marginBottom: 3 }}>{label}</div>
      <div style={{ color: A, fontWeight: 700 }}>{payload[0]?.value} {payload[0]?.name}</div>
    </div>
  )
}

// ─── Today sub-components ─────────────────────────────────────────────────────
function ReadinessRing({ score }) {
  const T = useT()
  const A = T.ACC
  const r = 28
  const circ = 2 * Math.PI * r
  const color = score >= 70 ? A : score >= 45 ? '#FF9F0A' : '#FF453A'
  return (
    <div style={{ position: 'relative', width: 76, height: 76, flexShrink: 0 }}>
      <svg width={76} height={76} viewBox="0 0 76 76">
        <circle cx="38" cy="38" r={r} fill="none" stroke={T.SURF2} strokeWidth="6" />
        <circle cx="38" cy="38" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${(score / 100) * circ} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 38 38)"
          style={{ transition: 'stroke-dasharray .6s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 900, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 8, color: T.MUTED, fontWeight: 600, letterSpacing: 0.5, marginTop: 1 }}>/ 100</div>
      </div>
    </div>
  )
}
function CheckBox({ checked, onToggle, size = 20 }) {
  const T = useT()
  const A = T.ACC
  return (
    <button onClick={onToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: size, height: size, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <rect x="1.5" y="1.5" width="17" height="17" rx="4"
          fill={checked ? A : 'none'}
          stroke={checked ? A : T.BORDER}
          strokeWidth="1.5"
        />
        {checked && <polyline points="4.5 10 8.5 14 15.5 5.5" stroke={T.BG} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
    </button>
  )
}
function TimelineItem({ time, label, detail, checked, onToggle, isLast, accent }) {
  const T = useT()
  const A = T.ACC
  return (
    <div style={{ display: 'flex', gap: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 22, flexShrink: 0 }}>
        <CheckBox checked={checked} onToggle={onToggle} />
        {!isLast && (
          <div style={{ flex: 1, width: 1, minHeight: 18, marginTop: 4, background: checked ? `${A}50` : T.BORDER }} />
        )}
      </div>
      <div style={{ paddingLeft: 14, paddingBottom: isLast ? 0 : 22, flex: 1, opacity: checked ? 0.4 : 1, transition: 'opacity .2s' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: detail ? 3 : 0 }}>
          <span style={{ fontSize: 11, color: T.MUTED, fontWeight: 700, letterSpacing: 0.3, minWidth: 44, fontVariantNumeric: 'tabular-nums' }}>{time}</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: accent || T.TEXT, textDecoration: checked ? 'line-through' : 'none', textDecorationColor: T.MUTED }}>
            {label}
          </span>
        </div>
        {detail && <div style={{ fontSize: 12, color: T.MUTED, marginTop: 1, paddingLeft: 54 }}>{detail}</div>}
      </div>
    </div>
  )
}

// ─── Today tab ────────────────────────────────────────────────────────────────
function TodayTab({ meals, setTab, setModality }) {
  const T = useT()
  const A = T.ACC
  const { pg, card, inp } = makeS(T)
  const now            = new Date()
  const dow            = now.getDay()
  const session        = SESSIONS[dow]
  const cardio         = CARDIO[dow]
  const cardioModality = CARDIO_TO_MODALITY[dow]
  const cardioMod      = MODALITIES.find(m => m.id === cardioModality)
  const cardioTint     = cardioMod?.tint || A

  const allLogs  = useMemo(() => loadAllDailyLogs(), [])
  const streak   = useMemo(() => computeStreak(allLogs), [allLogs])

  const [hrv, setHrvState] = useState(() => lsLoad(`daily_${todayKey()}`, {}).hrv ?? null)
  const setHrv = val => {
    const next = hrv === val ? null : val
    setHrvState(next)
    const ex = lsLoad(`daily_${todayKey()}`, {})
    lsSave(`daily_${todayKey()}`, { ...ex, hrv: next })
  }

  const [weight, setWeight]     = useState(() => lsLoad(`daily_${todayKey()}`, {}).weight ?? '')
  const [weightSaved, setWeightSaved] = useState(!!lsLoad(`daily_${todayKey()}`, {}).weight)
  const saveWeight = () => {
    if (!weight) return
    const ex = lsLoad(`daily_${todayKey()}`, {})
    lsSave(`daily_${todayKey()}`, { ...ex, weight })
    setWeightSaved(true)
  }

  const [notes, setNotes] = useState(() => lsLoad(`notes_${todayKey()}`, ''))
  const handleNotes = e => { setNotes(e.target.value); lsSave(`notes_${todayKey()}`, e.target.value) }

  const readiness      = computeReadiness(hrv, allLogs)
  const readinessColor = readiness >= 70 ? A : readiness >= 45 ? '#FF9F0A' : '#FF453A'
  const lastWeight     = allLogs.filter(l => l.weight).slice(-1)[0]?.weight ?? null

  const consumed = meals.reduce(
    (acc, m) => ({ calories: acc.calories + (Number(m.calories) || 0), protein: acc.protein + (Number(m.protein) || 0) }),
    { calories: 0, protein: 0 }
  )
  const calPct  = Math.min((consumed.calories / TARGETS.calories) * 100, 100)
  const protPct = Math.min((consumed.protein  / TARGETS.protein)  * 100, 100)

  const weekDays = useMemo(() => {
    const dayOfWeek = new Date().getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() + mondayOffset + i)
      const dateStr = d.toISOString().slice(0, 10)
      const isToday = dateStr === todayKey()
      const dl = lsLoad(`daily_${dateStr}`, {})
      const ml = lsLoad(`meals_${dateStr}`, [])
      const ll = lsLoad(`lifts_${dateStr}`, {})
      const hasData = !!(dl.weight || dl.hrv || dl.cardio?.length || ml.length || Object.keys(ll).length)
      return { dateStr, dayLabel: d.toLocaleDateString('en-US', { weekday: 'narrow' }), isToday, hasData, isPast: dateStr < todayKey() }
    })
  }, [])

  const hour     = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dayLabel  = now.toLocaleDateString('en-US', { weekday: 'long' })
  const dateLabel = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

  const goTrain = mod => { setModality(mod); setTab('train') }

  const TrainingCard = ({ label, detail, detail2, Icon, tint, mod, badge }) => (
    <button onClick={() => goTrain(mod)} style={{
      background: `linear-gradient(145deg, ${tint}14 0%, ${T.SURF} 65%)`,
      border: `1px solid ${tint}35`,
      borderRadius: 22, padding: '20px 16px 18px',
      cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 0,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 11, background: `${tint}18`, border: `1px solid ${tint}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={tint} />
        </div>
        {badge && <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.2, color: tint, border: `1px solid ${tint}40`, borderRadius: 5, padding: '3px 7px' }}>{badge}</div>}
      </div>
      <div style={{ fontSize: 15, fontWeight: 800, color: T.TEXT, marginBottom: 3, letterSpacing: '-0.2px' }}>{label}</div>
      <div style={{ fontSize: 11, color: T.MUTED, marginBottom: 2, lineHeight: 1.4 }}>{detail}</div>
      {detail2 && <div style={{ fontSize: 11, color: T.MUTED }}>{detail2}</div>}
      <div style={{ fontSize: 10, color: tint, fontWeight: 800, marginTop: 10, letterSpacing: 0.8 }}>TAP TO LOG →</div>
    </button>
  )

  return (
    <div style={{ ...pg, paddingTop: 28 }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: T.MUTED, fontWeight: 600, letterSpacing: 0.3, marginBottom: 2 }}>{greeting}</div>
        <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.8px', color: T.TEXT, lineHeight: 1.1 }}>{dayLabel}</div>
        <div style={{ fontSize: 13, color: T.MUTED, marginTop: 4 }}>{dateLabel}</div>
      </div>

      {/* ── Quick Stats ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {[
          { value: readiness, label: 'READY', color: readinessColor },
          { value: streak,    label: 'STREAK', color: T.TEXT },
          { value: lastWeight ? `${lastWeight}` : '—', label: 'KG', color: T.TEXT },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, background: T.SURF, borderRadius: 18, padding: '16px 10px', textAlign: 'center', border: `1px solid ${T.BORDER}` }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 9, color: T.MUTED, marginTop: 4, fontWeight: 700, letterSpacing: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Today's Training ── */}
      <SectionLabel>Today's Training</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
        {dow === 0 ? (
          <>
            <TrainingCard label="Long Bike" detail="75 min · Zone 2" Icon={IconBike} tint="#00C47A" mod="bike" />
            <TrainingCard label="Yoga" detail="Recovery flow" detail2="20–30 min" Icon={IconYoga} tint="#7B5BB8" mod="yoga" />
          </>
        ) : (
          <>
            <TrainingCard
              label={session.name}
              detail={session.focus}
              detail2={`${session.duration} min`}
              Icon={IconTrain}
              tint={A}
              mod="lift"
              badge={session.badge}
            />
            <TrainingCard
              label={cardio.label}
              detail={cardio.detail}
              Icon={cardio.Icon}
              tint={cardioTint}
              mod={cardioModality}
            />
          </>
        )}
      </div>

      {/* ── Nutrition ── */}
      <SectionLabel>Nutrition</SectionLabel>
      <button onClick={() => setTab('eat')} style={{ ...card, marginBottom: 28, width: '100%', textAlign: 'left', cursor: 'pointer', boxSizing: 'border-box', borderColor: `${A}22` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: T.TEXT }}>Today's Macros</span>
          <span style={{ fontSize: 11, color: A, fontWeight: 800, letterSpacing: 0.4 }}>OPEN EAT →</span>
        </div>
        {[
          { label: 'Calories', cur: Math.round(consumed.calories), target: TARGETS.calories, unit: ' kcal', pct: calPct },
          { label: 'Protein',  cur: Math.round(consumed.protein),  target: TARGETS.protein,  unit: 'g',     pct: protPct, dim: true },
        ].map(r => (
          <div key={r.label} style={{ marginBottom: r.dim ? 0 : 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
              <span style={{ fontSize: 12, color: T.MUTED, fontWeight: 600 }}>{r.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: T.TEXT }}>
                {r.cur}<span style={{ color: T.MUTED, fontWeight: 400 }}> / {r.target}{r.unit}</span>
              </span>
            </div>
            <div style={{ background: T.SURF2, borderRadius: 5, height: 7 }}>
              <div style={{ width: `${r.pct}%`, height: '100%', background: r.dim ? `${A}80` : A, borderRadius: 5, transition: 'width .5s ease' }} />
            </div>
          </div>
        ))}
      </button>

      {/* ── Quick Log ── */}
      <SectionLabel>Quick Log</SectionLabel>
      <div style={{ ...card, marginBottom: 28 }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, color: T.MUTED, fontWeight: 600, marginBottom: 10 }}>HRV Status</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {Object.entries(HRV_MAP).map(([key, val]) => (
              <button key={key} onClick={() => setHrv(key)} style={{
                flex: 1, borderRadius: 14, padding: '12px 6px',
                border: hrv === key ? `2px solid ${val.color}` : `1px solid ${T.BORDER}`,
                background: hrv === key ? `${val.color}18` : T.SURF2,
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: val.color }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: hrv === key ? val.color : T.MUTED }}>{val.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: T.MUTED, fontWeight: 600, marginBottom: 10 }}>Body Weight</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="number"
              inputMode="decimal"
              value={weight}
              onChange={e => { setWeight(e.target.value); setWeightSaved(false) }}
              placeholder="kg"
              style={{ ...inp, padding: '10px 12px' }}
            />
            <button onClick={saveWeight} style={{
              background: weightSaved ? `${A}18` : A,
              color: weightSaved ? A : '#000',
              border: 'none', borderRadius: 12, padding: '10px 20px',
              fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              {weightSaved ? '✓ Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* ── This Week ── */}
      <SectionLabel>This Week</SectionLabel>
      <div style={{ ...card, marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {weekDays.map((d, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
              <div style={{ fontSize: 10, fontWeight: d.isToday ? 800 : 500, color: d.isToday ? A : T.MUTED }}>{d.dayLabel}</div>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: d.hasData ? `${A}20` : 'transparent',
                border: d.isToday ? `2px solid ${A}` : d.hasData ? `1px solid ${A}50` : `1px solid ${T.BORDER}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {d.hasData
                  ? <div style={{ width: 9, height: 9, borderRadius: '50%', background: d.isToday ? A : `${A}90` }} />
                  : d.isToday
                    ? <div style={{ width: 5, height: 5, borderRadius: '50%', background: A }} />
                    : null
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recovery Notes ── */}
      <SectionLabel>Recovery Notes</SectionLabel>
      <div style={{ ...card, marginBottom: 8 }}>
        <textarea
          value={notes}
          onChange={handleNotes}
          placeholder="Sleep quality, soreness, energy levels..."
          rows={3}
          style={{ ...inp, resize: 'none', lineHeight: 1.6, fontSize: 14, fontFamily: 'inherit' }}
        />
        {notes.length > 0 && <div style={{ fontSize: 11, color: T.MUTED, marginTop: 8, textAlign: 'right' }}>Saved</div>}
      </div>
    </div>
  )
}

// ─── Workout detail view ──────────────────────────────────────────────────────
function getWeightSuggestion(exerciseName, targetReps) {
  const today = todayKey()
  const hits  = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (!k?.startsWith('lifts_')) continue
    const date = k.slice(6)
    if (date >= today) continue
    const sets = (lsLoad(k, {})[exerciseName] || []).filter(s => s.logged && s.weight)
    if (sets.length) hits.push({ date, sets })
  }
  if (!hits.length) return { text: '', suggestWeight: '', lastWeight: '' }
  hits.sort((a, b) => b.date.localeCompare(a.date))
  const lastSets   = hits[0].sets
  const lastSet    = lastSets[lastSets.length - 1]
  const lastWeight = parseFloat(lastSet.weight) || 0
  const topReps    = parseInt(targetReps.replace(/\s*each$/i, '').split('–').pop()) || 0
  const hitTop     = topReps > 0 && parseInt(lastSet.reps) >= topReps
  const suggest    = hitTop ? lastWeight + 5 : lastWeight
  return { text: `suggest ${suggest} lbs`, suggestWeight: String(suggest), lastWeight: String(lastWeight) }
}

function WorkoutDetailView({ session, sessionKey, onBack }) {
  const T = useT()
  const A = T.ACC
  const exercises = SESSION_EXERCISES[sessionKey] || []
  const storeKey  = `lifts_${todayKey()}`
  const [expandedInfo,  setExpandedInfo]  = useState(null)
  const [expandedSetup, setExpandedSetup] = useState(null)

  const suggestions = useMemo(() => {
    const out = {}
    exercises.forEach(ex => { out[ex.name] = getWeightSuggestion(ex.name, ex.reps) })
    return out
  }, []) // eslint-disable-line

  const [setData, setSetData] = useState(() => {
    const saved = lsLoad(storeKey, {})
    const init  = {}
    exercises.forEach(ex => {
      const sv = saved[ex.name]
      init[ex.name] = Array.from({ length: ex.sets }, (_, i) => ({
        weight: sv?.[i]?.weight ?? '',
        reps:   sv?.[i]?.reps   ?? '',
        logged: sv?.[i]?.logged  ?? false,
      }))
    })
    return init
  })

  const totalSets = exercises.reduce((s, e) => s + e.sets, 0)
  const doneSets  = Object.values(setData).flat().filter(s => s.logged).length
  const pct       = totalSets > 0 ? (doneSets / totalSets) * 100 : 0

  const updateSet = (exName, si, field, value) => {
    setSetData(prev => {
      const next = { ...prev, [exName]: prev[exName].map((s, i) => i === si ? { ...s, [field]: value } : s) }
      lsSave(storeKey, next); return next
    })
  }

  const logSet = (exName, si) => {
    setSetData(prev => {
      const exSets = [...prev[exName]]
      const carryW = exSets.slice(0, si).reverse().find(x => x.logged)?.weight ?? suggestions[exName]?.suggestWeight ?? ''
      exSets[si] = { weight: exSets[si].weight || carryW, reps: exSets[si].reps, logged: true }
      const next = { ...prev, [exName]: exSets }
      lsSave(storeKey, next); return next
    })
  }

  const unlogSet = (exName, si) => {
    setSetData(prev => {
      const next = { ...prev, [exName]: prev[exName].map((s, i) => i === si ? { ...s, logged: false } : s) }
      lsSave(storeKey, next); return next
    })
  }

  const toggleInfo = idx => { setExpandedInfo(p => p === idx ? null : idx); setExpandedSetup(null) }
  const toggleSetup = idx => { setExpandedSetup(p => p === idx ? null : idx); setExpandedInfo(null) }

  return (
    <div style={{ minHeight: '100%' }}>
      <div style={{ position: 'sticky', top: 0, background: T.BG, borderBottom: `1px solid ${T.BORDER}`, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 2px', display: 'flex', alignItems: 'center' }}>
          <IconBack size={20} color={T.TEXT} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 19, fontWeight: 900, color: T.TEXT, letterSpacing: '-0.4px', lineHeight: 1.1 }}>{session.name}</div>
          <div style={{ fontSize: 11, color: T.MUTED, marginTop: 2 }}>{session.focus}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: A }}>{doneSets}<span style={{ color: T.MUTED, fontWeight: 500 }}>/{totalSets}</span></div>
          <div style={{ fontSize: 10, color: T.MUTED, marginTop: 1 }}>sets done</div>
        </div>
      </div>

      <div style={{ height: 3, background: T.SURF2 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: A, transition: 'width .3s ease' }} />
      </div>

      <div style={{ padding: '16px 18px 40px' }}>
        {exercises.length === 0 && (
          <div style={{ textAlign: 'center', padding: '56px 16px', color: T.MUTED, fontSize: 14 }}>
            Rest day. Focus on recovery and mobility.
          </div>
        )}
        {exercises.map((ex, exIdx) => {
          const exSets      = setData[ex.name] || []
          const loggedCount = exSets.filter(s => s.logged).length
          const allDone     = loggedCount === ex.sets && ex.sets > 0
          const isInfoOpen  = expandedInfo  === exIdx
          const isSetupOpen = expandedSetup === exIdx
          const sg          = suggestions[ex.name]
          const setupCue    = SETUP_CUES[ex.name]

          return (
            <div key={exIdx} style={{ background: T.SURF, border: `1px solid ${allDone ? A + '50' : T.BORDER}`, borderRadius: 20, padding: '16px', marginBottom: 10, transition: 'border-color .2s' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: sg?.text ? 4 : 14 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: allDone ? A : T.TEXT, lineHeight: 1.2 }}>{ex.name}</div>
                    {allDone && <IconCheck size={14} color={A} />}
                  </div>
                  <div style={{ fontSize: 12, color: T.MUTED, marginTop: 3 }}>
                    {ex.sets} sets · {ex.reps} reps{sg?.lastWeight ? ` · last: ${sg.lastWeight} lbs` : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 5, flexShrink: 0, marginLeft: 10 }}>
                  {setupCue && (
                    <button
                      onClick={() => toggleSetup(exIdx)}
                      style={{ background: isSetupOpen ? '#FF9F0A18' : 'transparent', border: `1px solid ${isSetupOpen ? '#FF9F0A55' : T.BORDER}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all .15s' }}
                    >
                      <IconForm size={14} color={isSetupOpen ? '#FF9F0A' : T.MUTED} />
                    </button>
                  )}
                  <button
                    onClick={() => toggleInfo(exIdx)}
                    style={{ background: isInfoOpen ? `${A}15` : 'transparent', border: `1px solid ${isInfoOpen ? A + '40' : T.BORDER}`, borderRadius: 8, padding: '5px 9px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all .15s' }}
                  >
                    <IconInfo size={14} color={isInfoOpen ? A : T.MUTED} />
                  </button>
                </div>
              </div>

              {sg?.text && (
                <div style={{ fontSize: 11, color: '#FF9F0A', fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 10 }}>↑</span>{sg.text}
                </div>
              )}

              {isSetupOpen && (
                <div style={{ background: '#FF9F0A0B', border: '1px solid #FF9F0A25', borderRadius: 12, padding: '12px 14px', marginBottom: 12, fontSize: 12, color: T.MUTED, lineHeight: 1.65 }}>
                  {setupCue}
                </div>
              )}
              {isInfoOpen && (
                <div style={{ background: `${A}08`, border: `1px solid ${A}20`, borderRadius: 12, padding: '12px 14px', marginBottom: 12, fontSize: 12, color: T.MUTED, lineHeight: 1.65 }}>
                  {ex.info}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {exSets.map((s, si) => {
                  if (s.logged) {
                    return (
                      <div key={si} onClick={() => unlogSet(ex.name, si)} style={{ display: 'flex', alignItems: 'center', gap: 10, background: `${A}10`, border: `1px solid ${A}30`, borderRadius: 12, padding: '9px 12px', cursor: 'pointer' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: T.MUTED, minWidth: 20, flexShrink: 0 }}>S{si + 1}</span>
                        <IconCheck size={13} color={A} />
                        <span style={{ fontSize: 14, fontWeight: 700, color: A, flex: 1 }}>
                          {s.weight ? `${s.weight} lbs` : '—'}{s.reps ? ` · ${s.reps} reps` : ''}
                        </span>
                        <IconX size={13} color={`${A}80`} />
                      </div>
                    )
                  }
                  const carryW = exSets.slice(0, si).reverse().find(x => x.logged)?.weight ?? null
                  const ph = carryW ?? sg?.suggestWeight ?? ''
                  return (
                    <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: T.MUTED, minWidth: 20, flexShrink: 0 }}>S{si + 1}</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        placeholder={ph || '—'}
                        value={s.weight}
                        onChange={e => updateSet(ex.name, si, 'weight', e.target.value)}
                        style={{ width: 68, background: T.SURF2, border: `1px solid ${T.BORDER}`, borderRadius: 10, color: T.TEXT, fontSize: 16, fontWeight: 600, padding: '9px 8px', outline: 'none', textAlign: 'center', boxSizing: 'border-box', flexShrink: 0 }}
                      />
                      <span style={{ fontSize: 11, color: T.MUTED, flexShrink: 0 }}>lbs</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        placeholder={ex.reps.split(/[–\s]/)[0]}
                        value={s.reps}
                        onChange={e => updateSet(ex.name, si, 'reps', e.target.value)}
                        style={{ width: 48, background: T.SURF2, border: `1px solid ${T.BORDER}`, borderRadius: 10, color: T.TEXT, fontSize: 16, fontWeight: 600, padding: '9px 6px', outline: 'none', textAlign: 'center', boxSizing: 'border-box', flexShrink: 0 }}
                      />
                      <span style={{ fontSize: 11, color: T.MUTED, flexShrink: 0 }}>reps</span>
                      <button
                        onClick={() => logSet(ex.name, si)}
                        style={{ flex: 1, minWidth: 44, background: A, color: '#fff', border: 'none', borderRadius: 10, padding: '9px 8px', fontSize: 12, fontWeight: 800, cursor: 'pointer', letterSpacing: 0.5 }}
                      >
                        LOG
                      </button>
                    </div>
                  )
                })}
              </div>

              {loggedCount > 0 && !allDone && (
                <div style={{ fontSize: 11, color: T.MUTED, marginTop: 10, textAlign: 'right' }}>{loggedCount}/{ex.sets} sets</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Run ──────────────────────────────────────────────────────────────────────
const RUN_ZONES = [
  { n: 1, label: 'Recovery',  color: '#5B9BD5' },
  { n: 2, label: 'Easy',      color: '#55A85A' },
  { n: 3, label: 'Aerobic',   color: '#E8A838' },
  { n: 4, label: 'Threshold', color: '#E07830' },
  { n: 5, label: 'VO2 Max',   color: '#D84040' },
]

function getPlannedRun(dow) {
  if (dow === 2 || dow === 5) return { label: 'Zone 2 Easy',   detail: '30–40 min target', zoneHint: 2 }
  if (dow === 0)               return { label: 'Long Run',      detail: '60–90 min target', zoneHint: 2 }
  return                              { label: 'Recovery Run',  detail: 'Optional · Easy pace', zoneHint: 1 }
}

function getMondayOfWeek() {
  const d = new Date()
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const DAY_NAMES_FULL = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY']

function RunView({ onBack }) {
  const T = useT()
  const A = T.ACC
  const { pg, card, inp } = makeS(T)
  const dow = new Date().getDay()
  const plan = getPlannedRun(dow)

  const [runs, setRuns] = useState(() => lsLoad('run_log', []))
  const [form, setForm] = useState({ distance: '', duration: '', zone: plan.zoneHint, notes: '' })

  const pace = useMemo(() => {
    const d = parseFloat(form.distance)
    const t = parseFloat(form.duration)
    if (!d || !t || d <= 0 || t <= 0) return ''
    const dec = t / d
    const mins = Math.floor(dec)
    const secs = Math.round((dec - mins) * 60)
    return `${mins}:${String(secs).padStart(2, '0')} /mi`
  }, [form.distance, form.duration])

  const { totalMiles, weekMiles } = useMemo(() => {
    const total = runs.reduce((s, r) => s + (parseFloat(r.distance) || 0), 0)
    const mon = getMondayOfWeek()
    const week = runs.filter(r => r.date >= mon).reduce((s, r) => s + (parseFloat(r.distance) || 0), 0)
    return { totalMiles: Math.round(total * 10) / 10, weekMiles: Math.round(week * 10) / 10 }
  }, [runs])

  const logRun = () => {
    if (!form.distance) return
    const next = [{ id: Date.now(), date: todayKey(), distance: parseFloat(form.distance), duration: parseFloat(form.duration) || 0, zone: form.zone, notes: form.notes.trim(), pace }, ...runs]
    setRuns(next); lsSave('run_log', next)
    setForm({ distance: '', duration: '', zone: plan.zoneHint, notes: '' })
  }

  const zoneColor = n => RUN_ZONES.find(z => z.n === n)?.color || T.MUTED
  const fmtDate = ds => new Date(ds + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const last5 = runs.slice(0, 5)

  return (
    <div style={pg}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.MUTED, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 5, marginBottom: 20, fontSize: 12, fontWeight: 600 }}>
        <IconBack size={15} color={T.MUTED} /> Train
      </button>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', color: T.TEXT, marginBottom: 4 }}>Run</div>
        <div style={{ fontSize: 13, color: T.MUTED }}>Track your runs · Build your base</div>
      </div>

      {/* Today's plan */}
      <div style={{ position: 'relative', borderRadius: 22, overflow: 'hidden', marginBottom: 20, background: `linear-gradient(110deg, ${A}14 0%, ${T.SURF} 60%)`, border: `1px solid ${A}35` }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: A }} />
        <div style={{ padding: '16px 16px 16px 20px' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: A, letterSpacing: 1.2, marginBottom: 6 }}>TODAY · {DAY_NAMES_FULL[dow]}</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: T.TEXT, letterSpacing: '-0.3px' }}>{plan.label}</div>
          <div style={{ fontSize: 13, color: T.MUTED, marginTop: 3 }}>{plan.detail}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[{ val: totalMiles, label: 'TOTAL MILES' }, { val: weekMiles, label: 'THIS WEEK' }].map(s => (
          <div key={s.label} style={{ background: T.SURF2, borderRadius: 18, padding: '16px 14px' }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: A, letterSpacing: '-0.5px', lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 9, color: T.MUTED, marginTop: 6, fontWeight: 700, letterSpacing: 0.8 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Map placeholder */}
      <div style={{ borderRadius: 22, height: 144, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `1px dashed ${T.BORDER}`, background: T.SURF, marginBottom: 24, gap: 8 }}>
        <IconMapPin size={34} color={T.DIM} />
        <div style={{ fontSize: 13, fontWeight: 700, color: T.MUTED }}>GPS Map</div>
        <div style={{ fontSize: 11, color: T.DIM }}>Available after deployment</div>
      </div>

      {/* Log form */}
      <div style={{ ...card, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.TEXT, marginBottom: 16 }}>Log a Run</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: T.MUTED, marginBottom: 5, fontWeight: 700, letterSpacing: 0.5 }}>DISTANCE (MI)</div>
            <input type="number" inputMode="decimal" placeholder="3.1" style={inp} value={form.distance} onChange={e => setForm(p => ({ ...p, distance: e.target.value }))} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: T.MUTED, marginBottom: 5, fontWeight: 700, letterSpacing: 0.5 }}>DURATION (MIN)</div>
            <input type="number" inputMode="numeric" placeholder="30" style={inp} value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: T.MUTED, marginBottom: 5, fontWeight: 700, letterSpacing: 0.5 }}>PACE</div>
          <div style={{ ...inp, color: pace ? A : T.DIM, fontWeight: pace ? 800 : 400, fontSize: pace ? 16 : 13 }}>
            {pace || 'Auto-calculated · fill distance and duration'}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: T.MUTED, marginBottom: 8, fontWeight: 700, letterSpacing: 0.5 }}>ZONE</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {RUN_ZONES.map(z => (
              <button key={z.n} onClick={() => setForm(p => ({ ...p, zone: z.n }))} style={{ flex: 1, border: `1px solid ${form.zone === z.n ? z.color : T.BORDER}`, borderRadius: 12, padding: '9px 2px', background: form.zone === z.n ? `${z.color}18` : 'transparent', cursor: 'pointer', textAlign: 'center', transition: 'all .15s' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: form.zone === z.n ? z.color : T.MUTED, lineHeight: 1 }}>{z.n}</div>
                <div style={{ fontSize: 7, fontWeight: 800, color: form.zone === z.n ? z.color : T.DIM, letterSpacing: 0.5, marginTop: 3 }}>{z.label.split(' ')[0].toUpperCase()}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: T.MUTED, marginBottom: 5, fontWeight: 700, letterSpacing: 0.5 }}>NOTES</div>
          <textarea placeholder="How did it feel?" style={{ ...inp, resize: 'none', height: 72, fontFamily: 'inherit' }} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
        </div>

        <button onClick={logRun} style={{ width: '100%', background: A, color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontSize: 14, fontWeight: 800, cursor: 'pointer', letterSpacing: 0.4 }}>Log Run</button>
      </div>

      {/* Run history */}
      <SectionLabel>Recent Runs</SectionLabel>
      {last5.length === 0 && (
        <div style={{ textAlign: 'center', color: T.MUTED, fontSize: 13, padding: '28px 0' }}>No runs logged yet. Lace up and go.</div>
      )}
      {last5.map(r => (
        <div key={r.id} style={{ ...card, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.TEXT }}>{fmtDate(r.date)}</div>
              {r.notes && <div style={{ fontSize: 11, color: T.MUTED, marginTop: 2, maxWidth: 180 }}>{r.notes}</div>}
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: A, letterSpacing: '-0.3px' }}>{r.distance}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: T.MUTED, marginLeft: 3 }}>mi</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.8, color: zoneColor(r.zone), background: `${zoneColor(r.zone)}15`, borderRadius: 6, padding: '3px 8px' }}>Z{r.zone}</span>
            {r.duration > 0 && <span style={{ fontSize: 12, color: T.MUTED }}>{r.duration} min</span>}
            {r.pace && <span style={{ fontSize: 12, color: T.DIM }}>·</span>}
            {r.pace && <span style={{ fontSize: 12, fontWeight: 700, color: T.TEXT }}>{r.pace}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Bike ─────────────────────────────────────────────────────────────────────
function getPlannedRide(dow) {
  if (dow === 1 || dow === 4) return { label: 'Zone 2 Fasted',    detail: '40 min target',    zoneHint: 2 }
  if (dow === 0)               return { label: 'Long Ride',        detail: '60–90 min target', zoneHint: 2 }
  return                              { label: 'Recovery Ride',    detail: 'Optional · Easy spin', zoneHint: 1 }
}

function BikeView({ onBack }) {
  const T = useT()
  const A = T.ACC
  const { pg, card, inp } = makeS(T)
  const dow = new Date().getDay()
  const plan = getPlannedRide(dow)

  const [rides, setRides] = useState(() => lsLoad('ride_log', []))
  const [form, setForm] = useState({ distance: '', duration: '', watts: '', zone: plan.zoneHint, notes: '' })

  const { totalMiles, weekMiles } = useMemo(() => {
    const total = rides.reduce((s, r) => s + (parseFloat(r.distance) || 0), 0)
    const mon = getMondayOfWeek()
    const week = rides.filter(r => r.date >= mon).reduce((s, r) => s + (parseFloat(r.distance) || 0), 0)
    return { totalMiles: Math.round(total * 10) / 10, weekMiles: Math.round(week * 10) / 10 }
  }, [rides])

  const logRide = () => {
    if (!form.distance && !form.duration) return
    const next = [{ id: Date.now(), date: todayKey(), distance: parseFloat(form.distance) || 0, duration: parseFloat(form.duration) || 0, watts: parseFloat(form.watts) || 0, zone: form.zone, notes: form.notes.trim() }, ...rides]
    setRides(next); lsSave('ride_log', next)
    setForm({ distance: '', duration: '', watts: '', zone: plan.zoneHint, notes: '' })
  }

  const zoneColor = n => RUN_ZONES.find(z => z.n === n)?.color || T.MUTED
  const fmtDate = ds => new Date(ds + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const last5 = rides.slice(0, 5)
  const BIKE_TINT = '#00C47A'

  return (
    <div style={pg}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.MUTED, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 5, marginBottom: 20, fontSize: 12, fontWeight: 600 }}>
        <IconBack size={15} color={T.MUTED} /> Train
      </button>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', color: T.TEXT, marginBottom: 4 }}>Bike</div>
        <div style={{ fontSize: 13, color: T.MUTED }}>Track your rides · Build your aerobic base</div>
      </div>

      {/* Today's plan */}
      <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', marginBottom: 20, background: `linear-gradient(110deg, ${BIKE_TINT}14 0%, ${T.SURF} 60%)`, border: `1px solid ${BIKE_TINT}35` }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: BIKE_TINT }} />
        <div style={{ padding: '16px 16px 16px 20px' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: BIKE_TINT, letterSpacing: 1.2, marginBottom: 6 }}>TODAY · {DAY_NAMES_FULL[dow]}</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: T.TEXT, letterSpacing: '-0.3px' }}>{plan.label}</div>
          <div style={{ fontSize: 13, color: T.MUTED, marginTop: 3 }}>{plan.detail}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[{ val: totalMiles, label: 'TOTAL MILES' }, { val: weekMiles, label: 'THIS WEEK' }].map(s => (
          <div key={s.label} style={{ background: T.SURF2, borderRadius: 18, padding: '16px 14px' }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: BIKE_TINT, letterSpacing: '-0.5px', lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 9, color: T.MUTED, marginTop: 6, fontWeight: 700, letterSpacing: 0.8 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Map placeholder */}
      <div style={{ borderRadius: 22, height: 144, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `1px dashed ${T.BORDER}`, background: T.SURF, marginBottom: 24, gap: 8 }}>
        <IconMapPin size={34} color={T.DIM} />
        <div style={{ fontSize: 13, fontWeight: 700, color: T.MUTED }}>GPS Map</div>
        <div style={{ fontSize: 11, color: T.DIM }}>Available after deployment</div>
      </div>

      {/* Log form */}
      <div style={{ ...card, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.TEXT, marginBottom: 16 }}>Log a Ride</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: T.MUTED, marginBottom: 5, fontWeight: 700, letterSpacing: 0.5 }}>DISTANCE (MI)</div>
            <input type="number" inputMode="decimal" placeholder="12.4" style={inp} value={form.distance} onChange={e => setForm(p => ({ ...p, distance: e.target.value }))} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: T.MUTED, marginBottom: 5, fontWeight: 700, letterSpacing: 0.5 }}>DURATION (MIN)</div>
            <input type="number" inputMode="numeric" placeholder="40" style={inp} value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: T.MUTED, marginBottom: 5, fontWeight: 700, letterSpacing: 0.5 }}>AVG WATTS <span style={{ fontWeight: 400, letterSpacing: 0 }}>(optional)</span></div>
          <input type="number" inputMode="numeric" placeholder="180" style={inp} value={form.watts} onChange={e => setForm(p => ({ ...p, watts: e.target.value }))} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: T.MUTED, marginBottom: 8, fontWeight: 700, letterSpacing: 0.5 }}>ZONE</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {RUN_ZONES.map(z => (
              <button key={z.n} onClick={() => setForm(p => ({ ...p, zone: z.n }))} style={{ flex: 1, border: `1px solid ${form.zone === z.n ? z.color : T.BORDER}`, borderRadius: 12, padding: '9px 2px', background: form.zone === z.n ? `${z.color}18` : 'transparent', cursor: 'pointer', textAlign: 'center', transition: 'all .15s' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: form.zone === z.n ? z.color : T.MUTED, lineHeight: 1 }}>{z.n}</div>
                <div style={{ fontSize: 7, fontWeight: 800, color: form.zone === z.n ? z.color : T.DIM, letterSpacing: 0.5, marginTop: 3 }}>{z.label.split(' ')[0].toUpperCase()}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: T.MUTED, marginBottom: 5, fontWeight: 700, letterSpacing: 0.5 }}>NOTES</div>
          <textarea placeholder="How did it feel?" style={{ ...inp, resize: 'none', height: 72, fontFamily: 'inherit' }} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
        </div>

        <button onClick={logRide} style={{ width: '100%', background: BIKE_TINT, color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontSize: 14, fontWeight: 800, cursor: 'pointer', letterSpacing: 0.4 }}>Log Ride</button>
      </div>

      {/* Ride history */}
      <SectionLabel>Recent Rides</SectionLabel>
      {last5.length === 0 && (
        <div style={{ textAlign: 'center', color: T.MUTED, fontSize: 13, padding: '28px 0' }}>No rides logged yet. Clip in and roll.</div>
      )}
      {last5.map(r => (
        <div key={r.id} style={{ ...card, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.TEXT }}>{fmtDate(r.date)}</div>
              {r.notes && <div style={{ fontSize: 11, color: T.MUTED, marginTop: 2, maxWidth: 180 }}>{r.notes}</div>}
            </div>
            <div style={{ textAlign: 'right' }}>
              {r.distance > 0 && (
                <>
                  <span style={{ fontSize: 22, fontWeight: 900, color: BIKE_TINT, letterSpacing: '-0.3px' }}>{r.distance}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.MUTED, marginLeft: 3 }}>mi</span>
                </>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.8, color: zoneColor(r.zone), background: `${zoneColor(r.zone)}15`, borderRadius: 6, padding: '3px 8px' }}>Z{r.zone}</span>
            {r.duration > 0 && <span style={{ fontSize: 12, color: T.MUTED }}>{r.duration} min</span>}
            {r.watts > 0 && <span style={{ fontSize: 12, color: T.DIM }}>·</span>}
            {r.watts > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: T.TEXT }}>{r.watts}w avg</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Swim ─────────────────────────────────────────────────────────────────────
const SWIM_TINT    = '#2878C8'
const SWIM_STROKES = ['Freestyle', 'Backstroke', 'Breaststroke', 'Mixed']

function SwimView({ onBack }) {
  const T = useT()
  const A = T.ACC
  const { pg, card, inp } = makeS(T)

  const [swims, setSwims]   = useState(() => lsLoad('swim_log', []))
  const [unit, setUnit]     = useState('yds')
  const [form, setForm]     = useState({ distance: '', duration: '', stroke: 'Freestyle', zone: 2, notes: '' })

  const toYards = (dist, u) => u === 'mt' ? Math.round((parseFloat(dist) || 0) * 1.094) : (parseFloat(dist) || 0)

  const { totalYards, weekYards } = useMemo(() => {
    const total = swims.reduce((s, r) => s + toYards(r.distance, r.unit || 'yds'), 0)
    const mon   = getMondayOfWeek()
    const week  = swims.filter(r => r.date >= mon).reduce((s, r) => s + toYards(r.distance, r.unit || 'yds'), 0)
    return { totalYards: Math.round(total), weekYards: Math.round(week) }
  }, [swims])

  const logSwim = () => {
    if (!form.distance && !form.duration) return
    const next = [{ id: Date.now(), date: todayKey(), distance: parseFloat(form.distance) || 0, unit, duration: parseFloat(form.duration) || 0, stroke: form.stroke, zone: form.zone, notes: form.notes.trim() }, ...swims]
    setSwims(next); lsSave('swim_log', next)
    setForm({ distance: '', duration: '', stroke: 'Freestyle', zone: 2, notes: '' })
  }

  const zoneColor = n => RUN_ZONES.find(z => z.n === n)?.color || T.MUTED
  const fmtDate   = ds => new Date(ds + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const last5     = swims.slice(0, 5)
  const secLbl    = { fontSize: 10, color: T.MUTED, marginBottom: 5, fontWeight: 700, letterSpacing: 0.5 }

  return (
    <div style={pg}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.MUTED, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 5, marginBottom: 20, fontSize: 12, fontWeight: 600 }}>
        <IconBack size={15} color={T.MUTED} /> Train
      </button>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', color: T.TEXT, marginBottom: 4 }}>Swim</div>
        <div style={{ fontSize: 13, color: T.MUTED }}>Track your swims · Build your engine</div>
      </div>

      {/* Shoulder clearance note */}
      <div style={{ background: '#FF9F0A0A', border: '1px solid #FF9F0A28', borderRadius: 18, padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚠</div>
        <div style={{ fontSize: 12, color: T.TEXT, lineHeight: 1.5 }}>Full swim volume requires shoulder clearance. Ease into yardage and stop if you feel shoulder impingement or pain.</div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[{ val: totalYards.toLocaleString(), label: 'TOTAL YARDS' }, { val: weekYards.toLocaleString(), label: 'THIS WEEK' }].map(s => (
          <div key={s.label} style={{ background: T.SURF2, borderRadius: 18, padding: '16px 14px' }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: SWIM_TINT, letterSpacing: '-0.5px', lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 9, color: T.MUTED, marginTop: 6, fontWeight: 700, letterSpacing: 0.8 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Map placeholder */}
      <div style={{ borderRadius: 22, height: 144, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `1px dashed ${T.BORDER}`, background: T.SURF, marginBottom: 24, gap: 8 }}>
        <IconMapPin size={34} color={T.DIM} />
        <div style={{ fontSize: 13, fontWeight: 700, color: T.MUTED }}>GPS Map</div>
        <div style={{ fontSize: 11, color: T.DIM }}>Available after deployment</div>
      </div>

      {/* Log form */}
      <div style={{ ...card, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.TEXT, marginBottom: 16 }}>Log a Swim</div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <div style={secLbl}>DISTANCE</div>
            <div style={{ display: 'flex', background: T.SURF2, borderRadius: 12, padding: 3, gap: 2 }}>
              {['yds', 'mt'].map(u => (
                <button key={u} onClick={() => setUnit(u)} style={{ fontSize: 10, fontWeight: 700, padding: '5px 12px', borderRadius: 9, border: 'none', cursor: 'pointer', background: unit === u ? SWIM_TINT : 'transparent', color: unit === u ? '#fff' : T.MUTED, transition: 'all .15s' }}>{u}</button>
              ))}
            </div>
          </div>
          <input type="number" inputMode="numeric" placeholder={unit === 'yds' ? '1500' : '1400'} style={inp} value={form.distance} onChange={e => setForm(p => ({ ...p, distance: e.target.value }))} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={secLbl}>DURATION (MIN)</div>
          <input type="number" inputMode="numeric" placeholder="30" style={inp} value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={secLbl}>STROKE</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {SWIM_STROKES.map(s => (
              <button key={s} onClick={() => setForm(p => ({ ...p, stroke: s }))} style={{ flex: '1 1 auto', border: `1px solid ${form.stroke === s ? SWIM_TINT : T.BORDER}`, borderRadius: 12, padding: '9px 4px', background: form.stroke === s ? `${SWIM_TINT}18` : 'transparent', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: form.stroke === s ? SWIM_TINT : T.MUTED, transition: 'all .15s' }}>{s}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={secLbl}>ZONE</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {RUN_ZONES.map(z => (
              <button key={z.n} onClick={() => setForm(p => ({ ...p, zone: z.n }))} style={{ flex: 1, border: `1px solid ${form.zone === z.n ? z.color : T.BORDER}`, borderRadius: 12, padding: '9px 2px', background: form.zone === z.n ? `${z.color}18` : 'transparent', cursor: 'pointer', textAlign: 'center', transition: 'all .15s' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: form.zone === z.n ? z.color : T.MUTED, lineHeight: 1 }}>{z.n}</div>
                <div style={{ fontSize: 7, fontWeight: 800, color: form.zone === z.n ? z.color : T.DIM, letterSpacing: 0.5, marginTop: 3 }}>{z.label.split(' ')[0].toUpperCase()}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={secLbl}>NOTES</div>
          <textarea placeholder="How did it feel?" style={{ ...inp, resize: 'none', height: 72, fontFamily: 'inherit' }} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
        </div>

        <button onClick={logSwim} style={{ width: '100%', background: SWIM_TINT, color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontSize: 14, fontWeight: 800, cursor: 'pointer', letterSpacing: 0.4 }}>Log Swim</button>
      </div>

      {/* Swim history */}
      <SectionLabel>Recent Swims</SectionLabel>
      {last5.length === 0 && <div style={{ textAlign: 'center', color: T.MUTED, fontSize: 13, padding: '28px 0' }}>No swims logged yet. Hit the pool.</div>}
      {last5.map(r => (
        <div key={r.id} style={{ ...card, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.TEXT }}>{fmtDate(r.date)}</div>
              {r.notes && <div style={{ fontSize: 11, color: T.MUTED, marginTop: 2, maxWidth: 180 }}>{r.notes}</div>}
            </div>
            <div style={{ textAlign: 'right' }}>
              {r.distance > 0 && <>
                <span style={{ fontSize: 22, fontWeight: 900, color: SWIM_TINT, letterSpacing: '-0.3px' }}>{r.distance}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: T.MUTED, marginLeft: 3 }}>{r.unit || 'yds'}</span>
              </>}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.8, color: zoneColor(r.zone), background: `${zoneColor(r.zone)}15`, borderRadius: 6, padding: '3px 8px' }}>Z{r.zone}</span>
            {r.stroke && <span style={{ fontSize: 11, color: T.MUTED }}>{r.stroke}</span>}
            {r.duration > 0 && <><span style={{ fontSize: 12, color: T.DIM }}>·</span><span style={{ fontSize: 12, color: T.MUTED }}>{r.duration} min</span></>}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Yoga ─────────────────────────────────────────────────────────────────────
const YOGA_TINT = '#7B5BB8'

const MORNING_STEPS = [
  { name: 'Cervical Rolls',    side: 'Left direction',  cue: 'Slowly roll your head in a full circle. Shoulders relaxed, move at a controlled pace through any tight spots.',             duration: 30 },
  { name: 'Cervical Rolls',    side: 'Right direction', cue: 'Reverse direction. Same slow, controlled pace.',                                                                            duration: 30 },
  { name: 'Thoracic Rotation', cue: 'Hands behind head, elbows wide. Rotate your upper back side to side, keeping hips square and still.',                                               duration: 60 },
  { name: 'Shoulder CARs',     side: 'Left arm',        cue: 'Slow full controlled articular rotation. Think about filling every degree of available shoulder range.',                   duration: 60 },
  { name: 'Shoulder CARs',     side: 'Right arm',       cue: 'Same slow full circle. Feel the shoulder blade actively moving throughout the arc.',                                       duration: 60 },
  { name: 'Couch Stretch',     side: 'Left side',       cue: 'Back foot elevated, front foot forward. Tuck the pelvis and squeeze the glute to open the hip flexor.',                   duration: 90 },
  { name: 'Couch Stretch',     side: 'Right side',      cue: 'Match the depth from the left side. Breathe into the front of the hip.',                                                  duration: 90 },
  { name: 'Hamstring Reach',   side: 'Left leg',        cue: 'Standing hinge at the hip, reach toward the floor. Keep the back long with a soft bend in the knee.',                     duration: 60 },
  { name: 'Hamstring Reach',   side: 'Right leg',       cue: 'Each exhale, let the hamstring release a little more. Match depth from the other side.',                                  duration: 60 },
  { name: 'Deep Squat Hold',   cue: 'Feet shoulder-width, toes angled out. Sit as low as possible. Drive the knees out with your elbows and breathe.',                                  duration: 60 },
  { name: 'Figure-4 Stretch',  side: 'Left glute',      cue: 'Cross left ankle over right knee, flex the foot. Hinge forward or pull the knee in to load the outer hip.',              duration: 60 },
  { name: 'Figure-4 Stretch',  side: 'Right glute',     cue: 'Same setup on the other side. Keep the foot flexed and breathe into the outer hip.',                                     duration: 60 },
]

const RECOVERY_STEPS = [
  { name: 'Cervical Rolls',          cue: 'Slow full circles in both directions. Keep shoulders completely relaxed throughout.',                                                          duration: 60 },
  { name: 'Cat Cow',                  cue: 'On hands and knees. Arch and round the spine in sync with breath — exhale to round, inhale to arch.',                                        duration: 60 },
  { name: 'Thread the Needle',       side: 'Left side',   cue: 'From hands and knees, thread the left arm under and through. Rest shoulder and cheek on the mat.',                     duration: 60 },
  { name: 'Thread the Needle',       side: 'Right side',  cue: 'Thread right arm through. Let gravity open the thoracic spine — soften into it.',                                      duration: 60 },
  { name: 'Low Lunge',               side: 'Left hip',    cue: 'Left foot forward, right knee on mat. Tuck pelvis, reach arms up. Breathe into the front of the right hip.',           duration: 90 },
  { name: 'Low Lunge',               side: 'Right hip',   cue: 'Right foot forward, left knee down. Same pelvic tuck. Let the hip slowly release over the full time.',                 duration: 90 },
  { name: 'Pigeon Pose',             side: 'Left hip',    cue: 'Left shin forward, right leg extended behind. Square the hips and slowly fold forward to deepen.',                     duration: 90 },
  { name: 'Pigeon Pose',             side: 'Right hip',   cue: 'Right shin forward. Allow the hip to fully release — soften the holding each exhale.',                                 duration: 90 },
  { name: 'Pyramid Pose',            side: 'Left leg',    cue: 'Step left foot forward, back heel down. Hinge over the straight front leg, keep the back long.',                       duration: 60 },
  { name: 'Pyramid Pose',            side: 'Right leg',   cue: 'Step right foot forward. Keep the front foot flexed and breathe into the hamstring.',                                  duration: 60 },
  { name: 'Supine Spinal Twist',     side: 'Left side',   cue: 'Lying on back, draw left knee across. Extend left arm out, gaze opposite. Breathe out tension.',                      duration: 60 },
  { name: 'Supine Spinal Twist',     side: 'Right side',  cue: 'Right knee crosses over. Keep the shoulder grounded. Match the range from the other side.',                           duration: 60 },
  { name: 'Eagle Arms',              side: 'Left on top', cue: 'Cross left arm over right, wrap and lift elbows. Feel the space between the shoulder blades open.',                   duration: 60 },
  { name: 'Eagle Arms',              side: 'Right on top',cue: 'Cross right arm over left. Lift elbows to shoulder height, breathe into the upper back.',                             duration: 60 },
  { name: "Child's Pose",            cue: 'Knees wide, big toes touching. Arms extended forward. Let the hips sink toward the heels and breathe deeply.',                               duration: 60 },
  { name: 'Savasana',                cue: 'Lie completely still. Close your eyes, soften every muscle. Let the nervous system integrate the work.',                                       duration: 120 },
]

const FULL_EXTRA_STEPS = [
  { name: 'Deep Squat Hold',   cue: 'Feet shoulder-width, toes angled out. Sit low, push knees wide with elbows. Stay active through the feet.',                                         duration: 90 },
  { name: 'Lizard Pose',       side: 'Left side',   cue: 'Left foot outside left hand. Drop the back knee down. Walk the front foot out to open the hip deeper.',                      duration: 90 },
  { name: 'Lizard Pose',       side: 'Right side',  cue: 'Right foot outside right hand. Lower the back knee. Breathe into the outer hip and inner groin.',                           duration: 90 },
  { name: 'Figure-4 Stretch',  side: 'Left glute',  cue: 'Cross left ankle over right knee, flex foot. Hinge forward or recline and pull toward you.',                                duration: 90 },
  { name: 'Figure-4 Stretch',  side: 'Right glute', cue: 'Same setup on the right. Focus on breathing into the outer glute and deep hip rotators.',                                   duration: 90 },
  { name: 'Forward Fold',      cue: 'Feet hip-width, soft knees. Fold from the hips, let the head hang heavy. Grab elbows and let gravity work.',                                       duration: 60 },
  { name: 'Thoracic Extension',cue: 'Foam roller (or rolled mat) across mid-back. Cradle the head, extend back over the roller. Move slowly segment by segment.',                       duration: 120 },
  { name: 'Couch Stretch',     side: 'Left side',   cue: 'Back foot elevated. Squeeze the glute and tuck the pelvis. Full 2 minutes — this is where the change happens.',             duration: 120 },
  { name: 'Couch Stretch',     side: 'Right side',  cue: 'Match the depth from the left side. Hold and breathe, resist the urge to come out early.',                                  duration: 120 },
  { name: 'Final Savasana',    cue: 'Full stillness. Integrate everything from the session. Let the nervous system shift into parasympathetic rest.',                                    duration: 180 },
]

const YOGA_SESSION_TYPES = [
  { id: 'morning',  label: 'Morning Stretch', mins: 10, detail: 'Gentle wake-up movement',        steps: MORNING_STEPS },
  { id: 'recovery', label: 'Recovery Flow',   mins: 20, detail: 'Sunday restoration protocol',    steps: RECOVERY_STEPS },
  { id: 'full',     label: 'Full Session',    mins: 30, detail: 'Deep flexibility & mobility work', steps: [...RECOVERY_STEPS, ...FULL_EXTRA_STEPS] },
]

const RECOVERY_GUIDE = [
  { name: 'Hip Flexor Openers', cue: 'Low lunge, back knee down. Hold 60–90s per side. Let hips sink forward, breathe into the front of the hip.' },
  { name: 'Thoracic Extension', cue: 'Foam roller perpendicular to spine, cradle head. Extend slowly over each thoracic segment. 10 extensions per level.' },
  { name: 'Hamstring Length',   cue: 'Seated forward fold or strap-assisted supine. Focus on posterior pelvic tilt — not just reaching. Hold 90s.' },
  { name: 'Shoulder Mobility',  cue: 'Band or PVC pass-throughs, arms straight. Move slowly through full overhead arc. 10 controlled reps.' },
  { name: 'Spinal Rotation',    cue: 'Supine knee drops each side. Exhale as you rotate, keep opposite shoulder grounded. Match range side to side.' },
]

function fmtTimer(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function GuidedSession({ steps, label, onComplete, onExit }) {
  const T = useT()
  const { pg } = makeS(T)

  const [stepIdx,  setStepIdx]  = useState(0)
  const [timeLeft, setTimeLeft] = useState(steps[0].duration)
  const [running,  setRunning]  = useState(false)
  const [started,  setStarted]  = useState(false)

  const totalDuration = useMemo(() => steps.reduce((s, x) => s + x.duration, 0), [steps])
  const elapsed = useMemo(() => {
    const prev = steps.slice(0, stepIdx).reduce((s, x) => s + x.duration, 0)
    return prev + (steps[stepIdx].duration - timeLeft)
  }, [stepIdx, timeLeft, steps])

  useEffect(() => {
    if (!running) return
    const id = setTimeout(() => {
      if (timeLeft <= 1) {
        const next = stepIdx + 1
        if (next >= steps.length) { setRunning(false); onComplete() }
        else { setStepIdx(next); setTimeLeft(steps[next].duration) }
      } else {
        setTimeLeft(t => t - 1)
      }
    }, 1000)
    return () => clearTimeout(id)
  }, [running, timeLeft, stepIdx, steps, onComplete])

  const toggle = () => { if (!started) setStarted(true); setRunning(r => !r) }
  const skip = () => {
    const next = stepIdx + 1
    if (next >= steps.length) { setRunning(false); onComplete() }
    else { setStepIdx(next); setTimeLeft(steps[next].duration) }
  }

  const step = steps[stepIdx]
  const nextStep = steps[stepIdx + 1]
  const progress = elapsed / totalDuration

  return (
    <div style={{ ...pg, display: 'flex', flexDirection: 'column' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={onExit} style={{ background: 'none', border: 'none', color: T.MUTED, cursor: 'pointer', padding: 0, display: 'flex', flexShrink: 0 }}>
          <IconX size={20} color={T.MUTED} />
        </button>
        <div style={{ flex: 1, background: T.SURF2, borderRadius: 6, height: 8, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress * 100}%`, background: YOGA_TINT, borderRadius: 6, transition: 'width 1s linear' }} />
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.MUTED, flexShrink: 0 }}>{stepIdx + 1} / {steps.length}</div>
      </div>

      {/* Step content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: 8, paddingBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: T.MUTED, letterSpacing: 1.2, marginBottom: 12 }}>{label.toUpperCase()}</div>

        <div style={{ fontSize: 26, fontWeight: 900, color: T.TEXT, letterSpacing: '-0.3px', lineHeight: 1.1, marginBottom: step.side ? 6 : 20 }}>{step.name}</div>
        {step.side && (
          <div style={{ fontSize: 14, fontWeight: 700, color: YOGA_TINT, marginBottom: 20, letterSpacing: 0.3 }}>{step.side}</div>
        )}

        {/* Countdown */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 80, fontWeight: 900, color: started ? YOGA_TINT : T.DIM, letterSpacing: '-3px', lineHeight: 1, fontVariantNumeric: 'tabular-nums', transition: 'color .3s' }}>
            {fmtTimer(timeLeft)}
          </div>
        </div>

        {/* Cue */}
        <div style={{ fontSize: 13, color: T.MUTED, lineHeight: 1.7, maxWidth: 290, marginBottom: 36 }}>{step.cue}</div>

        {/* Controls */}
        {!started ? (
          <button onClick={toggle} style={{ background: YOGA_TINT, color: '#fff', border: 'none', borderRadius: 18, padding: '18px 60px', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>
            Start Session
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={toggle} style={{ background: running ? T.SURF2 : YOGA_TINT, color: running ? T.TEXT : '#fff', border: `1px solid ${running ? T.BORDER : YOGA_TINT}`, borderRadius: 16, padding: '15px 36px', fontSize: 15, fontWeight: 800, cursor: 'pointer', minWidth: 140, transition: 'all .15s' }}>
              {running ? '⏸  Pause' : '▶  Resume'}
            </button>
            <button onClick={skip} style={{ background: 'none', color: T.MUTED, border: `1px solid ${T.BORDER}`, borderRadius: 16, padding: '15px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Skip →
            </button>
          </div>
        )}
      </div>

      {/* Up next */}
      {nextStep && started && (
        <div style={{ paddingTop: 16, borderTop: `1px solid ${T.BORDER}` }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: T.DIM, letterSpacing: 1.2, marginBottom: 7 }}>UP NEXT</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.MUTED }}>{nextStep.name}</span>
              {nextStep.side && <span style={{ fontSize: 12, color: T.DIM }}> · {nextStep.side}</span>}
            </div>
            <div style={{ fontSize: 12, color: T.DIM }}>{fmtTimer(nextStep.duration)}</div>
          </div>
        </div>
      )}
    </div>
  )
}

function YogaView({ onBack }) {
  const T = useT()
  const A = T.ACC
  const { pg, card, inp } = makeS(T)

  const [sessions,     setSessions]     = useState(() => lsLoad('yoga_log', []))
  const [sessionType,  setSessionType]  = useState(null)
  const [form,         setForm]         = useState({ duration: '', notes: '' })
  const [guideOpen,    setGuideOpen]    = useState(false)
  const [phase,        setPhase]        = useState('home') // 'home' | 'guide' | 'complete'
  const [completedType, setCompletedType] = useState(null)

  const selectType = t => { setSessionType(t); setForm(p => ({ ...p, duration: String(t.mins) })) }

  const saveLog = (type, duration, notes = '') => {
    const next = [{ id: Date.now(), date: todayKey(), type, duration, notes }, ...sessions]
    setSessions(next); lsSave('yoga_log', next)
  }

  const handleLogManual = () => {
    if (!form.duration) return
    saveLog(sessionType?.label || 'Custom', parseFloat(form.duration) || 0, form.notes.trim())
    setForm({ duration: '', notes: '' }); setSessionType(null)
  }

  const handleCompleteSession = () => {
    if (completedType) saveLog(completedType.label, completedType.mins)
    setPhase('home'); setCompletedType(null)
  }

  // Guided walkthrough
  if (phase === 'guide' && sessionType) {
    return (
      <GuidedSession
        steps={sessionType.steps}
        label={sessionType.label}
        onComplete={() => { setCompletedType(sessionType); setPhase('complete') }}
        onExit={() => setPhase('home')}
      />
    )
  }

  // Completion screen
  if (phase === 'complete') {
    return (
      <div style={{ ...pg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80dvh', textAlign: 'center' }}>
        <div style={{ width: 68, height: 68, borderRadius: '50%', background: `${YOGA_TINT}18`, border: `1px solid ${YOGA_TINT}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <IconCheck size={30} color={YOGA_TINT} />
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: T.TEXT, letterSpacing: '-0.5px', marginBottom: 6 }}>Session Complete</div>
        <div style={{ fontSize: 14, color: T.MUTED, marginBottom: 40 }}>{completedType?.label} · {completedType?.mins} min · {completedType?.steps.length} steps</div>
        <button onClick={handleCompleteSession} style={{ width: '100%', maxWidth: 310, background: YOGA_TINT, color: '#fff', border: 'none', borderRadius: 14, padding: '16px', fontSize: 15, fontWeight: 800, cursor: 'pointer', marginBottom: 12 }}>Log This Session</button>
        <button onClick={() => { setPhase('home'); setCompletedType(null) }} style={{ width: '100%', maxWidth: 310, background: 'none', color: T.MUTED, border: `1px solid ${T.BORDER}`, borderRadius: 14, padding: '15px', fontSize: 14, cursor: 'pointer' }}>Done Without Logging</button>
      </div>
    )
  }

  // Home screen
  const fmtDate = ds => new Date(ds + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const last5  = sessions.slice(0, 5)
  const secLbl = { fontSize: 10, color: T.MUTED, marginBottom: 8, fontWeight: 700, letterSpacing: 0.5 }

  return (
    <div style={pg}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.MUTED, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 5, marginBottom: 20, fontSize: 12, fontWeight: 600 }}>
        <IconBack size={15} color={T.MUTED} /> Train
      </button>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', color: T.TEXT, marginBottom: 4 }}>Yoga & Mobility</div>
        <div style={{ fontSize: 13, color: T.MUTED }}>Restore · Lengthen · Recover</div>
      </div>

      {/* Session type selector */}
      <div style={{ ...card, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.TEXT, marginBottom: 14 }}>Choose a Session</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {YOGA_SESSION_TYPES.map(t => (
            <button key={t.id} onClick={() => selectType(t)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 16, border: `1px solid ${sessionType?.id === t.id ? YOGA_TINT : T.BORDER}`, background: sessionType?.id === t.id ? `${YOGA_TINT}14` : 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'all .15s' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: sessionType?.id === t.id ? T.TEXT : T.MUTED }}>{t.label}</div>
                <div style={{ fontSize: 11, color: T.DIM, marginTop: 2 }}>{t.detail} · {t.steps.length} steps</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, color: sessionType?.id === t.id ? YOGA_TINT : T.DIM }}>{t.mins} min</div>
            </button>
          ))}
        </div>
      </div>

      {sessionType && (
        <button onClick={() => setPhase('guide')} style={{ width: '100%', background: YOGA_TINT, color: '#fff', border: 'none', borderRadius: 16, padding: '16px', fontSize: 15, fontWeight: 800, cursor: 'pointer', marginBottom: 24, letterSpacing: 0.3 }}>
          Start {sessionType.label}
        </button>
      )}
      {!sessionType && <div style={{ marginBottom: 24 }} />}

      {/* Manual log */}
      <div style={{ ...card, marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.TEXT, marginBottom: 14 }}>Log Manually</div>
        <div style={{ marginBottom: 12 }}>
          <div style={secLbl}>DURATION (MIN)</div>
          <input type="number" inputMode="numeric" placeholder="20" style={inp} value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={secLbl}>NOTES</div>
          <textarea placeholder="Areas you focused on, how the body felt..." style={{ ...inp, resize: 'none', height: 72, fontFamily: 'inherit' }} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
        </div>
        <button onClick={handleLogManual} style={{ width: '100%', background: `${YOGA_TINT}18`, color: YOGA_TINT, border: `1px solid ${YOGA_TINT}30`, borderRadius: 14, padding: '14px', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>Log Session</button>
      </div>

      {/* Reference guide */}
      <button onClick={() => setGuideOpen(o => !o)} style={{ width: '100%', background: guideOpen ? `${YOGA_TINT}18` : T.SURF2, border: `1px solid ${guideOpen ? YOGA_TINT : T.BORDER}`, borderRadius: 14, padding: '14px', fontSize: 13, fontWeight: 700, color: guideOpen ? YOGA_TINT : T.TEXT, cursor: 'pointer', marginBottom: guideOpen ? 10 : 24, transition: 'all .2s' }}>
        {guideOpen ? '▾  Sunday Recovery Reference' : '▸  Sunday Recovery Reference'}
      </button>
      {guideOpen && (
        <div style={{ ...card, marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: T.MUTED, marginBottom: 14, lineHeight: 1.5 }}>Five key movements every Sunday. Hold each for the prescribed time.</div>
          {RECOVERY_GUIDE.map((item, i) => (
            <div key={item.name} style={{ paddingTop: 14, paddingBottom: 14, borderBottom: i < RECOVERY_GUIDE.length - 1 ? `1px solid ${T.BORDER}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: `${YOGA_TINT}18`, border: `1px solid ${YOGA_TINT}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 900, color: YOGA_TINT }}>{i + 1}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.TEXT }}>{item.name}</div>
              </div>
              <div style={{ fontSize: 12, color: T.MUTED, lineHeight: 1.6, paddingLeft: 32 }}>{item.cue}</div>
            </div>
          ))}
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${T.BORDER}` }}>
            <div style={{ fontSize: 11, color: T.MUTED, marginBottom: 10 }}>Follow Along on YouTube</div>
            {['Patrick Beach', 'Tim Senesi'].map(name => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: `1px solid ${T.BORDER}` }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.TEXT }}>{name}</span>
                <span style={{ fontSize: 11, color: YOGA_TINT, fontWeight: 700 }}>YouTube →</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <SectionLabel>Recent Sessions</SectionLabel>
      {last5.length === 0 && <div style={{ textAlign: 'center', color: T.MUTED, fontSize: 13, padding: '28px 0' }}>No sessions logged yet. Start with the Recovery Flow.</div>}
      {last5.map(r => (
        <div key={r.id} style={{ ...card, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.TEXT }}>{fmtDate(r.date)}</div>
              <div style={{ fontSize: 11, color: YOGA_TINT, marginTop: 2, fontWeight: 600 }}>{r.type}</div>
              {r.notes && <div style={{ fontSize: 11, color: T.MUTED, marginTop: 3, maxWidth: 200 }}>{r.notes}</div>}
            </div>
            {r.duration > 0 && (
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: YOGA_TINT, letterSpacing: '-0.3px' }}>{r.duration}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: T.MUTED, marginLeft: 3 }}>min</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

const MODALITIES = [
  { id: 'lift', label: 'LIFT', Icon: IconTrain, tint: null,       available: true },
  { id: 'run',  label: 'RUN',  Icon: IconRun,   tint: '#D94F3A',  available: true },
  { id: 'bike', label: 'BIKE', Icon: IconBike,  tint: '#00C47A',  available: true },
  { id: 'swim', label: 'SWIM', Icon: IconSwim,  tint: '#2878C8',  available: true },
  { id: 'yoga', label: 'YOGA', Icon: IconYoga,  tint: '#7B5BB8',  available: true },
]

// ─── Train tab ────────────────────────────────────────────────────────────────
function SessionCard({ session, isToday, onTap }) {
  const T = useT()
  const A = T.ACC
  const { name, day, focus, badge, exercises } = session
  return (
    <div onClick={onTap} style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', marginBottom: 10, background: isToday ? `linear-gradient(110deg, ${A}10 0%, ${T.SURF} 55%)` : T.SURF, border: `1px solid ${isToday ? A + '40' : T.BORDER}`, boxShadow: isToday ? `0 0 28px ${A}12` : 'none', cursor: 'pointer' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: isToday ? A : T.DIM }} />
      <div style={{ padding: '18px 16px 18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 5 }}>
          <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.7px', lineHeight: 1, color: T.TEXT }}>{name}</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
            {isToday && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: A, background: `${A}18`, border: `1px solid ${A}40`, borderRadius: 5, padding: '3px 8px' }}>TODAY</span>}
            {badge && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: T.MUTED, border: `1px solid ${T.BORDER}`, borderRadius: 5, padding: '3px 8px' }}>{badge}</span>}
          </div>
        </div>
        <div style={{ fontSize: 13, color: T.MUTED, marginBottom: 14 }}>{focus}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: isToday ? 12 : 11, color: A, opacity: isToday ? 1 : 0.55, fontWeight: isToday ? 800 : 600, letterSpacing: 0.5 }}>{day.toUpperCase()}</span>
          {exercises > 0 && <span style={{ fontSize: 12, color: isToday ? A : T.MUTED, fontWeight: 600 }}>{exercises} exercises</span>}
        </div>
      </div>
    </div>
  )
}
function TrainTab({ modality, setModality }) {
  const T = useT()
  const A = T.ACC
  const { pg } = makeS(T)
  const dow = new Date().getDay()
  const [selected, setSelected] = useState(null)

  if (selected !== null) {
    return (
      <WorkoutDetailView
        session={SESSIONS[selected]}
        sessionKey={selected}
        onBack={() => setSelected(null)}
      />
    )
  }

  if (modality === 'lift') {
    return (
      <div style={pg}>
        <div style={{ marginBottom: 28 }}>
          <button onClick={() => setModality(null)} style={{ background: 'none', border: 'none', color: T.MUTED, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 5, marginBottom: 16, fontSize: 12, fontWeight: 600 }}>
            <IconBack size={15} color={T.MUTED} /> Train
          </button>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', color: T.TEXT, marginBottom: 4 }}>Lift</div>
          <div style={{ fontSize: 13, color: T.MUTED }}>Push · Pull · Legs — Weekly Split</div>
        </div>
        {[1, 2, 3, 4, 5, 6, 0].map(d => (
          <SessionCard key={d} session={SESSIONS[d]} isToday={d === dow} onTap={() => setSelected(d)} />
        ))}
      </div>
    )
  }

  if (modality === 'run')  return <RunView  onBack={() => setModality(null)} />
  if (modality === 'bike') return <BikeView onBack={() => setModality(null)} />
  if (modality === 'swim') return <SwimView onBack={() => setModality(null)} />
  if (modality === 'yoga') return <YogaView onBack={() => setModality(null)} />

  return (
    <div style={pg}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', color: T.TEXT, marginBottom: 4 }}>Train</div>
        <div style={{ fontSize: 13, color: T.MUTED }}>Choose your workout type</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {MODALITIES.map(mod => {
          const ic = mod.id === 'lift' ? A : mod.tint
          return (
            <button key={mod.id} onClick={() => setModality(mod.id)} style={{
              gridColumn: mod.id === 'yoga' ? 'span 2' : undefined,
              background: `linear-gradient(145deg, ${ic}1E 0%, ${T.SURF} 60%)`,
              border: `1px solid ${ic}40`,
              borderRadius: 24,
              padding: '24px 18px 22px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 16,
              textAlign: 'left',
            }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: `${ic}18`, border: `1px solid ${ic}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <mod.Icon size={26} color={ic} />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.3px', color: T.TEXT }}>{mod.label}</div>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.2, marginTop: 4, color: ic }}>READY</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Eat tab ──────────────────────────────────────────────────────────────────
const EMPTY_FORM = { name: '', calories: '', protein: '', carbs: '', fat: '' }
function EatTab({ meals, onAddMeal }) {
  const T = useT()
  const A = T.ACC
  const { pg, card, inp } = makeS(T)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const consumed = meals.reduce((acc, m) => ({ calories: acc.calories + (Number(m.calories) || 0), protein: acc.protein + (Number(m.protein) || 0), carbs: acc.carbs + (Number(m.carbs) || 0), fat: acc.fat + (Number(m.fat) || 0) }), { calories: 0, protein: 0, carbs: 0, fat: 0 })
  const f = key => ({ value: form[key], onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) })
  const handleSubmit = () => {
    if (!form.name.trim()) return
    onAddMeal({ id: Date.now(), name: form.name.trim(), calories: parseFloat(form.calories) || 0, protein: parseFloat(form.protein) || 0, carbs: parseFloat(form.carbs) || 0, fat: parseFloat(form.fat) || 0 })
    setForm(EMPTY_FORM); setShowForm(false)
  }
  return (
    <div style={pg}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', color: T.TEXT, marginBottom: 4 }}>Eat</div>
        <div style={{ fontSize: 13, color: T.MUTED }}>Daily targets · {TARGETS.calories} kcal</div>
      </div>
      <SectionLabel>Macros Today</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 28 }}>
        <MacroStat label="Calories" consumed={consumed.calories} target={TARGETS.calories} unit=" kcal" />
        <MacroStat label="Protein"  consumed={consumed.protein}  target={TARGETS.protein}  unit="g" />
        <MacroStat label="Carbs"    consumed={consumed.carbs}    target={TARGETS.carbs}    unit="g" />
        <MacroStat label="Fat"      consumed={consumed.fat}      target={TARGETS.fat}      unit="g" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <SectionLabel style={{ marginBottom: 0 }}>Meals Logged</SectionLabel>
        {!showForm && <button onClick={() => setShowForm(true)} style={{ background: A, color: '#fff', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>+ Add</button>}
      </div>
      {showForm && (
        <div style={{ ...card, marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.TEXT, marginBottom: 14 }}>Log a Meal</div>
          <input placeholder="Meal name" style={{ ...inp, marginBottom: 8 }} {...f('name')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            {[['calories', 'Calories (kcal)'], ['protein', 'Protein (g)'], ['carbs', 'Carbs (g)'], ['fat', 'Fat (g)']].map(([k, ph]) => (
              <input key={k} type="number" placeholder={ph} style={inp} {...f(k)} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSubmit} style={{ flex: 1, background: A, color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Save Meal</button>
            <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }} style={{ flex: 1, background: 'none', color: T.MUTED, border: `1px solid ${T.BORDER}`, borderRadius: 12, padding: '14px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
      {meals.length === 0 && !showForm && <div style={{ ...card, textAlign: 'center', padding: '32px 16px', color: T.MUTED, fontSize: 13 }}>No meals logged yet today.</div>}
      {meals.map(m => (
        <div key={m.id} style={{ ...card, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.TEXT }}>{m.name}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: A }}>{Math.round(m.calories)} kcal</div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[['P', m.protein], ['C', m.carbs], ['F', m.fat]].map(([l, v]) => (
              <div key={l} style={{ fontSize: 12, color: T.MUTED }}><span style={{ color: T.TEXT, fontWeight: 600 }}>{Math.round(v)}g</span> {l}</div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ marginTop: 36 }}>
        <SectionLabel>Daily Timing</SectionLabel>
        <div style={card}>
          {TIMING.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingBottom: i < TIMING.length - 1 ? 16 : 0, marginBottom: i < TIMING.length - 1 ? 16 : 0, borderBottom: i < TIMING.length - 1 ? `1px solid ${T.BORDER}` : 'none' }}>
              <IconDot size={8} color={t.protein ? A : T.DIM} />
              <div style={{ flex: 1, marginTop: -2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.TEXT }}>{t.meal}</div>
                  {t.protein && <div style={{ fontSize: 12, color: A, fontWeight: 700 }}>{t.protein}g P</div>}
                </div>
                <div style={{ fontSize: 11, color: T.MUTED, marginTop: 2 }}>{t.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <MealPrepSection onAddMeal={onAddMeal} />
    </div>
  )
}

// ─── Meal Prep ────────────────────────────────────────────────────────────────
const DEFAULT_TEMPLATES = [
  { id: 'dt1', name: 'Chicken Rice Bowl',          calories: 550, protein: 55, carbs: 65, fat: 8  },
  { id: 'dt2', name: 'Ground Turkey Sweet Potato',  calories: 470, protein: 45, carbs: 45, fat: 12 },
  { id: 'dt3', name: 'Protein Shake Banana',        calories: 240, protein: 25, carbs: 30, fat: 2  },
  { id: 'dt4', name: 'Cottage Cheese Almonds',      calories: 260, protein: 30, carbs: 10, fat: 12 },
  { id: 'dt5', name: 'Hotel Breakfast',             calories: 620, protein: 45, carbs: 60, fat: 22 },
]
const PREP_STEPS = [
  'Cook 6-7 cups rice',
  'Bake 4-5 lbs chicken breast',
  'Cook 1-2 lbs ground turkey',
  'Shred 2 rotisserie chickens',
  'Portion into containers',
]
const PLANNER_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TEMPLATE_INGREDIENTS = {
  'Chicken Rice Bowl':          [{ name: 'Chicken breast',   cat: 'Protein' }, { name: 'White rice',        cat: 'Carbs'       }, { name: 'Olive oil',    cat: 'Fats & Oils' }],
  'Ground Turkey Sweet Potato': [{ name: 'Ground turkey',    cat: 'Protein' }, { name: 'Sweet potatoes',    cat: 'Produce'     }, { name: 'Olive oil',    cat: 'Fats & Oils' }],
  'Protein Shake Banana':       [{ name: 'Protein powder',   cat: 'Protein' }, { name: 'Banana',            cat: 'Produce'     }, { name: 'Almond milk', cat: 'Fats & Oils' }],
  'Cottage Cheese Almonds':     [{ name: 'Cottage cheese',   cat: 'Protein' }, { name: 'Almonds',           cat: 'Fats & Oils' }],
  'Hotel Breakfast':            [{ name: 'Eggs',             cat: 'Protein' }, { name: 'Whole grain bread', cat: 'Carbs'       }, { name: 'Orange juice', cat: 'Produce'    }, { name: 'Butter', cat: 'Fats & Oils' }],
}

function getWeekSundayKey() {
  const d = new Date()
  d.setDate(d.getDate() - d.getDay())
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function MealPrepSection({ onAddMeal }) {
  const T = useT()
  const A = T.ACC
  const { card, inp } = makeS(T)

  const [templates, setTemplates] = useState(() => { const s = lsLoad('meal_templates', null); return s ?? DEFAULT_TEMPLATES })
  const [showTForm, setShowTForm] = useState(false)
  const [tForm, setTForm] = useState(EMPTY_FORM)

  const saveTemplate = () => {
    if (!tForm.name.trim()) return
    const next = [...templates, { id: `t${Date.now()}`, name: tForm.name.trim(), calories: parseFloat(tForm.calories)||0, protein: parseFloat(tForm.protein)||0, carbs: parseFloat(tForm.carbs)||0, fat: parseFloat(tForm.fat)||0 }]
    setTemplates(next); lsSave('meal_templates', next)
    setTForm(EMPTY_FORM); setShowTForm(false)
  }
  const deleteTemplate = id => { const next = templates.filter(t => t.id !== id); setTemplates(next); lsSave('meal_templates', next) }

  const [weeklyPlan, setWeeklyPlan] = useState(() => lsLoad('weekly_plan', {}))
  const [openDay, setOpenDay] = useState(null)
  const [planForm, setPlanForm] = useState(EMPTY_FORM)

  const addToPlan = (di, meal) => {
    const next = { ...weeklyPlan, [di]: [...(weeklyPlan[di] || []), { ...meal, pid: Date.now() }] }
    setWeeklyPlan(next); lsSave('weekly_plan', next)
  }
  const removeFromPlan = (di, pid) => {
    const next = { ...weeklyPlan, [di]: (weeklyPlan[di] || []).filter(m => m.pid !== pid) }
    setWeeklyPlan(next); lsSave('weekly_plan', next)
  }
  const addPlanManual = () => {
    if (!planForm.name.trim() || openDay === null) return
    addToPlan(openDay, { name: planForm.name.trim(), calories: parseFloat(planForm.calories)||0, protein: parseFloat(planForm.protein)||0, carbs: parseFloat(planForm.carbs)||0, fat: parseFloat(planForm.fat)||0 })
    setPlanForm(EMPTY_FORM)
  }
  const dayTotals = di => (weeklyPlan[di] || []).reduce((a, m) => ({ cal: a.cal + (m.calories||0), pro: a.pro + (m.protein||0) }), { cal: 0, pro: 0 })

  const weekKey = getWeekSundayKey()
  const [checklist, setChecklist] = useState(() => lsLoad(`prep_checklist_${weekKey}`, {}))
  const toggleCheck = i => { const next = { ...checklist, [i]: !checklist[i] }; setChecklist(next); lsSave(`prep_checklist_${weekKey}`, next) }

  const [showShopping, setShowShopping] = useState(false)
  const shoppingList = useMemo(() => {
    const seen = new Set()
    const grouped = {}
    for (const dayMeals of Object.values(weeklyPlan)) {
      for (const meal of (dayMeals || [])) {
        for (const { name, cat } of (TEMPLATE_INGREDIENTS[meal.name] || [])) {
          if (!seen.has(name)) { seen.add(name); if (!grouped[cat]) grouped[cat] = []; grouped[cat].push(name) }
        }
      }
    }
    return grouped
  }, [weeklyPlan, showShopping])
  const hasItems = Object.keys(shoppingList).length > 0

  const secHead = { fontSize: 11, fontWeight: 800, color: T.MUTED, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }

  return (
    <div style={{ marginTop: 36 }}>
      <SectionLabel>Meal Prep</SectionLabel>

      {/* Meal Templates */}
      <div style={{ ...card, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: templates.length > 0 ? 12 : 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.TEXT }}>Meal Templates</div>
          {!showTForm && <button onClick={() => setShowTForm(true)} style={{ background: 'none', border: `1px solid ${T.BORDER}`, borderRadius: 10, padding: '7px 14px', fontSize: 11, fontWeight: 700, color: T.MUTED, cursor: 'pointer' }}>+ New</button>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {templates.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => onAddMeal({ id: Date.now(), ...t })} style={{ flex: 1, background: `${A}10`, border: `1px solid ${A}28`, borderRadius: 14, padding: '12px 14px', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.TEXT }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: T.MUTED, marginTop: 2 }}>{t.calories} kcal · {t.protein}g P · {t.carbs}g C · {t.fat}g F</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: A, marginLeft: 10, flexShrink: 0 }}>+ Add</div>
              </button>
              <button onClick={() => deleteTemplate(t.id)} style={{ background: 'none', border: 'none', color: T.DIM, cursor: 'pointer', fontSize: 20, padding: '2px 6px', lineHeight: 1 }}>×</button>
            </div>
          ))}
        </div>
        {showTForm && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.BORDER}` }}>
            <input placeholder="Template name" style={{ ...inp, marginBottom: 8 }} value={tForm.name} onChange={e => setTForm(p => ({ ...p, name: e.target.value }))} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              {[['calories','Calories (kcal)'],['protein','Protein (g)'],['carbs','Carbs (g)'],['fat','Fat (g)']].map(([k, ph]) => (
                <input key={k} type="number" placeholder={ph} style={inp} value={tForm[k]} onChange={e => setTForm(p => ({ ...p, [k]: e.target.value }))} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={saveTemplate} style={{ flex: 1, background: A, color: '#fff', border: 'none', borderRadius: 12, padding: '12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Save Template</button>
              <button onClick={() => { setShowTForm(false); setTForm(EMPTY_FORM) }} style={{ flex: 1, background: 'none', color: T.MUTED, border: `1px solid ${T.BORDER}`, borderRadius: 12, padding: '12px', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Weekly Planner */}
      <div style={{ ...card, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.TEXT, marginBottom: 14 }}>Weekly Planner</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
          {PLANNER_DAYS.map((day, di) => {
            const { cal, pro } = dayTotals(di)
            const hasMeals = (weeklyPlan[di] || []).length > 0
            return (
              <button key={day} onClick={() => setOpenDay(di)} style={{ background: hasMeals ? `${A}12` : T.SURF2, border: `1px solid ${hasMeals ? `${A}30` : T.BORDER}`, borderRadius: 14, padding: '10px 3px', cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: T.MUTED, letterSpacing: 0.3 }}>{day}</div>
                {hasMeals ? (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 800, color: A, lineHeight: 1 }}>{cal}</div>
                    <div style={{ fontSize: 9, color: T.MUTED }}>{pro}g P</div>
                  </>
                ) : (
                  <div style={{ fontSize: 15, color: T.DIM, lineHeight: 1 }}>+</div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Day planner modal */}
      {openDay !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }} onClick={() => { setOpenDay(null); setPlanForm(EMPTY_FORM) }}>
          <div style={{ background: T.SURF, width: '100%', maxWidth: 430, maxHeight: '82dvh', borderRadius: '24px 24px 0 0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '16px 20px 12px', borderBottom: `1px solid ${T.BORDER}`, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <button onClick={() => { setOpenDay(null); setPlanForm(EMPTY_FORM) }} style={{ background: 'none', border: 'none', color: T.MUTED, cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
                <IconBack size={20} color={T.MUTED} />
              </button>
              <div style={{ flex: 1, fontSize: 15, fontWeight: 800, color: T.TEXT }}>{PLANNER_DAYS[openDay]}</div>
              {dayTotals(openDay).cal > 0 && <div style={{ fontSize: 12, fontWeight: 700, color: A }}>{dayTotals(openDay).cal} kcal · {dayTotals(openDay).pro}g P</div>}
            </div>
            <div style={{ overflowY: 'auto', padding: '16px 20px 32px' }}>
              <div style={secHead}>Quick Add from Templates</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 22 }}>
                {templates.map(t => (
                  <button key={t.id} onClick={() => addToPlan(openDay, t)} style={{ background: T.SURF2, border: `1px solid ${T.BORDER}`, borderRadius: 14, padding: '12px 16px', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.TEXT }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: T.MUTED, marginTop: 1 }}>{t.calories} kcal · {t.protein}g P</div>
                    </div>
                    <div style={{ fontSize: 18, color: A, fontWeight: 800 }}>+</div>
                  </button>
                ))}
              </div>
              <div style={secHead}>Manual Entry</div>
              <div style={{ marginBottom: 22 }}>
                <input placeholder="Meal name" style={{ ...inp, marginBottom: 8 }} value={planForm.name} onChange={e => setPlanForm(p => ({ ...p, name: e.target.value }))} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  {[['calories','Calories (kcal)'],['protein','Protein (g)'],['carbs','Carbs (g)'],['fat','Fat (g)']].map(([k, ph]) => (
                    <input key={k} type="number" placeholder={ph} style={inp} value={planForm[k]} onChange={e => setPlanForm(p => ({ ...p, [k]: e.target.value }))} />
                  ))}
                </div>
                <button onClick={addPlanManual} style={{ width: '100%', background: A, color: '#fff', border: 'none', borderRadius: 12, padding: '12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Add to {PLANNER_DAYS[openDay]}</button>
              </div>
              {(weeklyPlan[openDay] || []).length > 0 && (
                <>
                  <div style={secHead}>Planned ({(weeklyPlan[openDay] || []).length})</div>
                  {(weeklyPlan[openDay] || []).map(m => (
                    <div key={m.pid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${T.BORDER}` }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: T.TEXT }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: T.MUTED, marginTop: 2 }}>{m.calories} kcal · {m.protein}g P · {m.carbs}g C · {m.fat}g F</div>
                      </div>
                      <button onClick={() => removeFromPlan(openDay, m.pid)} style={{ background: 'none', border: 'none', color: T.DIM, cursor: 'pointer', fontSize: 20, padding: '4px 6px', lineHeight: 1 }}>×</button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sunday Prep Checklist */}
      <div style={{ ...card, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.TEXT, marginBottom: 14 }}>Sunday Prep Checklist</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {PREP_STEPS.map((step, i) => (
            <button key={i} onClick={() => toggleCheck(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: i < PREP_STEPS.length - 1 ? `1px solid ${T.BORDER}` : 'none' }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${checklist[i] ? A : T.BORDER}`, background: checklist[i] ? A : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s' }}>
                {checklist[i] && <span style={{ color: '#000', fontSize: 13, fontWeight: 900, lineHeight: 1 }}>✓</span>}
              </div>
              <span style={{ fontSize: 13, color: checklist[i] ? T.MUTED : T.TEXT, textDecoration: checklist[i] ? 'line-through' : 'none', transition: 'all .15s' }}>{step}</span>
            </button>
          ))}
        </div>
        <div style={{ fontSize: 10, color: T.DIM, marginTop: 10 }}>Resets every Sunday</div>
      </div>

      {/* Shopping List */}
      <button onClick={() => setShowShopping(s => !s)} style={{ width: '100%', background: showShopping ? `${A}18` : T.SURF2, border: `1px solid ${showShopping ? A : T.BORDER}`, borderRadius: 12, padding: '13px', fontSize: 13, fontWeight: 700, color: showShopping ? A : T.TEXT, cursor: 'pointer', marginBottom: showShopping ? 10 : 0, transition: 'all .2s' }}>
        {showShopping ? '▾  Shopping List' : '▸  Generate Shopping List'}
      </button>
      {showShopping && (
        <div style={card}>
          {!hasItems ? (
            <div style={{ textAlign: 'center', color: T.MUTED, fontSize: 13, padding: '16px 0' }}>Add meals to your weekly planner to generate a list.</div>
          ) : (
            ['Protein', 'Carbs', 'Produce', 'Fats & Oils'].map(cat => shoppingList[cat]?.length ? (
              <div key={cat} style={{ marginBottom: 18 }}>
                <div style={{ ...secHead, marginBottom: 8 }}>{cat}</div>
                {shoppingList[cat].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: `1px solid ${T.BORDER}` }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: A, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: T.TEXT }}>{item}</span>
                  </div>
                ))}
              </div>
            ) : null)
          )}
        </div>
      )}
    </div>
  )
}

// ─── History helpers ──────────────────────────────────────────────────────────
function calDays(year, month) {
  const first = new Date(year, month, 1).getDay()
  const total = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < first; i++) cells.push(null)
  for (let d = 1; d <= total; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function makeDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function loadDayData(ds) {
  return {
    daily: lsLoad(`daily_${ds}`, {}),
    meals: lsLoad(`meals_${ds}`, []),
    lifts: lsLoad(`lifts_${ds}`, {}),
    notes: lsLoad(`notes_${ds}`, ''),
  }
}

function hasDataOnDate(ds) {
  const { daily, meals, lifts } = loadDayData(ds)
  if (meals.length > 0) return true
  if (Object.keys(lifts).length > 0) return true
  if (daily.weight || daily.hrv || (daily.cardio && daily.cardio.length > 0)) return true
  return false
}

function getDaySummary(ds) {
  const { daily, meals, lifts } = loadDayData(ds)
  const dow = new Date(ds + 'T12:00:00').getDay()
  const session = SESSIONS[dow]?.name || ''
  let totalSets = 0
  for (const sets of Object.values(lifts)) {
    totalSets += (sets || []).filter(s => s.logged).length
  }
  const totalCal = meals.reduce((s, m) => s + (parseFloat(m.calories) || 0), 0)
  const cardios = (daily.cardio || [])
  return { session, totalSets, totalCal: Math.round(totalCal), cardios, weight: daily.weight, hrv: daily.hrv }
}

function DayDetailModal({ ds, onClose }) {
  const T = useT()
  const A = T.ACC
  const { daily, meals, lifts, notes } = loadDayData(ds)
  const dow = new Date(ds + 'T12:00:00').getDay()
  const sessionMeta = SESSIONS[dow]
  const sessionExs = SESSION_EXERCISES[dow] || []

  const totalProt = meals.reduce((s, m) => s + (parseFloat(m.protein) || 0), 0)
  const totalCarb = meals.reduce((s, m) => s + (parseFloat(m.carbs) || 0), 0)
  const totalFat  = meals.reduce((s, m) => s + (parseFloat(m.fat) || 0), 0)
  const totalCal  = meals.reduce((s, m) => s + (parseFloat(m.calories) || 0), 0)

  const displayDate = new Date(ds + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const row = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, paddingBottom: 10, borderBottom: `1px solid ${T.BORDER}` }
  const secLabel = { fontSize: 11, fontWeight: 800, color: T.MUTED, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10, marginTop: 20 }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div style={{ background: T.SURF, width: '100%', maxWidth: 430, maxHeight: '90dvh', borderRadius: '24px 24px 0 0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '16px 20px 12px', borderBottom: `1px solid ${T.BORDER}`, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.MUTED, cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            <IconBack size={20} color={T.MUTED} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: T.TEXT }}>{displayDate}</div>
            {sessionMeta && <div style={{ fontSize: 11, color: T.MUTED, marginTop: 1 }}>{sessionMeta.name} · {sessionMeta.focus}</div>}
          </div>
          {sessionMeta?.badge && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, color: A, background: `${A}15`, borderRadius: 6, padding: '3px 8px' }}>{sessionMeta.badge}</span>}
        </div>
        <div style={{ overflowY: 'auto', padding: '0 20px 32px' }}>
          {(daily.weight || daily.hrv) && (
            <div>
              <div style={secLabel}>Body</div>
              {daily.weight && <div style={row}><span style={{ fontSize: 13, color: T.MUTED }}>Bodyweight</span><span style={{ fontSize: 14, fontWeight: 700, color: T.TEXT }}>{daily.weight} lbs</span></div>}
              {daily.hrv && <div style={row}><span style={{ fontSize: 13, color: T.MUTED }}>HRV Status</span><span style={{ fontSize: 14, fontWeight: 700, color: T.TEXT, textTransform: 'capitalize' }}>{daily.hrv}</span></div>}
            </div>
          )}

          {sessionExs.length > 0 && Object.keys(lifts).length > 0 && (
            <div>
              <div style={secLabel}>Workout</div>
              {sessionExs.map(ex => {
                const sets = (lifts[ex.name] || []).filter(s => s.logged)
                if (!sets.length) return null
                return (
                  <div key={ex.name} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.TEXT, marginBottom: 6 }}>{ex.name}</div>
                    {sets.map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: T.MUTED, width: 22 }}>S{i + 1}</span>
                        <span style={{ fontSize: 12, color: T.TEXT }}>{s.weight ? `${s.weight} lbs` : '—'}</span>
                        <span style={{ fontSize: 12, color: T.MUTED }}>×</span>
                        <span style={{ fontSize: 12, color: T.TEXT }}>{s.reps ? `${s.reps} reps` : '—'}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          )}

          {(daily.cardio || []).length > 0 && (
            <div>
              <div style={secLabel}>Cardio</div>
              {daily.cardio.map((c, i) => (
                <div key={i} style={row}>
                  <span style={{ fontSize: 13, color: T.MUTED }}>{c.type}</span>
                  <span style={{ fontSize: 13, color: T.TEXT }}>{c.duration} min{c.zone ? ` · Zone ${c.zone}` : ''}</span>
                </div>
              ))}
            </div>
          )}

          {meals.length > 0 && (
            <div>
              <div style={secLabel}>Nutrition</div>
              {meals.map((m, i) => (
                <div key={i} style={{ ...row, flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.TEXT }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: T.MUTED }}>{m.calories} kcal · {m.protein}g P · {m.carbs}g C · {m.fat}g F</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, padding: '10px 0', borderTop: `1px solid ${T.BORDER}` }}>
                {[['Calories', `${Math.round(totalCal)}`], ['Protein', `${Math.round(totalProt)}g`], ['Carbs', `${Math.round(totalCarb)}g`], ['Fat', `${Math.round(totalFat)}g`]].map(([l, v]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: A }}>{v}</div>
                    <div style={{ fontSize: 10, color: T.MUTED, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {notes && (
            <div>
              <div style={secLabel}>Recovery Notes</div>
              <div style={{ fontSize: 13, color: T.TEXT, lineHeight: 1.6, paddingTop: 4 }}>{notes}</div>
            </div>
          )}

          {!daily.weight && !daily.hrv && Object.keys(lifts).length === 0 && meals.length === 0 && !notes && (
            <div style={{ paddingTop: 40, textAlign: 'center', color: T.MUTED, fontSize: 13 }}>No data logged for this day.</div>
          )}
        </div>
      </div>
    </div>
  )
}

function HistorySection() {
  const T = useT()
  const A = T.ACC
  const today = new Date()
  const [view, setView] = useState('calendar')
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(null)

  const todayYear = today.getFullYear()
  const todayMonth = today.getMonth()
  const isCurrentMonth = calYear === todayYear && calMonth === todayMonth

  const cells = useMemo(() => calDays(calYear, calMonth), [calYear, calMonth])

  const dotDays = useMemo(() => {
    const set = new Set()
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = makeDateStr(calYear, calMonth, d)
      if (hasDataOnDate(ds)) set.add(d)
    }
    return set
  }, [calYear, calMonth])

  const last30 = useMemo(() => {
    const days = []
    for (let i = 0; i < 30; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const ds = makeDateStr(d.getFullYear(), d.getMonth(), d.getDate())
      if (hasDataOnDate(ds)) days.push(ds)
    }
    return days
  }, [])

  const hasAnyData = last30.length > 0 || dotDays.size > 0

  const monthName = new Date(calYear, calMonth, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) }
    else setCalMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (isCurrentMonth) return
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) }
    else setCalMonth(m => m + 1)
  }

  return (
    <div style={{ marginTop: 28, marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <SectionLabel>History</SectionLabel>
        <div style={{ display: 'flex', background: T.SURF2, borderRadius: 14, padding: 4, gap: 3 }}>
          {['calendar', 'list'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ fontSize: 11, fontWeight: 700, padding: '6px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', background: view === v ? A : 'transparent', color: view === v ? '#fff' : T.MUTED, transition: 'all .2s', textTransform: 'capitalize' }}>{v}</button>
          ))}
        </div>
      </div>

      {!hasAnyData && (
        <div style={{ textAlign: 'center', color: T.MUTED, fontSize: 13, padding: '32px 0' }}>Start logging to build your history.</div>
      )}

      {hasAnyData && view === 'calendar' && (
        <div style={{ background: T.SURF, borderRadius: 22, padding: '18px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: T.MUTED, cursor: 'pointer', fontSize: 18, padding: '0 6px', lineHeight: 1 }}>‹</button>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.TEXT }}>{monthName}</div>
            <button onClick={nextMonth} style={{ background: 'none', border: 'none', color: isCurrentMonth ? T.DIM : T.MUTED, cursor: isCurrentMonth ? 'default' : 'pointer', fontSize: 18, padding: '0 6px', lineHeight: 1 }}>›</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
            {dayLabels.map(l => <div key={l} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: T.MUTED, padding: '2px 0' }}>{l}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {cells.map((d, i) => {
              if (!d) return <div key={`e${i}`} />
              const ds = makeDateStr(calYear, calMonth, d)
              const hasDot = dotDays.has(d)
              const isFuture = ds > todayKey()
              const isToday = ds === todayKey()
              return (
                <div key={d} onClick={() => hasDot && setSelectedDay(ds)} style={{ textAlign: 'center', padding: '6px 2px', borderRadius: 8, cursor: hasDot ? 'pointer' : 'default', background: isToday ? `${A}18` : 'transparent', opacity: isFuture ? 0.3 : 1 }}>
                  <div style={{ fontSize: 12, fontWeight: isToday ? 800 : 500, color: isToday ? A : T.TEXT }}>{d}</div>
                  <div style={{ height: 5, display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    {hasDot && <div style={{ width: 4, height: 4, borderRadius: '50%', background: A }} />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {hasAnyData && view === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {last30.length === 0 && <div style={{ textAlign: 'center', color: T.MUTED, fontSize: 13, padding: '32px 0' }}>Start logging to build your history.</div>}
          {last30.map(ds => {
            const { session, totalSets, totalCal, cardios, weight } = getDaySummary(ds)
            const label = new Date(ds + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
            return (
              <div key={ds} onClick={() => setSelectedDay(ds)} style={{ background: T.SURF, borderRadius: 18, padding: '14px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: T.TEXT }}>{label}</div>
                  <div style={{ fontSize: 11, color: T.MUTED, marginTop: 3 }}>
                    {session && <span>{session}</span>}
                    {totalSets > 0 && <span style={{ marginLeft: session ? 8 : 0 }}>{totalSets} sets</span>}
                    {totalCal > 0 && <span style={{ marginLeft: 8 }}>{totalCal} kcal</span>}
                    {cardios.length > 0 && <span style={{ marginLeft: 8 }}>{cardios[0].type}</span>}
                    {weight && <span style={{ marginLeft: 8 }}>{weight} lbs</span>}
                  </div>
                </div>
                <div style={{ color: T.DIM, fontSize: 16 }}>›</div>
              </div>
            )
          })}
        </div>
      )}

      {selectedDay && <DayDetailModal ds={selectedDay} onClose={() => setSelectedDay(null)} />}
    </div>
  )
}

// ─── Log tab ──────────────────────────────────────────────────────────────────
function PillBtn({ active, color, onClick, children }) {
  const T = useT()
  const A = T.ACC
  return (
    <button onClick={onClick} style={{ flex: 1, border: `1px solid ${active ? color : T.BORDER}`, borderRadius: 12, padding: '13px 6px', background: active ? `${color}20` : 'transparent', color: active ? color : T.MUTED, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      {children}
    </button>
  )
}

function ThemeToggle() {
  const T = useT()
  const A = T.ACC
  const { mode, toggle } = useMode()
  const isDark = mode === 'dark'
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, paddingTop: 32, paddingBottom: 4 }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: !isDark ? A : T.MUTED, transition: 'color .25s' }}>LIGHT</span>
      <button
        onClick={toggle}
        aria-label="Toggle theme"
        style={{ width: 52, height: 28, borderRadius: 14, background: T.SURF2, border: `1px solid ${T.BORDER}`, position: 'relative', cursor: 'pointer', padding: 0, transition: 'background .25s, border-color .25s' }}
      >
        <div style={{
          width: 20, height: 20, borderRadius: '50%',
          background: A,
          position: 'absolute', top: 3,
          left: isDark ? 27 : 4,
          transition: 'left .25s cubic-bezier(.4,0,.2,1)',
          boxShadow: `0 0 10px ${A}70`,
        }} />
      </button>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: isDark ? A : T.MUTED, transition: 'color .25s' }}>DARK</span>
    </div>
  )
}

function LogTab() {
  const T = useT()
  const A = T.ACC
  const { pg, card, inp } = makeS(T)
  const today = todayKey()
  const [weight, setWeight]   = useState('')
  const [hrv, setHrv]         = useState(null)
  const [cardios, setCardios] = useState([])
  const [cardioForm, setCardioForm] = useState({ type: 'run', duration: '', zone: 2 })
  const [showCardioForm, setShowCardioForm] = useState(false)
  const [saved, setSaved]     = useState(false)
  const [allLogs, setAllLogs] = useState([])
  const [weeklyBars, setWeeklyBars] = useState([])
  const [selectedEx, setSelectedEx] = useState(LIFT_EXERCISES[0])
  useEffect(() => {
    const log = lsLoad(`daily_${today}`, {})
    setWeight(log.weight ?? ''); setHrv(log.hrv ?? null); setCardios(log.cardio ?? [])
    refresh()
  }, []) // eslint-disable-line
  function refresh() { setAllLogs(loadAllDailyLogs()); setWeeklyBars(computeWeeklyBars()) }
  const handleSave = () => {
    lsSave(`daily_${today}`, { weight, hrv, cardio: cardios })
    refresh(); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }
  const addCardio = () => {
    if (!cardioForm.duration) return
    setCardios(prev => [...prev, { ...cardioForm, duration: Number(cardioForm.duration) }])
    setCardioForm({ type: 'run', duration: '', zone: 2 }); setShowCardioForm(false)
  }
  const streak        = computeStreak(allLogs)
  const totalWorkouts = allLogs.filter(l => l.weight || l.hrv || l.cardio?.length).length
  const totalMiles    = Math.round(allLogs.reduce((s, l) => s + (l.cardio || []).reduce((a, c) => a + (Number(c.duration) || 0) * (MILES_PER_MIN[c.type] || 0), 0), 0))
  const weeklyMins    = weeklyBars.reduce((s, d) => s + d.mins, 0)
  const weeklyHrvAvg  = (() => {
    const sc = weeklyBars.filter(d => d.hrv).map(d => ({ green: 3, orange: 2, red: 1 }[d.hrv] ?? 0))
    if (!sc.length) return null
    const avg = sc.reduce((a, b) => a + b, 0) / sc.length
    return avg >= 2.5 ? 'Ready' : avg >= 1.5 ? 'Moderate' : 'Low'
  })()
  const HRV_COLOR = { Ready: '#30D158', Moderate: '#FF9F0A', Low: '#FF453A' }
  const bwData    = computeBodyweightData(allLogs)
  const liftData  = computeLiftData(selectedEx)
  const analytics = computeAnalytics()
  return (
    <div style={pg}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', color: T.TEXT, marginBottom: 4 }}>Log</div>
        <div style={{ fontSize: 13, color: T.MUTED }}>Daily check-in & analytics</div>
      </div>
      <SectionLabel>Daily Log</SectionLabel>
      <div style={{ ...card, marginBottom: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: T.MUTED, fontWeight: 600, marginBottom: 8 }}>Body Weight (kg)</div>
          <input type="number" inputMode="decimal" placeholder="e.g. 82.5" value={weight} onChange={e => setWeight(e.target.value)} style={{ ...inp, fontSize: 20, fontWeight: 700, padding: '12px 14px' }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: T.MUTED, fontWeight: 600, marginBottom: 10 }}>HRV Status</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ key: 'green', label: 'Ready', color: '#30D158' }, { key: 'orange', label: 'Moderate', color: '#FF9F0A' }, { key: 'red', label: 'Low', color: '#FF453A' }].map(o => (
              <PillBtn key={o.key} active={hrv === o.key} color={o.color} onClick={() => setHrv(hrv === o.key ? null : o.key)}>
                <IconDot size={8} color={hrv === o.key ? o.color : T.MUTED} />{o.label}
              </PillBtn>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: T.MUTED, fontWeight: 600, marginBottom: 10 }}>Cardio Sessions</div>
          {cardios.map((c, i) => {
            const CI = CARDIO_ICONS[c.type] || IconRun
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: T.SURF2, borderRadius: 10, padding: '10px 14px', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CI size={18} color={A} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.TEXT, textTransform: 'capitalize' }}>{c.type}</div>
                    <div style={{ fontSize: 11, color: T.MUTED }}>{c.duration} min · Zone {c.zone}</div>
                  </div>
                </div>
                <button onClick={() => setCardios(cardios.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }}><IconX size={16} color={T.MUTED} /></button>
              </div>
            )
          })}
          {showCardioForm ? (
            <div style={{ background: T.SURF2, borderRadius: 12, padding: '14px 12px', marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                {['run', 'bike', 'swim'].map(t => { const CI = CARDIO_ICONS[t]; return (
                  <PillBtn key={t} active={cardioForm.type === t} color={A} onClick={() => setCardioForm(f => ({ ...f, type: t }))}>
                    <CI size={14} color={cardioForm.type === t ? A : T.MUTED} />{t.charAt(0).toUpperCase() + t.slice(1)}
                  </PillBtn>
                )})}
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <input type="number" inputMode="numeric" placeholder="Duration (min)" value={cardioForm.duration} onChange={e => setCardioForm(f => ({ ...f, duration: e.target.value }))} style={{ ...inp, flex: 1 }} />
                <select value={cardioForm.zone} onChange={e => setCardioForm(f => ({ ...f, zone: Number(e.target.value) }))} style={{ ...inp, flex: 1 }}>
                  {[1,2,3,4,5].map(z => <option key={z} value={z}>Zone {z}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={addCardio} style={{ flex: 1, background: A, color: '#fff', border: 'none', borderRadius: 12, padding: '12px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Add</button>
                <button onClick={() => setShowCardioForm(false)} style={{ flex: 1, background: 'none', border: `1px solid ${T.BORDER}`, color: T.MUTED, borderRadius: 12, padding: '12px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowCardioForm(true)} style={{ width: '100%', background: 'none', border: `1px dashed ${T.BORDER}`, borderRadius: 12, color: T.MUTED, padding: '14px', fontSize: 13, cursor: 'pointer' }}>+ Add Cardio Session</button>
          )}
        </div>
        <button onClick={handleSave} style={{ width: '100%', marginTop: 20, background: saved ? `${A}20` : A, color: saved ? A : '#fff', border: saved ? `1px solid ${A}50` : 'none', borderRadius: 14, padding: '15px', fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'all .2s' }}>
          {saved ? 'Saved' : 'Save Log'}
        </button>
      </div>

      <SectionLabel>This Week</SectionLabel>
      <div style={{ ...card, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          {weeklyBars.map((d, i) => {
            const hc = d.hrv ? HRV_COLOR[{ green: 'Ready', orange: 'Moderate', red: 'Low' }[d.hrv]] : null
            const isToday = i === 6
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: d.hasLog ? (hc ? `${hc}22` : `${A}18`) : T.SURF2, border: `2px solid ${d.hasLog ? (hc || A) : (isToday ? T.MUTED : T.BORDER)}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {d.hasLog && (d.mins > 0 ? <IconCheck size={14} color={hc || A} /> : <IconDot size={5} color={hc || A} />)}
                </div>
                <span style={{ fontSize: 10, color: isToday ? T.TEXT : T.MUTED, fontWeight: isToday ? 700 : 400 }}>{d.day.slice(0, 2).toUpperCase()}</span>
              </div>
            )
          })}
        </div>
        <div style={{ height: 100, marginBottom: 16 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyBars} barCategoryGap="30%">
              <XAxis dataKey="day" tick={{ fill: T.MUTED, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: `${A}08` }} />
              <Bar dataKey="mins" name="min" fill={A} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { label: 'Cardio', value: `${weeklyMins}`, sub: 'min this week' },
            { label: 'Sessions', value: `${weeklyBars.filter(d => d.hasLog).length}`, sub: 'days logged' },
            { label: 'Avg HRV', value: weeklyHrvAvg || '—', sub: weeklyHrvAvg ? 'status' : 'no data', color: weeklyHrvAvg ? HRV_COLOR[weeklyHrvAvg] : T.MUTED },
          ].map(s => (
            <div key={s.label} style={{ background: T.SURF2, borderRadius: 10, padding: '12px 10px' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: s.color || T.TEXT, letterSpacing: '-0.3px' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: T.MUTED, marginTop: 3 }}>{s.sub}</div>
              <div style={{ fontSize: 10, color: T.DIM, marginTop: 2, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <SectionLabel>All Time</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
          <StatCard label="Workouts" value={totalWorkouts} />
          <StatCard label="Miles" value={totalMiles} />
          <StatCard label="Streak" value={streak} sub={streak > 0 ? `day${streak !== 1 ? 's' : ''}` : null} />
        </div>
        <div style={{ ...card, marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.TEXT, marginBottom: 3 }}>Bodyweight</div>
          <div style={{ fontSize: 11, color: T.MUTED, marginBottom: 16 }}>kg over time</div>
          {bwData.length >= 2 ? (
            <div style={{ height: 130 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bwData}>
                  <CartesianGrid vertical={false} stroke={T.BORDER} strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: T.MUTED, fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: T.MUTED, fontSize: 10 }} axisLine={false} tickLine={false} width={32} domain={['auto', 'auto']} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="kg" name="kg" stroke={A} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: A }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.MUTED, fontSize: 13 }}>Log your weight daily to see the trend</div>
          )}
        </div>
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.TEXT, marginBottom: 2 }}>Lift Progress</div>
              <div style={{ fontSize: 11, color: T.MUTED }}>top set weight (kg)</div>
            </div>
            <select value={selectedEx} onChange={e => setSelectedEx(e.target.value)} style={{ ...inp, width: 'auto', fontSize: 11, padding: '6px 10px', color: A, background: T.SURF2 }}>
              {LIFT_EXERCISES.map(ex => <option key={ex} value={ex}>{ex}</option>)}
            </select>
          </div>
          {liftData.length >= 2 ? (
            <div style={{ height: 130 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={liftData}>
                  <CartesianGrid vertical={false} stroke={T.BORDER} strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: T.MUTED, fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: T.MUTED, fontSize: 10 }} axisLine={false} tickLine={false} width={32} domain={['auto', 'auto']} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="kg" name="kg" stroke={A} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: A }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.MUTED, fontSize: 13 }}>Exercise data builds once Train tab logging is wired up</div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 28, marginBottom: 8 }}>
        <SectionLabel>Analytics</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
          {[{ label: 'Macro Adherence', value: `${analytics.macroAdherence}%`, sub: 'within ±10% cal target' }, { label: 'Avg Protein', value: `${analytics.avgProtein}g`, sub: `vs ${TARGETS.protein}g target` }].map(s => (
            <div key={s.label} style={{ background: T.SURF2, borderRadius: 12, padding: '16px 14px' }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: T.TEXT, letterSpacing: '-0.5px', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: T.MUTED, marginTop: 6 }}>{s.sub}</div>
              <div style={{ fontSize: 10, color: T.DIM, marginTop: 3, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.TEXT }}>Cardio Consistency</div>
              <div style={{ fontSize: 11, color: T.MUTED, marginTop: 2 }}>Days with cardio in last 28</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: A, letterSpacing: '-0.5px' }}>{analytics.cardioConsistency}%</div>
          </div>
          <div style={{ background: T.SURF2, borderRadius: 5, height: 7 }}>
            <div style={{ width: `${analytics.cardioConsistency}%`, height: '100%', background: A, borderRadius: 5, transition: 'width .5s ease' }} />
          </div>
        </div>
      </div>

      <HistorySection />

      <ThemeToggle />
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState(() => lsLoad('theme_mode', 'dark'))
  const toggle = () => {
    const next = mode === 'dark' ? 'light' : 'dark'
    setMode(next); lsSave('theme_mode', next)
  }
  const colors = mode === 'dark' ? DARK : LIGHT

  const [tab, setTab]           = useState('today')
  const [modality, setModality] = useState(null)
  const [meals, setMeals] = useState(() => lsLoad(`meals_${todayKey()}`, []))
  const addMeal = meal => {
    const updated = [...meals, meal]
    setMeals(updated); lsSave(`meals_${todayKey()}`, updated)
  }

  return (
    <ThemeCtx.Provider value={{ colors, mode, toggle }}>
      <div style={{ background: colors.BG, minHeight: '100dvh', maxWidth: 430, margin: '0 auto', display: 'flex', flexDirection: 'column', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: colors.TEXT, transition: 'background .3s, color .3s', WebkitFontSmoothing: 'antialiased', paddingTop: 'env(safe-area-inset-top)' }}>
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90, overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}>
          {tab === 'today' && <TodayTab meals={meals} setTab={setTab} setModality={setModality} />}
          {tab === 'train' && <TrainTab modality={modality} setModality={setModality} />}
          {tab === 'eat'   && <EatTab meals={meals} onAddMeal={addMeal} />}
          {tab === 'log'   && <LogTab />}
        </div>
        <nav style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: colors.SURF, borderRadius: '22px 22px 0 0', boxShadow: '0 -1px 0 rgba(255,255,255,0.05)', display: 'flex', paddingBottom: 'env(safe-area-inset-bottom)', zIndex: 100, transition: 'background .3s' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: 'none', border: 'none', padding: '16px 0 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', color: tab === t.id ? colors.ACC : colors.MUTED, transition: 'color .15s' }}>
              <t.Icon size={22} color={tab === t.id ? colors.ACC : colors.MUTED} />
              <span style={{ fontSize: 11, fontWeight: tab === t.id ? 700 : 500, letterSpacing: 0.3 }}>{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </ThemeCtx.Provider>
  )
}
