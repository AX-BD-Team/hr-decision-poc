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
import type { Entity, Edge } from '../../types';
import { RotateCcw } from 'lucide-react';
import { useT } from '../../i18n';
import { ENTITY_COLORS, EDGE_COLORS, PANEL_BG, CHART_COLORS } from '../../constants/tokens';
import { LoadingZone3Graph } from '../loading/LoadingZone3Graph';
import { EntityNode } from '../graph/EntityNode';
import { layoutGraph } from '../../utils/layoutGraph';

const nodeTypes = { entity: EntityNode };

export function ZoneGraph() {
  const t = useT();
  const { data, activeStep, selectedEntityId, selectedPathId, selectEntity, setActiveStep, loadingPhase, isTourActive, isDemoRunning } = useStore();
  const isActive = activeStep === 3;
  const showSkeleton = loadingPhase >= 1 && loadingPhase < 4;
  const justRevealed = loadingPhase >= 4 && loadingPhase <= 5;

  const pathRelatedEntityIds = useMemo(() => {
    if (!selectedPathId) return new Set<string>();
    const ids = new Set<string>();
    const path = data.decisionPaths.find((p) => p.id === selectedPathId);
    if (path?.relatedEntityIds) {
      for (const eid of path.relatedEntityIds) ids.add(eid);
    }
    for (const rs of data.riskSignals) {
      if (rs.relatedPaths.includes(selectedPathId)) {
        for (const eid of rs.relatedEntityIds) ids.add(eid);
      }
    }
    return ids;
  }, [data.decisionPaths, data.riskSignals, selectedPathId]);

  const dagrePositions = useMemo(
    () => layoutGraph(data.entities, data.edges).positions,
    [data.entities, data.edges]
  );

  const initialNodes: Node[] = useMemo(
    () =>
      data.entities.map((entity: Entity) => {
        const isSelected = selectedEntityId === entity.id;
        const isPathRelated = pathRelatedEntityIds.has(entity.id);
        const isDimmed = !!selectedPathId && !isPathRelated && !isSelected;
        const autoPos = dagrePositions.get(entity.id);
        return {
          id: entity.id,
          type: 'entity',
          position: autoPos || entity.position || { x: 0, y: 0 },
          data: { label: entity.name, entity, isSelected, isPathRelated, isDimmed },
        };
      }),
    [data.entities, selectedEntityId, selectedPathId, pathRelatedEntityIds, dagrePositions]
  );

  const initialEdges: FlowEdge[] = useMemo(
    () =>
      data.edges.map((edge: Edge) => {
        const bothLinked =
          pathRelatedEntityIds.size > 0 &&
          pathRelatedEntityIds.has(edge.source) &&
          pathRelatedEntityIds.has(edge.target);
        const isDimmed = pathRelatedEntityIds.size > 0 && !bothLinked;
        const color = EDGE_COLORS[edge.type] || '#666';
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.type.replace('_', ' '),
          labelStyle: {
            fontSize: '11px',
            fill: isDimmed ? `${CHART_COLORS.textSub}30` : CHART_COLORS.textSub,
            fontFamily: '"JetBrains Mono", monospace',
          },
          style: {
            stroke: color,
            strokeWidth: edge.weight ? edge.weight * 3 : 2,
            opacity: isDimmed ? 0.15 : 1,
            transition: 'opacity 0.3s ease',
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color,
          },
          animated: edge.type === 'risk_of' || edge.type === 'bottleneck',
        };
      }),
    [data.edges, pathRelatedEntityIds]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      selectEntity(selectedEntityId === node.id ? null : node.id);
    },
    [selectEntity, selectedEntityId]
  );

  if (showSkeleton) return <LoadingZone3Graph />;

  return (
    <div
      className={clsx(
        'scan-line-overlay flex h-full min-h-0 flex-col rounded-xl border transition-all',
        justRevealed && 'animate-phase-reveal',
        isActive
          ? clsx('border-zoneGraph/70 bg-zoneGraph/10 shadow-glow-cyan', (isDemoRunning || isTourActive) && 'zone-pulse-cyan')
          : 'border-neutralGray/20 bg-panelBg/50'
      )}
      data-tour="zone-3"
      aria-label={t('a11y.ontologyGraphAria')}
    >
      <div className="flex items-center justify-between gap-3 border-b border-neutralGray/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
              isActive ? 'bg-zoneGraph text-white' : 'bg-neutralGray/30 text-textSub'
            )}
          >
            3
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-textMain">Ontology Relationship Core</h3>
            <p className="text-xs text-textSub">{t('zones.zone3Description')}</p>
          </div>
        </div>
        <button
          onClick={() => {
            selectEntity(null);
            setActiveStep(1);
          }}
          aria-label={t('a11y.resetGraphAria')}
          className="flex items-center gap-2 rounded-lg border border-neutralGray/20 bg-appBg/40 px-3 py-2 text-xs text-textSub transition-all hover:bg-appBg/70 hover:text-textMain focus-ring"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Reset/Back to Overview</span>
        </button>
      </div>

      <div className="flex-1 min-h-0 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background color={CHART_COLORS.reactFlowBg} gap={20} />
          <Controls
            className="hidden sm:flex"
            style={{
              background: PANEL_BG,
              borderRadius: '8px',
              border: '1px solid rgba(170, 180, 197, 0.2)',
            }}
          />
        </ReactFlow>

        {/* Floating Legend Overlay */}
        <div
          className="absolute bottom-3 right-3 flex flex-wrap gap-2 rounded-lg bg-surface-2/90 backdrop-blur-sm px-3 py-2 border border-neutralGray/20 shadow-elevation-2 max-w-[280px]"
          role="list"
          aria-label={t('a11y.entityTypeLegendAria')}
        >
          {Object.entries(ENTITY_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1" role="listitem">
              <span
                className="h-2.5 w-2.5 rounded"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <span className="text-micro text-textSub font-mono uppercase">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
