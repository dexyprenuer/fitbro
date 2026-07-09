'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, RotateCcw, ChevronDown } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { Exercise } from '@/types';

interface WorkoutMiscEditorProps {
  exercises: Exercise[];
  workoutTitle: string;
  defaultOpen?: boolean;
}

export function WorkoutMiscEditor({ exercises, workoutTitle, defaultOpen = true }: WorkoutMiscEditorProps) {
  const { getEffective, setOverride, removeOverride, resetGroup, overrides } = useSettingsStore();
  const [open, setOpen] = useState(defaultOpen);

  const exerciseIds = exercises.map((ex) => ex.id);
  const hasAnyOverride = exerciseIds.some((id) => !!overrides[id]);

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
      {/* Collapsible group header */}
      <div className="flex items-center justify-between px-1">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5"
        >
          <p className="section-label">{workoutTitle}</p>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </motion.div>
        </motion.button>

        {hasAnyOverride && (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => resetGroup(exerciseIds)}
            className="flex items-center gap-1 text-xs font-medium"
            style={{ color: 'var(--accent)' }}
          >
            <RotateCcw size={11} />
            Reset section
          </motion.button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-3">
              {exercises.map((ex) => {
                const { sets, reps } = getEffective(ex.id, ex.sets, ex.reps);
                const isOverridden = !!overrides[ex.id];

                return (
                  <div
                    key={ex.id}
                    className="p-4"
                    style={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {ex.name}
                      </p>
                      {isOverridden && (
                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={() => reset(ex)}
                          className="flex items-center gap-1 text-xs font-medium"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <RotateCcw size={12} />
                          Reset
                        </motion.button>
                      )}
                    </div>

                    <div className="flex items-center gap-6">
                      {[
                        { label: 'Sets', value: sets, field: 'sets' as const },
                        { label: 'Reps', value: reps, field: 'reps' as const },
                      ].map(({ label, value, field }) => (
                        <div key={field} className="flex items-center gap-3">
                          <span className="text-xs w-8" style={{ color: 'var(--text-secondary)' }}>
                            {label}
                          </span>
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => change(ex, field, -1)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center"
                              style={{ background: 'var(--surface)' }}
                            >
                              <Minus size={14} style={{ color: 'var(--text-secondary)' }} />
                            </motion.button>
                            <span
                              className="font-display font-bold w-6 text-center tabular-nums"
                              style={{ color: 'var(--text-primary)' }}
                            >
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
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}