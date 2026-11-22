/**
 * detPow.js — VAR-1's DETERMINISTIC POWER KERNEL (DESIGN_FMG_WEAVE D7).
 *
 * WHY THIS EXISTS. The house bans transcendental Math built-ins and the `**` operator
 * in the seeded trees, and the ban is not superstition: ECMAScript specifies those as
 * IMPLEMENTATION-APPROXIMATED, so the same seed can fork across engines while lint,
 * goldens and the worker byte-identity pin — all same-engine — stay green. The
 * heightmap interpreter VAR-1 ports is built on fractional exponentiation: it raises a
 * blob's falloff to a per-graph power at every cell it spreads to. Porting it as-is
 * would import that fork straight into world generation.
 *
 * ⭐ THE BAN TARGETS THE BUILT-IN, NOT THE OPERATION (D7). IEEE-754 addition,
 * subtraction, multiplication and division are CORRECTLY ROUNDED by specification —
 * every conforming engine returns the identical bit pattern for the identical inputs.
 * So a power function assembled from nothing but those four operations is
 * engine-independent BY CONSTRUCTION, and needs no cross-engine CI to prove it. That
 * is the whole argument, and it is why this file contains no Math call other than
 * `Math.floor` (exact) and no `**` operator anywhere.
 *
 * THE DECOMPOSITION.  x^y = 2^(y * log2(x))  for x > 0.
 *   · log2 by range reduction to a centred mantissa, then the atanh series, whose
 *     terms fall off as z^2 with |z| <= 0.1716 after centring.
 *   · exp2 by splitting the exponent into an integer part (exact, by repeated
 *     doubling) and a fraction in [0,1) (a Taylor series in t = f*ln2, |t| <= 0.694).
 * Range reduction uses only multiplication and division BY TWO, which are exact in
 * binary floating point — the reduction introduces no error of its own, so the whole
 * error budget belongs to the two series.
 *
 * MEASURED, NOT ASSERTED: the accompanying suite compares this against the platform
 * `Math.pow` across the interpreter's real domain (heights 0..255 against all
 * twenty-six published blob/line powers) and pins the worst observed relative error.
 * Tests may call `Math.pow`; `tests/` is outside the scanned trees, and the platform
 * built-in is the reference here rather than the shipped path.
 */

/** 1 / ln(2), to double precision. A CONSTANT, not a computed transcendental. */
const LOG2E = 1.4426950408889634;
/** ln(2), to double precision. */
const LN2 = 0.6931471805599453;
/** sqrt(2) — the centring pivot for the mantissa. A constant, not a call. */
const SQRT2 = 1.4142135623730951;

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
function log2Det(x) {
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
 * 2^y for finite y, from + - * / only.
 *
 * The integer part is applied by repeated doubling (exact); only the fractional part
 * goes through the series, so the error never grows with the magnitude of y.
 * @param {number} y
 * @returns {number}
 */
function exp2Det(y) {
  let n = Math.floor(y);
  const f = y - n;              // f in [0,1)
  const t = f * LN2;            // t in [0, 0.6932]

  // e^t by Horner over 1/k!, highest term first. The first omitted term at the top
  // of the range is ~1e-13 relative — below the precision the callers can observe.
  let s = 1 / 6227020800;       // 1/13!
  s = s * t + 1 / 479001600;    // 1/12!
  s = s * t + 1 / 39916800;     // 1/11!
  s = s * t + 1 / 3628800;      // 1/10!
  s = s * t + 1 / 362880;       // 1/9!
  s = s * t + 1 / 40320;        // 1/8!
  s = s * t + 1 / 5040;         // 1/7!
  s = s * t + 1 / 720;          // 1/6!
  s = s * t + 1 / 120;          // 1/5!
  s = s * t + 1 / 24;           // 1/4!
  s = s * t + 1 / 6;            // 1/3!
  s = s * t + 1 / 2;            // 1/2!
  s = s * t + 1;                // 1/1!
  s = s * t + 1;                // 1/0!

  // Apply the integer part by exact doubling/halving.
  while (n > 0) { s = s * 2; n = n - 1; }
  while (n < 0) { s = s / 2; n = n + 1; }
  return s;
}

/**
 * THE DETERMINISTIC POWER FUNCTION — a drop-in for `x ** y` in seeded code.
 *
 * THE ZERO-BASE BRANCH IS DEFINED RATHER THAN INHERITED (A1.2.14 requires it stated).
 * `0 ** 0` is 1 by IEEE-754 and by ECMAScript, and this agrees: an exponent of zero
 * returns 1 for EVERY base, including zero and including a non-finite one. A zero base
 * with a positive exponent is 0, and with a negative exponent is Infinity. These are
 * the platform's own answers, chosen so that swapping this in for `**` cannot change a
 * boundary case.
 *
 * A NEGATIVE BASE IS REFUSED (NaN) RATHER THAN GUESSED. Real exponentiation of a
 * negative base is defined only at integer exponents, and the caller this kernel
 * exists for — heightmap blob falloff — raises non-negative heights only. Returning
 * NaN makes a negative base a loud defect at its first use instead of a plausible
 * number that would quietly become terrain.
 *
 * @param {number} x base
 * @param {number} y exponent
 * @returns {number}
 */
export function detPow(x, y) {
  // Exponent zero first: it answers for every base, non-finite ones included.
  if (y === 0) return 1;
  if (Number.isNaN(x) || Number.isNaN(y)) return NaN;
  // Exact shortcuts — and they are correctness, not speed: routing y === 1 through
  // the series would introduce error into a case that has an exact answer.
  if (y === 1) return x;
  if (x === 1) return 1;
  if (x === 0) return y > 0 ? 0 : Infinity;
  if (x < 0) return NaN;
  if (!Number.isFinite(x)) return y > 0 ? Infinity : 0;
  if (!Number.isFinite(y)) {
    // x is finite and positive here, and x === 1 is already handled.
    if (y > 0) return x > 1 ? Infinity : 0;
    return x > 1 ? 0 : Infinity;
  }
  return exp2Det(y * log2Det(x));
}

/** Exposed for the precision suite; not part of the kernel's consumer surface. */
export const __internals = Object.freeze({ log2Det, exp2Det });
