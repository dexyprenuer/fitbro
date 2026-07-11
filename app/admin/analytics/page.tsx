'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';

interface AnalyticsData {
  daily: number;
  weekly: number;
  monthly: number;
  topRoutines: { name: string; count: number }[];
  trend: { date: string; count: number }[];
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="rounded-[var(--radius-lg)] p-5"
      style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
    >
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function TrendChart({ trend }: { trend: { date: string; count: number }[] }) {
  const max = Math.max(1, ...trend.map((t) => t.count));
  return (
    <div className="flex h-32 items-end gap-1.5">
      {trend.map((t) => {
        const heightPct = (t.count / max) * 100;
        const label = new Date(t.date).toLocaleDateString(undefined, { weekday: 'narrow' });
        return (
          <div key={t.date} className="flex flex-1 flex-col items-center gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(heightPct, t.count > 0 ? 6 : 2)}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
    return <p className="text-[var(--text-secondary)]">Loading analytics…</p>;
  }

  const maxRoutineCount = Math.max(1, ...data.topRoutines.map((r) => r.count));

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Analytics</h1>
        <p className="text-sm text-[var(--text-secondary)]">Workout activity across all users</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Today" value={data.daily} />
        <StatCard label="This Week" value={data.weekly} />
        <StatCard label="This Month" value={data.monthly} />
      </div>

      <div
        className="rounded-[var(--radius-lg)] p-5"
        style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <p className="mb-4 text-sm font-medium text-[var(--text-secondary)]">Last 14 Days</p>
        <TrendChart trend={data.trend} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-[var(--text-primary)]">Most Used Routines</h2>
        <div
          className="space-y-3 rounded-[var(--radius-lg)] p-5"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
          {data.topRoutines.length === 0 && (
            <p className="text-sm text-[var(--text-secondary)]">No completed workouts in the last 30 days.</p>
          )}
          {data.topRoutines.map((routine) => (
            <div key={routine.name}>
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-medium text-[var(--text-primary)]">{routine.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">{routine.count} sessions</p>
              </div>
              <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(routine.count / maxRoutineCount) * 100}%` }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}