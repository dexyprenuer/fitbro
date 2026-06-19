'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { Exercise } from '@/types';

interface WorkoutMiscEditorProps {
  exercises: Exercise[];
  workoutTitle: string;
}

export function WorkoutMiscEditor({ exercises, workoutTitle }: WorkoutMiscEditorProps) {
  const { getEffective, setOverride, removeOverride, overrides } = useSettingsStore();

  function change(ex: Exercise, field: 'sets' | 'reps', delta: number) {
    const current = getEffective(ex.id, ex.sets, ex.reps);
    const next = Math.max(1, Math.min(99, current[field] + delta));
    setOverride({
      exerciseId: ex.id,
      customSets: field === 'sets' ? next : current.sets,
      customReps: field === 'reps' ? next : current.reps,
    });
  }

  function reset(ex: Exercise) {
    removeOverride(ex.id);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider px-1">
        {workoutTitle}
      </p>
      {exercises.map((ex) => {
        const { sets, reps } = getEffective(ex.id, ex.sets, ex.reps);
        const isOverridden = !!overrides[ex.id];

        return (
          <GlassCard key={ex.id} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-[var(--text-primary)] text-sm">{ex.name}</p>
              {isOverridden && (
                <button
                  onClick={() => reset(ex)}
                  className="flex items-center gap-1 text-xs text-[var(--text-muted)] active:text-[var(--warning)]"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              )}
            </div>

            <div className="flex items-center gap-6">
              {[
                { label: 'Sets', value: sets, field: 'sets' as const },
                { label: 'Reps', value: reps, field: 'reps' as const },
              ].map(({ label, value, field }) => (
                <div key={field} className="flex items-center gap-3">
                  <span className="text-xs text-[var(--text-secondary)] w-8">{label}</span>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => change(ex, field, -1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--surface)' }}
                    >
                      <Minus size={14} style={{ color: 'var(--text-secondary)' }} />
                    </motion.button>
                    <span className="font-display font-bold text-[var(--text-primary)] w-6 text-center tabular-nums">
                      {value}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => change(ex, field, 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--accent-dim)' }}
                    >
                      <Plus size={14} style={{ color: 'var(--accent)' }} />
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}