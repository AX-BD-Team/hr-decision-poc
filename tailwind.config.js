/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        decisionBlue: '#4F8CFF',
        alertRed: '#FF4D4F',
        neutralGray: '#AAB4C5',
        contextGreen: '#10B981',
        appBg: '#0B1220',
        panelBg: '#111A2E',
        textMain: '#E6EAF2',
        textSub: '#AAB4C5',
        // Zone accent colors
        zoneIngest: '#3B82F6',
        zoneStruct: '#8B5CF6',
        zoneGraph: '#06B6D4',
        zonePath: '#F59E0B',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'fade-in-up': 'fade-in-up 0.5s ease-out both',
        'slide-in-right': 'slide-in-right 0.5s ease-out 0.5s both',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'scan-line': 'scan-line 4s linear infinite',
        // Stagger delays for zones
        'stagger-1': 'fade-in-up 0.5s ease-out 0.1s both',
        'stagger-2': 'fade-in-up 0.5s ease-out 0.2s both',
        'stagger-3': 'fade-in-up 0.5s ease-out 0.3s both',
        'stagger-4': 'fade-in-up 0.5s ease-out 0.4s both',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.3)',
      },
    },
  },
  plugins: [],
}
