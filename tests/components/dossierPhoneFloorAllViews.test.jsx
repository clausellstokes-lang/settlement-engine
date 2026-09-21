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
 * ⭐ THE RULE IS proseScale.js's OWN, RESTATED AS A PREDICATE. An element is
 * MEASURED when it is a line a reader reads:
 *
 *   • it is a <p>, or a <div>/<span> that carries its own inline fontSize;
 *   • its own text runs to at least MIN_CHARS — the same bound `chromeFontSize`
 *     names, so what is asserted and what is applied are one set;
 *   • it holds no nested element that is itself measured, so a wrapper is never
 *     measured in place of the line it wraps.
 *
 * Each measured line is then CLASSIFIED, and each class has its own floor:
 * PROSE >= 14px, CHROME >= 12px (proseScale.js, amended 2026-09-18).
 *
 * ⛔ CHROME IS CLASSIFIED, NOT DISCARDED — AND THAT IS THE POINT OF THE REWRITE.
 * This file used to DROP chrome from the scan, so the predicate was load-bearing
 * in the worst way: anything it called chrome became invisible, and a 7px pill
 * could never red anything. It also read chrome as "uppercase, letter-spaced, or
 * weight >= 700" and nothing else, so a 600-weight trade chip was measured as
 * PROSE and reported as a violation while its 700-weight gold sibling standing
 * next to it in the same row was not measured at all — the pair was pulled apart
 * by the instrument rather than by any design. Now a misclassification can only
 * move a line between 14 and 12; nothing escapes measurement, and the report
 * names the class it was judged as, so a bad judgement is legible.
 *
 * ⚠ ANTI-VACUITY, and it is the arm that has failed most often here. A walk that
 * renders nothing, a predicate that matches nothing, or a VIEW that contributes
 * nothing all pass a floor trivially. Five guards, asserted before any floor:
 * the strip must offer at least MIN_VIEWS sub-tabs; the walk must visit them all
 * distinctly; EVERY view must contribute at least one measured line or be named
 * in EMPTY_VIEWS with a reason; the walk must have opened at least one row
 * one-at-a-time; and BOTH widths carry an EXACT per-view pin rather than "more
 * than zero" (DESKTOP_BASELINE, MOBILE_BASELINE).
 *
 * ⛔ AND "ZERO VIOLATIONS" IS NOT A MEASUREMENT (review 13). The phone arm used
 * to assert an empty list and nothing else, so a surface that fell from
 * forty-six lines to one satisfied it perfectly — which is not hypothetical on
 * this file, whose NPC roster scored ZERO at both widths for its whole life.
 * MOBILE_BASELINE pins what each view actually gave a reader at 375px.
 *
 * ⚠ THE WALK EXPANDS WHAT A READER WOULD EXPAND, AND MEASURES EACH STATE. The
 * dossier's roster cards, threat rows and folded Sections ship COLLAPSED, and
 * `Section` renders `{open && children}` — so a walk that only clicked tabs
 * measured the closed lid of the NPC roster and reported zero passages for the
 * very surface proseScale.js names first ("the NPC card's wants, secrets and
 * constraints"). Every control declaring `aria-expanded="false"` is opened,
 * except one that declares `aria-haspopup`: a popup is not an in-place
 * disclosure, and following one would walk into a modal instead of the tab.
 *
 * ⛔ HALF OF THOSE ACCORDIONS HOLD ONE ROW AT A TIME, so "click every closed
 * row" left exactly ONE open — whichever document order put last — and the
 * coverage was a click order rather than a judgement. `expandEverything` now
 * measures the all-open state, then opens each re-closed row IN TURN and
 * measures the state it puts the panel in, recording the route; every element
 * is counted once by identity, so a line visible in two states is counted once.
 */

import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';

import { PHONE_CHROME_FLOOR, PHONE_PROSE_FLOOR } from '../../src/design/proseScale.js';

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

/** A line long enough to be READ rather than glanced at — `chromeFontSize`'s own bound. */
const MIN_CHARS = 45;
/** The dossier's own group/sub-tab count, as a floor the walk cannot silently lose. */
const MIN_VIEWS = 18;
/** A tab panel holding less text than this has not finished resolving its chunk.
 *  Measured against the SHORTEST real view (Faith's gated panel, ~160 chars), so
 *  the wait proves the chunk resolved without demanding a long tab. */
const PANEL_MIN_CHARS = 100;

/**
 * ⛔ NO VIEW MAY CONTRIBUTE NOTHING — AND THIS LIST IS WHY THE GLOBAL FLOOR WENT.
 *
 * A single `measured >= 60` over the whole walk is satisfied by two rich tabs
 * while sixteen render blank, which is not a hypothetical: the NPC roster scored
 * ZERO at both widths for the life of this file, because its cards ship
 * collapsed and the walk only clicked tabs. The floor is now per view, so a
 * surface that stops rendering is named rather than averaged away.
 *
 * A view belongs here ONLY when its emptiness is a fact about the fixture rather
 * than about the dossier, and the reason must say which. Empty today: none.
 */
const EMPTY_VIEWS = Object.freeze({});

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

const hasLength = (v) => (Number.parseFloat(v) || 0) > 0;
const hasGround = (v) => !!v && v !== 'none' && !/^(transparent|rgba\(0, 0, 0, 0\))$/.test(v);

/**
 * Chrome by SHAPE, plus one DECLARED case — never a name list, which would have
 * to be maintained and would quietly stop matching.
 *
 * The shape tests are the typographic signals a label already carries (case,
 * tracking, weight) and THE PILL: an INLINE box with its own padding and its own
 * ground. Inline is load-bearing there — a prose card also has padding, a border
 * and a tint, and the only thing separating it from a chip is that it is a block.
 *
 * `data-sf-chrome` is for the furniture a stylesheet cannot betray: a role line
 * under a name carries no case, no tracking, no weight and no box, so nothing in
 * its CSS distinguishes it from the sentence below it. The component declares it
 * instead. That marker can only ever move a line from the 14px floor to the 12px
 * one — it cannot exempt anything — so it is a classification, not an escape.
 */
/**
 * ⛔ `data-sf-chrome` WAS AN UNBOUNDED DECLARATION, AND AN UNBOUNDED DECLARATION
 * IS AN ESCAPE HATCH WHATEVER ITS DOCSTRING SAYS (review 13).
 *
 * The marker exists for furniture no stylesheet betrays — a role line under a
 * name carries no case, no tracking, no weight and no box. It was honoured on
 * ANY element, so it could also be stamped on a paragraph, and the paragraph
 * would then be held to 12px while every signal in it said 14. Two shapes are
 * refused, and both were live when this bound was written:
 *
 *   • ITS OWN TEXT IS A SENTENCE — at least MIN_CHARS with a full stop in it.
 *     SupplyChainsPanel's legend put the size on the STRIP, so the measured
 *     element's text was all five labels run together: a 120-character line with
 *     two full stops, a sentence by every signal an instrument has. The marker
 *     was the only thing contradicting that, which is exactly the wrong job for
 *     a declaration.
 *   • IT WRAPS ELEMENTS CARRYING THEIR OWN TEXT — the marker then claims a whole
 *     SUBTREE rather than a line, and whatever prose is inside it is claimed
 *     with it. EconomicsTab's income attribution — "Contributes to <strong>the
 *     Market</strong> - 23% of income" — is 42 characters and carries no full
 *     stop, so the first rule cannot see it; it is a sentence about a chain's
 *     revenue and it is prose.
 *
 * A refused marker does not force a verdict, it simply stops being evidence:
 * the element falls through to the shape tests and is judged like anything else.
 * The refusal is reported separately, so a bad stamp is named even when the
 * element happens to clear the higher floor anyway.
 *
 * @returns {string|null} why the marker is refused, or null when it stands
 */
function markerRefusal(el) {
  const text = (el.textContent || '').trim();
  if (text.length >= MIN_CHARS && text.includes('.')) {
    return `its own text reads as a sentence (${text.length} chars, with a full stop)`;
  }
  const speaking = [...el.children].filter(child => (child.textContent || '').trim().length > 0);
  if (speaking.length) {
    return `it wraps ${speaking.length} element(s) carrying their own text `
      + `(<${speaking.map(c => c.tagName.toLowerCase()).join('>, <')}>), so the marker claims a subtree, not a line`;
  }
  return null;
}

function isChrome(el, cs) {
  if (el.hasAttribute('data-sf-chrome') && !markerRefusal(el)) return true;
  if (cs.textTransform === 'uppercase') return true;
  if ((Number.parseFloat(cs.letterSpacing) || 0) > 0) return true;
  if ((Number.parseInt(cs.fontWeight, 10) || 400) >= 700) return true;
  const inline = el.tagName === 'SPAN' || /inline/.test(cs.display || '');
  const padded = hasLength(cs.padding) || hasLength(cs.paddingLeft) || hasLength(cs.paddingTop);
  const grounded = hasGround(cs.backgroundColor) || hasGround(cs.background)
    || hasLength(cs.borderWidth) || hasGround(cs.borderStyle);
  return inline && padded && grounded;
}

/** Every measured line in `root`, innermost only. */
function measuredLines(root) {
  const candidates = [];
  for (const el of root.querySelectorAll('p, div, span')) {
    const text = (el.textContent || '').trim();
    if (text.length < MIN_CHARS) continue;
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

/**
 * Every in-place disclosure in `panel`.
 *
 * ⚠ `aria-haspopup` IS SKIPPED ON PURPOSE. `InstitutionLink` carries
 * `aria-expanded={false}` AND `aria-haspopup="dialog"`; clicking it opens a modal
 * over the tab rather than revealing anything in it, and the walk would then be
 * measuring a dialog it never navigated to. A popup is not a disclosure.
 */
const disclosures = (panel) => [...panel.querySelectorAll('[aria-expanded]')]
  .filter(el => !el.hasAttribute('aria-haspopup'));

const closedDisclosures = (panel) => disclosures(panel)
  .filter(el => el.getAttribute('aria-expanded') === 'false');

/**
 * Open what a reader opens, and MEASURE EACH STATE — because half this dossier's
 * accordions hold ONE open row at a time.
 *
 * ⛔ "CLICK EVERY CLOSED ROW" IS NOT A WALK, IT IS A CLICK ORDER (review 13).
 * `PowerTab`'s `expandedFaction` and `ThePowers`' `openIdx` are single-valued:
 * opening row B closes row A. So a pass that clicked all nine closed rows left
 * exactly ONE open — whichever happened to be clicked last — and the eight it
 * measured nothing for were not a judgement about the dossier, they were an
 * artefact of document order. The counts that came out of that were stable only
 * because the click order was, and any re-ordering of the roster would have
 * moved them with nothing having changed on the page.
 *
 * So: open everything that STAYS open first, measure; then take every control
 * still declaring itself closed — each one is a row a single-valued sibling
 * pushed shut — open it in turn, and measure the state it puts the panel in.
 * Every measured element is recorded once by identity, so a line visible in two
 * states is counted once and the totals are a property of the surface rather
 * than of the route through it.
 *
 * Bounded twice over: four opening passes (opening one Section can reveal
 * another that is itself collapsed) and one round per control present at the
 * start, so a control that re-closes itself cannot spin here.
 *
 * @param {Element} panel
 * @param {(root: Element) => void} measure called once per settled state
 * @returns {string[]} what was opened one-at-a-time, in order — the record of the route
 */
function expandEverything(panel, measure) {
  for (let pass = 0; pass < 4; pass += 1) {
    const closed = closedDisclosures(panel);
    if (closed.length === 0) break;
    for (const el of closed) fireEvent.click(el);
  }
  measure(panel);

  const opened = [];
  const rounds = disclosures(panel).length;
  for (let i = 0; i < rounds; i += 1) {
    const el = disclosures(panel)[i];
    if (!el || el.getAttribute('aria-expanded') !== 'false') continue;
    fireEvent.click(el);
    if (el.getAttribute('aria-expanded') !== 'true') continue;   // refused to open; not ours to force
    opened.push((el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 60));
    measure(panel);
  }
  return opened;
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

  /** @type {{view: string, size: number, floor: number, kind: string, text: string}[]} */
  const violations = [];
  const visited = [];
  /** @type {string[]} */
  const markerAbuse = [];
  /** @type {Record<string, string[]>} */
  const routes = {};
  /** @type {Record<string, {prose: number, chrome: number, sub14: number, sub12: number}>} */
  const perView = {};
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
        // ⛔ NO FALLBACK-WORDING ASSERTION HERE, and its removal is a repair.
        // This line used to deny the panel two lazy-fallback wordings. One of
        // them exists NOWHERE in src/; the other is gated to a public dossier,
        // which this walk is not; and `#sf-panel-<id>` is rendered INSIDE the
        // Suspense boundary, so a panel and a fallback cannot be mounted at once
        // — the denial could not fail, on any settlement, at either width. The
        // panel-length floor below is the real wait, and is what actually proves
        // the chunk resolved.
        const text = p.textContent || '';
        expect(text.length).toBeGreaterThan(PANEL_MIN_CHARS);
      }, { timeout: 10_000 });
      const panel = container.querySelector(`#sf-panel-${tabId}`);
      const view = `${groupName}/${tabName}`;
      visited.push(view);

      perView[view] = { prose: 0, chrome: 0, sub14: 0, sub12: 0 };
      // Identity, not text: the same line is visible in more than one accordion
      // state, and counting it twice would make a total a property of the route.
      const counted = new Set();

      routes[view] = expandEverything(panel, (root) => {
        for (const el of root.querySelectorAll('[data-sf-chrome]')) {
          const why = markerRefusal(el);
          if (why && !counted.has(el)) {
            markerAbuse.push(`  ${view}  ::  ${why}\n      "${(el.textContent || '').trim().slice(0, 80)}"`);
          }
        }
        for (const el of measuredLines(root)) {
          if (counted.has(el)) continue;
          counted.add(el);
          const cs = getComputedStyle(el);
          const size = Number.parseFloat(cs.fontSize);
          if (!Number.isFinite(size)) continue;
          const chrome = isChrome(el, cs);
          const floor = chrome ? PHONE_CHROME_FLOOR : PHONE_PROSE_FLOOR;
          measured += 1;
          perView[view][chrome ? 'chrome' : 'prose'] += 1;
          if (size < PHONE_PROSE_FLOOR) perView[view].sub14 += 1;
          if (size < PHONE_CHROME_FLOOR) perView[view].sub12 += 1;
          if (size < floor) {
            violations.push({
              view,
              size,
              floor,
              kind: chrome ? 'chrome' : 'prose',
              text: (el.textContent || '').trim().slice(0, 70),
            });
          }
        }
      });
    }
  }
  return { violations, visited, measured, perView, markerAbuse, routes };
}

