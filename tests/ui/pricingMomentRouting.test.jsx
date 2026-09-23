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
// THE LAUNCH GATE is OPEN for this file: it pins the purchase controls' live
// behaviour, which is what launch restores. The closed state is pinned in
// tests/components/launchLock.pricing.test.jsx.
vi.mock('../../src/lib/launchGate.js', async (importOriginal) => ({ ...(await importOriginal()), purchasesOpen: () => true }));

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

  // THE TEARDOWN LEAK (GitHub run 35846674831, job "Coverage floors (money /
  // security)", 2026-09-23: 489 files and 4,294 tests PASSED and vitest still
  // exited 1). Dismissing arms a 220 ms exit-animation timer whose callback
  // dispatches setState. Unreleased, it outlives the unmount that afterEach
  // (cleanup) performs and fires after the jsdom environment is torn down, where
  // React's resolveUpdatePriority reads window and throws "ReferenceError: window
  // is not defined" as an UNHANDLED error no test owns. Fake timers turn that
  // race into a readable count: the pin is the pending-handle count at unmount,
  // which is deterministic, rather than the throw, which is timing-dependent.
  // The other cases in this file keep real timers - the finally restores them.
  test('the exit timer is released on unmount, so nothing dispatches into a torn-down tree', () => {
    vi.useFakeTimers();
    try {
      const view = mount('signup_unlock');
      fireEvent.click(screen.getByRole('button', { name: /Not now/i }));
      // Liveness: the dismiss really armed a handle, so the zero below is the
      // release and not a case that quietly stopped exercising the exit path.
      expect(vi.getTimerCount()).toBeGreaterThan(0);
      view.unmount();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });
});
