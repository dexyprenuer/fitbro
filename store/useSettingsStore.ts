import { create } from 'zustand';
import { storage } from '@/lib/storage';
import type { WorkoutSettings, ExerciseOverride } from '@/types';

interface SettingsStore extends WorkoutSettings {
  getEffective: (exerciseId: string, defaultSets: number, defaultReps: number) => { sets: number; reps: number };
  setOverride: (override: ExerciseOverride) => void;
  removeOverride: (exerciseId: string) => void;
  hydrate: () => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  overrides: {},

  hydrate() {
    const saved = storage.get<WorkoutSettings>('workoutSettings', { overrides: {} });
    set(saved);
  },

  getEffective(exerciseId, defaultSets, defaultReps) {
    const override = get().overrides[exerciseId];
    return {
      sets: override?.customSets ?? defaultSets,
      reps: override?.customReps ?? defaultReps,
    };
  },

  setOverride(override) {
    const next = { ...get().overrides, [override.exerciseId]: override };
    set({ overrides: next });
    storage.set('workoutSettings', { overrides: next });
  },

  removeOverride(exerciseId) {
    const next = { ...get().overrides };
    delete next[exerciseId];
    set({ overrides: next });
    storage.set('workoutSettings', { overrides: next });
  },
}));