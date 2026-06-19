'use client';

import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { GlassCard } from '@/components/ui/GlassCard';

export function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore();
  const isDark = theme === 'dark';

  return (
    <GlassCard className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--accent-dim)' }}
        >
          {isDark ? (
            <Moon size={18} style={{ color: 'var(--accent)' }} />
          ) : (
            <Sun size={18} style={{ color: 'var(--accent)' }} />
          )}
        </div>
        <div>
          <p className="font-medium text-[var(--text-primary)]">Appearance</p>
          <p className="text-xs text-[var(--text-secondary)]">{isDark ? 'Dark mode' : 'Light mode'}</p>
        </div>
      </div>

      {/* Toggle switch */}
      <button
        onClick={toggleTheme}
        className="relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0"
        style={{ background: isDark ? 'var(--accent)' : 'var(--border)' }}
        aria-label="Toggle theme"
      >
        <motion.div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
          animate={{ x: isDark ? 26 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </GlassCard>
  );
}