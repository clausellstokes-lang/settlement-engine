/**
 * domain/clone.js — the single sanctioned deep-clone for hot paths.
 *
 * structuredClone is preferred (faster than JSON round-tripping, and it
 * preserves Date/Map/Set/undefined-valued keys correctly), so it is tried
 * first. The JSON.parse(JSON.stringify) fallback is REQUIRED, not cosmetic:
 * several real call sites clone values structuredClone cannot handle —
 *   - Immer DRAFT proxies (store producers clone a draft mid-`set()`), and
 *   - settlement/event state that transiently carries functions or other
 *     non-structured-cloneable values (e.g. undo snapshots in
 *     events/undoEvent.js).
 * structuredClone throws a DataCloneError on those; the JSON path produces the
 * plain, serialisation-equivalent clone the callers actually expect (the same
 * shape they persist to Supabase as JSON). Persisted state is JSON-shaped, so
 * the two paths agree for it; the fallback only differs for the proxy/function
 * inputs that structuredClone refuses outright. Removing it regresses the
 * undo path and every store producer that clones a draft.
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
  } catch {
    return JSON.parse(JSON.stringify(value));
  }
}
