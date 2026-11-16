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
import { catalogIdForName } from '../../data/institutionalCatalog.js';
import { resourceShortageImport } from '../resourceSemantics.js';
import { SPENT_GROUND_YIELD, SPENT_GROUND_WORKERS, GROUNDS_WORKED_OFF_CHAIN, INPUT_GAP_HELD_EVERYWHERE } from '../../data/crisisDependence.js';

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
  return nativeSemanticNames(/** @type {any[]} */ (institutions)).some((name) => rule.institution.test(name));
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
  // HW1 (BAR4-SCENES-2): a house on a ground wholly spent is not its own producer, and a house that works the ground itself
  // (SPENT_GROUND_WORKERS: the mine, the quarry, the boats) is fed by no import there either: the page's SV6 reading, one fact
  const spentGround = onWhollySpentGround(record, house);
  if (spentGround && SPENT_GROUND_WORKERS.includes(String(catalogIdForName(str(house?.name)) ?? ''))) return 'missing';
  if (!spentGround && localProducerSupplies(raw, liveInstitutions(/** @type {any} */ (record)))) return 'local'; // the live roster: a ruined quarry quarries nothing

  // The route, where no siege shuts it.
  const besieged = arr(config.stressTypes).includes('under_siege');
  if (!besieged && hasTradeRouteConnection(str(config.tradeRouteAccess))
    && (spec?.route || institutionHasAnyTag(/** @type {any} */ (house || {}), [...ROUTE_HOUSE_TAGS]))) return 'route';

  // The imports bring the raw good; the food record names the source or imports the staple.
  const imports = arr(es.primaryImports).map(str);
  const names = [raw, spec?.raw, spec?.noun, ...terrainSynonymsFor(raw)].filter((x) => typeof x === 'string' && x !== '');
  if (imports.some((imp) => !WORKED_GOOD.test(imp.replace(/\([^)]*\)/g, ' ')) && names.some((n) => wholeTokens(imp, /** @type {string} */ (n))))) return 'imported';
  const food = es.foodSecurity?.foodRecord;
  if (spec?.food && arr(food?.foodSources).some((x) => spec.food?.includes(str(x)))) return 'imported';
  if (spec?.staple && (Number(food?.normalImportPct) > 0 || Number(es.foodSecurity?.importPct) > 0)) return 'imported';
  return 'missing';
}

/** A row a user authored (custom content), as the page's leaf reads it (`crisisStoppedRow.js`). @param {any} row */
const isCustom = (row) => row?.custom === true || row?.source === 'custom' || row?.isCustom === true;

/**
 * THE THIRD READING (SV6): the houses whose every own ground the page prints as depleted, none kept by magic and none fed
 * by the shortage import the trade record shows, each with what it is short of (`SPENT_GROUND_YIELD`).
 * @param {object} settlement
 * @returns {ReadonlyMap<string, string>} house name -> what it is short of
 */
export function housesOnSpentGround(settlement) {
  const s = /** @type {{ config?: { nearbyResourcesDepleted?: unknown }, economicState?: { activeChains?: unknown, primaryImports?: unknown } }} */ (settlement);
  const spent = new Set(Array.isArray(s.config?.nearbyResourcesDepleted) ? s.config.nearbyResourcesDepleted : []);
  /** @type {Map<string, string>} */
  const out = new Map();
  if (spent.size === 0) return out;
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
    const works = SPENT_GROUND_WORKERS.includes(String(catalogIdForName(house) ?? '')); // an import feeds a buyer, never the work on the ground
    const allSpent = own.every((c) => spent.has(/** @type {string} */ (c.resourceKey)) && c.status !== 'magically_sustained'
      && (works || !imports.has(String(resourceShortageImport(/** @type {string} */ (c.resourceKey)) ?? ''))));
    if (!allSpent) continue;
    const key = /** @type {string} */ (own[0].resourceKey);
    out.set(house, Object.prototype.hasOwnProperty.call(SPENT_GROUND_YIELD, key) ? SPENT_GROUND_YIELD[key] : 'its materials');
  }
  return out;
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
 * @param {any} record @param {any} house
 */
function onWhollySpentGround(record, house) {
  const name = house && typeof house.name === 'string' ? house.name : '';
  if (!name || !record || typeof record !== 'object') return false;
  let spent = SPENT_OF.get(record);
  if (!spent) { spent = housesOnSpentGround(record); SPENT_OF.set(record, spent); }
  return spent.has(name);
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
 *   (ii) a house on a ground wholly spent (`housesOnSpentGround`, SV6).
 * @param {unknown} record the settlement record
 * @returns {ReadonlyMap<string, string>} house name -> what it is short of (the input's noun)
 */
export function housesShortOf(record) {
  if (!record || typeof record !== 'object') return new Map();
  const cached = SHORT_OF.get(record);
  if (cached) return cached;
  const r = /** @type {any} */ (record);
  const gaps = /** @type {Array<{ institution: string, chain?: unknown }>} */ (arr(r.resourceAnalysis?.gaps).filter((/** @type {any} */ g) => g && typeof g === 'object' && typeof g.institution === 'string' && g.institution));
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
 * @param {(house: any) => boolean} isSawmill the caller's own test of a sawmill (its gate's keyword)
 * @param {Readonly<Record<string, { rawResource?: unknown }>>} chains the chain table (`RESOURCE_CHAINS`, the caller's)
 * @returns {boolean} true unless the good is a sawn good and no sawmill of the roster has its timber
 */
export function sawnGoodFed(good, nearbyResources, depletedResources, institutions, isSawmill, chains) {
  if (!SAWN_GOODS.includes(good) || !Array.isArray(institutions)) return true;
  const depleted = new Set(arr(depletedResources).map((r) => resourceKeyForLabel(str(r)) || str(r)));
  const record = { config: { nearbyResources: arr(nearbyResources).map(str).filter((k) => !depleted.has(k)) }, economicState: {}, institutions };
  return institutions.filter((i) => !!i && isSawmill(i))
    .some((house) => houseInputAtHand(record, 'timber', /** @type {any} */ (house), chains.timber) !== 'missing' || houseInputAtHand(record, 'mountainTimber', /** @type {any} */ (house), chains.mountainTimber) !== 'missing');
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
 * @param {Readonly<Record<string, unknown>>} chains the chain table (`RESOURCE_CHAINS`, the caller's: WEAVE ST-2)
 * @returns {Array<[string, any]>}
 */
export const chainsOfHouse = (name, chains) => Object.entries(chains).filter(([, c]) => houseRunsChain(/** @type {any} */ (c), name));
