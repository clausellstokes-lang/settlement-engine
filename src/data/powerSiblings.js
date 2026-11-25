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
  // military institution, and the two market lines' branches with no market-named house. R2-CODE-A item 5 (P3): a twin names no office or house its site's facts (the roster's names) cannot verify.
  // BAR5-THINGS (the chair's LD1, 2026-11-16: `governanceNarrative.js:479` is this seat's, that one line and its declaration):
  // the register's `court` word now reads "civilian courts" (REVIEW-BAR-5 C31780), so the line declares the court it names;
  // its twin names the disputes, not a court, where the roster holds none
  'The military commanders are pushing for expanded authority over civilian courts, and the council is losing ground.': Object.freeze([
    Object.freeze({ text: 'The military commanders are pushing for expanded authority over civilian courts, and the council is losing ground.', needs: Object.freeze(['court', 'guardPresence']) }), // the commanders: the site's own gate (a military house)
    Object.freeze({ text: "The military commanders are pushing for expanded authority over the town's disputes, and the council is losing ground.", twinOf: 'The military commanders are pushing for expanded authority over civilian courts, and the council is losing ground.', needs: Object.freeze(['guardPresence']), excludes: Object.freeze(['court']) }),
  ]),
  'The village militia captain is pushing for authority over disputes that the reeve used to handle.': Object.freeze([
    Object.freeze({ text: 'The village militia captain is pushing for authority over disputes that the reeve used to handle.', needs: Object.freeze(['militia']) }),
    Object.freeze({ text: 'The strongest armed household is pushing for authority over disputes the community used to settle for itself.', twinOf: 'The village militia captain is pushing for authority over disputes that the reeve used to handle.', excludes: Object.freeze(['militia']) }),
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
    Object.freeze({ text: 'The most devout households want a say over who may trade and when, and not everyone here agrees.', twinOf: 'The church wants approval rights over market day activities. The village reeve disagrees.', excludes: Object.freeze(['market']) }),
  ]),
  // TAIL-POWERS-4 (B02464; 20987, 00170): a thorp holds no "families on each side", a hamlet or a village no "three
  // estates" (the site's facts carry the tier); each twin claims what the smaller place bears.
  'A dispute over grazing rights and water access has run for two seasons, and the families on each side no longer speak to one another.': Object.freeze([
    Object.freeze({ text: 'A dispute over grazing rights and water access has run for two seasons, and the families on each side no longer speak to one another.', needs: Object.freeze(['tier: ≥ hamlet']) }),
    Object.freeze({ text: 'A dispute over grazing rights and water access has run for two seasons, and those on each side of it no longer speak to one another.', twinOf: 'A dispute over grazing rights and water access has run for two seasons, and the families on each side no longer speak to one another.', excludes: Object.freeze(['tier: ≥ hamlet']) }),
  ]),
  // BAR8-K-POWERS (rule 15b, the audit's C31732; BRIEF-BAR8 K-POWERS 4, the chair's BR15; THE TWIN, vetoable by the owner): the
  // cascade's last fallback (`governanceNarrative.js :: deriveBaselineConflict`) is the grazing quarrel above, true of most
  // small places (every hamlet and village of the census holds grazing). A place with NO grazing at all takes, before the set
  // resolves, the quarrel over the ground it does have (`noGrazingQuarrelOf`, below the table).
  'The merchant class is outbuying noble landholdings. Three estates have changed hands in the last decade. The families that lost them have not forgotten.': Object.freeze([
    Object.freeze({ text: 'The merchant class is outbuying noble landholdings. Three estates have changed hands in the last decade. The families that lost them have not forgotten.', needs: Object.freeze(['tier: ≥ town']) }),
    Object.freeze({ text: 'A merchant has bought land the old landholding family once held, and the family has not forgotten.', twinOf: 'The merchant class is outbuying noble landholdings. Three estates have changed hands in the last decade. The families that lost them have not forgotten.', excludes: Object.freeze(['tier: ≥ town']) }),
  ]),
});

