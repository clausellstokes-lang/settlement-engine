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
 * longer mounts NavFlowArrow. Its journey mark is now the bar-height seam
 * DIVIDER between cells (components/nav/NavDivider.jsx, censused by
 * tests/components/navDividers.test.jsx) — the same NAV_FLOW derivation drawn
 * at the seam instead of inside the tab. The MOBILE bottom nav keeps
 * NavFlowArrow untouched: its cells sit in a fixed bar with no seam to carry a
 * divider, and the Create → Library chevron draws there today. So this file's
 * desktop half is now the ABSENCE pin (the mark moved, and must not be drawn
 * twice) while the mobile half stays the live behavioural pin:
 *
 *   • desktop ribbon      Create · Library · Realm · …             → NO arrows
 *   • mobile bottom nav   Create · Library · Gallery · …           → Create's only
 *
 * ⚠️ TWICE-CHANGED, SAME DAY (THE FLETCHED RIBBON, owner directive 2026-08-03).
 * Two further facts moved under this file and are asserted below rather than
 * left to rot: Welcome LEFT the desktop ribbon (the wordmark is the home button
 * now, so the ribbon opens on Create), and the desktop seam mark's kind is
 * spelled `fletch` — a single straight angled stroke — where it was `chevron`.
 * `flowsInto` itself is unchanged and is now read by THREE surfaces: this arrow,
 * the seam kind, and the fletched band's very membership.
 *
 * The mobile bar CARRIES Realm again (owner walk ruling, ODQ §767.3(f) —
 * a phone user must reach the realm from the core flow; About yielded its
 * seat by priority and kept a footer door), so the full Create → Library →
 * Realm flow now draws BOTH chevrons on the one live mount. Pinning both
 * surfaces in one file is still the point: a future NAV/priority reorder that
 * breaks the pairing reds here, and a desktop re-mount of the arrow reds as a
 * double-drawn journey mark.
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

// ⚠️ INHERITED RED, REPAIRED HERE (measured at base 83b18609: this file exited 1
// with FIVE `EnvironmentTeardownError: Cannot load '/src/lib/creditLedger.js'`
// unhandled rejections while every test passed). The stripe mock above severs
// stripe's own EXPORTS but a lazily-mounted pricing chunk still resolves the real
// stripe module graph, whose line-17 import of creditLedger.js lands after the
// jsdom environment is gone. Mocking the leaf ends the race at its source; the
// sibling suites already mock it or never reach it, which is why only this file
// was red.
vi.mock('../../src/lib/creditLedger.js', () => ({
  fetchCreditBalanceFromLedger: () => Promise.resolve(0),
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
    // about a ribbon that failed to render at all. The ribbon now OPENS on
    // Create — Welcome's nav block was retired on 2026-08-03 and the wordmark
    // carries home instead.
    const labels = [...container.querySelectorAll('header nav button')].map((b) => b.textContent.trim());
    expect(labels.slice(0, 3)).toEqual(['Create', 'Library', 'Realm']);
    expect(labels).not.toContain('Welcome');

    // Second control: the journey mark EXISTS on this surface. ⚠️ IT HAS MOVED
    // THREE TIMES NOW. LD-2 took it out of the tabs and into a full-height chevron
    // seam; V3 made that seam an angled fletch stroke; the owner's mockup refinement
    // RETIRED the internal seam altogether and the mark became the SHINGLE; and the
    // owner's FINAL correction reversed that shingle's direction. Without this control
    // the absence assertion below would pass just as happily on a ribbon that had lost
    // the journey mark entirely.
    const band = container.querySelector('[data-testid="nav-fletch-band"]');
    expect(band).toBeTruthy();
    const paint = band.querySelector('[data-testid="nav-fletch-band-paint"]');
    expect(paint).toBeTruthy();
    // ⚠️ THE CASCADE IS THE MARK, AND ITS DIRECTION IS THE DECLARATION. The three
    // cells are painted in READING ORDER, so the z-order ASCENDS INTO REALM: Library's
    // leading edge lies over Create's trailing edge and Realm's over Library's. That
    // is what makes each tab read as FEEDING INTO the next, which is exactly what the
    // retired arrows used to say. Painted the other way (as the cut before this one
    // did) the stack still shingles and the flow points backwards, so the ORDER is
    // pinned here and not merely the presence of three vanes.
    expect([...paint.querySelectorAll('[data-testid^="nav-fletch-vane-"]')]
      .map((g) => g.dataset.testid))
      .toEqual(['nav-fletch-vane-0', 'nav-fletch-vane-1', 'nav-fletch-vane-2']);
    // Both retired spellings are gone from the surface, not merely unreferenced.
    for (const kind of ['fletch', 'chevron']) {
      expect(container.querySelectorAll(`[data-divider-kind="${kind}"]`).length).toBe(0);
    }

    // The mark is drawn ONCE: no NavFlowArrow survives inside any desktop tab.
    expect(arrows(container)).toEqual([]);
  });

  test('the wordmark is the desktop home button now that Welcome left the ribbon', () => {
    // The retirement is only sound because home stayed REACHABLE. Pinning the
    // door here — beside the tab that used to be it — means a future edit that
    // removes the wordmark button strands /home behind a bare URL.
    const { container } = render(<App />);
    const home = [...container.querySelectorAll('header button')]
      .filter((b) => /home/i.test(b.getAttribute('aria-label') ?? ''));
    expect(home.length).toBe(1);
    expect(home[0].getAttribute('aria-label')).toBe('SettlementForge home');
    // It is the BRAND block, outside the ribbon — not a seventh nav cell.
    expect(home[0].closest('nav')).toBeNull();
  });
});

