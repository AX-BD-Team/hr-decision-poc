import { describe, it, expect } from 'vitest';
import { scenarioDataById, scenarioMetas } from '../scenarios';
import { validateScenario } from '../validateScenario';
import type { DataLabel, DemoData, EntityType, EdgeType } from '../../types';

const VALID_LABELS: DataLabel[] = ['REAL', 'MOCK', 'ESTIMATE', 'SYNTH'];
const scenarios = Object.values(scenarioDataById);

describe('시나리오 데이터 구조 완전성', () => {
  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: 모든 필수 필드 존재', (_id, data) => {
    const d = data as DemoData;
    expect(d.meta).toBeDefined();
    expect(d.meta.id).toBeTruthy();
    expect(d.meta.name).toBeTruthy();
    expect(d.meta.keyQuestion).toBeTruthy();
    expect(d.dataSources.length).toBeGreaterThan(0);
    expect(d.analysisPatterns.length).toBeGreaterThan(0);
    expect(d.entities.length).toBeGreaterThan(0);
    expect(d.edges.length).toBeGreaterThan(0);
    expect(d.assumptions.length).toBeGreaterThan(0);
    expect(d.evidence.length).toBeGreaterThan(0);
    expect(d.riskSignals.length).toBeGreaterThan(0);
    expect(d.decisionPaths.length).toBe(3);
    expect(d.hrContextViews.length).toBeGreaterThan(0);
  });
});

describe('Entity/Edge 참조 무결성', () => {
  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: 모든 edge의 source/target이 entity에 존재', (_id, data) => {
    const errors = validateScenario(data as DemoData);
    expect(errors).toEqual([]);
  });
});

describe('DataLabel 유효성', () => {
  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: 모든 라벨이 유효값', (_id, data) => {
    const d = data as DemoData;

    for (const ds of d.dataSources) {
      expect(VALID_LABELS).toContain(ds.label);
    }
    for (const e of d.entities) {
      expect(VALID_LABELS).toContain(e.label);
    }
    for (const edge of d.edges) {
      expect(VALID_LABELS).toContain(edge.label);
    }
    for (const ev of d.evidence) {
      expect(VALID_LABELS).toContain(ev.label);
    }
    for (const r of d.riskSignals) {
      expect(VALID_LABELS).toContain(r.label);
    }
    for (const ap of d.analysisPatterns) {
      expect(VALID_LABELS).toContain(ap.label);
    }
    for (const dp of d.decisionPaths) {
      for (const m of dp.keyMetrics) {
        expect(VALID_LABELS).toContain(m.label);
      }
    }
  });
});

describe('시나리오 메타 고유성', () => {
  it('모든 시나리오 ID가 고유함', () => {
    const ids = scenarioMetas.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('모든 시나리오 이름이 고유함', () => {
    const names = scenarioMetas.map((m) => m.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe('decisionPaths 일관성', () => {
  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: path-a, path-b, path-c 존재', (_id, data) => {
    const d = data as DemoData;
    const pathIds = d.decisionPaths.map((p) => p.id);
    expect(pathIds).toContain('path-a');
    expect(pathIds).toContain('path-b');
    expect(pathIds).toContain('path-c');
  });

  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: 모든 경로에 keyMetrics 존재', (_id, data) => {
    const d = data as DemoData;
    for (const p of d.decisionPaths) {
      expect(p.keyMetrics.length).toBeGreaterThan(0);
      expect(p.name).toBeTruthy();
      expect(p.summary).toBeTruthy();
      expect(p.description).toBeTruthy();
    }
  });
});

// ── Phase A: 참조 무결성 ──

describe('참조 무결성 — relatedPaths', () => {
  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: assumption.relatedPaths → decisionPath ids', (_id, data) => {
    const d = data as DemoData;
    const pathIds = new Set(d.decisionPaths.map((p) => p.id));
    for (const a of d.assumptions) {
      for (const rp of a.relatedPaths) {
        expect(pathIds).toContain(rp);
      }
    }
  });

  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: evidence.relatedPaths → decisionPath ids', (_id, data) => {
    const d = data as DemoData;
    const pathIds = new Set(d.decisionPaths.map((p) => p.id));
    for (const ev of d.evidence) {
      for (const rp of ev.relatedPaths) {
        expect(pathIds).toContain(rp);
      }
    }
  });

  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: riskSignal.relatedPaths → decisionPath ids', (_id, data) => {
    const d = data as DemoData;
    const pathIds = new Set(d.decisionPaths.map((p) => p.id));
    for (const rs of d.riskSignals) {
      for (const rp of rs.relatedPaths) {
        expect(pathIds).toContain(rp);
      }
    }
  });
});

