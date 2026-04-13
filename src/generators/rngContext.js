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

/** Set the active PRNG (called by pipeline runner before each step). */
export function setActiveRng(rng) {
  _activeRng = rng;
}

/** Clear the active PRNG (called after pipeline completes). */
export function clearActiveRng() {
  _activeRng = null;
}

/** Get the active PRNG or null. */
export function getActiveRng() {
  return _activeRng;
}

// ── Drop-in replacements for Math.random-based helpers ──────────────────────

/** 0..1 random float. Uses seeded PRNG if active, else Math.random. */
export function random() {
  return _activeRng ? _activeRng.random() : Math.random();
}

/** True with probability p. */
export function chance(p) {
  return (_activeRng ? _activeRng.random() : Math.random()) < p;
}

/** Pick a random element from an array. */
export function pick(arr) {
  if (!arr || arr.length === 0) return undefined;
  return arr[Math.floor((_activeRng ? _activeRng.random() : Math.random()) * arr.length)];
}

/** Random integer in [min, max] inclusive. */
export function randInt(min, max) {
  return Math.floor((_activeRng ? _activeRng.random() : Math.random()) * (max - min + 1)) + min;
}

/** Fisher-Yates shuffle in place. Returns the array. */
export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor((_activeRng ? _activeRng.random() : Math.random()) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Weighted random pick. items[i] has weight weights[i]. */
export function weightedPick(items, weights) {
  const total = weights.reduce((s, w) => s + w, 0);
  let roll = (_activeRng ? _activeRng.random() : Math.random()) * total;
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return items[i];
  }
  return items[items.length - 1];
}
