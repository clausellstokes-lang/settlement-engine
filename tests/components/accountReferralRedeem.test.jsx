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
}));

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  withTimeout: (p) => p,
  supabase: { rpc: (...a) => mocks.rpc(...a) },
}));

// Keep the store + FounderTile's heavy deps out of the render: the section
// touches them only through these two seams.
vi.mock('../../src/hooks/useFounderTileEligible.js', () => ({
  useFounderTileEligible: () => false,
}));
vi.mock('../../src/components/pricing/FounderTile.jsx', () => ({
  default: () => null,
}));

import AccountSubscriptionSection from '../../src/components/account/AccountSubscriptionSection.jsx';
import { RedeemBlock } from '../../src/components/account/ReferralRedeemBlocks.jsx';
import { getPendingRedeemCode } from '../../src/lib/referralRedeem.js';
import { t } from '../../src/copy/index.js';

function sectionProps(overrides = {}) {
  return {
    auth: {
      user: { id: 'u1', email: 'me@example.test' },
      tier: 'free',
      isFounder: false,
      accountNumber: 'SF-ABC1234',
      ...(overrides.auth || {}),
    },
    isElevated: false,
    creditBalance: 3,
    activeSaves: 1,
    inactiveSaves: 0,
    maxSaves: 3,
    portalBusy: false,
    handleManageBilling: vi.fn(),
    purchaseError: null,
    purchasing: null,
    handlePurchase: vi.fn(),
    onNavigatePricing: vi.fn(),
    ...overrides,
  };
}

beforeEach(() => {
  sessionStorage.clear();
  mocks.rpc.mockReset();
});
afterEach(cleanup);

describe('ReferralCard — account ID + copy', () => {
  test('renders the account ID and a copy button; copying writes the ID', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    render(<AccountSubscriptionSection {...sectionProps()} />);

    // The chip carries the exact immutable handle.
    expect(screen.getByText('SF-ABC1234')).toBeTruthy();

    const copyBtn = screen.getByRole('button', { name: t('account.referralCopy') });
    fireEvent.click(copyBtn);
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('SF-ABC1234'));
    // Feedback flips the label to Copied.
    await screen.findByText(t('account.referralCopied'));
  });

  test('non-founders read the month pitch; founders read the credits variant', () => {
    const { unmount } = render(<AccountSubscriptionSection {...sectionProps()} />);
    expect(screen.getByText(t('account.referralBody'))).toBeTruthy();
    unmount();

    render(<AccountSubscriptionSection {...sectionProps({ auth: { isFounder: true } })} />);
    expect(screen.getByText(t('account.referralBodyFounder'))).toBeTruthy();
  });

  test('no account number yet: the assigned-shortly line, no copy button', () => {
    render(<AccountSubscriptionSection {...sectionProps({ auth: { accountNumber: null } })} />);
    expect(screen.getByText(t('account.referralNoId'))).toBeTruthy();
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