/** A house that keeps beasts or grazing (the detector's own words, `tests/helpers/pageLaws/law15K.mjs`). */
const GRAZING_HOUSE = /grazing|pasture|herd|shepherd|livestock|cattle|sheep|goat|ranch|dairy|stockyard|horse|stable|drover/i;
/** A ground near the place that is itself grazing: grass, pasture, meadow, steppe, grazing land or herds (WORDS-2 E3: the page law law15K.mjs's grazing land, less "plain"; never a field, a farm or a forest). */
const GRAZING_GROUND = /grass|pasture|meadow|steppe|grazing|herds?\b/i;
/** The grounds a quarrel can be over, in order, and how the line names each (BAR8-K-POWERS's, unchanged). @type {ReadonlyArray<readonly [RegExp, string]>} */
const QUARREL_GROUNDS = Object.freeze([
  [/marsh/i, 'the marsh'], [/harbour|coast|shore|beach/i, 'the shore'],
]);
/** A ground near the place that is water: a marsh, a harbour or shore, fishing, a river's fish, mills or clay, an oasis, springs, a floodplain or a lake. */
const WATER_GROUND = /marsh|harbour|coast|shore|beach|fish|river|oasis|spring|floodplain|lake/i;

/**
 * WORDS-2 E3, the tenth chair's RULING G9 (2) and its STOP of 2026-11-25 (the owner's rule: "Don't invent drama capitalize on
 * what's already there if it's there"): THE CASCADE'S LAST FALL-THROUGH (`governanceNarrative.js :: deriveBaselineConflict`)
 * KEEPS EACH QUARREL ONLY WHERE THE PLACE'S OWN RECORD HOLDS WHAT IT NAMES. The grazing quarrel (the stock line, `null` here)
 * where the record holds grazing: a grazing house on its roster, its running pastoral chain, or a grass, pasture, meadow,
 * steppe, grazing or herds ground near it. Else BAR8-K-POWERS's twin, word for word, where the record holds its subject: the
 * marsh or the shore (a ground near it), else water (a water ground near it, a riverside or coastal terrain, a river or port
 * road). A calm place holding none of them stores NO quarrel (the empty string).
 * Pure: a reading of the arguments, no draw.
 * @param {{ institutionNames?: ReadonlyArray<string>, pastoral?: boolean, grounds?: ReadonlyArray<unknown>,
 *   terrain?: unknown, route?: unknown }} place
 * @returns {string | null} null where the place grazes (the stock line stands); the twin where it holds the marsh, the shore
 *   or water; the empty string where it holds none (no quarrel)
 */
