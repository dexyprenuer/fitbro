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
- Only files matching these patterns are included: app/settings/page.tsx, app/settings/misc/page.tsx, app/settings/contact/page.tsx, components/settings/WorkoutMiscEditor.tsx, components/settings/ThemeToggle.tsx, data/presets.ts, app/api/profile/onboard/route.ts, app/exercise/page.tsx, app/exercise/[dayId]/page.tsx, components/exercise/*.tsx, app/routine/page.tsx, components/routine/RoutineCalendar.tsx, components/routine/RoutineSelector.tsx, components/home/TodayCard.tsx, components/home/StreakBadge.tsx, components/providers/HydrationProvider.tsx, hooks/useElapsedTime.ts, middleware.ts
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
app/
  api/
    profile/
      onboard/
        route.ts
  exercise/
    [dayId]/
      page.tsx
    page.tsx
  routine/
    page.tsx
  settings/
    contact/
      page.tsx
    misc/
      page.tsx
    page.tsx
components/
  exercise/
    CompletionOverlay.tsx
    ExerciseList.tsx
    SessionExerciseCard.tsx
    SessionTimer.tsx
  home/
    StreakBadge.tsx
    TodayCard.tsx
  providers/
    HydrationProvider.tsx
  routine/
    RoutineCalendar.tsx
    RoutineSelector.tsx
  settings/
    ThemeToggle.tsx
    WorkoutMiscEditor.tsx
data/
  presets.ts
hooks/
  useElapsedTime.ts
middleware.ts
```

# Files

## File: components/exercise/ExerciseList.tsx
```typescript
'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { Exercise } from '@/types';

interface ExerciseListProps {
  exercises: Exercise[];
}

export function ExerciseList({ exercises }: ExerciseListProps) {
  const getEffective = useSettingsStore((s) => s.getEffective);

  return (
    <div className="space-y-2">
      {exercises.map((ex, i) => {
        const { sets, reps } = getEffective(ex.id, ex.sets, ex.reps);
        return (
          <GlassCard key={ex.id} className="px-4 py-3 flex items-center gap-3">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
            >
              {i + 1}
            </span>
            <span className="flex-1 text-sm font-medium text-[var(--text-primary)]">
              {ex.name}
            </span>
            <span className="text-sm text-[var(--text-secondary)] whitespace-nowrap">
              {sets} × {reps}
            </span>
          </GlassCard>
        );
      })}
    </div>
  );
}
```

## File: components/exercise/SessionTimer.tsx
```typescript
'use client';

import { useElapsedTime } from '@/hooks/useElapsedTime';
import { formatDuration } from '@/lib/timer';
import { Timer } from 'lucide-react';

interface SessionTimerProps {
  startTimestamp: number;
}

export function SessionTimer({ startTimestamp }: SessionTimerProps) {
  const elapsed = useElapsedTime(startTimestamp);

  return (
    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
      <Timer size={16} />
      <span className="font-mono text-sm font-medium tabular-nums">
        {formatDuration(elapsed)}
      </span>
    </div>
  );
}
```

## File: components/providers/HydrationProvider.tsx
```typescript
'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useRoutineStore } from '@/store/useRoutineStore';
import { useSessionStore } from '@/store/useSessionStore';
import { useSettingsStore } from '@/store/useSettingsStore';

export function HydrationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAppStore.getState().hydrate();
    useRoutineStore.getState().hydrate();
    useSessionStore.getState().hydrate();
    useSettingsStore.getState().hydrate();
  }, []);

  return <>{children}</>;
}
```

## File: components/settings/ThemeToggle.tsx
```typescript
'use client';

import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { GlassCard } from '@/components/ui/GlassCard';

export function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore();
  const isDark = theme === 'dark';

  return (
    <GlassCard className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--accent-dim)' }}
        >
          {isDark ? (
            <Moon size={18} style={{ color: 'var(--accent)' }} />
          ) : (
            <Sun size={18} style={{ color: 'var(--accent)' }} />
          )}
        </div>
        <div>
          <p className="font-medium text-[var(--text-primary)]">Appearance</p>
          <p className="text-xs text-[var(--text-secondary)]">{isDark ? 'Dark mode' : 'Light mode'}</p>
        </div>
      </div>

      {/* Toggle switch */}
      <button
        onClick={toggleTheme}
        className="relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0"
        style={{ background: isDark ? 'var(--accent)' : 'var(--border)' }}
        aria-label="Toggle theme"
      >
        <motion.div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
          animate={{ x: isDark ? 26 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </GlassCard>
  );
}
```

## File: hooks/useElapsedTime.ts
```typescript
import { useEffect, useState } from 'react';
import { getElapsedSeconds } from '@/lib/timer';

/**
 * Returns elapsed seconds since `startTimestamp` (epoch ms).
 * Updates every second using requestAnimationFrame for 120Hz smoothness.
 * Derives time from wall clock — accurate after tab switch / screen lock.
 */
