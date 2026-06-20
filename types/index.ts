export type Theme = 'light' | 'dark' | 'system';

export type AppState = {
  theme: Theme;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
  completedDates: string[];
  displayName: string;
};

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  instructions?: string;
};

export type WorkoutDay = {
  id: string;
  title: string;
  emoji: string;
  exercises: Exercise[];
};

export type Routine = {
  id: string;
  name: string;
  type: 'preset' | 'custom';
  schedule: (string | null)[];
  workoutDays: WorkoutDay[];
};

export type CompletedExerciseLog = {
  exerciseId: string;
  completedAt: number;
};

export type Session = {
  id: string;
  routineId: string;
  workoutDayId: string;
  startTimestamp: number;
  endTimestamp?: number;
  duration?: number;
  completedDate?: string;
  completedExercises: CompletedExerciseLog[];
  currentExerciseIndex: number;
  isActive: boolean;
};

// Type alias utilized by useSessionStore.ts
export type WorkoutSession = Session;

export type AppSettings = {
  theme: Theme;
  notificationsEnabled: boolean;
};

export type ExerciseOverride = {
  exerciseId: string;
  customSets?: number;
  customReps?: number;
};

export type WorkoutSettings = {
  overrides: Record<string, ExerciseOverride>;
};
