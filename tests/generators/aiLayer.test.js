/**
 * aiLayer flattenServices — regression for the AI narrative crash
 * "(s.availableServices || []).slice is not a function".
 *
 * availableServices is generated as a category-keyed OBJECT
 * ({ lodging:[], food:[], … }), so `|| []` never kicked in and an object has
 * no `.slice`. flattenServices normalizes object/array/empty into one list.
 */

import { describe, test, expect } from 'vitest';
import {
  flattenServices,
  extractFullContext,
  buildAiLayerPrompt,
  isOrderedStability,
  formatStability,
  runAiLayer,
} from '../../src/generators/aiLayer.js';

describe('flattenServices (AI context normalizer)', () => {
  test('flattens the category-keyed object shape into one list', () => {
    const services = {
      lodging: [{ name: 'The Gilded Rest' }],
      food: [{ name: 'Bakehouse' }, { name: 'Alehouse' }],
      magic: [],
    };
    expect(flattenServices(services).map(s => s.name)).toEqual([
      'The Gilded Rest', 'Bakehouse', 'Alehouse',
    ]);
  });

  test('passes a plain array through unchanged', () => {
    const arr = [{ name: 'A' }, { name: 'B' }];
    expect(flattenServices(arr)).toBe(arr);
  });

  test('returns [] for null / undefined / non-object', () => {
    expect(flattenServices(null)).toEqual([]);
    expect(flattenServices(undefined)).toEqual([]);
    expect(flattenServices(42)).toEqual([]);
  });

  test('the result is always sliceable (the actual crash guard)', () => {
    // An object used to reach .slice directly and throw.
    expect(() => flattenServices({ lodging: [{ name: 'X' }] }).slice(0, 8)).not.toThrow();
    expect(() => flattenServices(null).slice(0, 8)).not.toThrow();
    expect(flattenServices({ a: [{ name: 'X' }], b: [{ name: 'Y' }] }).slice(0, 1)).toEqual([{ name: 'X' }]);
  });
});

// ── Grounding-truth regressions ──────────────────────────────────────────────
// powerStructure.stability is a LABEL ('Stable (theocratic governance)', …),
// not a 0-100 number; foodBalance.surplus is an absolute lb/day quantity, not
// a percent; crimeTypes entries are { type, desc } objects. Each used to be
// rendered as if it were the other shape.

const baseSettlement = (overrides = {}) => ({
  name: 'Testford',
  tier: 'village',
  population: 400,
  config: {},
  economicState: {},
  institutions: [],
  npcs: [],
  ...overrides,
});

describe('stability label handling (no more "Tense (external threat)/100")', () => {
  test('isOrderedStability branches on the label vocabulary, not >= 60', () => {
    expect(isOrderedStability('Stable')).toBe(true);
    expect(isOrderedStability('Stable (theocratic governance)')).toBe(true);
    expect(isOrderedStability('Ordered (strong military presence)')).toBe(true);
    expect(isOrderedStability('Enforced Order (authoritarian)')).toBe(true);
    expect(isOrderedStability('Rigid (militant theocracy)')).toBe(true);
    expect(isOrderedStability('Tense (external threat)')).toBe(false);
    expect(isOrderedStability('Unstable — criminal governance')).toBe(false);
    expect(isOrderedStability('Fractured — no stable governing authority')).toBe(false);
    expect(isOrderedStability(null)).toBe(false);
  });

  test('numeric stability (older saves) keeps the >= 60 threshold', () => {
    expect(isOrderedStability(72)).toBe(true);
    expect(isOrderedStability(40)).toBe(false);
  });

  test('the prompt renders the label verbatim — never label/100', () => {
    const ctx = extractFullContext(baseSettlement({
      powerStructure: { stability: 'Stable (theocratic governance)', factions: [] },
    }));
    const prompt = buildAiLayerPrompt(ctx);
    expect(prompt).toContain('Political stability: Stable (theocratic governance)');
    expect(prompt).not.toContain('Stable (theocratic governance)/100');
  });

  test('numeric stability still renders as n/100 in the prompt', () => {
    const prompt = buildAiLayerPrompt(extractFullContext(baseSettlement({
      powerStructure: { stability: 62, factions: [] },
    })));
    expect(prompt).toContain('Political stability: 62/100');
  });

  test('formatStability falls back to "unrecorded" when absent', () => {
    expect(formatStability(null)).toBe('unrecorded');
  });

  test('power note: a Stable theocracy reads procedural, a Tense fixture reads contested', async () => {
    const stable = await runAiLayer(baseSettlement({
      powerStructure: { stability: 'Stable (theocratic governance)', factions: [] },
    }));
    expect(stable.narrativeNotes.power).toContain("Stability of 'Stable (theocratic governance)'");
    expect(stable.narrativeNotes.power).toContain('recognizable and procedural');

    const tense = await runAiLayer(baseSettlement({
      powerStructure: { stability: 'Tense (external threat)', factions: [] },
    }));
    expect(tense.narrativeNotes.power).toContain("Stability of 'Tense (external threat)'");
    expect(tense.narrativeNotes.power).toContain('personal, contested, and frequently renegotiated');
  });
});

