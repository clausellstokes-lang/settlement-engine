/**
 * domain/display/validationOnPage.js — THE GENERATOR'S CHECKS ARE NOT FACTS ABOUT THE PLACE
 * (lane READER-R1, 2026-11-04; `docs/READER_R1_VALIDATION_ON_PAGE_2026-11-04.md`).
 *
 * The generator's own consistency checks used to print on three DM surfaces (the Overview's
 * "Structural Issues", the Resources tab's "Gaps & Opportunities", the Viability tab's
 * "Structural Crises" and "Critical Issues") and on their PDF twins, as if they described the
 * town: "River fisheries require river access" on a riverside town, "Mill exists but lacks
 * access to grain" in a village exporting its grain surplus, "Not viable — 2 critical issues"
 * beside "Critical Issues (1)". The chair's rulings, read here:
 *
 *  1. Validation text never renders on a DM surface. The rule text (`structuralViolations`,
 *     `structuralSuggestions`, the raw gap rows, the priority notes) stays on the record and
 *     is shown only on the staff panel (`staffValidationRows`, the Viability tab, elevated
 *     viewers only).
 *  2. The viability verdict's count and the Critical Issues list are ONE list
 *     (`criticalIssuesOf`): the record's own critical issues, the list `metrics.
 *     criticalIssueCount` and the summary sentence already count.
 *  3. A resource gap prints only when the RECORD truly lacks the input (`resourceGapLines`),
 *     read through the record's own fields — the economy's production, imports and exports,
 *     the nearby resources that are not depleted, the food record's sources and ordinary
 *     supply, the trade route — and never a match on an institution's name. A true gap is a
 *     fact about the place, in the house voice ("No clay reaches the potter.").
 *  4. "has no dependable trade route" is said only where the record's route is disconnected
 *     (`viabilityIssueText`): a besieged crossroads town has a route that is cut.
 *
 * Render-time only: nothing here writes the record, so no generated settlement moves.
 * Pure.
 */

import { RESOURCE_CHAINS } from '../../data/goods/chains.js';
import { RESOURCE_DATA } from '../../data/goods/identity.js';
import { availableNativeResourceKeys } from '../resourceSemantics.js';
import { isTradeRouteDisconnected } from '../tradeRouteSemantics.js';
import { institutionHasAnyTag } from '../../lib/entities.js';
import { institutionDisplayName } from './institutionDisplayName.js';
import { resourceDisplayName } from './resourceDisplayName.js';
import { compareCodepoint } from '../deterministicSort.js';
import { exportsAsPrinted, importsAsPrinted, tradeMarkOf } from './tradeListDisplay.js';
import { chainModelsResource, chainWorksResource } from '../facts/chainWorking.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { familyOfInstitution, institutionalCatalog } from '../../data/institutionalCatalog.js';
import { institutionLadderEvicts } from '../../data/institutionLadders.js';

/** @typedef {{ chain: string|null, impact: string, severity: string }} GapLine */

/** @typedef {{ institution?: unknown, chain?: unknown, impact?: unknown, severity?: unknown, missing?: unknown }} GapRow */

/**
 * One viability issue or warning as the record carries it (`economicViability.issues` /
 * `.warnings`); a description is a sentence or a `{ short, text }` pair.
 * @typedef {{
 *   severity?: unknown, type?: unknown, title?: unknown, message?: unknown,
 *   description?: string | { short?: unknown, text?: unknown } | null,
 *   [key: string]: unknown,
 * }} ViabilityIssue
 */

/** @typedef {{ issues?: ReadonlyArray<ViabilityIssue> | null, warnings?: ReadonlyArray<ViabilityIssue> | null } | null | undefined} ViabilityRecord */

/**
 * The settlement fields these readers consult. Leaves are `unknown` (read through `str`, `norm`
 * and `arr`), save the trade-route keys `isTradeRouteDisconnected` reads, the food record's sources
 * (matched against the chain table's words) and the row lists the loops walk.
 * @typedef {{
 *   name?: unknown,
 *   config?: { tradeRouteAccess?: string | null, [key: string]: unknown } | null,
 *   economicState?: {
 *     localProduction?: unknown, primaryImports?: unknown, primaryExports?: unknown,
 *     tradeAccess?: string | null,
 *     foodSecurity?: { foodRecord?: { foodSources?: ReadonlyArray<string> | null, normalImportPct?: unknown } | null } | null,
 *   } | null,
 *   institutions?: ReadonlyArray<{ name?: unknown } | null> | null,
 *   resourceAnalysis?: { gaps?: ReadonlyArray<GapRow | null> | null, priorityNotes?: unknown } | null,
 *   economicViability?: { metrics?: { tradeAccess?: string | null } | null } | null,
 *   structuralViolations?: ReadonlyArray<{ severity?: unknown, institution?: unknown, group?: unknown, reason?: unknown }> | null,
 *   structuralSuggestions?: ReadonlyArray<{ reason?: unknown, suggested?: unknown }> | null,
 * } | null | undefined} PageRecord
 */

