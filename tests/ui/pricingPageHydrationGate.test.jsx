/**
 * @vitest-environment jsdom
 *
 * tests/ui/pricingPageHydrationGate.test.jsx — LD-6 item 2, second half: THE
 * ANTI-DOUBLE-SUBSCRIBE HYDRATION GATE on the pricing page.
 *
 * THE DEFECT THIS PINS SHUT. Every subscribe-vs-manage decision on PricingPage
 * derives from the LOCAL store tier, which reads 'anon'/'free' until the session
 * resolves. An already-paying Cartographer who lands here mid-hydration — or
 * whose upgrade webhook has not landed yet — was shown the raw Subscribe CTA and
 * could buy a SECOND subscription against the same account.
 *
 * WHY THIS FILE AND NOT pricingPageBands/pricingPageVariant. Both of those
 * harnesses mock `isConfigured: false`, which makes TierCard's own
 * `notConfigured` arm disable every priced CTA unconditionally — the gate would
 * be unobservable there, and an assertion that cannot distinguish the two causes
 * is a vacuous green. This harness configures payments so "disabled" means the
 * hydration gate and nothing else, which the last case proves by driving the
 * SAME button to enabled with the only change being auth.loading.
 *
 * THE BLOCK IS NARROWED TO THE PURCHASE ACTION, deliberately:
 *   - the 'navigate' CTAs (Wanderer, Founder) stay live — they reach no checkout;
 *   - the 'manage' CTA is untouched — a subscriber must ALWAYS be able to reach
 *     billing, and it is already correct-by-default because it renders only for
 *     a KNOWN premium tier;
 *   - nothing about the HYDRATED behaviour moves.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';

beforeEach(() => { window.localStorage.clear(); window.history.replaceState({}, '', '/'); });

// Stripe / supabase / founder-seats are network — stub them. Unlike the sibling
// pricing harnesses this one reports payments as CONFIGURED, for the reason in
// the header.
vi.mock('../../src/lib/stripe.js', () => ({ startCheckout: vi.fn(), startCustomerPortal: vi.fn() }));
vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  withTimeout: (p) => p,
  supabase: {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      getUser: () => Promise.resolve({ data: { user: null } }),
    },
    functions: { invoke: () => Promise.resolve({ data: null, error: null }) },
    rpc: () => Promise.resolve({ data: null, error: null }),
  },
}));
vi.mock('../../src/lib/founderSeats.js', () => ({ FOUNDER_SEAT_CAP: 30, fetchFounderSeatsRemaining: vi.fn(async () => 17) }));
// THE LAUNCH GATE is OPEN for this file: it pins the purchase controls' live
// behaviour, which is what launch restores. The closed state is pinned in
// tests/components/launchLock.pricing.test.jsx.
vi.mock('../../src/lib/launchGate.js', async (importOriginal) => ({ ...(await importOriginal()), purchasesOpen: () => true }));

const HYDRATED_FREE = { tier: 'free', isFounder: false, displayName: '', loading: false };
const storeState = {
  auth: { ...HYDRATED_FREE },
  savedSettlements: [],
  lifetimeNarrateCount: 0,
  isElevated: () => false,
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  storeState.auth = { ...HYDRATED_FREE };
});

import PricingPage from '../../src/components/PricingPage.jsx';

/** Render the page with one auth shape, leaving every other prop alone. */
function renderWithAuth(auth) {
  storeState.auth = { ...HYDRATED_FREE, ...auth };
  return render(<PricingPage onNavigate={() => {}} />);
}

const SUBSCRIBE = /^Subscribe$/;
const MANAGE = /^Manage subscription$/;

describe('PricingPage — the anti-double-subscribe hydration gate (LD-6 item 2)', () => {
  it('HYDRATING: the Cartographer checkout CTA is blocked, under its OWN label', () => {
    renderWithAuth({ tier: 'free', loading: true });
    const cta = screen.getByRole('button', { name: SUBSCRIBE });
    expect(cta.disabled, 'a tier-unknown visitor can still start a subscription checkout').toBe(true);
    // The label must NOT be swapped to the in-flight-checkout wording: nothing is
    // redirecting, and a lying label is its own defect.
    expect(screen.queryByText(/Redirecting/i)).toBeNull();
  });

  it('HYDRATING: "Manage subscription" is never shown to a reader not yet known to be paid', () => {
    renderWithAuth({ tier: 'free', loading: true });
    expect(screen.queryByRole('button', { name: MANAGE })).toBeNull();
  });

  it('HYDRATING: the gate does NOT reach the navigate-only CTAs', () => {
    renderWithAuth({ tier: 'free', loading: true });
    // Wanderer's CTA only routes to the generator; blocking it would buy nothing
    // and cost a reader their first click.
    const wanderer = screen.getByRole('button', { name: /^Current plan$/ });
    expect(wanderer.disabled).toBe(false);
  });

  it('HYDRATED + free: the Subscribe CTA is live (unchanged)', () => {
    renderWithAuth({ tier: 'free', loading: false });
    const cta = screen.getByRole('button', { name: SUBSCRIBE });
    expect(cta.disabled).toBe(false);
  });

  it('HYDRATED + premium: the CTA is Manage subscription and is live (unchanged)', () => {
    renderWithAuth({ tier: 'premium', loading: false });
    const manage = screen.getByRole('button', { name: MANAGE });
    expect(manage.disabled).toBe(false);
    expect(screen.queryByRole('button', { name: SUBSCRIBE })).toBeNull();
  });

  it('NON-VACUITY: auth.loading is the ONLY difference between blocked and live', () => {
    // The same button, the same tier, the same harness — driven both ways. If
    // some other arm (notConfigured, an in-flight loading key) were doing the
    // disabling, both readings would agree and this case would red.
    const blocked = renderWithAuth({ tier: 'free', loading: true });
    expect(screen.getByRole('button', { name: SUBSCRIBE }).disabled).toBe(true);
    blocked.unmount();
    renderWithAuth({ tier: 'free', loading: false });
    expect(screen.getByRole('button', { name: SUBSCRIBE }).disabled).toBe(false);
  });
});
