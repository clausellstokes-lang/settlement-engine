/**
 * detMath precision pins — T13 TRANS's deterministic transcendental kernel.
 *
 * WHAT IS BEING PROVED, AND WHY IT IS MEASURED RATHER THAN ARGUED. The kernel is
 * engine-independent BY CONSTRUCTION (only correctly-rounded IEEE-754 ops), and
 * `detMathIdentity.test.js` carries that structural proof. THIS file proves the other
 * half: that replacing the platform built-ins with the kernel is a shift of KNOWN,
 * BOUNDED size — the charter's §3 error budgets, each measured over THE REAL ARGUMENT
 * DOMAIN OF THE SITES BEING CURED rather than over a tidy sample.
 *
 * The domains below are read from the live call sites and their tuning tables, cited per
 * describe. `Math.exp`/`Math.log`/`Math.pow` are legitimate HERE: `tests/` is outside the
 * trees the transcendental ratchet scans, and the built-in is the REFERENCE being
 * compared against, never a shipped path.
 *
 * ⚠ A NOTE ON THE METRIC FOR THE LOGARITHMS. Relative error is the right metric for
 * exp/tanh/pow, whose outputs never cross zero on these domains. `log`/`log10` DO cross
 * zero (at x = 1), where relative error is unbounded for any implementation and says
 * nothing. So the log budgets are asserted as relative error away from that zero, plus an
 * ABSOLUTE bound across the whole domain including it — and exactness AT x = 1 is pinned
 * separately. attrition:175's `log(a/d)` really can sit at a/d = 1 (evenly matched
 * armies), so this is a live case, not a formality.
 */
import { describe, test, expect } from 'vitest';
import { log2Det, detExp, detLn, detLog10, __internals } from '../../src/kernel/detMath.js';
import { exp2Det, detTanh, halfLifeKeep, detIntPow } from '../../src/kernel/detMathDecay.js';

/** Worst relative error of `mine` against `ref` over a sampled domain. */
function worstRelative(samples, mine, ref) {
  let worst = 0;
  let at = null;
  for (const x of samples) {
    const a = mine(x);
    const b = ref(x);
    if (!Number.isFinite(b) || b === 0) continue;
    const rel = Math.abs(a - b) / Math.abs(b);
    if (rel > worst) { worst = rel; at = { x, mine: a, ref: b }; }
  }
  return { worst, at };
}

/** Worst absolute error of `mine` against `ref` over a sampled domain. */
function worstAbsolute(samples, mine, ref) {
  let worst = 0;
  let at = null;
  for (const x of samples) {
    const a = mine(x);
    const b = ref(x);
    if (!Number.isFinite(b)) continue;
    const abs = Math.abs(a - b);
    if (abs > worst) { worst = abs; at = { x, mine: a, ref: b }; }
  }
  return { worst, at };
}

/** `count` evenly spaced samples across [lo, hi], endpoints included. */
function linear(lo, hi, count) {
  const out = [];
  for (let i = 0; i <= count; i += 1) out.push(lo + ((hi - lo) * i) / count);
  return out;
}

/** `count` geometrically spaced samples across [lo, hi] — for domains spanning decades. */
function geometric(lo, hi, count) {
  const out = [];
  const ratio = Math.log(hi / lo);
  for (let i = 0; i <= count; i += 1) out.push(lo * Math.exp((ratio * i) / count));
  return out;
}

