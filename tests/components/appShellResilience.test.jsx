/**
 * @vitest-environment jsdom
 *
 * tests/components/appShellResilience.test.jsx — the app-shell hardening fixes.
 *
 * Reproducing tests for three app-shell findings:
 *   (1) A lazy chunk-load (or synchronous render) failure inside the routed
 *       Suspense must degrade to a recoverable in-place card (Reload / Try
 *       again), NOT propagate to the root and white-screen the whole app.
 *   (2) The bare root '/' must canonicalize to /home regardless of redirect
 *       effect declaration order — the canonical-URL upgrade must NOT race the
 *       front door by rewriting '/' to the default /create.
 *   (3) Dismissing the onboarding-nudge toast (role="button") via Space must
 *       call preventDefault so the page doesn't scroll on activation.
 *
 * App.jsx is a pure layout shell over the Zustand store + path router. We stub
 * the store (selector-over-plain-object), the route hook, and the lazy view
 * modules so the render exercises only the shell logic under test.
 */

import React from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

// vi.mock factories are hoisted above all top-level `const`s, so every value a
// factory closes over must itself be hoisted. `H` is the shared mutable ref bag
// the tests write to and the factories read from.
const H = vi.hoisted(() => ({
  route: { view: 'generate', params: {}, legacy: false, notFound: false },
  hasToken: false,
  storeState: null,
  GenerateImpl: () => null,
}));

// ── Route hook stub ────────────────────────────────────────────────────────
// useRoute is overridden per-test; navigate/replacePath are spies so we can
// assert the redirect decisions without touching real history.
const { replacePath, navigate } = vi.hoisted(() => ({ replacePath: vi.fn(), navigate: vi.fn() }));
vi.mock('../../src/hooks/useRoute.js', () => ({
  useRoute: () => H.route,
  navigate,
  replacePath,
}));

// ── Auth-token stub (drives the front-door wait) ───────────────────────────
// `supabase` is stubbed too: the mount effects dynamic-import stripe.js, which
// (even mocked) is resolved lazily — a real-module fallback would reach into
// supabase.auth and reject post-test. The auth stub keeps those effects inert.
vi.mock('../../src/lib/supabase.js', () => ({
  hasStoredAuthToken: () => H.hasToken,
  isConfigured: false,
  supabase: { auth: { getUser: () => Promise.resolve({ data: { user: null } }) } },
}));

vi.mock('../../src/hooks/useIsMobile', () => ({ default: () => false }));

// ── Store stub ─────────────────────────────────────────────────────────────
// App reads ~25 selectors + useStore.getState(). A selector-over-plain-object
// stub keeps the real store (persist / supabase / analytics) out of the render.
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
    initOnboarding: vi.fn(),
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
    // Read by the always-mounted children (PostGenCoach, CampaignSyncBanner).
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

// stripe.js is dynamically imported in a mount effect; stub it so the effect
// resolves without network.
vi.mock('../../src/lib/stripe.js', () => ({
  checkCheckoutResult: () => null,
  fetchCreditBalance: () => Promise.resolve(0),
}));

// ── Lazy view stubs ────────────────────────────────────────────────────────
// The default `generate` view. Overridable per-test (e.g. to throw).
vi.mock('../../src/components/GenerateWizard.jsx', () => ({
  default: (props) => H.GenerateImpl(props),
}));

import App from '../../src/App.jsx';