/** DESKTOP_BASELINE's shape, from the richer per-view record the walk now keeps. */
const desktopShape = (perView) => Object.fromEntries(
  Object.entries(perView).map(([view, v]) => [view, { measured: v.prose + v.chrome, sub14: v.sub14 }]),
);

/**
 * ⭐ THE DESKTOP BASELINE — AN EXACT PIN, NOT A "MORE THAN ZERO".
 *
 * The desktop arm exists to prove the floors are a PHONE rule: above the
 * breakpoint every `proseFontSize`/`chromeFontSize` call must be the identity,
 * so the dossier keeps its shipped 9, 10, 11, 11.5, 12, 12.5 and 13px steps. It
 * used to assert only `violations.length > 0`, and the walk finds hundreds of
 * sub-14px lines — so a mutant that floored all but one of them was green. It
 * was an anchor that could not drag.
 *
 * Every view's MEASURED count and its SUB-14 count are frozen here instead, from
 * a real run against the committed tree. Any desktop token that moves — a size
 * raised, a line deleted, a fold that stops rendering — moves a number and reds
 * with the view named. Re-measure and re-record it ONLY with the shift stated as
 * a deliberate change; a baseline edited to match a surprise is the golden-master
 * failure this repo keeps in its hazard list.
 *
 * ⭐ RE-MEASURED 2026-09-18 FOR THE DETERMINISTIC WALK, and both moves are the
 * instrument rather than the page — no desktop token changed:
 *   • Systems/Power 20 -> 29 (sub14 18 -> 27). `expandedFaction` holds ONE row
 *     at a time, so the old pass left whichever row document order clicked last
 *     open and measured nine roster descriptions not at all. They are opened in
 *     turn now and every one is measured.
 *   • Systems/Economics 35 -> 34. SupplyChainsPanel's legend carried its size on
 *     the STRIP, so the walk measured one element whose text was all five labels
 *     run together. The size moved down to the items, none of which reaches the
 *     forty-five characters at which anything is measured, so the artefact line
 *     is gone rather than any real one.
 */
