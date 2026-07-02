/**
 * tests/domain/devDebug.test.js — Tier 3.9 lean tests.
 */

import { describe, it, expect } from 'vitest';
import {
  deriveDevDebug,
  devDebugCounts,
  tracesForEntity,
} from '../../src/domain/devDebug.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

describe('deriveDevDebug()', () => {
  it('returns canonical envelope shape', () => {
    const d = deriveDevDebug({ name: 'X', tier: 'town' });
    expect(d).toHaveProperty('identity');
    expect(d).toHaveProperty('traces');
    expect(d).toHaveProperty('substrate');
    expect(d).toHaveProperty('capacities');
    expect(d).toHaveProperty('factions');
    expect(d).toHaveProperty('supplyChains');
    expect(d).toHaveProperty('conditions');
    expect(d).toHaveProperty('threats');
    expect(d).toHaveProperty('hooks');
    expect(d).toHaveProperty('clocks');
    expect(d).toHaveProperty('districts');
    expect(d).toHaveProperty('contradictions');
    expect(d).toHaveProperty('entityCatalog');
    expect(d).toHaveProperty('canonBreakdown');
  });

  it('returns zero/empty values for nullish settlement', () => {
    const d = deriveDevDebug(null);
    expect(d.traces.total).toBe(0);
    expect(d.factions).toEqual([]);
    expect(d.substrate).toBeNull();
  });

  it('counts traces correctly', () => {
    const s = {
      name: 'X',
      simulationTrace: [
        { step: 'a', targetType: 'institution', targetId: 'i.1', result: 'selected' },
        { step: 'a', targetType: 'institution', targetId: 'i.2', result: 'selected' },
        { step: 'b', targetType: 'faction',     targetId: 'f.1', result: 'promoted' },
      ],
    };
    const d = deriveDevDebug(s);
    expect(d.traces.total).toBe(3);
    expect(d.traces.byStep.a).toBe(2);
    expect(d.traces.byStep.b).toBe(1);
    expect(d.traces.byType.institution).toBe(2);
    expect(d.traces.byType.faction).toBe(1);
  });

  it('recent traces are last 10', () => {
    const s = {
      simulationTrace: Array.from({ length: 25 }).map((_, i) => ({
        step: 'x', targetType: 'institution', targetId: `i.${i}`, result: 'selected',
      })),
    };
    const d = deriveDevDebug(s);
    expect(d.traces.recent).toHaveLength(10);
  });

  it('identity carries id / name / tier / seed', () => {
    const d = deriveDevDebug({
      id: 's_abc', name: 'X', tier: 'town', _seed: 'seed-1',
      schemaVersion: 1, simulationVersion: 1,
    });
    expect(d.identity.id).toBe('s_abc');
    expect(d.identity.seed).toBe('seed-1');
  });
});

describe('devDebugCounts()', () => {
  it('returns counts for every layer', () => {
    const counts = devDebugCounts({ population: 2000 });
    expect(counts).toHaveProperty('traces');
    expect(counts).toHaveProperty('factions');
    expect(counts).toHaveProperty('supplyChains');
    expect(counts).toHaveProperty('conditions');
    expect(counts).toHaveProperty('threats');
    expect(counts).toHaveProperty('hooks');
    expect(counts).toHaveProperty('clocks');
    expect(counts).toHaveProperty('districts');
    expect(counts).toHaveProperty('contradictions');
    expect(counts).toHaveProperty('entities');
  });
});

describe('tracesForEntity()', () => {
  const s = {
    simulationTrace: [
      { step: 'a', targetType: 'institution', targetId: 'i.1', result: 'selected' },
      { step: 'b', targetType: 'faction',     targetId: 'f.1', result: 'promoted' },
      { step: 'c', targetType: 'institution', targetId: 'i.1', result: 'patched' },
    ],
  };

  it('returns every trace whose targetId matches, regardless of targetType', () => {
    // Regression: the old body filtered on targetType 'entity' (a type no trace
    // carries) and always returned []. It must key off targetId now.
    const traces = tracesForEntity(s, 'i.1');
    expect(traces).toHaveLength(2);
    expect(traces.map(t => t.result)).toEqual(['selected', 'patched']);
    expect(tracesForEntity(s, 'f.1')).toHaveLength(1);
  });

  it('returns [] for an unknown entity id', () => {
    expect(tracesForEntity(s, 'nope')).toEqual([]);
  });
});

describe('purity + smoke', () => {
  it('does not mutate settlement', () => {
    const s = { name: 'X', population: 1000 };
    const before = JSON.stringify(s);
    deriveDevDebug(s);
    devDebugCounts(s);
    expect(JSON.stringify(s)).toBe(before);
  });

  it('runs over a real city settlement', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'devDebug-real-city', customContent: {} },
    );
    const d = deriveDevDebug(settlement);
    expect(d.identity.name).toBeTruthy();
    expect(d.substrate).toBeTruthy();
    expect(d.entityCatalog.length).toBeGreaterThan(0);
  });
});
