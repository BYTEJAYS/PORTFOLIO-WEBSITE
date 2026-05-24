/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        border: 'hsl(var(--border))',
        gold: {
          300: '#F0C060',
          400: '#D4A853',
          500: '#B8903A',
        },
        cosmic: {
          950: '#010810',
          900: '#020B18',
          800: '#030D1F',
          700: '#0A1628',
          600: '#0D1F3C',
        },
      },
      fontFamily: {
        display: ['Instrument Serif', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'orb-spin': 'orb-spin 25s linear infinite',
      },
    },
  },
  plugins: [],
}