const DESKTOP_BASELINE = Object.freeze({
  "Summary/Overview":    { measured: 19, sub14: 19 },
  "Summary/DM Summary":  { measured:  9, sub14:  8 },
  "Summary/Plot Hooks":  { measured: 59, sub14: 59 },
  "Systems/Services":    { measured: 64, sub14: 64 },
  "Systems/Economics":   { measured: 34, sub14: 34 },
  "Systems/Power":       { measured: 29, sub14: 27 },
  "Systems/Defense":     { measured: 26, sub14: 25 },
  "Systems/Resources":   { measured:  4, sub14:  4 },
  // 4 -> 5 (2026-09-19, browser pass 3 car 4): the receipt strip's culture line now reads the
  // identity's LABEL ("South-Asian-inspired") instead of a key, so it crosses the walk's
  // forty-five characters and is measured — and it is prose, so it takes the prose floor.
  "Systems/Outlook":     { measured:  5, sub14:  5 },
  "Systems/Causes":      { measured:  2, sub14:  2 },
  "Systems/Magic":       { measured:  1, sub14:  1 },
  "World/NPCs":          { measured: 46, sub14: 46 },
  "World/Relationships": { measured: 69, sub14: 68 },
  "World/Faith":         { measured:  1, sub14:  1 },
  "World/Daily Life":    { measured:  1, sub14:  1 },
  "World/Traditions":    { measured:  3, sub14:  3 },
  "World/History":       { measured: 19, sub14: 19 },
  "Notes/Chronicle":     { measured:  1, sub14:  1 },
});

