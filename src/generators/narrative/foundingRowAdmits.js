/**
 * generators/narrative/foundingRowAdmits.js — THE ROWS THE FOUNDING RECORD REFUSES (R2-CODE-A-5; the chair's
 * rulings of 2026-11-13 22:42 UTC on #488, #594, #845 and #571/#916, carried by the lane's fifth brief).
 *
 * `genArrivalDetail` (narrativeGenerator.js) draws the History tab's "Origin:" row (`history.founding.reason`)
 * from `TERRAIN_NARRATIVE_HOOKS` and its commodity hooks, and the "Founded by:" row from its founders by tier,
 * with no disqualifier read from the record: a coastal trading port where the route is not a port, a logging
 * operation where no timber stands, an agricultural market centre in a hamlet, a salt deposit with none near.
 * RULED: the rows are true in two towns of three, so none is removed; the DRAW reads the record. A row listed
 * here is said only where its test holds; a refused pick resolves DRAW-FREE to the next admitted row of the same
 * pool (the drawn index, then onward, wrapping), so no draw is added or moved. A row not listed is admitted
 * everywhere; a caller with no roster in reach (`foundingStateOf` returns null) keeps the drawn row.
 * R2-CODE-A-9 (the page census's P7a rise at 67d9acc59, banked 125, now 133): the resolution passes over an
 * Origin row that names a founder of its own (`NAMES_A_FOUNDER`): the record keeps ONE founder, the "Founded
 * by:" row, drawn apart, and a refused coastal row carried 22 of the 720 onto "a famous navigator retired here"
 * beside a soldier, a noble or a religious house. A row DRAWN as one of them is the draw's and stands.
 *
 * THE HOMES READ (no new key, no new vocabulary word):
 *   - "this is a port": the route (`factsOf(record).route`, the route's one home; the #237 ruling);
 *   - what stands there: the roster, through the vocabulary's atoms (`market`, `institution: mill`,
 *     `institution: docks`, `institution: tavern`, `walls`, `sacredHouse`);
 *   - the town's own resources: `config.nearbyResources` (the resource keys of `data/resourceData.js`);
 *   - the size: the tier and the population band; the water: the water home's kind.
 *
 * Pure: no randomness, no clock, no write.
 */

import { birthFactsOf } from '../../domain/facts/factsOf.js';
import { declarationAdmits } from '../../domain/facts/factVocabulary.js';
import { TERRAIN_NARRATIVE_HOOKS } from '../../data/narrativeData.js';
import { FOUNDER_KIND } from '../../domain/facts/founder.js';
/**
 * A FOUNDER AND AN ORIGIN ROW THAT CANNOT BOTH BE (TAIL-NARRATIVE, the chair's ruling (N3); FA as measured by
 * RECORD-MEASURE-1, class a: 154 of 720 towns at the joined line). The Origin rows that name WHO began the place by
 * their KIND (a group: herders, fishers, a military post, a religious settlement, a fair's traders), each with the
 * founder kinds (`domain/facts/founder.js :: FOUNDER_KIND`) that can be that who. `oneFounderRow` resolves a row whose
 * agent the founder cannot be draw-free onward to a row that agrees, as it does for the rows that name a person.
 * @type {Readonly<Record<string, readonly string[]>>}
 */
