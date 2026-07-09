'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import type { HeightUnit, WeightUnit } from '@prisma/client';

export default function UnitsSettingsPage() {
  const router = useRouter();
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('KG');
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('CM');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data?.profile?.weightUnit) setWeightUnit(data.profile.weightUnit);
        if (data?.profile?.heightUnit) setHeightUnit(data.profile.heightUnit);
      });
  }, []);

  async function updateUnit(patch: Partial<{ weightUnit: WeightUnit; heightUnit: HeightUnit }>) {
    setSaving(true);
    try {
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageTransition>
      <div
        className="px-4 pt-10 max-w-lg mx-auto"
        style={{ paddingBottom: 'max(4rem, calc(env(safe-area-inset-bottom) + 3rem))' }}
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 tap-target"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </motion.button>

        <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Units
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Choose how measurements are displayed.
        </p>

        <div className="space-y-6">
          <div>
            <p className="section-label mb-3 px-1">Weight</p>
            <div className="flex gap-3">
              {(['KG', 'LBS'] as const).map((u) => (
                <motion.button
                  key={u}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setWeightUnit(u);
                    updateUnit({ weightUnit: u });
                  }}
                  className="flex-1 flex items-center justify-between px-4 py-3.5"
                  style={{
                    background: weightUnit === u ? 'var(--accent-dim)' : 'var(--card)',
                    border: `1px solid ${weightUnit === u ? 'rgba(90,103,242,0.25)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <span
                    className="font-display font-semibold"
                    style={{ color: weightUnit === u ? 'var(--accent)' : 'var(--text-primary)' }}
                  >
                    {u === 'KG' ? 'Kilograms' : 'Pounds'}
                  </span>
                  {weightUnit === u && <Check size={16} style={{ color: 'var(--accent)' }} />}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <p className="section-label mb-3 px-1">Height</p>
            <div className="flex gap-3">
              {(['CM', 'FT_IN'] as const).map((u) => (
                <motion.button
                  key={u}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setHeightUnit(u);
                    updateUnit({ heightUnit: u });
                  }}
                  className="flex-1 flex items-center justify-between px-4 py-3.5"
                  style={{
                    background: heightUnit === u ? 'var(--accent-dim)' : 'var(--card)',
                    border: `1px solid ${heightUnit === u ? 'rgba(90,103,242,0.25)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <span
                    className="font-display font-semibold"
                    style={{ color: heightUnit === u ? 'var(--accent)' : 'var(--text-primary)' }}
                  >
                    {u === 'CM' ? 'Centimeters' : 'Feet & Inches'}
                  </span>
                  {heightUnit === u && <Check size={16} style={{ color: 'var(--accent)' }} />}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}