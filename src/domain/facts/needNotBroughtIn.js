/**
 * domain/facts/needNotBroughtIn.js — WHAT THE PAGE'S OWN NEED LIST SAYS (FAULTS-NEED item 1, THE ATOM; the sixth chair's
 * BRIEF-FAULTS ruling FR2 of 2026-11-18: "one fact the eager core cannot read today: what the page's own need list says
 * ('Needed, and not brought in: …')". NEW VOCABULARY, on the owner's veto list).
 *
 *   needListOf(record)            the need list, label by label, as the Economics tab, the journal and the PDF print it after
 *                                 "Needed, and not brought in:" (`tradeListDisplay.js :: importsAsPrinted(record).needed`): the
 *                                 raw items, in the record's order. [] where the record holds no resource analysis.
 *   needNotBroughtInOf(record)    `need not brought in: <key>`, a presence keyed by material family (`NEED_KEYS`): for each
 *                                 key, whether a need of the list is of that family. undefined where the record holds no
 *                                 resource analysis.
 *   goodNeededNotBroughtIn(record, good)  whether a good (a trade dependency's resource, "Iron ore", "Raw wool") is one the
 *                                 list says the town needs and does not get: a need of the list it names or meets by family.
 *
 * "Secure a steady supply of livestock for the dairy …" beside "Needed, and not brought in: livestock." (11e.wantBuy); "Regional
 * merchants. Luxury goods available." beside "Needed, and not brought in: luxury goods." (FR3); "{settlement} covers what it
 * must … Every essential is accounted for" beside "Needed, and not brought in: salt." (12d, r2r-hamlet-21). Each line presumes a
 * supply the page itself says the town does not get.
 *
 * WHY A SECOND HOME, AND HOW IT STAYS ONE FACT (the precedents `catchStopped.js`, `criticalImportBroughtIn.js`): the page's
 * reading is `importsAsPrinted`, which reads `factsOf` (the luxury class's band) and modules pinned lazy (EG1: the trade
 * declarations, the input fact `houseInputAtHand.js`, the crisis table); `factsOf` reads this leaf and the generators reach it
 * through the eager core, so none of those can be imported here. This leaf states the page's verdict in the record's own words
 * (each of the page's filters below, by name) and the guard `tests/generators/faultsNeed.test.js` holds it EQUAL to the page's
 * list, label by label, on every town it births and on a constructed record for each branch of the page's reader, so the two
 * cannot drift: a change to either reds it. The trade declarations' two tables are imported from their home (it imports
 * nothing: the chair's FR13 (a)); the copied rows below are held equal to their homes by the guard. The family words and the
 * matcher are `criticalImportBroughtIn.js`'s (no third copy).
 *
 * Layer 4 (over the resource analysis and the economy, stored at layer 3, and the roster and the services beside them). Pure:
 * no randomness, no clock, no write.
 * @enforced-by tests/generators/faultsNeed.test.js
 */
import { FAMILY_WORDS, familiesOf, meets, wordsOf } from './criticalImportBroughtIn.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { ventureOnPage } from './supplyStory.js';
import { chainPrintName } from '../display/chainPrintName.js';
import { LUXURY_CLASS, NOT_A_GOOD } from '../../data/tradeListDeclarations.js'; // their home (imports nothing; FR13 (a))
import { filterDeclared, lineText } from './drawDeclared.js'; // the kernel's door the luxury pool is read through (FR15)

/**
 * THE STATUSES OF A WORKING CHAIN, a COPY of `facts/chainWorking.js :: WORKING_CHAIN_STATUSES` (that module is rostered lazy in
 * `goods.schema.js`'s goods roster: an import from this eager leaf would make it eager), held equal to it by the guard.
 * @type {ReadonlyArray<string>}
 */
export const WORKING_CHAIN_STATUSES_COPY = Object.freeze(['running', 'operational', 'entrepot', 'vulnerable', 'magically_sustained']);

/** @typedef {{ resourceAnalysis?: unknown, economicState?: unknown, institutions?: unknown, availableServices?: unknown, tier?: unknown }} NeedRecord */

/** @param {unknown} v @returns {unknown[]} */
const arr = (v) => (Array.isArray(v) ? v : []);
/** @param {unknown} v @returns {string[]} */
const strings = (v) => arr(v).filter((x) => typeof x === 'string').map(String);
/** @param {unknown} v @returns {string} */
const fold = (v) => String(v ?? '').trim().toLowerCase();
/**
 * The page's trade marks, a COPY of `tradeListDisplay.js :: MARKS`'s patterns (that module is not importable here: see the
 * header), held equal to it by the guard.
 * @type {ReadonlyArray<RegExp>}
 */
export const MARK_RES = Object.freeze([/\s*\(transit\)\s*$/i, /\s*\(naval route only\)\s*$/i, /\s*\(taxed by occupation\)\s*$/i]);
/** A label with the page's trade marks struck (`tradeListDisplay.js :: tradeMarkOf(raw).label`). @param {string} raw */
const labelOf = (raw) => { let l = raw; for (let c = true; c;) { c = false; for (const re of MARK_RES) if (re.test(l)) { l = l.replace(re, ''); c = true; } } return l; };

