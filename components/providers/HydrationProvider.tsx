'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useRoutineStore } from '@/store/useRoutineStore';
import { useSessionStore } from '@/store/useSessionStore';
import { useSettingsStore } from '@/store/useSettingsStore';

export function HydrationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAppStore.getState().hydrate();
    useRoutineStore.getState().hydrate();
    useSessionStore.getState().hydrate();
    useSettingsStore.getState().hydrate();
  }, []);

  return <>{children}</>;
}