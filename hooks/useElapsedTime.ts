import { useEffect, useState } from 'react';
import { getElapsedSeconds } from '@/lib/timer';

/**
 * Returns elapsed seconds since `startTimestamp` (epoch ms).
 * Updates every second using requestAnimationFrame for 120Hz smoothness.
 * Derives time from wall clock — accurate after tab switch / screen lock.
 */
export function useElapsedTime(startTimestamp: number | null): number {
  const [elapsed, setElapsed] = useState(
    startTimestamp ? getElapsedSeconds(startTimestamp) : 0
  );

  useEffect(() => {
    if (!startTimestamp) return;
    let rafId: number;
    let lastSecond = getElapsedSeconds(startTimestamp);

    function tick() {
      const now = getElapsedSeconds(startTimestamp!);
      if (now !== lastSecond) {
        lastSecond = now;
        setElapsed(now);
      }
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [startTimestamp]);

  return elapsed;
}