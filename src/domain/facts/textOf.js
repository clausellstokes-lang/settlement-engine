/**
 * domain/facts/textOf.js — THE TABLE-CONSUMER TOLERANCE (the chair's ruling R-C, 2026-11-05;
 * `docs/DESIGN_POOL_CENSUS.md` §3.1, the sibling column).
 *
 * A data-table line is a bare value (a string, or a template function of the name) or the
 * declared form `{ text, needs?, excludes?, crisis? }`. A consumer that has not yet been routed
 * through `drawDeclared` / `resolveDeclared` (CENSUS-1c's wiring) reads its line through this
 * helper, so the declaration is CARRIED now and enforced when the wiring lands. Byte-identical:
 * the bare value comes back as it is, and the declared form gives back its `text` unchanged.
 *
 * Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/facts/textOf.test.js
 */

/**
 * @template T
 * @param {T | { text: T, needs?: ReadonlyArray<string>, excludes?: ReadonlyArray<string>, crisis?: ReadonlyArray<string> }} line the bare value, or the declared row (its sibling column)
 * @returns {T}
 */
export function textOf(line) {
  if (line && typeof line === 'object' && !Array.isArray(line) && 'text' in line) {
    return /** @type {{ text: T }} */ (line).text;
  }
  return /** @type {T} */ (line);
}
