/** @vitest-environment jsdom */
/**
 * tests/ui/pricingMomentRouting.test.jsx — the restored anon sign-in routing
 * (census §1 #16, MANDATORY pin).
 *
 * A pricing moment's reason partitions its whole identity — accent, eyebrow,
 * label, AND click destination. A SLATE reason is an upgrade (purchase modal);
 * a GOLD reason is a signup/unlock prompt fired at an anonymous user, whose CTA
 * reads "Sign in to unlock". The bug this restores: the gold CTA used to send
 * that anon user to the buy-CREDITS wall (setPurchaseModalOpen). It must open
 * SIGN-IN (setAuthModalOpen) instead. These pins lock both directions so the
 * routing can never silently regress to the buy-wall again.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';

vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));
vi.mock('../../src/lib/analytics.js', () => ({
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// A per-test store snapshot; the component reads each opener via a selector.
let state;
vi.mock('../../src/store/index.js', () => ({ useStore: (sel) => sel(state) }));

import PricingMomentCard from '../../src/components/pricing/PricingMomentCard.jsx';

function mount(reason) {
  state = {
    activePricingMoment: { headline: 'Headline', body: 'Body', reason },
    clearActivePricingMoment: vi.fn(),
    setPurchaseModalOpen: vi.fn(),
    setAuthModalOpen: vi.fn(),
  };
  return render(<PricingMomentCard />);
}

afterEach(cleanup);

describe('PricingMomentCard — anon signup/unlock routing (#16)', () => {
  test('a GOLD signup/unlock moment opens SIGN-IN, never the buy-wall', () => {
    mount('signup_unlock'); // not in SLATE_REASONS ⇒ gold
    fireEvent.click(screen.getByRole('button', { name: /Sign in to unlock/i }));
    expect(state.setAuthModalOpen).toHaveBeenCalledWith(true);
    // The exact bug this restores: the gold CTA must NOT open the purchase modal.
    expect(state.setPurchaseModalOpen).not.toHaveBeenCalled();
  });

  test('a SLATE upgrade moment opens the purchase modal, not sign-in', () => {
    mount('third_save'); // in SLATE_REASONS ⇒ slate/upgrade
    fireEvent.click(screen.getByRole('button', { name: /See Cartographer/i }));
    expect(state.setPurchaseModalOpen).toHaveBeenCalledWith(true);
    expect(state.setAuthModalOpen).not.toHaveBeenCalled();
  });
});
