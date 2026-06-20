import { create } from 'zustand';
import { storage } from '@/lib/storage';
import { computeNewStreak, todayString, isStreakAlive } from '@/lib/streak';
import type { AppState, Theme } from '@/types';

// Explicitly merge AppState (data fields) and actions together
interface AppStoreState extends AppState {
  hydrate: () => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  recordWorkoutCompletion: (workoutDayId: string) => void;
}

const DEFAULTS: AppState = {
  theme: 'dark',
  currentStreak: 0,
  longestStreak: 0,
  lastWorkoutDate: null,
  completedDates: [],
  completedWorkoutIds: [],
  displayName: 'Athlete',
};

export const useAppStore = create<AppStoreState>((set, get) => ({
  ...DEFAULTS,

  hydrate() {
    const saved = storage.get<AppState>('app', DEFAULTS);
    const alive = isStreakAlive(saved.lastWorkoutDate);
    set({
      ...saved,
      currentStreak: alive ? saved.currentStreak : 0,
      completedWorkoutIds: saved.completedWorkoutIds || [],
    });
    document.documentElement.setAttribute('data-theme', saved.theme);
  },

  setTheme(theme) {
    set({ theme });
    storage.set('app', { ...get(), theme });
    document.documentElement.setAttribute('data-theme', theme);
  },

  toggleTheme() {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },

  recordWorkoutCompletion(workoutDayId) {
    const state = get();
    const today = todayString();
    const { newStreak, changed } = computeNewStreak({
      currentStreak: state.currentStreak,
      lastWorkoutDate: state.lastWorkoutDate,
      completedDates: state.completedDates,
      dateCompleted: today,
    });

    const completedWorkoutIds = [...(state.completedWorkoutIds || [])];
    const trackingKey = `${today}:${workoutDayId}`;
    if (!completedWorkoutIds.includes(trackingKey)) {
      completedWorkoutIds.push(trackingKey);
    }

    const longestStreak = Math.max(newStreak, state.longestStreak);

    const next: AppState = {
      ...state,
      currentStreak: newStreak,
      longestStreak,
      lastWorkoutDate: today,
      completedDates: changed ? [...state.completedDates, today].sort() : state.completedDates,
      completedWorkoutIds,
    };
    set(next);
    storage.set('app', next);
  },
}));
