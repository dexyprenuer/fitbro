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