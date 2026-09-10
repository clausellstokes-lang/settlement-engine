/**
 * occupationHeraldWords.test.js — TE-HERALD-1 car HER-2, the occupation band arms.
 *
 * Three vocabularies replace seven scalar readouts on the occupation surface, and each
 * one's cuts are the FILE'S OWN CONSTANTS rather than numbers chosen to look calibrated:
 *
 *   resistance → whole multiples of `RESISTANCE_CONDITION_FLOOR`, the single named
 *       landmark on that axis (below it nothing is surfaced at all).
 *   burden     → halves of `PER_OCCUPATION_BURDEN_CAP`, which is the meaningful UNIT
 *       here: what one occupation can cost at its worst. The word therefore says how
 *       many occupations' worth of cost the holder carries.
 *   yield      → `PER_OCCUPATION_BENEFIT_CAP` and `OCCUPIER_BENEFIT_CONTAINMENT`, so the
 *       top rung names the anti-snowball ceiling in words. That ceiling is the whole
 *       point of the retired sentence's "HARD-CAPPED at 0.9".
 *
 * The claim under test is not "the constants match" — it is that each ladder is TOTAL
 * over its domain, never leaves its vocabulary (including on junk), is monotone, and
 * breaks at exactly the constant it claims to break at, asserted from BOTH sides.
 */
import { describe, expect, test } from 'vitest';

import {
  OCCUPATION_BURDEN_WORDS,
  OCCUPATION_RESISTANCE_CUTS,
  OCCUPATION_RESISTANCE_WORDS,
  OCCUPATION_YIELD_WORDS,
  occupationBurdenWordFor,
  occupationYieldWordFor,
  resistanceWordFor,
} from '../../src/domain/worldPulse/occupation.js';

const GRID = Array.from({ length: 201 }, (_, i) => i / 200);
const JUNK = [-5, 5, NaN, Infinity, -Infinity, null, undefined, 'x', {}];

const LADDERS = [
  ['resistance', OCCUPATION_RESISTANCE_WORDS, resistanceWordFor],
  ['burden', OCCUPATION_BURDEN_WORDS, occupationBurdenWordFor],
  ['yield', OCCUPATION_YIELD_WORDS, occupationYieldWordFor],
];

describe('TE-HERALD-1 — the occupation ladders are total and closed', () => {
  test.each(LADDERS)('%s: every rung is produced across the domain', (_name, words, fn) => {
    expect([...new Set(GRID.map(fn))].sort()).toEqual([...words].sort());
  });

  test.each(LADDERS)('%s: junk still lands inside the vocabulary', (_name, words, fn) => {
    for (const junk of JUNK) expect(words).toContain(fn(/** @type {any} */ (junk)));
  });

  test.each(LADDERS)('%s: the ladder is monotone', (_name, words, fn) => {
    const rank = (v) => words.indexOf(fn(v));
    for (let i = 1; i < GRID.length; i += 1) {
      expect(rank(GRID[i])).toBeGreaterThanOrEqual(rank(GRID[i - 1]));
    }
  });

  test.each(LADDERS)('%s: the vocabulary is frozen and has no duplicate rung', (_name, words) => {
    expect(Object.isFrozen(words)).toBe(true);
    expect(new Set(words).size).toBe(words.length);
  });
});

describe('TE-HERALD-1 — the occupation words break where the CONSTANTS break', () => {
  // The cuts are IMPORTED FROM SOURCE, never transcribed — and that is not pedantry
  // here, it is the bug this arm found: `0.2 * 3` is 0.6000000000000001, so a test that
  // spelled `0.6` was checking a different number than the source used, and the third
  // rung looked unreachable. The source now computes the cuts once and exports them.
  test.each(OCCUPATION_RESISTANCE_CUTS.map((cut, i) => [i, cut]))(
    'resistance changes word at floor multiple %i (%s)', (_i, cut) => {
      expect(resistanceWordFor(cut - 1e-9)).not.toBe(resistanceWordFor(cut));
    },
  );

  test('the cuts really are whole multiples of the one named floor', () => {
    expect(OCCUPATION_RESISTANCE_CUTS).toHaveLength(3);
    expect(OCCUPATION_RESISTANCE_CUTS[1]).toBeCloseTo(OCCUPATION_RESISTANCE_CUTS[0] * 2, 12);
    expect(OCCUPATION_RESISTANCE_CUTS[2]).toBeCloseTo(OCCUPATION_RESISTANCE_CUTS[0] * 3, 12);
  });

  // PER_OCCUPATION_BURDEN_CAP 0.6 — half of it, and all of it.
  test.each([0.3, 0.6])('burden changes word at %s', (cut) => {
    expect(occupationBurdenWordFor(cut - 1e-9)).not.toBe(occupationBurdenWordFor(cut));
  });

  // PER_OCCUPATION_BENEFIT_CAP 0.45 and OCCUPIER_BENEFIT_CONTAINMENT 0.9.
  test.each([0.45, 0.9])('yield changes word at %s', (cut) => {
    expect(occupationYieldWordFor(cut - 1e-9)).not.toBe(occupationYieldWordFor(cut));
  });

  test('a resistance below the surfacing floor reads as the quietest rung', () => {
    // The floor is the one place where the ladder and the ENGINE agree by construction:
    // below it no resistance condition is minted at all, so the word must be the quiet one.
    expect(resistanceWordFor(0)).toBe(OCCUPATION_RESISTANCE_WORDS[0]);
    expect(resistanceWordFor(0.199)).toBe(OCCUPATION_RESISTANCE_WORDS[0]);
    expect(resistanceWordFor(0.2)).not.toBe(OCCUPATION_RESISTANCE_WORDS[0]);
  });

  test('a yield AT the containment cap reads as the ceiling rung, not below it', () => {
    // The anti-snowball ceiling is a real world fact and the top rung exists to say it.
    expect(occupationYieldWordFor(0.9)).toBe(OCCUPATION_YIELD_WORDS[2]);
    expect(occupationYieldWordFor(1)).toBe(OCCUPATION_YIELD_WORDS[2]);
  });
});

describe('TE-HERALD-1 — no occupation ladder shares a rung with another', () => {
  test('the three vocabularies are disjoint', () => {
    const all = [...OCCUPATION_RESISTANCE_WORDS, ...OCCUPATION_BURDEN_WORDS, ...OCCUPATION_YIELD_WORDS];
    expect(new Set(all).size, 'two occupation ladders share a rung — a reader cannot tell the axes apart')
      .toBe(all.length);
  });
});
