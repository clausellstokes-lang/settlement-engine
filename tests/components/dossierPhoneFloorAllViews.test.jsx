/** @vitest-environment jsdom */
/**
 * dossierPhoneFloorAllViews.test.jsx — THE PHONE PROSE FLOOR, ACROSS THE WHOLE
 * DOSSIER, NOT ONE SURFACE AT A TIME.
 *
 * The floor (src/design/proseScale.js) arrived surface by surface, and a floor
 * proven surface by surface is a floor with holes: every tab added afterwards,
 * and every tab the sweep did not reach, is free to render 11px prose again and
 * nothing reds. This walks the real OutputContainer — every group, every sub-tab
 * it renders — under the mobile flag, and measures what a reader would actually
 * be given.
 *
 * ⭐ THE RULE IS proseScale.js's OWN, RESTATED AS A PREDICATE. That module says
 * the floor applies to PROSE and nothing else: "labels, eyebrows, badges, counts,
 * chips and names keep their own scale". So an element is judged when it is a
 * passage a reader READS:
 *
 *   • it is a <p>, or a <div>/<span> that carries its own inline fontSize;
 *   • its own text runs to at least PROSE_MIN_CHARS — a label, a count or a chip
 *     never does, and a sentence always does;
 *   • it holds no nested element that is itself judged, so a wrapper is never
 *     measured in place of the line it wraps;
 *   • it is not chrome: not uppercased, not letter-spaced, not bold.
 *
 * The exclusions are deliberately the SHAPE of chrome rather than a list of
 * class names, because a list would have to be maintained and would quietly stop
 * matching. Anything the predicate wrongly admits shows up as a named violation
 * with its text, so a bad judgement is legible rather than silent.
 *
 * ⚠ ANTI-VACUITY. A walk that renders nothing, or a predicate that matches
 * nothing, would pass this file trivially — which is the exact failure mode a
 * whole-dossier sweep invites. Three floors guard it: the strip must offer at
 * least MIN_VIEWS sub-tabs, the walk must actually visit them, and the scan must
 * find at least MIN_PROSE_BLOCKS passages in total. Each is asserted before the
 * floor itself is.
 */

import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';

import { PHONE_PROSE_FLOOR } from '../../src/design/proseScale.js';

const mocks = vi.hoisted(() => ({ store: {} }));

vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.store);
  useStore.subscribe = () => () => {};
  useStore.getState = () => mocks.store;
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_target, key) => String(key) }),
}));

import OutputContainer from '../../src/components/OutputContainer.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

/** A passage runs at least this many characters; a label, count or chip does not. */
const PROSE_MIN_CHARS = 45;
/** The dossier's own group/sub-tab count, as a floor the walk cannot silently lose. */
const MIN_VIEWS = 18;
/** A whole-dossier walk that finds fewer passages than this did not render. */
const MIN_PROSE_BLOCKS = 60;
/** A tab panel holding less text than this has not finished resolving its chunk.
 *  Measured against the SHORTEST real view (Faith's gated panel, ~160 chars), so
 *  the wait proves the chunk resolved without demanding a long tab. */
const PANEL_MIN_CHARS = 100;
/** The lazy boundary's own fallback wording, which must be gone before scanning. */
const LAZY_FALLBACK = /Opening the simulation record|Loading settlement view/;

// A REAL pipeline settlement, not a hand fixture: the desks compose their prose
// from generated state, and a thin fixture renders labels with nothing under
// them — which is how a sweep like this passes while proving nothing. One fixed
// seed keeps it deterministic.
let town;
beforeAll(() => {
  town = generateSettlementPipeline(
    { settType: 'city', terrain: 'grassland', tradeRouteAccess: 'road' },
    null,
    { seed: 'phone-floor-all-views', customContent: {} },
  );
  // FAITH IS THE EIGHTEENTH VIEW AND IT IS PRESENCE-GATED. OutputContainer shows
  // the tab when the settlement carries a primaryDeitySnapshot OR the viewer is
  // not premium; this walk reads as a PREMIUM owner, so without a snapshot the
  // Faith view simply is not in the strip and the sweep would silently cover
  // seventeen of eighteen. The snapshot is the config field the tab already
  // reads — attached here so the premium path is the one measured, rather than
  // dropping the viewer to free and changing every other tab's posture with it.
  town = {
    ...town,
    config: {
      ...(town.config || {}),
      primaryDeitySnapshot: town.config?.primaryDeitySnapshot || {
        name: 'The Quiet Hand',
        alignment: 'lawful-neutral',
        domains: ['craft', 'oaths'],
      },
    },
  };
}, 120_000);

