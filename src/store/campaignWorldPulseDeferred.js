/**
 * campaignWorldPulseDeferred — low-frequency World Pulse mutation bodies.
 *
 * campaignWorldPulseSlice owns the eager public actions. It performs every
 * cheap synchronous guard before the first await, captures the account/session
 * fence, and loads this module only after an action has real work to do. This
 * module owns the post-load orchestration: revalidate the captured session,
 * resolve any heavier domain or telemetry dependency, mutate the shared Immer
 * store, and persist the snapshot produced by that exact mutation.
 *
 * That split is architectural, not cosmetic. None of the simulation profile,
 * proposal, party-impact, regional, or spatial graphs below may enter the
 * anonymous first-paint closure. Conversely, a lazy import is an async boundary:
 * every body must recheck `isSessionCurrent` before it reads or writes owner data.
 * Workflows that also conflict with a running/paused advance repeat those guards
 * after loading, because the campaign can enter either state while the chunk is
 * in flight.
 *
 * Return shapes remain the public slice contract. Session changes therefore map
 * to each action's established no-op shape (`null`, `false`, or a typed result)
 * instead of introducing a shared normalized result envelope.
 */
import {
  ensureRegionalGraph,
  ensureWizardNewsFeed,
} from '../domain/region/index.js';
import {
  canonizeWorldState,
  ensureWorldState,
  updateProposalStatus,
} from '../domain/worldPulse/worldState.js';
import { normalizeSimulationRules } from '../domain/worldPulse/simulationRules.js';
import {
  contentRuntimeFromCampaignBinding,
} from '../domain/content/contentEnvironment.js';
import {
  cloneJson,
  cacheCampaignState,
  syncCampaignSnapshot,
  flushWorldPulsePersist,
  findActiveCampaign,
  campaignSettlements,
  captureCampaignSession,
  isCurrentCampaignSession,
  parkedIntervalUndoSnapshot,
} from './campaignSliceShared.js';
import {
  applyWorldPulseResultToState,
  capturePulseSnapshot,
} from './campaignPulseHelpers.js';
import { track, EVENTS } from '../lib/analytics.js';
import { extractRegionalGraphSnapshot } from '../lib/regionalFingerprint.js';

const AUTH_SESSION_CHANGED_RESULT = Object.freeze({
  ok: false,
  reason: 'auth_session_changed',
});

// ── Read-only preview + delegated canon/ripple sessions ────────────────────

/**
 * Build a read-only pulse preview from the campaign snapshot captured by the
 * eager wrapper. The wrapper handles not-found/frozen checks synchronously; this
 * body fences the captured snapshot after the heavy preview module has loaded.
 *
 * @param {{
 *   state: any,
 *   campaign: any,
 *   campaignId: string,
 *   interval: string,
 *   options: { simulationRules?: any, now?: string|number },
 *   isSessionCurrent: () => boolean,
 * }} args
 * @returns {Promise<any|null>} The domain preview, or null when ownership changed.
 */
export async function runPreviewCampaignWorldPulse({
  state,
  campaign,
  campaignId,
  interval,
  options,
  isSessionCurrent,
}) {
  const { previewCampaignWorldPulse } = await import(
    '../domain/worldPulse/advanceCampaignWorld.js'
  );
  // `state` and `campaign` were captured before the import. Never consume that
  // owner-scoped snapshot after auth has replaced the store beneath the action.
  if (!isSessionCurrent()) return null;
  const previewCampaign = cloneJson(campaign);
  if (options.simulationRules) {
    previewCampaign.worldState = {
      ...(previewCampaign.worldState || {}),
      simulationRules: normalizeSimulationRules(options.simulationRules),
    };
  }
  const settlements = campaignSettlements(state, campaignId);
  const contentRuntime = contentRuntimeFromCampaignBinding(
    previewCampaign.contentBinding,
  );
  const preview = previewCampaignWorldPulse({
    campaign: previewCampaign,
    saves: cloneJson(settlements),
    interval,
    now: typeof options.now === 'number'
      ? new Date(options.now).toISOString()
      : options.now,
    customContent: contentRuntime.customContent,
  });
  track(EVENTS.WORLD_PULSE_PREVIEWED, {
    interval,
    settlement_count: settlements.length,
    proposal_count: Array.isArray(preview?.proposals) ? preview.proposals.length : 0,
  });
  return preview;
}

/**
 * Cross the deferred-mutation boundary into the spatial canon session.
 *
 * Entitlement, generated-map, and initial advance/pause guards stay synchronous
 * in the eager wrapper. The advance/pause checks repeat after this import because
 * the campaign may have entered an interval while the chunk was loading.
 *
 * @param {{
 *   set: Function,
 *   get: Function,
 *   campaignId: string,
 *   options: {
 *     captureSpatialPack?: (ctx:{campaignId:string, get:Function}) =>
 *       Promise<{pack:any, placements:Array<{id:any,cellId:any}>}|null>,
 *   },
 *   sessionFence: any,
 *   isSessionCurrent: () => boolean,
 * }} args
 * @returns {Promise<{
 *   ok: boolean,
 *   reason?: string,
 *   spatialCanonVersion?: number,
 *   digestBytes?: number,
 * }>}
 */
