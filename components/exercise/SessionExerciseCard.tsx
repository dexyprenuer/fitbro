'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { Exercise } from '@/types';

interface SessionExerciseCardProps {
  exercise: Exercise;
  index: number;
  total: number;
  onDone: () => void;
}

export function SessionExerciseCard({
  exercise,
  index,
  total,
  onDone,
}: SessionExerciseCardProps) {
  const getEffective = useSettingsStore((s) => s.getEffective);
  const { sets, reps } = getEffective(exercise.id, exercise.sets, exercise.reps);
  const isLast = index === total - 1;

  return (
    <motion.div
      key={exercise.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="flex flex-col gap-5"
    >
      {/* Step dots */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}
        >
          Exercise {index + 1} of {total}
        </span>
        <div className="flex gap-1.5 items-center">
          {Array.from({ length: total }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === index ? 20 : 6,
                background:
                  i < index
                    ? 'var(--success)'
                    : i === index
                    ? 'var(--accent)'
                    : 'var(--border)',
              }}
              transition={{ duration: 0.3 }}
              className="h-1.5 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Exercise card */}
      <GlassCard variant="accent" className="p-6 text-center relative overflow-hidden">
        {/* Ambient glow blob */}
        <div
          className="absolute -right-10 -top-10 w-36 h-36 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'var(--accent-glow)', opacity: 0.4 }}
        />

        <p
          className="font-display text-3xl font-bold mb-4 relative z-10"
          style={{ color: 'var(--text-primary)' }}
        >
          {exercise.name}
        </p>

        <div className="flex items-center justify-center gap-8 relative z-10">
          {[
            { label: 'Sets', value: sets },
            { label: 'Reps', value: reps },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p
                className="font-display text-5xl font-bold tabular-nums"
                style={{ color: 'var(--accent)' }}
              >
                {value}
              </p>
              <p
                className="text-sm font-medium mt-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {exercise.instructions && (
          <p
            className="text-sm leading-relaxed mt-5 relative z-10"
            style={{ color: 'var(--text-secondary)' }}
          >
            {exercise.instructions}
          </p>
        )}
      </GlassCard>

      {/* Done button */}
      <Button
        variant="primary"
        size="xl"
        fullWidth
        leftIcon={<CheckCircle size={20} />}
        onClick={onDone}
      >
        {isLast ? 'Finish Workout' : 'Done — Next'}
      </Button>
    </motion.div>
  );
}