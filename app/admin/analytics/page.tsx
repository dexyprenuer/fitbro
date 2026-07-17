'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';
import { TrendingUp, Calendar, CalendarDays, BarChart3 } from 'lucide-react';

interface AnalyticsData {
  daily: number;
  weekly: number;
  monthly: number;
  topRoutines: { name: string; count: number }[];
  trend: { date: string; count: number }[];
}

function StatCard({
  label,
  value,
  icon: Icon,
  index,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="rounded-[var(--radius-lg)] p-5 transition-shadow"
      style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-[var(--text-secondary)]">{label}</p>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ background: 'var(--accent-dim)' }}
        >
          <Icon size={14} style={{ color: 'var(--accent)' }} />
        </div>
      </div>
      <p className="text-3xl font-semibold tabular-nums text-[var(--text-primary)]">{value}</p>
    </motion.div>
  );
}

function TrendChart({ trend }: { trend: { date: string; count: number }[] }) {
  const max = Math.max(1, ...trend.map((t) => t.count));
  return (
    <div className="flex h-32 items-end gap-1.5">
      {trend.map((t, i) => {
        const heightPct = (t.count / max) * 100;
        const label = new Date(t.date).toLocaleDateString(undefined, { weekday: 'narrow' });
        return (
          <div key={t.date} className="flex flex-1 flex-col items-center gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(heightPct, t.count > 0 ? 6 : 2)}%` }}
              transition={{ duration: 0.4, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ opacity: 0.8 }}
              className="w-full rounded-t-md"
              style={{
                background: t.count > 0 ? 'var(--accent)' : 'var(--bg-tertiary)',
                minHeight: 4,
                alignSelf: 'flex-end',
              }}
              title={`${t.date}: ${t.count}`}
            />
            <span className="text-[10px] text-[var(--text-muted)]">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-8 w-40 animate-pulse rounded-lg" style={{ background: 'var(--bg-secondary)' }} />
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-[var(--radius-lg)]" style={{ background: 'var(--bg-secondary)' }} />
        ))}
      </div>
      <div className="h-48 animate-pulse rounded-[var(--radius-lg)]" style={{ background: 'var(--bg-secondary)' }} />
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    fetch('/api/admin/analytics')
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  useRealtimeTable('workout_logs', () => load());

  if (loading || !data) {
    return <LoadingSkeleton />;
  }

  const maxRoutineCount = Math.max(1, ...data.topRoutines.map((r) => r.count));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Analytics</h1>
        <p className="text-sm text-[var(--text-secondary)]">Workout activity across all users</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Today" value={data.daily} icon={Calendar} index={0} />
        <StatCard label="This Week" value={data.weekly} icon={CalendarDays} index={1} />
        <StatCard label="This Month" value={data.monthly} icon={TrendingUp} index={2} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[var(--radius-lg)] p-5"
        style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <p className="mb-4 text-sm font-medium text-[var(--text-secondary)]">Last 14 Days</p>
        <TrendChart trend={data.trend} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="mb-3 text-lg font-semibold text-[var(--text-primary)]">Most Used Routines</h2>
        {data.topRoutines.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] py-12 text-center"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: 'var(--accent-dim)' }}
            >
              <BarChart3 size={18} style={{ color: 'var(--accent)' }} />
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)]">No data yet</p>
            <p className="text-xs text-[var(--text-secondary)]">
              No completed workouts in the last 30 days.
            </p>
          </div>
        ) : (
          <div
            className="space-y-3 rounded-[var(--radius-lg)] p-5"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
          >
            {data.topRoutines.map((routine, i) => (
              <div key={routine.name}>
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{routine.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{routine.count} sessions</p>
                </div>
                <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(routine.count / maxRoutineCount) * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: 'var(--accent)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}