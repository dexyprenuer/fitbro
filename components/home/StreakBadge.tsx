'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { isStreakAlive } from '@/lib/streak';

export const StreakBadge = memo(function StreakBadge() {
  const currentStreak = useAppStore((s) => s.currentStreak);
  const longestStreak = useAppStore((s) => s.longestStreak);
  const lastWorkoutDate = useAppStore((s) => s.lastWorkoutDate);
  const alive = isStreakAlive(lastWorkoutDate);

  return (
    <div
      className="relative overflow-hidden p-4"
      style={{
        background: alive
          ? `linear-gradient(135deg, var(--accent-dim) 0%, var(--secondary-accent-dim) 100%)`
          : 'var(--card)',
        border: `1px solid ${alive ? 'var(--glass-border-strong)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-xl)',
        boxShadow: alive ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
      }}
    >
      {/* Background glow blob — only when alive, no JS animation needed */}
      {alive && (
        <div
          className="absolute -top-6 -right-6 w-28 h-28 rounded-full pointer-events-none"
          style={{
            background: 'var(--accent-glow)',
            filter: 'blur(28px)',
            opacity: 0.4,
          }}
        />
      )}

      <div className="relative flex items-center gap-4">
        {/* Flame icon */}
        <motion.div
          /* Only animate when alive, not on every render */
          animate={alive ? { scale: [1, 1.10, 1] } : { scale: 1 }}
          transition={
            alive
              ? { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
              : {}
          }
          className={`w-14 h-14 flex items-center justify-center flex-shrink-0 ${alive ? 'streak-alive' : ''}`}
          style={{
            background: alive
              ? 'linear-gradient(135deg, var(--accent-dim), var(--secondary-accent-dim))'
              : 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <Flame
            size={26}
            strokeWidth={1.8}
            style={{ color: alive ? 'var(--accent)' : 'var(--text-muted)' }}
          />
        </motion.div>

        {/* Current streak number */}
        <div className="flex-1 min-w-0">
          <p
            className="section-label mb-0.5"
            style={{ color: alive ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            Current Streak
          </p>
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-display font-bold tabular-nums"
              style={{
                fontSize: '2.4rem',
                lineHeight: 1,
                color: 'var(--text-primary)',
              }}
            >
              {currentStreak}
            </span>
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              {currentStreak === 1 ? 'day' : 'days'}
            </span>
          </div>

          {/* Status chip */}
          <div
            className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full"
            style={{
              background: alive ? 'var(--accent-dim)' : 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <Zap
              size={10}
              style={{ color: alive ? 'var(--accent)' : 'var(--text-muted)' }}
            />
            <span
              className="text-[10px] font-semibold"
              style={{ color: alive ? 'var(--accent)' : 'var(--text-muted)' }}
            >
              {alive ? 'On fire!' : 'Start a streak'}
            </span>
          </div>
        </div>

        {/* Best streak */}
        <div
          className="flex-shrink-0 text-right pl-3"
          style={{
            borderLeft: '1px solid var(--border)',
          }}
        >
          <div
            className="flex items-center gap-1 justify-end mb-0.5"
          >
            <TrendingUp
              size={11}
              style={{ color: 'var(--text-muted)' }}
            />
            <span
              className="section-label"
              style={{ color: 'var(--text-muted)' }}
            >
              Best
            </span>
          </div>
          <span
            className="font-display font-bold tabular-nums"
            style={{
              fontSize: '1.6rem',
              lineHeight: 1,
              color: 'var(--text-secondary)',
            }}
          >
            {longestStreak}
          </span>
          <p
            className="text-[10px] mt-0.5"
            style={{ color: 'var(--text-muted)' }}
          >
            days
          </p>
        </div>
      </div>
    </div>
  );
});