/** @vitest-environment jsdom */
/**
 * economicsNeedSentence.test.jsx — W2-C-LEAVES-6 item 6 (the round-three cut's #920, #1044, #1047, #1049; the first leaves
 * lane's #1152). A chain card's need printed as the model's chip row ("Needs Iron + fuel · affects: law enforcement,
 * patrol, investigation"). RULED: ONE plain sentence of consequence naming only services the town's own roster holds;
 * nothing printed where nothing the town has depends on the need; a card states a need only where it is the need of a
 * house whose trade is that chain's. The reader is domain/display/chainNeedShown.js :: chainNeedLine.
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
import { liveInstitutionNames } from '../../src/domain/facts/institutions.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/** The app's own shape (the readers' cfgFor). @param {string} seed */
const birthApp = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^(?:rww|rr2s|fr4)-(\w+)-([a-z_+]+)(?:-(rand|port|river|road|isolated|crossroads))?-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] && m[3] !== 'rand' ? { tradeRouteAccess: m[3] } : {};
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses,
    _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** @param {any} town @returns {string} the tab's text, the Economic Flows section opened */
const tabText = (town) => {
  const { container, unmount } = render(<EconomicsTab settlement={town} narrativeNote={null} />);
  for (const e of [...container.querySelectorAll('[aria-expanded="false"]')]) if (/Economic Flows/.test(e.textContent || '')) fireEvent.click(e);
  const t = container.textContent || '';
  unmount();
  return t;
};
/** @param {any} town @param {string} chainId @returns {any} the record's chain */
const chainOf = (town, chainId) => (town.economicState.activeChains || []).find((/** @type {any} */ c) => c.chainId === chainId);

afterEach(cleanup);

describe('a chain card states its need in one sentence (item 6)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('no chip row of the need and its service keys; the watch\'s own services in one sentence (#1044, #1047, rr2s-city-occupied-rand-1)', () => {
    const town = birthApp('rr2s-city-occupied-rand-1');
    const garrison = chainOf(town, 'garrison');
    expect(garrison?.dependency?.resource, 'anchored: the record\'s need').toBe('Iron + fuel');
    expect(liveInstitutionNames(town), 'anchored: the watch stands').toContain(garrison.dependency.institution);
    const t = tabText(town);
    for (const gone of ['· affects:', 'Needs Iron + fuel', 'Needs Timber']) expectAbsentWithAnchor(t, gone, ' here depend on ', 'the need box prints its sentence');
    expect(t).toContain('Law enforcement, patrol and investigation here depend on iron brought in');
    expect(t).toContain('Construction, furniture and barrel making here depend on timber brought in');
    expect(t.split(', which a siege, a closed road or a blockade would cut off').length - 1, 'the shared clause once (X-50)').toBe(1);
  }, 60000);

  test('under a siege the need is not said to come in (#920, rr2s-city-under_siege+famine-rand-1)', () => {
    const town = birthApp('rr2s-city-under_siege+famine-rand-1');
    expect(chainOf(town, 'garrison')?.dependency?.resource, 'anchored').toBe('Iron + fuel');
    const t = tabText(town);
    expectAbsentWithAnchor(t, '· affects:', 'which the siege has cut off', 'the need box under a siege');
    expect(t).toContain('Law enforcement, patrol and investigation here depend on iron and fuel from outside, which the siege has cut off.');
    expectAbsentWithAnchor(t, 'brought in, which a siege', 'which the siege has cut off', 'no present "brought in" under a siege');
  }, 60000);

  test('another trade\'s house\'s need is not printed on the card (#1152, rr2s-metropolis-calm-rand-1), and a need that is no good brought in prints nothing (the guard: a mages\' ley line)', () => {
    const town = birthApp('rr2s-metropolis-calm-rand-1');
    const bow = chainOf(town, 'bowyer_fletcher');
    expect(bow?.dependency?.institution, 'anchored: the generator joined the craft guilds\' need onto the bowyer').toBe('Craft guilds (100-150+)');
    const t = tabText(town);
    for (const gone of ['Luxury goods, specialist commission and fine jewellery', 'Metal ore + gems']) expectAbsentWithAnchor(t, gone, ' here depend on ', 'another trade\'s need');
    expect(t, 'the guard: a need of the card\'s own house still prints').toContain('Meals, ale and lodging here depend on grain brought in');
    const siege = birthApp('rr2s-city-under_siege+famine-rand-1');
    expect(chainOf(siege, 'spellcasting')?.dependency?.resource, 'anchored').toBe('Magical ley lines');
    expectAbsentWithAnchor(tabText(siege), 'Spellcasting, arcane training and magical licensing', 'which the siege has cut off', 'a need no good brought in');
  }, 90000);
});
