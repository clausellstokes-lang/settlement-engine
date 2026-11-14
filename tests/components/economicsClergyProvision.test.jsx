/** @vitest-environment jsdom */
/**
 * economicsClergyProvision.test.jsx — W2-C-LEAVES-5 item 5 (the round-three cut's #1153; record 387: one home for "the
 * town has clergy with powers", the defence's tradition facts in domain/facts/magic.js). Where the defence holds no
 * divine (or druidic) tradition, the Economics tab claims no divine (or druidic) provision in words: a chain card's magic
 * note of that tradition leaves (the note's tradition is facts/magicSource.js :: MAGIC_NOTE_TRADITION), and the food
 * row and sentence do not name the provision's kind. The "N% recovery" chip (chain.magicRecovery, a model's fraction)
 * leaves everywhere. The figures stand as the record's.
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
import { defenceHoldsDivine, defenceHoldsDruidic } from '../../src/domain/facts/magic.js';
import { MAGIC_NOTE_TRADITION } from '../../src/domain/facts/magicSource.js';

/** The app's own shape (the readers' cfgFor). @param {string} seed */
const birthApp = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^(?:rww|rr2s|fr4)-(\w+)-([a-z_+]+)(?:-(rand|port|river|road|isolated|crossroads))?-\d+$/));
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] && m[3] !== 'rand' ? { tradeRouteAccess: m[3] } : {};
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses,
    _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** @param {any} town @returns {string} the tab's text with every flow card shown */
const tabText = (town) => {
  const { container, unmount } = render(<EconomicsTab settlement={town} narrativeNote={null} />);
  const t = container.textContent || '';
  unmount();
  return t;
};
/** @param {any} town @param {string} tradition @returns {string[]} the notes of that tradition the record's chains carry */
const notesOf = (town, tradition) => (town.economicState.activeChains || []).map((/** @type {any} */ c) => c.magicNote)
  .filter((/** @type {any} */ n) => n && MAGIC_NOTE_TRADITION[n] === tradition);

afterEach(cleanup);

describe('the clergy\'s provision reads the defence\'s tradition (item 5)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('no divine provision in words where the defence holds no divine tradition (#1153, rr2s-metropolis-calm-rand-1)', () => {
    const town = birthApp('rr2s-metropolis-calm-rand-1');
    expect(defenceHoldsDivine(town), 'anchored: no clergy with powers').toBe(false);
    const divine = notesOf(town, 'divine');
    expect(divine, 'anchored: the record writes divine notes').toContain('Blessed stores; divine provision fills the gap');
    const t = tabText(town);
    for (const n of divine) expect(t, n).not.toContain(n);
  }, 60000);

  test('a town whose clergy have powers keeps its divine notes (rww-metropolis-calm-1), and a druid\'s note stands beside a denied divine one (rww-metropolis-infiltrated-1)', () => {
    const calm = birthApp('rww-metropolis-calm-1');
    expect(defenceHoldsDivine(calm), 'anchored').toBe(true);
    const kept = notesOf(calm, 'divine');
    expect(kept.length, 'anchored: divine notes').toBeGreaterThan(0);
    const t = tabText(calm);
    for (const n of kept) expect(t, n).toContain(n);
    const mixed = birthApp('rww-metropolis-infiltrated-1');
    expect([defenceHoldsDivine(mixed), defenceHoldsDruidic(mixed)], 'anchored').toEqual([false, true]);
    const tm = tabText(mixed);
    for (const n of notesOf(mixed, 'divine')) expect(tm, n).not.toContain(n);
    for (const n of notesOf(mixed, 'druid')) expect(tm, n).toContain(n);
  }, 120000);

  test('no "N% recovery" chip on any card (rr2s-metropolis-calm-rand-1, rww-metropolis-famine-1, rww-city-under_siege-1)', () => {
    for (const seed of ['rr2s-metropolis-calm-rand-1', 'rww-metropolis-famine-1', 'rww-city-under_siege-1']) {
      const town = birthApp(seed);
      expect((town.economicState.activeChains || []).some((/** @type {any} */ c) => c.magicRecovery), `anchored: ${seed} carries a recovery fraction`).toBe(true);
      expect(tabText(town), seed).not.toMatch(/\d+% recovery/);
    }
  }, 120000);

  test('the food row names no kind of provision the defence denies (rww-village-famine-1, its tradition taken away)', () => {
    const town = birthApp('rww-village-famine-1');
    expect(town.economicState.foodSecurity.magicOffset, 'anchored: the record counts a provision').toBeGreaterThan(0);
    expect(defenceHoldsDivine(town), 'anchored: and its clergy have powers').toBe(true);
    expect(tabText(town)).toContain('by divine provision');
    const denied = { ...town, defenseProfile: { ...town.defenseProfile, traditions: { ...town.defenseProfile.traditions, hasDivine: false } } };
    const t = tabText(denied);
    expect(t).not.toMatch(/divine provision/i);
    expect(t, 'the figure stands').toContain(`+ ${town.economicState.foodSecurity.magicOffset.toLocaleString('en-US')} by magical provision`);
  }, 60000);
});
