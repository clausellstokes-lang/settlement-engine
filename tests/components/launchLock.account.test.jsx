/** @vitest-environment jsdom */
/**
 * launchLock.account.test.jsx - the pre-launch lockout over the Account page's purchase
 * controls.
 *
 * THE OWNER (2026-09-16): "disable all purchase buttons on the website until we are
 * ready to launch. People can make accounts but temporarily, all buttons for purchase
 * including subscriptions are to have a pill that says available at launch."
 *
 * purchasesOpen() (src/lib/launchGate.js) is NOT mocked here, so this test build is
 * CLOSED. Every purchase control on the account surface must render disabled with the
 * "Available at launch" pill (inside the control, or beside the checkbox label), and a
 * click must reach no purchase path:
 *   - AccountSubscriptionSection: "See Cartographer" and every inline credit-pack tile;
 *   - AccountAutoReloadPanel: the "Enable auto-reload" checkbox and "Save auto-reload",
 *     ONE-WAY: an account whose stored auto-reload is already on can still switch it OFF
 *     and save that, because turning it off authorises no charge;
 *   - AccountSeatTransferPanel: the nominee's "Accept: email me a code" and
 *     "Verify & pay $99";
 *   - RedeemBlock: "Choose a purchase".
 * The open (post-launch) behavior of the same controls stays pinned by their own suites,
 * which mock the gate open (accountSubscriptionSectionCta, accountAutoReload,
 * accountReferralRedeem). Controls that are NOT purchases ("Manage subscription", the
 * redeem-code Apply) are pinned live in this same closed build, so the gate is shown to
 * be scoped rather than blanket.
 *
 * supabase's isConfigured is mocked TRUE so the pack tiles' own unconfigured-disable
 * cannot stand in for the gate: every other disabling condition is false in each render.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const mocks = vi.hoisted(() => ({
  rpc: vi.fn(),
  fetchSettings: vi.fn(),
  fetchStatus: vi.fn(),
  saveSettings: vi.fn(),
  fetchTransferStatus: vi.fn(),
  nomineeAcceptStart: vi.fn(),
  nomineeConfirm: vi.fn(),
}));

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  withTimeout: (p) => p,
  supabase: { rpc: (...a) => mocks.rpc(...a) },
}));
vi.mock('../../src/lib/auth.js', () => ({
  auth: { getAccountNumber: vi.fn().mockResolvedValue(null) },
}));
vi.mock('../../src/components/pricing/FounderTile.jsx', () => ({ default: () => null }));
vi.mock('../../src/hooks/useFounderTileEligible.js', () => ({ useFounderTileEligible: () => false }));
vi.mock('../../src/lib/autoReloadClient.js', () => ({
  AUTO_RELOAD_DEFAULTS: { enabled: false, thresholdCredits: 5, targetCredits: 25, monthlyCapCents: 4000 },
  AUTO_RELOAD_LIMITS: { threshold: { min: 1, max: 500 }, target: { min: 2, max: 1000 }, capCents: { min: 500, max: 20000 } },
  fetchAutoReloadSettings: (...a) => mocks.fetchSettings(...a),
  fetchAutoReloadStatus: (...a) => mocks.fetchStatus(...a),
  saveAutoReloadSettings: (...a) => mocks.saveSettings(...a),
}));
vi.mock('../../src/lib/founderTransferClient.js', () => ({
  fetchTransferStatus: (...a) => mocks.fetchTransferStatus(...a),
  nomineeAcceptStart: (...a) => mocks.nomineeAcceptStart(...a),
  nomineeConfirm: (...a) => mocks.nomineeConfirm(...a),
  fetchBuybackStatus: async () => ({ available: false }),
}));

import { purchasesOpen } from '../../src/lib/launchGate.js';
import { AVAILABLE_AT_LAUNCH } from '../../src/components/primitives/AvailableAtLaunchPill.jsx';
import { getActivePacks } from '../../src/config/pricing.js';
import { t } from '../../src/copy/index.js';
import AccountSubscriptionSection from '../../src/components/account/AccountSubscriptionSection.jsx';
import AccountAutoReloadPanel from '../../src/components/account/AccountAutoReloadPanel.jsx';
import AccountSeatTransferPanel from '../../src/components/account/AccountSeatTransferPanel.jsx';
import { RedeemBlock } from '../../src/components/account/ReferralRedeemBlocks.jsx';

/** The control is a disabled button and the pill sits INSIDE it. */
function expectLockedWithPill(button) {
  expect(button.tagName).toBe('BUTTON');
  expect(button.disabled).toBe(true);
  expect(within(button).getByText(AVAILABLE_AT_LAUNCH)).toBeTruthy();
  expect(button.querySelector('[data-launch-pill]')?.textContent).toBe(AVAILABLE_AT_LAUNCH);
}

/** Let any async click handler (lazy import, awaited request) settle. */
const settle = () => new Promise((resolve) => { setTimeout(resolve, 0); });

const SUBSCRIPTION_PROPS = {
  creditBalance: 0,
  activeSaves: 1,
  inactiveSaves: 0,
  maxSaves: 3,
  portalBusy: false,
  purchaseError: null,
  purchasing: null,
};

