/**
 * detMathDecay.js — T13 TRANS's LAZY-ONLY transcendental wrappers.
 *
 * WHY THIS FILE IS SEPARATE FROM `detMath.js`, AND WHY THAT IS A BUDGET DECISION.
 * Of the fifty census sites, exactly TWO sit in the EAGER first-paint graph —
 * `corruption.js:532` (reached main.jsx -> store -> settlementSlice -> mutateEntities)
 * and `relationships/canonicalRelationship.js:230` (-> mutate -> mutateWorld). They need
 * `detExp` and `detLog10`, and nothing else. The other forty sites are lazy generation
 * code. When ONE module served both, Rollup emitted ONE chunk and the first-paint
 * closure paid for `exp2Det` and `halfLifeKeep` that no eager caller ever invokes.
 * Splitting the module — and giving it its own CHUNK NAME in vite.config.js, which is
 * the part that actually matters — keeps the closure paying only for what it calls.
 *
 * Determinism is unchanged: everything here is still assembled from +, -, *, / and
 * compare, with `Math.floor` the only Math call, so the ratchet polices it exactly as it
 * polices the core.
 *
 * @enforced-by tests/kernel/detMath.test.js
 * @enforced-by tests/kernel/detMathIdentity.test.js
 * @enforced-by tests/build/vendorPdfLazy.test.js (the det-math placement pins)
 */
import {
  LN2, EXP2_OVERFLOW_AT, EXP2_UNDERFLOW_AT, expm1Small, scaleByPow2, log2Det, detExpm1,
} from './detMath.js';

/**
 * 2^y for finite y, from + - * / only.
 *
 * The integer part is applied by repeated doubling (exact); only the fractional part
 * goes through the series, so the error never grows with the magnitude of y.
 *
 * ⭐ THE REDUCTION ROUNDS TO NEAREST, NOT DOWN, AND THAT IS A PRECISION DECISION.
 * Flooring leaves a fraction in [0, 1) and a series argument up to 0.693, where the
 * truncated Taylor tail is worth ~6e-14 relative — and worse, it puts a NEARLY-ZERO
 * exponent at the very WORST point of the series (y = -0.003 floors to n = -1, f = 0.997).
 * That is not hypothetical: it was measured here as the dominant error of the whole
 * half-life family, 3.4e-14 at age 1.04 against a 312-week half-life. Rounding to nearest
 * halves the fraction to [-0.5, 0.5], so |t| <= 0.347 and the tail falls to ~3e-18, at
 * the cost of one extra addition.
 * @param {number} y
 * @returns {number}
 */
export function exp2Det(y) {
  // The rails: same answer as walking the loops, without walking them.
  if (y >= EXP2_OVERFLOW_AT) return Infinity;
  if (y <= EXP2_UNDERFLOW_AT) return 0;

  const n = Math.floor(y + 0.5);
  const f = y - n;              // f in [-0.5, 0.5]
  const t = f * LN2;            // |t| <= 0.3466
  return scaleByPow2(1 + expm1Small(t), n);
}

/**
 * tanh(x) — the drop-in for `Math.tanh` in seeded code.
 *
 * Computed as -m / (m + 2) with m = e^(-2|x|) - 1, then signed. Algebraically that is the
 * familiar (1 - u) / (1 + u) with u = e^(-2|x|) — but ⭐ THE SUBTRACTION IS NEVER
 * PERFORMED. For a small drive u is within 1e-4 of 1, so forming `1 - u` throws away
 * every significant digit: that spelling measured 1.8e-10 relative error on this exact
 * band, four orders of magnitude outside budget. Taking `m` straight from `detExpm1`
 * builds the small numerator out of small terms instead, and the same expression stays
 * OVERFLOW-SAFE at the other end: m falls to -1 for large |x|, so the result saturates
 * EXACTLY at +/-1 rather than dividing two infinities. tanh(0) is EXACTLY 0, and the
 * function is monotone through the band edges its consumers threshold on.
 * @param {number} x
 * @returns {number}
 */
