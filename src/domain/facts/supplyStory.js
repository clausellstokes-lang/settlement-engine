/**
 * domain/facts/supplyStory.js — THE ONE READING OF A TOWN'S GROUNDS AND OF EACH MATERIAL'S STORY (BIRTH-2, the chair's
 * rulings BR4 and BR5 of 2026-11-17: the owner's rule, "you have multiple way rng to treat these situations"; vetoable by the
 * owner). FOR EACH HOUSE AND ITS MATERIAL THE SEED PICKS ONE STORY, and every part of the page tells it:
 *   local      the land has it (a ground of it on the record, or the ground the house itself proves), and nothing is bought;
 *   bought     the ground used up (or never there) and the town buys the material in (its word on the imports list);
 *   idle       the ground used up and nothing is bought: the house stands idle, marked short;
 *   abandoned  THE OWNER'S FIFTH STORY, VERY RARE: never had it and buys nothing: a venture of an earlier time that failed,
 *              in one of two versions the seed picks ('abandoned': the works stands empty; 'failing': still open, going under).
 * The pick is the kernel's own hash of a keyed string (`<seed>::ground::<key>`, as `steps/resolveResources.js` keys its
 * refills): IT TAKES NO DRAW, and no land list stores it (an implied ground is on no land field of the record). The odds
 * are the owner's table (`houseKinds.js :: SUPPLY_ODDS`). BIRTH-3 (BR8): THE SEED IS READ AT THE BIRTH ONLY; the birth writes
 * each story into the rows the page already stores, and every reading at print is a function of the stored record alone
 * (below, `BIRTH_PICKS`).
 *
 * Import-free of every module the build pins lazy (EG1).
 *
 * @enforced-by tests/domain/supplyStoryLaw.test.js
 */
import { fnv1a32 } from '../../kernel/proseHash.js';
import { hasTradeRouteConnection } from '../tradeRouteSemantics.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { catalogIdForName } from '../../data/institutionalCatalog.js';
import { BUYS_AND_WORKS, IMPLIED_GROUND, IMPORT_WORD, MATERIAL_OF, RUNS_ON_BOUGHT, SECOND_RING, SOURCE_GROUNDS, SUPPLY_ODDS, TAKERS } from './houseKinds.js';

/**
 * @typedef {{
 *   config?: { nearbyResources?: unknown, nearbyResourcesDepleted?: unknown, tradeRouteAccess?: unknown,
 *     terrainOverride?: unknown, [key: string]: unknown } | null,
 *   economicState?: { primaryImports?: unknown, activeChains?: unknown } | null,
 *   institutions?: ReadonlyArray<unknown> | null,
 *   resourceAnalysis?: { gaps?: unknown, [key: string]: unknown } | null,
 * }} StoryRecord the saved record, or the generator's record in the making (the same fields)
 */

/** @typedef {'local' | 'bought' | 'idle' | 'abandoned'} Story */
/** @typedef {{ name: string, id: string, family: string, venture: 'abandoned' | 'failing', ground: string, line: string }} Venture the failed venture: its house, its material, the ground it does not prove, its version, its one line */

/**
 * COPIES, so that this leaf (routed to the eager chunk with its folder) reads no module the build pins lazy (EG1: the
 * dependence table `crisisDependence.js`), held equal to its source, key for key, by `tests/domain/supplyStoryLaw.test.js`.
 * (The goods member `resourceSemantics.js` is not read here either: its shortage words are handed in by the callers that
 * already read it, `sourceStoryOf`'s `shortageWord`.)
 *   GROUND_YIELD   what a spent ground yields (`crisisDependence.js :: SPENT_GROUND_YIELD`)
 */
export const GROUND_YIELD = Object.freeze(/** @type {Record<string, string>} */ ({
  fishing_grounds: 'fish', river_fish: 'fish', iron_deposits: 'iron ore', salt_flats: 'salt', stone_quarry: 'stone',
  hunting_grounds: 'game', grazing_land: 'livestock', alpine_pasture: 'livestock', river_clay: 'clay', coal_deposits: 'coal',
  managed_forest: 'timber', mountain_timber: 'timber', coastal_timber: 'timber', foraging_areas: 'herbs', glass_sand: 'glass sand',
  grain_fields: 'grain', fertile_floodplain: 'grain', marshlands: 'reeds', vineyards: 'grapes',
}));
/** The noun of a material family, as the Depleted list's grounds yield it (`SPENT_GROUND_YIELD`) and the lines name it. */
export const FAMILY_NOUN = Object.freeze(/** @type {Record<string, string>} */ ({
  timber: 'timber', ironOre: 'iron ore', livestock: 'livestock', stone: 'stone', desertSalt: 'salt', clay: 'clay',
  grain: 'grain', fish: 'fish', herbs: 'herbs', grapes: 'grapes', sand: 'glass sand', peat: 'reeds', wool: 'wool', hides: 'hides',
}));

