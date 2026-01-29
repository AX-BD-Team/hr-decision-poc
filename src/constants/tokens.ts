import type { EntityType } from '../types';

/** Entity node colors for inline styles (e.g. ReactFlow nodes) */
export const ENTITY_COLORS: Record<EntityType, string> = {
  org: '#4F8CFF',
  role: '#10B981',
  person: '#F59E0B',
  project: '#8B5CF6',
  task: '#6366F1',
  risk: '#FF4D4F',
  cost: '#EC4899',
};

/** Edge colors for inline styles (e.g. ReactFlow edges) */
export const EDGE_COLORS: Record<string, string> = {
  depends_on: '#F59E0B',
  covers: '#10B981',
  assigned_to: '#4F8CFF',
  risk_of: '#FF4D4F',
  cost_supports: '#EC4899',
  bottleneck: '#FF4D4F',
  overlap: '#8B5CF6',
  belongs_to: '#6366F1',
};

/** Panel background for inline styles */
export const PANEL_BG = '#111A2E';

/** Chart / SVG inline style colors (for contexts where Tailwind classes cannot be used) */
export const CHART_COLORS = {
  success: '#34D399',
  alert: '#FF4D4F',
  warning: '#FBBF24',
  blue: '#4F8CFF',
  textSub: '#AAB4C5',
  textMain: '#E6EAF2',
  panelBg: '#111A2E',
  reactFlowBg: '#1a2744',
  white: '#FFFFFF',
  gridLine: 'rgba(170,180,197,0.08)',
  axis: 'rgba(170,180,197,0.2)',
  tick: 'rgba(170,180,197,0.3)',
  tooltipBg: 'rgba(17,26,46,0.95)',
  tooltipBorder: 'rgba(170,180,197,0.2)',
  tooltipBorderBlue: 'rgba(79,140,255,0.3)',
  whiteAlpha70: 'rgba(255,255,255,0.7)',
  gridDark: '#334155',
} as const;
