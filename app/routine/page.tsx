'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Repeat } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { RoutineCalendar } from '@/components/routine/RoutineCalendar';
import { RoutineSelector } from '@/components/routine/RoutineSelector';
import { useRoutineStore } from '@/store/useRoutineStore';

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 340, damping: 28 },
  },
};

export default function RoutinePage() {
  const activeRoutine = useRoutineStore((s) => s.activeRoutine);
  const routine       = activeRoutine();

  return (
    <PageTransition>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-4 pt-12 max-w-lg mx-auto"
        style={{
          paddingBottom: 'max(8rem, calc(env(safe-area-inset-bottom) + 7rem))',
        }}
      >
        {/* ── Header ───────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="mb-7">
          <p className="section-label mb-1">Your Schedule</p>
          <h1
            className="font-display font-bold"
            style={{ fontSize: 'clamp(1.75rem, 6vw, 2.25rem)', color: 'var(--text-primary)' }}
          >
            Routine
          </h1>

          {/* Active routine pill */}
          <div
            className="inline-flex items-center gap-2 mt-2.5 px-3 py-1.5"
            style={{
              background:   'var(--accent-dim)',
              border:       '1px solid rgba(108,99,255,0.20)',
              borderRadius: 'var(--radius-full)',
            }}
          >
            <Repeat size={12} style={{ color: 'var(--accent)' }} />
            <span
              className="text-xs font-semibold"
              style={{ color: 'var(--accent)' }}
            >
              {routine.name}
            </span>
          </div>
        </motion.div>

        {/* ── Calendar ─────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="mb-6">
          <div className="flex items-center gap-2 mb-3 px-1">
            <CalendarDays size={13} style={{ color: 'var(--text-muted)' }} />
            <p className="section-label">Calendar</p>
          </div>
          <RoutineCalendar />
        </motion.div>

        {/* ── Routine selector ─────────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Repeat size={13} style={{ color: 'var(--text-muted)' }} />
            <p className="section-label">Choose Routine</p>
          </div>
          <RoutineSelector />
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}