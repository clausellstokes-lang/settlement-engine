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
  previewCampaignWorldPulse as domainPreviewCampaignWorldPulse,
  updateProposalStatus as domainUpdateWorldPulseProposalStatus,
} from '../domain/worldPulse/index.js';
import { withoutActiveCondition } from '../domain/activeConditions.js';
import { deriveSystemState } from '../domain/state/deriveSystemState.js';
import { saves as savesService } from '../lib/saves.js';
import { campaigns as campaignService, isCampaignActive } from '../lib/campaigns.js';
import {
  forgetCampaignSync,
  mergeCampaignLists,
  primeCampaignSync,
  syncCampaignChanges,
} from '../lib/campaignSync.js';

const SCHEMA_VERSION = 2;

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

function persistSaveUpdate(saveId, partial) {
  if (!saveId || !partial) return;
  return savesService.update(saveId, partial).catch(e => {
    console.warn('[campaignSlice] save update failed', e);
    throw e;
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
  campaign.wizardNews = appendWizardNewsEntries(feed, entries);
}

function ensureCampaignWizardNews(campaign) {
  if (!campaign) return null;
  campaign.wizardNews = ensureWizardNewsFeed(campaign.wizardNews);
  return campaign.wizardNews;
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
  for (const update of updates) {
    const saveIdx = state.savedSettlements.findIndex(save =>
      String(save.id) === String(update.saveId)
    );
    if (saveIdx === -1) continue;

    const save = state.savedSettlements[saveIdx];
    const nextSettlement = update.settlement || save.settlement;
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
  campaign.regionalGraph = ensureRegionalGraph(result.regionalGraph);
  campaign.wizardNews = ensureWizardNewsFeed(result.wizardNews);
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

export const createCampaignSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  campaigns: [],
  campaignsLoaded: false,
  /** The currently-loaded campaign id (null if none) — used by WorldMap */
  activeCampaignId: null,

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
        const migratedRemote = remote.map(migrateCampaign);
        primeCampaignSync(migratedRemote);
        const merged = mergeCampaignLists(cached, migratedRemote);
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
   * Rebuild the structural graph from campaign settlements. Existing confirmed
   * channels are preserved; optional discovery adds suggested P0 channels.
   */
  rebuildCampaignRegionalGraph: (campaignId, options = {}) => {
    const { discover = true } = options;
    let graph = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const saves = campaignSettlements(state, campaignId);
      c.regionalGraph = discover
        ? deriveGraphWithDiscoveredCandidates(saves, c.regionalGraph)
        : deriveRegionalGraphFromSaves(saves, c.regionalGraph);
      ensureCampaignWizardNews(c);
      c.updatedAt = new Date().toISOString();
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
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      c.regionalGraph = domainSetRegionalChannelStatus(c.regionalGraph, channelId, status);
      ensureCampaignWizardNews(c);
      c.updatedAt = new Date().toISOString();
      graph = c.regionalGraph;
      persistCampaignState(state, campaignId);
    });
    return graph;
  },

  setRegionalChannelVisibility: (campaignId, channelId, visibility) => {
    let graph = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      c.regionalGraph = domainSetRegionalChannelVisibility(c.regionalGraph, channelId, visibility);
      ensureCampaignWizardNews(c);
      c.updatedAt = new Date().toISOString();
      graph = c.regionalGraph;
      persistCampaignState(state, campaignId);
    });
    return graph;
  },

  setCampaignRegionalGraph: (campaignId, regionalGraph) => {
    let graph = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const beforeGraph = ensureRegionalGraph(c.regionalGraph);
      c.regionalGraph = ensureRegionalGraph(regionalGraph);
      appendWizardNewsForGraphChange(c, beforeGraph, c.regionalGraph);
      c.updatedAt = new Date().toISOString();
      graph = c.regionalGraph;
      persistCampaignState(state, campaignId);
    });
    return graph;
  },

  queueCampaignRegionalImpacts: (campaignId, impacts = []) => {
    let graph = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const beforeGraph = ensureRegionalGraph(c.regionalGraph);
      c.regionalGraph = queueRegionalImpacts(beforeGraph, impacts);
      appendWizardNewsForGraphChange(c, beforeGraph, c.regionalGraph);
      c.updatedAt = new Date().toISOString();
      graph = c.regionalGraph;
      persistCampaignState(state, campaignId);
    });
    return graph;
  },

  setRegionalImpactStatus: (campaignId, impactId, status, patch = {}) => {
    let graph = null;
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      const beforeGraph = ensureRegionalGraph(c.regionalGraph);
      c.regionalGraph = domainSetRegionalImpactStatus(beforeGraph, impactId, status, patch);
      appendWizardNewsForGraphChange(c, beforeGraph, c.regionalGraph);
      c.updatedAt = new Date().toISOString();
      graph = c.regionalGraph;
      persistCampaignState(state, campaignId);
    });
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
      const beforeGraph = ensureRegionalGraph(c.regionalGraph);
      c.wizardNews = advanceWizardNewsFeed(c.wizardNews, ticks);
      c.regionalGraph = advanceRegionalImpacts(beforeGraph, ticks, {
        ...options,
        currentTick: c.wizardNews.currentTick,
      });
      appendWizardNewsForGraphChange(c, beforeGraph, c.regionalGraph, {
        tick: c.wizardNews.currentTick,
      });
      c.updatedAt = new Date().toISOString();
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
    return domainPreviewCampaignWorldPulse({
      campaign: previewCampaign,
      saves: cloneJson(campaignSettlements(state, campaignId)),
      interval,
      now: options.now,
    });
  },

  canonizeCampaignWorld: async (campaignId) => {
    let campaignPersist = /** @type {any} */ (null);
    const now = new Date().toISOString();
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
      c.worldState = canonizeWorldState(c.worldState, now, c);
      c.updatedAt = now;
      campaignPersist = cacheCampaignState(state);
    });
    if (campaignPersist) {
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
      await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
    }
    return campaignPersist?.snapshot?.find(c => c.id === campaignId)?.worldState?.simulationRules || null;
  },

  advanceCampaignWorld: async (campaignId, interval = 'one_month', options = {}) => {
    let result = /** @type {any} */ (null);
    let persistUpdates = [];
    let campaignPersist = /** @type {any} */ (null);
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
    });

    if (result && campaignPersist) {
      await persistSaveUpdates(persistUpdates);
      await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
    }
    return result;
  },

  applyWorldPulseProposal: async (campaignId, proposalId) => {
    let result = /** @type {any} */ (null);
    let persistUpdates = [];
    let campaignPersist = /** @type {any} */ (null);
    const now = new Date().toISOString();
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c) return;
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
      await persistSaveUpdates(persistUpdates);
      await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
    }
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
      await persistSaveUpdates(persistUpdates);
      await syncCampaignSnapshot(campaignPersist.snapshot, campaignId);
    }
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
      const nextSettlement = applyRegionalImpact(save.settlement, impact);
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
      c.regionalGraph = domainSetRegionalImpactStatus(beforeGraph, impactId, 'applied', { appliedAt: now });
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
      c.regionalGraph = domainSetRegionalImpactStatus(beforeGraph, impactId, 'resolved', { resolvedAt: now });
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

  appendCampaignChronicle: (campaignId, entry) =>
    set(state => {
      const c = findActiveCampaign(state.campaigns, campaignId);
      if (!c || !entry?.prose) return;
      c.chronicles = [
        {
          id: entry.id || `chronicle_${campaignId}_${entry.tick ?? 'latest'}_${Date.now()}`,
          tick: entry.tick ?? c.wizardNews?.currentTick ?? null,
          prose: entry.prose,
          createdAt: entry.createdAt || new Date().toISOString(),
        },
        ...(Array.isArray(c.chronicles) ? c.chronicles : []),
      ].slice(0, 24);
      c.updatedAt = new Date().toISOString();
      persistCampaignState(state, campaignId);
    }),

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
});