/**
 * ⛔ THE VIEWPORT IS ONE CONTROLLED SOURCE, NOT A FRESH MOCK PER TEST — AND THE
 * FOURTH THING THIS INSTRUMENT GOT WRONG.
 *
 * `hooks/useIsMobile.js` keeps a MODULE-LEVEL store per breakpoint: the first
 * `useIsMobile()` of the module's life calls `window.matchMedia` once, caches
 * `{ mql, matches }` in a `Map`, and every later hook instance reads that cache
 * instead of the global. So replacing `window.matchMedia` with a second, fresh
 * mock — which is what this helper used to do — CANNOT reach a store that has
 * already been built: the desktop walk below ran under the MOBILE flag, and
 * passed only because the pre-sweep dossier had sub-14px prose either way.
 * Floor the last passage and the anchor inverts and fails, which is how it was
 * found — the guard against a vacuous mobile assertion was itself vacuous.
 *
 * The cure is a mock that behaves like a real MediaQueryList: ONE object whose
 * `matches` is a live getter over `viewport`, which records the store's own
 * `change` listener and NOTIFIES it when the flag flips. The cached store then
 * updates exactly as it does in a browser on resize, and `installMatchMedia`
 * means what it says at both widths.
 */
const viewport = { matches: true, listeners: new Set() };

function installMatchMedia(matches) {
  viewport.matches = matches;
  if (!window.matchMedia?.SF_CONTROLLED) {
    const mock = vi.fn((query) => ({
      media: query,
      get matches() { return viewport.matches; },
      addEventListener: (_type, fn) => viewport.listeners.add(fn),
      removeEventListener: (_type, fn) => viewport.listeners.delete(fn),
      addListener: (fn) => viewport.listeners.add(fn),
      removeListener: (fn) => viewport.listeners.delete(fn),
    }));
    mock.SF_CONTROLLED = true;
    window.matchMedia = mock;
  }
  // A real query notifies on flip; this is what carries the new width into the
  // module-level store the hook already built.
  for (const fn of viewport.listeners) fn({ matches });
}

function freshStore() {
  return {
    settlement: town,
    aiSettlement: null,
    setAiSettlement: vi.fn(),
    clearAiSettlement: vi.fn(),
    regenSection: vi.fn(),
    requestNarrative: vi.fn(),
    requestDailyLife: vi.fn(),
    getCost: vi.fn(() => 0),
    creditBalance: 0,
    aiLoading: false,
    aiRegenerating: false,
    aiError: null,
    aiProgress: '',
    aiPartialFailure: null,
    aiViolations: null,
    clearAiViolations: vi.fn(),
    lastRegenerationDelta: null,
    clearLastRegenerationDelta: vi.fn(),
    showNarrative: false,
    setShowNarrative: vi.fn(),
    savedSettlements: [{ id: 'save-1', settlement: town }],
    campaigns: [],
    eventLog: [],
    systemState: null,
    pinNpc: vi.fn(),
    unpinNpc: vi.fn(),
    queueEdit: vi.fn(),
    applyUserEditAction: vi.fn(),
    revertUserEditAction: vi.fn(),
    focusEntity: vi.fn(),
    editMode: false,
    phase: 'draft',
    auth: { tier: 'premium' },
    isElevated: () => false,
    isSettlementClockBound: () => false,
    userPrefs: { tableViewOpen: false },
    setUserPref: vi.fn(),
  };
}

/** Chrome by SHAPE, not by a name list that would have to be maintained. */
function isChrome(cs) {
  return cs.textTransform === 'uppercase'
    || (Number.parseFloat(cs.letterSpacing) || 0) > 0
    || (Number.parseInt(cs.fontWeight, 10) || 400) >= 700;
}

/** Every judged passage in `root`, innermost only. */
function proseBlocks(root) {
  const candidates = [];
  for (const el of root.querySelectorAll('p, div, span')) {
    const text = (el.textContent || '').trim();
    if (text.length < PROSE_MIN_CHARS) continue;
    if (el.tagName !== 'P' && !el.style.fontSize) continue;
    candidates.push(el);
  }
  // Innermost only: drop any candidate that contains another candidate, so a
  // wrapper is never measured in place of the line it wraps.
  const set = new Set(candidates);
  return candidates.filter(el => (
    ![...set].some(other => other !== el && el.contains(other))
  ));
}

beforeEach(() => {
  installMatchMedia(true);
  mocks.store = freshStore();
});
afterEach(cleanup);

/**
 * Click through every group and every sub-tab the strip offers, measuring each
 * view's prose. Returns what was seen so the caller can assert on it.
 */
