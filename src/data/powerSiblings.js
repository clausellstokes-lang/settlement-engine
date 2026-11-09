/**
 * The power area's DECLARED SIBLING TABLES (CENSUS-5c unit 1, 2026-11-05; the chair's ruling R-AB:
 * "a module over its line ceiling is split, never raised"). These tables stood beside their originals
 * in `src/generators/power/governanceNarrative.js` and `src/generators/power/rulingStructure.js`
 * (CENSUS-1c's shape), and pushed both modules past the `power/` 800-line ceiling
 * (`tests/generators/powerStructure.test.js`). They moved here byte-identical; both modules re-export
 * them, so every consumer reads the same frozen objects through the same import path.
 * Pure data: no imports, no draw.
 */

/**
 * DECLARED SIBLINGS (CENSUS-1c unit 1; the twin tables dissolved, `docs/DESIGN_POOL_CENSUS.md`
 * §3.1): the merchant-army baseline conflict (`deriveBaselineConflict`). The original stays where it is spelled above; the twin stands beside it here with
 * the complementary atom, and the site resolves a drawn key through `resolveSibling`. Retired from
 * `data/defenceTwinLines.js` (F10 unit 4), every twin to the byte.
 */
export const BASELINE_CONFLICT_SIBLINGS = Object.freeze({
  'A guild\'s private soldiers arrested a rival\'s factor. The public watch is refusing to intervene in what they call a \'merchant matter\'.': Object.freeze([
    Object.freeze({ text: 'A guild\'s private soldiers arrested a rival\'s factor. The public watch is refusing to intervene in what they call a \'merchant matter\'.', needs: Object.freeze(['soldiers']) }),
    Object.freeze({ text: 'A guild\'s hired guards arrested a rival\'s factor. The public watch is refusing to intervene in what they call a \'merchant matter\'.', twinOf: 'A guild\'s private soldiers arrested a rival\'s factor. The public watch is refusing to intervene in what they call a \'merchant matter\'.', excludes: Object.freeze(['soldiers']) }),
  ]),
  // CENSUS-5b unit 2 (2026-11-05): five baseline conflicts that presume a fact their branch does
  // not guarantee. Each twin is the chair's ruling (R-G; recorded with its share in
  // docs/CENSUS_5_LANE_2026-11-04.md, "CENSUS-5b"); this site is a T lookup, so a twin moves only
  // the births whose record refuses the original. The militia captain's branch is reached with NO
  // military institution, and the two market lines' branches with no market-named house.
  'The village militia captain is pushing for authority over disputes that the reeve used to handle.': Object.freeze([
    Object.freeze({ text: 'The village militia captain is pushing for authority over disputes that the reeve used to handle.', needs: Object.freeze(['militia']) }),
    Object.freeze({ text: 'The strongest armed household is pushing for authority over disputes that the reeve used to handle.', twinOf: 'The village militia captain is pushing for authority over disputes that the reeve used to handle.', excludes: Object.freeze(['militia']) }),
  ]),
  'The miller and the largest farming household are in dispute over prices and access.': Object.freeze([
    Object.freeze({ text: 'The miller and the largest farming household are in dispute over prices and access.', needs: Object.freeze(['institution: mill']) }),
    Object.freeze({ text: 'The largest farming household and the traders who buy from it are in dispute over prices and access.', twinOf: 'The miller and the largest farming household are in dispute over prices and access.', excludes: Object.freeze(['institution: mill']) }),
  ]),
  'The household that sells the most at market has been throwing its weight around in community decisions.': Object.freeze([
    Object.freeze({ text: 'The household that sells the most at market has been throwing its weight around in community decisions.', needs: Object.freeze(['market']) }),
    Object.freeze({ text: 'The household that sells the most beyond the settlement has been throwing its weight around in community decisions.', twinOf: 'The household that sells the most at market has been throwing its weight around in community decisions.', excludes: Object.freeze(['market']) }),
  ]),
  "Two households have been undercutting each other on market day for months. Last week someone's cart was damaged. No one saw anything.": Object.freeze([
    Object.freeze({ text: "Two households have been undercutting each other on market day for months. Last week someone's cart was damaged. No one saw anything.", needs: Object.freeze(['market']) }),
    Object.freeze({ text: "Two households have been undercutting each other on every sale for months. Last week someone's cart was damaged. No one saw anything.", twinOf: "Two households have been undercutting each other on market day for months. Last week someone's cart was damaged. No one saw anything.", excludes: Object.freeze(['market']) }),
  ]),
  'The church wants approval rights over market day activities. The village reeve disagrees.': Object.freeze([
    Object.freeze({ text: 'The church wants approval rights over market day activities. The village reeve disagrees.', needs: Object.freeze(['market']) }),
    Object.freeze({ text: 'The church wants approval rights over who may trade and when. The village reeve disagrees.', twinOf: 'The church wants approval rights over market day activities. The village reeve disagrees.', excludes: Object.freeze(['market']) }),
  ]),
});

