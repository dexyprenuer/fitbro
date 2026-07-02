'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { WorkoutDay } from '@/types';
import { todayString } from '@/lib/streak';

interface WorkoutCardProps {
  workoutDay: WorkoutDay;
  index: number;
}

function getMuscleIconPath(title: string) {
  const t = title.toLowerCase();
  if (t.includes('chest')) return '/illustrations/muscles/chest.jpg';
  if (t.includes('back')) return '/illustrations/muscles/back.jpg';
  if (t.includes('leg')) return '/illustrations/muscles/legs.jpg';
  if (t.includes('arm')) return '/illustrations/muscles/arms.jpg';
  if (t.includes('shoulder')) return '/illustrations/muscles/shoulders.jpg';
  if (t.includes('ab') || t.includes('core')) return '/illustrations/muscles/abs.jpg';
  return '/illustrations/muscles/full-body.jpg';
}

function estimateMinutes(exercises: { sets: number }[]) {
  return Math.round(5 + exercises.reduce((sum, ex) => sum + ex.sets * 1.5, 0));
}

export function WorkoutCard({ workoutDay, index }: WorkoutCardProps) {
  const completedWorkoutIds = useAppStore((s) => s.completedWorkoutIds);
  const today = todayString();
  const isCompleted = completedWorkoutIds?.includes(`${today}:${workoutDay.id}`) ?? false;
  const minutes = estimateMinutes(workoutDay.exercises);

  return (
    <Link href={`/exercise/${workoutDay.id}`} className="block">
      <motion.div
        whileTap={{ scale: 0.975 }}
        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
        className="flex items-center gap-4 p-4"
        style={{
          background: 'var(--card)',
          border: `1px solid ${isCompleted ? 'var(--success-glow)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: isCompleted ? 'var(--success-dim)' : 'var(--accent-dim)' }}
        >
          <Image
            src={getMuscleIconPath(workoutDay.title)}
            alt={workoutDay.title}
            width={30}
            height={30}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="font-display font-semibold text-[1.05rem] leading-snug truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            {workoutDay.title}
          </p>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {workoutDay.exercises.length} exercises · ~{minutes} min
          </p>
        </div>

        {isCompleted ? (
          <CheckCircle2 size={22} strokeWidth={2} style={{ color: 'var(--success)' }} />
        ) : (
          <ChevronRight size={20} strokeWidth={1.8} style={{ color: 'var(--text-muted)' }} />
        )}
      </motion.div>
    </Link>
  );
}