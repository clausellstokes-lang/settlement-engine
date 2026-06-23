/**
 * rngContext.js — Global PRNG context for deterministic generation.
 *
 * When the pipeline runs, it sets the active PRNG via setActiveRng().
 * All generator code that calls chance(), pick(), randInt(), shuffle(),
 * or weightedPick() from this module will use the seeded PRNG.
 *
 * When no PRNG is active (legacy code path or tests), falls back
 * to Math.random() transparently.
 *
 * This avoids touching all 83 Math.random() call sites individually.
 * Instead, generators import from here instead of constants.js.
 */

let _activeRng = null;

/**
 * Set the active PRNG (called by pipeline runner before each step) and RETURN
 * the PRNG that was active before. Save/restore stack: a caller that wraps a
 * nested generation can capture this and hand it to clearActiveRng() to restore
 * the outer RNG instead of wiping it to null. Today generation is synchronous,
 * single-threaded and never nested, so the previous value is always null and the
 * behaviour is unchanged — this just makes future nested/batch/worker generation
 * safe from an inner clear silently dropping draws to the Math.random() fallback.
 * @param {*} rng
 * @returns {*} the previously-active PRNG (or null)
 */
export function setActiveRng(rng) {
  const prev = _activeRng;
  _activeRng = rng;
  return prev;
}

/**
 * Restore the active PRNG. Pass the value returned by the paired setActiveRng()
 * to restore the outer RNG; called with no argument it clears to null (the
 * existing "pipeline finished" behaviour).
 * @param {*} [prev]
 */
export function clearActiveRng(prev = null) {
  _activeRng = prev;
}

/** Get the active PRNG or null. */
export function getActiveRng() {
  return _activeRng;
}

// Tests and a few legacy paths legitimately call these helpers with no active
// RNG, so the Math.random() fallback must stay. But when it fires DURING what
// is meant to be a seeded run it silently ships a settlement whose stored seed
// no longer replays — the determinism footgun the audit flagged. Make it loud
// OUTSIDE of tests: one warning per process, so a real leak surfaces in dev/
// preview while the test suite (which uses the fallback by design) stays quiet.
// Pair with the ESLint ban on raw Math.random() in src/generators.
// Reach process via globalThis (cast to any): this file is in the tsc gate as
// browser code with no @types/node, so a bare `process` reference would not
// type-check. Undefined in the browser (warn fires in dev there); 'test' under
// vitest (warn stays quiet for the fallback-by-design test suite).
const _isTestEnv =
  /** @type {any} */ (globalThis)?.process?.env?.NODE_ENV === 'test';
let _warnedNoActiveRng = false;

/** 0..1 random float, from the seeded PRNG if active, else a noisy fallback. */
function _roll() {
  if (_activeRng) return _activeRng.random();
  if (!_warnedNoActiveRng && !_isTestEnv) {
    _warnedNoActiveRng = true;
    console.warn(
      '[rngContext] a PRNG helper was called with no active seeded RNG — '
      + 'falling back to Math.random(). The result is NOT reproducible from its '
      + 'seed; ensure setActiveRng() wraps the generation that called this.',
    );
  }
  return Math.random();
}

// ── Drop-in replacements for Math.random-based helpers ──────────────────────

/** 0..1 random float. Uses seeded PRNG if active, else Math.random. */
export function random() {
  return _roll();
}

/** True with probability p. */
export function chance(p) {
  return _roll() < p;
}

/** Pick a random element from an array. */
export function pick(arr) {
  if (!arr || arr.length === 0) return undefined;
  return arr[Math.floor(_roll() * arr.length)];
}

/** Random integer in [min, max] inclusive. */
export function randInt(min, max) {
  return Math.floor(_roll() * (max - min + 1)) + min;
}

/** Fisher-Yates shuffle in place. Returns the array. */
export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(_roll() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Weighted random pick. items[i] has weight weights[i]. */
export function weightedPick(items, weights) {
  const total = weights.reduce((s, w) => s + w, 0);
  let roll = _roll() * total;
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return items[i];
  }
  return items[items.length - 1];
}
