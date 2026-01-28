import { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge as FlowEdge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useStore } from '../../store/useStore';
import { clsx } from 'clsx';
import type { Entity, Edge, EntityType } from '../../types';

const nodeColors: Record<EntityType, string> = {
  org: '#4F8CFF',
  role: '#10B981',
  person: '#F59E0B',
  project: '#8B5CF6',
  task: '#6366F1',
  risk: '#FF4D4F',
  cost: '#EC4899',
};

const edgeColors: Record<string, string> = {
  depends_on: '#F59E0B',
  covers: '#10B981',
  assigned_to: '#4F8CFF',
  risk_of: '#FF4D4F',
  cost_supports: '#EC4899',
  bottleneck: '#FF4D4F',
  overlap: '#8B5CF6',
  belongs_to: '#6366F1',
};

export function ZoneGraph() {
  const { data, activeStep, selectedEntityId, selectEntity } = useStore();
  const isActive = activeStep === 3;

  const initialNodes: Node[] = useMemo(
    () =>
      data.entities.map((entity: Entity) => {
        const baseColor = nodeColors[entity.type] || '#666';
        const isSelected = selectedEntityId === entity.id;
        return {
          id: entity.id,
          position: entity.position || { x: 0, y: 0 },
          data: { label: entity.name, entity },
          style: {
            background: `linear-gradient(135deg, ${baseColor}, ${baseColor}CC)`,
            color: '#fff',
            border: isSelected ? '2px solid #fff' : `1px solid ${baseColor}66`,
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: 500,
            fontFamily: '"Pretendard", sans-serif',
            boxShadow: isSelected
              ? `0 0 24px ${baseColor}80`
              : `0 0 12px ${baseColor}30`,
          },
        };
      }),
    [data.entities, selectedEntityId]
  );

  const initialEdges: FlowEdge[] = useMemo(
    () =>
      data.edges.map((edge: Edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.type.replace('_', ' '),
        labelStyle: { fontSize: '11px', fill: '#AAB4C5', fontFamily: '"JetBrains Mono", monospace' },
        style: {
          stroke: edgeColors[edge.type] || '#666',
          strokeWidth: edge.weight ? edge.weight * 3 : 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColors[edge.type] || '#666',
        },
        animated: edge.type === 'risk_of' || edge.type === 'bottleneck',
      })),
    [data.edges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectEntity(selectedEntityId === node.id ? null : node.id);
    },
    [selectEntity, selectedEntityId]
  );

  return (
    <div
      className={clsx(
        'scan-line-overlay flex h-full min-h-0 flex-col rounded-xl border transition-all',
        isActive
          ? 'border-zoneGraph/50 bg-zoneGraph/5 shadow-glow-cyan'
          : 'border-neutralGray/20 bg-panelBg/50'
      )}
      data-tour="zone-3"
    >
      <div className="flex items-center gap-2 border-b border-neutralGray/20 px-4 py-3">
        <span
          className={clsx(
            'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
            isActive ? 'bg-zoneGraph text-white' : 'bg-neutralGray/30 text-textSub'
          )}
        >
          3
        </span>
        <h3 className="text-sm font-semibold text-textMain">Ontology Relationship Core</h3>
        <span className="text-xs text-textSub">관계 그래프</span>
      </div>

      <div className="flex-1 min-h-0 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#1a2744" gap={20} />
          <Controls
            style={{
              background: '#111A2E',
              borderRadius: '8px',
              border: '1px solid rgba(170, 180, 197, 0.2)',
            }}
          />
        </ReactFlow>

        {/* Floating Legend Overlay */}
        <div className="absolute bottom-3 right-3 flex flex-wrap gap-2 rounded-lg bg-surface-2/90 backdrop-blur-sm px-3 py-2 border border-neutralGray/20 shadow-elevation-2 max-w-[280px]">
          {Object.entries(nodeColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1">
              <span
                className="h-2.5 w-2.5 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] text-textSub font-mono uppercase">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
