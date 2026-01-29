import type { DemoData } from '../types';
import demoS1 from './demo-s1.json';
import demoS2 from './demo-s2.json';
import demoS3 from './demo-s3.json';
import demoS4 from './demo-s4.json';
import { validateAllScenarios } from './validateScenario';

const s1 = demoS1 as DemoData;
const s2 = demoS2 as DemoData;
const s3 = demoS3 as DemoData;
const s4 = demoS4 as DemoData;

export const scenarioDataById: Record<string, DemoData> = {
  [s1.meta.id]: s1,
  [s2.meta.id]: s2,
  [s3.meta.id]: s3,
  [s4.meta.id]: s4,
};

export const scenarioMetas = [s1.meta, s2.meta, s3.meta, s4.meta];

validateAllScenarios(scenarioDataById);
