'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { WeightLogSheet } from './WeightLogSheet';
import {
  formatWeight,
  unitLabel,
  relativeDayLabel,
  buildGraphPoints,
  buildSmoothPath,
  buildAreaPath,
  type WeightLogEntry,
} from '@/lib/weight';

interface WeightProgressCardProps {
  weightUnit: 'KG' | 'LBS';
}

export function WeightProgressCard({ weightUnit }: WeightProgressCardProps) {
  const [logs, setLogs] = useState<WeightLogEntry[] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  function fetchLogs() {
    fetch('/api/weight-logs?limit=30')
      .then((res) => res.json())
      .then((data) => setLogs(data.logs ?? []))
      .catch(() => setLogs([]));
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  const { latest, deltaLabel, points, smoothPath, areaPath } = useMemo(() => {
    if (!logs || logs.length === 0) {
      return { latest: null, deltaLabel: null, points: [], smoothPath: '', areaPath: '' };
    }

    const sorted = [...logs].reverse(); // oldest → newest
    const graphPoints = buildGraphPoints(sorted);
    const smoothPath = buildSmoothPath(graphPoints);
    const areaPath = buildAreaPath(smoothPath, graphPoints);

    const latestVal = sorted[sorted.length - 1].weightKg;
    const monthAgo = sorted[0].weightKg;
    const delta = latestVal - monthAgo;
    const deltaLabel =
      sorted.length > 1
        ? `${delta >= 0 ? '+' : ''}${formatWeight(Math.abs(delta) * (delta < 0 ? -1 : 1), weightUnit)} ${unitLabel(weightUnit)} vs last month`
        : null;

    return { latest: latestVal, deltaLabel, points: graphPoints, smoothPath, areaPath };
  }, [logs, weightUnit]);

  useEffect(() => {
    setSelectedIdx(null);
  }, [logs]);

  const selected = selectedIdx !== null ? points[selectedIdx] : null;

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
          <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              No weight logs yet
            </p>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setSheetOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2"
              style={{
                background: 'var(--accent-dim)',
                color: 'var(--accent)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <Plus size={14} />
              Add First Log
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

            <div className="relative">
              {points.length === 1 ? (
                <div className="h-20 flex items-center justify-center relative">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setSelectedIdx(selectedIdx === 0 ? null : 0)}
                    className="w-3.5 h-3.5 rounded-full cursor-pointer"
                    style={{ background: 'var(--accent)' }}
                  />
                  <AnimatePresence>
                    {selected && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-0 px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap"
                        style={{
                          background: 'var(--text-primary)',
                          color: 'var(--card)',
                          borderRadius: 'var(--radius-md)',
                        }}
                      >
                        {formatWeight(selected.weightKg, weightUnit)} {unitLabel(weightUnit)} ·{' '}
                        {relativeDayLabel(selected.loggedAt)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <svg viewBox="0 0 100 40" className="w-full h-20" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {areaPath && (
                    <motion.path
                      key={areaPath}
                      d={areaPath}
                      fill="url(#weightFill)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  )}
                  <motion.path
                    key={smoothPath}
                    d={smoothPath}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                  {points.map((p, i) => {
                    const isLatest = i === points.length - 1;
                    return (
                      <circle
                        key={p.loggedAt + i}
                        cx={p.x}
                        cy={p.y}
                        r={isLatest ? 2.6 : 1.6}
                        fill={isLatest ? 'var(--accent)' : 'transparent'}
                        stroke={isLatest ? 'none' : 'transparent'}
                        vectorEffect="non-scaling-stroke"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
                      />
                    );
                  })}
                  {/* Invisible wider hit targets for easier tapping */}
                  {points.map((p, i) => (
                    <circle
                      key={`hit-${p.loggedAt}-${i}`}
                      cx={p.x}
                      cy={p.y}
                      r={5}
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
                    />
                  ))}
                </svg>
              )}

              <AnimatePresence>
                {selected && points.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap pointer-events-none"
                    style={{
                      background: 'var(--text-primary)',
                      color: 'var(--card)',
                      borderRadius: 'var(--radius-md)',
                      left: `${selected.x}%`,
                      top: `${(selected.y / 40) * 100}%`,
                      transform: 'translate(-50%, -140%)',
                    }}
                  >
                    {formatWeight(selected.weightKg, weightUnit)} {unitLabel(weightUnit)} ·{' '}
                    {relativeDayLabel(selected.loggedAt)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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