export const ORIGIN_AGENT_KINDS = Object.freeze({
  'began as a naval base protecting the coast': ['military', 'crown', 'noble'],
  'was established as a defensive stronghold that attracted dependents': ['military', 'crown', 'noble'],
  'was established as a frontier outpost that outlasted its original purpose': ['military', 'crown', 'noble'],
  'developed at a defensible position on the road': ['military', 'crown', 'noble', 'community'],
  'began as a toll collection point that became a permanent post': ['crown', 'noble', 'military', 'trade'],
  'began as a customs post where trade roads crossed': ['crown', 'noble', 'military', 'trade'],
  'began as a grain storage depot for a larger city that no longer exists': ['crown', 'noble', 'trade'],
  'developed around a sacred grove that attracted religious settlement': ['religious', 'healer', 'community', 'family'],
  'developed where herders gathered seasonally until the gathering became permanent': ['family', 'community'],
  'started as a seasonal camp for deep-water fishers who stopped bothering to go home between seasons': ['family', 'community'],
  'started as a seasonal camp beside a dependable river fishery and became permanent when traders began stopping there': ['family', 'community', 'trade'],
  'began as a mining camp that became permanent when families arrived': ['family', 'community', 'trade'],
  'was built where two rival mining operations agreed to share infrastructure': ['trade'],
  'grew from a logging camp': ['family', 'community', 'trade'],
  'grew from a seasonal fair that became year-round as traders chose to winter here': ['trade', 'community'],
  'developed from a hidden refuge community that emerged after a generation': ['community', 'religious', 'family'],
  'began as a hunting lodge settlement for a noble who died without heirs': ['noble'],
  'grew from a single household that others joined over decades until it became permanent': ['family'],
  'began when a merchant realised the local sheep produced finer wool than anything available on the open market': ['trade'],
  'began when a failed soldier received a land grant and discovered the soil was worth more than any battlefield': ['military'],
  'grew from a fishing village into a maritime hub': ['family', 'community', 'trade'],
});
/**
 * Can this founder be the Origin row's agent? A row not in `ORIGIN_AGENT_KINDS` names no agent and agrees with anyone.
 * @param {unknown} reason the Origin row @param {unknown} foundedBy the "Founded by:" row @returns {boolean}
 */
export const agentAgrees = (reason, foundedBy) => {
  const kinds = ORIGIN_AGENT_KINDS[String(reason)];
  return !kinds || kinds.includes(/** @type {Record<string, string>} */ (FOUNDER_KIND)[String(foundedBy || '').trim()] || 'other');
};


/**
 * @typedef {object} FoundingState
 * @property {any} facts `birthFactsOf` over the roster, the config and the tier at the founding draw
 * @property {ReadonlySet<string>} resources the town's own resource keys
 * @property {ReadonlyArray<string>} [names] the roster's institution names, lowercased (R2-CODE-A-12: a crossing)
 */

/** The resource keys that answer a row (keys of `data/resourceData.js :: RESOURCE_DATA`). */
const TIMBER = ['managed_forest', 'mountain_timber', 'shipbuilding_timber'];
const ORE = ['iron_deposits', 'precious_metals', 'gemstone_deposits', 'coal_deposits'];
const MINERAL = [...ORE, 'hot_springs_mineral'];
const DIGGINGS = [...ORE, 'stone_quarry'];
const DEPOSIT = [...ORE, 'stone_quarry', 'salt_flats', 'desert_salt', 'glass_sand', 'hot_springs_mineral'];
const SALT = ['salt_flats', 'desert_salt'];
const CROP = ['grain_fields', 'fertile_floodplain', 'date_palms'];
const PASTURE = ['grazing_land', 'alpine_pasture'];
const GEMS = ['gemstone_deposits', 'precious_metals'];

/** @param {FoundingState} st @param {string[]} keys */
const near = (st, keys) => keys.some((k) => st.resources.has(k));
/** @param {FoundingState} st @param {...string} atoms the record must hold every atom (unanswered admits) */
const holds = (st, ...atoms) => declarationAdmits({ needs: atoms, excludes: [], crisis: [] }, st.facts).admitted;
/** @param {FoundingState} st */
const isPort = (st) => holds(st, 'route: port');
/** @param {FoundingState} st */
const atSea = (st) => st.facts.water?.kind === 'maritime';
/** @param {FoundingState} st the roster holds a bridge (the native catalogue's "Toll bridge") */
const bridged = (st) => (st.names || []).some((n) => /\bbridge\b/.test(n));
/** @param {FoundingState} st */
const onRiver = (st) => st.facts.water?.kind === 'river' || st.facts.terrain === 'riverside';

/** The tests of the commodity rows that name a founder of their own (R2-CODE-A-12: tagged, so no row is copied). */
const NAMING = new WeakSet();
/** R2-CODE-A-13 (ruling (4)): the founders a tagged commodity row agrees with (`FOUNDER_AGREES`), by its test. */
const AGREES_BY_TEST = new WeakMap();
/**
 * @param {(st: FoundingState) => boolean} test
 * @param {string[]} [founders] the "Founded by:" rows the row's own founder can be
 * @returns {(st: FoundingState) => boolean}
 */
