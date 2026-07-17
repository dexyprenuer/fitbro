// app/api/admin/days/[dayId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AdminAuthError } from '@/lib/auth';

const VALID_MUSCLE_GROUPS = [
  'Chest', 'Back', 'Legs', 'Biceps', 'Triceps',
  'Forearms', 'Shoulders', 'Abs', 'Neck',
];

interface UpdateDayBody {
  title?: string;
  emoji?: string;
  order?: number;
  muscleGroups?: string[];
}

export async function PATCH(req: Request, { params }: { params: { dayId: string } }) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    throw err;
  }

  let body: UpdateDayBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const data: UpdateDayBody = {};
  if (body.title !== undefined) data.title = body.title.trim();
  if (body.emoji !== undefined) data.emoji = body.emoji;
  if (body.order !== undefined) data.order = body.order;
  if (body.muscleGroups !== undefined) {
    data.muscleGroups = body.muscleGroups.filter((m) => VALID_MUSCLE_GROUPS.includes(m));
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const day = await prisma.workoutDay.update({
    where: { id: params.dayId },
    data,
    include: { exercises: true },
  });

  return NextResponse.json({ day });
}

export async function DELETE(_req: Request, { params }: { params: { dayId: string } }) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    throw err;
  }

  await prisma.workoutDay.delete({ where: { id: params.dayId } });

  return NextResponse.json({ success: true });
}