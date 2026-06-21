'use client';

import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  /** Override direction: 'up' (default) | 'fade' */
  mode?: 'up' | 'fade';
}

const variants = {
  up: {
    initial:  { opacity: 0, y: 14,  scale: 0.99 },
    animate:  { opacity: 1, y: 0,   scale: 1    },
    exit:     { opacity: 0, y: 6,   scale: 0.99 },
  },
  fade: {
    initial:  { opacity: 0 },
    animate:  { opacity: 1 },
    exit:     { opacity: 0 },
  },
};

export function PageTransition({
  children,
  mode = 'up',
}: PageTransitionProps) {
  const v = variants[mode];

  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      transition={{
        type:      'spring',
        stiffness: 340,
        damping:   28,
        mass:      0.9,
      }}
      style={{ willChange: 'transform, opacity', minHeight: '100%' }}
    >
      {children}
    </motion.div>
  );
}