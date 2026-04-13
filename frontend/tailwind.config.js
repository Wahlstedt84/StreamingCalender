/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          purple: '#8b5cf6',
          pink: '#ec4899',
          violet: '#7c3aed',
          glow: 'rgba(139,92,246,0.4)',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
        'gradient-brand-subtle': 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.15) 100%)',
        'gradient-card': 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
      },
      boxShadow: {
        'brand': '0 0 40px rgba(139,92,246,0.35)',
        'brand-sm': '0 0 20px rgba(139,92,246,0.2)',
        'card': '0 25px 60px rgba(0,0,0,0.6)',
        'glow-pink': '0 0 30px rgba(236,72,153,0.3)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 12s ease infinite',
        'fade-in': 'fade-in 0.3s ease',
        'slide-up': 'slide-up 0.3s ease',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
