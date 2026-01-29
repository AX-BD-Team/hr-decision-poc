import dagre from 'dagre';
import type { Entity, Edge } from '../types';

interface LayoutResult {
  positions: Map<string, { x: number; y: number }>;
}

export function layoutGraph(
  entities: Entity[],
  edges: Edge[],
  direction: 'LR' | 'TB' = 'LR',
  nodeWidth = 180,
  nodeHeight = 60,
): LayoutResult {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: direction, nodesep: 60, ranksep: 120, edgesep: 30 });
  g.setDefaultEdgeLabel(() => ({}));

  for (const entity of entities) {
    g.setNode(entity.id, { width: nodeWidth, height: nodeHeight });
  }

  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const positions = new Map<string, { x: number; y: number }>();
  for (const entity of entities) {
    const node = g.node(entity.id);
    if (node) {
      positions.set(entity.id, {
        x: node.x - nodeWidth / 2,
        y: node.y - nodeHeight / 2,
      });
    }
  }

  return { positions };
}
