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
/** A ground of the land: grazing, fields, farms, forest, foraging or hunting (the same). */
const LAND_GROUND = /forag|hunt|grass|pasture|meadow|plain|steppe|farm|fertile|grain|orchard|mill|herb|grove|forest|wood(?!.*ship)|grazing|herds/i;
/** The grounds a quarrel can be over, in order, and how the line names each. @type {ReadonlyArray<readonly [RegExp, string]>} */
const QUARREL_GROUNDS = Object.freeze([
  [/marsh/i, 'the marsh'], [/harbour|coast|shore|beach/i, 'the shore'],
]);

/**
 * BAR8-K-POWERS (rule 15b; the chair's BR15): THE QUARREL OVER THE GROUND THE PLACE HAS, where it has no grazing. The grazing
 * quarrel presumes grazing; the boundary is the second check's, and thin (C31732 STANDS in a thorp whose grounds are a deep
 * harbour, ship timber and ruins; C30951 and C31349, the same record but for a foraging or a hunting ground, were EXPLAINED:
 * a farming or foraging place can quarrel over grazing). So the twin is taken only where the place holds no grazing house,
 * no running pastoral chain and no ground of the land (grass, pasture, field, farm, forest, foraging or hunting ground); its
 * subject is read off the place's own grounds (the marsh, the shore), else its water.
 * Pure: a reading of the arguments, no draw.
 * @param {{ institutionNames?: ReadonlyArray<string>, pastoral?: boolean, grounds?: ReadonlyArray<unknown> }} place
 * @returns {string | null} the twin, or null where the place grazes (the stock line stands)
 */