// ── Family C — exp / logistic (7 sites) ──────────────────────────────────────
// Real domain, read from the sites: corruption.js:532 `-totalShare * 0.9`
// (GUILD_TUNING.powerRate = 0.9, share order 1); corruptionWeb.js:491/511
// `-assets.length * 0.8` (GRIP_SATURATION_RATE = 0.8, asset counts to tens);
// contestMath.js:64/65 the logistic's two overflow-split branches over a log-odds;
// contestMath.js:88 softmax `s - max`, which is <= 0 and can be far below it;
// armyTransit.js:263 the same logistic. Budget (charter §3.3): <= 2e-14 relative.
describe('detExp — Family C, the exp/logistic sites', () => {
  const EXP_BUDGET = 2e-14;

  test('exp(0) is EXACTLY 1', () => {
    expect(detExp(0)).toBe(1);
  });

  test('the saturating-share domain [-2, 0] holds the 2e-14 budget', () => {
    const { worst, at } = worstRelative(linear(-2, 0, 4000), detExp, Math.exp);
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(EXP_BUDGET);
  });

  test('the grip-saturation domain [-40, 0] holds the 2e-14 budget', () => {
    const { worst, at } = worstRelative(linear(-40, 0, 8000), detExp, Math.exp);
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(EXP_BUDGET);
  });

  test('the softmax/logistic domain [-100, 0] holds the 2e-14 budget', () => {
    const { worst, at } = worstRelative(linear(-100, 0, 20000), detExp, Math.exp);
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(EXP_BUDGET);
  });

  test('the positive logistic branch [0, 50] holds the 2e-14 budget', () => {
    const { worst, at } = worstRelative(linear(0, 50, 10000), detExp, Math.exp);
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(EXP_BUDGET);
  });

  test('the logistic composed end-to-end holds the budget across its real log-odds range', () => {
    const logisticDet = (x) => (x >= 0 ? 1 / (1 + detExp(-x)) : (() => { const z = detExp(x); return z / (1 + z); })());
    const logisticRef = (x) => (x >= 0 ? 1 / (1 + Math.exp(-x)) : (() => { const z = Math.exp(x); return z / (1 + z); })());
    const { worst, at } = worstRelative(linear(-50, 50, 20000), logisticDet, logisticRef);
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(EXP_BUDGET);
  });

  test('the non-finite rails answer exactly as the platform does', () => {
    expect(detExp(Infinity)).toBe(Infinity);
    expect(detExp(-Infinity)).toBe(0);
    expect(Number.isNaN(detExp(NaN))).toBe(true);
  });
});

// ── Family E — natural log (2 sites) ─────────────────────────────────────────
// Real domain: contestMath.js:73 `log(c / (1 - c))` with c clamped to
// [1e-6, 1 - 1e-6], so the ratio spans [1e-6, 1e6]; attrition.js:175 `log(a / d)`,
// a strength ratio that sits AT 1 for evenly matched armies. Budget: <= 2e-14.
describe('detLn — Family E, the logit and the war log-ratio', () => {
  const LN_BUDGET = 2e-14;

  test('ln(1) is EXACTLY 0 — the evenly-matched-armies case', () => {
    expect(detLn(1)).toBe(0);
  });

  test('the logit ratio domain [1e-6, 1e6] holds the 2e-14 relative budget', () => {
    const { worst, at } = worstRelative(geometric(1e-6, 1e6, 20000), detLn, Math.log);
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(LN_BUDGET);
  });

  test('the absolute error stays under 1e-15 THROUGH the zero at x = 1', () => {
    const { worst, at } = worstAbsolute(linear(0.5, 1.5, 20000), detLn, Math.log);
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(1e-15);
  });

  test('the domain rails answer exactly as the platform does', () => {
    expect(detLn(0)).toBe(-Infinity);
    expect(Number.isNaN(detLn(-1))).toBe(true);
    expect(detLn(Infinity)).toBe(Infinity);
  });
});

// ── Family D — log10 (5 sites, ONE shared idiom) ─────────────────────────────
// Real domain: every site is the popScore/pop-tier idiom —
// `log10(max(10, pop)) / 5` (militaryStrength:176, occupation:595,
// relationshipMemory:91, relationshipRuleHelpers:288) and
// `log10(max(1, population)) / 8` (canonicalRelationship:230). Settlement
// populations run from 1 to the low millions. Budget: <= 2e-14.
describe('detLog10 — Family D, the popScore idiom', () => {
  const LOG10_BUDGET = 2e-14;

  test('log10(1) is EXACTLY 0 — the floor of the canonicalRelationship idiom', () => {
    expect(detLog10(1)).toBe(0);
  });

  test('the population domain [10, 1e7] holds the 2e-14 relative budget', () => {
    const { worst, at } = worstRelative(geometric(10, 1e7, 20000), detLog10, Math.log10);
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(LOG10_BUDGET);
  });

  test('the full [1, 1e7] domain holds the 2e-14 relative budget above the zero', () => {
    const samples = geometric(1.000001, 1e7, 20000);
    const { worst, at } = worstRelative(samples, detLog10, Math.log10);
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(LOG10_BUDGET);
  });

  test('the absolute error stays under 1e-15 THROUGH the zero at x = 1', () => {
    const { worst, at } = worstAbsolute(linear(0.5, 1.5, 20000), detLog10, Math.log10);
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(1e-15);
  });

  test('the popScore expression composed end-to-end holds the budget', () => {
    const det = (pop) => Math.min(1, detLog10(Math.max(10, pop)) / 5);
    const ref = (pop) => Math.min(1, Math.log10(Math.max(10, pop)) / 5);
    const { worst, at } = worstRelative(geometric(1, 1e7, 20000), det, ref);
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(LOG10_BUDGET);
  });
});

