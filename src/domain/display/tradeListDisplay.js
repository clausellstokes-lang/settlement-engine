/**
 * domain/display/tradeListDisplay.js — THE TRADE LISTS AS A READER SEES THEM (CENSUS-3b unit 3;
 * `docs/DESIGN_POOL_CENSUS.md` §3.3 kind A; the vocabulary rulings §7; the lane's rulings 1, 3).
 *
 * ONE display reader for the Exports and Imports lists, used by the Economics tab and the
 * Foundry journal (F11: the journal reads the screen's list). The record's lists are never
 * rewritten here; this is a READ MODEL:
 *   1. the trade MARK: a stored suffix (`(transit)`, `(naval route only)`, `(taxed by occupation)`,
 *      written by `computeActiveChains.js :: deriveExportsFromChains`) is read into `{ label, kind }`
 *      (`transit` · `naval` · `occupation` · null), so a legend renders only when its mark is on
 *      the page, never on a flag beside it;
 *   2. a category error leaves the list (`data/tradeListDeclarations.js :: NOT_A_GOOD`);
 *   3. a good on BOTH lists is an export (the export wins: the record produces it), so it leaves
 *      the imports;
 *   4. every item is filtered by its declaration through `filterDeclared` against the record's
 *      `factsOf` (the luxury class declares `tier: ≥ village`).
 * Order is kept. Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/display/tradeListDisplay.test.js
 */
import { filterDeclared, lineText } from '../facts/drawDeclared.js';
import { factsOf } from '../facts/factsOf.js';
import { LUXURY_CLASS, NOT_A_GOOD } from '../../data/tradeListDeclarations.js';
import { REVENUE_HOMES } from '../../data/revenueHomes.js';

/** The stored trade marks → their kind. */
const MARKS = Object.freeze([
  Object.freeze({ re: /\s*\(transit\)\s*$/i, kind: 'transit' }),
  Object.freeze({ re: /\s*\(naval route only\)\s*$/i, kind: 'naval' }),
  Object.freeze({ re: /\s*\(taxed by occupation\)\s*$/i, kind: 'occupation' }),
]);

/** @param {unknown} v @returns {string} */
const fold = (v) => String(v ?? '').trim().toLowerCase();

/**
 * The item's label and its trade mark(s). A mark can stack (`… (transit) (naval route only)`);
 * `kind` is the first one written, `kinds` all of them.
 * @param {unknown} raw
 * @returns {{ raw: string, label: string, kind: string|null, kinds: string[] }}
 */
export function tradeMarkOf(raw) {
  let label = String(raw ?? '');
  /** @type {string[]} */ const kinds = [];
  for (let changed = true; changed;) {
    changed = false;
    for (const m of MARKS) if (m.re.test(label)) { label = label.replace(m.re, ''); kinds.unshift(m.kind); changed = true; }
  }
  return { raw: String(raw ?? ''), label, kind: kinds[0] ?? null, kinds };
}

const LUXURY_BY_LABEL = new Map(LUXURY_CLASS.map((row) => [fold(row.text), row]));
const NOT_A_GOOD_SET = new Set(NOT_A_GOOD.map(fold));

/**
 * One list, as the page prints it.
 * @param {ReadonlyArray<unknown> | null | undefined} list the record's list (raw strings)
 * @param {Parameters<typeof factsOf>[0]} settlement the record (its `factsOf` answers the declarations)
 * @param {{ side?: 'exports'|'imports', exports?: ReadonlyArray<unknown> | null }} [options]
 *   for the imports, the exports beside them (the export wins)
 * @returns {string[]} the raw items kept, in order
 */
export function displayTradeList(list, settlement, options = {}) {
  const items = (Array.isArray(list) ? list : []).filter((x) => typeof x === 'string' && x.trim());
  const exported = options.side === 'imports'
    ? new Set((Array.isArray(options.exports) ? options.exports : []).map((x) => fold(tradeMarkOf(x).label)))
    : null;
  const kept = items.filter((raw) => {
    const label = fold(tradeMarkOf(raw).label);
    if (NOT_A_GOOD_SET.has(label)) return false;
    if (exported && exported.has(label)) return false;
    return true;
  });
  // The declared rows: a luxury item carries its band; every other item is a bare line.
  const declared = kept.map((raw) => {
    const row = LUXURY_BY_LABEL.get(fold(tradeMarkOf(raw).label));
    return row ? { text: raw, needs: row.needs } : raw;
  });
  return filterDeclared(declared, {
    facts: () => factsOf(settlement),
    poolId: `trade-list:${options.side || 'exports'}`,
    surface: 'economics',
    drawKind: 'A',
  }).map((line) => /** @type {string} */ (lineText(line)));
}

