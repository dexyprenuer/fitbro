'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useRoutineStore } from '@/store/useRoutineStore';
import { PRESET_ROUTINES } from '@/data/presets';

export function RoutineSelector() {
  const { activeRoutineId, setActiveRoutine, customRoutines } = useRoutineStore();
  const all = [...PRESET_ROUTINES, ...customRoutines];

  return (
    <div className="space-y-2">
      {all.map((routine) => {
        const active = routine.id === activeRoutineId;
        return (
          <motion.div key={routine.id} whileTap={{ scale: 0.98 }}>
            <GlassCard
              className="p-4 flex items-center gap-3 cursor-pointer"
              style={active ? { borderColor: 'var(--accent)', background: 'var(--accent-dim)' } : {}}
              onClick={() => setActiveRoutine(routine.id)}
            >
              <div className="flex-1">
                <p className="font-semibold text-[var(--text-primary)]">{routine.name}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {routine.type === 'preset' ? 'Preset' : 'Custom'} · {routine.workoutDays.length} workout days
                </p>
              </div>
              {active && <CheckCircle2 size={20} style={{ color: 'var(--accent)' }} />}
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
}