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
  advanceRegionalImpacts,
  advanceWizardNewsFeed,
  appendWizardNewsEntries,
  applyRegionalImpact,
  conditionFromRegionalImpact,
  deriveGraphWithDiscoveredCandidates,
  deriveRegionalGraphFromSaves,
  deriveWizardNewsEntriesFromGraphChange,
  ensureRegionalGraph,
  ensureWizardNewsFeed,
  isRegionalImpactAvailable,
  queueRegionalImpacts,
  setRegionalChannelStatus as domainSetRegionalChannelStatus,
  setRegionalChannelVisibility as domainSetRegionalChannelVisibility,
  setRegionalImpactStatus as domainSetRegionalImpactStatus,
} from '../domain/region/index.js';
import {
  advanceCampaignWorld as domainAdvanceCampaignWorld,
  applyPartyImpact as domainApplyPartyImpact,
  applyWorldPulseProposal as domainApplyWorldPulseProposal,
  canonizeWorldState,
  ensureWorldState,
  normalizeSimulationRules,
  normalizeStressor,
  previewCampaignWorldPulse as domainPreviewCampaignWorldPulse,
  proposalIdFor,
  resolveStressorById,
  updateProposalStatus as domainUpdateWorldPulseProposalStatus,
  upsertProposal,
} from '../domain/worldPulse/index.js';
import { pulseTypeForStressorKey } from '../domain/stressorPicker.js';
import { withOrganicStressorResolution } from '../domain/worldPulse/stressorAftermath.js';
import { withoutActiveCondition } from '../domain/activeConditions.js';
import { deriveSystemState } from '../domain/state/deriveSystemState.js';
import { saves as savesService } from '../lib/saves.js';
import { campaigns as campaignService, isCampaignActive } from '../lib/campaigns.js';
import {
  forgetCampaignSync,
  mergeCampaignLists,
  primeCampaignSync,
  reconcileTombstones,
  syncCampaignChanges,
} from '../lib/campaignSync.js';
import { track, EVENTS } from '../lib/analytics.js';
import { captureFingerprint } from '../lib/researchCapture.js';

const SCHEMA_VERSION = 2;

/**
 * Coarse, behavior-free analytics derivations for this slice. Each is a small
 * pure helper that returns enums/counts/bands only — never names/prose/domain
 * objects — so the additive track() calls stay fire-and-forget and lint-clean
 * (analytics-props-hygiene). Wrapped at the call site is unnecessary because
 * track() itself never throws.
 */

/** Count stressors in a world-state snapshot that were created at a given tick. */
function countNewStressorsAtTick(worldState, tick) {
  const stressors = Array.isArray(worldState?.stressors) ? worldState.stressors : [];
  if (!Number.isFinite(tick)) return 0;
  let count = 0;
  for (const s of stressors) {
    if (Number(s?.createdTick ?? s?.onsetTick ?? s?.tick) === tick) count++;
  }
  return count;
}

/** Unique, sorted channel-type enums from an array of regional impacts. */
function channelTypesFromImpacts(impacts) {
  const set = new Set();
  for (const impact of Array.isArray(impacts) ? impacts : []) {
    const t = impact?.channelType;
    if (typeof t === 'string' && t) set.add(t);
  }
  return [...set].sort();
}

/** The coarse type enum for a world-pulse proposal (candidate/outcome kind). */
function proposalTypeOf(proposal) {
  const o = proposal?.outcome || {};
  return o.candidateType || o.type || proposal?.type || 'unknown';
}

function campaignCacheOwner(state) {
  return state?.auth?.user?.id ? String(state.auth.user.id) : 'anon';
}

function localLoad(ownerId = 'anon') {
  return campaignService.loadCached(ownerId).map(migrateCampaign);
}

function localWrite(campaigns, ownerId = 'anon') {
  try {
    campaignService.cache(campaigns, ownerId);
  } catch (e) {
    // Likely quota exceeded — FMG snapshots can be large (~1MB). The caller
    // should already have warned via canSaveSnapshot(); log and continue.
    console.warn('[campaignSlice] localStorage write failed', e);
  }
}

function persistCampaigns(campaigns, changedId = null, ownerId = 'anon', options = {}) {
  const snapshot = cloneJson(campaigns) || [];
  localWrite(snapshot, ownerId);
  const sync = syncCampaignChanges(snapshot, { service: campaignService, changedId });
  if (options.strict) return sync;
  sync.catch(e => {
    console.warn('[campaignSlice] campaign cloud sync failed', e);
  });
  return sync;
}

function persistCampaignState(state, changedId = null, options = {}) {
  return persistCampaigns(state.campaigns, changedId, campaignCacheOwner(state), options);
}

function cacheCampaignState(state) {
  const ownerId = campaignCacheOwner(state);
  const snapshot = cloneJson(state.campaigns) || [];
  localWrite(snapshot, ownerId);
  return { ownerId, snapshot };
}

function syncCampaignSnapshot(snapshot, changedId) {
  return syncCampaignChanges(snapshot, { service: campaignService, changedId });
}

