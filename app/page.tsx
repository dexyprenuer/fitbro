'use client';

import { PageTransition } from '@/components/ui/PageTransition';
import { StreakBadge } from '@/components/home/StreakBadge';
import { TodayCard } from '@/components/home/TodayCard';
import { WorkoutCard } from '@/components/home/WorkoutCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useRoutineStore } from '@/store/useRoutineStore';
import { useAppStore } from '@/store/useAppStore';

export default function HomePage() {
  const activeRoutine = useRoutineStore((s) => s.activeRoutine);
  const completedDates = useAppStore((s) => s.completedDates);
  const routine = activeRoutine();

  // Weekly progress: how many scheduled days this week are completed
  const today = new Date();
  const dayOfWeek = today.getDay();
  const scheduledThisWeek = routine.schedule.slice(0, dayOfWeek + 1).filter(Boolean).length;
  const completedThisWeek = completedDates.filter((d) => {
    const date = new Date(d);
    const diff = (today.getTime() - date.getTime()) / 86400000;
    return diff >= 0 && diff < 7;
  }).length;
  const weeklyProgress = scheduledThisWeek > 0
    ? Math.min(100, (completedThisWeek / scheduledThisWeek) * 100)
    : 0;

  return (
    <PageTransition>
      <div className="px-4 pt-12 max-w-lg mx-auto space-y-6 pb-4">
        {/* Header */}
        <div>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Good session</p>
          <h1 className="font-display text-3xl font-bold text-[var(--text-primary)] mt-0.5">
            FitBro 💪
          </h1>
        </div>

        {/* Streak */}
        <StreakBadge />

        {/* Today */}
        <div>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 px-1">
            Today
          </p>
          <TodayCard />
        </div>

        {/* Weekly progress */}
        <div className="px-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
              Weekly Progress
            </p>
            <p className="text-xs font-medium text-[var(--text-secondary)]">
              {completedThisWeek}/{scheduledThisWeek} days
            </p>
          </div>
          <ProgressBar value={weeklyProgress} showLabel />
        </div>

        {/* All workouts */}
        <div>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2 px-1">
            Your Workouts
          </p>
          <div className="space-y-2">
            {routine.workoutDays.map((day, i) => (
              <WorkoutCard key={day.id} workoutDay={day} index={i} />
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}