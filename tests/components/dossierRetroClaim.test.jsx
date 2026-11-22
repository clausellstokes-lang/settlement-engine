/** @vitest-environment jsdom */
/**
 * dossierRetroClaim.test.jsx — the silent same-device retro auto-upgrade (108).
 *
 * attemptDossierRetroClaim, run after a save, must:
 *   · fire the claim ONLY when a voucher exists AND matches the just-saved
 *     settlement (same generation seed) AND is armed with a session id;
 *   · be a silent no-op on a non-matching save (no endpoint call);
 *   · clear the voucher on success and on a terminal rejection (already claimed),
 *     but KEEP it on a transient failure so a later save can retry.
 *
 * The claim stash + supabase client are mocked so the branches are deterministic.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  voucher: null,
  invoke: vi.fn(),
  clearDossierClaim: vi.fn(),
}));

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: { functions: { invoke: (...a) => mocks.invoke(...a) } },
}));
vi.mock('../../src/lib/dossierClaimStash.js', async () => {
  // Reuse the REAL matcher (seed comparison) so the match gate is genuinely
  // exercised; only reads/clears are stubbed.
  const actual = await vi.importActual('../../src/lib/dossierClaimStash.js');
  return {
    ...actual,
    readDossierClaim: () => mocks.voucher,
    clearDossierClaim: (...a) => mocks.clearDossierClaim(...a),
  };
});

import { attemptDossierRetroClaim } from '../../src/lib/dossierRetroClaim.js';

const SAVED = { name: 'Stoneford', _seed: 'seed-1' };

function armedVoucher(overrides = {}) {
  return {
    checkoutToken: 'tok_abcdefghijklmnopqrstuvwx',
    sessionId: 'cs_test_123',
    settlementId: 'seed-1',
    settlementName: 'Stoneford',
    purchasedAt: Date.now(),
    ...overrides,
  };
}

afterEach(() => {
  mocks.voucher = null;
  mocks.invoke.mockReset();
  mocks.clearDossierClaim.mockReset();
});

describe('attemptDossierRetroClaim', () => {
  test('claims + clears the voucher when the saved settlement matches (same seed)', async () => {
    mocks.voucher = armedVoucher();
    mocks.invoke.mockResolvedValue({ data: { success: true, entitlementId: 'e1' }, error: null });

    const result = await attemptDossierRetroClaim({ settlement: SAVED, saveId: 'save-9' });

    expect(result.outcome).toBe('claimed');
    expect(mocks.invoke).toHaveBeenCalledTimes(1);
    const [fn, opts] = mocks.invoke.mock.calls[0];
    expect(fn).toBe('account-actions');
    expect(opts.body).toMatchObject({
      action: 'claim_dossier_purchase',
      sessionId: 'cs_test_123',
      checkoutToken: 'tok_abcdefghijklmnopqrstuvwx',
      saveId: 'save-9',
    });
    expect(mocks.clearDossierClaim).toHaveBeenCalledTimes(1);
  });

  test('is a silent no-op when the saved settlement does not match the voucher', async () => {
    mocks.voucher = armedVoucher({ settlementId: 'a-different-seed' });

    const result = await attemptDossierRetroClaim({ settlement: SAVED, saveId: 'save-9' });

    expect(result.outcome).toBe('no_match');
    expect(mocks.invoke).not.toHaveBeenCalled();
    expect(mocks.clearDossierClaim).not.toHaveBeenCalled();
  });

  test('no-ops with no voucher at all', async () => {
    mocks.voucher = null;
    const result = await attemptDossierRetroClaim({ settlement: SAVED, saveId: 'save-9' });
    expect(result.outcome).toBe('no_voucher');
    expect(mocks.invoke).not.toHaveBeenCalled();
  });

  test('does not fire when the voucher is not yet armed with a session id', async () => {
    mocks.voucher = armedVoucher({ sessionId: null });
    const result = await attemptDossierRetroClaim({ settlement: SAVED, saveId: 'save-9' });
    expect(result.outcome).toBe('unarmed');
    expect(mocks.invoke).not.toHaveBeenCalled();
    expect(mocks.clearDossierClaim).not.toHaveBeenCalled();
  });

  test('clears the voucher on a terminal rejection (already claimed)', async () => {
    mocks.voucher = armedVoucher();
    mocks.invoke.mockResolvedValue({
      data: { error: 'This purchase could not be claimed.', reason: 'already_claimed' },
      error: { status: 409 },
    });
    const result = await attemptDossierRetroClaim({ settlement: SAVED, saveId: 'save-9' });
    expect(result.outcome).toBe('already');
    expect(mocks.clearDossierClaim).toHaveBeenCalledTimes(1);
  });

  test('KEEPS the voucher on a transient failure so a later save can retry', async () => {
    mocks.voucher = armedVoucher();
    mocks.invoke.mockResolvedValue({ data: null, error: { message: 'network blip' } });
    const result = await attemptDossierRetroClaim({ settlement: SAVED, saveId: 'save-9' });
    expect(result.outcome).toBe('error');
    expect(mocks.clearDossierClaim).not.toHaveBeenCalled();
  });
});
