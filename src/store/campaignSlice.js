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
 * Persistence: localStorage (sf_campaigns) + Supabase for signed-in users.
 */

const LOCAL_KEY = 'sf_campaigns';
const SCHEMA_VERSION = 2;

function localLoad() {
  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    return raw.map(migrateCampaign);
  } catch {
    return [];
  }
}

function localWrite(campaigns) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(campaigns));
  } catch (e) {
    // Likely quota exceeded — FMG snapshots can be large (~1MB). The caller
    // should already have warned via canSaveSnapshot(); log and continue.
    console.warn('[campaignSlice] localStorage write failed', e);
  }
}

/** Migrate a single campaign object to the current schema */
function migrateCampaign(camp) {
  if (!camp || typeof camp !== 'object') return camp;
  if (!camp.mapState) return camp;
  camp.mapState = migrateMapState(camp.mapState);
  return camp;
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
      relationshipFilter: ['trade_partner', 'allied', 'patron', 'client', 'rival', 'cold_war', 'hostile'],
      chains: false,
      chainFilter: null,
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

export const createCampaignSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  campaigns: localLoad(),
  campaignsLoaded: false,
  /** The currently-loaded campaign id (null if none) — used by WorldMap */
  activeCampaignId: null,

  // ── Actions ────────────────────────────────────────────────────────────────

  loadCampaigns: () =>
    set(state => {
      state.campaigns = localLoad();
      state.campaignsLoaded = true;
    }),

  createCampaign: (name) => {
    const id = `camp_${Date.now()}`;
    set(state => {
      const campaign = {
        id,
        name: String(name || '').trim() || 'Untitled Campaign',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settlementIds: [],
        mapState: null,
        collapsed: false,
      };
      state.campaigns.unshift(campaign);
      localWrite(state.campaigns);
    });
    return id;
  },

  renameCampaign: (id, name) =>
    set(state => {
      const c = state.campaigns.find(c => c.id === id);
      if (c) {
        c.name = String(name || '').trim() || c.name;
        c.updatedAt = new Date().toISOString();
      }
      localWrite(state.campaigns);
    }),

  deleteCampaign: (id) =>
    set(state => {
      state.campaigns = state.campaigns.filter(c => c.id !== id);
      if (state.activeCampaignId === id) state.activeCampaignId = null;
      localWrite(state.campaigns);
    }),

  toggleCampaignCollapsed: (id) =>
    set(state => {
      const c = state.campaigns.find(c => c.id === id);
      if (c) c.collapsed = !c.collapsed;
      localWrite(state.campaigns);
    }),

  addToCampaign: (campaignId, settlementId) =>
    set(state => {
      for (const c of state.campaigns) {
        c.settlementIds = c.settlementIds.filter(id => id !== settlementId);
      }
      const target = state.campaigns.find(c => c.id === campaignId);
      if (target) {
        target.settlementIds.push(settlementId);
        target.updatedAt = new Date().toISOString();
      }
      localWrite(state.campaigns);
    }),

  removeFromCampaign: (campaignId, settlementId) =>
    set(state => {
      const c = state.campaigns.find(c => c.id === campaignId);
      if (c) {
        c.settlementIds = c.settlementIds.filter(id => id !== settlementId);
        c.updatedAt = new Date().toISOString();
      }
      localWrite(state.campaigns);
    }),

  /**
   * Save the current map slice's state into a campaign.
   * Pulls from useStore.mapState; WorldMap should populate fmgSnapshot via
   * `setMapSnapshot(blob, seed)` before calling this.
   */
  saveCampaignMap: (campaignId, mapStateOverride) =>
    set(state => {
      const c = state.campaigns.find(c => c.id === campaignId);
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
      localWrite(state.campaigns);
    }),

  clearCampaignMap: (campaignId) =>
    set(state => {
      const c = state.campaigns.find(c => c.id === campaignId);
      if (c) {
        c.mapState = null;
        c.updatedAt = new Date().toISOString();
      }
      localWrite(state.campaigns);
    }),

  /** Mark a campaign as the active one (WorldMap uses this to drive reloads) */
  setActiveCampaign: (id) =>
    set(state => { state.activeCampaignId = id; }),

  /**
   * Resolve the campaign's map state to a v2 object (migrating v1 on the fly).
   * Returns null if no mapState is attached.
   */
  getCampaignMapState: (campaignId) => {
    const c = get().campaigns.find(c => c.id === campaignId);
    if (!c?.mapState) return null;
    return migrateMapState(c.mapState);
  },

  getCampaignForSettlement: (settlementId) => {
    return get().campaigns.find(c => c.settlementIds.includes(settlementId)) || null;
  },

  reorderCampaignSettlements: (campaignId, settlementIds) =>
    set(state => {
      const c = state.campaigns.find(c => c.id === campaignId);
      if (c) {
        c.settlementIds = settlementIds;
        c.updatedAt = new Date().toISOString();
      }
      localWrite(state.campaigns);
    }),
});
