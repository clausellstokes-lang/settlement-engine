/**
 * bandedStock.test.js — SP-A. THE ANTI-RATCHET PROPERTY, asserted ONCE over the shape.
 *
 * The family's whole claim is that a banded stock cannot become a ratchet. Fifteen
 * hand-rolled `Math.pow(0.5, age / halfLife)` sites in the tree each promise that
 * individually; this file proves it for all of them at once by proving it of the
 * function they are meant to become.
 *
 * THE PROPERTY, stated so a mutant can fail it:
 *   1. NEVER FURTHER   — the decayed value is no further from neutral than it started.
 *   2. NEVER PAST      — it never crosses to the far side of neutral.
 *   3. STRICTLY CLOSER — with any real time elapsed (>= one week, the engine's minimum
 *                        interval) and a stock off neutral, it is strictly closer.
 *   4. NO FREE DECAY   — with zero elapsed weeks it is unchanged.
 *   5. MONOTONE IN TIME— more elapsed weeks is never less decay.
 *
 * Properties 1-2 alone are satisfied by a function that never moves, which is exactly
 * the ratchet; property 3 is the one that bites, and the executed mutants below prove
 * both halves of the pair are load-bearing rather than decorative.
 *
 * ON THE DEAD-BAND LAW: it binds bands read off a scalar whose measured spectrum may
 * not reach every rung. The half-life ladder is a LOOKUP TABLE with no input scalar —
 * an instance names a rung, it is not banded into one — so there is no unreachable
 * rung to measure. What IS checked here is that the ladder is strictly ascending, that
 * every rung is a whole number of weeks on the one time base, and that the rungs are
 * derived from INTERVAL_WEEKS rather than hand-keyed. The provenance of each rung (a
 * live in-tree module that already keeps memory on that duration) is recorded in the
 * module header, measured 2026-08-04.
 */
import { describe, expect, test } from 'vitest';
import {
  HALF_LIFE_BANDS,
  HALF_LIFE_WEEKS,
  CROSSING_DIRECTIONS,
  halfLifeWeeksOf,
  decayTowardNeutral,
  crossingOf,
  bandCrossingReceipt,
} from '../../src/domain/worldPulse/bandedStock.js';
import { INTERVAL_WEEKS } from '../../src/domain/worldPulse/intervalWeeks.js';

/** A realistic grid: stock values, the neutrals instances actually relax toward, and
 *  elapsed spans from one week to a generation. Not a hostile grid — the strict form of
 *  the property is a claim about engine-scale inputs, and a denormal difference under a
 *  1e-300-week age would round to no-change in any float implementation. */
const VALUES = [0, 0.02, 0.2, 0.5, 0.8, 0.98, 1, -1, -0.35, 3.5, 42];
const NEUTRALS = [0, 0.5, 1, -0.25];
const AGES = [1, 4, 13, 52, 156, 520, 1040, 5200];

/**
 * Every way `decay` violates the anti-ratchet property over the grid.
 * @param {(v:number,n:number,a:number,b:string)=>number} decay
 * @returns {string[]}
 */
function antiRatchetViolations(decay) {
  /** @type {string[]} */
  const out = [];
  for (const band of HALF_LIFE_BANDS) {
    for (const n of NEUTRALS) {
      for (const v of VALUES) {
        const at0 = decay(v, n, 0, band);
        if (at0 !== v) out.push(`no-free-decay: ${band} v=${v} n=${n} age=0 -> ${at0}`);
        let priorGap = Math.abs(v - n);
        for (const age of AGES) {
          const r = decay(v, n, age, band);
          const gap = Math.abs(r - n);
          if (!(gap <= Math.abs(v - n))) out.push(`never-further: ${band} v=${v} n=${n} age=${age} -> ${r}`);
          if ((r - n) * (v - n) < 0) out.push(`never-past: ${band} v=${v} n=${n} age=${age} -> ${r}`);
          if (v !== n && !(gap < Math.abs(v - n))) out.push(`strictly-closer: ${band} v=${v} n=${n} age=${age} -> ${r}`);
          if (gap > priorGap) out.push(`monotone: ${band} v=${v} n=${n} age=${age} -> ${r}`);
          priorGap = gap;
        }
      }
    }
  }
  return out;
}