/**
 * What `arr` hands back for a value of type T: an array's own elements, none for anything else
 * (an `unknown` value may be any array, so its elements stay `unknown`). An absent value adds no
 * element type: `readonly string[] | undefined` hands back `string[]`, not `string[] | never[]`.
 * @template T
 * @typedef {unknown extends T ? unknown[] : NonNullable<T> extends ReadonlyArray<infer E> ? E[] : never[]} ArrOf
 */

/** @param {unknown} x @returns {string} */
const str = (x) => (typeof x === 'string' ? x : x == null ? '' : String(x));
/** @template T @param {T} x @returns {ArrOf<T>} */
const arr = (x) => /** @type {ArrOf<T>} */ (Array.isArray(x) ? x : []);
/** @param {string} text a `recordGoods` text @param {string} word the singular word @returns {boolean} the word or its plural ("mineral salts" answers salt) */
const holds = (text, word) => text.includes(norm(word)) || text.includes(norm(`${word}s`));
/** @param {string} x */
const norm = (x) => ` ${x.toLowerCase().replace(/[_/()\-,.]+/g, ' ').replace(/\s+/g, ' ').trim()} `;

/**
 * What each chain's input is CALLED on the record (the economy's goods vocabulary and the
 * nearby-resource keys), and how the DM sentence names it. Keyed by the chain's key in
 * `RESOURCE_CHAINS`, never by an institution. `food` names the food record's source that
 * answers the input; `route` says a connected trade route brings it (caravans bring camels).
 * @type {Readonly<Record<string, { words: ReadonlyArray<string>, noun: string, raw?: string, plural?: boolean, food?: ReadonlyArray<string>, staple?: boolean, route?: boolean }>>}
 */
const CHAIN_INPUTS = Object.freeze({
  wool: { words: ['wool'], noun: 'wool' },
  flax: { words: ['flax', 'linen'], noun: 'flax' },
  grain: { words: ['grain', 'flour', 'grain fields', 'fertile floodplain'], noun: 'grain', food: ['grain', 'mill'], staple: true },
  grapes: { words: ['grapes', 'vineyard', 'vineyards'], noun: 'grapes', plural: true },
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
  sand: { words: ['glass sand', 'glass'], noun: 'glass sand', raw: 'glass sand' },
  herbs: { words: ['medicinal herbs', 'herbs'], noun: 'medicinal herbs', plural: true },
  alpineWool: { words: ['wool', 'alpine pasture'], noun: 'wool' },
  mountainTimber: { words: ['timber', 'wood', 'mountain timber'], noun: 'timber', raw: 'timber' },
  desertSalt: { words: ['salt', 'desert salt', 'salt flats', 'salt pans'], noun: 'salt' },
  desertGlass: { words: ['glass sand', 'glass'], noun: 'glass sand', raw: 'glass sand' },
  camelCaravan: { words: ['camel', 'camels', 'camel herds'], noun: 'camels', plural: true, route: true },
  oasisDate: { words: ['dates', 'date palms', 'oasis water'], noun: 'dates', plural: true },
  mineralHot: { words: ['hot springs', 'hot springs mineral', 'healing waters'], noun: 'water from the hot springs', raw: 'mineral hot springs' },
});

/** The catalogue tags of a house whose trade IS the route (a market, a caravanserai). */
const ROUTE_HOUSE_TAGS = Object.freeze(['market', 'transport']);

/**
 * The record's own goods, as one searchable text: what the economy produces, what TRADE BRINGS IN
 * (`tradeListDisplay.js :: importsAsPrinted(s).arriving`), the exports, and the nearby resources that are not
 * depleted (their keys and their commodities). A good the terrain needs and no trade brings (`.needed`) is NOT a
 * good the town has: the record's own gap kind for its house is `missing`, so the gap line prints (W2-A-LEAVES-2,
 * REVIEW-W2A F1: the first seat read the need list as arrivals and silenced 445 true gaps).
 * @param {PageRecord} s
 */
function recordGoods(s) {
  const es = s?.economicState || {};
  const keys = availableNativeResourceKeys(s?.config || {});
  /** @type {string[]} */
  const goods = [
    ...arr(es.localProduction), ...importsAsPrinted(/** @type {Parameters<typeof importsAsPrinted>[0]} */ (s)).arriving, ...arr(es.primaryExports),
    ...keys, ...keys.flatMap((/** @type {string} */ k) => arr(/** @type {Readonly<Record<string, { commodities?: unknown } | undefined>>} */ (RESOURCE_DATA)[k]?.commodities)),
  ].map(str);
  return goods.map(norm).join('|');
}

/**
 * Whether the record answers a chain's input.
 * @param {PageRecord} s @param {string} chainKey @param {unknown} inst @param {string} goods from `recordGoods`
 */
