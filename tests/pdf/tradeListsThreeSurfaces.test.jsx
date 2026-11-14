/** @vitest-environment jsdom */
/**
 * tradeListsThreeSurfaces.test.jsx — W2-C-LEAVES-7 item 8: THE TRADE LISTS PRINT THE SAME PILLS ON THE TAB, THE PDF AND
 * THE FOUNDRY JOURNAL.
 *
 * The Economics tab prints its Exports, Imports and "Produced locally" through the trade lists' one display reader
 * (`domain/display/tradeListDisplay.js`: each export borne out by the record, `exportsAsPrinted`; what trade brings in,
 * `importsAsPrinted`, and nothing under a siege that stops trade, `chainStateShown.js :: tradeStoppedHere`, #169; what
 * is made here, `localProductionAsPrinted`). The PDF's TRADE FLOWS printed the record's three lists raw ("Toll revenue"
 * and "Transit trade" as exports; Grain, Salt and Iron as imports under a siege; "Stone" as made in a thorp that works
 * no quarry), and the journal printed its two through the older filter alone. Each twin now reads the tab's reader in
 * one call (`tradeListsAsPrinted`); this file renders the three surfaces of towns born in the app's own shape (the
 * census's 720, SECOND-WAVE-CENSUS/births.mjs) and asks that they print the same pills.
 *
 * The words of a pill are each surface's own (the tab prints an export as the record spells it, the PDF and the journal
 * through `resourceDisplayName`): the pills are compared through that seam, case folded.
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { return selector(data); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => data;
  return { useStore, default: useStore };
});
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { EconomicsTrade } from '../../src/pdf/sections/EconomicsTrade.jsx';
import { ThreeCol } from '../../src/pdf/primitives/Dense.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { resourceDisplayName } from '../../src/domain/display/resourceDisplayName.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** The census's 720 in the app's own shape (SECOND-WAVE-CENSUS/births.mjs :: cfgFor, the r2r- arm). @param {string} seed */
const birth720 = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^r2r-(\w+)-\d+$/));
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, tradeRouteAccess: 'random_trade', culture: 'random_culture',
    monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
    magicExists: true, contentProfile: 'grounded', settType: m[1] }), null, { seed, customContent: {} });
};
const fold = (/** @type {unknown} */ x) => String(x).toLowerCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim();

/** The tab's pills under a heading, or null where the heading does not print. @param {Element} root @param {string} head */
const tabPills = (root, head) => {
  const h = [...root.querySelectorAll('div')].find((d) => d.children.length === 0 && d.textContent?.trim() === head);
  if (!h) return null;
  return [...(h.nextElementSibling?.children || [])].filter((c) => c.tagName === 'SPAN').map((c) => c.textContent?.trim() || '');
};
/** @param {any} town */
const tabLists = (town) => {
  const { container, unmount } = render(<EconomicsTab settlement={town} narrativeNote={null} />);
  const out = { exports: tabPills(container, 'Exports'), imports: tabPills(container, 'Imports'), local: tabPills(container, 'Produced locally') };
  unmount();
  return out;
};

/** The text leaves of an executed react-pdf tree (the tests/pdf idiom). @param {any} node @param {string[]} acc @returns {string[]} */
const leaves = (node, acc = []) => {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node.type === 'function') return leaves(node.type(node.props), acc);
  return leaves(node.props?.children, acc);
};
/** @param {any} node @returns {any} the TRADE FLOWS columns' props, or null */
const tradeFlows = (node) => {
  if (node == null || typeof node !== 'object') return null;
  if (Array.isArray(node)) { for (const n of node) { const r = tradeFlows(n); if (r) return r; } return null; }
  if (node.type === ThreeCol) return node.props;
  if (typeof node.type === 'function') return tradeFlows(node.type(node.props));
  return tradeFlows(node.props?.children);
};
/** A column's heading and its bullets. @param {any} col */
const column = (col) => {
  const l = leaves(col); /** @type {string[]} */ const items = [];
  for (let i = 0; i < l.length; i++) if (l[i] === '•' && l[i + 1] != null) items.push(l[++i]);
  return { head: l[0] ?? null, items };
};
/** @param {any} town */
const pdfLists = (town) => {
  const cols = tradeFlows(EconomicsTrade({ settlement: town, narrativeMode: false, vm: buildViewModel({ settlement: town }), stateProse: null }));
  return cols ? { exports: column(cols.a), imports: column(cols.b), local: column(cols.c) } : null;
};
/** The journal's Economics & Trade rows. @param {any} town */
const journalRows = (town) => {
  const page = buildJournalPages(buildViewModel({ settlement: town }), { settlement: town }).find((p) => p.name === 'Economics & Trade');
  const row = (/** @type {string} */ k) => {
    const line = (page?.markdown || '').split('\n').find((l) => l.startsWith(`- **${k}:** `));
    return line ? line.slice(`- **${k}:** `.length).replace(/\\(.)/g, '$1') : null;
  };
  return { exports: row('Exports'), imports: row('Imports') };
};
/** The journal's row as the tab's pills would print in it (the row joins its items in the record's order by ", "). @param {string[]} pills @param {string|null} row */
const asJournalRow = (pills, row) => {
  const r = fold(row ?? '');
  return pills.map((p) => fold(resourceDisplayName(p))).sort((a, b) => r.indexOf(a) - r.indexOf(b)).join(', ');
};
const sorted = (/** @type {string[]} */ xs) => xs.map(fold).sort();

