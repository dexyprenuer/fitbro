'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useRoutineStore } from '@/store/useRoutineStore';
import { PRESET_ROUTINES } from '@/data/presets';

export function RoutineSelector() {
  const { activeRoutineId, setActiveRoutine, customRoutines } = useRoutineStore();
  const all = [...PRESET_ROUTINES, ...customRoutines];

  return (
    <div className="space-y-3">
      {all.map((routine) => {
        const active = routine.id === activeRoutineId;

        return (
          <motion.div
            key={routine.id}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            onClick={() => setActiveRoutine(routine.id)}
            className="flex items-center gap-3 p-4 cursor-pointer"
            style={{
              background: 'var(--card)',
              border: `1px solid ${active ? 'rgba(90,103,242,0.25)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="flex-1 min-w-0">
              <p
                className="font-display font-semibold text-[1.05rem]"
                style={{ color: 'var(--text-primary)' }}
              >
                {routine.name}
              </p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                <span
                  style={{
                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {active ? 'Current' : routine.type === 'preset' ? 'Preset' : 'Custom'}
                </span>
                {' · '}
                {routine.workoutDays.length} workout days
              </p>
            </div>

            <ChevronRight size={18} strokeWidth={1.8} style={{ color: 'var(--text-muted)' }} />
          </motion.div>
        );
      })}
    </div>
  );
}