describe('bandedStock — the shared half-life ladder', () => {
  test('the ladder is ascending, distinct, and DERIVED from the one time base', () => {
    expect(HALF_LIFE_BANDS.length).toBe(5);
    expect(new Set(HALF_LIFE_BANDS).size).toBe(HALF_LIFE_BANDS.length);
    const weeks = HALF_LIFE_BANDS.map((b) => HALF_LIFE_WEEKS[b]);
    expect(weeks).toEqual([...weeks].sort((a, b) => a - b));
    for (const w of weeks) expect(Number.isInteger(w) && w >= INTERVAL_WEEKS.one_week).toBe(true);
    // The derivation, pinned from BOTH sides: the identities that make the ladder a
    // function of INTERVAL_WEEKS, and the absolute week counts those identities produce
    // today. A change to the time base reds the second half and is a disclosed shift.
    expect(HALF_LIFE_WEEKS.a_season).toBe(INTERVAL_WEEKS.one_season);
    expect(HALF_LIFE_WEEKS.a_year).toBe(INTERVAL_WEEKS.one_year);
    expect(HALF_LIFE_WEEKS.a_few_years).toBe(3 * INTERVAL_WEEKS.one_year);
    expect(HALF_LIFE_WEEKS.a_decade).toBe(10 * INTERVAL_WEEKS.one_year);
    expect(HALF_LIFE_WEEKS.a_generation).toBe(20 * INTERVAL_WEEKS.one_year);
    expect(weeks).toEqual([13, 52, 156, 520, 1040]);
  });

  test('an unknown band THROWS rather than falling back to a rate nobody chose', () => {
    expect(() => halfLifeWeeksOf('a_fortnight')).toThrow(/unknown half-life band/);
    expect(() => decayTowardNeutral(1, 0, 52, 'forever')).toThrow(/unknown half-life band/);
    // The throw is the whole point, so prove the same call shape SUCCEEDS on a real rung
    // (a guard that only ever throws would pass having proved the function unusable).
    expect(halfLifeWeeksOf('a_year')).toBe(52);
  });

  test('one half-life halves the distance to neutral, on every rung', () => {
    for (const band of HALF_LIFE_BANDS) {
      const h = halfLifeWeeksOf(band);
      expect(decayTowardNeutral(1, 0, h, band)).toBeCloseTo(0.5, 12);
      expect(decayTowardNeutral(0, 1, h, band)).toBeCloseTo(0.5, 12);
      expect(decayTowardNeutral(0.8, 0.5, 2 * h, band)).toBeCloseTo(0.575, 12);
    }
  });

  test('negative elapsed time does not un-decay a stock', () => {
    expect(decayTowardNeutral(0.9, 0.5, -520, 'a_year')).toBe(0.9);
  });

  test('non-finite inputs THROW rather than poisoning a ledger with NaN', () => {
    expect(() => decayTowardNeutral(Number.NaN, 0, 52, 'a_year')).toThrow(/finite numbers/);
    expect(() => decayTowardNeutral(1, Number.POSITIVE_INFINITY, 52, 'a_year')).toThrow(/finite numbers/);
    expect(() => decayTowardNeutral(1, 0, Number.NaN, 'a_year')).toThrow(/finite numbers/);
  });
});

describe('bandedStock — THE ANTI-RATCHET GUARANTEE (asserted once, over the shape)', () => {
  test('the real decay shape violates the property nowhere on the grid', () => {
    expect(antiRatchetViolations(decayTowardNeutral)).toEqual([]);
  });

  test('the grid is a real denominator (guard the guard)', () => {
    // A property predicate that examined nothing would return [] for every mutant too.
    expect(VALUES.length * NEUTRALS.length * AGES.length * HALF_LIFE_BANDS.length).toBeGreaterThan(1500);
  });

  test('MUTANT — a stock that never decays IS caught (the ratchet)', () => {
    const ratchet = (value) => value;
    const violations = antiRatchetViolations(ratchet);
    expect(violations.length).toBeGreaterThan(0);
    // The ratchet satisfies never-further, never-past and monotone; it is STRICTLY-CLOSER
    // that has to bite, so the mutant is proven to fail for the right reason.
    expect(violations.every((v) => v.startsWith('strictly-closer'))).toBe(true);
  });

  test('MUTANT — a stock that overshoots neutral IS caught', () => {
    const overshoot = (value, neutral, ageWeeks, band) => neutral
      - (value - neutral) * Math.pow(0.5, Math.max(0, ageWeeks) / halfLifeWeeksOf(band));
    const violations = antiRatchetViolations(overshoot);
    expect(violations.some((v) => v.startsWith('never-past'))).toBe(true);
    expect(violations.some((v) => v.startsWith('no-free-decay'))).toBe(true);
  });

  test('MUTANT — a stock that decays AWAY from neutral IS caught', () => {
    const runaway = (value, neutral, ageWeeks, band) => neutral
      + (value - neutral) * Math.pow(2, Math.max(0, ageWeeks) / halfLifeWeeksOf(band));
    expect(antiRatchetViolations(runaway).some((v) => v.startsWith('never-further'))).toBe(true);
  });
});

