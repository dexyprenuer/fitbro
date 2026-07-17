'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';
import { Users, Activity, Dumbbell, ListChecks } from 'lucide-react';

interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  workoutCount: number;
  presetCount: number;
  recentActivity: {
    id: string;
    username: string;
    workoutTitle: string;
    completedDate: string | null;
    durationSec: number | null;
    at: string;
  }[];
}

function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 500;
    const start = performance.now();
    const from = display;
    let raf: number;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setDisplay(Math.round(from + (value - from) * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className="tabular-nums">{display}</span>;
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
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
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
      <p className="text-3xl font-semibold text-[var(--text-primary)]">
        <CountUp value={value} />
      </p>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [live, setLive] = useState(false);

  const load = useCallback(() => {
    fetch('/api/admin/dashboard')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then((d) => {
        setData(d);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useRealtimeTable('workout_logs', () => {
    setLive(true);
    load();
    setTimeout(() => setLive(false), 1500);
  });
  useRealtimeTable('routines', () => {
    setLive(true);
    load();
    setTimeout(() => setLive(false), 1500);
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 animate-pulse rounded-lg" style={{ background: 'var(--bg-secondary)' }} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-[var(--radius-lg)]"
              style={{ background: 'var(--bg-secondary)' }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        className="rounded-[var(--radius-lg)] p-8 text-center"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <p className="text-sm text-[var(--text-secondary)]">Couldn't load dashboard data.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)]">Overview of FitBro activity</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <motion.span
            animate={{ opacity: live ? [1, 0.3, 1] : 1 }}
            transition={{ duration: 0.8, repeat: live ? Infinity : 0 }}
            className="h-2 w-2 rounded-full"
            style={{ background: '#22C55E' }}
          />
          Live
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Users" value={data.totalUsers} icon={Users} index={0} />
        <StatCard label="Active (7d)" value={data.activeUsers} icon={Activity} index={1} />
        <StatCard label="Workouts Completed" value={data.workoutCount} icon={ListChecks} index={2} />
        <StatCard label="Presets" value={data.presetCount} icon={Dumbbell} index={3} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-[var(--text-primary)]">Recent Activity</h2>
        {data.recentActivity.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] py-12 text-center"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: 'var(--accent-dim)' }}
            >
              <Activity size={18} style={{ color: 'var(--accent)' }} />
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)]">No activity yet</p>
            <p className="text-xs text-[var(--text-secondary)]">
              Completed workouts will show up here in real time.
            </p>
          </div>
        ) : (
          <div
            className="divide-y divide-[var(--border)] rounded-[var(--radius-lg)]"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
          >
            {data.recentActivity.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                    style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                  >
                    {item.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{item.username}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{item.workoutTitle}</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  {item.durationSec ? `${Math.round(item.durationSec / 60)} min` : '—'}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}