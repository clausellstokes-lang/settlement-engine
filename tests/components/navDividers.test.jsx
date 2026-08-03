/**
 * @vitest-environment jsdom
 *
 * tests/components/navDividers.test.jsx — THE DERIVATION CENSUS (LD-2, refitted
 * for THE FLETCHED RIBBON under the owner directive of 2026-08-03).
 *
 * The original order: the desktop ribbon separates every nav item with a
 * vertical line, EXCEPT inside the Create → Library → Realm journey, whose seams
 * were CHEVRONS. ⚠️ THE CURVED-CHEVRON READING IS RETIRED ON DESKTOP: the trio
 * now sits in a single leather-brown fletched band, and the seams between its
 * feathers are SHARP STRAIGHT ANGLED STROKES cut at exactly the angle the
 * feathers lean (kind `fletch`, was `chevron`). The order names two boundaries;
 * the implementation must NOT. LD-2's binding clause survives the refit intact —
 * the divider kind is COMPUTED from the single source routes.js already declares
 * (NAV order + NAV_FLOW) — so this census asserts the rendered ribbon against
 * THAT DERIVATION, never against a frozen boundary list. A future nav insertion
 * or reorder then files its own divider automatically instead of redding a stale
 * map. Only the ANSWER's spelling changed; the derivation did not.
 *
 * The suite is deliberately paired with tests/components/navFlowArrows.test.jsx:
 * the flow chevron the desktop ribbon used to draw INSIDE each tab moved to the
 * bar-height divider here, while the MOBILE bottom nav keeps NavFlowArrow (its
 * cells have no seam to carry a divider). That file's mobile half is the live
 * negative control for this move; neither surface lost its journey mark. The
 * BAND itself — its membership, its paint-not-layout overhang and its focus-ring
 * survival — is pinned next door in tests/components/navFletching.test.jsx.
 *
 * App.jsx is a pure layout shell over the Zustand store + path router, so the
 * store, the route hook, the breakpoint hook and the routed view are stubbed —
 * the render then exercises only the nav chrome under test (the sibling suite's
 * idiom, kept identical on purpose).
 */

import React from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import { NAV, NAV_FLOW } from '../../src/lib/routes.js';
import { dividerKind } from '../../src/components/nav/NavDivider.jsx';
import NavRibbon from '../../src/components/nav/NavRibbon.jsx';
import { FLETCH } from '../../src/components/theme.js';

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

/** Every rendered divider in the desktop ribbon, in document order. */
const dividers = (container) => [...container.querySelectorAll('header nav [data-divider-kind]')];

