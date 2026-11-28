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
 * The rendezvous pick (point 120, D13 STABLE-PICKS): the line with the HIGHEST
 * `mix32(fnv1a32('<slotKey>::<id>'))`, where `id` is the line's own id (`idOf(line)`).
 *
 * Why it exists: a modulus pick (`pickVariant`, `pickVariantMixed`) indexes the list by position, so any edit
 * to a pool re-deals the line of keys that never drew the edited line. Here each line competes on its own
 * hash: removing a line that was not the pick leaves the pick; removing the pick gives the next highest;
 * adding a line moves only the keys for which the new line hashes highest (about 1 in n+1); the order of
 * the list does not matter.
 *
 * Contract: non-array or empty list → undefined; ANY falsy key → the first line (as the old pick did); a
 * tie of hashes goes to the SMALLER id (by string). Pure: zero PRNG draws, no clock.
 * @template T
 * @param {readonly T[]} lines
 * @param {string | number | null | undefined} slotKey
 * @param {(line: T) => string} idOf
 * @returns {T | undefined}
 */
export function pickRendezvous(lines, slotKey, idOf) {
  if (!Array.isArray(lines) || lines.length === 0) return undefined;
  if (!slotKey) return lines[0];
  let best = rendezvousEntry(lines[0], slotKey, idOf);
  for (let i = 1; i < lines.length; i += 1) {
    const entry = rendezvousEntry(lines[i], slotKey, idOf);
    if (rendezvousBefore(entry, best) < 0) best = entry;
  }
  return best.line;
}

/**
 * THE WHOLE LIST IN RENDEZVOUS RANK (point 121, TAIL-PICKS): highest `mix32(fnv1a32('<slotKey>::<id>'))` first, a tie
 * to the SMALLER id (by string) — the one comparison `pickRendezvous` uses, so `pickRendezvous(l, k, f)` is always
 * `rankRendezvous(l, k, f)[0]`. A walk down the rank is "the next line for the next one" with no position in it: the
 * declaring door's ranked mode (`facts/drawDeclared.js`) and a slot that skips the lines it may not print read it.
 * Contract: non-array or empty list → []; ANY falsy key → the list in its own order. Pure; a new array.
 * @template T
 * @param {readonly T[]} lines
 * @param {string | number | null | undefined} slotKey
 * @param {(line: T) => string} idOf
 * @returns {T[]}
 */
export function rankRendezvous(lines, slotKey, idOf) {
  if (!Array.isArray(lines) || lines.length === 0) return [];
  if (!slotKey) return [...lines];
  return lines.map((line) => rendezvousEntry(line, slotKey, idOf)).sort(rendezvousBefore).map((entry) => entry.line);
}

/**
 * @template T
 * @typedef {{ line: T, id: string, h: number }} RendezvousEntry
 */

/**
 * @template T
 * @param {T} line @param {string | number} slotKey @param {(line: T) => string} idOf
 * @returns {RendezvousEntry<T>}
 */
function rendezvousEntry(line, slotKey, idOf) {
  const id = String(idOf(line));
  return { line, id, h: mix32(fnv1a32(`${slotKey}::${id}`)) };
}

/**
 * The rank's one comparison: the higher hash first, a tie to the smaller id. Negative when `a` ranks before `b`.
 * @template T
 * @param {RendezvousEntry<T>} a @param {RendezvousEntry<T>} b
 * @returns {number}
 */
function rendezvousBefore(a, b) {
  if (a.h !== b.h) return b.h - a.h;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}