/**
 * The kinds of mark on a printed list (the legend reads this, never a flag).
 * @param {ReadonlyArray<string>} printed
 * @returns {Set<string>}
 */
export function tradeMarksOnPage(printed) {
  return new Set(printed.flatMap((raw) => tradeMarkOf(raw).kinds));
}

/**
 * THE REVENUES THAT LEFT THE LISTS (CENSUS-3c; the chair's ruling R-P 2): a DISPLAY read model over
 * the record's own trade lists and income table. A NOT_A_GOOD label the lists carry is printed under
 * the income table, in its home's words (`data/revenueHomes.js`), when no income row of the same
 * family already speaks for it and the record holds the fact behind it (`filterDeclared` against
 * `factsOf`). A label with no home prints nowhere (the lane doc's "needs a home"). No figure is
 * invented: the record holds no share for these, so the surfaces print them unmeasured.
 * @param {{
 *   economicState?: {
 *     primaryExports?: ReadonlyArray<unknown> | null,
 *     primaryImports?: ReadonlyArray<unknown> | null,
 *     incomeSources?: unknown,
 *   } | null,
 * } | null | undefined} settlement
 * @returns {Array<{ text: string, desc: string }>}
 */
export function revenuesOffTheLists(settlement) {
  const eco = settlement?.economicState;
  if (!eco) return [];
  const listed = new Set([...(eco.primaryExports || []), ...(eco.primaryImports || [])]
    .filter((x) => typeof x === 'string').map((raw) => fold(tradeMarkOf(raw).label)));
  const income = new Set((Array.isArray(eco.incomeSources) ? eco.incomeSources : [])
    .map((/** @type {{ source?: unknown, name?: unknown } | null} */ r) => fold(r?.source ?? r?.name)));
  const wanted = REVENUE_HOMES.filter((home) => home.labels.some((l) => listed.has(fold(l)))
    && !home.family.some((f) => income.has(fold(f))));
  return filterDeclared(wanted, {
    facts: () => factsOf(settlement),
    poolId: 'income:revenues-off-the-lists',
    surface: 'economics',
    drawKind: 'A',
  }).map((home) => ({ text: home.text, desc: home.desc }));
}

/**
 * THE IMPORTS AS PRINTED (W2-A-LEAVES, 2026-11-12; re-ruled by W2-A-LEAVES-2, 2026-11-13, REVIEW-W2A F1 and F4).
 *
 * The Economics tab printed two lists as one Imports line: the record's trade imports (`primaryImports`) and the
 * terrain viability report's NEED list (`resourceAnalysis.imports.critical`, "Required by Potter but not available
 * in Hills terrain"). The second is not trade: the record's own gap kind for the same house is `missing`, and in
 * 440 of the 445 cases the census counted the good is nowhere in the economy's imports. So a need was printed as an
 * arrival. This leaf KEEPS THE TWO APART:
 *   - `arriving`: what trade brings in — the record's imports through `displayTradeList` (the export wins; the
 *     category errors and the undeclared luxuries leave);
 *   - `needed`: a good the town needs that the land cannot give and no import brings — each terrain-critical item
 *     no import already names, through the same filter. A NEED THAT IS NOT MET, never an import.
 * Both lists are the one composition the tab made inline (moved here verbatim, then split by origin), so nothing
 * is filtered differently from what the page printed. `needed` keeps the tab's own test of "no import names it"
 * (a substring) AND, since W2-C-LEAVES item 4(b), leaves out a need an arriving import meets under ANOTHER name
 * (`needMetBy`: luxury goods beside "Luxury textiles and exotic goods", metals beside "Iron"; 8 of 30 read on the
 * census's 720 by the first leaves lane), so a surface may print it as a need not met.
 *
 * WHO READS IT. The gap reader (`validationOnPage.js :: recordGoods`) reads `arriving` only, so a gap whose good is
 * merely needed prints ("No clay reaches the potter." is true by the record). THE ECONOMICS TAB DOES NOT READ IT
 * YET: `EconomicsTab.jsx` still composes the same list inline and prints both halves as Imports (REVIEW-W2A F4: the
 * first seat's "nothing composes it again" was false). Moving the tab onto this leaf — `arriving` as Imports,
 * `needed` as a need not met — is W2-C-LEAVES's (the chair's ruling, 2026-11-13); until then the page arm's row
 * P6need counts the towns whose Imports line prints a need.
 *
 * Layer 4: it reads the economy and the resource analysis (stored at layer 3).
 * @param {{
 *   economicState?: { primaryImports?: ReadonlyArray<unknown> | null, primaryExports?: ReadonlyArray<unknown> | null,
 *     localProduction?: ReadonlyArray<unknown> | null, activeChains?: ReadonlyArray<unknown> | null } | null,
 *   resourceAnalysis?: { imports?: unknown } | null,
 *   institutions?: ReadonlyArray<unknown> | null,
 * } | null | undefined} settlement
 * @returns {{ arriving: string[], needed: string[] }} the raw items of each, in the order the record gives them
 */