/**
 * The families a house can be a failed venture of as a BUYER: a material no ground of the record gives by the Depleted
 * list's yields and no food record or open road answers by itself (the food goods, the goods that come by any route and the
 * luxury trade's goods are left out: their reader answers them by the food record, the road or the trade, not by a ground).
 */
const VENTURE_BUYER_FAMILIES = Object.freeze(['ironOre', 'timber', 'clay', 'hides', 'wool', 'herbs']);
/** The families whose noun is a plural ("no hides lie near"). */
const PLURAL_FAMILIES = Object.freeze(['hides', 'herbs']);

/** @param {unknown} x @returns {string} */
const str = (x) => (typeof x === 'string' ? x : x == null ? '' : String(x));
/** @param {unknown} x @returns {unknown[]} */
const arr = (x) => (Array.isArray(x) ? x : []);
/** @param {unknown} x an import or a word: its bracketed reason struck, one spacing, lower case */
const struck = (x) => str(x).replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
/** A row a user authored (custom content). @param {{ custom?: unknown, source?: unknown, isCustom?: unknown } | null | undefined} row */
const isCustom = (row) => row?.custom === true || row?.source === 'custom' || row?.isCustom === true;
/** @param {{ name?: unknown, catalogId?: unknown } | null | undefined} inst @returns {string} the catalogue id */
export const idOfHouse = (inst) => String((typeof inst?.catalogId === 'string' && inst.catalogId) || catalogIdForName(str(inst?.name)) || '');

/**
 * BIRTH-3 (the chair's ruling BR8 of 2026-11-17, vetoable: THE SEED WRITES ONCE, AT THE BIRTH; EVERY VIEW READS THE RECORD).
 * Every shared view of a town is stripped of its seed (`display/publicSafe.js`), so no reader at print reads it: the seed
 * enters this rule at ONE place, the birth's writer (`generators/resourceGenerator.js`, handed it by the narratives step),
 * which calls the `…AtBirth` picks below and carries their result on the record in the making under `BIRTH_PICKS` (a symbol:
 * on no saved field; JSON and `structuredClone` drop it). The birth writes every story it picks into the rows the page
 * already stores (the import's word; a gap row for every source house its story leaves without its material, and for the
 * failed venture, whose row's line is the venture's own line; an `imported` row for a source house that runs on its
 * material bought in where its ground is used up), and every reader below reads THE STORED RECORD ALONE:
 *   the failed venture   the house whose stored gap row's line is the venture's line (abandoned or failing, by its words);
 *   a ground the house proves   USED UP where a house proving it has a stored gap row of that ground's yield ('missing':
 *                        idle; 'imported': bought in), else THERE (a town saved before this rule reads so too: BR4);
 *   bought               the word stands on the stored imports.
 * The birth's guard holds the record's reading equal to the birth's picks, house by house (`tests/domain/supplyStoryLaw.test.js`).
 */

/** The seed as a string; an absent seed is the empty string (the birth's only reading of it). @param {unknown} seed @returns {string} */
export const storySeed = (seed) => (seed == null ? '' : String(seed));

/**
 * THE SEED'S OWN PICK (the birth only): `<seed>::<key>`, hashed, falls within `n` of the odds' `outOf`. The empty seed: null.
 * @param {unknown} seed @param {string} key @param {number} n @returns {boolean | null}
 */
export function seedPicks(seed, key, n) {
  const s = storySeed(seed);
  if (s === '') return null;
  return (fnv1a32(`${s}::${key}`) % SUPPLY_ODDS.outOf) < n;
}

/** THE BIRTH'S PICKS on the record in the making (never stored). */
export const BIRTH_PICKS = Symbol('the birth\'s supply picks');
/**
 * @typedef {{ grounds: Map<string, 'there' | 'used'>, venture: Venture | null,
 *   bought: (record: StoryRecord | null | undefined, word: string, usedUp: boolean) => boolean }} BirthPicks
 */
/** @param {StoryRecord | null | undefined} record @returns {BirthPicks | null} */
const picksOf = (record) => (record && typeof record === 'object' ? /** @type {BirthPicks | undefined} */ (/** @type {Record<symbol, unknown>} */ (record)[BIRTH_PICKS]) || null : null);

/** The live native houses of the record (a ruined or closed house proves nothing; a custom row proves nothing). @param {StoryRecord | null | undefined} record */
function liveNative(record) {
  return liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (record))
    .filter((i) => !!i && typeof i.name === 'string' && !!i.name && !isCustom(/** @type {{ custom?: unknown }} */ (i)));
}

/** The stored grounds: every key on the record, the live ones, the spent ones. @param {StoryRecord | null | undefined} record */
function storedGrounds(record) {
  const config = record?.config || {};
  const custom = new Set(arr(config.nearbyResourcesCustom).map(str));
  const spent = arr(config.nearbyResourcesDepleted).map(str).filter(Boolean);
  // the land list as the Nearby Resources section prints it (`ResourcesTab.jsx`: the record's grounds, the depleted ones
  // apart), a ground the user authored set aside (it proves no house of the catalogue)
  const all = new Set([...arr(config.nearbyResources), ...arr(config.nearbyResourcesNative)].map(str).filter((k) => !!k && !custom.has(k)));
  for (const k of spent) all.add(k);
  return { all, live: new Set([...all].filter((k) => !spent.includes(k))), spent: new Set(spent) };
}

