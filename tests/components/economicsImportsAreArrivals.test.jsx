/** @vitest-environment jsdom */
/**
 * economicsImportsAreArrivals.test.jsx — W2-C-LEAVES item 4(b) (2026-11-13; REVIEW-W2A-3 R2; the census's row P6need,
 * "an import printed beside its own unmet need", 642 of 720 at the base).
 *
 * The Economics tab composed its Imports line inline from the trade imports AND the terrain's need list, so "Clay"
 * printed as arriving beside "No clay reaches the potter.". The tab now reads the leaf (`tradeListDisplay.js ::
 * importsAsPrinted`): the Imports pills are what trade brings; a need no import meets, under any name, prints apart
 * as "Needed, and not brought in: …".
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
import { configOf } from './pageCensusWalk.shared.mjs';
import { importsAsPrinted } from '../../src/domain/display/tradeListDisplay.js';
import { resourceDisplayName } from '../../src/domain/display/resourceDisplayName.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

/** The census's shape. @param {string} seed */
const birthCensus = (seed) => {
  const parts = seed.split('-');
  const size = parts.at(-2); const crisis = seed.startsWith('r2s-') ? parts.slice(1, -2).join('-') : null;
  return generateSettlementPipeline(configOf({ size, crisis }, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
};
/** The Imports pills and the needs line, as printed. @param {any} town */
const tradeColumn = (town) => {
  const { container, unmount } = render(<EconomicsTab settlement={town} narrativeNote={null} />);
  const header = [...container.querySelectorAll('div')].find((d) => d.textContent === 'Imports');
  const pills = header ? [...(header.nextElementSibling?.querySelectorAll('span') || [])].map((x) => (x.textContent || '').trim()).filter(Boolean) : [];
  const needs = container.querySelector('[data-testid="economics-needs-not-met"]')?.textContent || '';
  unmount();
  return { found: Boolean(header), pills, needs };
};

afterEach(cleanup);

describe('the Imports line prints what trade brings; a need prints as a need (item 4(b))', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('r2r-city-2 (the review\'s town): clay is a need, not an import', () => {
    const town = birthCensus('r2r-city-2');
    expect(importsAsPrinted(town).needed, 'anchored: clay is a need no trade meets').toContain('clay');
    const { found, pills, needs } = tradeColumn(town);
    expect(found, 'anchored: the Imports column is printed').toBe(true);
    expect(pills.filter((p) => /^clay$/i.test(p))).toEqual([]);
    expect(needs).toMatch(/^Needed, and not brought in: .*\bclay\b.*\.$/);
  }, 60000);

  test('the grid\'s towns: no pill is a need, every need is said, and a need met under another name is not', () => {
    const seeds = ['r2r-city-0', 'r2r-town-17', 'r2r-metropolis-11', 'r2s-under_siege-town-1', 'r2r-village-6', 'r2r-hamlet-31'];
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      const town = birthCensus(seed);
      const { needed } = importsAsPrinted(town);
      const { pills, needs } = tradeColumn(town);
      const shown = needed.map((n) => (resourceDisplayName(n) || n).toLowerCase());
      expect(pills.filter((p) => shown.includes(p.toLowerCase())), `${seed}: a need printed as an import`).toEqual([]);
      expect(shown.filter((n) => !needs.toLowerCase().includes(n)), `${seed}: a need not said`).toEqual([]);
    }), 'the Imports line and the needs disagree');
    // r2r-city-0 brings in luxury textiles: its luxury-goods need is met and is not said
    expect(tradeColumn(birthCensus('r2r-city-0')).needs.includes('luxury goods')).toBe(false);
  }, 240000);
});