export async function runCanonizeCampaignWorldSpatial({
  set,
  get,
  campaignId,
  options,
  sessionFence,
  isSessionCurrent,
}) {
  const { runSpatialCanonize } = await import('./campaignSpatialCanonize.js');
  // The lazy load yielded. Revalidate both owner and mutation exclusivity at the
  // last boundary this bridge owns before the spatial session captures the map.
  if (!isSessionCurrent()) return AUTH_SESSION_CHANGED_RESULT;
  if (get().isAdvanceInFlight(campaignId)) {
    return { ok: false, reason: 'advance_in_flight' };
  }
  if (get().getPausedAdvance(campaignId)) {
    return { ok: false, reason: 'advance_paused' };
  }
  return runSpatialCanonize({
    set,
    get,
    campaignId,
    options,
    sessionFence,
    isSessionCurrent,
  });
}

/**
 * Delegate a non-party canon relationship event to its heavier lazy session.
 * The relationship session owns its orphan guard, atomic graph/world mutation,
 * and snapshot persist; this bridge owns the surrounding auth-session fence.
 *
 * @param {{
 *   set: Function,
 *   campaignId: string,
 *   event: any,
 *   homeId: string|number,
 *   now?: string|null,
 *   isSessionCurrent: () => boolean,
 * }} args
 * @returns {Promise<any|{ok:false, reason:string}>}
 */
export async function runRecordCanonRelationshipRipple({
  set,
  campaignId,
  event,
  homeId,
  now,
  isSessionCurrent,
}) {
  const { runRecordCanonRelationshipRipple: record } = await import(
    './campaignCanonRelationshipSession.js'
  );
  // Do not hand owner A's event to the relationship session after the store has
  // moved to owner B. Recheck again after its persistence await before returning.
  if (!isSessionCurrent()) return AUTH_SESSION_CHANGED_RESULT;
  const result = await record({ set, campaignId, event, homeId, now });
  return isSessionCurrent() ? result : AUTH_SESSION_CHANGED_RESULT;
}

/**
 * Restore a canon relationship edge from its undo snapshot through the same
 * lazy session as the forward ripple. The eager wrapper validates the snapshot
 * and blocks an in-flight advance; this bridge preserves the owner fence across
 * the delegated mutation and persistence await.
 *
 * @param {{
 *   set: Function,
 *   campaignId: string,
 *   snapshot: any,
 *   now?: string|null,
 *   isSessionCurrent: () => boolean,
 * }} args
 * @returns {Promise<any|{ok:false, reason:string}>}
 */
export async function runReverseCanonRelationshipRipple({
  set,
  campaignId,
  snapshot,
  now,
  isSessionCurrent,
}) {
  const { runReverseCanonRelationshipRipple: reverse } = await import(
    './campaignCanonRelationshipSession.js'
  );
  // The nested lazy import is another owner boundary; the caller's synchronous
  // guard alone cannot authorize work after it resolves.
  if (!isSessionCurrent()) return AUTH_SESSION_CHANGED_RESULT;
  const result = await reverse({ set, campaignId, snapshot, now });
  return isSessionCurrent() ? result : AUTH_SESSION_CHANGED_RESULT;
}

// ── Canon state + simulation control profile ───────────────────────────────

/**
 * Canonize the campaign world, optionally projecting the active settlement
 * layouts into the spatial substrate sidecar when that control is enabled.
 *
 * Realm-shape analytics and spatial derivation are best-effort enrichments:
 * neither may block the authoritative canon write. The owner/session fence and
 * advance/pause guards, by contrast, are authoritative and fail closed.
 *
 * @param {{
 *   set: Function,
 *   get: Function,
 *   campaignId: string,
 *   isSessionCurrent: () => boolean,
 * }} args
 * @returns {Promise<any|null>} The persisted world state, or null on a no-op.
 */
