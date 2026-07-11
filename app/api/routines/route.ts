// app/api/routines/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, settings: { select: { activeRoutineId: true } } },
  });

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const routines = await prisma.routine.findMany({
    where: {
      OR: [{ type: 'PRESET' }, { profileId: profile.id }],
    },
    orderBy: { createdAt: 'asc' },
    include: {
      workoutDays: {
        orderBy: { order: 'asc' },
        include: { exercises: { orderBy: { order: 'asc' } } },
      },
    },
  });

  return NextResponse.json({
    routines,
    activeRoutineId: profile.settings?.activeRoutineId ?? null,
  });
}

interface CreateCustomRoutineBody {
  name?: string;
  schedule?: (string | null)[];
  workoutDays?: {
    title: string;
    emoji?: string;
    exercises: { name: string; sets: number; reps: number; instructions?: string }[];
  }[];
}

// Creates/replaces a custom routine for the current user (full nested payload).
export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  let body: CreateCustomRoutineBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.name?.trim() || !body.workoutDays?.length) {
    return NextResponse.json({ error: 'name and workoutDays are required' }, { status: 400 });
  }

  const routine = await prisma.routine.create({
    data: {
      profileId: profile.id,
      name: body.name.trim(),
      type: 'CUSTOM',
      schedule: [],
      workoutDays: {
        create: body.workoutDays.map((day, dayIdx) => ({
          title: day.title,
          emoji: day.emoji ?? '',
          order: dayIdx,
          exercises: {
            create: day.exercises.map((ex, exIdx) => ({
              name: ex.name,
              sets: ex.sets,
              reps: ex.reps,
              instructions: ex.instructions ?? null,
              order: exIdx,
            })),
          },
        })),
      },
    },
    include: { workoutDays: { include: { exercises: true } } },
  });

  return NextResponse.json({ routine });
}