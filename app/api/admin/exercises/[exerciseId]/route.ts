// app/api/admin/exercises/[exerciseId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AdminAuthError } from '@/lib/auth';

interface UpdateExerciseBody {
  name?: string;
  sets?: number;
  reps?: number;
  instructions?: string | null;
  order?: number;
}

export async function PATCH(req: Request, { params }: { params: { exerciseId: string } }) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    throw err;
  }

  let body: UpdateExerciseBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const allowed: (keyof UpdateExerciseBody)[] = ['name', 'sets', 'reps', 'instructions', 'order'];
  const data: UpdateExerciseBody = {};
  for (const field of allowed) {
    if (body[field] !== undefined) {
      (data as Record<string, unknown>)[field] = body[field];
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const exercise = await prisma.exercise.update({
    where: { id: params.exerciseId },
    data,
  });

  return NextResponse.json({ exercise });
}

export async function DELETE(_req: Request, { params }: { params: { exerciseId: string } }) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    throw err;
  }

  await prisma.exercise.delete({ where: { id: params.exerciseId } });

  return NextResponse.json({ success: true });
}