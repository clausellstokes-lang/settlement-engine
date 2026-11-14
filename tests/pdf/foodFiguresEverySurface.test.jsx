/** @vitest-environment jsdom */
/**
 * foodFiguresEverySurface.test.jsx — SURFACES-3 item 1 (the chair's law of 2026-11-14, ONE READER FOR ONE FACT ON EVERY
 * SURFACE): THE FOOD FIGURES THE TAB PRINTS ARE THE FIGURES THE PDF PRINTS.
 *
 * The Economics tab's Food Security row prints the food record through `foodRowShown(s, !!carriersOf(s, eco))`. The PDF's
 * FOOD SECURITY block printed the viability view's figures instead: a DEFICIT that is not the tab's Short (253 of the 772
 * births of SURFACES-1's table: r2r-thorp-32 2 against 1), a provision the tab does not print (92), and "imports cover N%
 * of gap" under a siege whose row brings nothing in (7). `carriersOf` moved whole to `domain/display/foodCarrier.js` and
 * the block is fed `foodBlockShown` (the tab's row).
 * Towns: a war (r2r-thorp-32), a famine thorp (the smallest), a siege city whose PDF said imports cover a gap the tab's
 * row says nothing fills, a siege metropolis (the largest) whose PDF credited a provision the tab does not, an occupied
 * town, and the guard town (r2r-town-44: imports and a provision on both surfaces, and they stay).
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
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
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
/** Every text leaf under a react(-pdf) tree, function components executed. @param {any} node @param {string[]} acc @returns {string[]} */
const leaves = (node, acc = []) => {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node.type === 'function') return leaves(node.type(node.props), acc);
  return leaves(node.props?.children, acc);
};
/** @param {string} t @param {RegExp} re @returns {number | null} */
const fig = (t, re) => { const m = t.match(re); return m ? Number(m[1].replace(/,/g, '')) : null; };
/** The tab's Food Security row and its figures. @param {any} town */
const tabRow = (town) => {
  const { container, unmount } = render(<EconomicsTab settlement={town} narrativeNote={null} />);
  const t = [...container.querySelectorAll('div')].map((d) => d.textContent || '').find((x) => /^Production: [\d,]+ lbs\/day/.test(x) && x.length < 200) || '';
  unmount();
  return { t, production: fig(t, /^Production: ([\d,]+) lbs/), imported: fig(t, /\+ ([\d,]+) imported/), provision: fig(t, /\+ ([\d,]+) by \w+ provision/),
    need: fig(t, /Need: ([\d,]+) lbs/), short: fig(t, /Short: ([\d,]+) lbs/) };
};
/** The PDF's FOOD SECURITY block, its leaves joined by "|". @param {any} town */
const pdfBlock = (town) => {
  const lv = leaves(EconomicsTrade({ settlement: town, narrativeMode: false, vm: buildViewModel({ settlement: town }), stateProse: null }));
  const k = lv.indexOf('FOOD SECURITY');
  const end = lv.findIndex((x, i) => i > k && /^ECONOMIC FLOWS/.test(x));
  const b = k < 0 ? '' : lv.slice(k + 1, end > k ? end : k + 30).join('|');
  return { b, production: fig(b, /PRODUCED\|(\d+)/), need: fig(b, /NEEDED\|(\d+)/), deficit: fig(b, /DEFICIT\|(\d+)/), cover: fig(b, /imports cover \|(\d+)\|/),
    provision: fig(b, /provision covers \|(\d+)/) };
};

const SEEDS = ['r2r-thorp-32', 'r2s-famine-thorp-0', 'r2s-under_siege-city-2', 'r2s-under_siege-metropolis-0', 'r2s-occupied-town-0', 'r2r-town-44'];
/** @type {Record<string, any>} */ const TOWNS = {};

describe('the food figures are one fact on the tab and the PDF (SURFACES-3 item 1)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); for (const s of SEEDS) TOWNS[s] = birth(s); }, 120000);
  afterEach(cleanup);

  test.each(SEEDS)('%s: the PDF block prints the tab row\'s production, need, Short, provision, and an import cover only where the row imports', (seed) => {
    const town = TOWNS[seed]; const tab = tabRow(town); const pdf = pdfBlock(town);
    expect(tab.t, `${seed}: the tab prints its row`).not.toBe('');
    expect(pdf.b, `${seed}: the PDF prints its block`).not.toBe('');
    expect({ production: pdf.production, need: pdf.need, deficit: pdf.deficit, provision: pdf.provision }, `${seed}: PDF ${pdf.b} / tab ${tab.t}`)
      .toEqual({ production: tab.production, need: tab.need, deficit: tab.short, provision: tab.provision });
    if (pdf.cover != null) expect(tab.imported, `${seed}: the PDF's import cover where the tab's row brings nothing in`).toBeGreaterThan(0);
  });

  test('the guard town keeps its import cover and its provision on the PDF', () => {
    const pdf = pdfBlock(TOWNS['r2r-town-44']);
    expect(pdf.cover).toBeGreaterThan(0);
    expect(pdf.provision).toBeGreaterThan(0);
  });
});
