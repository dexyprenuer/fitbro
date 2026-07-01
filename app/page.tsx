'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { PageTransition } from '@/components/ui/PageTransition';
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
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning,';
  if (h < 17) return 'Good afternoon,';
  return 'Good evening,';
}

function getProgressMessage(pct: number) {
  if (pct >= 100) return "Amazing! You've hit your weekly goal.";
  if (pct >= 50) return "Keep going! You're building consistency.";
  if (pct > 0) return 'Nice start — keep the momentum going.';
  return "Let's get your first workout in today.";
}

export default function HomePage() {
  const activeRoutine = useRoutineStore((s) => s.activeRoutine);
  const completedDates = useAppStore((s) => s.completedDates);
  const displayName = useAppStore((s) => s.displayName);
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
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
              {getGreeting()}
            </p>
            <h1
              className="font-display text-3xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {displayName}
            </h1>
          </div>
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center relative flex-shrink-0"
            style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
          >
            <Bell size={19} style={{ color: 'var(--text-primary)' }} />
            <span
              className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--accent)' }}
            />
          </div>
        </motion.div>

        {/* Today */}
        <motion.div variants={fadeUp} className="mb-5">
          <TodayCard />
        </motion.div>

        {/* Weekly Progress */}
        <motion.div
          variants={fadeUp}
          className="mb-6 p-5"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-display font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
                Weekly Progress
              </p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {completedThisWeek} / {scheduledThisWeek} workouts
              </p>
            </div>
            <span
              className="font-display font-bold tabular-nums"
              style={{ fontSize: '1.7rem', color: 'var(--text-primary)' }}
            >
              {Math.round(weeklyProgress)}%
            </span>
          </div>

          <ProgressBar value={weeklyProgress} segments={Math.max(scheduledThisWeek, 1)} />

          <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
            {getProgressMessage(weeklyProgress)}
          </p>
        </motion.div>

        {/* Your Workouts */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="section-label">Your Workouts</p>
            <Link href="/exercise" className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {routine.workoutDays.slice(0, 2).map((day, i) => (
              <WorkoutCard key={day.id} workoutDay={day} index={i} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}