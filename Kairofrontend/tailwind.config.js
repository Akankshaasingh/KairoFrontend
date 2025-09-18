
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        violet: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        obsidian: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(139, 92, 246, 0.4)',
      },
      typography: (theme) => ({
        purple: {
          css: {
            '--tw-prose-body': theme('colors.obsidian[700]'),
            '--tw-prose-headings': theme('colors.purple[800]'),
            '--tw-prose-lead': theme('colors.purple[600]'),
            '--tw-prose-links': theme('colors.purple[600]'),
            '--tw-prose-bold': theme('colors.purple[800]'),
            '--tw-prose-counters': theme('colors.purple[600]'),
            '--tw-prose-bullets': theme('colors.purple[400]'),
            '--tw-prose-hr': theme('colors.purple[200]'),
            '--tw-prose-quotes': theme('colors.purple[800]'),
            '--tw-prose-quote-borders': theme('colors.purple[200]'),
            '--tw-prose-captions': theme('colors.purple[600]'),
            '--tw-prose-code': theme('colors.purple[800]'),
            '--tw-prose-pre-code': theme('colors.purple[200]'),
            '--tw-prose-pre-bg': theme('colors.purple[50]'),
            '--tw-prose-th-borders': theme('colors.purple[200]'),
            '--tw-prose-td-borders': theme('colors.purple[100]'),
            '--tw-prose-invert-body': theme('colors.obsidian[200]'),
            '--tw-prose-invert-headings': theme('colors.purple[200]'),
            '--tw-prose-invert-lead': theme('colors.purple[300]'),
            '--tw-prose-invert-links': theme('colors.purple[400]'),
            '--tw-prose-invert-bold': theme('colors.purple[200]'),
            '--tw-prose-invert-counters': theme('colors.purple[400]'),
            '--tw-prose-invert-bullets': theme('colors.purple[500]'),
            '--tw-prose-invert-hr': theme('colors.purple[700]'),
            '--tw-prose-invert-quotes': theme('colors.purple[200]'),
            '--tw-prose-invert-quote-borders': theme('colors.purple[700]'),
            '--tw-prose-invert-captions': theme('colors.purple[400]'),
            '--tw-prose-invert-code': theme('colors.purple[200]'),
            '--tw-prose-invert-pre-code': theme('colors.purple[200]'),
            '--tw-prose-invert-pre-bg': theme('colors.purple[900]'),
            '--tw-prose-invert-th-borders': theme('colors.purple[600]'),
            '--tw-prose-invert-td-borders': theme('colors.purple[700]'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    // Add custom utilities
    function ({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          'backdrop-filter': 'blur(16px)',
          'background': 'rgba(255, 255, 255, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          'backdrop-filter': 'blur(16px)',
          'background': 'rgba(0, 0, 0, 0.3)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.text-gradient-purple': {
          'background': 'linear-gradient(135deg, #8b5cf6, #a855f7)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.bg-gradient-purple': {
          'background': 'linear-gradient(135deg, #8b5cf6, #a855f7)',
        },
        '.shadow-glow-purple': {
          'box-shadow': '0 0 20px rgba(139, 92, 246, 0.3)',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}