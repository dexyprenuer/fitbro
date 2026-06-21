'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/ui/PageTransition';
import { StreakBadge } from '@/components/home/StreakBadge';
import { TodayCard } from '@/components/home/TodayCard';
import { WorkoutCard } from '@/components/home/WorkoutCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useRoutineStore } from '@/store/useRoutineStore';
import { useAppStore } from '@/store/useAppStore';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 340, damping: 28 } },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomePage() {
  const activeRoutine = useRoutineStore((s) => s.activeRoutine);
  const completedDates = useAppStore((s) => s.completedDates);
  const routine = activeRoutine();

  const { scheduledThisWeek, completedThisWeek, weeklyProgress } = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const scheduled = routine.schedule.slice(0, dayOfWeek + 1).filter(Boolean).length;
    const completed = completedDates.filter((d) => {
      const date = new Date(d);
      const diff = (today.getTime() - date.getTime()) / 86400000;
      return diff >= 0 && diff < 7;
    }).length;
    return {
      scheduledThisWeek: scheduled,
      completedThisWeek: completed,
      weeklyProgress: scheduled > 0 ? Math.min(100, (completed / scheduled) * 100) : 0,
    };
  }, [completedDates, routine.schedule]);

  return (
    <PageTransition>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-4 pt-12 pb-32 max-w-lg mx-auto"
        style={{ paddingBottom: 'max(8rem, calc(env(safe-area-inset-bottom) + 7rem))' }}
      >
        {/* ── Header ───────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="mb-6">
          <p
            className="section-label mb-1"
            style={{ color: 'var(--text-muted)' }}
          >
            {getGreeting()}
          </p>
          <h1 className="font-display text-[2.1rem] font-bold leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            FitBro <span className="gradient-text">💪</span>
          </h1>
        </motion.div>

        {/* ── Streak ───────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="mb-5">
          <StreakBadge />
        </motion.div>

        {/* ── Today ────────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="mb-5">
          <p className="section-label mb-2 px-1">Today</p>
          <TodayCard />
        </motion.div>

        {/* ── Weekly Progress ───────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="mb-6 px-1">
          <div className="flex items-center justify-between mb-2.5">
            <p className="section-label">Weekly Progress</p>
            <span
              className="text-xs font-semibold tabular-nums px-2.5 py-0.5 rounded-full"
              style={{
                background: 'var(--accent-dim)',
                color: 'var(--accent)',
              }}
            >
              {completedThisWeek}/{scheduledThisWeek} days
            </span>
          </div>
          <ProgressBar value={weeklyProgress} showLabel />
        </motion.div>

        {/* ── Workout Cards ─────────────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <p className="section-label mb-3 px-1">Your Workouts</p>
          <div className="space-y-3">
            {routine.workoutDays.map((day, i) => (
              <WorkoutCard key={day.id} workoutDay={day} index={i} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}