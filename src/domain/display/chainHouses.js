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

/**
 * THE GROUND A CHAIN DRAWS ON, as a reader is told it (R2-CODE-B round 3, ruling (d); the first seat's #804:
 * "Hunting grounds" printed as an entrepôt fur chain's "From" in a town the record says has none). A chain
 * carries its resource's own condition (`resourceCondition`, written by the chain model): "absent" says the
 * ground is not here, the goods come in by trade. The card then names no ground for it; the trade it runs on
 * stays where the card already says it (its imports, its entrepôt line). A depleted ground is still the
 * town's and keeps its "(depleted)" (the card's own read). A record older than the condition field reads the
 * input's own flag the same way: no input here, and not depleted. Pure: no draw, no write.
 * @param {unknown} chain an active chain
 * @returns {string | null} the resource to print as the chain's source, or null
 */
export function chainSourceOf(chain) {
  if (!chain || typeof chain !== 'object') return null;
  const c = /** @type {{ resource?: unknown, resourceCondition?: unknown, resourceInputAvailable?: unknown, resourceDepleted?: unknown }} */ (chain);
  const resource = typeof c.resource === 'string' && c.resource ? c.resource : null;
  if (!resource) return null;
  if (c.resourceCondition === 'absent') return null;
  if (c.resourceCondition == null && c.resourceInputAvailable === false && !c.resourceDepleted) return null;
  return resource;
}
