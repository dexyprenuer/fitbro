import { create } from 'zustand';
import { storage } from '@/lib/storage';
import { computeNewStreak, todayString, isStreakAlive } from '@/lib/streak';
import type { AppState, Theme } from '@/types';

interface AppStoreState extends AppState {
  hydrate:                  () => void;
  setTheme:                 (theme: Theme) => void;
  toggleTheme:              () => void;
  recordWorkoutCompletion:  (workoutDayId: string) => void;
}

const DEFAULTS: AppState = {
  theme:               'dark',
  currentStreak:       0,
  longestStreak:       0,
  lastWorkoutDate:     null,
  completedDates:      [],
  completedWorkoutIds: [],
  displayName:         'Athlete',
};

export const useAppStore = create<AppStoreState>((set, get) => ({
  ...DEFAULTS,

  hydrate() {
    const saved = storage.get<AppState>('app', DEFAULTS);
    const alive = isStreakAlive(saved.lastWorkoutDate);
    set({
      ...saved,
      /* Reset streak display if it has lapsed */
      currentStreak:       alive ? saved.currentStreak : 0,
      completedWorkoutIds: saved.completedWorkoutIds ?? [],
    });
    document.documentElement.setAttribute('data-theme', saved.theme);
  },

  setTheme(theme) {
    /* Persist only the plain data shape, not store functions */
    const { hydrate, setTheme, toggleTheme, recordWorkoutCompletion, ...data } = get();
    set({ theme });
    storage.set('app', { ...data, theme });
    document.documentElement.setAttribute('data-theme', theme);

    /* Briefly add .theme-transition class for smooth CSS property transitions */
    document.documentElement.classList.add('theme-transition');
    window.setTimeout(
      () => document.documentElement.classList.remove('theme-transition'),
      400
    );
  },

  toggleTheme() {
    get().setTheme(get().theme === 'dark' ? 'light' : 'dark');
  },

  recordWorkoutCompletion(workoutDayId) {
    const state = get();
    const today = todayString();

    const { newStreak, changed } = computeNewStreak({
      currentStreak:    state.currentStreak,
      lastWorkoutDate:  state.lastWorkoutDate,
      completedDates:   state.completedDates,
      dateCompleted:    today,
    });

    const trackingKey        = `${today}:${workoutDayId}`;
    const completedWorkoutIds = state.completedWorkoutIds.includes(trackingKey)
      ? state.completedWorkoutIds
      : [...state.completedWorkoutIds, trackingKey];

    const longestStreak = Math.max(newStreak, state.longestStreak);

    const completedDates = changed
      ? [...state.completedDates, today].sort()
      : state.completedDates;

    /* Persist only serialisable data */
    const { hydrate, setTheme, toggleTheme, recordWorkoutCompletion, ...rest } = get();
    const next = {
      ...rest,
      currentStreak:       newStreak,
      longestStreak,
      lastWorkoutDate:     today,
      completedDates,
      completedWorkoutIds,
    };

    set(next);
    storage.set('app', next);
  },
}));