'use client';

import { PageTransition } from '@/components/ui/PageTransition';
import { WorkoutCard } from '@/components/home/WorkoutCard';
import { useRoutineStore } from '@/store/useRoutineStore';
import type { WorkoutDay } from '@/types';

export default function ExercisePage() {
  const activeRoutine = useRoutineStore((s) => s.activeRoutine);
  const routine = activeRoutine();

  return (
    <PageTransition>
      <div className="px-4 pt-12 max-w-lg mx-auto">
        <h1 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-1">
          Workouts
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">{routine.name}</p>
        <div className="space-y-2">
          {routine.workoutDays.map((day: WorkoutDay, i: number) => (
            <WorkoutCard key={day.id} workoutDay={day} index={i} />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}