/** @param {StoryRecord | null | undefined} record @param {string} name @returns {Array<{ chain?: unknown, kind?: unknown, impact?: unknown }>} the house's stored gap rows */
const rowsOf = (record, name) => /** @type {Array<{ institution?: unknown, chain?: unknown, kind?: unknown, impact?: unknown }>} */ (arr(record?.resourceAnalysis?.gaps))
  .filter((g) => !!g && typeof g === 'object' && g.institution === name);

/**
 * THE GOOD A SOURCE HOUSE'S STORED ROW NAMES for a ground (its `chain`): the ground's yield as the Depleted list reads it
 * (`GROUND_YIELD`), a peat cutter's peat (BIRTH-3, P5 (i): its material is peat, not the marsh's reeds).
 * @param {string} id the catalogue id @param {string} ground @returns {string}
 */
export const rowGoodOf = (id, ground) => (id === 'peat_cutter' ? 'peat' : Object.prototype.hasOwnProperty.call(GROUND_YIELD, ground) ? GROUND_YIELD[ground] : '');

/** A stored row's raw good as the ground's yield names it (the mountain timber chain's raw good is timber). */
const ROW_GOOD_ALIAS = Object.freeze(/** @type {Record<string, string>} */ ({ mountain_timber: 'timber' }));
/** Whether a stored row's good is the good a house's row names for a ground. @param {unknown} chain @param {string} id @param {string} ground */
export const rowNamesGround = (chain, id, ground) => { const c = str(chain); const good = rowGoodOf(id, ground); return !!good && (c === good || ROW_GOOD_ALIAS[c] === good); };

/**
 * THE FAILED VENTURE'S WORDS, ONE TABLE for its writer (`ventureLineText`) and its reader (`ventureOfLine`, which knows the
 * venture by its stored row's line: BR8 (3)). VETOABLE wording. A LATER REWORDING MUST KEEP THE OLD WORDS READABLE: a town
 * saved with them knows its venture only by them, so add the new words beside the old (an array of each), never in place.
 */
export const VENTURE_WORDS = Object.freeze({
  abandoned: Object.freeze({ one: Object.freeze(['stands abandoned, a venture of an earlier time']), many: Object.freeze(['stand abandoned, a venture of an earlier time']) }),
  failing: Object.freeze({ one: Object.freeze(['is failing']), many: Object.freeze(['are failing']) }),
  lies: Object.freeze({ one: 'lies', many: 'lie' }),
  tail: 'near and none is brought in.',
});
/** @param {string} x @returns {string} */
const escapeRe = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** @param {'abandoned' | 'failing'} version @returns {RegExp} its line, in every form the table holds */
const lineOf = (version) => new RegExp(`^The .+? (?:${[...VENTURE_WORDS[version].one, ...VENTURE_WORDS[version].many].map(escapeRe).join('|')}): no .+? (?:${VENTURE_WORDS.lies.one}|${VENTURE_WORDS.lies.many}) ${escapeRe(VENTURE_WORDS.tail)}$`);
const VENTURE_LINES = Object.freeze({ abandoned: lineOf('abandoned'), failing: lineOf('failing') });
/** The version a stored line tells, or null where it is no venture's line. @param {unknown} line @returns {'abandoned' | 'failing' | null} */
export const ventureOfLine = (line) => (typeof line !== 'string' ? null : VENTURE_LINES.abandoned.test(line) ? 'abandoned' : VENTURE_LINES.failing.test(line) ? 'failing' : null);
/** @param {unknown} line @returns {boolean} the line is a failed venture's */
export const isVentureLine = (line) => ventureOfLine(line) !== null;

/** The houses of a record proving each implied ground: ground -> the houses (live, native, on no ground of their own on the record). @param {StoryRecord | null | undefined} record @returns {Map<string, Array<Record<string, unknown>>>} */
function provingHouses(record) {
  const { all } = storedGrounds(record);
  /** @type {Map<string, Array<Record<string, unknown>>>} */
  const houses = new Map();
  for (const inst of liveNative(record)) {
    const id = idOfHouse(inst);
    if (!Object.prototype.hasOwnProperty.call(IMPLIED_GROUND, id)) continue;
    if (SOURCE_GROUNDS[id].some((g) => all.has(g))) continue; // a ground of its own is on the record: the record speaks
    const ground = IMPLIED_GROUND[id];
    if (!houses.has(ground)) houses.set(ground, []);
    /** @type {Array<Record<string, unknown>>} */ (houses.get(ground)).push(/** @type {Record<string, unknown>} */ (inst));
  }
  return houses;
}

