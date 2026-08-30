/**
 * proseSelection.js — the deterministic variant-SELECTION kernel, and NOTHING
 * else. A zero-import leaf, deliberately.
 *
 * WHY THIS FILE EXISTS AT ALL. `pickLine` and its FNV-1a hash were minted inside
 * `worldPulse/eventProse.js`, which is the right home for the POOLS and the wrong
 * home for the FUNCTION. That module is 1,100+ lines of authored prose over
 * ~2,400 lines of frozen pool closure, it flattens those pools at module scope,
 * and its own docblock pins it to the LAZY engine chunk ("imported only by the
 * lazy worldPulse sim kernels"). No display module imports it, and none should:
 * a render-time namer that wanted three lines of hashing would have dragged the
 * whole generation-time corpus — and its module-scope flatten — behind it.
 *
 * THE CURE IS THE HOUSE IDIOM: move the FUNCTION, not the chunk pin (the
 * deityConstants / stablePart / exportPosture / userRouteIdentity precedent).
 * The selection kernel lives here with zero imports; `eventProse.js` re-exports
 * both symbols VERBATIM so every existing engine import site and test is
 * unchanged; and render-time consumers (domain/display/*) import THIS leaf.
 *
 * IT IS ALSO THE SEVENTH-COPY FENCE. Six independent `fnv1a32` transcriptions
 * already exist in this tree (design/organic/ornament/fnv.js, pdf/primitives/
 * Editable.jsx, npcResidency.js, npcLedger.js, newsVoice.js, and this one's
 * origin) — a known drift surface. A new consumer must import this leaf rather
 * than mint a seventh.
 *
 * KEEP IT IMPORT-FREE. An import added here re-parents whatever it reaches into
 * every consumer's chunk, which is the exact defect this file cures.
 *
 * ⛔ SEED HANDLING AND POOL ORDERING ARE GOLDEN-BOUND. The generation-time pools
 * persist their picked string into save/golden data, so any change to the hash,
 * the modulo, or the canonical-at-zero rule moves same-seed history. This is a
 * pure re-home: the two functions are byte-for-byte what eventProse.js carried.
 */

/**
 * FNV-1a 32-bit — the pure variant-selection hash (no rng, no Date). Matches the
 * newsVoice.js idiom. @param {string} str @returns {number} */
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
 * @typedef {string | ((interp: Record<string, unknown>) => string)} ProseVariant
 * A pool entry: a fixed string, or a function that interpolates the semantic tokens.
 */

/**
 * Pick a phrasing variant deterministically from a pool. A FALSY seed ⇒ index 0 (the
 * canonical string), so seedless callers are byte-identical. A function entry is resolved
 * with `interp`. Pure.
 * @param {readonly ProseVariant[]} pool
 * @param {string | null | undefined} seed
 * @param {Record<string, unknown>} [interp]
 * @returns {string}
 */
export function pickLine(pool, seed, interp = {}) {
  if (!Array.isArray(pool) || pool.length === 0) return '';
  const idx = seed ? fnv1a32(seed) % pool.length : 0;
  const v = pool[idx];
  return typeof v === 'function' ? String(v(interp)) : String(v);
}
