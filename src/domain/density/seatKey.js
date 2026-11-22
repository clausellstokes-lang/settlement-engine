/**
 * seatKey.js — the ONE join key for a power seat, in the density law's shared
 * vocabulary layer.
 *
 * Extracted from `generators/density/applyDensityLaw.js` at the DENS landing
 * (bill 7): the pulse seam consumes this key at tick time, and a domain module
 * importing the BIRTH writer for a three-line pure function dragged the whole
 * generator closure into the first-paint static graph
 * (`tests/build/domainGeneratorsBoundary.test.js` — move the shared leaf down a
 * layer, never widen the baseline). The body is verbatim; only the address moved.
 */

import { factionDisplayNameOf } from '../factionRefs.js';

/** The stable key for a power seat — the display name, which is what
 *  `factionAffiliation`, `ladderFactionKey` and `npcInFaction` all join on.
 *  @param {Record<string, unknown>} seat @returns {string} */
export function seatKey(seat) {
  return factionDisplayNameOf(seat) || String(seat?.faction || seat?.name || '');
}
