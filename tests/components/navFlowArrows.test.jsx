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
 * ⚠️ SURFACE CHANGE, 2026-09-16 (owner orders: THE PAINTED ARROW). The header is
 * now the owner's arrow painting (components/nav/ArrowHeader.jsx), whose six painted
 * words are the primary nav from 1024 px up; the painting carries no drawn mark of
 * ours, so NavFlowArrow never mounts in the header. The bottom bar (below 1024 px)
 * keeps NavFlowArrow untouched and is the live behavioural pin.
 *
 * ⚠️ SURFACE CHANGE, 2026-09-19 (the owner, ODQ §934.26, SUPERSEDING §767.3(f) on
 * exactly this point): "I would remove the realm from the phone. No realm view for
 * phone but it can be viewed on a tablet." So the one bar is now two compositions, and
 * the adjacency guard — the reason this file exists — is what makes that cost no edit:
 *
 *   • painted header (1024 px and up)  Create · Library · Realm · …    → NO arrows
 *   • tablet bar (640 to 1023 px)      Create · Library · Realm · …    → BOTH arrows
 *   • phone bar (below 640 px)         Create · Library | Compendium…  → ONE arrow
 *
 * On the phone, Library's declared successor (Realm) is not the cell rendered next, so
 * the second chevron correctly does not draw and a hairline marks the working pair's
 * end instead. NAV_FLOW itself is UNCHANGED: the flow is still Create → Library →
 * Realm, and the guard reads it against each surface rather than against an ordering.
 * That is the whole argument for writing it as a relation, and this file is where it is
 * paid for.
 *
 * The retired ribbon's journey marks (the seam dividers and the fletched band) left
 * with the ribbon. Welcome is still not a nav cell: the arrow's nock and logo plate
 * are the home control.
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
  // The painted arrow's OWN switch is useIsMobile(1024); the bar's composition is
  // useIsMobile() at 640. They were one flag here until §934.26 made the phone and the
  // tablet different bars, so the two breakpoints are now driven apart (the
  // pinnedFooter.test.jsx idiom). `narrow: null` follows isMobile, as before.
  narrow: null,
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

vi.mock('../../src/hooks/useIsMobile', () => ({
  default: (bp) => (bp === 1024 ? (H.narrow ?? H.isMobile) : H.isMobile),
}));

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
  H.narrow = null;
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

describe('the painted header (1024 px and up): the words are the nav, and no flow arrow is drawn', () => {
  test('the header nav buttons speak the NAV labels in NAV order, and mount no in-tab flow arrow', () => {
    const { container } = render(<App />);

    // Positive control first: the painted words really rendered as the primary nav,
    // in routes.js's order, so the absence below is about the header drawing no mark
    // and not about a header that failed to render its regions.
    const labels = [...container.querySelectorAll('header nav button')].map((b) => b.textContent.trim());
    expect(labels).toEqual(NAV.map((n) => n.label));
    expect(labels.slice(0, 3)).toEqual(['Create', 'Library', 'Realm']);
    expect(container.querySelector('header nav').getAttribute('aria-label')).toBe('Primary');

    // The retired ribbon's journey marks left with it (the fletched band and the seam
    // dividers), and no NavFlowArrow is drawn inside the header.
    expect(container.querySelector('header').querySelectorAll('[data-testid^="nav-flow-"]').length).toBe(0);
    expect(container.querySelectorAll('[data-divider-kind]').length).toBe(0);
    expect(arrows(container)).toEqual([]);
  });

  test('the painted nock and logo plate are the one home button, outside the nav', () => {
    // Home stays REACHABLE without a Welcome tab. Pinning the door here, beside the
    // cells, means a future edit that removes it strands /home behind a bare URL.
    const { container } = render(<App />);
    const home = [...container.querySelectorAll('header button')]
      .filter((b) => /home/i.test(b.getAttribute('aria-label') ?? ''));
    expect(home.length).toBe(1);
    expect(home[0].getAttribute('aria-label')).toBe('SettlementForge home');
    // It is the brand region, outside the nav, not a seventh nav cell.
    expect(home[0].closest('nav')).toBeNull();
    expect(home[0].closest('header')).toBeTruthy();
  });
});

