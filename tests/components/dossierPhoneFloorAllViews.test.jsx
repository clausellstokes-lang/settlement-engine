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
import { withPublicProse } from '../../src/domain/display/publicProse.js';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';

/** A line long enough to be READ rather than glanced at — `chromeFontSize`'s own bound. */
const MIN_CHARS = 45;
/** The dossier's own group/sub-tab count, as a floor the walk cannot silently lose. */
// 18 -> 17 (2026-10-30, ODQ §934.101): the DM Summary tab is removed (X-5); 17 -> 18 the same day:
// the Institutions tab joins Systems (T1-14); 18 -> 20: War and Rumors & News are always registered (X-7a).
const MIN_VIEWS = 20;
/** A tab panel holding less text than this has not finished resolving its chunk.
 *  Measured against the SHORTEST real view (Faith's gated panel, ~160 chars), so
 *  the wait proves the chunk resolved without demanding a long tab. */
const PANEL_MIN_CHARS = 100;
/** The ONE tab whose correct rendering for this fixture is shorter than the floor, keyed by
 *  tab id. Its wait is EXACT TEXT (stronger than a length), and every other tab keeps the
 *  100-character floor. Add a row only for a ruled short form, with the ruling named. */
const SHORT_PANELS = Object.freeze({
  // Chair ruling 2026-10-30 (BUILD-T3 U4, Chronicle): the empty state is the one fact, the
  // pitch cut. This fixture is a fresh generated city with no save and no campaign events.
  chronicle: { text: 'No chronicle yet.' },
  // FOOD-2's viability row (2026-11-03, 'the verdict alone') RETIRED at MERGE-WAVE's GREEN-BASE point (2026-11-08): from the
  // W2 DEF merge point the fixture city's viability tab prints its verdict sentence ("Varaghat can stand, but only …", W2 DEF's
  // viability lines), so it is no longer a short form and takes the 100-character floor like every other tab (measured in
  // clean worktrees: the old text at ff2096d2b, the new at 2d9f47504 and every later point).
});

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
 * than about the dossier, and the reason must say which.
 */
