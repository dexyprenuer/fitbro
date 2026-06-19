'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  startOfMonth, endOfMonth, eachDayOfInterval, getDay,
  isSameDay, isSameMonth, addMonths, subMonths, format,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useRoutineStore } from '@/store/useRoutineStore';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function RoutineCalendar() {
  const [viewDate, setViewDate] = useState(new Date());
  const activeRoutine = useRoutineStore((s) => s.activeRoutine);
  const completedDates = useAppStore((s) => s.completedDates);

  const routine = activeRoutine();
  const today = new Date();
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Leading empty cells
  const leadingBlanks = getDay(monthStart);

  function getWorkoutForDay(date: Date) {
    const dow = getDay(date);
    const dayId = routine.schedule[dow];
    if (!dayId) return null;
    return routine.workoutDays.find((d) => d.id === dayId) ?? null;
  }

  return (
    <GlassCard className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setViewDate((d) => subMonths(d, 1))}
          className="p-2 rounded-xl active:bg-[var(--surface-hover)]"
        >
          <ChevronLeft size={18} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <p className="font-display font-semibold text-[var(--text-primary)]">
          {format(viewDate, 'MMMM yyyy')}
        </p>
        <button
          onClick={() => setViewDate((d) => addMonths(d, 1))}
          className="p-2 rounded-xl active:bg-[var(--surface-hover)]"
        >
          <ChevronRight size={18} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_LABELS.map((d) => (
          <p key={d} className="text-center text-xs font-medium text-[var(--text-muted)] py-1">
            {d}
          </p>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {days.map((date) => {
          const workout = getWorkoutForDay(date);
          const isToday = isSameDay(date, today);
          const dateStr = format(date, 'yyyy-MM-dd');
          const isCompleted = completedDates.includes(dateStr);
          const inMonth = isSameMonth(date, viewDate);

          return (
            <motion.div
              key={dateStr}
              whileTap={workout ? { scale: 0.9 } : {}}
              className="flex flex-col items-center py-1 gap-0.5"
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium relative',
                  !inMonth && 'opacity-30'
                )}
                style={{
                  background: isToday
                    ? 'var(--accent)'
                    : isCompleted
                    ? 'var(--success-dim)'
                    : workout
                    ? 'var(--accent-dim)'
                    : 'transparent',
                  color: isToday
                    ? '#fff'
                    : isCompleted
                    ? 'var(--success)'
                    : workout
                    ? 'var(--accent)'
                    : 'var(--text-secondary)',
                }}
              >
                {date.getDate()}
              </div>
              {workout && (
                <span className="text-[8px] leading-none text-center" style={{ color: 'var(--text-muted)' }}>
                  {workout.emoji}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[var(--border)]">
        {[
          { color: 'var(--accent)', label: 'Workout' },
          { color: 'var(--success)', label: 'Done' },
          { color: 'var(--accent)', label: 'Today', isToday: true },
        ].map(({ color, label, isToday }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: isToday ? color : undefined, border: isToday ? undefined : `2px solid ${color}`, opacity: 0.8 }}
            />
            <span className="text-xs text-[var(--text-muted)]">{label}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}