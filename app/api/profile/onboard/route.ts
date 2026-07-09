import { NextResponse } from 'next/server';
import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
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

  // Self-healing case: profile was already onboarded in the DB (e.g. from
  // before the Clerk publicMetadata flag existed), but the session token
  // is missing the flag, causing the middleware to redirect here in a loop.
  // Just resync the metadata and let the client proceed instead of erroring.
  if (existing?.onboarded) {
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { onboarded: true },
    });
    return NextResponse.json({ profile: existing, resynced: true });
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

  // Write onboarded flag to Clerk's public metadata so middleware can read it
  // synchronously from the session token — this is what eliminates the
  // per-navigation DB round-trip that was causing the button delay.
  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: { onboarded: true },
  });

  return NextResponse.json({ profile });
}