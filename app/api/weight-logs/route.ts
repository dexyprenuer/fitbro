import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get('limit')) || 100, 365);

  const logs = await prisma.weightLog.findMany({
    where: { profileId: profile.id },
    orderBy: { loggedAt: 'desc' },
    take: limit,
  });

  return NextResponse.json({ logs });
}

interface CreateBody {
  weightKg: number;
  loggedAt?: string; // ISO date, defaults to now
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  let body: CreateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof body.weightKg !== 'number' || body.weightKg <= 0 || body.weightKg > 500) {
    return NextResponse.json({ error: 'Invalid weightKg' }, { status: 400 });
  }

  const log = await prisma.weightLog.create({
    data: {
      profileId: profile.id,
      weightKg: body.weightKg,
      loggedAt: body.loggedAt ? new Date(body.loggedAt) : new Date(),
    },
  });

  // Keep Profile.weightKg in sync as "current weight"
  await prisma.profile.update({
    where: { id: profile.id },
    data: { weightKg: body.weightKg },
  });

  return NextResponse.json({ log }, { status: 201 });
}

export async function DELETE(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const log = await prisma.weightLog.findUnique({ where: { id } });
  if (!log || log.profileId !== profile.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.weightLog.delete({ where: { id } });
  return NextResponse.json({ success: true });
}