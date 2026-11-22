/** @vitest-environment jsdom */
/**
 * DAILY-3 · U4c — THE PDF'S CHAPTER PRINTS THE PAGE'S DAILY LIFE LINES (the chair's E59, 2026-11-22; the brief
 * `docs/chair/2026-11-20/content/daily/briefs/U4C-BUILD-PDF-CHAPTER.md`, its rule 4).
 *
 * THIS FILE REDS WHEN
 *   · (a) THE DIFFERENTIAL: for the same record, the Daily Life lines chapter 15 (`pdf/sections/IdentityDailyLife.jsx`)
 *     prints under DAILY LIFE are not EQUAL, line for line and in order, to the lines the Daily Life tab prints
 *     (`components/new/tabs/DailyLifeTab.jsx :: engineLines`, read off the page's `daily-life-engine` box);
 *   · (b) THE PIN: the chapter prints the owner-only slot's text (`commoner_resentments_dm`) for a record whose owner
 *     read carries one (criminal opportunity forced to 100 through a pass-through mock of `causalState.js`, as
 *     `tests/domain/dailyLifeOwnerSlot.test.js` does), or prints no public line there (the pin's non-vacuous arm).
 *
 * Thirty born places, five a size, seeds `u4c-<size>-<i>` (the census dials). The tab's store is mocked as
 * `tests/components/dailyLifeAutomatic.test.jsx` mocks it, with no saved account. The chapter is handed the view model
 * `SettlementPDF.jsx` builds (`dmView: true`).
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { Text, View } from '@react-pdf/renderer';

/** The crime score the pass-through mock forces (null: the real score). */
const forced = vi.hoisted(() => ({ crime: /** @type {number|null} */ (null) }));
const mocks = vi.hoisted(() => ({ store: /** @type {Record<string, any>} */ ({}) }));
vi.mock('../../src/domain/causalState.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    deriveCausalState: (/** @type {unknown} */ s) => {
      const c = actual.deriveCausalState(s);
      return forced.crime === null ? c : { ...c, scores: { ...c.scores, criminal_opportunity: forced.crime } };
    },
  };
});
vi.mock('../../src/store/index.js', () => {
  const useStore = (/** @type {any} */ selector) => (typeof selector === 'function' ? selector(mocks.store) : mocks.store);
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

const { DailyLifeTab } = await import('../../src/components/new/tabs/DailyLifeTab.jsx');
const { IdentityDailyLife } = await import('../../src/pdf/sections/IdentityDailyLife.jsx');
const { buildViewModel } = await import('../../src/pdf/lib/viewModel.js');
const { deriveDailyLife } = await import('../../src/domain/dailyLife.js');
const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');

window.matchMedia = window.matchMedia || vi.fn((query) => ({ media: query, matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));

afterEach(() => { cleanup(); forced.crime = null; });

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = 5;
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const HEAVY = 600_000;

/** @type {Array<{ seed: string, rec: any }>} */
const births = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const size of SIZES) for (let i = 0; i < N; i++) {
    const seed = `u4c-${size}-${i}`;
    births.push({ seed, rec: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: size }), null, { seed, customContent: {} }) });
  }
}, HEAVY);

/** The lines the tab prints, read off its page. @param {any} rec @returns {string[]} */
const tabLines = (rec) => {
  mocks.store = { savedSettlements: [], auth: { tier: 'premium' }, aiDailyLife: null, aiLoading: false, aiRegenerating: false, aiError: null, aiProgress: '', creditBalance: 100 };
  const { container } = render(<DailyLifeTab settlement={rec} />);
  const out = [...container.querySelectorAll('[data-testid="daily-life-engine"] p')].map((p) => p.textContent || '');
  cleanup();
  return out;
};

/** The chapter, as `SettlementPDF.jsx` mounts it. @param {any} rec */
const chapter = (rec) => IdentityDailyLife({ settlement: rec, narrativeMode: false, vm: buildViewModel({ settlement: rec, dmView: true }), stateProse: null });

/** The chapter's printed Daily Life lines: the Text elements that follow the DAILY LIFE label in its block. @param {any} el @returns {string[]} */
const chapterLines = (el) => {
  /** @param {any} n @returns {any} */
  const find = (n) => {
    if (n == null || typeof n !== 'object') return null;
    if (Array.isArray(n)) { for (const c of n) { const f = find(c); if (f) return f; } return null; }
    const kids = [n.props?.children].flat(Infinity);
    if (n.type === View && kids.some((k) => k && k.type === Text && k.props?.children === 'DAILY LIFE')) return kids;
    return find(n.props?.children);
  };
  const kids = find(el);
  if (!kids) return [];
  const at = kids.findIndex((k) => k && k.type === Text && k.props?.children === 'DAILY LIFE');
  /** @type {string[]} */ const out = [];
  for (const k of kids.slice(at + 1)) {
    if (k == null || k === false) continue;
    if (k.type !== Text) break;
    out.push(String(k.props.children));
  }
  return out;
};

/** Every text leaf of the rendered chapter. @param {any} node @param {string[]} acc @returns {string[]} */
const leaves = (node, acc = []) => {
  if (node == null || typeof node === 'boolean') return acc;
  if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) leaves(n, acc); return acc; }
  if (typeof node.type === 'function') return leaves(node.type(node.props), acc);
  return leaves(node.props?.children, acc);
};

describe('U4c — chapter 15 prints the Daily Life tab\'s own lines (E59)', () => {
  test('(a) THE DIFFERENTIAL: on every born place the chapter\'s Daily Life lines EQUAL the tab\'s engineLines', () => {
    /** @type {string[]} */ const wrong = [];
    let printed = 0;
    for (const { seed, rec } of births) {
      const want = tabLines(rec);
      const got = chapterLines(chapter(rec));
      if (JSON.stringify(got) !== JSON.stringify(want)) wrong.push(`${seed}: chapter ${JSON.stringify(got)} vs tab ${JSON.stringify(want)}`);
      if (want.length > 0) printed++;
    }
    expect(wrong).toEqual([]);
    expect(printed, 'the tab printed lines on no place: the differential is vacuous').toBeGreaterThan(0);
  }, HEAVY);

  test('(b) THE PIN: where the owner read carries commoner_resentments_dm, the chapter prints the public lines and never it', () => {
    forced.crime = 100;
    /** @type {string[]} */ const wrong = [];
    let held = 0;
    for (const { seed, rec } of births) {
      const owner = String(deriveDailyLife(rec, { audience: 'owner' }).slots.commoner_resentments_dm?.text ?? '').trim();
      if (!owner) continue;
      held++;
      const el = chapter(rec);
      if (leaves(el).join('\n').includes(owner)) wrong.push(`${seed}: the owner-only line printed`);
      if (chapterLines(el).length === 0) wrong.push(`${seed}: no public Daily Life line printed`);
    }
    expect(wrong).toEqual([]);
    expect(held, 'no owner read carried the owner-only slot: the pin is vacuous').toBeGreaterThan(0);
  }, HEAVY);
});
