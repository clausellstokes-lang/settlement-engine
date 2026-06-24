/**
 * accountImportSlice.js — the WRITE half of the "Import my data" pipeline.
 *
 * Batches the hardened, ownership-remapped entries produced by
 * lib/accountImport into the user's library through the SAME server-authoritative
 * add-save seam the gallery importer uses (savesService.save → the 014 BEFORE
 * INSERT trigger stamps the owner + enforces the per-tier slot cap). Campaigns
 * are the genuinely new surface and stay premium-gated.
 *
 * Security posture (see lib/accountImport.js for the per-record scrub):
 *   • Ownership is NEVER read from the file. savesService.save lets the server
 *     stamp user_id from auth.getUser(); we pass no id / owner field.
 *   • Every record gets a FRESH server id, so import is purely additive and can
 *     never clobber an existing save.
 *   • The tier / save-limit gate is respected two ways: a friendly client
 *     pre-flight (maxSaves vs activeSaveCount) for partial-with-notice, and the
 *     server 014 trigger as the authoritative gate — never bypassed. Anon
 *     (maxSaves:0 / !canSave) is blocked outright.
 *   • A mid-batch failure ROLLS BACK this batch's inserts (delete by fresh id)
 *     so a partial failure never orphans rows — mirrors the map-import rollback.
 */

import { saves as savesService } from '../lib/saves.js';
import { activeSaveCount } from '../lib/saveAccess.js';
import { validateAccountImport, prepareSettlementEntry } from '../lib/accountImport.js';
import { track, EVENTS } from '../lib/analytics.js';

/** Whether the importing user may create campaigns (premium / elevated only). */
function canImportCampaigns(auth) {
  const role = auth?.role;
  return auth?.tier === 'premium' || role === 'developer' || role === 'admin';
}

export const createAccountImportSlice = (set, get) => ({
  /**
   * Validate + import an export file's parsed text into the current user's
   * library. The settlement path is fully hardened (fresh id, ownership remap,
   * scrub, slot gate); the campaign path is premium-gated and remaps
   * settlementIds through the oldId→newId map built while importing settlements.
   *
   * @param {string} text raw file contents (caller has already size-capped it)
   * @returns {Promise<{
   *   ok: boolean,
   *   error?: string,
   *   settlementsImported?: number,
   *   settlementsSkipped?: Array<{ name: string, reason: string }>,
   *   campaignsImported?: number,
   *   campaignsSkipped?: Array<{ name: string, reason: string }>,
   *   overLimit?: boolean,
   * }>}
   */
  importAccountData: async (text) => {
    const st = get();

    // Gate 0: anon / no-save tiers are blocked outright (defense in depth — the
    // server trigger would reject anyway, but fail fast with a clear message).
    const canSave = typeof st.canSave === 'function' ? st.canSave() : false;
    if (!st.auth?.user || !canSave) {
      return { ok: false, error: 'Sign in or upgrade to import your data.' };
    }

    // Stage 1: envelope validation, fail-closed.
    const validated = validateAccountImport(text);
    if (validated.ok !== true) return { ok: false, error: validated.error };
    const { settlements: rawSettlements, campaigns: rawCampaigns } = validated.value;

    const sourceName = (() => {
      // Display-only provenance; never trusted for identity/tier.
      try { return JSON.parse(text)?.profile?.displayName || null; } catch { return null; }
    })();
    const importedAt = new Date().toISOString();

    // Stage 2–3: per-record validate + migrate-forward + ownership-remap scrub.
    const prepared = [];
    const settlementsSkipped = [];
    for (const raw of rawSettlements) {
      const res = prepareSettlementEntry(raw, { sourceName, importedAt });
      if (res.ok === true) {
        prepared.push({ entry: res.entry, oldId: raw?.id != null ? String(raw.id) : null });
      } else {
        const name = (raw && typeof raw.name === 'string' && raw.name) || 'Unnamed settlement';
        settlementsSkipped.push({ name, reason: res.reason });
      }
    }

    // Stage 5 (pre-flight): respect the save cap. Import the first `remaining`;
    // the rest are reported as skipped (over limit) — partial-with-notice.
    const max = typeof st.maxSaves === 'function' ? st.maxSaves() : Infinity;
    const used = activeSaveCount(st.savedSettlements || []);
    const remaining = Number.isFinite(max) ? Math.max(0, max - used) : Infinity;
    let overLimit = false;
    let toImport = prepared;
    if (Number.isFinite(remaining) && prepared.length > remaining) {
      overLimit = true;
      toImport = prepared.slice(0, remaining);
      for (const over of prepared.slice(remaining)) {
        settlementsSkipped.push({ name: over.entry.name, reason: 'Over your library limit.' });
      }
    }

    // Stage 4 + 6: fresh-id write through the server-authoritative add-save seam.
    // Build oldId→newId so imported campaigns can remap their members. On any
    // failure, roll back this batch's inserts so nothing is orphaned.
    const idMap = {};
    const inserted = [];
    const landed = [];
    try {
      for (const { entry, oldId } of toImport) {
        // savesService.save mints the id + stamps the owner; we never pass id.
        const newId = await savesService.save(entry);
        inserted.push(newId);
        if (oldId) idMap[oldId] = newId;
        landed.push({ ...entry, id: newId, savedAt: Date.now() });
      }
    } catch (err) {
      // The 014 trigger (or any save error) stops the batch; roll back inserts.
      for (const id of inserted) {
        try { await savesService.delete(id); } catch { /* best-effort cleanup */ }
      }
      return {
        ok: false,
        // Surface the server's cap message verbatim when present.
        error: err?.message || 'Import failed while saving; partial inserts were rolled back.',
      };
    }

    // Push the landed saves into the live library (additive — fresh ids).
    if (landed.length) {
      set(state => { for (const e of landed) state.savedSettlements.push(e); });
    }

    // Campaigns: premium-gated. Each imported campaign becomes a FRESH campaign
    // whose settlementIds are remapped through idMap; members that weren't
    // imported are dropped.
    let campaignsImported = 0;
    const campaignsSkipped = [];
    if (rawCampaigns.length) {
      if (!canImportCampaigns(st.auth)) {
        for (const c of rawCampaigns) {
          campaignsSkipped.push({ name: (c && c.name) || 'Imported campaign', reason: 'Campaign import needs premium.' });
        }
      } else {
        for (const c of rawCampaigns) {
          if (!c || typeof c !== 'object') {
            campaignsSkipped.push({ name: 'Imported campaign', reason: 'Not a campaign record.' });
            continue;
          }
          const newCampaignId = get().createCampaign(`${(c.name || 'Imported campaign')} (imported)`);
          if (!newCampaignId) {
            campaignsSkipped.push({ name: c.name || 'Imported campaign', reason: 'Could not create campaign.' });
            continue;
          }
          const remappedIds = (Array.isArray(c.settlementIds) ? c.settlementIds : [])
            .map(oid => idMap[String(oid)])
            .filter(Boolean);
          set(state => {
            const created = state.campaigns.find(x => x.id === newCampaignId);
            if (created) created.settlementIds = remappedIds;
          });
          campaignsImported += 1;
        }
      }
    }

    // Reuse the gallery-import event with a distinct kind (the catalog already
    // distinguishes kinds via this event; no new contract entry needed).
    try { track(EVENTS.GALLERY_IMPORTED, { kind: 'account_export', settlement_count: landed.length, campaign_count: campaignsImported }); } catch { /* analytics never affects import */ }

    return {
      ok: true,
      settlementsImported: landed.length,
      settlementsSkipped,
      campaignsImported,
      campaignsSkipped,
      overLimit,
    };
  },
});
