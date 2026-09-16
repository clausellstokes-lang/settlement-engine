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
import { HALF_LIFE_BANDS, HALF_LIFE_WEEKS, halfLifeWeeksOf } from '../../src/domain/worldPulse/bandedStock.js';
import { SEVERITY_LADDER } from '../../src/domain/worldPulse/bandFamilies.js';
import { CIRCUMSTANCE_CLASSES } from '../../src/domain/worldPulse/habit/habitVocabulary.js';
import { LAW_WORDS } from '../../src/domain/worldPulse/lawWord.js';
import { STRATEGY_MOVES } from '../../src/domain/worldPulse/strategyMoves.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const S = HABIT_TUNING.HABIT_SPAN;
const HABIT_DIR = 'src/domain/worldPulse/habit';
const CURVE_HOME = `${HABIT_DIR}/habitCurve.js`;
const NEW_LEAVES = Object.freeze([`${HABIT_DIR}/habitVocabulary.js`, CURVE_HOME]);
const REGISTRY_HOME = 'src/domain/worldPulse/habitForkRegistry.js';

/** HB-0B's three structural bounds, named once so no case re-spells the list. */
const BOUND_KEYS = Object.freeze([
  'HABIT_ROWS_PER_ACTOR_CAP',
  'PLEDGE_MAX_AGE_WEEKS',
  'PLEDGE_BOOK_CAP',
]);

/** The MEDIAN court's position in the volatility order — the same index the curve indexes by. */
const MEDIAN_COURT = 1;

/**
 * ⭐⭐ THE HABIT FAMILY'S REVERSE-IMPORT CLOSURE INSIDE `src`, exact in BOTH directions.
 * HB-0's two leaves plus the ONE module that imports either of them — the HB-1 fork registry,
 * which reads the circumstance vocabulary and is itself read only by walkers. The dormancy
 * case below asserts this list against the live tree and then asserts that nothing outside it
 * reaches in, which is what "the wave changes no output" means once the family has an
 * importer at all.
 * @type {readonly string[]}
 */
const HABIT_DARK_CLOSURE = Object.freeze([
  'src/domain/worldPulse/habit/habitCurve.js',
  'src/domain/worldPulse/habit/habitVocabulary.js',
  'src/domain/worldPulse/habitForkRegistry.js',
  // ⭐ JOINED AT HB-2, and the intuitive answer is wrong in an instructive way. The ledger
  // imports the vocabulary and the curve, so it JOINS. ⛔ `habitGate.js` — minted in the SAME
  // commit, into the SAME directory — does NOT, because the closure grows by REVERSE imports
  // and the gate imports nothing at all: being imported BY a member does not enrol a file.
  // Declaring both would red arm (a) in the other direction.
  'src/domain/worldPulse/habit/habitLedger.js',
]);

/**
 * The habit directory's file count. ⛔ HB-2 DOUBLES IT, and that matters beyond arithmetic:
 * the single-rounding-door scan below runs over the WHOLE family and asserts an array of
 * EXACTLY ONE, so neither new leaf may spell any rounding operator. Every rounding in the
 * ledger routes through the imported `roundToUnits` and its eviction compares integers that
 * function already produced.
 */
const HABIT_FAMILY_FILES = 4;

