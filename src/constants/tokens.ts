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
