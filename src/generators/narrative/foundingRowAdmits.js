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

/**
 * @typedef {object} FoundingState
 * @property {any} facts `birthFactsOf` over the roster, the config and the tier at the founding draw
 * @property {ReadonlySet<string>} resources the town's own resource keys
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
/** @param {FoundingState} st */
const onRiver = (st) => st.facts.water?.kind === 'river' || st.facts.terrain === 'riverside';

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
  // plains: a market centre is no hamlet's, and its market is the roster's; the soil's crop is its own
  'grew as an agricultural market center': (st) => holds(st, 'market', 'tier: ≥ village'),
  'grew because the local soil produces something that cannot easily be grown elsewhere': (st) => near(st, CROP),
  // the commodity hooks: the first export's good, read against what the town has of its own
  'grew from a single logging operation whose owner refused to leave when the contract ended': (st) => near(st, TIMBER),
  'was founded when foresters discovered that the surrounding woodland was three times richer than the maps showed': (st) => near(st, TIMBER),
  'began when a failed soldier received a land grant and discovered the soil was worth more than any battlefield': (st) => near(st, CROP),
  'started as a seasonal camp for deep-water fishers who stopped bothering to go home between seasons': atSea,
  'grew around a natural harbour that fish seemed to prefer. Nobody knows why, and nobody questions it': (st) => atSea(st) && isPort(st),
  'grew around fishing weirs and a sheltered barge landing where the river catch could be salted and sold': (st) => onRiver(st) && holds(st, 'institution: docks'),
  'started as a seasonal camp beside a dependable river fishery and became permanent when traders began stopping there': onRiver,
  'was founded the week someone hit iron three feet below the surface and word reached the nearest city': (st) => near(st, ['iron_deposits']),
  'grew around a smithing operation that discovered the local ore was unusually pure and refused to share the location': (st) => near(st, ['iron_deposits']),
  'began when quarry workers sent to extract stone for a distant cathedral decided the site was worth keeping for themselves': (st) => near(st, ['stone_quarry']),
  "was established because the local stone cuts cleanly and doesn't crack in frost: a property worth more than it sounds": (st) => near(st, ['stone_quarry']),
  "was founded the day a shepherd's child found a stone in a streambed that turned out to be worth more than the flock": (st) => near(st, GEMS),
  "grew from a prospectors' camp into something permanent when the gems didn't run out as quickly as expected": (st) => near(st, GEMS),
  'began when a merchant realised the local sheep produced finer wool than anything available on the open market': (st) => near(st, PASTURE),
  'grew around a sheep run whose owner had the rare good sense to also build a mill and a market': (st) => near(st, PASTURE) && holds(st, 'institution: mill', 'market'),
  'began as a seasonal gathering point for cattle traders that became permanent when someone built an inn': (st) => holds(st, 'institution: tavern'),
  'was established to control a salt deposit that the local lord considered more valuable than the surrounding farmland combined': (st) => near(st, SALT),
  'grew around salt workings that made everything they touched last longer: including the settlement itself': (st) => near(st, SALT),
  'began when a wandering alchemist settled here specifically because of what grows along the river margins': onRiver,
  'was founded when a group of skilled artisans pooled resources to build a permanent workshop district away from guild restrictions': (st) => holds(st, 'population: ≥ middling'),
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
]));

/**
 * The founders' tests (`FOUNDERS_BY_TIER`): a founder line that names a house reads the roster.
 * @type {Readonly<Record<string, (st: FoundingState) => boolean>>}
 */
export const FOUNDER_ADMITS = Object.freeze({
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
  return { facts: birthFactsOf({ institutions, config, tier }, worldLaw), resources };
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