/**
 * A reader that asks the page's lines of ONE house's gap rows (`crisisStoppedRow.js :: housesShortOfInput`) lays the whole
 * record under this symbol: the story is read off the whole record's rows (another house's row tells the ground it proves).
 */
export const STORY_OF_RECORD = Symbol('the whole record, for its story');

/** One record reading a record object. @type {WeakMap<object, { venture: Venture | null, states: Map<string, 'there' | 'used'>, houses: Map<string, string[]> }>} */
const ON_RECORD = new WeakMap();

/**
 * THE RECORD'S OWN READING (BR8 (3)): the failed venture by its stored row; each ground a house proves, used up where a
 * house proving it has a stored gap row of that ground's yield, else there; the venture's ground proves nothing.
 * @param {StoryRecord | null | undefined} record
 */
function onRecord(record) {
  const empty = { venture: null, states: new Map(), houses: new Map() };
  if (!record || typeof record !== 'object') return empty;
  const whole = /** @type {StoryRecord | undefined} */ (/** @type {Record<symbol, unknown>} */ (record)[STORY_OF_RECORD]);
  if (whole && whole !== record) return onRecord(whole);
  const hit = ON_RECORD.get(record);
  if (hit) return hit;
  const { all } = storedGrounds(record);
  /** @type {Venture | null} */
  let venture = null;
  for (const inst of [...liveNative(record)].sort((a, b) => (idOfHouse(a) < idOfHouse(b) ? -1 : idOfHouse(a) > idOfHouse(b) ? 1 : 0))) {
    const row = rowsOf(record, str(inst.name)).find((g) => isVentureLine(g.impact));
    if (!row) continue;
    const id = idOfHouse(inst);
    const ground = Object.prototype.hasOwnProperty.call(IMPLIED_GROUND, id) && !SOURCE_GROUNDS[id].some((g) => all.has(g)) ? IMPLIED_GROUND[id] : '';
    venture = { name: str(inst.name), id, family: MATERIAL_OF[id] || '', ground, venture: ventureOfLine(row.impact) || 'failing', line: str(row.impact) };
    break;
  }
  /** @type {Map<string, 'there' | 'used'>} */
  const states = new Map();
  /** @type {Map<string, string[]>} */
  const houses = new Map();
  for (const [ground, insts] of [...provingHouses(record)].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
    const proving = insts.filter((i) => !venture || i.name !== venture.name); // the failed venture proves nothing
    if (!proving.length) continue;
    houses.set(ground, proving.map((i) => str(i.name)));
    const used = proving.some((i) => rowsOf(record, str(i.name)).some((g) => (g.kind === 'missing' || g.kind === 'imported') && rowNamesGround(g.chain, idOfHouse(i), ground)));
    states.set(ground, used ? 'used' : 'there');
  }
  const out = { venture, states, houses };
  ON_RECORD.set(record, out);
  return out;
}

/**
 * (a) THE GROUNDS THE HOUSES IMPLY: for each live native source house on no ground of its own on the record (live or
 * spent), the ground it proves (`IMPLIED_GROUND`), there or used up: the birth's pick on the record in the making, the
 * stored rows' reading on every record after it (`onRecord`). The failed venture's ground is none of them.
 * @param {StoryRecord | null | undefined} record
 * @returns {{ states: Map<string, 'there' | 'used'>, houses: Map<string, string[]> }} ground -> its state; ground -> the houses proving it
 */
export function impliedGroundsOf(record) {
  const picks = picksOf(record);
  if (!picks) { const { states, houses } = onRecord(record); return { states, houses }; }
  /** @type {Map<string, string[]>} */
  const houses = new Map();
  for (const [ground, insts] of provingHouses(record)) {
    const proving = insts.filter((i) => !picks.venture || i.name !== picks.venture.name);
    if (proving.length && picks.grounds.has(ground)) houses.set(ground, proving.map((i) => str(i.name)));
  }
  return { states: new Map([...picks.grounds].filter(([g]) => houses.has(g))), houses };
}

/**
 * THE BIRTH'S PICK OF EACH IMPLIED GROUND (BR5 (a); the birth only, handed the seed): there (`groundThere` of 60) or used
 * up, BY THE GROUND (two houses of one ground share it); the empty seed reads there. The roll table's denial does not
 * unseat it (the audit's W2). @param {StoryRecord | null | undefined} record @param {string} seed
 * @returns {Map<string, 'there' | 'used'>}
 */