function inputAnswered(s, chainKey, inst, goods) {
  const spec = CHAIN_INPUTS[chainKey];
  if (!spec) return true; // a chain this reader cannot name prints nothing (never a rule sentence)
  if (spec.words.some((w) => holds(goods, w))) return true;
  const food = s?.economicState?.foodSecurity?.foodRecord;
  if (food && spec.food && arr(food.foodSources).some((x) => spec.food?.includes(x))) return true;
  // The staple comes in by ordinary supply (hinterland carts, trade) when the food record says so.
  if (food && spec.staple && Number(food.normalImportPct) > 0) return true;
  const route = s?.config?.tradeRouteAccess ?? s?.economicState?.tradeAccess;
  const connected = Boolean(route) && !isTradeRouteDisconnected(route);
  if (connected && (spec.route || institutionHasAnyTag(inst, [...ROUTE_HOUSE_TAGS]))) return true;
  return false;
}

/** @param {{ name?: unknown } | null | undefined} inst @returns {string} the house as the sentence names it ("the potter") */
function houseWords(inst) {
  const name = str(institutionDisplayName(inst) || inst?.name).replace(/^access to (?:an? )?/i, '');
  return `the ${name.charAt(0).toLowerCase()}${name.slice(1)}`;
}

/** @param {string[]} nouns */
const orList = (nouns) => (nouns.length < 2 ? nouns.join('') : `${nouns.slice(0, -1).join(', ')} or ${nouns[nouns.length - 1]}`);

/**
 * The nearby resources a gap row is about: every live key of the record (`availableNativeResourceKeys`) whose own
 * name or commodities answer the chain's input words (`CHAIN_INPUTS`; "stone_quarry" for the stone, "hunting_grounds"
 * and "grazing_land" for the hides). W2-C-LEAVES (2026-11-13): the keys the chain leaf is asked about.
 * @param {PageRecord} s @param {string | null} chainKey the gap's chain in `RESOURCE_CHAINS`
 * @returns {string[]}
 */
function gapResourceKeys(s, chainKey) {
  const spec = chainKey ? CHAIN_INPUTS[chainKey] : null;
  if (!spec) return [];
  return availableNativeResourceKeys(s?.config || {}).filter((/** @type {string} */ k) => {
    const text = [k, ...arr(/** @type {Readonly<Record<string, { commodities?: unknown } | undefined>>} */ (RESOURCE_DATA)[k]?.commodities)].map(str).map(norm).join('|');
    return spec.words.some((w) => holds(text, w));
  });
}

/**
 * Whether the roster holds a house OF THIS KIND, live (W2-C-LEAVES, 2026-11-13; REVIEW-W2A-3 #628, #911: "no tannery
 * … finishes it" beside Tanners, "no apothecary … finishes it" beside an Apothecary district). A chain's list names
 * one spelling of a house; the catalogue's family is the house's own home and holds every spelling of it at every
 * tier ("Tannery" in a village is "Tanners" in a town), and the ladder holds its larger and smaller forms of the same
 * function ("Apothecary" grows into the "Apothecary district"). Never by one name.
 * @param {PageRecord} s @param {string} name a house the chain's list names
 */
function houseOfKindHere(s, name) {
  return houseOfKindOn(s, name) !== undefined;
}

/** The live house of the named house's kind (`houseOfKindHere`'s reading), or undefined. @param {PageRecord} s @param {string} name */
function houseOfKindOn(s, name) {
  const want = familyOfInstitution({ name });
  const wantScales = scaleGroupsOf(name, want?.key);
  return liveInstitutions(s).find((inst) => {
    const have = str(inst?.name);
    if (!have) return false;
    if (have.toLowerCase() === name.toLowerCase()) return true;
    const family = familyOfInstitution(inst);
    if (want && family && want.key === family.key) return true;
    if (wantScales.size && [...scaleGroupsOf(have, family?.key)].some((g) => wantScales.has(g))) return true;
    return institutionLadderEvicts(have, name) || institutionLadderEvicts(name, have);
  });
}

/** @type {Map<string, Set<string>> | null} */
let SCALE_GROUPS = null;
/**
 * THE CATALOGUE'S SCALE GROUPS (W2-C-LEAVES-3, #452 with R1): an `exclusiveGroup` the catalogue names "…Scale" holds ONE
 * trade at two sizes, of which a town keeps one ("tanneryScale": Tanners and Tanner (established)). A house of the
 * group answers a chain's house of the same group by kind: a "Tanner (established)" is the town's tannery. Read from
 * the catalogue's rows, the house's own home; built once.
 * @param {...(string | null | undefined)} names a house's name and its family's key
 * @returns {Set<string>}
 */