export function noGrazingQuarrelOf({ institutionNames = [], pastoral = false, grounds = [] }) {
  const names = (Array.isArray(institutionNames) ? institutionNames : []).map((n) => String(n || ''));
  const own = (Array.isArray(grounds) ? grounds : []).map((g) => String(g || ''));
  if (pastoral === true || names.some((n) => GRAZING_HOUSE.test(n)) || own.some((g) => LAND_GROUND.test(g))) return null;
  const ground = QUARREL_GROUNDS.find(([re]) => own.some((g) => re.test(g)));
  return ground
    ? `A dispute over rights on ${ground[1]} and access to water has run for two seasons, and those on each side of it no longer speak to one another.`
    : 'A dispute over water access has run for two seasons, and those on each side of it no longer speak to one another.';
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

/**
 * One quarrel of a pool, frozen whole: `{ id, text, needs }`. Its id names it in the ledger; `needs` stands on the row as
 * an array literal, so the presumption walkers read the declaration where the line is written. The field rotation's
 * slot alone carries no text (`FIELD_ROTATION_SLOT` below).
 * @param {{ id: string, text?: string, needs: string[] }} row
 */
const quarrel = (row) => {
  Object.freeze(row.needs);
  return Object.freeze(row);
};

/**
 * THE FIELD ROTATION'S SLOT in GRAZING (CURE-NINE, DEPTH-5, 2026-11-22): its id and needs, and no text. It is no
 * declared line (a line carries a string or function text, `tests/lint/declaredLineShape.test.js`): the pick composes
 * GRAZING at its call (`power/quarrelPick.js :: pickQuarrel`), the site's own line standing in this slot, so the
 * literal keeps its one home (`governanceNarrative.js :: FIELD_ROTATION_QUARREL`) and this slot keeps the id and needs.
 */
export const FIELD_ROTATION_SLOT = quarrel({ id: 'g2-rotation', needs: ['tier: village'] });

/**
 * BUILD-CONFLICT (DEPTH-2, 2026-11-20; the chair's word of 16:08 UTC, the lines `docs/chair/2026-11-20/content/depth/lines/
 * CONFLICT-LINES.md` "THE LINES AS SENT" with the chair's three rewordings): THE EVERYDAY QUARRELS. Three rungs of
 * `governanceNarrative.js :: deriveBaselineConflict` printed one sentence each: the grazing quarrel (the default rung) and
 * the field rotation (the market rung) in most small places, the levies in most towns (52 of 100 thorps, 58 of 100 towns;
 * `docs/chair/2026-11-20/content/depth/conflict/CONFLICT-MEASURE.md`). Where such a rung's line prints, the site picks the
 * place's quarrel from the rung's pool among the lines whose needs the place holds (`power/quarrelPick.js`), by the
 * mixed keyed pick and no roll. INDEX 0 OF EACH POOL IS TODAY'S LINE BYTE FOR BYTE (and GRAZING's second is the field rotation's), so the
 * thorp twin above, the no-grazing twin (`noGrazingQuarrelOf`) and the boycott rewrite (`factionDynamics.js ::
 * boycottReadsRelation`) fire as before wherever it is picked. A line is appended at the end of its pool, never reordered:
 * the mixed pick reads the admitted lines in pool order. Each need is a vocabulary atom (`factVocabulary.js`), answered at the site by the roster, the tier
 * and the config.
 * THE FIELD ROTATION'S TEXT IS NOT COPIED HERE (GRAZING's second is its slot, `FIELD_ROTATION_SLOT`, with no text): its
 * literal stays where the presumption-classes register banks it (`governanceNarrative.js :: FIELD_ROTATION_QUARREL`, a
 * `resource` word at the guard's base), and the site hands it to the pick, which composes the pool with it in the slot.
 */
export const QUARREL_POOLS = Object.freeze({
  GRAZING: Object.freeze([
    quarrel({ id: 'g1-grazing', text: 'A dispute over grazing rights and water access has run for two seasons, and the families on each side no longer speak to one another.', needs: [] }),
    FIELD_ROTATION_SLOT,
    quarrel({ id: 'g3-mill', text: 'The miller wants a bigger share of each sack for the grinding, and the households who bring their grain say the old share was fair.', needs: ['institution: mill'] }),
    quarrel({ id: 'g4-road', text: 'The households along the road cannot agree who should fill the ruts outside their doors, so the work keeps being put off.', needs: ['route: road'] }),
    quarrel({ id: 'g5-river', text: 'The households nearest the river and those further off disagree over who may draw water first when the river runs low.', needs: ['river'] }),
    quarrel({ id: 'g6-shore', text: 'Two households both claim the same stretch of shore, and neither will give way.', needs: ['coast'] }),
    quarrel({ id: 'g7-cows', text: "Two households graze their cows on the same patch of grass, and each says the other's beasts take more than their share.", needs: ['trade at work: dairy'] }),
    quarrel({ id: 'g8-long-trip', text: 'With the nearest market days away, the households argue over whose turn it is to make the long trip.', needs: ['route: isolated'] }),
    quarrel({ id: 'n1-water', text: 'The households cannot agree whose turn it is to keep the water clean, and each says another has missed a turn.', needs: ['water source'] }), // the chair's word of 16:22 UTC (CONFLICT-LINES-2.md, 275cdbf26)
    quarrel({ id: 'n2-mill-trip', text: "The mill is a long way off, and the households argue over whose turn it is to carry everyone's grain there.", needs: ['access to external mill'] }), // the chair's word of 16:22 UTC
    quarrel({ id: 'n3-common', text: 'Some households say others put more beasts on the common grazing than their share, and nobody can agree how many each may keep there.', needs: ['common grazing land'] }), // the chair's word of 16:22 UTC
  ]),
  LEVIES: Object.freeze([
    quarrel({ id: 'l1-levies', text: 'The council has been debating market levies for three months. The merchants have stopped attending the sessions. Both sides are now acting as if the other has already lost.', needs: ['market'] }),
    quarrel({ id: 'l2-millers', text: 'What the millers take for grinding has gone up twice this year, and the households who bring them grain have started to grumble.', needs: ['institution: mill'] }),
    quarrel({ id: 'l3-granary', text: 'How much grain the granary should hold back in reserve has been argued all season, and nothing is agreed.', needs: ['institution: granary'] }),
    quarrel({ id: 'l4-walls', text: 'Who should pay to mend the walls has been argued for months, and every street says the next one should pay more.', needs: ['walls'] }),
    quarrel({ id: 'l5-watch', text: 'Everyone agrees the watch must be paid, but no one agrees how much each household should give.', needs: ['watch'] }),
    quarrel({ id: 'l6-taverns', text: 'Some households want the taverns to close earlier, and the tavern keepers say an earlier hour would ruin them.', needs: ['institution: tavern'] }),
    quarrel({ id: 'l7-forges', text: 'The smiths start their hammering before dawn, and the households beside the forges want them moved further out.', needs: ['institution: smith'] }),
    quarrel({ id: 'l8-dock-dues', text: 'The dock dues were raised at the start of the season, and the boat owners have complained of it ever since.', needs: ['institution: docks'] }),
  ]),
  // THE MILITARY RUNG (`institutionFlags.militaryEffective > 68 && !seatIsMilitary`; the chair's word of 16:22 UTC,
  // CONFLICT-LINES-2.md at 275cdbf26): each of its sub-branches is a pool, today's line at index 0. The commanders'
  // sub-branch (a military house and a court); its index 0 keeps its own sibling set above (the court's twin).
  MILITARY_COURT: Object.freeze([
    quarrel({ id: 'ma0-commanders', text: 'The military commanders are pushing for expanded authority over civilian courts, and the council is losing ground.', needs: ['court'] }),
    quarrel({ id: 'ma1-watch-captains', text: 'The watch captains want to settle small disputes themselves instead of sending them to the court, and the council has not agreed.', needs: ['watch', 'court'] }),
    quarrel({ id: 'ma2-gates', text: 'The garrison wants the say over who comes in at the gates, a say the council has kept until now.', needs: ['garrison', 'gate'] }),
    quarrel({ id: 'ma3-officers', text: "The garrison's officers want their soldiers answerable to them alone, not to the civil court.", needs: ['garrison', 'court'] }),
    quarrel({ id: 'ma4-fines', text: "The watch has started setting fines on the spot, and the council says setting fines was never the watch's business.", needs: ['watch'] }),
    quarrel({ id: 'ma5-walls', text: "The garrison wants a larger share of the settlement's money for the walls, and the council is giving ground.", needs: ['garrison', 'walls'] }),
  ]),
  // the else sub-branch (neither the commanders' nor the civic one, which keeps its one line). mb1 is the chair's wording
  // of 18:00 UTC (the first, "… who keeps the night watch …", was withheld: the presumed-things walker read the watch)
  MILITARY_ARMED: Object.freeze([
    quarrel({ id: 'mb0-armed-household', text: "The strongest armed household has started making decisions on everyone's behalf without asking.", needs: [] }),
    quarrel({ id: 'mb1-militia', text: 'The militia want to choose for themselves who stands guard at night, and the hall has not agreed.', needs: ['militia'] }),
  ]),
});

/**
 * The rung lines the site hands to the pick, by their printed text → their pool: the default rung's (GRAZING's index 0)
 * and the levies rung's (LEVIES' index 0). The field rotation's (GRAZING's second) is the site's own literal, handed in
 * beside; the no-grazing twin stands in for GRAZING's index 0 at the default rung (handed in beside too). Any other line
 * is no key, and is printed untouched.
 */
export const QUARREL_POOL_OF_RUNG = Object.freeze({
  [/** @type {string} */ (QUARREL_POOLS.GRAZING[0].text)]: 'GRAZING',
  [/** @type {string} */ (QUARREL_POOLS.LEVIES[0].text)]: 'LEVIES',
  [/** @type {string} */ (QUARREL_POOLS.MILITARY_COURT[0].text)]: 'MILITARY_COURT',
  [/** @type {string} */ (QUARREL_POOLS.MILITARY_ARMED[0].text)]: 'MILITARY_ARMED',
});
