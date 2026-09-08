/**
 * tests/domain/regenerationDelta.test.js — Tier 5.1 lean tests.
 */

import { describe, it, expect } from 'vitest';
import {
  deriveRegenerationDelta,
  regenerationDeltaSize,
  newEntitiesByType,
} from '../../src/domain/regenerationDelta.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

function fixture() {
  return {
    name: 'Greycairn',
    tier: 'town',
    population: 2000,
    institutions: [
      { id: 'institution.granary', name: 'Granary' },
      { id: 'institution.market',  name: 'Market' },
    ],
    powerStructure: {
      governingName: 'Council',
      publicLegitimacy: { score: 60, label: 'Approved' },
      factions: [
        { id: 'faction.council', name: 'Council', faction: 'Council', power: 35 },
      ],
    },
    economicState: { activeChains: [] },
    activeConditions: [],
  };
}

describe('deriveRegenerationDelta()', () => {
  it('returns canonical envelope shape', () => {
    const d = deriveRegenerationDelta(fixture(), fixture());
    expect(d).toHaveProperty('directEffects');
    expect(d).toHaveProperty('rippleEffects');
    expect(d).toHaveProperty('capacityShifts');
    expect(d).toHaveProperty('dailyLifeShifts');
    expect(d).toHaveProperty('preservedCanon');
    expect(d).toHaveProperty('brokenDependencies');
    expect(d).toHaveProperty('newEntities');
    expect(d).toHaveProperty('removedEntities');
    expect(d).toHaveProperty('newOpportunities');
    expect(d).toHaveProperty('newRisks');
    expect(d).toHaveProperty('summary');
  });

  it('identical snapshots produce empty deltas + "no changes" summary', () => {
    const s = fixture();
    const d = deriveRegenerationDelta(s, s);
    expect(d.directEffects).toEqual([]);
    expect(d.rippleEffects).toEqual([]);
    expect(d.newEntities).toEqual([]);
    expect(d.removedEntities).toEqual([]);
    expect(d.summary[0]).toMatch(/no structural changes/i);
  });

  it('returns empty envelope for nullish input', () => {
    const d = deriveRegenerationDelta(null, fixture());
    expect(d.directEffects).toEqual([]);
    expect(d.summary).toEqual([]);
  });

  it('detects removed institution', () => {
    const before = fixture();
    const after = {
      ...before,
      institutions: before.institutions.filter(i => i.id !== 'institution.granary'),
    };
    const d = deriveRegenerationDelta(before, after);
    expect(d.removedEntities.some(e => e.id === 'institution.granary')).toBe(true);
    expect(d.brokenDependencies).toContain('institution.granary');
  });

  it('detects added institution', () => {
    const before = fixture();
    const after = {
      ...before,
      institutions: [...before.institutions, { id: 'institution.temple', name: 'Temple of Light' }],
    };
    const d = deriveRegenerationDelta(before, after);
    expect(d.newEntities.some(e => e.id === 'institution.temple')).toBe(true);
  });

  it('classifies new threats as newRisks', () => {
    const before = fixture();
    const after = { ...before, config: { monsterThreat: 'plagued' } };
    const d = deriveRegenerationDelta(before, after);
    expect(d.newRisks.some(e => e.type === 'threat')).toBe(true);
  });

  it('legitimacy drop registers in rippleEffects', () => {
    const before = fixture();
    const after = {
      ...before,
      powerStructure: {
        ...before.powerStructure,
        publicLegitimacy: { score: 25, label: 'Legitimacy Crisis' },
      },
    };
    const d = deriveRegenerationDelta(before, after);
    expect(d.rippleEffects.some(r => r.variable === 'public_legitimacy')).toBe(true);
  });

  it('preservedCanon includes entities present in both', () => {
    const before = fixture();
    const after = fixture();
    const d = deriveRegenerationDelta(before, after);
    expect(d.preservedCanon.some(e => e.id === 'institution.granary')).toBe(true);
  });

  it('does not mutate either snapshot', () => {
    const before = fixture();
    const after = fixture();
    const beforeStr = JSON.stringify(before);
    const afterStr = JSON.stringify(after);
    deriveRegenerationDelta(before, after);
    expect(JSON.stringify(before)).toBe(beforeStr);
    expect(JSON.stringify(after)).toBe(afterStr);
  });
});

describe('regenerationDeltaSize()', () => {
  it('counts changes across all layers', () => {
    const before = fixture();
    const after = {
      ...before,
      institutions: [...before.institutions, { id: 'institution.temple', name: 'Temple' }],
    };
    const d = deriveRegenerationDelta(before, after);
    expect(regenerationDeltaSize(d)).toBeGreaterThan(0);
  });

  it('returns 0 for nullish delta', () => {
    expect(regenerationDeltaSize(null)).toBe(0);
  });
});

describe('newEntitiesByType()', () => {
  it('groups new entities by type', () => {
    const before = fixture();
    const after = {
      ...before,
      institutions: [...before.institutions, { id: 'institution.temple', name: 'Temple' }],
      config: { monsterThreat: 'plagued' },
    };
    const d = deriveRegenerationDelta(before, after);
    const grouped = newEntitiesByType(d);
    expect(grouped).toHaveProperty('institution');
    expect(grouped.institution.length).toBeGreaterThan(0);
  });
});

describe('real-settlement smoke', () => {
  it('runs over two real settlements (different seeds)', () => {
    const a = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'regen-A', customContent: {} },
    );
    const b = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'regen-B', customContent: {} },
    );
    const d = deriveRegenerationDelta(a, b);
    expect(d).toBeTruthy();
    expect(Array.isArray(d.summary)).toBe(true);
  });
});
