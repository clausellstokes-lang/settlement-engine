/**
 * settlementSlice — Generated settlement state and saved-settlement library.
 *
 * Holds the current generated settlement, the saved settlements list,
 * and the reactive-update engine state (what-if previews, deltas).
 */

// ── Lazy engine loader ─────────────────────────────────────────────────────
// The generator chunk + its data tables together cost ~430 kB gz on first
// paint. The user only ever touches them when they click Generate (or
// regenerate / apply-change). Lifting the static imports to dynamic
// imports shifts that load to first-generate, shaving the cold-start
// payload by ~25 %. Subsequent generations are cached.
//
// `loadEngine()` resolves once and memoizes — every action calls
// `await loadEngine()` to get the module bag. Actions that previously
// were synchronous become async; that's safe because none of them return
// a value that callers consume (they set Zustand state via the `set`
// callback). React components that fire-and-forget still work — they
// just see the resulting state update one microtask later.
//
// `createPRNG` was previously imported here but is only used by the
// store test (which imports it directly). Removed from this chunk.
/** @type {?{ engineGenerate:Function, engineRegenNPCs:Function, engineRegenHistory:Function, generateSettlementPipeline:Function, regenNPCsPipeline:Function, regenHistoryPipeline:Function, generateSeed:Function, runPipeline:Function, rerunAffected:Function }} */
let _engineModule = null;
/** @type {?Promise<NonNullable<typeof _engineModule>>} */
let _enginePromise = null;
function loadEngine() {
  if (_engineModule) return Promise.resolve(_engineModule);
  if (_enginePromise) return _enginePromise;
  _enginePromise = Promise.all([
    import('../generators/engine.js'),
    import('../generators/generateSettlementPipeline.js'),
    import('../generators/prng.js'),
    import('../generators/pipeline.js'),
  ]).then(([eng, pipe, prng, pipeline]) => {
    _engineModule = {
      engineGenerate:             eng.generateSettlement,
      engineRegenNPCs:            eng.regenNPCs,
      engineRegenHistory:         eng.regenHistory,
      generateSettlementPipeline: pipe.generateSettlementPipeline,
      regenNPCsPipeline:          pipe.regenNPCsPipeline,
      regenHistoryPipeline:       pipe.regenHistoryPipeline,
      generateSeed:               prng.generateSeed,
      runPipeline:                pipeline.runPipeline,
      rerunAffected:              pipeline.rerunAffected,
    };
    return _engineModule;
  });
  return _enginePromise;
}

import { deriveSystemState } from '../domain/state/deriveSystemState.js';
import {
  buildEdit as _pe_buildEdit,
  appendEdit as _pe_appendEdit,
  revertEdit as _pe_revertEdit,
  activeEdits as _pe_activeEdits,
} from '../domain/pendingEdits.js';
import { previewEvent as domainPreviewEvent } from '../domain/events/previewEvent.js';
import { applyEvent   as domainApplyEvent   } from '../domain/events/applyEvent.js';
import { inferSuccessors }   from '../domain/entities/successors.js';
import { inferImportance }   from '../domain/entities/npcs.js';
import { metaForStep }       from '../generators/steps/stepMetadata.js';
import {
  applyUserEdit as domainApplyUserEdit,
  revertUserEdit as domainRevertUserEdit,
  isEditablePath,
  countSettlementEdits as domainCountSettlementEdits,
} from '../domain/userEdits.js';

// ── Per-entity-kind nested array resolver ──────────────────────────────
//
// Mirrors the layout used by domain/userEdits.js#walkUserEdits and
// aiOverlayVerifier#locateEntity. Centralized so a future schema move
// (e.g. factions out of powerStructure) touches one map, not three.
const ENTITY_ARRAY_PATH_BY_KIND = Object.freeze({
  npc:             ['npcs'],
  institution:     ['institutions'],
  faction:         ['powerStructure', 'factions'],
  conflict:        ['powerStructure', 'conflicts'],
  hook:            ['hooks'],
  plotHook:        ['plotHooks'],
  condition:       ['activeConditions'],
  supplyChain:     ['supplyChains'],
  historicalEvent: ['history', 'historicalEvents'],
  currentTension:  ['history', 'currentTensions'],
});

function _resolveEntity(settlement, kind, entityIndex) {
  if (kind === 'settlement') return settlement;
  const segs = ENTITY_ARRAY_PATH_BY_KIND[kind];
  if (!segs) return null;
  let ref = settlement;
  for (const seg of segs) {
    if (ref == null || typeof ref !== 'object') return null;
    ref = ref[seg];
  }
  if (!Array.isArray(ref)) return null;
  return ref[entityIndex] || null;
}

/**
 * Build a `campaignState` snapshot from the live slice for persistence
 * into a save record. Centralizing the shape means the round-trip
 * (save → reload → hydrateFromSave) is symmetric and a single edit
 * keeps both sides in step.
 */
