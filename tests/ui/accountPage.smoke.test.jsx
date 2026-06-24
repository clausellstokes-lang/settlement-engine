/**
 * @vitest-environment jsdom
 *
 * tests/ui/accountPage.smoke.test.jsx — Decomposition lock-in.
 *
 * AccountPage.jsx was decomposed: its in-file Section + RoleBadge helpers and
 * the Profile / Subscription / Customer-Support sections moved into
 * src/components/account/{AccountSection,AccountProfileSection,
 * AccountSubscriptionSection,AccountSupportSection}.jsx. This is a
 * behavior-preserving move, so the regression net is simply: the page still
 * mounts and renders without throwing, wiring the extracted imports together
 * correctly. A broken relative-path/import in the split would throw on the
 * dynamic import or the render below and fail this test.
 *
 * We mock the store (the page reads ~8 selectors) and analytics (PrivacySettings
 * pulls it on mount). With a signed-in free user the page renders all four
 * sections; we assert the default export is a function and the page produces a
 * non-empty subtree.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, within } from '@testing-library/react';

afterEach(cleanup);

// Analytics is fire-and-forget; stub it so the mount path stays quiet and
// doesn't pull Supabase/network wiring into the test (PrivacySettings imports it).
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// Store mock. A mutable singleton drives every selector; useStore.subscribe
// returns a no-op unsubscribe. Defaults mirror a signed-in free user so all
// four sections render.
const storeState = {
  auth: {
    user: { id: 'u1', email: 'tester@example.com' },
    tier: 'free',
    role: 'user',
    displayName: 'Tester',
    avatarUrl: '',
    emailNotifications: true,
    modelPreference: null,
  },
  creditBalance: 0,
  isElevated: () => false,
  isDeveloper: () => false,
  savedSettlements: [],
  campaigns: [],
  maxSaves: () => 3,
  authSignOut: vi.fn(),
  setAuth: vi.fn(),
  // Recovery-questions section (Finding #4) reads/sets via these actions.
  authGetSecurityQuestionIds: vi.fn().mockResolvedValue([]),
  authSetSecurityAnswers: vi.fn().mockResolvedValue(undefined),
  // Phase A2 — new selectors/actions the page (and its new sections) read.
  removeSavedSettlement: vi.fn(),
  clearSavedSettlements: vi.fn(),
  deleteCampaign: vi.fn(),
  productPrefs: {
    defaultDetailLevel: 'guided', galleryPublicDefault: false, shareDefault: 'unlisted',
    playerViewDefault: false, pdfStyle: 'classic', aiPolishDefault: false, campaignMapAutosave: true,
  },
  setProductPref: vi.fn(),
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeState);
  }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

describe('AccountPage — decomposition smoke', () => {
  test('default export is a function', async () => {
    const AccountPage = (await import('../../src/components/AccountPage.jsx')).default;
    expect(typeof AccountPage).toBe('function');
  });

  test('mounts without throwing and renders a non-empty subtree', async () => {
    const AccountPage = (await import('../../src/components/AccountPage.jsx')).default;
    const { container } = render(<AccountPage onNavigateAdmin={() => {}} />);

    // Mount succeeded — the DOM exists and the page produced output. A broken
    // extraction (e.g. AccountSubscriptionSection → AccountSection import) would
    // throw above before reaching here.
    expect(document.body).toBeTruthy();
    expect(container.firstChild).not.toBeNull();
  });

  // ── Left-nav layout lock-in ────────────────────────────────────────────────
  // The reorg introduced a left-sidebar settings layout (AccountNav): a rail of
  // section rows + a focus-managed content panel that loads to Profile first.
  // These pin the IA so a future refactor can't silently drop a section, regress
  // the default landing, or strand a section's primary action.

  test('the nav rail exposes all six sections as a named landmark', async () => {
    const AccountPage = (await import('../../src/components/AccountPage.jsx')).default;
    render(<AccountPage onNavigateAdmin={() => {}} />);
    const nav = document.querySelector('nav[aria-label="Account settings"]');
    expect(nav).toBeTruthy();
    for (const label of ['Profile', 'Security', 'Subscription', 'Support', 'Data', 'Preferences']) {
      expect(within(nav).getByRole('button', { name: label })).toBeTruthy();
    }
  });

  test('Profile is the default section: its row is aria-current and its panel shows', async () => {
    const AccountPage = (await import('../../src/components/AccountPage.jsx')).default;
    render(<AccountPage onNavigateAdmin={() => {}} />);
    const nav = document.querySelector('nav[aria-label="Account settings"]');
    const profileRow = within(nav).getByRole('button', { name: 'Profile' });
    expect(profileRow.getAttribute('aria-current')).toBe('page');
    // Profile panel heading is present; the other section headings are not yet.
    expect(document.querySelector('section[aria-label="Profile"]')).toBeTruthy();
    expect(within(document.body).queryByRole('heading', { name: 'Profile' })).toBeTruthy();
    expect(within(document.body).queryByRole('heading', { name: 'Data and privacy' })).toBeNull();
  });

  // Smoke each section: clicking its rail row mounts the panel and surfaces that
  // section's primary surface (heading or primary action).
  const SECTION_SMOKE = [
    { row: 'Security', expectHeading: 'Login and security' },
    { row: 'Subscription', expectHeading: 'Subscription & Credits' },
    { row: 'Support', expectHeading: 'Customer Support' },
    { row: 'Data', expectHeading: 'Data and privacy' },
    { row: 'Preferences', expectHeading: 'Product Preferences' },
  ];

  for (const { row, expectHeading } of SECTION_SMOKE) {
    test(`selecting "${row}" renders its panel with its primary surface`, async () => {
      const AccountPage = (await import('../../src/components/AccountPage.jsx')).default;
      render(<AccountPage onNavigateAdmin={() => {}} />);
      const nav = document.querySelector('nav[aria-label="Account settings"]');
      fireEvent.click(within(nav).getByRole('button', { name: row }));
      // Active row is now aria-current; the section's heading is on-screen.
      expect(within(nav).getByRole('button', { name: row }).getAttribute('aria-current')).toBe('page');
      expect(within(document.body).getByRole('heading', { name: expectHeading })).toBeTruthy();
    });
  }

  test('Security also surfaces the account-recovery questions (grouped panel)', async () => {
    const AccountPage = (await import('../../src/components/AccountPage.jsx')).default;
    render(<AccountPage onNavigateAdmin={() => {}} />);
    const nav = document.querySelector('nav[aria-label="Account settings"]');
    fireEvent.click(within(nav).getByRole('button', { name: 'Security' }));
    expect(within(document.body).getByRole('heading', { name: 'Login and security' })).toBeTruthy();
    expect(within(document.body).getByRole('heading', { name: 'Account recovery questions' })).toBeTruthy();
  });

  test('Data primary action (Download JSON) is wired and the Import placeholder is inert', async () => {
    const AccountPage = (await import('../../src/components/AccountPage.jsx')).default;
    render(<AccountPage onNavigateAdmin={() => {}} />);
    const nav = document.querySelector('nav[aria-label="Account settings"]');
    fireEvent.click(within(nav).getByRole('button', { name: 'Data' }));
    expect(within(document.body).getByRole('button', { name: /Download JSON/i })).toBeTruthy();
    // Future import slot ships as a disabled "Coming soon" stub.
    expect(within(document.body).getByRole('button', { name: /Coming soon/i }).disabled).toBe(true);
  });

  test('the elevated-only Developer Admin row appears only when elevated', async () => {
    const AccountPage = (await import('../../src/components/AccountPage.jsx')).default;
    // Default mock: not elevated → no admin row.
    const { unmount } = render(<AccountPage onNavigateAdmin={() => {}} />);
    expect(within(document.body).queryByRole('button', { name: /Developer Admin Panel/i })).toBeNull();
    unmount();
    // Flip elevation and re-render.
    storeState.isElevated = () => true;
    render(<AccountPage onNavigateAdmin={() => {}} />);
    expect(within(document.body).getByRole('button', { name: /Developer Admin Panel/i })).toBeTruthy();
    storeState.isElevated = () => false;
  });
});