export function noGrazingQuarrelOf({ institutionNames = [], pastoral = false, grounds = [], terrain = null, route = null }) {
  const names = (Array.isArray(institutionNames) ? institutionNames : []).map((n) => String(n || ''));
  const own = (Array.isArray(grounds) ? grounds : []).map((g) => String(g || ''));
  if (pastoral === true || names.some((n) => GRAZING_HOUSE.test(n)) || own.some((g) => GRAZING_GROUND.test(g))) return null;
  const ground = QUARREL_GROUNDS.find(([re]) => own.some((g) => re.test(g)));
  if (ground) return `A dispute over rights on ${ground[1]} and access to water has run for two seasons, and those on each side of it no longer speak to one another.`;
  const water = own.some((g) => WATER_GROUND.test(g)) || terrain === 'riverside' || terrain === 'coastal' || route === 'river' || route === 'port';
  return water ? 'A dispute over water access has run for two seasons, and those on each side of it no longer speak to one another.' : '';
}
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
 * and militia" 48 / 0 on `watch` (48 / 48 on `militia`). THE CHARTER OVERRIDES R-C (COHERENCE-PRESUME,
 * the owner's order of 2026-11-11, the chair's ruling): R-C read "militia" as the watch's own levy; an
 * outside reader read two forces, and 91 of 91 corpus towns printing it had no militia. The militia
 * is not settled at this step (R-Q), so the line cannot declare it; it prints its twin, the watch
 * alone ("Town watch; it enforces ordinances, …"), the city garrison
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
  'Town watch; it enforces ordinances, manages disorder, and reports to the council.': declaredSet(
    'Town watch; it enforces ordinances, manages disorder, and reports to the council.', ['watch']),
  // BAR2-PEOPLE (PP6, the chair's rulings PP6 and PT3 of 2026-11-15, vetoable by the owner): was "Well-funded city watch; it
  // keeps order reliably ...", false in 57 of the 101 towns that printed it (a coordinated crime wave or irregular pay beside
  // it); the power step cannot read the safety profile, so the line claims neither the funding nor the order, and keeps `watch`
  'City watch; it answers for keeping order and is growing more sure of its own authority.': declaredSet(
    'City watch; it answers for keeping order and is growing more sure of its own authority.', ['watch']),
  'City watch; law enforcement and external defence, stretched between multiple responsibilities.': declaredSet(
    'City watch; law enforcement and external defence, stretched between multiple responsibilities.', ['watch']),
  'A small group of traders who come on market days; they speak up in small disputes but carry little weight beyond them.': declaredSet(
    'A small group of traders who come on market days; they speak up in small disputes but carry little weight beyond them.', ['market']),
});

/**
 * BAR8-K-POWERS (rule 14d, the audit's C44634; BRIEF-BAR8 K-POWERS 3; THE TWIN, vetoable by the owner): THE ELECTED REEVE'S
 * LINE NAMES A NOBLE ONLY WHERE ONE STANDS. "... under noble oversight" printed in every village whose seat is the Elected
 * Reeve, with no noble power, house or person on the record (the 720: 8 of 8). `rulingStructure.js` reads it at the draw:
 * the original where the step seats a noble power (the noble roster's own gate) or the place holds a noble house
 * (`hasNobleInst`); else the twin, the one elected answering to the people who chose them (true of every elected reeve);
 * `applyDensityLaw.js :: reeveToRoster` reads it again after the roster's trim.
 */
export const REEVE_ANSWERS_TO_ELECTORS = 'One of the peasantry, elected by the rest, manages labour and mediates disputes, and answers to the people who chose them.';

/**
 * SW-B1 CONTRADICTIONS (STYLE-RULINGS-2 B1(b), the SURFACES audit's P50; 2026-11-09): the government
 * line of the seats that neither of `rulingStructure.js`'s two tables names. They fell back to the Mixed
 * Council's "Power is distributed across multiple factions without a clear dominant authority." — a claim
 * the writer never read (Haifeng's Household Council beside a Dominant 63). Each line says only what the
 * seat's name holds. A table here, not there, by R-AB's precedent (the power module's line ceiling).
 */
export const GOV_DESC_OF_UNNAMED_SEAT = Object.freeze({
  'Elder Consensus': 'The elders of the hamlet decide things together, and people follow them out of respect.',
  // TAIL-TIES-2 (rows 20473 / 10615 / 00909 and 02676, 2026-11-15): a seat's line claims no more than every town that
  // holds the seat bears: an occupier's governor stands over an occupied hamlet's elders and gives its orders, and a
  // lord may live in a free hamlet (the seat is read at the power step, before the crisis: the line names neither).
  'Free Elder Council': 'The elders of the hamlet decide things together, and none of them rules alone.',
  "Headman's Authority": 'A headman settles disputes and speaks for the community.',
  'Priestly Guidance': 'The priest guides the community, and disputes are brought to the priest to settle.',
  'Town Mayor': "A mayor runs the town's day-to-day business.",
  'Grand Guild Council': 'The guilds of the metropolis govern together; the richer the guild, the more say it has.',
});
