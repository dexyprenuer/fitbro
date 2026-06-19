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