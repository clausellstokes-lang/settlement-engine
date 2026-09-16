/**
 * detMath.js — T13 TRANS's DETERMINISTIC TRANSCENDENTAL KERNEL.
 *
 * WHY THIS EXISTS. ECMAScript specifies the 22 functions of §21.3.2 (exp, log, log10,
 * pow, sin, cos, tan, tanh, hypot, …) and the `**` operator as IMPLEMENTATION-
 * APPROXIMATED: V8, JavaScriptCore and SpiderMonkey may disagree in the last ulp. A
 * stored seed can therefore generate a DIFFERENT WORLD in Safari than in Chrome, and no
 * instrument we own can see it — every golden, probe and soak runs on one engine, and
 * the worker byte-identity pin compares two runs of the SAME engine. THE PROMISE ("a
 * seed is a STARTING world, forever") is a bit-level claim, and this file is what makes
 * it true.
 *
 * ⭐ THE BAN TARGETS THE BUILT-IN, NOT THE OPERATION. IEEE-754 addition, subtraction,
 * multiplication, division and comparison are CORRECTLY ROUNDED by specification, and
 * `Math.floor` is exact — every conforming engine returns the identical bit pattern for
 * identical inputs. Everything below is assembled from nothing but those, so it is
 * engine-independent BY CONSTRUCTION and needs no cross-engine CI to prove it. This file
 * therefore contains no Math call other than `Math.floor`, and no `**` operator: it sits
 * inside the scanned trees, so the transcendental ratchet polices the cure's own
 * substrate all the way to retirement.
 *
 * ⭐⭐ ONE CORE, THIN WRAPPERS (the fnv1a32 lesson, J-T7-I). `log2Det`/`exp2Det` are the
 * SINGLE implementation behind this module; `detExp`, `detLn`, `detLog10`, `detTanh`,
 * `halfLifeKeep` and `detIntPow` are all thin delegates, so a precision fix lands in
 * exactly one place. `tests/kernel/detMathIdentity.test.js` asserts the wrappers still
 * agree with the core over a pinned probe set.
 *
 * ⚠ WHY `detPow.js` IS NOT FOLDED IN, AND WHAT GUARDS THE COPY INSTEAD. The T13 charter
 * permits folding detPow onto this core ONLY IF detPow's suite stays green. It does not:
 * `tests/kernel/detPow.test.js` runs a SOURCE SCAN over `src/kernel/detPow.js` whose
 * liveness anchor is the literal string `export function detPow(x, y)` in that file. Turn
 * detPow into a re-export and the anchor vanishes, so the consolidation could only be
 * bought by weakening the very guard that proves detPow is engine-independent — and its
 * minted receipts (worst 3.6e-14, boundary-exact) are not regressible for the sake of
 * deduplication. So detPow keeps its own copy of the two series, and the relationship
 * between the copies is MACHINE-POLICED rather than trusted: `detMathIdentity.test.js`
 * pins that the two cores agree to within 1e-13 across a dense probe set AND that THIS
 * core is never LESS accurate than detPow's, so neither drift nor a silent regression can
 * land. That is the fnv1a32 mitigation in its enforceable form.
 *
 * ⚠ THE COPIES ARE NOT IDENTICAL, AND THE DIFFERENCE IS DELIBERATE. `log2Det` is the
 * VERBATIM body minted by VAR-1a (`c6a8da312`, §794.1). `exp2Det` is NOT: its reduction
 * rounds to nearest where detPow's floors, and its series is factored through
 * `expm1Small`. Both changes were forced by MEASUREMENT against the charter's §3 budgets
 * over the real site domains — the floor-reduction spelling misses the half-life budget
 * by 1.7x and the exp budget by 2x — and each is documented at its own site below. A
 * future consolidation of detPow onto this core would therefore be an IMPROVEMENT to
 * detPow, not a no-op, and would move its measured worst-case: it is a shift, and it
 * belongs in a declared window, not in a tidy-up.
 *
 * THE DECOMPOSITION.
 *   · log2 by range reduction to a mantissa in [1,2) (exact — halving only shifts the
 *     binary exponent), centred about sqrt(2) so the atanh series argument satisfies
 *     |z| <= 0.1716, then the odd atanh series.
 *   · exp2 by splitting the exponent into an integer part (exact, by repeated doubling)
 *     and a fraction in [0,1) through a Taylor series in t = f*ln2, |t| <= 0.694.
 * Range reduction introduces NO error of its own, so the whole budget belongs to the two
 * series — and the error never grows with the magnitude of the exponent.
 *
 * MEASURED, NOT ASSERTED: `tests/kernel/detMath.test.js` compares every wrapper against
 * the platform built-in over EACH CURED SITE'S REAL ARGUMENT DOMAIN and pins the worst
 * observed relative error. Tests may call the platform Math; `tests/` is outside the
 * scanned trees.
 *
 * ⭐ THE SPLIT (T13 Car 1c). This file is the CORE, and it holds exactly what the two
 * EAGER census sites reach: `corruption.js:532` needs detExp and
 * `relationships/canonicalRelationship.js:230` needs detLog10. Every other wrapper —
 * exp2Det, halfLifeKeep, detTanh, detIntPow — lives in `detMathDecay.js` because its
 * consumers are all LAZY. The two are separate CHUNKS, not just separate files: Rollup
 * emits one chunk per chunk-name, so a single name would put both halves in the eager
 * first-paint closure and make it pay for decay code it never calls. Measured at the
 * T13 dispatch base, the eager first-paint closure has under 1 kB of margin, so that is
 * not a theoretical tidiness — it is the difference between fitting and an owner ask.
 * @enforced-by tests/build/vendorPdfLazy.test.js (the det-math placement pins)
 * @enforced-by tests/kernel/detMath.test.js
 * @enforced-by tests/kernel/detMathIdentity.test.js
 */