async function walkEveryView(container) {
  const groupTabs = () => [...container.querySelectorAll('[aria-label="Dossier sections"] [role="tab"]')];
  const subTabs = () => [...container.querySelectorAll('[aria-label="Dossier tabs"] [role="tab"]')];
  await waitFor(() => expect(groupTabs().length).toBeGreaterThan(0));

  /** @type {{view: string, size: number, text: string}[]} */
  const violations = [];
  const visited = [];
  let measured = 0;

  for (let g = 0; g < groupTabs().length; g += 1) {
    const groupName = groupTabs()[g].textContent.trim();
    fireEvent.click(groupTabs()[g]);
    await waitFor(() => expect(subTabs().length).toBeGreaterThan(0));

    for (let s = 0; s < subTabs().length; s += 1) {
      const button = subTabs()[s];
      const tabName = button.textContent.trim();
      // ⛔ WAIT ON *THIS* TAB'S OWN PANEL, FILLED. Two ways this wait went wrong
      // before, both of which made the sweep pass while measuring nothing:
      // keyed on a fallback's WORDING it returned on the first tick (the wording
      // had changed), and keyed on "some panel holds text" it returned while the
      // PREVIOUS tab's panel was still mounted — so eighteen views were scanned
      // as eighteen copies of Overview. The panel carries the selected tab's own
      // id, so waiting for `sf-panel-<thisTab>` to exist AND to have filled is
      // the only form that cannot be satisfied by the view we just left.
      const tabId = (button.id || '').replace(/^sf-tab-/, '');
      expect(tabId, 'a sub-tab rendered without its sf-tab- id').toBeTruthy();
      fireEvent.click(button);
      await waitFor(() => {
        const p = container.querySelector(`#sf-panel-${tabId}`);
        expect(p, `${groupName}/${tabName} never mounted its own panel`).toBeTruthy();
        const text = p.textContent || '';
        expect(text).not.toMatch(LAZY_FALLBACK);
        expect(text.length).toBeGreaterThan(PANEL_MIN_CHARS);
      }, { timeout: 10_000 });
      const panel = container.querySelector(`#sf-panel-${tabId}`);
      visited.push(`${groupName}/${tabName}`);

      for (const el of proseBlocks(panel)) {
        const cs = getComputedStyle(el);
        const size = Number.parseFloat(cs.fontSize);
        if (!Number.isFinite(size)) continue;
        if (isChrome(cs)) continue;
        measured += 1;
        if (size < PHONE_PROSE_FLOOR) {
          violations.push({
            view: `${groupName}/${tabName}`,
            size,
            text: (el.textContent || '').trim().slice(0, 70),
          });
        }
      }
    }
  }
  return { violations, visited, measured };
}

describe('THE PHONE PROSE FLOOR — every dossier view', () => {
  test(`every prose passage in every tab clears ${PHONE_PROSE_FLOOR}px at phone width`, async () => {
    const { container } = render(<OutputContainer settlement={town} readOnly />);
    const { violations, visited, measured } = await walkEveryView(container);

    // ── ANTI-VACUITY, asserted before the floor ──────────────────────────────
    expect(visited.length, `the walk visited ${visited.length} views: ${visited.join(', ')}`)
      .toBeGreaterThanOrEqual(MIN_VIEWS);
    expect(new Set(visited).size, 'the walk revisited a view instead of moving on')
      .toBe(visited.length);
    expect(measured, 'the scan found almost no passages — the dossier did not render, or the predicate stopped matching')
      .toBeGreaterThanOrEqual(MIN_PROSE_BLOCKS);

    // ── THE FLOOR ────────────────────────────────────────────────────────────
    const report = violations
      .map(v => `  ${v.size}px  ${v.view}  ::  ${v.text}`)
      .join('\n');
    expect(
      violations,
      `\n${violations.length} prose passage(s) render below the ${PHONE_PROSE_FLOOR}px phone floor.\n`
      + 'Wrap each in proseFontSize(<the desktop FS token>, mobile) from '
      + 'src/design/proseScale.js, binding `mobile` once per component with '
      + 'useIsMobile() above any early return:\n'
      + `${report}\n`,
    ).toEqual([]);
  }, 180_000);

  test('desktop is untouched — the SAME walk still measures the shipped small steps', async () => {
    installMatchMedia(false);
    const { container } = render(<OutputContainer settlement={town} readOnly />);
    const { violations, visited, measured } = await walkEveryView(container);

    // The floor is a PHONE rule, and this is the liveness anchor for the run
    // above. Above the breakpoint the dossier keeps its own smaller steps, so
    // this walk must still find passages under 14px; if it found none,
    // `proseFontSize` would be raising every width and the mobile assertion
    // would be proving nothing about mobile.
    expect(visited.length).toBeGreaterThanOrEqual(MIN_VIEWS);
    // The same anti-vacuity floor the mobile walk asserts: a desktop walk that
    // measured almost nothing would satisfy the line below by accident.
    expect(measured, 'the desktop scan found almost no passages — the dossier did not render')
      .toBeGreaterThanOrEqual(MIN_PROSE_BLOCKS);
    expect(
      violations.length,
      'desktop no longer renders ANY prose below 14px — the floor has stopped being '
      + 'a phone rule, so the mobile assertion above proves nothing about mobile',
    ).toBeGreaterThan(0);
  }, 180_000);
});
