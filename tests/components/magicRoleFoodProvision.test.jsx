/** @vitest-environment jsdom */
/**
 * magicRoleFoodProvision.test.jsx — TAIL-DISPLAY-ECON-5 (the chair's ruling X32, 2026-11-15; each vetoable by
 * the owner). Births of the census's own seeds.
 *
 * X32: THE MAGIC WORDS AGAINST THE FOOD RECORD. "Economic role: occasional" printed under "Reliance on magic: Relied
 * upon" in 63 towns whose food record has magic making part of each day's food (`magicReliance.js :: foodMagicShare`).
 * The row reads the same leaf the reliance line reads (`magicProvisionShown.js :: economicRoleBandShown`): a provision
 * made every day prints the ladder's smallest word true of it, "common".
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

import MagicTab from '../../src/components/new/tabs/MagicTab.jsx';
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
  const view = render(<MagicTab settlement={t} />);
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

/** [seed, what must NOT print, what prints instead] */
const NOT = /** @type {const} */ ([
  ['r2r-thorp-54', 'Economic role: occasional', 'Economic role: common'], // a quarter of the food by magic (26%)
  ['r2r-thorp-34', 'Economic role: occasional', 'Economic role: common'], // a trace, but daily (2%)
  ['r2r-town-9', 'Economic role: occasional', 'Economic role: common'], // the provision beside a chain that needs magic
]);
/** [seed, what must still print] */
const KEEP = /** @type {const} */ ([
  ['r2r-thorp-0', 'Economic role: occasional'], // no provision by magic on the food record
  ['r2r-town-45', 'Economic role: common'], // the profile's own band, already common
  ['r2r-town-1', 'Economic role: integral'], // integral stays integral
]);

describe('TAIL-DISPLAY-ECON-5 (X32): the economic role reads the food record\'s provision', () => {
  test('every NOT row: the occasional role does not print (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(NOT, ([seed, gone, instead]) => {
      try {
        const text = textOf(town(seed));
        expectAbsentWithAnchor(text, gone, instead, `${seed}: the economic role reads the food record's provision`);
      } finally { cleanup(); }
    }), 'X32: no NOT row prints its gone economic role, and each prints its band instead');
  }, 60000);
  test('every KEEP row: the role still prints (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([seed, kept]) => {
      try {
        expect(textOf(town(seed)), `${seed}: ${kept} still prints`).toContain(kept);
      } finally { cleanup(); }
    }), 'X32: every KEEP row still prints its economic role');
  }, 60000);
});
