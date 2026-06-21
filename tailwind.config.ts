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