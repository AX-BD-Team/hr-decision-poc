import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Users, Briefcase, ClipboardList, Building2, AlertTriangle, DollarSign, FolderKanban, Puzzle, Milestone, GraduationCap } from 'lucide-react';
import { ENTITY_COLORS, CHART_COLORS } from '../../constants/tokens';
import { DataLabelBadge } from '../common/DataLabelBadge';
import type { Entity, EntityType } from '../../types';

const entityIcons: Record<EntityType, React.ComponentType<{ className?: string }>> = {
  person: Users,
  role: Briefcase,
  task: ClipboardList,
  org: Building2,
  risk: AlertTriangle,
  cost: DollarSign,
  project: FolderKanban,
  capability: Puzzle,
  stage: Milestone,
  training_program: GraduationCap,
};

function getEntityDetail(entity: Entity): string | null {
  const props = entity.properties;
  switch (entity.type) {
    case 'person':
      return props.utilization != null ? `가동률 ${Number(props.utilization) * 100}%` : null;
    case 'cost':
      return props.amount != null ? `${props.amount}` : null;
    case 'risk':
      return props.severity ? `${props.severity}` : null;
    case 'role':
      return props.headcount != null ? `${props.headcount}명` : null;
    case 'task':
      return props.status ? `${props.status}` : null;
    default:
      return null;
  }
}

interface EntityNodeData {
  label: string;
  entity: Entity;
  isSelected?: boolean;
  isPathRelated?: boolean;
  isDimmed?: boolean;
}

export const EntityNode = memo(function EntityNode({ data }: NodeProps) {
  const { entity, isSelected, isPathRelated, isDimmed } = data as unknown as EntityNodeData;
  const color = ENTITY_COLORS[entity.type] || '#666';
  const Icon = entityIcons[entity.type] || Building2;
  const detail = getEntityDetail(entity);

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-2 !h-2" />
      <div
        className="flex flex-col rounded-lg px-3 py-2 text-xs transition-all"
        style={{
          background: `linear-gradient(135deg, ${color}22, ${color}11)`,
          border: isPathRelated
            ? `2px solid ${color}`
            : isSelected
            ? `2px solid ${CHART_COLORS.white}`
            : `1px solid ${color}44`,
          boxShadow: isPathRelated
            ? `0 0 20px ${color}66`
            : isSelected
            ? `0 0 16px ${color}55`
            : `0 0 8px ${color}20`,
          opacity: isDimmed ? 0.35 : 1,
          minWidth: 100,
        }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <span style={{ color }} className="flex-shrink-0">
            <Icon className="h-3.5 w-3.5" />
          </span>
          <span className="font-medium text-textMain truncate">{entity.name}</span>
        </div>
        {detail && (
          <span className="text-tiny text-textSub font-mono mb-1">{detail}</span>
        )}
        <DataLabelBadge label={entity.label} size="sm" />
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-2 !h-2" />
    </>
  );
});
