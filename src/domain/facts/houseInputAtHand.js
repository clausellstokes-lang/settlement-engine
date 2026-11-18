/**
 * domain/facts/houseInputAtHand.js — THE ONE READING OF "THIS HOUSE'S INPUT IS AT HAND" (BAR4-RECORD, kind R1, the
 * chair's K6 of BRIEF-BAR4; vetoable by the owner). Two writers asked the question two ways: the resource analysis wrote
 * a house's gap (`resourceGenerator.js :: evaluateInstitutionChain`, `gaps[].kind`) and the page's gap reader answered it
 * again (`display/validationOnPage.js :: resourceGapLines`) over other goods: a sawmill the record called short of timber
 * was "answered" on the page by the grove's "Sacred wood" export or by the "Milled lumber" it is said to make, so no gap
 * line printed and its row stood bare; a caravanserai on a connected road was short of camels in the record and answered
 * on the page. Measured at c4ac1ef84a: 67 such rows in 64 towns of the census's 720, 17 in 16 of the fresh 300.
 *
 *   houseInputAtHand(record, chainKey, house)   THE ONE READER: how a chain's raw input reaches a house, by the record:
 *     'local'    a LIVE native resource answers it (`availableNativeResourceKeys` and their commodities), or the town's
 *                local production names the raw good itself, or a house of the roster produces it (a quarry, salt works);
 *     'route'    the town's trade route is connected and no siege shuts it, and the input comes by any route (grapes,
 *                glass sand, camels) or the house's own trade IS the route (a market, a caravanserai);
 *     'imported' the record's imports bring the raw good BY ITS OWN NAME (`primaryImports`, its bracketed reason struck:
 *                "Shipbuilding timber", "Camels and pack animals"; a worked good, "timber fittings", "Gold and silver
 *                work", meets no raw need), or the food record names the input as a source or imports a share of the
 *                staple. (The trade lists' own need matcher, `tradeListDisplay.js :: needMetBy`, is not imported: it
 *                rides a lazy chunk the eager engine core may not reach, `tests/architecture/engineCoreLazyEdge.test.js`;
 *                WORKED_GOOD below is its worked-good words, the one list both should read once that matcher has a leaf.)
 *     'missing'  none of these.
 *   A HOUSE'S OWN OUTPUT NEVER ANSWERS ITS INPUT, AND NEITHER DOES AN UNRELATED GOOD: no export answers an input (a raw
 *   good the town sells is its own resource, which the first rule reads: the grove's "Sacred wood" is not timber), the
 *   town's production answers only where it names the raw good itself ("Milled lumber" is the sawmill's product, not its
 *   timber), and a worked import ("Carved wood and amber", "Iron fittings and arrowheads") meets no raw need.
 *
 *   CHAIN_INPUTS   what each chain's input is CALLED on the record and how the DM sentence names it (moved here from the
 *                  page's reader, one home): keyed by the chain's key in `RESOURCE_CHAINS`.
 *
 * Layer 2 (over the economy, the roster and the crises). Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/generators/bar4RecordHouseInput.test.js
 */
import { RESOURCE_DATA } from '../../data/goods/identity.js';
import { availableNativeResourceKeys, resourceKeyForLabel } from '../resourceSemantics.js';
import { hasTradeRouteConnection, waterAccessKind } from '../tradeRouteSemantics.js';
import { institutionHasAnyTag } from '../../lib/entities.js';
import { nativeSemanticNames } from '../content/customContentSemanticAuthority.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { canonStressors } from '../canonicalAccessors.js'; // EG1: the war read import-free of the lazily pinned crisisKind.js
import { institutionMatchesKeyword } from '../institutions/institutionCategory.js';
import { catalogIdForName } from '../../data/institutionalCatalog.js';
import { resourceShortageImport } from '../resourceSemantics.js';
import { SPENT_GROUND_YIELD, SPENT_GROUND_WORKERS, GROUNDS_WORKED_OFF_CHAIN, INPUT_GAP_HELD_EVERYWHERE, HOUSE_TRADE_INPUT, HOUSE_NEED_INPUT } from '../../data/crisisDependence.js';
import { warHoldsIron } from './warIronHook.js'; // BIRTH-3 (BR9): the iron hook's own predicate (EG1: import-free)
import { BUYER_IMPORT_WORDS, BUYS_AND_WORKS, MATERIAL_OF, RUNS_ON_BOUGHT, TAKERS, isSourceHouse } from './houseKinds.js'; // BIRTH-1: an import-free leaf (EG1)
import { groundGives, groundOfFamily, groundsKeptOf, impliedGroundsOf, impliedGroundsShown, sourceStoryOf, ventureOnPage, idOfHouse } from './supplyStory.js'; // BIRTH-2: the one reading of the grounds and the stories (EG1); BIRTH-3 (BR8): of the stored record alone

/**
 * What each chain's input is CALLED on the record (the economy's goods vocabulary and the nearby-resource keys), and how
 * the DM sentence names it. `words` answer from a live resource; `food` names the food record's sources that answer the
 * input; `staple` says an imported share of the staple answers it; `route` says a connected trade route brings it
 * (caravans bring camels; grapes and glass sand come by any route, TAIL-DEFECON-R M-V).
 * @type {Readonly<Record<string, { words: ReadonlyArray<string>, noun: string, raw?: string, plural?: boolean, food?: ReadonlyArray<string>, staple?: boolean, route?: boolean }>>}
 */
export const CHAIN_INPUTS = Object.freeze({
  wool: { words: ['wool'], noun: 'wool' },
  flax: { words: ['flax', 'linen'], noun: 'flax' },
  grain: { words: ['grain', 'flour', 'grain fields', 'fertile floodplain'], noun: 'grain', food: ['grain', 'mill'], staple: true },
  grapes: { words: ['grapes', 'vineyard', 'vineyards'], noun: 'grapes', plural: true, route: true },
  livestock: { words: ['livestock', 'dairy', 'grazing land', 'cattle'], noun: 'livestock', food: ['livestock'] },
  ironOre: { words: ['iron', 'iron ore', 'iron deposits'], noun: 'iron ore' },
  copperOre: { words: ['copper', 'copper ore'], noun: 'copper ore' },
  preciousMetals: { words: ['precious metals', 'gold', 'silver'], noun: 'gold or silver ore' },
  timber: { words: ['timber', 'wood', 'lumber', 'managed forest'], noun: 'timber' },
  stone: { words: ['stone', 'stone quarry'], noun: 'stone' },
  clay: { words: ['clay', 'river clay'], noun: 'clay' },
  hides: { words: ['animal hides', 'hides', 'furs'], noun: 'hides', plural: true },
  fish: { words: ['fish', 'fishing grounds', 'river fish'], noun: 'fish', food: ['fish'] },
  gemstones: { words: ['gems', 'gemstones', 'gemstone deposits'], noun: 'gemstones', plural: true },
  sand: { words: ['glass sand', 'glass'], noun: 'glass sand', raw: 'glass sand', route: true },
  herbs: { words: ['medicinal herbs', 'herbs'], noun: 'medicinal herbs', plural: true },
  alpineWool: { words: ['wool', 'alpine pasture'], noun: 'wool' },
  mountainTimber: { words: ['timber', 'wood', 'mountain timber'], noun: 'timber', raw: 'timber' },
  desertSalt: { words: ['salt', 'desert salt', 'salt flats', 'salt pans'], noun: 'salt' },
  desertGlass: { words: ['glass sand', 'glass'], noun: 'glass sand', raw: 'glass sand', route: true },
  camelCaravan: { words: ['camel', 'camels', 'camel herds'], noun: 'camels', plural: true, route: true },
  oasisDate: { words: ['dates', 'date palms', 'oasis water'], noun: 'dates', plural: true },
  mineralHot: { words: ['hot springs', 'hot springs mineral', 'healing waters'], noun: 'water from the hot springs', raw: 'mineral hot springs' },
});

/**
 * RESOURCE_CHAINS.rawResource is an idealized DISPLAY string ("copper ore", "gemstones") while the terrain and the
 * record name the same material with its own token ("copper", "gemstone_deposits", "Precious metals"): this table bridges
 * the two AT THE MATCHER and never renames the displayed rawResource (moved here from `resourceGenerator.js`, which
 * re-exports `terrainSynonymsFor` for its terrain matcher).
 */
const RAW_RESOURCE_TERRAIN_SYNONYMS = {
  'copper ore':      ['copper'],
  'gold/silver ore': ['precious_metals'],
  'gemstones':       ['gemstone_deposits'],
  'glass sand':      ['glass_sand'],
  // 'flax' and 'grapes' match their terrain-vocabulary tokens verbatim (no entry
  // needed); 'animal hides' is the display name for the 'hides' token.
  'animal hides':    ['hides'],
};
/** @param {unknown} rawResource @returns {string[]} */
export const terrainSynonymsFor = (rawResource) =>
  /** @type {Record<string, string[]>} */ (RAW_RESOURCE_TERRAIN_SYNONYMS)[String(rawResource || '').toLowerCase()] || [];