const naming = (test, founders) => (NAMING.add(test), founders && AGREES_BY_TEST.set(test, founders), test);

/** The "Founded by:" rows an Origin row's own founder can be (`FOUNDERS_BY_TIER` in narrativeGenerator.js, as written). */
const A_FAMILY = ['a single extended family who came and never left', 'a household that settled first and found others following it in'];
const A_NOBLE = ['a noble granted lands by the crown and obligated to populate them', 'a noble granted lands by the crown with the resources to develop them'];
const VETERANS = ['military veterans given land grants who brought their skills with them'];
const MERCHANTS = ['merchants recognising economic potential before anyone else did'];

/**
 * The Origin rows' tests, keyed by the row as written (`TERRAIN_NARRATIVE_HOOKS` and the commodity hooks).
 * @type {Readonly<Record<string, (st: FoundingState) => boolean>>}
 */
export const FOUNDING_REASON_ADMITS = Object.freeze({
  // crossroads: a market and its fair are the roster's
  'was established as a market town where merchants could meet': (st) => holds(st, 'market'),
  'was founded when a powerful merchant family built a counting house at the junction': (st) => holds(st, 'market'),
  'grew from a seasonal fair that became year-round as traders chose to winter here': (st) => holds(st, 'market'),
  // river: a mill is the roster's
  'began as a riverside mill settlement': (st) => holds(st, 'institution: mill'),
  // R2-CODE-A-12 (ruling (2), the bar's #300): a crossing that "became the first bridge" reads the roster's crossing
  'grew around a ferry crossing that became the first bridge only three generations ago': bridged,
  'was established by a family granted mill rights by a distant lord who never visited': (st) => holds(st, 'institution: mill'),
  // port (the coastal terrain's pool): the route is the home of "this is a port"; the roster of what stands
  'was founded as a coastal trading port': isPort,
  'grew from a fishing village into a maritime hub': (st) => isPort(st) && holds(st, 'tier: ≥ town'),
  'was established to exploit the natural harbour': isPort,
  'began as a naval base protecting the coast': isPort,
  "was built around a single family's shipwright operation that outlasted the family": (st) => isPort(st) && holds(st, 'institution: docks'),
  // isolated and mountain: the deposits are the town's own resources
  'grew around a valuable resource deposit': (st) => near(st, DEPOSIT),
  'was founded to exploit rich mineral deposits': (st) => near(st, MINERAL),
  'began as a mining camp that became permanent when families arrived': (st) => near(st, DIGGINGS) || holds(st, 'institution: mine'),
  'was built where two rival mining operations agreed to share infrastructure': (st) => near(st, DIGGINGS) || holds(st, 'institution: mine'),
  // forest: the grove is the town's own resource
  'developed around a sacred grove that attracted religious settlement': (st) => near(st, ['ancient_grove']),
  // R2-CODE-A-12 (ruling (2): every row a walk can land on carries its own test): a logging camp reads the timber
  'grew from a logging camp': (st) => near(st, TIMBER),
  // plains: a market centre is no hamlet's, and its market is the roster's; the soil's crop is its own
  'grew as an agricultural market center': (st) => holds(st, 'market', 'tier: ≥ village'),
  // R2-CODE-A-12 (ruling (2), the reader's MEDIUM (c): 95 landings, 81 with no crop): farmland is the crop's
  'was founded on rich farmland granted to a favoured noble': (st) => near(st, CROP),
  // R2-CODE-A-12 (ruling (2)): where the farmland row is refused the walk lands on the herders: grazing is theirs
  'developed where herders gathered seasonally until the gathering became permanent': (st) => near(st, PASTURE),
  'began as a grain storage depot for a larger city that no longer exists': (st) => near(st, CROP),
  'grew because the local soil produces something that cannot easily be grown elsewhere': (st) => near(st, CROP),
  // the commodity hooks: the first export's good, read against what the town has of its own
  'grew from a single logging operation whose owner refused to leave when the contract ended': naming((st) => near(st, TIMBER)),
  'was founded when foresters discovered that the surrounding woodland was three times richer than the maps showed': naming((st) => near(st, TIMBER)),
  'began when a failed soldier received a land grant and discovered the soil was worth more than any battlefield': naming((st) => near(st, CROP), ['a discharged soldier who liked the view and had nowhere better to be']),
  'was established on farmland that three generations of the same family refused to sell, and eventually others settled around them': naming((st) => near(st, CROP), A_FAMILY), // R2-CODE-A-12
  'started as a seasonal camp for deep-water fishers who stopped bothering to go home between seasons': atSea,
  'grew around a natural harbour that fish seemed to prefer. Nobody knows why, and nobody questions it': (st) => atSea(st) && isPort(st),
  'grew around fishing weirs and a sheltered barge landing where the river catch could be salted and sold': (st) => onRiver(st) && holds(st, 'institution: docks'),
  'started as a seasonal camp beside a dependable river fishery and became permanent when traders began stopping there': onRiver,
  'was founded the week someone hit iron three feet below the surface and word reached the nearest city': (st) => near(st, ['iron_deposits']),
  'grew around a smithing operation that discovered the local ore was unusually pure and refused to share the location': naming((st) => near(st, ['iron_deposits'])),
  'began when quarry workers sent to extract stone for a distant cathedral decided the site was worth keeping for themselves': naming((st) => near(st, ['stone_quarry'])),
  "was established because the local stone cuts cleanly and doesn't crack in frost: a property worth more than it sounds": (st) => near(st, ['stone_quarry']),
  "was founded the day a shepherd's child found a stone in a streambed that turned out to be worth more than the flock": (st) => near(st, GEMS),
  "grew from a prospectors' camp into something permanent when the gems didn't run out as quickly as expected": (st) => near(st, GEMS),
  'began when a merchant realised the local sheep produced finer wool than anything available on the open market': naming((st) => near(st, PASTURE), MERCHANTS),
  'grew around a sheep run whose owner had the rare good sense to also build a mill and a market': naming((st) => near(st, PASTURE) && holds(st, 'institution: mill', 'market')),
  'began as a seasonal gathering point for cattle traders that became permanent when someone built an inn': (st) => holds(st, 'institution: tavern'),
  'was established to control a salt deposit that the local lord considered more valuable than the surrounding farmland combined': naming((st) => near(st, SALT), A_NOBLE),
  'grew around salt workings that made everything they touched last longer: including the settlement itself': (st) => near(st, SALT),
  'began when a wandering alchemist settled here specifically because of what grows along the river margins': naming((st) => onRiver(st)),
  'was founded when a group of skilled artisans pooled resources to build a permanent workshop district away from guild restrictions': naming((st) => holds(st, 'population: ≥ middling'), ['a community of tradespeople who left a larger settlement under contested circumstances']),
  "grew because the local clay and water made the finest ceramic work in the region: a reputation that preceded the settlement's name": (st) => near(st, ['river_clay']),
});

