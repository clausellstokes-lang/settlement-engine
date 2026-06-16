/**
 * campaignSliceShared.js — pure utilities + persistence helpers extracted from
 * campaignSlice (WS4 decomposition, increment 1).
 *
 * These hold no store state: they operate on plain values or on the Immer draft
 * `state` passed in. Extracting them shrinks the campaignSlice megafile and gives
 * future campaign sub-slices a single import home for the shared persistence
 * surface. The module never imports campaignSlice, so there is no cycle.
 */
import { saves as savesService } from '../lib/saves.js';
import { campaigns as campaignService } from '../lib/campaigns.js';
import {
  forgetCampaignSync,
  primeCampaignSync,
  syncCampaignChanges,
} from '../lib/campaignSync.js';

export function cloneJson(value) {
  if (value === undefined || value === null) return value;
  return JSON.parse(JSON.stringify(value));
}

export function campaignCacheOwner(state) {
  return state?.auth?.user?.id ? String(state.auth.user.id) : 'anon';
}

export function localWrite(campaigns, ownerId = 'anon') {
  try {
    campaignService.cache(campaigns, ownerId);
  } catch (e) {
    // Likely quota exceeded — FMG snapshots can be large (~1MB). The caller
    // should already have warned via canSaveSnapshot(); log and continue.
    console.warn('[campaignSlice] localStorage write failed', e);
  }
}

export function persistCampaigns(campaigns, changedId = null, ownerId = 'anon', options = {}) {
  const snapshot = cloneJson(campaigns) || [];
  localWrite(snapshot, ownerId);
  const sync = syncCampaignChanges(snapshot, { service: campaignService, changedId });
  if (options.strict) return sync;
  sync.catch(e => {
    console.warn('[campaignSlice] campaign cloud sync failed', e);
  });
  return sync;
}

export function persistCampaignState(state, changedId = null, options = {}) {
  return persistCampaigns(state.campaigns, changedId, campaignCacheOwner(state), options);
}

export function cacheCampaignState(state) {
  const ownerId = campaignCacheOwner(state);
  const snapshot = cloneJson(state.campaigns) || [];
  localWrite(snapshot, ownerId);
  return { ownerId, snapshot };
}

export function syncCampaignSnapshot(snapshot, changedId) {
  return syncCampaignChanges(snapshot, { service: campaignService, changedId });
}

export function deletePersistedCampaign(id, campaigns, ownerId = 'anon') {
  const snapshot = cloneJson(campaigns) || [];
  localWrite(snapshot, ownerId);
  forgetCampaignSync(id);
  if (!campaignService.isConfigured) return;
  // Record a deletion tombstone BEFORE the async cloud delete. mergeCampaignLists
  // reads it (at list()-resolve time) so an in-flight load or a stale cache copy
  // can't resurrect the campaign while the cloud delete is still propagating.
  campaignService.recordTombstone(id, ownerId);
  campaignService.delete(id).catch(e => {
    console.warn('[campaignSlice] campaign cloud delete failed', e);
  });
}

export function deletePersistedCampaignState(state, id) {
  return deletePersistedCampaign(id, state.campaigns, campaignCacheOwner(state));
}

export function clearCampaignSyncBookkeeping() {
  primeCampaignSync([]);
}

// Set by campaignSlice via initPersistFailureReporter so this module-scoped
// helper can report a failed cloud save into store state (the UI then warns).
let _reportPersistFailure = null;

/** Wire the store-state failure reporter (called once from createCampaignSlice). */
export function initPersistFailureReporter(fn) {
  _reportPersistFailure = fn;
}

export function persistSaveUpdate(saveId, partial) {
  if (!saveId || !partial) return Promise.resolve(true);
  // Still must not rethrow — several callers fire-and-forget, and a rejection
  // here produced unhandled promise rejections. But the failure is no longer
  // SILENT: it used to leave the user seeing success while Supabase drifted from
  // local state (surfacing later as a settlement that "reverts" on reload). Now
  // it reports to the store so the UI can warn. Returns true/false so awaited
  // batch callers can react too.
  return savesService.update(saveId, partial).then(() => true).catch(e => {
    console.warn('[campaignSlice] save update failed', e);
    try { _reportPersistFailure?.(e); } catch { /* reporting must never throw */ }
    return false;
  });
}

export async function persistSaveUpdates(updates = []) {
  for (const update of updates) {
    await persistSaveUpdate(update.saveId, {
      settlement: update.settlement,
      campaignState: update.campaignState,
      versionHistory: update.versionHistory,
    });
  }
}

/**
 * Shared persist tail for the world-pulse mutators (advanceCampaignWorld /
 * applyWorldPulseProposal / recordPartyImpact): flush the per-save updates, then
 * sync the campaign snapshot. Both awaits run only when the mutator produced
 * state. Failures inside persistSaveUpdates surface via campaignSyncError (see
 * persistSaveUpdate). Centralizing the pattern keeps the three call sites honest.
 */
export async function flushWorldPulsePersist({ result, campaignPersist, persistUpdates, campaignId }) {
  if (!(result && campaignPersist)) return;
  await persistSaveUpdates(persistUpdates);
  await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
}