/**
 * BIRTH-3 (AMENDMENT 1 (2)): the goods the trade's catalog holds ONE GOOD under another word (`domain/region/goodsCatalog.js`:
 * the livestock good's aliases hold "raw hides and animal products"): a chain key -> the words of the import that brings it so.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
const ONE_GOOD_BOUGHT = Object.freeze({ hides: Object.freeze(['livestock']), livestock: Object.freeze(['animal products']) });

/**
 * LEFT-MARKS item 3 (L25, SEAM-ECON's houses; the sixth chair's BRIEF-LEFT, 2026-11-17; vetoable by the owner): THE IMPORTS
 * LIST'S OWN WORDS FOR A GOOD THE CHAIN'S NAMES DO NOT SPELL. The herbs come in as "Herbs and forage (local gathering areas
 * exhausted)": that word brings the medicinal herbs (a chain key -> the words). RULING BR21 (the sixth chair, 2026-11-17):
 * RITUAL HERBS ARE NOT AN APOTHECARY'S OR AN ALCHEMIST'S STOCK: "Ritual wood and herbs (ancient grove damaged)" feeds no house
 * of medicine, so the word is the brief's own, not "herbs" alone. @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
const KEY_IMPORT_WORDS = Object.freeze({ herbs: Object.freeze(['herbs and forage']) });
/**
 * LEFT-MARKS item 3: THE STOCK OF A HOUSE WHOSE OWN TRADE TAKES THE GOOD (`crisisDependence.js :: HOUSE_TRADE_INPUT`,
 * `HOUSE_NEED_INPUT`): the
 * butchers' stock is meat, and game ("Game and hides (local hunting grounds exhausted)") stocks their counters; a dairy or a
 * tanner of a livestock chain is fed by no game. @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
const TRADE_STOCK_WORDS = Object.freeze({ livestock: Object.freeze(['game']) });
/** @param {{ name?: unknown, catalogId?: unknown } | null | undefined} house @returns {string} the good its own trade takes, or '' */
const tradeKeyOf = (house) => { const id = String((typeof house?.catalogId === 'string' && house.catalogId) || catalogIdForName(str(house?.name)) || '');
  return Object.prototype.hasOwnProperty.call(HOUSE_TRADE_INPUT, id) ? HOUSE_TRADE_INPUT[id] : Object.prototype.hasOwnProperty.call(HOUSE_NEED_INPUT, id) ? HOUSE_NEED_INPUT[id] : ''; };
/** The import words that bring a chain key's good to a house (the chain's names, the list's own words, the trade's stock). @param {string} key @param {string[]} names @param {{ name?: unknown, catalogId?: unknown } | null | undefined} [house] */
const boughtNamesOf = (key, names, house) => [...names, ...(KEY_IMPORT_WORDS[key] ?? []), ...(house && tradeKeyOf(house) === key ? TRADE_STOCK_WORDS[key] ?? [] : [])];

/** The catalogue tags of a house whose trade IS the route (a market, a caravanserai). */
const ROUTE_HOUSE_TAGS = Object.freeze(['market', 'transport']);

/** The houses that produce a raw good here (the resource analysis's local producers, one home). */
const LOCAL_PRODUCERS = Object.freeze([
  { requirement: /\b(?:grain|foodstuffs?|provisions?)\b/i, houseName: /\b(?:farm|farmland|subsistence|grain fields?|managed farmland|common fields?)\b/i },
  { requirement: /\b(?:timber|lumber|wood)\b/i, houseName: /\b(?:woodcutter|logging camp|managed forest)\b/i },
  { requirement: /\bstone\b/i, houseName: /\b(?:stone quarry|quarry)\b/i },
  { requirement: /\b(?:charcoal|fuel)\b/i, houseName: /\b(?:charcoal burner|peat cutter|coal mine)\b/i },
  { requirement: /\bsalt\b/i, houseName: /\b(?:salt works|salt pans?|brine works?)\b/i },
]);

/** The words of a worked good: it meets no raw need (`tradeListDisplay.js :: WORKED_GOOD`'s words, and a smith's "work"). */
const WORKED_GOOD = /\b(?:tools?|arms|armou?r|weapons?|fittings?|components?|torcs?|jewel(?:le)?ry|candles?|supplies|equipment|vessels?|rigging|cordage|work|carved|carvings?)\b/i;

/** @param {unknown} x @returns {string} */
const str = (x) => (typeof x === 'string' ? x : x == null ? '' : String(x));
/** @param {unknown} x @returns {unknown[]} */
const arr = (x) => (Array.isArray(x) ? x : []);
/** @param {string} x one canonical spacing, lower case, the record's separators as spaces */
const norm = (x) => ` ${x.toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/[_/\-,.]+/g, ' ').replace(/\s+/g, ' ').trim()} `;
/** @param {string} text a normed list @param {string} word @returns {boolean} the word or its plural, whole */
const holds = (text, word) => text.includes(norm(word)) || text.includes(norm(`${word}s`));
/** @param {string} x a normed text @returns {string} its words singular ("mineral salts" names salt) */
const sing = (x) => x.replace(/([a-z]{3,}[^su\s])s(?= )/g, '$1');
/** @param {string} a @param {string} b @returns {boolean} one names the other whole ("Iron ore (mines exhausted)" and "iron ore") */
const wholeTokens = (a, b) => { const x = sing(norm(a)), y = sing(norm(b)); return x.trim() !== '' && y.trim() !== '' && (x.includes(y) || y.includes(x)); };

/**
 * Whether the record's own need list (the terrain's critical imports, `resourceAnalysis.imports.critical`: the goods the land
 * cannot give and the town's houses require) names the raw good whole (BAR5-CHAINS (b)). The generator's record in the making
 * carries the list as the saved record does (`resourceGenerator.js :: generateResourceAnalysis` hands it in).
 * @param {InputRecord | null | undefined} record @param {ReadonlyArray<string>} names the raw good's names
 * @returns {boolean}
 */
function needListNames(record, names) {
  const imports = /** @type {{ critical?: unknown } | unknown[] | null | undefined} */ (record?.resourceAnalysis?.imports);
  const critical = Array.isArray(imports) ? [] : arr(imports?.critical).map(str);
  return critical.some((c) => names.some((n) => wholeTokens(c, n)));
}

/**
 * Whether a local producer of the roster makes the requirement (a quarry for stone; salt works for salt).
 * @param {string} requirement @param {ReadonlyArray<unknown>} institutions
 */
export function localProducerSupplies(requirement, institutions) {
  const rule = LOCAL_PRODUCERS.find((candidate) => candidate.requirement.test(requirement));
  if (!rule) return false;
  return nativeSemanticNames(institutions).some((name) => rule.houseName.test(name));
}

/**
 * @typedef {{
 *   config?: { tradeRouteAccess?: unknown, stressTypes?: unknown, [key: string]: unknown } | null,
 *   economicState?: { localProduction?: unknown, primaryImports?: unknown,
 *     foodSecurity?: { importPct?: unknown, foodRecord?: { foodSources?: unknown, normalImportPct?: unknown } | null } | null } | null,
 *   institutions?: ReadonlyArray<unknown> | null,
 *   resourceAnalysis?: { imports?: { critical?: unknown } | unknown[] | null, gaps?: unknown } | null,
 * }} InputRecord the record, or the generator's record in the making (the same fields)
 */

/**
 * THE ONE READER: how a chain's raw input reaches a house.
 * @param {InputRecord | null | undefined} record
 * @param {string} chainKey the chain's key in `RESOURCE_CHAINS`
 * @param {{ rawResource?: unknown } | null | undefined} chain that chain (`RESOURCE_CHAINS[chainKey]`, handed in by the caller: the
 *   chain table is the lazy goods surface, which a fact, on the eager side, never imports: WEAVE ST-2)
 * @param {{ name?: unknown, [key: string]: unknown } | null | undefined} house the house asked about
 * @returns {'local' | 'route' | 'imported' | 'missing'}
 */
export function houseInputAtHand(record, chainKey, house, chain) {
  // BIRTH-2 (BR5's fifth story, the owner's "a failed business venture, but very rare"): the failed venture's house has no
  // input: its material never lay near and none is brought in (BIRTH-3, BR8: the house its stored row names)
  const venture = ventureHouseOf(record);
  if (venture && house && venture.name === str(house.name)) return 'missing';
  return inputAtHandCore(record, chainKey, house, chain);
}

