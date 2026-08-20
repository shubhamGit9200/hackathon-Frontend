/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/design-system/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc2fb',
          400: '#38a0f7',
          500: '#0e82eb',
          600: '#0266c8',
          700: '#0351a1',
          800: '#074585',
          900: '#0c3b6e',
          950: '#082548',
        },
        clinical: {
          teal: '#0d9488',
          tealLight: '#f0fdfa',
          navy: '#0f172a',
          slate: '#334155',
          subtle: '#64748b',
          border: '#e2e8f0',
          card: '#ffffff',
          bg: '#f8fafc',
        },
        status: {
          normal: {
            bg: '#ecfdf5',
            text: '#047857',
            border: '#a7f3d0',
            dot: '#10b981',
          },
          low: {
            bg: '#fffbeb',
            text: '#b45309',
            border: '#fde68a',
            dot: '#f59e0b',
          },
          high: {
            bg: '#fff7ed',
            text: '#c2410c',
            border: '#fed7aa',
            dot: '#f97316',
          },
          critical: {
            bg: '#fef2f2',
            text: '#b91c1c',
            border: '#fecaca',
            dot: '#ef4444',
          },
          uncertain: {
            bg: '#faf5ff',
            text: '#6b21a8',
            border: '#e9d5ff',
            dot: '#a855f7',
          },
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'card': '0.75rem',
        'badge': '9999px',
      }
    },
  },
  plugins: [],
}
