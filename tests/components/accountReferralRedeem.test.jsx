/** @vitest-environment jsdom */
/**
 * accountReferralRedeem.test.jsx — the Subscription section's two 107 blocks.
 *
 *   1. ReferralCard: renders the reader's own account ID (auth.accountNumber,
 *      migration 075) with a copy-to-clipboard button; founders get the
 *      credits variant of the pitch line.
 *   2. RedeemBlock: the validate-then-stash flow. A valid code stashes the
 *      pending handoff + offers the jump to Pricing; invalid and already_used
 *      read their distinct calm lines; nothing is stashed on rejection.
 *
 * The supabase client is mocked at the module seam (rpc only — validation is
 * the single network call these blocks make); the store never enters the
 * picture because the section reads it only through useFounderTileEligible,
 * which is stubbed.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  rpc: vi.fn(),
  getAccountNumber: vi.fn(),
}));

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  withTimeout: (p) => p,
  supabase: { rpc: (...a) => mocks.rpc(...a) },
}));

// LINEAGE NOTE (master merge W6): ReferralCard self-FETCHES the account number
// (OURS doesn't thread account_number through auth state the way THEIRS did), so
// these tests drive its async authService.getAccountNumber() path rather than a
// synchronous auth.accountNumber prop. They also render ReferralCard DIRECTLY: on
// this lineage the referral/redeem blocks live in AccountPage.jsx, not inside
// AccountSubscriptionSection (master mounted them in the section).
vi.mock('../../src/lib/auth.js', () => ({
  auth: { getAccountNumber: (...a) => mocks.getAccountNumber(...a) },
}));

// Keep the store + FounderTile's heavy deps out of the render: the section
// touches them only through these two seams.
vi.mock('../../src/hooks/useFounderTileEligible.js', () => ({
  useFounderTileEligible: () => false,
}));
vi.mock('../../src/components/pricing/FounderTile.jsx', () => ({
  default: () => null,
}));

import { ReferralCard, RedeemBlock } from '../../src/components/account/ReferralRedeemBlocks.jsx';
import { getPendingRedeemCode } from '../../src/lib/referralRedeem.js';
import { t } from '../../src/copy/index.js';

beforeEach(() => {
  sessionStorage.clear();
  mocks.rpc.mockReset();
  mocks.getAccountNumber.mockReset();
});
afterEach(cleanup);

describe('ReferralCard — account ID + copy', () => {
  test('renders the account ID and a copy button; copying writes the ID', async () => {
    mocks.getAccountNumber.mockResolvedValue('SF-ABC1234');
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    render(<ReferralCard auth={{ isFounder: false }} />);

    // The self-fetch resolves the immutable handle onto the chip (async).
    expect(await screen.findByText('SF-ABC1234')).toBeTruthy();

    const copyBtn = screen.getByRole('button', { name: t('account.referralCopy') });
    fireEvent.click(copyBtn);
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('SF-ABC1234'));
    // Feedback flips the label to Copied.
    await screen.findByText(t('account.referralCopied'));
  });

  test('non-founders read the month pitch; founders read the credits variant', async () => {
    mocks.getAccountNumber.mockResolvedValue('SF-ABC1234');
    const { unmount } = render(<ReferralCard auth={{ isFounder: false }} />);
    expect(await screen.findByText(t('account.referralBody'))).toBeTruthy();
    unmount();

    render(<ReferralCard auth={{ isFounder: true }} />);
    expect(await screen.findByText(t('account.referralBodyFounder'))).toBeTruthy();
  });

  test('no account number yet: the assigned-shortly line, no copy button', async () => {
    // The self-fetch resolves null (no handle assigned) → the null branch holds.
    mocks.getAccountNumber.mockResolvedValue(null);
    render(<ReferralCard auth={{ isFounder: false }} />);
    expect(await screen.findByText(t('account.referralNoId'))).toBeTruthy();
    expect(screen.queryByRole('button', { name: t('account.referralCopy') })).toBeNull();
  });
});

describe('RedeemBlock — validate then stash', () => {
  function typeAndApply(code) {
    fireEvent.change(screen.getByLabelText(t('account.redeemLabel')), { target: { value: code } });
    fireEvent.click(screen.getByRole('button', { name: t('account.redeemApply') }));
  }

  test('a valid code stashes the handoff and offers the jump to Pricing', async () => {
    mocks.rpc.mockResolvedValue({ data: { valid: true, kind: 'credits', reason: null }, error: null });
    const onNavigatePricing = vi.fn();
    render(<RedeemBlock onNavigatePricing={onNavigatePricing} />);

    typeAndApply('SFC-AAAABBBBCCCC');

    await screen.findByText(t('account.redeemValid'));
    expect(mocks.rpc).toHaveBeenCalledWith('validate_redeem_code', { p_code: 'SFC-AAAABBBBCCCC' });
    expect(getPendingRedeemCode()).toBe('SFC-AAAABBBBCCCC');

    fireEvent.click(screen.getByRole('button', { name: t('account.redeemChoosePurchase') }));
    expect(onNavigatePricing).toHaveBeenCalledTimes(1);
  });

  test('an invalid code reads the not-live line and stashes nothing', async () => {
    mocks.rpc.mockResolvedValue({ data: { valid: false, kind: null, reason: 'invalid_code' }, error: null });
    render(<RedeemBlock onNavigatePricing={vi.fn()} />);

    typeAndApply('SFC-DEADDEADDEAD');

    await screen.findByText(t('account.redeemInvalid'));
    expect(getPendingRedeemCode()).toBe('');
    expect(screen.queryByRole('button', { name: t('account.redeemChoosePurchase') })).toBeNull();
  });

  test('already_used reads its own line (the one non-collapsed rejection)', async () => {
    mocks.rpc.mockResolvedValue({ data: { valid: false, kind: null, reason: 'already_used' }, error: null });
    render(<RedeemBlock onNavigatePricing={vi.fn()} />);

    typeAndApply('SFC-USEDUSEDUSED');

    await screen.findByText(t('account.redeemAlreadyUsed'));
    expect(getPendingRedeemCode()).toBe('');
  });

  test('editing after acceptance clears the stash and the acceptance', async () => {
    mocks.rpc.mockResolvedValue({ data: { valid: true, kind: 'free_month', reason: null }, error: null });
    render(<RedeemBlock onNavigatePricing={vi.fn()} />);

    typeAndApply('SFC-AAAABBBBCCCC');
    await screen.findByText(t('account.redeemValid'));

    fireEvent.change(screen.getByLabelText(t('account.redeemLabel')), { target: { value: 'SFC-AAAABBBBCCC' } });
    expect(getPendingRedeemCode()).toBe('');
    expect(screen.queryByRole('button', { name: t('account.redeemChoosePurchase') })).toBeNull();
  });
});
