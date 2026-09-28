/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#121826',
          800: '#1A2332',
          700: '#2B3648',
          600: '#445468',
          400: '#8494A8',
        },
        paper: {
          50: '#F5F7FA',
          100: '#EBEEF3',
          200: '#DCE1E9',
        },
        pen: {
          DEFAULT: '#C0392B',
          dark: '#9B2E23',
          light: '#E35A4C',
          tint: '#FCEDEB',
        },
        sage: {
          DEFAULT: '#3F6F5F',
          tint: '#E6F0EB',
        },
        violet: {
          DEFAULT: '#4F5BD5',
          dark: '#3E48B0',
          tint: '#EEF0FB',
        },
        amber: {
          50: '#FFF8EB',
          300: '#F5C35B',
          900: '#7A4E0F',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Sora"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(18,24,38,0.04), 0 12px 32px -18px rgba(18,24,38,0.18)',
        pop: '0 24px 48px -20px rgba(18,24,38,0.35)',
        soft: '0 1px 0 rgba(18,24,38,0.05)',
        rail: '0 1px 0 rgba(18,24,38,0.08)',
      },
      backgroundImage: {
        'app-mesh':
          'radial-gradient(ellipse 90% 60% at 10% -10%, rgba(192,57,43,0.09), transparent 55%), radial-gradient(ellipse 70% 50% at 100% 0%, rgba(63,111,95,0.08), transparent 50%)',
        'hero-band':
          'linear-gradient(120deg, #FCEDEB 0%, #FFFFFF 42%, #E6F0EB 100%)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        modalIn: {
          '0%': { opacity: 0, transform: 'translateY(14px) scale(0.98)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        backdropIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        toastSlideIn: {
          '0%': { opacity: 0, transform: 'translateY(-8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s ease-out both',
        'modal-in': 'modalIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) both',
        'backdrop-in': 'backdropIn 0.2s ease-out both',
        'toast-in': 'toastSlideIn 0.22s ease-out both',
      },
    },
  },
  plugins: [],
}
