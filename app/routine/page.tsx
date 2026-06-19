'use client';

import { PageTransition } from '@/components/ui/PageTransition';
import { RoutineCalendar } from '@/components/routine/RoutineCalendar';
import { RoutineSelector } from '@/components/routine/RoutineSelector';
import { useRoutineStore } from '@/store/useRoutineStore';

export default function RoutinePage() {
  const activeRoutine = useRoutineStore((s) => s.activeRoutine);
  const routine = activeRoutine();

  return (
    <PageTransition>
      <div className="px-4 pt-12 max-w-lg mx-auto space-y-6 pb-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--text-primary)]">
            Routine
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Active: {routine.name}
          </p>
        </div>

        <div>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 px-1">
            Calendar
          </p>
          <RoutineCalendar />
        </div>

        <div>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 px-1">
            Choose Routine
          </p>
          <RoutineSelector />
        </div>
      </div>
    </PageTransition>
  );
}