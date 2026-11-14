/** @vitest-environment jsdom */
/**
 * tradePillWordEverySurface.test.jsx — SURFACES-3 item 2 (the chair's ruling (r3) of 2026-11-14: THE TAB'S WORD
 * GOVERNS). A trade pill prints one word on the Economics tab, the PDF's EXPORTS/IMPORTS columns and the journal's
 * Exports/Imports rows: `domain/display/tradePillWord.js` (an export as the list spells it; an import through the
 * native-resource label seam). The PDF and the journal sent exports through the seam too, re-spelling a trade good as
 * the terrain it comes from ("River fisheries" for the tab's "River fish", "Precious metal veins", "Coastal timber"):
 * 83 of the 772 births. Towns: the smallest (a thorp), a famine city, a war metropolis (the largest), a calm town; the
 * guard: an import's raw resource key is still resolved by the seam on every surface.
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
import { tradeListsAsPrinted } from '../../src/domain/display/tradeListDisplay.js';
import { tradePillWord } from '../../src/domain/display/tradePillWord.js';
import { resourceDisplayName } from '../../src/domain/display/resourceDisplayName.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's r2r- and r2s- births (SURFACES-1's 772). @param {string} seed */
const birth = (seed) => {
  const r = seed.match(/^r2r-(\w+)-\d+$/);
  const s = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = r ? { ...DEFAULT_CONFIG, ...DIALS, settType: r[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [/** @type {RegExpMatchArray} */ (s)[1]], selectedStressesRandom: false, settType: /** @type {RegExpMatchArray} */ (s)[2] };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};
/** @param {any} node @param {string[]} acc @returns {string[]} */
const leaves = (node, acc = []) => {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node.type === 'function') return leaves(node.type(node.props), acc);
  return leaves(node.props?.children, acc);
};
/** @param {any} node @param {(n: any) => boolean} pred @param {any[]} acc @returns {any[]} */
const find = (node, pred, acc = []) => {
  if (node == null || typeof node !== 'object') return acc;
  if (Array.isArray(node)) { for (const n of node) find(n, pred, acc); return acc; }
  if (pred(node)) acc.push(node);
  if (typeof node.type === 'function') return find(node.type(node.props), pred, acc);
  return find(node.props?.children, pred, acc);
};
/** The bulleted items of a PDF column. @param {any} col @returns {string[]} */
const column = (col) => { const l = leaves(col); const items = []; for (let i = 0; i < l.length; i++) if (l[i] === '•' && l[i + 1] != null) items.push(l[++i]); return items; };

const SEEDS = ['r2r-thorp-44', 'r2s-famine-city-2', 'r2s-wartime-metropolis-1', 'r2r-town-52'];
/** @type {Record<string, any>} */ const TOWNS = {};

describe('a trade pill prints one word on the tab, the PDF and the journal (SURFACES-3 item 2, r3)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); for (const s of SEEDS) TOWNS[s] = birth(s); }, 120000);
  afterEach(cleanup);

  test.each(SEEDS)('%s: the tab\'s pills, the PDF\'s columns and the journal\'s rows print the same words', (seed) => {
    const town = TOWNS[seed];
    const trade = tradeListsAsPrinted({ ...town, economicState: town.economicState });
    const want = { exports: trade.exports.map((x) => tradePillWord(x, 'exports')), imports: trade.imports.map((x) => tradePillWord(x, 'imports')) };
    expect(want.exports.some((w) => w !== resourceDisplayName(w)), `${seed}: a town whose export the seam re-spells`).toBe(true);
    // the tab: every pill's first text is its word
    const { container } = render(<EconomicsTab settlement={town} narrativeNote={null} />);
    const pillWords = [...container.querySelectorAll('span')].map((sp) => sp.firstChild?.nodeType === 3 ? String(sp.firstChild.nodeValue) : null);
    for (const w of want.exports) expect(pillWords, `${seed}: the tab's export pill "${w}"`).toContain(w);
    // the PDF
    const cols = find(EconomicsTrade({ settlement: town, narrativeMode: false, vm: buildViewModel({ settlement: town }), stateProse: null }), (n) => n.type === ThreeCol)[0]?.props;
    expect(column(cols.a), `${seed}: the PDF's EXPORTS`).toEqual(want.exports);
    if (!trade.tradeStopped) expect(column(cols.b), `${seed}: the PDF's IMPORTS`).toEqual(want.imports);
    // the journal
    const md = String(buildJournalPages(buildViewModel({ settlement: town }), { settlement: town }).find((p) => p.name === 'Economics & Trade')?.markdown || '');
    const row = (/** @type {string} */ k) => (md.split('\n').find((l) => l.startsWith(`- **${k}:** `)) || '').slice(`- **${k}:** `.length).replace(/\\(.)/g, '$1').replace(/&amp;/g, '&');
    expect(row('Exports'), `${seed}: the journal's Exports`).toBe(want.exports.join(', '));
  });

  test('guard: an import keeps the seam (a raw resource key prints its label)', () => {
    expect(tradePillWord('river_fisheries', 'imports')).toBe(resourceDisplayName('river_fisheries'));
    expect(tradePillWord('river_fisheries', 'imports')).not.toBe('river_fisheries');
    expect(tradePillWord('River fish', 'exports')).toBe('River fish');
  });
});
