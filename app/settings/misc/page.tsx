'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { WorkoutMiscEditor } from '@/components/settings/WorkoutMiscEditor';
import { useRoutineStore } from '@/store/useRoutineStore';
import { useSettingsStore } from '@/store/useSettingsStore';

export default function MiscSettingsPage() {
  const router = useRouter();
  const activeRoutine = useRoutineStore((s) => s.activeRoutine);
  const routine = activeRoutine();
  const overrides = useSettingsStore((s) => s.overrides);
  const resetAll = useSettingsStore((s) => s.resetAll);
  const [confirmingResetAll, setConfirmingResetAll] = useState(false);

  const hasAnyOverride = Object.keys(overrides).length > 0;

  function handleResetAll() {
    if (!confirmingResetAll) {
      setConfirmingResetAll(true);
      setTimeout(() => setConfirmingResetAll(false), 3000);
      return;
    }
    resetAll();
    setConfirmingResetAll(false);
  }

  return (
    <PageTransition>
      <div
        className="px-4 pt-10 max-w-lg mx-auto"
        style={{ paddingBottom: 'max(4rem, calc(env(safe-area-inset-bottom) + 3rem))' }}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 tap-target"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </motion.button>

          {hasAnyOverride && (
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleResetAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
              style={{
                background: confirmingResetAll ? 'var(--destructive-dim)' : 'var(--surface)',
                color: confirmingResetAll ? 'var(--destructive)' : 'var(--text-secondary)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border)',
              }}
            >
              <RotateCcw size={12} />
              {confirmingResetAll ? 'Tap to confirm' : 'Reset All'}
            </motion.button>
          )}
        </div>

        <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Workout Settings
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Customize sets and reps per exercise.
        </p>

        <div className="space-y-8">
          {routine.workoutDays.map((day, i) => (
            <WorkoutMiscEditor
              key={day.id}
              exercises={day.exercises}
              workoutTitle={day.title}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}