export function groundPicksAtBirth(record, seed) {
  /** @type {Map<string, 'there' | 'used'>} */
  const states = new Map();
  // FAULTS-BIRTH (FR8 (a)): A FACT OF THE RECORD IS NEVER UNSAID: where the town's own food record names the ground's food as
  // a source of what it eats ("its food is the day's catch": `foodLand.js`'s fishing row on water), the ground is there.
  // (FR21 (4), the sixth chair, 2026-11-18: AN EXPORT PROVES NO IMPLIED GROUND. The page's own reader of a chain's carrier,
  // `chainCarrier.js :: chainCarrierOf`, reads a chain whose ground is not on the stored land list as `transit` ("it runs on
  // passing trade"), and an implied ground is on no stored list: the furs of r2r-village-2's "Furs and pelts (transit)" are
  // carried through, `furs_north`'s own note: "Furs travel from the hunting grounds through trading posts". So no export
  // reading stands here: a second matcher over the exports would be a second reading of the page's one.)
  // FR21 (2) (THE CHAIR'S RULING, 2026-11-18, under the owner's standing deferral; a "no" from the owner reverses it): THE COMMON
  // PROVES THE PASTURE: where a live Common grazing land stands, the grazing land is there (`GROUND_KEPT_BY`)
  const es = /** @type {{ foodSecurity?: { foodRecord?: { foodSources?: unknown } } } | null | undefined} */ (record?.economicState);
  const fed = arr(es?.foodSecurity?.foodRecord?.foodSources).map(str);
  const keptHere = groundsKeptOf(record);
  for (const ground of [...provingHouses(record).keys()].sort()) {
    const food = Object.prototype.hasOwnProperty.call(GROUND_FOOD, ground) ? GROUND_FOOD[ground] : '';
    const kept = keptHere.includes(ground);
    const spoken = (!!food && fed.includes(food)) || kept;
    states.set(ground, spoken ? 'there' : seedPicks(seed, `ground::${ground}`, SUPPLY_ODDS.groundThere) === false ? 'used' : 'there');
  }
  return states;
}

/** FAULTS-BIRTH: the food record's own word for what a ground feeds the town (`foodLand.js :: foodSources`). */
const GROUND_FOOD = Object.freeze(/** @type {Record<string, string>} */ ({ fishing_grounds: 'fish', river_fish: 'fish', grazing_land: 'livestock', hunting_grounds: 'game' }));
/** FR21 (2): the houses of the roster that are the ground itself, at work (catalogue ids): the common is the pasture. */
const GROUND_KEPT_BY = Object.freeze(/** @type {Record<string, ReadonlyArray<string>>} */ ({ grazing_land: Object.freeze(['common_grazing_land']) }));
/**
 * FR21 (2), FR24 (2) (the chair's rulings, 2026-11-18): THE GROUNDS A LIVE HOUSE OF THE ROSTER KEEPS THERE (`GROUND_KEPT_BY`: the
 * common, its pasture): one reading for every reader of a ground's story, the birth's pick and the isolated buyers' reading
 * (`houseInputAtHand.js :: neverHeldGroundsUsed`) alike. @param {StoryRecord | null | undefined} record @returns {string[]}
 */
export function groundsKeptOf(record) {
  const standing = new Set(liveNative(record).map((i) => idOfHouse(i)));
  return Object.keys(GROUND_KEPT_BY).filter((g) => GROUND_KEPT_BY[g].some((id) => standing.has(id)));
}

/** The word the imports list holds for a family's material ("Timber", "Salt"); '' where the list has none. @param {string} family */
export const familyWord = (family) => (family === 'desertSalt' ? RUNS_ON_BOUGHT.salt_works : (Object.prototype.hasOwnProperty.call(IMPORT_WORD, family) ? IMPORT_WORD[family] : ''));

/**
 * FAULTS-BIRTH FR21 (1) (the sixth chair, 2026-11-18; vetoable by the owner): WOOL AND HIDES TAKE THEIR GROUNDS. The Depleted
 * list's yields (`GROUND_YIELD`, one good a ground) name no ground of wool or hides, but the record's own words do: the hunting
 * grounds' shortage word is "Game and hides (local hunting grounds exhausted)" (`resourceSemantics.js`), and the catalogue's
 * pastures give wool (`RESOURCE_DATA.grazing_land.commodities`: livestock, wool, dairy, animal hides). A ground -> the families
 * it gives beside its yield. @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
const ALSO_GIVES = Object.freeze({ hunting_grounds: Object.freeze(['hides']), grazing_land: Object.freeze(['wool']), alpine_pasture: Object.freeze(['wool']) });
/** Whether a ground gives a family's material (by the yield the Depleted list reads, or `ALSO_GIVES`). @param {string} ground @param {string} family */
export const groundGives = (ground, family) => !!FAMILY_NOUN[family] && ((Object.prototype.hasOwnProperty.call(GROUND_YIELD, ground) && GROUND_YIELD[ground] === FAMILY_NOUN[family])
  || (Object.prototype.hasOwnProperty.call(ALSO_GIVES, ground) && ALSO_GIVES[ground].includes(family)));
/**
 * FAULTS-BIRTH (FR8 (c)): THE GROUND OF A FAMILY'S MATERIAL, the first of the Depleted list's yields that gives it (`GROUND_YIELD`,
 * in its order: iron ore the iron deposits, clay the river clay, timber the managed forest; FR21 (1): hides the hunting grounds,
 * wool the grazing land); '' where no ground gives it (the luxury trade's goods). @param {string} family @returns {string}
 */