function scaleGroupsOf(...names) {
  if (!SCALE_GROUPS) {
    SCALE_GROUPS = new Map();
    for (const tier of Object.values(/** @type {Record<string, Record<string, Record<string, { exclusiveGroup?: unknown }>>>} */ (institutionalCatalog))) {
      for (const group of Object.values(tier)) {
        for (const [rowName, row] of Object.entries(group)) {
          const g = str(row?.exclusiveGroup);
          if (!/Scale$/.test(g)) continue;
          const key = rowName.toLowerCase();
          if (!SCALE_GROUPS.has(key)) SCALE_GROUPS.set(key, new Set());
          SCALE_GROUPS.get(key)?.add(g);
        }
      }
    }
  }
  /** @type {Set<string>} */ const out = new Set();
  for (const n of names) for (const g of SCALE_GROUPS.get(str(n).toLowerCase()) || []) out.add(g);
  return out;
}

/**
 * THE TRADES THAT FINISH WHAT A CHAIN'S HOUSE FINISHES (W2-C-LEAVES R1, the chair's ruling on REVIEW-R2-STAGES finding
 * 1: "by kind" answers a house with no catalogue row too). One closed list, keyed by the house a chain's list names;
 * each entry gives the words of a house's name that do the same finishing, with the cause. Matched on the live
 * roster's own houses (a road to a neighbour's house, "Access to …", finishes nothing here).
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
const FINISHING_TRADES = Object.freeze({
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
 * Whether a live house of the named house's trade (`FINISHING_TRADES`) stands here, finishing what it finishes.
 * @param {PageRecord} s @param {string} name a house the chain's list names, missing by kind
 */
function tradeFinisherHere(s, name) {
  return tradeFinisherOn(s, name) !== undefined;
}

/** The live house of the named house's finishing trade (`tradeFinisherHere`'s reading), or undefined. @param {PageRecord} s @param {string} name */
function tradeFinisherOn(s, name) {
  const trades = FINISHING_TRADES[name.toLowerCase()];
  if (!trades) return undefined;
  return liveInstitutions(s).find((inst) => {
    const have = str(inst?.name).toLowerCase();
    return !!have && !have.startsWith('access to') && trades.some((w) => have.includes(w));
  });
}

/**
 * THE HOUSES A CHAIN STILL NEEDS HERE (W2-C-LEAVES-3, #452, ruled with R1: "a need the roster's own house meets is not
 * listed"). Of the houses a chain's list names, the ones the live roster holds neither by kind (`houseOfKindHere`) nor
 * by a house of the same finishing trade (`tradeFinisherHere`): "Needs: Tannery, Leatherworkers' guild" is not printed
 * beside a Tanner (established) and a Cobbler's guild. The Resources tab's "Needs:" line reads this.
 * @param {PageRecord} s the settlement record @param {unknown} names the chain's houses (`processingInstitutions`)
 * @returns {string[]} the named houses still needed, in the chain's order
 */
export function housesStillNeeded(s, names) {
  return arr(names).map(str).filter((n) => n && !houseOfKindHere(s, n) && !tradeFinisherHere(s, n));
}

/** @typedef {(typeof RESOURCE_CHAINS)[keyof typeof RESOURCE_CHAINS]} ResourceChain */

/** @param {string} rawResource @returns {[string, ResourceChain]|null} the chain entry for a gap's raw resource */
const chainFor = (rawResource) => /** @type {[string, ResourceChain]|undefined} */ (
  Object.entries(RESOURCE_CHAINS).find(([, c]) => c.rawResource === rawResource)) || null;

/**
 * EXPORTS THAT ANSWER A CHAIN'S INPUT WORDS AND ARE ANOTHER GROUND'S GOOD (P1-b, measured on the census's 720: of the 58
 * cards an export moved, 22 timber cards moved on "Sacred wood" alone; "Sea salt" beside salt pans is their own and stays). A closed
 * list, each with its cause; such an export says nothing of the card's own resource.
 * @type {ReadonlyArray<string>}
 */
const OTHER_GROUNDS_GOODS = Object.freeze([
  'sacred wood', // the ancient grove's ritual wood, gathered by its keepers; not timber felled from the forest (r2r-thorp-22, r2s-mass_migration-hamlet-3)
]);

/**
 * WHETHER THE RESOURCE A CARD OR A GAP LINE NAMES IS WORKED HERE, AS THE PAGE SAYS IT (W2-C-LEAVES-3, P1; record 303:
 * the chain model homes "worked here"). ONE reading for the "No one here works the …" sentence and the grade cards,
 * so the two never disagree: the record's live resource keys the chain's input words answer (`gapResourceKeys`),
 * asked of the chain leaf with the good the line names (`chainWorksResource`, R3's list); `modelled` is false where
 * no chain of the record takes the resource at all (the model is silent: "not known", never "not worked").
 * A SECOND FACT BESIDE THE LEAF (the chair's ruling P1-b, 2026-11-13): `sold`, the economy's exports name the resource's
 * OWN raw good (the chain's input words, `CHAIN_INPUTS`: "Raw wool" for the wool or the alpine pasture, "Rock salt" for
 * the desert salt): someone gathers what is sold, so the resource is worked here, and "No one here works the …" never
 * prints beside it. The leaf itself is not widened: `leaf` is its answer alone.
 * @param {PageRecord} s the settlement record @param {unknown} rawResource the card's or gap's raw resource ("timber")
 * @returns {{ modelled: boolean, worked: boolean, leaf: boolean, sold: boolean, keys: string[], good: string | undefined }}
 *   `worked`: the leaf's yes or the export's; `good`: the noun the leaf is asked of
 */
