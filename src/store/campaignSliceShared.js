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
import { campaigns as campaignService, isCampaignActive } from '../lib/campaigns.js';
import {
  forgetCampaignSync,
  primeCampaignSync,
  syncCampaignChanges,
} from '../lib/campaignSync.js';
import { deepClone } from '../domain/clone.js';

export function cloneJson(value) {
  if (value === undefined || value === null) return value;
  return deepClone(value);
}

/** Unique, sorted channel-type enums from an array of regional impacts. */
export function channelTypesFromImpacts(impacts) {
  const set = new Set();
  for (const impact of Array.isArray(impacts) ? impacts : []) {
    const t = impact?.channelType;
    if (typeof t === 'string' && t) set.add(t);
  }
  return [...set].sort();
}

export function newCampaignId() {
  try {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  } catch {
    // Fallback below.
  }
  // RFC-4122 v4-SHAPED fallback for browsers without crypto.randomUUID. It MUST
  // satisfy isUuid(): a non-UUID id churns identity — migrateCampaign remints it
  // and rowForCampaign omits a non-UUID id on upsert, so every reload mints a
  // fresh duplicate cloud row. Random-filled (not timestamp-only) to stay
  // collision-resistant under rapid creation.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, ch => {
    const r = (Math.random() * 16) | 0;
    return (ch === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
}

export function findActiveCampaign(campaigns, campaignId) {
  const campaign = campaigns.find(item => item.id === campaignId);
  return isCampaignActive(campaign) ? campaign : null;
}

/**
 * Pick which campaign the Realm should auto-resume on entry: the one the user
 * last opened if it still resolves to an active campaign, else the
 * most-recently-updated active campaign (the campaign list arrives ordered
 * updated_at-desc), else null. `activeCampaigns` is the already-filtered list of
 * the user's selectable campaigns. A stale or cross-user lastActiveCampaignId
 * (not in the list) safely falls through to the most-recent campaign.
 */
export function resumeCampaignTarget(activeCampaigns, lastActiveCampaignId) {
  if (!Array.isArray(activeCampaigns) || activeCampaigns.length === 0) return null;
  if (lastActiveCampaignId && activeCampaigns.some(c => c?.id === lastActiveCampaignId)) {
    return lastActiveCampaignId;
  }
  return activeCampaigns[0]?.id || null;
}

export function campaignSettlements(state, campaignId) {
  const c = findActiveCampaign(state.campaigns, campaignId);
  if (!c) return [];
  const ids = new Set(c.settlementIds || []);
  return (state.savedSettlements || []).filter(save => ids.has(save.id));
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

/**
 * Persist a batch of per-save updates, COLLECTING each result. Returns an
 * explicit outcome so the caller can decide whether the campaign snapshot is
 * safe to commit as advanced. `failed` counts the settlement writes that did
 * not land; `ok` is true only when every write succeeded (an empty batch is
 * vacuously ok). persistSaveUpdate never throws and already reports each failure
 * via campaignSyncError, so this only aggregates — it does not re-surface.
 * @param {Array<{saveId:string,settlement?:any,campaignState?:any,versionHistory?:any}>} updates
 * @returns {Promise<{ ok: boolean, total: number, failed: number }>}
 */
export async function persistSaveUpdates(updates = []) {
  let failed = 0;
  for (const update of updates) {
    const okOne = await persistSaveUpdate(update.saveId, {
      settlement: update.settlement,
      campaignState: update.campaignState,
      versionHistory: update.versionHistory,
    });
    if (okOne === false) failed += 1;
  }
  return { ok: failed === 0, total: updates.length, failed };
}

/**
 * Shared persist tail for the world-pulse mutators (advanceCampaignWorld /
 * applyWorldPulseProposal / recordPartyImpact): flush the per-save updates, then
 * sync the campaign snapshot — but ONLY when every settlement write landed. Both
 * awaits run only when the mutator produced state.
 *
 * If any settlement update fails, we must NOT push the campaign snapshot to the
 * cloud as 'advanced': doing so would advance the campaign tick/world graph while
 * a member settlement stayed behind, so a reload would reconstruct a HYBRID
 * timeline. Instead we leave the campaign cloud-pending (the local cache already
 * holds the advance via cacheCampaignState) and surface a retryable failure via
 * campaignSyncError. The cloud campaign row keeps its prior, consistent snapshot,
 * so a reload reconciles to a coherent pre-advance state rather than a hybrid.
 *
 * The INVERSE case — every settlement write lands but the campaign upsert itself
 * rejects — is guarded the same way. syncCampaignSnapshot → syncCampaignChanges
 * re-throws on a rejected upsert; if we let that propagate it escapes the (also
 * unwrapped) await in advanceCampaignWorld, WorldMap catches it and shows "could
 * not advance" — but Phase 2 ALREADY committed and cached the advance locally. The
 * user, told it failed, clicks advance again → a SECOND local tick (a double
 * advance). So we swallow the rejection and surface the honest cloud-pending banner
 * instead, exactly like the forward case: the advance is real locally, only the
 * cloud campaign row is behind.
 *
 * The retry is idempotent: the atomic RPC is id-keyed (last-write-wins on the
 * campaign row + each settlement partial), and the optional stale-tick guard turns
 * a duplicate re-apply of an already-landed tick into a no-op rather than a
 * double-advance, so re-applying the same advance is safe.
 *
 * CLOUD PATH (migration 069): the whole write-set goes through ONE
 * persist_world_pulse_advance call — every affected settlement AND the campaign
 * snapshot in a single DB transaction. A FORWARD partial (settlement A lands, B
 * fails) can no longer leave the cloud hybrid: any failure rolls the entire advance
 * back. HARD DEPENDENCY: 069 must be applied. There is deliberately NO serial-write
 * fallback in cloud mode — re-introducing N upserts would re-open the non-atomic
 * hole. An RPC-missing/error result degrades to the SAME honest cloud-pending state
 * the serial path used: the advance is real locally (already cached), only the
 * cloud is behind, and a retry/reload reconciles.
 *
 * LOCAL PATH (campaigns not configured): there is no cross-row hybrid risk — a
 * single localStorage write covers the whole campaign list and each settlement is
 * its own keyed entry — so the original serial helpers are retained there.
 *
 * BACKWARD WRITES (undo): the forward stale-tick guard advances only when the
 * stored tick is strictly BEHIND the passed expectedTick. An undo restores a PRIOR
 * (LOWER) tick, so passing that lower tick as the guard's expectedTick would make
 * the (higher) cloud tick fail the guard — the RPC would return stale_tick (read
 * as success) and the cloud would NEVER revert, resurrecting the undone advance on
 * reload. An undo is therefore a deliberate LAST-WRITE-WINS write: callers pass
 * `backward: true`, which sends p_expected_tick = NULL so 069 skips the guard and
 * applies the reverted snapshot unconditionally. The FORWARD advance path leaves
 * `backward` falsy and keeps the guard (preventing a double-advance).
 *
 * NON-ADVANCING WRITES (apply proposal / record party impact): these mutate the
 * world + member settlements but DO NOT bump worldState.tick — the snapshot's tick
 * EQUALS the cloud's current tick. Under the forward guard "strictly behind" rule
 * that ties, so the RPC returns stale_tick (read as success) and the write is
 * silently DROPPED — the applied proposal + settlement deltas vanish on reload. Like
 * undo, they are deliberate LAST-WRITE-WINS writes: callers pass `backward: true`
 * (same expectedTick = NULL effect) so the guard is skipped and the write lands.
 */
export async function flushWorldPulsePersist({ result, campaignPersist, persistUpdates, campaignId, backward = false }) {
  if (!(result && campaignPersist)) return { ok: true, savesFailed: 0, campaignSynced: false };

  // ── Cloud: one atomic RPC for the entire advance write-set. ────────────────
  if (typeof campaignService.persistWorldPulseAdvance === 'function') {
    const campaign = (campaignPersist.snapshot || []).find(c => c?.id === campaignId);
    if (!campaign) {
      // The advanced campaign isn't in the snapshot — nothing coherent to persist.
      // Treat as cloud-pending rather than silently dropping the advance.
      try { _reportPersistFailure?.(new Error('campaign missing from snapshot; left cloud-pending')); }
      catch { /* reporting must never throw */ }
      return { ok: false, savesFailed: 0, campaignSynced: false };
    }
    // The stale-apply guard advances only if the stored tick is strictly behind
    // this one; pass the post-advance tick so a duplicate re-apply is a no-op.
    // A BACKWARD (undo) write must NOT be blocked by that forward guard — it
    // restores a LOWER tick the (higher) cloud would always fail. So undo passes
    // expectedTick = null (last-write-wins): 069 skips the guard and applies the
    // reverted snapshot unconditionally, while a forward advance keeps the guard.
    const tick = Number(campaign?.worldState?.tick);
    const expectedTick = backward ? null : (Number.isFinite(tick) ? tick : null);
    try {
      const outcome = await campaignService.persistWorldPulseAdvance({
        campaignId,
        campaign,
        settlementUpdates: Array.isArray(persistUpdates) ? persistUpdates : [],
        expectedTick,
      });
      // A stale_tick no-op (applied:false) splits by write kind:
      //   • BACKWARD / non-advancing (proposal, undo, party impact) pass
      //     expectedTick = null, so the guard is SKIPPED and applied:false can only
      //     mean the cloud already coherently holds this write (an id-keyed retry) —
      //     success, leave it.
      //   • A FORWARD ADVANCE (backward falsy, expectedTick = the post-advance tick)
      //     hitting the guard means the cloud already advanced to/past this tick — a
      //     CONCURRENT same-tick advance (another tab) won the race. THIS tab's
      //     locally-advanced (DIFFERENT) world was NOT written and will be silently
      //     dropped on reload. Surface it as a conflict (cloud-pending + the retryable
      //     banner) so the caller can warn + reload, exactly like a rejected write —
      //     NOT a clean success. The local tick stands; reload reconciles to the
      //     winning timeline.
      //   Intentionally guards on `applied === false` BROADLY, not a specific
      //   reason: for a forward advance, ANY non-applied write means the local
      //   timeline didn't land = a conflict. Narrowing to reason==='stale_tick'
      //   would let an unforeseen applied:false reason fall through to ok:true —
      //   re-opening the silent-drop bug. Fail toward surfacing, never toward a drop.
      if (!backward && outcome && outcome.applied === false) {
        try { _reportPersistFailure?.(new Error('advance conflicted with a concurrent same-tick advance; left cloud-pending')); }
        catch { /* reporting must never throw */ }
        return { ok: false, savesFailed: 0, campaignSynced: false, conflict: true };
      }
    } catch (e) {
      // Any failure — a member not owned, a rejected write, or 069 not applied —
      // rolls the WHOLE advance back in the DB (atomic). Surface the honest
      // cloud-pending banner and let an id-keyed retry/reload reconcile. Do NOT
      // re-throw: a throw escapes the unwrapped await in advanceCampaignWorld and
      // invites a double advance (see the inverse-case note above).
      console.warn('[campaignSlice] atomic world-pulse persist failed; left cloud-pending', e);
      try { _reportPersistFailure?.(e); } catch { /* reporting must never throw */ }
      return { ok: false, savesFailed: 0, campaignSynced: false };
    }
    return { ok: true, savesFailed: 0, campaignSynced: true };
  }

  // ── Local: serial helpers (no cross-row hybrid risk in a single store). ────
  const saveOutcome = await persistSaveUpdates(persistUpdates);
  if (!saveOutcome.ok) {
    try { _reportPersistFailure?.(new Error('settlement save failed; campaign left cloud-pending')); }
    catch { /* reporting must never throw */ }
    return { ok: false, savesFailed: saveOutcome.failed, campaignSynced: false };
  }
  try {
    await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
  } catch (e) {
    console.warn('[campaignSlice] campaign snapshot sync failed; left cloud-pending', e);
    try { _reportPersistFailure?.(e); } catch { /* reporting must never throw */ }
    return { ok: false, savesFailed: 0, campaignSynced: false };
  }
  return { ok: true, savesFailed: 0, campaignSynced: true };
}

/**
 * Phase 4b — persist a CAMPAIGN-MEMBER change-queue COMMIT atomically.
 *
 * A member commit is NOT a tick advance: it applies the settlement-LOCAL change
 * now and DEFERS the regional propagation (parked on worldState.deferredImpacts)
 * to the next Advance. But it still writes a WRITE-SET — the committed settlement
 * row(s) PLUS the campaign snapshot carrying the deferred-impact marker — that
 * must land all-or-nothing, exactly the hazard 069 closes. So in cloud mode this
 * routes the whole write-set through the SAME persist_world_pulse_advance RPC as
 * an advance, with two deliberate differences from the forward-advance call:
 *
 *   • expectedTick = null (R2): a commit must NOT be blocked by the forward
 *     stale-tick guard (the stored tick already equals current, so a forward
 *     guard would reject the write as stale and silently DROP the commit). null
 *     means last-write-wins, the same value undo uses.
 *   • the campaign snapshot does NOT bump worldState.tick — the caller hands the
 *     live (un-advanced) campaign, so the next real Advance's forward guard sees
 *     a truthful, un-inflated tick (R2 second half).
 *
 * R3 (commit-vs-advance race): the RPC's `for update` row lock on the campaign
 * serialises a concurrent advance, and the caller passes a snapshot that is a
 * read-modify-write of ONLY the deferred-impact marker on the LIVE campaign (it
 * never carries a stale full-world copy), so a commit landing after an advance
 * cannot clobber the advanced graph with old data.
 *
 * On failure: NO re-throw — returns { ok:false } so the caller surfaces the
 * honest "saved locally, cloud-pending" state and an id-keyed retry reconciles.
 *
 * In LOCAL mode (campaigns not cloud-configured) the cloud RPC is absent, so this
 * helper OWNS the settlement-row write-set: the campaign-commit caller routes
 * exclusively through here (it does NOT also run the standalone single-row
 * persistSaveUpdate), so we must persist each affected `saves` row ourselves via
 * persistSaveUpdates — otherwise the committed local edit survives only in the
 * in-memory mirror and is lost on reload. The local campaign cache (cacheCampaignState,
 * done by the caller) covers the campaign snapshot + deferred-impact marker.
 *
 * @param {{ campaign: any, settlementUpdates: Array<{saveId:string,settlement?:any,campaignState?:any,versionHistory?:any}> }} args
 * @returns {Promise<{ ok: boolean }>}
 */
export async function persistCampaignLocalCommit({ campaign, settlementUpdates = [] }) {
  if (!campaign || !campaign.id) return { ok: true };
  const updates = Array.isArray(settlementUpdates) ? settlementUpdates : [];
  // Cloud: one atomic RPC for the commit write-set (settlement rows + campaign
  // snapshot), expectedTick = null so the forward guard never drops the commit.
  if (typeof campaignService.persistWorldPulseAdvance === 'function') {
    try {
      await campaignService.persistWorldPulseAdvance({
        campaignId: campaign.id,
        campaign,
        settlementUpdates: updates,
        expectedTick: null,
      });
    } catch (e) {
      console.warn('[campaignSlice] campaign-commit atomic persist failed; left cloud-pending', e);
      try { _reportPersistFailure?.(e); } catch { /* reporting must never throw */ }
      return { ok: false };
    }
    return { ok: true };
  }
  // Local mode: no cloud RPC, and the caller does NOT run its own single-row
  // persist for campaign commits — so persist every affected settlement row here
  // (each savesService.update writes its localStorage row) or the edit is lost on
  // reload. The caller's cacheCampaignState covers the campaign snapshot.
  const saveOutcome = await persistSaveUpdates(updates);
  return { ok: saveOutcome.ok };
}