beforeEach(() => {
  sessionStorage.clear();
  for (const fn of Object.values(mocks)) fn.mockReset();
  mocks.fetchSettings.mockResolvedValue({ enabled: false, thresholdCredits: 5, targetCredits: 25, monthlyCapCents: 4000, exists: false });
  mocks.fetchStatus.mockResolvedValue({ thisMonthSpentCents: 0, openAttempt: null });
  mocks.saveSettings.mockResolvedValue(true);
});
afterEach(cleanup);

describe('launch lock: the build under test is closed', () => {
  test('purchasesOpen() is false without VITE_PURCHASES_OPEN, so every lock below is the real default', () => {
    expect(purchasesOpen()).toBe(false);
  });
});

describe('launch lock: AccountSubscriptionSection', () => {
  test('"See Cartographer" is disabled with the pill inside it, and a click navigates nowhere', () => {
    const onNavigatePricing = vi.fn();
    const handlePurchase = vi.fn();
    render(
      <AccountSubscriptionSection
        {...SUBSCRIPTION_PROPS}
        auth={{ tier: 'free', loading: false }}
        isElevated={false}
        handlePurchase={handlePurchase}
        handleManageBilling={vi.fn()}
        onNavigatePricing={onNavigatePricing}
      />,
    );
    // auth.loading is false, so the hydration gate is not what disables it.
    const cta = screen.getByRole('button', { name: /See Cartographer/i });
    expectLockedWithPill(cta);
    fireEvent.click(cta);
    expect(onNavigatePricing).not.toHaveBeenCalled();
    expect(handlePurchase).not.toHaveBeenCalled();
  });

  test('every inline credit-pack tile is disabled with the pill inside it, and a click buys nothing', () => {
    const handlePurchase = vi.fn();
    render(
      <AccountSubscriptionSection
        {...SUBSCRIPTION_PROPS}
        auth={{ tier: 'free', loading: false }}
        isElevated={false}
        handlePurchase={handlePurchase}
        handleManageBilling={vi.fn()}
        onNavigatePricing={vi.fn()}
      />,
    );
    const tiles = screen.getAllByText('credits').map((el) => el.closest('button'));
    expect(tiles.length, 'the pack scan found no tiles').toBe(Object.values(getActivePacks()).length);
    expect(tiles.length).toBeGreaterThan(0);
    for (const tile of tiles) {
      expectLockedWithPill(tile);
      fireEvent.click(tile);
    }
    expect(handlePurchase).not.toHaveBeenCalled();
  });

  test('"Manage subscription" is NOT a purchase: it stays live with no pill in the closed build', () => {
    const handleManageBilling = vi.fn();
    render(
      <AccountSubscriptionSection
        {...SUBSCRIPTION_PROPS}
        auth={{ tier: 'premium', loading: false }}
        isElevated={false}
        handlePurchase={vi.fn()}
        handleManageBilling={handleManageBilling}
        onNavigatePricing={vi.fn()}
      />,
    );
    const manage = screen.getByRole('button', { name: 'Manage subscription' });
    expect(manage.disabled).toBe(false);
    expectAbsentWithAnchor(manage.textContent, AVAILABLE_AT_LAUNCH, 'Manage subscription', 'billing portal is not gated');
    fireEvent.click(manage);
    expect(handleManageBilling).toHaveBeenCalledTimes(1);
  });
});

describe('launch lock: AccountAutoReloadPanel', () => {
  test('"Enable auto-reload" is a disabled checkbox with the pill beside its label, and no enabled setting can be saved', async () => {
    render(<AccountAutoReloadPanel auth={{ user: { id: 'u1' } }} />);
    const toggle = await screen.findByLabelText(/enable auto-reload/i);
    expect(toggle.type).toBe('checkbox');
    expect(toggle.checked).toBe(false);
    expect(toggle.disabled).toBe(true);
    const label = toggle.closest('label');
    expect(label?.getAttribute('for')).toBe('ar-enabled');
    expect(within(label).getByText(AVAILABLE_AT_LAUNCH)).toBeTruthy();
    // A browser never delivers a user click to a disabled checkbox, but jsdom's synthetic
    // click still flips it, so the product claim is pinned one step later: even a forced
    // toggle cannot reach the server, because the save is locked too.
    fireEvent.click(toggle);
    fireEvent.click(screen.getByRole('button', { name: /save auto-reload/i }));
    await settle();
    expect(mocks.saveSettings).not.toHaveBeenCalled();
  });

  test('"Save auto-reload" is disabled with the pill inside it, and a click saves nothing', async () => {
    render(<AccountAutoReloadPanel auth={{ user: { id: 'u1' } }} />);
    await screen.findByLabelText(/enable auto-reload/i);
    // Nothing is saving, so the gate is the only reason the button is disabled.
    const save = screen.getByRole('button', { name: /save auto-reload/i });
    expectLockedWithPill(save);
    fireEvent.click(save);
    await settle();
    expect(mocks.saveSettings).not.toHaveBeenCalled();
  });
});

