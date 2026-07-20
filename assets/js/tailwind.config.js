tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },
      colors: {
        brand: {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
          400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
          800: '#1e40af', 900: '#1e3a8a'
        },
        accent: { 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2' },
        danger: { 500: '#ef4444', 600: '#dc2626' }
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(0,0,0,0.08)',
        'dark-soft': '0 10px 40px -5px rgba(0,0,0,0.3)',
        premium: '0 20px 60px -12px rgba(0,0,0,0.15)',
        glow: '0 0 30px rgba(37, 99, 235, 0.15)',
        'glow-accent': '0 0 30px rgba(6, 182, 212, 0.15)'
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
