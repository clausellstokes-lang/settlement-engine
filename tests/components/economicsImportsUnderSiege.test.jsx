/** @vitest-environment jsdom */
/**
 * economicsImportsUnderSiege.test.jsx — W2-C-LEAVES-3, #169 (the chair's round three, FIRST; REVIEW-R2-STAGES' cold
 * list, HIGH): the Economics tab's Imports row of rr2s-hamlet-under_siege-rand-1 listed "Grain · Incense and votive
 * candles · Iron (weapons) · …" as brought in by trade under a siege that has cut every road in, beside "No food
 * comes into Uaxacmul by trade" on the same tab.
 *
 * The row reads the crisis home (`chainStateShown.js :: tradeStoppedHere`: the siege's own record line, "Field work and
 * trade have stopped", the reading the chain cards already make): under it no good prints as an import, and the
 * Imports row is LEFT OUT beside the page's own siege note (the chair, 20:34 UTC). The needs line stands; a calm town keeps its imports.
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
import { importsAsPrinted } from '../../src/domain/display/tradeListDisplay.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** The app's own shape, as the reader REVIEW-R2-STAGES born its towns (render.rr2s.jsx :: cfgFor). @param {string} seed */
const birthApp = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rr2s-(\w+)-([a-z_+]+)-([a-z_]+)-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false,
    selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** The Imports column, as printed: its pills and its words. @param {any} town */
const importsColumn = (town) => {
  const { container, unmount } = render(<EconomicsTab settlement={town} narrativeNote={null} />);
  const head = [...container.querySelectorAll('div')].find((d) => d.textContent === 'Imports');
  const body = /** @type {HTMLElement | null} */ (head?.nextElementSibling || null);
  const exportsHead = [...container.querySelectorAll('div')].some((d) => d.textContent === 'Exports');
  const out = { header: !!head, exportsHead, pills: body ? [...body.querySelectorAll('span')].map((x) => x.textContent || '') : [], text: body?.textContent || '' };
  unmount();
  return out;
};

afterEach(cleanup);

describe('under a siege that stops trade, nothing is listed as brought in by trade (#169)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the reader\'s hamlet under siege: the Imports row is left out (rr2s-hamlet-under_siege-rand-1)', () => {
    const town = birthApp('rr2s-hamlet-under_siege-rand-1');
    expect(importsAsPrinted(town).arriving, 'anchored: the record lists imports').toEqual(expect.arrayContaining(['Grain', 'Salt']));
    const col = importsColumn(town);
    expect(col.exportsHead, 'anchored: the Trade Profile prints').toBe(true);
    expect(col.header, 'the Imports row is left out under the siege (the chair, 20:34 UTC)').toBe(false);
  }, 60000);

  test('the reader\'s city under siege and famine: the same (rr2s-city-under_siege+famine-rand-1)', () => {
    const town = birthApp('rr2s-city-under_siege+famine-rand-1');
    const col = importsColumn(town);
    expect(col.exportsHead, 'anchored: the Trade Profile prints').toBe(true);
    expect(col.header).toBe(false);
  }, 60000);

  test('a calm town keeps its imports (rr2s-town-calm-rand-1)', () => {
    const town = birthApp('rr2s-town-calm-rand-1');
    const arriving = importsAsPrinted(town).arriving;
    expect(arriving.length, 'anchored').toBeGreaterThan(0);
    const col = importsColumn(town);
    expect(col.header).toBe(true);
    expect(col.pills.length).toBeGreaterThanOrEqual(arriving.length);
  }, 60000);
});
