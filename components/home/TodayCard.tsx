'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, BedDouble } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useRoutineStore } from '@/store/useRoutineStore';

function estimateMinutes(exercises: { sets: number }[]) {
  return Math.round(5 + exercises.reduce((sum, ex) => sum + ex.sets * 1.5, 0));
}

export function TodayCard() {
  const todaysWorkoutDay = useRoutineStore((s) => s.todaysWorkoutDay);
  const workoutDay = todaysWorkoutDay();

  if (!workoutDay) {
    return (
      <GlassCard variant="default" className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
          <p className="section-label">Today&apos;s Workout</p>
        </div>
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

  const minutes = estimateMinutes(workoutDay.exercises);

  return (
    <Link href={`/exercise/${workoutDay.id}`}>
      <motion.div whileTap={{ scale: 0.98 }}>
        <GlassCard variant="accent" noPad className="p-5 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <Calendar size={13} style={{ color: 'var(--text-secondary)' }} />
            <p className="section-label">Today&apos;s Workout</p>
          </div>

          <div className="flex items-start justify-between relative z-10 mb-6">
            <div>
              <p
                className="font-display font-bold"
                style={{ fontSize: '2.1rem', lineHeight: 1.05, color: 'var(--text-primary)' }}
              >
                {workoutDay.title}
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                {workoutDay.exercises.length} exercises · ~{minutes} min
              </p>
            </div>

            <Image
              src="/illustrations/hero/dumbbell.png"
              alt=""
              width={96}
              height={96}
              className="flex-shrink-0 -mt-1 -mr-1"
              priority
            />
          </div>

          <div
            className="relative z-10 flex items-center justify-between px-5 py-3.5"
            style={{
              background: 'var(--accent)',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 8px 20px var(--accent-glow)',
            }}
          >
            <span className="font-display font-semibold text-white">Start Workout</span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.95)' }}
            >
              <ArrowRight size={16} style={{ color: 'var(--accent)' }} />
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </Link>
  );
}