export function importsAsPrinted(settlement) {
  const eco = settlement?.economicState || {};
  const res = settlement?.resourceAnalysis;
  const imports = /** @type {{ critical?: unknown } | unknown[] | null | undefined} */ (res?.imports);
  const critical = !res || Array.isArray(imports) ? [] : (Array.isArray(imports?.critical) ? imports.critical : []);
  const primary = (eco.primaryImports || []).filter((x) => typeof x === 'string').map(String);
  const terrain = critical.filter((x) => typeof x === 'string').map(String)
    .filter((tc) => !primary.some((imp) => imp.toLowerCase().includes(tc.toLowerCase())));
  const kept = displayTradeList([...primary, ...terrain], /** @type {Parameters<typeof factsOf>[0]} */ (settlement), { side: 'imports', exports: eco.primaryExports });
  const fromTrade = new Set(primary);
  const arriving = arrivingOf(settlement);
  // W2-C-LEAVES R2 (the chair's ruling on REVIEW-R2-STAGES finding 2): a need the town MAKES is not a need — it leaves
  // the line where the town exports the good, produces it locally (as printed, `localProductionAsPrinted`), or a
  // working chain of the record makes it (its resource, its outputs, its name), matched as an import is (`needMetBy`).
  const made = madeHere(/** @type {Parameters<typeof madeHere>[0]} */ (settlement));
  return {
    arriving,
    // W2-C-LEAVES item 4(b): a need an arriving import already meets UNDER ANOTHER NAME is not a need left unmet
    // (`needMetBy`: "luxury goods" beside "Luxury textiles and exotic goods", "iron ore" beside "Iron").
    needed: kept.filter((x) => !fromTrade.has(x) && !arriving.some((imp) => needMetBy(x, imp)) && !made.some((m) => needMetBy(x, m))),
  };
}

/**
 * THE MATERIAL FAMILIES A NEED AND AN IMPORT ARE MATCHED BY (W2-C-LEAVES item 4(b), 2026-11-13; REVIEW-W2A-3 R2 and the
 * first leaves lane's hand-back: of 30 needs read beside the Imports line, 8 were met by an import under another name).
 * A word of the need names the families it asks for; an import meets it when a word of the import's own name (its
 * reason in brackets struck) is of one of them. A worked good (tools, arms, fittings, candles, torcs, supplies) meets
 * no raw need. Words are matched whole, singular or plural.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
const NEED_FAMILY_WORDS = Object.freeze({
  iron: ['iron', 'steel'],
  copper: ['copper'],
  precious: ['gold', 'silver', 'precious'],
  tin: ['tin'],
  timber: ['timber', 'lumber', 'plank'],
  stone: ['stone', 'masonry'],
  clay: ['clay'],
  salt: ['salt'],
  grain: ['grain', 'flour', 'wheat', 'barley'],
  textile: ['textile', 'cloth', 'linen', 'silk'],
  luxury: ['luxury', 'exotic'],
  spice: ['spice'],
  grape: ['grape'],
  livestock: ['livestock', 'cattle', 'ox', 'oxen'],
  herb: ['herb'],
  hide: ['hide', 'leather', 'fur', 'pelt'],
  fish: ['fish'],
  fuel: ['charcoal', 'fuel', 'peat', 'coal'],
  provision: ['provision', 'foodstuff', 'preserved'], // R2: "Preserved foods" made here meets "Preserved provisions for winter" (r2s-plague_onset-city-3)
  glass: ['glass'],
});
/** A need's word that asks for several families ("metals": any metal). */
const NEED_WIDE_WORDS = Object.freeze({ metal: ['iron', 'copper', 'precious', 'tin'] });
/** The words of a worked good: it meets no raw need. */
const WORKED_GOOD = /\b(?:tools?|arms|armou?r|weapons?|fittings?|components?|torcs?|jewel(?:le)?ry|candles?|supplies|equipment|vessels?|rigging|cordage)\b/i;

