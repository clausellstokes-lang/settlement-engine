/** @vitest-environment jsdom */
/**
 * economicsFoodTradeUnderSiege.test.jsx — W2-C-LEAVES item 4(a), the siege half (2026-11-13; the cold list REVIEW-W2A-3
 * #995, HIGH: "Lagomagnum grows about a quarter of what it eats, and carts bring in a little of the rest." under a
 * siege that has cut every road in).
 *
 * The Food Security card read the viability metric's `importCoverage`, which kept a trickle the siege had cut; the
 * food record (`economicState.foodSecurity.foodRecord.normalImportPct`, the one food record) says no food comes in by
 * trade. The sentence, the "imported" figure, the bar's import run and the "Trade covers" note now read the record.
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
/** @param {any} town */
const foodCard = (town) => {
  const { container, unmount } = render(<EconomicsTab settlement={town} narrativeNote={null} />);
  const text = container.textContent || '';
  unmount();
  return text;
};

afterEach(cleanup);

describe('the food card says what trade brings by the food record (item 4(a), the siege)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the cold list\'s besieged towns: no carts bring food in, and no import figure is printed', () => {
    expectNoSeedFailures(collectSeedFailures(['rw3-town-under_siege-1', 'rw3-town-under_siege+famine-1'], (seed) => {
      const town = birthApp(seed);
      expect(town.economicState.foodSecurity.foodRecord.normalImportPct, `anchored: ${seed}'s record brings no food in`).toBe(0);
      expect(town.economicViability.metrics.foodBalance.importCoverage, `anchored: ${seed}'s metric keeps a trickle`).toBeGreaterThan(0);
      const text = foodCard(town);
      expect(text, `anchored: ${seed} prints its food sentence`).toContain(`No food comes into ${town.name} by trade.`);
      expect([/\b(?:carts|ships|boats|trade) brings? in /.test(text), /\+ [\d,]+ imported/.test(text), /Trade covers/.test(text)]).toEqual([false, false, false]); // re-keyed by identity at W2-C-LEAVES-5: any carrier bringing food in (item 3 re-cut the share words)
    }), 'a besieged town says food comes in by trade');
  }, 120000);

  test('a town the record says trades for food still says so (rw3-city-famine-1)', () => {
    const town = birthApp('rw3-city-famine-1');
    expect(Number(town.economicState.foodSecurity.foodRecord.normalImportPct)).toBeGreaterThan(0);
    const text = foodCard(town);
    expect(/\b(?:carts|ships|boats|trade) brings? in /.test(text) && /\+ [\d,]+ imported/.test(text)).toBe(true); // re-keyed by identity at W2-C-LEAVES-5 (item 3 re-cut the share words)
  }, 60000);
});
