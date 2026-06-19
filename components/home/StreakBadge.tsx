'use client';

import { motion } from 'framer-motion';
import { Flame, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useAppStore } from '@/store/useAppStore';
import { isStreakAlive } from '@/lib/streak';

export function StreakBadge() {
  const { currentStreak, longestStreak, lastWorkoutDate } = useAppStore();
  const alive = isStreakAlive(lastWorkoutDate);

  return (
    <GlassCard variant="default" className="p-4 flex items-center gap-4">
      {/* Flame icon */}
      <motion.div
        animate={alive ? { scale: [1, 1.12, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{
          background: alive ? 'var(--accent-dim)' : 'var(--surface)',
          boxShadow: alive ? '0 0 16px var(--accent-glow)' : 'none',
        }}
      >
        <Flame
          size={22}
          style={{ color: alive ? 'var(--accent)' : 'var(--text-muted)' }}
        />
      </motion.div>

      {/* Current streak */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}
        >
          Current Streak
        </p>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span
            className="font-display text-3xl font-bold tabular-nums"
            style={{ color: 'var(--text-primary)' }}
          >
            {currentStreak}
          </span>
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {currentStreak === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>

      {/* Best */}
      <div className="text-right flex-shrink-0">
        <div className="flex items-center gap-1 justify-end mb-0.5">
          <TrendingUp size={12} style={{ color: 'var(--text-muted)' }} />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Best</p>
        </div>
        <p
          className="font-display text-xl font-bold tabular-nums"
          style={{ color: 'var(--text-secondary)' }}
        >
          {longestStreak}
        </p>
      </div>
    </GlassCard>
  );
}