/** @param {string} label @returns {string[]} the label's words, lower case, singular, its bracketed reason struck */
const wordsOf = (label) => label.toLowerCase().replace(/\([^)]*\)/g, ' ').split(/[^a-z]+/).filter(Boolean)
  .map((w) => (w.length > 3 && /[^su]s$/.test(w) ? w.slice(0, -1) : w));
/** @param {string[]} words @returns {Set<string>} the families the words name */
const familiesOf = (words) => new Set(Object.entries(NEED_FAMILY_WORDS).filter(([, ws]) => ws.some((w) => words.includes(w))).map(([f]) => f));

/**
 * Whether an arriving import meets a need under another name.
 * @param {string} need a need's raw label ("luxury goods", "mountain_timber", "timber (for large vessels)")
 * @param {string} imp an arriving import's raw label
 * @returns {boolean}
 */
export function needMetBy(need, imp) {
  if (WORKED_GOOD.test(imp)) return false;
  const needWords = wordsOf(need);
  const asked = familiesOf(needWords);
  for (const [w, fams] of Object.entries(NEED_WIDE_WORDS)) if (needWords.includes(w)) for (const f of fams) asked.add(f);
  if (!asked.size) return false;
  const have = familiesOf(wordsOf(imp));
  return [...asked].some((f) => have.has(f));
}

/**
 * W2-C-LEAVES item 4(c) (2026-11-13; the cold list REVIEW-W2A-3 #45, #159, #192, #345, #382, #555): "PRODUCED LOCALLY"
 * PRINTS WHAT IS MADE HERE. The row printed `economicState.localProduction` raw: the commodities of every resource the
 * country holds, worked or not ("timber" beside "No one here works the timber"), the model's own identifiers ("trade
 * access", "luxury"), and the outputs of chains whose only house is a road to a neighbour's ("Religious services" in a
 * hamlet with "Access to parish church"). The record is untouched; the page keeps an item only where its home says yes:
 *   · a resource's commodity: a chain works that resource here (`facts/chainWorking.js :: chainWorksResource`, the one
 *     home of "worked here", record 303), or a house of the roster makes it (the generator's own maker words);
 *   · a chain's output: a working chain makes it none of whose houses is held only as a road to elsewhere ("Access to …");
 *   · the model's identifiers, and the category errors the trade lists already leave (`displayTradeList`), never.
 * @param {{ economicState?: { localProduction?: ReadonlyArray<unknown> | null, activeChains?: ReadonlyArray<unknown> | null } | null,
 *   institutions?: ReadonlyArray<unknown> | null } | null | undefined} settlement the record (its live roster, `liveInstitutions`)
 * @returns {string[]} the raw items kept, in the record's order
 */
