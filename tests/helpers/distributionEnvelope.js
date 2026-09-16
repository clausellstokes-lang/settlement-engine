/**
 * tests/helpers/distributionEnvelope.js — exact binomial envelopes for rate/count
 * instruments (epistemic prevention, wave EP-1).
 *
 * THE CLASS: hand-picked integer bounds on a sampled rate can pass with EXACTLY ZERO
 * margin. The criminal-capture instrument asserted `capture count <= 4` against a
 * corpus of N=40 whose true rate put the expected count at 2 with a standard error of
 * 1.4 — the bound sat 1.4 sigma out, the measured value landed on 4, and the test was
 * green while carrying no power at all. A bound that the current behaviour touches is
 * not a guardrail; it is a coin flip that has not yet come up tails.
 *
 * THE CURE: derive the bound from the measured base rate and the corpus size, at an
 * explicit false-failure budget (alpha). The bound is then the smallest value the
 * behaviour is genuinely unlikely to reach, and its distance from the mean is stated
 * in sigmas so "is this instrument powerful enough?" has a number instead of a vibe.
 *
 * EXACT, NOT NORMAL. The tails are summed term-by-term in log space, so they are
 * correct at small N and at extreme p where a normal approximation is worst — which
 * is precisely where the hand-picked bounds went wrong. No dependencies: Lanczos
 * log-gamma, log-sum-exp accumulation. Verified against known values in
 * tests/lint/distributionEnvelopePower.test.js (n=40, p=0.05: P(X>=4) = 0.13815).
 *
 * DETERMINISM NOTE: the estate's corpora are seeded, so a "sample" here is a fixed set
 * of worlds, not a fresh draw. The binomial model is still the right instrument: it
 * answers "how far from the base rate could a corpus of this size plausibly land if
 * the underlying rate is unchanged?", which is exactly the question a tuning guardrail
 * must not answer by accident. A red therefore means the RATE moved, not that a die
 * rolled badly.
 *
 * Pure helper module: no describe/test here (a test file's exports re-register its
 * suites in every importer — see tests/helpers/dormancyOracle.js for the incident).
 */

/**
 * Lanczos coefficients, g = 7, n = 9 — the standard double-precision set. Accurate to
 * ~15 significant digits over the range these instruments use (n <= a few thousand).
 */
const LANCZOS_G = [
  676.5203681218851,
  -1259.1392167224028,
  771.32342877765313,
  -176.61502916214059,
  12.507343278686905,
  -0.13857109526572012,
  9.9843695780195716e-6,
  1.5056327351493116e-7,
];

/**
 * Natural log of the gamma function. Reflection for z < 0.5 keeps the series in its
 * accurate half-plane.
 * @param {number} z
 * @returns {number}
 */
export function logGamma(z) {
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  const shifted = z - 1;
  let series = 0.99999999999980993;
  for (let i = 0; i < LANCZOS_G.length; i += 1) series += LANCZOS_G[i] / (shifted + i + 1);
  const t = shifted + LANCZOS_G.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (shifted + 0.5) * Math.log(t) - t + Math.log(series);
}

/**
 * Memoized log(k!) for non-negative integers. The bound search walks a whole tail at a
 * time and re-derives the same factorials on every step; without the cache a lower-tail
 * search at n = 400 costs ~240k log-gamma evaluations. Keyed by integer only, so it is
 * exact-hit and never approximates.
 * @type {Map<number, number>}
 */
const LOG_FACTORIAL = new Map();

function logFactorial(k) {
  const cached = LOG_FACTORIAL.get(k);
  if (cached !== undefined) return cached;
  const value = logGamma(k + 1);
  LOG_FACTORIAL.set(k, value);
  return value;
}

/**
 * log C(n, k). Going through log-gamma rather than a factorial product keeps n in the
 * thousands from overflowing.
 * @param {number} n @param {number} k @returns {number}
 */
export function logChoose(n, k) {
  if (k < 0 || k > n) return -Infinity;
  if (Number.isInteger(n) && Number.isInteger(k)) {
    return logFactorial(n) - logFactorial(k) - logFactorial(n - k);
  }
  return logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1);
}

/**
 * log of the binomial pmf. `log1p(-p)` rather than `log(1 - p)` so a small p keeps its
 * precision in the (n - k) factor, which dominates the sum for rare events.
 * @param {number} n @param {number} p @param {number} k @returns {number}
 */
