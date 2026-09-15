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
 *
 * ── LD-7 (2026-09-15): THE SCOPE GATE JOINS THIS FILE ────────────────────────
 * The second describe below pins THE EXACT REPORTED SEQUENCE of the popup-scope
 * bug: a Realm upsell fires on /realm, follows the user to every other page, and
 * is cleared by nothing but its own dismiss. The cure is the render gate in
 * PricingMomentCard reading lib/momentScope.js, and the arms here walk the whole
 * reported path — fire on realm, navigate away, assert UNMOUNTED, return, assert
 * RE-SHOWN (law 2: leaving is not dismissing), dismiss, assert the dismissal is
 * the thing that persists.
 *
 * ⚠️ THE FIRST DESCRIBE'S GOLD FIXTURE CHANGED WITH THAT GATE, and the change
 * STRENGTHENS it: it used the invented key 'signup_unlock', which was never a row
 * in the moments registry. The gate fails CLOSED on an undeclared reason, so the
 * fixture now uses `anon_cap_hit` — a REAL gold-register moment whose shipped body
 * copy literally reads "Sign in (free) to…", which is the population the arm is
 * about. The assertion is unchanged; only the fixture stopped being fictional.
 */
import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { act, render, cleanup, screen, fireEvent } from '@testing-library/react';

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
    mount('anon_cap_hit'); // not in SLATE_REASONS ⇒ gold; declared on CREATE, which is jsdom's default route
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

// ── LD-7 — THE POPUP SCOPE LAW ───────────────────────────────────────────────
// A real route, driven the way the app drives it: pushState plus the synthetic
// 'sf:navigate' event useRoute subscribes to (pushState is silent by spec).
function goTo(path) {
  act(() => {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new Event('sf:navigate'));
  });
}

describe('PricingMomentCard — the popup scope law (LD-7)', () => {
  beforeEach(() => { window.history.replaceState(null, '', '/'); });
  afterEach(() => { window.history.replaceState(null, '', '/'); });

  test('THE REPORTED SEQUENCE: a Realm upsell does not follow the user off the Realm, and returns undismissed', () => {
    goTo('/realm');
    const view = mount('map_clicked'); // declared scope: the Realm hub

    // 1. It shows on the surface that spawned it.
    expect(screen.queryByRole('button', { name: /See Cartographer/i })).toBeTruthy();

    // 2. Leaving the page unmounts it IMMEDIATELY (law 1) — and writes nothing:
    //    the store flag is untouched, which is what makes step 3 possible.
    goTo('/compendium');
    view.rerender(<PricingMomentCard />);
    expect(screen.queryByRole('button', { name: /See Cartographer/i })).toBeNull();
    expect(state.clearActivePricingMoment).not.toHaveBeenCalled();

    // 3. LEAVING IS NOT DISMISSING (law 2): returning re-shows it, undismissed.
    goTo('/realm');
    view.rerender(<PricingMomentCard />);
    expect(screen.queryByRole('button', { name: /See Cartographer/i })).toBeTruthy();

    // 4. Dismissal is the ONLY permanent suppressor, and it is the one thing on
    //    this whole path that WRITES. "Not now" runs the 220ms exit animation and
    //    then clears the moment for good.
    vi.useFakeTimers();
    try {
      fireEvent.click(screen.getByRole('button', { name: /Not now/i }));
      expect(state.clearActivePricingMoment).not.toHaveBeenCalled(); // animation first
      act(() => { vi.advanceTimersByTime(250); });
      expect(state.clearActivePricingMoment).toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  test('the suppression is by DECLARED SCOPE, not by a /pricing special case', () => {
    // The shipped bug's only suppression was `view !== 'pricing'` at the App mount.
    // A Realm moment must be absent on EVERY non-Realm surface, pricing included.
    for (const path of ['/pricing', '/settlements', '/compendium', '/account', '/gallery']) {
      goTo(path);
      const view = mount('map_clicked');
      expect(
        screen.queryByRole('button', { name: /See Cartographer/i }),
        `map_clicked must not render on ${path}`,
      ).toBeNull();
      view.unmount();
    }
  });

  test('a moment renders on EVERY view its declaration names — the positive control', () => {
    // Without this arm the suppression arm above would pass on a gate that
    // suppressed everything, everywhere.
    for (const path of ['/realm', '/map']) {
      goTo(path);
      const view = mount('map_clicked');
      expect(
        screen.queryByRole('button', { name: /See Cartographer/i }),
        `map_clicked must render on ${path}`,
      ).toBeTruthy();
      view.unmount();
    }
  });

  test('an UNDECLARED reason renders nothing — the gate fails closed', () => {
    goTo('/realm');
    mount('not_a_registered_moment');
    expect(screen.queryByRole('button', { name: /See Cartographer/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Sign in to unlock/i })).toBeNull();
  });

  test('the auto-dismiss clock does not run while the moment is out of scope', () => {
    vi.useFakeTimers();
    try {
      goTo('/compendium');
      mount('map_clicked'); // out of scope here
      vi.advanceTimersByTime(60_000);
      // A moment the user never saw must not time out as if they had dismissed it.
      expect(state.clearActivePricingMoment).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });
});
