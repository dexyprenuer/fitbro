'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { getDay, format } from 'date-fns';
import { useRoutineStore } from '@/store/useRoutineStore';
import { useAppStore } from '@/store/useAppStore';

// Sat, Sun, Mon, Tue, Wed, Thu, Fri — display order per spec
// date-fns getDay(): 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
const DISPLAY_ORDER = [6, 0, 1, 2, 3, 4, 5];
const DAY_LABELS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

type DayStatus = 'completed' | 'today' | 'upcoming' | 'rest';

export function WeeklySchedule() {
  const activeRoutine = useRoutineStore((s) => s.activeRoutine);
  const completedDates = useAppStore((s) => s.completedDates);
  const routine = activeRoutine();

  const todayDow = getDay(new Date());
  const now = new Date();

  // Build a Date for each of the 7 days in the current week (Sun-start week containing today)
  const weekDates = DISPLAY_ORDER.map((dow) => {
    const diff = dow - todayDow;
    const d = new Date(now);
    d.setDate(now.getDate() + diff);
    return d;
  });

  const scheduledCount = routine.schedule.filter(Boolean).length;
  const completedCount = weekDates.filter((d, i) => {
    const dow = DISPLAY_ORDER[i];
    const hasWorkout = !!routine.schedule[dow];
    if (!hasWorkout) return false;
    const dateStr = format(d, 'yyyy-MM-dd');
    return completedDates.includes(dateStr);
  }).length;

  function getStatus(dow: number, date: Date): DayStatus {
    const hasWorkout = !!routine.schedule[dow];
    if (!hasWorkout) return 'rest';

    const dateStr = format(date, 'yyyy-MM-dd');
    const isCompleted = completedDates.includes(dateStr);
    const isToday = dow === todayDow;

    if (isCompleted) return 'completed';
    if (isToday) return 'today';
    return 'upcoming';
  }

  return (
    <motion.div
      className="mb-6 p-5"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="font-display font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
            Weekly Progress
          </p>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {routine.name}
          </p>
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={`${completedCount}/${scheduledCount}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="font-display font-bold tabular-nums"
            style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}
          >
            {completedCount}/{scheduledCount}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between">
        {DISPLAY_ORDER.map((dow, i) => {
          const date = weekDates[i];
          const status = getStatus(dow, date);

          return (
            <div key={dow} className="flex flex-col items-center gap-2">
              <span
                className="text-[10px] font-semibold uppercase tracking-wide"
                style={{ color: 'var(--text-muted)' }}
              >
                {DAY_LABELS[i]}
              </span>

              <motion.div
                layout
                initial={false}
                animate={{ scale: status === 'today' ? 1.08 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                className="relative w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  background:
                    status === 'completed'
                      ? 'var(--accent)'
                      : status === 'rest'
                      ? 'var(--border)'
                      : 'transparent',
                  border:
                    status === 'upcoming'
                      ? '2px solid var(--accent)'
                      : status === 'today'
                      ? 'none'
                      : 'none',
                  boxShadow:
                    status === 'completed'
                      ? '0 2px 8px var(--accent-glow)'
                      : 'none',
                }}
              >
                {/* Half-fill for "today" */}
                {status === 'today' && (
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(var(--accent) 0deg 180deg, transparent 180deg 360deg)`,
                      border: '2px solid var(--accent)',
                    }}
                  />
                )}

                <AnimatePresence mode="wait">
                  {status === 'completed' && (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                    >
                      <Check size={16} strokeWidth={3} color="#fff" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}