export function useElapsedTime(startTimestamp: number | null): number {
  const [elapsed, setElapsed] = useState(
    startTimestamp ? getElapsedSeconds(startTimestamp) : 0
  );

  useEffect(() => {
    if (!startTimestamp) return;
    let rafId: number;
    let lastSecond = getElapsedSeconds(startTimestamp);

    function tick() {
      const now = getElapsedSeconds(startTimestamp!);
      if (now !== lastSecond) {
        lastSecond = now;
        setElapsed(now);
      }
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [startTimestamp]);

  return elapsed;
}
```

## File: app/settings/misc/page.tsx
```typescript
'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { WorkoutMiscEditor } from '@/components/settings/WorkoutMiscEditor';
import { useRoutineStore } from '@/store/useRoutineStore';

export default function MiscSettingsPage() {
  const router = useRouter();
  const activeRoutine = useRoutineStore((s) => s.activeRoutine);
  const routine = activeRoutine();

  return (
    <PageTransition>
      <div
        className="px-4 pt-10 max-w-lg mx-auto"
        style={{ paddingBottom: 'max(4rem, calc(env(safe-area-inset-bottom) + 3rem))' }}
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 tap-target"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </motion.button>

        <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Workout Settings
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Customize sets and reps per exercise.
        </p>

        <div className="space-y-8">
          {routine.workoutDays.map((day) => (
            <WorkoutMiscEditor
              key={day.id}
              exercises={day.exercises}
              workoutTitle={day.title}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
```

## File: components/exercise/CompletionOverlay.tsx
```typescript
'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Trophy, Home, Zap, Clock } from 'lucide-react';

interface CompletionOverlayProps {
  duration:      number; // seconds
  exerciseCount: number;
}

export function CompletionOverlay({ duration, exerciseCount }: CompletionOverlayProps) {
  const router  = useRouter();
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  /* Auto-redirect after 5s — enough time to feel rewarding */
  useEffect(() => {
    const t = setTimeout(() => router.push('/'), 5000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-6"
      style={{
        /* Theme-aware overlay — works in both dark and light */
        background: 'color-mix(in srgb, var(--bg) 88%, transparent)',
        backdropFilter: 'blur(32px) saturate(160%)',
        WebkitBackdropFilter: 'blur(32px) saturate(160%)',
      }}
    >
      {/* ── Expanding ring burst — transform only, no layout reflow ── */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width:       80,
            height:      80,
            border:      '2px solid var(--accent)',
            pointerEvents: 'none',
          }}
          animate={{
            scale:   [1, 5 + i * 1.6],
            opacity: [0.55, 0],
          }}
          transition={{
            duration: 1.6,
            delay:    i * 0.18,
            ease:     'easeOut',
          }}
        />
      ))}

      {/* ── Trophy icon ──────────────────────────────────────────── */}
      <motion.div
        initial={{ scale: 0, rotate: -24 }}
        animate={{ scale: 1, rotate: 0   }}
        transition={{
          type:      'spring',
          stiffness: 280,
          damping:   18,
          delay:     0.12,
        }}
        className="relative flex items-center justify-center mb-7"
        style={{
          width:        96,
          height:       96,
          background:   'linear-gradient(135deg, var(--accent), var(--secondary-accent))',
          borderRadius: 'var(--radius-xl)',
          boxShadow:    '0 0 48px var(--accent-glow), 0 8px 32px rgba(108,99,255,0.30)',
        }}
      >
        <Trophy size={46} color="#fff" strokeWidth={1.8} />
      </motion.div>

      {/* ── Headline ─────────────────────────────────────────────── */}
      <motion.h1
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ type: 'spring', stiffness: 320, damping: 24, delay: 0.28 }}
        className="font-display font-bold mb-2"
        style={{ fontSize: 'clamp(2rem, 8vw, 2.8rem)', color: 'var(--text-primary)' }}
      >
        Workout Done! 🎉
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.40 }}
        className="text-base mb-8"
        style={{ color: 'var(--text-secondary)' }}
      >
        You crushed it. Keep the streak alive!
      </motion.p>

      {/* ── Stat cards ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.50 }}
        className="flex gap-3 mb-10 w-full max-w-xs"
      >
        {[
          {
            icon:  <Zap  size={18} style={{ color: 'var(--accent)' }} />,
            value: `${exerciseCount}`,
            label: 'Exercises',
            bg:    'var(--accent-dim)',
            border:'rgba(108,99,255,0.20)',
          },
          {
            icon:  <Clock size={18} style={{ color: 'var(--success)' }} />,
            value: `${minutes}m ${String(seconds).padStart(2,'0')}s`,
            label: 'Duration',
            bg:    'var(--success-dim)',
            border:'rgba(52,211,153,0.20)',
          },
        ].map(({ icon, value, label, bg, border }) => (
          <div
            key={label}
            className="flex-1 flex flex-col items-center gap-1.5 py-4 px-3"
            style={{
              background:   bg,
              border:       `1px solid ${border}`,
              borderRadius: 'var(--radius-lg)',
            }}
          >
            {icon}
            <span
              className="font-display font-bold tabular-nums"
              style={{ fontSize: '1.35rem', color: 'var(--text-primary)' }}
            >
              {value}
            </span>
            <span
              className="section-label"
              style={{ color: 'var(--text-muted)' }}
            >
              {label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* ── Home CTA ─────────────────────────────────────────────── */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.62 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/')}
        className="flex items-center gap-2.5 font-semibold font-display text-white"
        style={{
          background:   'linear-gradient(135deg, var(--accent), var(--secondary-accent))',
          borderRadius: 'var(--radius-xl)',
          padding:      '1rem 2.5rem',
          boxShadow:    '0 4px 24px var(--accent-glow)',
          minHeight:    '56px',
        }}
      >
        <Home size={18} strokeWidth={2.2} />
        Back to Home
      </motion.button>

      {/* Auto-dismiss hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-12 text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        Redirecting in 5s…
      </motion.p>
    </motion.div>
  );
}
```

## File: components/home/StreakBadge.tsx
```typescript
'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { isStreakAlive } from '@/lib/streak';

export const StreakBadge = memo(function StreakBadge() {
  const currentStreak = useAppStore((s) => s.currentStreak);
  const longestStreak = useAppStore((s) => s.longestStreak);
  const lastWorkoutDate = useAppStore((s) => s.lastWorkoutDate);
  const alive = isStreakAlive(lastWorkoutDate);

  return (
    <div
      className="relative overflow-hidden p-4"
      style={{
        background: alive
          ? `linear-gradient(135deg, var(--accent-dim) 0%, var(--secondary-accent-dim) 100%)`
          : 'var(--card)',
        border: `1px solid ${alive ? 'var(--glass-border-strong)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-xl)',
        boxShadow: alive ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
      }}
    >
      {/* Background glow blob — only when alive, no JS animation needed */}
      {alive && (
        <div
          className="absolute -top-6 -right-6 w-28 h-28 rounded-full pointer-events-none"
          style={{
            background: 'var(--accent-glow)',
            filter: 'blur(28px)',
            opacity: 0.4,
          }}
        />
      )}

      <div className="relative flex items-center gap-4">
        {/* Flame icon */}
        <motion.div
          /* Only animate when alive, not on every render */
          animate={alive ? { scale: [1, 1.10, 1] } : { scale: 1 }}
          transition={
            alive
              ? { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
              : {}
          }
          className={`w-14 h-14 flex items-center justify-center flex-shrink-0 ${alive ? 'streak-alive' : ''}`}
          style={{
            background: alive
              ? 'linear-gradient(135deg, var(--accent-dim), var(--secondary-accent-dim))'
              : 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <Flame
            size={26}
            strokeWidth={1.8}
            style={{ color: alive ? 'var(--accent)' : 'var(--text-muted)' }}
          />
        </motion.div>

        {/* Current streak number */}
        <div className="flex-1 min-w-0">
          <p
            className="section-label mb-0.5"
            style={{ color: alive ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            Current Streak
          </p>
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-display font-bold tabular-nums"
              style={{
                fontSize: '2.4rem',
                lineHeight: 1,
                color: 'var(--text-primary)',
              }}
            >
              {currentStreak}
            </span>
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              {currentStreak === 1 ? 'day' : 'days'}
            </span>
          </div>

          {/* Status chip */}
          <div
            className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full"
            style={{
              background: alive ? 'var(--accent-dim)' : 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <Zap
              size={10}
              style={{ color: alive ? 'var(--accent)' : 'var(--text-muted)' }}
            />
            <span
              className="text-[10px] font-semibold"
              style={{ color: alive ? 'var(--accent)' : 'var(--text-muted)' }}
            >
              {alive ? 'On fire!' : 'Start a streak'}
            </span>
          </div>
        </div>

        {/* Best streak */}
        <div
          className="flex-shrink-0 text-right pl-3"
          style={{
            borderLeft: '1px solid var(--border)',
          }}
        >
          <div
            className="flex items-center gap-1 justify-end mb-0.5"
          >
            <TrendingUp
              size={11}
              style={{ color: 'var(--text-muted)' }}
            />
            <span
              className="section-label"
              style={{ color: 'var(--text-muted)' }}
            >
              Best
            </span>
          </div>
          <span
            className="font-display font-bold tabular-nums"
            style={{
              fontSize: '1.6rem',
              lineHeight: 1,
              color: 'var(--text-secondary)',
            }}
          >
            {longestStreak}
          </span>
          <p
            className="text-[10px] mt-0.5"
            style={{ color: 'var(--text-muted)' }}
          >
            days
          </p>
        </div>
      </div>
    </div>
  );
});
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

## File: components/routine/RoutineSelector.tsx
```typescript
'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useRoutineStore } from '@/store/useRoutineStore';
import { PRESET_ROUTINES } from '@/data/presets';

export function RoutineSelector() {
  const { activeRoutineId, setActiveRoutine, customRoutines } = useRoutineStore();
  const all = [...PRESET_ROUTINES, ...customRoutines];

  return (
    <div className="space-y-3">
      {all.map((routine) => {
        const active = routine.id === activeRoutineId;

        return (
          <motion.div
            key={routine.id}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            onClick={() => setActiveRoutine(routine.id)}
            className="flex items-center gap-3 p-4 cursor-pointer"
            style={{
              background: 'var(--card)',
              border: `1px solid ${active ? 'rgba(90,103,242,0.25)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="flex-1 min-w-0">
              <p
                className="font-display font-semibold text-[1.05rem]"
                style={{ color: 'var(--text-primary)' }}
              >
                {routine.name}
              </p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                <span
                  style={{
                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {active ? 'Current' : routine.type === 'preset' ? 'Preset' : 'Custom'}
                </span>
                {' · '}
                {routine.workoutDays.length} workout days
              </p>
            </div>

            <ChevronRight size={18} strokeWidth={1.8} style={{ color: 'var(--text-muted)' }} />
          </motion.div>
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

## File: data/presets.ts
```typescript
import type { Routine } from '@/types';

export const PRESET_ROUTINES: Routine[] = [
  {
    id: 'ppl',
    name: 'Push / Pull / Legs',
    type: 'preset',
    // Sun=rest, Mon=Push, Tue=Pull, Wed=Legs, Thu=Push, Fri=Pull, Sat=rest
    schedule: [null, 'push', 'pull', 'legs', 'push', 'pull', null],
    workoutDays: [
      {
        id: 'push',
        title: 'Push Day',
        emoji: '',
        exercises: [
          { id: 'bench-press', name: 'Bench Press', sets: 4, reps: 10, instructions: 'Keep shoulder blades retracted. Lower bar to lower chest.' },
          { id: 'overhead-press', name: 'Overhead Press', sets: 3, reps: 8, instructions: 'Brace core. Press bar overhead in a straight line.' },
          { id: 'incline-db-press', name: 'Incline DB Press', sets: 3, reps: 12, instructions: 'Set bench to 30–45°. Control the eccentric.' },
          { id: 'lateral-raise', name: 'Lateral Raise', sets: 3, reps: 15, instructions: 'Slight bend in elbows. Lead with elbows, not wrists.' },
          { id: 'tricep-pushdown', name: 'Tricep Pushdown', sets: 3, reps: 15, instructions: 'Keep elbows pinned to sides. Full extension at bottom.' },
        ],
      },
      {
        id: 'pull',
        title: 'Pull Day',
        emoji: '',
        exercises: [
          { id: 'deadlift', name: 'Deadlift', sets: 4, reps: 6, instructions: 'Hip hinge. Keep bar close to body. Neutral spine throughout.' },
          { id: 'pull-up', name: 'Pull-Up', sets: 3, reps: 8, instructions: 'Full dead hang at bottom. Drive elbows down to chest.' },
          { id: 'barbell-row', name: 'Barbell Row', sets: 3, reps: 10, instructions: 'Hinge at hips ~45°. Pull bar to lower chest.' },
          { id: 'face-pull', name: 'Face Pull', sets: 3, reps: 15, instructions: 'Set cable at eye level. Pull to forehead, elbows high.' },
          { id: 'bicep-curl', name: 'Bicep Curl', sets: 3, reps: 12, instructions: 'No swinging. Squeeze at top. Slow eccentric.' },
        ],
      },
      {
        id: 'legs',
        title: 'Legs Day',
        emoji: '',
        exercises: [
          { id: 'squat', name: 'Back Squat', sets: 4, reps: 8, instructions: 'Bar on traps. Knees track toes. Break parallel.' },
          { id: 'romanian-dl', name: 'Romanian Deadlift', sets: 3, reps: 10, instructions: 'Soft knee bend. Push hips back. Feel hamstring stretch.' },
          { id: 'leg-press', name: 'Leg Press', sets: 3, reps: 12, instructions: 'Feet shoulder-width. Control descent. Do not lock knees.' },
          { id: 'leg-curl', name: 'Leg Curl', sets: 3, reps: 15, instructions: 'Keep hips pressed down. Full range of motion.' },
          { id: 'calf-raise', name: 'Calf Raise', sets: 4, reps: 20, instructions: 'Full stretch at bottom. Pause at top.' },
        ],
      },
    ],
  },
  {
    id: 'upper-lower',
    name: 'Upper / Lower',
    type: 'preset',
    schedule: [null, 'upper', 'lower', null, 'upper', 'lower', null],
    workoutDays: [
      {
        id: 'upper',
        title: 'Upper Body',
        emoji: '',
        exercises: [
          { id: 'ul-bench', name: 'Bench Press', sets: 4, reps: 8 },
          { id: 'ul-row', name: 'Barbell Row', sets: 4, reps: 8 },
          { id: 'ul-ohp', name: 'Overhead Press', sets: 3, reps: 10 },
          { id: 'ul-pullup', name: 'Pull-Up', sets: 3, reps: 8 },
          { id: 'ul-curl', name: 'Bicep Curl', sets: 2, reps: 12 },
          { id: 'ul-tri', name: 'Skull Crusher', sets: 2, reps: 12 },
        ],
      },
      {
        id: 'lower',
        title: 'Lower Body',
        emoji: '',
        exercises: [
          { id: 'll-squat', name: 'Back Squat', sets: 4, reps: 8 },
          { id: 'll-rdl', name: 'Romanian Deadlift', sets: 3, reps: 10 },
          { id: 'll-lpress', name: 'Leg Press', sets: 3, reps: 12 },
          { id: 'll-lcurl', name: 'Leg Curl', sets: 3, reps: 12 },
          { id: 'll-calf', name: 'Calf Raise', sets: 3, reps: 20 },
        ],
      },
    ],
  },
  {
    id: 'full-body',
    name: 'Full Body 3×/Week',
    type: 'preset',
    schedule: [null, 'fullbody-a', null, 'fullbody-b', null, 'fullbody-a', null],
    workoutDays: [
      {
        id: 'fullbody-a',
        title: 'Full Body A',
        emoji: '',
        exercises: [
          { id: 'fb-squat', name: 'Back Squat', sets: 3, reps: 8 },
          { id: 'fb-bench', name: 'Bench Press', sets: 3, reps: 8 },
          { id: 'fb-row', name: 'Barbell Row', sets: 3, reps: 8 },
          { id: 'fb-ohp', name: 'Overhead Press', sets: 2, reps: 10 },
          { id: 'fb-curl', name: 'Bicep Curl', sets: 2, reps: 12 },
        ],
      },
      {
        id: 'fullbody-b',
        title: 'Full Body B',
        emoji: '',
        exercises: [
          { id: 'fb-dl', name: 'Deadlift', sets: 3, reps: 5 },
          { id: 'fb-incline', name: 'Incline DB Press', sets: 3, reps: 10 },
          { id: 'fb-pullup', name: 'Pull-Up', sets: 3, reps: 8 },
          { id: 'fb-lpress', name: 'Leg Press', sets: 3, reps: 12 },
          { id: 'fb-tri', name: 'Tricep Pushdown', sets: 2, reps: 15 },
        ],
      },
    ],
  },
  {
    id: 'bro_split_5_day',
    name: '5-Day Hypertrophy Split',
    type: 'preset',
    // Sun=rest, Mon=Chest, Tue=Back, Wed=Legs, Thu=Arms, Fri=Shoulders, Sat=rest
    schedule: [null, 'chest_day', 'back_day', 'legs_day', 'arms_day', 'shoulders_day', null],
    workoutDays: [
      {
        id: 'chest_day',
        title: 'Chest',
        emoji: '',
        exercises: [
          { id: 'pec_deck', name: 'Pec Deck', sets: 3, reps: 12 },
          { id: 'mach_chest_press', name: 'Machine Chest Press', sets: 3, reps: 10 },
          { id: 'incline_bp', name: 'Incline Bench Press', sets: 3, reps: 10 },
          { id: 'decline_bp', name: 'Decline Bench Press', sets: 3, reps: 10 },
        ],
      },
      {
        id: 'back_day',
        title: 'Back',
        emoji: '',
        exercises: [
          { id: 'wide_lat_pulldown', name: 'Wide Grip Lat Pulldown', sets: 3, reps: 12 },
          { id: 'meadows_row', name: 'Meadows Row', sets: 3, reps: 10 },
          { id: 'chest_supported_row', name: 'Chest Supported Row', sets: 3, reps: 10 },
        ],
      },
      {
        id: 'legs_day',
        title: 'Legs',
        emoji: '',
        exercises: [
          { id: 'leg_press', name: 'Leg Press', sets: 4, reps: 12 },
          { id: 'bulgarian_split_squat', name: 'Bulgarian Split Squat', sets: 3, reps: 10 },
          { id: 'leg_extension', name: 'Leg Extension', sets: 3, reps: 15 },
          { id: 'hamstring_curl', name: 'Hamstring Curl', sets: 3, reps: 12 },
          { id: 'calf_raises', name: 'Calf Raises', sets: 4, reps: 15 },
        ],
      },
      {
        id: 'arms_day',
        title: 'Arms',
        emoji: '',
        exercises: [
          { id: 'preacher_curl', name: 'Preacher Curl', sets: 3, reps: 12 },
          { id: 'incline_hammer_curl', name: 'Incline DB Hammer Curl', sets: 3, reps: 10 },
          { id: 'barbell_curl', name: 'Barbell Curls', sets: 3, reps: 10 },
          { id: 'bar_pressdown', name: 'Bar Press Down', sets: 3, reps: 12 },
          { id: 'overhead_pressdown', name: 'Overhead Press Down', sets: 3, reps: 12 },
          { id: 'dips', name: 'Machine / Bodyweight Dips', sets: 3, reps: 10 },
          { id: 'reverse_db_curl', name: 'Reverse DB Curls', sets: 3, reps: 15 },
          { id: 'wrist_curls', name: 'Pronated & Supinated Wrist Curls', sets: 3, reps: 15 },
        ],
      },
      {
        id: 'shoulders_day',
        title: 'Shoulders',
        emoji: '',
        exercises: [
          { id: 'shoulder_press', name: 'Shoulder Press', sets: 3, reps: 10 },
          { id: 'cable_lateral_raise', name: 'Cable Lateral Raises', sets: 3, reps: 15 },
          { id: 'reverse_pec_deck', name: 'Reverse Pec Deck', sets: 3, reps: 15 },
        ],
      },
    ],
  },
];

export const DEFAULT_ROUTINE_ID = 'ppl';
```

## File: middleware.ts
```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

const isOnboardingRoute = createRouteMatcher(['/onboarding']);
const isApiRoute = createRouteMatcher(['/api(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return;
  }

  const { userId, sessionClaims } = auth();
  auth().protect();

  // Onboarding gate — reads `onboarded` directly from the session token's
  // public metadata claim (no DB/API round-trip, no navigation delay).
  // Requires the "metadata" claim configured in Clerk Dashboard → Sessions.
  if (userId && !isOnboardingRoute(req) && !isApiRoute(req)) {
    const onboarded = (sessionClaims?.metadata as { onboarded?: boolean } | undefined)?.onboarded;

    if (!onboarded) {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

## File: app/api/profile/onboard/route.ts
```typescript
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
```

## File: app/routine/page.tsx
```typescript
'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Repeat } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { RoutineCalendar } from '@/components/routine/RoutineCalendar';
import { RoutineSelector } from '@/components/routine/RoutineSelector';
import { useRoutineStore } from '@/store/useRoutineStore';

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
};

export default function RoutinePage() {
  const activeRoutine = useRoutineStore((s) => s.activeRoutine);
  const routine       = activeRoutine();

  return (
    <PageTransition>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-4 pt-12 max-w-lg mx-auto"
        style={{
          paddingBottom: 'max(8rem, calc(env(safe-area-inset-bottom) + 7rem))',
        }}
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-7">
          <p className="section-label mb-1">Your Schedule</p>
          <h1
            className="font-display font-bold"
            style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)', color: 'var(--text-primary)' }}
          >
            Routine
          </h1>

          {/* Active routine pill */}
          <div
            className="inline-flex items-center gap-2 mt-2.5 px-3 py-1.5"
            style={{
              background:   'var(--accent-dim)',
              border:       '1px solid rgba(90,103,242,0.20)',
              borderRadius: 'var(--radius-full)',
            }}
          >
            <Repeat size={12} style={{ color: 'var(--accent)' }} />
            <span
              className="text-xs font-semibold"
              style={{ color: 'var(--accent)' }}
            >
              {routine.name}
            </span>
          </div>
        </motion.div>

        {/* Calendar */}
        <motion.div variants={fadeUp} className="mb-6">
          <div className="flex items-center gap-2 mb-3 px-1">
            <CalendarDays size={13} style={{ color: 'var(--text-muted)' }} />
            <p className="section-label">Calendar</p>
          </div>
          <RoutineCalendar />
        </motion.div>

        {/* Routine selector */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Repeat size={13} style={{ color: 'var(--text-muted)' }} />
            <p className="section-label">Choose Routine</p>
          </div>
          <RoutineSelector />
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
```

## File: app/settings/contact/page.tsx
```typescript
'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';

const LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/dexyprenuer',
    color: '#6e7681',
    svg: (color: string) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1JTogAaoYu/',
    color: '#1877f2',
    svg: (color: string) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/nogoistic?igsh=MTNydTVkN3dhM3FiMA==',
    color: '#e1306c',
    svg: (color: string) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="24" y="2" rx="5" ry="5" transform="rotate(90 24 2)"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
    ),
  },
];

export default function ContactPage() {
  const router = useRouter();

  return (
    <PageTransition>
      <div
        className="px-4 pt-10 max-w-lg mx-auto"
        style={{ paddingBottom: 'max(4rem, calc(env(safe-area-inset-bottom) + 3rem))' }}
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 tap-target"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </motion.button>

        <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Contact Us
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Built with 💪 for lifters everywhere.
        </p>

        <div className="space-y-3">
          {LINKS.map(({ label, href, color, svg }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="block">
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
                  style={{ background: `${color}1a` }}
                >
                  {svg(color)}
                </div>
                <span className="font-display font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {label}
                </span>
              </motion.div>
            </a>
          ))}
        </div>

        <p className="text-xs text-center mt-10" style={{ color: 'var(--text-muted)' }}>
          FitBro v1.0 · Made for daily lifters
        </p>
      </div>
    </PageTransition>
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

## File: components/exercise/SessionExerciseCard.tsx
```typescript
'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { Exercise } from '@/types';

interface SessionExerciseCardProps {
  exercise: Exercise;
  index:    number;
  total:    number;
  onDone:   () => void;
}

export const SessionExerciseCard = memo(function SessionExerciseCard({
  exercise,
  index,
  total,
  onDone,
}: SessionExerciseCardProps) {
  const getEffective = useSettingsStore((s) => s.getEffective);
  const { sets, reps } = getEffective(exercise.id, exercise.sets, exercise.reps);
  const isLast = index === total - 1;
  const progress = ((index) / total) * 100;

  return (
    <motion.div
      key={exercise.id}
      initial={{ opacity: 0, x: 48, scale: 0.97 }}
      animate={{ opacity: 1, x: 0,  scale: 1    }}
      exit={{    opacity: 0, x: -48, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="flex flex-col gap-4 pb-8"
    >
      {/* ── Progress header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <span
          className="section-label"
          style={{ color: 'var(--text-muted)' }}
        >
          Exercise {index + 1} of {total}
        </span>

        <div className="flex gap-1.5 items-center">
          {Array.from({ length: total }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width:      i === index ? 22 : 7,
                background: i < index
                  ? 'var(--success)'
                  : i === index
                  ? 'var(--accent)'
                  : 'var(--border-strong)',
                opacity: i > index ? 0.45 : 1,
              }}
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              style={{ height: 7, borderRadius: 9999 }}
            />
          ))}
        </div>
      </div>

      {/* ── Thin progress bar ────────────────────────────────────── */}
      <div
        style={{
          height: 3,
          borderRadius: 9999,
          background: 'var(--border)',
          overflow: 'hidden',
        }}
      >
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 240, damping: 30 }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, var(--accent), var(--secondary-accent))',
            borderRadius: 9999,
            boxShadow: '0 0 8px var(--accent-glow)',
          }}
        />
      </div>

      {/* ── Main exercise card ───────────────────────────────────── */}
      <GlassCard
        variant="accent"
        noPad
        className="relative overflow-hidden"
      >
        {/* Ambient glow — much softer on cream than it was on dark */}
        <div
          className="absolute -right-12 -top-12 w-40 h-40 rounded-full pointer-events-none"
          style={{
            background: 'var(--accent-glow)',
            filter: 'blur(48px)',
            opacity: 0.12,
          }}
        />
        <div
          className="absolute -left-8 bottom-0 w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: 'var(--secondary-accent-dim)',
            filter: 'blur(40px)',
            opacity: 0.18,
          }}
        />

        {/* Exercise name */}
        <div className="relative z-10 px-6 pt-7 pb-2 text-center">
          <p
            className="font-display font-bold leading-tight"
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 2rem)',
              color: 'var(--text-primary)',
            }}
          >
            {exercise.name}
          </p>
        </div>

        {/* Sets × Reps stat pair */}
        <div className="relative z-10 flex items-stretch justify-center gap-0 px-6 pb-6 pt-4">
          {[
            { label: 'Sets', value: sets },
            { label: 'Reps', value: reps },
          ].map(({ label, value }, idx) => (
            <div key={label} className="flex flex-col items-center flex-1 relative">
              {idx === 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: 0,
                    transform: 'translateX(-50%)',
                    width: 1,
                    height: '80%',
                    background: 'var(--border)',
                  }}
                />
              )}
              <motion.p
                key={value}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 340, damping: 24 }}
                className="font-display font-bold tabular-nums"
                style={{
                  fontSize: 'clamp(2.8rem, 12vw, 4rem)',
                  lineHeight: 1,
                  color: 'var(--accent)',
                }}
              >
                {value}
              </motion.p>
              <p
                className="text-sm font-semibold mt-1 uppercase tracking-widest"
                style={{ color: 'var(--text-muted)', letterSpacing: '0.12em' }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Instructions */}
        {exercise.instructions && (
          <div
            className="relative z-10 px-6 pb-6"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <p
              className="text-sm leading-relaxed pt-4 text-center"
              style={{ color: 'var(--text-secondary)' }}
            >
              {exercise.instructions}
            </p>
          </div>
        )}
      </GlassCard>

      {/* ── Done / Next CTA ──────────────────────────────────────── */}
      <Button
        variant="primary"
        size="xl"
        fullWidth
        leftIcon={
          isLast
            ? <CheckCircle size={20} strokeWidth={2.2} />
            : <ChevronRight size={20} strokeWidth={2.2} />
        }
        onClick={onDone}
      >
        {isLast ? 'Finish Workout' : 'Done — Next Exercise'}
      </Button>
    </motion.div>
  );
});
```

## File: components/routine/RoutineCalendar.tsx
```typescript
'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  startOfMonth, endOfMonth, eachDayOfInterval, getDay,
  isSameDay, isSameMonth, addMonths, subMonths, format,
} from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useRoutineStore } from '@/store/useRoutineStore';
import { useAppStore } from '@/store/useAppStore';

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function RoutineCalendar() {
  const [viewDate, setViewDate] = useState(new Date());
  const [direction, setDirection]  = useState(1); // 1 = forward, -1 = backward

  const activeRoutine   = useRoutineStore((s) => s.activeRoutine);
  const completedDates  = useAppStore((s) => s.completedDates);

  const routine    = activeRoutine();
  const today      = new Date();
  const monthStart = startOfMonth(viewDate);
  const monthEnd   = endOfMonth(viewDate);
  const days       = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const leadingBlanks = getDay(monthStart);

  const getWorkoutForDay = useCallback(
    (date: Date) => {
      const dow   = getDay(date);
      const dayId = routine.schedule[dow];
      if (!dayId) return null;
      return routine.workoutDays.find((d) => d.id === dayId) ?? null;
    },
    [routine]
  );

  function goNext() {
    setDirection(1);
    setViewDate((d) => addMonths(d, 1));
  }
  function goPrev() {
    setDirection(-1);
    setViewDate((d) => subMonths(d, 1));
  }

  const monthVariants = {
    enter:  (dir: number) => ({ opacity: 0, x: dir * 40 }),
    center: { opacity: 1, x: 0 },
    exit:   (dir: number) => ({ opacity: 0, x: dir * -40 }),
  };

  return (
    <GlassCard variant="elevated" noPad className="overflow-hidden">
      {/* Month header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <motion.button
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 420, damping: 26 }}
          onClick={goPrev}
          className="w-9 h-9 flex items-center justify-center tap-target"
          style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
          }}
          aria-label="Previous month"
        >
          <ChevronLeft size={16} style={{ color: 'var(--text-secondary)' }} />
        </motion.button>

        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.p
            key={format(viewDate, 'yyyy-MM')}
            custom={direction}
            variants={{
              enter:  (dir) => ({ opacity: 0, y: dir > 0 ? -10 : 10 }),
              center: { opacity: 1, y: 0 },
              exit:   (dir) => ({ opacity: 0, y: dir > 0 ? 10 : -10 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-bold text-base"
            style={{ color: 'var(--text-primary)' }}
          >
            {format(viewDate, 'MMMM yyyy')}
          </motion.p>
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 420, damping: 26 }}
          onClick={goNext}
          className="w-9 h-9 flex items-center justify-center tap-target"
          style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
          }}
          aria-label="Next month"
        >
          <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
        </motion.button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 px-3 pt-3 pb-1">
        {DAY_LABELS.map((d) => (
          <p
            key={d}
            className="text-center text-[10px] font-bold uppercase tracking-widest py-1"
            style={{ color: 'var(--text-muted)' }}
          >
            {d}
          </p>
        ))}
      </div>

      {/* Day grid */}
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={format(viewDate, 'yyyy-MM')}
          custom={direction}
          variants={monthVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="grid grid-cols-7 gap-y-1 px-3 pb-4"
        >
          {Array.from({ length: leadingBlanks }).map((_, i) => (
            <div key={`blank-${i}`} />
          ))}

          {days.map((date) => {
            const workout    = getWorkoutForDay(date);
            const isToday    = isSameDay(date, today);
            const dateStr    = format(date, 'yyyy-MM-dd');
            const isCompleted = completedDates.includes(dateStr);
            const inMonth    = isSameMonth(date, viewDate);
            const hasWorkout = !!workout;

            return (
              <motion.div
                key={dateStr}
                whileTap={hasWorkout ? { scale: 0.88 } : {}}
                transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                className="flex items-center justify-center py-1"
                style={{ opacity: inMonth ? 1 : 0.3 }}
              >
                <div
                  className="flex items-center justify-center text-[13px] font-semibold"
                  style={{
                    width:  '36px',
                    height: '36px',
                    borderRadius: isToday ? 'var(--radius-full)' : 'var(--radius-sm)',
                    background: isToday
                      ? 'var(--accent)'
                      : isCompleted
                      ? 'var(--success-dim)'
                      : hasWorkout
                      ? 'var(--accent-dim)'
                      : 'transparent',
                    color: isToday
                      ? '#fff'
                      : isCompleted
                      ? 'var(--success)'
                      : hasWorkout
                      ? 'var(--accent)'
                      : 'var(--text-secondary)',
                    boxShadow: isToday ? '0 4px 12px var(--accent-glow)' : 'none',
                    transition: 'background 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  {isCompleted && !isToday ? (
                    <CheckCircle2
                      size={14}
                      strokeWidth={2.5}
                      style={{ color: 'var(--success)' }}
                    />
                  ) : (
                    date.getDate()
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div
        className="flex items-center justify-center gap-5 px-5 py-3"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        {[
          { dot: 'var(--accent)',  label: 'Scheduled', filled: false },
          { dot: 'var(--success)', label: 'Completed', filled: true  },
          { dot: 'var(--accent)',  label: 'Today',     filled: true  },
        ].map(({ dot, label, filled }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: filled ? dot : 'transparent',
                border: filled ? 'none' : `2px solid ${dot}`,
                opacity: 0.85,
              }}
            />
            <span
              className="text-[10px] font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
```

## File: app/exercise/[dayId]/page.tsx
```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Info, Play, Dumbbell, Clock } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { ExerciseList } from '@/components/exercise/ExerciseList';
import { SessionExerciseCard } from '@/components/exercise/SessionExerciseCard';
import { SessionTimer } from '@/components/exercise/SessionTimer';
import { CompletionOverlay } from '@/components/exercise/CompletionOverlay';
import { useRoutineStore } from '@/store/useRoutineStore';
import { useSessionStore } from '@/store/useSessionStore';
import { useAppStore } from '@/store/useAppStore';

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

export default function WorkoutDayPage() {
  const { dayId } = useParams<{ dayId: string }>();
  const router    = useRouter();

  const workoutDayById         = useRoutineStore((s) => s.workoutDayById);
  const activeRoutine          = useRoutineStore((s) => s.activeRoutine);
  const { session, startSession, completeExercise, endSession } = useSessionStore();
  const recordWorkoutCompletion = useAppStore((s) => s.recordWorkoutCompletion);

  const [showInfo, setShowInfo]             = useState(false);
  const [completedSession, setCompletedSession] = useState<{
    duration: number;
    count: number;
  } | null>(null);

  const workoutDay   = workoutDayById(dayId);
  const routine      = activeRoutine();
  const isThisSession = session?.isActive && session.workoutDayId === dayId;
  const exercises    = workoutDay?.exercises ?? [];
  const currentIdx   = isThisSession ? session.currentExerciseIndex : 0;
  const currentExercise = exercises[currentIdx];
  const isRunning    = isThisSession;

  if (!workoutDay) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-dvh gap-3"
        style={{ color: 'var(--text-secondary)' }}
      >
        <Dumbbell size={36} style={{ color: 'var(--text-muted)' }} />
        <p className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Workout not found
        </p>
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    );
  }

  function handleStart() {
    startSession(workoutDay!.id, routine.id);
  }

  function handleExerciseDone() {
    if (!isThisSession || !session) return;
    const nextIdx = session.currentExerciseIndex + 1;
    completeExercise();

    if (nextIdx >= exercises.length) {
      const finished = endSession();
      if (finished) {
        recordWorkoutCompletion(dayId);
        setCompletedSession({
          duration: finished.duration ?? 0,
          count: exercises.length,
        });
      }
    }
  }

  if (completedSession) {
    return (
      <CompletionOverlay
        duration={completedSession.duration}
        exerciseCount={completedSession.count}
      />
    );
  }

  return (
    <PageTransition>
      <div
        className="min-h-dvh max-w-lg mx-auto"
        style={{
          paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
        }}
      >
        {/* ── Top bar ──────────────────────────────────────────── */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between px-4 py-3"
          style={{
            paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(24px) saturate(160%)',
            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <motion.button
            whileTap={{ scale: 0.90 }}
            transition={{ type: 'spring', stiffness: 420, damping: 26 }}
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-3 py-2 tap-target"
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span className="text-sm font-medium">Back</span>
          </motion.button>

          <AnimatePresence>
            {isRunning && session && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 340, damping: 26 }}
              >
                <SessionTimer startTimestamp={session.startTimestamp} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-4 pt-6">
          {/* ── Workout identity ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28, delay: 0.05 }}
            className="mb-6"
          >
            {/* Muscle icon hero */}
            <div
              className="w-16 h-16 flex items-center justify-center mb-4 overflow-hidden relative"
              style={{
                background: 'var(--accent-dim)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 4px 20px var(--accent-glow)',
              }}
            >
              <Image
                src={getMuscleIconPath(workoutDay.title)}
                alt={workoutDay.title}
                width={40}
                height={40}
              />
            </div>

            <h1
              className="font-display text-[1.75rem] font-bold leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {workoutDay.title}
            </h1>

            {/* Meta pills row */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold"
                style={{
                  background: 'var(--accent-dim)',
                  color: 'var(--accent)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--accent-dim)',
                }}
              >
                <Dumbbell size={11} />
                {exercises.length} exercises
              </span>

              {isRunning && session && (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold"
                  style={{
                    background: 'var(--success-dim)',
                    color: 'var(--success)',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid rgba(31,174,122,0.20)',
                  }}
                >
                  <Clock size={11} />
                  In progress
                </span>
              )}
            </div>
          </motion.div>

          {/* ── Pre-workout view ─────────────────────────────────── */}
          {!isRunning && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                className="space-y-4"
              >
                {/* How-it-works toggle */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                  onClick={() => setShowInfo((v) => !v)}
                  className="flex items-center gap-2 text-sm font-medium tap-target px-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <Info size={14} />
                  {showInfo ? 'Hide instructions' : 'How this works'}
                </motion.button>

                {/* Info panel — no height animation (avoids layout thrash) */}
                <AnimatePresence initial={false}>
                  {showInfo && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                      <GlassCard
                        variant="default"
                        className="text-sm leading-relaxed"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Work through each exercise one at a time. Tap{' '}
                        <strong style={{ color: 'var(--text-primary)' }}>Done</strong>{' '}
                        after completing all sets to advance. The timer stays accurate
                        even when you lock your screen.
                      </GlassCard>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Exercise list preview */}
                <ExerciseList exercises={exercises} />

                {/* Start CTA */}
                <div className="pt-2 pb-6">
                  <Button
                    variant="primary"
                    size="xl"
                    fullWidth
                    leftIcon={<Play size={20} fill="currentColor" />}
                    onClick={handleStart}
                  >
                    Start Workout
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* ── Active session view ──────────────────────────────── */}
          {isRunning && session && currentExercise && (
            <AnimatePresence mode="wait">
              <SessionExerciseCard
                key={currentIdx}
                exercise={currentExercise}
                index={currentIdx}
                total={exercises.length}
                onDone={handleExerciseDone}
              />
            </AnimatePresence>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
```

## File: app/exercise/page.tsx
```typescript
'use client';

import { motion } from 'framer-motion';
import { PageTransition } from '@/components/ui/PageTransition';
import { WorkoutCard } from '@/components/home/WorkoutCard';
import { useRoutineStore } from '@/store/useRoutineStore';
import type { WorkoutDay } from '@/types';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
};

export default function ExercisePage() {
  const activeRoutine = useRoutineStore((s) => s.activeRoutine);
  const routine = activeRoutine();

  return (
    <PageTransition>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-4 pt-12 max-w-lg mx-auto"
        style={{ paddingBottom: 'max(8rem, calc(env(safe-area-inset-bottom) + 7rem))' }}
      >
        <motion.div variants={fadeUp} className="mb-6">
          <p className="section-label mb-1">Your Workouts</p>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Workouts
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {routine.name}
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="space-y-3">
          {routine.workoutDays.map((day: WorkoutDay, i: number) => (
            <WorkoutCard key={day.id} workoutDay={day} index={i} />
          ))}
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
```
