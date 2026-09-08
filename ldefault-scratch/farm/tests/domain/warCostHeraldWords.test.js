/**
 * warCostHeraldWords.test.js — TE-HERALD-1 cars HER-4..7, the remaining band arms.
 *
 * Four vocabularies were minted across the cost-of-war, demographic and treaty surfaces.
 * Two are cut on engine constants and two on a declared convention, and this file holds
 * them to DIFFERENT standards on purpose — because pretending a convention is a
 * calibration is the failure mode a band ladder invites:
 *
 *   attrition bleed   → `BASE_ATTACKER_LOSS` and `MAX_LOSS_FRACTION` (halved and whole),
 *       exported as `ATTRITION_BLEED_CUTS` so this file derives them instead of spelling
 *       them. The export exists because `0.2 * 3` is 0.6000000000000001 — the float
 *       boundary occupation.js's cuts already had to learn.
 *   reinforcement     → `BASE_FLOW_FRACTION` / `MAX_FLOW_FRACTION`, and `DRAIN_FLOOR`
 *       plus `DRAIN_AGE_CAP`.
 *   population        → the declared QUARTER convention. Asserted as a convention.
 *   treaty share      → the declared QUARTER/HALF convention. Same.
 *
 * ⭐ AND THE LAST DESCRIBE IS THE ONE THAT MATTERS. `draftReceipt` is driven for every
 * term type in the catalog and every receipt is checked against the census's own four
 * detector shapes — applied to the OUTPUT, not to the source. A cure that laundered a
 * float through a differently-named helper passes the source census and fails here.
 */
import { describe, expect, test } from 'vitest';

import {
  ATTRITION_BLEED_CUTS,
  ATTRITION_BLEED_WORDS,
  attritionBleedWordFor,
} from '../../src/domain/worldPulse/attrition.js';
import {
  REINFORCEMENT_DRAIN_WORDS,
  REINFORCEMENT_FLOW_WORDS,
  reinforcementDrainWordFor,
  reinforcementFlowWordFor,
} from '../../src/domain/worldPulse/reinforcement.js';
import {
  POPULATION_PRESSURE_WORDS,
  pressureWordFor,
} from '../../src/domain/worldPulse/populationDynamics.js';
import {
  TERM_SHARE_WORDS,
  draftReceipt,
  treasuryShareWords,
} from '../../src/domain/worldPulse/peaceTermsDrafting.js';
import { TERM_CATALOG } from '../../src/domain/worldPulse/peaceTermsCatalog.js';

const UNIT = Array.from({ length: 201 }, (_, i) => i / 200);
// The reinforcement flow axis is capped at MAX_FLOW_FRACTION (0.10), so it needs its own
// fine grid rather than the unit interval — a 0..1 sweep would spend 90% of its samples
// past the top rung and prove nothing about the two below it.
const FLOW = Array.from({ length: 201 }, (_, i) => (i * 0.15) / 200);
const JUNK = [-5, 5, NaN, Infinity, -Infinity, null, undefined, 'x', {}];

const LADDERS = [
  ['attrition bleed', ATTRITION_BLEED_WORDS, attritionBleedWordFor, UNIT],
  ['reinforcement flow', REINFORCEMENT_FLOW_WORDS, reinforcementFlowWordFor, FLOW],
  ['reinforcement drain', REINFORCEMENT_DRAIN_WORDS, reinforcementDrainWordFor, UNIT],
  ['population pressure', POPULATION_PRESSURE_WORDS, pressureWordFor, UNIT],
  ['treaty share', TERM_SHARE_WORDS, treasuryShareWords, UNIT],
];

describe('TE-HERALD-1 — every remaining ladder is total, closed and monotone', () => {
  test.each(LADDERS)('%s: every rung is produced across its own domain', (_n, words, fn, grid) => {
    expect([...new Set(grid.map(fn))].sort()).toEqual([...words].sort());
  });

  test.each(LADDERS)('%s: junk lands inside the vocabulary', (_n, words, fn) => {
    for (const junk of JUNK) expect(words).toContain(fn(/** @type {any} */ (junk)));
  });

  test.each(LADDERS)('%s: the ladder is monotone', (_n, words, fn, grid) => {
    const rank = (v) => words.indexOf(fn(v));
    for (let i = 1; i < grid.length; i += 1) {
      expect(rank(grid[i])).toBeGreaterThanOrEqual(rank(grid[i - 1]));
    }
  });

  test.each(LADDERS)('%s: frozen, with no duplicate rung', (_n, words) => {
    expect(Object.isFrozen(words)).toBe(true);
    expect(new Set(words).size).toBe(words.length);
  });
});

