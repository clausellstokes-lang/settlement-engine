/**
 * campaignSlice — Campaign organization for settlements and maps.
 *
 * Campaigns are named folders that group settlements and optionally store a
 * map state. Settlements stay in the flat saves array; campaigns hold
 * ordered ID references.
 *
 * Schema v2 (2026-04): campaign.mapState now carries the full FMG snapshot
 * (plain-text `prepareMapData()` output, ~100KB-1MB) plus the v2 map-slice
 * sub-tree (placements, labels, markers, forests, layers, viewport).
 *
 *   campaign.mapState = {
 *     schemaVersion: 2,
 *     fmgSnapshot:   <string blob>,
 *     seed:          <number>,
 *     placements:    { burgId: {settlementId, x, y, cellId, placedAt} },
 *     labels:        [...],
 *     markers:       [...],
 *     forests:       [...],
 *     layers:        { relationships, chains, labels, markers, forests, ... },
 *     viewport:      { cx, cy, scale, width, height },
 *     savedAt:       ISO8601,
 *   }
 *
 * v1 mapStates are migrated on first read (fmgSnapshot null, modern fields
 * filled from legacy keys).
 *
 * Persistence: localStorage cache (sf_campaigns) + saved_maps cloud sync for
 * signed-in users.
 */

import {
  ensureRegionalGraph,
  ensureWizardNewsFeed,
  appendWizardNewsEntries,
} from '../domain/region/index.js';
// V-17 THE CAMPAIGN IMPORT — light domain leaf (pure schema wall + news projection);
// no store/sim-graph imports, so it never rides into first paint.
import { tableEventToNewsEntry } from '../domain/tableEvents.js';
// Leaf-module import (not the `export *` barrel) so the heavy simulation graph
// can't ride into first paint via the barrel. ensureWorldState is a light,
// synchronous default-shape helper used on read paths.
import { ensureWorldState } from '../domain/worldPulse/worldState.js';
import {
  legacyCampaignContentBinding,
  normalizeCampaignContentBinding,
} from './campaignContentBindingModel.js';
import { campaigns as campaignService, isCampaignActive } from '../lib/campaigns.js';
import {
  buildNewCampaign,
  createImportedCampaignWithReceipt,
} from './campaignImportedCreation.js';
// WS4 decomposition — pure utils + persistence helpers extracted to a sibling.
import {
  cloneJson, campaignCacheOwner,
  captureCampaignSession, isCurrentCampaignSession, localWrite, persistCampaignState,
  deletePersistedCampaignState,
  clearCampaignSyncBookkeeping, syncCampaignSnapshot,
  initCampaignSessionReader, loadCampaignSyncTools,
  initPersistFailureReporter,
  retryOutboxPersist,
  newCampaignId, isUuid, uuidFromLegacyId, findActiveCampaign,
} from './campaignSliceShared.js';
import { initOutboxStatusReporter, getStatus as outboxStatus } from './outbox.js';
import { track, EVENTS } from '../lib/analytics.js';

const SCHEMA_VERSION = 2;
let settlementDeletionLockSequence = 0;
let campaignDeletionLockSequence = 0;

/**
 * @typedef {{
 *   token: string,
 *   campaignIds: Array<string|number>,
 *   settlementIds: string[],
 *   reason: string,
 *   ownerId: string,
 *   generation: number,
 * }} CampaignMutationLock
 */

function idIn(ids, value) {
  return (ids || []).some(id => String(id) === String(value));
}

function settlementMutationBlock(state, settlementIds, mutationToken = null) {
  for (const settlementId of settlementIds || []) {
    const locked = (state.campaignMutationLocks || []).find(
      lock => lock.token !== mutationToken && idIn(lock.settlementIds, settlementId),
    );
    if (locked) {
      return {
        ok: false,
        reason: locked.reason || 'settlement_deletion_in_flight',
        settlementId,
      };
    }
  }
  return null;
}

function campaignMutationBlock(state, campaignIds, mutationToken = null) {
  for (const campaignId of campaignIds || []) {
    const inFlight = typeof state.isAdvanceInFlight === 'function'
      ? state.isAdvanceInFlight(campaignId)
      : idIn(state.advanceInFlight, campaignId);
    if (inFlight) return { ok: false, reason: 'advance_in_flight', campaignId };
    const campaign = (state.campaigns || []).find(c => isCampaignActive(c) && String(c.id) === String(campaignId));
    const paused = typeof state.getPausedAdvance === 'function'
      ? state.getPausedAdvance(campaignId)
      : campaign?.worldState?.pausedAdvance;
    if (paused) return { ok: false, reason: 'advance_paused', campaignId };
    const locked = (state.campaignMutationLocks || []).find(
      lock => lock.token !== mutationToken && idIn(lock.campaignIds, campaignId),
    );
    if (locked) {
      return {
        ok: false,
        reason: locked.reason || 'settlement_deletion_in_flight',
        campaignId,
      };
    }
  }
  return null;
}

function campaignsHoldingSettlements(state, settlementIds) {
  const ids = new Set((Array.isArray(settlementIds) ? settlementIds : [settlementIds]).map(String));
  return (state.campaigns || []).filter(c => {
    if (!isCampaignActive(c)) return false;
    const holdsMember = (c.settlementIds || []).some(id => ids.has(String(id)));
    const holdsQueued = (c.worldState?.pendingEvents || []).some(event => ids.has(String(event.saveId)));
    return holdsMember || holdsQueued;
  }).map(c => c.id);
}

function membershipCampaignIds(state, targetCampaignId, settlementId) {
  return [...new Set([targetCampaignId, ...campaignsHoldingSettlements(state, [settlementId])])];
}

function clearTransientCampaignWork(state) {
  state.campaignMutationLocks = [];
  state.advanceInFlight = [];
  state.pulseUndoStack = [];
  // R-1 MUST-FIX: the proposal-undo ring and its advance-depth counter are the
  // same class of owner-scoped transient work as the advance stack. Left alone,
  // a same-owner re-auth kept the ring alive while the advance stack cleared —
  // the History chip advertised a dead undo into the replacement session.
  state.proposalUndoStack = [];
  state.advanceSeqByCampaign = {};
}