/** @param {InputRecord | null | undefined} record @param {string} chainKey @param {{ name?: unknown, [key: string]: unknown } | null | undefined} house @param {{ rawResource?: unknown } | null | undefined} chain @returns {'local' | 'route' | 'imported' | 'missing'} */
function inputAtHandCore(record, chainKey, house, chain) {
  const spec = CHAIN_INPUTS[chainKey];
  const raw = str(chain?.rawResource);
  const config = record?.config || {};
  const es = record?.economicState || {};
  const words = spec ? spec.words : [raw];

  // A live native resource: its key or its commodities name the input.
  // BIRTH-2 (BR4 (b)): THE HOUSE PROVES ITS GROUND. A ground a source house implies and the story leaves there answers as a
  // live ground does (`supplyStory.js :: impliedGroundsOf`: BIRTH-3, BR8, read off the stored rows; no land list stores it)
  const implied = record && /** @type {Record<symbol, unknown>} */ (record)[AT_THE_ECONOMY] ? [] : [...impliedGroundsOf(/** @type {Parameters<typeof impliedGroundsOf>[0]} */ (record)).states].filter(([, st]) => st === 'there').map(([g]) => g);
  const keys = /** @type {string[]} */ (availableNativeResourceKeys(config));
  // FAULTS-BIRTH FR21 (3): an implied ground gives the goods of its water (`impliedGroundGoods`: a river's fishing ground no salt)
  const native = [...keys, ...keys.flatMap((k) => arr(/** @type {Record<string, { commodities?: unknown } | undefined>} */ (RESOURCE_DATA)[k]?.commodities)),
    ...implied.flatMap((g) => impliedGroundGoods(record, g))].map(str).map(norm).join('|');
  const rawNames = [raw, ...terrainSynonymsFor(raw)];
  if (words.some((w) => holds(native, w)) || rawNames.some((n) => holds(native, n))) return 'local';
  // What the town makes names the RAW good itself (never the chain's product).
  if (arr(es.localProduction).some((e) => rawNames.some((n) => wholeTokens(str(e), n)))) return 'local';
  // HW1 (BAR4-SCENES-2): a house on a ground wholly spent is not its own producer, and a house that works the ground itself
  // (SPENT_GROUND_WORKERS: the mine, the quarry, the boats) is fed by no import there either: the page's SV6 reading, one fact
  const spentGround = onWhollySpentGround(record, house);
  if (spentGround && worksTheGround(String((typeof house?.catalogId === 'string' && house.catalogId) || catalogIdForName(str(house?.name)) || ''))) return 'missing';
  // BIRTH-1 (the chair's ruling BR2 of 2026-11-17, the audit's R5; vetoable by the owner): ON A COAST THE SEA IS THE BRINE.
  // The salt works' input is the chain of desert salt, which only a live salt ground answered: 9 salt works of the census's
  // 720 stood on a coast "Short of salt.". On a port route or coastal terrain the sea answers it (a ground wholly spent is
  // read above, as the page's mark reads it).
  if (chainKey === 'desertSalt' && !spentGround && (str(config.tradeRouteAccess) === 'port' || str(config.terrainOverride) === 'coastal')) return 'local';
  // BIRTH-1 (BR2 (ii)): A HOUSE THAT IS THE SOURCE OF ITS MATERIAL IS ANSWERED ONLY BY ITS GROUND (`houseKinds.js ::
  // SOURCE_GROUNDS`: a stone quarry, a charcoal burner, a dairy farmer, a salt works). An import feeds a buyer, never the
  // work on the ground: the cooper's bought "Timber" burns no charcoal in the burner's kilns.
  const sourceHouse = isSourceHouse(String((typeof house?.catalogId === 'string' && house.catalogId) || catalogIdForName(str(house?.name)) || ''));
  if (!spentGround && localProducerSupplies(raw, liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (record)))) return 'local'; // the live roster: a ruined quarry quarries nothing

  // The route, where no siege shuts it. BAR5-CHAINS (b) (LAW 3's L3.needed, the chair's direction of BRIEF-BAR5 under HW1;
  // vetoable by the owner): A GOOD THE RECORD'S OWN NEED LIST NAMES IS NOT BROUGHT BY THE ROUTE ALONE. The terrain's need
  // list (`resourceAnalysis.imports.critical`, "grapes: Required by Vintner but not available in Coastal terrain") is
  // printed as "Needed, and not brought in: grapes" where no import names it, while this reader answered the vintner
  // 'route' (TAIL-DEFECON-R M-V: grapes come by any route), so its gap was never written and its rows stood bare (the
  // vintner in 38 of the census's 720, BAR5-AUDIT-B). A good the need list names reaches the house only as the imports
  // bring it (below); a house whose own trade IS the route (a market, a caravanserai) keeps the route.
  const besieged = arr(config.stressTypes).includes('under_siege');
  const imports = arr(es.primaryImports).map(str);
  const names = [raw, spec?.raw, spec?.noun, ...terrainSynonymsFor(raw)].filter((x) => typeof x === 'string' && x !== '');
  const routeHouse = institutionHasAnyTag(house || {}, [...ROUTE_HOUSE_TAGS]);
  if (!besieged && hasTradeRouteConnection(str(config.tradeRouteAccess))
    && (routeHouse || (spec?.route && !needListNames(record, /** @type {string[]} */ (names))))) return 'route';

  // The imports bring the raw good; the food record names the source or imports the staple. BIRTH-1 (BR2 (ii), kept narrow
  // by the count: the hand-back): A WORD THE BIRTH BROUGHT IN FOR A BUYER FEEDS NO SOURCE HOUSE. The birth reads a source
  // house over the list as the economy wrote it (`resourceGenerator.js :: supplyOfInput`), so where the record's own gap
  // says this house lacks this input, a buyer's word on the list (`houseKinds.js :: BUYER_IMPORT_WORDS`) is the buyers'
  // and not its own: 11 charcoal burners of the census's 720 read the cooper's bought "Timber" as their wood.
  // BIRTH-2 (BR4): LIFTED for the three that can run on bought-in material (`houseKinds.js :: RUNS_ON_BOUGHT`): the burner
  // burns the cordwood the town buys
  const runsOnBought = Object.prototype.hasOwnProperty.call(RUNS_ON_BOUGHT, idOfHouse(/** @type {{ name?: unknown }} */ (house)));
  const fed = sourceHouse && !runsOnBought && gapSaysMissing(record, house) ? imports.filter((imp) => !BUYER_IMPORT_WORDS.has(imp)) : imports;
  const bought = boughtNamesOf(chainKey, /** @type {string[]} */ (names), house);
  if (fed.some((imp) => !WORKED_GOOD.test(imp.replace(/\([^)]*\)/g, ' ')) && bought.some((n) => wholeTokens(imp, n)))) return 'imported';
  // BIRTH-3 (AMENDMENT 1 (2)): ONE GOOD, BOUGHT UNDER EITHER WORD: the trade's catalog holds the hides and the beasts one good
  // ("Raw hides and animal products" is an alias of livestock, `goodsCatalog.js`), and the birth writes no second word of it
  const oneGood = Object.prototype.hasOwnProperty.call(ONE_GOOD_BOUGHT, chainKey) ? ONE_GOOD_BOUGHT[chainKey] : [];
  if (oneGood.length && fed.some((imp) => !WORKED_GOOD.test(imp.replace(/\([^)]*\)/g, ' ')) && oneGood.some((n) => wholeTokens(imp, n)))) return 'imported';
  const food = es.foodSecurity?.foodRecord;
  if (spec?.food && arr(food?.foodSources).some((x) => spec.food?.includes(str(x)))) return 'imported';
  if (spec?.staple && (Number(food?.normalImportPct) > 0 || Number(es.foodSecurity?.importPct) > 0)) return 'imported';
  return 'missing';
}

/**
 * Whether the record's own gaps say this house lacks its input (`resourceAnalysis.gaps[]`, kind `missing`): the birth
 * writes that row only where none of the house's inputs reached it (`resourceGenerator.js :: evaluateInstitutionChain`).
 * @param {InputRecord | null | undefined} record @param {{ name?: unknown } | null | undefined} house
 */
function gapSaysMissing(record, house) {
  const name = str(house?.name);
  const gaps = /** @type {{ gaps?: unknown } | null | undefined} */ (record?.resourceAnalysis)?.gaps;
  return !!name && arr(gaps).some((x) => { const g = /** @type {{ institution?: unknown, kind?: unknown } | null} */ (x);
    return !!g && g.institution === name && g.kind === 'missing'; });
}

/** A row a user authored (custom content), as the page's leaf reads it (`crisisStoppedRow.js`). @param {{ custom?: unknown, source?: unknown, isCustom?: unknown } | null | undefined} row */
const isCustom = (row) => row?.custom === true || row?.source === 'custom' || row?.isCustom === true;

