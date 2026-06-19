'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Info, Play } from 'lucide-react';
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
  const router = useRouter();

  const workoutDayById = useRoutineStore((s) => s.workoutDayById);
  const activeRoutine = useRoutineStore((s) => s.activeRoutine);
  const { session, startSession, completeExercise, endSession } = useSessionStore();
  const recordWorkoutCompletion = useAppStore((s) => s.recordWorkoutCompletion);

  const [showInfo, setShowInfo] = useState(false);
  const [completedSession, setCompletedSession] = useState<{
    duration: number;
    count: number;
  } | null>(null);

  const workoutDay = workoutDayById(dayId);
  const routine = activeRoutine();
  const isThisSession = session?.isActive && session.workoutDayId === dayId;
  const exercises = workoutDay?.exercises ?? [];
  const currentIdx = isThisSession ? session.currentExerciseIndex : 0;
  const isRunning = isThisSession;

  if (!workoutDay) {
    return (
      <div className="px-4 pt-20 text-center" style={{ color: 'var(--text-secondary)' }}>
        Workout not found.
      </div>
    );
  }

  function handleStart() {
    startSession(workoutDay!.id, routine.id);
  }

  function handleExerciseDone() {
    if (!isThisSession) return;
    const nextIdx = session.currentExerciseIndex + 1;
    completeExercise();

    if (nextIdx >= exercises.length) {
      const finished = endSession();
      if (finished) {
        recordWorkoutCompletion();
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
      <div className="px-4 pt-10 pb-8 max-w-lg mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft size={18} />}
            onClick={() => router.back()}
          >
            Back
          </Button>
          {isRunning && session && (
            <SessionTimer startTimestamp={session.startTimestamp} />
          )}
        </div>

        {/* Title */}
        <div className="mb-7">
          <p className="text-4xl mb-2">{workoutDay.emoji}</p>
          <h1
            className="font-display text-2xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {workoutDay.title}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {exercises.length} exercises
          </p>
        </div>

        {/* Pre-session */}
        {!isRunning && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Info size={15} />}
                onClick={() => setShowInfo((v) => !v)}
              >
                {showInfo ? 'Hide instructions' : 'How this works'}
              </Button>

              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <GlassCard variant="default" className="p-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Work through each exercise one at a time. Tap{' '}
                      <strong style={{ color: 'var(--text-primary)' }}>Done</strong> after
                      completing all sets to advance. The timer stays accurate even when
                      you lock your screen.
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>

              <ExerciseList exercises={exercises} />

              <Button
                variant="primary"
                size="xl"
                fullWidth
                leftIcon={<Play size={20} />}
                onClick={handleStart}
                className="mt-2"
              >
                Start Workout
              </Button>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Active session */}
        {isRunning && session && (
          <AnimatePresence mode="wait">
            <SessionExerciseCard
              key={currentIdx}
              exercise={exercises[currentIdx]}
              index={currentIdx}
              total={exercises.length}
              onDone={handleExerciseDone}
            />
          </AnimatePresence>
        )}
      </div>
    </PageTransition>
  );
}