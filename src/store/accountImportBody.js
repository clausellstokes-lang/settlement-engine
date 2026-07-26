/**
 * accountImportBody.js — the lazy WRITE half of the "Import my data" pipeline.
 *
 * Batches the hardened, ownership-remapped entries produced by
 * lib/accountImport into the user's library through the SAME server-authoritative
 * add-save seam the gallery importer uses (savesService.save → the 014 BEFORE
 * INSERT trigger stamps the owner + enforces the per-tier slot cap). Campaigns
 * are the genuinely new surface and stay premium-gated.
 *
 * Security posture (see lib/accountImport.js for the per-record scrub):
 *   • Ownership is NEVER read from the file. savesService.save lets the server
 *     stamp user_id from auth.getUser(); the caller binds the whole batch to
 *     the authenticated owner/session that started it.
 *   • Every record gets a FRESH server id, so import is purely additive and can
 *     never clobber an existing save.
 *   • The tier / save-limit gate is respected two ways: a friendly client
 *     pre-flight (maxSaves vs activeSaveCount) for partial-with-notice, and the
 *     server 014 trigger as the authoritative gate — never bypassed. Anon
 *     (maxSaves:0 / !canSave) is blocked outright.
 *   • A same-owner mid-batch failure attempts cleanup by fresh id and reports
 *     any row it cannot remove. An account switch preserves the new owner's
 *     integrity and explicitly reports rows left in the previous account.
 */

import { saves as savesService } from '../lib/saves.js';
import { activeSaveCount } from '../lib/saveAccess.js';
import {
  ensureNormalizeLoaded,
  prepareSettlementEntry,
  validateAccountImport,
} from '../lib/accountImport.js';
import {
  parseContentPack,
  prepareImport as prepareContentPackImport,
} from '../lib/contentPacks.js';
import {
  accountContentImportNamespace,
  buildImportedAccountArchiveIdentityMap,
  buildImportedAccountContentIdentityMap,
  remapAccountCampaignContentBinding,
  remapAccountCampaignContentBindingHistory,
} from '../lib/accountContentPortability.js';
import {
  accountCampaignBindingDestinations,
  remapAccountSettlementContentProvenance,
} from '../lib/accountSettlementContentPortability.js';
import {
  archiveImportWasConfirmed,
} from '../lib/customContentCutover.js';
import { track, EVENTS } from '../lib/analytics.js';
import {
  campaignSessionChangedError,
  captureCampaignSession,
  isCurrentCampaignSession,
} from './campaignSliceShared.js';

/** Whether the importing user may create campaigns (premium / elevated only). */
function canImportCampaigns(auth) {
  const role = auth?.role;
  return auth?.tier === 'premium' || role === 'developer' || role === 'admin';
}

function accountChangedImportResult(previousAccountSaveCount = 0) {
  const count = Math.max(0, Number(previousAccountSaveCount) || 0);
  const settlementNoun = `settlement${count === 1 ? '' : 's'}`;
  const remainVerb = `remain${count === 1 ? 's' : ''}`;
  const objectPronoun = count === 1 ? 'it' : 'them';
  return {
    ok: false,
    error: count > 0
      ? [
        `Your account changed while the import was running. ${count} imported ${settlementNoun}`,
        `${remainVerb} in the previous account; sign back into that account to review or delete ${objectPronoun}.`,
      ].join(' ')
      : 'Your account changed while the import was running. No settlements were imported.',
    ...(count > 0 ? { previousAccountSaveCount: count } : {}),
  };
}

function importedProfileName(text) {
  // Display-only provenance; never trusted for identity or tier decisions.
  try {
    return JSON.parse(text)?.profile?.displayName || null;
  } catch {
    return null;
  }
}