export const groundOfFamily = (family) => Object.keys(GROUND_YIELD).find((g) => groundGives(g, family)) || '';

/**
 * A ground of the family's material that is USED UP (stored spent with no live ground of that material, or implied and
 * used up), or ''. @param {StoryRecord | null | undefined} record @param {string} family
 */
export function usedGroundOf(record, family) {
  const { live, spent } = storedGrounds(record);
  if ([...live].some((g) => groundGives(g, family))) return '';
  const implied = impliedGroundsOf(record);
  if ([...implied.states].some(([g, st]) => st === 'there' && groundGives(g, family))) return '';
  const used = [...spent].filter((g) => groundGives(g, family)).sort();
  if (used.length) return used[0];
  return [...implied.states].filter(([g, st]) => st === 'used' && groundGives(g, family)).map(([g]) => g).sort()[0] || '';
}

/** Whether any import names a family's material by its noun, whole ("Dressed stone (…)" names stone). @param {StoryRecord | null | undefined} record @param {string} family */
const importsName = (record, family) => !!FAMILY_NOUN[family] && arr(record?.economicState?.primaryImports).some((x) => ` ${struck(x).replace(/[^a-z]+/g, ' ')} `.includes(` ${FAMILY_NOUN[family]} `));

/** Whether the record's imports already bring a word's good (the word, its bracketed reason struck). @param {StoryRecord | null | undefined} record @param {string} word */
export const importsHold = (record, word) => !!word && arr(record?.economicState?.primaryImports).some((x) => struck(x) === struck(word));

/**
 * (b) THE BIRTH'S PICK: WHETHER A MATERIAL IS BOUGHT IN, by its import word (every house of that material shares the
 * answer): yes where the record's imports already bring it (a fact of the record is never unsaid); else on a route connected
 * in ordinary times (a siege changes nothing here): a used-up ground: the seed's pick (`<seed>::bought::<the word>`,
 * `boughtIn` of 60); never there: yes; on an isolated route: no. The birth only (handed the seed).
 * @param {StoryRecord | null | undefined} record @param {string} word @param {boolean} usedUp @param {string} seed
 */
export function boughtAtBirth(record, word, usedUp, seed) {
  if (importsHold(record, word)) return true;
  if (!word || !hasTradeRouteConnection(str(record?.config?.tradeRouteAccess))) return false;
  if (!usedUp) return true;
  return seedPicks(seed, `bought::${word}`, SUPPLY_ODDS.boughtIn) !== false;
}

/** Whether a word is bought: the birth's pick on the record in the making; the stored imports after it (BR8 (3)). @param {StoryRecord | null | undefined} record @param {string} word @param {boolean} usedUp */
const isBought = (record, word, usedUp) => { const picks = picksOf(record); return picks ? picks.bought(record, word, usedUp) : importsHold(record, word); };

/** On a coast the sea is the salt works' brine (BIRTH-1's R5). @param {StoryRecord | null | undefined} record */
const onCoast = (record) => str(record?.config?.tradeRouteAccess) === 'port' || str(record?.config?.terrainOverride) === 'coastal';

/**
 * THE TOWN'S FAILED VENTURE: the birth's pick on the record in the making; its stored row on every record after it.
 * @param {StoryRecord | null | undefined} record @returns {Venture | null}
 */
export function ventureOnPage(record) {
  const picks = picksOf(record);
  return picks ? picks.venture : onRecord(record).venture;
}

/**
 * (c) THE STORY OF A SOURCE HOUSE AND ITS MATERIAL (`SOURCE_GROUNDS`): 'abandoned' for the failed venture, else local,
 * bought or idle; null where this reading says nothing (FAULTS-BIRTH, FR8 (a): the second ring now proves its ground as the
 * first ring does, `houseKinds.js :: IMPLIED_GROUND`).
 * @param {StoryRecord | null | undefined} record @param {{ name?: unknown, catalogId?: unknown } | null | undefined} inst
 * @param {(ground: string) => unknown} shortageWord the imports list's own word for a spent ground
 *   (`resourceSemantics.js :: resourceShortageImport`, handed in by every caller: one word, one pick)
 * @returns {{ story: Story, ground: string, word: string } | null} ground: the used-up ground an idle or bought house stands on; word: the word bought
 */
