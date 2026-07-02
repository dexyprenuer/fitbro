This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: app/layout.tsx, tailwind.config.ts
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
app/
  layout.tsx
tailwind.config.ts
```

# Files

## File: app/layout.tsx
```typescript
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
```

## File: tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        /* Mirror the CSS --radius-* token scale so Tailwind classes also work */
        'xs':   '10px',
        'sm':   '14px',  // overrides Tailwind default sm (4px) intentionally
        'md':   '18px',
        'lg':   '24px',
        'xl':   '30px',
        '2xl':  '36px',
        '3xl':  '44px',
        'full': '9999px',
      },
      spacing: {
        'safe-bottom': 'max(1.5rem, env(safe-area-inset-bottom))',
        'safe-top':    'max(0.5rem,  env(safe-area-inset-top))',
      },
      screens: {
        'xs': '360px',
      },
    },
  },
  plugins: [],
};

export default config;
```
