This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: store/useAppStore.ts, lib/storage.ts, lib/streak.ts, lib/utils.ts, components/ui/GlassCard.tsx, components/ui/Modal.tsx, components/ui/Button.tsx, components/ui/BottomNav.tsx, components/ui/BottomNavWrapper.tsx, components/ui/PageTransition.tsx
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
components/
  ui/
    BottomNav.tsx
    BottomNavWrapper.tsx
    Button.tsx
    GlassCard.tsx
    Modal.tsx
    PageTransition.tsx
lib/
  storage.ts
  streak.ts
  utils.ts
store/
  useAppStore.ts
```

# Files

## File: components/ui/BottomNavWrapper.tsx
```typescript
'use client';

import { usePathname } from 'next/navigation';
import { BottomNav } from '@/components/ui/BottomNav';

/**
 * Wrapper that conditionally renders BottomNav only on protected app routes.
 * 
 * BottomNav should NOT appear on:
 * - /sign-in/* (auth)
 * - /sign-up/* (auth)
 * - /onboarding (pre-app)
 * 
 * BottomNav SHOULD appear on:
 * - / (home)
 * - /exercise/* (protected app)
 * - /routine/* (protected app)
 * - /settings/* (protected app)
 * - /account (protected app)
 */
export function BottomNavWrapper() {
  const pathname = usePathname();

  // Routes where BottomNav should NOT appear
  const hideNavRoutes = ['/sign-in', '/sign-up', '/onboarding'];
  const shouldHideNav = hideNavRoutes.some((route) => pathname.startsWith(route));

  if (shouldHideNav) {
    return null;
  }

  return <BottomNav />;
}
```

## File: components/ui/Modal.tsx
```typescript
'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  /** Prevent closing by tapping backdrop */
  persistent?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  persistent = false,
}: ModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !persistent) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose, persistent]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(8px)' }}
            onClick={persistent ? undefined : onClose}
          />

          {/* Sheet — slides up from bottom on mobile */}
          <motion.div
            key="sheet"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto',
              'glass-heavy rounded-t-3xl px-4 pt-4 pb-safe',
              'max-h-[90dvh] overflow-y-auto',
              className
            )}
          >
            {/* Drag handle */}
            <div className="w-10 h-1 rounded-full bg-[var(--border-strong)] mx-auto mb-4" />

            {/* Header */}
            {(title || !persistent) && (
              <div className="flex items-center justify-between mb-5">
                {title && (
                  <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                    {title}
                  </h2>
                )}
                {!persistent && (
                  <button
                    onClick={onClose}
                    className="ml-auto w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--surface)' }}
                    aria-label="Close"
                  >
                    <X size={16} style={{ color: 'var(--text-secondary)' }} />
                  </button>
                )}
              </div>
            )}

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

## File: lib/storage.ts
```typescript
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
```

## File: lib/streak.ts
```typescript
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
```