async function cleanupImportedSettlements(saveIds, ownerId) {
  let incompleteCount = 0;
  for (const saveId of saveIds) {
    try {
      await savesService.delete(saveId, ownerId);
    } catch {
      incompleteCount += 1;
    }
  }
  return incompleteCount;
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
 *   customContentImported?: number,
 *   customContentImportCounts?: Record<string, number>|null,
 *   customContentSkipped?: Array<{ name: string, reason: string }>,
 *   settlementContentWarnings?: Array<{ name: string, reason: string }>,
 *   campaignContentWarnings?: Array<{ name: string, reason: string }>,
   *   overLimit?: boolean,
   *   previousAccountSaveCount?: number,
   *   cleanupIncompleteCount?: number,
   * }>}
   */
  importAccountData: async (text) => {
    const stateAtStart = get();

    // Gate: anon / no-save tiers are blocked outright (defense in depth—the
    // server trigger would reject anyway, but fail fast with a clear message).
    const canSave = typeof stateAtStart.canSave === 'function'
      ? stateAtStart.canSave()
      : false;
    if (!stateAtStart.auth?.user || !canSave) {
      return { ok: false, error: 'Sign in or upgrade to import your data.' };
    }
    const session = captureCampaignSession(stateAtStart, stateAtStart.auth.user.id);
    if (!session) {
      return { ok: false, error: 'Your account changed before the import could start.' };
    }
    const isSessionCurrent = () => isCurrentCampaignSession(get(), session);
    const assertSessionCurrent = () => {
      if (!isSessionCurrent()) throw campaignSessionChangedError();
    };
    const saveOptions = { expectedOwnerId: session.ownerId, isSessionCurrent };

    // Phase 1 — validate the export envelope, fail closed.
    const validated = validateAccountImport(text);
    if (validated.ok !== true) return { ok: false, error: validated.error };
    const {
      settlements: rawSettlements,
      campaigns: rawCampaigns,
      customContentArchive,
      customContentPack,
    } = validated.value;
    const contentImportNamespace = accountContentImportNamespace(
      customContentArchive || customContentPack,
      rawCampaigns,
    );
    // Even an export without an editable pack may carry portable, embedded
    // campaign snapshots. Start with an empty receipt map so those identities
    // are deterministically re-namespaced rather than copied from the source
    // account unchanged.
    const emptyIdentityJoin = buildImportedAccountContentIdentityMap({
      namespace: contentImportNamespace,
      pack: null,
      prepared: { items: [] },
      receipt: { perEntry: [] },
    });
    if (!('identityMap' in emptyIdentityJoin)) {
      return { ok: false, error: emptyIdentityJoin.error };
    }
    let contentIdentityMap = emptyIdentityJoin.identityMap;
    let contentIdentityJoinWarning = null;

    const sourceName = importedProfileName(text);
    const importedAt = new Date().toISOString();

    // Phase 2 — v3 carries one already-admitted full ledger archive. Older
    // envelopes may carry a content pack and retain their exact Compendium
    // parser/atomic-preview compatibility path. The two authorities are never
    // mixed, and a v3 archive never degrades into per-head inserts.
    const customContentSkipped = [];
    let contentArchivePlan = null;
    let contentPackPlan = null;
    if (customContentArchive) {
      const canUseCustomContent =
        typeof stateAtStart.canUseCustomContent === 'function'
          ? stateAtStart.canUseCustomContent()
          : canImportCampaigns(stateAtStart.auth);
      if (!canUseCustomContent) {
        customContentSkipped.push({
          name: 'Full custom-content archive',
          reason: 'Custom-content import needs premium.',
        });
      } else if (typeof stateAtStart.importCustomContentArchive !== 'function') {
        customContentSkipped.push({
          name: 'Full custom-content archive',
          reason: 'The custom-content archive service is unavailable.',
        });
      } else {
        // validateAccountImport already admitted the entire immutable graph.
        // Do not degrade a v3 archive into per-head pack inserts: one archive
        // command is the only lane that can preserve history and constitution.
        contentArchivePlan = customContentArchive;
      }
    } else if (customContentPack) {
      const canUseCustomContent = typeof stateAtStart.canUseCustomContent === 'function'
        ? stateAtStart.canUseCustomContent()
        : canImportCampaigns(stateAtStart.auth);
      if (!canUseCustomContent) {
        customContentSkipped.push({
          name: customContentPack.name || 'Custom content pack',
          reason: 'Custom-content import needs premium.',
        });
      } else {
        const parsedPack = parseContentPack(customContentPack);
        if (!parsedPack.ok) {
          customContentSkipped.push({
            name: customContentPack.name || 'Custom content pack',
            reason: parsedPack.error || 'The custom-content pack is invalid.',
          });
        } else {
          const installedState = typeof get().getInstalledContentPackState === 'function'
            ? await get().getInstalledContentPackState(parsedPack.pack.packId)
            : {
                activePackVersion: null,
                activeManifestHash: null,
                entries: {},
              };
          if (!isSessionCurrent()) {
            return accountChangedImportResult();
          }
          const preparedPack = prepareContentPackImport(parsedPack.pack, {
            existingByPackEntry: installedState.entries,
          });
          if (
            preparedPack.rejected.length > 0
            || preparedPack.diagnostics.atomic === false
          ) {
            customContentSkipped.push({
              name: parsedPack.pack.name || 'Custom content pack',
              reason: `${preparedPack.rejected.length} invalid ${
                preparedPack.rejected.length === 1 ? 'entry needs' : 'entries need'
              } review; no custom content was imported.`,
            });
          } else if (preparedPack.items.length > 0) {
            contentPackPlan = {
              pack: parsedPack.pack,
              prepared: preparedPack,
              installedState,
            };
          }
        }
      }
    }
    if (customContentArchive && !contentArchivePlan) {
      const reason = customContentSkipped[0]?.reason
        || 'The full custom-content archive cannot be restored.';
      return {
        ok: false,
        error: `${reason} No dependent settlements or campaigns were imported.`,
        customContentImported: 0,
        customContentImportCounts: null,
        customContentSkipped,
      };
    }

    // Phase 3 — land a v3 constitutional archive before materializing saves.
    // Settlements carry exact content-provenance receipts, so their source ids
    // cannot be rewritten truthfully until the atomic archive command returns
    // its destination ids and post-remap hashes.
    let customContentImported = 0;
    let customContentImportCounts = null;
    if (contentArchivePlan) {
      if (!isSessionCurrent()) return accountChangedImportResult();
      try {
        const receipt = await get().importCustomContentArchive(
          contentArchivePlan,
          { purpose: 'account-import' },
        );
        if (!isSessionCurrent()) return accountChangedImportResult();
        if (archiveImportWasConfirmed(receipt)) {
          customContentImported = Number(
            receipt.counts?.definitions
            ?? receipt.importedCounts?.definitions
            ?? receipt.result?.counts?.definitions
            ?? contentArchivePlan.ledger?.definitions?.length
            ?? 0,
          );
          const receiptCounts =
            receipt.counts
            || receipt.importedCounts
            || receipt.result?.counts
            || {};
          customContentImportCounts = {
            definitions: customContentImported,
            revisions: Number(
              receiptCounts.revisions
              ?? contentArchivePlan.ledger?.revisions?.length
              ?? 0,
            ),
            archivedDefinitions: Number(
              receiptCounts.archivedDefinitions
              ?? contentArchivePlan.ledger?.definitions?.filter(
                definition => definition.archivedAt != null,
              ).length
              ?? 0,
            ),
            packs: Number(
              receiptCounts.packs
              ?? contentArchivePlan.ledger?.packs?.length
              ?? 0,
            ),
            packVersions: Number(
              receiptCounts.packVersions
              ?? contentArchivePlan.ledger?.packVersions?.length
              ?? 0,
            ),
            environments: Number(
              receiptCounts.environments
              ?? contentArchivePlan.ledger?.environments?.length
              ?? 0,
            ),
          };
          const identityJoin = buildImportedAccountArchiveIdentityMap({
            namespace: contentImportNamespace,
            identityMap: receipt.identityMap || receipt.result?.identityMap,
          });
          if ('identityMap' in identityJoin) {
            contentIdentityMap = identityJoin.identityMap;
          } else {
            return {
              ok: false,
              error: `${identityJoin.error} The custom-content archive was restored, but no dependent settlements or campaigns were imported.`,
              customContentImported,
              customContentImportCounts,
              customContentSkipped,
            };
          }
        } else {
          const skipped = {
            name: 'Full custom-content archive',
            reason: receipt?.reason
              || 'The custom-content archive command was not confirmed.',
          };
          customContentSkipped.push(skipped);
          return {
            ok: false,
            error: `${skipped.reason} No dependent settlements or campaigns were imported.`,
            customContentImported: 0,
            customContentImportCounts: null,
            customContentSkipped,
          };
        }
      } catch (error) {
        const skipped = {
          name: 'Full custom-content archive',
          reason: error instanceof Error
            ? error.message
            : 'The custom-content archive could not be imported.',
        };
        customContentSkipped.push(skipped);
        return {
          ok: false,
          error: `${skipped.reason} No dependent settlements or campaigns were imported.`,
          customContentImported: 0,
          customContentImportCounts: null,
          customContentSkipped,
        };
      }
    }

    let bindingDestinations = accountCampaignBindingDestinations(
      rawCampaigns,
      contentIdentityMap,
    );
    const settlementContentWarnings = [];

    // Phase 4 — validate, migrate, scrub, and re-address each settlement.
    // prepareSettlementEntry normalizes each record synchronously via a lazily-
    // imported normalizeSettlement (kept off the first-paint static closure), so
    // warm that ref once before the loop.
    await ensureNormalizeLoaded();
    if (!isSessionCurrent()) {
      return accountChangedImportResult();
    }
    const prepared = [];
    const settlementsSkipped = [];
    for (const rawSettlement of rawSettlements) {
      const preparedResult = prepareSettlementEntry(
        rawSettlement,
        { sourceName, importedAt },
      );
      if (preparedResult.ok === true) {
        const sourceProvenance =
          preparedResult.entry.settlement.customContentProvenance;
        if (sourceProvenance != null) {
          const remappedProvenance =
            remapAccountSettlementContentProvenance(
              sourceProvenance,
              contentIdentityMap,
              bindingDestinations,
            );
          if (remappedProvenance.ok) {
            preparedResult.entry.settlement.customContentProvenance =
              remappedProvenance.provenance;
          } else {
            // The settlement remains a valid dormant imported artifact, but an
            // unconfirmed source-account foreign key is not exact provenance.
            delete preparedResult.entry.settlement.customContentProvenance;
            settlementContentWarnings.push({
              name: preparedResult.entry.name,
              reason: `${remappedProvenance.error} Its source provenance was removed.`,
            });
          }
        }
        prepared.push({
          entry: preparedResult.entry,
          oldId: rawSettlement?.id != null ? String(rawSettlement.id) : null,
        });
      } else {
        const name = (
          rawSettlement
          && typeof rawSettlement.name === 'string'
          && rawSettlement.name
        ) || 'Unnamed settlement';
        settlementsSkipped.push({ name, reason: preparedResult.reason });
      }
    }

    // Phase 5 — respect the save cap. Import the first `remaining`;
    // the rest are reported as skipped (over limit) — partial-with-notice.
    const max = typeof stateAtStart.maxSaves === 'function'
      ? stateAtStart.maxSaves()
      : Infinity;
    const used = activeSaveCount(stateAtStart.savedSettlements || []);
    const remaining = Number.isFinite(max) ? Math.max(0, max - used) : Infinity;
    let overLimit = false;
    let toImport = prepared;
    if (Number.isFinite(remaining) && prepared.length > remaining) {
      overLimit = true;
      toImport = prepared.slice(0, remaining);
      for (const overLimitEntry of prepared.slice(remaining)) {
        settlementsSkipped.push({
          name: overLimitEntry.entry.name,
          reason: 'Over your library limit.',
        });
      }
    }

    // Phase 6 — write fresh ids through the server-authoritative add-save seam.
    // Build oldId→newId so imported campaigns can remap their members. A
    // same-owner failure attempts cleanup; an auth switch cannot safely delete
    // the prior owner's rows and is reported explicitly below.
    const idMap = {};
    const inserted = [];
    const landed = [];
    try {
      for (const { entry, oldId } of toImport) {
        assertSessionCurrent();
        // savesService.save mints the id + stamps the owner; expectedOwnerId is
        // an operation fence, never an owner value trusted from the import.
        const newId = await savesService.save(entry, saveOptions);
        inserted.push(newId);
        if (oldId) idMap[oldId] = newId;
        landed.push({ ...entry, id: newId, savedAt: Date.now() });
        assertSessionCurrent();
      }
    } catch (err) {
      if (err?.code === 'auth_session_changed') {
        return accountChangedImportResult(inserted.length);
      }
      // The 014 trigger (or any save error) stops the batch. Cleanup is possible
      // only while the importing owner remains current, and failures are visible.
      const cleanupIncompleteCount = await cleanupImportedSettlements(
        inserted,
        session.ownerId,
      );
      const baseError = err?.message || 'Import failed while saving.';
      return {
        ok: false,
        // Surface the server's cap message verbatim, then disclose any cleanup
        // failure rather than claiming every landed row was rolled back.
        error: cleanupIncompleteCount > 0
          ? `${baseError} ${cleanupIncompleteCount} partially imported settlement${cleanupIncompleteCount === 1 ? '' : 's'} may remain in this account.`
          : baseError,
        ...(cleanupIncompleteCount > 0 ? { cleanupIncompleteCount } : {}),
      };
    }

    // Phase 7 — commit landed saves to the live cache, still under the session fence.
    if (!isSessionCurrent()) {
      return accountChangedImportResult(inserted.length);
    }
    if (landed.length) {
      set(state => {
        for (const entry of landed) {
          state.savedSettlements.push(entry);
        }
      });
    }

    // Phase 8 — legacy v1/v2 packs keep their reviewed command lane. V3 has
    // already imported its full archive above because save provenance depended
    // on the returned destination identity map.
    if (contentPackPlan) {
      if (!isSessionCurrent()) {
        return accountChangedImportResult(inserted.length);
      }
      const applyCommand = get().applyCustomContentCommand;
      if (typeof applyCommand !== 'function') {
        customContentSkipped.push({
          name: contentPackPlan.pack.name,
          reason: 'The custom-content command service is unavailable.',
        });
      } else {
        const {
          pack,
          prepared: preparedPack,
          installedState,
        } = contentPackPlan;
        const receipt = await applyCommand({
          kind: 'content.pack.import',
          entries: preparedPack.items.map(entry => ({
            category: entry.bucket,
            item: entry.item,
            definitionId: entry.definitionId,
            expectedHeadRevisionId: entry.expectedHeadRevisionId,
            packEntryId: entry.packEntryId,
          })),
          source: {
            type: 'account-export',
            ref: `${pack.packId}@${pack.packVersion}`,
            pack: {
              packId: pack.packId,
              packVersion: pack.packVersion,
              manifestHash: pack.manifestHash,
              name: pack.name,
              expectedActivePackVersion:
                installedState.activePackVersion || null,
              expectedActiveManifestHash:
                installedState.activeManifestHash || null,
            },
          },
        });
        if (!isSessionCurrent()) {
          return accountChangedImportResult(inserted.length);
        }
        if (archiveImportWasConfirmed(receipt)) {
          customContentImported = Array.isArray(receipt.perEntry)
            ? receipt.perEntry.length
            : preparedPack.items.length;
          customContentImportCounts = {
            definitions: customContentImported,
          };
          const identityJoin = buildImportedAccountContentIdentityMap({
            namespace: contentImportNamespace,
            pack,
            prepared: preparedPack,
            receipt,
          });
          if ('identityMap' in identityJoin) {
            contentIdentityMap = identityJoin.identityMap;
          } else {
            // The definitions did land, but an incomplete receipt cannot safely
            // be guessed into campaign foreign identities. Campaign bindings
            // remain executable through deterministic embedded identities and
            // the discrepancy is visible in the import receipt.
            contentIdentityJoinWarning = identityJoin.error;
          }
        } else {
          customContentSkipped.push({
            name: pack.name,
            reason: receipt?.reason
              || 'The custom-content command was not confirmed.',
          });
        }
      }
    }

    // Phase 9 — import premium-gated campaigns with remapped settlement ids.
    // Each imported campaign becomes a FRESH campaign
    // whose settlementIds are remapped through idMap; members that weren't
    // imported are dropped.
    let campaignsImported = 0;
    const campaignsSkipped = [];
    const campaignContentWarnings = [];
    if (rawCampaigns.length) {
      if (!canImportCampaigns(stateAtStart.auth)) {
        for (const rawCampaign of rawCampaigns) {
          campaignsSkipped.push({
            name: rawCampaign?.name || 'Imported campaign',
            reason: 'Campaign import needs premium.',
          });
        }
      } else {
        for (const rawCampaign of rawCampaigns) {
          if (!isSessionCurrent()) {
            return {
              ok: false,
              error: 'Your account changed while the import was running. Sign back in and try again.',
            };
          }
          if (!rawCampaign || typeof rawCampaign !== 'object') {
            campaignsSkipped.push({ name: 'Imported campaign', reason: 'Not a campaign record.' });
            continue;
          }
          const campaignName = rawCampaign.name || 'Imported campaign';
          const remappedIds = (
            Array.isArray(rawCampaign.settlementIds)
              ? rawCampaign.settlementIds
              : []
          )
            .map(oldId => idMap[String(oldId)])
            .filter(Boolean);
          const remappedBinding = rawCampaign.contentBinding
            ? remapAccountCampaignContentBinding(
                rawCampaign.contentBinding,
                contentIdentityMap,
              )
            : null;
          const remappedBindingHistory =
            rawCampaign.contentBindingHistory != null
              ? remapAccountCampaignContentBindingHistory(
                  rawCampaign.contentBindingHistory,
                  contentIdentityMap,
                )
              : null;
          if (rawCampaign.contentBinding && remappedBinding?.ok !== true) {
            campaignContentWarnings.push({
              name: campaignName,
              reason: `Its saved content environment could not be remapped: ${
                remappedBinding?.error || 'invalid binding'
              }. The imported campaign uses the current account environment.`,
            });
          }
          if (
            rawCampaign.contentBindingHistory != null
            && remappedBindingHistory?.ok !== true
          ) {
            campaignContentWarnings.push({
              name: campaignName,
              reason: `Its content rollback history could not be remapped: ${
                remappedBindingHistory?.error || 'invalid history'
              }. The history was not imported.`,
            });
          }
          if (contentIdentityJoinWarning && rawCampaign.contentBinding) {
            campaignContentWarnings.push({
              name: campaignName,
              reason: `${contentIdentityJoinWarning} Its immutable content remains embedded in the campaign.`,
            });
          }
          const createImportedCampaign = get().createImportedCampaign;
          if (typeof createImportedCampaign !== 'function') {
            campaignsSkipped.push({
              name: campaignName,
              reason: 'The durable campaign import service is unavailable.',
            });
            continue;
          }
          const campaignReceipt = await createImportedCampaign(
            `${campaignName} (imported)`,
            {
              settlementIds: remappedIds,
              contentBinding: remappedBinding?.ok
                ? remappedBinding.binding
                : null,
              contentBindingHistory: remappedBindingHistory?.ok
                ? remappedBindingHistory.history
                : [],
            },
          );
          if (!isSessionCurrent()) {
            return accountChangedImportResult(inserted.length);
          }
          if (
            campaignReceipt?.ok !== true
            || campaignReceipt.status !== 'applied'
            || campaignReceipt.persistence?.state !== 'confirmed'
          ) {
            campaignsSkipped.push({
              name: campaignName,
              reason: campaignReceipt?.reason
                || 'Campaign persistence was not confirmed.',
            });
            continue;
          }
          campaignsImported += 1;
        }
      }
    }

    // Phase 10 — telemetry is explicitly non-authoritative. The import result
    // must survive analytics failure because all durable writes already committed.
    // Reuse the gallery-import event with a distinct kind (the catalog already
    // distinguishes kinds via this event; no new contract entry needed).
    try {
      track(EVENTS.GALLERY_IMPORTED, {
        kind: 'account_export',
        settlement_count: landed.length,
        campaign_count: campaignsImported,
        custom_content_count: customContentImported,
      });
    } catch {
      // Analytics never changes import success.
    }

    return {
      ok: true,
      settlementsImported: landed.length,
      settlementsSkipped,
      campaignsImported,
      campaignsSkipped,
      customContentImported,
      customContentImportCounts,
      customContentSkipped,
      settlementContentWarnings,
      campaignContentWarnings,
      overLimit,
    };
  },
});
