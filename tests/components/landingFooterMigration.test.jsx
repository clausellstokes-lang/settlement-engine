/**
 * @vitest-environment jsdom
 *
 * tests/components/landingFooterMigration.test.jsx: ONE FOOTER ON EVERY ROUTE, THE
 * LANDING INCLUDED, and nothing legal falls off the edge doing it.
 *
 * HISTORY. LD-3 (owner, 2026-08-01) suppressed the global footer on the landing so
 * the page ended on its artwork band, and MIGRATED the footer's row into that band
 * (the band carried Terms, Privacy, Feedback & support and Pricing instead). The
 * owner's order of 2026-09-16 reverses the exemption: "The footer is missing on the
 * landing page ... The footer should be the same way on every page", pinned the way
 * the header is. So the landing now renders the app's one global footer, and the
 * band's own copy of the row is gone, because keeping it would stack exactly the
 * "two footers" LD-3 removed.
 *
 * THE PINS:
 *   1. every route renders the global <footer> with the row inside, the landing too;
 *   2. every legal/commercial destination is reachable FROM THE LANDING DOCUMENT
 *      (a Terms/Privacy absence is a legal defect; Pricing's is its commercial twin,
 *      since routes.js gives /pricing no `nav:` block);
 *   3. exactly ONE row on the landing, inside the footer and not inside the band;
 *   4. one row module, one copy truth.
 *
 * The pinned (sticky) geometry is not asserted here: jsdom has no layout engine.
 * tests/components/pinnedFooter.test.jsx pins the style contract and
 * e2e/pinned-footer.spec.js pins the geometry in a real browser.
 */

import React from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { t } from '../../src/copy/footer.js';
import LegalRibbonRow, { footerLinks } from '../../src/components/footer/LegalRibbonRow.jsx';
import { barNav } from '../../src/lib/routes.js';
import { landing } from '../../src/copy/landing.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const H = vi.hoisted(() => ({
  route: { view: 'compendium', params: {}, legacy: false, notFound: false },
  isMobile: false,
  storeState: null,
}));

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

// ⚠️ THE MOCK ABOVE IS NOT LOAD-BEARING FOR THE TEARDOWN RACE, and that is why this
// leaf mock exists beside it. Mocking a module's EXPORTS does not sever its MODULE
// GRAPH: App.jsx's mount effect calls `import('./lib/stripe.js')` directly, and a
// dynamic import inside a source module does NOT resolve through a test's `vi.mock`
// factory — the real stripe.js is fetched anyway, and its line-17
// `import { fetchCreditBalanceFromLedger } from './creditLedger.js'` can land after
// jsdom is torn down, producing one unhandled `EnvironmentTeardownError` per
// `render(<App />)` and a non-zero exit while every test still passes.
//
// PREVENTIVE, not a repair: measured 2026-08-04 at HEAD 1453676b, this file was green
// on 9 of 9 solo runs. Its two shell renders are the exposure, and three sibling
// suites have already been bitten (navFlowArrows, navFletching, navDividers — the last
// red on 2 of 9 runs with 9 errors against 9 renders). The exposure here is worse than
// two renders suggests: the landing pin deliberately does NOT stub HomeLanding, so the
// real below-fold chunk resolves under an 8s findByText, widening the window in which
// teardown can win the race.
//
// This voids no pin. Under the supabase stub above (`isConfigured: false`) the REAL
// `fetchCreditBalanceFromLedger` returns 0 at its first line without touching the
// network, so the mock's resolved value is what the real module already produced here,
// and nothing in this file asserts on the credit balance.
vi.mock('../../src/lib/creditLedger.js', () => ({
  fetchCreditBalanceFromLedger: () => Promise.resolve(0),
}));

vi.mock('../../src/components/pricing/PricingMomentCard.jsx', () => ({
  default: () => null,
}));