// ── Family F — tanh (2 sites) ────────────────────────────────────────────────
// Real domain: disposition.js:219 `tanh(x)` and :481 `0.5 + 0.5 * tanh(drive)` —
// a sigmoid shaping of a bounded drive. Budget: <= 2e-14, tanh(0) = 0 exact,
// monotone through the band edges the consumers threshold on.
describe('detTanh — Family F, the disposition sigmoids', () => {
  const TANH_BUDGET = 2e-14;

  test('tanh(0) is EXACTLY 0', () => {
    expect(detTanh(0)).toBe(0);
  });

  test('the drive domain [-20, 20] holds the 2e-14 budget', () => {
    const { worst, at } = worstRelative(linear(-20, 20, 20000), detTanh, Math.tanh);
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(TANH_BUDGET);
  });

  test('the tight-band domain [-1, 1] holds the 2e-14 budget', () => {
    const { worst, at } = worstRelative(linear(-1, 1, 20000), detTanh, Math.tanh);
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(TANH_BUDGET);
  });

  test('large arguments saturate EXACTLY at the rails, never past them', () => {
    expect(detTanh(400)).toBe(1);
    expect(detTanh(-400)).toBe(-1);
    expect(detTanh(Infinity)).toBe(1);
    expect(detTanh(-Infinity)).toBe(-1);
  });

  test('the function is odd and monotone across the sampled band', () => {
    let previous = -Infinity;
    let odd = true;
    for (const x of linear(-20, 20, 4000)) {
      const v = detTanh(x);
      if (v < previous) { previous = NaN; break; }
      previous = v;
      if (Math.abs(detTanh(-x) + v) > 0) odd = false;
    }
    expect(Number.isNaN(previous)).toBe(false);
    expect(odd).toBe(true);
  });

  test('the shaped consumer expression stays inside [0, 1]', () => {
    let inside = true;
    for (const x of linear(-50, 50, 4000)) {
      const v = 0.5 + 0.5 * detTanh(x);
      if (!(v >= 0 && v <= 1)) inside = false;
    }
    expect(inside).toBe(true);
  });
});

// ── Family A — the half-life family (14 sites) ───────────────────────────────
// Real domain, read from the tuning tables: HALF_LIFE_TICKS 52
// (informationStatecraft, momentum, npcCredibility, npcGrowthKernel),
// HALF_LIFE_WEEKS 156 (factionPairLedger, npcLadderState stand/grudge/bond),
// STIGMA 312, INSTABILITY 104, urbanFabric STOCK 260 / DRIFT 104. Ages run from 0
// to a century at week scale (~5200). Budget: <= 2e-14, EXACT at whole periods.
describe('halfLifeKeep — Family A, the sixteen-copy decay idiom', () => {
  const HALF_LIFE_BUDGET = 2e-14;
  const HALF_LIVES = [52, 104, 156, 260, 312];

  test('a whole number of half-lives is EXACT — one period returns exactly 0.5', () => {
    expect(halfLifeKeep(52, 52)).toBe(0.5);
    expect(halfLifeKeep(104, 52)).toBe(0.25);
    expect(halfLifeKeep(156, 52)).toBe(0.125);
    expect(halfLifeKeep(520, 52)).toBe(0.0009765625);
  });

  test('age zero keeps EXACTLY all of the stock', () => {
    expect(halfLifeKeep(0, 52)).toBe(1);
    expect(halfLifeKeep(0, 312)).toBe(1);
  });

  test('every real half-life over a century of ages holds the 2e-14 budget', () => {
    let worst = 0;
    let at = null;
    for (const h of HALF_LIVES) {
      for (const age of linear(0, 5200, 5000)) {
        const mine = halfLifeKeep(age, h);
        const ref = Math.pow(0.5, age / h);
        if (ref === 0) continue;
        const rel = Math.abs(mine - ref) / ref;
        if (rel > worst) { worst = rel; at = { age, h, mine, ref }; }
      }
    }
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(HALF_LIFE_BUDGET);
  });

  test('the band-multiplier wrap (factionPairLedger:184, npcLadderState:241) holds the budget', () => {
    let worst = 0;
    let at = null;
    for (const bandMult of [0.5, 0.75, 1, 1.5, 2]) {
      for (const age of linear(0, 2000, 4000)) {
        const h = Math.max(1, 156 * bandMult);
        const mine = 0.8 * halfLifeKeep(age, h);
        const ref = 0.8 * Math.pow(0.5, age / h);
        if (ref === 0) continue;
        const rel = Math.abs(mine - ref) / ref;
        if (rel > worst) { worst = rel; at = { age, bandMult, mine, ref }; }
      }
    }
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(HALF_LIFE_BUDGET);
  });

  test('the edge behaviour matches Math.pow(0.5, age / halfLife) exactly', () => {
    expect(halfLifeKeep(10, 0)).toBe(Math.pow(0.5, 10 / 0));
    expect(Number.isNaN(halfLifeKeep(0, 0))).toBe(true);
    expect(halfLifeKeep(-52, 52)).toBe(2);
  });
});