const NOT_A_GOOD_SET = new Set(NOT_A_GOOD.map(fold));
/** The luxury class's row for a label, or undefined (a lookup: the row keeps its declaration). @param {string} label folded */
const luxuryRowOf = (label) => LUXURY_CLASS.find((row) => fold(row.text) === label);

/**
 * `displayTradeList(list, record, { side: 'imports', exports })`, in the record's words: a category error leaves, an export
 * wins, and every item goes through the kernel's door (`drawDeclared.js :: filterDeclared`) as the page sends it: a luxury
 * with its row's own declaration, every other item a bare line, read against the facts that declaration reads (the
 * record's tier, in the door's facts shape; FR15: the pool is drawn through its door, never unwrapped).
 * @param {string[]} list @param {NeedRecord} record @param {unknown} exports
 */
function keptOnImports(list, record, exports) {
  const exported = new Set(strings(exports).map((x) => fold(labelOf(x))));
  const kept = list.filter((raw) => raw.trim()).filter((raw) => {
    const label = fold(labelOf(raw));
    return !NOT_A_GOOD_SET.has(label) && !exported.has(label);
  });
  const declared = kept.map((raw) => { const row = luxuryRowOf(fold(labelOf(raw))); return row ? { text: raw, needs: row.needs } : raw; });
  const tier = typeof record.tier === 'string' ? record.tier : undefined;
  return filterDeclared(declared, { facts: () => ({ tier }), poolId: 'trade-list:imports', surface: 'economics', drawKind: 'A' })
    .map((line) => String(lineText(line)));
}

/**
 * THE GOODS MADE HERE (`tradeListDisplay.js :: madeHere`): the exports, and what each working chain names (its printed
 * resource, its outputs, its printed name). The page's third source, "Produced locally" as printed, meets no need of the
 * populations the guard reads (it is held there, need by need).
 * @param {NeedRecord} record @param {Record<string, unknown>} eco
 */
function madeHere(record, eco) {
  const chains = /** @type {Array<{ status?: unknown, outputs?: unknown }>} */ (arr(eco.activeChains).filter((c) => c && typeof c === 'object'));
  return [
    ...strings(eco.primaryExports),
    ...chains.filter((c) => WORKING_CHAIN_STATUSES_COPY.includes(String(c.status))).flatMap((c) => {
      const p = chainPrintName(/** @type {Parameters<typeof chainPrintName>[0]} */ (c), /** @type {Parameters<typeof chainPrintName>[1]} */ (record));
      return [p.resource, ...arr(c.outputs), p.label];
    }),
  ].filter((x) => typeof x === 'string' && x.trim() !== '').map(String);
}

/** THE GOODS THE GAP ROWS SAY ARE BOUGHT IN (`tradeListDisplay.js :: importedByGapRow`). @param {unknown[]} gaps */
const importedByGapRow = (gaps) => /** @type {Array<{ kind?: unknown, chain?: unknown, institution?: unknown }>} */ (gaps)
  .filter((g) => g && g.kind === 'imported' && typeof g.chain === 'string' && g.chain.trim() && typeof g.institution === 'string' && g.institution)
  .map((g) => String(g.chain));

/** The service rows that deal in a good (`tradeListDisplay.js :: NEED_DEALT_ROWS`, a copy held equal by the guard). */
export const NEED_DEALT_ROWS_COPY = Object.freeze(/** @type {ReadonlyArray<readonly [string, RegExp]>} */ ([
  ['livestock', /^livestock (?:auctions?|management)$/i],
]));

/**
 * THE GOODS A LIVE HOUSE ON THE PAGE DEALS IN (`tradeListDisplay.js :: dealtInHere`): a live house's printed service row that
 * deals in the good, save the failed venture's own material and a good a live house of the town is marked short of
 * (FAULTS-NEED item 0). The page reads the mark (`crisisStoppedRow.js :: rowShortOf`'s gate over `houseInputAtHand.js ::
 * housesShortOf`); here, in the record's words, the gap row of a live house that is not bought in and names the good.
 * @param {NeedRecord} record @param {unknown[]} gaps
 */
function dealtInHere(record, gaps) {
  const av = record.availableServices;
  const rows = Array.isArray(av) ? av : av && typeof av === 'object' ? Object.values(av).flat() : [];
  if (!rows.length) return [];
  const live = new Set(liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (record)).map((i) => String(i?.name ?? '')).filter(Boolean));
  const ventureFamily = fold(ventureOnPage(/** @type {Parameters<typeof ventureOnPage>[0]} */ (record))?.family);
  const short = /** @type {Array<{ kind?: unknown, chain?: unknown, institution?: unknown }>} */ (gaps)
    .filter((g) => g && g.kind !== 'imported' && typeof g.chain === 'string' && live.has(String(g.institution ?? '')))
    .map((g) => String(g.chain).replace(/_/g, ' '));
  /** @type {string[]} */
  const out = [];
  for (const [good, re] of NEED_DEALT_ROWS_COPY) {
    if (ventureFamily === good) continue;
    if (short.some((noun) => meets(good, noun) || fold(noun) === good)) continue;
    if (rows.some((r) => r && typeof r === 'object' && re.test(String(/** @type {{ name?: unknown }} */ (r).name ?? '').trim())
      && live.has(String(/** @type {{ institution?: unknown }} */ (r).institution ?? '')))) out.push(good);
  }
  return out;
}

