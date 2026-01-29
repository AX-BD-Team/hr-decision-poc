import type { DemoData } from '../types';

export interface ValidationError {
  scenarioId: string;
  type: 'orphan_edge_source' | 'orphan_edge_target' | 'missing_field';
  message: string;
}

export function validateScenario(data: DemoData): ValidationError[] {
  const errors: ValidationError[] = [];
  const sid = data.meta.id;
  const entityIds = new Set(data.entities.map((e) => e.id));

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