## File: lib/utils.ts
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## File: components/ui/Button.tsx
```typescript
'use client';

import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'success';
type ButtonSize   = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?:  ButtonVariant;
  size?:     ButtonSize;
  fullWidth?: boolean;
  loading?:  boolean;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background:  'var(--accent)',
    color:       '#fff',
    boxShadow:   '0 4px 20px var(--accent-glow), 0 1px 0 rgba(255,255,255,0.12) inset',
  },
  secondary: {
    background:  'var(--glass)',
    color:       'var(--text-primary)',
    border:      '1px solid var(--glass-border-strong)',
    backdropFilter: 'blur(20px) saturate(160%)',
    WebkitBackdropFilter: 'blur(20px) saturate(160%)',
  },
  ghost: {
    background:  'transparent',
    color:       'var(--text-secondary)',
  },
  destructive: {
    background:  'var(--destructive-dim)',
    color:       'var(--destructive)',
    border:      '1px solid rgba(248,113,113,0.22)',
  },
  success: {
    background:  'var(--success-dim)',
    color:       'var(--success)',
    border:      '1px solid rgba(52,211,153,0.22)',
  },
};

/* Use CSS-var radius tokens — no hardcoded Tailwind radius classes */
const sizeStyles: Record<ButtonSize, React.CSSProperties & { className: string }> = {
  sm: {
    className:   'px-3.5 py-2 text-sm gap-1.5',
    borderRadius: 'var(--radius-sm)',
    minHeight:   '36px',
  },
  md: {
    className:   'px-5 py-2.5 text-sm gap-2',
    borderRadius: 'var(--radius-md)',
    minHeight:   '42px',
  },
  lg: {
    className:   'px-6 py-3.5 text-base gap-2',
    borderRadius: 'var(--radius-lg)',
    minHeight:   '50px',
  },
  xl: {
    className:   'px-8 py-4 text-base gap-2.5',
    borderRadius: 'var(--radius-xl)',
    minHeight:   '56px',
  },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant   = 'primary',
      size      = 'md',
      fullWidth = false,
      loading   = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const { className: sizeClass, ...sizeStyle } = sizeStyles[size];

    return (
      <motion.button
        ref={ref}
        /* Scale tap — no hover scale on mobile (saves animation budget) */
        whileTap={isDisabled ? {} : { scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 420, damping: 26 }}
        disabled={isDisabled}
        className={cn(
          'relative inline-flex items-center justify-center font-semibold font-display',
          'select-none transition-opacity duration-150 tap-target',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
          sizeClass,
          fullWidth && 'w-full',
          isDisabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        style={{
          ...variantStyles[variant],
          ...sizeStyle,
          ...style,
        }}
        {...props}
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            {leftIcon  && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

function Spinner() {
  return (
    <svg
      className="animate-spin w-[18px] h-[18px]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
```

## File: components/ui/GlassCard.tsx
```typescript
import { cn } from '@/lib/utils';

type GlassCardVariant = 'default' | 'elevated' | 'interactive' | 'accent' | 'success';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: GlassCardVariant;
  noPad?: boolean;
}

const variantStyles: Record<GlassCardVariant, React.CSSProperties> = {
  default: {
    background: 'var(--glass)',
    borderColor: 'var(--glass-border)',
    boxShadow: 'var(--shadow-sm)',
  },
  elevated: {
    background: 'var(--glass-heavy)',
    borderColor: 'var(--glass-border-strong)',
    boxShadow: 'var(--shadow-lg)',
  },
  interactive: {
    background: 'var(--card)',
    borderColor: 'var(--glass-border)',
    boxShadow: 'var(--shadow-sm)',
    cursor: 'pointer',
  },
  accent: {
    background: 'linear-gradient(135deg, var(--accent-dim) 0%, var(--glass) 100%)',
    borderColor: 'rgba(108,99,255,0.18)',
    boxShadow: 'var(--shadow), 0 0 0 1px var(--accent-dim)',
  },
  success: {
    background: 'linear-gradient(135deg, var(--success-dim) 0%, var(--glass) 100%)',
    borderColor: 'rgba(52,211,153,0.18)',
    boxShadow: 'var(--shadow), 0 0 0 1px var(--success-dim)',
  },
};

export function GlassCard({
  children,
  className,
  variant = 'default',
  noPad = false,
  style,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'border backdrop-blur-xl',
        !noPad && 'p-4',
        className
      )}
      style={{
        borderRadius: 'var(--radius-lg)',
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        willChange: 'transform',
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
```

## File: components/ui/PageTransition.tsx
```typescript
'use client';

import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  mode?: 'up' | 'fade';
}

const variants = {
  up: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: -6 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit:    { opacity: 0 },
  },
};

export function PageTransition({ children, mode = 'up' }: PageTransitionProps) {
  const v = variants[mode];

  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: 'transform, opacity', minHeight: '100%' }}
    >
      {children}
    </motion.div>
  );
}
```

