import { describe, it, expect } from 'vitest';
import { scenarioDataById, scenarioMetas } from '../scenarios';
import { validateScenario } from '../validateScenario';
import type { DataLabel, DemoData } from '../../types';

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