function deletePersistedCampaign(id, campaigns, ownerId = 'anon') {
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

function deletePersistedCampaignState(state, id) {
  return deletePersistedCampaign(id, state.campaigns, campaignCacheOwner(state));
}

function cloneJson(value) {
  if (value === undefined || value === null) return value;
  return JSON.parse(JSON.stringify(value));
}

function newCampaignId() {
  try {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  } catch {
    // Fallback below.
  }
  return `camp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
}

// Set by createCampaignSlice so these module-scoped helpers can report a failed
// cloud save into store state (the UI then warns the user). Module-level because
// persistSaveUpdate is shared across many fire-and-forget call sites.
let _reportPersistFailure = null;

function persistSaveUpdate(saveId, partial) {
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

async function persistSaveUpdates(updates = []) {
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
async function flushWorldPulsePersist({ result, campaignPersist, persistUpdates, campaignId }) {
  if (!(result && campaignPersist)) return;
  await persistSaveUpdates(persistUpdates);
  await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
}

function clearCampaignSyncBookkeeping() {
  primeCampaignSync([]);
}

function campaignStateForRegionalImpact(state, save, systemState, now) {
  const isActive = state.activeSaveId && String(state.activeSaveId) === String(save.id);
  const current = save.campaignState || {};
  return {
    phase: isActive ? (state.phase || current.phase || 'draft') : (current.phase || 'draft'),
    eventLog: isActive
      ? cloneJson(Array.isArray(state.eventLog) ? state.eventLog : [])
      : cloneJson(Array.isArray(current.eventLog) ? current.eventLog : []),
    systemState: cloneJson(systemState || current.systemState || null),
    locks: isActive ? cloneJson(state.locks || {}) : cloneJson(current.locks || {}),
    generatedAt: isActive ? (state.generatedAt || current.generatedAt || null) : (current.generatedAt || null),
    editedAt: now,
    canonizedAt: isActive ? (state.canonizedAt || current.canonizedAt || null) : (current.canonizedAt || null),
    lastExportAt: isActive ? (state.lastExportAt || current.lastExportAt || null) : (current.lastExportAt || null),
    narrativeDrift: current.narrativeDrift || null,
    exportState: current.exportState || null,
  };
}

function campaignStateForWorldPulse(state, save, systemState, now, result) {
  const base = campaignStateForRegionalImpact(state, save, systemState, now);
  return {
    ...base,
    worldPulse: {
      lastTick: result?.tick ?? null,
      lastInterval: result?.interval || null,
      updatedAt: now,
    },
  };
}

function appendWizardNewsForGraphChange(campaign, beforeGraph, afterGraph, options = {}) {
  if (!campaign) return;
  const feed = ensureWizardNewsFeed(campaign.wizardNews);
  const entries = deriveWizardNewsEntriesFromGraphChange(beforeGraph, afterGraph, {
    tick: feed.currentTick,
    ...options,
  });
  // Reuse the action's timestamp (threaded as createdAt) so one store action
  // stamps one instant everywhere instead of several wall-clock reads.
  campaign.wizardNews = appendWizardNewsEntries(feed, entries, { now: options.createdAt });
}

function ensureCampaignWizardNews(campaign) {
  if (!campaign) return null;
  campaign.wizardNews = ensureWizardNewsFeed(campaign.wizardNews);
  return campaign.wizardNews;
}

// The honest clock for stamping a regionally-applied condition's
// triggeredAt.tick: a canonized world's authoritative worldState.tick,
// otherwise the impact-aging feed clock (pulses resync the two, so the
// feed clock is the best available pre-canon source).
function campaignClockTick(campaign) {
  if (!campaign) return 0;
  if (campaign.worldState?.canonizedAt) {
    const tick = Number(campaign.worldState.tick);
    if (Number.isFinite(tick)) return Math.max(0, Math.floor(tick));
  }
  return ensureWizardNewsFeed(campaign.wizardNews).currentTick;
}

/** Migrate a single campaign object to the current schema */
function migrateCampaign(camp) {
  if (!camp || typeof camp !== 'object') return camp;
  const next = { ...camp };
  if (!isUuid(next.id)) next.id = newCampaignId();
  if (camp.mapState) next.mapState = migrateMapState(camp.mapState);
  if (next.regionalGraph) next.regionalGraph = ensureRegionalGraph(next.regionalGraph);
  next.wizardNews = ensureWizardNewsFeed(next.wizardNews);
  next.worldState = ensureWorldState(next.worldState, next);
  next.accessState = next.accessState || 'active';
  return next;
}

function findActiveCampaign(campaigns, campaignId) {
  const campaign = campaigns.find(item => item.id === campaignId);
  return isCampaignActive(campaign) ? campaign : null;
}

function campaignSettlements(state, campaignId) {
  const c = findActiveCampaign(state.campaigns, campaignId);
  if (!c) return [];
  const ids = new Set(c.settlementIds || []);
  return (state.savedSettlements || []).filter(save => ids.has(save.id));
}

function applyWorldPulseResultToState(state, campaign, result, now) {
  const persistUpdates = [];
  const updates = Array.isArray(result?.settlementUpdates) ? result.settlementUpdates : [];
  // Crisis-triple sync (Wave 8 #4 — the asymmetry the D-wave deferred, owner
  // decision: SYNC IT): roaming stressors the pulse resolved ORGANICALLY
  // wind down their origin settlement's local representations — the stress
  // entry, the promoted condition (eased per the event-resolution
  // semantics), and the stressorEdits suppression — through the same
  // lifecycle the RESOLVE_STRESSOR event uses, applied here through the
  // pulse's settlementUpdates mechanism BEFORE systemState derives, so the
  // dossier stops showing a crisis the world already ended. Only the pulse
  // result carries resolvedStressors; proposal/party results pass through
  // untouched. Deterministic; identity no-op for settlements with no local
  // match (most pulse-born crises never had one).
  const resolvedRoaming = Array.isArray(result?.resolvedStressors) ? result.resolvedStressors : [];
  for (const update of updates) {
    const saveIdx = state.savedSettlements.findIndex(save =>
      String(save.id) === String(update.saveId)
    );
    if (saveIdx === -1) continue;

    const save = state.savedSettlements[saveIdx];
    let nextSettlement = update.settlement || save.settlement;
    if (resolvedRoaming.length && nextSettlement) {
      nextSettlement = withOrganicStressorResolution(nextSettlement, resolvedRoaming, save.id);
    }
    let systemState = save.campaignState?.systemState || null;
    try {
      systemState = deriveSystemState(nextSettlement);
    } catch (e) {
      console.warn('[campaignSlice] deriveSystemState failed for world pulse', e);
    }
    const campaignState = campaignStateForWorldPulse(state, save, systemState, now, result);
    const nextSave = {
      ...save,
      settlement: nextSettlement,
      campaignState,
      timestamp: now,
    };
    state.savedSettlements[saveIdx] = nextSave;

    if (state.activeSaveId && String(state.activeSaveId) === String(save.id)) {
      state.settlement = nextSettlement;
      state.systemState = systemState;
      state.editedAt = now;
    }

    persistUpdates.push({
      saveId: save.id,
      settlement: cloneJson(nextSettlement),
      campaignState: cloneJson(campaignState),
    });
  }

  campaign.worldState = ensureWorldState(result.worldState, campaign);
  campaign.regionalGraph = ensureRegionalGraph(result.regionalGraph, { now });
  campaign.wizardNews = ensureWizardNewsFeed(result.wizardNews, { now });
  campaign.updatedAt = now;
  return persistUpdates;
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

export const createCampaignSlice = (set, get) => {
  // Route module-scoped persist failures into store state so the UI can warn the
  // user instead of silently losing a cloud save.
  _reportPersistFailure = () => set(state => {
    state.campaignSyncError = 'Some campaign changes could not be saved to the cloud. '
      + 'They are applied locally but may not persist — check your connection, then reopen the campaign to confirm.';
  });

  return {
  // ── State ──────────────────────────────────────────────────────────────────
  campaigns: [],
  campaignsLoaded: false,
  /** The currently-loaded campaign id (null if none) — used by WorldMap */
  activeCampaignId: null,
  /** Set when a cloud save of campaign/save state fails; surfaced as a banner.
   *  null when the last persist succeeded (or was cleared by the user). */
  campaignSyncError: null,
  /** Dismiss the cloud-sync warning banner. */
  clearCampaignSyncError: () => set(state => { state.campaignSyncError = null; }),

  // ── Actions ────────────────────────────────────────────────────────────────

  loadCampaigns: () => {
    const ownerId = campaignCacheOwner(get());
    const cached = localLoad(ownerId);
    set(state => {
      state.campaigns = cached;
      state.campaignsLoaded = !campaignService.isConfigured;
    });
    if (!campaignService.isConfigured) return Promise.resolve(cached);
    return campaignService.list()
      .then(remote => {
        // Stale-owner guard: a sign-out/sign-in completing mid-flight would
        // otherwise write the previous user's campaigns into state/cache.
        if (campaignCacheOwner(get()) !== ownerId) return get().campaigns;
        const migratedRemote = remote.map(migrateCampaign);
        primeCampaignSync(migratedRemote);
        // Read tombstones HERE (at list()-resolve), not at load start: a delete
        // that ran while list() was in flight has by now written its tombstone,
        // and that is exactly the same-device race we must not lose to.
        const tombstones = campaignService.loadTombstones(ownerId);
        const merged = mergeCampaignLists(cached, migratedRemote, { tombstones });
        const prunedTombstones = reconcileTombstones(tombstones, migratedRemote);
        if (prunedTombstones.length !== tombstones.length) {
          campaignService.writeTombstones(prunedTombstones, ownerId);
        }
        set(state => {
          state.campaigns = merged;
          state.campaignsLoaded = true;
        });
        localWrite(merged, ownerId);
        syncCampaignChanges(merged, { service: campaignService }).catch(e => {
          console.warn('[campaignSlice] campaign cloud backfill failed', e);
        });
        return merged;
      })
      .catch(error => {
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
      clearCampaignSyncBookkeeping();
    }),

  createCampaign: (name) => {
    const current = get();
    const role = current.auth?.role;
    const canCreate = current.auth?.tier === 'premium' || role === 'developer' || role === 'admin';
    if (!canCreate) return null;
    const id = newCampaignId();
    set(state => {
      const campaign = {
        id,
        name: String(name || '').trim() || 'Untitled Campaign',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settlementIds: [],
        mapState: null,
        regionalGraph: ensureRegionalGraph(),
        wizardNews: ensureWizardNewsFeed(),
        worldState: ensureWorldState(null, { id, name }),
        collapsed: false,
        accessState: 'active',
        // Never-synced marker: this campaign lives only on this device until a
        // cloud upsert confirms it. mergeCampaignLists keeps a local-only
        // campaign (absent from remote) only while this is truthy, and clears
        // it to false once the cloud confirms the row — see campaignSync.js.
        pendingSync: true,
      };
      state.campaigns.unshift(campaign);
      persistCampaignState(state, id);
    });
    return id;
  },

  renameCampaign: (id, name) =>
    set(state => {
      const c = findActiveCampaign(state.campaigns, id);
      if (!c) return;
      c.name = String(name || '').trim() || c.name;
      c.updatedAt = new Date().toISOString();
      persistCampaignState(state, id);
    }),

  deleteCampaign: (id) =>
    set(state => {
      const campaign = findActiveCampaign(state.campaigns, id);
      if (!campaign) return;
      state.campaigns = state.campaigns.filter(c => c.id !== id);
      if (state.activeCampaignId === id) state.activeCampaignId = null;
      deletePersistedCampaignState(state, id);
    }),

  toggleCampaignCollapsed: (id) =>
    set(state => {
      const c = findActiveCampaign(state.campaigns, id);
      if (!c) return;
      c.collapsed = !c.collapsed;
      persistCampaignState(state, id);
    }),

  addToCampaign: (campaignId, settlementId) =>
    set(state => {
      const target = findActiveCampaign(state.campaigns, campaignId);
      if (!target) return;
      const now = new Date().toISOString();
      const changedIds = new Set();
      for (const c of state.campaigns) {
        if (!isCampaignActive(c)) continue;
        const before = c.settlementIds || [];
        const next = before.filter(id => id !== settlementId);
        if (next.length !== before.length) {
          c.settlementIds = next;
          c.updatedAt = now;
          changedIds.add(c.id);
        }
      }
      target.settlementIds = Array.isArray(target.settlementIds) ? target.settlementIds : [];
      if (!target.settlementIds.includes(settlementId)) target.settlementIds.push(settlementId);
      target.updatedAt = now;
      changedIds.add(target.id);
      persistCampaignState(state, Array.from(changedIds));
    }),

  removeFromCampaign: (campaignId, settlementId) =>
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      c.settlementIds = c.settlementIds.filter(id => id !== settlementId);
      c.updatedAt = new Date().toISOString();
      persistCampaignState(state, campaignId);
    }),

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
      const clean = JSON.parse(JSON.stringify(source || {}));
      c.mapState = {
        schemaVersion: SCHEMA_VERSION,
        fmgSnapshot: clean.fmgSnapshot || null,
        seed:        clean.seed ?? null,
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

  /** Ensure a campaign has the current regional graph envelope. */
  ensureCampaignRegionalGraph: (campaignId) => {
    let graph = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      c.regionalGraph = ensureRegionalGraph(c.regionalGraph);
      ensureCampaignWizardNews(c);
      c.updatedAt = new Date().toISOString();
      graph = c.regionalGraph;
      persistCampaignState(state, campaignId);
    });
    return graph;
  },

  /**
   * Rebuild the structural graph from campaign settlements. Existing channel
   * curation (status — confirmed/dormant/disabled all sticky — visibility,
   * confirmedAt, original discoveredAt) is preserved; discovery only refreshes
   * measurements and adds suggested P0 channels for new pairs.
   */
  rebuildCampaignRegionalGraph: (campaignId, options = {}) => {
    const { discover = true } = options;
    let graph = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const now = new Date().toISOString();
      const saves = campaignSettlements(state, campaignId);
      c.regionalGraph = discover
        ? deriveGraphWithDiscoveredCandidates(saves, c.regionalGraph, { now })
        : deriveRegionalGraphFromSaves(saves, c.regionalGraph, { now });
      ensureCampaignWizardNews(c);
      c.updatedAt = now;
      graph = c.regionalGraph;
      persistCampaignState(state, campaignId);
    });
    return graph;
  },

  discoverCampaignRegionalChannels: (campaignId) => {
    return get().rebuildCampaignRegionalGraph(campaignId, { discover: true });
  },

  setRegionalChannelStatus: (campaignId, channelId, status) => {
    let graph = null;
    let channelEvent = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const now = new Date().toISOString();
      const beforeGraph = ensureRegionalGraph(c.regionalGraph);
      const before = (beforeGraph.channels || []).find(ch => ch.id === channelId);
      if (before) {
        channelEvent = {
          channel_type: before.type || 'unknown',
          from_status: before.status || 'unknown',
          to_status: status,
        };
      }
      c.regionalGraph = domainSetRegionalChannelStatus(c.regionalGraph, channelId, status, { now });
      ensureCampaignWizardNews(c);
      c.updatedAt = now;
      graph = c.regionalGraph;
      persistCampaignState(state, campaignId);
    });
    if (channelEvent) track(EVENTS.REGIONAL_CHANNEL_STATUS_CHANGED, channelEvent);
    return graph;
  },

  setRegionalChannelVisibility: (campaignId, channelId, visibility) => {
    let graph = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const now = new Date().toISOString();
      c.regionalGraph = domainSetRegionalChannelVisibility(c.regionalGraph, channelId, visibility, { now });
      ensureCampaignWizardNews(c);
      c.updatedAt = now;
      graph = c.regionalGraph;
      persistCampaignState(state, campaignId);
    });
    return graph;
  },

  /**
   * Register an authored stressor as a ROAMING world-pulse stressor. The
   * APPLY_STRESSOR canon event bridges here (settlementSlice.applyEvent) so
   * an authored crisis doesn't just sit on the dossier — the world pulse
   * ages it: decay, counterforces, synergies, spread, echoes, aftermath.
   * Upserts by stable stressor id (same byId pattern applyWorldPulse uses),
   * so re-applying the same crisis at the same settlement overwrites rather
   * than stacks.
   */
  injectCampaignStressor: (campaignId, stressor) => {
    let injected = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const now = new Date().toISOString();
      const worldState = ensureWorldState(c.worldState, c);
      const normalized = normalizeStressor({ ...stressor, createdAt: now, updatedAt: now });
      const byId = new Map((worldState.stressors || []).map(s => [s.id, s]));
      byId.set(normalized.id, normalized);
      c.worldState = { ...worldState, stressors: [...byId.values()] };
      c.updatedAt = now;
      injected = normalized;
      persistCampaignState(state, campaignId);
    });
    return injected;
  },

  /**
   * Resolve the ROAMING twin of an authored stressor. The RESOLVE_STRESSOR
   * canon event bridges here (settlementSlice.applyEvent), mirroring
   * injectCampaignStressor: the authored type is alias-mapped through
   * pulseTypeForStressorKey, the matching ACTIVE stressor affecting the
   * settlement resolves through the same directed path the party-impact hook
   * uses (resolveStressorById — no roll, echo retained), and its residual
   * aftermath is queued as pending world-pulse proposals (the outcome shape
   * applyWorldPulseProposal already consumes) rather than silently written
   * onto saves. `now` is threaded from the caller's minted timestamp so the
   * apply stamps one instant everywhere.
   *
   * @param {string} campaignId
   * @param {{ type?: string, settlementId?: string|number, now?: string|null }} [args]
   */
  resolveCampaignStressor: (campaignId, { type, settlementId, now = null } = {}) => {
    let resolved = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const stamp = now || new Date().toISOString();
      const worldState = ensureWorldState(c.worldState, c);
      const roamingType = pulseTypeForStressorKey(type) || type;
      if (!roamingType) return;
      const sid = String(settlementId || '');
      const match = (worldState.stressors || [])
        .map(raw => normalizeStressor(raw))
        .find(st => st.status === 'active'
          && String(st.type).toLowerCase() === String(roamingType).toLowerCase()
          && (String(st.originSettlementId || '') === sid
            || (st.affectedSettlementIds || []).map(String).includes(sid)));
      if (!match) return;
      const tick = Math.max(0, Math.floor(Number(worldState.tick) || 0));
      const result = resolveStressorById(worldState.stressors, match.id, {
        tick,
        now: stamp,
        reason: 'Resolved by DM authoring',
        emitResidual: true,
      });
      if (!result.found) return;
      let nextWorldState = { ...worldState, stressors: result.stressors };
      for (const outcome of result.residualOutcomes) {
        nextWorldState = upsertProposal(nextWorldState, {
          id: proposalIdFor(outcome, tick),
          status: 'pending',
          createdAt: stamp,
          updatedAt: stamp,
          tick,
          outcome: cloneJson(outcome),
          headline: outcome.headline,
          summary: outcome.summary,
          severity: outcome.severity,
          reasons: outcome.reasons || [],
        });
      }
      c.worldState = nextWorldState;
      c.updatedAt = stamp;
      resolved = result.resolved[0] || null;
      persistCampaignState(state, campaignId);
    });
    return resolved;
  },

  /**
   * The crisis twin directive's INVERSE, for undoLastEvent: put the roaming
   * twin back the way it was before the undone event's directive touched it.
   * The caller passes the declarative withdrawal crisisLifecycle.crisisWithdraw
   * composed from the popped log entry ({ action, type, twin }); the legacy
   * eventType vocabulary is still accepted for older callers.
   *
   * 'withdraw' (onset undone) — the inject directive upserted the twin:
   * withdraw it, but ONLY while it still looks directive-born and unevolved
   * (active, originating here, not spread beyond this settlement). Once the
   * pulse has spread it the crisis has a life of its own — leave it and say
   * so on the console rather than silently rewrite world history. When the
   * pre-event snapshot (`twin`, stamped on logEntry.undo by applyEvent)
   * holds an earlier stressor the upsert overwrote, that copy is restored
   * instead.
   *
   * 'restore' (resolution undone) — the resolve directive resolved the twin
   * into an echo and queued its residual aftermath: restore the snapshotted
   * pre-resolution twin over the echo (same stable id) and drop the still-
   * PENDING residual proposals that resolution queued. No snapshot (a legacy
   * log entry) → nothing restorable; a re-ignited ACTIVE stressor already
   * under the id is left alone.
   *
   * @param {string} campaignId
   * @param {{ action?: 'withdraw'|'restore', eventType?: string, type?: string, settlementId?: string|number, twin?: Object|null }} [args]
   * @returns {boolean} whether the world state changed
   */
  undoCampaignStressorBridge: (campaignId, { action, eventType, type, settlementId, twin = null } = {}) => {
    let changed = false;
    const act = action
      || (eventType === 'APPLY_STRESSOR' ? 'withdraw'
        : eventType === 'RESOLVE_STRESSOR' ? 'restore'
          : null);
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const now = new Date().toISOString();
      const worldState = ensureWorldState(c.worldState, c);
      const roamingType = pulseTypeForStressorKey(type) || type;
      if (!roamingType) return;
      const sid = String(settlementId || '');
      const stressors = (worldState.stressors || []).map(raw => normalizeStressor(raw));
      const sameType = st => String(st.type).toLowerCase() === String(roamingType).toLowerCase();

      if (act === 'withdraw') {
        const current = stressors.find(st => st.status === 'active'
          && sameType(st)
          && String(st.originSettlementId || '') === sid);
        if (!current) return;
        if ((current.affectedSettlementIds || []).map(String).some(id => id !== sid)) {
          console.debug(`[campaignSlice] undo left roaming stressor ${current.id} in place — the pulse has spread it beyond ${sid}.`);
          return;
        }
        const remaining = stressors.filter(st => st.id !== current.id);
        c.worldState = {
          ...worldState,
          stressors: twin ? [...remaining, normalizeStressor(cloneJson(twin))] : remaining,
        };
      } else if (act === 'restore') {
        if (!twin) {
          console.debug(`[campaignSlice] undo could not un-resolve the roaming ${roamingType} twin at ${sid} — the log entry predates the twin snapshot.`);
          return;
        }
        const restored = normalizeStressor(cloneJson(twin));
        const occupant = stressors.find(st => st.id === restored.id);
        if (occupant && occupant.status === 'active') {
          console.debug(`[campaignSlice] undo left roaming stressor ${occupant.id} in place — it re-ignited after the undone resolution.`);
          return;
        }
        // Replace the echo (same stable id — echoOf coalesces on it) with the
        // pre-resolution twin, and drop the resolution's queued aftermath:
        // residualOutcome stamps the twin's id on the proposal's condition.
        c.worldState = {
          ...worldState,
          stressors: [...stressors.filter(st => !(st.id === restored.id
            || (st.status === 'residual' && sameType(st) && String(st.originSettlementId || '') === sid))), restored],
          proposals: (worldState.proposals || []).filter(p => !(p.status === 'pending'
            && p.outcome?.candidateType === 'stressor_residual'
            && String(p.outcome?.condition?.triggeredAt?.sourceEventTargetId || '') === restored.id)),
        };
      } else {
        return;
      }
      c.updatedAt = now;
      changed = true;
      persistCampaignState(state, campaignId);
    });
    return changed;
  },

  setCampaignRegionalGraph: (campaignId, regionalGraph) => {
    let graph = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const now = new Date().toISOString();
      const beforeGraph = ensureRegionalGraph(c.regionalGraph);
      c.regionalGraph = ensureRegionalGraph(regionalGraph);
      appendWizardNewsForGraphChange(c, beforeGraph, c.regionalGraph, { createdAt: now });
      c.updatedAt = now;
      graph = c.regionalGraph;
      persistCampaignState(state, campaignId);
    });
    return graph;
  },

  queueCampaignRegionalImpacts: (campaignId, impacts = []) => {
    let graph = null;
    let queued = false;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const now = new Date().toISOString();
      const beforeGraph = ensureRegionalGraph(c.regionalGraph);
      c.regionalGraph = queueRegionalImpacts(beforeGraph, impacts, { now });
      appendWizardNewsForGraphChange(c, beforeGraph, c.regionalGraph, { createdAt: now });
      c.updatedAt = now;
      graph = c.regionalGraph;
      queued = true;
      persistCampaignState(state, campaignId);
    });
    if (queued) {
      track(EVENTS.REGIONAL_IMPACT_QUEUED, {
        count: Array.isArray(impacts) ? impacts.length : 0,
        channel_types: channelTypesFromImpacts(impacts),
      });
    }
    return graph;
  },

  setRegionalImpactStatus: (campaignId, impactId, status, patch = {}) => {
    let graph = null;
    let impactEvent = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const now = new Date().toISOString();
      const beforeGraph = ensureRegionalGraph(c.regionalGraph);
      const impact = (beforeGraph.queuedImpacts || []).find(i => i.id === impactId);
      if (impact) impactEvent = { to_status: status, channel_type: impact.channelType || 'unknown' };
      c.regionalGraph = domainSetRegionalImpactStatus(beforeGraph, impactId, status, patch, { now });
      appendWizardNewsForGraphChange(c, beforeGraph, c.regionalGraph, { createdAt: now });
      c.updatedAt = now;
      graph = c.regionalGraph;
      persistCampaignState(state, campaignId);
    });
    if (impactEvent) track(EVENTS.REGIONAL_IMPACT_STATUS_CHANGED, impactEvent);
    return graph;
  },

  ignoreQueuedRegionalImpact: (campaignId, impactId) => {
    return get().setRegionalImpactStatus(campaignId, impactId, 'ignored');
  },

  advanceCampaignRegionalImpacts: (campaignId, ticks = 1, options = {}) => {
    let graph = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const now = options.now || new Date().toISOString();
      const beforeGraph = ensureRegionalGraph(c.regionalGraph);
      c.wizardNews = advanceWizardNewsFeed(c.wizardNews, ticks, { now });
      c.regionalGraph = advanceRegionalImpacts(beforeGraph, ticks, {
        ...options,
        currentTick: c.wizardNews.currentTick,
        now,
      });
      appendWizardNewsForGraphChange(c, beforeGraph, c.regionalGraph, {
        tick: c.wizardNews.currentTick,
        createdAt: now,
      });
      c.updatedAt = now;
      graph = c.regionalGraph;
      persistCampaignState(state, campaignId);
    });
    return graph;
  },

  previewCampaignWorldPulse: (campaignId, interval = 'one_month', options = {}) => {
    const state = get();
    const campaign = findActiveCampaign(state.campaigns, campaignId);
    if (!campaign) return null;
    const previewCampaign = cloneJson(campaign);
    if (options.simulationRules) {
      previewCampaign.worldState = {
        ...(previewCampaign.worldState || {}),
        simulationRules: normalizeSimulationRules(options.simulationRules),
      };
    }
    const settlements = campaignSettlements(state, campaignId);
    const preview = domainPreviewCampaignWorldPulse({
      campaign: previewCampaign,
      saves: cloneJson(settlements),
      interval,
      now: options.now,
    });
    track(EVENTS.WORLD_PULSE_PREVIEWED, {
      interval,
      settlement_count: settlements.length,
      proposal_count: Array.isArray(preview?.proposals) ? preview.proposals.length : 0,
    });
    return preview;
  },

  canonizeCampaignWorld: async (campaignId) => {
    let campaignPersist = /** @type {any} */ (null);
    let settlementCount = 0;
    const now = new Date().toISOString();
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      settlementCount = campaignSettlements(state, campaignId).length;
      c.worldState = canonizeWorldState(c.worldState, now, c);
      c.updatedAt = now;
      campaignPersist = cacheCampaignState(state);
    });
    if (campaignPersist) {
      track(EVENTS.WORLD_CANONIZED, { settlement_count: settlementCount });
      await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
    }
    return campaignPersist?.snapshot?.find(c => c.id === campaignId)?.worldState || null;
  },

  updateCampaignSimulationRules: async (campaignId, patch = {}) => {
    let campaignPersist = /** @type {any} */ (null);
    const now = new Date().toISOString();
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const worldState = ensureWorldState(c.worldState, c);
      c.worldState = {
        ...worldState,
        simulationRules: normalizeSimulationRules({
          ...(worldState.simulationRules || {}),
          ...(patch || {}),
        }),
      };
      c.updatedAt = now;
      campaignPersist = cacheCampaignState(state);
    });
    if (campaignPersist) {
      track(EVENTS.SIMULATION_RULES_UPDATED, {
        changed_keys: Object.keys(patch || {}).sort(),
      });
      await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
    }
    return campaignPersist?.snapshot?.find(c => c.id === campaignId)?.worldState?.simulationRules || null;
  },

  advanceCampaignWorld: async (campaignId, interval = 'one_month', options = {}) => {
    let result = /** @type {any} */ (null);
    let persistUpdates = [];
    let campaignPersist = /** @type {any} */ (null);
    /** Saves to fingerprint after a successful pulse (cap 5). Collected inside
     *  set() but used after, so the snapshot reflects post-apply settlements. */
    let fingerprintSaves = [];
    const now = options.now || new Date().toISOString();
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const worldState = ensureWorldState(c.worldState, c);
      if (!worldState.canonizedAt) {
        result = { ok: false, reason: 'world_not_canonized' };
        return;
      }
      result = domainAdvanceCampaignWorld({
        campaign: cloneJson(c),
        saves: cloneJson(campaignSettlements(state, campaignId)),
        interval,
        now,
      });
      if (!result) return;
      persistUpdates = applyWorldPulseResultToState(state, c, result, now);
      campaignPersist = cacheCampaignState(state);
      // Collect the affected saves (post-apply) for the research fingerprint,
      // capped at 5 per pulse so a large constellation doesn't flood capture.
      const affectedIds = (Array.isArray(result.settlementUpdates) ? result.settlementUpdates : [])
        .map(u => String(u.saveId));
      const affected = new Set(affectedIds);
      fingerprintSaves = (state.savedSettlements || [])
        .filter(save => affected.has(String(save.id)))
        .slice(0, 5)
        .map(save => ({ id: save.id, settlement: cloneJson(save.settlement), save: { id: save.id, campaignState: cloneJson(save.campaignState) } }));
    });

    // Fire-and-forget analytics — additive, after state has settled.
    if (result && result.ok === false && result.reason === 'world_not_canonized') {
      track(EVENTS.WORLD_PULSE_BLOCKED, { reason: 'world_not_canonized' });
    } else if (result && campaignPersist) {
      track(EVENTS.WORLD_PULSE_ADVANCED, {
        interval: result.interval || interval,
        tick_after: Number.isFinite(result.tick) ? result.tick : null,
        events_applied_count: Array.isArray(result.autoApplied) ? result.autoApplied.length : 0,
        new_stressor_count: countNewStressorsAtTick(result.worldState, result.tick),
        resolved_stressor_count: Array.isArray(result.resolvedStressors) ? result.resolvedStressors.length : 0,
      });
      for (const entry of fingerprintSaves) {
        captureFingerprint('pulse_advanced', entry.settlement, {
          save: entry.save,
          settlementUuid: String(entry.id),
        });
      }
    }

    await flushWorldPulsePersist({ result, campaignPersist, persistUpdates, campaignId });
    return result;
  },

  applyWorldPulseProposal: async (campaignId, proposalId) => {
    let result = /** @type {any} */ (null);
    let persistUpdates = [];
    let campaignPersist = /** @type {any} */ (null);
    let proposalType = 'unknown';
    const now = new Date().toISOString();
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      // Read-only lookup of the to-be-applied proposal for its coarse type enum.
      const proposal = (c.worldState?.proposals || []).find(p => p.id === proposalId);
      proposalType = proposalTypeOf(proposal);
      result = domainApplyWorldPulseProposal({
        campaign: cloneJson(c),
        saves: cloneJson(campaignSettlements(state, campaignId)),
        proposalId,
        now,
      });
      if (!result) return;
      persistUpdates = applyWorldPulseResultToState(state, c, result, now);
      campaignPersist = cacheCampaignState(state);
    });

    if (result && campaignPersist) {
      track(EVENTS.WORLD_PULSE_PROPOSAL_APPLIED, { proposal_type: proposalType });
    }
    await flushWorldPulsePersist({ result, campaignPersist, persistUpdates, campaignId });
    return result;
  },

  // Party as first-class actor: inject the consequences of a party action
  // (resolve a stressor, broker/inflame a relationship, clear/impose a
  // condition, move a faction/NPC) as an authoritative, party-tagged pulse
  // input. Persists like advanceCampaignWorld.
  recordPartyImpact: async (campaignId, action) => {
    let result = /** @type {any} */ (null);
    let persistUpdates = [];
    let campaignPersist = /** @type {any} */ (null);
    const now = new Date().toISOString();
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      result = domainApplyPartyImpact({
        campaign: cloneJson(c),
        saves: cloneJson(campaignSettlements(state, campaignId)),
        action,
        now,
      });
      if (!result) return;
      persistUpdates = applyWorldPulseResultToState(state, c, result, now);
      campaignPersist = cacheCampaignState(state);
    });

    if (result && campaignPersist) {
      track(EVENTS.PARTY_IMPACT_RECORDED, { action_type: action?.kind || 'unknown' });
    }
    await flushWorldPulsePersist({ result, campaignPersist, persistUpdates, campaignId });
    return result;
  },

  dismissWorldPulseProposal: async (campaignId, proposalId) => {
    let proposal = /** @type {any} */ (null);
    let campaignPersist = /** @type {any} */ (null);
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const now = new Date().toISOString();
      c.worldState = domainUpdateWorldPulseProposalStatus(
        ensureWorldState(c.worldState, c),
        proposalId,
        'dismissed',
        { dismissedAt: now },
      );
      proposal = c.worldState.proposals.find(item => item.id === proposalId) || null;
      c.updatedAt = now;
      campaignPersist = cacheCampaignState(state);
    });
    if (proposal && campaignPersist) await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
    return proposal;
  },

  applyQueuedRegionalImpact: (campaignId, impactId) => {
    let result = /** @type {any} */ (null);
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const graph = ensureRegionalGraph(c.regionalGraph);
      const impact = graph.queuedImpacts.find(i => i.id === impactId);
      if (!impact || !isRegionalImpactAvailable(impact)) return;

      const saveIdx = state.savedSettlements.findIndex(save =>
        String(save.id) === String(impact.targetSettlementId)
      );
      if (saveIdx === -1) return;

      const save = state.savedSettlements[saveIdx];
      // No options meant conditionFromRegionalImpact fell back to tick 0:
      // every regionally-applied condition claimed triggeredAt.tick 0
      // forever. Stamp the campaign clock instead (batch apply reuses this
      // action per impact, so it inherits the stamp).
      const nextSettlement = applyRegionalImpact(save.settlement, impact, { tick: campaignClockTick(c) });
      if (!nextSettlement) return;

      const now = new Date().toISOString();
      let systemState = save.campaignState?.systemState || null;
      try {
        systemState = deriveSystemState(nextSettlement);
      } catch (e) {
        console.warn('[campaignSlice] deriveSystemState failed for regional impact', e);
      }

      const campaignState = campaignStateForRegionalImpact(state, save, systemState, now);
      const nextSave = {
        ...save,
        settlement: nextSettlement,
        campaignState,
        timestamp: now,
      };
      state.savedSettlements[saveIdx] = nextSave;

      if (state.activeSaveId && String(state.activeSaveId) === String(save.id)) {
        state.settlement = nextSettlement;
        state.systemState = systemState;
        state.editedAt = now;
      }

      const beforeGraph = graph;
      c.regionalGraph = domainSetRegionalImpactStatus(beforeGraph, impactId, 'applied', { appliedAt: now }, { now });
      appendWizardNewsForGraphChange(c, beforeGraph, c.regionalGraph, { createdAt: now });
      c.updatedAt = now;
      persistCampaignState(state, campaignId);

      result = {
        saveId: save.id,
        settlement: cloneJson(nextSettlement),
        campaignState: cloneJson(campaignState),
        timestamp: now,
        impact: cloneJson(impact),
      };
    });

    if (result) {
      persistSaveUpdate(result.saveId, {
        settlement: result.settlement,
        campaignState: result.campaignState,
      });
    }
    return result;
  },

  resolveRegionalImpact: (campaignId, impactId) => {
    let result = /** @type {any} */ (null);
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const graph = ensureRegionalGraph(c.regionalGraph);
      const impact = graph.queuedImpacts.find(i => i.id === impactId);
      if (!impact || impact.status !== 'applied') return;

      const saveIdx = state.savedSettlements.findIndex(save =>
        String(save.id) === String(impact.targetSettlementId)
      );
      if (saveIdx === -1) return;

      const save = state.savedSettlements[saveIdx];
      const condition = conditionFromRegionalImpact(impact);
      const nextSettlement = withoutActiveCondition(save.settlement, condition.id);
      const now = new Date().toISOString();
      let systemState = save.campaignState?.systemState || null;
      try {
        systemState = deriveSystemState(nextSettlement);
      } catch (e) {
        console.warn('[campaignSlice] deriveSystemState failed while resolving regional impact', e);
      }

      const campaignState = campaignStateForRegionalImpact(state, save, systemState, now);
      const nextSave = {
        ...save,
        settlement: nextSettlement,
        campaignState,
        timestamp: now,
      };
      state.savedSettlements[saveIdx] = nextSave;

      if (state.activeSaveId && String(state.activeSaveId) === String(save.id)) {
        state.settlement = nextSettlement;
        state.systemState = systemState;
        state.editedAt = now;
      }

      const beforeGraph = graph;
      c.regionalGraph = domainSetRegionalImpactStatus(beforeGraph, impactId, 'resolved', { resolvedAt: now }, { now });
      appendWizardNewsForGraphChange(c, beforeGraph, c.regionalGraph, { createdAt: now });
      c.updatedAt = now;
      persistCampaignState(state, campaignId);

      result = {
        saveId: save.id,
        settlement: cloneJson(nextSettlement),
        campaignState: cloneJson(campaignState),
        timestamp: now,
        impact: cloneJson(impact),
      };
    });

    if (result) {
      persistSaveUpdate(result.saveId, {
        settlement: result.settlement,
        campaignState: result.campaignState,
      });
    }
    return result;
  },

  applyAllQueuedRegionalImpacts: (campaignId) => {
    const graph = get().getCampaignRegionalGraph(campaignId);
    const ids = graph.queuedImpacts
      .filter(impact => isRegionalImpactAvailable(impact))
      .map(impact => impact.id);
    return ids
      .map(id => get().applyQueuedRegionalImpact(campaignId, id))
      .filter(Boolean);
  },

  ignoreAllQueuedRegionalImpacts: (campaignId) => {
    const graph = get().getCampaignRegionalGraph(campaignId);
    const ids = graph.queuedImpacts
      .filter(impact => impact.status === 'queued')
      .map(impact => impact.id);
    for (const id of ids) {
      get().setRegionalImpactStatus(campaignId, id, 'ignored');
    }
    return ids.length;
  },

  getCampaignRegionalGraph: (campaignId) => {
    const c = findActiveCampaign(get().campaigns, campaignId);
    return ensureRegionalGraph(c?.regionalGraph);
  },

  getCampaignWizardNews: (campaignId) => {
    const c = findActiveCampaign(get().campaigns, campaignId);
    return ensureWizardNewsFeed(c?.wizardNews);
  },

  getCampaignWorldState: (campaignId) => {
    const c = findActiveCampaign(get().campaigns, campaignId);
    return ensureWorldState(c?.worldState, c);
  },

  clearCampaignWizardNews: (campaignId) =>
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      c.wizardNews = ensureWizardNewsFeed();
      c.updatedAt = new Date().toISOString();
      persistCampaignState(state, campaignId);
    }),

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

  /** Mark a campaign as the active one (WorldMap uses this to drive reloads) */
  setActiveCampaign: (id) =>
    set(state => {
      const campaign = findActiveCampaign(state.campaigns, id);
      state.activeCampaignId = id && campaign ? id : null;
    }),

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
    return get().campaigns.find(c => isCampaignActive(c) && c.settlementIds.includes(settlementId)) || null;
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
