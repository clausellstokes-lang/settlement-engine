/** @vitest-environment jsdom */
/**
 * displayEconFlowsMagicFood.test.jsx — TAIL-DISPLAY-ECON batch 1 (the READ-ALL worklist DISPLAY-ECON; the chair's rulings
 * X2 and X3, 2026-11-14), births of the census's own seeds (r2r-/r2s-, the SECOND-WAVE-CENSUS dials):
 *   · X2: "Economic Flows (N active · M impaired)" counts what the cards under it show (B06680): an impaired card and a
 *     card that prints no state are not "active";
 *   · X3: a chain card's note that claims food made by magic prints only where the food record's own provision is more
 *     than none (`magicProvisionShown.js :: foodMagicShare`, the one reader), "fills the gap" only where no shortfall is
 *     left and "depleted farmland" only on farmland (twins: "eases the shortfall", "the depleted ground"); the Magic tab's
 *     chain notes are the card's own (`magicNoteShown`). (The reliance word and the dependence line beside a food provision,
 *     15124, are the one reliance reading's, `magicReliance.js`: named for its seat, not cured here.)
 * Each NOT pair is red at the batch's base (bcad1a358); each KEEP pair is green before and after.
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
import { foodMagicShare, MAGIC_FOOD_NOTES } from '../../src/domain/display/magicProvisionShown.js';
import { MAGIC_NOTE_TRADITION } from '../../src/domain/facts/magicSource.js';
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
 *  a line the same text prints on the same path (the twin or keep where the test claims one; else the slot's own header,
 *  or a sibling chain card's magic note)] */
const NOT = /** @type {const} */ ([
  ['r2r-thorp-0', 'economics', 'Economic Flows (1 active)', 'Economic Flows: its one card prints no state (a neighbour\'s house)', 'Economic Flows'],
  ['r2r-town-9', 'economics', 'Economic Flows (15 active · 2 impaired)', 'the count of the cards at work', 'Economic Flows'],
  ['r2r-metropolis-11', 'economics', 'Blessed stores; divine provision fills the gap', 'silent: the food record credits no provision', 'Arcane fabrication provides processed goods from alternative sources'],
  ['r2r-town-9', 'economics', 'Blessed stores; divine provision fills the gap', 'Blessed stores; divine provision eases the shortfall', 'Blessed stores; divine provision eases the shortfall'],
  ['r2s-famine-city-2', 'economics', 'Druidic cultivation supplements depleted farmland', 'Druidic cultivation supplements the depleted ground', 'Druidic cultivation supplements the depleted ground'],
  // BAR2-LABELS LB1 (2026-11-15): the reliance rested on this very note, which the card does not print (no provision): re-keyed to the reading the page now bears
  ['r2r-village-25', 'magic', 'Blessed stores; divine provision fills the gap', 'silent: the card\'s own note, none', 'Reliance on magic: None'],
]);
/** [seed, tab, the twin true in the state that made the old line false] (new or newly reached lines: red at the base by design) */
const TWIN = /** @type {const} */ ([
  ['r2r-town-9', 'economics', 'Blessed stores; divine provision eases the shortfall'],
  ['r2s-famine-city-2', 'economics', 'Druidic cultivation supplements the depleted ground'],
]);
/** [seed, tab, the true sibling that must still print] (green before and after) */
const KEEP = /** @type {const} */ ([
  ['r2r-metropolis-37', 'economics', 'Druidic cultivation supplements depleted farmland'],
  ['r2r-thorp-0', 'magic', 'Reliance on magic: None'],
  ['r2r-village-25', 'magic', 'Reliance on magic: None'], // BAR2-LABELS LB1 (2026-11-15): re-keyed, as above
]);

afterEach(cleanup);

describe('TAIL-DISPLAY-ECON batch 1: the flows header counts its cards; magic claims food only where the food record holds it', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the food notes are the step\'s food branch: eleven, every one a note of the step', () => {
    expect(MAGIC_FOOD_NOTES.size).toBe(11);
    for (const n of MAGIC_FOOD_NOTES) expect(Object.keys(MAGIC_NOTE_TRADITION), n).toContain(n);
  });

  test('the anchors: the food record\'s provision where each pair says', () => {
    expect(foodMagicShare(town('r2r-village-25')), 'no provision: the note leaves').toBe(0);
    expect(foodMagicShare(town('r2r-thorp-0')), 'no provision: "None" stands').toBe(0);
  }, 120000);

  test('each NOT row does not print its line; instead: what the row names (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(NOT, ([seed, tab, line, _instead, anchor]) => {
      try {
        expectAbsentWithAnchor(textOf(town(seed), tab), line, anchor, `${seed} (${tab})`);
      } finally { cleanup(); }
    }), 'every NOT row: the tab does not print the old line');
  }, 120000);

  test('each TWIN row prints the twin (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(TWIN, ([seed, tab, line]) => {
      try {
        expect(textOf(town(seed), tab), `${seed} (${tab}) prints the twin "${line}"`).toContain(line);
      } finally { cleanup(); }
    }), 'every TWIN row: the tab prints the twin');
  }, 120000);

  test('each KEEP row still prints its line (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([seed, tab, line]) => {
      try {
        expect(textOf(town(seed), tab), `${seed} (${tab}) still prints "${line}"`).toContain(line);
      } finally { cleanup(); }
    }), 'every KEEP row: the tab still prints the true sibling');
  }, 120000);

});
