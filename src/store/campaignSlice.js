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
import { saves as savesService } from '../lib/saves.js';
import { scrubImportedConfig } from '../lib/importScrub.js';
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
  retryOutboxPersist,
  newCampaignId, isUuid, uuidFromLegacyId, findActiveCampaign,
} from './campaignSliceShared.js';
import { initOutboxStatusReporter, getStatus as outboxStatus } from './outbox.js';
import { track, EVENTS } from '../lib/analytics.js';

const SCHEMA_VERSION = 2;

/**
 * Coarse, behavior-free analytics derivations for this slice. Each is a small
 * pure helper that returns enums/counts/bands only — never names/prose/domain
 * objects — so the additive track() calls stay fire-and-forget and lint-clean
 * (analytics-props-hygiene). Wrapped at the call site is unnecessary because
 * track() itself never throws.
 */

/**
 * Scheme guard for an imported backdrop image URL (ported master fix). Gallery
 * rows are untrusted shared input and the URL is later rendered as an SVG
 * <image href> (see MapOverlay.jsx), so only http(s) URLs may be stored — never
 * javascript:/data: or other schemes. Mirrors gallery.js's isSafePublicImageUrl
 * (kept local to avoid widening that module's surface for one consumer).
 */
function isSafeBackdropUrl(value) {
  if (!value) return false;
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

function localLoad(ownerId = 'anon') {
  return campaignService.loadCached(ownerId).map(migrateCampaign);
}

/** Migrate a single campaign object to the current schema.
 *  Exported for the correctness-1 regression pin (settlementIds normalization). */
export function migrateCampaign(camp) {
  if (!camp || typeof camp !== 'object') return camp;
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
  /** The currently-loaded campaign id (null if none) — used by WorldMap */
  activeCampaignId: null,
  /** Set when a cloud save of campaign/save state fails; surfaced as a banner.
   *  null when the last persist succeeded (or was cleared by the user). */
  campaignSyncError: null,
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
        // V-2 / R-16: the letter read floor + the flags-seen baseline (see
        // migrateCampaign). A fresh campaign has read nothing (0) and recorded no
        // flags baseline (null ⇒ the deepened section is dark until first read).
        lastReadTick: 0,
        flagsSeen: null,
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
      // SECURITY (ported master fix): the shared row's URL is untrusted input —
      // refuse non-http(s) schemes BEFORE any fetch/persist, so a javascript:/
      // data: backdrop can never be stored (the fetch-failure fallback below
      // would otherwise keep the original string verbatim).
      if (!isSafeBackdropUrl(imageUrl)) throw new Error('That shared map has no importable backdrop.');
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
      // SECURITY (finding F6): do NOT import another user's raw FMG snapshot.
      // It is a serialized SVG blob the map iframe loads via
      // document.body.insertAdjacentHTML on our own (Supabase-token-bearing)
      // origin — a cross-user stored-XSS / account-takeover sink. Carry only the
      // seed so the local map can regenerate comparable geography (identical to
      // the importGalleryMapWithCampaign treatment below).
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

    // Parity with importGallerySettlement + accountImport: canonicalize each
    // member clone through the migration chain so a legacy-shape shared member
    // arrives with the same backfilled fields a standalone import of it would get
    // (downstream dossier / deriveSystemState otherwise read undefined for fields
    // the chain fills). Dynamic import keeps normalizeSettlement's transitive
    // closure off the eager first-paint entry — this action is import-click-only.
    const { normalizeSettlement } = await import('../domain/normalizeSettlement.js');
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
          settlement: normalizeSettlement({ ...src, neighbourNetwork: [], neighborRelationship: null, interSettlementRelationships: [] }),
          // DORMANCY SCRUB (cycle-3 security fix): route the cloned member config
          // through the single-writer import scrub — matches galleryImportSettlement
          // and accountImport. Without it a shared map's member could carry the
          // author's primaryDeitySnapshot / cultDeitySnapshots / faithProfile, live-
          // activating the importer's premium religion subsystem with a foreign
          // pantheon. The imported copy must arrive DORMANT.
          config: scrubImportedConfig(src.config) || null,
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
      // SECURITY (ported master fix): only http(s) backdrops persist; a refused
      // scheme stores an explicit null so the campaign imports WITHOUT the
      // backdrop rather than carrying a javascript:/data: payload.
      mapState.customBackdrop = isSafeBackdropUrl(imageUrl)
        ? { imageUrl, w: Number(sb.w) || 0, h: Number(sb.h) || 0 }
        : null;
    } else if (sharedMap.fmgSnapshot) {
      // SECURITY (finding F6): do NOT import another user's raw FMG snapshot.
      // It is a serialized SVG blob that the map iframe loads via
      // insertAdjacentHTML on our own (Supabase-token-bearing) origin — a
      // cross-user stored-XSS / account-takeover sink. Carry only the seed so
      // the local map can regenerate comparable geography; placements (remapped
      // below) and any IMAGE backdrop (sanitized re-upload above) still import.
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
    }),

  removeFromCampaign: (campaignId, settlementId) =>
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
   * kind/description or the just-captured thumbnail back onto the row so the
   * tile reflects the edit immediately. Only patches an ACTIVE campaign; a
   * missing/destroyed id is a no-op. Persists so the patch survives a reload.
   * @param {string} campaignId
   * @param {object} patch shallow keys to assign onto the campaign row
   */
  updateSavedCampaign: (campaignId, patch) =>
    set(state => {
      if (!patch || typeof patch !== 'object') return;
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      Object.assign(c, patch);
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
