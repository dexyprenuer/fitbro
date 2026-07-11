// app/api/admin/days/[dayId]/exercises/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AdminAuthError } from '@/lib/auth';

interface CreateExerciseBody {
  name?: string;
  sets?: number;
  reps?: number;
  instructions?: string;
}

export async function POST(req: Request, { params }: { params: { dayId: string } }) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    throw err;
  }

  let body: CreateExerciseBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.name?.trim() || !body.sets || !body.reps) {
    return NextResponse.json({ error: 'name, sets, and reps are required' }, { status: 400 });
  }

  const count = await prisma.exercise.count({ where: { workoutDayId: params.dayId } });

  const exercise = await prisma.exercise.create({
    data: {
      workoutDayId: params.dayId,
      name: body.name.trim(),
      sets: body.sets,
      reps: body.reps,
      instructions: body.instructions?.trim() || null,
      order: count,
    },
  });

  return NextResponse.json({ exercise });
}