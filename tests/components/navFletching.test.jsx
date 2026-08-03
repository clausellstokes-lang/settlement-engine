/**
 * @vitest-environment jsdom
 *
 * tests/components/navFletching.test.jsx — THE FLETCHED RIBBON (owner directive,
 * 2026-08-03; lane FL).
 *
 * The order: Create · Library · Realm stop being three separate tabs and become
 * ONE leather-brown band of three feathers whose parallel edges lean FORWARD,
 * toward Realm — the back half of an arrow in flight. The reference tabs beyond
 * it stay plain, because the hierarchy between "the journey" and "the shelf" IS
 * the point. This file pins the four claims that make the band safe to ship, and
 * it exists because three of them are invisible to the eye and to every other
 * suite:
 *
 *   1. THE BAND'S MEMBERSHIP IS DERIVED, NOT LISTED. It is the maximal NAV run
 *      whose consecutive pairs are declared in routes.js NAV_FLOW, read through
 *      the one predicate that owns that declaration (NavFlowArrow.flowsInto). A
 *      hardcoded trio would silently keep painting the wrong tabs after a nav
 *      reorder — the exact second truth routes.js:163 exists to forbid.
 *
 *   2. ⚠️⚠️ THE OVERHANG IS PAINT, NEVER LAYOUT. The band's brown extends
 *      FLETCH.overhang px BELOW the ribbon, and it MUST do so without adding one
 *      pixel to any box. This is the load-bearing one: theme.js derives
 *      ANCHOR_OFFSET from CHROME.headerDesktop, and every About / guide /
 *      Compendium / dossier in-page anchor lands on that number. A margin, a
 *      padding, a height or a negative offset here would push the sticky header
 *      taller and every anchor in the estate would land 4px worse — a defect no
 *      nav test would ever see. So both halves are pinned: the derivation chain,
 *      and the ABSENCE of any box that spends the overhang.
 *
 *      ⚠️ NEVER PIN THE SUM (v2 directive §1). Every assertion here names
 *      `CHROME.headerDesktop + SP.xxl`, not the number it happens to evaluate to.
 *      A pin on the literal survives an edit that BREAKS the derivation and fails
 *      on an edit that HONOURS it, which is exactly backwards; the literals below
 *      appear only as a second, clearly-labelled today's-value line so a reader
 *      knows what the bar currently measures.
 *
 *      ⚠️ jsdom HAS NO LAYOUT, so this file can only pin the STRUCTURE that makes
 *      the overhang paint-only; the height itself was proved in a real browser and
 *      the receipt is recorded here so nobody re-derives it. V1's receipt at
 *      1440×900 read header 124px / nav 100px on BOTH base and the fletched tree —
 *      zero layout cost, but also 124 against a constant that said 60. V2 found
 *      the cause rather than moving the number: NavDivider's SVG was IN FLOW with
 *      `height="100%"` against an indefinite parent, so it fell back to its own
 *      viewBox height of 100 and that set the header's flex line. With the SVG out
 *      of flow and the header spending CHROME.headerDesktop as its min-height, the
 *      SAME measurement now reads header 48 / nav 47 / main-top 48 / every divider
 *      box 47 — so the derivation is TRUE, not merely tidy. The structural half of
 *      that repair is pinned in tests/components/navDividers.test.jsx.
 *
 *   3. ⚠️ THE CLIP NEVER TOUCHES A FOCUSABLE ELEMENT. `clip-path` clips an
 *      element's whole rendering INCLUDING its outline, and a11y.css draws the
 *      global focus ring as `outline: 3px` at a positive `outline-offset` —
 *      entirely OUTSIDE the border box. Clipping the <button> would therefore
 *      swallow the keyboard focus ring while leaving every visual test green.
 *      The feather shape is painted by an aria-hidden VANE layer inside the
 *      button; neither the button nor any ancestor of it may carry a clip-path
 *      or an `overflow: hidden`, and this file asserts the whole chain.
 *
 *   4. THE ACTIVE FEATHER BRIGHTENS WITH THE EXISTING GOLD GRAMMAR, on four
 *      channels — lifted fill, brighter label, brighter gilt + gold underline, and
 *      aria-current="page" — so the state never rests on colour alone. ⚠️ WEIGHT
 *      IS NO LONGER ONE OF THEM. V2 fixes every feather label at 600 under the
 *      BALANCE LAW, which is precisely why the directive added the brighter gilt:
 *      a channel was spent, so a channel was replaced. The test that used to
 *      assert 700-on-active now asserts 600-on-BOTH, and the replacement channel
 *      is asserted beside it, so the swap cannot be half-made.
 *
 *   5. THE FIVE STACKED DEVICES STAY DIALLED DOWN (the BALANCE LAW). Band, slant,
 *      gilt, texture and weight all now emphasise the same three cells. The pins
 *      hold each one's dialled-down value — the gilt is FLETCH.gilt px and not
 *      more, the label weight is 600 and not 700 — so "turn them all up" fails
 *      here rather than shipping.
 *
 * The mobile bottom nav is untouched by the directive and is pinned here as the
 * negative control: no band, no feather, no paint.
 *
 * App.jsx is a pure layout shell over the Zustand store + path router, so the
 * store, the route hook, the breakpoint hook and the routed view are stubbed —
 * the render then exercises only the nav chrome under test (the sibling suites'
 * idiom, kept identical on purpose). The active/resting A/B renders NavRibbon as
 * a LEAF, so a register can be observed without mounting a lazy view.
 */