export function logBinomialPmf(n, p, k) {
  if (k < 0 || k > n) return -Infinity;
  if (p <= 0) return k === 0 ? 0 : -Infinity;
  if (p >= 1) return k === n ? 0 : -Infinity;
  return logChoose(n, k) + k * Math.log(p) + (n - k) * Math.log1p(-p);
}

/** Numerically stable sum of exponentials given in log space. */
function logSumExp(logTerms) {
  let max = -Infinity;
  for (const term of logTerms) if (term > max) max = term;
  if (max === -Infinity) return -Infinity;
  let total = 0;
  for (const term of logTerms) total += Math.exp(term - max);
  return max + Math.log(total);
}

/**
 * Exact upper tail P(X >= k) for X ~ Binomial(n, p).
 * @param {number} n trials @param {number} p per-trial rate @param {number} k threshold
 * @returns {number} probability in [0, 1]
 */
export function binomialTailAtLeast(n, p, k) {
  if (k <= 0) return 1;
  if (k > n) return 0;
  const terms = [];
  for (let i = k; i <= n; i += 1) terms.push(logBinomialPmf(n, p, i));
  return Math.min(1, Math.exp(logSumExp(terms)));
}

/**
 * Exact lower tail P(X <= k) for X ~ Binomial(n, p).
 * @param {number} n trials @param {number} p per-trial rate @param {number} k threshold
 * @returns {number} probability in [0, 1]
 */
export function binomialTailAtMost(n, p, k) {
  if (k < 0) return 0;
  if (k >= n) return 1;
  const terms = [];
  for (let i = 0; i <= k; i += 1) terms.push(logBinomialPmf(n, p, i));
  return Math.min(1, Math.exp(logSumExp(terms)));
}

/**
 * @typedef {object} Envelope
 * @property {number} bound the derived integer bound
 * @property {number} expected n * baseRate — the mean count
 * @property {number} sigma sqrt(n * baseRate * (1 - baseRate))
 * @property {number} margin |bound - expected| / sigma — the instrument's power, in sigmas
 * @property {number} tail the achieved tail probability AT the bound (always <= alpha)
 */

/**
 * The smallest (upper) or largest (lower) integer bound whose tail probability is at
 * or below `alpha`.
 *
 *   direction 'upper' — for `expect(count).toBeLessThanOrEqual(bound)`.
 *     bound = smallest b with P(X >= b) <= alpha.
 *   direction 'lower' — for `expect(count).toBeGreaterThanOrEqual(bound)`.
 *     bound = largest b with P(X <= b) <= alpha.
 *
 * The bound is the first value the behaviour is genuinely unlikely to REACH, so using
 * it with an inclusive matcher is conservative by exactly one step: a corpus landing
 * exactly ON the bound is already an alpha-level event and worth reading as a signal
 * even though the gate stays green. That one step of slack is deliberate — it keeps
 * the gate from reddening on the single most extreme plausible corpus.
 *
 * @param {{ n: number, baseRate: number, direction: 'upper'|'lower', alpha?: number }} spec
 * @returns {Envelope}
 */
