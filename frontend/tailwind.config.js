/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        'cyber': ['Orbitron', 'monospace'],
        'mono-cyber': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cyber: {
          bg: '#0D1117',
          surface: '#161B22',
          border: '#21262D',
          blue: '#00C2FF',
          green: '#00FF85',
          red: '#FF4444',
          text: '#F0F6FC',
          muted: '#8B949E',
        }
      },
      animation: {
        'pulse-cyber': 'pulse-cyber 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-cyber': 'spin-cyber 0.8s linear infinite',
      },
      keyframes: {
        'pulse-cyber': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
        },
        'spin-cyber': {
          'to': {
            transform: 'rotate(360deg)',
          },
        },
      },
      boxShadow: {
        'cyber': '0 0 10px rgba(0, 194, 255, 0.3)',
        'cyber-lg': '0 0 20px rgba(0, 194, 255, 0.5)',
        'cyber-green': '0 0 10px rgba(0, 255, 133, 0.3)',
        'cyber-green-lg': '0 0 20px rgba(0, 255, 133, 0.5)',
      },
      backdropBlur: {
        'cyber': '8px',
      }
    },
  },
  plugins: [],
};
