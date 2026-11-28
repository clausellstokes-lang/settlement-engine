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
export const MARKS = Object.freeze([
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
    // BAR8 J-INCOME item 3 (11a.imported): a need a gap row of kind `imported` answers ("Smelter runs on imported iron ore",
    // the one reader of an input, `facts/houseInputAtHand.js`, through `resourceGenerator.js :: gapRowOf`) is brought in: the
    // gap rows `crisisStoppedRow.js :: housesOnImportedInput` reads, matched as an import is (`needMetBy`), no second matcher.
    // BAR8 J-INCOME item 4 (11e.offer, the need list's half): a good a live house on the page deals in (`NEED_DEALT_ROWS`) is
    // not "needed, and not brought in", save the failed venture's own material (`supplyStory.js :: ventureOnPage`).
    // RULING-R (the eleventh chair, 2026-11-27), R8 luxury: a need the place's OWN resources supply (a commodity the Resources
    // tab lists for it, `commoditiesShown.js :: commoditiesShown`, not marked failed) is not printed as unmet, matched as an
    // import is (`needMetBy`): "luxury goods" beside the "luxury" of its gemstone deposits or precious-metal veins.
    needed: kept.filter((x) => !fromTrade.has(x) && !arriving.some((imp) => needMetBy(x, imp)) && !made.some((m) => needMetBy(x, m))
      && !importedByGapRow(settlement).some((g) => needMetBy(x, g)) && !dealtInHere(settlement).some((g) => needMetBy(x, g))
      && !ownCommodities(settlement).some((c) => needMetBy(x, c))),
  };
}

/** RULING-R (R8 luxury): the commodities the page lists for the place's own resources, failed ones left out. @param {unknown} settlement @returns {string[]} */
function ownCommodities(settlement) {
  return commoditiesShown(settlement).filter((c) => !c.failed).map((c) => c.label);
}

/**
 * THE GOODS THE GAP ROWS SAY ARE BOUGHT IN (BAR8 J-INCOME item 3; the sixth chair's BRIEF-BAR8, 2026-11-17): each gap row of
 * kind `imported` ("<house> runs on imported X"), its good. The rows `crisisStoppedRow.js :: housesOnImportedInput` reads
 * (read, not changed). Display only.
 * @param {unknown} settlement @returns {string[]}
 */
function importedByGapRow(settlement) {
  const res = /** @type {{ resourceAnalysis?: { gaps?: unknown } | null } | null | undefined} */ (settlement)?.resourceAnalysis;
  const gaps = Array.isArray(res?.gaps) ? /** @type {Array<{ kind?: unknown, chain?: unknown, institution?: unknown }>} */ (res.gaps) : [];
  return gaps.filter((g) => g && g.kind === 'imported' && typeof g.chain === 'string' && g.chain.trim() && typeof g.institution === 'string' && g.institution)
    .map((g) => String(g.chain));
}

/**
 * THE GOODS A HOUSE ON THE PAGE DEALS IN (BAR8 J-INCOME item 4, 11e.offer's need-list half; vetoable by the owner): a service
 * row the page prints for a live house (the record's `availableServices`, joined by `institution`, as the Services and
 * Institutions tabs print them) that deals in the good: a fair's livestock auction, a shepherd's livestock management. The
 * spices' carriers (`CARRIED_GOOD_ROWS`) stay the chain card's. The failed venture's own material is never dealt in here
 * (a whole trade is not abandoned: BR6; r2r-hamlet-27's shepherd beside its failed venture of livestock is that fault, named).
 * @type {ReadonlyArray<readonly [string, RegExp]>} */
export const NEED_DEALT_ROWS = Object.freeze([
  ['livestock', /^livestock (?:auctions?|management)$/i],
]);

/** @param {unknown} settlement @returns {string[]} the goods a live house's printed service row deals in */
function dealtInHere(settlement) {
  const av = /** @type {{ availableServices?: unknown } | null | undefined} */ (settlement)?.availableServices;
  const rows = Array.isArray(av) ? av : av && typeof av === 'object' ? Object.values(av).flat() : [];
  if (!rows.length) return [];
  const live = new Set(liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement))
    .map((i) => String(/** @type {{ name?: unknown }} */ (i)?.name ?? '')).filter(Boolean));
  const venture = ventureOnPage(/** @type {Parameters<typeof ventureOnPage>[0]} */ (settlement));
  const ventureFamily = String(venture?.family ?? '').toLowerCase();
  const short = markedShortNouns(settlement);
  const out = [];
  for (const [good, re] of NEED_DEALT_ROWS) {
    if (ventureFamily === good) continue;
    // FAULTS-NEED item 0 (the second reader of the income piece, MED 1): a good a live house of the town is marked short of
    // ("Short of livestock." on the Dairy farmer, bar0-village-calm-rand-29, r2r-village-47) is a want the page does not meet:
    // a shepherd's livestock management beside it answers no need, so the need stays
    if (short.some((noun) => needMetBy(good, noun))) continue;
    if (rows.some((r) => r && typeof r === 'object' && re.test(String(/** @type {{ name?: unknown }} */ (r).name ?? '').trim())
      && live.has(String(/** @type {{ institution?: unknown }} */ (r).institution ?? '')))) out.push(good);
  }
  return out;
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
  const storedGrounds = storedGroundsOf(settlement); // RULING 123-C2-1: what the record says each of its grounds gives
  // BAR5-FOOD (L3.failedFood): the food a famine in force failed is not made here this year (`commoditiesShown.js ::
  // failedFoodGoodsOf`, the one reading the Resources tab's commodity list marks): "Produced locally" leaves it.
  const failedFood = failedFoodGoodsOf(settlement).map((g) => new RegExp(`\\b${g}\\b`));
  const kept = list.filter((raw) => {
    const item = raw.toLowerCase().replace(/_/g, ' ').trim();
    if (LOCAL_IDENTIFIERS.has(item)) return false;
    if (failedFood.some((re) => re.test(item))) return false;
    if (halfWayDeniedHere(settlement, item)) return false; // SEAM-ECON item 4: the card's half-way reading
    if (everyMakerShortHere(settlement, item)) return false; // BAR7-ECON item 5 (8j.local): every maker marked short
    if (!pillBorneOut(raw, 'local', settlement)) return false; // W2-C-LEAVES-4 item 2: the one pill reader (below)
    if (outputs.has(raw.toLowerCase())) return made.has(raw.toLowerCase());
    const keys = yieldingHere(item, storedGrounds); // RULING 123-C2-1: the catalogue's grounds and the record's own
    const makers = HOUSE_MAKES[item];
    if (!keys && !makers) return true;
    const worked = !!keys && rawWorkedNow(settlement, keys, item); // (i): the leaf, read with the card's crisis state
    if (bought.has(item) && !worked) return false; // (v): bought in, and the leaf does not say it is worked here
    return worked || (!!makers && ownHouses.some((n) => makers.some((w) => n.includes(w))));
  });
  return displayTradeList(kept, /** @type {Parameters<typeof factsOf>[0]} */ (settlement), { side: 'exports' });
}
import { RESOURCE_DATA } from '../../data/goods/identity.js';
import { chainPrintName } from './chainPrintName.js';
import { chainWorksResource, chainsWorking, WORKING_CHAIN_STATUSES } from '../facts/chainWorking.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { ventureOnPage } from '../facts/supplyStory.js'; // BAR8 J-INCOME item 4: the failed venture's material (read)
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
/**
 * RULING 123-C2-1: A STORED ITEM IS NOT DROPPED ON THE CATALOGUE's WORD. The catalogue is read at view, so a town saved
 * before a row of it changed (R11: the palms gave grain and dates) stores goods its grounds no longer give by today's row,
 * and the local list dropped them ("grain · dates · …" became "dates · …" on 13 saved palm towns of V). The record says
 * what each of its grounds gave at its birth: `resourceAnalysis.availableResources` holds each ground's key followed by
 * the goods it added (`resourceGenerator.js :: resolveNearbyCommodities`). Those grounds join the catalogue's for the good,
 * and the good is then read as before (worked, bought, failed). A town born on today's catalogue stores only what today's
 * rows give, so nothing is added for it.
 * @param {unknown} settlement @returns {Map<string, string[]>} each stored good (spaced, lower case) -> the record's grounds
 */
