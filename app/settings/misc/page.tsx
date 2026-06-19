'use client';

import { useRouter } from 'next/navigation';
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
      <div className="px-4 pt-10 max-w-lg mx-auto pb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[var(--text-secondary)] mb-6 active:text-[var(--text-primary)]"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-1">
          Workout Settings
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
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