/**
 * Build one complete campaign envelope before any persistence begins.
 *
 * Account import uses the optional initial state so its remapped settlement
 * membership and immutable content cutoff are present on the first insert.
 * Ordinary creation still receives the active account environment.
 */
/**
 * Start a confirmed campaign delete without yielding between validation, session
 * capture, and reservation.
 *
 * The remote/finalization body remains lazy, but its authority is immutable before
 * import() begins. A same-id campaign loaded for a replacement owner can therefore
 * never become the target of the older operation, and synchronous mutations see
 * the deletion lock even while the cold module is still loading.
 */
function deleteCampaignWithConfirmedPersistence({
  campaignId,
  get,
  set,
}) {
  const state = get();
  const session = captureCampaignSession(state);
  const campaign = (state.campaigns || []).find(
    candidate => String(candidate?.id) === String(campaignId),
  );
  if (!campaign) {
    return Promise.resolve({ ok: true, campaignId, alreadyAbsent: true });
  }

  const blocked = state.getCampaignMutationBlock?.(campaign.id);
  if (blocked) {
    return Promise.reject(Object.assign(
      new Error('Wait for the current campaign operation to finish before deleting this campaign.'),
      {
        code: blocked.reason || 'campaign_mutation_in_flight',
        campaignId: campaign.id,
      },
    ));
  }

  const token = `campaign-delete-${++campaignDeletionLockSequence}`;
  set(draft => {
    draft.campaignMutationLocks = [
      ...(draft.campaignMutationLocks || []),
      {
        token,
        campaignIds: [campaign.id],
        settlementIds: [],
        reason: 'campaign_deletion_in_flight',
        ownerId: session.ownerId,
        generation: session.generation,
      },
    ];
  });
  campaignService.reserveDelete?.(campaign.id, session.ownerId);

  let remoteDeleted = false;
  return import('./campaignDeletionSession.js')
    .then(({ finishConfirmedCampaignDelete }) => (
      finishConfirmedCampaignDelete({
        campaign,
        campaignService,
        get,
        markRemoteDeleted: () => {
          remoteDeleted = true;
        },
        session,
        set,
      })
    ))
    .catch(error => {
      if (!remoteDeleted) {
        campaignService.releaseDelete?.(campaign.id, session.ownerId);
      }
      throw error;
    })
    .finally(() => {
      set(draft => {
        draft.campaignMutationLocks = (draft.campaignMutationLocks || [])
          .filter(lock => lock.token !== token);
      });
    });
}

/**
 * Coarse, behavior-free analytics derivations for this slice. Each is a small
 * pure helper that returns enums/counts/bands only — never names/prose/domain
 * objects — so the additive track() calls stay fire-and-forget and lint-clean
 * (analytics-props-hygiene). Wrapped at the call site is unnecessary because
 * track() itself never throws.
 */

function localLoad(ownerId = 'anon', inferredCustomContent = undefined) {
  return campaignService.loadCached(ownerId)
    .map(campaign => migrateCampaign(campaign, inferredCustomContent));
}

/** Migrate a single campaign object to the current schema.
 *  Exported for the correctness-1 regression pin (settlementIds normalization). */
export function migrateCampaign(camp, inferredCustomContent = undefined) {
  if (!camp || typeof camp !== 'object') return camp;
  // Array.prototype.map passes the numeric index as argument two. Treat only a
  // real grouped-content object as an inference request so
  // `.map(migrateCampaign)` remains a safe, longstanding public call pattern.
  const inferenceSource = (
    inferredCustomContent
    && typeof inferredCustomContent === 'object'
    && !Array.isArray(inferredCustomContent)
  )
    ? inferredCustomContent
    : undefined;
  const next = { ...camp };
  // Remint a non-UUID legacy id DETERMINISTICALLY from the id itself, so the local
  // cache copy and the remote list copy of the same campaign converge on one id and
  // mergeCampaignLists dedupes them (a random newCampaignId() gave the two copies
  // different ids → a duplicate row). An empty/missing id has nothing to converge
  // on → keep the random mint (distinct id-less campaigns must not collapse).
  if (!isUuid(next.id)) next.id = (next.id == null || next.id === '') ? newCampaignId() : uuidFromLegacyId(next.id);
  if (camp.mapState) next.mapState = migrateMapState(camp.mapState);
  if (next.regionalGraph) next.regionalGraph = ensureRegionalGraph(next.regionalGraph);
  next.wizardNews = ensureWizardNewsFeed(next.wizardNews);
  next.worldState = ensureWorldState(next.worldState, next);
  next.accessState = next.accessState || 'active';
  // Normalize settlementIds at the single load chokepoint so no campaign ever
  // enters the store without the field. SettlementsPanel iterates c.settlementIds
  // unconditionally (assignedIds useMemo + the campaign-folder map); a legacy /
  // partial campaign missing this array otherwise throws mid-render and white-
  // screens the whole library.
  next.settlementIds = Array.isArray(next.settlementIds) ? next.settlementIds : [];
  // V-2 THE CHRONICLER'S LETTER: the per-campaign read floor. Normalized at the
  // single load chokepoint so no campaign (legacy / partial / imported) enters the
  // store without it — the composer diffs `wizardNews.entries` with tick > this.
  next.lastReadTick = Number.isFinite(next.lastReadTick) ? Number(next.lastReadTick) : 0;
  // R-16 THE 'WORLD DEEPENED' LETTER: the flags-seen baseline. null (never recorded)
  // ⇒ the deepened section stays DARK; an array ⇒ a flag delta lights it. A non-array
  // (absent/legacy) normalizes to null, so the R-16 path is dormant by default.
  next.flagsSeen = Array.isArray(next.flagsSeen) ? next.flagsSeen.map(String) : null;
  return normalizeCampaignContentBinding(next, inferenceSource);
}