describe('launch lock: auto-reload is a ONE-WAY lock (turning it off is never a purchase)', () => {
  const STORED_ON = { enabled: true, thresholdCredits: 5, targetCredits: 25, monthlyCapCents: 4000, exists: true };

  test('a stored auto-reload can be switched off and saved while purchases are closed', async () => {
    mocks.fetchSettings.mockResolvedValue(STORED_ON);
    render(<AccountAutoReloadPanel auth={{ user: { id: 'u1' } }} />);
    const toggle = await screen.findByLabelText(/enable auto-reload/i);
    expect(toggle.checked).toBe(true);
    expect(toggle.disabled, 'a stored-on toggle must be untickable').toBe(false);
    // Still ticked: saving would re-authorise charges, so the save stays locked with the pill.
    expectLockedWithPill(screen.getByRole('button', { name: /save auto-reload/i }));

    fireEvent.click(toggle);
    expect(toggle.checked).toBe(false);
    const save = screen.getByRole('button', { name: /save auto-reload/i });
    expect(save.disabled, 'turning off must be saveable').toBe(false);
    expect(save.querySelector('[data-launch-pill]')).toBe(null);
    fireEvent.click(save);
    await waitFor(() => expect(mocks.saveSettings).toHaveBeenCalledTimes(1));
    expect(mocks.saveSettings.mock.calls[0][0].enabled).toBe(false);
  });

  test('after switching off and saving, it cannot be switched back on until launch', async () => {
    mocks.fetchSettings.mockResolvedValue(STORED_ON);
    render(<AccountAutoReloadPanel auth={{ user: { id: 'u1' } }} />);
    const toggle = await screen.findByLabelText(/enable auto-reload/i);
    fireEvent.click(toggle);
    fireEvent.click(screen.getByRole('button', { name: /save auto-reload/i }));
    await waitFor(() => expect(mocks.saveSettings).toHaveBeenCalledTimes(1));
    // The stored state is now off, so ticking on is locked again and nothing more saves.
    await waitFor(() => expect(toggle.disabled).toBe(true));
    const save = screen.getByRole('button', { name: /save auto-reload/i });
    expectLockedWithPill(save);
    fireEvent.click(toggle);
    fireEvent.click(save);
    await settle();
    expect(mocks.saveSettings).toHaveBeenCalledTimes(1);
  });
});

describe('launch lock: AccountSeatTransferPanel (the incoming nominee)', () => {
  test('"Accept: email me a code" is disabled with the pill inside it, and a click starts nothing', async () => {
    mocks.fetchTransferStatus.mockResolvedValue({
      available: true,
      cases: [{ viewer_role: 'incoming', state: 'initiated', seat_id: 7, case_id: 'case-1' }],
    });
    render(<AccountSeatTransferPanel auth={{ user: { id: 'u1' }, isFounder: false }} />);
    // Not busy, so the gate is the only reason the button is disabled.
    const accept = await screen.findByRole('button', { name: /Accept: email me a code/ });
    expectLockedWithPill(accept);
    fireEvent.click(accept);
    await settle();
    expect(mocks.nomineeAcceptStart).not.toHaveBeenCalled();
  });

  test('"Verify & pay $99" is disabled with the pill inside it even with a code typed, and a click pays nothing', async () => {
    mocks.fetchTransferStatus.mockResolvedValue({
      available: true,
      cases: [{ viewer_role: 'incoming', state: 'nominee_verified', seat_id: 7, case_id: 'case-1' }],
    });
    render(<AccountSeatTransferPanel auth={{ user: { id: 'u1' }, isFounder: false }} />);
    // A code is typed and nothing is busy, so the gate is the only reason it is disabled.
    fireEvent.change(await screen.findByLabelText('Verification code'), { target: { value: '123456' } });
    const pay = screen.getByRole('button', { name: /Verify & pay \$99/ });
    expectLockedWithPill(pay);
    fireEvent.click(pay);
    await settle();
    // The checkout redirect only follows a nomineeConfirm response, so no call means no payment page.
    expect(mocks.nomineeConfirm).not.toHaveBeenCalled();
  });
});

describe('launch lock: RedeemBlock', () => {
  test('"Choose a purchase" is disabled with the pill inside it, while the code check itself stays live', async () => {
    mocks.rpc.mockResolvedValue({ data: { valid: true, kind: 'credits', reason: null }, error: null });
    const onNavigatePricing = vi.fn();
    render(<RedeemBlock onNavigatePricing={onNavigatePricing} />);

    // Checking a code is not a purchase: Apply is live in the closed build.
    fireEvent.change(screen.getByLabelText(t('account.redeemLabel')), { target: { value: 'SFC-AAAABBBBCCCC' } });
    const apply = screen.getByRole('button', { name: t('account.redeemApply') });
    expect(apply.disabled).toBe(false);
    fireEvent.click(apply);
    await screen.findByText(t('account.redeemValid'));
    await waitFor(() => expect(mocks.rpc).toHaveBeenCalledTimes(1));

    const choose = screen.getByRole('button', { name: new RegExp(t('account.redeemChoosePurchase')) });
    expectLockedWithPill(choose);
    fireEvent.click(choose);
    expect(onNavigatePricing).not.toHaveBeenCalled();
  });
});