export function localProductionAsPrinted(settlement) {
  const eco = settlement?.economicState || {};
  const local = eco.localProduction; // a read (the trade-list writers' walker counts a name before a ternary's colon)
  const list = (Array.isArray(local) ? local : []).filter((x) => typeof x === 'string' && x.trim()).map(String);
  const roster = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement)) // a ruined house makes nothing
    .map((i) => String(/** @type {{ name?: unknown }} */ (i)?.name ?? '').toLowerCase()).filter(Boolean);
  const ownHouses = roster.filter((n) => !n.startsWith('access to'));
  const chains = /** @type {Array<{ outputs?: unknown, processingInstitutions?: unknown, status?: unknown }>} */ (
    (Array.isArray(eco.activeChains) ? eco.activeChains : []).filter((c) => c && typeof c === 'object'));
  /** @param {{ processingInstitutions?: unknown }} c a chain one of whose houses the roster holds only as a road to elsewhere */
  const accessOnly = (c) => {
    const houses = (Array.isArray(c.processingInstitutions) ? c.processingInstitutions : []).map((h) => String(h).toLowerCase().split(/[\s(]/)[0]).filter(Boolean);
    return houses.some((h) => { const m = roster.filter((r) => r.includes(h)); return m.length > 0 && m.every((r) => r.startsWith('access to')); });
  };
  const made = new Set(chains
    .filter((c) => WORKING_CHAIN_STATUSES.includes(String(c.status)) && !accessOnly(c))
    .flatMap((c) => (Array.isArray(c.outputs) ? c.outputs : []).map((o) => String(o).toLowerCase())));
  const outputs = new Set(chains.flatMap((c) => (Array.isArray(c.outputs) ? c.outputs : []).map((o) => String(o).toLowerCase())));
  const bought = new Set(arrivingOf(settlement).map((x) => fold(tradeMarkOf(x).label)));
  const kept = list.filter((raw) => {
    const item = raw.toLowerCase().replace(/_/g, ' ').trim();
    if (LOCAL_IDENTIFIERS.has(item)) return false;
    if (!pillBorneOut(raw, 'local', settlement)) return false; // W2-C-LEAVES-4 item 2: the one pill reader (below)
    if (outputs.has(raw.toLowerCase())) return made.has(raw.toLowerCase());
    const keys = RESOURCES_YIELDING.get(item);
    const makers = HOUSE_MAKES[item];
    if (!keys && !makers) return true;
    const worked = !!keys && rawWorkedNow(settlement, keys, item); // (i): the leaf, read with the card's crisis state
    if (bought.has(item) && !worked) return false; // (v): bought in, and the leaf does not say it is worked here
    return worked || (!!makers && ownHouses.some((n) => makers.some((w) => n.includes(w))));
  });
  return displayTradeList(kept, /** @type {Parameters<typeof factsOf>[0]} */ (settlement), { side: 'exports' });
}
import { RESOURCE_DATA } from '../../data/goods/identity.js';
import { chainWorksResource, chainsWorking, WORKING_CHAIN_STATUSES } from '../facts/chainWorking.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
/** The model's own identifiers in the local list (a position and the commodity categories): never a good. */
const LOCAL_IDENTIFIERS = new Set(['trade access', 'maritime access', 'luxury', 'craft', 'textile', 'herbs', 'fuel', 'precious metal']);
/** Each resource commodity (spaced, lower case) → the resource keys that yield it (`RESOURCE_DATA[k].commodities`). */
const RESOURCES_YIELDING = (() => {
  /** @type {Map<string, string[]>} */ const m = new Map();
  for (const [key, row] of Object.entries(RESOURCE_DATA)) {
    for (const c of /** @type {{ commodities?: ReadonlyArray<string> }} */ (row).commodities || []) {
      const k = String(c).toLowerCase().replace(/_/g, ' ');
      m.set(k, [...(m.get(k) || []), key]);
    }
  }
  return m;
})();
/** The maker words of the generator's house-made commodities (`generators/economy/tradeGoods.js :: deriveLocalCommodities`). */
const HOUSE_MAKES = Object.freeze(/** @type {Record<string, ReadonlyArray<string>>} */ ({
  flour: ['mill', 'baker'], ironwork: ['smith', 'metalwork'], leather: ['tanner', 'leather'], cloth: ['weaver', 'textile'],
  meat: ['butcher'], lumber: ['carpenter', 'sawmill'], salt: ['dock', 'port', 'fishmonger'],
}));

/**
 * What the town makes, as the needs line reads it (W2-C-LEAVES R2): its exports, its local production as printed, and
 * what each working chain of the record names (`facts/chainWorking.js :: WORKING_CHAIN_STATUSES`): its resource, its
 * outputs and its name.
 * @param {Parameters<typeof localProductionAsPrinted>[0] & { economicState?: { primaryExports?: ReadonlyArray<unknown> | null } | null }} settlement
 * @returns {string[]}
 */
function madeHere(settlement) {
  const eco = settlement?.economicState || {};
  const chains = /** @type {Array<{ status?: unknown, resource?: unknown, outputs?: unknown, label?: unknown }>} */ (
    (Array.isArray(eco.activeChains) ? eco.activeChains : []).filter((c) => c && typeof c === 'object'));
  return [
    ...(Array.isArray(eco.primaryExports) ? [...eco.primaryExports] : []),
    ...localProductionAsPrinted(settlement),
    ...chains.filter((c) => WORKING_CHAIN_STATUSES.includes(String(c.status)))
      .flatMap((c) => [c.resource, ...(Array.isArray(c.outputs) ? c.outputs : []), c.label]),
  ].filter((x) => typeof x === 'string' && x.trim() !== '').map(String);
}

/**
 * What trade brings in, as the Imports row prints it (`importsAsPrinted(s).arriving`), read apart so the local reader
 * can ask it without composing the needs (W2-C-LEAVES-4 item 2, rule (v)).
 * @param {Parameters<typeof importsAsPrinted>[0]} settlement
 * @returns {string[]}
 */
function arrivingOf(settlement) {
  const eco = settlement?.economicState || {};
  const primary = (eco.primaryImports || []).filter((x) => typeof x === 'string').map(String);
  const fromTrade = new Set(primary);
  return displayTradeList(primary, /** @type {Parameters<typeof factsOf>[0]} */ (settlement), { side: 'imports', exports: eco.primaryExports })
    .filter((x) => fromTrade.has(x));
}