/** 1 / ln(2), to double precision. A CONSTANT, not a computed transcendental. */
const LOG2E = 1.4426950408889634;
/** ln(2), to double precision. */
export const LN2 = 0.6931471805599453;
/** log10(2), to double precision — the log2 -> log10 change of base. */
const LOG10_2 = 0.30102999566398120;
/** sqrt(2) — the centring pivot for the mantissa. A constant, not a call. */
const SQRT2 = 1.4142135623730951;

/**
 * THE SATURATION RAILS. 2^1024 overflows a double and 2^-1075 underflows to zero, so
 * beyond these the doubling loops below can only walk to Infinity or 0 the slow way.
 * Returning the rail directly is BIT-IDENTICAL to walking there (proven by the
 * bit-identity probe in the identity suite, which includes both rails) and turns a
 * potentially thousand-iteration loop into two comparisons.
 */
export const EXP2_OVERFLOW_AT = 1024;
export const EXP2_UNDERFLOW_AT = -1075;

/**
 * ln(2) SPLIT IN TWO so the exponent reduction is EXACT (the Cody-Waite idiom).
 * `LN2_HI` carries the leading bits with its low 21 bits zero, so `n * LN2_HI` is an
 * exact product for every reduction index this kernel can produce (|n| < 2^21). The
 * remainder rides in `LN2_LO`. Subtracting the two pieces separately means the reduced
 * argument `r = (x - n*LN2_HI) - n*LN2_LO` carries no error of its own — without the
 * split, rounding `n * LN2` alone injects an error proportional to |x|, which is exactly
 * what a single-constant reduction was measured to cost (see the header's budget note).
 */
const LN2_HI = 6.93147180369123816490e-1;
const LN2_LO = 1.90821492927058770002e-10;

/**
 * e^t - 1 for |t| <= ~0.35, WITHOUT ever forming the leading 1.
 *
 * ⭐ THIS IS THE CANCELLATION CURE, AND IT IS THE REASON detTanh IS ACCURATE NEAR ZERO.
 * Computing `exp(t) - 1` for tiny t subtracts two nearly-equal numbers and destroys every
 * significant digit — measured at 1.8e-10 relative on the disposition sigmoid's real
 * band before this existed. The series is factored as t * P(t) so the small answer is
 * built up from small terms and no cancellation can occur.
 *
 * The Horner coefficients are 1/(k+1)! — the Taylor series of (e^t - 1)/t.
 * @param {number} t
 * @returns {number}
 */
export function expm1Small(t) {
  // HORNER, AS A LOOP OVER EXACT INTEGER DIVISORS. Mathematically the same series
  // the explicit chain spelled — t*(1 + t/2*(1 + t/3*(...))) — but the coefficients
  // are DIVIDED BY k at each step instead of multiplied by a pre-rounded 1/k!.
  // Two consequences, both wanted. (1) Bytes: esbuild constant-folds `1 / 479001600`
  // into `2.08767569878681e-9`, which is EIGHT CHARACTERS LONGER than the source it
  // replaced, and it does that to all fourteen coefficients; `k` is a loop variable,
  // so `/ k` cannot be folded at all. (2) Precision: dividing by a small exact
  // integer is a single correctly-rounded operation, where a pre-rounded reciprocal
  // carries its own rounding into every term. Determinism is untouched — still only
  // +, *, / and compare, every one of them exactly rounded by IEEE-754.
  let p = 0;
  for (let k = 13; k >= 1; k -= 1) p = (p + 1) * t / k;
  return p;
}

/** Apply an exact power of two by doubling/halving. Exact: only the exponent shifts. */
export function scaleByPow2(value, exponent) {
  let s = value;
  let n = exponent;
  while (n > 0) { s = s * 2; n = n - 1; }
  while (n < 0) { s = s / 2; n = n + 1; }
  return s;
}

/**
 * log2(x) for finite x > 0, from + - * / only.
 *
 * Range reduction pulls x to a mantissa in [1,2) by exact halving/doubling, then
 * centres it about 1 so the series argument z = (m-1)/(m+1) satisfies |z| <= 0.1716.
 * The atanh series ln(m) = 2*(z + z^3/3 + z^5/5 + ...) then converges fast enough
 * that the first omitted term is below the double-precision floor of the result.
 * @param {number} x
 * @returns {number}
 */
