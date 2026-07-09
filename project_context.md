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
- Only files matching these patterns are included: middleware.ts, app/page.tsx, app/account/page.tsx, components/ui/BottomNav.tsx, app/layout.tsx, lib/prisma.ts
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
app/
  account/
    page.tsx
  layout.tsx
  page.tsx
components/
  ui/
    BottomNav.tsx
lib/
  prisma.ts
middleware.ts
```

# Files

## File: app/account/page.tsx
```typescript
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, Copy } from 'lucide-react';
import Link from 'next/link';
import { useClerk } from '@clerk/nextjs';
import { PageTransition } from '@/components/ui/PageTransition';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import type { HeightUnit, WeightUnit, WorkoutLevel, FitnessGoal } from '@prisma/client';

interface ProfileData {
  username: string;
  email: string | null;
  avatarUrl: string | null;
  heightCm: number | null;
  weightKg: number | null;
  heightUnit: HeightUnit;
  weightUnit: WeightUnit;
  workoutLevel: WorkoutLevel | null;
  fitnessGoal: FitnessGoal | null;
  createdAt: string;
}

const LEVEL_LABELS: Record<WorkoutLevel, string> = {
  NEWBIE: 'Newbie',
  BEGINNER: 'Beginner',
  ELITE: 'Elite',
};

const GOAL_LABELS: Record<FitnessGoal, string> = {
  GAIN_MUSCLE: 'Gain Muscle',
  LOSE_FAT: 'Lose Fat',
  MAINTAIN: 'Maintain',
  STRENGTH: 'Strength',
};

export default function AccountPage() {
  const { signOut } = useClerk();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => setProfile(data.profile))
      .finally(() => setLoading(false));
  }, []);

  function handleCopyUsername() {
    if (!profile) return;
    navigator.clipboard.writeText(profile.username);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const memberSince = profile
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <PageTransition>
      <div
        className="px-4 pt-8 max-w-lg mx-auto"
        style={{ paddingBottom: 'max(8rem, calc(env(safe-area-inset-bottom) + 7rem))' }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/settings"
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
          >
            <ChevronLeft size={18} style={{ color: 'var(--text-primary)' }} />
          </Link>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Account
          </h1>
        </div>

        {loading || !profile ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-[var(--radius-lg)] animate-pulse"
                style={{ background: 'var(--border)' }}
              />
            ))}
          </div>
        ) : (
          <>
            {/* Avatar + username */}
            <div className="flex flex-col items-center mb-6">
              <div
                className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center mb-3"
                style={{ background: 'var(--accent-dim)', boxShadow: 'var(--shadow-sm)' }}
              >
                {profile.avatarUrl ? (
                  <Image src={profile.avatarUrl} alt={profile.username} width={80} height={80} />
                ) : (
                  <span className="font-display text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                    {profile.username.slice(5, 6)}
                  </span>
                )}
              </div>
              <button
                onClick={handleCopyUsername}
                className="flex items-center gap-1.5 text-sm font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                {profile.username}
                <Copy size={13} />
                {copied && <span style={{ color: 'var(--success)' }}>Copied</span>}
              </button>
              {profile.email && (
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {profile.email}
                </p>
              )}
            </div>

            {/* Profile stats */}
            <GlassCard variant="interactive" className="mb-4" style={{ cursor: 'default' }}>
              <p className="section-label mb-3">Profile</p>
              <div className="space-y-0.5">
                <StatRow label="Height" value={`${profile.heightCm ?? '—'} cm`} />
                <StatRow label="Weight" value={`${profile.weightKg ?? '—'} kg`} />
                <StatRow
                  label="Units"
                  value={`${profile.weightUnit.toLowerCase()}, ${profile.heightUnit === 'CM' ? 'cm' : 'ft'}`}
                />
                <StatRow
                  label="Fitness Level"
                  value={profile.workoutLevel ? LEVEL_LABELS[profile.workoutLevel] : '—'}
                />
                <StatRow
                  label="Fitness Goal"
                  value={profile.fitnessGoal ? GOAL_LABELS[profile.fitnessGoal] : '—'}
                />
              </div>
            </GlassCard>

            <GlassCard className="mb-6">
              <StatRow label="Member Since" value={memberSince} last />
            </GlassCard>

            <Button variant="destructive" fullWidth onClick={() => signOut()}>
              Sign Out
            </Button>
          </>
        )}
      </div>
    </PageTransition>
  );
}

function StatRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className="flex items-center justify-between py-2.5"
      style={{ borderBottom: last ? 'none' : '1px solid var(--border)' }}
    >
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
    </div>
  );
}
```

## File: lib/prisma.ts
```typescript
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7 client instantiation requires an explicit driver adapter.
// This uses DATABASE_URL (the pgbouncer pooling connection) since this
// is the runtime app connection, not the CLI/migration connection.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

