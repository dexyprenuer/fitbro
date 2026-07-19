import { create } from 'zustand';
import { storage } from '@/lib/storage';
import { todayString } from '@/lib/streak';
import { getElapsedSeconds } from '@/lib/timer';
import type { WorkoutSession } from '@/types';

interface ChainState {
  triedTitles: string[];      // lowercase titles already run in this chain
  totalDuration: number;      // seconds, summed across the whole chain
  totalCount: number;         // exercises, summed across the whole chain
  trainedGroups: string[];    // deduped muscle groups across the whole chain
}

interface SessionStore {
  session: WorkoutSession | null;
  chain: ChainState | null;
  startSession: (workoutDayId: string, routineId: string) => void;
  completeExercise: () => void;
  endSession: () => WorkoutSession | null;
  abandonSession: () => void;
  hydrate: () => void;

  startChain: () => void;
  addToChain: (title: string, duration: number, count: number, groups: string[]) => ChainState;
  clearChain: () => void;
}

function newId() {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  session: null,
  chain: null,

  hydrate() {
    const session = storage.get<WorkoutSession | null>('activeSession', null);
    if (session?.isActive) {
      set({ session });
    }
    const chain = storage.get<ChainState | null>('activeChain', null);
    if (chain) {
      set({ chain });
    }
  },

  startSession(workoutDayId, routineId) {
    const session: WorkoutSession = {
      id: newId(),
      workoutDayId,
      routineId,
      startTimestamp: Date.now(),
      completedExercises: [],
      currentExerciseIndex: 0,
      isActive: true,
    };
    set({ session });
    storage.set('activeSession', session);
  },

  completeExercise() {
    const { session } = get();
    if (!session) return;
    const updated: WorkoutSession = {
      ...session,
      completedExercises: [
        ...session.completedExercises,
        { exerciseId: `ex-${session.currentExerciseIndex}`, completedAt: Date.now() },
      ],
      currentExerciseIndex: session.currentExerciseIndex + 1,
    };
    set({ session: updated });
    storage.set('activeSession', updated);
  },

  endSession() {
    const { session } = get();
    if (!session) return null;
    const duration = getElapsedSeconds(session.startTimestamp);
    const finished: WorkoutSession = {
      ...session,
      endTimestamp: Date.now(),
      duration,
      completedDate: todayString(),
      isActive: false,
    };
    set({ session: null });
    storage.remove('activeSession');
    return finished;
  },

  abandonSession() {
    set({ session: null });
    storage.remove('activeSession');
  },

  startChain() {
    const chain: ChainState = {
      triedTitles: [],
      totalDuration: 0,
      totalCount: 0,
      trainedGroups: [],
    };
    set({ chain });
    storage.set('activeChain', chain);
  },

  // Merges a just-finished day into the running chain and returns the
  // updated chain (so the caller can immediately use the totals without
  // waiting on a re-render).
  addToChain(title, duration, count, groups) {
    const existing = get().chain ?? { triedTitles: [], totalDuration: 0, totalCount: 0, trainedGroups: [] };
    const updated: ChainState = {
      triedTitles: [...existing.triedTitles, title.trim().toLowerCase()],
      totalDuration: existing.totalDuration + duration,
      totalCount: existing.totalCount + count,
      trainedGroups: [...existing.trainedGroups, ...groups.filter((g) => !existing.trainedGroups.includes(g))],
    };
    set({ chain: updated });
    storage.set('activeChain', updated);
    return updated;
  },

  clearChain() {
    set({ chain: null });
    storage.remove('activeChain');
  },
}));