/**
 * THE GOODS PILLS PRINT ONLY WHERE THE RECORD BEARS THEM OUT (W2-C-LEAVES-4 item 2; the chair's ruling of 2026-11-13 on
 * the cut's #129, #196, #691, #1038, #1146, #1365 and the increment's seven "goods pills" lines). ONE reader for the
 * Economics tab's "Produced locally" and "Exports" pills; display only: the record's lists do not change.
 *   (ii) a MADE good (a chain's output, or a good of `MADE_GOOD_HOUSES`) prints only where a chain that makes it works
 *        here, in the state its card prints (`chainStateShown.js`, the crisis read; `facts/chainWorking.js ::
 *        WORKING_CHAIN_STATUSES`), none of its houses held only as a road to elsewhere, and the house its making
 *        needs stands on the live roster (`MADE_GOOD_HOUSES`, else any house of the chain): "Books and manuscripts" by
 *        Glassmakers alone, "metalwork" with no smithy, guild goods with no guild, are not borne out. A good the land
 *        gives and a house finishes ("Milled flour") prints only where a chain on that ground still works (a famine
 *        that failed the grain mills none); an export of a made good whose chain is impaired or broken (on a
 *        depleted ground, #1038) is not listed (vi).
 *   (ii) a good only an entrepôt chain carries is not made here: never "Produced locally"; an export only as transit.
 *   (iii) a SERVICE is a chain's output too: it prints only where a house of the live roster offers it (a church for
 *        "Religious services"); an "Access to ..." row is no house here.
 *   (iv) a key that is not a good (`NOT_A_GOOD_HERE`) never prints as one.
 *   (i), (v) a raw good keeps the chain leaf's reading (`localProductionAsPrinted`); an Export of the resource's own raw
 *        good stands (the record's export is the worked fact, W2-C-LEAVES-3 P1-b).
 * @param {string} raw the item as the record stores it (a trade mark may follow)
 * @param {'local'|'exports'} side the list it prints on
 * @param {Parameters<typeof localProductionAsPrinted>[0]} settlement the record
 * @returns {boolean} whether the pill prints as the record stores it
 */
export function pillBorneOut(raw, side, settlement) {
  return pillAsPrinted(raw, side, settlement) === raw;
}

/**
 * The pill as it prints, or null where it does not: a good an entrepôt carries through and no house here makes prints
 * on the Exports as a transit good (the page's own mark and legend, "Blue = re-exported transit goods"), never as made.
 * @param {string} raw @param {'local'|'exports'} side @param {Parameters<typeof localProductionAsPrinted>[0]} settlement
 * @returns {string | null}
 */
