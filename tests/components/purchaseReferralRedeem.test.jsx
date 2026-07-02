/** @vitest-environment jsdom */
/**
 * purchaseReferralRedeem.test.jsx — the purchase-flow riders (migration 107)
 * on PurchaseModal:
 *
 *   1. ORDER + NON-BLOCKING: with a referrer account ID typed, buying calls
 *      record_referral_intent BEFORE startCheckout, and a rejected intent
 *      surfaces as a note while checkout proceeds anyway.
 *   2. The explicit "Record referral" button lands the intent pre-checkout,
 *      and a later buy does NOT re-send it.
 *   3. The "Have a code?" disclosure hands the typed code to startCheckout
 *      via options.redeemCode.
 *   4. A user with a prior referral row never sees the field.
 *
 * stripe.js is mocked with importOriginal so PRODUCTS stays the real active
 * catalog (the modal derives its pack buttons from it) while startCheckout is
 * observable; supabase.js is mocked at the client seam.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  calls: /** @type {string[]} */ ([]),
  rpc: vi.fn(),
  priorReferralRows: { data: [], error: null },
  startCheckout: vi.fn(),
  storeState: {
    creditBalance: 3,
    auth: { user: { id: 'u1', email: 'me@example.test' }, tier: 'free', isFounder: false },
    isElevated: () => false,
  },
}));

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  withTimeout: (p) => p,
  supabase: {
    rpc: (...a) => mocks.rpc(...a),
    // hasPriorReferral reads referrals directly (RLS-scoped select).
    from: () => ({
      select: () => ({
        eq: () => ({ limit: async () => mocks.priorReferralRows }),
      }),
    }),
    auth: { getSession: async () => ({ data: { session: {} } }) },
    functions: { invoke: async () => ({ data: null, error: null }) },
  },
}));

vi.mock('../../src/lib/stripe.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, startCheckout: (...a) => mocks.startCheckout(...a) };
});

vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(mocks.storeState),
}));

import PurchaseModal from '../../src/components/PurchaseModal.jsx';
import { t } from '../../src/copy/index.js';

const REFERRER_LABEL = t('purchase.referredByLabel');

beforeEach(() => {
  sessionStorage.clear();
  mocks.calls.length = 0;
  mocks.rpc.mockReset();
  mocks.startCheckout.mockReset();
  mocks.priorReferralRows = { data: [], error: null };
  // Defaults: intent rejected (cap), checkout succeeds with no notice.
  mocks.rpc.mockImplementation(async () => {
    mocks.calls.push('intent');
    return { data: { ok: false, reason: 'referrer_cap_reached' }, error: null };
  });
  mocks.startCheckout.mockImplementation(async () => {
    mocks.calls.push('checkout');
    return { redeemNotice: null };
  });
});
afterEach(cleanup);

function firstPackButton() {
  return screen.getAllByRole('button', { name: /^Buy \d+ credits/ })[0];
}

describe('PurchaseModal — referral intent rider', () => {
  test('records intent BEFORE startCheckout and does not block on rejection', async () => {
    render(<PurchaseModal onClose={() => {}} />);

    // The field appears once the async no-prior-referral check resolves.
    const field = await screen.findByLabelText(REFERRER_LABEL);
    fireEvent.change(field, { target: { value: 'SF-QQQQQQQ' } });

    fireEvent.click(firstPackButton());

    await waitFor(() => expect(mocks.startCheckout).toHaveBeenCalledTimes(1));
    // Intent strictly precedes checkout, and the rejection did not stop it.
    expect(mocks.calls).toEqual(['intent', 'checkout']);
    expect(mocks.rpc).toHaveBeenCalledWith(
      'record_referral_intent',
      { p_referrer_account_number: 'SF-QQQQQQQ' },
    );
    // The rejection reads as a calm inline note.
    await screen.findByText(t('purchase.referralCap'));
  });

  test('the explicit Record button lands the intent once; buying does not re-send', async () => {
    mocks.rpc.mockImplementation(async () => {
      mocks.calls.push('intent');
      return { data: { ok: true, referral_id: 'r1' }, error: null };
    });
    render(<PurchaseModal onClose={() => {}} />);

    const field = await screen.findByLabelText(REFERRER_LABEL);
    fireEvent.change(field, { target: { value: 'sf-abc1234' } });
    fireEvent.click(screen.getByRole('button', { name: t('purchase.referredByRecord') }));

    await screen.findByText(t('purchase.referralRecorded'));
    expect(mocks.rpc).toHaveBeenCalledTimes(1);

    fireEvent.click(firstPackButton());
    await waitFor(() => expect(mocks.startCheckout).toHaveBeenCalledTimes(1));
    // Recorded once — checkout must not fire a second intent.
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
  });

  test('a user with a prior referral never sees the field', async () => {
    mocks.priorReferralRows = { data: [{ id: 'r0' }], error: null };
    render(<PurchaseModal onClose={() => {}} />);

    // Anchor on settled content, then confirm the field stayed hidden.
    await screen.findByText('Current Balance');
    await waitFor(() => expect(screen.queryByLabelText(REFERRER_LABEL)).toBeNull());
  });
});

describe('PurchaseModal — redeem-code rider', () => {
  test('the disclosure hands the typed code to startCheckout options', async () => {
    render(<PurchaseModal onClose={() => {}} />);
    await screen.findByText('Current Balance');

    fireEvent.click(screen.getByRole('button', { name: t('purchase.haveCode') }));
    fireEvent.change(screen.getByLabelText(t('purchase.codeLabel')), {
      target: { value: 'SFC-TESTTESTTEST' },
    });

    fireEvent.click(firstPackButton());
    await waitFor(() => expect(mocks.startCheckout).toHaveBeenCalledTimes(1));
    expect(mocks.startCheckout).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ redeemCode: 'SFC-TESTTESTTEST' }),
    );
  });

  test('a code stashed by the Account page pre-fills the open disclosure', async () => {
    sessionStorage.setItem('sf_pending_redeem_code', 'SFC-FROMACCOUNTX');
    render(<PurchaseModal onClose={() => {}} />);
    await screen.findByText('Current Balance');

    // Pre-expanded: the input is already visible with the stashed code.
    expect(screen.getByLabelText(t('purchase.codeLabel')).value).toBe('SFC-FROMACCOUNTX');
  });
});
