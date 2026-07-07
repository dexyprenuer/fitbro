import 'dotenv/config';
import { PrismaClient, RoutineType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

type SeedExercise = {
  name: string;
  sets: number;
  reps: number;
  instructions?: string;
};

type SeedWorkoutDay = {
  slug: string; // used only to build the schedule map below, not stored
  title: string;
  emoji: string;
  exercises: SeedExercise[];
};

type SeedRoutine = {
  name: string;
  schedule: (string | null)[]; // references slug, resolved to real ids after creation
  workoutDays: SeedWorkoutDay[];
};

const PRESET_ROUTINES: SeedRoutine[] = [
  {
    name: 'Push / Pull / Legs',
    schedule: [null, 'push', 'pull', 'legs', 'push', 'pull', null],
    workoutDays: [
      {
        slug: 'push',
        title: 'Push Day',
        emoji: '',
        exercises: [
          { name: 'Bench Press', sets: 4, reps: 10, instructions: 'Keep shoulder blades retracted. Lower bar to lower chest.' },
          { name: 'Overhead Press', sets: 3, reps: 8, instructions: 'Brace core. Press bar overhead in a straight line.' },
          { name: 'Incline DB Press', sets: 3, reps: 12, instructions: 'Set bench to 30–45°. Control the eccentric.' },
          { name: 'Lateral Raise', sets: 3, reps: 15, instructions: 'Slight bend in elbows. Lead with elbows, not wrists.' },
          { name: 'Tricep Pushdown', sets: 3, reps: 15, instructions: 'Keep elbows pinned to sides. Full extension at bottom.' },
        ],
      },
      {
        slug: 'pull',
        title: 'Pull Day',
        emoji: '',
        exercises: [
          { name: 'Deadlift', sets: 4, reps: 6, instructions: 'Hip hinge. Keep bar close to body. Neutral spine throughout.' },
          { name: 'Pull-Up', sets: 3, reps: 8, instructions: 'Full dead hang at bottom. Drive elbows down to chest.' },
          { name: 'Barbell Row', sets: 3, reps: 10, instructions: 'Hinge at hips ~45°. Pull bar to lower chest.' },
          { name: 'Face Pull', sets: 3, reps: 15, instructions: 'Set cable at eye level. Pull to forehead, elbows high.' },
          { name: 'Bicep Curl', sets: 3, reps: 12, instructions: 'No swinging. Squeeze at top. Slow eccentric.' },
        ],
      },
      {
        slug: 'legs',
        title: 'Legs Day',
        emoji: '',
        exercises: [
          { name: 'Back Squat', sets: 4, reps: 8, instructions: 'Bar on traps. Knees track toes. Break parallel.' },
          { name: 'Romanian Deadlift', sets: 3, reps: 10, instructions: 'Soft knee bend. Push hips back. Feel hamstring stretch.' },
          { name: 'Leg Press', sets: 3, reps: 12, instructions: 'Feet shoulder-width. Control descent. Do not lock knees.' },
          { name: 'Leg Curl', sets: 3, reps: 15, instructions: 'Keep hips pressed down. Full range of motion.' },
          { name: 'Calf Raise', sets: 4, reps: 20, instructions: 'Full stretch at bottom. Pause at top.' },
        ],
      },
    ],
  },
  {
    name: 'Upper / Lower',
    schedule: [null, 'upper', 'lower', null, 'upper', 'lower', null],
    workoutDays: [
      {
        slug: 'upper',
        title: 'Upper Body',
        emoji: '',
        exercises: [
          { name: 'Bench Press', sets: 4, reps: 8 },
          { name: 'Barbell Row', sets: 4, reps: 8 },
          { name: 'Overhead Press', sets: 3, reps: 10 },
          { name: 'Pull-Up', sets: 3, reps: 8 },
          { name: 'Bicep Curl', sets: 2, reps: 12 },
          { name: 'Skull Crusher', sets: 2, reps: 12 },
        ],
      },
      {
        slug: 'lower',
        title: 'Lower Body',
        emoji: '',
        exercises: [
          { name: 'Back Squat', sets: 4, reps: 8 },
          { name: 'Romanian Deadlift', sets: 3, reps: 10 },
          { name: 'Leg Press', sets: 3, reps: 12 },
          { name: 'Leg Curl', sets: 3, reps: 12 },
          { name: 'Calf Raise', sets: 3, reps: 20 },
        ],
      },
    ],
  },
  {
    name: 'Full Body 3×/Week',
    schedule: [null, 'fullbody-a', null, 'fullbody-b', null, 'fullbody-a', null],
    workoutDays: [
      {
        slug: 'fullbody-a',
        title: 'Full Body A',
        emoji: '',
        exercises: [
          { name: 'Back Squat', sets: 3, reps: 8 },
          { name: 'Bench Press', sets: 3, reps: 8 },
          { name: 'Barbell Row', sets: 3, reps: 8 },
          { name: 'Overhead Press', sets: 2, reps: 10 },
          { name: 'Bicep Curl', sets: 2, reps: 12 },
        ],
      },
      {
        slug: 'fullbody-b',
        title: 'Full Body B',
        emoji: '',
        exercises: [
          { name: 'Deadlift', sets: 3, reps: 5 },
          { name: 'Incline DB Press', sets: 3, reps: 10 },
          { name: 'Pull-Up', sets: 3, reps: 8 },
          { name: 'Leg Press', sets: 3, reps: 12 },
          { name: 'Tricep Pushdown', sets: 2, reps: 15 },
        ],
      },
    ],
  },
  {
    name: '5-Day Hypertrophy Split',
    schedule: [null, 'chest_day', 'back_day', 'legs_day', 'arms_day', 'shoulders_day', null],
    workoutDays: [
      {
        slug: 'chest_day',
        title: 'Chest',
        emoji: '',
        exercises: [
          { name: 'Pec Deck', sets: 3, reps: 12 },
          { name: 'Machine Chest Press', sets: 3, reps: 10 },
          { name: 'Incline Bench Press', sets: 3, reps: 10 },
          { name: 'Decline Bench Press', sets: 3, reps: 10 },
        ],
      },
      {
        slug: 'back_day',
        title: 'Back',
        emoji: '',
        exercises: [
          { name: 'Wide Grip Lat Pulldown', sets: 3, reps: 12 },
          { name: 'Meadows Row', sets: 3, reps: 10 },
          { name: 'Chest Supported Row', sets: 3, reps: 10 },
        ],
      },
      {
        slug: 'legs_day',
        title: 'Legs',
        emoji: '',
        exercises: [
          { name: 'Leg Press', sets: 4, reps: 12 },
          { name: 'Bulgarian Split Squat', sets: 3, reps: 10 },
          { name: 'Leg Extension', sets: 3, reps: 15 },
          { name: 'Hamstring Curl', sets: 3, reps: 12 },
          { name: 'Calf Raises', sets: 4, reps: 15 },
        ],
      },
      {
        slug: 'arms_day',
        title: 'Arms',
        emoji: '',
        exercises: [
          { name: 'Preacher Curl', sets: 3, reps: 12 },
          { name: 'Incline DB Hammer Curl', sets: 3, reps: 10 },
          { name: 'Barbell Curls', sets: 3, reps: 10 },
          { name: 'Bar Press Down', sets: 3, reps: 12 },
          { name: 'Overhead Press Down', sets: 3, reps: 12 },
          { name: 'Machine / Bodyweight Dips', sets: 3, reps: 10 },
          { name: 'Reverse DB Curls', sets: 3, reps: 15 },
          { name: 'Pronated & Supinated Wrist Curls', sets: 3, reps: 15 },
        ],
      },
      {
        slug: 'shoulders_day',
        title: 'Shoulders',
        emoji: '',
        exercises: [
          { name: 'Shoulder Press', sets: 3, reps: 10 },
          { name: 'Cable Lateral Raises', sets: 3, reps: 15 },
          { name: 'Reverse Pec Deck', sets: 3, reps: 15 },
        ],
      },
    ],
  },
];

export const DEFAULT_ROUTINE_NAME = 'Push / Pull / Legs';

async function main() {
  console.log('Seeding preset routines...');

  // Wipe existing presets so this script is safely re-runnable
  await prisma.routine.deleteMany({ where: { type: RoutineType.PRESET } });

  for (const preset of PRESET_ROUTINES) {
    const routine = await prisma.routine.create({
      data: {
        name: preset.name,
        type: RoutineType.PRESET,
        profileId: null,
        schedule: [], // placeholder, patched below once workoutDay ids exist
      },
    });

    const slugToId: Record<string, string> = {};

    for (let i = 0; i < preset.workoutDays.length; i++) {
      const day = preset.workoutDays[i];
      const workoutDay = await prisma.workoutDay.create({
        data: {
          routineId: routine.id,
          title: day.title,
          emoji: day.emoji,
          order: i,
        },
      });

      slugToId[day.slug] = workoutDay.id;

      await prisma.exercise.createMany({
        data: day.exercises.map((ex, j) => ({
          workoutDayId: workoutDay.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          instructions: ex.instructions,
          order: j,
        })),
      });
    }

    // Resolve schedule slugs -> real workoutDay ids, now that they exist
    const resolvedSchedule = preset.schedule.map((slug) => (slug ? slugToId[slug] : null));

    await prisma.routine.update({
      where: { id: routine.id },
      data: { schedule: resolvedSchedule },
    });

    console.log(`  ✓ ${preset.name} (${preset.workoutDays.length} workout days)`);
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });