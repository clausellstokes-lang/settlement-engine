/** @vitest-environment jsdom */
/**
 * Regression guard for the live crash where PurchaseModal hardcoded legacy
 * pack keys (credits_5/15/40) that no longer existed in PRODUCTS after the
 * catalog was repriced to credits_25/60/150 -> `p.discount` on undefined.
 *
 * Deliberately uses the REAL pricing.js + stripe.js PRODUCTS (only the store
 * and supabase client are mocked) so this fails if the modal's pack keys ever
 * drift from the active catalog again.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import PurchaseModal from '../../src/components/PurchaseModal.jsx';
import { getActivePacks } from '../../src/config/pricing.js';

const mocks = vi.hoisted(() => ({
  storeState: { creditBalance: 12, auth: { tier: 'free' }, isElevated: () => false },
}));

vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(mocks.storeState),
}));
vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  // referralRedeem.js (imported via the modal's redeem/referral fields) pulls
  // withTimeout from this module; a passthrough keeps the mock inert.
  withTimeout: (p) => p,
  supabase: {
    auth: { getSession: () => Promise.resolve({ data: { session: null } }) },
    functions: { invoke: () => Promise.resolve({ data: null, error: null }) },
  },
}));

describe('PurchaseModal', () => {
  afterEach(cleanup);

  test('renders every active credit pack without crashing (keys resolve in PRODUCTS)', () => {
    expect(() => render(<PurchaseModal onClose={() => {}} />)).not.toThrow();
    // Each active pack tile must render its credit count — if a key failed to
    // resolve, the tile is skipped (or the render throws) and this fails.
    for (const pack of Object.values(getActivePacks())) {
      expect(screen.getAllByText(String(pack.credits)).length).toBeGreaterThan(0);
    }
  });

  // Auto-reload consent (§4.2 / M-3b): signed-in only, OFF by default.
  test('shows the auto-reload consent checkbox (OFF by default) for a signed-in buyer', () => {
    mocks.storeState.auth.user = { id: 'u1' };
    try {
      render(<PurchaseModal onClose={() => {}} />);
      const cb = screen.getByRole('checkbox', { name: /save my card for automatic credit reloads/i });
      expect(cb).toBeTruthy();
      expect(cb.checked).toBe(false);
    } finally {
      delete mocks.storeState.auth.user;
    }
  });

  test('hides the consent checkbox for a signed-out visitor', () => {
    render(<PurchaseModal onClose={() => {}} />);
    expect(screen.queryByRole('checkbox', { name: /save my card/i })).toBeNull();
  });
});