export async function runCanonizeCampaignWorld({
  set,
  get,
  campaignId,
  isSessionCurrent,
}) {
  if (!isSessionCurrent()) return null;
  let realmShape = null;
  // Resolve optional telemetry before entering the Immer producer so it can
  // flatten the live draft into plain values without joining the eager bundle.
  try {
    ({ realmShape } = await import('../lib/constructionUsage.js'));
  } catch {
    // Optional telemetry must never block canonization.
  }
  if (!isSessionCurrent()) return null;

  let spatialSubstrate = /** @type {any} */ (null);
  const campaignAtLoad = findActiveCampaign(get().campaigns, campaignId);
  const rules = /** @type {any} */ (campaignAtLoad?.worldState)?.simulationRules;
  if (rules?.spatialConsequenceEnabled === true) {
    // Spatial consequence is a projection of the active layouts at canon time.
    // A dark world neither loads the derivation graph nor materializes the key.
    try {
      const { deriveCampaignSubstrates } = await import('../lib/spatialSubstrateDerive.js');
      if (!isSessionCurrent()) return null;
      const prior = /** @type {any} */ (campaignAtLoad?.worldState)
        ?.spatialLedgers?.spatialSubstrate ?? null;
      spatialSubstrate = deriveCampaignSubstrates(
        campaignSettlements(get(), campaignId),
        prior,
      );
    } catch {
      // Spatial substrate is optional; the ordinary canonization still lands.
    }
  }

  // Optional imports above yielded. Recheck owner and interval exclusivity at
  // the actual write boundary so a late advance cannot overwrite this canon.
  if (!isSessionCurrent()) return null;
  if (get().isAdvanceInFlight(campaignId) || get().getPausedAdvance(campaignId)) {
    return null;
  }

  let campaignPersist = /** @type {any} */ (null);
  let settlementCount = 0;
  let regionalSnapshot = /** @type {any} */ (null);
  let realmShapeSummary = /** @type {any} */ (null);
  const now = new Date().toISOString();
  // Canon state and the cached persistence snapshot are minted in one producer;
  // the async persist below must send this exact post-mutation snapshot.
  set(state => {
    const campaign = findActiveCampaign(state.campaigns, campaignId);
    if (!campaign) return;
    const saves = campaignSettlements(state, campaignId);
    settlementCount = saves.length;
    campaign.worldState = canonizeWorldState(campaign.worldState, now, campaign);
    // No derived substrate means no spatialLedgers write: the disabled path
    // remains byte-identical to ordinary canonization.
    if (spatialSubstrate) {
      campaign.worldState = /** @type {any} */ ({
        ...(/** @type {any} */ (campaign.worldState)),
        spatialLedgers: {
          ...(/** @type {any} */ (campaign.worldState).spatialLedgers || {}),
          spatialSubstrate,
        },
      });
    }
    // Flatten draft-backed topology values before Immer revokes the producer.
    regionalSnapshot = extractRegionalGraphSnapshot(campaign.regionalGraph);
    if (realmShape) realmShapeSummary = realmShape(campaign.regionalGraph, saves);
    campaign.updatedAt = now;
    campaignPersist = cacheCampaignState(state);
  });

  if (campaignPersist) {
    // Analytics describes the committed snapshot. Persistence remains the
    // authoritative awaited effect and carries the same session fence.
    track(
      EVENTS.WORLD_CANONIZED,
      { settlement_count: settlementCount, ...(realmShapeSummary || {}) },
      { subjectId: campaignId },
    );
    if (regionalSnapshot) track(EVENTS.REGIONAL_GRAPH_SNAPSHOT, regionalSnapshot);
    await syncCampaignSnapshot(
      campaignPersist.snapshot,
      campaignId,
      campaignPersist,
      isSessionCurrent,
    );
    if (!isSessionCurrent()) return null;
  }
  return campaignPersist?.snapshot
    ?.find(campaign => campaign.id === campaignId)
    ?.worldState || null;
}

/**
 * Merge and canonicalize a simulation-rules patch, append any ruleset receipt
 * and Wizard News entry produced by the control layer, then persist atomically.
 *
 * @param {{
 *   set: Function,
 *   get: Function,
 *   campaignId: string,
 *   patch: Record<string, any>,
 *   isSessionCurrent: () => boolean,
 * }} args
 * @returns {Promise<any|null>} The persisted canonical rules, or null on a no-op.
 */
export async function runUpdateCampaignSimulationRules({
  set,
  get,
  campaignId,
  patch,
  isSessionCurrent,
}) {
  if (!isSessionCurrent()) return null;
  const [{ prepareRulesUpdate }, { extractSimulationRules }] = await Promise.all([
    import('../domain/worldPulse/simulationProfile.js'),
    import('../lib/pulseFingerprint.js'),
  ]);
  // Rules/profile imports yield. Repeat every guard that protects the wholesale
  // worldState commit before preparing or writing from the now-current campaign.
  if (!isSessionCurrent()) return null;
  if (get().isAdvanceInFlight(campaignId) || get().getPausedAdvance(campaignId)) {
    return null;
  }

  let campaignPersist = /** @type {any} */ (null);
  let normalizedRules = /** @type {any} */ (null);
  const now = new Date().toISOString();
  // `prepareRulesUpdate` is the single normalization/receipt choke point. Keep
  // its plain result and the persistence snapshot inside one atomic store write.
  set(state => {
    const campaign = findActiveCampaign(state.campaigns, campaignId);
    if (!campaign) return;
    const worldState = ensureWorldState(campaign.worldState, campaign);
    const prepared = prepareRulesUpdate(
      worldState,
      patch || {},
      campaign.wizardNews,
      now,
    );
    normalizedRules = prepared.canonical;
    campaign.worldState = prepared.nextWorldState;
    if (prepared.nextWizardNews) campaign.wizardNews = prepared.nextWizardNews;
    campaign.updatedAt = now;
    campaignPersist = cacheCampaignState(state);
  });

  if (campaignPersist) {
    // Emit canonical values (not only changed keys), then persist the same cached
    // snapshot. The session callback prevents a stale owner write after the await.
    track(
      EVENTS.SIMULATION_RULES_UPDATED,
      extractSimulationRules(normalizedRules, Object.keys(patch || {})),
    );
    await syncCampaignSnapshot(
      campaignPersist.snapshot,
      campaignId,
      campaignPersist,
      isSessionCurrent,
    );
    if (!isSessionCurrent()) return null;
  }
  return campaignPersist?.snapshot
    ?.find(campaign => campaign.id === campaignId)
    ?.worldState?.simulationRules || null;
}

