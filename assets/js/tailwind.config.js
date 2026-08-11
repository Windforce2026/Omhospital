tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },
      colors: {
        brand: {
          50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
          400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
          800: '#065f46', 900: '#064e3b', 950: '#022c22'
        },
        accent: { 400: '#5eead4', 500: '#2dd4bf', 600: '#14b8a6' },
        danger: { 500: '#ef4444', 600: '#dc2626' }
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(0,0,0,0.08)',
        'dark-soft': '0 10px 40px -5px rgba(0,0,0,0.3)',
        premium: '0 20px 60px -12px rgba(0,0,0,0.15)',
        glow: '0 0 30px rgba(16, 185, 129, 0.15)',
        'glow-accent': '0 0 30px rgba(45, 212, 191, 0.15)'
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'pulse-soft': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 4s infinite'
      }
    }
  }
}
