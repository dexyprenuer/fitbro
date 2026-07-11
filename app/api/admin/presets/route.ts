// app/api/admin/presets/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AdminAuthError } from '@/lib/auth';

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

interface CreatePresetBody {
  name?: string;
}

// Creates an empty preset shell. Workout days/exercises added separately.
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