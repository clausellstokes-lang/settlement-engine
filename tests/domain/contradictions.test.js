/**
 * tests/domain/contradictions.test.js — Tier 4.18.
 *
 * One detector test each + envelope shape + smoke.
 */

import { describe, it, expect } from 'vitest';
import {
  CONTRADICTION_CLASSIFICATIONS,
  CONTRADICTION_TYPES,
  detectContradictions,
  contradictionBreakdown,
  supportedContradictionTypes,
  supportedClassifications,
} from '../../src/domain/contradictions.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

describe('catalog', () => {
  it('classifications + types are frozen and canonical', () => {
    expect(Object.isFrozen(CONTRADICTION_CLASSIFICATIONS)).toBe(true);
    expect(Object.isFrozen(CONTRADICTION_TYPES)).toBe(true);
    expect(CONTRADICTION_CLASSIFICATIONS).toEqual([
      'invalid', 'rare_but_justified', 'interesting_tension', 'user_authored_exception',
    ]);
    expect(supportedContradictionTypes()).toEqual([...CONTRADICTION_TYPES]);
    expect(supportedClassifications()).toEqual([...CONTRADICTION_CLASSIFICATIONS]);
  });
});

describe('contradiction shape', () => {
  it('every contradiction has the canonical fields', () => {
    const s = {
      tier: 'village',
      institutions: [{ id: 'institution.cathedral', name: 'Grand Cathedral' }],
      powerStructure: { factions: [] },
    };
    const list = detectContradictions(s);
    expect(list.length).toBeGreaterThan(0);
    for (const c of list) {
      expect(typeof c.id).toBe('string');
      expect(CONTRADICTION_TYPES).toContain(c.type);
      expect(CONTRADICTION_CLASSIFICATIONS).toContain(c.classification);
      expect(typeof c.description).toBe('string');
      expect(typeof c.explanation).toBe('string');
      expect(Array.isArray(c.consequences)).toBe(true);
      expect(Array.isArray(c.references)).toBe(true);
    }
  });
});

// ── Detectors ──────────────────────────────────────────────────────────

describe('oversized_institution_for_tier', () => {
  it('village with cathedral triggers an interesting_tension', () => {
    const list = detectContradictions({
      tier: 'village',
      institutions: [{ name: 'Grand Cathedral' }],
      powerStructure: { factions: [] },
    });
    const found = list.find(c => c.type === 'oversized_institution_for_tier');
    expect(found).toBeTruthy();
    expect(found.classification).toBe('interesting_tension');
    expect(found.references.some(r => r.label === 'Grand Cathedral')).toBe(true);
  });

  it('city with cathedral does NOT trigger', () => {
    const list = detectContradictions({
      tier: 'city',
      institutions: [{ name: 'Grand Cathedral' }],
      powerStructure: { factions: [] },
    });
    expect(list.find(c => c.type === 'oversized_institution_for_tier')).toBeUndefined();
  });
});

describe('missing_enforcement_for_tier', () => {
  it('town without watch triggers rare_but_justified', () => {
    const list = detectContradictions({
      tier: 'town',
      institutions: [{ name: 'Granary' }],
      powerStructure: { factions: [] },
    });
    const found = list.find(c => c.type === 'missing_enforcement_for_tier');
    expect(found).toBeTruthy();
    expect(found.classification).toBe('rare_but_justified');
  });

  it('town WITH watch does NOT trigger', () => {
    const list = detectContradictions({
      tier: 'town',
      institutions: [{ name: 'Town Watch' }],
      powerStructure: { factions: [] },
    });
    expect(list.find(c => c.type === 'missing_enforcement_for_tier')).toBeUndefined();
  });
});

describe('legitimacy_vs_crime_mismatch', () => {
  it('high legitimacy + dominant thieves guild triggers', () => {
    const list = detectContradictions({
      tier: 'city',
      institutions: [{ name: 'Town Watch' }],
      powerStructure: {
        publicLegitimacy: { score: 80, label: 'Endorsed' },
        factions: [{ faction: "Thieves' Guild", power: 80 }],
      },
    });
    expect(list.some(c => c.type === 'legitimacy_vs_crime_mismatch')).toBe(true);
  });
});

describe('orphaned_faction_power', () => {
  it('high religious power without temple triggers rare_but_justified', () => {
    const list = detectContradictions({
      tier: 'town',
      institutions: [{ name: 'Town Watch' }, { name: 'Granary' }],
      powerStructure: {
        factions: [{ faction: 'Religious Authorities', power: 50 }],
      },
    });
    const found = list.find(c => c.type === 'orphaned_faction_power');
    expect(found).toBeTruthy();
    expect(found.classification).toBe('rare_but_justified');
  });

  it('religious faction WITH temple does NOT trigger', () => {
    const list = detectContradictions({
      tier: 'town',
      institutions: [{ name: 'Town Watch' }, { name: 'Temple of Light' }],
      powerStructure: {
        factions: [{ faction: 'Religious Authorities', power: 50 }],
      },
    });
    expect(list.find(c => c.type === 'orphaned_faction_power')).toBeUndefined();
  });
});

describe('threat_without_response', () => {
  it('plagued monster threat with no defense triggers', () => {
    const list = detectContradictions({
      tier: 'town',
      institutions: [],
      config: { monsterThreat: 'plagued' },
      powerStructure: { factions: [] },
    });
    expect(list.some(c => c.type === 'threat_without_response')).toBe(true);
  });
});

// ── Diagnostic ─────────────────────────────────────────────────────────

describe('contradictionBreakdown()', () => {
  it('returns counts that sum to the detected total', () => {
    const s = {
      tier: 'village',
      institutions: [{ name: 'Grand Cathedral' }],
      powerStructure: { factions: [] },
    };
    const total = detectContradictions(s).length;
    const breakdown = contradictionBreakdown(s);
    const sum = Object.values(breakdown).reduce((a, b) => a + b, 0);
    expect(sum).toBe(total);
  });
});

// ── Pure + smoke ───────────────────────────────────────────────────────

describe('purity + real-settlement smoke', () => {
  it('does not mutate the input settlement', () => {
    const s = {
      tier: 'village',
      institutions: [{ name: 'Grand Cathedral' }],
      powerStructure: { factions: [] },
    };
    const before = JSON.stringify(s);
    detectContradictions(s);
    expect(JSON.stringify(s)).toBe(before);
  });

  it('runs over a real city without throwing', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'contradictions-real-city', customContent: {} },
    );
    const list = detectContradictions(settlement);
    expect(Array.isArray(list)).toBe(true);
    for (const c of list) {
      expect(CONTRADICTION_TYPES).toContain(c.type);
      expect(CONTRADICTION_CLASSIFICATIONS).toContain(c.classification);
    }
  });

  it('returns [] for nullish settlement', () => {
    expect(detectContradictions(null)).toEqual([]);
  });
});
