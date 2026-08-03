/**
 * @vitest-environment jsdom
 *
 * tests/components/landingFooterMigration.test.jsx — THE PAGE ENDS ON THE
 * PAINTING (LD-3), and nothing legal falls off the edge doing it.
 *
 * The owner's order: the landing stacked TWO footers — its own artwork band and
 * then the global app strip — so the global strip is suppressed and the artwork
 * is the end of the page. The danger the order creates is the whole reason this
 * file exists: the suppressed strip carried Terms, Privacy, Feedback & support
 * and Pricing. Dropping Terms or Privacy from the marketing front door is a
 * LEGAL defect, and dropping Pricing is its commercial twin — routes.js gives
 * /pricing no `nav:` block, so the footer is the landing's ONLY path to it.
 * LD-3 is therefore a MIGRATION, and these are its pins:
 *
 *   1. the suppression is ROUTE-SCOPED, never a global deletion;
 *   2. every migrated destination is reachable FROM THE LANDING DOCUMENT;
 *   3. one row module serves both surfaces, so the copy cannot fork;
 *   4. the landing row reserves clearance above the FIXED mobile bottom nav —
 *      the clearance the suppressed footer's own padding used to provide.
 *
 * Pin 4 is asserted as the STYLE CONTRACT, not as geometry: jsdom has no layout
 * engine, so a bounding-rect assertion here would be vacuous. LD-3's
 * rect-above-the-bar check belongs to the browser harness and is recorded as
 * deferred rather than faked.
 */

import React from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { t } from '../../src/copy/footer.js';
import LegalRibbonRow from '../../src/components/footer/LegalRibbonRow.jsx';
import { CHROME } from '../../src/components/theme.js';

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

describe('the suppression is route-scoped — a landing exemption, not a deletion', () => {
  test('a non-landing route still renders the global footer strip, with the row inside', () => {
    const { container } = render(<App />);
    const footer = container.querySelector('footer');
    expect(footer, 'every non-landing view keeps the global footer').not.toBeNull();
    expect(footer.querySelector('[data-testid="legal-ribbon-row"]')).not.toBeNull();
    for (const label of MIGRATED) {
      expect(screen.getByText(label)).toBeTruthy();
    }
  });

  test('the landing route renders NO global footer, and loses nothing to it', async () => {
    H.route = { view: 'home', params: {}, legacy: false, notFound: false };
    window.history.replaceState(null, '', '/');
    const { container } = render(<App />);

    // Presence control FIRST: the REAL landing (and its lazy below-fold chunk)
    // rendered. Without this the absence assertions below would pass just as
    // happily on a blank shell.
    await screen.findByText(t('footer.terms'), {}, { timeout: 8000 });

    // The order: the artwork band is the end of the page.
    expect(container.querySelector('footer')).toBeNull();

    // The migration: every destination the suppressed strip carried is still
    // reachable from THIS document. A Terms/Privacy absence is a legal defect
    // and Pricing's is its commercial twin (routes.js gives it no nav block).
    for (const label of MIGRATED) {
      expect(screen.getAllByText(label).length, `${label} must survive on the landing`).toBeGreaterThan(0);
    }
    expect(screen.getByText(t('footer.antiAi'))).toBeTruthy();
    expect(screen.getByText(t('footer.copyright', { year: 2026 }))).toBeTruthy();

    // MIGRATED, never duplicated: one row, and no hand-rolled facsimile beside it.
    expect(container.querySelectorAll('[data-testid="legal-ribbon-row"]').length).toBe(1);
    expect(screen.getAllByText(t('footer.terms')).length).toBe(1);
  });
});

describe('the row itself — one copy truth, and the clearance the footer used to give', () => {
  test('every label comes from copy/footer.js, never a literal', () => {
    render(<LegalRibbonRow isMobile={false} onNavigate={() => {}} />);
    for (const label of MIGRATED) expect(screen.getByText(label)).toBeTruthy();
    // The namespace trap: a `tl('footer.terms')` resolution would render the
    // literal key string. Prove the rendered text is the RESOLVED copy.
    expect(screen.queryByText('footer.terms')).toBeNull();
    expect(t('footer.terms')).not.toBe('footer.terms');
  });

  test('Feedback & support opens the panel through the app-wide event', () => {
    const seen = vi.fn();
    window.addEventListener('sf:open-feedback', seen);
    render(<LegalRibbonRow isMobile={false} onNavigate={() => {}} />);
    screen.getByText(t('footer.contact')).closest('button').click();
    expect(seen).toHaveBeenCalledTimes(1);
    window.removeEventListener('sf:open-feedback', seen);
  });

  test('the landing row reserves clearance above the fixed mobile bottom nav', () => {
    const { container } = render(<LegalRibbonRow isMobile onNavigate={() => {}} clearMobileNav />);
    const pad = container.querySelector('[data-testid="legal-ribbon-row"]').style.paddingBottom;
    // Composed from the FROZEN chrome token plus the safe-area inset — a bare
    // inset does not clear the ~57px bar, which is the bug this guards.
    expect(pad).toContain(`${CHROME.footerPadMobile}px`);
    expect(pad).toContain('safe-area-inset-bottom');
  });

  test('desktop and the global-footer mount take no such padding', () => {
    const { container: desktop } = render(<LegalRibbonRow isMobile={false} onNavigate={() => {}} clearMobileNav />);
    expect(desktop.querySelector('[data-testid="legal-ribbon-row"]').style.paddingBottom).toBe('');
    cleanup();
    // The global footer supplies its own padding, so the row must not add a
    // second clearance there (the double-pad the migration could have created).
    const { container: inFooter } = render(<LegalRibbonRow isMobile onNavigate={() => {}} showHome />);
    expect(inFooter.querySelector('[data-testid="legal-ribbon-row"]').style.paddingBottom).toBe('');
  });
});
