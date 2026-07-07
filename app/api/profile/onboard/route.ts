import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { generateUniqueUsername } from '@/lib/username';
import {
  HeightUnit,
  WeightUnit,
  WorkoutLevel,
  FitnessGoal,
} from '@prisma/client';

interface OnboardBody {
  weightKg: number;
  weightUnit: WeightUnit;
  heightCm: number;
  heightUnit: HeightUnit;
  workoutLevel: WorkoutLevel;
  fitnessGoal: FitnessGoal;
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existing = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (existing?.onboarded) {
    return NextResponse.json({ error: 'Already onboarded' }, { status: 409 });
  }

  let body: OnboardBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { weightKg, weightUnit, heightCm, heightUnit, workoutLevel, fitnessGoal } = body;

  if (
    typeof weightKg !== 'number' ||
    typeof heightCm !== 'number' ||
    !weightUnit ||
    !heightUnit ||
    !workoutLevel ||
    !fitnessGoal
  ) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }

  const user = await currentUser();
  const username = existing?.username ?? (await generateUniqueUsername());

  const profile = await prisma.profile.upsert({
    where: { clerkUserId: userId },
    update: {
      heightCm,
      weightKg,
      heightUnit,
      weightUnit,
      workoutLevel,
      fitnessGoal,
      onboarded: true,
    },
    create: {
      clerkUserId: userId,
      username,
      heightCm,
      weightKg,
      heightUnit,
      weightUnit,
      workoutLevel,
      fitnessGoal,
      onboarded: true,
    },
  });

  // Ensure a UserSettings row exists alongside the profile
  await prisma.userSettings.upsert({
    where: { profileId: profile.id },
    update: {},
    create: { profileId: profile.id },
  });

  return NextResponse.json({ profile });
}