import { create } from 'zustand';
import { storage } from '@/lib/storage';
import { computeNewStreak, todayString, isStreakAlive } from '@/lib/streak';
import type { AppState, Theme } from '@/types';

interface AppStore extends AppState {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  recordWorkoutCompletion: () => void;
  hydrate: () => void;
}

const DEFAULTS: AppState = {
  theme: 'dark',
  currentStreak: 0,
  longestStreak: 0,
  lastWorkoutDate: null,
  completedDates: [],
  displayName: 'Athlete',
};

export const useAppStore = create<AppStore>((set, get) => ({
  ...DEFAULTS,

  hydrate() {
    const saved = storage.get<AppState>('app', DEFAULTS);
    // Check if streak is still alive on hydration
    const alive = isStreakAlive(saved.lastWorkoutDate);
    set({
      ...saved,
      currentStreak: alive ? saved.currentStreak : 0,
    });
    // Apply theme to document
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

  recordWorkoutCompletion() {
    const state = get();
    const today = todayString();
    const { newStreak, changed } = computeNewStreak({
      currentStreak: state.currentStreak,
      lastWorkoutDate: state.lastWorkoutDate,
      completedDates: state.completedDates,
      dateCompleted: today,
    });

    if (!changed) return;

    const completedDates = [...state.completedDates, today].sort();
    const longestStreak = Math.max(newStreak, state.longestStreak);

    const next: AppState = {
      ...state,
      currentStreak: newStreak,
      longestStreak,
      lastWorkoutDate: today,
      completedDates,
    };
    set(next);
    storage.set('app', next);
  },
}));
