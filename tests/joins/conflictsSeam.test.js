/**
 * Join harness — the conflicts address seam (Wave 6 #1).
 *
 * generatePopulation provides `conflicts`, and assembleSettlement wrote them
 * ONLY top-level — but four readers expect powerStructure.conflicts (aiLayer,
 * dailyLifeLogic, and the generate-narrative edge function the owner deploys
 * separately). Every prompt was conflict-blind.
 *
 * The repair is two-sided: assembleSettlement dual-writes conflicts onto
 * powerStructure, AND the in-repo readers prefer the top-level write (so
 * pre-fix saves ground correctly too). This harness pins both sides against
 * a real pipeline run.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { extractFullContext } from '../../src/generators/aiLayer.js';
import { extractSettlementContext } from '../../src/components/new/dailyLifeLogic.js';

const gen = (config, seed) =>
  generateSettlementPipeline(config, null, { seed, customContent: {} });

const BASE_CFG = {
  settType: 'town',
  culture: 'germanic',
  tradeRouteAccess: 'road',
  monsterThreat: 'frontier',
};

// Scan a fixed seed list for a settlement whose roster actually surfaced
// conflicts — otherwise "dual-written" would be indistinguishable from
// "both empty". Deterministic: fixed list, first hit wins.
const findConflictFixture = () => {
  for (const seed of ['conflicts-1', 'conflicts-2', 'conflicts-3', 'conflicts-4', 'conflicts-5']) {
    const s = gen(BASE_CFG, seed);
    if ((s.conflicts || []).length > 0) return s;
  }
  return null;
};

describe('join: conflicts live at BOTH addresses after assembly', () => {
  test('powerStructure.conflicts mirrors the top-level write', () => {
    const s = findConflictFixture();
    expect(s, 'no settlement with conflicts found in seed list').toBeTruthy();
    expect(Array.isArray(s.powerStructure?.conflicts)).toBe(true);
    expect(s.powerStructure.conflicts).toEqual(s.conflicts);
  });

  test('a conflict-free settlement still carries the (empty) dual-write', () => {
    const s = gen(BASE_CFG, 'conflicts-1');
    expect(Array.isArray(s.powerStructure?.conflicts)).toBe(true);
  });
});

describe('behavior: the prompt extractors actually see the conflicts', () => {
  test('aiLayer and dailyLifeLogic ground the same non-empty conflict list', () => {
    const s = findConflictFixture();
    expect(s).toBeTruthy();

    // The REAL conflict shape is { parties, issue, stakes, desc, … } —
    // mapping only description/type was a second layer of the same blindness.
    const expected = s.conflicts
      .slice(0, 3)
      .map(c => c.desc || c.description || c.issue || c.type)
      .filter(Boolean);
    expect(expected.length).toBeGreaterThan(0);

    expect(extractFullContext(s).conflicts).toEqual(expected);
    expect(extractSettlementContext(s).conflicts).toEqual(expected);
  });

  test('legacy saves (top-level only, no dual-write) still ground', () => {
    const s = findConflictFixture();
    expect(s).toBeTruthy();
    // Strip the dual-write to simulate a pre-fix save.
    const { conflicts: _dropped, ...psWithout } = s.powerStructure;
    const legacy = { ...s, powerStructure: psWithout };
    expect(extractFullContext(legacy).conflicts.length).toBeGreaterThan(0);
  });
});