## File: components/ui/BottomNav.tsx
```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Dumbbell, CalendarDays, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/exercise', icon: Dumbbell, label: 'Exercise' },
  { href: '/routine', icon: CalendarDays, label: 'Routine' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none gpu">
      <div
        className="mx-4 mb-4 pointer-events-auto nav-floating rounded-[var(--radius-2xl)]"
        style={{ maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}
      >
        <div
          className="relative flex items-center justify-around px-2 py-3"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href));

            return (
              <Link
                key={href}
                href={href}
                className="relative flex flex-col items-center gap-1 px-3 tap-target justify-center"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <div className="relative w-10 h-10 flex items-center justify-center">
                  {/* Sliding pill — layoutId makes framer-motion animate it
                      between positions instead of cross-fading two elements */}
                  {active && (
                    <motion.div
                      layoutId="nav-active-pill"
                      transition={{ type: 'spring', stiffness: 500, damping: 32, mass: 0.7 }}
                      className="absolute inset-0 rounded-full gpu"
                      style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
                    />
                  )}

                  <motion.div
                    className="relative z-10 flex items-center justify-center"
                    initial={false}
                    animate={
                      active
                        ? { scale: 1, y: 0 }
                        : { scale: 1, y: 0 }
                    }
                    whileTap={{ scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  >
                    <motion.div
                      initial={false}
                      animate={active ? { rotate: [0, -8, 8, 0] } : { rotate: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                      <Icon
                        size={20}
                        strokeWidth={active ? 2.3 : 1.8}
                        style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}
                      />
                    </motion.div>
                  </motion.div>
                </div>

                <motion.span
                  initial={false}
                  animate={{
                    color: active ? 'var(--accent)' : 'var(--text-muted)',
                    opacity: active ? 1 : 0.8,
                  }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px] font-semibold leading-none"
                >
                  {label}
                </motion.span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

## File: store/useAppStore.ts
```typescript
import { create } from 'zustand';
import { storage } from '@/lib/storage';
import { computeNewStreak, todayString, isStreakAlive } from '@/lib/streak';
import type { AppState, Theme } from '@/types';

interface AppStoreState extends AppState {
  hydrate:                  () => void;
  setTheme:                 (theme: Theme) => void;
  toggleTheme:              () => void;
  recordWorkoutCompletion:  (workoutDayId: string) => void;
}

const DEFAULTS: AppState = {
  theme:               'dark',
  currentStreak:       0,
  longestStreak:       0,
  lastWorkoutDate:     null,
  completedDates:      [],
  completedWorkoutIds: [],
  displayName:         'Athlete',
};

export const useAppStore = create<AppStoreState>((set, get) => ({
  ...DEFAULTS,

  hydrate() {
    const saved = storage.get<AppState>('app', DEFAULTS);
    const alive = isStreakAlive(saved.lastWorkoutDate);
    set({
      ...saved,
      /* Reset streak display if it has lapsed */
      currentStreak:       alive ? saved.currentStreak : 0,
      completedWorkoutIds: saved.completedWorkoutIds ?? [],
    });
    document.documentElement.setAttribute('data-theme', saved.theme);
  },

  setTheme(theme) {
    /* Persist only the plain data shape, not store functions */
    const { hydrate, setTheme, toggleTheme, recordWorkoutCompletion, ...data } = get();
    set({ theme });
    storage.set('app', { ...data, theme });
    document.documentElement.setAttribute('data-theme', theme);

    /* Briefly add .theme-transition class for smooth CSS property transitions */
    document.documentElement.classList.add('theme-transition');
    window.setTimeout(
      () => document.documentElement.classList.remove('theme-transition'),
      400
    );
  },

  toggleTheme() {
    get().setTheme(get().theme === 'dark' ? 'light' : 'dark');
  },

  recordWorkoutCompletion(workoutDayId) {
    const state = get();
    const today = todayString();

    const { newStreak, changed } = computeNewStreak({
      currentStreak:    state.currentStreak,
      lastWorkoutDate:  state.lastWorkoutDate,
      completedDates:   state.completedDates,
      dateCompleted:    today,
    });

    const trackingKey        = `${today}:${workoutDayId}`;
    const completedWorkoutIds = state.completedWorkoutIds.includes(trackingKey)
      ? state.completedWorkoutIds
      : [...state.completedWorkoutIds, trackingKey];

    const longestStreak = Math.max(newStreak, state.longestStreak);

    const completedDates = changed
      ? [...state.completedDates, today].sort()
      : state.completedDates;

    /* Persist only serialisable data */
    const { hydrate, setTheme, toggleTheme, recordWorkoutCompletion, ...rest } = get();
    const next = {
      ...rest,
      currentStreak:       newStreak,
      longestStreak,
      lastWorkoutDate:     today,
      completedDates,
      completedWorkoutIds,
    };

    set(next);
    storage.set('app', next);
  },
}));
```