function storedGroundsOf(settlement) {
  const list = /** @type {{ resourceAnalysis?: { availableResources?: unknown } | null } | null | undefined} */ (settlement)
    ?.resourceAnalysis?.availableResources;
  /** @type {Map<string, string[]>} */ const m = new Map();
  let ground = '';
  for (const raw of Array.isArray(list) ? list : []) {
    const v = String(raw);
    if (Object.hasOwn(RESOURCE_DATA, v)) { ground = v; continue; }
    const k = v.toLowerCase().replace(/_/g, ' ');
    if (ground) m.set(k, [...(m.get(k) || []), ground]);
  }
  return m;
}
/** @param {string} item @param {Map<string, string[]>} stored @returns {string[] | undefined} the grounds that yield it */
function yieldingHere(item, stored) {
  const keys = [...(RESOURCES_YIELDING.get(item) || []), ...(stored.get(item) || [])];
  return keys.length ? [...new Set(keys)] : undefined;
}
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
      .flatMap((c) => { const p = chainPrintName(c, /** @type {Parameters<typeof chainPrintName>[1]} */ (settlement)); return [p.resource, ...(Array.isArray(c.outputs) ? c.outputs : []), p.label]; }), // W2-C-LEAVES-8: the name and source through the leaf (chainPrintSites)
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
 *        needs stands on the live roster (`MADE_GOOD_HOUSES`; no row, no maker, W2-C-LEAVES-12): "Books and manuscripts" by
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
  const works = (c) => WORKING_CHAIN_STATUSES.includes(String(chainCrisisStateShown(c, settlement)));
  const houseRe = MADE_GOOD_HOUSES.get(good);
  const makerStands = !!houseRe && own.some((n) => houseMakesGood(good, houseRe, n, settlement));
  const grounds = TRADE_GOOD_GROUNDS.get(good) || [];
  const makers = chains.filter((c) => (Array.isArray(c.outputs) ? c.outputs : []).some((o) => fold(o) === good));
  if (makers.length > 0) {
    /** @param {{ entrepot?: unknown }} c an entrepôt that works no ground of the town's carries the good; it makes it only by a house here */
    const carries = (c) => c.entrepot === true && !SERVICE_OUTPUTS.has(good) && !makerStands && ['transit', 'none'].includes(chainCarrierOf(c, settlement).kind);
    // W2-C-LEAVES-6 item 7: whether the chain makes the good here, by its houses or its ground, is read by ONE helper
    // (`chainMakesHere`, at the end of the file), shared with a chain card's own Outputs (`chainOutputsShown`), so the
    // pills and the card read the same rule (iii). The helper is the reading that stood here, moved whole: the good is
    // the land's own on the ground the chain works (no house makes it), or none of the chain's houses is held only as a
    // road to elsewhere and the house its making needs stands (`MADE_GOOD_HOUSES`; since W2-C-LEAVES-12 no row, no maker; once any house by its
    // first word). The chain's state (`works`) and an entrepôt's carriage (`carries`) stay read here. Eight lines, as
    // the four closures took: a census row below keys this file by line (`tests/lint/arcaneClassifierCensus`).
    // (The record is not touched.)
    if (makers.some((c) => !carries(c) && works(c) && chainMakesHere(c, good, settlement, roster))) return raw;
    if (side !== 'exports' || !makers.some((c) => carries(c) && works(c))) return null;
    return mark.kinds.includes('transit') ? raw : [mark.label, 'transit', ...mark.kinds].map((k, i) => (i === 0 ? k : `(${k === 'naval' ? 'naval route only' : k === 'occupation' ? 'taxed by occupation' : k})`)).join(' ');
  }
  // W2-C-LEAVES-12, the chair's ruling (3), HIGH (REVIEW-W2-C-LEAVES [13]): a raw good whose own card the page marks Impaired
  // by the crisis in force is not listed as an export ("Raw wool, Livestock" beside "The herds failed this year")
  if (!houseRe) return side === 'exports' && rawCardStoppedByCrisis(good, chains, settlement) ? null : raw;
  if (!makerStands || landFailed(settlement, [...grounds, ...(RESOURCES_YIELDING.get(good) || [])])) return null;
  const onGround = chains.filter((c) => grounds.includes(String(c.resourceInputKey)));
  return onGround.length === 0 || onGround.some(works) ? raw : null;
}

/**
 * A RAW GOOD'S OWN CARD, STOPPED BY THE CRISIS IN FORCE (W2-C-LEAVES-12, ruling (3) HIGH; the reader's [13]: exports under a
 * famine listing the food that failed, 12 to 13 towns): the chains that work a ground the good comes from
 * (`TRADE_GOOD_GROUNDS`, `RESOURCES_YIELDING`), where there is one, all print Impaired by the crisis read
 * (`chainStateShown.js :: chainCrisisStateShown`: a famine's failed source, a siege's stopped field work) while the record
 * holds them working. Then the good is not sent out: the card the page prints says so.
 * @param {string} good the good, folded @param {ReadonlyArray<{ status?: unknown, resourceInputKey?: unknown }>} chains the record's chains
 * @param {Parameters<typeof localProductionAsPrinted>[0]} settlement the record
 * @returns {boolean}
 */
function rawCardStoppedByCrisis(good, chains, settlement) {
  const grounds = [...(TRADE_GOOD_GROUNDS.get(good) || []), ...(RESOURCES_YIELDING.get(good) || [])];
  const own = chains.filter((c) => grounds.includes(String(c.resourceInputKey)));
  // W2-C-LEAVES-12 (the chair, 14:10 UTC): where no card works the good's ground, a famine that failed every such ground of
  // the town's own (`landFailed`) stops it too (r2s-famine-thorp-1: grazing land, no herd card, "Raw wool, Livestock")
  if (own.length === 0) return grounds.length > 0 && landFailed(settlement, grounds);
  return own.every((c) => WORKING_CHAIN_STATUSES.includes(String(c.status)) && chainCrisisStateShown(c, settlement) === 'impaired');
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
  return chains.length === 0 || chains.some((c) => WORKING_CHAIN_STATUSES.includes(String(chainCrisisStateShown(c, settlement))));
}

/** The outputs an entrepôt offers as a house's service (a bank, a warehouse, a market), not goods carried through. */
const SERVICE_OUTPUTS = new Set(['financial services', 'international banking services', 'cargo handling', 'goods storage', 'magical item market',
  'weapon enchantment', 'planar travel information', 'diplomatic access', 'meals and drink']);

/** (iv) Keys the lists carry that are not goods (a position, a revenue, a label): never printed as a pill. */
const NOT_A_GOOD_HERE = new Set(['trade access', 'maritime trade access', 'toll income', 'market taxes', 'date export', 'maritime trade revenue']);

/**
 * (ii), (iii) THE HOUSE A GOOD'S MAKING NEEDS, by the roster's own words (a closed list, each entry its cause; a good
 * not here is made by no house and is not printed as made, W2-C-LEAVES-12 ruling (3)). Matched on the live roster's own
 * houses, never an access row.
 * @type {ReadonlyArray<readonly [ReadonlyArray<string>, RegExp]>} */
