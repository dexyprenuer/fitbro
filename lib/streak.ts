import { format, parseISO, differenceInCalendarDays } from 'date-fns';

export function todayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Given the existing streak state and a completion date string,
 * returns the new streak count and whether it changed.
 */
export function computeNewStreak(params: {
  currentStreak: number;
  lastWorkoutDate: string | null;
  completedDates: string[];
  dateCompleted: string;
}): { newStreak: number; changed: boolean } {
  const { currentStreak, lastWorkoutDate, completedDates, dateCompleted } = params;

  // Already counted today
  if (completedDates.includes(dateCompleted)) {
    return { newStreak: currentStreak, changed: false };
  }

  let newStreak = currentStreak;

  if (!lastWorkoutDate) {
    // First ever workout
    newStreak = 1;
  } else {
    const diff = differenceInCalendarDays(
      parseISO(dateCompleted),
      parseISO(lastWorkoutDate)
    );
    if (diff === 1) {
      // Consecutive day
      newStreak = currentStreak + 1;
    } else if (diff === 0) {
      // Same day already counted — shouldn't reach here due to check above
      newStreak = currentStreak;
    } else {
      // Gap — reset
      newStreak = 1;
    }
  }

  return { newStreak, changed: true };
}

/**
 * Returns true if the user still has an active streak today
 * (last workout was yesterday or today).
 */
export function isStreakAlive(lastWorkoutDate: string | null): boolean {
  if (!lastWorkoutDate) return false;
  const diff = differenceInCalendarDays(new Date(), parseISO(lastWorkoutDate));
  return diff <= 1;
}