/**
 * THE THIRD READING (SV6): the houses whose every own ground the page prints as depleted, none kept by magic and none fed
 * by the shortage import the trade record shows, each with what it is short of (`SPENT_GROUND_YIELD`).
 * @param {object} settlement
 * @returns {ReadonlyMap<string, string>} house name -> what it is short of
 */
export function housesOnSpentGround(settlement) {
  const core = spentGroundCore(settlement);
  const venture = ventureHouseOf(/** @type {InputRecord} */ (settlement));
  if (!venture || !core.has(venture.name)) return core;
  return new Map([...core].filter(([house]) => house !== venture.name)); // the failed venture is no worked-out ground
}

/**
 * Whether a house works the ground itself, so that no import feeds it there (BIRTH-2, BR4's distinction): a TAKER
 * (`houseKinds.js :: TAKERS`), read beside the dependence table's `SPENT_GROUND_WORKERS` (its fish market is a buyer, the
 * owner's table; its salt works runs on bought-in salt). @param {string} id a catalogue id
 */
export const worksTheGround = (id) => TAKERS.has(id) || (SPENT_GROUND_WORKERS.includes(id) && !BUYS_AND_WORKS.has(id) && !Object.prototype.hasOwnProperty.call(RUNS_ON_BOUGHT, id));

/** The spent-ground reading before the failed venture is set apart. @param {object} settlement @returns {ReadonlyMap<string, string>} */
function spentGroundCore(settlement) {
  if (settlement && typeof settlement === 'object') { const hit = SPENT_OF.get(settlement); if (hit) return hit; }
  const out = spentGroundReading(settlement);
  if (settlement && typeof settlement === 'object') SPENT_OF.set(settlement, out);
  return out;
}

/** @param {object} settlement @returns {Map<string, string>} */
function spentGroundReading(settlement) {
  const s = /** @type {{ config?: { nearbyResourcesDepleted?: unknown }, economicState?: { activeChains?: unknown, primaryImports?: unknown } }} */ (settlement);
  const spent = new Set(Array.isArray(s.config?.nearbyResourcesDepleted) ? s.config.nearbyResourcesDepleted : []);
  /** @type {Map<string, string>} */
  const out = new Map();
  const imports = new Set((Array.isArray(s.economicState?.primaryImports) ? s.economicState.primaryImports : []).map(String));
  const chains = /** @type {Array<{ resourceKey?: unknown, status?: unknown, processingInstitutions?: unknown }>} */ (Array.isArray(s.economicState?.activeChains) ? s.economicState.activeChains : []);
  /** @type {Map<string, Array<{ resourceKey?: unknown, status?: unknown }>>} */
  const grounds = new Map();
  for (const c of chains) {
    if (!c || typeof c.resourceKey !== 'string' || !c.resourceKey) continue;
    for (const h of Array.isArray(c.processingInstitutions) ? c.processingInstitutions : []) {
      if (typeof h !== 'string') continue;
      if (!grounds.has(h)) grounds.set(h, []);
      /** @type {Array<{ resourceKey?: unknown, status?: unknown }>} */ (grounds.get(h)).push(c);
    }
  }
  // BAR3-SERVICES (S3): a fishing house no chain names works the chains on the town's own fisheries
  // (`GROUNDS_WORKED_OFF_CHAIN`), and is judged by the same reading as a house a chain names
  for (const inst of liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement))) {
    const house = inst && typeof inst.name === 'string' ? inst.name : '';
    if (!house || grounds.has(house) || isCustom(inst)) continue;
    const id = String((typeof inst.catalogId === 'string' && inst.catalogId) || catalogIdForName(house) || '');
    if (!Object.prototype.hasOwnProperty.call(GROUNDS_WORKED_OFF_CHAIN, id)) continue;
    const own = chains.filter((c) => c && typeof c.resourceKey === 'string' && GROUNDS_WORKED_OFF_CHAIN[id].includes(c.resourceKey));
    // RULING FS1 (the chair's, 2026-11-16; vetoable by the owner): where no chain works the town's fisheries, the grounds
    // themselves: the town's own fisheries of these kinds on the record (`config.nearbyResources`), whatever the food ledger counts
    const fished = own.length ? own : nearbyGrounds(settlement).filter((k) => GROUNDS_WORKED_OFF_CHAIN[id].includes(k)).map((k) => ({ resourceKey: k }));
    if (fished.length) grounds.set(house, fished);
  }
  for (const [house, own] of grounds) {
    // BAR6-MARKS (8a.input): a house whose trade is a good (`HOUSE_TRADE_INPUT`) is read by the one reader of that good
    // (`housesWantingTradeInput`), not by the chains it is listed on (the cooper's barrels hold the herds' meat: it was
    // "Short of livestock." on a spent pasture; a brewery "Short of grain." on spent fields that the imports refill), but
    // the houses this reading held before it (`SPENT_READ_HELD`) keep it
    const tradeId = String(catalogIdForName(house) ?? '');
    if (Object.prototype.hasOwnProperty.call(HOUSE_TRADE_INPUT, tradeId) && !SPENT_READ_HELD.includes(tradeId)) continue;
    const works = worksTheGround(String(catalogIdForName(house) ?? '')); // an import feeds a buyer, never the work on the ground (BIRTH-2: a taker)
    // BIRTH-1 (BR2 (i), the audit's "what is left" 2): a buyer is fed by the shortage import of its spent ground, or by an
    // import that brings the ground's yield by its own name ("Medicinal herbs" feeds the apothecary on spent foraging
    // grounds: the birth writes no second herb import beside it, `resourceGenerator.js :: importsBroughtAtBirth`)
    const allSpent = own.every((c) => spent.has(/** @type {string} */ (c.resourceKey)) && c.status !== 'magically_sustained'
      && (works || (!imports.has(String(resourceShortageImport(/** @type {string} */ (c.resourceKey)) ?? ''))
        && !yieldImported([...imports], /** @type {string} */ (c.resourceKey)))));
    if (!allSpent) continue;
    const key = /** @type {string} */ (own[0].resourceKey);
    out.set(house, Object.prototype.hasOwnProperty.call(SPENT_GROUND_YIELD, key) ? SPENT_GROUND_YIELD[key] : 'its materials');
  }
  // BIRTH-2 (BR4, the audit's c1): A SOURCE HOUSE IS READ BY ITS KIND'S GROUNDS AND THE GROUNDS OF THE TOWN, NOT BY THE CHAINS
  // IT IS LISTED ON (a live coal chain hid six peat cutters' spent marsh): its story (`supplyStory.js :: sourceStoryOf`):
  // idle on a used-up ground, stored or implied, is short of that ground's yield; at work (its ground there, or its material
  // bought in) is not
  for (const inst of liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement))) {
    const house = inst && typeof inst.name === 'string' ? inst.name : '';
    if (!house || isCustom(inst)) continue;
    const story = sourceStoryOf(/** @type {Parameters<typeof sourceStoryOf>[0]} */ (settlement), inst, resourceShortageImport);
    if (!story) continue;
    if (story.story === 'idle' && story.ground) out.set(house, Object.prototype.hasOwnProperty.call(SPENT_GROUND_YIELD, story.ground) ? SPENT_GROUND_YIELD[story.ground] : 'its materials');
    else if (story.story === 'local' || story.story === 'bought') out.delete(house);
  }
  return out;
}

/**
 * Whether an import brings a spent ground's yield (`SPENT_GROUND_YIELD`) by its own name, a worked good meeting none.
 * @param {ReadonlyArray<string>} imports @param {string} key the ground
 */
function yieldImported(imports, key) {
  const good = Object.prototype.hasOwnProperty.call(SPENT_GROUND_YIELD, key) ? SPENT_GROUND_YIELD[key] : '';
  return !!good && imports.some((imp) => !WORKED_GOOD.test(imp.replace(/\([^)]*\)/g, ' ')) && wholeTokens(imp.replace(/\([^)]*\)/g, ' '), good));
}

/**
 * The town's own grounds on the record (`config.nearbyResources`), depleted or not (FS1).
 * @param {object} settlement
 * @returns {string[]}
 */
function nearbyGrounds(settlement) {
  const near = /** @type {{ config?: { nearbyResources?: unknown } }} */ (settlement).config?.nearbyResources;
  return Array.isArray(near) ? near.filter((k) => typeof k === 'string') : [];
}

/**
 * BAR4-SCENES-2 (the chair's ruling HW1 of 2026-11-16 12:26 UTC; vetoable by the owner): A GROUND WHOLLY SPENT IS NOT AT HAND.
 * The stone quarry of r2r-city-18 was answered `local` here (the quarry is its own local producer of stone) while the page
 * marked it "Short of stone." by `housesOnSpentGround` above: one fact, two values. A house of the roster whose every own
 * ground the record holds spent is not answered by the town's own producer of its input (the house itself, a quarry for
 * stone), and a house that works the ground itself (`SPENT_GROUND_WORKERS`) is fed by no import there either ("an import
 * feeds a buyer, never the work on the ground", SV6's own rule): THIS SIDE MOVED (the page's mark is unchanged). A live
 * ground of the input still answers it.
 * @param {unknown} record @param {{ name?: unknown } | null | undefined} house
 */
