/**
 * kernel/proseHash.js — pure, draw-free variant selection for generation-time prose.
 *
 * The CONTENT-GT-DOSSIER content-volume lane grows single-template dossier prose
 * (institution descriptions, historical-event descriptions, per-stress founding notes,
 * NPC relationship archetypes) into variant pools. Where the existing selection ALREADY
 * draws from the seeded PRNG (a single `pick`), the pool is grown in place and the draw
 * stays one `_roll()`. But several surfaces select by a FIXED field copy or a deterministic
 * index (zero rng draws): adding a `pick()` there would insert a draw and cascade the
 * settlement's forked step-stream. This module is the sanctioned zero-draw alternative.
 *
 * `fnv1a32` matches the `newsVoice.js` / `eventProse.js` idiom (same constants); a LOCAL
 * copy keeps this a pure kernel leaf rather than coupling the generators layer to a
 * worldPulse-domain module. It draws no rng and reads no clock, so a variant selection
 * consumes ZERO PRNG draws — the downstream `_roll()` stream is byte-identical to the
 * single-template baseline, and NO structural field of the settlement can move.
 *
 * LAW (mirrors eventProse.js): CANONICAL-AT-ZERO. Every pool's index-0 entry is the exact
 * pre-existing single-template string, and a FALSY seed selects index 0 — so any seedless
 * caller (and every existing unit test that passes no seed) is byte-identical; only the
 * seeded generation path varies.
 */

/**
 * FNV-1a 32-bit — the pure variant-selection hash (no rng, no Date, no state).
 * @param {string} str @returns {number} an unsigned 32-bit hash
 */
export function fnv1a32(str) {
  let h = 0x811c9dc5;
  const s = String(str);
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Deterministically select one entry from a variant pool by a stable seed string,
 * consuming ZERO PRNG draws. A falsy seed selects index 0 (the canonical entry). A
 * non-array or empty pool returns undefined; a single-entry pool returns that entry.
 * @template T
 * @param {readonly T[]} pool
 * @param {string | number | null | undefined} seed
 * @returns {T | undefined}
 */
export function pickVariant(pool, seed) {
  if (!Array.isArray(pool) || pool.length === 0) return undefined;
  // Canonical-at-zero: ANY falsy seed (null/undefined/''/0/NaN/false) selects index 0,
  // matching the eventProse.pickLine `seed ? … : 0` contract.
  if (pool.length === 1 || !seed) return pool[0];
  return pool[fnv1a32(String(seed)) % pool.length];
}