/** Migrate a single campaign mapState to v2 */
function migrateMapState(ms) {
  if (!ms || typeof ms !== 'object') return null;
  if (ms.schemaVersion === SCHEMA_VERSION) return ms;

  // v1 → v2 migration
  // v1 shape: { burgSettlementMap, placements:[], mapSeed, savedAt }
  //   - placements was an array of {burgId, settlementId, x, y, name, population}
  //   - burgSettlementMap duplicated the burgId→settlementId map
  //   - mapSeed is the FMG seed
  //   - no snapshot, no annotations, no layers, no viewport
  const v1Placements = Array.isArray(ms.placements) ? ms.placements : [];
  const v2Placements = {};
  for (const p of v1Placements) {
    if (p?.burgId == null) continue;
    v2Placements[String(p.burgId)] = {
      settlementId: p.settlementId || null,
      x: p.x, y: p.y,
      cellId: p.cellId ?? null,
      placedAt: p.placedAt || new Date().toISOString(),
      // Preserve legacy name/population so a restore can rebuild the burg
      // via addBurg + name/population patching when loadSnapshot isn't used.
      name: p.name,
      population: p.population,
    };
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    fmgSnapshot: null,   // v1 had none
    seed: ms.mapSeed ?? ms.seed ?? null,
    placements: v2Placements,
    labels:  [],
    markers: [],
    forests: [],
    layers: {
      relationships: true,
      relationshipFilter: ['trade_partner', 'allied', 'patron', 'client', 'vassal', 'rival', 'cold_war', 'hostile'],
      chains: false,
      chainFilter: null,
      regionalChannels: true,
      regionalChannelFilter: null,
      regionalImpacts: true,
      regionalImpactStatusFilter: ['queued', 'applied', 'resolved'],
      regionalMinSeverity: 0,
      regionalShowGm: true,
      labels: true,
      markers: true,
      forests: true,
      nativeStateBorders: true,
      nativeCultureRegions: false,
    },
    viewport: { cx: 0, cy: 0, scale: 1, width: 0, height: 0 },
    savedAt: ms.savedAt || new Date().toISOString(),
    // Legacy placements-as-array kept for the restore path that doesn't use
    // fmgSnapshot — WorldMap can fall back to bridge.restorePlacements().
    _legacyPlacements: v1Placements,
  };
}

// ── Cross-slice contract ──────────────────────────────────────────────────
// All 14 slices share ONE Immer store, so coupling is by shared state on the
// draft + get() method calls — not imports. campaignSlice is the campaign
// orchestrator after the WS4 split (regional → campaignRegionalSlice, world-pulse
// → campaignWorldPulseSlice):
//
// OWNS state:   campaigns, campaignsLoaded, activeCampaignId, campaignSyncError —
//   `campaigns` is the shared root the regional + world-pulse slices read/write.
// PROVIDES (read via get() by other slices): the settlement-clock bridge
//   isSettlementClockBound, getCampaignForSettlement, queueSettlementEvent,
//   cancelQueuedEvent — consumed by settlementSlice when an event is applied to a
//   clock-bound member; plus campaign CRUD, gallery import, campaign map state,
//   and the wizard-news getters.
// CONSUMES shared state: savedSettlements — owned by settlementSlice.
// Persistence/pure utils live in campaignSliceShared.js; pulse/state-application
// helpers in campaignPulseHelpers.js.
// ── Shapeless-patch validation (Wave R-3, atlas VI.12 #163b) ────────────────
// The CLOSED patch surface of updateSavedCampaign, from the R-3 caller census:
// AutonomyPanel's standing instructions plus MapShareEditor's gallery cache
// stamps. Every OTHER field on a campaign row (id, settlementIds, worldState,
// mapState, wizardNews, chronicles, contentBinding, ...) has a dedicated
// writer; a patch reaching for one of those is a programming error and is
// refused WHOLE (atomic, typed) — unlike updateConfig's filtering validator,
// no caller here passes persisted blobs, so atomicity breaks nothing.
// Exported for the validation pins.
export const SAVED_CAMPAIGN_PATCH_KEYS = new Set([
  'surveyorInstructions', // AutonomyPanel (domain/autonomy STANDING_INSTRUCTIONS_KEY)
  'shareKind', 'galleryDescription', 'galleryTags', // MapShareEditor cachePatch
  'isPublic', 'publicSlug', // MapShareEditor publish/unshare stamps
]);

