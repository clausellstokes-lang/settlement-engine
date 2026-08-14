/**
 * habitCurve.test.js — HB-0's curve battery, and the wave's DORMANCY EVIDENCE.
 *
 * ⭐⭐ THE LAW UNDER TEST IS THE PAIRWISE ODDS RATIO (J-HB-18), and the per-probability
 * spelling it replaced is FALSE. Under a renormalized post-softmax load,
 * `p'_i / p_i` equals the factor over the probability-weighted MEAN factor, and that
 * quantity ranges over the full pair interval — it is ATTAINED whenever one candidate
 * sits near the cap and the rest near the floor, which is precisely the state a
 * conditioned court produces. A pin on it would red on the design's own intended state.
 * The pairwise form is true by construction because the renormalizer cancels out of a
 * ratio of ratios, leaving exactly the factor ratio; what is worth testing is therefore
 * not that it holds but that the observed range FILLS the interval, because a bound
 * nothing ever approaches is a bound nobody has tested.
 *
 * The reachable factor interval is OPEN, and that is structural rather than clamped: the
 * update moves a fraction of the remaining distance to the bound, so from any integer
 * stock the next rounded stock stops one unit short of the bound and stays there.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  HABIT_TUNING,
  LAW_WORD_VOLATILITY,
  applyCredit,
  habitFactor,
  halfLifeBandFor,
  learnRateFor,
  roundToUnits,
  seatAdjusted,
  severityWeightOf,
} from '../../src/domain/worldPulse/habit/habitCurve.js';
import { HALF_LIFE_BANDS } from '../../src/domain/worldPulse/bandedStock.js';
import { SEVERITY_LADDER } from '../../src/domain/worldPulse/bandFamilies.js';
import { LAW_WORDS } from '../../src/domain/worldPulse/lawWord.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const S = HABIT_TUNING.HABIT_SPAN;
const HABIT_DIR = 'src/domain/worldPulse/habit';
const CURVE_HOME = `${HABIT_DIR}/habitCurve.js`;
const NEW_LEAVES = Object.freeze([`${HABIT_DIR}/habitVocabulary.js`, CURVE_HOME]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|jsx)$/.test(p)) out.push(p);
  }
  return out;
}

const SRC_FILES = walk(join(ROOT, 'src'))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }))
  .sort((a, b) => (a.rel < b.rel ? -1 : 1));

/** A deterministic sequence — the battery may not take a PRNG. */
function lcg(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/** Every stock the credit fold can actually reach from neutral, in either direction. */
function reachableStocks() {
  const seen = new Set();
  for (const lawWord of LAW_WORD_VOLATILITY) {
    for (const rung of SEVERITY_LADDER) {
      for (const direction of [1, -1]) {
        let stock = HABIT_TUNING.NEUTRAL_I;
        for (let step = 0; step < 200; step += 1) {
          stock = applyCredit({ stock, lawWord, outcomeRung: rung, direction });
          seen.add(stock);
        }
      }
    }
  }
  return [...seen].sort((a, b) => a - b);
}

const REACHABLE = reachableStocks();

describe('HB-0 — the frozen curve, its fences, and the wave dormancy evidence', () => {
  test('an absent stock returns EXACTLY the number one, the door a dark flag goes through', () => {
    expect(Object.is(habitFactor(null), 1)).toBe(true);
    expect(Object.is(habitFactor(undefined), 1)).toBe(true);
    expect(Object.is(habitFactor(Number.NaN), 1)).toBe(true);
    expect(Object.is(habitFactor(HABIT_TUNING.NEUTRAL_I), 1)).toBe(true);
  });

  test('the factor stays STRICTLY inside the span over every reachable stock', () => {
    expect(REACHABLE.length).toBeGreaterThan(20);
    for (const stock of REACHABLE) {
      const factor = habitFactor(stock);
      expect(factor).toBeGreaterThan(1 - S);
      expect(factor).toBeLessThan(1 + S);
    }
    // The bound is asymptotic rather than clamped: the extremes stop one unit short.
    expect(REACHABLE[0]).toBeGreaterThan(HABIT_TUNING.FLOOR_I);
    expect(REACHABLE[REACHABLE.length - 1]).toBeLessThan(HABIT_TUNING.CAP_I);
  });

  test('the PAIRWISE ODDS RATIO law holds over a thousand renormalized states', () => {
    const random = lcg(20260814);
    const lo = (1 - S) / (1 + S);
    const hi = (1 + S) / (1 - S);
    let cases = 0;
    for (let trial = 0; trial < 1000; trial += 1) {
      const n = 2 + Math.floor(random() * 9);
      const raw = Array.from({ length: n }, () => 0.05 + random() * 0.95);
      const total = raw.reduce((sum, v) => sum + v, 0);
      const p = raw.map((v) => v / total);
      const f = Array.from({ length: n }, () => habitFactor(
        REACHABLE[Math.floor(random() * REACHABLE.length)],
      ));
      const z = p.reduce((sum, v, i) => sum + v * f[i], 0);
      const next = p.map((v, i) => (v * f[i]) / z);
      for (let i = 0; i < n; i += 1) {
        expect(next[i]).toBeGreaterThan(0);
        expect(next[i]).toBeLessThan(1);
        for (let j = 0; j < n; j += 1) {
          if (i === j) continue;
          const ratio = (next[i] / next[j]) / (p[i] / p[j]);
          expect(ratio).toBeGreaterThanOrEqual(lo - 1e-12);
          expect(ratio).toBeLessThanOrEqual(hi + 1e-12);
          cases += 1;
        }
      }
    }
    expect(cases).toBeGreaterThan(1000);
  });

  test('the observed odds-ratio range FILLS the analytic interval', () => {
    // A bound nothing ever approaches is a bound nobody has tested. The extreme pair is
    // one candidate at the reachable cap against one at the reachable floor.
    const factors = REACHABLE.map((stock) => habitFactor(stock));
    const widest = Math.max(...factors) / Math.min(...factors);
    const analytic = (1 + S) / (1 - S);
    expect(widest).toBeLessThanOrEqual(analytic);
    expect(widest / analytic).toBeGreaterThan(0.999);
    expect((1 / widest) / ((1 - S) / (1 + S))).toBeLessThan(1.001);
  });

  test('the tilt floor and cap are EQUIDISTANT from neutral', () => {
    expect(
      HABIT_TUNING.NEUTRAL_I - HABIT_TUNING.FLOOR_I,
      'the floor and the cap are no longer equidistant from neutral. Moving one without'
      + ' the other makes reinforcement and decay DIFFERENT-SIZED instruments — a'
      + ' behaviour change wearing a dial\'s clothing, not a tuning edit',
    ).toBe(HABIT_TUNING.CAP_I - HABIT_TUNING.NEUTRAL_I);
    expect(habitFactor(HABIT_TUNING.CAP_I) - 1).toBeCloseTo(1 - habitFactor(HABIT_TUNING.FLOOR_I), 12);
  });

  test('the fold moves exactly the weighted share of the remaining distance, and the tuning rides the shared ladders', () => {
    // ⚠ MONOTONE IN THE WEIGHT, NOT IN THE RUNG. The weight table is deliberately NOT
    // monotone — an outcome so total that it teaches about the war rather than the sortie
    // grades lower than the rung beneath it — so what is asserted is the fold's LAW: the
    // step is the learn rate times the outcome weight, taken on the distance remaining.
    const up = SEVERITY_LADDER.map((rung) => applyCredit({
      stock: HABIT_TUNING.NEUTRAL_I, lawWord: 'balanced', outcomeRung: rung, direction: 1,
    }));
    SEVERITY_LADDER.forEach((rung, index) => {
      const step = (HABIT_TUNING.CAP_I - HABIT_TUNING.NEUTRAL_I)
        * learnRateFor('balanced') * severityWeightOf(rung);
      expect(up[index]).toBe(roundToUnits(HABIT_TUNING.NEUTRAL_I + step));
      expect(up[index]).toBeGreaterThan(HABIT_TUNING.NEUTRAL_I);
    });
    const ordered = SEVERITY_LADDER.map((rung) => severityWeightOf(rung));
    // anchored: the four exact-step assertions above prove the weights are live and
    // distinct, so this inequality measures the DESIGNED non-monotonicity rather than an
    // always-false comparison over an emptied collection.
    expect(ordered).not.toEqual([...ordered].sort((a, b) => a - b));
    expect(HABIT_TUNING.SEVERITY_W).toHaveLength(SEVERITY_LADDER.length);
    expect([...LAW_WORD_VOLATILITY].sort()).toEqual([...LAW_WORDS].sort());
    for (const word of LAW_WORD_VOLATILITY) {
      expect(HALF_LIFE_BANDS).toContain(halfLifeBandFor(word));
    }
    expect(new Set(LAW_WORD_VOLATILITY.map(halfLifeBandFor)).size).toBe(LAW_WORD_VOLATILITY.length);
    // THE LAW-BAND DIVERGENCE, asserted DIRECTLY rather than through the step law above —
    // that assertion reads its own expected step out of `learnRateFor`, so a collapsed
    // rate table would move both sides together and pass. This is the arm that reds.
    const rates = LAW_WORD_VOLATILITY.map(learnRateFor);
    expect(new Set(rates).size).toBe(LAW_WORD_VOLATILITY.length);
    for (let i = 1; i < rates.length; i += 1) {
      expect(
        rates[i - 1],
        'the law-band learn rates no longer descend with volatility — a court with no law'
        + ' learns and forgets fastest, and collapsing the bands deletes that whole axis',
      ).toBeGreaterThan(rates[i]);
    }
  });

  test('no time means no change, the fold is deterministic, and ONE rounding door exists in the family', () => {
    const stock = 6200;
    expect(applyCredit({
      stock, lawWord: 'lawful', outcomeRung: SEVERITY_LADDER[0], direction: 1, ageWeeks: 0,
    })).toBe(applyCredit({
      stock, lawWord: 'lawful', outcomeRung: SEVERITY_LADDER[0], direction: 1, ageWeeks: 0,
    }));
    expect(seatAdjusted(stock, 'seat-a', 'seat-a')).toBe(stock);
    expect(seatAdjusted(stock, null, 'seat-b')).toBe(stock);
    expect(roundToUnits(HABIT_TUNING.CAP_I + 900)).toBe(HABIT_TUNING.CAP_I);
    expect(roundToUnits(HABIT_TUNING.FLOOR_I - 900)).toBe(HABIT_TUNING.FLOOR_I);
    // THE SINGLE-SPELLING FENCE (chair question Q3's condition): a fence with two gates is
    // not a fence, so the family may hold exactly one rounding expression and it must live
    // in the one door. The scan is proven live by finding that one before asserting there
    // is no second.
    const family = SRC_FILES.filter(({ rel }) => rel.startsWith(`${HABIT_DIR}/`));
    expect(family.length).toBe(2);
    const roundings = family.flatMap(({ rel, src }) => [
      ...src.matchAll(/\b(?:Math\.round|Math\.trunc|Math\.floor|Math\.ceil|toFixed)\s*\(/g),
    ].map(() => rel));
    expect(roundings).toEqual([CURVE_HOME]);
  });

  test('DORMANCY: neither new leaf has an importer anywhere in src, so the wave changes no output', () => {
    // The wave's identity claim, proved structurally rather than asserted. Two modules
    // with zero importers cannot move a generated world.
    expect(SRC_FILES.length).toBeGreaterThan(500);
    const importers = [];
    for (const { rel, src } of SRC_FILES) {
      if (NEW_LEAVES.includes(rel)) continue;
      if (/from\s*['"][^'"]*habit\/(?:habitVocabulary|habitCurve)\.js['"]/.test(src)) {
        importers.push(rel);
      }
    }
    expect(
      importers,
      'HB-0 is dark by construction — a module imported one of its leaves, so the wave is'
      + ' no longer byte-identical for every generated world and the identity claim is void',
    ).toEqual([]);
    // Guard the guard: the same detector finds the leaves' OWN sibling import, so an
    // emptied scan cannot pass as an absence.
    const curve = SRC_FILES.find(({ rel }) => rel === CURVE_HOME);
    expect(/from\s*['"]\.\.\/bandedStock\.js['"]/.test(curve.src)).toBe(true);
  });
});
