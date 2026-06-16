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
  deriveGraphWithDiscoveredCandidates,
  deriveRegionalGraphFromSaves,
  ensureRegionalGraph,
  ensureWizardNewsFeed,
  setRegionalChannelStatus as domainSetRegionalChannelStatus,
  setRegionalChannelVisibility as domainSetRegionalChannelVisibility,
} from '../domain/region/index.js';
import {
  advanceCampaignWorld as domainAdvanceCampaignWorld,
  applyPartyImpact as domainApplyPartyImpact,
  applyWorldPulseProposal as domainApplyWorldPulseProposal,
  canonizeWorldState,
  ensureWorldState,
  normalizeSimulationRules,
  previewCampaignWorldPulse as domainPreviewCampaignWorldPulse,
  updateProposalStatus as domainUpdateWorldPulseProposalStatus,
} from '../domain/worldPulse/index.js';
import { saves as savesService } from '../lib/saves.js';
import { campaigns as campaignService, isCampaignActive } from '../lib/campaigns.js';
import {
  mergeCampaignLists,
  primeCampaignSync,
  reconcileTombstones,
  syncCampaignChanges,
} from '../lib/campaignSync.js';
// WS4 decomposition — pure utils + persistence helpers extracted to a sibling.
import {
  cloneJson, campaignCacheOwner, localWrite, persistCampaignState,
  cacheCampaignState, syncCampaignSnapshot, deletePersistedCampaignState,
  clearCampaignSyncBookkeeping, flushWorldPulsePersist,
  initPersistFailureReporter,
  newCampaignId, isUuid, findActiveCampaign, campaignSettlements,
} from './campaignSliceShared.js';
// WS4 decomposition — world-pulse + regional state-application helpers.
import {
  ensureCampaignWizardNews, applyWorldPulseResultToState,
  capturePulseSnapshot, drainCampaignQueueIntoState,
} from './campaignPulseHelpers.js';
import { track, EVENTS } from '../lib/analytics.js';
import { captureFingerprint } from '../lib/researchCapture.js';
import { getConsent } from '../lib/consent.js';
import { enqueuePulseEffect } from '../lib/analyticsQueue.js';
import {
  extractPulseSummary, extractPulseEffects, extractStressorTransitions,
  extractProposalDecision, extractPartyImpact, extractSimulationRules,
} from '../lib/pulseFingerprint.js';
import {
  extractRegionalGraphSnapshot,
  extractRegionalChannelChange, extractRegionalArcs, extractRegionalPropagation,
} from '../lib/regionalFingerprint.js';

const SCHEMA_VERSION = 2;

/**
 * Coarse, behavior-free analytics derivations for this slice. Each is a small
 * pure helper that returns enums/counts/bands only — never names/prose/domain
 * objects — so the additive track() calls stay fire-and-forget and lint-clean
 * (analytics-props-hygiene). Wrapped at the call site is unnecessary because
 * track() itself never throws.
 */

