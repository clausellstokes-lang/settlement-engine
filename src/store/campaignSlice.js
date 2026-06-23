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
} from '../domain/region/index.js';
import { ensureWorldState } from '../domain/worldPulse/index.js';
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
  deletePersistedCampaignState,
  clearCampaignSyncBookkeeping,
  initPersistFailureReporter,
  newCampaignId, isUuid, findActiveCampaign,
} from './campaignSliceShared.js';
import { track, EVENTS } from '../lib/analytics.js';
import { deepClone } from '../domain/clone.js';

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
export const createCampaignSlice = (set, get) => {
  // Route module-scoped persist failures (in campaignSliceShared) into store
  // state so the UI can warn the user instead of silently losing a cloud save.
  initPersistFailureReporter(() => set(state => {
    // Covers BOTH campaign saves and (since persistSaveUpdate was unified) the
    // canon settlement path — applied-locally-but-not-persisted, surfaced via the banner.
    state.campaignSyncError = 'Some changes could not be saved to the cloud. '
      + 'They are applied locally but may not persist. Check your connection, then reload to confirm.';
  }));

  return {
  // ── State ──────────────────────────────────────────────────────────────────
  campaigns: [],
  campaignsLoaded: false,
  /** The currently-loaded campaign id (null if none) — used by WorldMap */
  activeCampaignId: null,
  /** The last campaign the user actually opened. Unlike activeCampaignId (which
   *  is session-only and resets to null on reload), this IS persisted, so the
   *  Realm can auto-resume the campaign + map the user last used on a return
   *  visit. Set by setActiveCampaign on a real selection; never cleared on a
   *  blank (id=null). */
  lastActiveCampaignId: null,
  /** One-shot: which WorldMap workspace ('map'|'news'|'pulse') an outside view
   *  wants opened on arrival (e.g. the Settlements "Advance Time" button asks
   *  for 'news'). WorldMap reads & clears it on mount. Session-only — NOT in
   *  persist.partialize, so it never survives a reload. */
  pendingMapWorkspace: null,
  /** One-shot: an outside view asks the Realm to open the Simulation Rules dialog
   *  on arrival (e.g. the Pantheon "Enable dynamics" CTA, which steers to the
   *  religion-dynamics toggle that lives only in that dialog). WorldMap reads and
   *  clears it on mount. Session-only — NOT in persist.partialize. */
  pendingSimulationRules: false,
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

    // Server-gated on the owner's gallery_importable opt-in (migration 072):
    // returns null for a non-importable / missing map, or an anonymous caller.
    const { fetchMapForImport } = await import('../lib/gallery.js');
    const shared = await fetchMapForImport(slug);
    if (!shared) throw new Error("This map isn't available to import.");
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
    // Source import counter — atomic server-side bump (migration 065). A counter
    // failure must never fail the import, so it is fire-and-forget.
    try { const { bumpMapImport } = await import('../lib/gallery.js'); bumpMapImport(slug).catch(() => {}); } catch { /* never affects import */ }
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

    // Server-gated on the owner's gallery_importable opt-in (migration 072):
    // returns null for a non-importable / missing share, or an anonymous caller.
    const { fetchMapForImport } = await import('../lib/gallery.js');
    const payload = await fetchMapForImport(slug);
    if (!payload) throw new Error("This campaign isn't available to import.");
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
    // Source import counter — atomic server-side bump (migration 065). A counter
    // failure must never fail the import, so it is fire-and-forget.
    try { const { bumpMapImport } = await import('../lib/gallery.js'); bumpMapImport(slug).catch(() => {}); } catch { /* never affects import */ }
    return campaignId;
  },

  /**
   * Import a single public dossier into the importer's own library as a fresh
   * DRAFT. Gated auth + save-limit (NOT premium): the server RPC (048) only
   * returns the payload for a gallery_importable dossier to a signed-in caller,
   * and the 014 BEFORE INSERT trigger enforces the per-tier slot cap on save.
   * The clone is the public-safe projection (DM-private content already stripped
   * server-side); cross-settlement refs and the generation seed are dropped, and
   * provenance is stamped. Returns the new save id.
   */
  importGallerySettlement: async (slug) => {
    const st = get();
    if (!st.auth?.user) throw new Error('Sign in to import settlements.');
    // Slot pre-flight for a friendly message; the 014 trigger is the real gate.
    const max = (typeof st.maxSaves === 'function') ? st.maxSaves() : Infinity;
    const activeNow = (st.savedSettlements || []).length;
    if (Number.isFinite(max) && activeNow + 1 > max) {
      throw new Error('Your library is full. Free up a slot or upgrade to import more settlements.');
    }
    const { fetchDossierForImport } = await import('../lib/gallery.js');
    const dossier = await fetchDossierForImport(slug);
    if (!dossier) throw new Error('That settlement is not available to import.');
    const src = (dossier.settlement && typeof dossier.settlement === 'object') ? dossier.settlement : {};
    const importedAt = new Date().toISOString();
    const entry = {
      name: `${dossier.name || src.name || 'Imported settlement'} (imported)`,
      tier: dossier.tier || src.tier,
      // Static clone of the public-safe projection. Strip cross-settlement refs
      // (they would re-trigger supabaseSave's back-link wiring into the importer's
      // unrelated saves) and scrub EVERY generation seed — top-level and the one
      // embedded in settlement.config — so an imported copy can NEVER regenerate
      // the unsanitized original via the deterministic engine.
      settlement: {
        ...src,
        neighbourNetwork: [],
        neighborRelationship: null,
        interSettlementRelationships: [],
        _seed: undefined,
        // Strip the seed AND the religion embed bridge: an
        // imported settlement must arrive DORMANT — no foreign pantheon. Without
        // this, the preserved config would carry the source's primaryDeityRef +
        // primaryDeitySnapshot and the imported copy would be non-dormant,
        // resurrecting a deity the importer never authored.
        config: src.config
          ? (() => {
              // eslint-disable-next-line no-unused-vars
              const { _seed, primaryDeityRef, primaryDeitySnapshot, ...rest } = src.config;
              return rest;
            })()
          : src.config,
        importedFrom: { slug, sourceName: dossier.name || src.name || null, importedAt },
      },
      config: null,
      seed: null,
      aiData: {},
      campaignState: { phase: 'draft', eventLog: [] },
      versionHistory: [],
    };
    let newSaveId;
    try {
      newSaveId = await savesService.save(entry);
    } catch (err) {
      // Surface the save-limit trigger's message verbatim (server-authoritative).
      throw new Error(err?.message || 'Import failed while saving the settlement.', { cause: err });
    }
    set(state => { state.savedSettlements.push({ ...entry, id: newSaveId, savedAt: Date.now() }); });
    try { track(EVENTS.GALLERY_IMPORTED, { kind: 'settlement' }); } catch { /* analytics never affects import */ }
    return newSaveId;
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
      const clean = deepClone(source || {});
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
      // Remember the last campaign actually opened so the Realm can resume it on
      // a later visit. Never cleared on a blank (id=null) selection, so blanking
      // the map doesn't forget which campaign to resume next time.
      if (id && campaign) state.lastActiveCampaignId = id;
    }),

  /** Ask WorldMap to open on a specific workspace the next time it mounts with
   *  an active campaign. One-shot; pass null to clear. */
  requestMapWorkspace: (workspace) =>
    set(state => { state.pendingMapWorkspace = workspace || null; }),

  /** Read-and-clear the pending workspace request (one-shot). Returns it. */
  consumeMapWorkspace: () => {
    const w = get().pendingMapWorkspace;
    if (w) set(state => { state.pendingMapWorkspace = null; });
    return w;
  },

  /** Ask the Realm to open the Simulation Rules dialog the next time WorldMap
   *  mounts. One-shot; pass false to clear. */
  requestSimulationRules: (want = true) =>
    set(state => { state.pendingSimulationRules = !!want; }),

  /** Read-and-clear the pending Simulation Rules request (one-shot). Returns it. */
  consumeSimulationRules: () => {
    const want = get().pendingSimulationRules;
    if (want) set(state => { state.pendingSimulationRules = false; });
    return want;
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
