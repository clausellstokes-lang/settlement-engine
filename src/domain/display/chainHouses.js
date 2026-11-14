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
import { resourceDisplayName } from './resourceDisplayName.js';

/** A regular-expression literal of a plain string. @param {string} s */
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * THE HOUSES THAT DO A CHAIN'S WORK HERE (R2-CODE-B-SIDE item 3; round three's #506 HIGH "Merchant guilds (3-8) ·
 * Merchant guilds (15-40)" over a roster holding "Merchant guilds (50-100+)", #1370 HIGH, #368, #931, #1157, the
 * increment's "Cartographer's guild" where the roster holds "Cartographer's workshop"). A chain's
 * `processingInstitutions` are the chain TEMPLATE's patterns that matched the roster, and a template name is not a
 * house: printed as it stood, the card named ranks the town lacks ("Adventurers' guild" beside the town's one
 * charter hall) and houses it does not hold ("Annual fair" for its "Major annual fairs"). THE RULING: the card
 * names the houses on the town's live roster that do that work, each by its label (institutionHouseLabel); where the
 * roster holds a house of the same trade under another name, that house is named; where it holds none, no house
 * is named as present. The trade is read as the generator reads it (computeActiveChains.js ::
 * fuzzyProcessorMatch: the pattern's first twelve letters), held to the start of a word, so "Mill" is not read
 * into "Sawmill". A house named twice is named once; every name is a roster house, so `present` is always true.
 * OVERLAP, NAMED FOR THE JOIN: the third leaves lane holds a reader of "which roster houses finish a good" (its
 * finisher rule, on its own branch, not on this tree); this leaf answers the chain card's narrower question from
 * the names alone and copies none of it: the seat that joins the lanes makes them one. Pure: no draw, no write; the record does not move.
 * @param {ReadonlyArray<unknown>} patterns the chain's `processingInstitutions`
 * @param {ReadonlyArray<unknown>} instNames the settlement's institution names, raw
 * @returns {Array<{ name: string, present: boolean }>}
 */
export function chainHousesOf(patterns, instNames) {
  const rawNames = (Array.isArray(instNames) ? instNames : []).map((n) => String(n || '')).filter(Boolean);
  /** @type {Array<{ name: string, present: boolean }>} */
  const out = [];
  const seen = new Set();
  for (const pattern of Array.isArray(patterns) ? patterns : []) {
    const p = String(pattern || '').toLowerCase();
    if (!p) continue;
    // THE CHAIR'S RULING (e) (2026-11-13 19:05; W2-C-LEAVES' #195 #196): a house the roster holds ONLY as a road to
    // another place's ("Access to external mill", "Access to parish church") is not worked here; the card names the
    // roster's own row, in the words the page already uses for it. An "Access to …" pattern names that row alone;
    // any other pattern names the roster's own houses of its trade, and the access row only where it is all there is.
    let houses;
    if (p.startsWith('access to')) houses = rawNames.filter((n) => n.toLowerCase() === p);
    else {
      const trade = new RegExp(`(?:^|[\\s'"(-])${escapeRe(p.slice(0, 12))}`, 'i');
      const ofTrade = rawNames.filter((n) => trade.test(n));
      const own = ofTrade.filter((n) => !n.toLowerCase().startsWith('access to'));
      houses = own.length ? own : ofTrade;
    }
    for (const house of houses) {
      const name = institutionHouseLabel(house);
      if (seen.has(name)) continue;
      seen.add(name);
      out.push({ name, present: true });
    }
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
 * COMPOSED WITH COHERENCE-AGREE-6 F1 (R2-CODE-B-7, at the merge of the line 976db5b19): `printed` is what the page's
 * one rename leaf says the chain prints under (chainPrintName.js :: chainPrintName(chain, town)). Where it renamed the
 * source (a toll's "Harbour traffic" on a port), the record's condition belongs to the catalogue's ground it replaced
 * (crossroads_position, `absent` off a crossroads), and the access the rename names is the town's own (the leaf
 * renames only where the town has it): the source is that access. Given nothing printed, or nothing renamed, the
 * ruling above reads the record, unchanged.
 * @param {unknown} chain an active chain, as the record holds it (never one already renamed by the leaf)
 * @param {{ resource?: unknown } | null} [printed] chainPrintName(chain, town) of the same chain
 * @returns {string | null} the resource to print as the chain's source, or null
 */
export function chainSourceOf(chain, printed = null) {
  if (!chain || typeof chain !== 'object') return null;
  const c = /** @type {{ resource?: unknown, resourceCondition?: unknown, resourceInputAvailable?: unknown, resourceDepleted?: unknown, substituteActive?: unknown, resourceInputKey?: unknown, resourceInputCondition?: unknown }} */ (chain);
  const resource = typeof c.resource === 'string' && c.resource ? c.resource : null;
  if (!resource) return null;
  if (printed && printed.resource !== resource) return typeof printed.resource === 'string' && printed.resource ? printed.resource : null;
  if (c.resourceCondition === 'absent') return substituteOf(c);
  if (c.resourceCondition == null && c.resourceInputAvailable === false && !c.resourceDepleted) return null;
  return resource;
}

/**
 * THE SUBSTITUTE A CHAIN RUNS ON (R2-CODE-B-13, the reader's M11; a count falling is not a cure): where the catalogue's
 * ground is absent, the chain model may run the chain on another input the town HAS (`substituteActive`, with
 * `resourceInputKey` the input and `resourceInputCondition` 'available': Livestock & Dairy on alpine pastures,
 * r2r-hamlet-2; fishing on river fisheries, r2r-hamlet-16). That input is the chain's true "From", named in the
 * Resources tab's words (resourceDisplayName). Anything less than an available substitute names nothing, as before.
 * @enforced-by tests/domain/chainSourceSubstitute.test.js
 * @param {{ substituteActive?: unknown, resourceInputKey?: unknown, resourceInputAvailable?: unknown, resourceInputCondition?: unknown }} c
 * @returns {string | null}
 */
function substituteOf(c) {
  if (c.substituteActive !== true || c.resourceInputAvailable !== true || c.resourceInputCondition !== 'available') return null;
  return typeof c.resourceInputKey === 'string' && c.resourceInputKey ? (resourceDisplayName(c.resourceInputKey) || null) : null;
}
