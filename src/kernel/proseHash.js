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

/**
 * The 32-bit finalizer (murmur3 fmix32): every input bit reaches every output bit.
 * Pure — no rng, no clock.
 * @param {number} h @returns {number} an unsigned 32-bit integer
 */
export function mix32(h) {
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/**
 * The mixed keyed pick: `pickVariant`'s exact contract, with the hash mixed before the modulo.
 *
 * Why it exists: FNV-1a's low bits never mix — the low two bits of `fnv1a32` depend only on
 * the low two bits of each key character, in order — so for a pool of 2, 4, 8 or 16, keys
 * that differ only in the high bits of their characters all take the same line. New pools
 * use this pick. `pickVariant` stays exactly as it is, because births already in production
 * draw their prose with it and that prose must not move.
 *
 * Contract (same as `pickVariant`): non-array or empty pool → undefined; single-entry pool →
 * that entry; ANY falsy seed → index 0 (canonical-at-zero). Zero PRNG draws.
 * @template T
 * @param {readonly T[]} pool
 * @param {string | number | null | undefined} seed
 * @returns {T | undefined}
 */
export function pickVariantMixed(pool, seed) {
  if (!Array.isArray(pool) || pool.length === 0) return undefined;
  if (pool.length === 1 || !seed) return pool[0];
  return pool[mix32(fnv1a32(String(seed))) % pool.length];
}

/**
 * A CONTENT ADDRESS: the key of a table by a line's text (e.g. `hookThemes.js :: themeOfText` looking a hook's
 * theme up in its digest). It is NEVER a choice: it selects nothing from a pool, it names the text it was given.
 * A keyed pick goes through `fnv1a32`, `pickVariant` or `pickVariantMixed`, which the fork census counts
 * (tests/generators/generationForkCensus.test.js A6); `textKey` reaches `fnv1a32` by an intra-module call, so
 * the census does not count it, and its importers under src/ are a closed list that test holds.
 * @param {string} str @returns {number} the unsigned 32-bit `fnv1a32(str)`
 */
export function textKey(str) {
  return fnv1a32(str);
}