export function envelopeBound({ n, baseRate, direction, alpha = 1e-4 }) {
  if (!Number.isInteger(n) || n <= 0) throw new Error(`envelopeBound: n must be a positive integer, got ${n}`);
  if (!(baseRate >= 0 && baseRate <= 1)) throw new Error(`envelopeBound: baseRate must be in [0, 1], got ${baseRate}`);
  if (!(alpha > 0 && alpha < 1)) throw new Error(`envelopeBound: alpha must be in (0, 1), got ${alpha}`);
  if (direction !== 'upper' && direction !== 'lower') {
    throw new Error(`envelopeBound: direction must be 'upper' or 'lower', got ${direction}`);
  }
  const expected = n * baseRate;
  const sigma = Math.sqrt(n * baseRate * (1 - baseRate));
  let bound;
  let tail;
  if (direction === 'upper') {
    // Search from 1 upward, not from the mean. The tail is monotone decreasing in b, so
    // walking up from the smallest candidate is provably the SMALLEST qualifying bound
    // for any alpha — starting at the mean would silently mis-answer a loose alpha.
    bound = 1;
    while (bound <= n && binomialTailAtLeast(n, baseRate, bound) > alpha) bound += 1;
    // p so extreme that even n successes are not an alpha-level event: the corpus cannot
    // distinguish anything, and n is the honest ceiling.
    if (bound > n) bound = n;
    tail = binomialTailAtLeast(n, baseRate, bound);
  } else {
    // Largest b with P(X <= b) <= alpha. Walking DOWN from n - 1 re-sums the whole
    // CDF below every probe — O(answer * n) pmf evaluations, which at n ~ 15,000
    // never finishes (EP-2D finding 5, calamity.test.js). One incremental ascending
    // CDF pass finds the crossing in O(answer) instead; the linear-space accumulator
    // can drift from the canonical log-space tail at the 1e-15 level, so the crossing
    // is then settled against binomialTailAtMost itself — the returned bound and tail
    // remain exactly the canonical function's answer, only the search got cheap.
    let cdf = 0;
    let candidate = -1;
    for (let k = 0; k <= n - 1; k += 1) {
      cdf += Math.exp(logBinomialPmf(n, baseRate, k));
      if (cdf > alpha) break;
      candidate = k;
    }
    bound = candidate < 0 ? 0 : candidate;
    while (bound > 0 && binomialTailAtMost(n, baseRate, bound) > alpha) bound -= 1;
    while (bound < n - 1 && binomialTailAtMost(n, baseRate, bound + 1) <= alpha) bound += 1;
    tail = binomialTailAtMost(n, baseRate, bound);
  }
  const margin = sigma > 0 ? Math.abs(bound - expected) / sigma : Infinity;
  return { bound, expected, sigma, margin, tail };
}

/**
 * @typedef {object} EnvelopeEntry
 * @property {string} id dotted identifier, e.g. 'capture.town.rate'
 * @property {string} file the instrument that reads this bound
 * @property {number} n corpus size the instrument actually runs
 * @property {number} baseRate the MEASURED per-trial rate (not a guess)
 * @property {string} baseMeasuredAt ISO date of the measurement
 * @property {number} baseMeasurementN samples behind baseRate (>= 400 by program law)
 * @property {'upper'|'lower'} direction
 * @property {number} alpha false-failure budget
 * @property {number} bound the LIVE bound the instrument asserts
 * @property {number} margin |bound - expected| / sigma for the LIVE bound
 * @property {string} measurementContext tree/commit the measurement was taken in
 * @property {boolean} loosenPending true when the derivation is LOOSER than the live
 *   bound; the live (tighter) bound stays in force and the derivation is queued for
 *   the owner. Never loosen a bound silently.
 * @property {boolean} [ratifiedStricterBound] true when the owner has resolved that
 *   pending choice by retaining the tighter live bound
 * @property {string} [notes]
 * @property {boolean} [pendingMigration] set on a totality roster row that has not been
 *   migrated to this helper yet; carries `rationale` instead of a derivation.
 * @property {string} [rationale] why the row is not yet migrated
 */

/**
 * Read one instrument's registered envelope out of the manifest. Tests read their
 * bound from here so a bound has exactly ONE home — a hardcoded copy in the test drifts
 * from its own provenance the moment either side moves.
 *
 * @param {{ entries: EnvelopeEntry[] }} manifest parsed tests/fixtures/distribution-envelopes.manifest.json
 * @param {string} id the entry id
 * @returns {EnvelopeEntry}
 */
export function readEnvelope(manifest, id) {
  const entries = (manifest && manifest.entries) || [];
  const entry = entries.find((candidate) => candidate.id === id);
  if (!entry) {
    const known = entries.map((candidate) => candidate.id).sort().join(`, `) || '(none)';
    throw new Error(
      `readEnvelope: no entry '${id}' in tests/fixtures/distribution-envelopes.manifest.json.`
      + ` Registered ids: ${known}. Add the entry (with its measured baseRate and provenance)`
      + ` rather than hardcoding a bound in the test.`,
    );
  }
  if (entry.pendingMigration) {
    throw new Error(
      `readEnvelope: entry '${id}' is still a totality-roster placeholder (pendingMigration).`
      + ` Measure its base rate at N >= 400, fill in the derivation fields, and drop the`
      + ` pendingMigration/rationale pair before reading it as a live bound.`,
    );
  }
  return entry;
}