// The COMPENDIUM view is stubbed — it is only the "some other route" control
// here. The LANDING is deliberately NOT stubbed: the whole point of pin 2 is
// that the migrated row is reachable in the real landing document, so the real
// HomeLanding (and its lazy below-fold chunk) renders.
vi.mock('../../src/components/CompendiumPanel.jsx', () => ({
  default: () => <div data-testid="compendium-view">compendium</div>,
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

/** The four migrated destinations, by their one copy truth. */
const MIGRATED = ['footer.pricing', 'footer.contact', 'footer.terms', 'footer.privacy'].map((k) => t(k));

beforeEach(() => {
  H.route = { view: 'compendium', params: {}, legacy: false, notFound: false };
  H.isMobile = false;
  H.storeState = makeState();
  window.history.replaceState(null, '', '/compendium');
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('one footer on every route (owner order 2026-09-16 supersedes the LD-3 landing exemption)', () => {
  test('a non-landing route renders the global footer strip, with the row inside', () => {
    const { container } = render(<App />);
    const footer = container.querySelector('footer');
    expect(footer, 'every view keeps the global footer').not.toBeNull();
    expect(footer.querySelector('[data-testid="legal-ribbon-row"]')).not.toBeNull();
    for (const label of MIGRATED) {
      expect(screen.getByText(label)).toBeTruthy();
    }
  });

  test('the landing route renders the global footer too, with exactly one row and nothing lost', async () => {
    H.route = { view: 'home', params: {}, legacy: false, notFound: false };
    window.history.replaceState(null, '', '/');
    const { container } = render(<App />);

    // Presence control FIRST: the REAL landing's lazy below-fold chunk rendered. The
    // anchor is the closer's headline, which ONLY that chunk renders: the eager
    // footer now supplies "Terms" on first render, so waiting on "Terms" (the LD-3
    // anchor) would no longer prove the band exists, and the one-row count below
    // would pass on a shell whose band never loaded.
    await screen.findByText(landing.closer.h2, {}, { timeout: 8000 });

    // The order: the landing carries the app's one global footer, row inside.
    const footer = container.querySelector('footer');
    expect(footer, 'the landing renders the global footer (2026-09-16)').not.toBeNull();
    expect(footer.querySelector('[data-testid="legal-ribbon-row"]')).not.toBeNull();

    // Every legal/commercial destination is reachable from THIS document.
    for (const label of MIGRATED) {
      expect(screen.getAllByText(label).length, `${label} must be on the landing`).toBeGreaterThan(0);
    }
    expect(screen.getByText(t('footer.antiAi'))).toBeTruthy();
    expect(screen.getByText(t('footer.copyright', { year: 2026 }))).toBeTruthy();

    // ONE footer, never two: exactly one row and one Terms document-wide, and the
    // band (#closer) no longer carries a row of its own.
    expect(container.querySelectorAll('footer').length).toBe(1);
    expect(container.querySelectorAll('[data-testid="legal-ribbon-row"]').length).toBe(1);
    expect(screen.getAllByText(t('footer.terms')).length).toBe(1);
    const closer = container.querySelector('#closer');
    expect(closer, 'the band rendered (the lazy chunk resolved)').not.toBeNull();
    expect(closer.querySelector('[data-testid="legal-ribbon-row"]')).toBeNull();
  });
});

describe('the row itself: one copy truth', () => {
  test('every label comes from copy/footer.js, never a literal', () => {
    render(<LegalRibbonRow isMobile={false} onNavigate={() => {}} />);
    for (const label of MIGRATED) expect(screen.getByText(label)).toBeTruthy();
    // The namespace trap: a `tl('footer.terms')` resolution would render the
    // literal key string. Prove the rendered text is the RESOLVED copy.
    expect(screen.queryByText('footer.terms')).toBeNull();
    expect(t('footer.terms')).not.toBe('footer.terms');
  });

  // ⛔ THE TWO ORPHANS (2026-09-18). /about/guide and /roadmap had ZERO inbound
  // links outside lib/routes.js — no nav block, no page pointing at either — so
  // the only ways in were the sitemap and typing the URL. The ribbon is now the
  // door routes.js already credited it with, and these arms are what keeps it one.
  test('the Guide and the Roadmap are in the row, and each routes to its own view', () => {
    const onNavigate = vi.fn();
    render(<LegalRibbonRow isMobile={false} onNavigate={onNavigate} />);
    for (const [key, view] of [['footer.guide', 'about-guide'], ['footer.roadmap', 'roadmap']]) {
      const label = t(key);
      expect(label, `${key} must resolve to real copy, never the key string`).not.toBe(key);
      const button = screen.getByText(label).closest('button');
      expect(button, `${label} is not in the footer row`).toBeTruthy();
      button.click();
      expect(onNavigate).toHaveBeenCalledWith(view);
    }
  });

  /**
   * ⛔ ABOUT APPEARS ONCE PER SURFACE (the owner, ODQ §934.26 addendum). The row's About
   * link existed because the bar's five-seat cap used to evict About; the cap left with
   * the Realm's phone seat, so About is in the primary nav at EVERY width and this link
   * had become the second door. `footerLinks` decides it with ONE predicate over the ONE
   * nav order, so the rule is a live derivation rather than a deletion.
   */
  test('About is absent from the row at BOTH widths, and its siblings are not', () => {
    for (const [label, isMobile] of [['1440', false], ['375', true]]) {
      const view = render(<LegalRibbonRow isMobile={isMobile} onNavigate={() => {}} />);
      const labels = [...view.container.querySelectorAll('nav[aria-label="Footer"] button')]
        .map((b) => b.textContent.trim());
      // ANCHORED: Pricing is asserted PRESENT in the same collection, so "no About"
      // cannot pass because the row rendered nothing at all.
      expectAbsentWithAnchor(labels, t('footer.about'), t('footer.pricing'), `the footer row at ${label}`);
      expectAbsentWithAnchor(labels, t('footer.about'), t('footer.roadmap'), `the footer row at ${label}`);
      view.unmount();
    }
  });

  test('the predicate defers to the primary nav, and only to it', () => {
    // The rule is "a destination the primary nav already shows at this width", so the
    // answer is derived from barNav rather than from a list of ids. Both widths are
    // driven, because the nav's own set differs between them.
    for (const isMobile of [false, true]) {
      const shown = new Set(barNav(isMobile).map((item) => item.id));
      const rows = footerLinks(isMobile);
      // Nothing the nav shows survives…
      expect(rows.filter((r) => r.view && shown.has(r.view)), `a nav destination is drawn twice at ${isMobile ? 375 : 1440}`).toEqual([]);
      // …and nothing the nav does NOT show was dropped.
      const dropped = ['footer.pricing', 'footer.contact', 'footer.terms', 'footer.privacy', 'footer.guide', 'footer.roadmap']
        .filter((key) => !rows.some((r) => r.key === key));
      expect(dropped, 'the predicate dropped a link the nav never shows').toEqual([]);
      // It really is filtering — an identity function would satisfy both arms above.
      expect(rows.some((r) => r.key === 'footer.about')).toBe(false);
    }
    // ⛔ THE DERIVATION, NOT THE SNAPSHOT: About is hidden because it is IN the nav. If it
    // ever leaves, the link must come back with no edit to the footer.
    expect(barNav(false).map((i) => i.id)).toContain('about-what-this-is');
    expect(barNav(true).map((i) => i.id)).toContain('about-what-this-is');
  });

  test('Feedback & support opens the panel through the app-wide event', () => {
    const seen = vi.fn();
    window.addEventListener('sf:open-feedback', seen);
    render(<LegalRibbonRow isMobile={false} onNavigate={() => {}} />);
    screen.getByText(t('footer.contact')).closest('button').click();
    expect(seen).toHaveBeenCalledTimes(1);
    window.removeEventListener('sf:open-feedback', seen);
  });
});