function onWhollySpentGround(record, house) {
  const name = house && typeof house.name === 'string' ? house.name : '';
  if (!name || !record || typeof record !== 'object') return false;
  return spentGroundCore(record).has(name);
}
/** One spent-ground reading a record object. @type {WeakMap<object, ReadonlyMap<string, string>>} */
const SPENT_OF = new WeakMap();

/**
 * Each chain's raw input as the chain table names it (`resourceChains.js :: RESOURCE_CHAINS[key].rawResource`), copied so
 * that a fact (eager) can read a gap's chain without the lazy chain table (WEAVE ST-2); the scene's guard pins the copy to
 * the table, name for name (`tests/generators/bar4ScenePresumption.test.js`).
 * @type {Readonly<Record<string, string>>}
 */
export const CHAIN_RAW_INPUT = Object.freeze({
  wool: "wool",
  flax: "flax",
  grain: "grain",
  grapes: "grapes",
  livestock: "livestock",
  ironOre: "iron ore",
  copperOre: "copper ore",
  preciousMetals: "gold/silver ore",
  timber: "timber",
  stone: "stone",
  clay: "clay",
  hides: "animal hides",
  fish: "fish",
  gemstones: "gemstones",
  sand: "glass sand",
  herbs: "medicinal herbs",
  alpineWool: "alpine_pasture",
  mountainTimber: "mountain_timber",
  desertSalt: "desert_salt",
  desertGlass: "glass_sand",
  camelCaravan: "camel_herds",
  oasisDate: "oasis_water",
  mineralHot: "hot_springs_mineral",
});
/** The chain key of a gap's raw input name. @type {ReadonlyMap<string, string>} */
const CHAIN_KEY_OF_RAW = new Map(Object.entries(CHAIN_RAW_INPUT).map(([key, rawName]) => [rawName, key]));

/** One reading a record object (the page reads it many times over). @type {WeakMap<object, ReadonlyMap<string, string>>} */
const SHORT_OF = new WeakMap();

/**
 * THE ONE FACT "THIS HOUSE IS SHORT" (BAR4-SCENES-2, the chair's ruling HW1 of 2026-11-16 12:26 UTC; vetoable by the owner),
 * read by the arrival scene (`facts/tradeAtWork.js`), as the page's mark reads it (`crisisStoppedRow.js :: housesShortOfInput`):
 *   (i)  a house the record's gaps call short of an input (`resourceAnalysis.gaps[].institution`), none of whose gapped
 *        inputs the record answers on this reading (`houseInputAtHand`), the gaps the record holds everywhere excepted
 *        (`INPUT_GAP_HELD_EVERYWHERE`, S7);
 *   (ii) a house on a ground wholly spent (`housesOnSpentGround`, SV6);
 *   (iii) (BAR6-MARKS) a house whose trade is a good (`HOUSE_TRADE_INPUT`) that no gap of its own speaks of, where that good
 *        is not had (`housesWantingTradeInput`).
 * @param {unknown} record the settlement record
 * @returns {ReadonlyMap<string, string>} house name -> what it is short of (the input's noun)
 */
export function housesShortOf(record) {
  if (!record || typeof record !== 'object') return new Map();
  const cached = SHORT_OF.get(record);
  if (cached) return cached;
  const r = /** @type {Parameters<typeof houseInputAtHand>[0] & { resourceAnalysis?: { gaps?: unknown } | null }} */ (record);
  const gaps = /** @type {Array<{ institution: string, chain?: unknown }>} */ (arr(r?.resourceAnalysis?.gaps).filter((/** @type {unknown} */ x) => { const g = /** @type {{ institution?: unknown } | null | undefined} */ (x); return !!g && typeof g === 'object' && typeof g.institution === 'string' && !!g.institution; }));
  /** @type {Map<string, string>} */
  const out = new Map();
  for (const name of [...new Set(gaps.map((g) => g.institution))]) {
    if (Object.prototype.hasOwnProperty.call(INPUT_GAP_HELD_EVERYWHERE, name)) continue;
    const house = liveInstitutions(r).find((i) => i?.name === name) || { name };
    const keys = gaps.filter((g) => g.institution === name).map((g) => CHAIN_KEY_OF_RAW.get(str(g.chain))).filter((k) => typeof k === 'string' && !!CHAIN_INPUTS[k]);
    if (!keys.length) continue;
    if (keys.some((key) => houseInputAtHand(r, /** @type {string} */ (key), house, { rawResource: CHAIN_RAW_INPUT[/** @type {string} */ (key)] }) !== 'missing')) continue;
    out.set(name, [...new Set(keys.map((key) => CHAIN_INPUTS[/** @type {string} */ (key)].noun))].join(' or '));
  }
  for (const [house, ground] of housesOnSpentGround(r)) if (!out.has(house)) out.set(house, ground);
  // BIRTH-3 (BR8 (2)): the failed venture, by its stored row, where its good is no chain's (a peat cutter's peat): short of it
  const venture = ventureHouseOf(r);
  if (venture && !out.has(venture.name)) { const row = gaps.find((g) => g.institution === venture.name); if (row) out.set(venture.name, str(row.chain).replace(/_/g, ' ')); }
  // BAR6-MARKS (iii): a house whose trade is a good no gap of its own speaks of, where that good is not had
  for (const [house, want] of housesWantingTradeInput(r)) if (want.reach === 'missing' && !out.has(house)) out.set(house, want.noun);
  SHORT_OF.set(record, out);
  return out;
}

/** The goods a sawmill makes of its timber (`computeActiveChains.js :: CHAIN_OUTPUT_INST_GATES`). */
const SAWN_GOODS = Object.freeze(['Milled timber', 'Milled lumber']);

/**
 * A SAWN GOOD IS MADE ONLY WHERE THE SAWMILL HAS ITS TIMBER (BAR4-RECORD R1, the chair's grant of 2026-11-16 08:19 UTC;
 * vetoable by the owner): the economy's output gate for 'Milled timber' and 'Milled lumber' asks this reading of the
 * town's sawmill. The river-milling chain named "Milled lumber" beside "No timber reaches the sawmill." (3 towns of the
 * census's 720 and bar0-village-famine-rand-21). Asked at the economy's own hour, over the live resources and the roster:
 * the imports are not drawn yet, so a sawmill fed only by an import makes no sawn good (its gap then says it runs on
 * imported timber: silence, never two values).
 * @param {string} good the output asked about
 * @param {ReadonlyArray<string>} nearbyResources the town's resource keys @param {ReadonlyArray<string>} depletedResources
 * @param {ReadonlyArray<unknown> | null | undefined} institutions the roster
 * @param {(house: unknown) => boolean} isSawmill the caller's own test of a sawmill (its gate's keyword)
 * @param {Readonly<Record<string, { rawResource?: unknown }>>} chains the chain table (`RESOURCE_CHAINS`, the caller's)
 * @returns {boolean} true unless the good is a sawn good and no sawmill of the roster has its timber
 */
export function sawnGoodFed(good, nearbyResources, depletedResources, institutions, isSawmill, chains) {
  if (!SAWN_GOODS.includes(good) || !Array.isArray(institutions)) return true;
  const depleted = new Set(arr(depletedResources).map((r) => resourceKeyForLabel(str(r)) || str(r)));
  const record = { config: { nearbyResources: arr(nearbyResources).map(str).filter((k) => !depleted.has(k)) }, economicState: {}, institutions, [AT_THE_ECONOMY]: true };
  return institutions.filter((i) => !!i && isSawmill(i))
    .some((house) => houseInputAtHand(record, 'timber', /** @type {Parameters<typeof houseInputAtHand>[2]} */ (house), chains.timber) !== 'missing' || houseInputAtHand(record, 'mountainTimber', /** @type {Parameters<typeof houseInputAtHand>[2]} */ (house), chains.mountainTimber) !== 'missing');
}

/**
 * A house name's head word, as a kind: lower case, no counts or possessives, no plural or -y ending ("Sawmill
 * (commercial)" and "Sawmill" are one kind; "Carpenters (5-15)" and "Carpenters' guild" one). Moved here from
 * `resourceGenerator.js` (one home), which reads it for its houses by kind.
 * @param {unknown} name
 */
