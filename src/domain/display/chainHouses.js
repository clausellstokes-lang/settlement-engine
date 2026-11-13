/**
 * domain/display/chainHouses.js — THE HOUSES THAT WORK A CHAIN HERE, as a reader is told them
 * (R2-CODE-B item 1; the cold list REVIEW-W2A-3, MEDIUM #269 #444: "Craft guilds (5-15) · Bowyers &
 * fletchers (guild)" on a metropolis whose roster holds "Craft guilds (100-150+)").
 *
 * An active chain's `processingInstitutions` are the chain definition's PATTERNS that matched the
 * roster (generators/computeActiveChains.js), not the roster's own houses: a pattern names one rung
 * of a ladder, and the join matches the other rungs too. Printed as it stands, a chain card named a
 * rank of a house the town does not hold, with the catalogue's count range. This leaf names each
 * pattern by the seam's house label (institutionDisplayName.js :: institutionHouseLabel: no count
 * range, no catalogue gate), so a pattern and the rank the roster holds of the same house read as
 * the one house they are. Nothing else is re-read: a pattern names what it named before, and a house
 * named twice is named once. `present` is the card's old first-word read, unchanged. Pure: no draw,
 * no write; the record does not move.
 */
import { institutionHouseLabel } from './institutionDisplayName.js';

/**
 * @param {ReadonlyArray<unknown>} patterns the chain's `processingInstitutions`
 * @param {ReadonlyArray<unknown>} instNames the settlement's institution names, raw
 * @returns {Array<{ name: string, present: boolean }>}
 */
export function chainHousesOf(patterns, instNames) {
  const names = (Array.isArray(instNames) ? instNames : []).map((n) => String(n || '').toLowerCase());
  /** @type {Array<{ name: string, present: boolean }>} */
  const out = [];
  const seen = new Set();
  for (const pattern of Array.isArray(patterns) ? patterns : []) {
    const p = String(pattern || '');
    if (!p) continue;
    const name = institutionHouseLabel(p);
    if (seen.has(name)) continue;
    seen.add(name);
    out.push({ name, present: names.some((n) => n.includes(p.toLowerCase().split(/[\s(]/)[0])) });
  }
  return out;
}
