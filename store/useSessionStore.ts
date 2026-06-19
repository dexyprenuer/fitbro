import { create } from 'zustand';
import { storage } from '@/lib/storage';
import { todayString } from '@/lib/streak';
import { getElapsedSeconds } from '@/lib/timer';
import type { WorkoutSession } from '@/types';

interface SessionStore {
  session: WorkoutSession | null;
  startSession: (workoutDayId: string, routineId: string) => void;
  completeExercise: () => void;
  endSession: () => WorkoutSession | null;
  abandonSession: () => void;
  hydrate: () => void;
}

function newId() {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  session: null,

  hydrate() {
    const session = storage.get<WorkoutSession | null>('activeSession', null);
    if (session?.isActive) {
      set({ session });
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
}));