const MADE_GOOD_ROWS = Object.freeze([
  // the glass and print chain's Glassmakers make no book (rww-city-famine-1); a scriptorium, a library, a sage does
  [['books and manuscripts'], /\bprint|\bscriptor|\bbookbind|\blibrar|\buniversit|\bcollege|\bscribe|\bsage/], // + its chain's house through the detector (end of file)
  [['printing services'], /\bprint/],
  [['glassware', 'window glass', 'optical glass', 'glass blanks'], /\bglass/],
  // the parish chain's outputs need a house of worship: an almshouse or a foundling home holds no service
  [['religious services', 'education (basic)', 'sanctuary'], /\bchurch|\bcathedral|\bchapel|\bshrine|\btemple|\babbey|\bmonaster|\bfriary|\bpriest/],
  // guild goods with no guild (rww-village-famine-1: a Shepherd alone)
  [['guild-manufactured goods'], /\bguild/],
  // barrels need a cooper or a woodworker (rww-village-famine-1: a Thatcher alone)
  [['barrels and containers'], /\bcooper|\bcarpenter|\bjoiner|wright\b/],
  // tools, arms and metalwork need a smithy (rww-thorp-plague_onset-1: "metalwork" with no smith)
  [['quality tools and weapons', 'advanced weapons and armor', 'master-crafted weapons', 'weapons and armour', 'basic metalwork', 'metalwork', 'ironwork'], /smith|\bforge|\bmetalwork|\barmou?r|\bweapon/],
  [['fine metalwork and jewelry', 'jewellery', 'cut gemstones'], /\bmetalwork|\bjewel|goldsmith|silversmith|\bgem/],
  // the luxury goods chains' manufacture: a metalworker, a luxury goods quarter or a silk house makes it here
  [['luxury manufactured goods'], /\bmetalwork|\bjewel|\bluxury goods|\bsilk|\bweav|\btailor/],
  // a court's work needs a courthouse (W2-C-LEAVES-6 item 7, the cut's #555; record 422: the page names a court only where
  // a courthouse stands on the roster; the catalogue gives these three to the Courthouse alone, a Town hall arbitrates)
  [['civil disputes', 'criminal trials', 'notary services'], /\bcourthouse|\bcourt buildings?\b/],
  // leather needs a tannery or a leatherworker (a hamlet's grazing alone tans nothing, rr2s-hamlet-calm-rand-1)
  [['leather goods', 'boots and shoes', 'tanned leather', 'leather'], /\btann|\bleather|\bcobbler|\bcordwain|\bsaddler|\bfurrier/],
  // cloth needs a weaver, a fuller, a dyer or a tailor (a Shepherd spins no cloth, rww-village-famine-1)
  [['processed textiles', 'finished clothing', 'dyed cloth', 'fine wool cloth', 'fine textiles', 'fulled cloth', 'cloth'], /\bweav|\btextile|\bfuller|\bdyer|\btailor|\bcloth|\bdraper|\bsilk/],
  // flour needs a mill (a sawmill is none) or a baker; bread a baker
  [['milled flour', 'flour and meal', 'flour'], /(?:^|[^a-z])mill(?:s|er|ers)?\b|\bbaker/],
  [['baked goods'], /(?:^|[^a-z])mill(?:s|er|ers)?\b|\bbaker/],
  // ── W2-C-LEAVES-12, the chair's rulings (3) and (2b) of 2026-11-14: A GOOD WITH NO MAKER ROW IS NOT PRINTED BY DEFAULT;
  // THE HOUSE THAT FINISHES A GOOD MAKES THAT GOOD. The default read any house of the chain by the first word of its name,
  // so a Mine made "Master-crafted weapons" (the reader's [11], 21 of 21), a Mill brewed beer, "Multiple market squares"
  // gave armed escort, "Blacksmiths" sold contraband (the black market's first word) and "Great cathedral" drew maps (the
  // great library's): 52,603 card outputs, 2,624 exports and 5,478 local pills passed that way on the reader's 1,824
  // births. Each good of the chain table now names the houses that make or offer it (the roster's own words):
  // drink, board and the road's services
  [['meals and drink'], /\btavern|\binns?\b|alehouse|ale house|\bbrew|\bvintner/],
  [['lodging'], /\btavern|\binns?\b|alehouse|ale house|caravanserai|waystation|hostel/],
  [['stabling'], /\btavern|\binns?\b|\bstable|caravanserai|waystation/],
  [['hiring hall', 'gambling'], /\btavern|\binns?\b|alehouse|ale house|gambl/],
  [['message relay'], /\btavern|\binns?\b|post relay|message network|cartograph|\bcrier|courier/],
  [['ale (barrel)', 'beer (barrel)', 'malt'], /\bbrew|alehouse|ale house|maltster/], // a mill mills: it brews nothing (ruling 2b)
  [['mead'], /\bbrew|alehouse|ale house|\bmead|beekeep/],
  // food kept and caught: a cooper makes the barrel, not what goes in it; a fish market sells the catch, it renders no oil
  [['preserved foods'], /salt works|\bbutcher|fishmonger|fish market|\bdairy|smokehouse|\bpreserv/],
  [['honey and beeswax', 'foraged goods'], /beekeep|subsistence|smallhold|\bforag|elder grove/],
  [['candles and wax'], /\bchandler|beekeep/],
  [['medicinal honey'], /apothecar|beekeep|herbalist/],
  [['herbal remedies'], /apothecar|herbalist|midwife|\bhealer|\bwarden|elder grove/],
  [['potions and elixirs'], /apothecar|herbalist|\balchemist/], // + an arcane house of its own chain (ARCANE_MADE_GOODS)
  [['alchemical products'], /\balchemist/], // + an arcane house of its own chain
  [['aged cheese', 'luxury dairy products'], /\bdairy|cheese/],
  [['dates and fruit', 'preserved fruit', 'palm sugar'], /\bfarm|orchard|subsistence|\bgrove\b/],
  [['water trade', 'caravan resupply'], /caravanserai|waystation|\bwells?\b|cistern/],
  [['grain export', 'agricultural produce', 'surplus food'], /\bfarm|granary|(?:^|[^a-z])mills?\b/],
  // healing and faith
  [['medical treatment'], /hospital|infirmar|physician|almshouse|foundling/],
  [['surgery'], /hospital|surgeon/],
  [['quarantine'], /hospital|lazar|pest ?house/],
  [['medical training'], /hospital|universit|physician/],
  [['medical care (basic)'], /\bchurch|cathedral|chapel|temple|abbey|monaster|friary|priory|shrine|\bhealer|hospital|infirmar|almshouse/],
  [['spellcasting (minor)'], /\bchurch|cathedral|chapel|temple|abbey|monaster|friary|priory/], // + an arcane house of its own chain
  [['poor relief'], /\bchurch|cathedral|chapel|temple|abbey|monaster|friary|priory|almshouse|foundling/],
  [['record keeping'], /\bchurch|cathedral|temple|abbey|monaster|priory|\bscribe|librar/],
  [['hospitality for travellers'], /\bchurch|cathedral|abbey|monaster|friary|priory|hospice|almshouse/],
  [['illuminated manuscripts'], /monaster|abbey|priory|cathedral|scriptor/],
  // arms, watch and law
  [['defence services'], /\bwatch\b|garrison|barracks|militia|\bguards?\b|citadel|castle|\bfort/],
  [['weapons training'], /\bwatch\b|garrison|barracks|militia|\bguards?\b|mercenar|free company|fencing/],
  [['armed escort'], /mercenar|free company|adventurer|veteran|caravan guard/],
  [['mercenary hire', 'training services'], /mercenar|free company/],
  // BAR8 J-INCOME item 5 (K's 15c): a veteran's lodge offers armed escort only (`data/institutionServices.js`): it hunts no monster
  [['monster hunting services', 'dungeon clearance'], /adventurer|monster hunt/],
  [['legal services'], /\bcourthouse|\bcourt buildings?\b|town hall|city hall|\bnotar|lawyer|advocate/],
  [['strategic control', 'trade access fees', 'transit trade profit'], /\btoll|customs|garrison|caravaneer|coaching inn|citadel/],
  // the underworld's trades
  [['contraband goods'], /smuggl|\bfences?\b|black market|thieves|front business|outlaw/],
  [['forged documents', 'fencing stolen goods', 'illegal services'], /\bfences?\b|black market|thieves|front business|forger/],
  [['import/export bypass', 'safe houses'], /smuggl|outlaw|\bfences?\b|thieves/],
  [['information brokerage'], /thieves|street gang|\bsage|post relay|listening post|whisper|informant/],
  [['guild protection', 'contract killing', 'intimidation services', 'comprehensive black market'], /thieves|street gang|syndicate|assassin/],
  [['forced labour services', 'domestic servants', 'agricultural labour', 'mine labour'], /slave|workhouse|labour/],
  // news, maps, letters and learning
  [['news and information'], /cartograph|librar|\bcrier|message network|post relay|\bprint|herald/],
  [['maps and charts'], /cartograph|librar|navigator/],
  [['broadsheets'], /\bprint|cartograph/],
  [['public proclamations'], /\bcrier|herald|town hall|city hall|cartograph/],
  [['long-distance messages'], /post relay|message network|courier|caravaneer/],
  [['intelligence services'], /post relay|listening post|\bsage|\bspy|spies/],
  [['divination and scrying'], /\bscry|\bseer|oracle/], // + an arcane house of its own chain
  // higher learning: a sage, a library or a university; a house the detector calls arcane, of the good's own chain, too
  [['higher education', 'research', 'publishing'], /\bsage|librar|universit|scholar|\bprint/],
  // the magic trades: only an arcane house of the good's own chain (ARCANE_MADE_GOODS; the canonical detector)
  [['magical identification', 'enchanting services', 'spellcasting (greater)', 'teleportation', 'magical item market', 'weapon enchantment', 'armour warding', 'utility enchantments'], /(?!)/],
  // W2-C-LEAVES-13, the chair's ruling (r2): the bards' college makes its magical entertainment, where magic works here
  // (`MAGIC_WORKED_GOODS`, end of file); a theatre or a travelling troupe makes none
  [['magical entertainment'], /\bbardic college/],
  [['planar travel information', 'diplomatic access'], /\bplanar/], // extraplanar goods: carried by the planar traders (transit), made only by an arcane house of its chain
  // shows and games
  [['performances', 'music and song'], /theat|\bbard|performer|minstrel|musician/],
  [['musical education'], /\bbard|music/],
  [['games of chance'], /gambl/],
  [['gladiatorial combat', 'monster exhibitions', 'public games'], /\barena|colosseum|amphitheat/],
  // beasts
  [['cavalry mounts', 'draft horses', 'working animals'], /\bstable|horse|beast trainer|pack animal|breeder|ostler/],
  [['hunting dogs'], /beast trainer|kennel|\bhunter/],
  [['trained falcons'], /beast trainer|falconer/],
  // leather, cloth, bows
  [['saddles and harness', 'belts and straps'], /\bsaddler|\bleather|\btann|\bcobbler|harness/],
  [['leather armour'], /\bleather|\btann|\barmou?r/],
  [['tailored garments', 'livery and uniforms'], /\btailor|\bdraper|seamst/],
  [['bows and crossbows', 'arrows (sheaf)', 'crossbow bolts', 'hunting equipment'], /\bbowyer|\bfletcher/],
  // metal, stone, clay, wood and fuel: a Mine digs ore, it forges no blade
  [['refined iron ingots', 'pig iron', 'cast iron goods'], /\bsmelt|foundry|ironworks|\bmetalwork/],
  [['refined ingots', 'assay certificates'], /\bmint\b|\bmetalwork|\bjewel|goldsmith|silversmith|\bassay|\bsmelt/],
  [['gem appraisal'], /\bjewel|lapidar|\bgem/],
  [['fuel wood'], /charcoal|sawmill|woodcutter|forester/],
  [['structural timber'], /sawmill|sawyer|\bcarpenter|lumber|forester/],
  [['drainage pipes'], /\bbrick|\bpotter|\btile/],
  [['basket goods'], /basket|ropemaker|wicker/],
  // boats and ships: the reader's MEDIUM, "Ship construction"/"Ocean-going vessels" with no shipyard
  [['ship construction', 'ocean-going vessels', 'coastal craft'], /shipyard|shipwright/],
  [['river barges', 'fishing boats'], /shipyard|shipwright|boatyard|boatwright/],
  [['river craft', 'cargo barges'], /shipyard|boatyard|boatwright|\bbarge/],
  [['ferries'], /\bferry|boatyard/],
  [['vessel maintenance'], /shipyard|\bdocks?\b|port facilit|harbou?r|boatyard/],
  // trade's own houses
  [['cargo handling', 'goods storage'], /warehouse|\bdocks?\b|port facilit|\bbarge|caravan master|caravaneer|carriers|storehouse/],
  // (the caravan's trade goods and exotic imports are carried through, not made: no row, so an entrepôt prints them as transit)
  [['overland cargo transport', 'escorted caravan', 'pack animal hire', 'route intelligence', 'overland freight revenue'], /caravan|carriers|pack animal|waystation/],
  [['financial services', 'international banking services'], /\bbank|money ?changer|moneylender/],
  [['extreme luxury goods'], /luxury goods|\bjewel|goldsmith|\bsilk|\bmetalwork/],
]);
/** @type {ReadonlyMap<string, RegExp>} */
const MADE_GOOD_HOUSES = new Map(MADE_GOOD_ROWS.flatMap(([goods, re]) => goods.map((g) => /** @type {[string, RegExp]} */ ([g, re]))));