export function sourceStoryOf(record, inst, shortageWord) {
  const id = idOfHouse(inst);
  if (!Object.prototype.hasOwnProperty.call(SOURCE_GROUNDS, id)) return null;
  if (ventureOnPage(record)?.name === str(inst?.name)) return { story: 'abandoned', ground: '', word: '' }; // the failed venture proves no ground and is no worked-out house
  const { all, live, spent } = storedGrounds(record);
  const own = SOURCE_GROUNDS[id];
  const runs = Object.prototype.hasOwnProperty.call(RUNS_ON_BOUGHT, id);
  /** @param {string} ground the used-up ground @returns {{ story: Story, ground: string, word: string }} */
  const usedUp = (ground) => {
    if (TAKERS.has(id) || !runs) return { story: 'idle', ground, word: '' };
    const word = str(shortageWord(ground)) || RUNS_ON_BOUGHT[id];
    // the plain word on the list answers too ("Timber" bought for the cooper is the burner's cordwood)
    return isBought(record, word, true) || importsHold(record, RUNS_ON_BOUGHT[id]) ? { story: 'bought', ground, word } : { story: 'idle', ground, word: '' };
  };
  // the record's own chains on the house's own grounds speak first; a chain of another ground does not hide its own (the audit's
  // c1: a live coal chain hid six peat cutters' spent marsh). BIRTH-3 (the chair's AMENDMENT 2 (A)): A HOUSE THAT WORKS SEVERAL
  // GROUNDS IS WORKED OUT ONLY WHEN EVERY GROUND OF ITS OWN IS SPENT: a mine whose one named chain, "Iron & Metalwork", works
  // spent iron, beside a live seam of its own kind (coal, gemstones or precious metals, whose goods the town exports), is at
  // work (17 such mines of the 720 read worked out before; LEFT-MARKS M5, 2026-11-17: reworded to what the 720 show)
  const chains = arr(/** @type {{ activeChains?: unknown } | null | undefined} */ (record?.economicState)?.activeChains)
    .map((c) => /** @type {{ resourceKey?: unknown, status?: unknown, processingInstitutions?: unknown }} */ (c))
    .filter((c) => !!c && own.includes(str(c.resourceKey)) && all.has(str(c.resourceKey)) && arr(c.processingInstitutions).includes(inst?.name)); // a ground on the record (an entrepot's chain of goods passing through is none)
  if (chains.length) {
    const worked = chains.filter((c) => !spent.has(str(c.resourceKey))); // a spent ground is spent on the page, the one reader's reading (a chain kept by magic feeds no house of it: r2s-monster_pressure-village-2)
    if (worked.length || own.some((g) => live.has(g))) return { story: 'local', ground: '', word: '' };
    return usedUp(str(chains.map((c) => str(c.resourceKey)).sort()[0]));
  }
  if (own.some((g) => live.has(g))) return { story: 'local', ground: '', word: '' };
  const spentOwn = own.filter((g) => spent.has(g)).sort();
  if (id === 'salt_works' && onCoast(record) && !spentOwn.length) return { story: 'local', ground: '', word: '' };
  if (own.some((g) => all.has(g))) return spentOwn.length ? usedUp(spentOwn[0]) : null;
  if (Object.prototype.hasOwnProperty.call(IMPLIED_GROUND, id)) {
    const ground = IMPLIED_GROUND[id];
    return impliedGroundsOf(record).states.get(ground) === 'used' ? usedUp(ground) : { story: 'local', ground: '', word: '' };
  }
  if (id === 'salt_works') { // off the coast, on no salt ground: never there, bought in where the town can trade
    const word = RUNS_ON_BOUGHT.salt_works;
    return isBought(record, word, false) ? { story: 'bought', ground: '', word } : { story: 'idle', ground: '', word: '' };
  }
  return null;
}

/**
 * (d) THE BIRTH'S PICK OF THE FAILED VENTURE, THE OWNER'S FIFTH STORY (the birth only, handed the seed): "never had it and
 * buys nothing" as a CHOSEN story of ONE house. The seed may pick it (`<seed>::abandoned::<catalogue id>`, `abandoned` of 60)
 * only for
 *   (i)  a house that is THE ONLY LIVE HOUSE OF ITS TOWN USING A MATERIAL THE TOWN NEVER HAD (no ground of it on the record or
 *        implied, none of it on the imports), in place of buying it in (so only where the town can trade): a buyer the one
 *        reader leaves without its input (`inputMissing`), or the salt works off the coast;
 *   (ii) a source house on no ground of its own that alone proves its ground and alone works its material, with no stored
 *        ground of that material on the land list and no neighbour its ground would feed (`feedsAnother`), in place of
 *        that ground (BR6: a venture proves no ground).
 * "The only house using a material" counts EVERY live house that uses it, in whatever table it sits (`usersOf`: the
 * butcher, the bowyer, the thatcher as well as the houses of `MATERIAL_OF`): a whole trade is not abandoned. FAULTS-BIRTH
 * (FR8 (b)): `usersOf` counts the houses that KEEP or YIELD it too (`houseKinds.js :: KEEPS_OR_YIELDS`: a dairy is no
 * venture beside a shepherd's flock, a common pasture or a stable yard). The second ring is no venture (`SECOND_RING`). Never two in
 * one town (the first by catalogue id keeps it). Which of the two versions is the seed's pick too (`<seed>::venture::<id>`).
 * @param {StoryRecord | null | undefined} record the record in the making, its grounds picked (`BIRTH_PICKS`)
 * @param {string} seed
 * @param {{ inputMissing: (inst: Record<string, unknown>, family: string) => boolean, usersOf: (family: string) => number,
 *   feedsAnother: (inst: Record<string, unknown>, ground: string) => boolean, houseWords: (inst: Record<string, unknown>) => string }} reads
 *   the birth's readers (the one reader of an input; the houses using a material; whether a ground feeds another house;
 *   the house as the sentence names it)
 * @returns {Venture | null}
 */
