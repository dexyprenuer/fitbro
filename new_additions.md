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
- Only files matching these patterns are included: app/globals.css, components/ui/ProgressBar.tsx, components/ui/PageTransition.tsx, components/home/StreakBadge.tsx
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
app/
  globals.css
components/
  home/
    StreakBadge.tsx
  ui/
    PageTransition.tsx
    ProgressBar.tsx
```

# Files

## File: components/ui/ProgressBar.tsx
```typescript
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ProgressColor = 'accent' | 'success' | 'warning';

interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  showLabel?: boolean;
  color?: ProgressColor;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const colorMap: Record<ProgressColor, { bar: string; glow: string }> = {
  accent:  { bar: 'var(--accent)',  glow: 'var(--accent-glow)' },
  success: { bar: 'var(--success)', glow: 'var(--success-glow)' },
  warning: { bar: 'var(--warning)', glow: 'rgba(251,191,36,0.30)' },
};

const sizeMap = { sm: 'h-1', md: 'h-2', lg: 'h-3' };

export function ProgressBar({
  value,
  className,
  showLabel,
  color = 'accent',
  size = 'md',
  animated = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const { bar, glow } = colorMap[color];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'flex-1 rounded-full overflow-hidden',
          sizeMap[size]
        )}
        style={{ background: 'var(--border)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${bar} 0%, ${bar}cc 100%)`,
            boxShadow: clamped > 0 ? `0 0 8px ${glow}` : 'none',
          }}
          initial={animated ? { width: 0 } : { width: `${clamped}%` }}
          animate={{ width: `${clamped}%` }}
          transition={
            animated
              ? { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }
              : { duration: 0 }
          }
        />
      </div>
      {showLabel && (
        <span
          className="text-xs font-semibold tabular-nums w-9 text-right"
          style={{ color: 'var(--text-secondary)' }}
        >
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
```

## File: app/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

/* ─── Dark Theme ───────────────────────────────────────────────────────────── */

:root[data-theme='dark'] {
  /* Backgrounds */
  --bg:               #0a0c12;
  --bg-secondary:     #10131a;
  --bg-tertiary:      #161922;

  /* Surfaces */
  --surface:          rgba(255, 255, 255, 0.04);
  --surface-hover:    rgba(255, 255, 255, 0.07);
  --surface-active:   rgba(255, 255, 255, 0.10);
  --card:             rgba(255, 255, 255, 0.05);
  --card-hover:       rgba(255, 255, 255, 0.08);

  /* Glass */
  --glass:            rgba(255, 255, 255, 0.055);
  --glass-heavy:      rgba(255, 255, 255, 0.10);
  --glass-border:     rgba(255, 255, 255, 0.08);
  --glass-border-strong: rgba(255, 255, 255, 0.15);

  /* Accent */
  --accent:           #6c63ff;
  --accent-hover:     #7d75ff;
  --accent-active:    #5a52e0;
  --accent-dim:       rgba(108, 99, 255, 0.16);
  --accent-dim-hover: rgba(108, 99, 255, 0.26);
  --accent-glow:      rgba(108, 99, 255, 0.32);

  /* Secondary accent */
  --secondary-accent:     #a78bfa;
  --secondary-accent-dim: rgba(167, 139, 250, 0.14);

  /* Semantic */
  --success:          #34d399;
  --success-dim:      rgba(52, 211, 153, 0.16);
  --success-glow:     rgba(52, 211, 153, 0.28);
  --warning:          #fbbf24;
  --warning-dim:      rgba(251, 191, 36, 0.16);
  --destructive:      #f87171;
  --destructive-dim:  rgba(248, 113, 113, 0.16);

  /* Text */
  --text-primary:     #f0f1f8;
  --text-secondary:   #8a8ea6;
  --text-muted:       #474b62;
  --text-inverse:     #0a0c12;

  /* Border */
  --border:           rgba(255, 255, 255, 0.065);
  --border-strong:    rgba(255, 255, 255, 0.13);

  /* Shadow */
  --shadow-sm:        0 2px 10px rgba(0, 0, 0, 0.35);
  --shadow:           0 8px 32px rgba(0, 0, 0, 0.45);
  --shadow-lg:        0 20px 60px rgba(0, 0, 0, 0.55);
  --shadow-glow:      0 0 28px var(--accent-glow);
  --shadow-nav:       0 -12px 40px rgba(0, 0, 0, 0.40), 0 -1px 0 rgba(255,255,255,0.06);

  /* Aurora */
  --aurora-1:         rgba(108, 99, 255, 0.11);
  --aurora-2:         rgba(52, 211, 153, 0.06);
  --aurora-3:         rgba(167, 139, 250, 0.05);

  /* Nav */
  --nav-bg:           rgba(13, 15, 22, 0.88);
}

/* ─── Light Theme ──────────────────────────────────────────────────────────── */

:root[data-theme='light'] {
  /* Backgrounds */
  --bg:               #eef0f6;
  --bg-secondary:     #e5e8f0;
  --bg-tertiary:      #dde0ea;

  /* Surfaces */
  --surface:          rgba(255, 255, 255, 0.78);
  --surface-hover:    rgba(255, 255, 255, 0.94);
  --surface-active:   rgba(255, 255, 255, 1.00);
  --card:             rgba(255, 255, 255, 0.82);
  --card-hover:       rgba(255, 255, 255, 0.96);

  /* Glass */
  --glass:            rgba(255, 255, 255, 0.64);
  --glass-heavy:      rgba(255, 255, 255, 0.84);
  --glass-border:     rgba(255, 255, 255, 0.90);
  --glass-border-strong: rgba(255, 255, 255, 1.00);

  /* Accent */
  --accent:           #5b52e8;
  --accent-hover:     #6b63f0;
  --accent-active:    #4b43d0;
  --accent-dim:       rgba(91, 82, 232, 0.09);
  --accent-dim-hover: rgba(91, 82, 232, 0.16);
  --accent-glow:      rgba(91, 82, 232, 0.20);

  /* Secondary accent */
  --secondary-accent:     #7c3aed;
  --secondary-accent-dim: rgba(124, 58, 237, 0.09);

  /* Semantic */
  --success:          #059669;
  --success-dim:      rgba(5, 150, 105, 0.09);
  --success-glow:     rgba(5, 150, 105, 0.18);
  --warning:          #d97706;
  --warning-dim:      rgba(217, 119, 6, 0.09);
  --destructive:      #dc2626;
  --destructive-dim:  rgba(220, 38, 38, 0.09);

  /* Text */
  --text-primary:     #111318;
  --text-secondary:   #565a74;
  --text-muted:       #9aa0b8;
  --text-inverse:     #f0f1f8;

  /* Border */
  --border:           rgba(0, 0, 0, 0.065);
  --border-strong:    rgba(0, 0, 0, 0.13);

  /* Shadow */
  --shadow-sm:        0 2px 10px rgba(0, 0, 0, 0.07);
  --shadow:           0 8px 32px rgba(0, 0, 0, 0.10);
  --shadow-lg:        0 20px 60px rgba(0, 0, 0, 0.14);
  --shadow-glow:      0 0 28px var(--accent-glow);
  --shadow-nav:       0 -12px 40px rgba(0, 0, 0, 0.10), 0 -1px 0 rgba(255,255,255,0.80);

  /* Aurora */
  --aurora-1:         rgba(91, 82, 232, 0.065);
  --aurora-2:         rgba(5, 150, 105, 0.04);
  --aurora-3:         rgba(124, 58, 237, 0.035);

  /* Nav */
  --nav-bg:           rgba(238, 240, 246, 0.90);
}

/* ─── Radius Scale ─────────────────────────────────────────────────────────── */

:root {
  --radius-xs:  10px;
  --radius-sm:  14px;
  --radius-md:  18px;
  --radius-lg:  24px;
  --radius-xl:  30px;
  --radius-2xl: 36px;
  --radius-full: 9999px;
}

/* ─── Base Reset ───────────────────────────────────────────────────────────── */

*, *::before, *::after {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html {
  background-color: var(--bg);
  color: var(--text-primary);
  font-family: 'Inter', system-ui, sans-serif;
  transition: background-color 0.38s ease, color 0.22s ease;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  min-height: 100dvh;
  background-color: var(--bg);
  position: relative;
  overflow-x: hidden;
}

/* ─── Aurora Background ────────────────────────────────────────────────────── */

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 90% 55% at 10% -8%,  var(--aurora-1), transparent 55%),
    radial-gradient(ellipse 65% 45% at 90% 110%, var(--aurora-2), transparent 58%),
    radial-gradient(ellipse 45% 35% at 50%  55%, var(--aurora-3), transparent 68%);
  pointer-events: none;
  z-index: 0;
  transition: background 0.48s ease;
  will-change: background;
}

/* ─── Typography ───────────────────────────────────────────────────────────── */

.font-display {
  font-family: 'Space Grotesk', sans-serif;
}

h1, h2, h3, h4 {
  font-family: 'Space Grotesk', sans-serif;
  line-height: 1.2;
}

/* ─── Glass Utility Classes ────────────────────────────────────────────────── */

.glass {
  background: var(--glass);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid var(--glass-border);
}

.glass-heavy {
  background: var(--glass-heavy);
  backdrop-filter: blur(36px) saturate(180%);
  -webkit-backdrop-filter: blur(36px) saturate(180%);
  border: 1px solid var(--glass-border-strong);
}

/* ─── Card Base ────────────────────────────────────────────────────────────── */

.card-base {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

/* ─── Scrollbar ────────────────────────────────────────────────────────────── */

::-webkit-scrollbar { width: 0; background: transparent; }

/* ─── Safe Area ────────────────────────────────────────────────────────────── */

.pb-safe {
  padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
}

.pt-safe {
  padding-top: max(0.5rem, env(safe-area-inset-top));
}

/* ─── Focus Ring ───────────────────────────────────────────────────────────── */

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}

/* ─── Theme Transition ─────────────────────────────────────────────────────── */

.theme-transition,
.theme-transition * {
  transition:
    background-color 0.38s ease,
    border-color 0.38s ease,
    color 0.22s ease,
    box-shadow 0.38s ease !important;
}

/* ─── Tabular Numbers ──────────────────────────────────────────────────────── */

.tabular-nums {
  font-variant-numeric: tabular-nums;
}

/* ─── Section Label ────────────────────────────────────────────────────────── */

.section-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* ─── GPU Hint ─────────────────────────────────────────────────────────────── */

.gpu {
  will-change: transform;
  transform: translateZ(0);
}

/* ─── Floating Nav ─────────────────────────────────────────────────────────── */

.nav-floating {
  background: var(--nav-bg);
  backdrop-filter: blur(32px) saturate(180%);
  -webkit-backdrop-filter: blur(32px) saturate(180%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-nav);
}

/* ─── Animated Gradient Text ───────────────────────────────────────────────── */

.gradient-text {
  background: linear-gradient(135deg, var(--accent), var(--secondary-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ─── Tap feedback ─────────────────────────────────────────────────────────── */

.tap-target {
  min-height: 44px;
  min-width: 44px;
}

/* ─── Progress Glow ────────────────────────────────────────────────────────── */

.progress-glow {
  box-shadow: 0 0 12px var(--accent-glow);
}

/* ─── Streak Ring ──────────────────────────────────────────────────────────── */

@keyframes streak-pulse {
  0%, 100% { box-shadow: 0 0 0 0 var(--accent-glow); }
  50%       { box-shadow: 0 0 0 8px transparent; }
}

.streak-alive {
  animation: streak-pulse 2.4s ease-in-out infinite;
}
```

## File: components/home/StreakBadge.tsx
```typescript
'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { isStreakAlive } from '@/lib/streak';

export const StreakBadge = memo(function StreakBadge() {
  const currentStreak = useAppStore((s) => s.currentStreak);
  const longestStreak = useAppStore((s) => s.longestStreak);
  const lastWorkoutDate = useAppStore((s) => s.lastWorkoutDate);
  const alive = isStreakAlive(lastWorkoutDate);

  return (
    <div
      className="relative overflow-hidden p-4"
      style={{
        background: alive
          ? `linear-gradient(135deg, var(--accent-dim) 0%, var(--secondary-accent-dim) 100%)`
          : 'var(--card)',
        border: `1px solid ${alive ? 'var(--glass-border-strong)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-xl)',
        boxShadow: alive ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
      }}
    >
      {/* Background glow blob — only when alive, no JS animation needed */}
      {alive && (
        <div
          className="absolute -top-6 -right-6 w-28 h-28 rounded-full pointer-events-none"
          style={{
            background: 'var(--accent-glow)',
            filter: 'blur(28px)',
            opacity: 0.4,
          }}
        />
      )}

      <div className="relative flex items-center gap-4">
        {/* Flame icon */}
        <motion.div
          /* Only animate when alive, not on every render */
          animate={alive ? { scale: [1, 1.10, 1] } : { scale: 1 }}
          transition={
            alive
              ? { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
              : {}
          }
          className={`w-14 h-14 flex items-center justify-center flex-shrink-0 ${alive ? 'streak-alive' : ''}`}
          style={{
            background: alive
              ? 'linear-gradient(135deg, var(--accent-dim), var(--secondary-accent-dim))'
              : 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <Flame
            size={26}
            strokeWidth={1.8}
            style={{ color: alive ? 'var(--accent)' : 'var(--text-muted)' }}
          />
        </motion.div>

        {/* Current streak number */}
        <div className="flex-1 min-w-0">
          <p
            className="section-label mb-0.5"
            style={{ color: alive ? 'var(--accent)' : 'var(--text-muted)' }}
          >
            Current Streak
          </p>
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-display font-bold tabular-nums"
              style={{
                fontSize: '2.4rem',
                lineHeight: 1,
                color: 'var(--text-primary)',
              }}
            >
              {currentStreak}
            </span>
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              {currentStreak === 1 ? 'day' : 'days'}
            </span>
          </div>

          {/* Status chip */}
          <div
            className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full"
            style={{
              background: alive ? 'var(--accent-dim)' : 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <Zap
              size={10}
              style={{ color: alive ? 'var(--accent)' : 'var(--text-muted)' }}
            />
            <span
              className="text-[10px] font-semibold"
              style={{ color: alive ? 'var(--accent)' : 'var(--text-muted)' }}
            >
              {alive ? 'On fire!' : 'Start a streak'}
            </span>
          </div>
        </div>

        {/* Best streak */}
        <div
          className="flex-shrink-0 text-right pl-3"
          style={{
            borderLeft: '1px solid var(--border)',
          }}
        >
          <div
            className="flex items-center gap-1 justify-end mb-0.5"
          >
            <TrendingUp
              size={11}
              style={{ color: 'var(--text-muted)' }}
            />
            <span
              className="section-label"
              style={{ color: 'var(--text-muted)' }}
            >
              Best
            </span>
          </div>
          <span
            className="font-display font-bold tabular-nums"
            style={{
              fontSize: '1.6rem',
              lineHeight: 1,
              color: 'var(--text-secondary)',
            }}
          >
            {longestStreak}
          </span>
          <p
            className="text-[10px] mt-0.5"
            style={{ color: 'var(--text-muted)' }}
          >
            days
          </p>
        </div>
      </div>
    </div>
  );
});
```

## File: components/ui/PageTransition.tsx
```typescript
'use client';

import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  /** Override direction: 'up' (default) | 'fade' */
  mode?: 'up' | 'fade';
}

const variants = {
  up: {
    initial:  { opacity: 0, y: 14,  scale: 0.99 },
    animate:  { opacity: 1, y: 0,   scale: 1    },
    exit:     { opacity: 0, y: 6,   scale: 0.99 },
  },
  fade: {
    initial:  { opacity: 0 },
    animate:  { opacity: 1 },
    exit:     { opacity: 0 },
  },
};

export function PageTransition({
  children,
  mode = 'up',
}: PageTransitionProps) {
  const v = variants[mode];

  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      transition={{
        type:      'spring',
        stiffness: 340,
        damping:   28,
        mass:      0.9,
      }}
      style={{ willChange: 'transform, opacity', minHeight: '100%' }}
    >
      {children}
    </motion.div>
  );
}
```
