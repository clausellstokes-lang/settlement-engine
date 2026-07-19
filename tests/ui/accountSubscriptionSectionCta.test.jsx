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
