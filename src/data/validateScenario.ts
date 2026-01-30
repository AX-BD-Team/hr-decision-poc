import type { DemoData } from '../types';

const VALID_ENTITY_TYPES = new Set([
  'person', 'role', 'task', 'org', 'risk', 'cost', 'project',
  'capability', 'stage', 'training_program',
]);
const VALID_EDGE_TYPES = new Set([
  'depends_on', 'covers', 'bottleneck', 'overlap', 'cost_supports',
  'risk_of', 'belongs_to', 'assigned_to',
  'requires_capability', 'trains_for', 'part_of_stage', 'duplicates',
]);
const VALID_READINESS = new Set(['available', 'recommended', 'missing', 'undefined_rules']);

export interface ValidationError {
  scenarioId: string;
  type:
    | 'orphan_edge_source'
    | 'orphan_edge_target'
    | 'missing_field'
    | 'orphan_related_path'
    | 'orphan_related_entity'
    | 'invalid_type'
    | 'criteria_count'
    | 'badge_mismatch'
    | 'invalid_readiness';
  message: string;
}

export function validateScenario(data: DemoData): ValidationError[] {
  const errors: ValidationError[] = [];
  const sid = data.meta.id;
  const entityIds = new Set(data.entities.map((e) => e.id));
  const pathIds = new Set(data.decisionPaths.map((p) => p.id));

  // Decision criteria count
  if (data.meta.decisionCriteria && data.meta.decisionCriteria.length !== 5) {
    errors.push({
      scenarioId: sid,
      type: 'criteria_count',
      message: `Expected 5 decisionCriteria, got ${data.meta.decisionCriteria.length}`,
    });
  }

  // Badge validation
  if (sid === 's3' && data.meta.badge !== 'Phase-2') {
    errors.push({
      scenarioId: sid,
      type: 'badge_mismatch',
      message: `S3 should have badge "Phase-2", got "${data.meta.badge}"`,
    });
  }
  if (sid === 's4' && data.meta.badge !== 'HRD') {
    errors.push({
      scenarioId: sid,
      type: 'badge_mismatch',
      message: `S4 should have badge "HRD", got "${data.meta.badge}"`,
    });
  }

  // Entity type validation
  for (const entity of data.entities) {
    if (!VALID_ENTITY_TYPES.has(entity.type)) {
      errors.push({
        scenarioId: sid,
        type: 'invalid_type',
        message: `Entity "${entity.id}" has invalid type "${entity.type}"`,
      });
    }
  }

  // Edge type validation
  for (const edge of data.edges) {
    if (!VALID_EDGE_TYPES.has(edge.type)) {
      errors.push({
        scenarioId: sid,
        type: 'invalid_type',
        message: `Edge "${edge.id}" has invalid type "${edge.type}"`,
      });
    }
  }

  // Readiness validation
  for (const ds of data.dataSources) {
    if (ds.readiness && !VALID_READINESS.has(ds.readiness)) {
      errors.push({
        scenarioId: sid,
        type: 'invalid_readiness',
        message: `DataSource "${ds.id}" has invalid readiness "${ds.readiness}"`,
      });
    }
  }

  // Edge source/target → entity ids
  for (const edge of data.edges) {
    if (!entityIds.has(edge.source)) {
      errors.push({
        scenarioId: sid,
        type: 'orphan_edge_source',
        message: `Edge "${edge.id}" source "${edge.source}" not found in entities`,
      });
    }
    if (!entityIds.has(edge.target)) {
      errors.push({
        scenarioId: sid,
        type: 'orphan_edge_target',
        message: `Edge "${edge.id}" target "${edge.target}" not found in entities`,
      });
    }
  }

  // assumption.relatedPaths → decisionPath ids
  for (const a of data.assumptions) {
    for (const rp of a.relatedPaths) {
      if (!pathIds.has(rp)) {
        errors.push({
          scenarioId: sid,
          type: 'orphan_related_path',
          message: `Assumption "${a.id}" relatedPath "${rp}" not found in decisionPaths`,
        });
      }
    }
  }

  // evidence.relatedPaths → decisionPath ids
  for (const ev of data.evidence) {
    for (const rp of ev.relatedPaths) {
      if (!pathIds.has(rp)) {
        errors.push({
          scenarioId: sid,
          type: 'orphan_related_path',
          message: `Evidence "${ev.id}" relatedPath "${rp}" not found in decisionPaths`,
        });
      }
    }
  }

  // riskSignal.relatedPaths → decisionPath ids
  for (const rs of data.riskSignals) {
    for (const rp of rs.relatedPaths) {
      if (!pathIds.has(rp)) {
        errors.push({
          scenarioId: sid,
          type: 'orphan_related_path',
          message: `RiskSignal "${rs.id}" relatedPath "${rp}" not found in decisionPaths`,
        });
      }
    }
  }

  // decisionPath.relatedEntityIds → entity ids
  for (const dp of data.decisionPaths) {
    for (const eid of dp.relatedEntityIds ?? []) {
      if (!entityIds.has(eid)) {
        errors.push({
          scenarioId: sid,
          type: 'orphan_related_entity',
          message: `DecisionPath "${dp.id}" relatedEntityId "${eid}" not found in entities`,
        });
      }
    }
  }

  // riskSignal.relatedEntityIds → entity ids
  for (const rs of data.riskSignals) {
    for (const eid of rs.relatedEntityIds) {
      if (!entityIds.has(eid)) {
        errors.push({
          scenarioId: sid,
          type: 'orphan_related_entity',
          message: `RiskSignal "${rs.id}" relatedEntityId "${eid}" not found in entities`,
        });
      }
    }
  }

  // utilizationMap.entityId → entity ids
  for (const ctx of data.hrContextViews) {
    for (const um of ctx.utilizationMap) {
      if (um.entityId && !entityIds.has(um.entityId)) {
        errors.push({
          scenarioId: sid,
          type: 'orphan_related_entity',
          message: `UtilizationPoint "${um.id}" entityId "${um.entityId}" not found in entities`,
        });
      }
    }
  }

  return errors;
}

export function validateAllScenarios(scenarios: Record<string, DemoData>): void {
  if (import.meta.env.PROD) return;

  for (const [id, data] of Object.entries(scenarios)) {
    const errors = validateScenario(data);
    for (const err of errors) {
      console.warn(`[Scenario ${id}] ${err.type}: ${err.message}`);
    }
  }
}
