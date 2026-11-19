/** @vitest-environment jsdom */
/**
 * displayEconShortWords.test.jsx — TAIL-DISPLAY-ECON-5 (the chair's ruling X31, 2026-11-15; each vetoable by
 * the owner). Births of the census's own seeds.
 *
 * X31: "A few households still go short, and a bad season would leave more of them hungry." printed beside the food
 * record's band Secure (177 of the 183 towns that printed it). The words read the record's band: Secure takes its twin.
 *
 * Each NOT pair and each TWIN is red at the batch's base (1322e7d0a); each KEEP is green before and after.
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

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
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's own birth (CENSUS-3 seedcfg.mjs, its r2r-/r2s- arms). @param {string} seed */
const birth = (seed) => {
  const calm = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  const crisis = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [/** @type {RegExpMatchArray} */ (crisis)[1]], selectedStressesRandom: false, settType: /** @type {RegExpMatchArray} */ (crisis)[2] };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
};
/** @type {Map<string, any>} */ const towns = new Map();
const town = (/** @type {string} */ seed) => { if (!towns.has(seed)) towns.set(seed, birth(seed)); return towns.get(seed); };
/** The tab with every folded section opened (the census's walk). @param {any} t @returns {string} */
const textOf = (t) => {
  const view = render(<EconomicsTab settlement={t} narrativeNote={null} />);
  for (let pass = 0; pass < 4; pass++) {
    const shut = [...view.container.querySelectorAll('button[aria-expanded="false"]')];
    if (shut.length === 0) break;
    shut.forEach((b) => fireEvent.click(b));
  }
  const out = view.container.textContent || '';
  view.unmount();
  return out;
};
beforeAll(async () => { await loadGenerationLawPayloads(); }, 60000);
afterEach(cleanup);

const GO_SHORT = 'A few households still go short, and a bad season would leave more of them hungry.';
const SECURE_TWIN = 'Between them, nearly every household is fed, and a bad season would leave some of them short.';

/** [seed, what must NOT print, what prints instead] */
const NOT = /** @type {const} */ ([
  ['r2r-thorp-4', GO_SHORT, SECURE_TWIN], // band Secure, gap 2%
  ['r2r-village-17', GO_SHORT, SECURE_TWIN], // band Secure, gap 0%
  ['r2r-village-5', GO_SHORT, SECURE_TWIN], // band Secure, gap 0%, a port
]);
/** [seed, what must still print] */
const KEEP = /** @type {const} */ ([
  ['r2r-thorp-48', GO_SHORT], // band Pressured (the record's gap above 5): a few do go short
  ['r2r-thorp-7', 'Some households still go short, and a bad season would leave more of them hungry.'], // band Pressured
]);

describe('TAIL-DISPLAY-ECON-5 (X31): the short words read the food record\'s band', () => {
  test('every NOT row: its seed does not print its line (every row runs; each failure names its seed and line)', () => {
    expectNoSeedFailures(collectSeedFailures(NOT, ([seed, gone, instead]) => {
      try {
        const text = textOf(town(seed));
        expectAbsentWithAnchor(text, gone, instead, `${seed}: band Secure takes its twin`);
      } finally { cleanup(); }
    }), 'every NOT row: the go-short words do not print beside band Secure, and the twin prints');
  }, 60000);
  test('every KEEP row: its seed still prints its line (every row runs; each failure names its seed and line)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([seed, kept]) => {
      try {
        expect(textOf(town(seed)), `${seed}: ${kept} still prints`).toContain(kept);
      } finally { cleanup(); }
    }), 'every KEEP row: the line still prints');
  }, 60000);
});
