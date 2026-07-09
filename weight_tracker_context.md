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
- Only files matching these patterns are included: app/page.tsx, components/home/ProgressBar.tsx, store/useSessionStore.ts, store/useRoutineStore.ts, app/account/page.tsx, app/settings/page.tsx, components/settings/WorkoutMiscEditor.tsx, prisma/schema.prisma, app/api/profile/route.ts, types/index.ts, lib/prisma.ts, store/useSettingsStore.ts
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
  settings/
    page.tsx
  page.tsx
components/
  settings/
    WorkoutMiscEditor.tsx
lib/
  prisma.ts
prisma/
  schema.prisma
store/
  useRoutineStore.ts
  useSessionStore.ts
  useSettingsStore.ts
types/
  index.ts
```

# Files

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

## File: lib/prisma.ts
```typescript
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7 client instantiation requires an explicit driver adapter.
// This uses DATABASE_URL (the pgbouncer pooling connection) since this
// is the runtime app connection, not the CLI/migration connection.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

## File: prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

enum Role {
  USER
  ADMIN
  SUPER_ADMIN
}

enum WeightUnit {
  KG
  LBS
}

enum HeightUnit {
  CM
  FT_IN
}

enum WorkoutLevel {
  NEWBIE
  BEGINNER
  ELITE
}

enum FitnessGoal {
  GAIN_MUSCLE
  LOSE_FAT
  MAINTAIN
  STRENGTH
}

enum RoutineType {
  PRESET
  CUSTOM
}

enum SessionStatus {
  ACTIVE
  COMPLETED
  ABANDONED
}

model Profile {
  id                String        @id @default(cuid())
  clerkUserId       String        @unique
  username          String        @unique
  role              Role          @default(USER)

  heightCm          Float?
  weightKg          Float?
  heightUnit        HeightUnit    @default(CM)
  weightUnit        WeightUnit    @default(KG)
  workoutLevel      WorkoutLevel?
  fitnessGoal       FitnessGoal?

  onboarded         Boolean       @default(false)

  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  settings          UserSettings?
  routines          Routine[]
  weightLogs        WeightLog[]
  workoutLogs       WorkoutLog[]
  exerciseOverrides ExerciseOverride[]

  @@map("profiles")
}

model UserSettings {
  id              String   @id @default(cuid())
  profileId       String   @unique
  profile         Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)

  theme           String   @default("dark")
  activeRoutineId String?
  currentStreak   Int      @default(0)
  longestStreak   Int      @default(0)
  lastWorkoutDate String?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("user_settings")
}

model Routine {
  id          String       @id @default(cuid())
  profileId   String?
  profile     Profile?     @relation(fields: [profileId], references: [id], onDelete: Cascade)

  name        String
  type        RoutineType
  schedule    Json

  workoutDays WorkoutDay[]

  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@map("routines")
}

model WorkoutDay {
  id          String       @id @default(cuid())
  routineId   String
  routine     Routine      @relation(fields: [routineId], references: [id], onDelete: Cascade)

  title       String
  emoji       String       @default("")
  order       Int          @default(0)

  exercises   Exercise[]
  workoutLogs WorkoutLog[]

  @@map("workout_days")
}

model Exercise {
  id                String             @id @default(cuid())
  workoutDayId      String
  workoutDay        WorkoutDay         @relation(fields: [workoutDayId], references: [id], onDelete: Cascade)

  name              String
  sets              Int
  reps              Int
  instructions      String?
  order             Int                @default(0)

  exerciseOverrides ExerciseOverride[]

  @@map("exercises")
}

model WorkoutLog {
  id                    String        @id @default(cuid())
  profileId             String
  profile               Profile       @relation(fields: [profileId], references: [id], onDelete: Cascade)

  workoutDayId          String
  workoutDay            WorkoutDay    @relation(fields: [workoutDayId], references: [id], onDelete: Cascade)
  routineId             String

  status                SessionStatus @default(ACTIVE)
  startTimestamp        DateTime
  endTimestamp          DateTime?
  durationSec           Int?
  completedDate         String?

  currentExerciseIndex  Int           @default(0)
  completedExercises    Json          @default("[]")

  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt

  @@index([profileId, status])
  @@index([profileId, completedDate])
  @@map("workout_logs")
}

