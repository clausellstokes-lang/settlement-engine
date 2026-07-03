/**
 * useDossierExportAccess.js — the single decision seam for "may this user export
 * THIS dossier as a PDF?" under the export ladder (migration 108).
 *
 * PRODUCT MODEL (user-locked):
 *   PDF export is a ladder.
 *     · Cartographer / Founder (or an elevated role) — unlimited export of every
 *       settlement, as a TIER feature.                          → reason 'tier'
 *     · Free Wanderer account — no tier export; instead a DURABLE per-saved-
 *       settlement right, bought once ($2.99), that survives tier up/downgrade.
 *         - holds the right on this save   → reason 'entitled'
 *         - saved but no right yet         → reason 'unpurchased'
 *         - the dossier is not saved yet   → reason 'unsaved' (save it first)
 *     · Anonymous — no account; the one-time $2.99 download is the offer.
 *                                                                → reason 'anon'
 *
 * Every PDF-export surface routes through this ONE hook so the gate lives in a
 * single place. The hook fetches the caller's durable right for the given save
 * once (via the store's cached has_dossier_entitlement reader) and re-reads the
 * cache on every render; callers refresh it after a purchase success or a retro
 * auto-upgrade by calling the store's refreshDossierEntitlement(saveId).
 *
 * @typedef {'tier'|'entitled'|'anon'|'unpurchased'|'unsaved'} ExportAccessReason
 * @typedef {{ allowed: boolean, reason: ExportAccessReason }} ExportAccess
 */

import { useEffect } from 'react';
import { useStore } from '../store/index.js';
import { tierHasUnlimitedPdfExport } from '../config/pricing.js';

/**
 * Resolve PDF-export access for one dossier.
 *
 * @param {string|null|undefined} saveId — the SAVED settlement's id, or null for
 *   an unsaved in-memory draft.
 * @returns {ExportAccess}
 */
export function useDossierExportAccess(saveId) {
  const tier       = useStore(s => s.auth?.tier);
  const isElevated = useStore(s => (typeof s.isElevated === 'function' ? s.isElevated() : false));
  // Read the cached flag reactively so a post-purchase / post-claim refresh
  // re-renders every export surface. `undefined` = not yet fetched. Guard the
  // map so a partial store (isolated tests, or a store built before this slice)
  // reads undefined rather than throwing.
  const cached     = useStore(s => (saveId ? s.dossierEntitlements?.[saveId] : undefined));
  const refreshDossierEntitlement = useStore(s => s.refreshDossierEntitlement);

  // Only the free-account, saved-dossier path needs a durable-right lookup; the
  // tier and anon branches decide without it. Fetch once when the save id is
  // known and we haven't cached a value yet.
  const needsLookup =
    !isElevated
    && !tierHasUnlimitedPdfExport(tier)
    && tier !== 'anon'
    && !!saveId;

  useEffect(() => {
    if (needsLookup && cached === undefined && typeof refreshDossierEntitlement === 'function') {
      refreshDossierEntitlement(saveId);
    }
  }, [needsLookup, cached, saveId, refreshDossierEntitlement]);

  return resolveExportAccess({ tier, isElevated, saveId, entitled: cached === true });
}

/**
 * Pure decision table — exported for direct unit testing without a React tree.
 *
 * @param {{ tier: string, isElevated: boolean, saveId: string|null|undefined, entitled: boolean }} input
 * @returns {ExportAccess}
 */
export function resolveExportAccess({ tier, isElevated, saveId, entitled }) {
  // Unlimited-export tiers (Cartographer / Founder) and elevated roles clear the
  // gate on every dossier, saved or not.
  if (isElevated || tierHasUnlimitedPdfExport(tier)) {
    return { allowed: true, reason: 'tier' };
  }
  // Anonymous: no account. The one-time purchase is the offer.
  if (tier === 'anon') {
    return { allowed: false, reason: 'anon' };
  }
  // Free account: durable rights require the settlement to be SAVED first.
  if (!saveId) {
    return { allowed: false, reason: 'unsaved' };
  }
  if (entitled) {
    return { allowed: true, reason: 'entitled' };
  }
  return { allowed: false, reason: 'unpurchased' };
}

export default useDossierExportAccess;
