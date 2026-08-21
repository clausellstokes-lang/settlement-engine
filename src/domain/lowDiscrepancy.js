/**
 * lowDiscrepancy.js — THE ONE CELL SUBSAMPLER (the Weyl sampler, single writer).
 *
 * Extracted verbatim from steadingTopography.js (W-E) when W-G needed the same
 * sampler for realm-scale candidate enumeration. Two independent copies of a
 * sampler is exactly the fork that lets one lane silently regress while the other
 * stays correct, so the implementation lives here once and both lanes import it.
 *
 * WHY NOT AN ARITHMETIC STRIDE (the measured reason, carried over from W-E): an
 * evenly spaced integer stride ALIASES against a grid pack's row width. Measured
 * on a 12-wide fixture, a stride of 6 selected two columns and made the map's
 * entire mountain ridge structurally unreachable, so a mining camp could never
 * find rock that was plainly inside the parent's country. The golden-ratio
 * additive recurrence has no such resonance at any width.
 *
 * ZERO IMPORTS BY DESIGN. This is a leaf of leaves: both importers are lazy
 * chunks that must never re-parent an eager closure, and a sampler that pulls in
 * nothing can never be the module that does it.
 *
 * @enforced-by tests/domain/steadingTopography.test.js
 * @enforced-by tests/domain/autoplacement.test.js
 */

/** The golden-ratio conjugate — the additive-recurrence (Weyl) constant. */
export const PHI_CONJUGATE = 0.6180339887498949;

/**
 * A LOW-DISCREPANCY subset of `length` indices, `count` of them, ascending.
 * Deterministic and pure: a function of (length, count) alone, no rng.
 *
 * @param {number} length @param {number} count @returns {number[]}
 */
export function spreadIndices(length, count) {
  /** @type {number[]} */
  const out = [];
  if (!(length > 0) || !(count > 0)) return out;
  if (count >= length) {
    for (let i = 0; i < length; i += 1) out.push(i);
    return out;
  }
  const used = new Set();
  let x = 0;
  for (let k = 0; k < count * 8 && out.length < count; k += 1) {
    x = (x + PHI_CONJUGATE) % 1;
    const i = Math.min(length - 1, Math.floor(x * length));
    if (used.has(i)) continue;
    used.add(i);
    out.push(i);
  }
  return out.sort((a, b) => a - b);
}
