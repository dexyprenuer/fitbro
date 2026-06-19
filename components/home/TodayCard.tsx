'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BedDouble } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useRoutineStore } from '@/store/useRoutineStore';
import { format } from 'date-fns';

export function TodayCard() {
  const todaysWorkoutDay = useRoutineStore((s) => s.todaysWorkoutDay);
  const workoutDay = todaysWorkoutDay();
  const today = format(new Date(), 'EEEE, MMMM d');

  if (!workoutDay) {
    return (
      <GlassCard variant="default" className="p-5">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: 'var(--text-muted)' }}
        >
          {today}
        </p>
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--surface)' }}
          >
            <BedDouble size={22} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div>
            <p className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Rest Day
            </p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Recovery is part of the plan.
            </p>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <Link href={`/exercise/${workoutDay.id}`}>
      <motion.div whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.005 }}>
        <GlassCard variant="accent" noPad className="p-5 relative overflow-hidden">
          {/* Glow */}
          <div
            className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-40"
            style={{ background: 'var(--accent)' }}
          />

          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            {today} · Today
          </p>

          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-4xl mb-1">{workoutDay.emoji}</p>
              <p
                className="font-display text-2xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {workoutDay.title}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {workoutDay.exercises.length} exercises · Tap to begin
              </p>
            </div>

            <div
              className="w-11 h-11 rounded-full flex items-center justify-center mt-1 flex-shrink-0"
              style={{ background: 'var(--accent)', boxShadow: '0 0 16px var(--accent-glow)' }}
            >
              <ArrowRight size={18} className="text-white" />
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </Link>
  );
}