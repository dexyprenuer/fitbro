// app/api/admin/presets/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AdminAuthError } from '@/lib/auth';

const VALID_MUSCLE_GROUPS = [
  'Chest', 'Back', 'Legs', 'Biceps', 'Triceps',
  'Forearms', 'Shoulders', 'Abs', 'Neck',
];

export async function GET() {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    throw err;
  }

  const presets = await prisma.routine.findMany({
    where: { type: 'PRESET' },
    orderBy: { createdAt: 'asc' },
    include: {
      workoutDays: {
        orderBy: { order: 'asc' },
        include: { exercises: { orderBy: { order: 'asc' } } },
      },
    },
  });

  return NextResponse.json({ presets });
}

interface WizardExercise {
  name: string;
  sets: number;
  reps: number;
  instructions?: string;
}

interface WizardDay {
  title: string;
  emoji?: string;
  muscleGroups?: string[];
  exercises: WizardExercise[];
}

interface CreatePresetBody {
  name?: string;
  workoutDays?: WizardDay[];
}

// Bulk-creates a preset with nested days + exercises in one call (used by the
// multi-step wizard). Still supports the old "name only" shell-creation shape
// for backwards compatibility with anything else that might call this.
export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    throw err;
  }

  let body: CreatePresetBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  // Wizard path: full nested payload
  if (body.workoutDays && body.workoutDays.length > 0) {
    const preset = await prisma.routine.create({
      data: {
        name: body.name.trim(),
        type: 'PRESET',
        profileId: null,
        schedule: [null, null, null, null, null, null, null],
        workoutDays: {
          create: body.workoutDays.map((day, dayIdx) => ({
            title: day.title.trim(),
            emoji: day.emoji ?? '',
            order: dayIdx,
            muscleGroups: (day.muscleGroups ?? []).filter((m) => VALID_MUSCLE_GROUPS.includes(m)),
            exercises: {
              create: day.exercises.map((ex, exIdx) => ({
                name: ex.name.trim(),
                sets: ex.sets,
                reps: ex.reps,
                instructions: ex.instructions?.trim() || null,
                order: exIdx,
              })),
            },
          })),
        },
      },
      include: { workoutDays: { include: { exercises: true } } },
    });

    return NextResponse.json({ preset });
  }

  // Legacy path: empty shell, days added one at a time afterward
  const preset = await prisma.routine.create({
    data: {
      name: body.name.trim(),
      type: 'PRESET',
      profileId: null,
      schedule: [null, null, null, null, null, null, null],
    },
    include: { workoutDays: { include: { exercises: true } } },
  });

  return NextResponse.json({ preset });
}