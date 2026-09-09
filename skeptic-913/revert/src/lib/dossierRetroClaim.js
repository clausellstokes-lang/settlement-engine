/**
 * dossierRetroClaim.js — the silent same-device retro auto-upgrade (migration
 * 108).
 *
 * After a signed-in user SAVES a settlement, this checks whether that same
 * settlement was bought anonymously on this device (a claim voucher exists and
 * matches), and if so silently calls the account-actions `claim_dossier_purchase`
 * action to bind the durable export right to the just-saved settlement.
 *
 * Rules (user-locked):
 *   · SAME-DEVICE + SAME-SETTLEMENT + AUTOMATIC only. The match is on the
 *     settlement's generation seed (claimMatchesSettlement); a non-matching save
 *     never calls the endpoint.
 *   · Silent: no UI beyond a single quiet confirmation toast on success. There is
 *     no claim button, picker, or error surface anywhere.
 *   · The voucher is cleared on success OR 'already claimed' (both terminal); a
 *     transient failure KEEPS it so a later save can retry.
 *
 * Returns a small result the caller can act on (refresh entitlements + toast on
 * 'claimed'); never throws.
 *
 * @typedef {'claimed'|'no_voucher'|'no_match'|'unarmed'|'already'|'error'|'unconfigured'} RetroClaimOutcome
 */

import { supabase, isConfigured } from './supabase.js';
import {
  readDossierClaim, claimMatchesSettlement, clearDossierClaim,
} from './dossierClaimStash.js';

/**
 * Attempt the retro claim for a just-saved settlement.
 *
 * @param {{ settlement: object, saveId: string }} args
 * @returns {Promise<{ outcome: RetroClaimOutcome, saveId?: string }>}
 */
export async function attemptDossierRetroClaim({ settlement, saveId }) {
  if (!isConfigured || !supabase) return { outcome: 'unconfigured' };
  if (!settlement || typeof saveId !== 'string' || !saveId) return { outcome: 'no_match' };

  const voucher = readDossierClaim();
  if (!voucher) return { outcome: 'no_voucher' };

  // SAME-SETTLEMENT gate: only the purchased settlement can attach the right.
  if (!claimMatchesSettlement(settlement, voucher)) return { outcome: 'no_match' };

  // The voucher must be armed with the Stripe session id (bound on the success
  // page). Without it there is no purchase to prove; keep the voucher in case the
  // success page has not run yet on this device.
  if (typeof voucher.sessionId !== 'string' || !voucher.sessionId.startsWith('cs_')) {
    return { outcome: 'unarmed' };
  }

  try {
    const { data, error } = await supabase.functions.invoke('account-actions', {
      body: {
        action: 'claim_dossier_purchase',
        sessionId: voucher.sessionId,
        checkoutToken: voucher.checkoutToken,
        saveId,
      },
    });

    if (data?.success) {
      clearDossierClaim();
      return { outcome: 'claimed', saveId };
    }

    // A terminal business rejection (already claimed / already entitled /
    // refunded) means this voucher will never claim — clear it so it can't linger
    // or re-fire. A generic error / network fault is transient — keep it.
    const reason = data?.reason || '';
    const status = error?.context?.status ?? error?.status;
    const terminal =
      reason === 'already_claimed'
      || reason === 'already_entitled'
      || reason === 'refunded'
      || status === 403 // "could not be verified" — a refunded/claimed/mismatched voucher
      || status === 409;
    if (terminal) {
      clearDossierClaim();
      return { outcome: 'already' };
    }
    return { outcome: 'error' };
  } catch {
    // Network/transport fault — keep the voucher for a later retry.
    return { outcome: 'error' };
  }
}

/**
 * Fire-and-forget orchestration for the silent post-save retro claim, called from
 * the settlement slice's notePersistedSave. Runs attemptDossierRetroClaim and, on a
 * genuine 'claimed', refreshes the store's durable-right cache for the save and
 * raises the one quiet confirmation toast. NEVER throws — every step is best-effort
 * so it can never block or fail a save.
 *
 * @param {{ settlement: object, saveId: string|number, get: () => object }} args
 *   `get` is the zustand store getter (so the helper can reach the live slice
 *   actions without importing the store and creating a cycle).
 * @returns {Promise<void>}
 */
export async function runDossierRetroClaimForSave({ settlement, saveId, get }) {
  try {
    const result = await attemptDossierRetroClaim({ settlement, saveId: String(saveId) });
    if (result?.outcome !== 'claimed') return;
    const live = typeof get === 'function' ? get() : null;
    if (!live) return;
    try { await live.refreshDossierEntitlement?.(String(saveId)); } catch { /* cache refresh best-effort */ }
    try {
      const { t } = await import('../copy/index.js');
      live.setDossierClaimToast?.(t('dossierExport.claimed'));
    } catch { /* toast best-effort */ }
  } catch { /* never block a save */ }
}
