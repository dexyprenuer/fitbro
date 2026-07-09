'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { WeightLogSheet } from './WeightLogSheet';
import { formatWeight, unitLabel, type WeightLogEntry } from '@/lib/weight';

interface WeightProgressCardProps {
  weightUnit: 'KG' | 'LBS';
}

export function WeightProgressCard({ weightUnit }: WeightProgressCardProps) {
  const [logs, setLogs] = useState<WeightLogEntry[] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function fetchLogs() {
    fetch('/api/weight-logs?limit=30')
      .then((res) => res.json())
      .then((data) => setLogs(data.logs ?? []))
      .catch(() => setLogs([]));
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  const { latest, deltaLabel, points, path, areaPath } = useMemo(() => {
    if (!logs || logs.length === 0) {
      return { latest: null, deltaLabel: null, points: [], path: '', areaPath: '' };
    }

    const sorted = [...logs].reverse(); // oldest → newest
    const values = sorted.map((l) => l.weightKg);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const w = 100;
    const h = 40;
    const pts = sorted.map((l, i) => {
      const x = sorted.length === 1 ? w : (i / (sorted.length - 1)) * w;
      const y = h - ((l.weightKg - min) / range) * h;
      return { x, y };
    });

    const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${path} L ${w} ${h} L 0 ${h} Z`;

    const latestVal = sorted[sorted.length - 1].weightKg;
    const monthAgo = sorted[0].weightKg;
    const delta = latestVal - monthAgo;
    const deltaLabel =
      sorted.length > 1
        ? `${delta >= 0 ? '+' : ''}${formatWeight(Math.abs(delta) * (delta < 0 ? -1 : 1), weightUnit)} ${unitLabel(weightUnit)} vs last month`
        : null;

    return { latest: latestVal, deltaLabel, points: pts, path, areaPath };
  }, [logs, weightUnit]);

  return (
    <>
      <motion.div
        className="mb-6 p-5"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="font-display font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
            Weight Progress
          </p>
          <Link href="/weight-logs" className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
            View all
          </Link>
        </div>

        {logs === null ? (
          <div className="h-24 flex items-center justify-center">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading…</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex items-center justify-between py-2">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              No entries yet — log your first weight.
            </p>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setSheetOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 flex-shrink-0"
              style={{
                background: 'var(--accent-dim)',
                color: 'var(--accent)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <Plus size={14} />
              Log
            </motion.button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="font-display font-bold tabular-nums"
                    style={{ fontSize: '2rem', color: 'var(--text-primary)' }}
                  >
                    {formatWeight(latest!, weightUnit)}
                  </span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {unitLabel(weightUnit)}
                  </span>
                </div>
                {deltaLabel && (
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {deltaLabel}
                  </p>
                )}
              </div>
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => setSheetOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 flex-shrink-0"
                style={{
                  background: 'var(--accent-dim)',
                  color: 'var(--accent)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <Plus size={14} />
                Log
              </motion.button>
            </div>

            {points.length > 1 && (
              <svg viewBox="0 0 100 40" className="w-full h-20" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  d={areaPath}
                  fill="url(#weightFill)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.path
                  d={path}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
            )}
          </>
        )}
      </motion.div>

      <WeightLogSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSaved={fetchLogs}
        unit={weightUnit}
      />
    </>
  );
}