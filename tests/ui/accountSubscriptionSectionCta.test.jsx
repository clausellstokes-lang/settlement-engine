/**
 * @vitest-environment jsdom
 *
 * tests/ui/accountSubscriptionSectionCta.test.jsx — the restored free-tier
 * conversion CTA (census §1 #6).
 *
 * The Subscription section is the account page's one conversion region. For a
 * free user it carries a single high-emphasis "See Cartographer" upgrade CTA
 * whose only job is to NAVIGATE to Pricing — it is navigation-only and must
 * never touch a purchase/checkout path. This pins:
 *   - the CTA renders for a free user and, on click, calls onNavigatePricing
 *     (and nothing else — no handlePurchase / handleManageBilling);
 *   - premium and elevated users, who have nothing to upgrade to here, do not
 *     see it.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';

// The Founder tile is audience-gated and lazy; stub it to null so this pin only
// exercises the generic CTA. The eligibility hook (which would demote the CTA to
// secondary when the tile shows) is stubbed false — a plain free user.
vi.mock('../../src/components/pricing/FounderTile.jsx', () => ({ default: () => null }));
vi.mock('../../src/hooks/useFounderTileEligible.js', () => ({ useFounderTileEligible: () => false }));

import AccountSubscriptionSection from '../../src/components/account/AccountSubscriptionSection.jsx';

afterEach(cleanup);

const BASE_PROPS = {
  creditBalance: 0,
  activeSaves: 1,
  inactiveSaves: 0,
  maxSaves: 3,
  portalBusy: false,
  handleManageBilling: vi.fn(),
  purchaseError: null,
  purchasing: null,
  handlePurchase: vi.fn(),
};

describe('AccountSubscriptionSection — the free-tier conversion CTA (#6)', () => {
  test('free user sees "See Cartographer" and clicking it navigates to Pricing (nothing else)', () => {
    const onNavigatePricing = vi.fn();
    const handlePurchase = vi.fn();
    const handleManageBilling = vi.fn();
    render(
      <AccountSubscriptionSection
        {...BASE_PROPS}
        auth={{ tier: 'free' }}
        isElevated={false}
        handlePurchase={handlePurchase}
        handleManageBilling={handleManageBilling}
        onNavigatePricing={onNavigatePricing}
      />,
    );
    const cta = screen.getByRole('button', { name: /See Cartographer/i });
    fireEvent.click(cta);
    expect(onNavigatePricing).toHaveBeenCalledTimes(1);
    // Navigation-only: the upgrade CTA must not fire any purchase/billing path.
    expect(handlePurchase).not.toHaveBeenCalled();
    expect(handleManageBilling).not.toHaveBeenCalled();
  });

  test('premium user does not see the upgrade CTA', () => {
    render(
      <AccountSubscriptionSection
        {...BASE_PROPS}
        auth={{ tier: 'premium' }}
        isElevated={false}
        onNavigatePricing={vi.fn()}
      />,
    );
    expect(screen.queryByRole('button', { name: /See Cartographer/i })).toBeNull();
  });

  test('elevated operator does not see the upgrade CTA', () => {
    render(
      <AccountSubscriptionSection
        {...BASE_PROPS}
        auth={{ tier: 'free' }}
        isElevated
        onNavigatePricing={vi.fn()}
      />,
    );
    expect(screen.queryByRole('button', { name: /See Cartographer/i })).toBeNull();
  });
});

/**
 * LD-6 item 2, second half — THE ANTI-DOUBLE-SUBSCRIBE HYDRATION GATE.
 *
 * `auth.tier` reads 'anon'/'free' until the session resolves, so mid-hydration a
 * paying Cartographer is shown this region's FREE-user surface. The conversion
 * CTA is this region's entry to the purchase path, so it is blocked under its
 * own label until the tier is known. Two things stay deliberately ungated and
 * are pinned as such: the billing/manage path (a subscriber must always be able
 * to reach billing) and the inline credit-pack tiles (a pack is not a
 * subscription; buying one at any tier is correct).
 */
describe('AccountSubscriptionSection — the hydration gate', () => {
  test('HYDRATING: the conversion CTA renders but is blocked, and clicking it navigates nowhere', () => {
    const onNavigatePricing = vi.fn();
    render(
      <AccountSubscriptionSection
        {...BASE_PROPS}
        auth={{ tier: 'free', loading: true }}
        isElevated={false}
        onNavigatePricing={onNavigatePricing}
      />,
    );
    const cta = screen.getByRole('button', { name: /See Cartographer/i });
    expect(cta.disabled, 'a tier-unknown reader still has a live path into the purchase funnel').toBe(true);
    fireEvent.click(cta);
    expect(onNavigatePricing).not.toHaveBeenCalled();
  });

  test('HYDRATING: "Manage subscription" is not shown to a reader not yet known to be paid', () => {
    render(
      <AccountSubscriptionSection
        {...BASE_PROPS}
        auth={{ tier: 'free', loading: true }}
        isElevated={false}
        onNavigatePricing={vi.fn()}
      />,
    );
    expect(screen.queryByRole('button', { name: /Manage subscription/i })).toBeNull();
  });

  test('the gate does NOT reach the credit-pack tiles — a pack is not a subscription', () => {
    // ⚠ STATED AS AN INVARIANCE, NOT AS "enabled". This harness mocks no
    // supabase module, so `isConfigured` is really false and the pack tiles are
    // already disabled for an unrelated reason — an `expect(disabled).toBe(false)`
    // here would be red for the wrong cause, and its mirror image (asserting
    // `true`) would be a vacuous green that survives the gate spreading onto the
    // packs. What must hold is that auth.loading changes NOTHING about them.
    const packDisabledStates = (loading) => {
      const view = render(
        <AccountSubscriptionSection
          {...BASE_PROPS}
          auth={{ tier: 'free', loading }}
          isElevated={false}
          handlePurchase={vi.fn()}
          onNavigatePricing={vi.fn()}
        />,
      );
      const states = screen.getAllByText('credits')
        .map((el) => el.closest('button'))
        .map((button) => button.disabled);
      view.unmount();
      return states;
    };
    const hydrating = packDisabledStates(true);
    const hydrated = packDisabledStates(false);
    expect(hydrating.length, 'no credit-pack tile rendered — the scan broke').toBeGreaterThan(0);
    expect(hydrating).toEqual(hydrated);
  });

  test('NON-VACUITY: auth.loading is the ONLY difference between blocked and live', () => {
    const { unmount } = render(
      <AccountSubscriptionSection
        {...BASE_PROPS}
        auth={{ tier: 'free', loading: true }}
        isElevated={false}
        onNavigatePricing={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: /See Cartographer/i }).disabled).toBe(true);
    unmount();
    render(
      <AccountSubscriptionSection
        {...BASE_PROPS}
        auth={{ tier: 'free', loading: false }}
        isElevated={false}
        onNavigatePricing={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: /See Cartographer/i }).disabled).toBe(false);
  });
});