const H = TERRAIN_NARRATIVE_HOOKS;
/**
 * The Origin rows that name a founder of their own (the shapes the page census's pattern 7a reads: "was founded
 * by", "was settled by", "was established by", "grew because a healer", "grew because a famous navigator", "was
 * built around a single family"; `tests/generators/foundingRowsRead.test.js` A5 holds the list to the pools).
 * A refused row never resolves onto one: the resolution would print a second founder beside the "Founded by:"
 * row (the founder's one home, `domain/facts/founder.js`). The rows are read from their home by place, never copied.
 * @type {ReadonlySet<string>}
 */
export const NAMES_A_FOUNDER = Object.freeze(new Set([
  H.river[4], H.port[4], H.port[5], H.road[4], H.road[5], H.isolated[0], H.isolated[4], H.forest[1], H.forest[4], H.plains[4],
  // R2-CODE-A-12 (ruling (2), the whole table read): every other row that names who founded the place, a person,
  // a family or household, a company (a grant to a favoured noble; a noble's lodge; a herbalist; a counting house's
  // merchant family; a household others joined; a soldier's grant; a family that would not sell; a merchant; a
  // logging operation's owner, foresters, quarry workers, a smithing operation; a sheep run's owner; a lord; an
  // alchemist; a company of artisans: the commodity rows, by their tagged tests). A refused row never resolves onto one.
  H.plains[1], H.forest[3], H.forest[5], H.crossroads[4], H.isolated[5],
  ...Object.keys(FOUNDING_REASON_ADMITS).filter((row) => NAMING.has(FOUNDING_REASON_ADMITS[row])),
]));