// CENSUS-5e unit 2 (2026-11-05; the chair's answer 1 to CENSUS-5d, R-AN / R-U): the town military
// modifier's set (`MILITARY_MODIFIER_SIBLINGS`: garrison-backed / arms-backed) dissolved. Garrison
// differs between the power step and the final record on 9 of 2,121 steps, so it is not settled
// there; the site prints the twin's wording, which presumes nothing about the garrison.

/**
 * One declared sibling set: the original `needs` its atoms; its twin (when the slot needs one)
 * `excludes` them. @param {string} text @param {string[]} needs @param {string} [twin]
 */
const declaredSet = (text, needs, twin) => Object.freeze([
  Object.freeze({ text, needs: Object.freeze(needs) }),
  ...(twin === undefined ? [] : [Object.freeze({ text: twin, twinOf: text, excludes: Object.freeze(needs) })]),
]);

/**
 * DECLARED SIBLINGS, CARRIED (CENSUS-5b unit 2, 2026-11-05; the chair's ruling R-C): the base
 * roster's descriptions that presume a force or a market their branch does not guarantee (the
 * Military/Guard entry is keyed by the military PRIORITY and the tier, not by the roster). Keyed by
 * the printed text; each printing branch resolves through `said` → `resolveSibling` (CENSUS-1e
 * unit 2). Measured on the 1,000, printed / false by the record: "Town watch
 * and militia" 48 / 0 on `watch` (it would be 48 / 48 on `militia`: the line's town holds a watch,
 * and "militia" reads as the watch's own levy, so it declares the watch alone), the city garrison
 * lines 101 / 0 and 30 / 0, the market-day traders 8 / 0. The part-time militia (7 / 1) and the
 * armed patrol (34 / 13) sets LEFT this table (CENSUS-5c, the chair's ruling of 05:25: the militia
 * is not settled at this draw, so R-U rewords both lines at their branch to their twins' wording), and
 * so did the three garrison sets (CENSUS-5d, the chair's answer 2, R-AN: garrison differs at the draw on
 * 9 of 2,121 steps; the Military Council line drops the garrison, the two city lines keep the settled
 * watch alone — "Well-funded city watch; …", "City watch; law enforcement …"). The
 * crossroads and established-merchant lines ("fund the council", "council access", 23 / 10 and
 * 40 / 13 by `ruler: council`) are NOT declared: a High Theocratic Council reads `ruler: priest`,
 * so the atom would refuse a true line; they wait for a council-presence atom (the lane doc).
 */
export const FACTION_DESC_SIBLINGS = Object.freeze({
  'Town watch and militia; enforce ordinances, manage disorder, and report to the council.': declaredSet(
    'Town watch and militia; enforce ordinances, manage disorder, and report to the council.', ['watch']),
  'Well-funded city watch; it keeps order reliably and is growing more sure of its own authority.': declaredSet(
    'Well-funded city watch; it keeps order reliably and is growing more sure of its own authority.', ['watch']),
  'City watch; law enforcement and external defence, stretched between multiple responsibilities.': declaredSet(
    'City watch; law enforcement and external defence, stretched between multiple responsibilities.', ['watch']),
  'A small group of traders who come on market days; they speak up in small disputes but carry little weight beyond them.': declaredSet(
    'A small group of traders who come on market days; they speak up in small disputes but carry little weight beyond them.', ['market']),
});

/**
 * SW-B1 CONTRADICTIONS (STYLE-RULINGS-2 B1(b), the SURFACES audit's P50; 2026-11-09): the government
 * line of the seats that neither of `rulingStructure.js`'s two tables names. They fell back to the Mixed
 * Council's "Power is distributed across multiple factions without a clear dominant authority." — a claim
 * the writer never read (Haifeng's Household Council beside a Dominant 63). Each line says only what the
 * seat's name holds. A table here, not there, by R-AB's precedent (the power module's line ceiling).
 */
export const GOV_DESC_OF_UNNAMED_SEAT = Object.freeze({
  'Elder Consensus': 'The elders of the hamlet decide things together, and people follow them out of respect.',
  'Free Elder Council': 'The elders of the hamlet decide things together, and no lord stands over them.',
  "Headman's Authority": 'A headman settles disputes and gives the orders here.',
  'Priestly Guidance': 'The priest guides the community, and disputes are brought to the priest to settle.',
  'Town Mayor': "A mayor runs the town's day-to-day business.",
  'Grand Guild Council': 'The guilds of the metropolis govern together; the richer the guild, the more say it has.',
});
