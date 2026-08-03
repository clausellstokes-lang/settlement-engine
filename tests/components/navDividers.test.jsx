/**
 * @vitest-environment jsdom
 *
 * tests/components/navDividers.test.jsx — THE DERIVATION CENSUS (LD-2).
 *
 * The owner's order: the desktop ribbon separates every nav item with a
 * vertical line, EXCEPT inside the Create → Library → Realm journey, whose
 * seams are chevrons. The order names two boundaries; the implementation must
 * NOT. LD-2's binding clause is that the divider kind is COMPUTED from the
 * single source routes.js already declares (NAV order + NAV_FLOW) — so this
 * census asserts the rendered ribbon against THAT DERIVATION, never against a
 * frozen boundary list. A future nav insertion or reorder then files its own
 * divider automatically instead of redding a stale map.
 *
 * The suite is deliberately paired with tests/components/navFlowArrows.test.jsx:
 * the flow chevron the desktop ribbon used to draw INSIDE each tab moved to the
 * bar-height divider here, while the MOBILE bottom nav keeps NavFlowArrow (its
 * cells have no seam to carry a divider). That file's mobile half is the live
 * negative control for this move; neither surface lost its journey mark.
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
      expect(dividerKind(from, to)).toBe('chevron');
    }
    // A pair the flow does NOT declare is a plain rule, in both directions.
    expect(dividerKind('settlements', 'generate')).toBe('line');
    expect(dividerKind('home', 'generate')).toBe('line');
  });

  test('the derivation yields the owner’s two chevrons today — derived, not typed in', () => {
    // Anchoring the CURRENT answer proves the derivation is not vacuous, while
    // the census below binds the DOM to the derivation rather than to this list.
    const boundaries = NAV.slice(0, -1).map((n, i) => `${n.id}|${NAV[i + 1].id}`);
    const chevrons = boundaries.filter((_, i) => derivedKinds()[i] === 'chevron');
    expect(chevrons).toEqual(['generate|settlements', 'settlements|realm']);
    expect(derivedKinds().filter((k) => k === 'line').length).toBe(boundaries.length - 2);
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
      expect(d.previousElementSibling?.tagName).toBe('BUTTON');
      expect(d.nextElementSibling?.tagName).toBe('BUTTON');
    }
  });

  test('the chevron draws two strokes and the line draws one — matched weights', () => {
    const { container } = render(<App />);
    for (const d of dividers(container)) {
      const strokes = [...d.querySelectorAll('line')];
      expect(strokes.length).toBe(d.dataset.dividerKind === 'chevron' ? 2 : 1);
      for (const s of strokes) {
        expect(s.getAttribute('stroke-width')).toBe('1');
        // Non-scaling stroke is what holds the two kinds to one hairline weight
        // once preserveAspectRatio="none" stretches the mark to bar height.
        expect(s.getAttribute('vector-effect')).toBe('non-scaling-stroke');
      }
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

  test('the active tab’s underline is untouched by the stretch chain', () => {
    // /create is active: its cell keeps the gold bottom border, and the cells
    // stay centred (not stretched) so the underline sits at label height.
    const { container } = render(<App />);
    const cells = [...container.querySelectorAll('header nav button')];
    const activeIdx = NAV.findIndex((n) => n.id === 'generate');
    expect(cells[activeIdx].getAttribute('aria-current')).toBe('page');
    expect(cells[activeIdx].style.borderBottom).toContain('2px solid');
    expect(container.querySelector('header nav').style.alignItems).toBe('center');
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