export function resourceWorkReading(s, rawResource) {
  const entry = chainFor(str(rawResource));
  const spec = entry ? CHAIN_INPUTS[entry[0]] : null;
  const keys = gapResourceKeys(s, entry ? entry[0] : null);
  const leaf = chainWorksResource(s, keys, spec?.noun);
  const exportsText = arr(s?.economicState?.primaryExports).map(str)
    .filter((x) => !OTHER_GROUNDS_GOODS.some((o) => norm(x).includes(norm(o)))).map(norm).join('|');
  const sold = !!spec && spec.words.some((w) => holds(exportsText, w));
  const worked = leaf || sold;
  return { modelled: worked || chainModelsResource(s, keys), worked, leaf, sold, keys, good: spec?.noun };
}

/** @typedef {'unexploited'|'partial'|'full'} ExploitationStage */
/** @typedef {{ rawResource?: unknown, [key: string]: unknown }} ExploitationCard */
/** @typedef {{ card: ExploitationCard, stage: ExploitationStage, filed: ExploitationStage, moved: boolean }} ExploitationShown */

/**
 * THE GRADE A RESOURCE CARD PRINTS (W2-C-LEAVES-3, P1; the chair's ruling of 2026-11-13 18:04 on the exploitation
 * grade cards). The resource analysis files each card Unexploited, Partial or Full; the chain model homes "worked
 * here" (record 303). ONE reader, read by the Resources tab's cards, the dossier search's and the PDF's (and so the
 * Foundry journal's) chain rows, through the same reading as the "No one here works the …" sentence
 * (`resourceWorkReading`):
 *  - the model silent on the resource (no chain takes it): "not known", never "not worked": the filed grade stands;
 *  - a chain works it and the card is filed Unexploited: shown in the PARTIAL group (no new grade), `moved`: its body
 *    is the resource alone. The filed card's goods are the chain table's promise, not the record ("wool → cloth"
 *    where only herds graze), and the working chains' own house lists name houses that do not work the resource
 *    (a merchant guild on an alpine pasture, a river ferry on timber; MEASURED: 5 of 196 name no house of the roster
 *    at all), so no flow is printed for it;
 *  - a chain works it, filed Partial or Full: the filed grade stands;
 *  - a modelled chain idle here, filed Partial or Full: shown UNEXPLOITED (P1-a). MEASURED and read (all 9 on the
 *    census's 720, d6e355a9d): every one was the medicinal herbs of a hot spring, 8 of them beside an Apothecary; the
 *    leaf now knows that house (`facts/chainWorking.js :: WORKED_BY_HOUSE`, where no herb is imported), so
 *    the 3 whose apothecary works the town's own herbs read worked and stand as filed; the 5 whose herbs come in by trade
 *    and the one with no such house (r2r-village-8: clergy and a divine healer at the springs) read Unexploited, as
 *    their records say (the chair's ruling on the correction, 19:49 UTC).
 * @param {PageRecord} s the settlement record @param {ExploitationCard} card @param {ExploitationStage} filed
 * @returns {ExploitationShown}
 */
export function exploitationCardShown(s, card, filed) {
  const reading = resourceWorkReading(s, card?.rawResource);
  if (filed === 'unexploited' && reading.worked) return { card, stage: 'partial', filed, moved: true };
  // P1-a (the chair's second word): a modelled chain idle here, the leaf's house list included: the record bears the
  // leaf out, and the card reads Unexploited (an apothecary working herbs the town buys does not work its ground).
  if (filed !== 'unexploited' && reading.modelled && !reading.worked) return { card, stage: 'unexploited', filed, moved: true };
  return { card, stage: filed, filed, moved: false };
}