/**
 * ONE FOUNDER ON A PAGE (R2-CODE-A-13, the chair's ruling (4)): the founders each Origin row that names one AGREES
 * with: the same founder told twice, in kind and in number. An Origin row in `NAMES_A_FOUNDER` stands only beside
 * a "Founded by:" row listed for it here; a row not keyed here (the navigator, the foresters, the charcoal-burners,
 * the herbalist, the logging owner, the smiths, the quarry workers, the sheep run's owner, the alchemist) agrees
 * with no founder the tables hold. The Origin rows are read from their home by place; the commodity rows by their tests.
 * @type {Array<[string, string[]]>}
 */
const AGREEMENTS = [
  [H.river[4], A_FAMILY], // a family granted mill rights
  [H.port[4], A_FAMILY], // a single family's shipwright operation
  [H.isolated[5], A_FAMILY], // a single household that others joined
  [H.isolated[4], ['three or four families who agreed to try wintering together and never stopped']], // families fleeing
  [H.road[4], VETERANS], // a disbanded military unit
  [H.plains[4], VETERANS], // veterans granted land
  [H.road[5], ['a healer who stopped to treat a traveller and found the location too useful to leave']], // a healer
  [H.isolated[0], ['a small religious community whose members drifted into secular life over two generations']], // religious hermits
  [H.plains[1], A_NOBLE], // farmland granted to a favoured noble
  [H.forest[3], A_NOBLE], // a noble's hunting lodge
  [H.crossroads[4], [...MERCHANTS, 'a great trade house that outgrew every other settlement in the region']], // a merchant family's counting house
  // the commodity rows (a family that would not sell, a failed soldier, a lord's salt, a merchant's wool, artisans), by their tagged tests
  ...Object.keys(FOUNDING_REASON_ADMITS).filter((row) => AGREES_BY_TEST.has(FOUNDING_REASON_ADMITS[row]))
    .map((row) => /** @type {[string, string[]]} */ ([row, AGREES_BY_TEST.get(FOUNDING_REASON_ADMITS[row])])),
];
/** @type {Map<string, ReadonlySet<string>>} */
const AGREES = new Map();
for (const [row, founders] of AGREEMENTS) AGREES.set(row, Object.freeze(new Set(founders)));
/** The agreement table, keyed by the Origin row (read by `oneFounderRow` and its test). */
export const FOUNDER_AGREES = /** @type {ReadonlyMap<string, ReadonlySet<string>>} */ (AGREES);

/**
 * The Origin row the page keeps beside its "Founded by:" row (R2-CODE-A-13, ruling (4)): a row that names no
 * founder, or one that agrees with `foundedBy`, stands; a founder row that disagrees resolves DRAW-FREE, as a
 * refused row does, to the next row of the same pool (onward from it, wrapping) whose own test holds and that names
 * no founder; where none does, no row (null: silence is not a false sentence). No state in reach keeps the row.
 * @param {readonly string[]} pool
 * @param {string | null} reason the Origin row as `admittedRow` resolved it
 * @param {string | null} foundedBy the "Founded by:" row
 * @param {Readonly<Record<string, (st: FoundingState) => boolean>>} admits
 * @param {FoundingState | null} state
 * @returns {string | null}
 */
export const oneFounderRow = (pool, reason, foundedBy, admits, state) => {
  const agentRefused = reason != null && !(agentAgrees(reason, foundedBy) && purposeAgrees(reason, foundedBy)); // FA (ruling N3): a group the founder cannot be; FB (N17): a purpose it cannot have
  if (!state || reason == null || (!NAMES_A_FOUNDER.has(String(reason)) && !agentRefused)) return reason;
  if (!agentRefused && FOUNDER_AGREES.get(String(reason))?.has(String(foundedBy))) return reason;
  const at = pool.indexOf(reason);
  for (let k = 1; k < pool.length; k++) {
    const row = pool[(at + k) % pool.length];
    const test = admits[String(row)];
    if ((test && !test(state)) || NAMES_A_FOUNDER.has(String(row)) || !agentAgrees(row, foundedBy) || !purposeAgrees(row, foundedBy)) continue;
    return row;
  }
  return null;
};

