import { create } from 'zustand';
import { storage } from '@/lib/storage';
import { PRESET_ROUTINES, DEFAULT_ROUTINE_ID } from '@/data/presets';
import type { Routine, WorkoutDay } from '@/types';
import { getDay } from 'date-fns';

interface RoutineStore {
  activeRoutineId: string;
  customRoutines: Routine[];
  allRoutines: () => Routine[];
  activeRoutine: () => Routine;
  todaysWorkoutDay: () => WorkoutDay | null;
  workoutDayById: (id: string) => WorkoutDay | undefined;
  setActiveRoutine: (id: string) => void;
  saveCustomRoutine: (routine: Routine) => void;
  hydrate: () => void;
}

export const useRoutineStore = create<RoutineStore>((set, get) => ({
  activeRoutineId: DEFAULT_ROUTINE_ID,
  customRoutines: [],

  hydrate() {
    const activeRoutineId = storage.get<string>('activeRoutineId', DEFAULT_ROUTINE_ID);
    const customRoutines = storage.get<Routine[]>('customRoutines', []);
    set({ activeRoutineId, customRoutines });
  },

  allRoutines() {
    return [...PRESET_ROUTINES, ...get().customRoutines];
  },

  activeRoutine() {
    const all = get().allRoutines();
    return all.find((r) => r.id === get().activeRoutineId) ?? all[0];
  },

  todaysWorkoutDay() {
    const routine = get().activeRoutine();
    const dayOfWeek = getDay(new Date()); // 0=Sun
    const dayId = routine.schedule[dayOfWeek];
    if (!dayId) return null;
    return routine.workoutDays.find((d) => d.id === dayId) ?? null;
  },

  workoutDayById(id) {
    return get().activeRoutine().workoutDays.find((d) => d.id === id);
  },

  setActiveRoutine(id) {
    set({ activeRoutineId: id });
    storage.set('activeRoutineId', id);
  },

  saveCustomRoutine(routine) {
    const existing = get().customRoutines;
    const idx = existing.findIndex((r) => r.id === routine.id);
    const next =
      idx >= 0
        ? existing.map((r) => (r.id === routine.id ? routine : r))
        : [...existing, routine];
    set({ customRoutines: next });
    storage.set('customRoutines', next);
  },
}));