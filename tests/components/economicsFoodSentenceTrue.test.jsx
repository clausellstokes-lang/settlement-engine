/** @vitest-environment jsdom */
/**
 * economicsFoodSentenceTrue.test.jsx — W2-C-LEAVES-4 item 3 (the chair's ruling of 2026-11-13 on the food sentences:
 * the cut's #66 #218 #362 #1147 #1251, the increment's rww-metropolis-under_siege-1, CENSUS-2's BROUGHT_BANDS hits).
 * (a) a share word contains the figure it stands for (within five points); (b) the carriers read the route's own
 * home, the wharf on the roster and the siege; (c) "with nothing to spare against a bad year" is not said beside stores
 * of three months or more (the food record's `storageMonths`, the Stores line's one home).
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

/** The app's own shape (the readers' cfgFor: rww-, fr4- as render.rww.jsx; rr2s- with its route as render.rr2s.jsx). @param {string} seed */
const birthApp = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^(?:rww|rr2s|fr4)-(\w+)-([a-z_+]+)(?:-(rand|port|river|road|isolated|crossroads))?-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] && m[3] !== 'rand' ? { tradeRouteAccess: m[3] } : {};
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses,
    _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** The Food Security sentence, as printed. @param {any} town */
const foodSentence = (town) => {
  const { container, unmount } = render(<EconomicsTab settlement={town} narrativeNote={null} />);
  const opens = new RegExp(`^(?:${String(town.name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} grows |What is grown here|No food comes into )`);
  const t = [...container.querySelectorAll('div')].filter((d) => opens.test(d.textContent || '') && d.children.length <= 1).map((d) => d.textContent || '')[0] || '';
  unmount();
  return t;
};
/** @param {any} town */
const fbOf = (town) => town.economicViability.metrics.foodBalance;

afterEach(cleanup);

describe('the food sentence is true of the figures and the town (item 3)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('(a) 42 and 41 in a hundred are about two parts in five, not about a third (rr2s-thorp-famine-rand-1 #66, rr2s-metropolis-wartime-rand-1 #1251)', () => {
    for (const seed of ['rr2s-thorp-famine-rand-1', 'rr2s-metropolis-wartime-rand-1']) {
      const town = birthApp(seed); const fb = fbOf(town);
      expect(Math.round((100 * fb.dailyProduction) / fb.dailyNeed), `${seed} anchored`).toBeGreaterThanOrEqual(40);
      const t = foodSentence(town);
      expect(t, seed).toContain('grows about two parts in five of what it eats');
      expect(t, seed).not.toContain('about a third'); // anchored: the line above finds the sentence's share
    }
  }, 60000);

  test('(a) a provision more than twice the harvest is not "a little more" (rww-metropolis-under_siege-1)', () => {
    const town = birthApp('rww-metropolis-under_siege-1'); const fb = fbOf(town);
    expect(fb.magicFoodOffset, 'anchored').toBeGreaterThan(2 * fb.dailyProduction);
    const t = foodSentence(town);
    expect(t).not.toContain('a little more'); // anchored: the next line finds the sentence's provision clause
    expect(t).toMatch(/provision makes up about a third of what it eats/);
  }, 60000);

  test('(b) no ships where no wharf stands (rr2s-hamlet-plague_onset-rand-1 #218); a port with docks keeps them (fr4-town-famine-1)', () => {
    const hamlet = birthApp('rr2s-hamlet-plague_onset-rand-1');
    expect(hamlet.economicState.tradeAccess, 'anchored: a port').toBe('port');
    expect(hamlet.institutions.some((/** @type {any} */ i) => /dock|wharf|quay|harbou?r/i.test(i.name)), 'anchored: no wharf').toBe(false);
    expect(foodSentence(hamlet), 'the hamlet\'s food sentence prints').toMatch(/^(?:What is grown here|No food comes into |\S.* grows )/);
    expect(foodSentence(hamlet)).not.toContain('ships'); // anchored: the line above finds the same sentence
    expect(foodSentence(birthApp('fr4-town-famine-1'))).toContain('ships bring in');
  }, 60000);

  test('(b) under a siege that cut the roads no carrier brings food in (fr4-town-under_siege+famine-5)', () => {
    const town = birthApp('fr4-town-under_siege+famine-5');
    expect(fbOf(town).importCoverage, 'anchored: the record still counts an import').toBeGreaterThan(0);
    const t = foodSentence(town);
    expect(t).not.toMatch(/bring in|brings in/); // anchored: the next line finds "by trade" in the same sentence
    expect(t).toContain('by trade');
  }, 60000);

  test('(c) no "nothing to spare against a bad year" beside six and fifteen months in store (rr2s-town-calm-rand-1 #362, rr2s-metropolis-calm-rand-1 #1147)', () => {
    for (const seed of ['rr2s-town-calm-rand-1', 'rr2s-metropolis-calm-rand-1']) {
      const town = birthApp(seed);
      expect(Math.round(town.economicState.foodSecurity.foodRecord.storageMonths), `${seed} anchored`).toBeGreaterThanOrEqual(3);
      expect(foodSentence(town), seed).toBe("What is grown here and brought in covers each day's food.");
    }
  }, 60000);
});
