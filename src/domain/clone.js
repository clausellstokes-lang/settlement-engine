/**
 * domain/clone.js — the single sanctioned deep-clone for hot paths.
 *
 * structuredClone is the PRIMARY path: it is faster than JSON round-tripping and
 * it faithfully preserves Date / Map / Set / RegExp / undefined-valued keys and
 * cyclic references. It is tried first, and for the overwhelmingly common case
 * (plain JSON-shaped settlement/event state, possibly carrying Dates) it is the
 * ONLY path taken — so for those inputs the clone is lossless.
 *
 * The JSON.parse(JSON.stringify) FALLBACK is REQUIRED, not cosmetic, because a
 * few real call sites clone values structuredClone refuses outright (throwing a
 * DataCloneError):
 *   - Immer DRAFT proxies (store producers clone a draft mid-`set()`), and
 *   - settlement/event state that transiently carries functions or other
 *     non-structured-cloneable values (e.g. undo snapshots in
 *     events/undoEvent.js).
 * For those inputs the JSON path produces the plain, serialisation-equivalent
 * clone the callers actually expect (the same shape they persist to Supabase as
 * JSON). Removing the fallback regresses the undo path and every store producer
 * that clones a draft.
 *
 * HONESTY about the fallback's lossiness: when the fallback IS taken, it is NOT
 * a faithful clone — JSON round-tripping drops functions and undefined-valued
 * keys, and CORRUPTS structured types the primary path preserves (Date → ISO
 * string, Map / Set → {}, RegExp → {}). The two paths only "agree" for already-
 * JSON-shaped inputs (no Date/Map/Set/function); the callers above feed exactly
 * such inputs once the offending proxy/function layer is stripped, which is why
 * the lossy fallback is acceptable for THEM but must not be relied on as a
 * general-purpose clone.
 *
 * SAFER fallback (defense-in-depth): only DataCloneError — the error
 * structuredClone raises for non-cloneable values — drops to the lossy JSON
 * path. Any OTHER failure (e.g. a RangeError from pathological depth, or a
 * getter that threw) is rethrown rather than silently masked behind a JSON
 * round-trip that would either throw again or quietly corrupt data. This keeps
 * the lossy path scoped to the exact case it exists for.
 *
 * Determinism: both paths are pure structural copies (no Math.random / Date.now
 * / locale-dependent ordering introduced), so the clone seam is replay-safe.
 *
 * eslint forbids bare JSON.parse(JSON.stringify) on the store/domain hot paths
 * EXCEPT this file (the sole sanctioned clone seam).
 *
 * @param {any} value
 * @returns {any}
 */
export function deepClone(value) {
  try {
    return structuredClone(value);
  } catch (err) {
    // Only the non-cloneable case (Immer drafts / functions) takes the lossy
    // JSON path; anything else is a real failure and must surface, not hide.
    if (err && /** @type {any} */ (err).name === 'DataCloneError') {
      return JSON.parse(JSON.stringify(value));
    }
    throw err;
  }
}
