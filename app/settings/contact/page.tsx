'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';

const LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/dexyprenuer',
    color: '#6e7681',
    svg: (color: string) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1JTogAaoYu/',
    color: '#1877f2',
    svg: (color: string) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/nogoistic?igsh=MTNydTVkN3dhM3FiMA==',
    color: '#e1306c',
    svg: (color: string) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="24" y="2" rx="5" ry="5" transform="rotate(90 24 2)"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
    ),
  },
];

export default function ContactPage() {
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
          Contact Us
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Built with 💪 for lifters everywhere.
        </p>

        <div className="space-y-3">
          {LINKS.map(({ label, href, color, svg }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="block">
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
                  style={{ background: `${color}1a` }}
                >
                  {svg(color)}
                </div>
                <span className="font-display font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {label}
                </span>
              </motion.div>
            </a>
          ))}
        </div>

        <p className="text-xs text-center mt-10" style={{ color: 'var(--text-muted)' }}>
          FitBro v1.0 · Made for daily lifters
        </p>
      </div>
    </PageTransition>
  );
}