/** The two files lawfully allowed to spell a member of the tuning bag — see the A4 re-aim. */
const BOUND_HOMES = Object.freeze([
  'src/domain/worldPulse/habit/habitCurve.js',
  'src/domain/worldPulse/habit/habitLedger.js',
]);

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
    expect(family.length).toBe(HABIT_FAMILY_FILES);
    const roundings = family.flatMap(({ rel, src }) => [
      ...src.matchAll(/\b(?:Math\.round|Math\.trunc|Math\.floor|Math\.ceil|toFixed)\s*\(/g),
    ].map(() => rel));
    expect(roundings).toEqual([CURVE_HOME]);
  });

  test('DARK CLOSURE: the habit family is unreachable from the engine, so the wave changes no output', () => {
    // ⭐⭐ RE-AIMED IN PLACE at the HB-1 re-charter, in the SAME commit that creates the
    // family's first importer. HB-0.md §15 wrote the discharge condition as a condition
    // rather than a hope: this case USED to assert a WHOLE-TREE ABSOLUTE — "neither new leaf
    // has an importer anywhere in src" — and its own designed first consumer falsifies that
    // sentence. A wave that added the import without re-aiming here would have redded a test
    // green since the HB-0 landing, which is why §15 named the re-aim as the first consumer's
    // own obligation.
    //
    // ⛔ WHAT THE CLAIM BECAME, and it is STRONGER rather than weaker. "Dark" no longer means
    // "these two leaves have no importer"; it means THE WHOLE FAMILY IS UNREACHABLE FROM THE
    // ENGINE. Nothing outside the closure below reaches into it, so no generated world can
    // observe any of it — and the closure is exact in BOTH directions, so a new consumer must
    // declare itself here and a vanished one must be banked here.
    expect(SRC_FILES.length).toBeGreaterThan(500);
    const imports = new Map();
    for (const { rel, src } of SRC_FILES) {
      const dir = rel.split('/').slice(0, -1).join('/');
      const specs = new Set();
      for (const m of src.matchAll(/from\s*['"](\.[^'"]*)['"]/g)) {
        specs.add(join(dir, m[1]).replace(/\\/g, '/'));
      }
      imports.set(rel, specs);
    }
    // (a) THE CLOSURE IS EXACT. Grow the reverse-import closure of the two HB-0 leaves to a
    // fixpoint over the live tree and compare it, both directions, to the declared list.
    const closure = new Set(NEW_LEAVES);
    for (let grew = true; grew;) {
      grew = false;
      for (const { rel } of SRC_FILES) {
        if (closure.has(rel)) continue;
        for (const member of closure) {
          if (!imports.get(rel).has(member)) continue;
          closure.add(rel);
          grew = true;
          break;
        }
      }
    }
    expect(
      [...closure].sort(),
      'the habit family\'s reverse-import closure changed. A NEW consumer must be declared in'
      + ' HABIT_DARK_CLOSURE in its own commit; a consumer that VANISHED must be banked here in'
      + ' the same commit that removed it.',
    ).toEqual([...HABIT_DARK_CLOSURE].sort());
    // (b) THE CLOSURE IS CLOSED — the dormancy claim itself, asserted against the DECLARED
    // list rather than the computed one, so a stale declaration cannot satisfy it by
    // construction.
    const outsiders = SRC_FILES
      .filter(({ rel }) => !HABIT_DARK_CLOSURE.includes(rel))
      .filter(({ rel }) => HABIT_DARK_CLOSURE.some((member) => imports.get(rel).has(member)))
      .map(({ rel }) => rel)
      .sort();
    expect(
      outsiders,
      'a module OUTSIDE the habit family imported one of its members, so the family is no'
      + ' longer unreachable from the engine and the wave\'s identity claim is void',
    ).toEqual([]);
    // (c) GUARD THE GUARD. The same detector finds the family's real INBOUND edge and the
    // leaves' own sibling import, so an emptied scan cannot pass as an absence.
    expect(imports.get(REGISTRY_HOME).has(`${HABIT_DIR}/habitVocabulary.js`)).toBe(true);
    expect(imports.get(CURVE_HOME).has('src/domain/worldPulse/bandedStock.js')).toBe(true);
  });

  // ── HB-0B — THE THREE STRUCTURAL BOUNDS ────────────────────────────────────────────
  // A §42.2 micro-act, not a volume wave. The HB-2 charter asserted these were "declared in
  // HABIT_TUNING at HB-0"; they were nowhere in the tree (R31, ratified at §42.1), and these
  // four cases are the commit that makes that sentence true. The VALUES are chair-signed at
  // §43 item 1 on executed derivations and are marked UNSOAKED, riding the tuning signature
  // like the ten constants already in the bag.

  test('THE THREE BOUNDS are finite positive integers and frozen members of the ONE bag', () => {
    for (const key of BOUND_KEYS) {
      expect(
        Object.prototype.hasOwnProperty.call(HABIT_TUNING, key),
        `${key} must live in HABIT_TUNING and nowhere else — the curve's landed header commits`
        + ' that no habit constant is authored outside this bag',
      ).toBe(true);
      expect(Number.isInteger(HABIT_TUNING[key]), `${key} is an integer-domain quantity`).toBe(true);
      expect(HABIT_TUNING[key]).toBeGreaterThan(0);
      expect(Number.isFinite(HABIT_TUNING[key])).toBe(true);
    }
    // THE FREEZE IS LOAD-BEARING, not decoration: the bag is the single home, so a write that
    // silently took would fork the tuning at run time. In an ES module this throws.
    expect(Object.isFrozen(HABIT_TUNING)).toBe(true);
    const before = HABIT_TUNING.PLEDGE_BOOK_CAP;
    expect(() => { HABIT_TUNING.PLEDGE_BOOK_CAP = before + 1; }).toThrow(TypeError);
    expect(HABIT_TUNING.PLEDGE_BOOK_CAP).toBe(before);
  });

  test('the row cap is STRICTLY below the DERIVED structural product, and the curve spells no rung word', () => {
    // (a) EVICTION MUST BE REACHABLE. The product is derived from the two live vocabularies,
    // never transcribed, so a vocabulary that grew moves this denominator with it.
    const product = CIRCUMSTANCE_CLASSES.length * STRATEGY_MOVES.length;
    expect(
      HABIT_TUNING.HABIT_ROWS_PER_ACTOR_CAP,
      'the row cap reached the structural product, so the chartered nearest-neutral eviction'
      + ' is unreachable on every world — a dead arm wearing a cap\'s clothing',
    ).toBeLessThan(product);
    // (b) A WHOLE MULTIPLE OF THE CLASS VOCABULARY, so every class gets the same allowance and
    // the ledger carries no ordering dependency.
    expect(HABIT_TUNING.HABIT_ROWS_PER_ACTOR_CAP % CIRCUMSTANCE_CLASSES.length).toBe(0);
    expect(HABIT_TUNING.HABIT_ROWS_PER_ACTOR_CAP / CIRCUMSTANCE_CLASSES.length).toBeGreaterThan(1);
    // (c) GUARD THE GUARD. A transcribed denominator cannot detect a vocabulary that grew, so
    // this battery's own source may not spell the product as a literal.
    const ownSource = readFileSync(join(ROOT, 'tests/domain/habitCurve.test.js'), 'utf8');
    expect(
      new RegExp(`\\b${product}\\b`).test(ownSource),
      'the structural product is transcribed as a literal in this battery — derive it from the'
      + ' live vocabularies instead, or it goes stale the moment either one grows',
    ).toBe(false);
    // (d) THE RUNG WORD IS DERIVED, NEVER SPELLED — here or in the curve. habitCurve.js's own
    // landed header commits that "no rung word is spelled anywhere in this file", and NO WALKER
    // ENFORCES THAT: spBandFamilies governs the severity ladder and the significance classes
    // only, and dispositionLedger.js spells a half-life rung today and is green. This arm is
    // the machinery that promise otherwise lacks.
    const rung = halfLifeBandFor(LAW_WORD_VOLATILITY[MEDIAN_COURT]);
    expect(HALF_LIFE_BANDS).toContain(rung);
    const sourceOf = (rel) => SRC_FILES.find((file) => file.rel === rel).src;
    // the positive control runs FIRST, so an emptied scan cannot pass as an absence
    expect(sourceOf('src/domain/worldPulse/bandedStock.js').includes(rung)).toBe(true);
    expect(
      HALF_LIFE_BANDS.filter((word) => sourceOf(CURVE_HOME).includes(word)),
      'a half-life rung word is spelled in habitCurve.js, falsifying a sentence its own landed'
      + ' header makes — and no walker in the estate would have caught it',
    ).toEqual([]);
  });

  test('the pledge max age is a MEMBER of the shared ladder, and it is the median court\'s own band', () => {
    // ⚠ THE RELATIONSHIP IS PINNED, NOT THE NUMBER. A pin on the value would pass a hand-keyed
    // re-spelling that happens to equal today's figure while belonging to no ladder at all.
    expect(
      Object.values(HALF_LIFE_WEEKS),
      'the pledge max age is not a rung of the estate\'s one time ladder — the habit family\'s'
      + ' discipline is to ride shared ladders rather than author numbers',
    ).toContain(HABIT_TUNING.PLEDGE_MAX_AGE_WEEKS);
    expect(HABIT_TUNING.PLEDGE_MAX_AGE_WEEKS).toBe(
      halfLifeWeeksOf(HABIT_TUNING.HALF_LIFE[LAW_WORD_VOLATILITY[MEDIAN_COURT]]),
    );
    // and the INDEXING is positional: the three courts occupy three CONSECUTIVE rungs of the
    // shared ladder, and the age is the middle one's. A reorder or an inserted rung upstream
    // reds here instead of silently re-pointing the age at another court's forgetting band.
    const rungIndices = LAW_WORD_VOLATILITY
      .map((word) => HALF_LIFE_BANDS.indexOf(halfLifeBandFor(word)));
    expect(rungIndices.filter((index) => index < 0)).toEqual([]);
    for (let i = 1; i < rungIndices.length; i += 1) {
      expect(
        rungIndices[i],
        'the three courts no longer sit on consecutive rungs of the shared ladder, so the'
        + ' positional offset the curve indexes by has stopped meaning what it says',
      ).toBe(rungIndices[i - 1] + 1);
    }
    expect(HABIT_TUNING.PLEDGE_MAX_AGE_WEEKS)
      .toBe(halfLifeWeeksOf(HALF_LIFE_BANDS[rungIndices[MEDIAN_COURT]]));
  });

  test('the three bounds have ZERO consumers in src, and the detector is proved live on NEUTRAL_I', () => {
    const mentionsOf = (symbol) => SRC_FILES
      .filter(({ src }) => src.includes(symbol))
      .map(({ rel }) => rel)
      .sort();
    // ⭐⭐ RE-AIMED IN PLACE AT HB-2, in the SAME commit that creates the first consumer, with
    // ZERO new titles — exactly the discharge this case's own failure message demanded, and
    // exactly how HB-1 re-aimed HB-0's whole-tree dormancy absolute. WHAT THE CLAIM WAS at
    // HB-0B: "nothing in src reads the three bounds", which was true for precisely one commit.
    // ⛔ WHAT IT BECAME, AND IT IS STRONGER RATHER THAN WEAKER: the bounds are spelled ONLY
    // inside the habit family, and that family is unreachable from the engine by the dark
    // closure case above. A bound reaching any third file would mean a consumer outside the
    // family had appeared, which is the thing worth catching.
    // GUARD THE GUARD FIRST: the same detector finds a sibling member of the same bag exactly
    // where it genuinely lives, so an emptied scan cannot pass as an absence.
    expect(mentionsOf('NEUTRAL_I')).toEqual([...BOUND_HOMES]);
    for (const key of BOUND_KEYS) {
      expect(
        mentionsOf(key),
        `${key} is spelled outside the habit family. The bounds are SPENT by the ledger and`
        + ' AUTHORED by the curve, and nothing else may name them: the family is unreachable'
        + ' from the engine, so a third speller is a consumer that escaped the closure. A wave'
        + ' that legitimately spends them owes the re-aim of this case in the same commit.',
      ).toEqual([...BOUND_HOMES]);
    }
  });
});