describe('the bottom bar (below 1024 px): two compositions, one flow declaration', () => {
  // The default in this block is the PHONE (both flags mobile); the tablet arms raise
  // `narrow` on their own, which is the only place the two breakpoints differ.
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

  test('the TABLET bar draws the whole core flow: Create → Library → Realm, and nothing past it', () => {
    // 640 to 1023 px: the painted words have left the header but the Realm is still a
    // destination (§934.26: "it can be viewed on a tablet"), so the flow reads whole.
    H.isMobile = false;
    H.narrow = true;
    const { container } = render(<App />);

    // Pin the composition first, so the assertions below are about the arrows and not
    // about a bar that lost a tab. The footer ribbon carries its own About button, so
    // the census excludes the footer nav — this pin is about the BAR's seats.
    const labels = [...container.querySelectorAll('button')]
      .filter((b) => !b.closest('nav[aria-label="Footer"]'))
      .map((b) => b.textContent.trim())
      .filter((txt) => ['Create', 'Library', 'Gallery', 'Compendium', 'About', 'Realm'].includes(txt));
    expect(labels).toEqual(['Create', 'Library', 'Realm', 'Compendium', 'Gallery', 'About']);

    // Both flow chevrons draw — the saved settlement's journey reads whole.
    expect(screen.getByTestId('nav-flow-generate-settlements')).toBeTruthy();
    expect(screen.getByTestId('nav-flow-settlements-realm')).toBeTruthy();
    // And nothing teaches a false step past the flow's end (Realm → Compendium).
    expect(screen.queryByTestId('nav-flow-realm-compendium')).toBeNull();
    expect(arrows(container).map((a) => a.dataset.testid)).toEqual([
      'nav-flow-generate-settlements',
      'nav-flow-settlements-realm',
    ]);
  });

  test('the PHONE bar drops the Realm, so the second chevron stops drawing by the guard alone (§934.26)', () => {
    const { container } = render(<App />);

    // The owner's five, in the painting's order, and no Realm among them.
    const labels = [...container.querySelectorAll('button')]
      .filter((b) => !b.closest('nav[aria-label="Footer"]'))
      .map((b) => b.textContent.trim())
      .filter((txt) => ['Create', 'Library', 'Gallery', 'Compendium', 'About', 'Realm'].includes(txt));
    expect(labels).toEqual(['Create', 'Library', 'Compendium', 'Gallery', 'About']);

    // ⭐ THE GUARD IS THE POINT. NAV_FLOW still says Library feeds Realm; Realm is simply
    // not the cell rendered next here, so the chevron that would teach a false step is
    // withheld with no edit to the flow declaration.
    expect(NAV_FLOW.settlements, 'the flow declaration itself moved').toBe('realm');
    expect(arrows(container).map((a) => a.dataset.testid)).toEqual(['nav-flow-generate-settlements']);
    // anchored: the surviving chevron above proves the bar really drew its marks, so this
    // absence is the guard working and not an unrendered bar.
    expect(screen.queryByTestId('nav-flow-settlements-realm')).toBeNull();
    expect(screen.queryByTestId('nav-flow-settlements-compendium')).toBeNull();
  });

  test('the hairline replaces the withheld chevron, on the phone only', () => {
    // §934.26: "a hairline after the working pair (Create, Library) before the reference
    // pages". The rule lives on the cell that OPENS the reference run, so exactly one
    // bar cell carries a left border and it is Compendium's.
    const seats = (root) => [...root.querySelectorAll('nav[aria-label="Primary"] button')];
    const phone = render(<App />);
    const ruled = seats(phone.container).filter((b) => b.style.borderLeft && b.style.borderLeft !== 'none');
    expect(seats(phone.container).length, 'presence control: the phone bar drew its seats').toBe(5);
    expect(ruled.map((b) => b.textContent.trim())).toEqual(['Compendium']);
    phone.unmount();

    H.isMobile = false;
    H.narrow = true;
    const tablet = render(<App />);
    expect(seats(tablet.container).length, 'presence control: the tablet bar drew its seats').toBe(6);
    // anchored: the tablet's six seats are asserted above, so an empty rule list here is
    // measured against a bar that really rendered.
    expect(seats(tablet.container).filter((b) => b.style.borderLeft && b.style.borderLeft !== 'none')).toEqual([]);
  });

});

/**
 * ⛔ ABOUT APPEARS ONCE PER SURFACE (the owner, ODQ §934.26 addendum).
 *
 * About used to hold a footer door BECAUSE the bar's five-seat cap evicted it. The cap is
 * gone with the Realm's phone seat, so About has a seat at every width the bar draws and a
 * painted plate above 1024 — and the footer link had quietly become the second door on
 * every surface. The rule is enforced by ONE predicate over the ONE nav order
 * (components/footer/LegalRibbonRow.jsx `footerLinks`), and these arms measure the WHOLE
 * DOCUMENT, which is the only place the duplication was ever visible.
 */
describe('ABOUT APPEARS ONCE PER SURFACE (§934.26 addendum)', () => {
  /** Every control in the document whose visible name is exactly About. */
  const aboutControls = (container) => [...container.querySelectorAll('button')]
    .filter((b) => b.textContent.trim() === 'About');

  test('at 1440 there is exactly one About, and it is the painted plate', () => {
    const { container } = render(<App />);
    // Positive control: the header really drew its six painted words, so "exactly one"
    // is measured against a rendered nav and not against a page that failed.
    const painted = [...container.querySelectorAll('header nav button')].map((b) => b.textContent.trim());
    expect(painted).toEqual(NAV.map((n) => n.label));

    const abouts = aboutControls(container);
    expect(abouts).toHaveLength(1);
    expect(abouts[0].closest('header'), 'the one About is not in the header').not.toBeNull();
    expect(abouts[0].closest('nav[aria-label="Footer"]'), 'About is still in the footer row').toBeNull();
  });

  test('at 375 there is exactly one About, and it is the bar seat', () => {
    H.isMobile = true;
    const { container } = render(<App />);
    // Positive control: the phone bar drew its five seats.
    expect(container.querySelectorAll('nav[aria-label="Primary"] button')).toHaveLength(5);

    const abouts = aboutControls(container);
    expect(abouts).toHaveLength(1);
    expect(abouts[0].closest('nav[aria-label="Primary"]'), 'the one About is not in the bar').not.toBeNull();
    expect(abouts[0].closest('footer'), 'About is still in the phone footer').toBeNull();
  });

  test('the footer keeps its own destinations at both widths (it lost a duplicate, not a row)', () => {
    for (const mobile of [false, true]) {
      H.isMobile = mobile;
      const view = render(<App />);
      const labels = [...view.container.querySelectorAll('nav[aria-label="Footer"] button')]
        .map((b) => b.textContent.trim());
      expect(labels, `the footer row emptied at ${mobile ? 375 : 1440}`)
        .toEqual(['Pricing', 'Feedback & support', 'Terms', 'Privacy', 'Guide', 'Roadmap']);
      view.unmount();
    }
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