/**
 * THE HOUSES THAT WORK A LAND'S OWN GOOD OFF ITS GROUND (W2-C-LEAVES-12, ruling (3)): a good of the resource table's
 * `tradeGoods` (`TRADE_GOOD_GROUNDS`: coal, quarried stone, salted fish) is the land's own on the ground its chain works
 * (`chainMakesHere :: ofGround`), and a raw export of it stands (W2-C-LEAVES-3 P1-b); these rows are read only where the
 * chain does not work that ground: there a house of the row must stand (a charcoal burner digs no coal; a thatcher mills
 * no lumber, the reader's MEDIUM). Apart from `MADE_GOOD_ROWS`, so a land good's ground and its raw export read as before.
 * @type {ReadonlyArray<readonly [ReadonlyArray<string>, RegExp]>} */
const LAND_GOOD_ROWS = Object.freeze([
  [['salted fish', 'smoked seafood'], /salt works|\bsalter|fishmonger|fish market|\bfisher|smokehouse/],
  [['fish oil'], /\bfisher'|\bfishers?\b|\bchandler|render/], // a fish market sells the catch: it renders no oil (ruling 2b)
  [['freshwater catch', 'river fish'], /\bfisher|fishmonger|fish market/],
  [['game meat', 'hunting trophies'], /\bhunter|\bwarden|wildfowl|\btrapper/],
  [['furs and pelts'], /\bhunter|\bfurrier|\btrapper|\btann/],
  [['wild honey'], /beekeep|subsistence|\bforag/],
  [['alchemical reagents'], /\balchemist|apothecar|herbalist/],
  [['grain surplus', 'agricultural surplus', 'bulk food exports'], /\bfarm|granary|(?:^|[^a-z])mills?\b/], // a sawmill is no mill
  [['precious metals', 'coin minting'], /\bmint\b|\bmetalwork|\bjewel|goldsmith|silversmith|\bassay|\bsmelt|\bmines?\b/],
  [['iron ore'], /\bmines?\b|\bminer/],
  [['coal'], /\bmines?\b|collier/], // a charcoal burner burns charcoal, not coal
  [['peat fuel'], /\bpeat/],
  [['charcoal'], /charcoal/],
  [['milled lumber'], /sawmill|sawyer|\blumber|\bcarpenter/], // the reader's MEDIUM: "Milled lumber" with only a thatcher
  [['quarried stone'], /\bquarr|stonecutter|\bmason/],
  [['building materials'], /\bquarr|\bbrick|\bmason|sawmill/],
  [['pottery and ceramics'], /\bpotter|ceramic|\bkiln/],
  [['reeds and thatch'], /thatch|\breed|\bcutter/],
  [['waterfowl'], /wildfowl|\bfowler|\bhunter/],
  [['fired brick', 'roof tiles'], /\bbrick|\bpotter|\btile/],
]);
/** @type {ReadonlyMap<string, RegExp>} */
const LAND_GOOD_HOUSES = new Map(LAND_GOOD_ROWS.flatMap(([goods, re]) => goods.map((g) => /** @type {[string, RegExp]} */ ([g, re]))));

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
  const scarce = harvestScarceHere(settlement); // SEAM-ECON item 1 (8c.export)
  return displayTradeList(eco.primaryExports, /** @type {Parameters<typeof factsOf>[0]} */ (settlement), { side: 'exports' })
    .filter((raw) => !(scarce && HARVEST_CROP_GOOD.test(fold(tradeMarkOf(raw).label))))
    .filter((raw) => !halfWayDeniedHere(settlement, fold(tradeMarkOf(raw).label).replace(/_/g, ' '))) // SEAM-ECON item 4
    .filter((raw) => !everyMakerShortHere(settlement, fold(tradeMarkOf(raw).label).replace(/_/g, ' '))) // BAR7-ECON item 5 (8j.exports)
    .map((raw) => pillAsPrinted(raw, 'exports', settlement))
    .filter((x) => x !== null && !seen.has(fold(tradeMarkOf(x).label)) && !!seen.add(fold(tradeMarkOf(x).label)))
    .map(String);
}
import { chainCrisisStateShown, failedGroundsOf } from './chainStateShown.js';
import { failedFoodGoodsOf, commoditiesShown } from './commoditiesShown.js'; // BAR5-FOOD (L3.failedFood); RULING-R (R8 luxury): the place's own commodities

