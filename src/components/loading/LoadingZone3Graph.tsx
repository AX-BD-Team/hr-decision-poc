import { ENTITY_COLORS } from '../../constants/tokens';

const NODE_STAGGER_MS = 150;
const EDGE_START_MS = 600;
const EDGE_STAGGER_MS = 120;

// Predefined node positions for the loading animation SVG
const nodePositions: { x: number; y: number; type: keyof typeof ENTITY_COLORS; label: string }[] = [
  { x: 200, y: 40, type: 'org', label: 'Org' },
  { x: 80, y: 100, type: 'role', label: 'Role' },
  { x: 320, y: 100, type: 'person', label: 'Person' },
  { x: 50, y: 180, type: 'project', label: 'Project' },
  { x: 200, y: 180, type: 'task', label: 'Task' },
  { x: 350, y: 180, type: 'risk', label: 'Risk' },
  { x: 200, y: 260, type: 'cost', label: 'Cost' },
];

// Edges connecting the nodes (indices into nodePositions)
const edgeDefs: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [4, 6],
];

export function LoadingZone3Graph() {
  return (
    <div
      className="flex h-full min-h-[300px] flex-col rounded-xl border border-zoneGraph/30 bg-panelBg/50"
      aria-busy="true"
      aria-label="온톨로지 그래프 생성 중"
    >
      {/* Header bar */}
      <div className="flex items-center gap-2 border-b border-neutralGray/20 px-4 py-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zoneGraph/30 text-xs font-bold text-zoneGraph">
          3
        </span>
        <h3 className="text-sm font-semibold text-textMain/50">Ontology Relationship Core</h3>
      </div>

      {/* SVG Canvas */}
      <div className="flex-1 min-h-0 relative flex items-center justify-center p-4">
        <svg viewBox="0 0 400 300" className="w-full h-full max-w-[400px] max-h-[300px]">
          {/* Edges drawn with stroke-dashoffset */}
          {edgeDefs.map(([from, to], i) => {
            const f = nodePositions[from];
            const t = nodePositions[to];
            const dx = t.x - f.x;
            const dy = t.y - f.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            return (
              <line
                key={`edge-${i}`}
                x1={f.x}
                y1={f.y}
                x2={t.x}
                y2={t.y}
                stroke="rgba(170,180,197,0.3)"
                strokeWidth={1.5}
                className="graph-edge-draw"
                style={{
                  '--edge-length': `${Math.round(length)}`,
                  animationDelay: `${EDGE_START_MS + i * EDGE_STAGGER_MS}ms`,
                } as React.CSSProperties}
              />
            );
          })}

          {/* Nodes with pop-in */}
          {nodePositions.map((node, i) => {
            const color = ENTITY_COLORS[node.type];
            return (
              <g key={`node-${i}`}>
                {/* Pulse ring on pop-in */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={14}
                  fill="none"
                  stroke={color}
                  strokeWidth={1.5}
                  opacity={0}
                  className="animate-graph-pulse-ring"
                  style={{ animationDelay: `${i * NODE_STAGGER_MS}ms`, transformOrigin: `${node.x}px ${node.y}px` }}
                />
                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={14}
                  fill={color}
                  opacity={0}
                  className="animate-graph-node-pop"
                  style={{ animationDelay: `${i * NODE_STAGGER_MS}ms`, transformOrigin: `${node.x}px ${node.y}px` }}
                />
                {/* Label */}
                <text
                  x={node.x}
                  y={node.y + 28}
                  textAnchor="middle"
                  fill="#AAB4C5"
                  fontSize={10}
                  fontFamily="'JetBrains Mono', monospace"
                  opacity={0}
                  className="animate-fade-in"
                  style={{ animationDelay: `${i * NODE_STAGGER_MS + 200}ms` }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Processing indicator */}
      <div className="px-4 pb-3 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zoneGraph opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-zoneGraph" />
        </span>
        <span className="text-xs text-textSub animate-pulse">온톨로지 관계 생성 중...</span>
      </div>
    </div>
  );
}
