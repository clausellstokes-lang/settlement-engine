/** @vitest-environment jsdom */
/**
 * DAILY-4 · unit (P) — THE DAILY LIFE PAGE PRINTS ALL ITS LINES (the chair's E110; the brief
 * `docs/chair/2026-11-20/content/daily/briefs/D4-PAGE-EIGHT.md`; the first deploy's third condition).
 *
 * THIS FILE REDS WHEN
 *   · (a) THE EIGHT: on the owner's read, the lines the Daily Life tab prints in its `daily-life-engine` box (its `p`
 *     lines) are not EQUAL, line for line, to the eight public slots of `deriveDailyLife(record)` that are not empty, in
 *     E110's order (outsider_impressions, dawn_work, food_culture, gathering_places, child_warnings, commoner_resentments,
 *     unspoken_topics, recent_changes); or `DAILY_LIFE_PAGE_SLOTS` is not that order; or no place printed a line of the
 *     five slots the page did not print before (the arm's non-vacuous half);
 *   · (b) THE OWNER-ONLY LINE: where `deriveDailyLife(record, { audience: 'owner' })` carries `commoner_resentments_dm`
 *     (criminal opportunity forced to 100 through a pass-through mock of `causalState.js`, as
 *     `tests/pdf/dailyLifeChapterLines.test.jsx` (b) forces it), the owner's read does not print it ONCE, in the engine
 *     box, DIRECTLY AFTER the public resentment's line (or where that line would be), inside the dossier's owner-only
 *     mark (`data-layer="dm"` and its "For the DM only." line, `tabs/WhoRunsThisTownPanel.jsx`'s); or its text appears
 *     anywhere in the page on `publicDossier` or on `playerView` (each handed the owner's own record, the hardest case);
 *     or no place carried it (the arm's non-vacuous half).
 *   (c) The PDF chapter's lines equal the tab's `p` lines on every born place: `tests/pdf/dailyLifeChapterLines.test.jsx`
 *     (a) proves it, and with (a) here the chapter prints the eight.
 *
 * Thirty born places, five a size, seeds `d4p-<size>-<i>` (4c's recipe, the census dials). The store is mocked as
 * `tests/components/dailyLifeAutomatic.test.jsx` mocks it, with no saved account.
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

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
const { deriveDailyLife, DAILY_LIFE_PAGE_SLOTS } = await import('../../src/domain/dailyLife.js');
const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');

window.matchMedia = window.matchMedia || vi.fn((query) => ({ media: query, matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));

afterEach(() => { cleanup(); forced.crime = null; });

/** E110 (the chair): a newcomer's eye first, what lies beneath next, what is new last. */
const E110 = ['outsider_impressions', 'dawn_work', 'food_culture', 'gathering_places', 'child_warnings',
  'commoner_resentments', 'unspoken_topics', 'recent_changes'];
/** The three the page printed before this unit. */
const OLD_THREE = ['dawn_work', 'gathering_places', 'child_warnings'];
const OWNER_SLOT = 'commoner_resentments_dm';
const MARK = 'For the DM only.';

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
    const seed = `d4p-${size}-${i}`;
    births.push({ seed, rec: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: size }), null, { seed, customContent: {} }) });
  }
}, HEAVY);

/** @param {unknown} t @returns {string} a slot's printable sentence ('' for none) */
const printable = (t) => {
  const s = typeof t === 'string' ? t.trim() : '';
  return s && s !== '—' ? s : '';
};

/** @param {any} props @returns {HTMLElement} the page's container */
const mount = (props) => {
  mocks.store = { savedSettlements: [], auth: { tier: 'premium' }, aiDailyLife: null, aiLoading: false, aiRegenerating: false, aiError: null, aiProgress: '', creditBalance: 100 };
  return render(<DailyLifeTab {...props} />).container;
};

