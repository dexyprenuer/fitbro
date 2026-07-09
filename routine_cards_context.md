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
- Only files matching these patterns are included: components/ui/ProgressBar.tsx, components/home/TodayCard.tsx, components/home/WorkoutCard.tsx, store/useSessionStore.ts, store/useRoutineStore.ts, store/useSettingsStore.ts
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
components/
  home/
    TodayCard.tsx
    WorkoutCard.tsx
  ui/
    ProgressBar.tsx
store/
  useRoutineStore.ts
  useSessionStore.ts
  useSettingsStore.ts
```

# Files

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

## File: components/home/TodayCard.tsx
```typescript
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, BedDouble } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useRoutineStore } from '@/store/useRoutineStore';

function estimateMinutes(exercises: { sets: number }[]) {
  return Math.round(5 + exercises.reduce((sum, ex) => sum + ex.sets * 1.5, 0));
}

export function TodayCard() {
  const todaysWorkoutDay = useRoutineStore((s) => s.todaysWorkoutDay);
  const workoutDay = todaysWorkoutDay();

  if (!workoutDay) {
    return (
      <GlassCard variant="default" className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
          <p className="section-label">Today&apos;s Workout</p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--surface)' }}
          >
            <BedDouble size={22} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div>
            <p className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Rest Day
            </p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Recovery is part of the plan.
            </p>
          </div>
        </div>
      </GlassCard>
    );
  }

  const minutes = estimateMinutes(workoutDay.exercises);

  return (
    <Link href={`/exercise/${workoutDay.id}`}>
      <motion.div whileTap={{ scale: 0.98 }}>
        <GlassCard variant="accent" noPad className="p-5 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <Calendar size={13} style={{ color: 'var(--text-secondary)' }} />
            <p className="section-label">Today&apos;s Workout</p>
          </div>

          <div className="flex items-start justify-between relative z-10 mb-6">
            <div>
              <p
                className="font-display font-bold"
                style={{ fontSize: '2.1rem', lineHeight: 1.05, color: 'var(--text-primary)' }}
              >
                {workoutDay.title}
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                {workoutDay.exercises.length} exercises · ~{minutes} min
              </p>
            </div>

            <Image
              src="/illustrations/hero/dumbbell.png"
              alt=""
              width={96}
              height={96}
              className="flex-shrink-0 -mt-1 -mr-1"
              priority
            />
          </div>

          <div
            className="relative z-10 flex items-center justify-between px-5 py-3.5"
            style={{
              background: 'var(--accent)',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 8px 20px var(--accent-glow)',
            }}
          >
            <span className="font-display font-semibold text-white">Start Workout</span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.95)' }}
            >
              <ArrowRight size={16} style={{ color: 'var(--accent)' }} />
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </Link>
  );
}
```

## File: components/ui/ProgressBar.tsx
```typescript
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ProgressColor = 'accent' | 'success' | 'warning';

interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  showLabel?: boolean;
  color?: ProgressColor;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  /** Render as N discrete segments instead of one continuous bar */
  segments?: number;
}

const colorMap: Record<ProgressColor, { bar: string; glow: string }> = {
  accent:  { bar: 'var(--accent)',  glow: 'var(--accent-glow)' },
  success: { bar: 'var(--success)', glow: 'var(--success-glow)' },
  warning: { bar: 'var(--warning)', glow: 'rgba(201,154,61,0.30)' },
};

const sizeMap = { sm: 'h-1', md: 'h-2', lg: 'h-3' };

export function ProgressBar({
  value,
  className,
  showLabel,
  color = 'accent',
  size = 'md',
  animated = true,
  segments,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const { bar, glow } = colorMap[color];

  if (segments && segments > 0) {
    const filled = Math.round((clamped / 100) * segments);
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className={cn('flex-1 flex gap-1.5', sizeMap[size])}>
          {Array.from({ length: segments }).map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-full"
              style={{
                background: i < filled ? bar : 'var(--border)',
                boxShadow: i < filled ? `0 0 6px ${glow}` : 'none',
              }}
              initial={animated ? { opacity: 0, scaleY: 0.4 } : false}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.25, delay: animated ? i * 0.04 : 0 }}
            />
          ))}
        </div>
        {showLabel && (
          <span
            className="text-xs font-semibold tabular-nums w-9 text-right"
            style={{ color: 'var(--text-secondary)' }}
          >
            {Math.round(clamped)}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn('flex-1 rounded-full overflow-hidden', sizeMap[size])}
        style={{ background: 'var(--border)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${bar} 0%, ${bar}cc 100%)`,
            boxShadow: clamped > 0 ? `0 0 8px ${glow}` : 'none',
          }}
          initial={animated ? { width: 0 } : { width: `${clamped}%` }}
          animate={{ width: `${clamped}%` }}
          transition={
            animated
              ? { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }
              : { duration: 0 }
          }
        />
      </div>
      {showLabel && (
        <span
          className="text-xs font-semibold tabular-nums w-9 text-right"
          style={{ color: 'var(--text-secondary)' }}
        >
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
```

## File: components/home/WorkoutCard.tsx
```typescript
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { WorkoutDay } from '@/types';
import { todayString } from '@/lib/streak';

interface WorkoutCardProps {
  workoutDay: WorkoutDay;
  index: number;
}

function getMuscleIconPath(title: string) {
  const t = title.toLowerCase();
  if (t.includes('chest')) return '/illustrations/muscles/chest.jpg';
  if (t.includes('back')) return '/illustrations/muscles/back.jpg';
  if (t.includes('leg')) return '/illustrations/muscles/legs.jpg';
  if (t.includes('arm')) return '/illustrations/muscles/arms.jpg';
  if (t.includes('shoulder')) return '/illustrations/muscles/shoulders.jpg';
  if (t.includes('ab') || t.includes('core')) return '/illustrations/muscles/abs.jpg';
  return '/illustrations/muscles/full-body.jpg';
}

function estimateMinutes(exercises: { sets: number }[]) {
  return Math.round(5 + exercises.reduce((sum, ex) => sum + ex.sets * 1.5, 0));
}

export function WorkoutCard({ workoutDay, index }: WorkoutCardProps) {
  const completedWorkoutIds = useAppStore((s) => s.completedWorkoutIds);
  const today = todayString();
  const isCompleted = completedWorkoutIds?.includes(`${today}:${workoutDay.id}`) ?? false;
  const minutes = estimateMinutes(workoutDay.exercises);

  return (
    <Link href={`/exercise/${workoutDay.id}`} className="block">
      <motion.div
        whileTap={{ scale: 0.975 }}
        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
        className="flex items-center gap-4 p-4"
        style={{
          background: 'var(--card)',
          border: `1px solid ${isCompleted ? 'var(--success-glow)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: isCompleted ? 'var(--success-dim)' : 'var(--accent-dim)' }}
        >
          <Image
            src={getMuscleIconPath(workoutDay.title)}
            alt={workoutDay.title}
            width={30}
            height={30}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="font-display font-semibold text-[1.05rem] leading-snug truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            {workoutDay.title}
          </p>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {workoutDay.exercises.length} exercises · ~{minutes} min
          </p>
        </div>

        {isCompleted ? (
          <CheckCircle2 size={22} strokeWidth={2} style={{ color: 'var(--success)' }} />
        ) : (
          <ChevronRight size={20} strokeWidth={1.8} style={{ color: 'var(--text-muted)' }} />
        )}
      </motion.div>
    </Link>
  );
}
```
