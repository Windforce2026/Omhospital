tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },
                    colors: {
                        brand: { 50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 900: '#1e3a8a' },
                        accent: { 400: '#22d3ee', 500: '#06b6d4' },
                        ayush: { 500: '#10b981', 600: '#059669' },
                        danger: { 500: '#ef4444', 600: '#dc2626' }
                    },
                    boxShadow: {
                        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
                        'dark-soft': '0 10px 40px -5px rgba(0,0,0,0.3)'
                    }
                }
            }
        }
