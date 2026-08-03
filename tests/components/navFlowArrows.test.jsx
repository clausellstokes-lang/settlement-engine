/**
 * @vitest-environment jsdom
 *
 * tests/components/navFlowArrows.test.jsx — THE ADJACENCY GUARD.
 *
 * The ribbon's Create · Library · Realm tabs read as a flow, so a tab that
 * FEEDS its neighbour draws a chevron into it (routes.js NAV_FLOW +
 * components/nav/NavFlowArrow.jsx). The guard that makes the chevron honest is
 * that it renders ONLY when the declared successor is the tab actually rendered
 * next ON THAT SURFACE.
 *
 * ⚠️ SURFACE CHANGE, 2026-08-03 (LD-2, owner-ordered): the DESKTOP ribbon no
 * longer mounts NavFlowArrow. Its journey mark is now the bar-height chevron
 * DIVIDER between cells (components/nav/NavDivider.jsx, censused by
 * tests/components/navDividers.test.jsx) — the same NAV_FLOW derivation drawn
 * at the seam instead of inside the tab. The MOBILE bottom nav keeps
 * NavFlowArrow untouched: its cells sit in a fixed bar with no seam to carry a
 * divider, and the Create → Library chevron draws there today. So this file's
 * desktop half is now the ABSENCE pin (the mark moved, and must not be drawn
 * twice) while the mobile half stays the live behavioural pin:
 *
 *   • desktop ribbon      Welcome · Create · Library · Realm · …   → NO arrows
 *   • mobile bottom nav   Create · Library · Gallery · …           → Create's only
 *
 * The mobile bar omits Realm by design (App.jsx MOBILE_NAV_PRIORITY), so a
 * Library chevron there would point at Gallery and teach a false lesson about
 * where a saved settlement goes. Pinning both surfaces in one file is still the
 * point: a future NAV/priority reorder that breaks the pairing reds here, and a
 * desktop re-mount of the arrow reds as a double-drawn journey mark.
 *
 * App.jsx is a pure layout shell over the Zustand store + path router, so the
 * store, the route hook, the breakpoint hook and the routed view are stubbed —
 * the render then exercises only the nav chrome under test.
 */

import React from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { NAV, NAV_FLOW } from '../../src/lib/routes.js';
import NavFlowArrow from '../../src/components/nav/NavFlowArrow.jsx';

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

// The routed view is irrelevant to the nav chrome; a bare marker keeps the
// wizard's own store reads out of this render.
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

/** Every rendered flow chevron, in document order. */
const arrows = (container) => [...container.querySelectorAll('[data-testid^="nav-flow-"]')];

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

describe('the flow declaration is nav metadata, owned by routes.js', () => {
  test('NAV_FLOW names Create → Library → Realm and nothing else', () => {
    expect(NAV_FLOW).toEqual({ generate: 'settlements', settlements: 'realm' });
  });

  test('every flow endpoint is a real nav destination (no arrow into a non-tab)', () => {
    const navIds = new Set(NAV.map((n) => n.id));
    for (const [from, to] of Object.entries(NAV_FLOW)) {
      expect(navIds.has(from), `${from} is not a nav tab`).toBe(true);
      expect(navIds.has(to), `${to} is not a nav tab`).toBe(true);
    }
  });
});

describe('desktop ribbon — the journey mark MOVED to the seam (LD-2)', () => {
  test('the ribbon draws the tabs but mounts no in-tab flow arrow', () => {
    const { container } = render(<App />);

    // Positive control first: the ribbon really did render the adjacencies the
    // arrows USED to claim, so the absence below is about the move and not
    // about a ribbon that failed to render at all.
    const labels = [...container.querySelectorAll('header nav button')].map((b) => b.textContent.trim());
    expect(labels.slice(0, 4)).toEqual(['Welcome', 'Create', 'Library', 'Realm']);

    // Second control: the journey mark EXISTS on this surface — as the chevron
    // divider at the two flow boundaries. Without this the absence assertion
    // would pass just as happily on a ribbon that had lost the mark entirely.
    expect([...container.querySelectorAll('header nav [data-divider-kind="chevron"]')]
      .map((d) => d.dataset.testid)).toEqual([
      'nav-divider-chevron-generate-settlements',
      'nav-divider-chevron-settlements-realm',
    ]);

    // The mark is drawn ONCE: no NavFlowArrow survives inside any desktop tab.
    expect(arrows(container)).toEqual([]);
  });
});

describe('mobile bottom nav — a surface WITHOUT Realm draws no Library chevron', () => {
  beforeEach(() => { H.isMobile = true; });

  test('the surviving chevron hangs off the tab that FEEDS, not the one that receives', () => {
    render(<App />);
    expect(screen.getByTestId('nav-flow-generate-settlements').closest('button').textContent.trim()).toBe('Create');
  });

  test('the chevron is decorative — aria-hidden, no focus stop, no pointer surface', () => {
    const { container } = render(<App />);
    const drawn = arrows(container);
    expect(drawn.length).toBeGreaterThan(0); // not a vacuous loop
    for (const arrow of drawn) {
      expect(arrow.getAttribute('aria-hidden')).toBe('true');
      expect(arrow.tagName).toBe('SPAN');
      expect(arrow.hasAttribute('tabindex')).toBe(false);
      expect(arrow.style.pointerEvents).toBe('none');
      // It contributes no text, so no tab's accessible name grows.
      expect(arrow.textContent).toBe('');
    }
  });

  test('the chevron takes the active tab’s gold and the quiet border register elsewhere', () => {
    // Rendered as a leaf so both registers are observable on ONE surface: the
    // mobile bar draws a single arrow, so the App-level A/B the desktop ribbon
    // used to provide no longer exists there.
    const { container } = render(
      <>
        <NavFlowArrow from="generate" to="settlements" active />
        <NavFlowArrow from="settlements" to="realm" active={false} />
      </>,
    );
    const [onActive, onResting] = [...container.querySelectorAll('[data-testid^="nav-flow-"]')]
      .map((a) => a.style.borderTopColor);
    expect(onActive).toBeTruthy();
    expect(onResting).toBeTruthy();
    expect(onActive).not.toBe(onResting);
  });

  test('Library’s successor is not its rendered neighbour there, so it draws nothing', () => {
    const { container } = render(<App />);

    // The absence below is only meaningful if this surface actually rendered the
    // Library tab with a DIFFERENT neighbour — pin the composition first.
    const labels = [...container.querySelectorAll('button')]
      .map((b) => b.textContent.trim())
      .filter((txt) => ['Create', 'Library', 'Gallery', 'Compendium', 'About', 'Realm'].includes(txt));
    expect(labels).toEqual(['Create', 'Library', 'Gallery', 'Compendium', 'About']);

    // Create → Library still holds here, so the surface is drawing arrows at all.
    expect(screen.getByTestId('nav-flow-generate-settlements')).toBeTruthy();
    // Library → Realm does NOT: Gallery follows Library on this bar.
    expect(screen.queryByTestId('nav-flow-settlements-gallery')).toBeNull();
    expect(screen.queryByTestId('nav-flow-settlements-realm')).toBeNull();
    expect(arrows(container).map((a) => a.dataset.testid)).toEqual(['nav-flow-generate-settlements']);
  });
});
