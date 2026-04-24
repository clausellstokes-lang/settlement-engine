/**
 * settlementSlice — Generated settlement state and saved-settlement library.
 *
 * Holds the current generated settlement, the saved settlements list,
 * and the reactive-update engine state (what-if previews, deltas).
 */

import {
  generateSettlement as engineGenerate,
  regenNPCs          as engineRegenNPCs,
  regenHistory       as engineRegenHistory,
} from '../generators/engine.js';

import {
  generateSettlementPipeline,
  regenNPCsPipeline,
  regenHistoryPipeline,
} from '../generators/generateSettlementPipeline.js';

import { createPRNG, generateSeed } from '../generators/prng.js';
import { runPipeline, rerunAffected } from '../generators/pipeline.js';

export const createSettlementSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  settlement:    null,   // current generated settlement object
  savedSettlements: [],  // persisted to Supabase (or localStorage for anon)
  savedSettlementsLoaded: false, // true once hydrated from savesService
  lastSeed:      null,   // seed from last generation (for replay/determinism)
  lastCtx:       null,   // full pipeline context from last run (for reactive re-runs)
  usePipeline:   true,   // toggle between legacy and pipeline generator

  // Reactive update state
  whatIfPreview: null,   // { delta, previewSettlement } from a proposed change
  pendingChange: null,   // { type, payload } describing the proposed mutation

  // ── Generation ─────────────────────────────────────────────────────────────
  generateSettlement: (seedOverride) => {
    const state = get();
    const { config, institutionToggles, categoryToggles, goodsToggles, servicesToggles } = state;
    const neighbor = state.importedNeighbour;

    // Tier gate check
    const settType = config.settType;
    if (settType && settType !== 'random' && settType !== 'custom') {
      if (!state.isTierAllowed(settType)) {
        console.warn(`Tier "${settType}" not allowed for current user tier.`);
        return null;
      }
    }

    const fullConfig = {
      ...config,
      _institutionToggles: institutionToggles,
      _categoryToggles:    categoryToggles,
      _goodsToggles:       goodsToggles,
      _servicesToggles:    servicesToggles,
      ...(neighbor ? { _importedNeighbor: neighbor } : {}),
    };

    // Use pipeline or legacy generator
    let result;
    if (state.usePipeline) {
      const seed = seedOverride || generateSeed();
      result = generateSettlementPipeline(fullConfig, neighbor, { seed });
      set(state => {
        state.settlement = result;
        state.lastSeed = seed;
        state.aiSettlement = null;
        state.whatIfPreview = null;
        state.pendingChange = null;
      });
    } else {
      result = engineGenerate(fullConfig);
      set(state => {
        state.settlement = result;
        state.lastSeed = null;
        state.lastCtx = null;
        state.aiSettlement = null;
        state.whatIfPreview = null;
        state.pendingChange = null;
      });
    }

    return result;
  },

  setSettlement: (settlement) =>
    set(state => { state.settlement = settlement; }),

  clearSettlement: () =>
    set(state => {
      state.settlement = null;
      state.lastSeed = null;
      state.lastCtx = null;
      state.whatIfPreview = null;
      state.pendingChange = null;
    }),

  // ── Section regeneration (NPCs, history) ───────────────────────────────────
  regenSection: (section) => {
    const state = get();
    const { settlement, config } = state;
    if (!settlement) return;
    const cfg = settlement.config || config;

    if (section === 'npcs') {
      const parts = state.usePipeline
        ? regenNPCsPipeline(settlement, cfg)
        : engineRegenNPCs(settlement, cfg);
      set(s => { Object.assign(s.settlement, parts); });
    } else if (section === 'history') {
      const history = state.usePipeline
        ? regenHistoryPipeline(settlement, cfg)
        : engineRegenHistory(settlement, cfg);
      set(s => { s.settlement.history = history; });
    }
  },

  // ── Reactive updates (What-If engine) ──────────────────────────────────────

  /**
   * Propose a change without applying it. Computes the delta preview.
   * type: 'addInstitution' | 'removeInstitution' | 'addStressor' | 'removeStressor'
   *       | 'addNeighbour' | 'removeNeighbour'
   * payload: change-specific data
   */
  proposeChange: (type, payload) => {
    const state = get();
    const { settlement, lastSeed, lastCtx } = state;
    if (!settlement) return;

    // Build the config overrides for this change type
    let changedKeys = [];
    let overrides = {};

    switch (type) {
      case 'addInstitution': {
        // Force-add an institution by toggling it to require
        const key = `${settlement.tier}::${payload.category}::${payload.name}`;
        const newToggles = { ...(settlement.config?._institutionToggles || {}), [key]: { allow: true, require: true } };
        overrides = { institutionToggles: newToggles };
        changedKeys = ['institutionToggles'];
        break;
      }
      case 'removeInstitution': {
        const key = `${settlement.tier}::${payload.category}::${payload.name}`;
        const newToggles = { ...(settlement.config?._institutionToggles || {}), [key]: { allow: false, require: false, forceExclude: true } };
        overrides = { institutionToggles: newToggles };
        changedKeys = ['institutionToggles'];
        break;
      }
      case 'addStressor':
        overrides = {
          config: {
            ...(lastCtx?.config || settlement.config || {}),
            selectedStresses: [...(settlement.config?.selectedStresses || []), payload.stressType],
            selectedStressesRandom: false,
          },
        };
        changedKeys = ['config'];
        break;
      case 'removeStressor':
        overrides = {
          config: {
            ...(lastCtx?.config || settlement.config || {}),
            selectedStresses: (settlement.config?.selectedStresses || []).filter(s => s !== payload.stressType),
            selectedStressesRandom: false,
          },
        };
        changedKeys = ['config'];
        break;
      default:
        return;
    }

    set(s => {
      s.pendingChange = { type, payload, changedKeys, overrides };
    });
  },

  /** Apply the pending what-if change for real. */
  applyChange: () => {
    const state = get();
    const { pendingChange } = state;
    if (!pendingChange) return;

    // Re-generate with the modified config applied
    // For now, do a full re-generation with the overrides baked in.
    // Once pipeline context caching is stable, this will use rerunAffected.
    const fullConfig = {
      ...(state.settlement?.config || state.config),
      _institutionToggles: pendingChange.overrides.institutionToggles || state.institutionToggles,
      _categoryToggles:    state.categoryToggles,
      _goodsToggles:       state.goodsToggles,
      _servicesToggles:    state.servicesToggles,
    };

    if (state.usePipeline) {
      const seed = generateSeed(); // new seed for the applied change
      const result = generateSettlementPipeline(fullConfig, state.importedNeighbour, { seed });
      set(s => {
        s.settlement = result;
        s.lastSeed = seed;
        s.pendingChange = null;
        s.whatIfPreview = null;
      });
    } else {
      const result = engineGenerate(fullConfig);
      set(s => {
        s.settlement = result;
        s.pendingChange = null;
        s.whatIfPreview = null;
      });
    }
  },

  dismissChange: () =>
    set(state => {
      state.pendingChange = null;
      state.whatIfPreview = null;
    }),

  // ── Saved settlements ──────────────────────────────────────────────────────

  saveSettlement: (settlement) => {
    const state = get();
    if (!state.canSave()) return false;

    const max = state.maxSaves();
    if (state.savedSettlements.length >= max) return false;

    set(s => {
      s.savedSettlements.push({
        ...settlement,
        savedAt: Date.now(),
        id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      });
    });
    return true;
  },

  /** Bulk-replace the savedSettlements array (used for hydration from savesService). */
  setSavedSettlements: (settlements) =>
    set(state => {
      state.savedSettlements = settlements || [];
      state.savedSettlementsLoaded = true;
    }),

  removeSavedSettlement: (id) =>
    set(state => {
      state.savedSettlements = state.savedSettlements.filter(s => s.id !== id);
    }),

  updateSavedSettlement: (id, partial) =>
    set(state => {
      const idx = state.savedSettlements.findIndex(s => s.id === id);
      if (idx !== -1) Object.assign(state.savedSettlements[idx], partial);
    }),

  // ── NPC / Faction renaming ─────────────────────────────────────────────────
  renameNPC: (npcIndex, newName) =>
    set(state => {
      if (!state.settlement?.npcs?.[npcIndex]) return;
      state.settlement.npcs[npcIndex].name = newName;
    }),

  renameFaction: (factionIndex, newName) =>
    set(state => {
      if (!state.settlement?.factions?.[factionIndex]) return;
      state.settlement.factions[factionIndex].name = newName;
    }),
});
