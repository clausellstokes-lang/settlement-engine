/** @vitest-environment jsdom */
/**
 * economicsFoodFamineWords.test.jsx — W2-C-LEAVES item 4(a), the famine half (2026-11-13; the cold list REVIEW-W2A-3
 * #161, HIGH: "Many households go short, and a bad season would bring real hunger." under a famine in force, beside a
 * Crisis tab saying "the children are visibly hungry").
 *
 * The Food Security sentence's shortage words looked to a bad season AHEAD in every town. Where a famine is in force
 * (`facts/famine.js :: famineOf`, the famine's one home) the bad season is here: the words say "hunger is already here",
 * the clause the sentence already used for the worst share. Elsewhere the words are unchanged.
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
import { famineOf } from '../../src/domain/facts/famine.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

/** The app's own shape, as the reader REVIEW-W2A-3 born its towns. @param {string} seed */
const birthApp = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^rw3-(\w+)-([a-z_+]+)-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses,
    _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** @param {any} town */
const tabText = (town) => {
  const { container, unmount } = render(<EconomicsTab settlement={town} narrativeNote={null} />);
  const text = container.textContent || '';
  unmount();
  return text;
};
const AHEAD = /a bad season would (?:bring real hunger|leave more of them hungry)/;
const HERE = /households (?:still )?go short, and hunger is already here\./;

afterEach(cleanup);

describe('under a famine in force the hunger is here, not ahead (item 4(a), the famine)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the cold list\'s famine towns (the app\'s shape)', () => {
    expectNoSeedFailures(collectSeedFailures(['rw3-thorp-famine-1', 'rw3-village-famine-1', 'rw3-city-famine-1'], (seed) => {
      const town = birthApp(seed);
      expect(famineOf(town).famine, `anchored: ${seed} is in famine by the famine home`).toBe(true);
      const text = tabText(town);
      expect([AHEAD.test(text), HERE.test(text)]).toEqual([false, true]);
    }), 'a famine town is told a bad season is ahead');
  }, 120000);

  test('a short town with no famine keeps the season ahead (r2r-thorp-32)', () => {
    const town = generateSettlementPipeline(configOf({ size: 'thorp', crisis: null }, DEFAULT_CONFIG, birthConfig), null, { seed: 'r2r-thorp-32', customContent: {} });
    expect(famineOf(town).famine).toBe(false);
    expect(AHEAD.test(tabText(town))).toBe(true);
  }, 60000);
});
