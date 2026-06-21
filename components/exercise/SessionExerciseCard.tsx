'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { Exercise } from '@/types';

interface SessionExerciseCardProps {
  exercise: Exercise;
  index:    number;
  total:    number;
  onDone:   () => void;
}

export const SessionExerciseCard = memo(function SessionExerciseCard({
  exercise,
  index,
  total,
  onDone,
}: SessionExerciseCardProps) {
  const getEffective = useSettingsStore((s) => s.getEffective);
  const { sets, reps } = getEffective(exercise.id, exercise.sets, exercise.reps);
  const isLast = index === total - 1;
  const progress = ((index) / total) * 100; // % complete before this one

  return (
    <motion.div
      key={exercise.id}
      initial={{ opacity: 0, x: 48, scale: 0.97 }}
      animate={{ opacity: 1, x: 0,  scale: 1    }}
      exit={{    opacity: 0, x: -48, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="flex flex-col gap-4 pb-8"
    >
      {/* ── Progress header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <span
          className="section-label"
          style={{ color: 'var(--text-muted)' }}
        >
          Exercise {index + 1} of {total}
        </span>

        {/* Dot/pill stepper */}
        <div className="flex gap-1.5 items-center">
          {Array.from({ length: total }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width:      i === index ? 22 : 7,
                background: i < index
                  ? 'var(--success)'
                  : i === index
                  ? 'var(--accent)'
                  : 'var(--border-strong)',
                opacity: i > index ? 0.45 : 1,
              }}
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              style={{ height: 7, borderRadius: 9999 }}
            />
          ))}
        </div>
      </div>

      {/* ── Thin progress bar ────────────────────────────────────── */}
      <div
        style={{
          height: 3,
          borderRadius: 9999,
          background: 'var(--border)',
          overflow: 'hidden',
        }}
      >
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 240, damping: 30 }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, var(--accent), var(--secondary-accent))',
            borderRadius: 9999,
            boxShadow: '0 0 8px var(--accent-glow)',
          }}
        />
      </div>

      {/* ── Main exercise card ───────────────────────────────────── */}
      <GlassCard
        variant="accent"
        noPad
        className="relative overflow-hidden"
      >
        {/* Ambient glow blob */}
        <div
          className="absolute -right-12 -top-12 w-40 h-40 rounded-full pointer-events-none"
          style={{
            background: 'var(--accent-glow)',
            filter: 'blur(36px)',
            opacity: 0.35,
          }}
        />
        <div
          className="absolute -left-8 bottom-0 w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: 'var(--secondary-accent-dim)',
            filter: 'blur(28px)',
            opacity: 0.5,
          }}
        />

        {/* Exercise name */}
        <div className="relative z-10 px-6 pt-7 pb-2 text-center">
          <p
            className="font-display font-bold leading-tight"
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 2rem)',
              color: 'var(--text-primary)',
            }}
          >
            {exercise.name}
          </p>
        </div>

        {/* Sets × Reps stat pair */}
        <div className="relative z-10 flex items-stretch justify-center gap-0 px-6 pb-6 pt-4">
          {[
            { label: 'Sets', value: sets },
            { label: 'Reps', value: reps },
          ].map(({ label, value }, idx) => (
            <div key={label} className="flex flex-col items-center flex-1">
              {idx === 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 1,
                    height: '80%',
                    background: 'var(--border)',
                  }}
                />
              )}
              <motion.p
                key={value}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 340, damping: 24 }}
                className="font-display font-bold tabular-nums"
                style={{
                  fontSize: 'clamp(2.8rem, 12vw, 4rem)',
                  lineHeight: 1,
                  color: 'var(--accent)',
                }}
              >
                {value}
              </motion.p>
              <p
                className="text-sm font-semibold mt-1 uppercase tracking-widest"
                style={{ color: 'var(--text-muted)', letterSpacing: '0.12em' }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Instructions */}
        {exercise.instructions && (
          <div
            className="relative z-10 px-6 pb-6"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <p
              className="text-sm leading-relaxed pt-4 text-center"
              style={{ color: 'var(--text-secondary)' }}
            >
              {exercise.instructions}
            </p>
          </div>
        )}
      </GlassCard>

      {/* ── Done / Next CTA ──────────────────────────────────────── */}
      <Button
        variant="primary"
        size="xl"
        fullWidth
        leftIcon={
          isLast
            ? <CheckCircle size={20} strokeWidth={2.2} />
            : <ChevronRight size={20} strokeWidth={2.2} />
        }
        onClick={onDone}
      >
        {isLast ? 'Finish Workout' : 'Done — Next Exercise'}
      </Button>
    </motion.div>
  );
});