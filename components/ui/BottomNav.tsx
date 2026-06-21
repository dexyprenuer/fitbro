'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
    /* Floating container — sits above content with side margins */
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div
        className="mx-4 mb-4 pointer-events-auto nav-floating rounded-[var(--radius-2xl)]"
        style={{ maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}
      >
        <div
          className="flex items-center justify-around px-2 py-2"
          style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
        >
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active =
              pathname === href ||
              (href !== '/' && pathname.startsWith(href));

            return (
              <Link
                key={href}
                href={href}
                className="relative flex flex-col items-center gap-[3px] px-5 py-2 tap-target justify-center"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {/* Animated pill background */}
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-[var(--radius-md)]"
                    style={{ background: 'var(--accent-dim)' }}
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 34,
                    }}
                  />
                )}

                {/* Icon with scale spring on active */}
                <motion.div
                  animate={active ? { scale: 1.08 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                  className="relative z-10"
                >
                  <Icon
                    size={21}
                    strokeWidth={active ? 2.2 : 1.8}
                    style={{
                      color: active ? 'var(--accent)' : 'var(--text-muted)',
                      transition: 'color 0.18s ease',
                    }}
                  />
                </motion.div>

                {/* Label */}
                <motion.span
                  animate={active ? { opacity: 1 } : { opacity: 0.55 }}
                  transition={{ duration: 0.18 }}
                  className="relative z-10 text-[10px] font-semibold leading-none"
                  style={{
                    color: active ? 'var(--accent)' : 'var(--text-muted)',
                    letterSpacing: '0.02em',
                  }}
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