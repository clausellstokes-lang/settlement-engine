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
 *   economicState?: { primaryImports?: ReadonlyArray<unknown> | null, primaryExports?: ReadonlyArray<unknown> | null } | null,
 *   resourceAnalysis?: { imports?: unknown } | null,
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
  const arriving = kept.filter((x) => fromTrade.has(x));
  return {
    arriving,
    // W2-C-LEAVES item 4(b): a need an arriving import already meets UNDER ANOTHER NAME is not a need left unmet
    // (`needMetBy`: "luxury goods" beside "Luxury textiles and exotic goods", "iron ore" beside "Iron").
    needed: kept.filter((x) => !fromTrade.has(x) && !arriving.some((imp) => needMetBy(x, imp))),
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
  provision: ['provision', 'foodstuff'],
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
  const list = (Array.isArray(eco.localProduction) ? eco.localProduction : []).filter((x) => typeof x === 'string' && x.trim()).map(String);
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
  const kept = list.filter((raw) => {
    const item = raw.toLowerCase().replace(/_/g, ' ').trim();
    if (LOCAL_IDENTIFIERS.has(item)) return false;
    if (outputs.has(raw.toLowerCase())) return made.has(raw.toLowerCase());
    const keys = RESOURCES_YIELDING.get(item);
    const makers = HOUSE_MAKES[item];
    if (!keys && !makers) return true;
    return (!!keys && chainWorksResource(settlement, keys)) || (!!makers && ownHouses.some((n) => makers.some((w) => n.includes(w))));
  });
  return displayTradeList(kept, /** @type {Parameters<typeof factsOf>[0]} */ (settlement), { side: 'exports' });
}
import { RESOURCE_DATA } from '../../data/goods/identity.js';
import { chainWorksResource, WORKING_CHAIN_STATUSES } from '../facts/chainWorking.js';
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