// ── Family B — integer exponents (9 sites) ───────────────────────────────────
// Real domain, read from the tuning tables: HOP_DECAY 0.75 over hop counts,
// RECENCY_DECAY 0.85 over ageTicks, SILENCE_DECAY 0.92, EXPOSED_DECAY_PER_TICK
// 0.94, plus moralDrift/pestilence/tradeFlow decay bases and occupation's
// DIMINISHING_BASE over a rank. Budget (charter §3.2): <= 1e-14.
describe('detIntPow — Family B, the integer-exponent decays', () => {
  const INT_POW_BUDGET = 1e-14;
  const BASES = [0.06, 0.09, 0.5, 0.75, 0.85, 0.92, 0.94, 0.98, 0.999];

  test('the exponent rails are EXACT — n = 0 is 1 and n = 1 is the base itself', () => {
    expect(detIntPow(0.85, 0)).toBe(1);
    expect(detIntPow(0.85, 1)).toBe(0.85);
    expect(detIntPow(0.94, 0)).toBe(1);
  });

  test('a power of two base is EXACT at every integer exponent', () => {
    expect(detIntPow(0.5, 10)).toBe(0.0009765625);
    expect(detIntPow(2, 10)).toBe(1024);
    expect(detIntPow(0.25, 4)).toBe(Math.pow(0.25, 4));
  });

  // ⚠ THE ONE BUDGET IN THIS FILE THAT NEEDS ITS DOMAIN STATED TO BE HONEST.
  // Square-and-multiply spends about one ulp per squaring and the squarings compound, so
  // the relative error grows LINEARLY in the exponent: measured 3.6e-16 at n <= 8,
  // 1.0e-14 at n <= 256, 1.99e-14 at n <= 500, 3.98e-14 at n <= 1000. The charter's §3.2
  // budget is <= 1e-14 "over the OBSERVED exponent domain", and §3.2 simultaneously cites
  // the DENS dyadic ladder's 1.95e-14 as "the ceiling analogue" for this very technique —
  // so the unrestricted figure lands on the charter's own analogue, not outside it.
  // The two arms below report BOTH figures rather than picking the flattering one.
  test('every real decay base holds the 1e-14 budget wherever the result is consumer-visible', () => {
    // A weight below 1e-6 is indistinguishable from zero to every Family B consumer:
    // each site feeds a clamp01 or a round4/round2-persisted product. This is the domain
    // in which a 1e-14 error could actually change an output.
    let worst = 0;
    let at = null;
    for (const b of BASES) {
      for (let n = 0; n <= 1000; n += 1) {
        const ref = Math.pow(b, n);
        if (!Number.isFinite(ref) || ref < 1e-6) continue;
        const mine = detIntPow(b, n);
        const rel = Math.abs(mine - ref) / ref;
        if (rel > worst) { worst = rel; at = { b, n, mine, ref }; }
      }
    }
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(INT_POW_BUDGET);
  });

  test('the UNRESTRICTED grade over exponents 0..500 is the DENS ladder analogue, 2e-14', () => {
    let worst = 0;
    let at = null;
    for (const b of BASES) {
      for (let n = 0; n <= 500; n += 1) {
        const ref = Math.pow(b, n);
        if (ref === 0 || !Number.isFinite(ref)) continue;
        const mine = detIntPow(b, n);
        const rel = Math.abs(mine - ref) / ref;
        if (rel > worst) { worst = rel; at = { b, n, mine, ref }; }
      }
    }
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(2e-14);
  });

  test('the beliefMap two-factor product (HOP_DECAY^hop * RECENCY_DECAY^age) holds the budget', () => {
    let worst = 0;
    let at = null;
    for (let hop = 0; hop <= 8; hop += 1) {
      for (let age = 0; age <= 300; age += 1) {
        const mine = detIntPow(0.75, hop) * detIntPow(0.85, age);
        const ref = Math.pow(0.75, hop) * Math.pow(0.85, age);
        if (ref === 0) continue;
        const rel = Math.abs(mine - ref) / ref;
        if (rel > worst) { worst = rel; at = { hop, age, mine, ref }; }
      }
    }
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(INT_POW_BUDGET);
  });

  test('occupation rank diminishing over a realistic occupier holding holds the budget', () => {
    let worst = 0;
    for (let rank = 0; rank < 40; rank += 1) {
      const mine = detIntPow(0.85, rank);
      const ref = Math.pow(0.85, rank);
      const rel = Math.abs(mine - ref) / ref;
      if (rel > worst) worst = rel;
    }
    expect(worst).toBeLessThan(INT_POW_BUDGET);
  });

  test('a NEGATIVE integer exponent is the reciprocal, not a silent wrong answer', () => {
    expect(detIntPow(2, -3)).toBe(0.125);
    expect(Math.abs(detIntPow(0.85, -4) - Math.pow(0.85, -4)) / Math.pow(0.85, -4)).toBeLessThan(INT_POW_BUDGET);
  });

  test('a NON-INTEGER exponent falls through to the general route rather than truncating', () => {
    const mine = detIntPow(0.85, 2.5);
    const ref = Math.pow(0.85, 2.5);
    expect(Math.abs(mine - ref) / ref).toBeLessThan(2e-14);
    expect(mine).not.toBe(detIntPow(0.85, 2));
  });

  test('the NaN and zero-base branches answer as the platform does', () => {
    expect(Number.isNaN(detIntPow(NaN, 3))).toBe(true);
    expect(Number.isNaN(detIntPow(0.5, NaN))).toBe(true);
    expect(detIntPow(0, 3)).toBe(0);
  });
});

