'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Copy, Trash2, ChevronRight } from 'lucide-react';
import { PresetWizard } from '@/components/admin/PresetWizard';

interface PresetSummary {
  id: string;
  name: string;
  workoutDays: { id: string; exercises: { id: string }[] }[];
}

export default function AdminPresetsPage() {
  const [presets, setPresets] = useState<PresetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/presets');
    const data = await res.json();
    setPresets(data.presets ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function duplicatePreset(id: string) {
    setBusyId(id);
    const res = await fetch(`/api/admin/presets/${id}/duplicate`, { method: 'POST' });
    if (res.ok) await load();
    setBusyId(null);
  }

  async function deletePreset(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This removes all its workout days and exercises.`)) return;
    setBusyId(id);
    const res = await fetch(`/api/admin/presets/${id}`, { method: 'DELETE' });
    if (res.ok) setPresets((prev) => prev.filter((p) => p.id !== id));
    setBusyId(null);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Presets</h1>
          <p className="text-sm text-[var(--text-secondary)]">{presets.length} preset routines</p>
        </div>
        <button
          onClick={() => setWizardOpen(true)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium"
          style={{ background: 'var(--accent)', color: 'white' }}
        >
          <Plus size={15} /> New Preset
        </button>
      </div>

      <div
        className="divide-y divide-[var(--border)] rounded-[var(--radius-lg)]"
        style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
      >
        {loading && <p className="p-5 text-sm text-[var(--text-secondary)]">Loading…</p>}
        {!loading && presets.length === 0 && (
          <p className="p-5 text-sm text-[var(--text-secondary)]">No presets yet.</p>
        )}
        {presets.map((preset) => {
          const exerciseCount = preset.workoutDays.reduce((sum, d) => sum + d.exercises.length, 0);
          return (
            <div key={preset.id} className="flex items-center justify-between gap-4 p-4">
              <Link href={`/admin/presets/${preset.id}`} className="flex-1">
                <p className="text-sm font-medium text-[var(--text-primary)]">{preset.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {preset.workoutDays.length} days · {exerciseCount} exercises
                </p>
              </Link>
              <div className="flex items-center gap-2">
                <button
                  disabled={busyId === preset.id}
                  onClick={() => duplicatePreset(preset.id)}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium disabled:opacity-50"
                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                >
                  <Copy size={13} /> Duplicate
                </button>
                <button
                  disabled={busyId === preset.id}
                  onClick={() => deletePreset(preset.id, preset.name)}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium disabled:opacity-50"
                  style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626' }}
                >
                  <Trash2 size={13} />
                </button>
                <Link href={`/admin/presets/${preset.id}`}>
                  <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <PresetWizard open={wizardOpen} onClose={() => setWizardOpen(false)} onCreated={load} />
    </motion.div>
  );
}