import React from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import { NAV, NAV_FLOW } from '../../src/lib/routes.js';
import { flowsInto } from '../../src/components/nav/NavFlowArrow.jsx';
import {
  ANCHOR_OFFSET, BODY, CHROME, FLETCH, FLETCH_BARB, FLETCH_BARB_DEG, FLETCH_BARB_LIFT,
  FLETCH_BROWN, FLETCH_BROWN_LIFT, GILT, GILT_ACTIVE, GILT_BLOOM, GOLD_TXT, PARCH, PARCH_100,
  SHAFT_GRAIN, SHAFT_GRAIN_DEEP, SHAFT_GRAIN_LAYERS, SP,
} from '../../src/components/theme.js';

const H = vi.hoisted(() => ({
  route: { view: 'generate', params: {}, legacy: false, notFound: false },
  isMobile: false,
  storeState: null,
}));

// The house idiom for App-mounting tests: mock analytics so its lazy event-dictionary
// import can never race environment teardown (the welcomeJourney precedent).
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: {},
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

vi.mock('../../src/hooks/useRoute.js', () => ({
  useRoute: () => H.route,
  navigate: vi.fn(),
  replacePath: vi.fn(),
}));

vi.mock('../../src/lib/supabase.js', () => ({
  hasStoredAuthToken: () => false,
  isConfigured: false,
  supabase: { auth: { getUser: () => Promise.resolve({ data: { user: null } }) } },
}));

vi.mock('../../src/hooks/useIsMobile', () => ({ default: () => H.isMobile }));

vi.mock('../../src/lib/stripe.js', () => ({
  checkCheckoutResult: () => null,
  fetchCreditBalance: () => Promise.resolve(0),
}));

// Sever the pricing surface's lazy stripe->creditLedger chain at the component
// boundary — this suite tests the nav ribbon, not pricing internals, and the
// chain's dynamic import races environment teardown under gate load.
vi.mock('../../src/components/pricing/PricingMomentCard.jsx', () => ({
  default: () => null,
}));

vi.mock('../../src/components/GenerateWizard.jsx', () => ({
  default: () => <div data-testid="generate-view">create</div>,
}));

function makeState(overrides = {}) {
  return {
    authModalOpen: false,
    setAuthModalOpen: vi.fn(),
    auth: { tier: 'anon', displayName: null, role: null, user: null, loading: false },
    isElevated: () => false,
    wizardMode: null,
    settlement: null,
    initAuth: vi.fn(),
    authSignOut: vi.fn(),
    onboardingNudge: null,
    clearOnboardingNudge: vi.fn(),
    purchaseModalOpen: false,
    setPurchaseModalOpen: vi.fn(),
    setCreditBalance: vi.fn(),
    creditBalance: 0,
    loadCampaigns: vi.fn(),
    loadCustomContentFromCloud: vi.fn(() => Promise.resolve()),
    migrateLocalCustomContentToCloud: vi.fn(() => Promise.resolve()),
    clearCloudCustomContent: vi.fn(),
    setActivePricingMoment: vi.fn(),
    canSave: () => false,
    activeSaveId: null,
    savedSettlements: [],
    campaignSyncError: null,
    clearCampaignSyncError: vi.fn(),
    ...overrides,
  };
}

vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(H.storeState);
  useStore.getState = () => H.storeState;
  return { useStore };
});

import App from '../../src/App.jsx';
import NavRibbon from '../../src/components/nav/NavRibbon.jsx';

/** cssstyle normalizes authored hex to rgb(); compare through one converter. */
function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}

const feathers = (c) => [...c.querySelectorAll('[data-nav-cell="feather"]')];
const plains = (c) => [...c.querySelectorAll('[data-nav-cell="plain"]')];
const label = (b) => b.textContent.trim();

/** The membership the DERIVATION demands, computed here the long way round. */
function derivedBandIds() {
  return NAV.filter((n, i) => flowsInto(n.id, NAV[i + 1]?.id) || flowsInto(NAV[i - 1]?.id, n.id))
    .map((n) => n.id);
}

beforeEach(() => {
  H.route = { view: 'generate', params: {}, legacy: false, notFound: false };
  H.isMobile = false;
  H.storeState = makeState();
  window.history.replaceState(null, '', '/create');
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('1 — the band’s membership is DERIVED from the flow, never listed', () => {
  test('the rendered feathers are exactly the declared flow run', () => {
    const { container } = render(<App />);
    expect(feathers(container).map(label)).toEqual(['Create', 'Library', 'Realm']);
    // …and that trio is not typed in: it is what the predicate answers.
    expect(derivedBandIds()).toEqual(['generate', 'settlements', 'realm']);
    expect(feathers(container).map(label))
      .toEqual(derivedBandIds().map((id) => NAV.find((n) => n.id === id).label));
  });

  test('the reference tabs stay plain — the hierarchy IS the point', () => {
    const { container } = render(<App />);
    expect(plains(container).map(label)).toEqual(['Compendium', 'Gallery', 'About']);
    // Totality: every nav cell is one register or the other, none is both.
    const all = [...container.querySelectorAll('header nav button')];
    expect(all.length).toBe(NAV.length);
    expect(feathers(container).length + plains(container).length).toBe(NAV.length);
  });

  test('there is exactly ONE band, and it wraps exactly the feathers', () => {
    const { container } = render(<App />);
    const bands = [...container.querySelectorAll('[data-testid="nav-fletch-band"]')];
    expect(bands.length).toBe(1);
    // Every feather is inside it; no plain tab is.
    for (const f of feathers(container)) expect(bands[0].contains(f)).toBe(true);
    for (const p of plains(container)) expect(bands[0].contains(p)).toBe(false);
  });

  test('a cell with no declared flow neighbour can never be fletched', () => {
    // The negative control the derivation needs: NAV_FLOW names two pairs, and
    // the band is exactly their union. If this ever grew, the predicate stopped
    // being the source and something restated the trio.
    const declared = new Set(Object.entries(NAV_FLOW).flat());
    expect(new Set(derivedBandIds())).toEqual(declared);
    for (const id of ['compendium', 'gallery', 'about-what-this-is', 'home']) {
      expect(derivedBandIds()).not.toContain(id);
    }
  });
});

describe('2 — ⚠️⚠️ the overhang is PAINT, and the layout box stays exactly CHROME.headerDesktop', () => {
  test('the anchor derivation chain the overhang must not disturb', () => {
    // This is the reason clause 2 exists. Pinned here, beside the thing that could
    // break it, rather than only in the theme. THE DERIVATION IS THE CLAIM: assert
    // the sum's SHAPE, never the number it currently reaches, so that slimming the
    // shaft again moves this pin's expectation with it instead of failing it.
    expect(ANCHOR_OFFSET).toBe(CHROME.headerDesktop + SP.xxl);
    // Today's values, recorded so a reader knows the bar without running it — and
    // deliberately in a SEPARATE assertion from the derivation above, so a future
    // resize edits one line that is obviously a record and never the invariant.
    expect(CHROME.headerDesktop).toBe(48);
    expect(ANCHOR_OFFSET).toBe(72);
  });

  test('the barb angle is DERIVED from the slant and the bar, never spelled', () => {
    // The texture has to lie parallel to the edge of the feather carrying it. That
    // is a relationship between two numbers, so it is pinned as one: change the
    // slant or the bar height and the angle must follow, unasked.
    expect(FLETCH_BARB_DEG).toBe(
      90 + Math.round((Math.atan2(FLETCH.slant, CHROME.headerDesktop) * 180) / Math.PI),
    );
    expect(FLETCH_BARB_DEG).toBe(102); // today's value
    // NEGATIVE CONTROL: the barbs and the shaft grain must not share a direction,
    // or the two textures interfere where a feather meets bare wood. The grain is
    // horizontal (a 180deg gradient line); the barbs may never be.
    expect(FLETCH_BARB_DEG % 180).not.toBe(0);
    expect(SHAFT_GRAIN_LAYERS).toContain('180deg');
    expect(SHAFT_GRAIN_LAYERS).not.toContain(`${FLETCH_BARB_DEG}deg`);
  });

  test('the shaft grain is two layers whose periods are COPRIME, so it cannot tile visibly', () => {
    // Non-vacuity: there really are two streak layers on the plank.
    expect((SHAFT_GRAIN_LAYERS.match(/repeating-linear-gradient/g) || []).length).toBe(2);
    // The periods are the last stop of each layer. 13 and 29 are coprime, so the
    // combined figure repeats every 377px — against a 48px bar, never twice.
    expect(SHAFT_GRAIN_LAYERS).toContain('transparent 13px');
    expect(SHAFT_GRAIN_LAYERS).toContain('transparent 29px');
    const gcd = (a, b) => (b ? gcd(b, a % b) : a);
    expect(gcd(13, 29)).toBe(1);
    expect(13 * 29).toBeGreaterThan(CHROME.headerDesktop * 4);
    // Both streak tones are named, and the DARKEST is the one every label on the
    // shaft owes its AA to (measured in tests/design/contrast.test.js).
    expect(SHAFT_GRAIN_LAYERS).toContain(SHAFT_GRAIN);
    expect(SHAFT_GRAIN_LAYERS).toContain(SHAFT_GRAIN_DEEP);
  });

  test('the paint layer is a zero-inset absolute box — it is not in flow at all', () => {
    const { container } = render(<App />);
    const paint = container.querySelector('[data-testid="nav-fletch-paint"]');
    expect(paint).toBeTruthy();
    expect(paint.style.position).toBe('absolute');
    for (const side of ['top', 'right', 'bottom', 'left']) {
      expect(paint.style[side], `paint.${side} must be flush with the band`).toBe('0px');
    }
    expect(paint.getAttribute('aria-hidden')).toBe('true');
    expect(paint.style.pointerEvents).toBe('none');
    expect(paint.textContent).toBe('');
  });

  test('the overhang exists, and exists ONLY as a filter', () => {
    const { container } = render(<App />);
    const paint = container.querySelector('[data-testid="nav-fletch-paint"]');
    // NON-VACUITY FIRST: the overhang is really drawn. Without this, the absence
    // census below would pass just as happily on a band that had lost it.
    // (cssstyle normalizes `background` to rgb() but leaves `filter` verbatim.)
    // The filter now carries TWO shadows: the brown overhang, then the gilt bloom.
    // Both are pinned, in order, because "still has a filter" is not the claim.
    expect(paint.style.filter).toBe(
      `drop-shadow(0 ${FLETCH.overhang}px 0 ${FLETCH_BROWN})`
      + ` drop-shadow(0 0 ${FLETCH.bloom}px ${GILT_BLOOM})`,
    );
  });

  test('the gilt is a HAIRLINE around the fletching, not a second fill', () => {
    const { container } = render(<App />);
    const paint = container.querySelector('[data-testid="nav-fletch-paint"]');
    const fill = container.querySelector('[data-testid="nav-fletch-fill"]');
    expect(fill).toBeTruthy();
    // The outer layer is the GILT, the inner one the brown body, and the ONLY
    // thing that turns the outer into an edge rather than a gold band is the
    // inset. Pin all three together — any one alone is satisfiable by a bug.
    expect(paint.style.background).toContain(rgb(GILT));
    expect(fill.style.background).toContain(rgb(FLETCH_BROWN));
    expect(fill.style.inset).toBe(`${FLETCH.gilt}px`);
    expect(FLETCH.gilt).toBe(1); // dialled down: a hairline, per the BALANCE LAW
    // The body carries the barbs, at the derived angle, in the opaque darkest step
    // the contrast suite measures the label against.
    expect(fill.style.backgroundImage).toContain(`${FLETCH_BARB_DEG}deg`);
    expect(fill.style.backgroundImage).toContain(rgb(FLETCH_BARB));
    // NEGATIVE CONTROL: the gilt layer itself must not also carry the texture, or
    // the hairline would be a dotted line rather than an edge. (The `background`
    // shorthand resets backgroundImage to the literal 'none', so the honest
    // assertion is "no gradient", not "falsy".)
    expect(paint.style.backgroundImage).not.toContain('gradient');
  });

  test('NO element in the ribbon spends the overhang on a LAYOUT property', () => {
    const { container } = render(<App />);
    const nav = container.querySelector('header nav');
    const nodes = [nav, ...nav.querySelectorAll('*')];
    expect(nodes.length).toBeGreaterThan(10); // not a vacuous walk
    const LAYOUT = [
      'height', 'minHeight', 'maxHeight',
      'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom',
      'top', 'bottom', 'transform',
    ];
    const over = `${FLETCH.overhang}px`;
    for (const el of nodes) {
      if (!el.style) continue;
      for (const prop of LAYOUT) {
        const v = el.style[prop];
        if (!v) continue;
        expect(
          String(v).includes(over),
          `<${el.tagName}> spends the overhang on ${prop}: ${v}`,
        ).toBe(false);
      }
      // And no negative pull either — the other way to fake an overhang.
      for (const prop of ['marginBottom', 'bottom', 'marginTop', 'top']) {
        const v = el.style[prop];
        if (v) expect(String(v).startsWith('-'), `<${el.tagName}> ${prop}=${v}`).toBe(false);
      }
    }
  });
});

describe('3 — ⚠️ the clip never touches a focusable element, so the focus ring survives', () => {
  test('the clipped layers are the aria-hidden vanes, never the buttons', () => {
    const { container } = render(<App />);
    const clipped = [...container.querySelectorAll('header nav *')]
      .filter((el) => el.style?.clipPath);
    // Non-vacuity: something really is clipped — and the count is stated as the
    // STRUCTURE that produces it, not as a number that happened to match. Two
    // layers for the band (gilt + fill) and two for the ACTIVE cell (gilt + fill);
    // resting cells draw none, so this is 4 whether the nav holds three feathers
    // or thirty. (The old `1 + feathers.length` was 4 only by coincidence.)
    const BAND_LAYERS = 2;
    const ACTIVE_LAYERS = 2;
    expect(container.querySelectorAll('[aria-current="page"][data-nav-cell="feather"]').length).toBe(1);
    expect(clipped.length).toBe(BAND_LAYERS + ACTIVE_LAYERS);
    for (const el of clipped) {
      expect(el.tagName).toBe('SPAN');
      expect(el.getAttribute('aria-hidden')).toBe('true');
      expect(el.hasAttribute('tabindex')).toBe(false);
      expect(el.style.pointerEvents).toBe('none');
      expect(el.textContent).toBe('');
      // The decisive one: a clipped node may not CONTAIN anything focusable.
      expect(el.querySelector('button, a, input, [tabindex]')).toBeNull();
    }
  });

  test('no feather button — nor any ancestor up to the header — clips or hides overflow', () => {
    const { container } = render(<App />);
    const drawn = feathers(container);
    expect(drawn.length).toBe(3); // not a vacuous loop
    for (const button of drawn) {
      expect(button.tagName).toBe('BUTTON');
      expect(button.style.clipPath).toBeFalsy();
      for (let el = button; el && el.tagName !== 'HEADER'; el = el.parentElement) {
        expect(el.style?.clipPath, `${el.tagName} clips the ring`).toBeFalsy();
        expect(['hidden', 'clip']).not.toContain(el.style?.overflow);
        expect(['hidden', 'clip']).not.toContain(el.style?.overflowY);
      }
    }
  });

  test('a feather takes keyboard focus and stays a real button', () => {
    const { container } = render(<App />);
    for (const button of feathers(container)) {
      // A native <button type="button"> is focusable and Enter/Space-activated by
      // the platform; nothing in the refit may downgrade it to a div.
      expect(button.getAttribute('type')).toBe('button');
      expect(button.hasAttribute('disabled')).toBe(false);
      button.focus();
      expect(document.activeElement, `${label(button)} did not take focus`).toBe(button);
    }
  });

  test('clicking a feather still navigates — the vane is not eating the pointer', () => {
    const onNavClick = vi.fn();
    const { container } = render(<NavRibbon view="generate" onNavClick={onNavClick} />);
    const realm = feathers(container).find((b) => label(b) === 'Realm');
    realm.click();
    expect(onNavClick).toHaveBeenCalledWith('realm');
  });

  test('the vane contributes no accessible name — every cell reads as its label alone', () => {
    const { container } = render(<App />);
    for (const [i, b] of [...container.querySelectorAll('header nav button')].entries()) {
      expect(label(b)).toBe(NAV[i].label);
    }
  });
});

describe('4 — the active feather brightens with the existing gold grammar', () => {
  /** The active cell's OUTER gilt layer (never the inner fill — the ^= would match both). */
  const vane = (button) => button.querySelector(`[data-testid="nav-feather-${button.dataset.navId || ''}"]`)
    || [...button.querySelectorAll('[data-testid^="nav-feather-"]')]
      .find((el) => !el.dataset.testid.startsWith('nav-feather-fill-'));
  /** The active cell's INNER fill layer. */
  const fill = (button) => button.querySelector('[data-testid^="nav-feather-fill-"]');

  test('the active feather lifts, brightens and gilds — four channels, weight NOT among them', () => {
    const { container } = render(<NavRibbon view="settlements" onNavClick={() => {}} />);
    const active = feathers(container).find((b) => label(b) === 'Library');

    expect(active.getAttribute('aria-current')).toBe('page');        // 1 — semantics
    expect(active.style.color).toBe(rgb(PARCH));                     // 2 — brighter label
    const v = vane(active);
    const f = fill(active);
    expect(v.style.background).toContain(rgb(GILT_ACTIVE));          // 3 — brighter gilt
    expect(f.style.background).toContain(rgb(FLETCH_BROWN_LIFT));    // 4 — lifted fill
    expect(f.style.borderBottom).toBe(`2px solid ${rgb(GILT_ACTIVE)}`); // the gold, translated
    // The barbs continue over the lift, in the lifted step's own darkest tone —
    // otherwise the active feather would go smooth and read as a different material.
    expect(f.style.backgroundImage).toContain(rgb(FLETCH_BARB_LIFT));
  });

  test('⚠️ WEIGHT IS NOT A STATE CHANNEL — both registers of feather label are 600', () => {
    // The V1 grammar put active at 700 and resting at 500. V2's BALANCE LAW spends
    // that channel: EVERY feather label is 600, and the difference between the band
    // and the shelf (500) is what the weight now carries. Pinned as an equality
    // between the two states, so half-reverting one of them fails here.
    const { container } = render(<NavRibbon view="settlements" onNavClick={() => {}} />);
    const active = feathers(container).find((b) => label(b) === 'Library');
    const resting = feathers(container).find((b) => label(b) === 'Realm');
    expect(active.style.fontWeight).toBe('600');
    expect(resting.style.fontWeight).toBe('600');
    expect(active.style.fontWeight).toBe(resting.style.fontWeight);
    // …and the reference tabs still sit a step below, or the band stops reading.
    expect(plains(container)[0].style.fontWeight).toBe('500');
  });

  test('a resting feather carries none of the channels — the A/B is real', () => {
    const { container } = render(<NavRibbon view="settlements" onNavClick={() => {}} />);
    const resting = feathers(container).find((b) => label(b) === 'Realm');

    expect(resting.getAttribute('aria-current')).toBeNull();
    expect(resting.style.color).toBe(rgb(PARCH_100));
    // A resting feather draws NO vane at all now: the band's own paint layer
    // already gives it brown, gilt and barbs, so an empty vane would be a box
    // painting nothing. Absence is the assertion — and it is non-vacuous because
    // the active cell above proves the vane exists when it should.
    expect(vane(resting)).toBeFalsy();
    expect(fill(resting)).toBeNull();
  });

  test('the gold edge is clipped to the VANE, so it follows the feather’s own bottom', () => {
    // If the edge were drawn on the button it would run straight across the
    // slants and the band would read as three rectangles again.
    const { container } = render(<NavRibbon view="generate" onNavClick={() => {}} />);
    const active = feathers(container).find((b) => label(b) === 'Create');
    // (CELL_BASE sets `border: none`, so the shorthand getter reads back the
    // initial 'medium' width — the claim worth pinning is that no rule is DRAWN.)
    expect(active.style.borderBottom).not.toContain('solid');
    expect(active.style.borderBottomStyle).not.toBe('solid');
    expect(vane(active).style.clipPath).toContain(`${FLETCH.slant}px`);
    expect(fill(active).style.clipPath).toContain(`${FLETCH.slant}px`);
  });

  test('the feather clip leans FORWARD — toward Realm, never back', () => {
    const { container } = render(<App />);
    const shapes = new Set(
      [...container.querySelectorAll('header nav *')]
        .filter((el) => el.style?.clipPath)
        .map((el) => el.style.clipPath),
    );
    // ONE silhouette for the band and every feather — that is what makes three
    // vanes read as one fletching rather than three chips.
    expect(shapes.size).toBe(1);
    const [shape] = [...shapes];
    // Top edge starts `slant` px AHEAD of the bottom edge on BOTH sides: the
    // whole parallelogram rakes forward.
    expect(shape).toBe(
      `polygon(${FLETCH.slant}px 0, 100% 0, calc(100% - ${FLETCH.slant}px) 100%, 0 100%)`,
    );
  });
});

describe('4b — the plain register INVERTED for the light shaft', () => {
  // The reference tabs stopped sitting on an ink bar and started sitting on wood.
  // Their V1 tones (PARCH_100 resting, GOLD active) were built for the dark ground
  // and are 1.7–1.9:1 on the light one — legible-looking in a screenshot taken on
  // the wrong background, and unreadable in the app. This block exists because
  // NOTHING else would have caught that: the cells still render, still navigate,
  // still carry aria-current, and every structural test above stays green.
  test('a resting reference tab takes the ink browns, never the pale register', () => {
    const { container } = render(<NavRibbon view="settlements" onNavClick={() => {}} />);
    const resting = plains(container).find((b) => label(b) === 'Compendium');
    expect(resting.style.color).toBe(rgb(BODY));
    expect(resting.style.color).not.toBe(rgb(PARCH_100)); // the V1 tone, now wrong
  });

  test('an active reference tab underlines in GOLD_TXT — the legible-on-light gold', () => {
    const { container } = render(<NavRibbon view="compendium" onNavClick={() => {}} />);
    const active = plains(container).find((b) => label(b) === 'Compendium');
    expect(active.getAttribute('aria-current')).toBe('page');
    expect(active.style.color).toBe(rgb(GOLD_TXT));
    expect(active.style.borderBottom).toBe(`2px solid ${rgb(GOLD_TXT)}`);
    expect(active.style.fontWeight).toBe('700');
    // The plain register keeps its 700, which is exactly why the FEATHERS could
    // afford to give theirs up: the two registers carry state differently.
  });
});

describe('5 — the mobile bottom nav is untouched by the directive', () => {
  beforeEach(() => { H.isMobile = true; });

  test('a phone renders its bar with no band, no feather and no paint', () => {
    const { container } = render(<App />);
    // Presence control: the mobile bar really did render (else every absence
    // below would be vacuous).
    const labels = [...container.querySelectorAll('button')]
      .map(label)
      .filter((t) => ['Create', 'Library', 'Gallery', 'Compendium', 'About'].includes(t));
    expect(labels).toEqual(['Create', 'Library', 'Gallery', 'Compendium', 'About']);

    expect(container.querySelectorAll('[data-testid="nav-fletch-band"]').length).toBe(0);
    expect(container.querySelectorAll('[data-testid="nav-fletch-paint"]').length).toBe(0);
    expect(container.querySelectorAll('[data-nav-cell="feather"]').length).toBe(0);
    expect([...container.querySelectorAll('*')].filter((el) => el.style?.clipPath).length).toBe(0);
  });
});
