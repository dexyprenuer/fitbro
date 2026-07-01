'use client';

import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  mode?: 'up' | 'fade';
}

const variants = {
  up: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: -6 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit:    { opacity: 0 },
  },
};

export function PageTransition({ children, mode = 'up' }: PageTransitionProps) {
  const v = variants[mode];

  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: 'transform, opacity', minHeight: '100%' }}
    >
      {children}
    </motion.div>
  );
}