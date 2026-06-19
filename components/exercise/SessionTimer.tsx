'use client';

import { useElapsedTime } from '@/hooks/useElapsedTime';
import { formatDuration } from '@/lib/timer';
import { Timer } from 'lucide-react';

interface SessionTimerProps {
  startTimestamp: number;
}

export function SessionTimer({ startTimestamp }: SessionTimerProps) {
  const elapsed = useElapsedTime(startTimestamp);

  return (
    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
      <Timer size={16} />
      <span className="font-mono text-sm font-medium tabular-nums">
        {formatDuration(elapsed)}
      </span>
    </div>
  );
}