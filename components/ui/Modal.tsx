'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  /** Prevent closing by tapping backdrop */
  persistent?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  persistent = false,
}: ModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !persistent) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose, persistent]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(8px)' }}
            onClick={persistent ? undefined : onClose}
          />

          {/* Sheet — slides up from bottom on mobile */}
          <motion.div
            key="sheet"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto',
              'glass-heavy rounded-t-3xl px-4 pt-4 pb-safe',
              'max-h-[90dvh] overflow-y-auto',
              className
            )}
          >
            {/* Drag handle */}
            <div className="w-10 h-1 rounded-full bg-[var(--border-strong)] mx-auto mb-4" />

            {/* Header */}
            {(title || !persistent) && (
              <div className="flex items-center justify-between mb-5">
                {title && (
                  <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                    {title}
                  </h2>
                )}
                {!persistent && (
                  <button
                    onClick={onClose}
                    className="ml-auto w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--surface)' }}
                    aria-label="Close"
                  >
                    <X size={16} style={{ color: 'var(--text-secondary)' }} />
                  </button>
                )}
              </div>
            )}

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}