/** Each surface's pills beside the tab's. @param {string} seed */
const threeSurfaces = (seed) => {
  const town = birth720(seed);
  const tab = tabLists(town); const pdf = pdfLists(town); const jr = journalRows(town);
  expect(pdf !== null, `${seed}: anchored, the PDF prints its TRADE FLOWS`).toBe(true);
  return { town, tab, pdf: /** @type {NonNullable<typeof pdf>} */ (pdf), jr };
};

afterEach(cleanup);

describe('the trade lists print the same pills on the tab, the PDF and the journal (W2-C-LEAVES-7 item 8)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test.each([
    ['r2r-thorp-2', 'a toll and a road are not goods'],
    ['r2r-thorp-10', 'a good no house here makes is not exported'],
  ])('the exports (%s): %s', (seed) => {
    const { tab, pdf, jr } = threeSurfaces(seed);
    expect(tab.exports?.length, `${seed}: anchored, the tab prints exports`).toBeGreaterThan(0);
    const want = sorted((tab.exports || []).map((x) => resourceDisplayName(x)));
    expect(sorted(pdf.exports.items), `${seed}: the PDF's EXPORTS`).toEqual(want);
    expect(fold(jr.exports), `${seed}: the journal's Exports`).toBe(asJournalRow(tab.exports || [], jr.exports));
  }, 120000);

  test('the imports: under a siege that stops trade nothing is listed as brought in, on any surface (r2r-metropolis-14)', () => {
    const { town, tab, pdf, jr } = threeSurfaces('r2r-metropolis-14');
    expect(tab.exports?.length, 'anchored: the Trade Profile prints its exports').toBeGreaterThan(0);
    expect(town.economicState.primaryImports.length, 'anchored: the record lists imports').toBeGreaterThan(0);
    expect(tab.imports, 'the tab leaves the Imports out').toBeNull();
    expect(pdf.imports, 'the PDF: no IMPORTS heading, no bullet').toEqual({ head: null, items: [] });
    expect(jr.imports, 'the journal: no Imports row').toBeNull();
  }, 120000);

  test('the imports: a service is not a good brought in (r2r-village-2)', () => {
    const { tab, pdf, jr } = threeSurfaces('r2r-village-2');
    expect(tab.imports?.length, 'anchored').toBeGreaterThan(0);
    expect(sorted(pdf.imports.items)).toEqual(sorted((tab.imports || []).map((x) => resourceDisplayName(x))));
    expect(fold(jr.imports)).toBe(asJournalRow(tab.imports || [], jr.imports));
  }, 120000);

  test('the local production: what no one here works is not made here (r2r-thorp-0)', () => {
    const { town, tab, pdf } = threeSurfaces('r2r-thorp-0');
    expect(town.economicState.localProduction.length, 'anchored: the record lists local goods').toBeGreaterThan(0);
    expect(sorted(pdf.local.items)).toEqual(sorted(tab.local || []));
  }, 120000);

  test('the guard town: where the three already agreed every pill still prints on every surface (r2r-city-0)', () => {
    const { tab, pdf, jr } = threeSurfaces('r2r-city-0');
    for (const k of /** @type {const} */ (['exports', 'imports', 'local'])) {
      expect(tab[k]?.length, `anchored: the tab prints ${k}`).toBeGreaterThan(2);
      expect(sorted(pdf[k].items), k).toEqual(sorted((tab[k] || []).map((x) => (k === 'local' ? x : resourceDisplayName(x)))));
    }
    expect(fold(jr.exports)).toBe(asJournalRow(tab.exports || [], jr.exports));
    expect(fold(jr.imports)).toBe(asJournalRow(tab.imports || [], jr.imports));
  }, 120000);
});
