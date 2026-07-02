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
- Only files matching these patterns are included: app/exercise/*/page.tsx, components/exercise/ExerciseList.tsx, components/exercise/SessionExerciseCard.tsx
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
app/
  exercise/
    [dayId]/
      page.tsx
components/
  exercise/
    ExerciseList.tsx
    SessionExerciseCard.tsx
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
  const progress = ((index) / total) * 100; // % complete before this one

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

        {/* Dot/pill stepper */}
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
        {/* Ambient glow blob */}
        <div
          className="absolute -right-12 -top-12 w-40 h-40 rounded-full pointer-events-none"
          style={{
            background: 'var(--accent-glow)',
            filter: 'blur(36px)',
            opacity: 0.35,
          }}
        />
        <div
          className="absolute -left-8 bottom-0 w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: 'var(--secondary-accent-dim)',
            filter: 'blur(28px)',
            opacity: 0.5,
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
            <div key={label} className="flex flex-col items-center flex-1">
              {idx === 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '50%',
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

## File: app/exercise/[dayId]/page.tsx
```typescript
'use client';

import { useState } from 'react';
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
            {/* Emoji hero */}
            <div
              className="w-16 h-16 flex items-center justify-center text-3xl mb-4"
              style={{
                background: 'var(--accent-dim)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 4px 20px var(--accent-glow)',
              }}
            >
              {workoutDay.emoji}
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
                    border: '1px solid rgba(52,211,153,0.20)',
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