export function ventureAtBirth(record, seed, reads) {
  const k = storySeed(seed);
  if (!record || typeof record !== 'object' || k === '') return null;
  const houses = liveNative(record);
  const { all } = storedGrounds(record);
  const implied = impliedGroundsOf(record);
  const connected = hasTradeRouteConnection(str(record?.config?.tradeRouteAccess));
  /** @type {Array<{ inst: Record<string, unknown>, id: string, family: string, ground: string }>} */
  const candidates = [];
  for (const inst of houses) {
    const id = idOfHouse(inst);
    const family = MATERIAL_OF[id] || '';
    if (!family || reads.usersOf(family) !== 1) continue;
    const stored = [...all].some((g) => groundGives(g, family));
    const never = !stored && ![...implied.states.keys()].some((g) => groundGives(g, family));
    if (BUYS_AND_WORKS.has(id) && VENTURE_BUYER_FAMILIES.includes(family)) {
      if (connected && never && !importsHold(record, familyWord(family)) && !importsName(record, family) && reads.inputMissing(/** @type {Record<string, unknown>} */ (inst), family)) candidates.push({ inst, id, family, ground: '' });
    } else if (id === 'salt_works') {
      if (connected && !onCoast(record) && !SOURCE_GROUNDS.salt_works.some((g) => all.has(g)) && !importsHold(record, familyWord(family)) && !importsName(record, family)) candidates.push({ inst, id, family, ground: '' });
    } else if (Object.prototype.hasOwnProperty.call(IMPLIED_GROUND, id) && !SECOND_RING.has(id)) { // FAULTS-BIRTH (FR8 (a)): the second ring is no venture
      const ground = IMPLIED_GROUND[id];
      if (arr(implied.houses.get(ground)).length === 1 && arr(implied.houses.get(ground))[0] === inst.name && !stored && !importsName(record, family)
        && !reads.feedsAnother(/** @type {Record<string, unknown>} */ (inst), ground)) candidates.push({ inst, id, family, ground });
    }
  }
  candidates.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const hit = candidates.find((c) => seedPicks(seed, `abandoned::${c.id}`, SUPPLY_ODDS.abandoned) === true);
  if (!hit) return null;
  /** @type {Venture} */
  const out = { name: str(hit.inst.name), id: hit.id, family: hit.family, ground: hit.ground,
    venture: fnv1a32(`${k}::venture::${hit.id}`) % 2 === 0 ? 'abandoned' : 'failing', line: '' };
  out.line = ventureLineText(out, reads.houseWords(/** @type {Record<string, unknown>} */ (hit.inst))) || '';
  return out;
}

/**
 * THE GROUNDS OF THE TOWN AS THE PAGE READS THEM: the implied grounds (there, or used up); the failed venture's ground is
 * none of them (it proves nothing: it failed). @param {StoryRecord | null | undefined} record @returns {{ there: string[], used: string[] }}
 */
export function impliedGroundsShown(record) {
  const { states } = impliedGroundsOf(record);
  return { there: [...states].filter(([, st]) => st === 'there').map(([g]) => g), used: [...states].filter(([, st]) => st === 'used').map(([g]) => g) };
}

/** THE FAILED VENTURE'S MARK (the owner: "Say abandoned or failing: a failed venture."). VETOABLE wording. @param {Venture | null | undefined} v */
export const ventureMarkText = (v) => (!v ? null : v.venture === 'failing' ? 'Failing: a failed venture.' : 'Abandoned: a failed venture.');

/**
 * THE FAILED VENTURE'S ONE LINE, after the gap line (the gap line keeps its words). VETOABLE wording.
 * @param {Venture | null | undefined} v @param {string} house the house as the sentence names it ("the potter")
 */
export function ventureLineText(v, house) {
  if (!v) return null;
  // BIRTH-3 (P5 (i)): the line agrees in number ("no hides lie near"), and a peat cutter's material is peat
  const material = v.family === 'peat' ? 'peat' : FAMILY_NOUN[v.family] || 'material';
  const lie = PLURAL_FAMILIES.includes(v.family) ? VENTURE_WORDS.lies.many : VENTURE_WORDS.lies.one;
  const head = house.charAt(0).toUpperCase() + house.slice(1);
  const many = /[^s']s$/.test(house); // a house named in the plural ("the tanners", "the weavers/textile workers")
  const words = VENTURE_WORDS[v.venture === 'failing' ? 'failing' : 'abandoned'][many ? 'many' : 'one'][0];
  return `${head} ${words}: no ${material} ${lie} ${VENTURE_WORDS.tail}`;
}
