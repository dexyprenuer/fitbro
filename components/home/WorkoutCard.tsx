'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAppStore } from '@/store/useAppStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { WorkoutDay } from '@/types';
import { todayString } from '@/lib/streak';

interface WorkoutCardProps {
  workoutDay: WorkoutDay;
  index: number;
}

export function WorkoutCard({ workoutDay, index }: WorkoutCardProps) {
  const completedDates = useAppStore((s) => s.completedDates);
  const getEffective = useSettingsStore((s) => s.getEffective);

  const doneToday = completedDates.includes(todayString());

  return (
    <Link href={`/exercise/${workoutDay.id}`}>
      <motion.div
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.07, duration: 0.3 }}
      >
        <GlassCard className="p-4 flex items-center gap-4 active:bg-[var(--surface-hover)]">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: 'var(--accent-dim)' }}
          >
            {workoutDay.emoji}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[var(--text-primary)] truncate">
              {workoutDay.title}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              {workoutDay.exercises.map((ex) => {
                const { sets, reps } = getEffective(ex.id, ex.sets, ex.reps);
                return `${sets}×${reps}`;
              }).slice(0, 3).join(' · ')}
              {workoutDay.exercises.length > 3 && ' ···'}
            </p>
          </div>

          {doneToday ? (
            <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
          ) : (
            <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
          )}
        </GlassCard>
      </motion.div>
    </Link>
  );
}