beforeEach(() => {
  H.route = { view: 'generate', params: {}, legacy: false, notFound: false };
  H.hasToken = false;
  replacePath.mockClear();
  navigate.mockClear();
  H.GenerateImpl = () => <div data-testid="generate-view">create</div>;
  H.storeState = makeState();
  window.history.replaceState(null, '', '/create');
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('(1) routed Suspense is wrapped in a recoverable error boundary', () => {
  test('a view that throws degrades to a recoverable card, not a propagated throw', async () => {
    // Silence the expected boundary console.error noise.
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    H.GenerateImpl = () => { throw new Error('chunk load failed'); };

    // Before the fix there is no boundary around the routed Suspense, so the
    // throw escapes to the root (which lives outside App) — here that surfaces
    // as the recoverable card NEVER appearing. The boundary added in the fix
    // catches the throw and renders the fallback instead. The lazy view resolves
    // a microtask after the initial render, so we await the boundary's card.
    expect(() => render(<App />)).not.toThrow();
    expect(await screen.findByText(/couldn.t be loaded/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /reload/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /try again/i })).toBeTruthy();
    // The broken view's content is absent — only the fallback shows.
    expect(screen.queryByTestId('generate-view')).toBeNull();

    errSpy.mockRestore();
  });
});

describe('(2) bare root is owned by the front door, order-independent', () => {
  test("'/' canonicalizes to /home and is never rewritten to /create", () => {
    // At the bare root, resolveLocation yields the DEFAULT_VIEW (generate) with
    // no legacy/notFound. The front door must claim '/'; the canonical-upgrade
    // effect must NOT race it by rewriting '/' to viewToPath('generate')=/create.
    window.history.replaceState(null, '', '/');
    H.route = { view: 'generate', params: {}, legacy: false, notFound: false };

    render(<App />);

    const targets = replacePath.mock.calls.map((c) => c[0]);
    expect(targets).toContain('/home');
    // The pre-fix canonical-upgrade effect rewrote the bare root to /create.
    expect(targets).not.toContain('/create');
  });

  test("a returning signed-in visitor at '/' also lands on /home, not /create", () => {
    // The stale comments (routes.js home entry, App's home-render note) claimed
    // returning visitors land on /create via a localStorage gate. There is no
    // such gate: the front door rewrites '/' to /home for EVERYONE, signed-in
    // members included. With a restored session (token present, auth resolved),
    // the effect still fires once authLoading clears.
    window.history.replaceState(null, '', '/');
    H.route = { view: 'generate', params: {}, legacy: false, notFound: false };
    H.hasToken = true;
    H.storeState = makeState({ auth: { tier: 'premium', displayName: 'Returning Member', role: null, user: { id: 'u1' }, loading: false } });

    render(<App />);

    const targets = replacePath.mock.calls.map((c) => c[0]);
    expect(targets).toContain('/home');
    expect(targets).not.toContain('/create');
  });

  test('legacy / notFound paths still upgrade to their canonical path', () => {
    // The canonical-upgrade effect must still fire for non-root legacy URLs.
    window.history.replaceState(null, '', '/settlements?view=settlements');
    H.route = { view: 'settlements', params: {}, legacy: true, notFound: false };
    H.storeState = makeState({ auth: { tier: 'premium', displayName: 'X', role: null, user: { id: 'u1' }, loading: false } });

    render(<App />);

    const targets = replacePath.mock.calls.map((c) => c[0]);
    // ?view= is stripped to the canonical /settlements.
    expect(targets).toContain('/settlements');
  });
});

describe('(3) onboarding nudge dismiss prevents default on Space', () => {
  test('Space keydown dismisses and calls preventDefault (no page scroll)', () => {
    const clearOnboardingNudge = vi.fn();
    H.storeState = makeState({ onboardingNudge: 'Saved as Westhollow', clearOnboardingNudge });

    render(<App />);

    const toast = screen.getByText('Saved as Westhollow').closest('[role="button"]');
    expect(toast).toBeTruthy();

    // fireEvent.keyDown returns false when a handler called preventDefault.
    const notPrevented = fireEvent.keyDown(toast, { key: ' ', code: 'Space' });
    expect(clearOnboardingNudge).toHaveBeenCalledTimes(1);
    expect(notPrevented).toBe(false); // preventDefault was called

    // Enter also dismisses + prevents default.
    clearOnboardingNudge.mockClear();
    const enterNotPrevented = fireEvent.keyDown(toast, { key: 'Enter', code: 'Enter' });
    expect(clearOnboardingNudge).toHaveBeenCalledTimes(1);
    expect(enterNotPrevented).toBe(false);
  });
});
