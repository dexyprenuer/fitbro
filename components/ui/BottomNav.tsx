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
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div
        className="mx-4 mb-4 pointer-events-auto nav-floating rounded-[var(--radius-2xl)]"
        style={{ maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}
      >
        <div
          className="flex items-center justify-around px-2 py-3"
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
                <motion.div
                  animate={{ scale: active ? 1.04 : 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: active ? 'var(--card)' : 'transparent',
                    boxShadow: active ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.2 : 1.8}
                    style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}
                  />
                </motion.div>

                <span
                  className="text-[10px] font-semibold leading-none"
                  style={{ color: active ? 'var(--accent)' : 'var(--text-muted)' }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}