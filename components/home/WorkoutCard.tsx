'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Dumbbell } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { WorkoutDay } from '@/types';
import { todayString } from '@/lib/streak';

interface WorkoutCardProps {
  workoutDay: WorkoutDay;
  index: number;
}

export function WorkoutCard({ workoutDay, index }: WorkoutCardProps) {
  const completedWorkoutIds = useAppStore((s) => s.completedWorkoutIds);
  const getEffective = useSettingsStore((s) => s.getEffective);

  const today = todayString();
  const isCompleted = completedWorkoutIds?.includes(`${today}:${workoutDay.id}`) ?? false;

  const exerciseSummary = workoutDay.exercises
    .map((ex) => {
      const { sets, reps } = getEffective(ex.id, ex.sets, ex.reps);
      return `${sets}×${reps}`;
    })
    .slice(0, 3)
    .join(' · ') + (workoutDay.exercises.length > 3 ? ' ···' : '');

  return (
    <Link href={`/exercise/${workoutDay.id}`} className="block">
      <motion.div
        whileTap={{ scale: 0.975 }}
        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
        className="relative overflow-hidden"
        style={{
          background: isCompleted ? 'var(--success-dim)' : 'var(--card)',
          border: `1px solid ${isCompleted ? 'var(--success-glow)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-lg)',
          boxShadow: isCompleted
            ? '0 4px 20px var(--success-glow)'
            : 'var(--shadow-sm)',
          transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        {/* Subtle completed shimmer overlay */}
        {isCompleted && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(120deg, transparent 30%, rgba(52,211,153,0.06) 60%, transparent 80%)',
              borderRadius: 'inherit',
            }}
          />
        )}

        <div className="relative flex items-center gap-4 p-4">
          {/* Emoji icon box */}
          <div
            className="w-12 h-12 flex items-center justify-center text-xl flex-shrink-0"
            style={{
              background: isCompleted ? 'var(--success-dim)' : 'var(--accent-dim)',
              borderRadius: 'var(--radius-md)',
              fontSize: '1.3rem',
            }}
          >
            {workoutDay.emoji}
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <p
              className="font-semibold text-[0.95rem] leading-snug truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {workoutDay.title}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <Dumbbell
                size={11}
                style={{ color: 'var(--text-muted)', flexShrink: 0 }}
              />
              <p
                className="text-xs truncate"
                style={{ color: 'var(--text-secondary)' }}
              >
                {exerciseSummary}
              </p>
            </div>
            {/* Exercise count pill */}
            <span
              className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{
                background: isCompleted ? 'var(--success-dim)' : 'var(--accent-dim)',
                color: isCompleted ? 'var(--success)' : 'var(--accent)',
              }}
            >
              {workoutDay.exercises.length} exercises
            </span>
          </div>

          {/* Right icon */}
          <motion.div
            animate={isCompleted ? { scale: 1, rotate: 0 } : { scale: 1 }}
            initial={{ scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            {isCompleted ? (
              <CheckCircle2
                size={22}
                strokeWidth={2}
                style={{ color: 'var(--success)' }}
              />
            ) : (
              <ChevronRight
                size={20}
                strokeWidth={1.8}
                style={{ color: 'var(--text-muted)' }}
              />
            )}
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}