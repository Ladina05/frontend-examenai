/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#161D29',
          800: '#1E2734',
          700: '#2A3444',
          600: '#3B4A60',
          400: '#7C8AA0',
        },
        paper: {
          50: '#FAFAF7',
          100: '#F2F1EA',
          200: '#E7E4D9',
        },
        pen: {
          DEFAULT: '#C23B34',
          dark: '#9E2F29',
          light: '#E8635B',
          tint: '#FBEAE8',
        },
        sage: {
          DEFAULT: '#4C7A6C',
          tint: '#E7EFEA',
        },
        violet: {
          DEFAULT: '#5B5BD6',
          dark: '#4644B8',
          tint: '#EFEEFC',
        },
        amber: {
          50: '#FFFBEB',
          300: '#FCD34D',
          900: '#78350F',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(22, 29, 41, 0.05), 0 8px 24px -12px rgba(22, 29, 41, 0.12)',
        pop: '0 12px 32px -8px rgba(22, 29, 41, 0.20)',
        rail: '1px 0 0 rgba(22, 29, 41, 0.06)',
      },
      backgroundImage: {
        'sidebar-wash': 'linear-gradient(180deg, #FFFFFF 0%, #FCFBF8 100%)',
        'hero-blob': 'radial-gradient(circle at 30% 30%, rgba(91,91,214,0.16), transparent 60%), radial-gradient(circle at 75% 60%, rgba(194,59,52,0.13), transparent 55%)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(12px, -14px) scale(1.04)' },
        },
        toastSlideIn: {
          '0%': { opacity: 0, transform: 'translateX(12px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s ease-out both',
        'float-slow': 'floatSlow 10s ease-in-out infinite',
        'toast-in': 'toastSlideIn 0.25s ease-out both',
      },
    },
  },
  plugins: [],
}