describe('mobile bottom nav — the core flow reads whole (§767.3(f))', () => {
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

  test('the whole core flow draws: Create → Library → Realm, and no arrow past Realm (§767.3(f))', () => {
    const { container } = render(<App />);

    // Pin the composition first: Realm holds the third seat (About yielded its
    // seat by priority and kept its footer door), so the assertions below are
    // about the arrows and not about a bar that lost a tab. The footer ribbon
    // now carries its own About button, so the census excludes the footer nav —
    // this pin is about the BAR's seats.
    const labels = [...container.querySelectorAll('button')]
      .filter((b) => !b.closest('nav[aria-label="Footer"]'))
      .map((b) => b.textContent.trim())
      .filter((txt) => ['Create', 'Library', 'Gallery', 'Compendium', 'About', 'Realm'].includes(txt));
    expect(labels).toEqual(['Create', 'Library', 'Realm', 'Gallery', 'Compendium']);
    // And the About door really does survive in the footer (the eviction's
    // other half — losing it there would strand About on mobile entirely).
    const footerAbout = [...container.querySelectorAll('nav[aria-label="Footer"] button')]
      .map((b) => b.textContent.trim());
    expect(footerAbout).toContain('About');

    // Both flow chevrons draw — the saved settlement's journey reads whole.
    expect(screen.getByTestId('nav-flow-generate-settlements')).toBeTruthy();
    expect(screen.getByTestId('nav-flow-settlements-realm')).toBeTruthy();
    // And nothing teaches a false step past the flow's end (Realm → Gallery).
    expect(screen.queryByTestId('nav-flow-realm-gallery')).toBeNull();
    expect(arrows(container).map((a) => a.dataset.testid)).toEqual([
      'nav-flow-generate-settlements',
      'nav-flow-settlements-realm',
    ]);
  });
});

describe('every chrome button speaks its name (§767.3(i) prevention)', () => {
  // The walk reported anonymous buttons to a screen reader on the nav chrome.
  // A live census at both breakpoints found none surviving, so this arm is the
  // PREVENTION, not the cure: any button the App chrome renders must expose a
  // computed accessible name — aria-label, aria-labelledby, or visible
  // (non-aria-hidden) text. A glyph-only button whose glyph is aria-hidden has
  // NO name; textContent alone cannot prove one, which is exactly how the
  // class ships silently.
  const accText = (el) => {
    if (el.nodeType === 3) return el.textContent;
    if (el.nodeType !== 1) return '';
    if (el.getAttribute('aria-hidden') === 'true') return '';
    let s = '';
    for (const c of el.childNodes) s += accText(c);
    if (el.tagName === 'IMG') s += el.getAttribute('alt') || '';
    return s;
  };
  const accName = (b) => {
    const al = b.getAttribute('aria-label');
    if (al && al.trim()) return al.trim();
    const lb = b.getAttribute('aria-labelledby');
    if (lb) {
      const t = lb.split(/\s+/).map((id) => document.getElementById(id)?.textContent || '').join(' ').trim();
      if (t) return t;
    }
    return accText(b).trim() || (b.getAttribute('title') || '').trim();
  };

  // Two literal tests, not a test.each: a parameterized case is invisible to
  // the lighting census by construction and would park this WHOLE file.
  const assertNoAnonymousButton = (mobile) => {
    H.isMobile = mobile;
    const { container } = render(<App />);
    const buttons = [...container.querySelectorAll('button, [role="button"]')];
    // Positive control: the chrome actually rendered a real button set.
    expect(buttons.length).toBeGreaterThan(3);
    const anonymous = buttons.filter((b) => !accName(b)).map((b) => b.outerHTML.slice(0, 120));
    expect(anonymous).toEqual([]);
  };

  test('mobile chrome renders no anonymous button', () => {
    assertNoAnonymousButton(true);
  });

  test('desktop chrome renders no anonymous button', () => {
    assertNoAnonymousButton(false);
  });
});
