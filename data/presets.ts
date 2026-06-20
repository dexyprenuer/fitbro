import type { Routine } from '@/types';

export const PRESET_ROUTINES: Routine[] = [
  {
    id: 'ppl',
    name: 'Push / Pull / Legs',
    type: 'preset',
    // Sun=rest, Mon=Push, Tue=Pull, Wed=Legs, Thu=Push, Fri=Pull, Sat=rest
    schedule: [null, 'push', 'pull', 'legs', 'push', 'pull', null],
    workoutDays: [
      {
        id: 'push',
        title: 'Push Day',
        emoji: '',
        exercises: [
          { id: 'bench-press', name: 'Bench Press', sets: 4, reps: 10, instructions: 'Keep shoulder blades retracted. Lower bar to lower chest.' },
          { id: 'overhead-press', name: 'Overhead Press', sets: 3, reps: 8, instructions: 'Brace core. Press bar overhead in a straight line.' },
          { id: 'incline-db-press', name: 'Incline DB Press', sets: 3, reps: 12, instructions: 'Set bench to 30–45°. Control the eccentric.' },
          { id: 'lateral-raise', name: 'Lateral Raise', sets: 3, reps: 15, instructions: 'Slight bend in elbows. Lead with elbows, not wrists.' },
          { id: 'tricep-pushdown', name: 'Tricep Pushdown', sets: 3, reps: 15, instructions: 'Keep elbows pinned to sides. Full extension at bottom.' },
        ],
      },
      {
        id: 'pull',
        title: 'Pull Day',
        emoji: '',
        exercises: [
          { id: 'deadlift', name: 'Deadlift', sets: 4, reps: 6, instructions: 'Hip hinge. Keep bar close to body. Neutral spine throughout.' },
          { id: 'pull-up', name: 'Pull-Up', sets: 3, reps: 8, instructions: 'Full dead hang at bottom. Drive elbows down to chest.' },
          { id: 'barbell-row', name: 'Barbell Row', sets: 3, reps: 10, instructions: 'Hinge at hips ~45°. Pull bar to lower chest.' },
          { id: 'face-pull', name: 'Face Pull', sets: 3, reps: 15, instructions: 'Set cable at eye level. Pull to forehead, elbows high.' },
          { id: 'bicep-curl', name: 'Bicep Curl', sets: 3, reps: 12, instructions: 'No swinging. Squeeze at top. Slow eccentric.' },
        ],
      },
      {
        id: 'legs',
        title: 'Legs Day',
        emoji: '',
        exercises: [
          { id: 'squat', name: 'Back Squat', sets: 4, reps: 8, instructions: 'Bar on traps. Knees track toes. Break parallel.' },
          { id: 'romanian-dl', name: 'Romanian Deadlift', sets: 3, reps: 10, instructions: 'Soft knee bend. Push hips back. Feel hamstring stretch.' },
          { id: 'leg-press', name: 'Leg Press', sets: 3, reps: 12, instructions: 'Feet shoulder-width. Control descent. Do not lock knees.' },
          { id: 'leg-curl', name: 'Leg Curl', sets: 3, reps: 15, instructions: 'Keep hips pressed down. Full range of motion.' },
          { id: 'calf-raise', name: 'Calf Raise', sets: 4, reps: 20, instructions: 'Full stretch at bottom. Pause at top.' },
        ],
      },
    ],
  },
  {
    id: 'upper-lower',
    name: 'Upper / Lower',
    type: 'preset',
    schedule: [null, 'upper', 'lower', null, 'upper', 'lower', null],
    workoutDays: [
      {
        id: 'upper',
        title: 'Upper Body',
        emoji: '',
        exercises: [
          { id: 'ul-bench', name: 'Bench Press', sets: 4, reps: 8 },
          { id: 'ul-row', name: 'Barbell Row', sets: 4, reps: 8 },
          { id: 'ul-ohp', name: 'Overhead Press', sets: 3, reps: 10 },
          { id: 'ul-pullup', name: 'Pull-Up', sets: 3, reps: 8 },
          { id: 'ul-curl', name: 'Bicep Curl', sets: 2, reps: 12 },
          { id: 'ul-tri', name: 'Skull Crusher', sets: 2, reps: 12 },
        ],
      },
      {
        id: 'lower',
        title: 'Lower Body',
        emoji: '',
        exercises: [
          { id: 'll-squat', name: 'Back Squat', sets: 4, reps: 8 },
          { id: 'll-rdl', name: 'Romanian Deadlift', sets: 3, reps: 10 },
          { id: 'll-lpress', name: 'Leg Press', sets: 3, reps: 12 },
          { id: 'll-lcurl', name: 'Leg Curl', sets: 3, reps: 12 },
          { id: 'll-calf', name: 'Calf Raise', sets: 3, reps: 20 },
        ],
      },
    ],
  },
  {
    id: 'full-body',
    name: 'Full Body 3×/Week',
    type: 'preset',
    schedule: [null, 'fullbody-a', null, 'fullbody-b', null, 'fullbody-a', null],
    workoutDays: [
      {
        id: 'fullbody-a',
        title: 'Full Body A',
        emoji: '',
        exercises: [
          { id: 'fb-squat', name: 'Back Squat', sets: 3, reps: 8 },
          { id: 'fb-bench', name: 'Bench Press', sets: 3, reps: 8 },
          { id: 'fb-row', name: 'Barbell Row', sets: 3, reps: 8 },
          { id: 'fb-ohp', name: 'Overhead Press', sets: 2, reps: 10 },
          { id: 'fb-curl', name: 'Bicep Curl', sets: 2, reps: 12 },
        ],
      },
      {
        id: 'fullbody-b',
        title: 'Full Body B',
        emoji: '',
        exercises: [
          { id: 'fb-dl', name: 'Deadlift', sets: 3, reps: 5 },
          { id: 'fb-incline', name: 'Incline DB Press', sets: 3, reps: 10 },
          { id: 'fb-pullup', name: 'Pull-Up', sets: 3, reps: 8 },
          { id: 'fb-lpress', name: 'Leg Press', sets: 3, reps: 12 },
          { id: 'fb-tri', name: 'Tricep Pushdown', sets: 2, reps: 15 },
        ],
      },
    ],
  },
  {
    id: 'bro_split_5_day',
    name: '5-Day Hypertrophy Split',
    type: 'preset',
    // Sun=rest, Mon=Chest, Tue=Back, Wed=Legs, Thu=Arms, Fri=Shoulders, Sat=rest
    schedule: [null, 'chest_day', 'back_day', 'legs_day', 'arms_day', 'shoulders_day', null],
    workoutDays: [
      {
        id: 'chest_day',
        title: 'Chest',
        emoji: '',
        exercises: [
          { id: 'pec_deck', name: 'Pec Deck', sets: 3, reps: 12 },
          { id: 'mach_chest_press', name: 'Machine Chest Press', sets: 3, reps: 10 },
          { id: 'incline_bp', name: 'Incline Bench Press', sets: 3, reps: 10 },
          { id: 'decline_bp', name: 'Decline Bench Press', sets: 3, reps: 10 },
        ],
      },
      {
        id: 'back_day',
        title: 'Back',
        emoji: '',
        exercises: [
          { id: 'wide_lat_pulldown', name: 'Wide Grip Lat Pulldown', sets: 3, reps: 12 },
          { id: 'meadows_row', name: 'Meadows Row', sets: 3, reps: 10 },
          { id: 'chest_supported_row', name: 'Chest Supported Row', sets: 3, reps: 10 },
        ],
      },
      {
        id: 'legs_day',
        title: 'Legs',
        emoji: '',
        exercises: [
          { id: 'leg_press', name: 'Leg Press', sets: 4, reps: 12 },
          { id: 'bulgarian_split_squat', name: 'Bulgarian Split Squat', sets: 3, reps: 10 },
          { id: 'leg_extension', name: 'Leg Extension', sets: 3, reps: 15 },
          { id: 'hamstring_curl', name: 'Hamstring Curl', sets: 3, reps: 12 },
          { id: 'calf_raises', name: 'Calf Raises', sets: 4, reps: 15 },
        ],
      },
      {
        id: 'arms_day',
        title: 'Arms',
        emoji: '',
        exercises: [
          { id: 'preacher_curl', name: 'Preacher Curl', sets: 3, reps: 12 },
          { id: 'incline_hammer_curl', name: 'Incline DB Hammer Curl', sets: 3, reps: 10 },
          { id: 'barbell_curl', name: 'Barbell Curls', sets: 3, reps: 10 },
          { id: 'bar_pressdown', name: 'Bar Press Down', sets: 3, reps: 12 },
          { id: 'overhead_pressdown', name: 'Overhead Press Down', sets: 3, reps: 12 },
          { id: 'dips', name: 'Machine / Bodyweight Dips', sets: 3, reps: 10 },
          { id: 'reverse_db_curl', name: 'Reverse DB Curls', sets: 3, reps: 15 },
          { id: 'wrist_curls', name: 'Pronated & Supinated Wrist Curls', sets: 3, reps: 15 },
        ],
      },
      {
        id: 'shoulders_day',
        title: 'Shoulders',
        emoji: '',
        exercises: [
          { id: 'shoulder_press', name: 'Shoulder Press', sets: 3, reps: 10 },
          { id: 'cable_lateral_raise', name: 'Cable Lateral Raises', sets: 3, reps: 15 },
          { id: 'reverse_pec_deck', name: 'Reverse Pec Deck', sets: 3, reps: 15 },
        ],
      },
    ],
  },
];

export const DEFAULT_ROUTINE_ID = 'ppl';