describe('D4 (P) — the Daily Life page prints all its lines (E110)', () => {
  test('(a) THE EIGHT: the owner\'s read prints the eight public slots, non-empty, in E110\'s order', () => {
    expect([...DAILY_LIFE_PAGE_SLOTS], 'DAILY_LIFE_PAGE_SLOTS is not E110\'s eight in E110\'s order').toEqual(E110);
    /** @type {string[]} */ const wrong = [];
    let newPrinted = 0;
    for (const { seed, rec } of births) {
      const { slots } = deriveDailyLife(rec);
      const want = E110.map((k) => printable(slots[k]?.text)).filter(Boolean);
      const container = mount({ settlement: rec });
      const got = [...container.querySelectorAll('[data-testid="daily-life-engine"] p')].map((p) => p.textContent || '');
      cleanup();
      if (JSON.stringify(got) !== JSON.stringify(want)) wrong.push(`${seed}: page ${JSON.stringify(got)} vs derived ${JSON.stringify(want)}`);
      const fresh = E110.filter((k) => !OLD_THREE.includes(k)).map((k) => printable(slots[k]?.text)).filter(Boolean);
      if (fresh.some((t) => got.includes(t))) newPrinted++;
    }
    expect(wrong).toEqual([]);
    expect(newPrinted, 'no place printed a line of the five new slots: the arm is vacuous').toBeGreaterThan(0);
  }, HEAVY);

  test('(b) THE OWNER-ONLY LINE: on the owner\'s read, once, marked, directly after the public resentment; never on a shared read', () => {
    forced.crime = 100;
    /** @type {string[]} */ const wrong = [];
    let held = 0;
    let placed = 0;
    for (const { seed, rec } of births) {
      const { slots } = deriveDailyLife(rec, { audience: 'owner' });
      const owner = printable(slots[OWNER_SLOT]?.text);
      if (!owner) continue;
      held++;
      // where it stands: the public lines in E110's order, the owner's line right after commoner_resentments' place
      /** @type {string[]} */ const want = [];
      for (const k of E110) {
        const t = printable(slots[k]?.text);
        if (t) want.push(t);
        if (k === 'commoner_resentments') want.push(`DM:${owner}`);
      }
      const container = mount({ settlement: rec });
      const box = container.querySelector('[data-testid="daily-life-engine"]');
      const got = box ? [...box.children].map((el) => (el.matches('[data-layer="dm"]')
        ? `DM:${(el.textContent || '').includes(owner) ? owner : el.textContent}` : el.textContent || '')) : [];
      if (JSON.stringify(got) !== JSON.stringify(want)) wrong.push(`${seed}: owner read ${JSON.stringify(got)} vs ${JSON.stringify(want)}`);
      const marked = [...container.querySelectorAll('[data-layer="dm"]')].filter((el) => (el.textContent || '').includes(owner));
      if (marked.length !== 1) wrong.push(`${seed}: the owner-only line is inside the mark ${marked.length} times`);
      else if (!(marked[0].textContent || '').includes(MARK)) wrong.push(`${seed}: the mark carries no "${MARK}" line`);
      else placed++;
      const all = container.textContent || '';
      if (all.split(owner).length - 1 !== 1) wrong.push(`${seed}: the owner-only line printed ${all.split(owner).length - 1} times`);
      cleanup();
      for (const view of [{ publicDossier: true }, { playerView: true }]) {
        const shared = mount({ settlement: rec, ...view });
        if ((shared.textContent || '').includes(owner)) wrong.push(`${seed} ${Object.keys(view)[0]}: the owner-only line printed`);
        if (shared.querySelector('[data-layer="dm"]')) wrong.push(`${seed} ${Object.keys(view)[0]}: an owner-only mark printed`);
        cleanup();
      }
    }
    expect(wrong).toEqual([]);
    expect(held, 'no owner read carried the owner-only slot: the arm is vacuous').toBeGreaterThan(0);
    expect(placed, 'no page carried the owner-only line in its mark: the arm is vacuous').toBeGreaterThan(0);
  }, HEAVY);
});