model WeightLog {
  id        String   @id @default(cuid())
  profileId String
  profile   Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)

  weightKg  Float
  loggedAt  DateTime @default(now())

  @@index([profileId, loggedAt])
  @@map("weight_logs")
}

model ExerciseOverride {
  id          String   @id @default(cuid())
  profileId   String
  profile     Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)

  exerciseId  String
  exercise    Exercise @relation(fields: [exerciseId], references: [id], onDelete: Cascade)

  customSets  Int?
  customReps  Int?

  @@unique([profileId, exerciseId])
  @@map("exercise_overrides")
}
```

## File: store/useRoutineStore.ts
```typescript
import { create } from 'zustand';
import { storage } from '@/lib/storage';
import { PRESET_ROUTINES, DEFAULT_ROUTINE_ID } from '@/data/presets';
import type { Routine, WorkoutDay } from '@/types';
import { getDay } from 'date-fns';

interface RoutineStore {
  activeRoutineId: string;
  customRoutines: Routine[];
  allRoutines: () => Routine[];
  activeRoutine: () => Routine;
  todaysWorkoutDay: () => WorkoutDay | null;
  workoutDayById: (id: string) => WorkoutDay | undefined;
  setActiveRoutine: (id: string) => void;
  saveCustomRoutine: (routine: Routine) => void;
  hydrate: () => void;
}

export const useRoutineStore = create<RoutineStore>((set, get) => ({
  activeRoutineId: DEFAULT_ROUTINE_ID,
  customRoutines: [],

  hydrate() {
    const activeRoutineId = storage.get<string>('activeRoutineId', DEFAULT_ROUTINE_ID);
    const customRoutines = storage.get<Routine[]>('customRoutines', []);
    set({ activeRoutineId, customRoutines });
  },

  allRoutines() {
    return [...PRESET_ROUTINES, ...get().customRoutines];
  },

  activeRoutine() {
    const all = get().allRoutines();
    return all.find((r) => r.id === get().activeRoutineId) ?? all[0];
  },

  todaysWorkoutDay() {
    const routine = get().activeRoutine();
    const dayOfWeek = getDay(new Date()); // 0=Sun
    const dayId = routine.schedule[dayOfWeek];
    if (!dayId) return null;
    return routine.workoutDays.find((d) => d.id === dayId) ?? null;
  },

  workoutDayById(id) {
    return get().activeRoutine().workoutDays.find((d) => d.id === id);
  },

  setActiveRoutine(id) {
    set({ activeRoutineId: id });
    storage.set('activeRoutineId', id);
  },

  saveCustomRoutine(routine) {
    const existing = get().customRoutines;
    const idx = existing.findIndex((r) => r.id === routine.id);
    const next =
      idx >= 0
        ? existing.map((r) => (r.id === routine.id ? routine : r))
        : [...existing, routine];
    set({ customRoutines: next });
    storage.set('customRoutines', next);
  },
}));
```

## File: store/useSessionStore.ts
```typescript
import { create } from 'zustand';
import { storage } from '@/lib/storage';
import { todayString } from '@/lib/streak';
import { getElapsedSeconds } from '@/lib/timer';
import type { WorkoutSession } from '@/types';

interface SessionStore {
  session: WorkoutSession | null;
  startSession: (workoutDayId: string, routineId: string) => void;
  completeExercise: () => void;
  endSession: () => WorkoutSession | null;
  abandonSession: () => void;
  hydrate: () => void;
}

function newId() {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  session: null,

  hydrate() {
    const session = storage.get<WorkoutSession | null>('activeSession', null);
    if (session?.isActive) {
      set({ session });
    }
  },

  startSession(workoutDayId, routineId) {
    const session: WorkoutSession = {
      id: newId(),
      workoutDayId,
      routineId,
      startTimestamp: Date.now(),
      completedExercises: [],
      currentExerciseIndex: 0,
      isActive: true,
    };
    set({ session });
    storage.set('activeSession', session);
  },

  completeExercise() {
    const { session } = get();
    if (!session) return;
    const updated: WorkoutSession = {
      ...session,
      completedExercises: [
        ...session.completedExercises,
        { exerciseId: `ex-${session.currentExerciseIndex}`, completedAt: Date.now() },
      ],
      currentExerciseIndex: session.currentExerciseIndex + 1,
    };
    set({ session: updated });
    storage.set('activeSession', updated);
  },

  endSession() {
    const { session } = get();
    if (!session) return null;
    const duration = getElapsedSeconds(session.startTimestamp);
    const finished: WorkoutSession = {
      ...session,
      endTimestamp: Date.now(),
      duration,
      completedDate: todayString(),
      isActive: false,
    };
    set({ session: null });
    storage.remove('activeSession');
    return finished;
  },

  abandonSession() {
    set({ session: null });
    storage.remove('activeSession');
  },
}));
```

## File: store/useSettingsStore.ts
```typescript
import { create } from 'zustand';
import { storage } from '@/lib/storage';
import type { WorkoutSettings, ExerciseOverride } from '@/types';

interface SettingsStore extends WorkoutSettings {
  getEffective: (exerciseId: string, defaultSets: number, defaultReps: number) => { sets: number; reps: number };
  setOverride: (override: ExerciseOverride) => void;
  removeOverride: (exerciseId: string) => void;
  hydrate: () => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  overrides: {},

  hydrate() {
    const saved = storage.get<WorkoutSettings>('workoutSettings', { overrides: {} });
    set(saved);
  },

  getEffective(exerciseId, defaultSets, defaultReps) {
    const override = get().overrides[exerciseId];
    return {
      sets: override?.customSets ?? defaultSets,
      reps: override?.customReps ?? defaultReps,
    };
  },

  setOverride(override) {
    const next = { ...get().overrides, [override.exerciseId]: override };
    set({ overrides: next });
    storage.set('workoutSettings', { overrides: next });
  },

  removeOverride(exerciseId) {
    const next = { ...get().overrides };
    delete next[exerciseId];
    set({ overrides: next });
    storage.set('workoutSettings', { overrides: next });
  },
}));
```

## File: app/account/page.tsx
```typescript
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, Copy, Pencil, Delete, Check } from 'lucide-react';
import Link from 'next/link';
import { useClerk } from '@clerk/nextjs';
import { PageTransition } from '@/components/ui/PageTransition';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
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

const LEVEL_OPTIONS: { value: WorkoutLevel; label: string }[] = [
  { value: 'NEWBIE', label: 'Newbie' },
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'ELITE', label: 'Elite' },
];

const GOAL_OPTIONS: { value: FitnessGoal; label: string }[] = [
  { value: 'GAIN_MUSCLE', label: 'Gain Muscle' },
  { value: 'LOSE_FAT', label: 'Lose Fat' },
  { value: 'MAINTAIN', label: 'Maintain' },
  { value: 'STRENGTH', label: 'Strength' },
];

type EditField = 'height' | 'weight' | 'units' | 'level' | 'goal' | null;