// ── Session-scoped pulse undo ──────────────────────────────────────────────

// R-1 proposal-undo ring (carried from R-0, queue #5): the per-campaign cap on
// retained pre-APPLY snapshots. Deliberately its own small constant, NOT the
// advance stack's PULSE_UNDO_CAP: proposal snapshots live in the SEPARATE
// `proposalUndoStack` array, so proposal traffic is structurally incapable of
// evicting a pre-advance snapshot (the R-0 cap-flood finding). 5 because the
// ring covers the adjudication desk's "wrong click" window — applies land in
// bursts (up to 80 pending proposals), each snapshot deep-clones the campaign
// world + every member save, and deeper time travel is the advance ring's job.
export const PROPOSAL_UNDO_CAP = 5;

/** Per-campaign LOGICAL advance depth — the clock-independent happens-before
 *  between the two undo rings. A proposal entry stamps this at push; it is
 *  restorable only while the campaign's advance depth still EQUALS its stamp
 *  (an advance landing after the apply raises the depth; undoing the advance
 *  either restores the stamp's depth or prunes the entry as a stale future).
 *
 *  R-1 MUST-FIX (ring-guard saturation): this MUST read the session counter
 *  `advanceSeqByCampaign`, never a count of RETAINED pulseUndoStack entries.
 *  The advance body caps retention at PULSE_UNDO_CAP with oldest-eviction, so a
 *  retained-entry count saturates at the cap: after the cap-th advance every
 *  further advance left the "depth" unchanged and the coherence guard below
 *  passed STALE proposal snapshots (a pre-apply world restored over newer
 *  advances). The counter is incremented by the advance push site itself and is
 *  untouched by eviction; runUndoLastPulse decrements it as it pops, so the
 *  legitimate newest-act-first walk (undo the advance, then the apply) keeps
 *  working. Pre-saturation the two definitions agree exactly. */
function advanceDepthOf(state, campaignId) {
  return Number(state.advanceSeqByCampaign?.[String(campaignId)]) || 0;
}

/**
 * Restore one full pre-pulse/pre-apply snapshot onto the Immer draft: the
 * campaign world unit (worldState + regionalGraph + wizardNews), every member
 * save the snapshot carries, and the live active view when it belongs to this
 * campaign. Shared chokepoint for BOTH undo verbs (advance + proposal) so their
 * restore semantics can never drift. Mutates `state`/`campaign`, appends the
 * save writes to `persistUpdates`, returns nothing.
 */
function restorePulseSnapshotOnDraft(state, campaign, snapshot, stamp, persistUpdates) {
  // Campaign world, topology, and news are one undo unit.
  campaign.worldState = ensureWorldState(snapshot.worldState, campaign);
  campaign.regionalGraph = ensureRegionalGraph(snapshot.regionalGraph, { now: stamp });
  campaign.wizardNews = ensureWizardNewsFeed(snapshot.wizardNews, { now: stamp });
  campaign.updatedAt = stamp;

  const memberIds = new Set((campaign.settlementIds || []).map(String));
  // Membership is read at undo time. A save detached since the snapshot must
  // not be silently rewound by an older campaign snapshot.
  for (const saved of snapshot.saves || []) {
    if (!memberIds.has(String(saved.id))) continue;
    const savedIndex = state.savedSettlements
      .findIndex(item => String(item.id) === String(saved.id));
    if (savedIndex === -1) continue;
    const restoredSettlement = cloneJson(saved.settlement);
    const restoredCampaignState = cloneJson(saved.campaignState);
    state.savedSettlements[savedIndex] = {
      ...state.savedSettlements[savedIndex],
      settlement: restoredSettlement,
      campaignState: restoredCampaignState,
      timestamp: stamp,
    };
    persistUpdates.push({
      saveId: saved.id,
      settlement: cloneJson(restoredSettlement),
      campaignState: cloneJson(restoredCampaignState),
    });
  }

  if (state.activeSaveId != null) {
    // Rehydrate only a live view that belongs to this campaign, including a
    // different member opened after the snapshot was taken.
    if (snapshot.active && String(state.activeSaveId) === snapshot.active.saveId) {
      state.settlement = cloneJson(snapshot.active.settlement);
      state.systemState = cloneJson(snapshot.active.systemState);
      state.eventLog = cloneJson(snapshot.active.eventLog);
      state.phase = snapshot.active.phase;
      state.editedAt = stamp;
    } else {
      const activeSnapshot = (snapshot.saves || [])
        .find(saved => String(saved.id) === String(state.activeSaveId));
      if (activeSnapshot && memberIds.has(String(activeSnapshot.id))) {
        const campaignState = activeSnapshot.campaignState || {};
        state.settlement = cloneJson(activeSnapshot.settlement);
        state.systemState = campaignState.systemState != null
          ? cloneJson(campaignState.systemState)
          : null;
        state.eventLog = Array.isArray(campaignState.eventLog)
          ? cloneJson(campaignState.eventLog)
          : [];
        state.phase = campaignState.phase || state.phase;
        state.editedAt = stamp;
      }
    }
  }
}

