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