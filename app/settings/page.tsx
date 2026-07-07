'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Dumbbell, User, Mail } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';

const LINKS = [
  { href: '/account', icon: User, label: 'Account', sub: 'Manage your profile & preferences' },
  { href: '/settings/misc', icon: Dumbbell, label: 'Workout Settings', sub: 'Customize sets & reps' },
  { href: '/settings/contact', icon: Mail, label: 'Contact Us', sub: 'Links & info' },
];

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
};

export default function SettingsPage() {
  return (
    <PageTransition>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="px-4 pt-12 max-w-lg mx-auto"
        style={{ paddingBottom: 'max(8rem, calc(env(safe-area-inset-bottom) + 7rem))' }}
      >
        <motion.h1
          variants={fadeUp}
          className="font-display text-3xl font-bold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Settings
        </motion.h1>

        <motion.div variants={fadeUp} className="space-y-3">
          {LINKS.map(({ href, icon: Icon, label, sub }) => (
            <Link key={href} href={href} className="block">
              <motion.div
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                className="p-4 flex items-center gap-4"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--accent-dim)' }}
                >
                  <Icon size={19} style={{ color: 'var(--accent)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {label}
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {sub}
                  </p>
                </div>
                <ChevronRight size={18} strokeWidth={1.8} style={{ color: 'var(--text-muted)' }} />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}