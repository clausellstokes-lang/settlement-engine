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
});
