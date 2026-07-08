This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: app/account/page.tsx, app/api/profile/route.ts
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
app/
  account/
    page.tsx
  api/
    profile/
      route.ts
```

# Files

## File: app/account/page.tsx
```typescript
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, Copy } from 'lucide-react';
import Link from 'next/link';
import { useClerk } from '@clerk/nextjs';
import { PageTransition } from '@/components/ui/PageTransition';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import type { HeightUnit, WeightUnit, WorkoutLevel, FitnessGoal } from '@prisma/client';

interface ProfileData {
  username: string;
  email: string | null;
  avatarUrl: string | null;
  heightCm: number | null;
  weightKg: number | null;
  heightUnit: HeightUnit;
  weightUnit: WeightUnit;
  workoutLevel: WorkoutLevel | null;
  fitnessGoal: FitnessGoal | null;
  createdAt: string;
}

const LEVEL_LABELS: Record<WorkoutLevel, string> = {
  NEWBIE: 'Newbie',
  BEGINNER: 'Beginner',
  ELITE: 'Elite',
};

const GOAL_LABELS: Record<FitnessGoal, string> = {
  GAIN_MUSCLE: 'Gain Muscle',
  LOSE_FAT: 'Lose Fat',
  MAINTAIN: 'Maintain',
  STRENGTH: 'Strength',
};

export default function AccountPage() {
  const { signOut } = useClerk();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => setProfile(data.profile))
      .finally(() => setLoading(false));
  }, []);

  function handleCopyUsername() {
    if (!profile) return;
    navigator.clipboard.writeText(profile.username);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const memberSince = profile
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <PageTransition>
      <div
        className="px-4 pt-8 max-w-lg mx-auto"
        style={{ paddingBottom: 'max(8rem, calc(env(safe-area-inset-bottom) + 7rem))' }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/settings"
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
          >
            <ChevronLeft size={18} style={{ color: 'var(--text-primary)' }} />
          </Link>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Account
          </h1>
        </div>

        {loading || !profile ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-[var(--radius-lg)] animate-pulse"
                style={{ background: 'var(--border)' }}
              />
            ))}
          </div>
        ) : (
          <>
            {/* Avatar + username */}
            <div className="flex flex-col items-center mb-6">
              <div
                className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center mb-3"
                style={{ background: 'var(--accent-dim)', boxShadow: 'var(--shadow-sm)' }}
              >
                {profile.avatarUrl ? (
                  <Image src={profile.avatarUrl} alt={profile.username} width={80} height={80} />
                ) : (
                  <span className="font-display text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                    {profile.username.slice(5, 6)}
                  </span>
                )}
              </div>
              <button
                onClick={handleCopyUsername}
                className="flex items-center gap-1.5 text-sm font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                {profile.username}
                <Copy size={13} />
                {copied && <span style={{ color: 'var(--success)' }}>Copied</span>}
              </button>
              {profile.email && (
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {profile.email}
                </p>
              )}
            </div>

            {/* Profile stats */}
            <GlassCard variant="interactive" className="mb-4" style={{ cursor: 'default' }}>
              <p className="section-label mb-3">Profile</p>
              <div className="space-y-0.5">
                <StatRow label="Height" value={`${profile.heightCm ?? '—'} cm`} />
                <StatRow label="Weight" value={`${profile.weightKg ?? '—'} kg`} />
                <StatRow
                  label="Units"
                  value={`${profile.weightUnit.toLowerCase()}, ${profile.heightUnit === 'CM' ? 'cm' : 'ft'}`}
                />
                <StatRow
                  label="Fitness Level"
                  value={profile.workoutLevel ? LEVEL_LABELS[profile.workoutLevel] : '—'}
                />
                <StatRow
                  label="Fitness Goal"
                  value={profile.fitnessGoal ? GOAL_LABELS[profile.fitnessGoal] : '—'}
                />
              </div>
            </GlassCard>

            <GlassCard className="mb-6">
              <StatRow label="Member Since" value={memberSince} last />
            </GlassCard>

            <Button variant="destructive" fullWidth onClick={() => signOut()}>
              Sign Out
            </Button>
          </>
        )}
      </div>
    </PageTransition>
  );
}

function StatRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className="flex items-center justify-between py-2.5"
      style={{ borderBottom: last ? 'none' : '1px solid var(--border)' }}
    >
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
    </div>
  );
}
```

## File: app/api/profile/route.ts
```typescript
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
```