export const createCampaignSlice = (set, get) => {
  initCampaignSessionReader(get);
  // Route module-scoped persist failures (in campaignSliceShared) into store
  // state so the UI can warn the user instead of silently losing a cloud save.
  initPersistFailureReporter(() => set(state => {
    // Covers BOTH campaign saves and (since A+ P0.1 unified persistSaveUpdate) the
    // canon settlement path — applied-locally-but-not-persisted, surfaced via the banner.
    state.campaignSyncError = 'Some changes could not be saved to the cloud. '
      + 'They are applied locally but may not persist — check your connection, then reload to confirm.';
  }));

  // Track K C3 — mirror the durable outbox's pending/parked counts into store
  // state so the sync chip can render "n queued / n failed". Last-writer-wins
  // (module-scoped, like initPersistFailureReporter); fires on every op change.
  initOutboxStatusReporter(status => set(state => { state.outboxStatus = status; }));

  return {
  // ── State ──────────────────────────────────────────────────────────────────
  campaigns: [],
  campaignsLoaded: false,
  /** Monotonic auth/cache boundary for every async campaign operation. */
  campaignSessionGeneration: 0,
  /** The currently-loaded campaign id (null if none) — used by WorldMap */
  activeCampaignId: null,
  /** Set when a cloud save of campaign/save state fails; surfaced as a banner.
   *  null when the last persist succeeded (or was cleared by the user). */
  campaignSyncError: null,
  /** Session-only locks held while settlement deletion awaits its cloud batch. */
  campaignMutationLocks: [],
  /** Dismiss the cloud-sync warning banner. */
  clearCampaignSyncError: () => set(state => { state.campaignSyncError = null; }),
  /** Durable-outbox status for the sync chip: pending + parked op counts. */
  outboxStatus: outboxStatus(),
  /** Retry affordance: revive parked ops and re-drain, clearing the warning. */
  retryOutbox: () => {
    set(state => { state.campaignSyncError = null; });
    return retryOutboxPersist();
  },

  // ── Actions ────────────────────────────────────────────────────────────────

  isCampaignMutationLocked: (campaignId) =>
    (get().campaignMutationLocks || []).some(lock => idIn(lock.campaignIds, campaignId)),

  getCampaignMutationBlock: (campaignId, mutationToken = null) =>
    campaignMutationBlock(get(), [campaignId], mutationToken),

  getCampaignMembershipBlock: (campaignId, settlementId, mutationToken = null) => {
    const state = get();
    return settlementMutationBlock(state, [settlementId], mutationToken)
      || campaignMutationBlock(
        state,
        membershipCampaignIds(state, campaignId, settlementId),
        mutationToken,
      );
  },

  getSettlementDeletionBlock: (settlementIds, mutationToken = null) => {
    const state = get();
    return settlementMutationBlock(
      state,
      Array.isArray(settlementIds) ? settlementIds : [settlementIds],
      mutationToken,
    ) || campaignMutationBlock(
      state,
      campaignsHoldingSettlements(state, settlementIds),
      mutationToken,
    );
  },

  /**
   * Hold a session-scoped lock while a settlement delete persists.
   *
   * The lock covers every campaign that references the target through membership
   * or queued events. It is installed before the first await and always released;
   * a late completion may return its own result only while the captured campaign
   * session remains current.
   */
  withSettlementDeletionLock: async (settlementIds, operation) => {
    const state = get();
    const session = captureCampaignSession(state);
    const lockedSettlementIds = (
      Array.isArray(settlementIds) ? settlementIds : [settlementIds]
    ).filter(id => id != null).map(String);
    const campaignIds = campaignsHoldingSettlements(state, settlementIds);
    const blocked = settlementMutationBlock(state, lockedSettlementIds)
      || campaignMutationBlock(state, campaignIds);
    if (blocked) return blocked;
    const token = `settlement-delete-${++settlementDeletionLockSequence}`;
    set(draft => {
      draft.campaignMutationLocks = [
        ...(draft.campaignMutationLocks || []),
        {
          token,
          campaignIds,
          settlementIds: lockedSettlementIds,
          reason: 'settlement_deletion_in_flight',
          ownerId: session.ownerId,
          generation: session.generation,
        },
      ];
    });
    try {
      const result = await operation({ mutationToken: token, campaignIds, session });
      if (!isCurrentCampaignSession(get(), session)) {
        return { ok: false, reason: 'auth_session_changed' };
      }
      return result;
    } finally {
      set(draft => {
        draft.campaignMutationLocks = (draft.campaignMutationLocks || [])
          .filter(lock => lock.token !== token);
      });
    }
  },

  /**
   * Execute one reviewed structured-import draft through the lazy application
   * command plane. Validation, lock installation, and transaction imports all
   * live behind this boundary so the existing-campaign tool does not increase
   * the first-paint closure.
   */
  executeImportReconciliationDraft: (draft, options = {}) => import(
    './importReconciliationCommandEntry.js'
  ).then(({ executeImportReconciliationDraftFromStore }) => (
    executeImportReconciliationDraftFromStore({ set, get, draft, options })
  )),

  loadCampaigns: () => {
    const session = captureCampaignSession(get());
    const ownerId = session?.ownerId || campaignCacheOwner(get());
    const customContentReady = ownerId === 'anon'
      || get().customContentSyncedAt != null;
    const inferredCustomContent = customContentReady
      ? (get().customContent || {})
      : undefined;
    const cached = localLoad(ownerId, inferredCustomContent);
    set(state => {
      state.campaigns = cached;
      state.campaignsLoaded = !campaignService.isConfigured;
    });
    if (!campaignService.isConfigured) return Promise.resolve(cached);
    return Promise.all([campaignService.list(), loadCampaignSyncTools()])
      .then(([remote, {
        mergeCampaignLists,
        primeCampaignSync,
        reconcileTombstones,
      }]) => {
        // Stale-owner guard: a sign-out/sign-in completing mid-flight would
        // otherwise write the previous user's campaigns into state/cache.
        if (!isCurrentCampaignSession(get(), session)) return get().campaigns;
        const migratedRemote = remote.map(campaign => (
          migrateCampaign(campaign, inferredCustomContent)
        ));
        primeCampaignSync(migratedRemote, ownerId, session.generation);
        // Read tombstones HERE (at list()-resolve), not at load start: a delete
        // that ran while list() was in flight has by now written its tombstone,
        // and that is exactly the same-device race we must not lose to.
        const tombstones = campaignService.loadTombstones(ownerId);
        // Merge against the LIVE list, not the load-start `cached` snapshot
        // (ported master fix): a campaign created while the remote load was in
        // flight exists only in the live list — merging against the stale
        // snapshot silently dropped it.
        const merged = mergeCampaignLists(get().campaigns, migratedRemote, { tombstones });
        const prunedTombstones = reconcileTombstones(tombstones, migratedRemote);
        if (prunedTombstones.length !== tombstones.length) {
          campaignService.writeTombstones(prunedTombstones, ownerId);
        }
        set(state => {
          state.campaigns = merged;
          state.campaignsLoaded = true;
        });
        localWrite(merged, ownerId);
        syncCampaignSnapshot(
          merged, null, session, () => isCurrentCampaignSession(get(), session),
        ).catch(e => {
          console.warn('[campaignSlice] campaign cloud backfill failed', e);
        });
        return merged;
      })
      .catch(error => {
        if (!isCurrentCampaignSession(get(), session)) return get().campaigns;
        console.warn('[campaignSlice] campaign cloud load failed', error);
        set(state => { state.campaignsLoaded = true; });
        return cached;
      });
  },

  clearCampaigns: () =>
    set(state => {
      state.campaigns = [];
      state.campaignsLoaded = false;
      state.activeCampaignId = null;
      state.campaignSessionGeneration = (Number(state.campaignSessionGeneration) || 0) + 1;
      clearTransientCampaignWork(state);
      clearCampaignSyncBookkeeping();
    }),

  // Same-owner SIGNED_IN is still a new credential boundary. Keep the already
  // loaded campaign cache, but invalidate every async continuation and transient
  // lock before auth publishes the replacement session. TOKEN_REFRESHED does not
  // call this action because it remains the same logical Supabase session.
  invalidateCampaignSession: () =>
    set(state => {
      state.campaignSessionGeneration = (Number(state.campaignSessionGeneration) || 0) + 1;
      clearTransientCampaignWork(state);
    }),

  /**
   * Finalize the immutable cutoff for campaigns created before content
   * bindings existed. Called only after the correct owner's custom library is
   * available; the resulting resolved definitions are then persisted in the
   * campaign envelope and never follow later account-library edits.
   */
  pinLegacyCampaignContentBindings: (customContent) => {
    let changed = false;
    set(state => {
      for (const campaign of state.campaigns || []) {
        if (campaign.contentBinding) continue;
        campaign.contentBinding = legacyCampaignContentBinding(
          customContent,
          state.activeContentEnvironment,
        );
        campaign.contentBindingHistory = [];
        campaign.contentBindingStatus = 'pinned';
        campaign.updatedAt = new Date().toISOString();
        campaign.pendingSync = true;
        changed = true;
      }
      if (changed) persistCampaignState(state);
    });
    return changed;
  },

  createCampaign: (name) => {
    const current = get();
    const role = current.auth?.role;
    const canCreate = current.auth?.tier === 'premium' || role === 'developer' || role === 'admin';
    if (!canCreate) return null;
    const campaign = buildNewCampaign(current, name);
    set(state => {
      state.campaigns.unshift(campaign);
      persistCampaignState(state, campaign.id);
    });
    return campaign.id;
  },

  /**
   * Persist an imported campaign's final envelope exactly once before exposing
   * it in the live cache. This avoids inserting the account's current binding
   * and then attempting a blind rewrite that the campaign binding CAS trigger
   * must reject.
   */
  createImportedCampaign: async (name, initial = {}) => {
    return createImportedCampaignWithReceipt({
      get,
      set,
      name,
      initial,
    });
  },

  previewCampaignContentBindingMigration: (campaignId, options = {}) => {
    const session = captureCampaignSession(get());
    return import('./campaignContentBindingSession.js').then(module => (
      module.previewCampaignContentBindingMigrationSession({
        get, campaignId, options, session,
      })
    ));
  },

  previewCampaignContentBindingRollback: (campaignId, targetBindingHash) => {
    const session = captureCampaignSession(get());
    return import('./campaignContentBindingSession.js').then(module => (
      module.previewCampaignContentBindingRollbackSession({
        get, campaignId, targetBindingHash, session,
      })
    ));
  },

  applyCampaignContentBindingMigration: (campaignId, preview) => {
    const session = captureCampaignSession(get());
    return import('./campaignContentBindingSession.js').then(module => (
      module.applyCampaignContentBindingMigrationSession({
        get,
        set,
        campaignId,
        preview,
        session,
        mutationBlockForState: (state, id) => (
          campaignMutationBlock(state, [id])
        ),
      })
    ));
  },

  // Project 2: import a shared MAP from the gallery into a NEW premium campaign.
  // Phase 1 = blank canvas (backdrop only — no placements/settlements), so there
  // are no settlement ids to remap. The backdrop image is COPIED into the
  // importer's own storage so it survives the sharer deleting theirs.
  importGalleryMap: async (slug) => {
    const { importGalleryMapImpl } = await import('./galleryImportMap.js');
    return importGalleryMapImpl(get, slug);
  },

  // Project 2, Phase 2: import a shared MAP + CAMPAIGN. Clones each member
  // settlement into the importer's own cloud saves (fresh ids), then builds a new
  // campaign whose settlementIds + placements are REMAPPED to the clones. The
  // server already returned public-safe dossiers (no worldState/regionalGraph),
  // so the importer's campaign starts with a fresh world; the only id-remap
  // surface is settlementIds + placements[].settlementId.
  importGalleryMapWithCampaign: async (slug) => {
    const { importGalleryMapWithCampaignImpl } = await import('./galleryImportMap.js');
    return importGalleryMapWithCampaignImpl(get, set, slug);
  },

  /**
   * Clone a public, owner-opted-in gallery dossier into the caller's library.
   * Thin wrapper: the full body (server-gated fetch + settlement migration chain +
   * save) lives in a LAZY sibling so neither the gallery client nor
   * normalizeSettlement's transitive closure ride the first-paint entry — this is
   * a cold, import-click-only path. See galleryImportSettlement.js for the premium
   * gate + clone/scrub contract.
   */
  importGallerySettlement: async (slug) => {
    const { importGallerySettlementImpl } = await import('./galleryImportSettlement.js');
    return importGallerySettlementImpl(get, set, slug);
  },

  renameCampaign: (id, name) => {
    const blocked = get().getCampaignMutationBlock(id);
    if (blocked) return blocked;
    set(state => {
      const c = findActiveCampaign(state.campaigns, id);
      if (!c) return;
      c.name = String(name || '').trim() || c.name;
      c.updatedAt = new Date().toISOString();
      persistCampaignState(state, id);
    });
    return { ok: true, campaignId: id };
  },

  deleteCampaign: (id, options = {}) => {
    // Data & Privacy needs a confirmed delete: keep the row visible until the
    // actual cloud/local service delete succeeds, so a failed subset remains
    // retryable and cannot be presented as a clean wipe. Ordinary library
    // deletes retain the existing optimistic, synchronous behavior.
    if (options.awaitPersistence) {
      return deleteCampaignWithConfirmedPersistence({
        campaignId: id,
        get,
        set,
      });
    }

    let deletion = Promise.resolve();
    set(state => {
      const campaign = findActiveCampaign(state.campaigns, id);
      if (!campaign) return;
      state.campaigns = state.campaigns.filter(c => String(c.id) !== String(id));
      if (String(state.activeCampaignId) === String(id)) state.activeCampaignId = null;
      state.pulseUndoStack = (state.pulseUndoStack || [])
        .filter(snapshot => String(snapshot.campaignId) !== String(id));
      // R-1 MUST-FIX hygiene: the proposal ring and the advance-depth counter
      // follow the campaign out, exactly like the advance stack above — no
      // orphan snapshot may keep a deleted (or recreated same-id) world alive.
      state.proposalUndoStack = (state.proposalUndoStack || [])
        .filter(snapshot => String(snapshot.campaignId) !== String(id));
      if (state.advanceSeqByCampaign) delete state.advanceSeqByCampaign[String(id)];
      deletion = deletePersistedCampaignState(state, id);
    });
    return deletion;
  },

  toggleCampaignCollapsed: (id) =>
    set(state => {
      const c = findActiveCampaign(state.campaigns, id);
      if (!c) return;
      c.collapsed = !c.collapsed;
      persistCampaignState(state, id);
    }),

  addToCampaign: (campaignId, settlementId) => {
    if (!findActiveCampaign(get().campaigns, campaignId)) {
      return { ok: false, reason: 'campaign_not_found', campaignId };
    }
    const blocked = get().getCampaignMembershipBlock(campaignId, settlementId);
    if (blocked) return blocked;
    set(state => {
      const target = findActiveCampaign(state.campaigns, campaignId);
      if (!target) return;
      const now = new Date().toISOString();
      const changedIds = new Set();
      const sid = String(settlementId);
      for (const c of state.campaigns) {
        if (!isCampaignActive(c)) continue;
        const before = c.settlementIds || [];
        // Same String() model as the membership resolvers (Owner Ruling #5):
        // without it, re-homing a number/string-mismatched member would leave
        // a now-advancing ghost entry behind in the old campaign.
        const next = before.filter(id => String(id) !== sid);
        if (next.length !== before.length) {
          c.settlementIds = next;
          // store-hooks-state-6: re-homing a settlement must also drop its queued
          // intentions from every campaign it LEAVES — the same deliberate-moment
          // prune removeFromCampaign does. Otherwise the old campaign's next
          // advance silently destroys them (drainQueuedEvents skips a non-member
          // save), violating the §10 "refused VISIBLY, never silently dropped" law.
          if (c.worldState?.pendingEvents?.length) {
            const kept = c.worldState.pendingEvents.filter(e => String(e.saveId) !== sid);
            if (kept.length !== c.worldState.pendingEvents.length) {
              c.worldState = { ...c.worldState, pendingEvents: kept };
            }
          }
          c.updatedAt = now;
          changedIds.add(c.id);
        }
      }
      target.settlementIds = Array.isArray(target.settlementIds) ? target.settlementIds : [];
      // String()-normalized dedupe (Owner Ruling #5): an exact-match check
      // would let a member stored under the other id type be added twice.
      if (!target.settlementIds.some(id => String(id) === sid)) target.settlementIds.push(settlementId);
      target.updatedAt = now;
      changedIds.add(target.id);
      persistCampaignState(state, Array.from(changedIds));
    });
    return { ok: true, campaignId, settlementId };
  },

  removeFromCampaign: (campaignId, settlementId, { mutationToken = null } = {}) => {
    if (!findActiveCampaign(get().campaigns, campaignId)) {
      return { ok: false, reason: 'campaign_not_found', campaignId };
    }
    const blocked = get().getCampaignMutationBlock(campaignId, mutationToken);
    if (blocked) return blocked;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      // String()-normalized removal (Owner Ruling #5, same model as the
      // membership resolvers): with normalized membership, an exact-match
      // filter here would leave a mismatched member ADVANCING but unremovable
      // (the remove affordance would silently no-op). The pendingEvents prune
      // below always normalized — this brings the settlementIds filter in line.
      const sid = String(settlementId);
      c.settlementIds = (c.settlementIds || []).filter(id => String(id) !== sid);
      // Campaign-clock: drop any queued intentions the departing settlement had,
      // at the deliberate moment of removal — otherwise they'd be silently
      // destroyed at the next tick (the drain only acts on current members).
      if (c.worldState?.pendingEvents?.length) {
        const kept = c.worldState.pendingEvents.filter(e => String(e.saveId) !== sid);
        if (kept.length !== c.worldState.pendingEvents.length) {
          c.worldState = { ...c.worldState, pendingEvents: kept };
        }
      }
      c.updatedAt = new Date().toISOString();
      persistCampaignState(state, campaignId);
    });
    return { ok: true, campaignId, settlementId };
  },

  /**
   * Save the current map slice's state into a campaign.
   * Pulls from useStore.mapState; WorldMap should populate fmgSnapshot via
   * `setMapSnapshot(blob, seed)` before calling this.
   */
  saveCampaignMap: (campaignId, mapStateOverride) =>
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      // Pull a deep-cloneable copy of mapState. Override wins if provided.
      const source = mapStateOverride || state.mapState;
      const clean = cloneJson(source || {});
      c.mapState = {
        schemaVersion: SCHEMA_VERSION,
        fmgSnapshot: clean.fmgSnapshot || null,
        seed:        clean.seed ?? null,
        customBackdrop: clean.customBackdrop || null, // persist custom image maps
        placements:  clean.placements || {},
        labels:      clean.labels || [],
        markers:     clean.markers || [],
        forests:     clean.forests || [],
        layers:      clean.layers || {},
        viewport:    clean.viewport || {},
        savedAt:     new Date().toISOString(),
      };
      c.updatedAt = c.mapState.savedAt;
      persistCampaignState(state, campaignId);
    }),

  clearCampaignMap: (campaignId) =>
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      c.mapState = null;
      c.updatedAt = new Date().toISOString();
      persistCampaignState(state, campaignId);
    }),

  /**
   * Patch a cached campaign row IN PLACE (mirrors settlementSlice's
   * updateSavedSettlement). The maps editor re-renders off the cached campaign
   * after a publish/edit without a refetch — e.g. stamping the gallery share
   * kind/description back onto the row so the tile reflects the edit at once.
   * Patch keys are validated against SAVED_CAMPAIGN_PATCH_KEYS (the R-3 caller
   * census): ANY unknown key refuses the whole patch, typed, with a dev error.
   * Only patches an ACTIVE campaign; a missing/destroyed id is a typed no-op.
   * Persists so the patch survives a reload.
   * @param {string} campaignId
   * @param {object} patch shallow allowlisted keys to assign onto the row
   * @returns {{ ok: true, campaignId: string }
   *   | { ok: false, reason: string, campaignId: string, unknownKeys?: string[] }}
   */
  updateSavedCampaign: (campaignId, patch) => {
    if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {
      return { ok: false, reason: 'invalid_campaign_patch', campaignId };
    }
    const unknownKeys = Object.keys(patch).filter(key => !SAVED_CAMPAIGN_PATCH_KEYS.has(key));
    if (unknownKeys.length) {
      if (import.meta.env.DEV) {
        console.error('[campaignSlice] updateSavedCampaign refused unknown patch keys:', unknownKeys);
      }
      return { ok: false, reason: 'unknown_campaign_patch_keys', unknownKeys, campaignId };
    }
    let patched = false;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      Object.assign(c, patch);
      c.updatedAt = new Date().toISOString();
      patched = true;
      persistCampaignState(state, campaignId);
    });
    return patched
      ? { ok: true, campaignId }
      : { ok: false, reason: 'campaign_not_found', campaignId };
  },

  getCampaignWizardNews: (campaignId) => {
    const c = findActiveCampaign(get().campaigns, campaignId);
    return ensureWizardNewsFeed(c?.wizardNews);
  },

  clearCampaignWizardNews: (campaignId) =>
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      c.wizardNews = ensureWizardNewsFeed();
      c.updatedAt = new Date().toISOString();
      persistCampaignState(state, campaignId);
    }),

  // V-17 THE CAMPAIGN IMPORT — commit confirmed typed table-event records into the
  // campaign's news feed as source:'table' HISTORY at each record's DM-chosen tick.
  // The `records` are already-validated TableEventRecord objects (built + confirmed
  // by the import UI through src/lib/campaignImport.js + the schema wall); this action
  // is the ONLY write path and it commits them WHOLESALE — the per-event confirmation
  // gate lives upstream (nothing unconfirmed is ever in `records`). NO-FREE-TEXT-
  // REACHES-MECHANICS: tableEventToNewsEntry copies `flavor` ONLY into the display
  // `summary`; every mechanical entry field comes from the typed record. Returns the
  // count appended. Registered in operationRegistry (klass:'mechanical').
  importTableEvents: (campaignId, records) => {
    let appended = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c || !Array.isArray(records) || !records.length) return;
      const now = new Date().toISOString();
      const feed = ensureWizardNewsFeed(c.wizardNews);
      const entries = records.map(tableEventToNewsEntry);
      c.wizardNews = appendWizardNewsEntries(feed, entries, { now });
      c.updatedAt = now;
      appended = entries.length;
      persistCampaignState(state, campaignId);
    });
    return appended || 0;
  },

  appendCampaignChronicle: (campaignId, entry) => {
    let chronicleCount = null;
    let chronicleTick = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c || !entry?.prose) return;
      const tick = entry.tick ?? c.wizardNews?.currentTick ?? null;
      c.chronicles = [
        {
          id: entry.id || `chronicle_${campaignId}_${entry.tick ?? 'latest'}_${Date.now()}`,
          tick,
          prose: entry.prose,
          createdAt: entry.createdAt || new Date().toISOString(),
        },
        ...(Array.isArray(c.chronicles) ? c.chronicles : []),
      ].slice(0, 24);
      c.updatedAt = new Date().toISOString();
      chronicleCount = c.chronicles.length;
      chronicleTick = Number.isFinite(tick) ? tick : null;
      persistCampaignState(state, campaignId);
    });
    if (chronicleCount !== null) {
      track(EVENTS.CHRONICLE_GENERATED, { entry_count_after: chronicleCount, tick: chronicleTick });
    }
  },

  // V-2 THE CHRONICLER'S LETTER: mark the campaign's letters read up to the feed's
  // current tick, and record the flags-seen baseline (R-16). Mirrors
  // appendCampaignChronicle (findActiveCampaign → mutate → updatedAt →
  // persistCampaignState). The enabled-flag set is computed INLINE (never importing
  // the lazy composer's enabledFlagsOf into the eager store) — the same
  // Object.keys(rules).filter(===true).sort() the composer uses, so R-16's baseline
  // and its delta agree. Persisted per campaign; survives reload (cloneJson) and
  // pulse undo (which swaps worldState only, never these top-level fields).
  markCampaignLettersRead: (campaignId) =>
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const feed = ensureWizardNewsFeed(c.wizardNews);
      c.lastReadTick = Number.isFinite(feed.currentTick) ? Number(feed.currentTick) : (Number(c.lastReadTick) || 0);
      const rules = c.worldState && typeof c.worldState === 'object' ? c.worldState.simulationRules : null;
      c.flagsSeen = rules && typeof rules === 'object'
        ? Object.keys(rules).filter(k => rules[k] === true).sort()
        : [];
      c.updatedAt = new Date().toISOString();
      persistCampaignState(state, campaignId);
    }),

  /** Mark a campaign as the active one (WorldMap uses this to drive reloads) */
  setActiveCampaign: (id) => {
    set(state => {
      const campaign = findActiveCampaign(state.campaigns, id);
      state.activeCampaignId = id && campaign ? id : null;
    });
    // experience-product-fit-1 — the world moves ON campaign activation (the §0.6.1-
    // named site), not only when the Realm Inspector's Pulse tab happens to mount.
    // Fire the capped M10b catch-up for the newly-active campaign. The eager wrapper
    // (catchUpCampaignWorld) applies a SYNCHRONOUS not_living guard, so the default
    // dm_advanced campaign — every non-living activation, incl. every existing one —
    // returns WITHOUT loading the sim chunk (first-paint budget untouched). The
    // persisted week-cursor makes a re-activation within the same week a no-op, so
    // re-selecting a campaign (auto-resume, Advance-Time nav, gallery import) is safe.
    // Fire-and-forget: a failed catch-up must never block activation — the failure is
    // surfaced through the livingCatchUp digest, not swallowed. Date.now stays inside
    // the lazy store body (runCatchUpCampaignWorld), off this eager seam.
    const activeId = get().activeCampaignId;
    if (activeId) {
      Promise.resolve(get().catchUpCampaignWorld(activeId)).catch(() => {});
    }
  },

  /**
   * Resolve the campaign's map state to a v2 object (migrating v1 on the fly).
   * Returns null if no mapState is attached.
   */
  getCampaignMapState: (campaignId) => {
    const c = findActiveCampaign(get().campaigns, campaignId);
    if (!c?.mapState) return null;
    return migrateMapState(c.mapState);
  },

  getCampaignForSettlement: (settlementId) => {
    // Crash-guard (ported master fix): a campaign row without a settlementIds
    // array must not throw. String()-normalized id compare (master's other
    // half — was owner-gated, SIGNED under Owner Ruling #5's blanket
    // 2026-07-17 "membership normalization"): matches the
    // isSettlementClockBound / campaignSettlements membership model, so
    // number/string-mismatched members resolve to their campaign. Null-guard
    // mirrors isSettlementClockBound (String(null) must never match a literal
    // 'null' entry).
    if (settlementId == null) return null;
    const sid = String(settlementId);
    return get().campaigns.find(c => isCampaignActive(c) && (c.settlementIds || []).map(String).includes(sid)) || null;
  },

  // ── Campaign clock (Phase C) ────────────────────────────────────────────
  //
  // The world map IS the campaign clock. A settlement bound to a CANONIZED
  // campaign world surrenders its independent timeline: its events queue and
  // resolve simultaneously at each world-pulse advance, and its individual
  // undo/reset move up to the world-map (pulse) level.

  /**
   * Is this settlement bound to the world-map clock? True when it is a member
   * of a campaign whose world is CANONIZED. Canon-only by product decision:
   * map placement is NOT required (the world pulse already simulates every
   * canon member). Matches applyEvent's String-normalized membership scan, not
   * the exact-match getCampaignForSettlement, so number/string id mixes resolve.
   */
  isSettlementClockBound: (settlementId) => {
    if (settlementId == null) return false;
    const sid = String(settlementId);
    const c = get().campaigns.find(
      x => isCampaignActive(x) && (x.settlementIds || []).map(String).includes(sid),
    );
    return !!(c && c.worldState?.canonizedAt);
  },

  /**
   * Queue a player event as a pending intention on the settlement's clock-bound
   * campaign. It resolves simultaneously with every other member at the next
   * world-pulse advance (drainQueuedEvents). Returns null (no-op) when the
   * settlement is not clock-bound — callers fall through to the immediate path.
   */
  queueSettlementEvent: (settlementId, event) => {
    if (settlementId == null || !event) return null;
    const sid = String(settlementId);
    const campaign = get().campaigns.find(
      x => isCampaignActive(x) && (x.settlementIds || []).map(String).includes(sid),
    );
    if (!campaign || !campaign.worldState?.canonizedAt) return null;
    // Advance-in-flight guard (store-2): a multi-tick advance drains pendingEvents in
    // its Phase-1 clone and REPLACES c.worldState wholesale in Phase-2, so a pending
    // event queued during the awaited advance window is silently destroyed. Return a
    // TRUTHY typed no-op so applyEvent's clock-bound branch short-circuits on it (it
    // returns `queued` when truthy) — the immediate-apply fall-through would ALSO be
    // clobbered by the advance, so blocking is the safe path; the UI can toast the
    // reason instead of applyEvent silently reporting {queued:true}.
    if (typeof get().isAdvanceInFlight === 'function' && get().isAdvanceInFlight(campaign.id)) {
      return { queued: false, reason: 'advance_in_flight', campaignId: campaign.id };
    }
    // Parked-pause guard (W-COMPOSER-2 §10 — every docket mutation honors the
    // sync-prefix): resume replays the segment from the cursor's PRE-tick
    // snapshot and wholesale-replaces worldState, clobbering a queue write.
    if (typeof get().getPausedAdvance === 'function' && get().getPausedAdvance(campaign.id)) {
      return { queued: false, reason: 'advance_paused', campaignId: campaign.id };
    }
    const now = new Date().toISOString();
    let added = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaign.id);
      if (!c) return;
      const worldState = ensureWorldState(c.worldState, c);
      // Stable, collision-resistant id — keyed on the per-call timestamp, NOT
      // queue length (which decreases after a cancel and could then collide).
      const queueId = `pe_${sid}_${event.id || event.type || 'evt'}_${now}`;
      const entry = { queueId, saveId: sid, event: cloneJson(event), queuedAt: now };
      c.worldState = { ...worldState, pendingEvents: [...(worldState.pendingEvents || []), entry] };
      c.updatedAt = now;
      added = { queued: true, queueId, campaignId: c.id };
      persistCampaignState(state, c.id);
    });
    return added;
  },

  /** Cancel a queued intention before the next tick resolves it. */
  cancelQueuedEvent: (campaignId, queueId) => {
    // Advance-in-flight guard (store-2): a cancel that filters pendingEvents during a
    // running advance is either racing the Phase-1 drain or clobbered by the Phase-2
    // wholesale worldState replace. No-op with the action's existing boolean shape so
    // callers reading `removed` are unaffected.
    if (typeof get().isAdvanceInFlight === 'function' && get().isAdvanceInFlight(campaignId)) {
      return false;
    }
    // Parked-pause guard (W-COMPOSER-2 §10 — the sync-prefix on every docket mutation).
    if (typeof get().getPausedAdvance === 'function' && get().getPausedAdvance(campaignId)) {
      return false;
    }
    let removed = false;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c?.worldState) return;
      const before = c.worldState.pendingEvents || [];
      const after = before.filter(e => e.queueId !== queueId);
      if (after.length === before.length) return;
      c.worldState = { ...c.worldState, pendingEvents: after };
      c.updatedAt = new Date().toISOString();
      removed = true;
      persistCampaignState(state, campaignId);
    });
    return removed;
  },

  /**
   * THE MUTABLE DOCKET (W-COMPOSER-2 §10, owner law: "each queued commit is
   * editable or cancelable because of unforeseen changes"): replace a queued
   * intention IN PLACE — same queueId, same drain position, the event's
   * compose-session id preserved by the caller (identity persists across
   * edits; nothing has applied, so no undo/PRNG lineage exists yet). The
   * edited event re-validates at the drain like any queued intention.
   */
  updateQueuedEvent: (campaignId, queueId, event) => {
    if (!queueId || !event) return false;
    if (typeof get().isAdvanceInFlight === 'function' && get().isAdvanceInFlight(campaignId)) {
      return false;
    }
    if (typeof get().getPausedAdvance === 'function' && get().getPausedAdvance(campaignId)) {
      return false;
    }
    let replaced = false;
    const now = new Date().toISOString();
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c?.worldState) return;
      const before = c.worldState.pendingEvents || [];
      const idx = before.findIndex(e => e.queueId === queueId);
      if (idx === -1) return;
      const next = before.slice();
      next[idx] = { ...next[idx], event: cloneJson(event), queuedAt: now };
      c.worldState = { ...c.worldState, pendingEvents: next };
      c.updatedAt = now;
      replaced = true;
      persistCampaignState(state, campaignId);
    });
    return replaced;
  },

  reorderCampaignSettlements: (campaignId, settlementIds) =>
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      c.settlementIds = settlementIds;
      c.updatedAt = new Date().toISOString();
      persistCampaignState(state, campaignId);
    }),
  };
};