/**
 * Restore the newest pre-pulse snapshot for one campaign, including its world,
 * member saves, and whichever member is currently projected into the live view.
 * Detached saves and an active view from another campaign remain untouched.
 *
 * TWO SNAPSHOT SOURCES (R-5b), in precedence order:
 *   1. the session `pulseUndoStack` — the normal path, unchanged: pop the newest
 *      entry for this campaign so repeated calls walk back tick by tick.
 *   2. the pre-INTERVAL snapshot parked on a PAUSED advance's cursor
 *      (`worldState.pausedAdvance.preIntervalUndo`), used ONLY when the stack
 *      holds nothing for this campaign — i.e. after a reload into a paused
 *      interval, where the session stack is gone but the campaign record (and so
 *      the cursor) rehydrated. Restoring it is the documented ABANDON path: the
 *      parked snapshot predates the interval, and an advance cannot start while a
 *      pause is parked, so its worldState carries no pausedAdvance — writing it
 *      back is exactly what clears the pause. Nothing is popped on this path
 *      (there is no stack entry) and the session advance-depth counter is left
 *      alone (a reloaded session starts it at 0).
 * An old-shape cursor with no parked snapshot yields null and this returns false,
 * which is the pre-change behaviour, typed honestly rather than half-restored.
 *
 * @param {{
 *   set: Function,
 *   get: Function,
 *   campaignId: string,
 *   isSessionCurrent: () => boolean,
 * }} args
 * @returns {Promise<boolean>} True only when a snapshot was restored and persisted.
 */
export async function runUndoLastPulse({
  set,
  get,
  campaignId,
  isSessionCurrent,
}) {
  if (!isSessionCurrent() || get().isAdvanceInFlight(campaignId)) return false;
  const persistUpdates = [];
  let campaignPersist = null;
  let didUndo = false;
  // Restore every coupled store projection and capture its persistence work in
  // one producer; partial in-memory rollback would leave broken joins.
  set(state => {
    const stack = state.pulseUndoStack || [];
    let index = -1;
    for (let i = stack.length - 1; i >= 0; i -= 1) {
      if (stack[i].campaignId === campaignId) {
        index = i;
        break;
      }
    }
    const campaign = findActiveCampaign(state.campaigns, campaignId);
    if (!campaign) return;
    // Source 2 (R-5b) only when the session stack has nothing for this campaign.
    // cloneJson FIRST: the parked snapshot is an Immer draft proxy of a sub-tree of
    // campaign.worldState, and restorePulseSnapshotOnDraft REPLACES that worldState
    // — reading the source through the proxy afterwards would be reading the tree it
    // just overwrote (and the proxy is revoked when this producer returns).
    const parked = index === -1 ? parkedIntervalUndoSnapshot(campaign) : null;
    const snapshot = index === -1 ? (parked ? cloneJson(parked) : null) : stack[index];
    if (!snapshot) return;
    const stamp = new Date().toISOString();
    restorePulseSnapshotOnDraft(state, campaign, snapshot, stamp, persistUpdates);

    if (index !== -1) {
      // Pop exactly the restored entry; older snapshots remain for stepwise undo.
      state.pulseUndoStack = stack.filter((_, i) => i !== index);
      // R-1 MUST-FIX: the pop lowers the campaign's LOGICAL advance depth by one
      // (the push site raised it by one). Floor at 0 defensively; production
      // pairing is exact because only retained entries are poppable and every
      // retained entry incremented the counter when it was pushed.
      if (!state.advanceSeqByCampaign) state.advanceSeqByCampaign = {};
      state.advanceSeqByCampaign[String(campaignId)] = Math.max(
        0,
        (Number(state.advanceSeqByCampaign[String(campaignId)]) || 0) - 1,
      );
    }
    // R-1 ring coherence: proposal snapshots captured AFTER this restore point
    // (their stamped advance depth exceeds the depth left by the pop) describe
    // futures that no longer exist — restoring one later would fast-forward the
    // world. Drop them; entries captured before the popped advance stay valid.
    // This same-producer prune is also what makes the depth counter ABA-safe:
    // nothing stamped deeper than the restored depth survives to see a later
    // re-advance land on the same number.
    if (state.proposalUndoStack?.length) {
      const depth = advanceDepthOf(state, campaignId);
      state.proposalUndoStack = state.proposalUndoStack.filter(entry =>
        String(entry.campaignId) !== String(campaignId)
        || (entry.advanceDepth ?? 0) <= depth);
    }
    campaignPersist = cacheCampaignState(state);
    didUndo = true;
  });

  // Campaign and settlement writes are flushed as one persistence operation.
  // The shared helper checks the owner fence around its awaited work.
  await flushWorldPulsePersist({
    result: didUndo,
    campaignPersist,
    persistUpdates,
    campaignId,
    isSessionCurrent,
  });
  return isSessionCurrent() ? didUndo : false;
}

