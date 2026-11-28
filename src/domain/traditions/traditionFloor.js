/**
 * domain/traditions/traditionFloor.js — THE FLOOR A TRADITION'S NEEDS ARE ASKED OVER, in one place (RULING 122-T-2).
 *
 * The record with every live house NOT of the hideable class (people/cardVeil.js :: isHideableHouse, read on the house
 * whole, before the strip: a house a DM can hide whole counts as absent), each less its function-eye fields
 * (traditionDescription.js :: withoutFunction: a house's NAME against the catalogue's tags). No veil state can move a
 * fact read over it. Read by the shared page's drawn set (shownTraditions.js :: drawnSetOf) and by genesis's draw
 * (genesis.js :: deriveFoundingTraditions, NEEDS_SINCE): one spelling, so the draw and the drawn set agree.
 * A leaf: it imports neither genesis.js nor shownTraditions.js. Pure: no draw, no clock, no write.
 */
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { isHideableHouse } from '../people/cardVeil.js';
import { withoutFunction } from './traditionDescription.js';

/**
 * @template T
 * @param {T} settlement the owner's record
 * @returns {T} the record at its floor (the record itself where it is not an object)
 */
export function traditionFloorOf(settlement) {
  if (!settlement || typeof settlement !== 'object') return settlement;
  return {
    ...settlement,
    institutions: liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (/** @type {unknown} */ (settlement)))
      .filter((i) => !isHideableHouse(/** @type {Record<string, unknown>} */ (i))).map(withoutFunction),
  };
}
