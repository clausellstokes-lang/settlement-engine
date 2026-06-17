/**
 * domain/clone.js — the single sanctioned deep-clone for hot paths.
 *
 * structuredClone is faster than JSON.parse(JSON.stringify(...)) and preserves
 * Dates/Maps/Sets/undefined-valued keys correctly. It throws on non-cloneable
 * values (functions, class instances); our cloned values are plain persisted
 * state (settlement/systemState/mapState/campaign), so that never happens — but
 * we keep a JSON fallback for defense-in-depth (some call sites already used
 * exactly this try/catch). eslint forbids bare JSON.parse(JSON.stringify) on the
 * store/domain hot paths EXCEPT this file (the sole sanctioned clone seam).
 *
 * @param {any} value
 * @returns {any}
 */
export function deepClone(value) {
  try {
    return structuredClone(value);
  } catch {
    return JSON.parse(JSON.stringify(value));
  }
}