function pillAsPrinted(raw, side, settlement) {
  const mark = tradeMarkOf(raw);
  const good = fold(mark.label).replace(/_/g, ' ');
  if (NOT_A_GOOD_HERE.has(good)) return null;
  const eco = settlement?.economicState || {};
  const chains = /** @type {Array<{ outputs?: unknown, processingInstitutions?: unknown, status?: unknown, entrepot?: unknown, resourceInputKey?: unknown }>} */ (
    (Array.isArray(eco.activeChains) ? eco.activeChains : []).filter((c) => c && typeof c === 'object'));
  const roster = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement))
    .map((i) => String(/** @type {{ name?: unknown }} */ (i)?.name ?? '').toLowerCase()).filter(Boolean);
  const own = roster.filter((n) => !n.startsWith('access to'));
  /** @param {{ status?: unknown }} c */
  const works = (c) => WORKING_CHAIN_STATUSES.includes(String(chainStateShown(c, settlement)));
  /** @param {{ processingInstitutions?: unknown }} c @returns {string[]} the chain's houses' first words */
  const heads = (c) => (Array.isArray(c.processingInstitutions) ? c.processingInstitutions : []).map((h) => String(h).toLowerCase().split(/[\s(]/)[0]).filter(Boolean);
  const houseRe = MADE_GOOD_HOUSES.get(good);
  const makerStands = !!houseRe && own.some((n) => houseRe.test(n));
  /** @param {{ processingInstitutions?: unknown }} c */
  const houseStands = (c) => (houseRe ? makerStands : heads(c).some((h) => own.some((n) => n.includes(h))));
  /** @param {{ processingInstitutions?: unknown }} c */
  const roadOnly = (c) => heads(c).some((h) => { const m = roster.filter((r) => r.includes(h)); return m.length > 0 && m.every((r) => r.startsWith('access to')); });
  const grounds = TRADE_GOOD_GROUNDS.get(good) || [];
  const makers = chains.filter((c) => (Array.isArray(c.outputs) ? c.outputs : []).some((o) => fold(o) === good));
  if (makers.length > 0) {
    /** @param {{ entrepot?: unknown }} c an entrepôt that works no ground of the town's carries the good; it makes it only by a house here */
    const carries = (c) => c.entrepot === true && !SERVICE_OUTPUTS.has(good) && !makerStands && ['transit', 'none'].includes(chainCarrierOf(c, settlement).kind);
    /** @param {{ resourceInputKey?: unknown }} c the good is the land's own on the ground the chain works: no house makes it */
    const ofGround = (c) => !houseRe && grounds.includes(String(c.resourceInputKey)) && ['own', 'substitute'].includes(chainCarrierOf(c, settlement).kind);
    if (makers.some((c) => !carries(c) && works(c) && (ofGround(c) || (!roadOnly(c) && houseStands(c))))) return raw;
    if (side !== 'exports' || !makers.some((c) => carries(c) && works(c))) return null;
    return mark.kinds.includes('transit') ? raw : [mark.label, 'transit', ...mark.kinds].map((k, i) => (i === 0 ? k : `(${k === 'naval' ? 'naval route only' : k === 'occupation' ? 'taxed by occupation' : k})`)).join(' ');
  }
  if (!houseRe) return raw;
  if (!makerStands || landFailed(settlement, [...grounds, ...(RESOURCES_YIELDING.get(good) || [])])) return null;
  const onGround = chains.filter((c) => grounds.includes(String(c.resourceInputKey)));
  return onGround.length === 0 || onGround.some(works) ? raw : null;
}

/**
 * Whether every ground of the town's own that yields a good is one a famine in force failed (`chainStateShown.js ::
 * failedGroundsOf`): a famine that failed the grain mills no flour and grows no grain here.
 * @param {Parameters<typeof localProductionAsPrinted>[0]} settlement @param {ReadonlyArray<string>} grounds
 * @returns {boolean}
 */
function landFailed(settlement, grounds) {
  const failed = failedGroundsOf(settlement);
  if (failed.length === 0) return false;
  const near = /** @type {{ config?: { nearbyResources?: unknown } }} */ (settlement || {}).config?.nearbyResources;
  const mine = grounds.filter((g) => (Array.isArray(near) ? near.map(String) : []).includes(g));
  return mine.length > 0 && mine.every((g) => failed.includes(g));
}

/**
 * (i) A raw good the chain leaf says is worked here, read with the card's own state: where the chains that work it
 * all print as stopped by a crisis (a siege that took the fields, a famine that failed the harvest), or the famine
 * failed its ground, it is not produced locally; a house that works it (the leaf's) still does.
 * @param {Parameters<typeof localProductionAsPrinted>[0]} settlement @param {string[]} keys @param {string} item
 * @returns {boolean}
 */
function rawWorkedNow(settlement, keys, item) {
  if (!chainWorksResource(settlement, keys, item) || landFailed(settlement, keys)) return false;
  const chains = chainsWorking(settlement, keys, item);
  return chains.length === 0 || chains.some((c) => WORKING_CHAIN_STATUSES.includes(String(chainStateShown(c, settlement))));
}

/** The outputs an entrepôt offers as a house's service (a bank, a warehouse, a market), not goods carried through. */
const SERVICE_OUTPUTS = new Set(['financial services', 'international banking services', 'cargo handling', 'goods storage', 'magical item market',
  'weapon enchantment', 'planar travel information', 'diplomatic access', 'meals and drink']);

/** (iv) Keys the lists carry that are not goods (a position, a revenue, a label): never printed as a pill. */
const NOT_A_GOOD_HERE = new Set(['trade access', 'maritime trade access', 'toll income', 'market taxes', 'date export', 'maritime trade revenue']);

/**
 * (ii), (iii) THE HOUSE A GOOD'S MAKING NEEDS, by the roster's own words (a closed list, each entry its cause; a good
 * not here needs any house of the chain that makes it). Matched on the live roster's own houses, never an access row.
 * @type {ReadonlyArray<readonly [ReadonlyArray<string>, RegExp]>} */
