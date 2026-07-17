'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Legs', 'Biceps', 'Triceps',
  'Forearms', 'Shoulders', 'Abs', 'Neck',
];

interface MuscleGroupPickerProps {
  open: boolean;
  onClose: () => void;
  selected: string[];
  onChange: (next: string[]) => void;
}

export function MuscleGroupPicker({ open, onClose, selected, onChange }: MuscleGroupPickerProps) {
  function toggle(muscle: string) {
    if (selected.includes(muscle)) {
      onChange(selected.filter((m) => m !== muscle));
    } else {
      onChange([...selected, muscle]);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Muscle Groups">
      <div className="space-y-1 pb-2">
        {MUSCLE_GROUPS.map((muscle) => {
          const isSelected = selected.includes(muscle);
          return (
            <button
              key={muscle}
              onClick={() => toggle(muscle)}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left"
              style={{
                background: isSelected ? 'var(--accent-dim)' : 'transparent',
              }}
            >
              <span
                className="text-[15px] font-medium"
                style={{ color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}
              >
                {muscle}
              </span>
              <motion.div
                initial={false}
                animate={{
                  scale: isSelected ? 1 : 0.85,
                  opacity: isSelected ? 1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="flex h-6 w-6 items-center justify-center rounded-full"
                style={{ background: 'var(--accent)' }}
              >
                <Check size={14} strokeWidth={3} color="white" />
              </motion.div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onClose}
        className="mt-3 w-full rounded-xl py-3 text-sm font-semibold"
        style={{ background: 'var(--accent)', color: 'white' }}
      >
        Done {selected.length > 0 && `(${selected.length} selected)`}
      </button>
    </Modal>
  );
}