/**
 * THE CROP A SCARCE HARVEST DENIES IS NOT SENT OUT (SEAM-ECON item 1, LAW 8's 8c.export; the chair's BRIEF-BAR6-SEAM, 2026-11-17;
 * vetoable by the owner). The Economics tab printed "Harvest Scarce in the famine." on the income row and, beside it, an
 * Exports list carrying "Date harvest · Pressed dates · Palm sugar" (bar0-village-famine-rand-27) or "Milled flour · Flour and
 * meal" (bar0-village-famine-rand-38, where the herds failed and the mark reads the harvest's grain scarce with them). THE
 * ONE FACT is the page's own mark (`crisisStoppedRow.js :: rowStoppedBy` on an income share): the famine in force marks a
 * share that lives on the grain (`INCOME_DEPENDENCE`) where the food it failed (`FAMINE_FAILED_FOOD`) is the grain, or where
 * a share lives on that food and the grain both (BAR6-MARKS's `harvestFoodsScarce`: the herds failed, the harvest's grain is
 * read scarce with them). It is read here from the dependence table, because the mark's leaf imports this file through
 * `validationOnPage.js` (the cycle guard, `tests/architecture/layerBoundaries.test.js`, is shrink-only); the guard
 * `tests/domain/bar6SeamEcon.test.js` holds it equal to `rowStoppedBy` over a fixed sample. Where it holds, a crop of the
 * field, the grove or the mill (`HARVEST_CROP_GOOD`) leaves the Exports. Display only: the record's list is untouched.
 * @param {unknown} settlement @returns {boolean}
 */
export function harvestScarceHere(settlement) {
  if (!settlement || typeof settlement !== 'object' || !crisisOf(/** @type {object} */ (settlement)).has('famine')) return false;
  const eco = /** @type {{ economicState?: { incomeSources?: unknown, foodSecurity?: { foodRecord?: { failedSource?: unknown } | null } | null } | null }} */ (settlement).economicState;
  const failed = eco?.foodSecurity?.foodRecord?.failedSource;
  const food = typeof failed === 'string' ? (Object.hasOwn(FAMINE_FAILED_FOOD, failed) ? FAMINE_FAILED_FOOD[failed] : null) : GRAIN;
  if (!food) return false;
  const shares = /** @type {Array<Record<string, unknown>>} */ ((Array.isArray(eco?.incomeSources) ? eco.incomeSources : []).filter((sh) => !!sh && typeof sh === 'object'))
    .filter((sh) => sh.source !== 'custom');
  const deps = shares.map((sh) => { const t = typeof sh.source === 'string' ? sh.source.trim() : ''; return Object.hasOwn(INCOME_DEPENDENCE, t) ? INCOME_DEPENDENCE[t] : NONE; });
  return deps.some((d) => d.includes(GRAIN)) && (food === GRAIN || deps.some((d) => d.includes(food) && d.includes(GRAIN)));
}

/** The crops of the field, the grove and the mill, by a word of the good's name (folded). */
const HARVEST_CROP_GOOD = /\b(?:grain|wheat|barley|rye|oats|millet|rice|maize|dates?|flour|meal|harvest|palm sugar|produce)\b/;
import { FAMINE_FAILED_FOOD, GRAIN, INCOME_DEPENDENCE, NONE, INPUT, houseDependenceOf } from '../../data/crisisDependence.js';
import { housesShortOf } from '../facts/houseInputAtHand.js';

/**
 * A GOOD THE RECORD'S HALF-WAY GAP DENIES IS NEITHER SENT OUT NOR MADE HERE (SEAM-ECON item 4, the chair's BRIEF-BAR6-SEAM
 * 2026-11-17, BAR6-RECORD's 6c-arms left by name; vetoable by the owner). Blacksmiths (3-10) beside iron ore the record works
 * only half-way for want of a smelter (r2r-town-57, r2s-under_siege-town-3): the chain card already denies the ore's tools
 * and blades (`facts/halfWayGoods.js :: halfWayGoodsDenied`, "ore not smelted here is no tool or blade made of it"), while
 * the Exports and "Produced locally" still carried them. Both read the card's own fact: a good that every chain card making
 * it is denied by the half-way gap is not listed. A good no card makes is not read here. Display only.
 * @param {unknown} settlement @param {string} good the good, folded (lower case, spaced)
 * @returns {boolean}
 */
function halfWayDeniedHere(settlement, good) {
  const eco = /** @type {{ economicState?: { activeChains?: unknown } | null } | null | undefined} */ (settlement)?.economicState;
  const chains = /** @type {Array<{ outputs?: unknown }>} */ ((Array.isArray(eco?.activeChains) ? eco.activeChains : []).filter((c) => c && typeof c === 'object'))
    .filter((c) => (Array.isArray(c.outputs) ? c.outputs : []).some((o) => fold(o) === good));
  return chains.length > 0 && chains.every((c) => [...halfWayGoodsDenied(settlement, c)].some((d) => fold(d) === good));
}
import { halfWayGoodsDenied } from '../facts/halfWayGoods.js';
import { chainCarrierOf } from '../facts/chainCarrier.js';

/**
 * THE HOUSES WHOSE TRADE IS NO ONE CHAIN'S (W2-C-LEAVES-6 item 6; the chair's ruling of 2026-11-13 23:40 UTC on the first
 * leaves lane's #1152, the bowyer's card carrying the craft guilds' "Metal ore + gems · affects: … fine jewellery"). A
 * closed list, each entry its cause: a guild of many crafts and a market are listed among the houses of several chains
 * (`data/supplyChainData.js`), and the generator joins such a house's one need onto every one of those cards
 * (`computeActiveChains.js`); the need row names the house's own trade, not the chain's.
 *   · craft guilds: the row's need and services are the jewellers' (metal ore and gems; luxury goods, fine jewellery),
 *     printed on the bowyer's and the potter's cards (25 of the 720);
 *   · a market (a weekly market, a market square, several): the row's are the market day's (trade access and grain or goods;
 *     market day trade, commodity exchange), printed on the fishers' and the date growers' cards (42 of the 720).
 */
const NO_ONE_CHAINS_TRADE = /^craft guilds\b|^weekly market\b|\bmarket squares?\b/i;

/**
 * WHETHER A ROSTER HOUSE DOES A CHAIN'S WORK, by the goods pills' own reading of a chain's houses (`pillAsPrinted ::
 * heads`: a house's name holds the first word of one of the chain's houses), a house of no one chain's trade apart.
 * @param {{ processingInstitutions?: unknown } | null | undefined} chain one of `economicState.activeChains`
 * @param {string} house the house's native name
 * @returns {boolean}
 */
