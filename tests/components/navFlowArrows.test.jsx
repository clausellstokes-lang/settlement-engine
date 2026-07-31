/**
 * @vitest-environment jsdom
 *
 * tests/components/navFlowArrows.test.jsx — THE ADJACENCY GUARD.
 *
 * The ribbon's Create · Library · Realm tabs read as a flow, so a tab that
 * FEEDS its neighbour draws a chevron into it (routes.js NAV_FLOW +
 * components/nav/NavFlowArrow.jsx). The guard that makes the chevron honest is
 * that it renders ONLY when the declared successor is the tab actually rendered
 * next ON THAT SURFACE — the two nav surfaces do NOT carry the same tab set:
 *
 *   • desktop ribbon      Welcome · Create · Library · Realm · …   → BOTH chevrons
 *   • mobile bottom nav   Create · Library · Gallery · …           → Create's only
 *
 * The mobile bar omits Realm by design (App.jsx MOBILE_NAV_PRIORITY), so a
 * Library chevron there would point at Gallery and teach a false lesson about
 * where a saved settlement goes. Pinning both surfaces in one file is the point:
 * a future NAV/priority reorder that breaks the pairing reds here.
 *
 * App.jsx is a pure layout shell over the Zustand store + path router, so the
 * store, the route hook, the breakpoint hook and the routed view are stubbed —
 * the render then exercises only the nav chrome under test.
 */

import React from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { NAV, NAV_FLOW } from '../../src/lib/routes.js';

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

describe('desktop ribbon — both chevrons draw (the successors ARE adjacent)', () => {
  test('Create and Library each carry a chevron into their rendered successor', () => {
    const { container } = render(<App />);

    // Positive control first: the ribbon really did render the adjacencies the
    // arrows claim, so their presence is about the guard and not about luck.
    const labels = [...container.querySelectorAll('header nav button')].map((b) => b.textContent.trim());
    expect(labels.slice(0, 4)).toEqual(['Welcome', 'Create', 'Library', 'Realm']);

    expect(screen.getByTestId('nav-flow-generate-settlements')).toBeTruthy();
    expect(screen.getByTestId('nav-flow-settlements-realm')).toBeTruthy();
    // Exactly two — no chevron leaks onto Welcome, Realm, Compendium, Gallery or About.
    expect(arrows(container).map((a) => a.dataset.testid)).toEqual([
      'nav-flow-generate-settlements',
      'nav-flow-settlements-realm',
    ]);
  });

  test('each chevron hangs off the tab that FEEDS, not the tab that receives', () => {
    render(<App />);
    expect(screen.getByTestId('nav-flow-generate-settlements').closest('button').textContent.trim()).toBe('Create');
    expect(screen.getByTestId('nav-flow-settlements-realm').closest('button').textContent.trim()).toBe('Library');
  });

  test('the chevron is decorative — aria-hidden, no focus stop, no pointer surface', () => {
    const { container } = render(<App />);
    for (const arrow of arrows(container)) {
      expect(arrow.getAttribute('aria-hidden')).toBe('true');
      expect(arrow.tagName).toBe('SPAN');
      expect(arrow.hasAttribute('tabindex')).toBe(false);
      expect(arrow.style.pointerEvents).toBe('none');
      // It contributes no text, so no tab's accessible name grows.
      expect(arrow.textContent).toBe('');
    }
  });

  test('the chevron takes the active tab’s gold and the quiet border register elsewhere', () => {
    // /create is the active view, so Create's chevron is the gold one and
    // Library's is the quiet one — the two must not paint identically.
    render(<App />);
    const onActive = screen.getByTestId('nav-flow-generate-settlements').style.borderTopColor;
    const onResting = screen.getByTestId('nav-flow-settlements-realm').style.borderTopColor;
    expect(onActive).toBeTruthy();
    expect(onResting).toBeTruthy();
    expect(onActive).not.toBe(onResting);
  });
});

describe('mobile bottom nav — a surface WITHOUT Realm draws no Library chevron', () => {
  beforeEach(() => { H.isMobile = true; });

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
