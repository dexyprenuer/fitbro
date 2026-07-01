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