/**
 * The founders' tests (`FOUNDERS_BY_TIER`): a founder line that names a house reads the roster.
 * @type {Readonly<Record<string, (st: FoundingState) => boolean>>}
 */
export const FOUNDER_ADMITS = Object.freeze({
  // FB (TAIL-NARRATIVE-4, ruling N17): the founder that names THIS CROSSROADS is said only where the route is one
  'a dynastic decision that this crossroads would anchor the realm': (st) => holds(st, 'route: crossroads'),
  'merchants recognising economic potential before anyone else did': (st) => holds(st, 'market'),
  'a merchant consortium that needed a waypoint and decided to own it': (st) => holds(st, 'market'),
  'religious authorities who wanted a centre for their regional operations': (st) => holds(st, 'sacredHouse'),
  'a powerful noble house that needed a commercial base independent of rivals': (st) => holds(st, 'market'),
  'a merchant coalition that grew too large for the town they started in': (st) => holds(st, 'market'),
  'a military command that built fortifications and found civilians followed': (st) => holds(st, 'walls'),
  'a great trade house that outgrew every other settlement in the region': (st) => holds(st, 'market'),
});

/**
 * The founding state at the draw: the facts of the birth so far, or null for a caller with no roster in reach.
 * @param {any} config
 * @param {any} economicContext the history context (`_institutions` is the roster)
 * @param {any} worldLaw
 * @returns {FoundingState | null}
 */
export const foundingStateOf = (config, economicContext, worldLaw) => {
  const institutions = economicContext?._institutions;
  if (!Array.isArray(institutions)) return null;
  const tier = config?.tier || config?.settType;
  const resources = new Set(Array.isArray(config?.nearbyResources) ? config.nearbyResources.map(String) : []);
  const names = institutions.map((i) => String(i?.name ?? '').toLowerCase());
  return { facts: birthFactsOf({ institutions, config, tier }, worldLaw), resources, names };
};

/**
 * The row the founding state takes: the drawn row, or, where the state refuses it, the next admitted row of the
 * same pool (draw-free, wrapping) that is not in `passOver`. Where no row is admitted, or no state is in reach,
 * the drawn row stands; where the only admitted rows are passed over, no row is taken (null: silence is not a
 * false sentence).
 * @template T
 * @param {readonly T[]} pool
 * @param {T} drawn
 * @param {Readonly<Record<string, (st: FoundingState) => boolean>>} admits
 * @param {FoundingState | null} state
 * @param {ReadonlySet<string> | null} [passOver] rows a resolution never lands on (a row DRAWN as one stands)
 * @returns {T | null}
 */
export const admittedRow = (pool, drawn, admits, state, passOver = null) => {
  if (!state) return drawn;
  const at = pool.indexOf(drawn);
  if (at < 0) return drawn;
  let passed = false;
  for (let k = 0; k < pool.length; k++) {
    const row = pool[(at + k) % pool.length];
    const test = admits[String(row)];
    if (test && !test(state)) continue;
    if (k > 0 && passOver?.has(String(row))) { passed = true; continue; }
    return row;
  }
  return passed ? null : drawn;
};

/**
 * FB (TAIL-NARRATIVE-4, the chair's ruling (N17); RECORD-MEASURE-1's candidate, FA's table turned the other way): THE
 * FOUNDER AGAINST THE ORIGIN. The founder rows that state their own founding PURPOSE (a refuge beyond reach, a religious
 * centre or community, a fortification), and the Origin rows that state the founding's own purpose (a "was founded as /
 * to", "was established as / to / because", "began as" row) with the founder purposes that can be it: escaped serfs do
 * not found a trading port or a waystation, religious authorities do not found a mine, a fortification does not begin as
 * a mill. A founder or an Origin row not keyed here states no purpose of that kind and agrees with any.
 * @type {Readonly<Record<string, string>>}
 */
