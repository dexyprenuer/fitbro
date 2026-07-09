'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface WeightLogSheetProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  unit: 'KG' | 'LBS';
}

export function WeightLogSheet({ open, onClose, onSaved, unit }: WeightLogSheetProps) {
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      setError('Enter a valid weight');
      return;
    }

    const weightKg = unit === 'LBS' ? num / 2.20462 : num;

    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/weight-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weightKg }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setValue('');
      onSaved();
      onClose();
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Log Weight">
      <div className="pb-6">
        <div className="flex items-end justify-center gap-2 mb-6 mt-2">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            placeholder="0.0"
            className="bg-transparent text-center font-display font-bold outline-none"
            style={{
              fontSize: '3rem',
              color: 'var(--text-primary)',
              width: '160px',
            }}
          />
          <span
            className="text-lg font-semibold mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            {unit === 'LBS' ? 'lbs' : 'kg'}
          </span>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-center mb-4"
            style={{ color: 'var(--destructive)' }}
          >
            {error}
          </motion.p>
        )}

        <Button
          variant="primary"
          size="xl"
          fullWidth
          loading={saving}
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
}