export function detTanh(x) {
  if (x === 0) return 0;
  if (Number.isNaN(x)) return NaN;
  if (x === Infinity) return 1;
  if (x === -Infinity) return -1;
  const negative = x < 0;
  const a = negative ? -x : x;
  const m = detExpm1(-2 * a);       // in [-1, 0]
  const magnitude = -m / (m + 2);
  return negative ? -magnitude : magnitude;
}

/**
 * THE HALF-LIFE KEEP FACTOR — the fraction of a stock that SURVIVES `age` units when the
 * stock halves every `halfLife` units. The one canonical spelling of the idiom that was
 * hand-copied to sixteen sites (§797.5/§808).
 *
 * ⭐ pow(0.5, k) IS 2^-k, so this skips the log2 leg entirely: it calls exp2Det directly
 * on the negated exponent. That halves the error budget against a general
 * `detPow(0.5, k)` route AND makes whole-period decay EXACT — at k = 1, 2, 3 … the
 * fractional part is zero, the series returns its constant term 1, and the integer part
 * is applied by exact halving, so one half-life returns exactly 0.5, two exactly 0.25,
 * and so on forever.
 *
 * Edge behaviour mirrors `Math.pow(0.5, age / halfLife)` EXACTLY so this is a true
 * drop-in: a NaN ratio answers NaN, a zero half-life with positive age answers 0
 * (the ratio is Infinity), and a negative age GROWS the stock, as the arithmetic says.
 * @param {number} age elapsed units (ticks or weeks — the caller's unit, consistently)
 * @param {number} halfLife units per halving; callers clamp this positive
 * @returns {number} the surviving fraction in [0, 1] for non-negative age
 */
export function halfLifeKeep(age, halfLife) {
  const k = age / halfLife;
  if (Number.isNaN(k)) return NaN;
  if (k === Infinity) return 0;
  if (k === -Infinity) return Infinity;
  return exp2Det(-k);
}

/**
 * base^n for an INTEGER exponent — square-and-multiply, the DENS dyadic precedent
 * (§870.1) without the sqrt rungs, which a whole exponent does not need.
 *
 * Every step is an exact IEEE-754 multiply, so the only error is the accumulated
 * rounding of ~log2(n) products — far tighter than routing through the two series. It is
 * NOT bit-identical to `Math.pow`, which is why every integer-exponent site is a declared
 * shift (§3.2).
 *
 * A NON-INTEGER exponent is NOT silently accepted: it falls through to the general
 * two-series route, so a caller whose "count" turns out fractional gets the right answer
 * rather than a plausible wrong one. That route is spelled inline rather than importing
 * `detPow.js`, because `detPow`'s series live behind an export its own header declares
 * suite-only ("not part of the kernel's consumer surface") — see the module header's note
 * on why the two kernels stay independent and machine-compared.
 * @param {number} base
 * @param {number} n integer exponent
 * @returns {number}
 */
export function detIntPow(base, n) {
  if (n === 0) return 1;
  if (n === 1) return base;
  if (Number.isNaN(base) || Number.isNaN(n)) return NaN;
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    // The general route, for the exponent this helper was not given.
    if (base === 1) return 1;
    if (base === 0) return n > 0 ? 0 : Infinity;
    if (base < 0) return NaN;
    if (!Number.isFinite(base)) return n > 0 ? Infinity : 0;
    if (!Number.isFinite(n)) return n > 0 ? (base > 1 ? Infinity : 0) : (base > 1 ? 0 : Infinity);
    return exp2Det(n * log2Det(base));
  }

  const negative = n < 0;
  let e = negative ? -n : n;
  let result = 1;
  let acc = base;
  while (e > 0) {
    // Exact: the low bit of a non-negative integer, from floor and doubling only.
    const half = Math.floor(e / 2);
    if (e - half - half === 1) result = result * acc;
    e = half;
    if (e > 0) acc = acc * acc;
  }
  return negative ? 1 / result : result;
}