/**
 * R-1 (queue #5): reverse the most recent APPLIED world-pulse proposal for this
 * campaign, restoring the campaign world + member saves + the live view from
 * the pre-apply snapshot on the session proposal-undo ring. The restored world
 * carries the proposal back in `pending`, so it returns to the adjudication
 * desk. The advance stack is never read for restore and never written here.
 *
 * @param {{
 *   set: Function,
 *   get: Function,
 *   campaignId: string,
 *   isSessionCurrent: () => boolean,
 * }} args
 * @returns {Promise<boolean>} True only when a snapshot was restored and persisted.
 */
export async function runUndoLastProposalApply({
  set,
  get,
  campaignId,
  isSessionCurrent,
}) {
  if (!isSessionCurrent() || get().isAdvanceInFlight(campaignId)) return false;
  // A parked interval recommits worldState wholesale on resume, so a proposal
  // restore written into the parked window would be silently replaced.
  // (undoLastPulse stays the documented abandon path for a pause; this is not.)
  if (get().getPausedAdvance(campaignId)) return false;
  const persistUpdates = [];
  let campaignPersist = null;
  let didUndo = false;
  // Same one-producer discipline as runUndoLastPulse: every coupled projection
  // restores atomically or not at all.
  set(state => {
    const ring = state.proposalUndoStack || [];
    let index = -1;
    for (let i = ring.length - 1; i >= 0; i -= 1) {
      if (String(ring[i].campaignId) === String(campaignId)) {
        index = i;
        break;
      }
    }
    if (index === -1) return;
    const snapshot = ring[index];
    // Owner fence, stamped at push time: an entry minted under another
    // account/session (same-UUID campaigns exist across accounts) must never
    // restore here. The advance stack gets this from clearTransientCampaignWork
    // at the auth boundary; the ring carries its own stamp so the defense is
    // structural rather than dependent on an out-of-slice cleanup.
    if (!isCurrentCampaignSession(state, snapshot.session)) return;
    // Ring coherence: this snapshot is restorable only while the campaign's
    // advance depth still equals its stamp. A deeper stack means an advance
    // landed after the apply — restoring the pre-apply world under it would
    // silently rewind that advance while leaving its own undo entry behind.
    // Undo the advance first (which restores the stamp's depth) and this
    // entry becomes poppable again; newest-act-first is the only coherent walk.
    if (advanceDepthOf(state, campaignId) !== (snapshot.advanceDepth ?? 0)) return;
    const campaign = findActiveCampaign(state.campaigns, campaignId);
    if (!campaign) return;
    const stamp = new Date().toISOString();
    restorePulseSnapshotOnDraft(state, campaign, snapshot, stamp, persistUpdates);

    // Pop exactly the restored entry; older proposal snapshots remain for a
    // stepwise walk-back. pulseUndoStack is untouched by construction.
    state.proposalUndoStack = ring.filter((_, i) => i !== index);
    campaignPersist = cacheCampaignState(state);
    didUndo = true;
  });

  // Campaign and settlement writes are flushed as one persistence operation.
  await flushWorldPulsePersist({
    result: didUndo,
    campaignPersist,
    persistUpdates,
    campaignId,
    isSessionCurrent,
  });
  return isSessionCurrent() ? didUndo : false;
}

// ── Proposals + authoritative actor inputs ─────────────────────────────────

/**
 * Apply one pending World Pulse proposal, commit its campaign/save effects, and
 * record the DM's decision telemetry from a plain value captured in the producer.
 *
 * @param {{
 *   set: Function,
 *   get: Function,
 *   campaignId: string,
 *   proposalId: string,
 *   isSessionCurrent: () => boolean,
 * }} args
 * @returns {Promise<any|null>} The applied pulse result, or null on a no-op.
 */
