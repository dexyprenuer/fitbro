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

export type SessionExercise = {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  completedSets: number;
};

export type Session = {
  id: string;
  routineId: string;
  workoutDayId: string;
  exercises: SessionExercise[];
  startedAt: number;
  completedAt?: number;
  isCompleted: boolean;
};

export type AppSettings = {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
};
