import { create } from 'zustand';
import type { Routine, WorkoutDay } from '@/types';
import { getDay } from 'date-fns';

const FALLBACK_ROUTINE: Routine = {
  id: '__loading__',
  name: 'Loading…',
  type: 'PRESET',
  schedule: [null, null, null, null, null, null, null],
  workoutDays: [],
} as unknown as Routine;

interface RoutineStore {
  routines: Routine[];
  activeRoutineId: string | null;
  loading: boolean;
  loaded: boolean;
  allRoutines: () => Routine[];
  activeRoutine: () => Routine;
  todaysWorkoutDay: () => WorkoutDay | null;
  workoutDayById: (id: string) => WorkoutDay | undefined;
  setActiveRoutine: (id: string) => void;
  saveCustomRoutine: (payload: {
    name: string;
    workoutDays: { title: string; emoji?: string; exercises: { name: string; sets: number; reps: number; instructions?: string }[] }[];
  }) => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useRoutineStore = create<RoutineStore>((set, get) => ({
  routines: [],
  activeRoutineId: null,
  loading: false,
  loaded: false,

  async hydrate() {
    set({ loading: true });
    try {
      const res = await fetch('/api/routines');
      if (!res.ok) throw new Error('Failed to load routines');
      const data = await res.json();
      set({
        routines: data.routines,
        activeRoutineId: data.activeRoutineId ?? data.routines[0]?.id ?? null,
        loading: false,
        loaded: true,
      });
    } catch {
      set({ loading: false, loaded: true });
    }
  },

  allRoutines() {
    return get().routines;
  },

  activeRoutine() {
    const all = get().routines;
    if (all.length === 0) return FALLBACK_ROUTINE;
    return all.find((r) => r.id === get().activeRoutineId) ?? all[0];
  },

  todaysWorkoutDay() {
    const routine = get().activeRoutine();
    const dayOfWeek = getDay(new Date()); // 0=Sun
    const dayId = (routine.schedule as (string | null)[])[dayOfWeek];
    if (!dayId) return null;
    return routine.workoutDays.find((d) => d.id === dayId) ?? null;
  },

  workoutDayById(id) {
    return get().activeRoutine().workoutDays.find((d) => d.id === id);
  },

  setActiveRoutine(id) {
    const prev = get().activeRoutineId;
    set({ activeRoutineId: id }); // optimistic
    fetch('/api/settings/active-routine', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ routineId: id }),
    }).catch(() => set({ activeRoutineId: prev })); // rollback on failure
  },

  async saveCustomRoutine(payload) {
    const res = await fetch('/api/routines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const { routine } = await res.json();
      set((state) => ({ routines: [...state.routines, routine] }));
    }
  },
}));