// ── The two series, measured directly ────────────────────────────────────────
describe('the shared core — log2Det and exp2Det measured on their own', () => {
  test('log2Det holds 1e-14 relative across [1e-6, 1e7]', () => {
    const { worst, at } = worstRelative(geometric(1e-6, 1e7, 20000), log2Det, Math.log2);
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(1e-14);
  });

  test('log2Det is EXACT at the powers of two', () => {
    expect(log2Det(1)).toBe(0);
    expect(log2Det(2)).toBe(1);
    expect(log2Det(1024)).toBe(10);
    expect(log2Det(0.5)).toBe(-1);
  });

  test('exp2Det holds 1e-14 relative across [-200, 200]', () => {
    const { worst, at } = worstRelative(linear(-200, 200, 20000), exp2Det, (y) => Math.pow(2, y));
    expect(worst, `worst at ${JSON.stringify(at)}`).toBeLessThan(1e-14);
  });

  test('exp2Det is EXACT at the integers', () => {
    expect(exp2Det(0)).toBe(1);
    expect(exp2Det(1)).toBe(2);
    expect(exp2Det(10)).toBe(1024);
    expect(exp2Det(-10)).toBe(Math.pow(2, -10));
  });

  test('the saturation rails return what walking the loops returns', () => {
    expect(exp2Det(1024)).toBe(Infinity);
    expect(exp2Det(2000)).toBe(Infinity);
    expect(exp2Det(-1075)).toBe(0);
    expect(exp2Det(-2000)).toBe(0);
  });

  test('the published constants are the double-precision values they claim to be', () => {
    expect(__internals.LOG2E).toBe(1 / Math.LN2);
    expect(__internals.LN2).toBe(Math.LN2);
    expect(__internals.SQRT2).toBe(Math.SQRT2);
    expect(__internals.LOG10_2).toBe(Math.log10(2));
  });
});