export function houseDoesChainsWork(chain, house) {
  const name = String(house || '').toLowerCase();
  if (!name || NO_ONE_CHAINS_TRADE.test(name)) return false;
  const heads = (Array.isArray(chain?.processingInstitutions) ? chain.processingInstitutions : [])
    .map((h) => String(h).toLowerCase().split(/[\s(]/)[0]).filter(Boolean);
  return heads.some((h) => name.includes(h));
}

/**
 * WHETHER A CHAIN MAKES A GOOD HERE BY ITS HOUSES OR ITS GROUND (the goods pills' reading, rules (ii) and (iii); one
 * reading for the trade lists' pills and, since W2-C-LEAVES-6 item 7, a chain card's own Outputs): the good is the land's
 * own on the ground the chain works (no house makes it), or none of the chain's houses is held only as a road to
 * elsewhere and the house its making needs stands on the live roster (`MADE_GOOD_HOUSES`; a good with no row there is
 * made by no house, W2-C-LEAVES-12 ruling (3)). The chain's state is not read here: the caller reads it.
 * @param {{ processingInstitutions?: unknown, resourceInputKey?: unknown }} c the chain
 * @param {string} good the good, folded (lower case, spaced)
 * @param {Parameters<typeof localProductionAsPrinted>[0]} settlement the record
 * @param {ReadonlyArray<string>} roster the live roster's names, lower case
 * @returns {boolean}
 */
function chainMakesHere(c, good, settlement, roster) {
  const own = roster.filter((n) => !n.startsWith('access to'));
  const heads = (Array.isArray(c.processingInstitutions) ? c.processingInstitutions : []).map((h) => String(h).toLowerCase().split(/[\s(]/)[0]).filter(Boolean);
  const houseRe = MADE_GOOD_HOUSES.get(good);
  const ofGround = !houseRe && (TRADE_GOOD_GROUNDS.get(good) || []).includes(String(c.resourceInputKey)) && ['own', 'substitute'].includes(chainCarrierOf(c, settlement).kind);
  if (ofGround) return true;
  const roadOnly = heads.some((h) => { const m = roster.filter((r) => r.includes(h)); return m.length > 0 && m.every((r) => r.startsWith('access to')); });
  // W2-C-LEAVES-12, ruling (3): a good with no maker row is not printed by default (the default read any house of the chain
  // by its first word: a Mine made master-crafted weapons)
  const makerRe = houseRe || LAND_GOOD_HOUSES.get(good);
  return !roadOnly && !!makerRe && own.some((n) => houseMakesGood(good, makerRe, n, settlement));
}

/**
 * THE OUTPUTS A CHAIN CARD PRINTS (W2-C-LEAVES-6 item 7; the round-three cut's #555: "Civil disputes · Criminal trials ·
 * Notary services" on a Law & Governance card in a town whose roster holds a Town hall and no courthouse). The card
 * printed the chain's outputs raw (`chain.outputs`, the first three); it prints each by the goods pills' rule (iii), the
 * same reading (`chainMakesHere`): a key that is not a good never, and an output only where the chain's own house that
 * makes or offers it stands. The card's state chip says whether the chain works now; its "Normally yields" header stands.
 * @param {{ outputs?: unknown, processingInstitutions?: unknown, resourceInputKey?: unknown } | null | undefined} chain
 * @param {Parameters<typeof localProductionAsPrinted>[0]} settlement the record
 * @returns {string[]} the outputs kept, in the record's order
 */
export function chainOutputsShown(chain, settlement) {
  const outputs = (Array.isArray(chain?.outputs) ? chain.outputs : []).filter((o) => typeof o === 'string' && o.trim()).map(String);
  if (!chain) return outputs;
  const roster = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement))
    .map((i) => String(/** @type {{ name?: unknown }} */ (i)?.name ?? '').toLowerCase()).filter(Boolean);
  const spare = foodToSpareHere(settlement);
  // SEAM-ECON item 8 (L3.outputs), read since LEFT-CHAIN L5 (2026-11-17) as the file's two other readers read it
  // (`everyMakerShortHere`: the page's own mark): the fact's wider short set held houses the page prints bare (193 of the
  // 720), and an output left the card beside a maker printed unmarked
  return outputs.filter((o) => {
    const good = fold(tradeMarkOf(o).label).replace(/_/g, ' ');
    if (!spare && (FOOD_EXPORT_OUTPUTS.has(good) || isFoodSurplusGood(good))) return false; // BAR3-LABELS-3 item 0
    return !NOT_A_GOOD_HERE.has(good) && ((chainMakesHere(chain, good, settlement, roster) && !everyMakerShortHere(settlement, good))
      || chainCarriesHere(chain, good, roster));
  });
}

/**
 * A RUNNING CHAIN LISTS NO OUTPUT THE PAGE MARKS SHORT (SEAM-ECON item 8, runB's L3.outputs; the chair's BRIEF-BAR6-SEAM,
 * 2026-11-17; vetoable by the owner). "River Mill Industry · ✓ Running" listed "Fulled cloth" beside "Fuller ... Short of
 * wool." and "Services · Fulled cloth (short)" (bar0-metropolis-calm-rand-27, -39). An output made by a house (its row in
 * `MADE_GOOD_HOUSES`) leaves the card where EVERY house of the live roster that makes it is marked short of its input: THE
 * ONE FACT `facts/houseInputAtHand.js :: housesShortOf`, the reading the Services row's mark gives. A good made of the
 * cloth's wool is made by the weaving and fulling houses (`MADE_OF_INPUT_BY`): its row also names the dyer, the tailor and
 * the draper, who finish or sell cloth and make none of it (the scene seat's rule for the cloth lines: a dyer answers only
 * the dyeing). A good with no maker row, or one no house here makes, is not read. The chain's state is not changed.
 * @param {string} good the good, folded @param {ReadonlyArray<string>} roster the live roster's names, lower case
 * @param {ReadonlySet<string>} short the houses marked short, lower case @param {Parameters<typeof localProductionAsPrinted>[0]} settlement
 * @returns {boolean}
 */
function everyMakerShort(good, roster, short, settlement) {
  const re = MADE_OF_INPUT_BY.get(good) || MADE_GOOD_HOUSES.get(good);
  if (!re || short.size === 0) return false;
  const makers = roster.filter((n) => !n.startsWith('access to') && houseMakesGood(good, re, n, settlement));
  return makers.length > 0 && makers.every((n) => short.has(n));
}

/**
 * A GOOD WHOSE EVERY MAKER THE PAGE MARKS SHORT LEAVES THE EXPORTS AND "PRODUCED LOCALLY" (BAR7-ECON item 5, LAW 8's 8j.exports
 * and 8j.local; the chair's BRIEF-BAR7, 2026-11-17; vetoable by the owner). "Fulled cloth" stood on the Exports beside a fuller
 * marked "Short of wool." and no other maker; "Leather goods" under Produced locally beside its only tanner marked short. The
 * seam's reading for a chain card's outputs (`everyMakerShort` over the one fact `facts/houseInputAtHand.js :: housesShortOf`),
 * on the two lists: a good with no maker row, or one no house here makes, or one an unmarked house makes, stays. Display only.
 * @param {unknown} settlement @param {string} good the good, folded (lower case, spaced)
 * @returns {boolean}
 */
function everyMakerShortHere(settlement, good) {
  const live = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement));
  // the page's own mark: a house of the short set whose dependence holds INPUT (`crisisStoppedRow.js :: rowShortOf`); the
  // set alone holds houses the page prints bare (a shepherd, a chandler, a stable district: no input dependence)
  const marked = new Set(live.filter((i) => houseDependenceOf(/** @type {{ name?: unknown }} */ (i)).includes(INPUT)).map((i) => fold(/** @type {{ name?: unknown }} */ (i)?.name)));
  const short = new Set([...housesShortOf(settlement).keys()].map(fold).filter((n) => marked.has(n)));
  if (short.size === 0) return false;
  const roster = live.map((i) => String(/** @type {{ name?: unknown }} */ (i)?.name ?? '').toLowerCase()).filter(Boolean);
  return everyMakerShort(good, roster, short, /** @type {Parameters<typeof localProductionAsPrinted>[0]} */ (settlement));
}

