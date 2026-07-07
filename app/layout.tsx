import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { HydrationProvider } from '@/components/providers/HydrationProvider';
import { BottomNavWrapper } from '@/components/ui/BottomNavWrapper';

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
  themeColor: '#F5F2EA',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <HydrationProvider>
            <main className="relative z-10 min-h-dvh pb-24 gpu">
              {children}
            </main>
            <BottomNavWrapper />
          </HydrationProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}