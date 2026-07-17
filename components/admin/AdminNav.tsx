'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, BarChart3, Users, Dumbbell, ArrowLeft } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/presets', label: 'Presets', icon: Dumbbell },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-40 px-4 py-3 sm:px-6"
      style={{
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/admin" className="shrink-0">
          <p className="font-display text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            FitBro <span style={{ color: 'var(--accent)' }}>Admin</span>
          </p>
        </Link>

        <nav className="flex items-center gap-0.5 overflow-x-auto rounded-full p-1" style={{ background: 'var(--bg-secondary)' }}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="relative shrink-0">
                {isActive && (
                  <motion.div
                    layoutId="admin-nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span
                  className="relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors"
                  style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        <Link
          href="/"
          className="flex shrink-0 items-center gap-1.5 text-sm font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Back to App</span>
        </Link>
      </div>
    </header>
  );
}