/**
 * ⭐ THE MOBILE BASELINE — THE PHONE ARM'S OWN EXACT PIN.
 *
 * ⛔ "ZERO VIOLATIONS" IS NOT A MEASUREMENT, IT IS THE ABSENCE OF ONE (review
 * 13). The phone arm asserted an empty violations list and nothing else, so a
 * surface that stopped rendering satisfied it perfectly — and this file has
 * already been bitten by exactly that: the NPC roster scored ZERO at both widths
 * for its whole life because its cards ship collapsed. The per-view "contributed
 * something" floor catches a view that falls to nothing; it does not catch a
 * view that falls from forty-six lines to one.
 *
 * So the phone walk carries the same exact pin the desktop walk does, in the
 * shape that answers the phone's own question: how many lines were judged PROSE,
 * how many CHROME, and — the two that must be zero and stay zero — how many
 * rendered under 14px and under 12px.
 *
 * ⚠ SUB14 IS NOT THE FLOOR ASSERTION RESTATED, AND IT IS NOT ZERO. A CHROME line
 * at 12px is `sub14` and is perfectly lawful — that is what the chrome floor IS.
 * The seventeen sub14 lines counted here are exactly the dossier's declared
 * furniture sitting between 12 and 14, and freezing the number is what stops one
 * of them silently becoming a paragraph. `sub12` is the one that must stay zero,
 * and it duplicates nothing: the floors compare each line to ITS OWN floor, while
 * this says no line of either class renders under 12px at all.
 *
 * MEASURED, not asserted into existence: prose 372, chrome 18, sub14 17, sub12 0
 * over eighteen views, from the deterministic walk this car cut.
 *
 * Re-measure and re-record ONLY with the shift stated as a deliberate change.
 */