const MADE_GOOD_ROWS = Object.freeze([
  // the glass and print chain's Glassmakers make no book (rww-city-famine-1); a scriptorium, a library, a sage does
  [['books and manuscripts'], /\bprint|\bscriptor|\bbookbind|\blibrar|\buniversit|\bcollege|\bscribe|\bsage|\bwizard/],
  [['printing services'], /\bprint/],
  [['glassware', 'window glass', 'glass blanks'], /\bglass/],
  // the parish chain's outputs need a house of worship: an almshouse or a foundling home holds no service
  [['religious services', 'education (basic)', 'sanctuary'], /\bchurch|\bcathedral|\bchapel|\bshrine|\btemple|\babbey|\bmonaster|\bfriary|\bpriest/],
  // guild goods with no guild (rww-village-famine-1: a Shepherd alone)
  [['guild-manufactured goods'], /\bguild/],
  // barrels need a cooper or a woodworker (rww-village-famine-1: a Thatcher alone)
  [['barrels and containers'], /\bcooper|\bcarpenter|\bjoiner|wright\b/],
  // tools, arms and metalwork need a smithy (rww-thorp-plague_onset-1: "metalwork" with no smith)
  [['quality tools and weapons', 'advanced weapons and armor', 'weapons and armour', 'basic metalwork', 'metalwork', 'ironwork'], /smith|\bforge|\bmetalwork|\barmou?r|\bweapon/],
  [['fine metalwork and jewelry', 'jewellery', 'cut gemstones'], /\bmetalwork|\bjewel|goldsmith|silversmith|\bgem/],
  // the luxury goods chains' manufacture: a metalworker, a luxury goods quarter or a silk house makes it here
  [['luxury manufactured goods'], /\bmetalwork|\bjewel|\bluxury goods|\bsilk|\bweav|\btailor/],
  // leather needs a tannery or a leatherworker (a hamlet's grazing alone tans nothing, rr2s-hamlet-calm-rand-1)
  [['leather goods', 'boots and shoes', 'tanned leather', 'leather'], /\btann|\bleather|\bcobbler|\bcordwain|\bsaddler|\bfurrier/],
  // cloth needs a weaver, a fuller, a dyer or a tailor (a Shepherd spins no cloth, rww-village-famine-1)
  [['processed textiles', 'finished clothing', 'dyed cloth', 'fine wool cloth', 'fine textiles', 'fulled cloth', 'cloth'], /\bweav|\btextile|\bfuller|\bdyer|\btailor|\bcloth|\bdraper|\bsilk/],
  // flour needs a mill (a sawmill is none) or a baker; bread a baker
  [['milled flour', 'flour and meal', 'flour'], /(?:^|[^a-z])mill(?:s|er|ers)?\b|\bbaker/],
  [['baked goods'], /(?:^|[^a-z])mill(?:s|er|ers)?\b|\bbaker/],
]);
/** @type {ReadonlyMap<string, RegExp>} */
const MADE_GOOD_HOUSES = new Map(MADE_GOOD_ROWS.flatMap(([goods, re]) => goods.map((g) => /** @type {[string, RegExp]} */ ([g, re]))));

/** The grounds a land's trade good comes from (`RESOURCE_DATA[k].tradeGoods`), lower case. */
const TRADE_GOOD_GROUNDS = (() => {
  /** @type {Map<string, string[]>} */ const m = new Map();
  for (const [key, row] of Object.entries(RESOURCE_DATA)) {
    for (const g of /** @type {{ tradeGoods?: ReadonlyArray<string> }} */ (row).tradeGoods || []) m.set(fold(g), [...(m.get(fold(g)) || []), key]);
  }
  return m;
})();

/**
 * THE EXPORTS AS PRINTED (W2-C-LEAVES-4 item 2): the record's exports through the trade lists' reader, each borne out
 * by `pillBorneOut`. The record's list is untouched.
 * @param {Parameters<typeof localProductionAsPrinted>[0] & { economicState?: { primaryExports?: ReadonlyArray<unknown> | null } | null }} settlement
 * @returns {string[]}
 */
export function exportsAsPrinted(settlement) {
  const eco = settlement?.economicState || {};
  const seen = new Set();
  return displayTradeList(eco.primaryExports, /** @type {Parameters<typeof factsOf>[0]} */ (settlement), { side: 'exports' })
    .map((raw) => pillAsPrinted(raw, 'exports', settlement))
    .filter((x) => x !== null && !seen.has(fold(tradeMarkOf(x).label)) && !!seen.add(fold(tradeMarkOf(x).label)))
    .map(String);
}
import { chainStateShown, failedGroundsOf } from './chainStateShown.js';
import { chainCarrierOf } from '../facts/chainCarrier.js';
