/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#050508',
        dark: '#0a0a12',
        darker: '#07070e',
        'neon-cyan': '#00f5d4',
        'neon-pink': '#ff2d78',
        'neon-purple': '#9b5de5',
        'neon-blue': '#00b4d8',
        light: '#e0e0ff',
        muted: 'rgba(224,224,255,0.5)',
      },
      fontFamily: {
        heading: ['Orbitron', 'monospace'],
        body: ['Rajdhani', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
      },
      animation: {
        'ticker': 'ticker 30s linear infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'glow-pink': 'glowPink 3s ease-in-out infinite',
        'glow-cyan': 'glowCyan 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        glowPink: {
          '0%, 100%': { textShadow: '0 0 10px #ff2d78, 0 0 20px #ff2d78, 0 0 40px #ff2d78' },
          '50%': { textShadow: '0 0 20px #ff2d78, 0 0 40px #ff2d78, 0 0 80px #ff2d78' },
        },
        glowCyan: {
          '0%, 100%': { textShadow: '0 0 10px #00f5d4, 0 0 20px #00f5d4, 0 0 40px #00f5d4' },
          '50%': { textShadow: '0 0 20px #00f5d4, 0 0 40px #00f5d4, 0 0 80px #00f5d4' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(0,245,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,0.03) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid': '40px 40px',
      }
    },
  },
  plugins: [],
}