function localLoad(ownerId = 'anon') {
  return campaignService.loadCached(ownerId).map(migrateCampaign);
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

// Campaign-clock (Phase C2): how many pre-pulse snapshots the in-memory undo
// stack retains across all campaigns. Each snapshot clones every member
// settlement, so the cap bounds session memory; a handful of undo steps per
// campaign is ample for "take back the last advance(s)".
const PULSE_UNDO_CAP = 10;

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
  // Route module-scoped persist failures (in campaignSliceShared) into store
  // state so the UI can warn the user instead of silently losing a cloud save.
  initPersistFailureReporter(() => set(state => {
    state.campaignSyncError = 'Some campaign changes could not be saved to the cloud. '
      + 'They are applied locally but may not persist — check your connection, then reopen the campaign to confirm.';
  }));

  return {
  // ── State ──────────────────────────────────────────────────────────────────
  campaigns: [],
  campaignsLoaded: false,
  /** The currently-loaded campaign id (null if none) — used by WorldMap */
  activeCampaignId: null,
  /** Campaign-clock (Phase C2): in-memory pre-pulse snapshot stack for multi-step
   *  "undo last advance". Each entry { campaignId, worldState, regionalGraph,
   *  wizardNews, saves[], active } captures the state BEFORE a world-pulse tick.
   *  Session-scoped (not persisted), mirroring mapUndoStack — heavy snapshots
   *  shouldn't bloat the campaign row; a reload starts a fresh history. */
  pulseUndoStack: [],
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

  // Project 2: import a shared MAP from the gallery into a NEW premium campaign.
  // Phase 1 = blank canvas (backdrop only — no placements/settlements), so there
  // are no settlement ids to remap. The backdrop image is COPIED into the
  // importer's own storage so it survives the sharer deleting theirs.
  importGalleryMap: async (slug) => {
    const st = get();
    const role = st.auth?.role;
    const canCreate = st.auth?.tier === 'premium' || role === 'developer' || role === 'admin';
    if (!canCreate) throw new Error('Importing maps is a premium feature.');

    const { fetchGalleryMap } = await import('../lib/gallery.js');
    const shared = await fetchGalleryMap(slug);
    if (!shared) throw new Error('That shared map is no longer available.');
    const backdrop = shared.backdrop || {};

    const mapState = { schemaVersion: 2, placements: {}, labels: [], markers: [], forests: [] };
    if (backdrop.customBackdrop?.imageUrl) {
      let imageUrl = backdrop.customBackdrop.imageUrl;
      const ownerId = st.auth?.user?.id;
      try {
        const { uploadMapBackdrop } = await import('../lib/imageUpload.js');
        const resp = await fetch(imageUrl);
        const blob = await resp.blob();
        if (ownerId && blob?.size) {
          const up = await uploadMapBackdrop(blob, { ownerId, campaignId: 'imported', contentType: blob.type });
          imageUrl = up.url;
        }
      } catch { /* fall back to referencing the shared public URL */ }
      mapState.customBackdrop = {
        imageUrl,
        w: Number(backdrop.customBackdrop.w) || 0,
        h: Number(backdrop.customBackdrop.h) || 0,
      };
    } else if (backdrop.fmgSnapshot) {
      mapState.fmgSnapshot = backdrop.fmgSnapshot;
      mapState.seed = backdrop.seed ?? null;
    } else {
      throw new Error('That shared map has no backdrop to import.');
    }

    const newId = get().createCampaign(shared.name ? `${shared.name} (imported)` : 'Imported map');
    if (!newId) throw new Error('Could not create a campaign for the imported map.');
    get().saveCampaignMap(newId, mapState);
    try { track(EVENTS.GALLERY_IMPORTED, { kind: 'map' }); } catch { /* analytics never affects import */ }
    return newId;
  },

  // Project 2, Phase 2: import a shared MAP + CAMPAIGN. Clones each member
  // settlement into the importer's own cloud saves (fresh ids), then builds a new
  // campaign whose settlementIds + placements are REMAPPED to the clones. The
  // server already returned public-safe dossiers (no worldState/regionalGraph),
  // so the importer's campaign starts with a fresh world; the only id-remap
  // surface is settlementIds + placements[].settlementId.
  importGalleryMapWithCampaign: async (slug) => {
    const st = get();
    const role = st.auth?.role;
    const canCreate = st.auth?.tier === 'premium' || role === 'developer' || role === 'admin';
    if (!canCreate) throw new Error('Importing campaigns is a premium feature.');

    const { fetchGalleryMap } = await import('../lib/gallery.js');
    const payload = await fetchGalleryMap(slug);
    if (!payload) throw new Error('That shared campaign is no longer available.');
    if (payload.kind !== 'map_with_campaign') return get().importGalleryMap(slug); // not a campaign share

    const members = Array.isArray(payload.members) ? payload.members : [];
    const sharedMap = (payload.mapState && typeof payload.mapState === 'object') ? payload.mapState : {};

    // Slot pre-flight (premium = unlimited in practice; defensive for future tiers).
    const max = (typeof st.maxSaves === 'function') ? st.maxSaves() : Infinity;
    const activeNow = (st.savedSettlements || []).length;
    if (Number.isFinite(max) && activeNow + members.length > max) {
      throw new Error(`Not enough save slots: this campaign needs ${members.length} settlement slot(s).`);
    }

    // Clone each member into the importer's cloud saves; build oldId → newId.
    const idMap = {};
    const newEntries = [];
    try {
      for (const m of members) {
        const src = (m.settlement && typeof m.settlement === 'object') ? m.settlement : {};
        const entry = {
          name: m.name || src.name || 'Imported settlement',
          tier: m.tier || src.tier,
          // Strip ALL cross-settlement refs from the clone: neighbourNetwork AND
          // neighborRelationship/interSettlementRelationships — the latter would
          // re-trigger supabaseSave's bidirectional back-link path (keyed on
          // settlement.neighborRelationship.name), wiring the clone into the
          // IMPORTER's unrelated saves. Forcing the simple-insert path is correct.
          settlement: { ...src, neighbourNetwork: [], neighborRelationship: null, interSettlementRelationships: [] },
          config: src.config || null,
          seed: src._seed || src.config?._seed || null,
          aiData: {},
          campaignState: { phase: 'canon', eventLog: [] },
          versionHistory: [],
        };
         
        // save-limit trigger + id assignment stay deterministic.
        const newSaveId = await savesService.save(entry);
        idMap[String(m.old_id)] = newSaveId;
        newEntries.push({ ...entry, id: newSaveId, savedAt: Date.now() });
      }
    } catch (err) {
      // Roll back clones already inserted so a partial import doesn't orphan saves.
      for (const oid of Object.values(idMap)) {
        try { await savesService.delete(oid); } catch { /* best-effort cleanup */ }
      }
      throw new Error('Import failed while copying settlements; partial copies were rolled back.', { cause: err });
    }
    set(state => { for (const e of newEntries) state.savedSettlements.push(e); });

    // Build the imported map: backdrop (copy image) + REMAPPED placements only.
    const mapState = { schemaVersion: 2, placements: {}, labels: [], markers: [], forests: [] };
    const sb = sharedMap.customBackdrop;
    if (sb?.imageUrl) {
      let imageUrl = sb.imageUrl;
      const ownerId = st.auth?.user?.id;
      try {
        const { uploadMapBackdrop } = await import('../lib/imageUpload.js');
        const resp = await fetch(imageUrl); const blob = await resp.blob();
        if (ownerId && blob?.size) {
          const up = await uploadMapBackdrop(blob, { ownerId, campaignId: 'imported', contentType: blob.type });
          imageUrl = up.url;
        }
      } catch { /* fall back to the shared public URL */ }
      mapState.customBackdrop = { imageUrl, w: Number(sb.w) || 0, h: Number(sb.h) || 0 };
    } else if (sharedMap.fmgSnapshot) {
      mapState.fmgSnapshot = sharedMap.fmgSnapshot;
      mapState.seed = sharedMap.seed ?? null;
    }
    const srcPlacements = (sharedMap.placements && typeof sharedMap.placements === 'object') ? sharedMap.placements : {};
    for (const [burgId, p] of Object.entries(srcPlacements)) {
      const newSid = idMap[String(p?.settlementId)];
      if (!newSid) continue; // drop placements whose member wasn't imported
      mapState.placements[burgId] = { ...p, settlementId: newSid };
    }
    mapState.labels = Array.isArray(sharedMap.labels) ? sharedMap.labels : [];
    mapState.markers = Array.isArray(sharedMap.markers) ? sharedMap.markers : [];
    mapState.forests = Array.isArray(sharedMap.forests) ? sharedMap.forests : [];

    const campaignId = get().createCampaign(payload.name ? `${payload.name} (imported)` : 'Imported campaign');
    if (!campaignId) throw new Error('Could not create the imported campaign.');
    set(state => {
      const c = state.campaigns.find(x => x.id === campaignId);
      if (c) c.settlementIds = Object.values(idMap);
    });
    get().saveCampaignMap(campaignId, mapState);
    try { track(EVENTS.GALLERY_IMPORTED, { kind: 'map_with_campaign', member_count: members.length }); } catch { /* analytics never affects import */ }
    return campaignId;
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
      // Campaign-clock: drop any queued intentions the departing settlement had,
      // at the deliberate moment of removal — otherwise they'd be silently
      // destroyed at the next tick (the drain only acts on current members).
      if (c.worldState?.pendingEvents?.length) {
        const sid = String(settlementId);
        const kept = c.worldState.pendingEvents.filter(e => String(e.saveId) !== sid);
        if (kept.length !== c.worldState.pendingEvents.length) {
          c.worldState = { ...c.worldState, pendingEvents: kept };
        }
      }
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
      // Build telemetry from the draft INSIDE set() (the channel proxy is revoked
      // after set returns). was_dm_action: this action is DM-initiated curation.
      if (before) channelEvent = extractRegionalChannelChange(before, before.status, status, true);
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
    let regionalSnapshot = /** @type {any} */ (null);
    const now = new Date().toISOString();
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      settlementCount = campaignSettlements(state, campaignId).length;
      c.worldState = canonizeWorldState(c.worldState, now, c);
      // Compute the regional-topology snapshot while the graph draft is live.
      regionalSnapshot = extractRegionalGraphSnapshot(c.regionalGraph);
      c.updatedAt = now;
      campaignPersist = cacheCampaignState(state);
    });
    if (campaignPersist) {
      track(EVENTS.WORLD_CANONIZED, { settlement_count: settlementCount });
      if (regionalSnapshot) track(EVENTS.REGIONAL_GRAPH_SNAPSHOT, regionalSnapshot);
      await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
    }
    return campaignPersist?.snapshot?.find(c => c.id === campaignId)?.worldState || null;
  },

  updateCampaignSimulationRules: async (campaignId, patch = {}) => {
    let campaignPersist = /** @type {any} */ (null);
    let normalizedRules = /** @type {any} */ (null);
    const now = new Date().toISOString();
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const worldState = ensureWorldState(c.worldState, c);
      // Build the plain rules object first so the telemetry read below is NOT an
      // Immer draft proxy (which would be revoked once set() returns).
      normalizedRules = normalizeSimulationRules({
        ...(worldState.simulationRules || {}),
        ...(patch || {}),
      });
      c.worldState = { ...worldState, simulationRules: normalizedRules };
      c.updatedAt = now;
      campaignPersist = cacheCampaignState(state);
    });
    if (campaignPersist) {
      // Emit the rule VALUES, not just the changed keys — this is the join from
      // simulation config to every subsequent pulse outcome (variance per config).
      track(EVENTS.SIMULATION_RULES_UPDATED, extractSimulationRules(normalizedRules, Object.keys(patch || {})));
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
    /** The campaign's live NPC sim-state (cloned plain inside set), so the
     *  fingerprint can surface per-settlement NPC goal/role evolution. */
    let campaignNpcStates = /** @type {any} */ (null);
    /** Queued-impact ids present BEFORE this pulse, so we can diff out the new
     *  cross-settlement propagation impacts this pulse produced. */
    let priorQueuedIds = /** @type {Set<string>} */ (null);
    /** Party-impact actions surfaced by draining party-caused queued events —
     *  replayed through recordPartyImpact AFTER the pulse (mirroring the
     *  immediate path's rippleEventThroughWorld party branch). */
    let drainedPartyImpacts = [];
    const now = options.now || new Date().toISOString();
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const worldState = ensureWorldState(c.worldState, c);
      if (!worldState.canonizedAt) {
        result = { ok: false, reason: 'world_not_canonized' };
        return;
      }
      // Campaign-clock C2: snapshot the full pre-pulse state (campaign world +
      // every member save + the live active view) BEFORE anything mutates, so
      // the advance can be reversed by undoLastPulse. Pushed to the stack only
      // after the pulse is confirmed below.
      const preSnapshot = capturePulseSnapshot(state, c, now);
      // Campaign-clock C1: drain queued player intentions into the member
      // settlements (and inject any crisis twins into worldState) BEFORE the
      // organic pulse, so every settlement's events resolve simultaneously at
      // this tick and the pulse simulates the post-intervention world. The
      // augmented worldState is written onto the draft campaign so the pulse's
      // cloneJson(c) carries the injected stressors + the cleared queue.
      const drained = drainCampaignQueueIntoState(state, c, worldState, now);
      c.worldState = drained.worldState;
      drainedPartyImpacts = drained.partyImpacts || [];
      result = domainAdvanceCampaignWorld({
        campaign: cloneJson(c),
        saves: cloneJson(campaignSettlements(state, campaignId)),
        interval,
        now,
      });
      if (!result) return;
      // The pulse landed — retain the pre-pulse snapshot for multi-step undo.
      // Cap PER campaign so churn in one campaign can't evict another's history:
      // drop only this campaign's oldest snapshot when it exceeds the cap.
      {
        const next = [...(state.pulseUndoStack || []), preSnapshot];
        const mineCount = next.reduce((n, s) => n + (s.campaignId === campaignId ? 1 : 0), 0);
        if (mineCount > PULSE_UNDO_CAP) {
          const oldestIdx = next.findIndex(s => s.campaignId === campaignId);
          if (oldestIdx !== -1) next.splice(oldestIdx, 1);
        }
        state.pulseUndoStack = next;
      }
      // Snapshot the pre-pulse queued-impact ids (primitive Set — safe to read
      // outside set) so we can isolate this pulse's NEW propagation impacts.
      priorQueuedIds = new Set((c.regionalGraph?.queuedImpacts || []).map(i => String(i.id)));
      persistUpdates = applyWorldPulseResultToState(state, c, result, now, drained.authoredEventBySave);
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
      campaignNpcStates = cloneJson(c.worldState?.npcStates) || null;
    });

    // Fire-and-forget analytics — additive, after state has settled.
    if (result && result.ok === false && result.reason === 'world_not_canonized') {
      track(EVENTS.WORLD_PULSE_BLOCKED, { reason: 'world_not_canonized' });
    } else if (result && campaignPersist) {
      // Enriched per-effect-family summary (fixes the always-0 new_stressor_count
      // bug; events_applied_count retained for back-compat with existing reads).
      track(EVENTS.WORLD_PULSE_ADVANCED, {
        ...extractPulseSummary(result, interval),
        events_applied_count: Array.isArray(result.autoApplied) ? result.autoApplied.length : 0,
      });
      // Per-type stressor transitions (research-class; gated inside track()).
      track(EVENTS.WORLD_STRESSOR_TRANSITIONS, extractStressorTransitions(result));
      // Exhaustive per-effect mutation ledger → world_pulse_effects (research only).
      if (getConsent().research) {
        const { rows } = extractPulseEffects(result);
        for (const row of rows) enqueuePulseEffect(row);
      }
      // Regional structure snapshot (research) + realm/compound arc emergence.
      const regionalSnapshot = extractRegionalGraphSnapshot(result.regionalGraph);
      if (regionalSnapshot) track(EVENTS.REGIONAL_GRAPH_SNAPSHOT, regionalSnapshot);
      const arcs = extractRegionalArcs(result);
      if (arcs.length) track(EVENTS.REGIONAL_ARC_EMERGED, { tick: Number.isFinite(result.tick) ? result.tick : null, arc_count: arcs.length, arcs });
      // Cross-settlement propagation that occurred during this pulse — the NEW
      // queued impacts (diffed against the pre-pulse graph).
      if (result.regionalGraph && priorQueuedIds) {
        const newImpacts = (result.regionalGraph.queuedImpacts || []).filter(i => !priorQueuedIds.has(String(i.id)));
        const prop = extractRegionalPropagation({ impacts: newImpacts, genesis: 'world_pulse' });
        if (prop) track(EVENTS.REGIONAL_PROPAGATION_APPLIED, prop);
      }
      for (const entry of fingerprintSaves) {
        captureFingerprint('pulse_advanced', entry.settlement, {
          save: entry.save,
          settlementUuid: String(entry.id),
          worldState: campaignNpcStates ? { npcStates: campaignNpcStates } : undefined,
        });
      }
    }

    await flushWorldPulsePersist({ result, campaignPersist, persistUpdates, campaignId });
    // Replay party-caused queued events through the party-impact pipeline — the
    // drain surfaced them; this mirrors the immediate path's rippleEventThroughWorld
    // party branch (faction/NPC world state, condition resolution, Wizard News).
    // Best-effort: the world half never blocks the advance, and the pre-pulse
    // snapshot already covers these for undo (they land after the snapshot).
    if (result && result.ok !== false && drainedPartyImpacts.length
        && typeof get().recordPartyImpact === 'function') {
      for (const pi of drainedPartyImpacts) {
        try { await get().recordPartyImpact(campaignId, pi.action); } catch { /* best-effort */ }
      }
    }
    return result;
  },

  applyWorldPulseProposal: async (campaignId, proposalId) => {
    let result = /** @type {any} */ (null);
    let persistUpdates = [];
    let campaignPersist = /** @type {any} */ (null);
    let appliedDecision = /** @type {any} */ (null);
    const now = new Date().toISOString();
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      // Build the decision telemetry INSIDE set() — the proposal is an Immer
      // draft proxy that is revoked once set() returns; the extractor flattens
      // it to a plain enum/band object that survives.
      const proposal = (c.worldState?.proposals || []).find(p => p.id === proposalId) || null;
      appliedDecision = extractProposalDecision(proposal, 'applied');
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
      track(EVENTS.WORLD_PULSE_PROPOSAL_APPLIED, appliedDecision);
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
      track(EVENTS.PARTY_IMPACT_RECORDED, {
        action_type: action?.kind || 'unknown', // retained for back-compat
        ...extractPartyImpact(action, result),
      });
    }
    await flushWorldPulsePersist({ result, campaignPersist, persistUpdates, campaignId });
    return result;
  },

  dismissWorldPulseProposal: async (campaignId, proposalId) => {
    let proposal = /** @type {any} */ (null);
    let dismissDecision = /** @type {any} */ (null);
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
      // Flatten the draft proxy to plain telemetry before set() revokes it.
      dismissDecision = proposal ? extractProposalDecision(proposal, 'dismissed') : null;
      c.updatedAt = now;
      campaignPersist = cacheCampaignState(state);
    });
    if (dismissDecision && campaignPersist) {
      // The BLOCK half of the permission flow — previously emitted nothing, so
      // accept-vs-block ratio (what DMs let in vs reject) was unmeasurable.
      track(EVENTS.WORLD_PULSE_PROPOSAL_DISMISSED, dismissDecision);
      await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
    }
    return proposal;
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

  /** Campaign-clock (Phase C2): is there a pre-pulse snapshot to undo for this
   *  campaign this session? Drives the "Undo last advance" affordance. */
  canUndoLastPulse: (campaignId) =>
    (get().pulseUndoStack || []).some(s => s.campaignId === campaignId),

  /**
   * Campaign-clock (Phase C2): reverse the most recent world-pulse advance for
   * this campaign, restoring the campaign world + every member settlement (and
   * the live active view) from the pre-pulse snapshot. Multi-step — each call
   * pops one snapshot, so repeated calls walk back tick by tick. Returns true if
   * an advance was undone. Session-scoped: a reload clears the stack.
   */
  undoLastPulse: async (campaignId) => {
    const persistUpdates = [];
    let campaignPersist = null;
    let didUndo = false;
    set(state => {
      const stack = state.pulseUndoStack || [];
      let idx = -1;
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].campaignId === campaignId) { idx = i; break; }
      }
      if (idx === -1) return;
      const snap = stack[idx];
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const stamp = new Date().toISOString();
      // Restore the campaign world (world state, regional graph, wizard news).
      c.worldState = ensureWorldState(snap.worldState, c);
      c.regionalGraph = ensureRegionalGraph(snap.regionalGraph, { now: stamp });
      c.wizardNews = ensureWizardNewsFeed(snap.wizardNews, { now: stamp });
      c.updatedAt = stamp;
      // Restore each member save to its pre-pulse settlement + campaignState —
      // but only members that still belong to this campaign (a save detached
      // since the advance must not be silently reverted).
      const memberIds = new Set((c.settlementIds || []).map(String));
      for (const s of snap.saves || []) {
        if (!memberIds.has(String(s.id))) continue;
        const sidx = state.savedSettlements.findIndex(x => String(x.id) === String(s.id));
        if (sidx === -1) continue;
        const restoredSettlement = cloneJson(s.settlement);
        const restoredCampaignState = cloneJson(s.campaignState);
        state.savedSettlements[sidx] = {
          ...state.savedSettlements[sidx],
          settlement: restoredSettlement,
          campaignState: restoredCampaignState,
          timestamp: stamp,
        };
        persistUpdates.push({
          saveId: s.id,
          settlement: cloneJson(restoredSettlement),
          campaignState: cloneJson(restoredCampaignState),
        });
      }
      // Re-hydrate the LIVE active view to whichever member is open now — so the
      // on-screen settlement reflects the reverted state even if the DM switched
      // members (or the open member isn't the one captured at advance time)
      // between advancing and undoing. If no member of THIS campaign is open,
      // the live view is left untouched (a different campaign's settlement, or
      // a closed detail view, must not be clobbered).
      if (state.activeSaveId != null) {
        if (snap.active && String(state.activeSaveId) === snap.active.saveId) {
          // Same member that was open at advance time — restore its view verbatim.
          state.settlement = cloneJson(snap.active.settlement);
          state.systemState = cloneJson(snap.active.systemState);
          state.eventLog = cloneJson(snap.active.eventLog);
          state.phase = snap.active.phase;
          state.editedAt = stamp;
        } else {
          const activeSnap = (snap.saves || []).find(s => String(s.id) === String(state.activeSaveId));
          if (activeSnap && memberIds.has(String(activeSnap.id))) {
            const cs = activeSnap.campaignState || {};
            state.settlement = cloneJson(activeSnap.settlement);
            state.systemState = cs.systemState != null ? cloneJson(cs.systemState) : null;
            state.eventLog = Array.isArray(cs.eventLog) ? cloneJson(cs.eventLog) : [];
            state.phase = cs.phase || state.phase;
            state.editedAt = stamp;
          }
        }
      }
      // Pop just this snapshot — multi-step undo walks back one tick per call.
      state.pulseUndoStack = stack.filter((_, i) => i !== idx);
      campaignPersist = cacheCampaignState(state);
      didUndo = true;
    });
    await flushWorldPulsePersist({ result: didUndo, campaignPersist, persistUpdates, campaignId });
    return didUndo;
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