export const houseHead = (name) => (String(name || '').toLowerCase().replace(/\([^)]*\)/g, ' ')
  .split(/[\s/]+/).find(Boolean) || '').replace(/['’]/g, '').replace(/s$/, '').replace(/y$/, '');

/**
 * The kinds whose ladder rungs run their chain's work (the chair's ruling R2 of 2026-11-16 09:27 UTC, vetoable by the
 * owner): the sawmill alone. Measured by head on the census's 720, a rung of every chain's house reads 774 instances in 328
 * towns (weavers, butchers, dyers, carpenters, tanners, smiths, apothecaries): a MEASURED KIND for the next round, not a
 * cure (a butcher beside hunting grounds works game this reading does not read as livestock).
 */
const RUNG_HEADS = Object.freeze(['sawmill']);

/**
 * Whether a house runs a chain: the chain names it, OR names a house of its kind where that kind's rungs are admitted
 * (`RUNG_HEADS`; BAR4-RECORD R1, the chair's rulings of 2026-11-16 09:23 and 09:27 UTC, vetoable by the owner: A LADDER
 * RUNG IS THE SAME HOUSE: "Sawmill (commercial)" runs the timber chain the "Sawmill" runs, and is short of timber where
 * the Sawmill would be).
 * @param {{ processingInstitutions?: ReadonlyArray<string> } | null | undefined} chain @param {unknown} name
 */
export const houseRunsChain = (chain, name) => {
  const houses = arr(chain?.processingInstitutions).map(str);
  const head = houseHead(name);
  return houses.includes(str(name)) || (RUNG_HEADS.includes(head) && houses.some((h) => houseHead(h) === head));
};

/**
 * The chains a house runs, as `[chainKey, chain]` (`houseRunsChain`).
 * @param {unknown} name
 * @param {Readonly<Record<string, C>>} chains the chain table (`RESOURCE_CHAINS`, the caller's: WEAVE ST-2)
 * @template {{ processingInstitutions?: ReadonlyArray<string> } | null | undefined} C
 * @returns {Array<[string, C]>}
 */
export const chainsOfHouse = (name, chains) => Object.entries(chains).filter(([, c]) => houseRunsChain(c, name));

/**
 * THE TRADES THAT FINISH WHAT A CHAIN'S HOUSE FINISHES (W2-C-LEAVES R1, the chair's ruling on REVIEW-R2-STAGES finding
 * 1: "by kind" answers a house with no catalogue row too). One closed list, keyed by the house a chain's list names;
 * each entry gives the words of a house's name that do the same finishing, with the cause. Matched on the live
 * roster's own houses (a road to a neighbour's house, "Access to …", finishes nothing here). MOVED HERE from
 * `display/validationOnPage.js` (BAR5-CHAINS, LAW 3's L3.halfway, the chair's direction (a) of BRIEF-BAR5; vetoable by the
 * owner): the record's gap (`resourceGenerator.js :: evaluateInstitutionChain`) named "Fulling mill" missing beside a Fuller
 * and "Leatherworkers' guild" beside a Cobbler's guild while the page's line read this table (98 of the 171 houses the gaps
 * of the census's 720 called missing in its half-way towns, the audit BAR5-AUDIT-B): ONE TABLE, both read it.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const FINISHING_TRADES = Object.freeze({
  "leatherworkers' guild": ['leatherwork', 'cobbler', 'furrier', 'saddler', 'cordwainer', 'shoemaker'], // the review's 17: a Cobbler's guild or a Furrier's district finishes the leather
  "carpenters' guild": ['carpenter', 'joiner', 'cooper', 'wheelwright'], // the review's 3: Carpenters (5-15) beside "no carpenters' guild"
  'sawmill': ['sawmill', 'sawyer', 'lumber'],
  'apothecary': ['apothecar', 'herbalist', 'alchemist'], // the review's 4: an Apothecary or Alchemist house finishes the herbs
  'alchemist shop': ['alchemist', 'apothecar'],
  "blacksmiths' guild": ['blacksmith', 'smithy', 'smith', 'armourer', 'armorer', 'weaponsmith', 'metalworker'],
  'smelter': ['smelter', 'foundry', 'ironworks'],
  "goldsmiths' guild": ['goldsmith', 'silversmith', 'jeweler', 'jeweller'],
  "jewelers' guild": ['jeweler', 'jeweller', 'gem cutter', 'lapidar', 'goldsmith'],
  "coppersmiths' guild": ['coppersmith'],
  "stonemasons' guild": ['stonemason', 'mason', 'stonecutter'],
  "weavers' guild": ['weaver', 'textile', 'cloth'],
  "dyers' guild": ['dyer'],
  'fulling mill': ['fuller', 'fulling'],
  'glassblower': ['glassblow', 'glassmaker', 'glassworks'],
  'potter': ['potter', 'pottery'],
  'brickmaker': ['brickmaker', 'brickworks', 'potter'], // a Potter finishes the clay (the cold list REVIEW-W2A-3 #990; r2s-insurgency-town-0)
});

/**
 * THE LIVE HOUSE THAT FINISHES A CHAIN'S NAMED HOUSE'S WORK BY ITS TRADE (`FINISHING_TRADES`), or undefined. Read BY
 * CATALOGUE IDENTITY, never by a display name: a stamped house answers by its `catalogId` (the keyword id-set, built from
 * the catalogue's own names: `institutionCategory.js :: institutionMatchesKeyword`, so a generated roster is matched
 * exactly as its names would be), an unstamped native one by its name, a custom house never. A road to a neighbour's
 * house ("Access to …") finishes nothing here. The record's gap writer and the page's gap reader both read this.
 * @param {ReadonlyArray<unknown> | null | undefined} houses the roster to look in (the live one, or the generator's native roster)
 * @param {unknown} name a house the chain's list names
 * @returns {Record<string, unknown> | undefined}
 */
export function tradeFinisherIn(houses, name) {
  const trades = FINISHING_TRADES[str(name).toLowerCase()];
  if (!trades) return undefined;
  return /** @type {Record<string, unknown> | undefined} */ (arr(houses).find((x) => {
    const inst = /** @type {{ name?: unknown, catalogId?: unknown } | null | undefined} */ (x);
    if (!inst || typeof inst !== 'object') return false;
    const have = str(inst.name).toLowerCase(), id = typeof inst.catalogId === 'string' ? inst.catalogId : '';
    if (!have || have.startsWith('access to') || id.startsWith('access_to')) return false;
    return trades.some((w) => institutionMatchesKeyword(/** @type {Parameters<typeof institutionMatchesKeyword>[0]} */ (inst), w));
  }));
}

/** How the mark names a trade's good: the smiths work iron, not its ore. @param {string} key */
const tradeNoun = (key) => (key === 'ironOre' ? 'iron' : key === 'luxury' ? 'luxury goods' : CHAIN_INPUTS[key]?.noun ?? 'its materials');

/** The houses of `HOUSE_TRADE_INPUT` the spent-ground reading held before it, whose line was `input` at afa46d644 (the sawmills, the smelter). */
const SPENT_READ_HELD = Object.freeze(['sawmill', 'sawmill_commercial', 'smelter']);

/**
 * Whether the record's imports bring a chain's raw good by its own name (`houseInputAtHand`'s own reading of the imports).
 * @param {InputRecord} record @param {string} key
 */
function importsBring(record, key) {
  const spec = CHAIN_INPUTS[key], raw = CHAIN_RAW_INPUT[key] ?? '';
  const names = boughtNamesOf(key, /** @type {string[]} */ ([raw, spec?.raw, spec?.noun, ...terrainSynonymsFor(raw)].filter((x) => typeof x === 'string' && x !== '')));
  return arr(record?.economicState?.primaryImports).map(str).some((imp) => !WORKED_GOOD.test(imp.replace(/\([^)]*\)/g, ' ')) && names.some((n) => wholeTokens(imp, n)));
}

/**
 * Whether the record's own chains say a house of the town depends on this good from outside (`activeChains[].dependency`:
 * the field the page's "… depend on timber from outside, which the siege has cut off" is written from, `chainNeedShown.js`).
 * @param {InputRecord & { economicState?: { activeChains?: unknown } | null }} record @param {string} key
 */
function dependsFromOutside(record, key) {
  const words = CHAIN_INPUTS[key]?.words ?? [];
  return arr(/** @type {{ activeChains?: unknown }} */ (record?.economicState ?? {}).activeChains).some((c) => {
    const res = str(/** @type {{ dependency?: { resource?: unknown } | null } | null} */ (c)?.dependency?.resource);
    return res !== '' && words.some((w) => holds(norm(res), w));
  });
}

/** The war as the stress container types it: the kind, or its pulse type (`stressorPicker.js :: GEN_TO_PULSE_TYPE`, the same word). */
const WAR_TYPES = Object.freeze(['wartime']);

/**
 * Is a war in force here, by the record's stress container (EG1: import-free of `crisisKind.js`)?
 * @param {unknown} record @returns {boolean}
 */
export function atWar(record) {
  return canonStressors(/** @type {Parameters<typeof canonStressors>[0]} */ (record))
    .some((/** @type {unknown} */ e) => !!e && typeof e === 'object' && WAR_TYPES.includes(String(/** @type {{ type?: unknown }} */ (e).type)));
}


/**
 * BAR6-MARKS (fact (e), left by BAR5-MARKS under WM1b; vetoable by the owner): WHERE THE PAGE PRINTS THE WAR'S IRON HOOK
 * AND NO WAR IS IN FORCE HERE (an occupied town of a land at war). `warReach.js :: warTakesOf` stops the forge work as a
 * war's crisis in a town at war only; here the hook's own reading is the input's. The war is read off the record's stress
 * container (`canonicalAccessors.js :: canonStressors`, the chair's EG1 form, as BAR6-HOUSES's `sovereign.js`), not
 * `crisisKind.js`, which is pinned lazy and this eager fact may not import; the guard holds it equal to `crisisOf`.
 * @param {unknown} record @returns {boolean}
 */
export function warIronHookOutsideWar(record) {
  const r = /** @type {{ economicViability?: { dependencies?: unknown } | null, economicState?: { primaryImports?: unknown } | null } | null} */ (record);
  if (!r || atWar(record)) return false;
  // BIRTH-3 (the chair's ruling BR9: a mark the players see is never read off the DM's hooks): the hook's own predicate
  // (`warIronHook.js`) over the kept fields; the war's state as `facts/warState.js :: warStateOf` reads it off the record,
  // here off the stress container (EG1: warState.js reaches a module the build pins lazy; the guard holds the two equal)
  // BAR8 MARKS-2 item 4 (RULING BR16): an occupation alone is peace for the iron (`warIronHook.js :: ironWarState`), so the mark,
  // the income row's mark and the forges' scene, which read this, fall together; a siege keeps its own reading
  const types = canonStressors(/** @type {Parameters<typeof canonStressors>[0]} */ (record)).map((e) => String(/** @type {{ type?: unknown } | null} */ (e)?.type ?? ''));
  return warHoldsIron(arr(r.economicViability?.dependencies), arr(r.economicState?.primaryImports), warStateOnRecord(record), types);
}

/** LEFT-MARKS M4: the stress types that put the town at the front, or at war, in the generator's words and the world pulse's
 * (`stressorPicker.js :: GEN_TO_PULSE_TYPE`: under_siege is the pulse's `siege`, occupied its `occupation`; wartime is one word) */
const FRONT_TYPES = Object.freeze(['under_siege', 'siege']);
const AT_WAR_TYPES = Object.freeze(['wartime', 'occupied', 'occupation']);

/**
 * THE WAR'S STATE OFF THE STRESS CONTAINER (EG1: `facts/warState.js :: warStateOf` reads it through `crisisKind.js`, which the
 * build pins lazy). LEFT-MARKS M4 (the second reader on BIRTH-3, 2026-11-17): the copy reads the world pulse's words too (a
 * town the pulse moved on carries `siege` or `occupation`, which read as peace here and as "front" and "at war" there);
 * tests/domain/supplyStoryLaw.test.js holds it equal to `warStateOf` over the 720, the 150 and records carrying each word.
 * @param {unknown} record @returns {'front' | 'at war' | 'peace'}
 */
export function warStateOnRecord(record) {
  const types = canonStressors(/** @type {Parameters<typeof canonStressors>[0]} */ (record)).map((e) => String(/** @type {{ type?: unknown } | null} */ (e)?.type ?? ''));
  return types.some((t) => FRONT_TYPES.includes(t)) ? 'front' : types.some((t) => AT_WAR_TYPES.includes(t)) ? 'at war' : 'peace';
}

/** The luxury trade's own goods, which no chain carries (`HOUSE_TRADE_INPUT`'s `luxury`). */
const LUXURY_NAMES = Object.freeze(['luxury goods', 'luxury materials']);
/** An import or a product that meets the luxury trade's need. */
const LUXURY_MET = /\b(?:luxur|exotic)/i;

/** One reading a record object. @type {WeakMap<object, ReadonlyMap<string, { noun: string, reach: 'missing' | 'imported' }>>} */
const WANTING_OF = new WeakMap();

/**
 * THE GOOD A HOUSE'S TRADE WORKS, WHERE NO GAP OF ITS OWN SPEAKS (BAR6-MARKS, LAW 8's 8a.input, BRIEF-BAR6 fact (a),
 * 2026-11-16; vetoable by the owner). The record's gap writer speaks only of the houses a chain names; the cooper, the
 * woodcarver, the carpenters, the smiths, the fuller, the cobbler and the brewery work a good no chain names them for
 * (`crisisDependence.js :: HOUSE_TRADE_INPUT`), and printed bare where the page said that good was "Needed, and not brought
 * in" or cut off by the siege. Each such live, native house with no gap of its own is read by THE ONE READER of an input
 * (`houseInputAtHand` above, the chain's raw input handed in from `CHAIN_RAW_INPUT`):
 *   'missing'   the good is not had: the house is short of it (`housesShortOf` (iii), the page's "Short of timber.");
 *   'imported'  the imports bring it: under a siege the house works what it holds (`crisisStoppedRow.js ::
 *               housesOnImportedInput`, "Curtailed by the siege."); in a quiet town nothing is marked. Under a siege a good
 *               the land gives AND the imports bring is read so too where the record's chains say the town depends on
 *               it from outside: its imported share is cut (the page's "… depend on timber from outside, which the siege
 *               has cut off"); a good the town works itself and the chains do not say comes from outside is its own work.
 * The luxury trade's goods (no chain) are not had where the record's own need list names them, no siege is in force (it
 * stops the trade itself), and neither the town's production nor its imports bring a luxury or exotic good. AND THE WAR'S IRON HOOK OUTSIDE A WAR (fact (e), `warIronHookOutsideWar` below):
 * where the page prints it and no siege is in force (a siege's own reading of the imports stands there), every house
 * whose trade is iron is short of it, gap or none. A house on a spent ground is left to that reading (SV6).
 * @param {unknown} record the settlement record
 * @returns {ReadonlyMap<string, { noun: string, reach: 'missing' | 'imported' }>} house name -> the good and how it is had
 */
export function housesWantingTradeInput(record) {
  if (!record || typeof record !== 'object') return new Map();
  const cached = WANTING_OF.get(record);
  if (cached) return cached;
  const r = /** @type {Parameters<typeof houseInputAtHand>[0] & { resourceAnalysis?: { gaps?: unknown } | null }} */ (record);
  const gapped = new Set(arr(r?.resourceAnalysis?.gaps).map((/** @type {unknown} */ g) => str(/** @type {{ institution?: unknown } | null} */ (g)?.institution)).filter(Boolean));
  const spent = housesOnSpentGround(record);
  // the hook outside a war, and outside a siege too: a siege reads the iron by the imports' own reading (S1 (i))
  const warIron = warIronHookOutsideWar(record) && !arr(r?.config?.stressTypes).includes('under_siege');
  const imports = arr(r?.economicState?.primaryImports).map(str);
  const made = arr(r?.economicState?.localProduction).map(str);
  const besieged = arr(r?.config?.stressTypes).includes('under_siege');
  /** @type {Map<string, { noun: string, reach: 'missing' | 'imported' }>} */
  const out = new Map();
  for (const inst of liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (r))) {
    const name = inst && typeof inst.name === 'string' ? inst.name : '';
    if (!name || isCustom(inst) || spent.has(name)) continue;
    const id = String((typeof inst.catalogId === 'string' && inst.catalogId) || catalogIdForName(name) || '');
    const key = Object.prototype.hasOwnProperty.call(HOUSE_TRADE_INPUT, id) ? HOUSE_TRADE_INPUT[id] : '';
    if (!key) {
      // LEFT-MARKS item 3 (L25): a house of `HOUSE_NEED_INPUT` is short only where the record's own need list names its good
      // and the one reader finds it nowhere (the page's "Needed, and not brought in: …" beside the house)
      const need = Object.prototype.hasOwnProperty.call(HOUSE_NEED_INPUT, id) ? HOUSE_NEED_INPUT[id] : '';
      if (!need || !CHAIN_INPUTS[need] || gapped.has(name)) continue;
      if (needListNames(r, [CHAIN_RAW_INPUT[need], CHAIN_INPUTS[need].noun].filter(Boolean))
        && houseInputAtHand(r, need, inst, { rawResource: CHAIN_RAW_INPUT[need] }) === 'missing') out.set(name, { noun: tradeNoun(need), reach: 'missing' });
      continue;
    }
    if (key === 'ironOre' && warIron) { out.set(name, { noun: 'iron', reach: 'missing' }); continue; }
    if (gapped.has(name)) continue; // the record's gap writer spoke of this house: its own reading stands
    if (key === 'luxury') {
      // a siege stops the luxury trade's goods already (its line, `goods`); any luxury or exotic import meets the need, as
      // the Economics tab meets it ("Luxury textiles and exotic goods")
      if (!besieged && needListNames(r, LUXURY_NAMES) && !imports.some((x) => LUXURY_MET.test(x)) && !made.some((x) => LUXURY_MET.test(x))) out.set(name, { noun: 'luxury goods', reach: 'missing' });
      continue;
    }
    if (!CHAIN_INPUTS[key]) continue;
    const reach = houseInputAtHand(r, key, inst, { rawResource: CHAIN_RAW_INPUT[key] });
    if (reach === 'missing' || reach === 'imported') out.set(name, { noun: tradeNoun(key), reach });
    // under a siege, a good the imports bring as well as the land gives is cut in its imported share (the page's own "…
    // depend on timber from outside, which the siege has cut off", `chainNeedShown.js :: chainNeedLine`): curtailed
    else if (besieged && importsBring(r, key) && dependsFromOutside(r, key)) out.set(name, { noun: tradeNoun(key), reach: 'imported' });
  }
  WANTING_OF.set(record, out);
  return out;
}