describe('TE-HERALD-1 — the attrition cuts are the ENGINE\'s, derived not transcribed', () => {
  test('the exported cuts break the ladder, from both sides of each', () => {
    expect(ATTRITION_BLEED_CUTS).toHaveLength(3);
    for (const cut of ATTRITION_BLEED_CUTS) {
      expect(attritionBleedWordFor(cut - 1e-9)).not.toBe(attritionBleedWordFor(cut));
    }
  });

  test('the cuts are ascending and the top one is the hard loss cap', () => {
    expect(ATTRITION_BLEED_CUTS[0]).toBeLessThan(ATTRITION_BLEED_CUTS[1]);
    expect(ATTRITION_BLEED_CUTS[1]).toBeLessThan(ATTRITION_BLEED_CUTS[2]);
    // The middle cut is exactly half the top one — the relationship the source claims.
    expect(ATTRITION_BLEED_CUTS[1] * 2).toBeCloseTo(ATTRITION_BLEED_CUTS[2], 12);
    // A loss AT the cap reads as the worst rung, never one below it.
    expect(attritionBleedWordFor(ATTRITION_BLEED_CUTS[2])).toBe(ATTRITION_BLEED_WORDS[3]);
  });
});

describe('TE-HERALD-1 — the two CONVENTION ladders say so, and behave like conventions', () => {
  test('population pressure breaks on plain quarters', () => {
    for (const cut of [0.25, 0.5, 0.75]) {
      expect(pressureWordFor(cut - 1e-9)).not.toBe(pressureWordFor(cut));
    }
    expect(pressureWordFor(0)).toBe(POPULATION_PRESSURE_WORDS[0]);
    expect(pressureWordFor(1)).toBe(POPULATION_PRESSURE_WORDS[3]);
  });

  test('the treaty share breaks on a quarter and a half', () => {
    for (const cut of [0.25, 0.5]) {
      expect(treasuryShareWords(cut - 1e-9)).not.toBe(treasuryShareWords(cut));
    }
    expect(treasuryShareWords(0)).toBe(TERM_SHARE_WORDS[0]);
    expect(treasuryShareWords(1)).toBe(TERM_SHARE_WORDS[2]);
  });
});

describe('TE-HERALD-1 — no two of these ladders share a rung', () => {
  test('the five vocabularies are pairwise disjoint', () => {
    const all = LADDERS.flatMap(([, words]) => [...words]);
    expect(new Set(all).size, 'two ladders share a rung — a reader cannot tell the axes apart')
      .toBe(all.length);
  });
});

describe('TE-HERALD-1 — the treaty receipts carry world words and no engine scalar', () => {
  // The census's four detector shapes, applied to the OUTPUT of the real composer.
  const SCALAR_SHAPES = [
    [/\d+\.\d{2}/, 'a two-decimal engine score'],
    [/\d\s*%/, 'a percent readout'],
    [/×\s*\d|\d\s*×/, 'a multiplier'],
    [/\b0\.\d+/, 'a bare 0..1 scalar'],
  ];
  const TYPES = Object.keys(TERM_CATALOG);

  test('the catalog is non-empty, so the sweep below is not vacuous', () => {
    expect(TYPES.length).toBeGreaterThan(5);
  });

  test.each([0, 0.1, 0.3, 0.49, 0.5, 0.9, 1])('magnitude %s: every term type stays scalar-free', (magnitude) => {
    for (const type of TYPES) {
      for (const years of [1, 3, 12]) {
        const receipt = draftReceipt(type, { good: 'iron' }, years, magnitude);
        expect(typeof receipt, `${type} produced no receipt`).toBe('string');
        for (const [shape, what] of SCALAR_SHAPES) {
          expect(shape.test(receipt), `${what} reached the reader in ${type}: ${receipt}`).toBe(false);
        }
      }
    }
  });

  test('the YEARS survive as an honest concrete count, which the ruling keeps', () => {
    // §763.2 retires the abstract share and KEEPS the honest world count beside it. Both
    // halves of that are asserted here, so a later over-cure that strips the years reds.
    const one = draftReceipt('tribute', { good: 'iron' }, 1, 0.3);
    const many = draftReceipt('tribute', { good: 'iron' }, 7, 0.3);
    expect(one).toMatch(/\b1 year\b/);
    expect(many).toMatch(/\b7 years\b/);
    expect(one).not.toBe(many);
  });

  test('the share WORD moves with the magnitude, so the receipt is not a constant', () => {
    const small = draftReceipt('tribute', { good: 'iron' }, 3, 0.05);
    const large = draftReceipt('tribute', { good: 'iron' }, 3, 0.95);
    expect(small).not.toBe(large);
    expect(small).toContain(TERM_SHARE_WORDS[0]);
    expect(large).toContain(TERM_SHARE_WORDS[2]);
  });
});
