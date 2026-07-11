// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

/**
 * Lazy singleton for Supabase Realtime client.
 * Only initializes when called (browser-only), not at module load time.
 */
export function getSupabaseRealtime() {
  // Fail gracefully if we somehow get called server-side (shouldn't happen with proper use)
  if (typeof window === 'undefined') {
    throw new Error('Supabase Realtime client can only be used in the browser');
  }

  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Missing Supabase env vars. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
      );
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: { eventsPerSecond: 5 },
      },
    });
  }

  return supabaseInstance;
}