const EMPTY_VIEWS = Object.freeze({
  // The fixture has no save and no campaign, so it has no chronicle; the empty state is the
  // ruled 17-character sentence (SHORT_PANELS above), below the 45-character measuring bound.
  'Notes/Chronicle': 'no events: a fresh unsaved city, empty state ruled to one fact (BUILD-T3 U4)',
  // MERGE-WAVE at the GREEN-BASE point (2026-11-08), born at the W4 PEOPLE merge point (measured in clean worktrees: present at
  // 95f31f192, empty from 0b967e6b3): WAVE-RULINGS #37 (W4's 86a30fdf2) made the daily-life offer the button's CAPTION, not a
  // body paragraph, and this fixture city has no generated daily life, so the view's one body line left with the ruling.
  'World/Daily Life': 'no daily life generated: a fresh city whose only line, the offer, is the button caption since WAVE-RULINGS #37 (W4 86a30fdf2)',
  // 'Systems/Magic' LEFT this list (lane MAGIC, 2026-11-03): the dependence block now draws on the
  // one reliance reading, which this fixture city reads as relied upon, so its stamped title and its
  // static explanation render on the public walk (the DS-DEF-9 corpus line stays gated, §885.3).
});

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
  // ⭐ STAMPED AS A SAVE STAMPS IT (SW-B7b, STYLE-RULINGS-2 B10(a)). `readOnly` with no saveId is
  // the SHARED page, which prints the owner's player-view draws shipped at the save
  // (`data.publicProse`); an unstamped town there is silent where a desk speaks. So the walk
  // measures the shared page a viewer actually meets: the town as its save path writes it.
  town = withPublicProse(town, composePublicProse(town));
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
        if (SHORT_PANELS[tabId]) expect(text).toBe(SHORT_PANELS[tabId].text);
        else expect(text.length).toBeGreaterThan(PANEL_MIN_CHARS);
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
// ── RE-MEASURED 2026-10-01, the urban band (ODQ §934.86): no desktop token moved. The fixture town is generated from
// a fixed seed and the rebuilt institution registry changed that world, so nine views' counts moved with it
// (Systems/Services 64 -> 96, Systems/Economics 34 -> 47, World/Relationships 69 -> 63, Summary/Overview 19 -> 20,
// Summary/Plot Hooks 59 -> 58, Systems/Power 29 -> 28, Systems/Defense 26 -> 28, Systems/Resources 4 -> 5,
// World/NPCs 46 -> 45); the rest hold. Re-measured by this file's own walk at the committed tree, not predicted.
// ── RE-MEASURED 2026-10-30 (cure lane T8): no token moved. Lane T3 consolidated the World group and
// the Chronicle (merge 37d627cd); the Chronicle's 17-character empty state held this walk red at its
// panel wait, so these falls landed unseen. History 19 -> 13 (H5 Recent Events, H7/H9 hooks cut),
// NPCs 45 -> 30 (7a2d1aa5), Relationships -4 (04002886), Traditions 3 -> 1 (a64a02f5), Chronicle 1 -> 0.
// ── RE-MEASURED 2026-10-31 (BUILD-W2-BLOCKLAW, X-18): no token moved. The Overview gains its one routing
// sentence under the identity strip (proseFontSize), one new line: Summary/Overview measured 19 -> 20, sub14 18 -> 19. The block-law moves
// (X-16) reorder lines and add none; every other view holds.
// ── RE-MEASURED 2026-11-02 (the fifth round, X-35..X-45): the content moved, no token did. The Overview lost
// the spatial layout and its routing line (X-37, X-38); the Institutions tab leads with the description and the
// service doors and gains a Backs row on every house (X-35, X-40, X-45); the ? pills add one chrome line per
// pilled section (X-42); the seat is named (X-43); the flush rule and the trimmed meta lines (X-38, X-44) move
// and drop lines across the Systems tabs. Each number below is what the walk measured on that view today.
// ── RE-MEASURED 2026-11-03 (FOOD-2, the food base numbers): content moved, no token did. The fixture city is
// fed by its hinterland now, so one food hook no longer fires (Summary/Plot Hooks 38 -> 37) and the Outlook
// loses one line (Systems/Outlook 2 -> 1); the Viability panel is the verdict alone (SHORT_PANELS).
// ── RE-MEASURED 2026-11-03 (lane WIRING-2, at the composed tip 71541a9e6): content moved, no token did. Three
// views lost one line each, bisected on git-archive exports: Summary/Plot Hooks 37 -> 36 (the HOOKS truth gate
// refuses one false hook on the fixture city; moves at 615def16c), Systems/Defense 26 -> 25 (TRIM X-50, two
// criminal operations that fall to one note print it once; moves at 291e4d876), Systems/Economics 40 -> 39
// (TRIM-2 X-50, the trade-route impact line prints once; moves at 71541a9e6). sub14 follows measured.
// ── RE-MEASURED 2026-11-06 (LANDING-7 lane F, at the landing tip 8e60cb2a5): content moved; every floor holds (zero
// violations). Bisected by stage over the first-parent chain e06899bb6..8e60cb2a5 (the walk run in a scratch worktree
// per probe): d4bf6431c x46-2 thresholds (Institutions 64 -> 63) · 060273d9c hooks-under-stress (Plot Hooks 36 -> 38) ·
// ac09ea83b terrain-pools (Relationships 61 -> 64) · 63bb72785 food-exports (Economics 39 -> 40) · 90dc22f18 x46-3
// budget (Services 97 -> 104, Economics 40 -> 42, Resources 4 -> 2, Defense 26 -> 25) · 6d84aa834 rung1b-f6 budget
// floor (Plot Hooks 38 -> 37, Institutions 63 -> 65, Services 104 -> 109, Relationships 64 -> 61). sub14 follows measured.
// ── RE-MEASURED 2026-11-07 (LANDING-R2, the pool census composed on rung 1's final 1bff51c6d): content moved, no token did;
// every floor holds. Two views, bisected by this file's walk (a probe copy) over the census lineage — rung 1's final and
// the merge base bf263a78d read the old pin; the compose's census-1b merge 0856c09d3 moves both; inside census-1b's
// first-parent line: e152ee220 (census-4 R8, the designer's threshold notes move off the page into the catalogue's own
// field; reached census-1b by the merge 950b75014) Institutions 65 -> 62 · b8fdcd3d5 (census-1e unit 1, the registry goal
// lookup resolves through the one rule: a stable entry under an active crisis is refused and the NPC keeps its role
// goal) NPCs 31 -> 23. sub14 follows measured.
// ── RE-MEASURED 2026-11-09 (SW-B7b, the economy desk's public branch lit; the walk is the SHARED page, `readOnly` with no
// saveId, so the fixture is stamped as its save stamps it): Economics 42 -> 46, Daily Life 0 -> 1; Resources holds (the
// rated `strategicValue` line left, DS-ECO-11's draw stands in its place). No token moved.
// ── RE-MEASURED 2026-11-09 (SW-B7b, the general desk's public branch lit, the same stamped walk): Overview 11/10 -> 12/11,
// Economics 46 -> 47, Outlook 2 -> 3, History 13 -> 15. No token moved.
const DESKTOP_BASELINE = Object.freeze({
  // RE-MEASURED ONCE at MERGE-TRAIN's final tip (2026-11-09, the allegiance train; BRIEF-MERGE-TRAIN §0.3, GREEN-BASE §4.4's form),
  // the same walk: World/NPCs 220 -> 284, bisected on the desktop walk at the merge points' stages — 220 at the base, CAR1 +3
  // (the hidden-allegiance badge rows, 4e55421ea), CAR2/CAR3 -1, CAR4 +62 (every card's short and long goal, A9 03ff59084); every other
  // view and point 0. The floors arm read one violation first (car 1's badge line at 12px prose), cured before this pin moved.
  // RE-MEASURED ONCE at MERGE-WAVE's GREEN-BASE point (2026-11-08, GREEN-BASE §4.4), the final merged tree: the people car's rows
  // (8dff691f3: World/NPCs 23 -> 220, World/Relationships 61 -> 178, Summary/Plot Hooks 37 -> 88 with the car's one hook per face)
  // and the wave's lines (Systems/Power 22 -> 30, Services 109 -> 104, Resources 2 -> 1, Outlook 1 -> 2; World/Daily Life 1 -> 0,
  // WAVE-RULINGS #37). Per-view attribution to single lanes is PLAUSIBLE (not bisected per view). No desktop FS token moved.
  "Summary/Overview":    { measured: 12, sub14: 11 },
  // T2-25 measured it at 1 under Systems/Causes; X-12 moves it here (BUILD-T1), same count.
  "Summary/Foundations": { measured: 1, sub14: 1 },
  // 37 -> 38 (2026-10-31, the G2 + W2-LINKS composition at the integration merge): one conflict line more in
  // the fixture now that conflict parties are power factions (X-26a); no token moved. Relationships likewise 59 -> 60.
  "Summary/Plot Hooks":  { measured: 88, sub14: 88 },
  "Systems/Services":    { measured: 104, sub14: 104 },
  "Systems/Institutions": { measured: 71, sub14: 71 }, // T1-14, measured 2026-10-30 by this walk; 62 → 71 OWNER-WORDS-DOSSIER item 1 (2026-11-09): the nine face rows each gain the "Connection:" label, a line of its own
  // 47 -> 40 (2026-10-30, UX consolidation U1, RULINGS-T2 T2-1..T2-8): no desktop token moved; the page lost
  // its duplicates (Economy/Food tiles, the Supply Chains rows, the Resource Exploitation chips, the plot hooks).
  "Systems/Economics":   { measured: 47, sub14: 47 },
  // 28 -> 22 (2026-10-30, UX consolidation U5, T2-17..T2-19): Current Tensions, Active Conflicts and the
  // duplicate governing rows left the page; no token moved.
  "Systems/Power":       { measured: 29, sub14: 28 }, // 30 -> 29 OWNER-WORDS-DOSSIER item 3 (2026-11-09): the vignette line and the DS-POW-1/2 readings became one paragraph
  // 28 -> 27 (2026-10-30, UX consolidation U6, T2-20..T2-23): the duplicate order headline, the first-survey
  // beside line, the Economic Backing row and the empty-state line left the page; no token moved.
  // 27 -> 26 (2026-10-30, cure lane T11 U3, VERIFIER F11 / X-2): the fixture town's one order & crime plot
  // hook left the Defense page for the Plot Hooks tab; no token moved (bisected: 317307cc green, 987602c0 moves it).
  // 25 -> 26 (2026-11-04, REGISTERS-4 door 7, measured at the composed tip): DEFENSE-3's X-52 food endurance line
  // (8e9de64b9, the siege reading of the stores) adds one prose line on WIRING-2's re-measure; no token moved.
  "Systems/Defense":     { measured: 25, sub14: 25 },
  // 5 -> 4 (2026-10-30, UX consolidation U2, T2-10): the "Depleted. Consumed locally, export potential
  // reduced" label shortened to "Depleted" and fell under the walk's measuring length; no token moved.
  "Systems/Resources":   { measured: 1, sub14: 1 },
  // 4 -> 5 (2026-09-19, browser pass 3 car 4): the receipt strip's culture line now reads the
  // identity's LABEL ("South-Asian-inspired") instead of a key, so it crosses the walk's
  // forty-five characters and is measured — and it is prose, so it takes the prose floor.
  // 5 -> 2 (2026-10-30, UX consolidation U3, T2-11..T2-14): the coaching caption and the generation receipt
  // (moved to Versions) left the page; no token moved.
  "Systems/Outlook":     { measured: 3, sub14: 3 },
  // 1 -> 2 (2026-10-30, UX consolidation): the posture sentence became a word (T2-26) and the dependence
  // block arrived from Outlook (T2-15): its DS-DEF-9 line (prose) and its stamped title (chrome).
  // 0 -> 4 (2026-11-03, lane MAGIC, chair ruling 2): the dependence block reads the one reliance reading
  // instead of the siege/famine/plague flag, so the fixture's block renders on the public walk: its title
  // (chrome), its static explanation and its chain notes (prose). No token moved.
  "Systems/Magic":       { measured: 4, sub14: 4 },
  "World/NPCs":          { measured: 284, sub14: 284 },
  // 60 -> 61 / 58 -> 59 and mobile 58 -> 59 (2026-10-31, G3 at the merge, GS-1): the eight-variant tie lines wrap one
  // line longer in the fixture; no token moved.
  "World/Relationships": { measured: 178, sub14: 176 },
  "World/Faith":         { measured: 1, sub14: 1 },
  "World/Daily Life":    { measured: 1, sub14: 1 },
  "World/Rumors & News": { measured: 1, sub14: 1 }, // X-7a launch teaser (BUILD-T1 registers it always)
  "World/War":           { measured: 1, sub14: 1 }, // X-7a launch teaser, same
  "World/Traditions":    { measured: 1, sub14: 1 },
  "World/History":       { measured: 15, sub14: 15 },
  "Notes/Chronicle":     { measured: 0, sub14: 0 }, // 1 -> 0: the empty-state pitch cut (BUILD-T3 U4)
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
// ── RE-MEASURED 2026-10-01, the urban band (ODQ §934.86): the same fixture town, a re-generated world. Totals prose
// 373 -> 418, chrome 18 -> 13, sub14 15 -> 11, sub12 0 -> 0 (the one that must stay zero stays zero, and every
// line still clears its floor: the floors arm above is green on this walk). Nine views moved, nine hold.
// ── RE-MEASURED 2026-10-30 (cure lane T8): no token moved. Lane T3 consolidated the World group and
// the Chronicle (merge 37d627cd); the Chronicle's 17-character empty state held this walk red at its
// panel wait, so these falls landed unseen. History 19 -> 13 (H5 Recent Events, H7/H9 hooks cut),
// NPCs 45 -> 30 (7a2d1aa5), Relationships -4 (04002886), Traditions 3 -> 1 (a64a02f5), Chronicle 1 -> 0.
// ── RE-MEASURED 2026-10-31 (BUILD-W2-BLOCKLAW, X-18): no token moved. The Overview gains its one routing
// sentence under the identity strip (proseFontSize), one new line: Summary/Overview prose 18 -> 19. The block-law moves
// (X-16) reorder lines and add none; every other view holds.
// ── RE-MEASURED 2026-11-02 (the fifth round, X-35..X-45): the content moved, no token did. The Overview lost
// the spatial layout and its routing line (X-37, X-38); the Institutions tab leads with the description and the
// service doors and gains a Backs row on every house (X-35, X-40, X-45); the ? pills add one chrome line per
// pilled section (X-42); the seat is named (X-43); the flush rule and the trimmed meta lines (X-38, X-44) move
// and drop lines across the Systems tabs. Each number below is what the walk measured on that view today.
// ── RE-MEASURED 2026-11-03 (FOOD-2, the food base numbers): content moved, no token did. The fixture city is
// fed by its hinterland now, so one food hook no longer fires (Summary/Plot Hooks 38 -> 37) and the Outlook
// loses one line (Systems/Outlook 2 -> 1); the Viability panel is the verdict alone (SHORT_PANELS).
// ── RE-MEASURED 2026-11-03 (lane WIRING-2, at the composed tip 71541a9e6): content moved, no token did. Summary/
// Plot Hooks 37 -> 36 (the HOOKS truth gate refuses one false hook), Systems/Defense 24 -> 23 (TRIM X-50, a shared
// criminal note printed once), Systems/Economics 33 -> 32 (TRIM-2 X-50, the trade-route impact line once). The
// sub-floor counts hold.
// ── RE-MEASURED 2026-11-06 (LANDING-7 lane F, at 8e60cb2a5): content moved; sub12 stays zero and the floors arm is
// green. The same six stages as the desktop note: x46-2 (Institutions 63 -> 62), hooks-under-stress (Plot Hooks
// 36 -> 38), terrain-pools (Relationships chrome 2 -> 5), food-exports (Economics prose 32 -> 33), x46-3 budget
// (Services 96 -> 103, Economics 33/7 -> 34/8, Resources 4 -> 2, Defense 24 -> 23, Relationships 59/5 -> 57/7),
// rung1b-f6 floor (Plot Hooks 38 -> 37, Institutions 62 -> 64, Services 103 -> 108, Relationships 57/7 -> 58/3).
// ── RE-MEASURED 2026-11-07 (LANDING-R2, the pool census composed): content moved, no token did; sub12 stays zero and the
// floors arm is green. The same two steps as the desktop note: e152ee220 census-4 R8 (Institutions prose 64 -> 61) and
// b8fdcd3d5 census-1e unit 1 (NPCs prose 30 -> 22); chrome and both sub-floor counts hold.
// ── RE-MEASURED 2026-11-09 (SW-B7b, the economy desk's public branch lit; the fixture now STAMPED as its save stamps it):
// Economics prose 34 -> 38 (the desk's shipped lines; the legacy situationDesc lead left), Daily Life 0 -> 1 (DS-ECO-8);
// the food-security line took the tab's prose floor (proseFontSize), so sub12 stays zero and the floors arm is green.
// ── RE-MEASURED 2026-11-09 (SW-B7b, the general desk's public branch lit): Overview prose 10 -> 11, Economics 38 -> 39
// (DS-GEN-18's craft line), Outlook 2 -> 3, History 13 -> 15; chrome and both sub-floor counts hold.
const MOBILE_BASELINE = Object.freeze({
  // RE-MEASURED ONCE at MERGE-TRAIN's final tip (2026-11-09, the allegiance train; BRIEF-MERGE-TRAIN §0.3, GREEN-BASE §4.4's form),
  // the same walk: World/NPCs 219 -> 283, bisected on the desktop walk at the merge points' stages — 220 at the base, CAR1 +3
  // (the hidden-allegiance badge rows, 4e55421ea), CAR2/CAR3 -1, CAR4 +62 (every card's short and long goal, A9 03ff59084); every other
  // view and point 0. The floors arm read one violation first (car 1's badge line at 12px prose), cured before this pin moved.
  // RE-MEASURED ONCE at MERGE-WAVE's GREEN-BASE point (2026-11-08, GREEN-BASE §4.4), the same walk at 375px: the people car's
  // rows (8dff691f3) and GREEN-BASE's 27b858fd9 (the car's rows on the PROSE floor) with the wave's lines; World/Relationships
  // chrome 3 -> 39 (the car's tie cards' chrome rows, all >= 12px). sub12 stays 0 in every view; the floors arm reads 0 violations.
  "Summary/Overview":    { prose: 11, chrome: 1, sub14: 0, sub12: 0 },
  "Summary/Foundations": { prose: 1, chrome: 0, sub14: 0, sub12: 0 },
  // 37 -> 38 and Relationships 57 -> 58 (2026-10-31, the G2 + W2-LINKS composition at the merge): one conflict
  // line more (X-26a); both sub-floor counts stay where they were.
  "Summary/Plot Hooks":  { prose: 88, chrome: 0, sub14: 0, sub12: 0 },
  "Systems/Services":    { prose: 103, chrome: 1, sub14: 0, sub12: 0 },
  "Systems/Institutions": { prose: 70, chrome: 1, sub14: 0, sub12: 0 }, // 61 → 70 OWNER-WORDS-DOSSIER item 1 (2026-11-09): the nine "Connection:" labels, each at the prose floor
  // prose 39 -> 33 (2026-10-30, UX consolidation U1): the duplicate blocks left the page; no floor moved.
  "Systems/Economics":   { prose: 39, chrome: 8, sub14: 8, sub12: 0 },
  // prose 27 -> 21 (2026-10-30, UX consolidation U5): tensions, conflicts and the duplicate rows left.
  "Systems/Power":       { prose: 28, chrome: 1, sub14: 0, sub12: 0 }, // 29 -> 28 OWNER-WORDS-DOSSIER item 3 (2026-11-09): the governance block is one paragraph
  // prose 27 -> 25, chrome 1 -> 2 (2026-10-30, UX consolidation U6): the criminal faction is now one
  // name-and-band chrome line (12px floor, lawful) instead of a description paragraph.
  // prose 25 -> 24 (2026-10-30, cure lane T11 U3, VERIFIER F11 / X-2): the inline order & crime hook is cut.
  // prose 23 -> 24 (2026-11-04, REGISTERS-4 door 7, measured at the composed tip): DEFENSE-3's X-52 food endurance
  // line (8e9de64b9) adds one prose line on WIRING-2's re-measure; the sub-floor counts hold.
  "Systems/Defense":     { prose: 23, chrome: 2, sub14: 2, sub12: 0 },
  // chrome 1 -> 0 (2026-10-30, UX consolidation U2): the long Depleted label is now one word.
  "Systems/Resources":   { prose: 1, chrome: 0, sub14: 0, sub12: 0 },
  // prose 5 -> 2 (2026-10-30, UX consolidation U3): the caption and the receipt left the page.
  "Systems/Outlook":     { prose: 3, chrome: 0, sub14: 0, sub12: 0 },
  // prose 1, chrome 0 -> 1 (2026-10-30, UX consolidation): the dependence block's line and its title.
  // prose 0 -> 3, chrome 0 -> 1 (2026-11-03, lane MAGIC, chair ruling 2): the dependence block reads the one
  // reliance reading; its title is the 12px chrome line, its explanation and chain notes take the prose floor.
  "Systems/Magic":       { prose: 3, chrome: 1, sub14: 1, sub12: 0 },
  "World/NPCs":          { prose: 283, chrome: 1, sub14: 0, sub12: 0 },
  "World/Relationships": { prose: 139, chrome: 39, sub14: 39, sub12: 0 },
  "World/Faith":         { prose: 1, chrome: 0, sub14: 0, sub12: 0 },
  "World/Daily Life":    { prose: 1, chrome: 0, sub14: 0, sub12: 0 },
  "World/Rumors & News": { prose: 1, chrome: 0, sub14: 0, sub12: 0 },
  "World/War":           { prose: 1, chrome: 0, sub14: 0, sub12: 0 },
  "World/Traditions":    { prose: 1, chrome: 0, sub14: 0, sub12: 0 },
  "World/History":       { prose: 15, chrome: 0, sub14: 0, sub12: 0 },
  "Notes/Chronicle":     { prose: 0, chrome: 0, sub14: 0, sub12: 0 }, // 1 -> 0: the pitch cut (BUILD-T3 U4)
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
