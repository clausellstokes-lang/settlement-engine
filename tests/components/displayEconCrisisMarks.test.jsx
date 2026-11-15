/** @vitest-environment jsdom */
/**
 * displayEconCrisisMarks.test.jsx — TAIL-DISPLAY-ECON-4 batch 4 (the chair's ruling X25.1, 2026-11-15; vetoable by the
 * owner): ONE VOICE. The Economics tab's income rows and flow cards call the crisis leaf
 * (`domain/display/crisisStoppedRow.js :: rowStoppedBy`, through `domain/display/economicsCrisisMarks.js`) and print its
 * mark in the Services tab's form (the mark, then the description of ordinary times), as the Foundry journal already
 * does; the tab says once at its head that its descriptions are of ordinary times. Births of the census's own seeds.
 * Each NOT pair and each TWIN is red at the batch's base (fcab8b63d: the tab printed no mark); each KEEP is green before
 * and after.
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
import { rowStoppedBy } from '../../src/domain/display/crisisStoppedRow.js';
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
/** The tab with every folded section opened (the census's walk). @param {any} t */
const page = (t) => {
  const view = render(<EconomicsTab settlement={t} narrativeNote={null} />);
  for (let pass = 0; pass < 4; pass++) {
    const shut = [...view.container.querySelectorAll('button[aria-expanded="false"]')];
    if (shut.length === 0) break;
    shut.forEach((b) => fireEvent.click(b));
  }
  return view;
};
/** @param {any} t @returns {string} */
const textOf = (t) => { const v = page(t); const out = v.container.textContent || ''; v.unmount(); return out; };

/** [seed, the unmarked line that must NOT print, what prints instead] */
const NOT = /** @type {const} */ ([
  ['r2r-town-37', 'Port Duties Import and export taxes', 'Port Duties Curtailed by the outbreak. Import and export taxes'],
  ['r2r-town-37', 'Market Taxes Market day stall fees', 'Market Taxes Curtailed by the outbreak. Market day stall fees'],
  ['r2s-famine-hamlet-0', 'Fish & Maritime Produce Catch landed', 'Fish & Maritime Produce Scarce in the famine. Catch landed'],
  ['r2s-under_siege-town-1', 'Pilgrim Trade Offerings, hospitality fees', 'Pilgrim Trade Stopped by the siege. Offerings, hospitality fees'],
  ['r2s-plague_onset-thorp-2', 'Toll Revenue Tolls taken on the roads', 'Toll Revenue Curtailed by the outbreak. Tolls taken on the roads'],
]);
/** [seed, the twin true in the state that made the unmarked row false] (red at the base by design) */
const TWIN = /** @type {const} */ ([
  ...NOT.map(([seed, , instead]) => [seed, instead]),
  ['r2r-hamlet-0', 'Toll Revenue Stopped by the siege.'], // a share the siege closes prints no description: the mark alone
  ['r2s-under_siege-town-1', 'The descriptions here are of ordinary times. While the siege lasts, a row it touches is marked.'],
  ['r2r-town-37', 'The descriptions here are of ordinary times. While the outbreak lasts, a row it touches is marked.'],
  ['r2s-famine-hamlet-0', 'The descriptions here are of ordinary times. While the famine lasts, a row it touches is marked.'],
]);
/** [seed, the true sibling that must still print] (green before and after) */
const KEEP = /** @type {const} */ ([
  ['r2s-under_siege-town-1', 'Iron & Metalwork Metal is smelted or worked here.'], // the siege stops no forge (the leaf's table)
  ['r2r-town-37', 'Guild Fees Annual licensing fees'],
  ['r2s-famine-hamlet-0', 'Agricultural Rents Payments in kind or coin from tenant farmers'],
]);
/** Towns whose flow cards the leaf marks: the cards print exactly the leaf's count of marks. */
const CARD_TOWNS = ['r2r-town-37', 'r2s-famine-hamlet-0', 'r2s-under_siege-town-1', 'r2r-metropolis-14'];

afterEach(cleanup);

describe('TAIL-DISPLAY-ECON-4 batch 4: the Economics tab marks what the crisis stops, by the one leaf', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test.each(NOT)('%s does not print the unmarked "%s"; instead: %s', (seed, line, instead) => {
    expectAbsentWithAnchor(textOf(town(seed)), line, instead, `${seed}: the marked row prints in the unmarked one's place`);
  }, 120000);

  test.each(TWIN)('%s prints "%s"', (seed, line) => {
    expect(textOf(town(seed))).toContain(line);
  }, 120000);

  test.each(KEEP)('%s still prints "%s"', (seed, line) => {
    expect(textOf(town(seed))).toContain(line);
  }, 120000);

  test.each(CARD_TOWNS)('%s: the flow cards print the leaf\'s own count of chain marks', (seed) => {
    const t = town(seed);
    const leaf = (t.economicState.activeChains || []).filter((/** @type {any} */ c) => rowStoppedBy(t, 'chain', c)).length;
    expect(leaf).toBeGreaterThan(0);
    const v = page(t);
    expect(v.container.querySelectorAll('[data-testid="flow-crisis-mark"]').length).toBe(leaf);
    v.unmount();
  }, 120000);

  test('a calm town marks nothing and says nothing of ordinary times', () => {
    const v = page(town('r2r-thorp-0'));
    expect(v.container.querySelectorAll('[data-testid="flow-crisis-mark"]').length).toBe(0);
    expect(v.container.querySelector('[data-testid="economics-ordinary-times"]')).toBeNull();
    v.unmount();
  }, 120000);
});
