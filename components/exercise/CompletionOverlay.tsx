'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Trophy, Home } from 'lucide-react';

interface CompletionOverlayProps {
  duration: number; // seconds
  exerciseCount: number;
}

export function CompletionOverlay({ duration, exerciseCount }: CompletionOverlayProps) {
  const router = useRouter();
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  useEffect(() => {
    const t = setTimeout(() => router.push('/'), 3500);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-6"
      style={{ background: 'rgba(13,15,20,0.92)', backdropFilter: 'blur(24px)' }}
    >
      {/* Confetti rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2"
          style={{ borderColor: 'var(--accent)', opacity: 0 }}
          animate={{
            width: [60, 300 + i * 80],
            height: [60, 300 + i * 80],
            opacity: [0.6, 0],
          }}
          transition={{ duration: 1.4, delay: i * 0.2, ease: 'easeOut' }}
        />
      ))}

      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
        className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
        style={{ background: 'var(--accent)', boxShadow: `0 0 40px var(--accent-glow)` }}
      >
        <Trophy size={44} className="text-white" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-display text-4xl font-bold text-[var(--text-primary)] mb-2"
      >
        Workout Done!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="text-[var(--text-secondary)] text-lg mb-8"
      >
        {exerciseCount} exercises · {minutes}m {seconds}s
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => router.push('/')}
        className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white"
        style={{ background: 'var(--accent)' }}
      >
        <Home size={18} />
        Back to Home
      </motion.button>
    </motion.div>
  );
}