/**
 * BIRTH-2 (BR4 (b): "IT IS NEVER WRITTEN EARLY"): a record asked at the economy's own hour (`sawnGoodFed`) reads no ground a
 * house implies and no failed venture: the economy builds no chain, no made good and no export on one house (the audit's V2).
 */
const AT_THE_ECONOMY = Symbol('at the economy');

/**
 * BIRTH-2: THE TOWN'S FAILED VENTURE (BIRTH-3, BR8: the house whose stored gap row's line is the venture's own line; on the
 * record in the making, the birth's pick: `supplyStory.js :: ventureOnPage`). @param {InputRecord | null | undefined} record
 * @returns {import('./supplyStory.js').Venture | null}
 */
export function ventureHouseOf(record) {
  if (!record || typeof record !== 'object' || /** @type {Record<symbol, unknown>} */ (record)[AT_THE_ECONOMY]) return null;
  return ventureOnPage(/** @type {Parameters<typeof ventureOnPage>[0]} */ (record));
}

/**
 * BIRTH-3: the one reader's answer for a buyer before the failed venture's story is read (`inputAtHandCore`): whether its
 * input of a family is missing. Read by the birth's pick of the venture (`resourceGenerator.js`).
 * @param {InputRecord | null | undefined} record @param {Record<string, unknown>} inst @param {string} family a chain key
 */
