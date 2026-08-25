/**
 * src/kernel/math.js — the ONE clamp primitive (code-quality-4).
 *
 * Before this module, clamp / clamp01 was hand-rolled ~70 times across the engine
 * with THREE divergent non-finite policies:
 *
 *   - PASSTHROUGH   `(x < 0 ? 0 : x > 1 ? 1 : x)` / `Math.max(lo, Math.min(hi, x))`
 *                   — NaN rides straight through; +Infinity clamps to hi, -Infinity
 *                   to lo. A malformed value survives the clamp.
 *   - COERCE        `Math.max(0, Math.min(1, Number(v) || 0))`
 *                   — NaN / null / '' → 0, but a string coerces (Number('5') → 5)
 *                   and +Infinity still clamps to hi.
 *   - ISFINITE      `Number.isFinite(x) ? Math.max(lo, Math.min(hi, x)) : lo`
 *                   — any non-finite input clamps to the LOW bound; nothing
 *                   non-finite survives.
 *
 * On FINITE numeric inputs all three agree — so no current byte-identity break is
 * demonstrated. They diverge ONLY on the non-finite / non-numeric edge, which in a
 * byte-identity determinism engine is exactly where a malformed ledger value
 * silently makes one mover's output disagree with a neighbour's, and every new
 * mover inherits whichever variant it was written next to.
 *
 * POLICY (explicit, deliberate): a non-finite input — NaN, +Infinity, -Infinity —
 * is not a number the engine may act on, so it clamps to the LOW bound (`lo`, or 0
 * for clamp01) and never rides through. This is the strictest of the three
 * policies, chosen because a determinism engine must never let a non-finite value
 * propagate (worldpulse review [code-quality-4]: "a non-finite value must never
 * silently ride through"). Non-numeric inputs (strings, null, undefined, objects)
 * are also non-finite under Number.isFinite, so they too clamp to `lo` — callers
 * that mean to coerce a numeric string must do so BEFORE calling this.
 *
 * ADOPTION: new engine code MUST import these instead of re-rolling a local copy.
 * The source-scan ratchet (tests/lint/clampPrimitive.test.js) baselines the
 * remaining local copies and blocks any NEW local clamp/clamp01 definition
 * (shrink-only). Existing local copies are migrated only where the local variant
 * is provably byte-identical to this policy on ALL inputs (parity-proven in
 * tests/kernel/clampPrimitive.parity.test.js); copies with divergent non-finite
 * semantics are left frozen in the baseline, not silently changed.
 *
 * Pure + host-free (no Date, Math.random, Intl, or locale) — belongs in the kernel
 * determinism-primitive layer alongside prng/rngContext.
 */

/**
 * Clamp `x` into the inclusive range [lo, hi]. A non-finite `x` clamps to `lo`.
 * @param {number} x
 * @param {number} lo
 * @param {number} hi
 * @returns {number}
 */
export function clamp(x, lo, hi) {
  return Number.isFinite(x) ? Math.max(lo, Math.min(hi, x)) : lo;
}

/**
 * Clamp `x` into [0, 1]. A non-finite `x` clamps to 0.
 * @param {number} x
 * @returns {number}
 */
export function clamp01(x) {
  return Number.isFinite(x) ? Math.max(0, Math.min(1, x)) : 0;
}