/**
 * THE NOUNS THE PAGE MARKS A LIVE HOUSE SHORT OF (FAULTS-NEED item 0): the page's own mark, read as `everyMakerShortHere`
 * reads it (a house of the short set whose dependence holds INPUT: `crisisStoppedRow.js :: rowShortOf`'s gate), the noun of
 * each ("livestock" for "Short of livestock."). Held to `rowShortOf` on every town of the guard's populations
 * (`tests/generators/faultsNeed.test.js`). Display only.
 * @param {unknown} settlement @returns {string[]}
 */
function markedShortNouns(settlement) {
  const live = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (settlement));
  const marked = new Set(live.filter((i) => houseDependenceOf(/** @type {{ name?: unknown }} */ (i)).includes(INPUT)).map((i) => String(/** @type {{ name?: unknown }} */ (i)?.name ?? '')));
  return [...housesShortOf(settlement)].filter(([house]) => marked.has(house)).map(([, noun]) => noun);
}

/** The houses that make a good of the cloth's wool (the weavers, the textile works, the fuller). */
const MADE_OF_INPUT_BY = new Map(['fulled cloth', 'fine wool cloth', 'cloth'].map((g) => /** @type {[string, RegExp]} */ ([g, /\bweav|\btextile|\bfuller/])));

/**
 * A CHAIN CARD'S FOOD-EXPORT OUTPUTS READ THE FOOD RECORD (BAR3-LABELS-3 item 0, the chair's row of 2026-11-15 21:00 UTC;
 * C7514 C18969 C7264; vetoable by the owner). The floodplain chain's "Grain export" and "Surplus food" are a claim that
 * the place grows more food than it eats; the grain chain's own such outputs are filtered at birth by the food-surplus
 * rule (`foodSurplus.js :: FOOD_SURPLUS_GOODS`), whose set lacks the floodplain's two words, so the card printed them
 * where the food record holds no surplus (8 of the 10 floodplain towns of the census's 720 at d38c247af; none under a
 * famine). The card prints neither where the record offers no surplus (`offersFoodSurplus`) or a famine is in force
 * (`facts/crisisKind.js :: crisisOf`); its "Agricultural produce" stands, so the card is never mute. Display only: the
 * data file and the record are not touched.
 */
const FOOD_EXPORT_OUTPUTS = Object.freeze(new Set(['grain export', 'surplus food']));

/** @param {unknown} settlement @returns {boolean} the food record offers a surplus and no famine stands */
function foodToSpareHere(settlement) {
  const s = /** @type {{ economicState?: { foodSecurity?: { foodRecord?: { growsMoreThanEats?: boolean, band?: string } | null } | null } | null } | null | undefined} */ (settlement);
  return offersFoodSurplus(s?.economicState?.foodSecurity?.foodRecord) && !crisisOf(/** @type {object} */ (settlement ?? {})).has('famine');
}
import { offersFoodSurplus, isFoodSurplusGood } from '../foodSurplus.js';
import { crisisOf } from '../facts/crisisKind.js';

/**
 * THE TRADE LISTS AS THE PAGE PRINTS THEM, IN ONE CALL (W2-C-LEAVES-7 item 8, 2026-11-14). The Economics tab's Exports,
 * Imports and "Produced locally" are this file's readers; the PDF's TRADE FLOWS (`pdf/sections/EconomicsTrade.jsx`)
 * printed the record's three lists raw and the Foundry journal (`foundry/journalPages.js`) its two through
 * `displayTradeList` alone, so a toll printed as an export, Grain as an import under a siege that stops trade, and
 * "Stone" as made in a thorp that works no quarry. The tab and both twins read this one composition:
 *   · `exports`: `exportsAsPrinted` (each pill borne out, an entrepôt's carried good as transit);
 *   · `imports`: what trade brings in (`importsAsPrinted(s).arriving`), and NOTHING where a siege in force stops trade
 *     (`chainStateShown.js :: tradeStoppedHere`, #169: the tab leaves its Imports heading out; `tradeStopped` says so);
 *   · `needed`: a need no import meets (the tab prints it apart, as a need not met);
 *   · `local`: `localProductionAsPrinted`.
 * Display only: the record's lists do not change.
 * @param {Parameters<typeof exportsAsPrinted>[0] & Parameters<typeof importsAsPrinted>[0]} settlement the record
 * @returns {{ exports: string[], arriving: string[], imports: string[], needed: string[], local: string[], tradeStopped: boolean }}
 */
export function tradeListsAsPrinted(settlement) {
  const { arriving, needed } = importsAsPrinted(settlement);
  const tradeStopped = tradeStoppedHere(settlement);
  return { exports: exportsAsPrinted(settlement), arriving, imports: tradeStopped ? [] : arriving, needed, local: localProductionAsPrinted(settlement), tradeStopped };
}
import { tradeStoppedHere } from './chainStateShown.js';


// ─── W2-C-LEAVES-10 item 3: THE ARCANE HOUSE A GOOD'S MAKING NEEDS, THROUGH THE CANONICAL DETECTOR (at the end of the file) ───
// The books row of MADE_GOOD_ROWS named its arcane maker by a token, `\bwizard`, in one alternation with "college" and
// "sage": the W-K2 shape tests/lint/arcaneClassifierCensus.walker.test.js reds (a tower is masonry, a college scholars).
// The token stood for the ancient ruins chain's own house ("Wizard's tower", beside "Sage's quarter", whose outputs are
// Books and manuscripts), and it also took a Hedge wizard for a maker of books. The arcane half is read here instead,
// from the record: a house of the live roster that the canonical detector calls arcane (`isArcaneInstitution`, R-BLD-5:
// the catalog's licence and tag first) and that one of the town's own chains making the good names among its houses.
// No token is typed here. Only the goods whose row named an arcane maker read it (`ARCANE_MADE_GOODS`).
import { isArcaneInstitution } from '../arcaneInstitutionIdentity.js';

/** The goods whose making an arcane house of their own chain does (their row named one). */
const ARCANE_MADE_GOODS = Object.freeze(['books and manuscripts', 'potions and elixirs', 'alchemical reagents', 'alchemical products',
  'spellcasting (minor)', 'divination and scrying', 'higher education', 'research', 'publishing', 'magical identification',
  'enchanting services', 'spellcasting (greater)', 'teleportation', 'magical item market', 'weapon enchantment', 'armour warding',
  'utility enchantments', 'magical entertainment', 'extraplanar goods']);

/**
 * Does this house of the live roster (its name, lower case) make the good: the good's row (MADE_GOOD_HOUSES), or an
 * arcane house one of the record's chains that makes the good names (above)?
 * @param {string} good the good, folded @param {RegExp} houseRe the good's row @param {string} name the house, lower case
 * @param {Parameters<typeof localProductionAsPrinted>[0]} settlement the record
 * @returns {boolean}
 */
function houseMakesGood(good, houseRe, name, settlement) {
  if (houseRe.test(name)) return !MAGIC_WORKED_GOODS.has(good) || magicOf(/** @type {Parameters<typeof magicOf>[0]} */ (settlement)).functions;
  if (!ARCANE_MADE_GOODS.includes(good) || !isArcaneInstitution(name)) return false;
  const eco = /** @type {{ activeChains?: unknown } | null | undefined} */ (settlement?.economicState);
  const chains = /** @type {Array<{ outputs?: unknown, processingInstitutions?: unknown }>} */ (
    (Array.isArray(eco?.activeChains) ? eco.activeChains : []).filter((c) => c && typeof c === 'object'));
  return chains.some((c) => (Array.isArray(c.outputs) ? c.outputs : []).some((o) => fold(o) === good)
    && (Array.isArray(c.processingInstitutions) ? c.processingInstitutions : []).some((h) => fold(h) === name));
}