/**
 * THE EXPLOITATION THE ECONOMY DESK MAY SPEAK OF (W2-C-LEAVES-3, the chair's ruling P1-c): DS-ECO-11's exploitation line
 * (`stateProse/economyStateProse.js :: leadingExploitation`) reads the grade the cards print, in the resource analysis's
 * own shape, each row as the page reads it: its `processingInstitutions` are the houses still needed here
 * (`housesStillNeeded`, #452), so the pools' "{institution}" ("what it lacks is …", "one … the town does not have")
 * never names a house the roster keeps.
 *  - A card MOVED to Unexploited (its herbs bought, its ground spent) is not offered: the Unexploited pool's
 *    "what it lacks is {institution}" would name the apothecary the town keeps. PARKED for the corpus lane.
 *  - A Partial row is offered only where the record bears the Partial pool out: its four variants say the raw material
 *    leaves unfinished and is sold ("moves before it has been made into anything worth more", "leaves half-finished",
 *    "takes the easy half … and sells the rest"), so the town must sell the resource's own raw good (`sold`) and still
 *    lack a house that finishes it. Read on the census's 720 at 8e0be75e4 (twelve of the 75 Partial lines): 4 true
 *    (raw stone or iron ore sold with no mason or smelter), 4 doubtful, 4 false (r2r-city-27 and
 *    r2s-politically_fractured-metropolis-2: "takes the easy half" beside a Fuller, a Dyer and Weavers; r2r-town-48:
 *    herbs beside exports of remedies and potions). The rest of the cell is PARKED for the corpus lane.
 * @param {PageRecord} s
 * @returns {{ exploitation: { unexploited: ExploitationCard[], partiallyExploited: ExploitationCard[], fullyExploited: ExploitationCard[] } }}
 */
export function exploitationForDesk(s) {
  const g = exploitationGroupsShown(s);
  /** @param {ExploitationCard} card @returns {ExploitationCard} the row with the houses still needed here */
  const asRead = (card) => {
    const needed = housesStillNeeded(s, card.processingInstitutions);
    return needed.length ? { ...card, processingInstitutions: needed } : card;
  };
  const partial = g.partial.filter((x) => resourceWorkReading(s, x.card.rawResource).sold
    && housesStillNeeded(s, x.card.processingInstitutions).length > 0);
  return { exploitation: {
    unexploited: g.unexploited.filter((x) => !x.moved).map((x) => asRead(x.card)),
    partiallyExploited: partial.map((x) => asRead(x.card)),
    fullyExploited: g.full.map((x) => fullRowAsHeld(s, x.card)).filter((x) => x !== null),
  } };
}

/**
 * A FULL ROW SPEAKS ONLY OF A HOUSE THAT STANDS AND A GOOD THAT LEAVES (W2-C-LEAVES-11, the chair's ruling (2) of 2026-11-14
 * on REVIEW-W2-C-LEAVES's HIGH [2]: "The {resource} in {N}'s country is worked all the way through: the ground gives it,
 * {House} finishes it, and it leaves as {good}." was false in 34 of the 41 towns where the stage's re-filing newly printed
 * it, "Fishmonger finishes it, and it leaves as preserved fish" with no fishmonger and no fish export; and in the towns
 * where it printed before). The row's slots were the chain table's defaults (`processingInstitutions[0]`,
 * `finalProducts[0]`), never the record. Here they are the record's: the first of the chain's houses the live roster holds
 * by kind or by trade (`houseOfKindOn`, `tradeFinisherOn`; never an access row or a count band), named
 * by its display label with any count struck (`proseHouseName`), and the first of the chain's goods an export the page
 * prints holds (`exportsAsPrinted`), named as that export prints. Where either is missing the row is not offered and
 * the sentence is not written.
 * @param {PageRecord} s @param {ExploitationCard} card
 * @returns {ExploitationCard | null}
 */
function fullRowAsHeld(s, card) {
  const house = arr(card.processingInstitutions).map(str).filter(Boolean)
    .map((n) => houseOfKindOn(s, n) ?? tradeFinisherOn(s, n))
    // a road to a neighbour's house finishes nothing here; a catalogue count band ("Blacksmiths (3-10)") is many houses,
    // and the sentence's slot names one
    .find((inst) => inst !== undefined && !/^access to/i.test(str(inst?.name)) && !/\(\d/.test(str(inst?.name)));
  if (!house) return null;
  const exported = exportsAsPrinted(/** @type {Parameters<typeof exportsAsPrinted>[0]} */ (s)).map((x) => tradeMarkOf(x).label);
  /** @type {string | undefined} */ let good;
  for (const product of arr(card.finalProducts).map(str).filter(Boolean)) {
    good = exported.find((x) => norm(x).includes(norm(product)));
    if (good) break;
  }
  // the export as the page names it, in running prose: its bracketed note struck, a common noun ("Beer (barrel)" -> "beer")
  return good ? { ...card, processingInstitutions: [proseHouseName(house)], finalProducts: [good.replace(/\s*\([^)]*\)/g, '').trim().toLowerCase()] } : null;
}

