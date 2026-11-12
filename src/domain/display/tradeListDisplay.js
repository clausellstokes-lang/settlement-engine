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
 * THE IMPORTS AS PRINTED (W2-A-LEAVES, 2026-11-12; the class table's pattern 6: the page printed two lists of
 * imports as one — the record's `primaryImports` and the terrain's critical imports beside them — and the gap
 * reader read only the first, so a gap named a good the Imports line shows arriving, 296 of 720). ONE list:
 * the record's imports, then each terrain-critical import no import already names (the Economics tab's own
 * composition, moved here verbatim), through `displayTradeList` (the export wins; the category errors and the
 * undeclared luxuries leave). The Imports pills and the gap reader both read this; nothing composes it again.
 *
 * Layer 4: it reads the economy and the resource analysis (stored at layer 3).
 * @param {{
 *   economicState?: { primaryImports?: ReadonlyArray<unknown> | null, primaryExports?: ReadonlyArray<unknown> | null } | null,
 *   resourceAnalysis?: { imports?: unknown } | null,
 * } | null | undefined} settlement
 * @returns {string[]} the raw items, in the order the record gives them
 */
export function importsAsPrinted(settlement) {
  const eco = settlement?.economicState || {};
  const res = settlement?.resourceAnalysis;
  const imports = /** @type {{ critical?: unknown } | unknown[] | null | undefined} */ (res?.imports);
  const critical = !res || Array.isArray(imports) ? [] : (Array.isArray(imports?.critical) ? imports.critical : []);
  const primary = (eco.primaryImports || []).filter((x) => typeof x === 'string').map(String);
  const terrain = critical.filter((x) => typeof x === 'string').map(String)
    .filter((tc) => !primary.some((imp) => imp.toLowerCase().includes(tc.toLowerCase())));
  return displayTradeList([...primary, ...terrain], /** @type {Parameters<typeof factsOf>[0]} */ (settlement), { side: 'imports', exports: eco.primaryExports });
}
