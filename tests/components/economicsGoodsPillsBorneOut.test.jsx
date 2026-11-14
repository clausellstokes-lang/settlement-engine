/** @vitest-environment jsdom */
/**
 * economicsGoodsPillsBorneOut.test.jsx — W2-C-LEAVES-4 item 2 (the chair's ruling of 2026-11-13 on the goods pills:
 * the cut's #129 #196 #691 #1038 #1146 #1365 and the increment's seven). A pill prints only where the record bears it
 * out (`tradeListDisplay.js :: pillBorneOut`, the one reader of "Produced locally" and "Exports"): a made good where a
 * chain that makes it works here and the house its making needs stands; a service where a house offers it; a key
 * that is not a good never; a good an entrepôt carries through as a transit export, never as made here.
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
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** The app's own shape, as the readers born their towns (rww-: render.rww.jsx; rr2s-: render.rr2s.jsx). @param {string} seed */
const birthApp = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^(?:rww|rr2s)-(\w+)-([a-z_+]+)(?:-(rand|port|river|road|isolated|crossroads))?-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] && m[3] !== 'rand' ? { tradeRouteAccess: m[3] } : {};
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses,
    _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** The pills under a heading of the Trade Profile, as printed. @param {any} town @param {string} heading */
const pillsUnder = (town, heading) => {
  const { container, unmount } = render(<EconomicsTab settlement={town} narrativeNote={null} />);
  const head = [...container.querySelectorAll('div')].find((d) => d.textContent === heading);
  const pills = head ? [...(head.nextElementSibling?.children || [])].filter((e) => e.tagName === 'SPAN').map((e) => e.textContent || '') : [];
  unmount();
  return pills;
};
/** @param {any} town */
const roster = (town) => town.institutions.map((/** @type {any} */ i) => String(i.name));

afterEach(cleanup);

describe('the goods pills print only where the record bears them out (item 2)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('books by Glassmakers alone are not exported; the glass is; spices from distant lands pass through as transit (rww-city-famine-1)', () => {
    const town = birthApp('rww-city-famine-1');
    expect(town.economicState.primaryExports, 'anchored: the record exports both').toEqual(expect.arrayContaining(['Glassware', 'Books and manuscripts', 'Rare spices and exotic dyes']));
    expect(roster(town).some((n) => /print|scriptor|librar|bookbind/i.test(n)), 'anchored: no house makes books').toBe(false);
    const exports = pillsUnder(town, 'Exports');
    expect(exports).toContain('Glassware');
    expect(exports).not.toContain('Books and manuscripts');
    expect(exports).toContain('Rare spices and exotic dyes (transit)');
  }, 60000);

  test('no guild goods without a guild, no barrels by a thatcher, no cloth by a shepherd (rww-village-famine-1)', () => {
    const town = birthApp('rww-village-famine-1');
    expect(town.economicState.localProduction, 'anchored: the record lists them').toEqual(expect.arrayContaining(['Guild-manufactured goods', 'Barrels and containers', 'Fine wool cloth']));
    const local = pillsUnder(town, 'Produced locally');
    for (const good of ['Guild-manufactured goods', 'Barrels and containers', 'Fine wool cloth']) expect(local, good).not.toContain(good);
  }, 60000);

  test('a famine that failed the grain mills no flour and grows no grain (rww-metropolis-famine-1)', () => {
    const town = birthApp('rww-metropolis-famine-1');
    expect(town.economicState.foodSecurity.foodRecord.failedSource, 'anchored: the grain failed').toBe('grain');
    expect(town.economicState.primaryExports, 'anchored: the record exports flour').toContain('Milled flour');
    expect(pillsUnder(town, 'Exports')).not.toContain('Milled flour');
    const local = pillsUnder(town, 'Produced locally').map((p) => p.toLowerCase());
    expect(local).not.toContain('grain');
    expect(local).not.toContain('flour');
  }, 60000);

  test('a key that is not a good never prints as one (rr2s-hamlet-under_siege-rand-1, #196: "Date export")', () => {
    const town = birthApp('rr2s-hamlet-under_siege-rand-1');
    expect(town.economicState.localProduction, 'anchored').toContain('Date export');
    expect(pillsUnder(town, 'Produced locally')).not.toContain('Date export');
  }, 60000);

  test('guard: a made good whose house stands still prints (rww-town-slave_revolt-1: an Apothecary, a guild)', () => {
    const town = birthApp('rww-town-slave_revolt-1');
    const local = pillsUnder(town, 'Produced locally');
    expect(local).toContain('Herbal remedies');
    expect(local).toContain('Guild-manufactured goods');
  }, 60000);
});