export function log2Det(x) {
  let e = 0;
  let m = x;
  // Exact: multiplying or dividing a binary float by 2 only shifts the exponent.
  while (m >= 2) { m = m / 2; e = e + 1; }
  while (m < 1) { m = m * 2; e = e - 1; }
  // Centre the mantissa about 1 so the series argument stays small.
  if (m > SQRT2) { m = m / 2; e = e + 1; }

  const z = (m - 1) / (m + 1);
  const z2 = z * z;
  // Horner over the odd atanh coefficients 2/(2k+1), highest term first.
  // HORNER OVER THE ODD atanh COEFFICIENTS, AS A LOOP. Bit-for-bit the same
  // sequence of operations the explicit chain performed: the first iteration is
  // `0 * z2 + 2/19`, and `0 * z2` is exactly 0 for the non-negative z2 here, so the
  // seed is exactly the `2/19` the chain started from. `2 / k` is a correctly-rounded
  // division of two exact doubles, identical to the folded literal it replaces.
  let s = 0;
  for (let k = 19; k >= 1; k -= 2) s = s * z2 + 2 / k;
  const lnM = z * s;
  return e + lnM * LOG2E;
}


/**
 * e^x — the drop-in for `Math.exp` in seeded code.
 *
 * e^x = 2^(x * log2(e)). exp(0) is EXACTLY 1: a zero exponent drives the series to its
 * constant term with no doubling, so the identity is structural rather than lucky.
 * Non-finite inputs answer as the platform does, so swapping this in cannot change a
 * boundary case.
 * @param {number} x
 * @returns {number}
 */
export function detExp(x) {
  if (x === 0) return 1;
  if (Number.isNaN(x)) return NaN;
  if (x === Infinity) return Infinity;
  if (x === -Infinity) return 0;
  // ⭐ NOT `exp2Det(x * LOG2E)`. That product rounds, and the rounding becomes an error
  // in the exponent worth ~1.1e-16 per unit of |x| — measured at 4.1e-14 across the
  // softmax domain, twice the charter's budget. The Cody-Waite reduction below removes
  // it: `n * LN2_HI` is EXACT, so the reduced argument carries no reduction error at all.
  const n = Math.floor(x * LOG2E + 0.5);
  if (n >= EXP2_OVERFLOW_AT) return Infinity;
  if (n <= EXP2_UNDERFLOW_AT) return 0;
  const r = (x - n * LN2_HI) - n * LN2_LO;   // |r| <= 0.3466
  return scaleByPow2(1 + expm1Small(r), n);
}

/**
 * e^x - 1, accurate for small x — the primitive `detTanh` needs and a drop-in for
 * `Math.expm1` should a site ever want it. Small arguments go through the cancellation-
 * free series; large ones can form the difference safely, because there e^x is nowhere
 * near 1.
 * @param {number} x
 * @returns {number}
 */
export function detExpm1(x) {
  if (x === 0) return 0;
  if (Number.isNaN(x)) return NaN;
  if (x > -0.35 && x < 0.35) return expm1Small(x);
  return detExp(x) - 1;
}

/**
 * ln(x) — the drop-in for `Math.log` in seeded code.
 *
 * ln(x) = log2(x) * ln(2). ln(1) is EXACTLY 0 (the centred series argument is exactly
 * zero at m = 1, so every term vanishes). The domain rails answer as the platform does:
 * ln(0) is -Infinity, a negative argument is NaN.
 * @param {number} x
 * @returns {number}
 */
export function detLn(x) {
  if (x === 1) return 0;
  if (Number.isNaN(x) || x < 0) return NaN;
  if (x === 0) return -Infinity;
  if (x === Infinity) return Infinity;
  return log2Det(x) * LN2;
}

/**
 * log10(x) — the drop-in for `Math.log10` in seeded code.
 *
 * log10(x) = log2(x) * log10(2). log10(1) is EXACTLY 0 for the same structural reason as
 * ln(1). NOTE FOR THE SHIFT RECORD: this is NOT exact at the other powers of ten —
 * `Math.log10(10)` is exactly 1 on V8, while this returns 1 to within the measured
 * budget. Every log10 site in the census divides the result (by 5 or by 8) and feeds a
 * clamp or a threshold, so the difference is a declared, measured shift and not a
 * special case worth buying (Q-T13-2: ONE kernel grade, never per-site tuning).
 * @param {number} x
 * @returns {number}
 */
export function detLog10(x) {
  if (x === 1) return 0;
  if (Number.isNaN(x) || x < 0) return NaN;
  if (x === 0) return -Infinity;
  if (x === Infinity) return Infinity;
  return log2Det(x) * LOG10_2;
}




/**
 * THE FRACTIONAL-POWER SITES keep using `detPow` from `./detPow.js` as minted — this
 * module deliberately exports no second `detPow`, so the tree has exactly ONE spelling of
 * that name and nobody has to ask which one a call site meant.
 */

/** Exposed for the precision suites; not part of the kernel's consumer surface. */
export const __internals = Object.freeze({ log2Det, expm1Small, LOG2E, LN2, LOG10_2, SQRT2 });
