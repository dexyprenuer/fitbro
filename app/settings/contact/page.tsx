'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Github, Facebook, Instagram } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { GlassCard } from '@/components/ui/GlassCard';

const LINKS = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/', color: '#6e7681' },
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/', color: '#1877f2' },
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/', color: '#e1306c' },
];

export default function ContactPage() {
  const router = useRouter();

  return (
    <PageTransition>
      <div className="px-4 pt-10 max-w-lg mx-auto pb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[var(--text-secondary)] mb-6"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-1">
          Contact Us
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Built with 💪 for lifters everywhere.
        </p>

        <div className="space-y-2">
          {LINKS.map(({ icon: Icon, label, href, color }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer">
              <GlassCard className="p-4 flex items-center gap-4 active:bg-[var(--surface-hover)]">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}22` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <span className="font-medium text-[var(--text-primary)]">{label}</span>
              </GlassCard>
            </a>
          ))}
        </div>

        <p className="text-xs text-center text-[var(--text-muted)] mt-10">
          FitBro v1.0 · Made for daily lifters
        </p>
      </div>
    </PageTransition>
  );
}