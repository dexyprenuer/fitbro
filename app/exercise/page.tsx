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