## File: middleware.ts
```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

const isOnboardingRoute = createRouteMatcher(['/onboarding']);
const isApiRoute = createRouteMatcher(['/api(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return;
  }

  const { userId } = auth();
  auth().protect();

  // Onboarding gate: authenticated users who haven't finished onboarding get
  // redirected there for every route except the onboarding page itself and API routes
  // (API routes handle their own onboarded checks server-side, e.g. the onboard route itself).
  if (userId && !isOnboardingRoute(req) && !isApiRoute(req)) {
    const profileCheckUrl = new URL('/api/profile', req.url);
    const res = await fetch(profileCheckUrl, {
      headers: { cookie: req.headers.get('cookie') ?? '' },
    });

    if (res.ok) {
      const data = await res.json();
      if (!data.onboarded) {
        return NextResponse.redirect(new URL('/onboarding', req.url));
      }
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

## File: app/layout.tsx
```typescript
import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { HydrationProvider } from '@/components/providers/HydrationProvider';
import { BottomNavWrapper } from '@/components/ui/BottomNavWrapper';

export const metadata: Metadata = {
  title: 'FitBro',
  description: 'Your premium workout companion.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FitBro',
  },
};

export const viewport: Viewport = {
  themeColor: '#F5F2EA',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <HydrationProvider>
            <main className="relative z-10 min-h-dvh pb-24 gpu">
              {children}
            </main>
            <BottomNavWrapper />
          </HydrationProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

## File: app/page.tsx
```typescript
'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { PageTransition } from '@/components/ui/PageTransition';
import { TodayCard } from '@/components/home/TodayCard';
import { WorkoutCard } from '@/components/home/WorkoutCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useRoutineStore } from '@/store/useRoutineStore';
import { useAppStore } from '@/store/useAppStore';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning,';
  if (h < 17) return 'Good afternoon,';
  return 'Good evening,';
}

function getProgressMessage(pct: number) {
  if (pct >= 100) return "Amazing! You've hit your weekly goal.";
  if (pct >= 50) return "Keep going! You're building consistency.";
  if (pct > 0) return 'Nice start — keep the momentum going.';
  return "Let's get your first workout in today.";
}

export default function HomePage() {
  const activeRoutine = useRoutineStore((s) => s.activeRoutine);
  const completedDates = useAppStore((s) => s.completedDates);
  const displayName = useAppStore((s) => s.displayName);
  const routine = activeRoutine();

  const { scheduledThisWeek, completedThisWeek, weeklyProgress } = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const scheduled = routine.schedule.slice(0, dayOfWeek + 1).filter(Boolean).length;
    const completed = completedDates.filter((d) => {
      const date = new Date(d);
      const diff = (today.getTime() - date.getTime()) / 86400000;
      return diff >= 0 && diff < 7;
    }).length;
    return {
      scheduledThisWeek: scheduled,
      completedThisWeek: completed,
      weeklyProgress: scheduled > 0 ? Math.min(100, (completed / scheduled) * 100) : 0,
    };
  }, [completedDates, routine.schedule]);

  return (
    <PageTransition>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-4 pt-12 pb-32 max-w-lg mx-auto"
        style={{ paddingBottom: 'max(8rem, calc(env(safe-area-inset-bottom) + 7rem))' }}
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
              {getGreeting()}
            </p>
            <h1
              className="font-display text-3xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {displayName}
            </h1>
          </div>
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center relative flex-shrink-0"
            style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
          >
            <Bell size={19} style={{ color: 'var(--text-primary)' }} />
            <span
              className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--accent)' }}
            />
          </div>
        </motion.div>

        {/* Today */}
        <motion.div variants={fadeUp} className="mb-5">
          <TodayCard />
        </motion.div>

        {/* Weekly Progress */}
        <motion.div
          variants={fadeUp}
          className="mb-6 p-5"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-display font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
                Weekly Progress
              </p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {completedThisWeek} / {scheduledThisWeek} workouts
              </p>
            </div>
            <span
              className="font-display font-bold tabular-nums"
              style={{ fontSize: '1.7rem', color: 'var(--text-primary)' }}
            >
              {Math.round(weeklyProgress)}%
            </span>
          </div>

          <ProgressBar value={weeklyProgress} segments={Math.max(scheduledThisWeek, 1)} />

          <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
            {getProgressMessage(weeklyProgress)}
          </p>
        </motion.div>

        {/* Your Workouts */}
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="section-label">Your Workouts</p>
            <Link href="/exercise" className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {routine.workoutDays.slice(0, 2).map((day, i) => (
              <WorkoutCard key={day.id} workoutDay={day} index={i} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </PageTransition>
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
