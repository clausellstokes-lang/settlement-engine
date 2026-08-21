/**
 * dossierEntitlements.js — Client reader for durable single-dossier export
 * rights (migration 108).
 *
 * Background:
 *   PDF export is a ladder. A free Wanderer account does not get unlimited
 *   export; it buys a DURABLE re-download right per SAVED settlement ($2.99).
 *   Those rights live in their own ledger (public.dossier_entitlements) and
 *   survive a Cartographer up/downgrade untouched. The server owns every write
 *   (webhook grant, refund clawback, same-device retro-claim); the client can
 *   do exactly ONE read: "do I hold an active durable right on this saved
 *   settlement?".
 *
 * Client responsibilities (this file):
 *   - Answer the has-right question for a single save id, via the read-only
 *     `has_dossier_entitlement(uuid)` RPC (SECURITY DEFINER, scoped to
 *     auth.uid() — it can never report another user's right).
 *
 * The store (authSlice) caches the boolean per save id so the export surfaces
 * do not re-hit the network on every render; this module is the sole network
 * seam. A signed-out user, an unconfigured environment, or a null save id all
 * resolve to `false` WITHOUT a network call — an unsaved dossier can never hold
 * a durable right (the right references the saves table).
 */

import { supabase, isConfigured } from './supabase.js';

/**
 * Whether the signed-in caller holds an ACTIVE durable export right on the
 * given saved settlement. Resolves to `false` (never throws) on any of:
 *   - Supabase not configured (local-only mode),
 *   - no save id (an unsaved dossier holds no durable right),
 *   - a transient RPC failure (fail-closed: the export surface should offer the
 *     purchase path, not silently allow a free export it cannot prove).
 *
 * @param {string|null|undefined} saveId — the saved settlement's uuid.
 * @returns {Promise<boolean>}
 */
export async function fetchHasDossierEntitlement(saveId) {
  if (!isConfigured) return false;
  if (typeof saveId !== 'string' || saveId.trim() === '') return false;

  try {
    const { data, error } = await supabase.rpc('has_dossier_entitlement', { p_save_id: saveId.trim() });
    if (error) {
      console.error('[dossierEntitlements] has_dossier_entitlement failed:', error);
      return false; // fail closed — offer the purchase, never a free pass
    }
    return data === true;
  } catch (e) {
    console.error('[dossierEntitlements] has_dossier_entitlement threw:', e);
    return false;
  }
}
