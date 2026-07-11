// hooks/useRealtimeTable.ts
import { useEffect, useRef } from 'react';
import { supabaseRealtime } from '@/lib/supabase';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

/**
 * Subscribes to Postgres change events on a table via Supabase Realtime.
 * Calls onChange for every INSERT/UPDATE/DELETE. Caller decides what to do
 * (refetch, patch local state, etc).
 */
export function useRealtimeTable(
  table: string,
  onChange: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void
) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const channel = supabaseRealtime
      .channel(`realtime:${table}:${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => onChangeRef.current(payload)
      )
      .subscribe();

    return () => {
      supabaseRealtime.removeChannel(channel);
    };
  }, [table]);
}