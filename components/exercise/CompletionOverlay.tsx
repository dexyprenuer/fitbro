'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Trophy, Home, Zap, Clock } from 'lucide-react';

interface CompletionOverlayProps {
  duration:      number; // seconds
  exerciseCount: number;
}

export function CompletionOverlay({ duration, exerciseCount }: CompletionOverlayProps) {
  const router  = useRouter();
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  /* Auto-redirect after 5s — enough time to feel rewarding */
  useEffect(() => {
    const t = setTimeout(() => router.push('/'), 5000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-6"
      style={{
        /* Theme-aware overlay — works in both dark and light */
        background: 'color-mix(in srgb, var(--bg) 88%, transparent)',
        backdropFilter: 'blur(32px) saturate(160%)',
        WebkitBackdropFilter: 'blur(32px) saturate(160%)',
      }}
    >
      {/* ── Expanding ring burst — transform only, no layout reflow ── */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width:       80,
            height:      80,
            border:      '2px solid var(--accent)',
            pointerEvents: 'none',
          }}
          animate={{
            scale:   [1, 5 + i * 1.6],
            opacity: [0.55, 0],
          }}
          transition={{
            duration: 1.6,
            delay:    i * 0.18,
            ease:     'easeOut',
          }}
        />
      ))}

      {/* ── Trophy icon ──────────────────────────────────────────── */}
      <motion.div
        initial={{ scale: 0, rotate: -24 }}
        animate={{ scale: 1, rotate: 0   }}
        transition={{
          type:      'spring',
          stiffness: 280,
          damping:   18,
          delay:     0.12,
        }}
        className="relative flex items-center justify-center mb-7"
        style={{
          width:        96,
          height:       96,
          background:   'linear-gradient(135deg, var(--accent), var(--secondary-accent))',
          borderRadius: 'var(--radius-xl)',
          boxShadow:    '0 0 48px var(--accent-glow), 0 8px 32px rgba(108,99,255,0.30)',
        }}
      >
        <Trophy size={46} color="#fff" strokeWidth={1.8} />
      </motion.div>

      {/* ── Headline ─────────────────────────────────────────────── */}
      <motion.h1
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ type: 'spring', stiffness: 320, damping: 24, delay: 0.28 }}
        className="font-display font-bold mb-2"
        style={{ fontSize: 'clamp(2rem, 8vw, 2.8rem)', color: 'var(--text-primary)' }}
      >
        Workout Done! 🎉
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.40 }}
        className="text-base mb-8"
        style={{ color: 'var(--text-secondary)' }}
      >
        You crushed it. Keep the streak alive!
      </motion.p>

      {/* ── Stat cards ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.50 }}
        className="flex gap-3 mb-10 w-full max-w-xs"
      >
        {[
          {
            icon:  <Zap  size={18} style={{ color: 'var(--accent)' }} />,
            value: `${exerciseCount}`,
            label: 'Exercises',
            bg:    'var(--accent-dim)',
            border:'rgba(108,99,255,0.20)',
          },
          {
            icon:  <Clock size={18} style={{ color: 'var(--success)' }} />,
            value: `${minutes}m ${String(seconds).padStart(2,'0')}s`,
            label: 'Duration',
            bg:    'var(--success-dim)',
            border:'rgba(52,211,153,0.20)',
          },
        ].map(({ icon, value, label, bg, border }) => (
          <div
            key={label}
            className="flex-1 flex flex-col items-center gap-1.5 py-4 px-3"
            style={{
              background:   bg,
              border:       `1px solid ${border}`,
              borderRadius: 'var(--radius-lg)',
            }}
          >
            {icon}
            <span
              className="font-display font-bold tabular-nums"
              style={{ fontSize: '1.35rem', color: 'var(--text-primary)' }}
            >
              {value}
            </span>
            <span
              className="section-label"
              style={{ color: 'var(--text-muted)' }}
            >
              {label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* ── Home CTA ─────────────────────────────────────────────── */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.62 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/')}
        className="flex items-center gap-2.5 font-semibold font-display text-white"
        style={{
          background:   'linear-gradient(135deg, var(--accent), var(--secondary-accent))',
          borderRadius: 'var(--radius-xl)',
          padding:      '1rem 2.5rem',
          boxShadow:    '0 4px 24px var(--accent-glow)',
          minHeight:    '56px',
        }}
      >
        <Home size={18} strokeWidth={2.2} />
        Back to Home
      </motion.button>

      {/* Auto-dismiss hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-12 text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        Redirecting in 5s…
      </motion.p>
    </motion.div>
  );
}