export const inputMissingBeforeStory = (record, inst, family) => !!CHAIN_INPUTS[family]
  && inputAtHandCore(record, family, /** @type {{ name?: unknown }} */ (inst), { rawResource: CHAIN_RAW_INPUT[family] }) === 'missing';

/**
 * FAULTS-BIRTH FR21 (3) (the sixth chair, 2026-11-18; vetoable by the owner): A RIVER'S FISHING GROUND GIVES NO SALT. A ground a
 * house implies gives its key and the goods of the catalogue (`RESOURCE_DATA[ground].commodities`), save the sea's own: salt is
 * the sea's, so on water that is no sea (the world law's water kind, `tradeRouteSemantics.js :: waterAccessKind`: a river, or
 * none) the implied fishing grounds give fish and no salt (six river towns' salt works read their salt local off a landing's
 * river). A stored ground keeps the catalogue's goods (the land list's own reading). The birth's need list reads it too
 * (`resourceGenerator.js :: generateResourceAnalysis`). @param {InputRecord | null | undefined} record @param {string} ground
 * @returns {string[]} the ground and its goods
 */
export function impliedGroundGoods(record, ground) {
  const goods = arr(/** @type {Record<string, { commodities?: unknown } | undefined>} */ (RESOURCE_DATA)[ground]?.commodities).map(str);
  const config = /** @type {{ terrainType?: unknown, tradeRouteAccess?: unknown }} */ (record?.config || {});
  const sea = waterAccessKind(str(config.terrainType), str(config.tradeRouteAccess)) === 'maritime';
  const seaGoods = !sea && Object.prototype.hasOwnProperty.call(SEA_GOODS, ground) ? SEA_GOODS[ground] : [];
  return [ground, ...goods.filter((g) => !seaGoods.includes(g))];
}
/** The goods a ground gives only on the sea. @type {Readonly<Record<string, ReadonlyArray<string>>>} */
const SEA_GOODS = Object.freeze({ fishing_grounds: Object.freeze(['salt']) });

/** One reading a record object. @type {WeakMap<object, ReadonlyArray<string>>} */
const NEVER_HELD_OF = new WeakMap();

/**
 * FAULTS-BIRTH (the sixth chair's FR8 (c), BRIEF-BIRTH-2's item 2 (e), 2026-11-18; vetoable by the owner): A BUYER ON A ROUTE
 * THAT IS ISOLATED EVEN IN ORDINARY TIMES whose material the land never held tells THE OWNER'S FOURTH STORY: the ground of
 * its material is USED UP (a reading of the page, stored nowhere: the Depleted list prints it), the house idle and marked
 * short. Read off the stored record alone (no seed: a town on no road buys nothing in, so the story is the only one): every
 * live native buyer (`houseKinds.js :: BUYS_AND_WORKS`) of a material family (`MATERIAL_OF`) on such a route that the page
 * marks short (`housesShortOf`), on no spent ground of its own and not the failed venture, where no ground of that material
 * is on the record or implied by a house: the ground of its material (`supplyStory.js :: groundOfFamily`). A material no
 * ground gives (hides, wool, the luxury goods) implies none: left by name. @param {InputRecord | null | undefined} record
 * @returns {ReadonlyArray<string>} the grounds, sorted
 */
export function neverHeldGroundsUsed(record) {
  if (!record || typeof record !== 'object' || /** @type {Record<symbol, unknown>} */ (record)[AT_THE_ECONOMY]) return [];
  const hit = NEVER_HELD_OF.get(record);
  if (hit) return hit;
  /** @type {Set<string>} */
  const out = new Set();
  if (!hasTradeRouteConnection(str(record?.config?.tradeRouteAccess))) {
    const c = /** @type {Record<string, unknown>} */ (record.config || {});
    const held = [...arr(c.nearbyResources), ...arr(c.nearbyResourcesNative), ...arr(c.nearbyResourcesDepleted)].map(str)
      .concat([...impliedGroundsOf(/** @type {Parameters<typeof impliedGroundsOf>[0]} */ (record)).states.keys()])
      // FR24 (2): a ground a live house keeps there (the common's pasture, `supplyStory.js :: groundsKeptOf`) is held: never spent here
      .concat(groundsKeptOf(/** @type {Parameters<typeof groundsKeptOf>[0]} */ (record)));
    const short = housesShortOf(record);
    const spent = housesOnSpentGround(record);
    const venture = ventureHouseOf(record);
    for (const inst of liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (record))) {
      const name = inst && typeof inst.name === 'string' ? inst.name : '';
      if (!name || isCustom(inst) || !short.has(name) || spent.has(name) || venture?.name === name) continue;
      const id = idOfHouse(/** @type {{ name?: unknown }} */ (inst));
      const family = BUYS_AND_WORKS.has(id) && Object.prototype.hasOwnProperty.call(MATERIAL_OF, id) ? MATERIAL_OF[id] : '';
      if (!family || held.some((g) => groundGives(g, family))) continue;
      const ground = groundOfFamily(family);
      if (ground) out.add(ground);
    }
  }
  const list = Object.freeze([...out].sort());
  NEVER_HELD_OF.set(record, list);
  return list;
}

/**
 * BIRTH-2: THE TOWN'S GROUNDS AS THE PAGE READS THEM, beyond the stored lists (the Resources tab's Nearby Resources): the
 * grounds the houses imply, there or used up (the failed venture proves none; BIRTH-3, BR8: read off the stored rows), and
 * (FAULTS-BIRTH, FR8 (c)) the grounds an isolated town's buyers tell used up (`neverHeldGroundsUsed`). @param {InputRecord | null | undefined} record
 * @returns {{ there: string[], used: string[] }}
 */
export const impliedGroundsOnPage = (record) => {
  if (record && typeof record === 'object' && /** @type {Record<symbol, unknown>} */ (record)[AT_THE_ECONOMY]) return { there: [], used: [] };
  const shown = impliedGroundsShown(/** @type {Parameters<typeof impliedGroundsShown>[0]} */ (record));
  const never = neverHeldGroundsUsed(record).filter((g) => !shown.used.includes(g) && !shown.there.includes(g));
  return never.length ? { there: shown.there, used: [...shown.used, ...never] } : shown;
};
