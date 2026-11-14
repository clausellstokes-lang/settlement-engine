/**
 * W2-FIX-DATA-5 (2026-11-13; ROUND-3-CUT-INCREMENT ww-25, HIGH): A RESOURCE EVENT DECLARES ITS SIZE.
 * "Civic buildings or a cathedral raised from local quarry stone" printed in a thorp of 15 whose houses are timber and
 * wattle; its lasting effect names a quarrymen's guild with civic influence. Civic buildings and a cathedral are a size
 * error in a thorp or a hamlet (the chair's ruling of 2026-11-13), and no line of the Great Construction is true there.
 * The timeline's one pick among the resource events (`historyGenerator.js :: generateRelationshipEvent`) is kept, its
 * roll and the severity roll after it; a refused pick resolves draw-free to the next admitted event of the same list
 * (wrapping), and where none is admitted none is written (record 386, 4: silence is not a false sentence).
 */
import { declarationAdmits, declarationOf } from '../../domain/facts/factVocabulary.js';

/** What a resource event presumes, by its name (`tier`, the vocabulary's band). */
const RESOURCE_EVENT_NEEDS = Object.freeze({
  'The Great Construction': Object.freeze(['tier: ≥ village']),
});

/**
 * @param {{ name?: string } | null | undefined} event
 * @param {object | (() => object) | null} facts the history's facts (`hookFacts`); none: admitted (the caller's old shape)
 * @returns {boolean}
 */
export function resourceEventAdmitted(event, facts) {
  const needs = RESOURCE_EVENT_NEEDS[/** @type {keyof typeof RESOURCE_EVENT_NEEDS} */ (String(event?.name))];
  const f = typeof facts === 'function' ? facts() : facts;
  return !needs || f == null || declarationAdmits(declarationOf({ text: String(event?.name), needs }), /** @type {any} */ (f)).admitted;
}

/**
 * The resource event at the drawn index if admitted, else the next admitted one (wrapping); the drawn one when none is
 * (the caller then writes nothing).
 * @template {{ name?: string }} T @param {T[]} list @param {number} i @param {any} facts @returns {T}
 */
export function admittedResourceEvent(list, i, facts) {
  for (let k = 0; k < list.length; k++) {
    const e = list[(i + k) % list.length];
    if (resourceEventAdmitted(e, facts)) return e;
  }
  return list[i];
}
