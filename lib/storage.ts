/**
 * Type-safe localStorage abstraction.
 * Falls back gracefully if localStorage is unavailable (SSR / private mode).
 */

const PREFIX = 'fitbro:';

function key(k: string) {
  return `${PREFIX}${k}`;
}

export const storage = {
  get<T>(k: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const raw = localStorage.getItem(key(k));
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  set<T>(k: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key(k), JSON.stringify(value));
    } catch {
      // quota exceeded — silently fail
    }
  },

  remove(k: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key(k));
    } catch {
      // ignore
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(PREFIX))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore
    }
  },
};