export default function AccountPage() {
  const { signOut } = useClerk();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [editField, setEditField] = useState<EditField>(null);
  const [saving, setSaving] = useState(false);

  // Draft values used while a modal is open
  const [draftHeight, setDraftHeight] = useState('');
  const [draftWeight, setDraftWeight] = useState('');
  const [draftHeightUnit, setDraftHeightUnit] = useState<HeightUnit>('CM');
  const [draftWeightUnit, setDraftWeightUnit] = useState<WeightUnit>('KG');
  const [draftLevel, setDraftLevel] = useState<WorkoutLevel | null>(null);
  const [draftGoal, setDraftGoal] = useState<FitnessGoal | null>(null);

  function fetchProfile() {
    return fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => setProfile(data.profile));
  }

  useEffect(() => {
    fetchProfile().finally(() => setLoading(false));
  }, []);

  function handleCopyUsername() {
    if (!profile) return;
    navigator.clipboard.writeText(profile.username);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function openEdit(field: EditField) {
    if (!profile) return;
    setDraftHeight(String(profile.heightCm ?? ''));
    setDraftWeight(String(profile.weightKg ?? ''));
    setDraftHeightUnit(profile.heightUnit);
    setDraftWeightUnit(profile.weightUnit);
    setDraftLevel(profile.workoutLevel);
    setDraftGoal(profile.fitnessGoal);
    setEditField(field);
  }

  async function handleSave(patch: Record<string, unknown>) {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        await fetchProfile();
        setEditField(null);
      }
    } finally {
      setSaving(false);
    }
  }

  function handleNumpadPress(
    field: 'height' | 'weight',
    key: string,
    allowDecimal: boolean
  ) {
    const current = field === 'height' ? draftHeight : draftWeight;
    const setValue = field === 'height' ? setDraftHeight : setDraftWeight;
    const maxDigits = field === 'height' ? 3 : 5;

    if (key === 'backspace') {
      setValue(current.slice(0, -1) || '0');
      return;
    }
    if (key === '.') {
      if (!allowDecimal || current.includes('.')) return;
      setValue(current + '.');
      return;
    }
    const digitsOnly = current.replace('.', '');
    if (digitsOnly.length >= maxDigits) return;
    setValue(current === '0' ? key : current + key);
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
            <GlassCard className="mb-4">
              <p className="section-label mb-3">Profile</p>
              <div className="space-y-0.5">
                <StatRow
                  label="Height"
                  value={`${profile.heightCm ?? '—'} cm`}
                  onEdit={() => openEdit('height')}
                />
                <StatRow
                  label="Weight"
                  value={`${profile.weightKg ?? '—'} kg`}
                  onEdit={() => openEdit('weight')}
                />
                <StatRow
                  label="Units"
                  value={`${profile.weightUnit.toLowerCase()}, ${profile.heightUnit === 'CM' ? 'cm' : 'ft'}`}
                  onEdit={() => openEdit('units')}
                />
                <StatRow
                  label="Fitness Level"
                  value={profile.workoutLevel ? LEVEL_LABELS[profile.workoutLevel] : '—'}
                  onEdit={() => openEdit('level')}
                />
                <StatRow
                  label="Fitness Goal"
                  value={profile.fitnessGoal ? GOAL_LABELS[profile.fitnessGoal] : '—'}
                  onEdit={() => openEdit('goal')}
                  last
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

      {/* Height modal */}
      <Modal open={editField === 'height'} onClose={() => setEditField(null)} title="Edit Height">
        <div className="text-center my-6">
          <span className="font-display text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {draftHeight || '0'}
          </span>
          <span className="text-lg ml-1" style={{ color: 'var(--text-secondary)' }}>
            cm
          </span>
        </div>
        <Numpad onPress={(k) => handleNumpadPress('height', k, false)} allowDecimal={false} />
        <div className="pt-6">
          <Button
            variant="primary"
            size="xl"
            fullWidth
            loading={saving}
            disabled={!draftHeight || parseFloat(draftHeight) <= 0}
            onClick={() => handleSave({ heightCm: parseFloat(draftHeight) })}
          >
            Save
          </Button>
        </div>
      </Modal>

      {/* Weight modal */}
      <Modal open={editField === 'weight'} onClose={() => setEditField(null)} title="Edit Weight">
        <div className="text-center my-6">
          <span className="font-display text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {draftWeight || '0'}
          </span>
          <span className="text-lg ml-1" style={{ color: 'var(--text-secondary)' }}>
            kg
          </span>
        </div>
        <Numpad onPress={(k) => handleNumpadPress('weight', k, true)} allowDecimal />
        <div className="pt-6">
          <Button
            variant="primary"
            size="xl"
            fullWidth
            loading={saving}
            disabled={!draftWeight || parseFloat(draftWeight) <= 0}
            onClick={() => handleSave({ weightKg: parseFloat(draftWeight) })}
          >
            Save
          </Button>
        </div>
      </Modal>

      {/* Units modal */}
      <Modal open={editField === 'units'} onClose={() => setEditField(null)} title="Edit Units">
        <div className="space-y-5 my-4">
          <div>
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Weight Unit
            </p>
            <SegmentedToggle
              options={['KG', 'LBS']}
              value={draftWeightUnit}
              onChange={(v) => setDraftWeightUnit(v as WeightUnit)}
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Height Unit
            </p>
            <SegmentedToggle
              options={['CM', 'FT_IN']}
              labels={{ CM: 'CM', FT_IN: 'FT / IN' }}
              value={draftHeightUnit}
              onChange={(v) => setDraftHeightUnit(v as HeightUnit)}
            />
          </div>
        </div>
        <div className="pt-4">
          <Button
            variant="primary"
            size="xl"
            fullWidth
            loading={saving}
            onClick={() =>
              handleSave({ weightUnit: draftWeightUnit, heightUnit: draftHeightUnit })
            }
          >
            Save
          </Button>
        </div>
      </Modal>

      {/* Fitness level modal */}
      <Modal open={editField === 'level'} onClose={() => setEditField(null)} title="Edit Fitness Level">
        <div className="space-y-3 my-4">
          {LEVEL_OPTIONS.map((opt) => (
            <SelectableRow
              key={opt.value}
              selected={draftLevel === opt.value}
              label={opt.label}
              onClick={() => setDraftLevel(opt.value)}
            />
          ))}
        </div>
        <div className="pt-4">
          <Button
            variant="primary"
            size="xl"
            fullWidth
            loading={saving}
            disabled={!draftLevel}
            onClick={() => handleSave({ workoutLevel: draftLevel })}
          >
            Save
          </Button>
        </div>
      </Modal>

      {/* Fitness goal modal */}
      <Modal open={editField === 'goal'} onClose={() => setEditField(null)} title="Edit Fitness Goal">
        <div className="space-y-3 my-4">
          {GOAL_OPTIONS.map((opt) => (
            <SelectableRow
              key={opt.value}
              selected={draftGoal === opt.value}
              label={opt.label}
              onClick={() => setDraftGoal(opt.value)}
            />
          ))}
        </div>
        <div className="pt-4">
          <Button
            variant="primary"
            size="xl"
            fullWidth
            loading={saving}
            disabled={!draftGoal}
            onClick={() => handleSave({ fitnessGoal: draftGoal })}
          >
            Save
          </Button>
        </div>
      </Modal>
    </PageTransition>
  );
}

