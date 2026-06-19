'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Dumbbell, CalendarDays, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/exercise', icon: Dumbbell, label: 'Exercise' },
  { href: '/routine', icon: CalendarDays, label: 'Routine' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-[var(--glass-border)] pb-safe"
      style={{ boxShadow: '0 -8px 32px rgba(0,0,0,0.20)' }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors relative"
            >
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl bg-[var(--accent-dim)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon
                size={22}
                className={cn(
                  'relative z-10 transition-colors duration-200',
                  active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                )}
              />
              <span
                className={cn(
                  'relative z-10 text-[10px] font-medium transition-colors duration-200',
                  active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}