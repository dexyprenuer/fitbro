'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Dumbbell } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';

export default function AboutPage() {
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

        <div className="flex flex-col items-center text-center py-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'var(--accent-dim)', boxShadow: '0 4px 20px var(--accent-glow)' }}
          >
            <Dumbbell size={28} style={{ color: 'var(--accent)' }} />
          </div>
          <h1 className="font-display text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            FitBro
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Version 1.1
          </p>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-secondary)' }}>
            Built for daily lifters. Cloud-synced routines, streaks, and progress tracking — made simple.
          </p>
        </div>
      </div>
    </PageTransition>
  );
}