describe('bandedStock — the ONE crossing-receipt grammar', () => {
  const LADDER = Object.freeze(['restrained', 'measured', 'settled', 'marked', 'dominant']);

  test('a crossing reports its direction; a non-crossing reports null', () => {
    expect(crossingOf(LADDER, 'settled', 'marked')).toEqual({ from: 'settled', to: 'marked', direction: 'rose' });
    expect(crossingOf(LADDER, 'marked', 'measured')).toEqual({ from: 'marked', to: 'measured', direction: 'fell' });
    expect(crossingOf(LADDER, 'settled', 'settled')).toBeNull();
    expect(CROSSING_DIRECTIONS).toEqual(['rose', 'fell']);
  });

  test('a receipt carries band WORDS, a direction, a cause and a tick — and nothing else', () => {
    const receipt = bandCrossingReceipt({
      stockKind: 'martial_appetite',
      ladder: LADDER,
      from: 'measured',
      to: 'settled',
      cause: 'war_resolution',
      tick: 481,
    });
    expect(receipt).toEqual({
      stockKind: 'martial_appetite',
      from: 'measured',
      to: 'settled',
      direction: 'rose',
      cause: 'war_resolution',
      tick: 481,
    });
    expect(Object.isFrozen(receipt)).toBe(true);
  });

  test('L5 IS STRUCTURAL: no float can enter the grammar', () => {
    const base = { stockKind: 'temple_wealth', ladder: LADDER, from: 'measured', to: 'settled', cause: 'tithe_drawn' };
    // The same call with an integer tick SUCCEEDS four lines below, so these throws
    // measure the refusal rather than a call shape that never worked.
    expect(() => bandCrossingReceipt({ ...base, tick: 12.5 })).toThrow(/non-negative integer/);
    expect(() => bandCrossingReceipt({ ...base, tick: -1 })).toThrow(/non-negative integer/);
    expect(() => bandCrossingReceipt({ ...base, tick: '12' })).toThrow(/non-negative integer/);
    expect(bandCrossingReceipt({ ...base, tick: 12 }).tick).toBe(12);
    // A band word that is really a number, and a cause that is really a sentence.
    expect(() => bandCrossingReceipt({ ...base, to: '0.62', tick: 12 })).toThrow(/word token/);
    expect(() => bandCrossingReceipt({ ...base, cause: 'the war ended badly', tick: 12 })).toThrow(/word token/);
  });

  test('a receipt for a non-event is REFUSED (a feed that reports nothing becomes wallpaper)', () => {
    expect(() => bandCrossingReceipt({
      stockKind: 'house_credit', ladder: LADDER, from: 'settled', to: 'settled', cause: 'venture_failed', tick: 9,
    })).toThrow(/did not cross/);
  });

  test('a ladder that parsed to nothing THROWS rather than making every check vacuous', () => {
    expect(() => crossingOf([], 'a', 'b')).toThrow(/at least two rungs/);
    expect(() => crossingOf(['solo'], 'solo', 'solo')).toThrow(/at least two rungs/);
    expect(() => crossingOf(['a', 'a'], 'a', 'a')).toThrow(/may not repeat a rung/);
    expect(() => crossingOf(LADDER, 'settled', 'imperial')).toThrow(/is not a rung of/);
  });
});
