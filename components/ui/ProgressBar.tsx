'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ProgressColor = 'accent' | 'success' | 'warning';

interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  showLabel?: boolean;
  color?: ProgressColor;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  /** Render as N discrete segments instead of one continuous bar */
  segments?: number;
}

const colorMap: Record<ProgressColor, { bar: string; glow: string }> = {
  accent:  { bar: 'var(--accent)',  glow: 'var(--accent-glow)' },
  success: { bar: 'var(--success)', glow: 'var(--success-glow)' },
  warning: { bar: 'var(--warning)', glow: 'rgba(201,154,61,0.30)' },
};

const sizeMap = { sm: 'h-1', md: 'h-2', lg: 'h-3' };

export function ProgressBar({
  value,
  className,
  showLabel,
  color = 'accent',
  size = 'md',
  animated = true,
  segments,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const { bar, glow } = colorMap[color];

  if (segments && segments > 0) {
    const filled = Math.round((clamped / 100) * segments);
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className={cn('flex-1 flex gap-1.5', sizeMap[size])}>
          {Array.from({ length: segments }).map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-full"
              style={{
                background: i < filled ? bar : 'var(--border)',
                boxShadow: i < filled ? `0 0 6px ${glow}` : 'none',
              }}
              initial={animated ? { opacity: 0, scaleY: 0.4 } : false}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.25, delay: animated ? i * 0.04 : 0 }}
            />
          ))}
        </div>
        {showLabel && (
          <span
            className="text-xs font-semibold tabular-nums w-9 text-right"
            style={{ color: 'var(--text-secondary)' }}
          >
            {Math.round(clamped)}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn('flex-1 rounded-full overflow-hidden', sizeMap[size])}
        style={{ background: 'var(--border)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${bar} 0%, ${bar}cc 100%)`,
            boxShadow: clamped > 0 ? `0 0 8px ${glow}` : 'none',
          }}
          initial={animated ? { width: 0 } : { width: `${clamped}%` }}
          animate={{ width: `${clamped}%` }}
          transition={
            animated
              ? { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }
              : { duration: 0 }
          }
        />
      </div>
      {showLabel && (
        <span
          className="text-xs font-semibold tabular-nums w-9 text-right"
          style={{ color: 'var(--text-secondary)' }}
        >
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}