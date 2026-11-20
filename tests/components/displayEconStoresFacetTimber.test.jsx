/** @vitest-environment jsdom */
/**
 * displayEconStoresFacetTimber.test.jsx — TAIL-DISPLAY-ECON-3 batch 3 (the READ-ALL worklist DISPLAY-ECON; the chair's
 * rulings X21 and X22, 2026-11-15), births of the census's own seeds (r2r-/r2s-, the SECOND-WAVE-CENSUS dials):
 *   · X21 (K7, row 18671's kin on the Economics tab): the tab's stores sentence takes the town's crisis, as the Tonight
 *     sheet's call does (`tonightSheet.js :: foodStoresWords(record, crisis)`): ONE HOME, one sentence on both surfaces;
 *   · 11782: the Magic tab's posture facet prints a stored key as words ("guild_controlled" -> "guild controlled");
 *   · 23037: the timber branch's druid note claims no "sustainable yield" on a ground the record holds depleted.
 * Each NOT pair is red at the batch's base (e1cd689e6); each KEEP pair is green before and after.
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
import MagicTab from '../../src/components/new/tabs/MagicTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { foodStoresWords } from '../../src/domain/summary/tonightSheet.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
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
/** @param {any} t @param {'economics'|'magic'} tab @returns {string} */
const textOf = (t, tab) => {
  const { container, unmount } = render(tab === 'economics' ? <EconomicsTab settlement={t} narrativeNote={null} /> : <MagicTab settlement={t} />);
  const out = container.textContent || '';
  unmount();
  return out;
};

/** [seed, tab, the line that must NOT print, what prints instead (or the slot's silence by design), the liveness anchor:
 *  the twin the test claims for the same town, else the row's own instead] */
const NOT = /** @type {const} */ ([
  ['r2r-metropolis-14', 'economics', 'Stores: a granary, about 15 months of grain.', 'Stores: a granary, about 15 months of grain, and the siege is eating into them.', 'Stores: a granary, about 15 months of grain, and the siege is eating into them.'],
  ['r2s-under_siege-town-0', 'economics', 'Stores: a granary, about seven months of grain.', 'Stores: a granary, about seven months of grain, and the siege is eating into them.', 'Stores: a granary, about seven months of grain, and the siege is eating into them.'],
  ['r2s-famine-town-3', 'economics', 'Stores: a granary, about three months of grain.', 'Stores: a granary, about three months of grain, and the famine is eating into them.', 'Stores: a granary, about three months of grain, and the famine is eating into them.'],
  ['r2r-town-1', 'magic', 'guild_controlled', 'Institutional control: guild controlled', 'guild controlled'],
  ['r2r-city-57', 'magic', 'Timber & Lumber: Druidic forest management accelerates regrowth and sustainable yield', 'Timber & Lumber: Druidic forest management speeds the regrowth of the cleared woodland', 'Druidic forest management speeds the regrowth of the cleared woodland'],
  ['r2s-under_siege-metropolis-2', 'magic', 'Reed & Marsh Harvest: Druidic forest management accelerates regrowth and sustainable yield', 'Reed & Marsh Harvest: Druidic tending speeds the regrowth of the depleted ground', 'Druidic tending speeds the regrowth of the depleted ground'],
]);
/** [seed, tab, the twin true in the state that made the old line false] (new or newly reached lines: red at the base by design) */
const TWIN = /** @type {const} */ ([
  ['r2r-metropolis-14', 'economics', 'Stores: a granary, about 15 months of grain, and the siege is eating into them.'],
  ['r2s-famine-town-3', 'economics', 'Stores: a granary, about three months of grain, and the famine is eating into them.'],
  ['r2r-town-1', 'magic', 'guild controlled'],
  ['r2r-city-57', 'magic', 'Druidic forest management speeds the regrowth of the cleared woodland'],
  ['r2s-under_siege-metropolis-2', 'magic', 'Druidic tending speeds the regrowth of the depleted ground'],
]);
/** [seed, tab, the true sibling that must still print] (green before and after) */
const KEEP = /** @type {const} */ ([
  ['r2r-town-6', 'economics', 'Stores: a granary, about seven months of grain.'],
  ['r2r-town-1', 'magic', 'Institutional control'],
  ['r2s-under_siege-metropolis-3', 'magic', 'Bowyer & fletcher: Druidic forest management accelerates regrowth and sustainable yield'],
]);

afterEach(cleanup);

describe('TAIL-DISPLAY-ECON-3 batch 3: the stores sentence takes the crisis; a facet key prints as words; the timber note on a depleted ground', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('one home: the tab prints the Tonight sheet\'s own stores sentence, crisis and all', () => {
    const failures = collectSeedFailures(['r2r-metropolis-14', 'r2s-famine-town-3', 'r2r-town-6'], (seed) => {
      const t = town(seed);
      const tonight = foodStoresWords(t.economicState.foodSecurity.foodRecord, factsOf(t).crisis);
      expect(tonight, seed).toMatch(/^Stores: /);
      expect(textOf(t, 'economics'), seed).toContain(tonight);
    });
    expectNoSeedFailures(failures, 'the tab prints the Tonight sheet\'s own stores sentence');
  }, 120000);

  test('every NOT row: its seed\'s tab does not print the line (every row runs; each failure names its seed, tab, line and what prints instead)', () => {
    expectNoSeedFailures(collectSeedFailures(NOT, ([seed, tab, line, instead, anchor]) => {
      try {
        expectAbsentWithAnchor(textOf(town(seed), tab), line, anchor, `${seed} (${tab}) does not print "${line}"; instead: ${instead}`);
      } finally { cleanup(); }
    }), 'every NOT row: the false line does not print');
  }, 120000);

  test('every TWIN row: its seed\'s tab prints the twin (every row runs; each failure names its seed, tab and twin)', () => {
    expectNoSeedFailures(collectSeedFailures(TWIN, ([seed, tab, line]) => {
      try {
        expect(textOf(town(seed), tab), `${seed} (${tab}) prints the twin "${line}"`).toContain(line);
      } finally { cleanup(); }
    }), 'every TWIN row: the twin prints');
  }, 120000);

  test('every KEEP row: its seed\'s tab still prints the line (every row runs; each failure names its seed, tab and line)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([seed, tab, line]) => {
      try {
        expect(textOf(town(seed), tab), `${seed} (${tab}) still prints "${line}"`).toContain(line);
      } finally { cleanup(); }
    }), 'every KEEP row: the true sibling still prints');
  }, 120000);
});