/** A house as running prose names it: its display label, any bracketed count or note struck ("Bakers (5-15)" -> "Bakers"). @param {{ name?: unknown } | null | undefined} inst */
function proseHouseName(inst) {
  return str(institutionDisplayName(inst) || inst?.name).replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * The record's exploitation cards, grouped by the grade they print (`exploitationCardShown`), each group in the
 * record's order (a surface sorts as it always has).
 * @param {PageRecord} s @returns {Record<ExploitationStage, ExploitationShown[]>}
 */
export function exploitationGroupsShown(s) {
  const ex = /** @type {{ exploitation?: Record<string, unknown> } | null | undefined} */ (s?.resourceAnalysis)?.exploitation || {};
  /** @type {Record<ExploitationStage, ExploitationShown[]>} */
  const out = { unexploited: [], partial: [], full: [] };
  /** @type {ReadonlyArray<[ExploitationStage, string, string]>} */
  const FILED = [['unexploited', 'unexploited', 'unexploited'], ['partial', 'partiallyExploited', 'partial'], ['full', 'fullyExploited', 'full']];
  for (const [stage, key, legacy] of FILED) {
    for (const card of arr(ex[key] ?? ex[legacy])) {
      if (!card || typeof card !== 'object') continue;
      const shown = exploitationCardShown(s, /** @type {ExploitationCard} */ (card), stage);
      out[shown.stage].push(shown);
    }
  }
  return out;
}

/**
 * THE RESOURCE GAPS THE DM READS: only the gaps the record does not answer, in the house
 * voice, each once.
 *  - a house that works none of its inputs: "No clay reaches the potter." — only when the
 *    record holds none of the inputs the house could work (a smelter with iron ore coming in
 *    is not idle because it has no gold);
 *  - a raw resource no house works: "No one here works the stone near Ashford." — unless
 *    the economy already exports it, or a chain works it (the chain leaf, `chainWorksResource`);
 *  - a chain worked part-way: "Work on the glass sand here stops half-way: no glassblower
 *    finishes it." — naming only the houses the roster lacks BY KIND (`houseOfKindHere`), and
 *    nothing where it holds every one.
 * @param {PageRecord} s the settlement record
 * @returns {GapLine[]}
 */
export function resourceGapLines(s) {
  const ra = s?.resourceAnalysis;
  const gaps = arr(ra?.gaps);
  if (!gaps.length) return [];
  const goods = recordGoods(s);
  const institutions = arr(s?.institutions);
  /** @type {GapLine[]} */
  const out = [];
  const said = new Set();
  /** @param {GapLine} line */
  const push = (line) => { if (!said.has(line.impact)) { said.add(line.impact); out.push(line); } };

  for (const g of gaps) {
    if (!g || typeof g !== 'object' || g.institution) continue;
    const entry = chainFor(str(g.chain));
    const spec = entry ? CHAIN_INPUTS[entry[0]] : null;
    const raw = (spec?.raw || str(resourceDisplayName(str(g.chain)))).toLowerCase();
    const reading = resourceWorkReading(s, g.chain); // R3: asked of the good the line names
    if (reading.sold) continue; // the economy sells its raw good: someone works it (P1-b: the grade reads the same fact)
    // The houses the line names as missing are read by kind: a house of the roster that is the named one's own
    // family or ladder rung is not missing (W2-C-LEAVES, item 1). R1 (the chair, from REVIEW-R2-STAGES finding 1):
    // a house that does a missing one's trade finishes the work too (`tradeFinisherHere`), and where ONE finisher of
    // the missing houses stands, the work does not stop half-way: no line.
    const named = arr(g.missing).map(str).filter((n) => n && !houseOfKindHere(s, n));
    const finisherStands = named.some((n) => tradeFinisherHere(s, n));
    const missing = finisherStands ? [] : named
      .map((n) => str(institutionDisplayName(n) || n)).filter(Boolean).map((n) => n.charAt(0).toLowerCase() + n.slice(1));
    // WORKED HERE is the chain model's (facts/chainWorking.js :: chainWorksResource, record 303): "No one here works"
    // prints only where the leaf says no; a half-way grade, which says the work is done in part, never where the model
    // holds a chain on the resource and none of its chains works it (where it holds none, the model is silent).
    const { worked, modelled } = reading;
    const modelledIdle = !worked && modelled;
    if (/not being processed/.test(str(g.impact))) {
      if (worked) continue;
      push({ chain: null, impact: `No one here works the ${raw} near ${str(s?.name) || 'the place'}.`, severity: str(g.severity) || 'low' });
    } else if (missing.length && !modelledIdle) {
      push({ chain: null, impact: `Work on the ${raw} here stops half-way: no ${orList(missing)} finishes it.`, severity: str(g.severity) || 'medium' });
    }
  }

  // The houses the generator calls short of an input, grouped by house: one line per idle house.
  /** @type {Map<string, GapRow>} */
  const flagged = new Map();
  for (const g of gaps) if (g && typeof g === 'object' && g.institution) flagged.set(str(g.institution), g);
  for (const [name, g] of flagged) {
    const inst = institutions.find((i) => i?.name === name) || { name };
    const chains = Object.entries(RESOURCE_CHAINS).filter(([, c]) => arr(c.processingInstitutions).includes(name));
    if (chains.some(([key]) => inputAnswered(s, key, inst, goods))) continue;
    const specs = chains.map(([key]) => CHAIN_INPUTS[key]).filter(Boolean);
    const nouns = [...new Set(specs.map((x) => x.noun))];
    if (!nouns.length) continue;
    const plural = specs[specs.length - 1]?.plural === true && nouns.length === 1;
    push({ chain: null, impact: `No ${orList(nouns)} ${plural ? 'reach' : 'reaches'} ${houseWords(inst)}.`, severity: str(g.severity) || 'high' });
  }
  return out;
}

/**
 * THE ONE CRITICAL LIST: the record's critical issues, every one the verdict counts
 * (`metrics.criticalIssueCount` and the summary sentence count `severity === 'critical'`,
 * a stress consequence included). The Critical Issues header and the verdict read this list.
 * @param {ViabilityRecord} v the economicViability record
 * @returns {ViabilityIssue[]}
 */
export function criticalIssuesOf(v) {
  return arr(v?.issues).filter((i) => str(i?.severity).toLowerCase() === 'critical');
}

/**
 * The by-design contradictions the Viability tab lists (SW-B1, STYLE-RULINGS-2 B1(c)): the viability
 * issues and the structural violations marked `by_design`, one row per (type, institution, reason),
 * sorted by institution name (codepoint order). ONE reader of the fact: the tab prints this list and the DS-GEN-11 desk reads
 * its length, so the coherence line can never vouch above a by-design row the tab shows.
 * @param {ViabilityRecord} v the economicViability record
 * @param {{ structuralViolations?: ReadonlyArray<ViabilityIssue | null> | null } | null | undefined} s the settlement
 * @returns {ViabilityIssue[]}
 */
export function byDesignItemsOf(v, s) {
  /** @type {ViabilityIssue[]} */ const rows = [
    ...arr(v?.issues).filter((i) => i?.severity === 'by_design'),
    ...arr(s?.structuralViolations).filter((i) => i?.severity === 'by_design').map((i) => /** @type {ViabilityIssue} */ (i)),
  ];
  return rows.filter((item, index, all) => all.findIndex((c) => (
    c?.type === item?.type && c?.institution === item?.institution && c?.reason === item?.reason
  )) === index).sort((a, b) => compareCodepoint(/** @type {string} */ (a.institution || ''), /** @type {string} */ (b.institution || ''))); // the codepoint order (determinism lint), not the host's collation
}

/**
 * The stress effects that are NOT critical (a critical one is in `criticalIssuesOf`, once).
 * @param {ViabilityRecord} v the economicViability record
 * @returns {ViabilityIssue[]}
 */
export function stressEffectsOf(v) {
  return [...arr(v?.issues), ...arr(v?.warnings)].filter((i) => i?.type === 'stress_consequence' && str(i?.severity).toLowerCase() !== 'critical');
}

const NO_ROUTE_CLAUSE = / and has no dependable trade route\./;

/**
 * An issue's description as the DM reads it: "has no dependable trade route" only where the
 * record's route is disconnected. A connected route under siege is cut, not absent.
 * @param {ViabilityIssue | null | undefined} issue @param {PageRecord} s the settlement record
 * @returns {string}
 */
export function viabilityIssueText(issue, s) {
  const d = issue?.description;
  const text = typeof d === 'object' && d ? str(d.short || d.text) : str(d || issue?.message);
  if (!NO_ROUTE_CLAUSE.test(text)) return text;
  const route = s?.config?.tradeRouteAccess ?? s?.economicViability?.metrics?.tradeAccess;
  if (!route || isTradeRouteDisconnected(route)) return text;
  return text.replace(NO_ROUTE_CLAUSE, ' and its trade route is cut.');
}

/**
 * THE STAFF PANEL'S ROWS: the generator's own checks, verbatim, for an elevated viewer only.
 * @param {PageRecord} s the settlement record
 * @returns {Array<{ source: string, label: string, text: string }>}
 */
export function staffValidationRows(s) {
  /** @type {Array<{ source: string, label: string, text: string }>} */
  const rows = [];
  for (const v of arr(s?.structuralViolations)) {
    if (v?.severity === 'by_design') continue;
    rows.push({ source: 'structuralValidator', label: str(v?.institution || v?.group), text: str(v?.reason) });
  }
  for (const v of arr(s?.structuralSuggestions)) {
    const tail = arr(v?.suggested).length ? ` Consider: ${arr(v.suggested).join(', ')}.` : '';
    rows.push({ source: 'structuralSuggestion', label: '', text: `${str(v?.reason || v).trim().replace(/\.+$/, '')}.${tail}` });
  }
  for (const g of arr(s?.resourceAnalysis?.gaps)) {
    rows.push({ source: 'resourceGap', label: str(g?.chain), text: str(g?.impact || arr(g?.missing).join(', ')) });
  }
  for (const n of arr(s?.resourceAnalysis?.priorityNotes)) rows.push({ source: 'priorityNote', label: '', text: str(n) });
  return rows;
}
