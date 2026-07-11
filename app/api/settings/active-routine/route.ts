// app/api/settings/active-routine/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

interface Body {
  routineId?: string;
}

export async function PATCH(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.routineId) {
    return NextResponse.json({ error: 'routineId is required' }, { status: 400 });
  }

  const settings = await prisma.userSettings.upsert({
    where: { profileId: profile.id },
    create: { profileId: profile.id, activeRoutineId: body.routineId },
    update: { activeRoutineId: body.routineId },
  });

  return NextResponse.json({ activeRoutineId: settings.activeRoutineId });
}