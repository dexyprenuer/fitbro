// app/api/admin/presets/[id]/days/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AdminAuthError } from '@/lib/auth';

interface CreateDayBody {
  title?: string;
  emoji?: string;
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AdminAuthError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    throw err;
  }

  let body: CreateDayBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.title?.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const count = await prisma.workoutDay.count({ where: { routineId: params.id } });

  const day = await prisma.workoutDay.create({
    data: {
      routineId: params.id,
      title: body.title.trim(),
      emoji: body.emoji ?? '',
      order: count,
    },
    include: { exercises: true },
  });

  return NextResponse.json({ day });
}