describe('food situation (surplus is lb/day, not a percent)', () => {
  test('surplus renders as a percent of daily need', () => {
    const ctx = extractFullContext(baseSettlement({
      economicViability: { metrics: { foodBalance: { dailyNeed: 1000, dailyProduction: 1400, surplus: 400, deficit: 0 } } },
    }));
    expect(ctx.foodSituation).toBe('40% food surplus');
  });

  test('surplus without a known dailyNeed falls back to the absolute quantity', () => {
    const ctx = extractFullContext(baseSettlement({
      economicViability: { metrics: { foodBalance: { surplus: 84120, deficit: 0 } } },
    }));
    expect(ctx.foodSituation).toBe('food surplus of 84120 lb/day');
  });

  test('deficit keeps the real deficitPercent and attributes imports/magic coverage', () => {
    const ctx = extractFullContext(baseSettlement({
      economicViability: { metrics: { foodBalance: {
        dailyNeed: 1000, dailyProduction: 600, deficit: 100, deficitPercent: 10,
        importCoverage: 200, magicFoodOffset: 100, rawDeficit: 400,
      } } },
    }));
    expect(ctx.foodSituation).toBe('10% food deficit (imports/magic cover 300 lb/day)');
  });

  test('mundane-only coverage never claims magic', () => {
    const ctx = extractFullContext(baseSettlement({
      economicViability: { metrics: { foodBalance: {
        dailyNeed: 1000, dailyProduction: 600, deficit: 200, deficitPercent: 20,
        importCoverage: 200, rawDeficit: 400,
      } } },
    }));
    expect(ctx.foodSituation).toBe('20% food deficit (imports cover 200 lb/day)');
  });

  test('missing ledger stays neutral', () => {
    expect(extractFullContext(baseSettlement()).foodSituation).toBe('food situation unrecorded');
  });
});

describe('crimeTypes (objects joined by .type, not [object Object])', () => {
  test('extraction maps { type, desc } entries to their type', () => {
    const ctx = extractFullContext(baseSettlement({
      economicState: { safetyProfile: { crimeTypes: [
        { type: 'Smuggling', desc: 'x' },
        { type: 'Survival crime', desc: 'y' },
      ] } },
    }));
    expect(ctx.crimeTypes).toEqual(['Smuggling', 'Survival crime']);
  });

  test('the prompt joins crime types legibly', () => {
    const prompt = buildAiLayerPrompt(extractFullContext(baseSettlement({
      economicState: { safetyProfile: { crimeTypes: [
        { type: 'Smuggling', desc: 'x' },
        { type: 'Street gang activity', desc: 'y' },
      ] } },
    })));
    expect(prompt).toContain('Crime types: Smuggling, Street gang activity');
    expect(prompt).not.toContain('[object Object]');
  });

  test('legacy plain-string entries pass through', () => {
    const ctx = extractFullContext(baseSettlement({
      economicState: { safetyProfile: { crimeTypes: ['Smuggling'] } },
    }));
    expect(ctx.crimeTypes).toEqual(['Smuggling']);
  });
});
