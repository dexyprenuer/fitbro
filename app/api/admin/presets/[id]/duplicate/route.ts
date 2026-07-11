// app/api/admin/presets/[id]/duplicate/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AdminAuthError } from '@/lib/auth';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    throw err;
  }

  const source = await prisma.routine.findUnique({
    where: { id: params.id },
    include: {
      workoutDays: {
        orderBy: { order: 'asc' },
        include: { exercises: { orderBy: { order: 'asc' } } },
      },
    },
  });

  if (!source) {
    return NextResponse.json({ error: 'Preset not found' }, { status: 404 });
  }

  const copy = await prisma.routine.create({
    data: {
      name: `${source.name} (Copy)`,
      type: 'PRESET',
      profileId: null,
      schedule: [], // patched below once new workoutDay ids exist
    },
  });

  const oldToNewDayId: Record<string, string> = {};

  for (const day of source.workoutDays) {
    const newDay = await prisma.workoutDay.create({
      data: {
        routineId: copy.id,
        title: day.title,
        emoji: day.emoji,
        order: day.order,
      },
    });
    oldToNewDayId[day.id] = newDay.id;

    if (day.exercises.length > 0) {
      await prisma.exercise.createMany({
        data: day.exercises.map((ex) => ({
          workoutDayId: newDay.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          instructions: ex.instructions,
          order: ex.order,
        })),
      });
    }
  }

  const resolvedSchedule = (source.schedule as (string | null)[]).map((oldId) =>
    oldId ? oldToNewDayId[oldId] ?? null : null
  );

  const preset = await prisma.routine.update({
    where: { id: copy.id },
    data: { schedule: resolvedSchedule },
    include: { workoutDays: { include: { exercises: true } } },
  });

  return NextResponse.json({ preset });
}