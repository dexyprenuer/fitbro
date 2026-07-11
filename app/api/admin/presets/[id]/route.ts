// app/api/admin/presets/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AdminAuthError } from '@/lib/auth';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    throw err;
  }

  const preset = await prisma.routine.findUnique({
    where: { id: params.id },
    include: {
      workoutDays: {
        orderBy: { order: 'asc' },
        include: { exercises: { orderBy: { order: 'asc' } } },
      },
    },
  });

  if (!preset) {
    return NextResponse.json({ error: 'Preset not found' }, { status: 404 });
  }

  return NextResponse.json({ preset });
}

interface UpdatePresetBody {
  name?: string;
  schedule?: (string | null)[];
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    throw err;
  }

  let body: UpdatePresetBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const data: UpdatePresetBody = {};
  if (body.name !== undefined) data.name = body.name.trim();
  if (body.schedule !== undefined) data.schedule = body.schedule;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const preset = await prisma.routine.update({
    where: { id: params.id },
    data,
    include: { workoutDays: { include: { exercises: true } } },
  });

  return NextResponse.json({ preset });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    throw err;
  }

  await prisma.routine.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}