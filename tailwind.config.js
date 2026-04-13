/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./*.html"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        brand: {
          DEFAULT: '#3b82f6',
          dark: '#1d4ed8',
          light: '#60a5fa',
          glow: 'rgba(59, 130, 246, 0.15)',
        },
        dark: {
          900: '#0a0a0a',
          800: '#171717',
          700: '#262626',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#1da851',
        }
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid': '4rem 4rem',
      }
    }
  },
  plugins: [],
}
