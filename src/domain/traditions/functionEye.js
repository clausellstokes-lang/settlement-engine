/**
 * domain/traditions/functionEye.js — A HOUSE LESS ITS FUNCTION-EYE FIELDS, FOR THE FLOOR (RULING 122-B-3, the eleventh chair,
 * 2026-11-28). A leaf: no import.
 *
 * WHY A COPY. `traditions/traditionFloor.js` read `withoutFunction` from `traditionDescription.js`, which carried the
 * description tables and the veil module (`display/galleryVeil.js`) into the advance worker (forty-four modules anew). The floor
 * now takes it from here, and this leaf holds ITS OWN COPY of the field names the veil's `function` eye removes. The reader's
 * path is unchanged: `traditionDescription.js` keeps deriving its names from the veil's declaration
 * (`CARD_KINDS.institution.fields.function`) and keeps its own `withoutFunction`.
 * THE COPY IS HELD EQUAL to the declaration, as a set and by result on born houses: if the veil's eye gains or loses a field,
 * this list must follow, or the traditions draw can lean on a hidden field.
 * @enforced-by tests/security/functionEyeCopy.test.js
 */

/** The keys a house's `function` eye removes: a copy of `galleryVeil.js :: CARD_KINDS.institution.fields.function`. */
export const FUNCTION_EYE_KEYS = Object.freeze(['tags', 'facets', 'serviceKeys']);

/**
 * A house less its function-eye fields (a copy; a house holding none is returned as it is): what a fact reads of a house
 * once the DM's `function` eye may be shut, its floor.
 * @param {unknown} i @returns {unknown}
 */
export function withoutFunction(i) {
  const house = /** @type {Record<string, unknown>} */ (i && typeof i === 'object' && !Array.isArray(i) ? i : {});
  if (!FUNCTION_EYE_KEYS.some((k) => k in house)) return i;
  /** @type {Record<string, unknown>} */
  const out = { ...house };
  for (const k of FUNCTION_EYE_KEYS) delete out[k];
  return out;
}
