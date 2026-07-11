'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="rounded-[var(--radius-lg)] p-5"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-[var(--text-secondary)]">Loading dashboard…</p>;
  }

  if (error || !data) {
    return <p className="text-[var(--text-secondary)]">Couldn't load dashboard data.</p>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)]">Overview of FitBro activity</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Users" value={data.totalUsers} />
        <StatCard label="Active (7d)" value={data.activeUsers} />
        <StatCard label="Workouts Completed" value={data.workoutCount} />
        <StatCard label="Presets" value={data.presetCount} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-[var(--text-primary)]">Recent Activity</h2>
        <div
          className="divide-y divide-[var(--border)] rounded-[var(--radius-lg)]"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
          {data.recentActivity.length === 0 && (
            <p className="p-5 text-sm text-[var(--text-secondary)]">No recent activity yet.</p>
          )}
          {data.recentActivity.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{item.username}</p>
                <p className="text-xs text-[var(--text-secondary)]">{item.workoutTitle}</p>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                {item.durationSec ? `${Math.round(item.durationSec / 60)} min` : '—'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}