describe('참조 무결성 — relatedEntityIds', () => {
  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: decisionPath.relatedEntityIds → entity ids', (_id, data) => {
    const d = data as DemoData;
    const entityIds = new Set(d.entities.map((e) => e.id));
    for (const dp of d.decisionPaths) {
      for (const eid of dp.relatedEntityIds ?? []) {
        expect(entityIds).toContain(eid);
      }
    }
  });

  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: riskSignal.relatedEntityIds → entity ids', (_id, data) => {
    const d = data as DemoData;
    const entityIds = new Set(d.entities.map((e) => e.id));
    for (const rs of d.riskSignals) {
      for (const eid of rs.relatedEntityIds) {
        expect(entityIds).toContain(eid);
      }
    }
  });

  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: utilizationMap.entityId → entity ids', (_id, data) => {
    const d = data as DemoData;
    const entityIds = new Set(d.entities.map((e) => e.id));
    for (const ctx of d.hrContextViews) {
      for (const um of ctx.utilizationMap) {
        if (um.entityId) {
          expect(entityIds).toContain(um.entityId);
        }
      }
    }
  });
});

// ── Enum 유효성 ──

const VALID_ENTITY_TYPES: EntityType[] = ['person', 'role', 'task', 'org', 'risk', 'cost', 'project'];
const VALID_EDGE_TYPES: EdgeType[] = ['depends_on', 'covers', 'bottleneck', 'overlap', 'cost_supports', 'risk_of', 'belongs_to', 'assigned_to'];
const VALID_SEVERITY = ['high', 'medium', 'low'] as const;
const VALID_ASSUMPTION_CATEGORY = ['data', 'logic', 'scope'] as const;
const VALID_INSIGHT_SEVERITY = ['info', 'warning', 'critical'] as const;
const VALID_ANALYSIS_PATTERN_TYPE = ['gap_analysis', 'dependency', 'bottleneck', 'cost_impact'] as const;
const VALID_DATASOURCE_TYPE = ['hr_master', 'tms', 'rr', 'bizforce', 'vrb', 'opex'] as const;

describe('Enum 유효성', () => {
  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: entity.type이 EntityType', (_id, data) => {
    const d = data as DemoData;
    for (const e of d.entities) {
      expect(VALID_ENTITY_TYPES).toContain(e.type);
    }
  });

  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: edge.type이 EdgeType', (_id, data) => {
    const d = data as DemoData;
    for (const edge of d.edges) {
      expect(VALID_EDGE_TYPES).toContain(edge.type);
    }
  });

  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: riskSignal.severity가 high/medium/low', (_id, data) => {
    const d = data as DemoData;
    for (const rs of d.riskSignals) {
      expect(VALID_SEVERITY).toContain(rs.severity);
    }
  });

  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: decisionPath.riskLevel이 high/medium/low', (_id, data) => {
    const d = data as DemoData;
    for (const dp of d.decisionPaths) {
      expect(VALID_SEVERITY).toContain(dp.riskLevel);
    }
  });

  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: decisionPath.effectLevel이 high/medium/low', (_id, data) => {
    const d = data as DemoData;
    for (const dp of d.decisionPaths) {
      expect(VALID_SEVERITY).toContain(dp.effectLevel);
    }
  });

  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: assumption.category가 data/logic/scope', (_id, data) => {
    const d = data as DemoData;
    for (const a of d.assumptions) {
      expect(VALID_ASSUMPTION_CATEGORY).toContain(a.category);
    }
  });

  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: insight.severity가 info/warning/critical', (_id, data) => {
    const d = data as DemoData;
    for (const ctx of d.hrContextViews) {
      for (const ins of ctx.insights) {
        expect(VALID_INSIGHT_SEVERITY).toContain(ins.severity);
      }
    }
  });

  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: analysisPattern.type 유효값', (_id, data) => {
    const d = data as DemoData;
    for (const ap of d.analysisPatterns) {
      expect(VALID_ANALYSIS_PATTERN_TYPE).toContain(ap.type);
    }
  });

  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: dataSource.type 유효값', (_id, data) => {
    const d = data as DemoData;
    for (const ds of d.dataSources) {
      expect(VALID_DATASOURCE_TYPE).toContain(ds.type);
    }
  });
});

// ── 값 범위 유효성 ──

describe('값 범위 유효성', () => {
  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: dataSource.coverage 0~100', (_id, data) => {
    const d = data as DemoData;
    for (const ds of d.dataSources) {
      expect(ds.coverage).toBeGreaterThanOrEqual(0);
      expect(ds.coverage).toBeLessThanOrEqual(100);
    }
  });

  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: utilizationMap.dependency 0~1', (_id, data) => {
    const d = data as DemoData;
    for (const ctx of d.hrContextViews) {
      for (const um of ctx.utilizationMap) {
        expect(um.dependency).toBeGreaterThanOrEqual(0);
        expect(um.dependency).toBeLessThanOrEqual(1);
      }
    }
  });

  it.each(scenarios.map((s) => [s.meta.id, s]))('시나리오 %s: edge.weight 0~1', (_id, data) => {
    const d = data as DemoData;
    for (const edge of d.edges) {
      if (edge.weight !== undefined) {
        expect(edge.weight).toBeGreaterThanOrEqual(0);
        expect(edge.weight).toBeLessThanOrEqual(1);
      }
    }
  });
});