/**
 * THE HOUSE THAT FINISHES A GOOD MAKES THAT GOOD (W2-C-LEAVES-12, the chair's ruling (2b) of 2026-11-14, on the eleventh
 * seat's veto rows "Mill finishes it, and it leaves as beer" and "Fish market finishes it, and it leaves as fish oil"):
 * whether the good's own maker row (`MADE_GOOD_HOUSES`, the table the pills read) holds this house of the live roster. A
 * good with no row is made by no house. The economy desk's full row names a house only where this says yes.
 * @param {string} good the good as a list prints it (a trade mark may follow)
 * @param {string} house the house's native roster name
 * @param {Parameters<typeof localProductionAsPrinted>[0]} settlement the record
 * @returns {boolean}
 */
export function houseMakesGoodNamed(good, house, settlement) {
  const key = fold(tradeMarkOf(good).label).replace(/_/g, ' ');
  const name = fold(house);
  const houseRe = MADE_GOOD_HOUSES.get(key) || LAND_GOOD_HOUSES.get(key);
  return !!houseRe && !!name && !name.startsWith('access to') && houseMakesGood(key, houseRe, name, settlement);
}

// ─── W2-C-LEAVES-13, the chair's ruling (r2) of 2026-11-14: TWO TRUE OUTPUTS GIVEN BACK THEIR MAKERS (at the end of the file) ───
// W2-C-LEAVES-12's maker table (no row, no maker) also silenced two outputs that are often true: "Rare spices and exotic
// dyes" on the Spices & Dyes card (507 cards of the reader's 1,824 births: the merchants carry them) and the bards'
// "Magical entertainment" (585). THE TWO ARE NOT SILENCED WHERE A MAKER STANDS: a line is in its pool unless the town
// makes it false. The bards' good has its row in MADE_GOOD_ROWS (the bardic college; magic must work here). The spices
// are CARRIED, not made: a MADE_GOOD_ROWS row would turn their transit exports and local pills into "made" (the twelfth
// seat's first cut made 219 spice exports false), so a carried good takes a table only the chain card reads.
import { magicOf } from '../facts/magic.js';

/** The goods a house makes only where magic works here (`facts/magic.js :: magicOf(...).functions`). */
const MAGIC_WORKED_GOODS = new Set(['magical entertainment']);

/**
 * THE HOUSES THAT CARRY AN ENTREPÔT'S GOOD THROUGH (W2-C-LEAVES-13, ruling (r2)): the chain's own houses, by the roster's
 * words. Read ONLY by a chain card's Outputs (`chainOutputsShown`), never by the trade lists' pills (`pillAsPrinted`):
 * the Exports keep printing the good as transit, and "Produced locally" never names it.
 * @type {ReadonlyArray<readonly [ReadonlyArray<string>, RegExp]>} */
const CARRIED_GOOD_ROWS = Object.freeze([
  // the Spices & Dyes chain's houses (`data/supplyChainData.js :: spices_dyes`): the merchant guilds, the luxury goods
  // quarter, an annual fair; a warehouse stores and an oligarchy governs, neither carries the trade
  [['rare spices and exotic dyes'], /\bmerchant guilds?\b|\bluxury goods quarter\b|\bannual fairs?\b/],
]);
/** @type {ReadonlyMap<string, RegExp>} */
const CARRIED_GOOD_HOUSES = new Map(CARRIED_GOOD_ROWS.flatMap(([goods, re]) => goods.map((g) => /** @type {[string, RegExp]} */ ([g, re]))));

/**
 * Whether an entrepôt chain carries a good through here: a house of the good's carrier row stands on the live roster (an
 * "Access to ..." row is none), and none of the chain's houses is held only as a road to elsewhere.
 * @param {{ entrepot?: unknown, processingInstitutions?: unknown }} c the chain @param {string} good the good, folded
 * @param {ReadonlyArray<string>} roster the live roster's names, lower case
 * @returns {boolean}
 */
function chainCarriesHere(c, good, roster) {
  const re = CARRIED_GOOD_HOUSES.get(good);
  if (c.entrepot !== true || !re) return false;
  const heads = (Array.isArray(c.processingInstitutions) ? c.processingInstitutions : []).map((h) => String(h).toLowerCase().split(/[\s(]/)[0]).filter(Boolean);
  const roadOnly = heads.some((h) => { const m = roster.filter((r) => r.includes(h)); return m.length > 0 && m.every((r) => r.startsWith('access to')); });
  return !roadOnly && roster.some((n) => !n.startsWith('access to') && re.test(n));
}

// ─── W2-C-LEAVES-13, the chair's ruling (15): NO SURFACE PRINTS A CATALOGUE LABEL WITH A SLASH (at the end of the file) ───
/**
 * A GOOD'S PLAIN NAME (W2-C-LEAVES-13; the no-lane seat's row, "Needed, and not brought in: … gold/silver ore", 93 towns of
 * the joined tree's 720): the resource chain table spells two goods with a slash (`data/resourceChains.js :: preciousMetals`,
 * "gold/silver ore", "gold/silver bars"). A page prints the plain name, the two metals joined by "and" ("gold and silver
 * ore"); every other name is returned as given. Called on what the native-resource seam already printed
 * (`resourceDisplayName.js`, the pills' leaf), so case and words stay that leaf's. Display only; a MATCH never reads it.
 * @param {unknown} text a good's name as a page would print it
 * @returns {string}
 */
export function plainGoodName(text) {
  return String(text ?? '').replace(/(\p{L})\s*\/\s*(\p{L})/gu, '$1 and $2');
}


/**
 * WHO BRINGS THE FOOD IN NAMES THE CHANNEL THE RECORD GIVES (BAR6-ECON, LAW 9's rule 9c.carts of BRIEF-BAR6; the wide
 * read's C177322; vetoable by the owner). The food sentence's carrier is the route's (`foodCarrier.js :: carriersOf`:
 * ships over docks, carts on a road), and an isolated town whose food balance brings its share in by magic or by air
 * (`economicViability.metrics.foodBalance.importChannel`: "teleportation circle", "airship traffic", "airship runs") was
 * told "carts bring in", beside a page that says no trade road reaches it. The record's channel names the carrier where it
 * is one no cart is: the circle, the airships. Every other channel (a route's trade, the minor routes and caravans) keeps
 * the route's carrier; where the route's reading names none (a siege's cut), none is named here either.
 * @param {string} carriers the route's carrier phrase (`carriersOf`), '' where no food comes in by trade
 * @param {unknown} channel the food balance's `importChannel`
 * @returns {string}
 */
export function foodCarriersShown(carriers, channel) {
  if (!carriers || typeof channel !== 'string') return carriers;
  if (/\bteleport/i.test(channel)) return `the ${channel.trim()} brings`; // the record's own channel word (foodBalance.js writes it only beside the house)
  if (/\bairship/i.test(channel)) return 'airships bring';
  return carriers;
}

/**
 * THE IMPORTS' EMPTY LINE READS THE FOOD BROUGHT IN BELOW IT (BAR6-ECON, LAW 9's rule 9c.no-imports of BRIEF-BAR6; the
 * wide read's C154358; vetoable by the owner). "No recorded imports." printed above the Food Security row's "+ 5 imported"
 * and its sentence "carts bring in about three parts in five of the rest": the trade list carries no good, and the food
 * the same tab says comes in is an import all the same. Where the food row brings any in (`foodRowShown.js`, the figure the
 * row prints), the empty list says what is true: only food comes in. VETOABLE.
 * @param {{ importCoverage?: unknown } | null | undefined} fb the food balance as the row prints it
 * @returns {string}
 */
export function importsEmptyLineShown(fb) {
  return Number(fb?.importCoverage) > 0 ? ONLY_FOOD_IMPORTED : 'No recorded imports.';
}
/** VETOABLE (BAR6-ECON): the twin of "No recorded imports." where the food row brings food in. */
export const ONLY_FOOD_IMPORTED = 'Only food is brought in.';
