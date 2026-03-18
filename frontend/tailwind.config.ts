import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#080b0f',
        surface: '#0f1318',
        surface2: '#161c24',
        border: '#1e2730',
        accent: '#00e5a0',
        'accent-dim': '#00b37d',
        accent2: '#ff6b35',
        accent3: '#4d9fff',
        gold: '#f5c842',
        danger: '#ff4757',
        text: '#e8edf2',
        snow: '#9ba8b5',
        muted: '#5a6472'
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['DM Mono', 'monospace']
      },
      boxShadow: {
        accent: '0 0 24px rgba(0, 229, 160, 0.18)',
        'accent-strong': '0 0 32px rgba(0, 229, 160, 0.32)',
        info: '0 0 24px rgba(77, 159, 255, 0.16)'
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at 1px 1px, rgba(155,168,181,0.11) 1px, transparent 0)'
      }
    }
  },
  plugins: []
} satisfies Config