const MOBILE_BASELINE = Object.freeze({
  "Summary/Overview":    { prose: 17, chrome: 2, sub14: 1, sub12: 0 },
  "Summary/DM Summary":  { prose:  9, chrome: 0, sub14: 0, sub12: 0 },
  "Summary/Plot Hooks":  { prose: 56, chrome: 3, sub14: 3, sub12: 0 },
  "Systems/Services":    { prose: 64, chrome: 0, sub14: 0, sub12: 0 },
  "Systems/Economics":   { prose: 30, chrome: 3, sub14: 3, sub12: 0 },
  "Systems/Power":       { prose: 27, chrome: 2, sub14: 0, sub12: 0 },
  "Systems/Defense":     { prose: 26, chrome: 0, sub14: 0, sub12: 0 },
  "Systems/Resources":   { prose:  3, chrome: 1, sub14: 1, sub12: 0 },
  "Systems/Outlook":     { prose:  5, chrome: 0, sub14: 0, sub12: 0 },
  "Systems/Causes":      { prose:  2, chrome: 0, sub14: 0, sub12: 0 },
  "Systems/Magic":       { prose:  1, chrome: 0, sub14: 0, sub12: 0 },
  "World/NPCs":          { prose: 45, chrome: 1, sub14: 1, sub12: 0 },
  "World/Relationships": { prose: 63, chrome: 6, sub14: 6, sub12: 0 },
  "World/Faith":         { prose:  1, chrome: 0, sub14: 0, sub12: 0 },
  "World/Daily Life":    { prose:  1, chrome: 0, sub14: 0, sub12: 0 },
  "World/Traditions":    { prose:  3, chrome: 0, sub14: 0, sub12: 0 },
  "World/History":       { prose: 19, chrome: 0, sub14: 0, sub12: 0 },
  "Notes/Chronicle":     { prose:  1, chrome: 0, sub14: 0, sub12: 0 },
});

