import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import type {
  HeightUnit,
  WeightUnit,
  WorkoutLevel,
  FitnessGoal,
} from '@prisma/client';

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { clerkUserId: userId },
    include: { settings: true },
  });

  if (!profile) {
    return NextResponse.json({ profile: null, onboarded: false });
  }

  const user = await currentUser();

  return NextResponse.json({
    profile: {
      ...profile,
      email: user?.primaryEmailAddress?.emailAddress ?? null,
      avatarUrl: user?.imageUrl ?? null,
    },
    onboarded: profile.onboarded,
  });
}

interface UpdateBody {
  weightKg?: number;
  heightCm?: number;
  weightUnit?: WeightUnit;
  heightUnit?: HeightUnit;
  workoutLevel?: WorkoutLevel;
  fitnessGoal?: FitnessGoal;
}

// Note: username is intentionally NOT accepted here — it's read-only post-creation per plan spec
export async function PATCH(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existing = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!existing) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  let body: UpdateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const allowedFields: (keyof UpdateBody)[] = [
    'weightKg',
    'heightCm',
    'weightUnit',
    'heightUnit',
    'workoutLevel',
    'fitnessGoal',
  ];
  const data: UpdateBody = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      (data as Record<string, unknown>)[field] = body[field];
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const profile = await prisma.profile.update({
    where: { clerkUserId: userId },
    data,
  });

  return NextResponse.json({ profile });
}