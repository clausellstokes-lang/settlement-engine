/** @vitest-environment jsdom */
/**
 * DAILY-PAGE-1 — THE DAILY LIFE PAGE PRINTS THE ENGINE'S OWN LINES, AND ITS BUTTON GOES (the owner's order of
 * 2026-11-22: "remove the button prompt for Daily life and simply generate it automatically").
 *
 * THIS FILE REDS WHEN
 *   · (a) the page, with no interaction, does not hold the engine's three rebuilt lines
 *     (`domain/dailyLife.js :: deriveDailyLifeSlot` for `dawn_work`, `gathering_places`, `child_warnings`) in that order;
 *   · (b) any control or line offers to make a daily-life account (`daily-life-offer`, "Generate Daily Life", a credit
 *     price, the save-to-enable line), saved (`saveId` given) or unsaved (`saveId` null);
 *   · (c) a shared read (`publicDossier`, and `playerView`) handed `toPublicSafe(record)` prints lines derived from
 *     anything but THAT document;
 *   · (d) mounting the page calls the store's `requestDailyLife`.
 *
 * Six born places, one a size, seeds `dlauto-<size>-0` (the census dials, as bar2ServicesRows births them). The store is
 * mocked with `isConfigured` true (the product's configured mode, where the old offer was a credit-spending button).
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

const mocks = vi.hoisted(() => ({ store: {} }));
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => (typeof selector === 'function' ? selector(mocks.store) : mocks.store);
  useStore.subscribe = () => () => {};
  useStore.getState = () => mocks.store;
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: true }));
vi.mock('../../src/hooks/useLivePricing.js', () => ({ useLiveAiCostResolver: () => () => 3 }));
vi.mock('../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

import { DailyLifeTab } from '../../src/components/new/tabs/DailyLifeTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { deriveDailyLifeSlot } from '../../src/domain/dailyLife.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';

window.matchMedia = window.matchMedia || vi.fn((query) => ({ media: query, matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));

afterEach(cleanup);

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const SLOTS = ['dawn_work', 'gathering_places', 'child_warnings'];
const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @type {Map<string, any>} */
const towns = new Map();

/** the printable texts of the three slots, as derived from `doc` @param {any} doc @returns {string[]} */
const lines = (doc) => SLOTS.map((k) => String(deriveDailyLifeSlot(k, doc)?.text ?? '').trim()).filter((t) => t && t !== '—');

/** @param {any} props */
const mount = (props) => {
  const requestDailyLife = vi.fn();
  mocks.store = { savedSettlements: [], auth: { tier: 'premium' }, aiDailyLife: null, aiLoading: false, aiRegenerating: false, aiError: null, aiProgress: '', creditBalance: 100, requestDailyLife };
  const { container } = render(<DailyLifeTab {...props} />);
  return { text: container.textContent || '', container, requestDailyLife };
};

/** each text appears, and in the given order @param {string} hay @param {string[]} texts */
const inOrder = (hay, texts) => {
  let at = -1;
  for (const t of texts) {
    const i = hay.indexOf(t, at + 1);
    if (i < 0 || i <= at) return false;
    at = i;
  }
  return true;
};

describe('the Daily Life page prints the engine\'s own three lines, with no button', () => {
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    for (const size of SIZES) {
      const seed = `dlauto-${size}-0`;
      towns.set(size, generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: size }), null, { seed, customContent: {} }));
    }
  }, 300_000);

  test('(a) with no interaction the page holds dawn_work, gathering_places and child_warnings, in that order', () => {
    const wrong = [];
    for (const size of SIZES) {
      const r = towns.get(size);
      const want = lines(r);
      expect(want.length, `${size}: the engine derived no line`).toBeGreaterThan(0);
      for (const saveId of ['s1', null]) {
        const { text } = mount({ settlement: r, saveId });
        if (!inOrder(text, want)) wrong.push(`${size} saveId=${saveId}`);
        cleanup();
      }
    }
    expect(wrong).toEqual([]);
  });

  test('(b) no control and no line offers to make a daily-life account, saved or unsaved', () => {
    const wrong = [];
    for (const size of SIZES) {
      for (const saveId of ['s1', null]) {
        const { text, container } = mount({ settlement: towns.get(size), saveId });
        if (container.querySelector('[data-testid="daily-life-offer"]')) wrong.push(`${size} ${saveId}: daily-life-offer`);
        if (/Generate Daily Life|Regenerate Daily Life|enable Daily Life|credits/.test(text)) wrong.push(`${size} ${saveId}: offer words`);
        if ([...container.querySelectorAll('button')].some((b) => /daily life/i.test(`${b.textContent} ${b.title}`))) wrong.push(`${size} ${saveId}: a daily-life button`);
        cleanup();
      }
    }
    expect(wrong).toEqual([]);
  });

  test('(c) a shared read prints the lines derived from the shared document, never the owner\'s', () => {
    const wrong = [];
    for (const size of SIZES) {
      const owner = towns.get(size);
      const shared = toPublicSafe(owner);
      const want = lines(shared);
      const ownerOnly = lines(owner).filter((t) => !want.includes(t));
      for (const view of [{ publicDossier: true }, { playerView: true }]) {
        const { text } = mount({ settlement: shared, saveId: null, ...view });
        if (!inOrder(text, want)) wrong.push(`${size} ${Object.keys(view)[0]}: shared lines missing`);
        for (const t of ownerOnly) if (text.includes(t)) wrong.push(`${size} ${Object.keys(view)[0]}: owner line printed`);
        cleanup();
      }
    }
    expect(wrong).toEqual([]);
  });

  test('(d) mounting the page never calls the store\'s requestDailyLife', () => {
    for (const size of SIZES) {
      for (const saveId of ['s1', null]) {
        const { requestDailyLife } = mount({ settlement: towns.get(size), saveId });
        expect(requestDailyLife).not.toHaveBeenCalled();
        cleanup();
      }
    }
  });
});
