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
- Only files matching these patterns are included: app/settings/page.tsx, app/settings/misc/page.tsx, app/settings/contact/page.tsx, components/settings/WorkoutMiscEditor.tsx
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
app/
  settings/
    contact/
      page.tsx
    misc/
      page.tsx
    page.tsx
components/
  settings/
    WorkoutMiscEditor.tsx
```

# Files

## File: app/settings/misc/page.tsx
```typescript
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { WorkoutMiscEditor } from '@/components/settings/WorkoutMiscEditor';
import { useRoutineStore } from '@/store/useRoutineStore';

export default function MiscSettingsPage() {
  const router = useRouter();
  const activeRoutine = useRoutineStore((s) => s.activeRoutine);
  const routine = activeRoutine();

  return (
    <PageTransition>
      <div className="px-4 pt-10 max-w-lg mx-auto pb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[var(--text-secondary)] mb-6 active:text-[var(--text-primary)]"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-1">
          Workout Settings
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Customize sets and reps per exercise.
        </p>

        <div className="space-y-8">
          {routine.workoutDays.map((day) => (
            <WorkoutMiscEditor
              key={day.id}
              exercises={day.exercises}
              workoutTitle={day.title}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
```

## File: app/settings/page.tsx
```typescript
'use client';

import Link from 'next/link';
import { ChevronRight, Dumbbell, User, Mail } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { GlassCard } from '@/components/ui/GlassCard';
import { ThemeToggle } from '@/components/settings/ThemeToggle';

const LINKS = [
  { href: '/settings/misc', icon: Dumbbell, label: 'Workout Settings', sub: 'Customize sets & reps' },
  { href: '/settings/contact', icon: Mail, label: 'Contact Us', sub: 'Links & info' },
];

export default function SettingsPage() {
  return (
    <PageTransition>
      <div className="px-4 pt-12 max-w-lg mx-auto space-y-6 pb-4">
        <h1 className="font-display text-3xl font-bold text-[var(--text-primary)]">
          Settings
        </h1>

        <ThemeToggle />

        <div className="space-y-2">
          {LINKS.map(({ href, icon: Icon, label, sub }) => (
            <Link key={href} href={href}>
              <GlassCard className="p-4 flex items-center gap-3 active:bg-[var(--surface-hover)]">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--accent-dim)' }}
                >
                  <Icon size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[var(--text-primary)]">{label}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{sub}</p>
                </div>
                <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
              </GlassCard>
            </Link>
          ))}

          {/* Account placeholder */}
          <GlassCard className="p-4 flex items-center gap-3 opacity-50">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--surface)' }}
            >
              <User size={18} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-[var(--text-primary)]">Account</p>
              <p className="text-xs text-[var(--text-secondary)]">Coming in v1.1</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
}
```

## File: components/settings/WorkoutMiscEditor.tsx
```typescript
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { Exercise } from '@/types';

interface WorkoutMiscEditorProps {
  exercises: Exercise[];
  workoutTitle: string;
}

export function WorkoutMiscEditor({ exercises, workoutTitle }: WorkoutMiscEditorProps) {
  const { getEffective, setOverride, removeOverride, overrides } = useSettingsStore();

  function change(ex: Exercise, field: 'sets' | 'reps', delta: number) {
    const current = getEffective(ex.id, ex.sets, ex.reps);
    const next = Math.max(1, Math.min(99, current[field] + delta));
    setOverride({
      exerciseId: ex.id,
      customSets: field === 'sets' ? next : current.sets,
      customReps: field === 'reps' ? next : current.reps,
    });
  }

  function reset(ex: Exercise) {
    removeOverride(ex.id);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider px-1">
        {workoutTitle}
      </p>
      {exercises.map((ex) => {
        const { sets, reps } = getEffective(ex.id, ex.sets, ex.reps);
        const isOverridden = !!overrides[ex.id];

        return (
          <GlassCard key={ex.id} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-[var(--text-primary)] text-sm">{ex.name}</p>
              {isOverridden && (
                <button
                  onClick={() => reset(ex)}
                  className="flex items-center gap-1 text-xs text-[var(--text-muted)] active:text-[var(--warning)]"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              )}
            </div>

            <div className="flex items-center gap-6">
              {[
                { label: 'Sets', value: sets, field: 'sets' as const },
                { label: 'Reps', value: reps, field: 'reps' as const },
              ].map(({ label, value, field }) => (
                <div key={field} className="flex items-center gap-3">
                  <span className="text-xs text-[var(--text-secondary)] w-8">{label}</span>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => change(ex, field, -1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--surface)' }}
                    >
                      <Minus size={14} style={{ color: 'var(--text-secondary)' }} />
                    </motion.button>
                    <span className="font-display font-bold text-[var(--text-primary)] w-6 text-center tabular-nums">
                      {value}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => change(ex, field, 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--accent-dim)' }}
                    >
                      <Plus size={14} style={{ color: 'var(--accent)' }} />
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
```

## File: app/settings/contact/page.tsx
```typescript
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { GlassCard } from '@/components/ui/GlassCard';

const LINKS = [
  { 
    label: 'GitHub', 
    href: 'https://github.com/dexyprenuer', 
    color: '#6e7681',
    svg: (color: string) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
    )
  },
  { 
    label: 'Facebook', 
    href: 'https://www.facebook.com/share/1JTogAaoYu/', 
    color: '#1877f2',
    svg: (color: string) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
    )
  },
  { 
    label: 'Instagram', 
    href: 'https://www.instagram.com/nogoistic?igsh=MTNydTVkN3dhM3FiMA==', 
    color: '#e1306c',
    svg: (color: string) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="24" y="2" rx="5" ry="5" transform="rotate(90 24 2)"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
    )
  },
];

export default function ContactPage() {
  const router = useRouter();

  return (
    <PageTransition>
      <div className="px-4 pt-10 max-w-lg mx-auto pb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[var(--text-secondary)] mb-6"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-1">
          Contact Us
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Built with 💪 for lifters everywhere.
        </p>

        <div className="space-y-2">
          {LINKS.map(({ label, href, color, svg }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="block">
              <GlassCard className="p-4 flex items-center gap-4 active:bg-[var(--surface-hover)]">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}22` }}
                >
                  {svg(color)}
                </div>
                <span className="font-medium text-[var(--text-primary)]">{label}</span>
              </GlassCard>
            </a>
          ))}
        </div>

        <p className="text-xs text-center text-[var(--text-muted)] mt-10">
          FitBro v1.0 · Made for daily lifters
        </p>
      </div>
    </PageTransition>
  );
}
```
