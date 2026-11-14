/** @vitest-environment jsdom */
/**
 * economicsShowsNoMachinery.test.jsx — W2-C-LEAVES item 4(c), the widest medium class of the cold list REVIEW-W2A-3 in
 * EconomicsTab.jsx (fifteen lines in twenty towns: "Agriculture modifier: 55%", "Stress penalty: ×0.35", "Trade covers
 * 62% of gap"): the food model's machinery printed on the page, against the owner's law that the page shows ratings and
 * never the machinery. The row is gone; the stat line keeps the figures and the sentence says the shares in words.
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
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

/** The app's own shape, as the reader REVIEW-W2A-3 born its towns. @param {string} seed */
const birthApp = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rw3-(\w+)-([a-z_+]+)-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses,
    _randomizePriorities: true }), null, { seed, customContent: {} });
};
const MACHINERY = /Agriculture modifier|Stress penalty|Trade covers \d+% of gap/;

afterEach(cleanup);

describe('the food card shows no machinery (item 4(c))', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the cold list\'s towns that printed it', () => {
    const seeds = ['rw3-thorp-famine-1', 'rw3-metropolis-under_siege-1', 'rw3-city-infiltrated-1', 'rw3-village-calm-1', 'rw3-town-occupied-1'];
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      const town = birthApp(seed);
      expect(town.economicViability.metrics.foodBalance.agricultureModifier, `anchored: ${seed} carries the modifier`).toBeGreaterThan(0);
      const { container, unmount } = render(<EconomicsTab settlement={town} narrativeNote={null} />);
      const text = container.textContent || '';
      unmount();
      expect(text, `anchored: ${seed} prints its food stat line`).toMatch(/Need: [\d,]+ lbs\/day/);
      expect(text.match(MACHINERY)).toBeNull();
    }), 'the food card prints its machinery');
  }, 180000);
});
