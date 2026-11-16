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
import { hasTradeRouteConnection } from '../tradeRouteSemantics.js';
import { institutionHasAnyTag } from '../../lib/entities.js';
import { nativeSemanticNames } from '../content/customContentSemanticAuthority.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';

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

/** The catalogue tags of a house whose trade IS the route (a market, a caravanserai). */
const ROUTE_HOUSE_TAGS = Object.freeze(['market', 'transport']);

/** The houses that produce a raw good here (the resource analysis's local producers, one home). */
const LOCAL_PRODUCERS = Object.freeze([
  { requirement: /\b(?:grain|foodstuffs?|provisions?)\b/i, institution: /\b(?:farm|farmland|subsistence|grain fields?|managed farmland|common fields?)\b/i },
  { requirement: /\b(?:timber|lumber|wood)\b/i, institution: /\b(?:woodcutter|logging camp|managed forest)\b/i },
  { requirement: /\bstone\b/i, institution: /\b(?:stone quarry|quarry)\b/i },
  { requirement: /\b(?:charcoal|fuel)\b/i, institution: /\b(?:charcoal burner|peat cutter|coal mine)\b/i },
  { requirement: /\bsalt\b/i, institution: /\b(?:salt works|salt pans?|brine works?)\b/i },
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
 * Whether a local producer of the roster makes the requirement (a quarry for stone; salt works for salt).
 * @param {string} requirement @param {ReadonlyArray<unknown>} institutions
 */
export function localProducerSupplies(requirement, institutions) {
  const rule = LOCAL_PRODUCERS.find((candidate) => candidate.requirement.test(requirement));
  if (!rule) return false;
  return nativeSemanticNames(institutions).some((name) => rule.institution.test(name));
}

/**
 * @typedef {{
 *   config?: { tradeRouteAccess?: unknown, stressTypes?: unknown, [key: string]: unknown } | null,
 *   economicState?: { localProduction?: unknown, primaryImports?: unknown,
 *     foodSecurity?: { importPct?: unknown, foodRecord?: { foodSources?: unknown, normalImportPct?: unknown } | null } | null } | null,
 *   institutions?: ReadonlyArray<unknown> | null,
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
  const spec = CHAIN_INPUTS[chainKey];
  const raw = str(chain?.rawResource);
  const config = record?.config || {};
  const es = record?.economicState || {};
  const words = spec ? spec.words : [raw];

  // A live native resource: its key or its commodities name the input.
  const keys = /** @type {string[]} */ (availableNativeResourceKeys(config));
  const native = [...keys, ...keys.flatMap((k) => arr(/** @type {Record<string, { commodities?: unknown } | undefined>} */ (RESOURCE_DATA)[k]?.commodities))].map(str).map(norm).join('|');
  const rawNames = [raw, ...terrainSynonymsFor(raw)];
  if (words.some((w) => holds(native, w)) || rawNames.some((n) => holds(native, n))) return 'local';
  // What the town makes names the RAW good itself (never the chain's product).
  if (arr(es.localProduction).some((e) => rawNames.some((n) => wholeTokens(str(e), n)))) return 'local';
  if (localProducerSupplies(raw, liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (record)))) return 'local'; // the live roster: a ruined quarry quarries nothing

  // The route, where no siege shuts it.
  const besieged = arr(config.stressTypes).includes('under_siege');
  if (!besieged && hasTradeRouteConnection(str(config.tradeRouteAccess))
    && (spec?.route || institutionHasAnyTag(house || {}, [...ROUTE_HOUSE_TAGS]))) return 'route';

  // The imports bring the raw good; the food record names the source or imports the staple.
  const imports = arr(es.primaryImports).map(str);
  const names = [raw, spec?.raw, spec?.noun, ...terrainSynonymsFor(raw)].filter((x) => typeof x === 'string' && x !== '');
  if (imports.some((imp) => !WORKED_GOOD.test(imp.replace(/\([^)]*\)/g, ' ')) && names.some((n) => wholeTokens(imp, /** @type {string} */ (n))))) return 'imported';
  const food = es.foodSecurity?.foodRecord;
  if (spec?.food && arr(food?.foodSources).some((x) => spec.food?.includes(str(x)))) return 'imported';
  if (spec?.staple && (Number(food?.normalImportPct) > 0 || Number(es.foodSecurity?.importPct) > 0)) return 'imported';
  return 'missing';
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
  const record = { config: { nearbyResources: arr(nearbyResources).map(str).filter((k) => !depleted.has(k)) }, economicState: {}, institutions };
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
 * @template {{ processingInstitutions?: ReadonlyArray<string> } | null | undefined} C
 * @param {Readonly<Record<string, C>>} chains the chain table (`RESOURCE_CHAINS`, the caller's: WEAVE ST-2)
 * @returns {Array<[string, C]>}
 */
export const chainsOfHouse = (name, chains) => Object.entries(chains).filter(([, c]) => houseRunsChain(c, name));
