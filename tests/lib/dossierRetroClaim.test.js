/** @vitest-environment jsdom */

/**
 * dossierRetroClaim.test.js — the same-device dossier retro auto-upgrade (108).
 *
 * Proves the client half of the entitlement ladder: an anonymous one-shot buyer
 * who later signs up and saves the SAME settlement on the SAME device silently
 * attaches their durable export right. Covers the voucher stash lifecycle
 * (stash → arm-with-session → match) and every attemptDossierRetroClaim outcome
 * (no_voucher / unarmed / no_match / claimed / already / error), plus the
 * fire-and-forget orchestration that raises the confirmation toast.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Supabase seam mock: configured, with a controllable functions.invoke.
const invokeMock = vi.fn();
vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: { functions: { invoke: (...args) => invokeMock(...args) } },
}));

import {
  stashDossierClaim, attachDossierClaimSession, readDossierClaim,
  claimMatchesSettlement,
} from '../../src/lib/dossierClaimStash.js';
import {
  attemptDossierRetroClaim, runDossierRetroClaimForSave,
} from '../../src/lib/dossierRetroClaim.js';

const CHECKOUT_TOKEN = 'checkout-token-12345678901234567890';
const SESSION_ID = 'cs_test_abc123456';
const SETTLEMENT = { _seed: 'seed-xyz', name: 'Greycairn' };

beforeEach(() => {
  window.localStorage.clear();
  invokeMock.mockReset();
});

describe('dossierClaimStash lifecycle', () => {
  it('stashes, arms with a session id, and matches only the purchased settlement', () => {
    expect(stashDossierClaim({ settlement: SETTLEMENT, checkoutToken: CHECKOUT_TOKEN })).toBe(true);

    let voucher = readDossierClaim();
    expect(voucher.checkoutToken).toBe(CHECKOUT_TOKEN);
    expect(voucher.sessionId).toBeNull();
    expect(voucher.settlementId).toBe('seed-xyz');

    expect(attachDossierClaimSession(SESSION_ID)).toBe(true);
    voucher = readDossierClaim();
    expect(voucher.sessionId).toBe(SESSION_ID);

    expect(claimMatchesSettlement(SETTLEMENT, voucher)).toBe(true);
    expect(claimMatchesSettlement({ _seed: 'other-seed', name: 'Greycairn' }, voucher)).toBe(false);
  });

  it('refuses to stash a voucher it could never resolve (no seed, no name)', () => {
    expect(stashDossierClaim({ settlement: {}, checkoutToken: CHECKOUT_TOKEN })).toBe(false);
    expect(readDossierClaim()).toBeNull();
  });
});

describe('attemptDossierRetroClaim', () => {
  it('returns no_voucher when nothing is stashed', async () => {
    const r = await attemptDossierRetroClaim({ settlement: SETTLEMENT, saveId: 'save-1' });
    expect(r.outcome).toBe('no_voucher');
    expect(invokeMock).not.toHaveBeenCalled();
  });

  it('returns unarmed (no network) when the voucher has no session id yet', async () => {
    stashDossierClaim({ settlement: SETTLEMENT, checkoutToken: CHECKOUT_TOKEN });
    const r = await attemptDossierRetroClaim({ settlement: SETTLEMENT, saveId: 'save-1' });
    expect(r.outcome).toBe('unarmed');
    expect(invokeMock).not.toHaveBeenCalled();
  });

  it('returns no_match (no network) when the saved settlement is not the purchased one', async () => {
    stashDossierClaim({ settlement: SETTLEMENT, checkoutToken: CHECKOUT_TOKEN });
    attachDossierClaimSession(SESSION_ID);
    const r = await attemptDossierRetroClaim({ settlement: { _seed: 'different', name: 'Elsewhere' }, saveId: 'save-1' });
    expect(r.outcome).toBe('no_match');
    expect(invokeMock).not.toHaveBeenCalled();
  });

  it('claims and clears the voucher on a successful account-actions call', async () => {
    stashDossierClaim({ settlement: SETTLEMENT, checkoutToken: CHECKOUT_TOKEN });
    attachDossierClaimSession(SESSION_ID);
    invokeMock.mockResolvedValue({ data: { success: true }, error: null });

    const r = await attemptDossierRetroClaim({ settlement: SETTLEMENT, saveId: 'save-1' });
    expect(r.outcome).toBe('claimed');
    expect(invokeMock).toHaveBeenCalledWith('account-actions', expect.objectContaining({
      body: expect.objectContaining({
        action: 'claim_dossier_purchase',
        sessionId: SESSION_ID,
        checkoutToken: CHECKOUT_TOKEN,
        saveId: 'save-1',
      }),
    }));
    expect(readDossierClaim()).toBeNull(); // terminal success → voucher cleared
  });

  it('clears the voucher on a terminal already_claimed rejection', async () => {
    stashDossierClaim({ settlement: SETTLEMENT, checkoutToken: CHECKOUT_TOKEN });
    attachDossierClaimSession(SESSION_ID);
    invokeMock.mockResolvedValue({ data: { success: false, reason: 'already_claimed' }, error: null });

    const r = await attemptDossierRetroClaim({ settlement: SETTLEMENT, saveId: 'save-1' });
    expect(r.outcome).toBe('already');
    expect(readDossierClaim()).toBeNull();
  });

  it('keeps the voucher on a transient error so a later save can retry', async () => {
    stashDossierClaim({ settlement: SETTLEMENT, checkoutToken: CHECKOUT_TOKEN });
    attachDossierClaimSession(SESSION_ID);
    invokeMock.mockResolvedValue({ data: { success: false, reason: '' }, error: { message: 'network blip' } });

    const r = await attemptDossierRetroClaim({ settlement: SETTLEMENT, saveId: 'save-1' });
    expect(r.outcome).toBe('error');
    expect(readDossierClaim()).not.toBeNull();
  });
});

describe('runDossierRetroClaimForSave orchestration', () => {
  it('refreshes the entitlement cache and raises the confirmation toast on a claim', async () => {
    stashDossierClaim({ settlement: SETTLEMENT, checkoutToken: CHECKOUT_TOKEN });
    attachDossierClaimSession(SESSION_ID);
    invokeMock.mockResolvedValue({ data: { success: true }, error: null });

    const setDossierClaimToast = vi.fn();
    const refreshDossierEntitlement = vi.fn().mockResolvedValue(true);
    const live = { setDossierClaimToast, refreshDossierEntitlement };

    await runDossierRetroClaimForSave({ settlement: SETTLEMENT, saveId: 'save-1', get: () => live });

    expect(refreshDossierEntitlement).toHaveBeenCalledWith('save-1');
    expect(setDossierClaimToast).toHaveBeenCalledTimes(1);
    expect(typeof setDossierClaimToast.mock.calls[0][0]).toBe('string');
  });

  it('stays silent (no toast) on a non-claim outcome', async () => {
    const setDossierClaimToast = vi.fn();
    await runDossierRetroClaimForSave({
      settlement: SETTLEMENT, saveId: 'save-1', get: () => ({ setDossierClaimToast }),
    });
    expect(setDossierClaimToast).not.toHaveBeenCalled();
  });
});