function StatRow({
  label,
  value,
  last,
  onEdit,
}: {
  label: string;
  value: string;
  last?: boolean;
  onEdit?: () => void;
}) {
  return (
    <button
      onClick={onEdit}
      disabled={!onEdit}
      className="w-full flex items-center justify-between py-2.5 text-left"
      style={{ borderBottom: last ? 'none' : '1px solid var(--border)' }}
    >
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
      <span className="flex items-center gap-2">
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {value}
        </span>
        {onEdit && <Pencil size={13} style={{ color: 'var(--text-muted)' }} />}
      </span>
    </button>
  );
}

function SegmentedToggle({
  options,
  labels,
  value,
  onChange,
}: {
  options: string[];
  labels?: Record<string, string>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex p-1 rounded-full" style={{ background: 'var(--border)' }}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className="px-5 py-2 rounded-full text-sm font-semibold transition-colors"
          style={{
            background: value === opt ? 'var(--accent)' : 'transparent',
            color: value === opt ? '#fff' : 'var(--text-secondary)',
          }}
        >
          {labels?.[opt] ?? opt}
        </button>
      ))}
    </div>
  );
}

function SelectableRow({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left p-4 flex items-center justify-between"
      style={{
        background: 'var(--card)',
        border: `1.5px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <span className="font-display font-semibold" style={{ color: 'var(--text-primary)' }}>
        {label}
      </span>
      {selected && (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: 'var(--accent)' }}
        >
          <Check size={14} color="#fff" strokeWidth={3} />
        </div>
      )}
    </button>
  );
}

function Numpad({
  onPress,
  allowDecimal,
}: {
  onPress: (key: string) => void;
  allowDecimal: boolean;
}) {
  const keys = allowDecimal
    ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace']
    : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'];

  return (
    <div className="grid grid-cols-3 gap-3">
      {keys.map((key, i) => {
        if (key === '') return <div key={`empty-${i}`} />;
        return (
          <motion.button
            key={key}
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => onPress(key)}
            className="h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {key === 'backspace' ? (
              <Delete size={20} style={{ color: 'var(--text-primary)' }} />
            ) : (
              <span className="font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {key}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
```

## File: components/settings/WorkoutMiscEditor.tsx
```typescript
'use client';

import { motion } from 'framer-motion';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { Exercise } from '@/types';

interface WorkoutMiscEditorProps {
  exercises: Exercise[];
  workoutTitle: string;
}

export function WorkoutMiscEditor({ exercises, workoutTitle }: WorkoutMiscEditorProps) {
  const { getEffective, setOverride, removeOverride, overrides } = useSettingsStore();

  function change(ex: Exercise, field: 'sets' | 'reps', delta: number) {
    const current = getEffective(ex.id, ex.sets, ex.reps);
    const next = Math.max(1, Math.min(99, current[field] + delta));
    setOverride({
      exerciseId: ex.id,
      customSets: field === 'sets' ? next : current.sets,
      customReps: field === 'reps' ? next : current.reps,
    });
  }

  function reset(ex: Exercise) {
    removeOverride(ex.id);
  }

  return (
    <div className="space-y-3">
      <p className="section-label px-1">{workoutTitle}</p>

      {exercises.map((ex) => {
        const { sets, reps } = getEffective(ex.id, ex.sets, ex.reps);
        const isOverridden = !!overrides[ex.id];

        return (
          <div
            key={ex.id}
            className="p-4"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {ex.name}
              </p>
              {isOverridden && (
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => reset(ex)}
                  className="flex items-center gap-1 text-xs font-medium"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <RotateCcw size={12} />
                  Reset
                </motion.button>
              )}
            </div>

            <div className="flex items-center gap-6">
              {[
                { label: 'Sets', value: sets, field: 'sets' as const },
                { label: 'Reps', value: reps, field: 'reps' as const },
              ].map(({ label, value, field }) => (
                <div key={field} className="flex items-center gap-3">
                  <span className="text-xs w-8" style={{ color: 'var(--text-secondary)' }}>
                    {label}
                  </span>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => change(ex, field, -1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--surface)' }}
                    >
                      <Minus size={14} style={{ color: 'var(--text-secondary)' }} />
                    </motion.button>
                    <span
                      className="font-display font-bold w-6 text-center tabular-nums"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {value}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => change(ex, field, 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--accent-dim)' }}
                    >
                      <Plus size={14} style={{ color: 'var(--accent)' }} />
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

## File: app/settings/page.tsx
```typescript
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Dumbbell, User, Mail } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';

const LINKS = [
  { href: '/account', icon: User, label: 'Account', sub: 'Manage your profile & preferences' },
  { href: '/settings/misc', icon: Dumbbell, label: 'Workout Settings', sub: 'Customize sets & reps' },
  { href: '/settings/contact', icon: Mail, label: 'Contact Us', sub: 'Links & info' },
];

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
};

export default function SettingsPage() {
  return (
    <PageTransition>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-4 pt-12 max-w-lg mx-auto"
        style={{ paddingBottom: 'max(8rem, calc(env(safe-area-inset-bottom) + 7rem))' }}
      >
        <motion.h1
          variants={fadeUp}
          className="font-display text-3xl font-bold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Settings
        </motion.h1>

        <motion.div variants={fadeUp} className="space-y-3">
          {LINKS.map(({ href, icon: Icon, label, sub }) => (
            <Link key={href} href={href} className="block">
              <motion.div
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                className="p-4 flex items-center gap-4"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--accent-dim)' }}
                >
                  <Icon size={19} style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {label}
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {sub}
                  </p>
                </div>
                <ChevronRight size={18} strokeWidth={1.8} style={{ color: 'var(--text-muted)' }} />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
```

## File: app/page.tsx
```typescript
'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import Link from 'next/link';
import { PageTransition } from '@/components/ui/PageTransition';
import { TodayCard } from '@/components/home/TodayCard';
import { WorkoutCard } from '@/components/home/WorkoutCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useRoutineStore } from '@/store/useRoutineStore';
import { useAppStore } from '@/store/useAppStore';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning,';
  if (h < 17) return 'Good afternoon,';
  return 'Good evening,';
}

function getProgressMessage(pct: number) {
  if (pct >= 100) return "Amazing! You've hit your weekly goal.";
  if (pct >= 50) return "Keep going! You're building consistency.";
  if (pct > 0) return 'Nice start — keep the momentum going.';
  return "Let's get your first workout in today.";
}

export default function HomePage() {
  const activeRoutine = useRoutineStore((s) => s.activeRoutine);
  const completedDates = useAppStore((s) => s.completedDates);
  const fallbackDisplayName = useAppStore((s) => s.displayName);
  const routine = activeRoutine();

  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data?.profile?.username) {
          setUsername(data.profile.username);
        }
      })
      .catch(() => {
        // silently fall back to local displayName
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { scheduledThisWeek, completedThisWeek, weeklyProgress } = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const scheduled = routine.schedule.slice(0, dayOfWeek + 1).filter(Boolean).length;
    const completed = completedDates.filter((d) => {
      const date = new Date(d);
      const diff = (today.getTime() - date.getTime()) / 86400000;
      return diff >= 0 && diff < 7;
    }).length;
    return {
      scheduledThisWeek: scheduled,
      completedThisWeek: completed,
      weeklyProgress: scheduled > 0 ? Math.min(100, (completed / scheduled) * 100) : 0,
    };
  }, [completedDates, routine.schedule]);

  return (
    <PageTransition>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-4 pt-12 pb-32 max-w-lg mx-auto"
        style={{ paddingBottom: 'max(8rem, calc(env(safe-area-inset-bottom) + 7rem))' }}
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
              {getGreeting()}
            </p>
            <h1
              className="font-display text-3xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {username ?? fallbackDisplayName}
            </h1>
          </div>
          <Link
            href="/account"
            className="w-11 h-11 rounded-full flex items-center justify-center relative flex-shrink-0"
            style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
          >
            <User size={19} style={{ color: 'var(--text-primary)' }} />
          </Link>
        </motion.div>

        {/* Today */}
        <motion.div variants={fadeUp} className="mb-5">
          <TodayCard />
        </motion.div>

        {/* Weekly Progress */}
        <motion.div
          variants={fadeUp}
          className="mb-6 p-5"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-display font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
                Weekly Progress
              </p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {completedThisWeek} / {scheduledThisWeek} workouts
              </p>
            </div>
            <span
              className="font-display font-bold tabular-nums"
              style={{ fontSize: '1.7rem', color: 'var(--text-primary)' }}
            >
              {Math.round(weeklyProgress)}%
            </span>
          </div>

          <ProgressBar value={weeklyProgress} segments={Math.max(scheduledThisWeek, 1)} />

          <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
            {getProgressMessage(weeklyProgress)}
          </p>
        </motion.div>

        {/* Your Workouts */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="section-label">Your Workouts</p>
            <Link href="/exercise" className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {routine.workoutDays.slice(0, 2).map((day, i) => (
              <WorkoutCard key={day.id} workoutDay={day} index={i} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
```

## File: types/index.ts
```typescript
export type Theme = 'light' | 'dark' | 'system';

export type AppState = {
  theme: Theme;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
  completedDates: string[];
  completedWorkoutIds: string[]; // Tracks specific unique session completions per day
  displayName: string;
};

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  instructions?: string;
};

export type WorkoutDay = {
  id: string;
  title: string;
  emoji: string;
  exercises: Exercise[];
};

export type Routine = {
  id: string;
  name: string;
  type: 'preset' | 'custom';
  schedule: (string | null)[];
  workoutDays: WorkoutDay[];
};

export type CompletedExerciseLog = {
  exerciseId: string;
  completedAt: number;
};

export type Session = {
  id: string;
  routineId: string;
  workoutDayId: string;
  startTimestamp: number;
  endTimestamp?: number;
  duration?: number;
  completedDate?: string;
  completedExercises: CompletedExerciseLog[];
  currentExerciseIndex: number;
  isActive: boolean;
};

export type WorkoutSession = Session;

export type AppSettings = {
  theme: Theme;
  notificationsEnabled: boolean;
};

export type ExerciseOverride = {
  exerciseId: string;
  customSets?: number;
  customReps?: number;
};

export type WorkoutSettings = {
  overrides: Record<string, ExerciseOverride>;
};
```
