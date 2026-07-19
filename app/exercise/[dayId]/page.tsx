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
import { ChainInterstitial } from '@/components/exercise/ChainInterstitial';
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

  const workoutDayById          = useRoutineStore((s) => s.workoutDayById);
  const workoutDayByTitle       = useRoutineStore((s) => s.workoutDayByTitle);
  const activeRoutine           = useRoutineStore((s) => s.activeRoutine);
  const { session, startSession, completeExercise, endSession } = useSessionStore();
  const recordWorkoutCompletion = useAppStore((s) => s.recordWorkoutCompletion);

  const [showInfo, setShowInfo] = useState(false);
  const [completedSession, setCompletedSession] = useState<{
    duration: number;
    count: number;
    muscleGroups: string[];
  } | null>(null);

  // Tracks which day titles have already been run in this chain, so a day
  // that's tagged by more than one other day (or cross-tags back) never
  // repeats. Also drives whether we show the interstitial or the trophy.
  const [chainedTitles, setChainedTitles] = useState<string[]>([]);
  const [nextChainDay, setNextChainDay] = useState<{ id: string; title: string } | null>(null);
  const [totalChainDuration, setTotalChainDuration] = useState(0);
  const [totalChainCount, setTotalChainCount] = useState(0);
  const [allTrainedGroups, setAllTrainedGroups] = useState<string[]>([]);

  const workoutDay    = workoutDayById(dayId);
  const routine        = activeRoutine();
  const isThisSession   = session?.isActive && session.workoutDayId === dayId;
  const exercises       = workoutDay?.exercises ?? [];
  const currentIdx      = isThisSession ? session.currentExerciseIndex : 0;
  const currentExercise = exercises[currentIdx];
  const isRunning        = isThisSession;

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

  // Finds the next untried tagged muscle group that maps to a real, distinct
  // WorkoutDay in the active routine.
  function findNextChainDay(finishedDay: typeof workoutDay, triedTitles: string[]) {
    if (!finishedDay?.muscleGroups) return null;
    for (const tag of finishedDay.muscleGroups) {
      if (tag.trim().toLowerCase() === finishedDay.title.trim().toLowerCase()) continue; // skip self
      if (triedTitles.includes(tag.toLowerCase())) continue; // already run
      const match = workoutDayByTitle(tag);
      if (match && match.id !== finishedDay.id) {
        return { id: match.id, title: match.title };
      }
    }
    return null;
  }

  function handleExerciseDone() {
    if (!isThisSession || !session) return;
    const nextIdx = session.currentExerciseIndex + 1;
    completeExercise();

    if (nextIdx >= exercises.length) {
      const finished = endSession();
      if (!finished) return;

      recordWorkoutCompletion(dayId);

      const finishedTitleLower = workoutDay!.title.trim().toLowerCase();
      const updatedTriedTitles = [...chainedTitles, finishedTitleLower];
      const updatedDuration = totalChainDuration + (finished.duration ?? 0);
      const updatedCount = totalChainCount + exercises.length;
      const updatedGroups = [
        ...allTrainedGroups,
        ...(workoutDay!.muscleGroups ?? []).filter((g) => !allTrainedGroups.includes(g)),
      ];

      const next = findNextChainDay(workoutDay, updatedTriedTitles);

      setChainedTitles(updatedTriedTitles);
      setTotalChainDuration(updatedDuration);
      setTotalChainCount(updatedCount);
      setAllTrainedGroups(updatedGroups);

      if (next) {
        setNextChainDay(next);
      } else {
        setCompletedSession({
          duration: updatedDuration,
          count: updatedCount,
          muscleGroups: updatedGroups,
        });
      }
    }
  }

  function handleContinueChain() {
    if (!nextChainDay) return;
    router.push(`/exercise/${nextChainDay.id}`);
  }

  function handleStopChain() {
    setCompletedSession({
      duration: totalChainDuration,
      count: totalChainCount,
      muscleGroups: allTrainedGroups,
    });
    setNextChainDay(null);
  }

  if (nextChainDay) {
    return (
      <ChainInterstitial
        completedTitle={workoutDay.title}
        nextTitle={nextChainDay.title}
        onContinue={handleContinueChain}
        onStopHere={handleStopChain}
      />
    );
  }

  if (completedSession) {
    return (
      <CompletionOverlay
        duration={completedSession.duration}
        exerciseCount={completedSession.count}
        muscleGroups={completedSession.muscleGroups}
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