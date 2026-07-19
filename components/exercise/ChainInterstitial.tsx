'use client';

import { motion } from 'framer-motion';
import { ArrowRight, PartyPopper } from 'lucide-react';

interface ChainInterstitialProps {
  completedTitle: string;
  nextTitle: string;
  onContinue: () => void;
  onStopHere: () => void;
}

export function ChainInterstitial({ completedTitle, nextTitle, onContinue, onStopHere }: ChainInterstitialProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-6"
      style={{
        background: 'color-mix(in srgb, var(--bg) 92%, transparent)',
        backdropFilter: 'blur(28px) saturate(160%)',
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="flex items-center justify-center mb-6"
        style={{
          width: 72,
          height: 72,
          background: 'var(--success-dim)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <PartyPopper size={32} style={{ color: 'var(--success)' }} />
      </motion.div>

      <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
        {completedTitle} complete
      </p>
      <h1
        className="font-display font-bold mb-8"
        style={{ fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', color: 'var(--text-primary)' }}
      >
        Up next: {nextTitle}
      </h1>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
        className="flex items-center gap-2.5 font-semibold font-display text-white mb-4"
        style={{
          background: 'linear-gradient(135deg, var(--accent), var(--secondary-accent))',
          borderRadius: 'var(--radius-xl)',
          padding: '1rem 2.5rem',
          boxShadow: '0 4px 24px var(--accent-glow)',
          minHeight: '56px',
        }}
      >
        Continue to {nextTitle}
        <ArrowRight size={18} strokeWidth={2.2} />
      </motion.button>

      <button
        onClick={onStopHere}
        className="text-sm font-medium"
        style={{ color: 'var(--text-muted)' }}
      >
        Stop here for today
      </button>
    </motion.div>
  );
}