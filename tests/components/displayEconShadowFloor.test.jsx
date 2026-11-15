/** @vitest-environment jsdom */
/**
 * displayEconShadowFloor.test.jsx — TAIL-DISPLAY-ECON-5 (the chair's ruling X30, 2026-11-15; each vetoable by
 * the owner). Births of the census's own seeds.
 *
 * X30: THE SHADOW ECONOMY'S FIGURE. The Economics tab printed "Shadow Economy: N% capture" wherever the safety profile's
 * capture was 3 or more (476 of 720); the record adds its criminal income share only above 10, so 240 towns printed a
 * capture beside no illicit money (a besieged hamlet whose income is harvest alone: "4% capture"). The block now prints
 * through the leaf the PDF prints through (`shadowEconomyShown.js :: shadowCaptureShown`, the record's own floor), and
 * the row says what it counts ("of trade unrecorded": the income row counts a share of all the town's income).
 *
 * Each NOT pair and each TWIN is red at the batch's base (1322e7d0a); each KEEP is green before and after.
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';

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
import { shadowCaptureShown } from '../../src/domain/display/shadowEconomyShown.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

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

/** [seed, what must NOT print, what prints instead (null: the block is silent by design: the record holds no illicit money)] */
const NOT = /** @type {const} */ ([
  ['r2r-hamlet-0', /Shadow Economy:/, null], // a besieged hamlet, capture 4, income harvest alone
  ['r2r-thorp-8', /Shadow Economy:/, null], // capture 8, no criminal income, no criminal house
  ['r2r-metropolis-15', /Shadow Economy:/, null], // capture 10, the floor's edge: no criminal income on the record
  ['r2r-city-0', /Shadow Economy: \d+% capture/, /Shadow Economy: 16% of trade unrecorded/], // the row says what it counts
]);
/** [seed, what must still print] */
const KEEP = /** @type {const} */ ([
  ['r2r-city-0', 'Off-book'], // the block above the floor keeps its figure
]);

describe('TAIL-DISPLAY-ECON-5 (X30): the shadow economy prints where the record holds illicit money', () => {
  test('every NOT row: its seed does not print its line (every row runs; each failure names its seed and line)', () => {
    expectNoSeedFailures(collectSeedFailures(NOT, ([seed, gone, instead]) => {
      try {
        const text = textOf(town(seed));
        // the liveness anchor first: the row's new words, or (a silent block) the Economic Flows section beside it, in the same text
        if (instead === null) expect(text, 'the tab printed: its Economic Flows section stands').toContain('Economic Flows');
        else expect(text, `${seed}: ${instead} prints instead`).toMatch(instead);
        // anchored: the positive just above reads this same text (the row's new words, or the Economic Flows section)
        expect(text, `${seed}: ${gone} does not print`).not.toMatch(gone);
        if (instead === null) expectAbsentWithAnchor(text, 'Off-book', 'Economic Flows', 'the block is silent: no capture chip either');
      } finally { cleanup(); }
    }), 'every NOT row: the line does not print, and the block is silent or prints what it counts');
  }, 60000);
  test('every KEEP row: its seed still prints its line (every row runs; each failure names its seed and line)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([seed, kept]) => {
      try {
        expect(textOf(town(seed)), `${seed}: ${kept} still prints`).toContain(kept);
      } finally { cleanup(); }
    }), 'every KEEP row: the line still prints');
  }, 60000);
  test('ONE HOME: the leaf prints a capture exactly where the record holds a criminal income share', () => {
    const failures = collectSeedFailures(['r2r-hamlet-0', 'r2r-thorp-8', 'r2r-metropolis-15', 'r2r-city-0'], (seed) => {
      const eco = town(seed).economicState;
      const criminal = (eco.incomeSources || []).some((/** @type {any} */ x) => x.isCriminal);
      expect(shadowCaptureShown(eco.safetyProfile) != null, seed).toBe(criminal);
    });
    expectNoSeedFailures(failures, 'the leaf prints a capture exactly where the record holds a criminal income share');
  }, 60000);
});