export async function runApplyWorldPulseProposal({
  set,
  get,
  campaignId,
  proposalId,
  isSessionCurrent,
}) {
  const [
    { applyWorldPulseProposal },
    { extractProposalDecision },
  ] = await Promise.all([
    import('../domain/worldPulse/applyWorldPulse.js'),
    import('../lib/pulseFingerprint.js'),
  ]);
  // Both imports yield. An advance, pause, or auth replacement may have started
  // after the eager wrapper's guards, so authorize again before mutation.
  if (!isSessionCurrent()) return null;
  if (get().isAdvanceInFlight(campaignId) || get().getPausedAdvance(campaignId)) {
    return null;
  }

  let result = /** @type {any} */ (null);
  let persistUpdates = [];
  let campaignPersist = /** @type {any} */ (null);
  let appliedDecision = /** @type {any} */ (null);
  const now = new Date().toISOString();
  // Compute the domain result from clones, then land all campaign/save effects
  // and capture the exact persistence snapshot in one producer.
  set(state => {
    const campaign = findActiveCampaign(state.campaigns, campaignId);
    if (!campaign) return;
    const proposal = (campaign.worldState?.proposals || [])
      .find(item => item.id === proposalId) || null;
    // Flatten proposal telemetry while its Immer draft is still valid.
    appliedDecision = extractProposalDecision(proposal, 'applied');
    result = applyWorldPulseProposal({
      campaign: cloneJson(campaign),
      saves: cloneJson(campaignSettlements(state, campaignId)),
      proposalId,
      now,
    });
    if (!result) return;
    // R-1 REAL ARMING (queue #5): capture the pre-APPLY world before the
    // effects land on the draft, for the SEPARATE session proposal-undo ring.
    // The entry stamps the campaign's current advance depth (the cross-ring
    // happens-before) and the owner/session fence (a snapshot minted under one
    // account must never restore into a same-UUID campaign of another).
    // A refused apply returned above, so a no-op never mints a phantom entry.
    const undoEntry = {
      ...capturePulseSnapshot(state, campaign, now),
      kind: 'proposal',
      proposalId,
      headline: proposal?.headline || null,
      advanceDepth: advanceDepthOf(state, campaignId),
      session: captureCampaignSession(state),
    };
    persistUpdates = applyWorldPulseResultToState(state, campaign, result, now);
    // Push onto the ring, capped PER campaign: drop only this campaign's
    // oldest PROPOSAL snapshot. The advance stack is a different array and is
    // never written here — separation by construction, not by discipline.
    const ring = [...(state.proposalUndoStack || []), undoEntry];
    const mine = ring.reduce(
      (n, s) => n + (String(s.campaignId) === String(campaignId) ? 1 : 0), 0);
    if (mine > PROPOSAL_UNDO_CAP) {
      const oldest = ring.findIndex(s => String(s.campaignId) === String(campaignId));
      if (oldest !== -1) ring.splice(oldest, 1);
    }
    state.proposalUndoStack = ring;
    campaignPersist = cacheCampaignState(state);
  });

  if (result && campaignPersist) {
    track(
      EVENTS.WORLD_PULSE_PROPOSAL_APPLIED,
      appliedDecision,
      { subjectId: campaignId },
    );
  }
  // Flush both campaign and member-save effects before exposing success.
  await flushWorldPulsePersist({
    result,
    campaignPersist,
    persistUpdates,
    campaignId,
    isSessionCurrent,
  });
  return isSessionCurrent() ? result : null;
}

/**
 * Mint a DM realm verb as a pending proposal, then land the returned pulse
 * result through the same campaign/save persistence path as organic proposals.
 *
 * @param {{
 *   set: Function,
 *   get: Function,
 *   campaignId: string,
 *   verb: string,
 *   args: any,
 *   isSessionCurrent: () => boolean,
 * }} args
 * @returns {Promise<any|{ok:false, code:string}>}
 */
export async function runStageRealmVerb({
  set,
  get,
  campaignId,
  verb,
  args,
  isSessionCurrent,
}) {
  const { mintRealmVerbProposal } = await import('../domain/worldPulse/applyWorldPulse.js');
  // Recheck the synchronous wrapper guards after loading the proposal machinery.
  if (!isSessionCurrent()) return { ok: false, code: 'auth_session_changed' };
  if (get().isAdvanceInFlight(campaignId)) {
    return { ok: false, code: 'advance_in_flight' };
  }
  if (get().getPausedAdvance(campaignId)) {
    return { ok: false, code: 'advance_paused' };
  }

  let result = /** @type {any} */ (null);
  let persistUpdates = [];
  let campaignPersist = /** @type {any} */ (null);
  const now = new Date().toISOString();
  // A successful mint is applied atomically to every affected store projection.
  set(state => {
    const campaign = findActiveCampaign(state.campaigns, campaignId);
    if (!campaign) return;
    result = mintRealmVerbProposal({
      campaign: cloneJson(campaign),
      saves: cloneJson(campaignSettlements(state, campaignId)),
      verb,
      args,
      now,
    });
    if (!result?.ok) return;
    persistUpdates = applyWorldPulseResultToState(
      state,
      campaign,
      result.result,
      now,
    );
    campaignPersist = cacheCampaignState(state);
  });
  // Persistence owns the final session check; return the action's established
  // code-shaped auth failure if ownership changes while it is awaited.
  await flushWorldPulsePersist({
    result: result?.ok ? result.result : null,
    campaignPersist,
    persistUpdates,
    campaignId,
    isSessionCurrent,
  });
  return isSessionCurrent()
    ? result
    : { ok: false, code: 'auth_session_changed' };
}