/**
 * THE NEED LIST, label by label (`importsAsPrinted(record).needed`).
 * @param {unknown} record the settlement record
 * @returns {string[]} the raw items, in the record's order
 */
export function needListOf(record) {
  if (!record || typeof record !== 'object') return [];
  const r = /** @type {NeedRecord} */ (record);
  const res = /** @type {{ imports?: unknown, gaps?: unknown } | null | undefined} */ (r.resourceAnalysis);
  const imports = /** @type {{ critical?: unknown } | unknown[] | null | undefined} */ (res?.imports);
  const critical = !res || Array.isArray(imports) ? [] : strings(/** @type {{ critical?: unknown }} */ (imports)?.critical);
  const eco = /** @type {Record<string, unknown>} */ (r.economicState && typeof r.economicState === 'object' ? r.economicState : {});
  const primary = strings(eco.primaryImports);
  const fromTrade = new Set(primary);
  const terrain = critical.filter((tc) => !primary.some((imp) => imp.toLowerCase().includes(tc.toLowerCase())));
  const arriving = keptOnImports(primary, r, eco.primaryExports);
  const made = madeHere(r, eco);
  const gaps = arr(res?.gaps);
  const gapGoods = importedByGapRow(gaps);
  const dealt = dealtInHere(r, gaps);
  return keptOnImports(terrain, r, eco.primaryExports).filter((x) => !fromTrade.has(x)
    && !arriving.some((imp) => meets(x, imp)) && !made.some((m) => meets(x, m))
    && !gapGoods.some((g) => meets(x, g)) && !dealt.some((g) => meets(x, g)));
}

/**
 * THE KEYS of `need not brought in` (the families the lines of this round declare; FR2): the luxuries and the quarter's goods
 * (FR3: a luxury of the page's own class or of the family words; the silk, the spice, the precious things the quarter's line
 * names), the three essentials of 12d (salt, fuel, livestock), and `any` (the chair's amendment to item 4, 2026-11-18 06:55
 * UTC: a good the page lists under "Needed, and not brought in" is not accounted for, so DS-ECO-8 POOR v1 refuses any need).
 */
export const NEED_KEYS = Object.freeze(['luxury', 'spice', 'silk', 'precious', 'salt', 'fuel', 'livestock', 'any']);

/** @param {string} key @param {string} need */
function needOfKey(key, need) {
  if (key === 'any') return true;
  if (key === 'silk') return wordsOf(need).includes('silk');
  if (key === 'luxury') return !!luxuryRowOf(fold(labelOf(need))) || familiesOf(wordsOf(need)).has('luxury');
  return Object.prototype.hasOwnProperty.call(FAMILY_WORDS, key) && familiesOf(wordsOf(need)).has(key);
}

/**
 * THE ONE READER of `need not brought in: <key>`: each key of `NEED_KEYS`, whether a need of the list is of that family.
 * @param {unknown} record the settlement record
 * @returns {Readonly<Record<string, boolean>> | undefined} undefined where the record holds no resource analysis
 */
export function needNotBroughtInOf(record) {
  const res = /** @type {{ resourceAnalysis?: unknown } | null | undefined} */ (record)?.resourceAnalysis;
  if (!res || typeof res !== 'object') return undefined;
  const list = needListOf(record);
  return Object.freeze(Object.fromEntries(NEED_KEYS.map((key) => [key, list.some((need) => needOfKey(key, need))])));
}

/**
 * Whether a good is one the need list says the town needs and does not get (11e.wantBuy): a need of the list that the good's
 * label names, or whose family a word of the good's label is of (`meets(need, good)`, the page's matcher read as the page
 * reads an import against a need: "Stone + iron + grain" beside the need "stone"; "Precious metals" beside "gold/silver
 * ore"). A wide word of the good ("Metal ore") asks nothing of a need: the smith's metal is had where iron comes in, though
 * copper does not.
 * @param {unknown} record @param {unknown} good
 * @returns {boolean}
 */
export function goodNeededNotBroughtIn(record, good) {
  return goodsNeededNotBroughtIn(record, good).length > 0;
}

/**
 * LAST-VARIETY (the chair's ruling LR6 (5), 2026-11-18): THE GOODS themselves, the needs of the list a good names or meets,
 * in the list's order and words, so a line that says what a house lacks names what the page prints under "Needed, and not
 * brought in", never the dependency's whole compound ("stone + iron + grain" where only the iron is wanting). [] where none.
 * @param {unknown} record @param {unknown} good
 * @returns {string[]}
 */
export function goodsNeededNotBroughtIn(record, good) {
  const g = typeof good === 'string' ? good.trim() : '';
  if (!g) return [];
  return needListOf(record).filter((need) => fold(need) === fold(g) || meets(need, g));
}
