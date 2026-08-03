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
 *      ANCHOR_OFFSET (84) from CHROME.headerDesktop (60), and every About /
 *      guide / Compendium in-page anchor lands on that number. A margin, a
 *      padding, a height or a negative offset here would push the sticky header
 *      taller and every anchor in the estate would land 4px worse — a defect no
 *      nav test would ever see. So both halves are pinned: the derivation chain,
 *      and the ABSENCE of any box that spends the overhang.
 *
 *      ⚠️ jsdom HAS NO LAYOUT, so this file can only pin the STRUCTURE that makes
 *      the overhang paint-only; the height itself was proved in a real browser and
 *      the receipt is recorded here so nobody re-derives it. At 1440×900, base
 *      83b18609 and the fletched tree were served side by side and BOTH reported
 *      header 124px / nav 100px (base also main-top 124) — the refit cost zero
 *      layout height. ⚠️⚠️ AND NOTE WHAT THAT MEASUREMENT ALSO SAYS:
 *      CHROME.headerDesktop is 60 while the live desktop header is 124. That
 *      divergence is PRE-EXISTING and estate-wide, was reported by lane FL-2, and
 *      is deliberately not repaired here — the constant is still pinned below
 *      because the ribbon must not MOVE it, not because it measures this header.
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
 *      channels — lifted fill, brighter label, weight 700, aria-current="page" —
 *      so the state never rests on colour alone.
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
  ANCHOR_OFFSET, CHROME, FLETCH, FLETCH_BROWN, FLETCH_BROWN_LIFT, GOLD, PARCH, PARCH_100, SP,
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
    // This is the reason clause 2 exists. Pinned here, beside the thing that
    // could break it, rather than only in the theme. These are the numbers the
    // ribbon must leave ALONE — not a claim that 60 measures the live header
    // (it does not; see the ⚠️⚠️ note in the file header).
    expect(CHROME.headerDesktop).toBe(60);
    expect(ANCHOR_OFFSET).toBe(CHROME.headerDesktop + SP.xxl);
    expect(ANCHOR_OFFSET).toBe(84);
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
    expect(paint.style.filter).toBe(`drop-shadow(0 ${FLETCH.overhang}px 0 ${FLETCH_BROWN})`);
    expect(paint.style.background).toContain(rgb(FLETCH_BROWN));
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
    // Non-vacuity: something really is clipped (the paint layer + three vanes).
    expect(clipped.length).toBe(1 + feathers(container).length);
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
  /** The vane layer belonging to a given feather button. */
  const vane = (button) => button.querySelector('[data-testid^="nav-feather-"]');

  test('the active feather lifts, brightens and keeps a gold edge — four channels', () => {
    const { container } = render(<NavRibbon view="settlements" onNavClick={() => {}} />);
    const active = feathers(container).find((b) => label(b) === 'Library');

    expect(active.getAttribute('aria-current')).toBe('page');        // 1 — semantics
    expect(active.style.fontWeight).toBe('700');                     // 2 — weight
    expect(active.style.color).toBe(rgb(PARCH));                     // 3 — brighter label
    const v = vane(active);
    expect(v.style.background).toContain(rgb(FLETCH_BROWN_LIFT));    // 4 — lifted fill
    expect(v.style.borderBottom).toBe(`2px solid ${rgb(GOLD)}`);     // the gold, translated
  });

  test('a resting feather carries none of the four — the A/B is real', () => {
    const { container } = render(<NavRibbon view="settlements" onNavClick={() => {}} />);
    const resting = feathers(container).find((b) => label(b) === 'Realm');

    expect(resting.getAttribute('aria-current')).toBeNull();
    expect(resting.style.fontWeight).toBe('500');
    expect(resting.style.color).toBe(rgb(PARCH_100));
    const v = vane(resting);
    expect(v.style.background).toBe('transparent');
    expect(v.style.borderBottom).toBeFalsy();
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