/**
 * Apply an authoritative party action to the campaign simulation and persist
 * every resulting campaign/save projection. Internal advance replay may call
 * this while the campaign is marked in flight; the eager wrapper distinguishes
 * that path from a user action attempted during a parked pause.
 *
 * @param {{
 *   set: Function,
 *   campaignId: string,
 *   action: any,
 *   isSessionCurrent: () => boolean,
 * }} args
 * @returns {Promise<any|{ok:false, reason:string}>}
 */
export async function runRecordPartyImpact({
  set,
  campaignId,
  action,
  isSessionCurrent,
}) {
  const [
    { applyPartyImpact },
    { extractPartyImpact },
  ] = await Promise.all([
    import('../domain/worldPulse/partyImpact.js'),
    import('../lib/pulseFingerprint.js'),
  ]);
  // The domain and telemetry imports yield; do not let a stale owner reach set().
  if (!isSessionCurrent()) return AUTH_SESSION_CHANGED_RESULT;

  let result = /** @type {any} */ (null);
  let persistUpdates = [];
  let campaignPersist = /** @type {any} */ (null);
  const now = new Date().toISOString();
  // Compute from clones and commit the world plus all affected saves together.
  set(state => {
    const campaign = findActiveCampaign(state.campaigns, campaignId);
    if (!campaign) return;
    result = applyPartyImpact({
      campaign: cloneJson(campaign),
      saves: cloneJson(campaignSettlements(state, campaignId)),
      action,
      now,
    });
    if (!result) return;
    persistUpdates = applyWorldPulseResultToState(state, campaign, result, now);
    campaignPersist = cacheCampaignState(state);
  });

  if (result && campaignPersist) {
    track(EVENTS.PARTY_IMPACT_RECORDED, {
      action_type: action?.kind || 'unknown',
      ...extractPartyImpact(action, result),
    });
  }
  // Await the full campaign/save flush before returning the authoritative result.
  await flushWorldPulsePersist({
    result,
    campaignPersist,
    persistUpdates,
    campaignId,
    isSessionCurrent,
  });
  return isSessionCurrent() ? result : AUTH_SESSION_CHANGED_RESULT;
}

/**
 * Mark one proposal dismissed, capture plain decision telemetry before Immer
 * revokes the draft, and persist the resulting campaign snapshot.
 *
 * @param {{
 *   set: Function,
 *   get: Function,
 *   campaignId: string,
 *   proposalId: string,
 *   isSessionCurrent: () => boolean,
 * }} args
 * @returns {Promise<any|null>} The dismissed proposal, or null on a no-op.
 */
export async function runDismissWorldPulseProposal({
  set,
  get,
  campaignId,
  proposalId,
  isSessionCurrent,
}) {
  const { extractProposalDecision } = await import('../lib/pulseFingerprint.js');
  // The telemetry import yields. Repeat owner and interval guards before writing.
  if (!isSessionCurrent()) return null;
  if (get().isAdvanceInFlight(campaignId) || get().getPausedAdvance(campaignId)) {
    return null;
  }

  let proposal = /** @type {any} */ (null);
  let dismissDecision = /** @type {any} */ (null);
  let campaignPersist = /** @type {any} */ (null);
  // Proposal status, timestamp, telemetry projection, and cached snapshot are one
  // producer so no consumer observes a half-dismissed proposal.
  set(state => {
    const campaign = findActiveCampaign(state.campaigns, campaignId);
    if (!campaign) return;
    const currentProposal = (campaign.worldState?.proposals || [])
      .find(item => item.id === proposalId) || null;
    // Dismiss is a compare-and-set over the pending state. A delayed click, a
    // second concurrent invocation, or an already-applied proposal is a no-op;
    // none may rewrite the authoritative terminal decision or its timestamp.
    if (!currentProposal || currentProposal.status !== 'pending') return;
    const now = new Date().toISOString();
    campaign.worldState = updateProposalStatus(
      ensureWorldState(campaign.worldState, campaign),
      proposalId,
      'dismissed',
      { dismissedAt: now },
    );
    proposal = campaign.worldState.proposals
      .find(item => item.id === proposalId) || null;
    // The proposal is a draft proxy here; flatten it before set() returns.
    dismissDecision = proposal
      ? extractProposalDecision(proposal, 'dismissed')
      : null;
    campaign.updatedAt = now;
    campaignPersist = cacheCampaignState(state);
  });
  if (dismissDecision && campaignPersist) {
    // Dismissal is the block half of the DM permission flow; persist the same
    // snapshot after emitting its plain decision telemetry.
    track(
      EVENTS.WORLD_PULSE_PROPOSAL_DISMISSED,
      dismissDecision,
      { subjectId: campaignId },
    );
    await syncCampaignSnapshot(
      campaignPersist.snapshot,
      campaignId,
      campaignPersist,
      isSessionCurrent,
    );
    if (!isSessionCurrent()) return null;
  }
  return proposal;
}
