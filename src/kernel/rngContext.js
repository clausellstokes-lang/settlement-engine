/**
 * rngContext.js — Global PRNG context for deterministic generation.
 *
 * When the pipeline runs, it sets the active PRNG via setActiveRng().
 * All generator code that calls chance(), pick(), randInt(), shuffle(),
 * or weightedPick() from this module will use the seeded PRNG.
 *
 * FAIL CLOSED: when no PRNG is active, the helpers THROW. The old design
 * fell back to Math.random() with a warn-once — but an ambient unseeded draw
 * during what is meant to be a seeded run silently ships a settlement whose
 * stored seed no longer replays, on every device, forever. That failure mode
 * is invisible exactly where it matters (production generation), so the
 * fallback is gone in EVERY environment: test, dev, and prod all throw. A
 * loud crash at the draw site names the offending call and is fixable in
 * minutes; silent non-reproducibility is discovered months later from a
 * corrupted save. Every legitimate consumer either runs inside the pipeline's
 * setActiveRng scope or takes an explicit rng (see crossSettlementConflicts);
 * an audit found NO caller that needs ambient randomness.
 *
 * If a genuinely non-reproducible draw is ever needed OUTSIDE the seeded
 * pipeline (UI-only dice, cosmetic jitter), do not re-add a fallback here —
 * call unseededRandom() below at that specific site. It is deliberately a
 * separate, greppable name so "which draws are unseeded?" stays a one-line
 * search, and it refuses to run while a seeded generation is active.
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

/**
 * 0..1 random float from the seeded PRNG. Throws (fails CLOSED) when no
 * seeded context is active — see the header for why there is no fallback.
 */
function _roll() {
  if (_activeRng) return _activeRng.random();
  throw new Error(
    '[rngContext] a PRNG helper was called with no active seeded RNG. '
    + 'The result would not be reproducible from its seed, so this fails '
    + 'closed. Fix: run inside the pipeline (setActiveRng wraps generation), '
    + 'seed explicitly via setActiveRng(createPRNG(seed)) in tests, pass an '
    + 'explicit rng to the callee, or — for intentionally non-reproducible, '
    + 'non-pipeline draws only — call unseededRandom() from rngContext.js.',
  );
}

/**
 * THE explicit escape hatch: an intentionally non-reproducible 0..1 draw for
 * code that runs OUTSIDE the seeded pipeline and genuinely wants ambient
 * randomness. Never used by generators (the eslint determinism guard plus
 * this deliberate name keep it out of the seeded trees); grep for
 * `unseededRandom` to enumerate every sanctioned non-determinism site.
 * Throws if a seeded generation is active — inside setActiveRng scope an
 * "unseeded" draw is always a bug (use random() and the seed).
 */
export function unseededRandom() {
  if (_activeRng) {
    throw new Error(
      '[rngContext] unseededRandom() called while a seeded RNG is active — '
      + 'inside the pipeline every draw must come from the seed. Use random() '
      + '(or the other rngContext helpers) instead.',
    );
  }
  return Math.random();
}

// ── Drop-in replacements for Math.random-based helpers ──────────────────────

/** 0..1 random float from the seeded PRNG. Throws if none is active. */
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