describe('THE PHONE FLOORS — every dossier view', () => {
  test(`every line in every tab clears its floor (prose ${PHONE_PROSE_FLOOR}px, chrome ${PHONE_CHROME_FLOOR}px) at phone width`, async () => {
    const { container } = render(<OutputContainer settlement={town} readOnly />);
    const { violations, visited, measured, perView, markerAbuse, routes } = await walkEveryView(container);

    // ── ANTI-VACUITY, asserted before the floors ─────────────────────────────
    expect(visited.length, `the walk visited ${visited.length} views: ${visited.join(', ')}`)
      .toBeGreaterThanOrEqual(MIN_VIEWS);
    expect(new Set(visited).size, 'the walk revisited a view instead of moving on')
      .toBe(visited.length);
    const silent = visited.filter(v => perView[v].prose + perView[v].chrome === 0 && !EMPTY_VIEWS[v]);
    expect(
      silent,
      `\n${silent.length} view(s) contributed NO measured line. Either the surface stopped `
      + 'rendering, or its prose is behind something the walk does not open — find out '
      + `which, and add it to EMPTY_VIEWS with the reason only if the emptiness is real:\n  ${silent.join('\n  ')}\n`,
    ).toEqual([]);
    expect(measured, 'the whole walk measured almost nothing').toBeGreaterThan(MIN_VIEWS);

    // ⛔ THE WALK MUST HAVE OPENED SOMETHING ONE AT A TIME. Every state after the
    // first exists because a single-valued accordion pushed a row shut, and the
    // roster tabs are full of them. An empty record means the second half of the
    // walk did nothing and the coverage is back to being a click order.
    const openedOneAtATime = Object.values(routes).reduce((n, r) => n + r.length, 0);
    expect(
      openedOneAtATime,
      `the walk opened nothing one-at-a-time across ${visited.length} views — `
      + 'either no accordion is single-valued any more, or the second pass stopped working',
    ).toBeGreaterThan(0);

    // ── THE DECLARED-CHROME MARKER, BOUNDED ──────────────────────────────────
    expect(
      markerAbuse,
      `\n${markerAbuse.length} element(s) carry data-sf-chrome where the marker is refused. `
      + 'It declares that a line is furniture no stylesheet betrays; it may not be stamped on a '
      + 'sentence, and it may not be stamped on a wrapper (there it claims a whole subtree). '
      + 'Move the size down to the lines that are really furniture, or drop the marker and let '
      + 'the shape tests judge it:\n'
      + `${markerAbuse.join('\n')}\n`,
    ).toEqual([]);

    // ── THE FLOORS ───────────────────────────────────────────────────────────
    const report = violations
      .map(v => `  ${v.size}px < ${v.floor}px  [${v.kind}]  ${v.view}  ::  ${v.text}`)
      .join('\n');
    expect(
      violations,
      `\n${violations.length} line(s) render below their phone floor.\n`
      + `Wrap prose in proseFontSize(<the desktop FS token>, mobile) and chrome in `
      + 'chromeFontSize(...) from src/design/proseScale.js, binding `mobile` once per '
      + 'component with useIsMobile() above any early return:\n'
      + `${report}\n`,
    ).toEqual([]);

    // ── THE EXACT PIN, so a surface cannot go 46 -> 1 and stay green ──────────
    expect(
      perView,
      '\nMOBILE_BASELINE mismatch. Each row counts the lines this view gave a reader at 375px, '
      + 'split by the class each was judged as, with the two sub-floor counts that must stay zero.\n'
      + 'A number that FELL means a surface stopped rendering or a fold stopped opening — which '
      + '"zero violations" cannot see. A number that ROSE means new lines; say so.\n'
      + 'Deliberate? Re-measure, re-record MOBILE_BASELINE in the same car, and name the cause in '
      + 'the commit message.\n',
    ).toEqual(MOBILE_BASELINE);
  }, 240_000);

  test('desktop is untouched — the SAME walk, pinned to DESKTOP_BASELINE', async () => {
    installMatchMedia(false);
    const { container } = render(<OutputContainer settlement={town} readOnly />);
    const { visited, perView } = await walkEveryView(container);

    expect(visited.length).toBeGreaterThanOrEqual(MIN_VIEWS);
    expect(
      desktopShape(perView),
      `\nDESKTOP_BASELINE mismatch. Each number counts lines rendered ABOVE the breakpoint, `
      + `so a diff means an FS token, a fold or a surface moved on desktop — which `
      + `proseFontSize/chromeFontSize (identity when mobile===false) must never do.\n`
      + `Deliberate? Re-measure, re-record DESKTOP_BASELINE in the same car, and name the `
      + `moved token in the commit message.\n`,
    ).toEqual(DESKTOP_BASELINE);

    // The floors are a PHONE rule, so the desktop walk must still be finding the
    // dossier's own smaller steps. Derived from the pin above rather than asserted
    // loosely, so the two can never disagree about the same run.
    const sub14 = Object.values(perView).reduce((n, v) => n + v.sub14, 0);
    expect(sub14, 'desktop renders NO line below 14px — the floors have stopped being a phone rule')
      .toBeGreaterThan(0);
  }, 240_000);
});
