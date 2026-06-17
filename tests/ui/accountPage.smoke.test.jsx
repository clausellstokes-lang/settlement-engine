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
import { render, cleanup } from '@testing-library/react';

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
  maxSaves: () => 3,
  authSignOut: vi.fn(),
  setAuth: vi.fn(),
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
});