/** The kind sequence the DERIVATION demands for the ribbon's rendered order. */
function derivedKinds() {
  return NAV.slice(0, -1).map((n, i) => dividerKind(n.id, NAV[i + 1].id));
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

describe('the kind is derived from routes.js, not restated anywhere', () => {
  test('dividerKind answers the flow declaration and nothing else', () => {
    for (const [from, to] of Object.entries(NAV_FLOW)) {
      expect(dividerKind(from, to)).toBe('fletch');
    }
    // A pair the flow does NOT declare is a plain rule, in both directions.
    expect(dividerKind('settlements', 'generate')).toBe('line');
    // 'home' left NAV entirely under the 2026-08-03 directive; a retired id can
    // never earn a fletch stroke, in either position.
    expect(dividerKind('home', 'generate')).toBe('line');
    expect(dividerKind('generate', 'home')).toBe('line');
  });

  test('the derivation yields the owner’s two fletch seams today — derived, not typed in', () => {
    // Anchoring the CURRENT answer proves the derivation is not vacuous, while
    // the census below binds the DOM to the derivation rather than to this list.
    const boundaries = NAV.slice(0, -1).map((n, i) => `${n.id}|${NAV[i + 1].id}`);
    const fletches = boundaries.filter((_, i) => derivedKinds()[i] === 'fletch');
    expect(fletches).toEqual(['generate|settlements', 'settlements|realm']);
    expect(derivedKinds().filter((k) => k === 'line').length).toBe(boundaries.length - 2);
    // The retired kind is GONE, not merely unused — a stray 'chevron' anywhere in
    // the derivation would mean two vocabularies for one seam.
    expect(derivedKinds()).not.toContain('chevron');
  });
});

describe('desktop ribbon — the rendered seam matches the derivation exactly', () => {
  test('one divider per adjacent pair, in NAV order, with the derived kinds', () => {
    const { container } = render(<App />);

    // Positive control first: the ribbon really did render the cells whose
    // adjacencies the dividers are being judged against.
    const labels = [...container.querySelectorAll('header nav button')].map((b) => b.textContent.trim());
    expect(labels).toEqual(NAV.map((n) => n.label));

    const rendered = dividers(container);
    // Exactly one seam per adjacent pair — never a trailing mark before Sign In.
    expect(rendered.length).toBe(NAV.length - 1);
    expect(rendered.map((d) => d.dataset.dividerKind)).toEqual(derivedKinds());
  });

  test('every divider names the pair it sits between, in rendered order', () => {
    const { container } = render(<App />);
    expect(dividers(container).map((d) => d.dataset.testid)).toEqual(
      NAV.slice(0, -1).map((n, i) => `nav-divider-${derivedKinds()[i]}-${n.id}-${NAV[i + 1].id}`),
    );
  });

  test('each divider is a sibling BETWEEN two cells, not a child of one', () => {
    const { container } = render(<App />);
    for (const d of dividers(container)) {
      expect(d.closest('button')).toBeNull();
      // A seam INSIDE the band sits between two feather buttons; the seam at the
      // band's own outer boundary sits between the band wrapper and a plain tab.
      // Either way it is a SIBLING of what it separates, never a child of it.
      const flanks = [d.previousElementSibling, d.nextElementSibling];
      for (const flank of flanks) {
        expect(flank).toBeTruthy();
        const isCell = flank.tagName === 'BUTTON';
        const isBand = flank.dataset?.testid === 'nav-fletch-band';
        expect(isCell || isBand, `unexpected flank <${flank.tagName}>`).toBe(true);
      }
    }
  });

  test('the fletch draws ONE straight angled stroke and the line one vertical — matched weights', () => {
    const { container } = render(<App />);
    for (const d of dividers(container)) {
      const strokes = [...d.querySelectorAll('line')];
      // The retired chevron drew TWO strokes converging on an apex. The fletch
      // draws exactly one, because a fletching's seam is a single sharp cut.
      expect(strokes.length).toBe(1);
      for (const s of strokes) {
        expect(s.getAttribute('stroke-width')).toBe('1');
        // Non-scaling stroke is what holds the two kinds to one hairline weight
        // once preserveAspectRatio="none" stretches the mark to bar height.
        expect(s.getAttribute('vector-effect')).toBe('non-scaling-stroke');
      }
    }
  });

  test('the fletch stroke leans FORWARD at exactly the vanes’ own angle', () => {
    // THE PARALLELISM IS BY CONSTRUCTION, AND THIS IS THE PIN THAT SAYS SO. The
    // feather's clipped edge runs FLETCH.slant px horizontally over the band's
    // full height; the stroke's box is FLETCH.slant wide and it is drawn corner
    // to corner, bottom-left → top-right, so it traverses the same run over the
    // same height. A second angle authored anywhere would red here.
    const { container } = render(<App />);
    const fletches = dividers(container).filter((d) => d.dataset.dividerKind === 'fletch');
    expect(fletches.length).toBe(2); // not a vacuous loop
    for (const d of fletches) {
      const svg = d.querySelector('svg');
      expect(svg.getAttribute('viewBox')).toBe(`0 0 ${FLETCH.slant} 100`);
      const line = d.querySelector('line');
      // Bottom-left (0, 100) → top-right (slant, 0): forward, toward Realm.
      expect(line.getAttribute('x1')).toBe('0');
      expect(line.getAttribute('y1')).toBe('100');
      expect(line.getAttribute('x2')).toBe(String(FLETCH.slant));
      expect(line.getAttribute('y2')).toBe('0');
      expect(d.style.flex).toBe(`0 0 ${FLETCH.slant}px`);
    }
    // The plain rule is still vertical and still 7px, untouched by the refit.
    for (const d of dividers(container).filter((x) => x.dataset.dividerKind === 'line')) {
      const line = d.querySelector('line');
      expect(line.getAttribute('x1')).toBe(line.getAttribute('x2'));
    }
  });

  test('dividers are decoration — aria-hidden, no focus stop, no pointer surface, no text', () => {
    const { container } = render(<App />);
    for (const d of dividers(container)) {
      expect(d.getAttribute('aria-hidden')).toBe('true');
      expect(d.hasAttribute('tabindex')).toBe(false);
      expect(d.style.pointerEvents).toBe('none');
      expect(d.textContent).toBe('');
    }
    // The accessible name of every nav link is still its label alone.
    for (const [i, b] of [...container.querySelectorAll('header nav button')].entries()) {
      expect(b.textContent.trim()).toBe(NAV[i].label);
    }
  });

  test('the PLAIN reference tab’s underline register is untouched by the refit', () => {
    // ⚠️ THIS TEST CHANGED SUBJECT, DELIBERATELY. It used to read the underline
    // off /create, which is now a FEATHER — feathers carry their gold on the
    // clipped vane instead (pinned in navFletching.test.jsx). The claim worth
    // keeping is that the REFERENCE tabs kept the original register exactly, so
    // it is asserted where it still lives: on a plain tab, rendered as a leaf so
    // no lazy view has to mount just to make one of them active.
    const { container } = render(<NavRibbon view="compendium" onNavClick={() => {}} />);
    const cells = [...container.querySelectorAll('button')];
    const byLabel = Object.fromEntries(cells.map((b) => [b.textContent.trim(), b]));

    const active = byLabel.Compendium;
    expect(active.getAttribute('aria-current')).toBe('page');
    expect(active.dataset.navCell).toBe('plain');
    expect(active.style.borderBottom).toContain('2px solid');
    expect(active.style.fontWeight).toBe('700');

    // A resting plain tab still reserves the same 2px so nothing shifts on hover
    // or navigation — the original register, unchanged.
    expect(byLabel.Gallery.style.borderBottom).toBe('2px solid transparent');

    // And the cells still sit CENTRED in the bar, so the underline stays at
    // label height rather than being dragged to bar height by the stretch chain.
    expect(container.querySelector('nav').style.alignItems).toBe('center');
  });
});

describe('⚠️⚠️ a decoration may never price the bar — the viewBox is not a height', () => {
  /**
   * THE BUG THIS EXISTS FOR, because it cost two lanes to find and was invisible
   * to every suite including this one.
   *
   * The divider draws an inline SVG whose viewBox is `0 0 w 100`. That 100 is a
   * COORDINATE SPACE — `preserveAspectRatio="none"` rescales it to whatever height
   * the seam turns out to be. But the SVG was IN FLOW asking for `height="100%"`,
   * and every ancestor up to the header sized itself by content, so the percentage
   * had nothing definite to resolve against. A percentage that cannot resolve falls
   * back to the element's INTRINSIC size — for an SVG, its viewBox — so the divider
   * asked the layout for 100px, got it, and became the tallest thing on the
   * header's flex line. The desktop header measured 124px (100 + 2×12 padding)
   * against a CHROME.headerDesktop that said 60. ANCHOR_OFFSET is derived from that
   * constant, so every in-page anchor in the estate landed ~40px under the chrome,
   * and the dossier toolbar — which pins at `top: CHROME.headerDesktop` — sat 64px
   * beneath the bar it was supposed to hug. Lane FL-2 measured the divergence and
   * could not name its cause. This was the cause.
   *
   * jsdom has no layout, so the pin is STRUCTURAL: it asserts the property that
   * made the fallback possible is gone. Out of flow, the percentage resolves
   * against a definite containing block and the mark contributes no height at all.
   * The live receipt at 1440×900 after the repair: header 48, nav 47, every
   * divider box 47 — the viewBox's 100 appears nowhere in the layout.
   */
  test('every divider SVG is out of flow, so its viewBox cannot become a height', () => {
    const { container } = render(<App />);
    const svgs = [...container.querySelectorAll('[data-divider-kind] svg')];
    expect(svgs.length).toBeGreaterThan(0); // not a vacuous walk
    for (const svg of svgs) {
      expect(svg.style.position, 'an in-flow divider SVG re-prices the header').toBe('absolute');
      expect(svg.style.inset).toBe('0px');
      // Its own span must be the positioning context, or `inset: 0` would resolve
      // against some ancestor and the mark would span the wrong box.
      expect(svg.parentElement.style.position).toBe('relative');
    }
  });

  test('no divider spends a LAYOUT height — the box is the seam, nothing more', () => {
    const { container } = render(<App />);
    const marks = [...container.querySelectorAll('[data-divider-kind]')];
    expect(marks.length).toBeGreaterThan(0);
    for (const d of marks) {
      // It stretches to the bar; it never states a height of its own, in any
      // spelling. `flex: 0 0 Npx` is a WIDTH along the row and is expected.
      expect(d.style.alignSelf).toBe('stretch');
      for (const prop of ['height', 'minHeight', 'maxHeight', 'marginTop', 'marginBottom']) {
        expect(d.style[prop], `divider spends ${prop}=${d.style[prop]}`).toBeFalsy();
      }
      // NEGATIVE CONTROL: the viewBox number must not leak into any inline style
      // anywhere on the mark or its SVG — that leak IS the bug.
      const svg = d.querySelector('svg');
      expect(svg.getAttribute('viewBox')).toMatch(/ 100$/); // the space still says 100…
      expect(`${d.style.cssText} ${svg.style.cssText}`).not.toContain('100px'); // …the layout never does
    }
  });
});

describe('mobile bottom nav — the dividers are desktop-only', () => {
  beforeEach(() => { H.isMobile = true; });

  test('a phone renders the bar with no dividers at all', () => {
    const { container } = render(<App />);
    // Presence control: the mobile bar really did render (else the absence
    // below would be vacuous).
    const labels = [...container.querySelectorAll('button')]
      .map((b) => b.textContent.trim())
      .filter((txt) => ['Create', 'Library', 'Gallery', 'Compendium', 'About'].includes(txt));
    expect(labels).toEqual(['Create', 'Library', 'Gallery', 'Compendium', 'About']);
    expect(container.querySelectorAll('[data-divider-kind]').length).toBe(0);
  });
});
