/** @vitest-environment jsdom */
/**
 * abundantUnderSiegeEverySurface.test.jsx — SURFACES-3 item 2 (the chair's ruling (r4) of 2026-11-14: THE PDF PRINTS THE
 * GROUPS THE TAB PRINTS, THROUGH THE TAB'S READER). Under a siege in force the Resources tab does not call the grounds
 * around the walls "Abundant" (W2-C-LEAVES-SIDE, the cut's #937): they print first, unlabelled, under the section's own
 * title (`chainStateShown.js :: tradeStoppedHere`). The PDF's NEARBY RESOURCES printed "Abundant" in 56 of the 56 siege
 * towns of the 772 births. Towns: a siege thorp (the smallest), a siege metropolis (the largest), a siege hamlet of the
 * calm arm (r2r-hamlet-0); the guard: a calm thorp keeps its "Abundant" group on both surfaces.
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

import ResourcesTab from '../../src/components/new/tabs/ResourcesTab.jsx';
import { ResourcesProduction } from '../../src/pdf/sections/ResourcesProduction.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { tradeStoppedHere } from '../../src/domain/display/chainStateShown.js';
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
/** Whether the PDF's chapter prints the "Abundant" group. @param {any} town */
const pdfAbundant = (town) => leaves(ResourcesProduction({ settlement: town, narrativeMode: false, vm: buildViewModel({ settlement: town }), stateProse: null })).includes('Abundant');
/** Whether the tab prints the "Abundant" group. @param {any} town */
const tabAbundant = (town) => {
  const { container, unmount } = render(<ResourcesTab settlement={town} />);
  const has = [...container.querySelectorAll('div')].some((d) => d.childNodes.length === 1 && d.textContent === 'Abundant');
  unmount();
  return has;
};

const SIEGES = ['r2s-under_siege-thorp-0', 'r2s-under_siege-metropolis-0', 'r2r-hamlet-0'];
const GUARD = 'r2r-thorp-0';
/** @type {Record<string, any>} */ const TOWNS = {};

describe('the PDF prints the nearby-resource groups the tab prints (SURFACES-3 item 2, r4)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); for (const s of [...SIEGES, GUARD]) TOWNS[s] = birth(s); }, 120000);
  afterEach(cleanup);

  test.each(SIEGES)('%s: under a siege neither the tab nor the PDF calls the grounds "Abundant"', (seed) => {
    expect(tradeStoppedHere(TOWNS[seed]), `${seed} is under a siege in force`).toBe(true);
    expect(tabAbundant(TOWNS[seed]), `${seed}: the tab`).toBe(false);
    expect(pdfAbundant(TOWNS[seed]), `${seed}: the PDF`).toBe(false);
  });

  test('guard: a calm town keeps its "Abundant" group on the tab and the PDF', () => {
    expect(tradeStoppedHere(TOWNS[GUARD])).toBe(false);
    expect(tabAbundant(TOWNS[GUARD])).toBe(true);
    expect(pdfAbundant(TOWNS[GUARD])).toBe(true);
  });
});