export const FOUNDER_PURPOSE = Object.freeze({
  'escaped serfs seeking a place beyond the reach of their former masters': 'refuge',
  'religious authorities who wanted a centre for their regional operations': 'religious',
  'a small religious community whose members drifted into secular life over two generations': 'religious',
  'a military command that built fortifications and found civilians followed': 'military',
  // TAIL-NARRATIVE-5 (N18 (5)): a place that grew from three merged settlements was not founded at a stroke: it stands
  // beside an Origin row that grew ("began as", "grew", "developed"), never beside one that was founded or established
  'the slow accretion of three smaller settlements that eventually merged under a single administration': 'accretion',
});
/** @type {Readonly<Record<string, readonly string[]>>} the founder purposes each purpose-stating Origin row admits */
export const ORIGIN_PURPOSE_ADMITS = Object.freeze({
  'was founded as a coastal trading port': [],
  'was established to exploit the natural harbour': [],
  'was founded to exploit rich mineral deposits': [],
  "was established because the local stone cuts cleanly and doesn't crack in frost: a property worth more than it sounds": [],
  'was founded the week someone hit iron three feet below the surface and word reached the nearest city': [],
  'was established as a market town where merchants could meet': [],
  'was established as a market metropolis where merchants could meet': [],
  'was established as a waystation for travelers': ['religious', 'military'],
  'began as a riverside mill settlement': ['refuge', 'religious', 'accretion'],
  // TAIL-NARRATIVE-5 (N18 (5)): the rows founded or established at a stroke that no purpose above refuses: they refuse
  // the accretion alone (the rows keyed above with no 'accretion' refuse it already)
  'was founded where the river became navigable for laden vessels': ['refuge', 'religious', 'military'],
  'was established as a defensive stronghold that attracted dependents': ['refuge', 'religious', 'military'],
  'was established as a frontier outpost that outlasted its original purpose': ['refuge', 'religious', 'military'],
});
/**
 * Can this founder have the purpose this Origin row states? A row or a founder not keyed above agrees with any.
 * @param {unknown} reason @param {unknown} foundedBy @returns {boolean}
 */
export function purposeAgrees(reason, foundedBy) {
  const purposes = ORIGIN_PURPOSE_ADMITS[String(reason)], purpose = FOUNDER_PURPOSE[String(foundedBy || '').trim()];
  return !purposes || !purpose || purposes.includes(purpose);
}
/**
 * Can this founder and this Origin row both be? Its agent (`agentAgrees`, FA's table), its purpose (above), and, for a
 * row that names a founder of its own, the agreement table (`FOUNDER_AGREES`). A null row agrees with anyone.
 * @param {string | null} reason @param {string} foundedBy @returns {boolean}
 */
export const founderAgrees = (reason, foundedBy) => {
  if (reason == null) return true;
  const row = String(reason), by = String(foundedBy || '').trim();
  if (!agentAgrees(row, by) || !purposeAgrees(row, by)) return false;
  return !NAMES_A_FOUNDER.has(row) || Boolean(FOUNDER_AGREES.get(row)?.has(by));
};
/**
 * THE FOUNDER THE ORIGIN ROW KEEPS (FB): the founder as `admittedRow` resolved it stands where it agrees with the Origin
 * row; where it does not, it resolves DRAW-FREE onward through the same tier's table (wrapping) to the first founder
 * whose own test holds and that agrees. Where none does, the founder stands and `oneFounderRow` moves the Origin row, as
 * before (FA). No state in reach keeps the founder.
 * @param {readonly string[]} founders @param {string} founder @param {string | null} reason @param {FoundingState | null} state
 * @returns {string}
 */
export const founderForOrigin = (founders, founder, reason, state) => {
  if (!state || founderAgrees(reason, founder)) return founder;
  const at = founders.indexOf(founder);
  for (let k = 1; k < founders.length; k++) {
    const f = founders[(at + k) % founders.length];
    const test = FOUNDER_ADMITS[f];
    if ((!test || test(state)) && founderAgrees(reason, f)) return f;
  }
  return founder;
};
