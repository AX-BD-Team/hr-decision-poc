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
        neutralGray: 'var(--color-neutral-gray)',
        contextGreen: '#10B981',
        appBg: 'var(--color-app-bg)',
        panelBg: 'var(--color-panel-bg)',
        textMain: 'var(--color-text-main)',
        textSub: 'var(--color-text-sub)',
        // Zone accent colors
        zoneIngest: '#3B82F6',
        zoneStruct: '#8B5CF6',
        zoneGraph: '#06B6D4',
        zonePath: '#F59E0B',
        // Status colors
        warning: '#FBBF24',
        warningDark: '#F59E0B',
        success: '#34D399',
        successDark: '#10B981',
        // Data label colors
        label: {
          real: '#10B981',
          estimate: '#F59E0B',
          mock: '#8B5CF6',
          synth: '#06B6D4',
        },
        // Graph entity colors
        entity: {
          org: '#4F8CFF',
          role: '#10B981',
          person: '#F59E0B',
          project: '#8B5CF6',
          task: '#6366F1',
          risk: '#FF4D4F',
          cost: '#EC4899',
        },
        // Assumption category colors
        assumption: {
          data: '#06B6D4',
          logic: '#8B5CF6',
          scope: '#F59E0B',
        },
        // Severity colors
        severity: {
          critical: '#DC2626',
          high: '#FF4D4F',
          medium: '#FBBF24',
          low: '#34D399',
          info: '#4F8CFF',
        },
        // Surface elevation scale
        surface: {
          0: 'var(--color-surface-0)',
          1: 'var(--color-surface-1)',
          2: 'var(--color-surface-2)',
          3: 'var(--color-surface-3)',
          4: 'var(--color-surface-4)',
        },
      },
      fontSize: {
        mini: '0.5625rem',   // 9px
        micro: '0.625rem',   // 10px
        tiny: '0.6875rem',   // 11px
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
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
        'shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        // Zone 1: Ingestion
        'ingest-item-in': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'ingest-scan': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        // Zone 2: Structuring
        'struct-analyze': {
          '0%': { opacity: '0', filter: 'blur(4px)', transform: 'scale(0.92)' },
          '100%': { opacity: '1', filter: 'blur(0)', transform: 'scale(1)' },
        },
        'struct-beam': {
          '0%': { top: '0%', opacity: '0.8' },
          '50%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0.8' },
        },
        'struct-glow': {
          '0%': { boxShadow: '0 0 0 0 rgba(139,92,246,0)' },
          '30%': { boxShadow: '0 0 12px 2px rgba(139,92,246,0.5)' },
          '100%': { boxShadow: '0 0 0 0 rgba(139,92,246,0)' },
        },
        // Zone 3: Graph
        'graph-node-pop': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '70%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'graph-pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        // Zone 4: Decision Paths
        'path-card-snap': {
          '0%': { opacity: '0', transform: 'translateY(-30px) scale(0.9)' },
          '60%': { opacity: '1', transform: 'translateY(4px) scale(1.02)' },
          '80%': { transform: 'translateY(-2px) scale(1)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'path-landing-flash': {
          '0%': { opacity: '0' },
          '30%': { opacity: '0.6' },
          '100%': { opacity: '0' },
        },
        'path-ready-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245,158,11,0)' },
          '50%': { boxShadow: '0 0 16px 4px rgba(245,158,11,0.35)' },
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
        'shimmer': 'shimmer 8s linear infinite',
        'phase-reveal': 'fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        // Zone loading animations
        'ingest-item': 'ingest-item-in 0.35s ease-out both',
        'ingest-scan': 'ingest-scan 0.4s ease-out both',
        'struct-analyze': 'struct-analyze 0.5s ease-out both',
        'struct-beam': 'struct-beam 1.2s ease-in-out infinite',
        'struct-glow': 'struct-glow 0.8s ease-out both',
        'graph-node-pop': 'graph-node-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'graph-pulse-ring': 'graph-pulse-ring 0.6s ease-out both',
        'path-card-snap': 'path-card-snap 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'path-landing-flash': 'path-landing-flash 0.5s ease-out both',
        'path-ready-pulse': 'path-ready-pulse 1s ease-in-out 2',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.3)',
        // Elevation shadows
        'elevation-1': '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'elevation-2': '0 4px 6px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)',
        'elevation-3': '0 10px 15px rgba(0,0,0,0.4), 0 4px 6px rgba(0,0,0,0.3)',
        // Inner glow shadows
        'inner-glow-blue': 'inset 0 0 20px rgba(59,130,246,0.1)',
        'inner-glow-amber': 'inset 0 0 20px rgba(245,158,11,0.1)',
      },
    },
  },
  plugins: [],
}
