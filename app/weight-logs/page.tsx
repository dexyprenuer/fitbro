'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Scale, Plus, Trash2 } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { WeightLogSheet } from '@/components/home/WeightLogSheet';
import { formatWeight, unitLabel, relativeDayLabel, type WeightLogEntry } from '@/lib/weight';

export default function WeightLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<WeightLogEntry[] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [weightUnit, setWeightUnit] = useState<'KG' | 'LBS'>('KG');

  function fetchLogs() {
    fetch('/api/weight-logs?limit=100')
      .then((res) => res.json())
      .then((data) => setLogs(data.logs ?? []));
  }

  useEffect(() => {
    fetchLogs();
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data?.profile?.weightUnit) setWeightUnit(data.profile.weightUnit);
      });
  }, []);

  async function handleDelete(id: string) {
    setLogs((prev) => prev?.filter((l) => l.id !== id) ?? null);
    await fetch(`/api/weight-logs?id=${id}`, { method: 'DELETE' }).catch(() => {
      fetchLogs(); // revert on failure
    });
  }

  const stats = logs && logs.length > 0
    ? {
        average: logs.reduce((sum, l) => sum + l.weightKg, 0) / logs.length,
        highest: Math.max(...logs.map((l) => l.weightKg)),
        lowest: Math.min(...logs.map((l) => l.weightKg)),
      }
    : null;

  return (
    <PageTransition>
      <div
        className="px-4 pt-10 max-w-lg mx-auto"
        style={{ paddingBottom: 'max(4rem, calc(env(safe-area-inset-bottom) + 3rem))' }}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 tap-target"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </motion.button>
          <h1 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Weight Logs
          </h1>
          <div style={{ width: 60 }} />
        </div>

        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 mb-6"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="flex items-baseline gap-1.5 mb-1">
              <span
                className="font-display font-bold tabular-nums"
                style={{ fontSize: '2rem', color: 'var(--text-primary)' }}
              >
                {formatWeight(stats.average, weightUnit)}
              </span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                {unitLabel(weightUnit)}
              </span>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Average</p>

            <div className="flex items-center gap-8" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold tabular-nums" style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    {formatWeight(stats.highest, weightUnit)}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{unitLabel(weightUnit)}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Highest</p>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display font-bold tabular-nums" style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    {formatWeight(stats.lowest, weightUnit)}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{unitLabel(weightUnit)}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Lowest</p>
              </div>
            </div>
          </motion.div>
        )}

        <p className="section-label mb-3 px-1">All Logs</p>

        {logs === null ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>Loading…</div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center">
            <Scale size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No weight logs yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <motion.div
                key={log.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 p-4"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--accent-dim)' }}
                >
                  <Scale size={16} style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                      {formatWeight(log.weightKg, weightUnit)}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{unitLabel(weightUnit)}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {relativeDayLabel(log.loggedAt)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(log.id)}
                  className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                  aria-label="Delete entry"
                >
                  <Trash2 size={15} style={{ color: 'var(--text-muted)' }} />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setSheetOpen(true)}
          className="fixed bottom-8 right-6 w-14 h-14 rounded-full flex items-center justify-center z-40"
          style={{ background: 'var(--accent)', boxShadow: '0 8px 24px var(--accent-glow)' }}
          aria-label="Log weight"
        >
          <Plus size={24} color="#fff" />
        </motion.button>
      </div>

      <WeightLogSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onSaved={fetchLogs} unit={weightUnit} />
    </PageTransition>
  );
}