function pickleCampaignState(state) {
  return {
    phase:         state.phase || 'draft',
    eventLog:      Array.isArray(state.eventLog) ? [...state.eventLog] : [],
    systemState:   state.systemState ? JSON.parse(JSON.stringify(state.systemState)) : null,
    locks:         state.locks ? { ...state.locks } : {},
    generatedAt:   state.generatedAt || null,
    editedAt:      new Date().toISOString(),
    canonizedAt:   state.canonizedAt || null,
    lastExportAt:  state.lastExportAt || null,
    narrativeDrift: null,
    exportState:   null,
  };
}

/**
 * Curried predicate-flavored helper for undoLastEvent: returns a map
 * function that strips any impairment whose causeEventId matches the
 * supplied event id, and resets `status` to 'active' if no impairments
 * remain. Centralizing here keeps the undo logic consistent across
 * institution, faction, and npc entity lists.
 */
const stripImpairmentsForEvent = (eventId) => (entity) => {
  if (!entity) return entity;
  const impairments = (entity.impairments || []).filter(i => i.causeEventId !== eventId);
  const next = { ...entity, impairments };
  // If undo also reversed a removal/destruction caused by the same
  // event, restore status. We track removedByEventId on entities for this.
  if (entity.removedByEventId === eventId) {
    next.status = 'active';
    delete next.removedByEventId;
  } else if (entity.status === 'impaired' && impairments.length === 0) {
    next.status = 'active';
  }
  return next;
};

