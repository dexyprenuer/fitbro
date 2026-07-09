'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, BellOff } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';

export default function NotificationsSettingsPage() {
  const router = useRouter();

  return (
    <PageTransition>
      <div
        className="px-4 pt-10 max-w-lg mx-auto"
        style={{ paddingBottom: 'max(4rem, calc(env(safe-area-inset-bottom) + 3rem))' }}
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 tap-target"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </motion.button>

        <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Notifications
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Updates from the FitBro team will show up here.
        </p>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'var(--surface)' }}
          >
            <BellOff size={24} style={{ color: 'var(--text-muted)' }} />
          </div>
          <p className="font-display font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            No notifications yet
          </p>
          <p className="text-sm max-w-[240px]" style={{ color: 'var(--text-secondary)' }}>
            You'll see routine updates, new presets, and announcements here.
          </p>
        </div>
      </div>
    </PageTransition>
  );
}