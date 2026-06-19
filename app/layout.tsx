import type { Metadata, Viewport } from 'next';
import './globals.css';
import { HydrationProvider } from '@/components/providers/HydrationProvider';
import { BottomNav } from '@/components/ui/BottomNav';

export const metadata: Metadata = {
  title: 'FitBro',
  description: 'Your premium workout companion.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FitBro',
  },
};

export const viewport: Viewport = {
  themeColor: '#0d0f14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <HydrationProvider>
          <main className="relative z-10 min-h-dvh pb-24">
            {children}
          </main>
          <BottomNav />
        </HydrationProvider>
      </body>
    </html>
  );
}