export const createSettlementSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  settlement:    null,   // current generated settlement object
  savedSettlements: [],  // persisted to Supabase (or localStorage for anon)
  savedSettlementsLoaded: false, // true once hydrated from savesService
  lastSeed:      null,   // seed from last generation (for replay/determinism)
  lastCtx:       null,   // full pipeline context from last run (for reactive re-runs)
  usePipeline:   true,   // toggle between legacy and pipeline generator
  // History of pipeline steps run for the currently-displayed settlement.
  // Powers the "How this was simulated" rail. Each entry:
  //   { id, ts, summary }
  // where `id` is the step name (e.g. 'assembleInstitutions') and
  // `summary` is a short factual string built by stepMetadata. Cleared
  // on regeneration.
  pipelineHistory: [],

  // P100 / X-1 — Transient flag set right after the pipeline runs and
  // cleared when the PipelineReveal overlay finishes its playback. The
  // overlay reads `pipelineHistory` to animate; the wizard hides the
  // dossier until this flag drops. Cleared on a fresh generate so the
  // reveal fires once per generation.
  pipelineRevealActive: false,
  dismissPipelineReveal: () => set(state => { state.pipelineRevealActive = false; }),

  // P103 / X-2 — Active pricing moment. usePricingMoment opens these via
  // setActivePricingMoment({ headline, body, reason }); the
  // PricingMomentCard subscribes here and renders. Single-active-at-a-time
  // by design (the cooldown library handles dedupe).
  activePricingMoment: null,
  setActivePricingMoment: (content) => set(state => {
    state.activePricingMoment = content || null;
  }),
  clearActivePricingMoment: () => set(state => {
    state.activePricingMoment = null;
  }),

  // P104 / X-4 — Lifetime narrate count, used by useReaderAudience to
  // bump anonymous → intermediate after first narrate spend. Bumped
  // alongside spendCredits in creditsSlice; here we just declare it.
  lifetimeNarrateCount: 0,
  bumpLifetimeNarrate: () => set(state => {
    state.lifetimeNarrateCount = (state.lifetimeNarrateCount || 0) + 1;
  }),

  // P105 / E-2 — Pending edits queue. Each edit is a frozen object
  // produced by domain/pendingEdits.buildEdit(). The PendingChangesBar
  // reads this; commitPendingEdits applies the queue to the live
  // settlement; revertPendingEdits drops it.
  pendingEditsQueue: [],
  pendingEditsClock: 0,

  /** Add an edit to the queue. Returns the edit so the caller can
   *  reference its id (e.g. for an undo-this-edit affordance). */
  queueEdit: (kind, payload) => {
    const clock = (get().pendingEditsClock || 0) + 1;
    const edit = _pe_buildEdit(kind, payload, clock);
    set(state => {
      state.pendingEditsClock = clock;
      state.pendingEditsQueue = _pe_appendEdit(state.pendingEditsQueue || [], edit);
    });
    // Analytics — once per queued edit
    import('../lib/analytics.js').then(({ Funnel, EVENTS }) => {
      Funnel.track(EVENTS.EDIT_PENDING_QUEUED, { kind });
    }).catch(() => {});
    return edit;
  },

  /** Mark an edit as reverted (kept in history for undo). */
  revertSingleEdit: (editId) => {
    set(state => {
      state.pendingEditsQueue = _pe_revertEdit(state.pendingEditsQueue || [], editId);
    });
  },

  /** Discard the entire queue without applying. */
  revertPendingEdits: () => {
    set(state => {
      state.pendingEditsQueue = [];
    });
  },

  /** Apply the queue against the live settlement. Each edit dispatches
   *  to an existing mutation (renameNPC, etc.) by `kind`. Edits that
   *  don't map to a known mutation are skipped with a warning — the
   *  queue clears either way on a successful commit. */
  commitPendingEdits: () => {
    const state = get();
    const queue = state.pendingEditsQueue || [];
    const active = _pe_activeEdits(queue);
    if (active.length === 0) return;

    for (const edit of active) {
      try {
        switch (edit.kind) {
          case 'rename-npc':
            if (typeof state.renameNPC === 'function' &&
                edit.payload?.npcIndex != null) {
              state.renameNPC(edit.payload.npcIndex, edit.payload.newName);
            }
            break;
          case 'rename-settlement':
            set(s => { if (s.settlement) s.settlement.name = edit.payload?.newName; });
            break;
          // Future kinds (add-institution etc.) dispatch to existing
          // mutations or — for not-yet-built ones — log a TODO. The
          // queue still clears so the UI isn't stuck on a missing
          // dispatcher.
          default:
            console.info(`[commitPendingEdits] no dispatcher for ${edit.kind} yet`);
            break;
        }
      } catch (e) {
        console.warn(`[commitPendingEdits] ${edit.kind} failed:`, e);
      }
    }

    // Clear the queue. Failed-commit retry is a future-tier feature;
    // for now, all-or-nothing matches the cascade-preview UX.
    set(s => { s.pendingEditsQueue = []; });
    // P133 / E-5 — Snapshot the post-commit state so the version
    // timeline records this as a discrete edit checkpoint. The
    // snapshot label summarises what edits were applied; the user
    // can revert to before this batch from VersionsTab.
    try {
      const labels = active.map(e => e.kind).join(', ');
      const fn = get().recordSnapshot;
      if (typeof fn === 'function') {
        fn({ kind: 'auto-commit', label: `Edits: ${labels}` });
      }
    } catch (_e) { /* silent — snapshot failure shouldn't undo the commit */ }
  },

  // ── P133 / E-5 · Version history mutations ──────────────────────────
  //
  // `recordSnapshot({ saveId?, kind, label, ts? })` appends a frozen
  // snapshot of the live settlement (or a specified save) into
  // `versionHistory`. Snapshots are immutable — the timeline never
  // mutates an existing entry.
  //
  // `revertToSnapshot({ saveId, snapshotId })` finds the snapshot in
  // versionHistory and overwrites the live settlement (or the save's
  // settlement payload) with the snapshot's content. The CURRENT state
  // is auto-snapshotted FIRST so reverting is never destructive — the
  // critique was explicit about that.
  //
  // Both mutations are pure-local. Persistence to Supabase (migration
  // 016 / version_history table) happens via the settlements/PATCH
  // edge function on the next save round-trip; the slice doesn't
  // care about the storage layer.

  /** @param {{saveId?: string|null, kind?: string, label?: string, ts?: number}} opts */
  recordSnapshot: (opts = {}) => {
    const state = get();
    const ts = opts.ts || Date.now();
    const snapshot = {
      id: `snap_${ts}_${Math.random().toString(36).slice(2, 8)}`,
      ts,
      kind: opts.kind || 'manual',
      label: opts.label || 'Snapshot',
      settlement: state.settlement ? JSON.parse(JSON.stringify(state.settlement)) : null,
    };
    if (opts.saveId) {
      set(s => {
        const idx = s.savedSettlements.findIndex(e => e.id === opts.saveId);
        if (idx === -1) return;
        const cur = s.savedSettlements[idx];
        cur.versionHistory = Array.isArray(cur.versionHistory)
          ? [...cur.versionHistory, snapshot]
          : [snapshot];
      });
    } else {
      // No saveId — write into the live settlement's history. This
      // lets unsaved sessions still build a local timeline.
      set(s => {
        if (!s.settlement) return;
        s.settlement.versionHistory = Array.isArray(s.settlement.versionHistory)
          ? [...s.settlement.versionHistory, snapshot]
          : [snapshot];
      });
    }
    return snapshot;
  },

  /** Revert the live settlement (or a save) to a prior snapshot. Auto-
   *  snapshots the CURRENT state first so the user can re-revert if
   *  they meant the other thing. */
  revertToSnapshot: ({ saveId, snapshotId }) => {
    if (!snapshotId) return false;
    const state = get();
    // Read the snapshot from the appropriate version-history slot.
    const history = saveId
      ? state.savedSettlements.find(e => e.id === saveId)?.versionHistory
      : state.settlement?.versionHistory;
    if (!Array.isArray(history)) return false;
    const target = history.find(s => s.id === snapshotId);
    if (!target?.settlement) return false;
    // Snapshot the pre-revert state so this action is non-destructive.
    try {
      const fn = get().recordSnapshot;
      if (typeof fn === 'function') {
        fn({
          saveId,
          kind: 'pre-revert',
          label: `Before revert to ${target.label || 'snapshot'}`,
        });
      }
    } catch (_e) { /* silent */ }
    // Apply.
    set(s => {
      if (saveId) {
        const idx = s.savedSettlements.findIndex(e => e.id === saveId);
        if (idx === -1) return;
        s.savedSettlements[idx].settlement = JSON.parse(JSON.stringify(target.settlement));
      }
      // Always also refresh the live settlement view so the user sees
      // the revert immediately.
      s.settlement = JSON.parse(JSON.stringify(target.settlement));
    });
    return true;
  },

  // Reactive update state
  whatIfPreview: null,   // { delta, previewSettlement } from a proposed change
  pendingChange: null,   // { type, payload } describing the proposed mutation
  // Tier 5.1: structured delta from the most recent regenerate. UI
  // surfaces it via the RegenerationDeltaCard until dismissed.
  lastRegenerationDelta: null,

  // ── Campaign-state engine (v1) ────────────────────────────────────────────
  // Phase distinguishes design-time tinkering ('draft') from in-world
  // events after the settlement is deployed into a campaign ('canon').
  // Same engine underneath; only policy differs (event-log persistence,
  // narrative tone, validation strictness). See domain/types.js for the
  // full contract.
  phase:           'draft',  // 'draft' | 'canon'
  locks:           {},       // see Locks typedef in domain/types.js
  systemState:     null,     // SystemState — derived after every generation/event
  eventLog:        [],       // EventLogEntry[] — populated only in canon mode
  pendingPreview:  null,     // EventPreview — set by previewEvent, cleared by apply/dismiss

  // Set by applyEvent when a pillar-tier NPC death just committed.
  // The SuccessorPrompt UI consumes this to ask the DM whether to
  // appoint one of the engine-suggested successors. Cleared by the
  // user dismissing the prompt or by completing an ASSIGN_NPC_TO_ROLE.
  // Shape: { outgoingNpcId, outgoingNpcName, suggestedSuccessorIds, originEventId }
  pendingSuccession: null,

  // Provenance timestamps — populated by the relevant handlers below.
  // Surface in ProvenanceBlock so DMs can see at a glance "when did
  // this become canon?" / "when was it last exported?" without
  // hunting through chronicle entries.
  generatedAt:    null,
  editedAt:       null,
  canonizedAt:    null,
  lastExportAt:   null,

  // ── Generation ─────────────────────────────────────────────────────────────
  // Async because the generator engine chunk is lazy-loaded (see
  // loadEngine() above). On first call the user pays ~100-200ms of
  // chunk-download time; subsequent calls are cached.
  generateSettlement: async (seedOverride) => {
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

    const eng = await loadEngine();

    // Use pipeline or legacy generator
    let result;
    if (state.usePipeline) {
      const seed = seedOverride || eng.generateSeed();
      // Capture the full pipeline context so reactive applyChange/applyEvent
      // can re-run only affected steps with the same seed instead of paying
      // for a full regeneration. Without this, every "what changed?" feature
      // either rerolls the town's identity or fails outright.
      let capturedCtx = null;
      // Per-step trace for the "How this was simulated" rail. Each step
      // contributes one entry with a factual summary derived from the
      // accumulated context (e.g. "5 institutions placed"). Errors in
      // the summarizer don't fail the run — they just produce a null
      // summary and the rail falls back to the label.
      const pipelineHistory = [];
      result = eng.generateSettlementPipeline(fullConfig, neighbor, {
        seed,
        onComplete: (ctx) => { capturedCtx = ctx; },
        onStep: (name, ctx /*, patch */) => {
          const meta = metaForStep(name);
          let summary;
          try { summary = meta.summary ? meta.summary(ctx) : null; }
          catch { summary = null; }
          pipelineHistory.push({ id: name, ts: Date.now(), summary });
        },
      });
      // Derive the SystemState immediately so the UI never sees a settlement
      // without its accompanying state snapshot. The domain function is
      // pure — no store, no React — and tolerant of partial inputs, so a
      // sparse settlement still produces a usable state.
      let systemState = null;
      try {
        systemState = deriveSystemState(result);
      } catch (e) {
        console.warn('[settlementSlice] deriveSystemState failed:', e);
      }
      const now = new Date().toISOString();
      set(state => {
        state.settlement = result;
        state.lastSeed = seed;
        state.lastCtx = capturedCtx;
        state.systemState = systemState;
        state.aiSettlement = null;
        state.whatIfPreview = null;
        state.pendingChange = null;
        state.pendingPreview = null;
        state.pipelineHistory = pipelineHistory;
        // P100 — arm the reveal overlay. PipelineReveal mounts when this
        // flips true, plays back through pipelineHistory, then calls
        // dismissPipelineReveal() to clear it. Gated by the flag at the
        // consumer site (GenerateWizard) so a flag-flip kills the
        // behavior without touching the slice.
        state.pipelineRevealActive = true;
        // Generation always returns the settlement to draft phase. Going to
        // canon is a deliberate user action (canonize()), not a side-effect
        // of regeneration — that would silently invalidate any campaign log.
        state.phase = 'draft';
        state.eventLog = [];
        state.generatedAt = now;
        state.editedAt = now;
        state.canonizedAt = null;
      });
    } else {
      // Tier 1.7 — legacy generator path. The pipeline path above
      // is preferred; this fallback exists for callers that haven't
      // migrated yet. DEV-only warning so the deprecation is visible
      // during development without polluting production logs.
      if (typeof window !== 'undefined' && window?.location?.hostname === 'localhost') {
        console.warn('[settlementSlice] legacy engineGenerate called — pipeline path is preferred (Tier 1.7).');
      }
      result = eng.engineGenerate(fullConfig);
      set(state => {
        state.settlement = result;
        state.lastSeed = null;
        state.lastCtx = null;
        state.systemState = null;
        state.aiSettlement = null;
        state.whatIfPreview = null;
        state.pendingChange = null;
        state.pendingPreview = null;
        state.phase = 'draft';
        state.eventLog = [];
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
  // Async — same reason as generateSettlement (lazy engine load).
  // Tier 5.1: every regenerate computes a structured delta against
  // the prior settlement so the UI's RegenerationDeltaCard can show
  // what changed. The delta is lazy-imported to keep its transitive
  // domain modules out of the cold-start chunk.
  regenSection: async (section) => {
    const state = get();
    const { settlement, config } = state;
    if (!settlement) return;

    // P103 / X-2 — Track session regen-burst. When the user crosses 5
    // regens in a single session, fire regen_burst (worldbuilder hint
    // for locks/drift/chronicle). Counter lives in-memory only since
    // it's a session-scoped behavior signal.
    set(s => { s.sessionRegenCount = (s.sessionRegenCount || 0) + 1; });
    if ((state.sessionRegenCount || 0) + 1 === 5) {
      import('../lib/pricingMoments.js').then(({ triggerPricingMoment }) => {
        triggerPricingMoment('regen_burst', (content) => {
          get().setActivePricingMoment(content);
        }, { tier: state.auth?.tier });
      }).catch(() => { /* never block a regen */ });
    }
    const cfg = settlement.config || config;
    const eng = await loadEngine();

    // Capture the pre-regen snapshot before mutation so the delta
    // composer has a clean `before` reference.
    const before = JSON.parse(JSON.stringify(settlement));

    if (section === 'npcs') {
      const parts = state.usePipeline
        ? eng.regenNPCsPipeline(settlement, cfg)
        : eng.engineRegenNPCs(settlement, cfg);
      set(s => { Object.assign(s.settlement, parts); });
    } else if (section === 'history') {
      const history = state.usePipeline
        ? eng.regenHistoryPipeline(settlement, cfg)
        : eng.engineRegenHistory(settlement, cfg);
      set(s => { s.settlement.history = history; });
    }

    // Compute the delta against the post-regen settlement.
    try {
      const { deriveRegenerationDelta } = await import('../domain/regenerationDelta.js');
      const after = get().settlement;
      const delta = deriveRegenerationDelta(before, after);
      set(s => { s.lastRegenerationDelta = delta; });
    } catch (e) {
      // Delta is a defensive surface — never block the regenerate
      // on a delta-derivation failure.
      console.warn('[settlementSlice] regenerationDelta failed', e);
    }
  },

  // Tier 5.1: dismiss the most recent delta summary card.
  clearLastRegenerationDelta: () =>
    set(state => { state.lastRegenerationDelta = null; }),

  // ── Reactive updates (What-If engine) ──────────────────────────────────────

  /**
   * Propose a change without applying it. Computes the delta preview.
   * type: 'addInstitution' | 'removeInstitution' | 'addStressor' | 'removeStressor'
   *       | 'addNeighbour' | 'removeNeighbour'
   * payload: change-specific data
   */
  proposeChange: (type, payload) => {
    const state = get();
    const { settlement, _lastSeed, lastCtx } = state;
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

  /**
   * Apply the pending what-if change for real.
   *
   * IMPORTANT — same-seed reuse: this used to call `generateSeed()`,
   * meaning every applied change rerolled the entire town under a fresh
   * seed. That destroyed continuity (the name, the founding lore, the
   * unrelated NPCs all shifted). The current implementation reuses
   * `lastSeed` so the deterministic PRNG produces the same output for
   * any subsystem the change doesn't affect — only the genuinely
   * impacted parts move. The only path to a new seed is an explicit
   * regeneration call.
   *
   * Future work (Week 4b): replace the full re-generation with
   * `rerunAffected(lastCtx, ...)` so we don't even pay for the
   * untouched steps. For v1 we keep the same-seed re-run to preserve
   * the visible-output contract (full settlement returned) and just
   * fix the determinism bug.
   */
  applyChange: async () => {
    const state = get();
    const { pendingChange } = state;
    if (!pendingChange) return;

    const fullConfig = {
      ...(state.settlement?.config || state.config),
      _institutionToggles: pendingChange.overrides.institutionToggles || state.institutionToggles,
      _categoryToggles:    state.categoryToggles,
      _goodsToggles:       state.goodsToggles,
      _servicesToggles:    state.servicesToggles,
    };

    const eng = await loadEngine();

    if (state.usePipeline) {
      const seed = state.lastSeed || eng.generateSeed();
      let capturedCtx = null;
      const result = eng.generateSettlementPipeline(fullConfig, state.importedNeighbour, {
        seed,
        onComplete: (ctx) => { capturedCtx = ctx; },
      });
      let nextSystemState = state.systemState;
      try { nextSystemState = deriveSystemState(result); } catch (e) {
        console.warn('[settlementSlice.applyChange] deriveSystemState failed:', e);
      }
      set(s => {
        s.settlement     = result;
        s.lastSeed       = seed;       // unchanged unless missing — preserves identity
        s.lastCtx        = capturedCtx;
        s.systemState    = nextSystemState;
        s.pendingChange  = null;
        s.whatIfPreview  = null;
      });
    } else {
      // Tier 1.7 — legacy generator path (same deprecation note as
      // the primary generate() handler).
      if (typeof window !== 'undefined' && window?.location?.hostname === 'localhost') {
        console.warn('[settlementSlice] legacy engineGenerate called from applyPendingChange — pipeline path is preferred (Tier 1.7).');
      }
      const result = eng.engineGenerate(fullConfig);
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

  /**
   * Save the current settlement, snapshotting the live lifecycle state
   * (phase / eventLog / systemState / locks / provenance timestamps) into
   * the save record's `campaignState` so a subsequent reload restores
   * exactly what the user is looking at.
   *
   * Without this snapshot, two saves would share whatever was last in
   * the global slice — exactly the bug the audit flagged. The
   * `campaign_state` JSONB column on Supabase plus the migration helper
   * in `lib/saves.js` round-trip these fields.
   */
  saveSettlement: (settlement) => {
    const state = get();
    if (!state.canSave()) return false;

    const max = state.maxSaves();
    if (state.savedSettlements.length >= max) return false;

    const wasFirstSave = state.savedSettlements.length === 0;
    const wasThirdSave = state.savedSettlements.length === 2 && max === 3;

    set(s => {
      s.savedSettlements.push({
        ...settlement,
        savedAt: Date.now(),
        id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        campaignState: pickleCampaignState(state),
      });
    });

    // P103 / X-2 — first_save + third_save pricing moments. Fire-and-
    // forget so the save action returns promptly; the moment library
    // enforces 24h-per-moment cooldown so this can't spam.
    if (wasFirstSave || wasThirdSave) {
      import('../lib/pricingMoments.js').then(({ triggerPricingMoment }) => {
        const reason = wasThirdSave ? 'third_save' : 'first_save';
        triggerPricingMoment(reason, (content) => {
          // Use the store-bound opener so PricingMomentCard renders.
          get().setActivePricingMoment(content);
        }, { tier: state.auth?.tier });
      }).catch(() => { /* never block a save */ });
    }
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

  // ── User-edited prose (Tier 5.4) ─────────────────────────────────────────
  //
  // Edit-mode toggle: when true, EditableText components in the
  // dossier become clickable. False by default so casual readers see
  // the dossier as static prose. The toggle lives on the store so any
  // component tree (tabs, sidebar, PDF preview) can read the same
  // value without prop-threading.
  editMode: false,
  setEditMode: (next) => set(state => { state.editMode = !!next; }),
  toggleEditMode: () => set(state => { state.editMode = !state.editMode; }),


  //
  // Apply / revert a hand-authored value at a registered editable
  // path. The path is gated by EDITABLE_FIELDS so the UI cannot
  // accidentally edit a structural field (population, tier, faction
  // power) that would invalidate the simulation math.
  //
  // applyUserEditAction(kind, entityIndex, path, value):
  //   kind:        'settlement' | 'npc' | 'institution' | 'faction' |
  //                'hook' | 'plotHook' | 'condition' | 'supplyChain' |
  //                'historicalEvent' | 'currentTension'
  //   entityIndex: array index (ignored when kind === 'settlement')
  //   path:        dotted path inside the entity (e.g. 'secret.what')
  //   value:       the user-authored string
  //
  // The canonStatus tagger picks up _authored: true automatically, so
  // the edited entity becomes source: 'user', locked: true. AI
  // grounding sees it via `forbiddenChanges`, and the verifier
  // protects it via `changed_user_field`.

  applyUserEditAction: (kind, entityIndex, path, value) =>
    set(state => {
      if (!state.settlement) return;
      if (!isEditablePath(kind, path)) return;  // strict registry gate
      const entity = _resolveEntity(state.settlement, kind, entityIndex);
      if (!entity) return;
      domainApplyUserEdit(entity, path, value);
    }),

  revertUserEditAction: (kind, entityIndex, path) =>
    set(state => {
      if (!state.settlement) return;
      const entity = _resolveEntity(state.settlement, kind, entityIndex);
      if (!entity) return;
      domainRevertUserEdit(entity, path);
    }),

  /** Count user edits across the live settlement. Reactive selector. */
  countSettlementEdits: () => {
    const s = get().settlement;
    return s ? domainCountSettlementEdits(s) : 0;
  },

  /** True if the live settlement has any user edits. Reactive selector. */
  isSettlementEdited: () => {
    const s = get().settlement;
    return !!s && domainCountSettlementEdits(s) > 0;
  },

  // ── Campaign-state engine handlers ────────────────────────────────────────

  /**
   * Move the settlement from draft to canon. The act of canonizing is
   * deliberate — generation never does it automatically — because once
   * a settlement is canon, every change defaults to a logged in-world
   * event with permanent timeline impact. Going to canon resets the
   * event log to an empty timeline starting now and stamps the
   * canonizedAt provenance timestamp.
   */
  canonize: () => set(state => {
    state.phase = 'canon';
    state.eventLog = [];
    state.canonizedAt = new Date().toISOString();
  }),

  /** Drop back to draft. Useful if the DM wants to keep tinkering before
   *  the campaign actually starts. Discards any prior event log. */
  uncanonize: () => set(state => {
    state.phase = 'draft';
    state.eventLog = [];
    state.canonizedAt = null;
  }),

  /** Stamp lastExportAt — called by export flows. Drives both the
   *  ProvenanceBlock display and the OnboardingChecklist's "exported"
   *  step auto-tick. */
  markExported: () => {
    // Compute "is first export?" before we stamp it. Drives first_pdf_export.
    const wasFirstExport = !get().lastExportAt;
    set(state => {
      state.lastExportAt = new Date().toISOString();
    });
    if (wasFirstExport) {
      // P103 / X-2 — first_pdf_export pricing moment.
      import('../lib/pricingMoments.js').then(({ triggerPricingMoment }) => {
        triggerPricingMoment('first_pdf_export', (content) => {
          get().setActivePricingMoment(content);
        }, { tier: get().auth?.tier });
      }).catch(() => { /* never block an export */ });
    }
  },

  setLock: (key, value) => set(state => {
    if (value === false || value === undefined || (Array.isArray(value) && value.length === 0)) {
      delete state.locks[key];
    } else {
      state.locks[key] = value;
    }
  }),

  clearLocks: () => set(state => { state.locks = {}; }),

  /**
   * Run the event preview without committing. UI shows the result as a
   * "what would happen" panel; user clicks Confirm to commit via
   * applyEvent. previewEvent is pure, so calling it repeatedly is safe.
   */
  previewEvent: (event) => {
    const state = get();
    if (!state.settlement) return null;
    const preview = domainPreviewEvent({
      settlement: state.settlement,
      systemState: state.systemState,
      event,
    });
    set(s => { s.pendingPreview = preview; });
    return preview;
  },

  /**
   * Commit an event for real. Mutates the settlement via
   * `domainApplyEvent`, re-derives systemState from the mutated
   * settlement, and appends to eventLog (canon only). Updates the
   * editedAt provenance timestamp.
   *
   * The audit's preview-vs-apply integrity rule: prefer
   * `applyPendingPreview()` when there is one — that path commits
   * exactly the event the user previewed. This direct `applyEvent`
   * is for callers (like draft-mode rapid-fire edits) that don't go
   * through the preview flow.
   */
  applyEvent: (event) => {
    const state = get();
    if (!state.settlement) return null;
    const { logEntry, nextSystemState, nextSettlement } = domainApplyEvent({
      settlement: state.settlement,
      systemState: state.systemState,
      event,
    });

    // Successor detection: when a pillar-tier NPC dies, surface the
    // engine's ranked successor list to the UI so the DM doesn't have
    // to invent a replacement from scratch. The prompt is informational
    // and dismissible; it does not block other UI flow. The original
    // pre-mutation settlement is the source of truth for "who was alive
    // and linked to whom" because the post-mutation copy already shows
    // the dead NPC as removed/dead.
    let pendingSuccession = null;
    if (event?.type === 'KILL_NPC') {
      const outgoing = (state.settlement.npcs || []).find(n =>
        (n.id && n.id === event.targetId) ||
        (n.name && n.name.toLowerCase() === String(event.targetId || '').toLowerCase()),
      );
      const importance = event.payload?.importance || (outgoing ? inferImportance(outgoing) : 'notable');
      if (importance === 'pillar' && outgoing) {
        const suggestedIds = inferSuccessors({ outgoing, settlement: state.settlement, limit: 3 });
        pendingSuccession = {
          outgoingNpcId:   outgoing.id || outgoing.name,
          outgoingNpcName: outgoing.name || 'Unknown',
          outgoingRole:    outgoing.role || '',
          linkedInstitutionIds: outgoing.linkedInstitutionIds || [],
          suggestedSuccessorIds: suggestedIds,
          originEventId:   event.id,
        };
      }
    }

    set(s => {
      s.settlement     = nextSettlement;
      s.systemState    = nextSystemState;
      s.editedAt       = new Date().toISOString();
      s.pendingPreview = null;
      if (pendingSuccession) s.pendingSuccession = pendingSuccession;
      // Only canon-mode events go into the timeline. Draft edits
      // produce the same state delta + entity mutation but don't
      // persist as in-world history — see the draft-vs-canon design
      // note in domain/types.js.
      if (s.phase === 'canon') {
        s.eventLog.push(logEntry);
      }
    });
    return logEntry;
  },

  /** Dismiss the successor prompt without taking action. */
  dismissPendingSuccession: () => set(state => { state.pendingSuccession = null; }),

  /**
   * Commit the currently-pending preview event. This is the audit's
   * "preview/apply must commit the exact same event" fix. The UI
   * builds the event once, hands it to previewEvent, then calls this
   * to apply — guaranteed to commit the previewed event byte-for-byte
   * (same id, same payload, same severity), so the deltas in the
   * applied log entry match what the preview panel showed.
   */
  applyPendingPreview: () => {
    const state = get();
    if (!state.settlement || !state.pendingPreview?.event) return null;
    return state.applyEvent(state.pendingPreview.event);
  },

  dismissPreview: () => set(state => { state.pendingPreview = null; }),

  /**
   * Undo the most recent canon event. Restores both the systemState
   * and the entity-level mutations the event produced — every
   * impairment carries its causeEventId, so we can scrub them out
   * cleanly without rebuilding the settlement from scratch.
   *
   * This works for impairment-shaped events. Removal events
   * (REMOVE_INSTITUTION setting status='removed') aren't reversed
   * automatically yet — those need an explicit RESTORE_INSTITUTION
   * follow-up event. The architecture supports finer-grained undo
   * once removal events also stamp their causeEventId for reversal.
   */
  undoLastEvent: () => set(state => {
    if (state.phase !== 'canon' || state.eventLog.length === 0) return;
    const popped = state.eventLog.pop();
    state.systemState = popped.beforeState;
    const eventId = popped.event?.id;
    if (!eventId || !state.settlement) return;
    // Walk every entity list and strip impairments tagged with this event.
    state.settlement.institutions = (state.settlement.institutions || []).map(stripImpairmentsForEvent(eventId));
    if (state.settlement.factions) {
      state.settlement.factions = state.settlement.factions.map(stripImpairmentsForEvent(eventId));
    }
    if (state.settlement.powerStructure?.factions) {
      state.settlement.powerStructure.factions =
        state.settlement.powerStructure.factions.map(stripImpairmentsForEvent(eventId));
    }
    state.settlement.npcs = (state.settlement.npcs || []).map(stripImpairmentsForEvent(eventId));
  }),

  /** Force a re-derivation of systemState from the current settlement.
   *  Useful after an out-of-band edit that mutates settlement directly. */
  refreshSystemState: () => set(state => {
    if (!state.settlement) return;
    try {
      state.systemState = deriveSystemState(state.settlement);
    } catch (e) {
      console.warn('[settlementSlice] refreshSystemState failed:', e);
    }
  }),

  /**
   * Hydrate the live lifecycle slots from a saved settlement record.
   *
   * The audit's "saved settlements may not persist phase/eventLog/...
   * — Stoneford detail may show Mossbridge's canon state" CRIT fix.
   * When the user opens a save, the slice replaces its global lifecycle
   * fields with that save's `campaignState`. Without this, all saves
   * share whatever was last in the global state — a campaign-killer.
   *
   * Idempotent: if the save lacks a campaignState block (legacy
   * pre-migration save) the migration default is used. SystemState is
   * re-derived from the settlement if not stored.
   */
  hydrateFromSave: (save) => set(state => {
    if (!save) return;
    const cs = save.campaignState || {};
    state.settlement     = save.settlement || state.settlement;
    state.lastSeed       = save.seed || state.lastSeed;
    state.phase          = cs.phase || 'draft';
    state.eventLog       = Array.isArray(cs.eventLog) ? [...cs.eventLog] : [];
    state.locks          = cs.locks || {};
    state.generatedAt    = cs.generatedAt || null;
    state.editedAt       = cs.editedAt || null;
    state.canonizedAt    = cs.canonizedAt || null;
    state.lastExportAt   = cs.lastExportAt || null;
    state.pendingPreview = null;
    state.pendingChange  = null;
    state.aiSettlement   = save.aiSettlement || null;

    // SystemState: prefer the persisted snapshot; if absent or stale,
    // re-derive from the settlement so the rail/timeline never crashes.
    if (cs.systemState) {
      state.systemState = cs.systemState;
    } else if (save.settlement) {
      try { state.systemState = deriveSystemState(save.settlement); }
      catch (e) { state.systemState = null; }
    } else {
      state.systemState = null;
    }
  }),

  // ── Onboarding checklist ──────────────────────────────────────────────────
  // The checklist auto-ticks itself by deriving completion from current
  // store state (see copy/onboardingSteps.js). This pair of fields just
  // tracks user-driven hide/show.
  onboardingChecklistDismissed: false,
  dismissOnboardingChecklist: () => set(state => { state.onboardingChecklistDismissed = true; }),
  showOnboardingChecklist:    () => set(state => { state.onboardingChecklistDismissed = false; }),
});
