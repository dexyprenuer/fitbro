'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  startOfMonth, endOfMonth, eachDayOfInterval, getDay,
  isSameDay, isSameMonth, addMonths, subMonths, format,
} from 'date-fns';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useRoutineStore } from '@/store/useRoutineStore';
import { useAppStore } from '@/store/useAppStore';

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function RoutineCalendar() {
  const [viewDate, setViewDate] = useState(new Date());
  const [direction, setDirection]  = useState(1); // 1 = forward, -1 = backward

  const activeRoutine   = useRoutineStore((s) => s.activeRoutine);
  const completedDates  = useAppStore((s) => s.completedDates);

  const routine    = activeRoutine();
  const today      = new Date();
  const monthStart = startOfMonth(viewDate);
  const monthEnd   = endOfMonth(viewDate);
  const days       = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const leadingBlanks = getDay(monthStart);

  const getWorkoutForDay = useCallback(
    (date: Date) => {
      const dow   = getDay(date);
      const dayId = routine.schedule[dow];
      if (!dayId) return null;
      return routine.workoutDays.find((d) => d.id === dayId) ?? null;
    },
    [routine]
  );

  function goNext() {
    setDirection(1);
    setViewDate((d) => addMonths(d, 1));
  }
  function goPrev() {
    setDirection(-1);
    setViewDate((d) => subMonths(d, 1));
  }

  const monthVariants = {
    enter:  (dir: number) => ({ opacity: 0, x: dir * 40 }),
    center: { opacity: 1, x: 0 },
    exit:   (dir: number) => ({ opacity: 0, x: dir * -40 }),
  };

  return (
    <GlassCard variant="elevated" noPad className="overflow-hidden">
      {/* Month header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <motion.button
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 420, damping: 26 }}
          onClick={goPrev}
          className="w-9 h-9 flex items-center justify-center tap-target"
          style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
          }}
          aria-label="Previous month"
        >
          <ChevronLeft size={16} style={{ color: 'var(--text-secondary)' }} />
        </motion.button>

        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.p
            key={format(viewDate, 'yyyy-MM')}
            custom={direction}
            variants={{
              enter:  (dir) => ({ opacity: 0, y: dir > 0 ? -10 : 10 }),
              center: { opacity: 1, y: 0 },
              exit:   (dir) => ({ opacity: 0, y: dir > 0 ? 10 : -10 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-bold text-base"
            style={{ color: 'var(--text-primary)' }}
          >
            {format(viewDate, 'MMMM yyyy')}
          </motion.p>
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 420, damping: 26 }}
          onClick={goNext}
          className="w-9 h-9 flex items-center justify-center tap-target"
          style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
          }}
          aria-label="Next month"
        >
          <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
        </motion.button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 px-3 pt-3 pb-1">
        {DAY_LABELS.map((d) => (
          <p
            key={d}
            className="text-center text-[10px] font-bold uppercase tracking-widest py-1"
            style={{ color: 'var(--text-muted)' }}
          >
            {d}
          </p>
        ))}
      </div>

      {/* Day grid */}
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={format(viewDate, 'yyyy-MM')}
          custom={direction}
          variants={monthVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="grid grid-cols-7 gap-y-1 px-3 pb-4"
        >
          {Array.from({ length: leadingBlanks }).map((_, i) => (
            <div key={`blank-${i}`} />
          ))}

          {days.map((date) => {
            const workout    = getWorkoutForDay(date);
            const isToday    = isSameDay(date, today);
            const dateStr    = format(date, 'yyyy-MM-dd');
            const isCompleted = completedDates.includes(dateStr);
            const inMonth    = isSameMonth(date, viewDate);
            const hasWorkout = !!workout;

            return (
              <motion.div
                key={dateStr}
                whileTap={hasWorkout ? { scale: 0.88 } : {}}
                transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                className="flex items-center justify-center py-1"
                style={{ opacity: inMonth ? 1 : 0.3 }}
              >
                <div
                  className="flex items-center justify-center text-[13px] font-semibold"
                  style={{
                    width:  '36px',
                    height: '36px',
                    borderRadius: isToday ? 'var(--radius-full)' : 'var(--radius-sm)',
                    background: isToday
                      ? 'var(--accent)'
                      : isCompleted
                      ? 'var(--success-dim)'
                      : hasWorkout
                      ? 'var(--accent-dim)'
                      : 'transparent',
                    color: isToday
                      ? '#fff'
                      : isCompleted
                      ? 'var(--success)'
                      : hasWorkout
                      ? 'var(--accent)'
                      : 'var(--text-secondary)',
                    boxShadow: isToday ? '0 4px 12px var(--accent-glow)' : 'none',
                    transition: 'background 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  {isCompleted && !isToday ? (
                    <CheckCircle2
                      size={14}
                      strokeWidth={2.5}
                      style={{ color: 'var(--success)' }}
                    />
                  ) : (
                    date.getDate()
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div
        className="flex items-center justify-center gap-5 px-5 py-3"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        {[
          { dot: 'var(--accent)',  label: 'Scheduled', filled: false },
          { dot: 'var(--success)', label: 'Completed', filled: true  },
          { dot: 'var(--accent)',  label: 'Today',     filled: true  },
        ].map(({ dot, label, filled }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: filled ? dot : 'transparent',
                border: filled ? 'none' : `2px solid ${dot}`,
                opacity: 0.85,
              }}
            />
            <span
              className="text-[10px] font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}