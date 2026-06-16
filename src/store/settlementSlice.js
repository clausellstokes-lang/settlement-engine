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
/** @type {?{ generateSettlementPipeline:Function, regenNPCsPipeline:Function, regenHistoryPipeline:Function, generateSeed:Function }} */
let _engineModule = null;
/** @type {?Promise<NonNullable<typeof _engineModule>>} */
let _enginePromise = null;
function loadEngine() {
  if (_engineModule) return Promise.resolve(_engineModule);
  if (_enginePromise) return _enginePromise;
  _enginePromise = Promise.all([
    import('../generators/generateSettlementPipeline.js'),
    import('../generators/prng.js'),
  ]).then(([pipe, prng]) => {
    _engineModule = {
      generateSettlementPipeline: pipe.generateSettlementPipeline,
      regenNPCsPipeline:          pipe.regenNPCsPipeline,
      regenHistoryPipeline:       pipe.regenHistoryPipeline,
      generateSeed:               prng.generateSeed,
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
import { scrubUndoneEvent } from '../domain/events/undoEvent.js';
import { layerAuthoredDeltas } from '../domain/events/eventPipeline.js';
import { mapEventToPartyImpact } from '../domain/events/partyEventLinkage.js';
import { eligibleCustomContent } from '../domain/customContentSchema.js';
import {
  CRISIS_EVENT_TYPES,
  crisisTwinFor,
  crisisWithdraw,
  twinDirectiveForEvent,
} from '../domain/crisisLifecycle.js';
import { propagateRegionalEvent } from '../domain/region/index.js';
import { reconcileSettlementChange } from '../domain/settlementReconciliation.js';
import { inferSuccessors }   from '../domain/entities/successors.js';
import { inferImportance }   from '../domain/entities/npcs.js';
import { metaForStep }       from '../generators/steps/stepMetadata.js';
import { validateBatch, applyEventBatch as computeEventBatch } from '../domain/events/batch.js';
import {
  applyUserEdit as domainApplyUserEdit,
  revertUserEdit as domainRevertUserEdit,
  isEditablePath,
  countSettlementEdits as domainCountSettlementEdits,
} from '../domain/userEdits.js';
// Anonymous daily generation cap (localStorage soft cap). Enforced here
// so EVERY generation path — hero first-gen, wizard "Regenerate Draft",
// Workshop, sample fork — counts against the same 3/day allowance. The
// cap used to live only in HomeHero, which let regeneration bypass it.
import { anonAtCap, incrementAnonFull, incrementAnonReroll } from '../lib/anonGenCounter.js';
import { saves as savesService } from '../lib/saves.js';
import { activeSaveCount } from '../lib/saveAccess.js';

const MAX_VERSION_HISTORY = 50;

// ── Derived-config strip ────────────────────────────────────────────────
// settlement.config is the RESOLVED effectiveConfig snapshot: pipeline steps
// write purely-derived keys onto it (resolveStress → stressType/stressTypes/
// intendedStressTypes/_population; isolationGenerator → _magicTradeOnly;
// generateEconomy → _neighbourEconBias; resolveConfig → tier/magicLevel/
// terrainType; resolveNeighbour → neighborRelationship). Display and sim
// consumers read those keys from
// settlement.config, so they must stay there — but they must NOT re-enter
// the pipeline as user input: emergent stress would be re-rolled as
// user-forced stress (with a false "selected by user config" receipt) and
// stale isolation/economy flags would outlive their causes.
// settlement._config (the raw pre-resolution config) is the preferred
// regeneration input; this strip protects the fallback for settlements
// persisted before _config existed. Overwritten-in-place keys (floored
// priorityMilitary, magicExists-zeroed priorityMagic, resolved route/threat/
// culture) are NOT stripped here — their raw values are unrecoverable from
// the snapshot and are restored via the _config path instead.
export const DERIVED_CONFIG_KEYS = Object.freeze([
  'stressType', 'stressTypes', 'intendedStressTypes',
  '_magicTradeOnly', '_neighbourEconBias', '_neighbourEconMode', '_isolationInfraType',
  '_population',
  'tier', 'magicLevel', 'terrainType',
  'neighborRelationship',
]);

export function stripDerivedConfigKeys(config) {
  if (!config || typeof config !== 'object') return config;
  const out = { ...config };
  for (const key of DERIVED_CONFIG_KEYS) delete out[key];
  return out;
}

function cloneJson(value) {
  if (value === undefined || value === null) return value;
  return JSON.parse(JSON.stringify(value));
}

function persistSaveUpdate(saveId, partial) {
  if (!saveId || !partial) return;
  savesService.update(saveId, partial).catch(e => {
    console.warn('[settlementSlice] save update failed', e);
  });
}

function cappedVersionHistory(history) {
  return Array.isArray(history) ? history.slice(-MAX_VERSION_HISTORY) : [];
}

function saveEnvelopeFor(saveId, save, settlement, campaignState) {
  return {
    ...(save || {}),
    id: saveId || save?.id || settlement?.id || null,
    name: save?.name || settlement?.name || 'Untitled Settlement',
    tier: save?.tier || settlement?.tier || 'unknown',
    settlement,
    campaignState: campaignState || save?.campaignState || null,
  };
}

function visibleSettlementIdsForCampaign(state, campaign) {
  const placements = campaign?.mapState?.placements || state.mapState?.placements || {};
  return Object.values(placements)
    .map(p => p?.settlementId)
    .filter(Boolean);
}

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

/**
 * Successor detection for applyEvent: when a pillar-tier NPC dies, surface the
 * engine's ranked successor list so the DM doesn't have to invent a replacement
 * from scratch. The prompt is informational and dismissible; it does not block
 * other UI flow. Pure — reads the PRE-mutation settlement (the source of truth
 * for "who was alive and linked to whom"; the post-mutation copy already shows
 * the NPC as removed/dead). Returns null when no prompt is warranted.
 */
function computePendingSuccession(settlement, event) {
  if (event?.type !== 'KILL_NPC') return null;
  const outgoing = (settlement.npcs || []).find(n =>
    (n.id && n.id === event.targetId) ||
    (n.name && n.name.toLowerCase() === String(event.targetId || '').toLowerCase()),
  );
  const importance = event.payload?.importance || (outgoing ? inferImportance(outgoing) : 'notable');
  if (importance !== 'pillar' || !outgoing) return null;
  return {
    outgoingNpcId:   outgoing.id || outgoing.name,
    outgoingNpcName: outgoing.name || 'Unknown',
    outgoingRole:    outgoing.role || '',
    linkedInstitutionIds: outgoing.linkedInstitutionIds || [],
    suggestedSuccessorIds: inferSuccessors({ outgoing, settlement, limit: 3 }),
    originEventId:   event.id,
  };
}

/**
 * The world-ripple half of applyEvent: AFTER the settlement event has committed
 * and persisted, propagate it into the campaign's world engine. Three best-
 * effort, canon-only consumers (campaign is set only in canon), each guarded so
 * a linkage failure can never undo the settlement event that already applied:
 *   1. Regional propagation — the change ripples to visible neighbours.
 *   2. Crisis lifecycle — the DOMAIN names the transition (twinDirectiveForEvent:
 *      'inject' on onset/escalate so the pulse ages the crisis; 'resolve' on
 *      resolution so the pulse stops aging one the DM already ended). This is the
 *      ONE place the store obeys it, so a new crisis event type cannot forget its
 *      twin — the directive lands here by construction, not in a per-event bridge.
 *   3. Party impact — a party-caused event with a world-scale analog also ripples
 *      through the party-impact pipeline (active conditions, faction/NPC world
 *      state, regional propagation, Wizard News).
 * Timestamps reuse this apply's editedAt stamp so propagation stamps no
 * wall-clock time of its own (replay is byte-identical — same args, same graph).
 */
function rippleEventThroughWorld({ afterState, campaign, event, beforeEnvelope, beforeSave, activeSaveId, afterCampaignState }) {
  if (campaign && beforeEnvelope && typeof afterState.setCampaignRegionalGraph === 'function') {
    const afterEnvelope = saveEnvelopeFor(
      activeSaveId,
      beforeSave,
      afterState.settlement,
      afterCampaignState || beforeSave?.campaignState,
    );
    const result = propagateRegionalEvent({
      graph: campaign.regionalGraph,
      beforeSettlement: beforeEnvelope,
      afterSettlement: afterEnvelope,
      event,
      activeSettlementId: activeSaveId,
      visibleSettlementIds: visibleSettlementIdsForCampaign(afterState, campaign),
      maxDepth: 2,
      waveDecay: 0.45,
      now: afterState.editedAt,
    });
    if (result.impacts.length > 0) {
      afterState.setCampaignRegionalGraph(campaign.id, result.graph);
      // The canon-edit cross-settlement propagation moment — this path fired NO
      // analytics. result is a plain domain return; emit the redacted summary.
      Promise.all([
        import('../lib/analytics.js'),
        import('../lib/regionalFingerprint.js'),
      ]).then(([{ track, EVENTS }, { extractRegionalPropagation }]) => {
        const p = extractRegionalPropagation({
          impacts: result.impacts, changes: result.localDelta?.changes,
          genesis: 'canon_edit', maxDepth: 2,
        });
        if (p) track(EVENTS.REGIONAL_PROPAGATION_APPLIED, p);
      }).catch(() => {});
    }
  }

  const twinDirective = campaign ? twinDirectiveForEvent(event) : null;
  if (twinDirective) {
    try {
      if (twinDirective.action === 'inject'
        && typeof afterState.injectCampaignStressor === 'function') {
        afterState.injectCampaignStressor(campaign.id, {
          ...twinDirective.stressor,
          originSettlementId: String(activeSaveId),
          affectedSettlementIds: [String(activeSaveId)],
        });
      } else if (twinDirective.action === 'resolve'
        && typeof afterState.resolveCampaignStressor === 'function') {
        afterState.resolveCampaignStressor(campaign.id, {
          type: twinDirective.type,
          settlementId: String(activeSaveId),
          now: afterState.editedAt,
        });
      }
    } catch { /* the world half is best-effort */ }
  }

  if (event?.partyCaused && campaign) {
    try {
      const action = mapEventToPartyImpact(event, activeSaveId);
      const record = afterState.recordPartyImpact;
      if (action && typeof record === 'function') {
        Promise.resolve(record(campaign.id, action)).catch(() => { /* world ripple is best-effort */ });
      }
    } catch { /* linkage is best-effort */ }
  }
}

export const createSettlementSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  settlement:    null,   // current generated settlement object
  savedSettlements: [],  // persisted to Supabase (or localStorage for anon)
  savedSettlementsLoaded: false, // true once hydrated from savesService
  activeSaveId:  null,   // save id backing the currently-open detail view
  lastSeed:      null,   // seed from last generation (for replay/determinism)
  lastCtx:       null,   // full pipeline context from last run (config recovery for NPC/history regen + pipeline-rail diagnostics)
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
    // Campaign-clock identity lock: reject (rather than queue) NPC/faction
    // renames once the settlement is canonized — names are frozen post-canon.
    if (get().phase === 'canon' && (kind === 'rename-npc' || kind === 'rename-faction')) {
      return null;
    }
    const clock = (get().pendingEditsClock || 0) + 1;
    const edit = _pe_buildEdit(kind, payload, clock);
    set(state => {
      state.pendingEditsClock = clock;
      state.pendingEditsQueue = _pe_appendEdit(state.pendingEditsQueue || [], edit);
    });
    // Analytics — once per queued edit. Read coarse context AFTER the append so
    // queue_depth_after reflects the new active depth. Fire-and-forget.
    const canonPhase = get().phase;
    const queueDepthAfter = _pe_activeEdits(get().pendingEditsQueue || []).length;
    import('../lib/analytics.js').then(({ Funnel, EVENTS }) => {
      Funnel.track(EVENTS.EDIT_PENDING_QUEUED, {
        kind,
        canon_phase: canonPhase,
        queue_depth_after: queueDepthAfter,
      });
    }).catch(() => {});
    return edit;
  },

  /** Mark an edit as reverted (kept in history for undo). */
  revertSingleEdit: (editId) => {
    set(state => {
      state.pendingEditsQueue = _pe_revertEdit(state.pendingEditsQueue || [], editId);
    });
    // Analytics — fire-and-forget; reverting one queued edit.
    import('../lib/analytics.js').then(({ track, EVENTS }) => {
      track(EVENTS.EDIT_REVERTED, { count: 1, scope: 'single' });
    }).catch(() => {});
  },

  /** Discard the entire queue without applying. */
  revertPendingEdits: () => {
    // Count the active edits being discarded BEFORE clearing, for analytics.
    const droppedCount = _pe_activeEdits(get().pendingEditsQueue || []).length;
    set(state => {
      state.pendingEditsQueue = [];
    });
    // Analytics — fire-and-forget; whole-queue discard.
    import('../lib/analytics.js').then(({ track, EVENTS }) => {
      track(EVENTS.EDIT_REVERTED, { count: droppedCount, scope: 'all' });
    }).catch(() => {});
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

    // Analytics — fire-and-forget. Band the committed edits into coarse
    // structural / rename / prose counts (same kind groupings as previewCascade).
    let structuralCount = 0;
    let renameCount = 0;
    let proseCount = 0;
    for (const e of active) {
      switch (e.kind) {
        case 'add-institution':
        case 'remove-institution':
        case 'add-resource':
        case 'remove-resource':
        case 'add-stressor':
        case 'remove-stressor':
          structuralCount += 1;
          break;
        case 'rename-npc':
        case 'rename-faction':
        case 'rename-settlement':
          renameCount += 1;
          break;
        case 'edit-prose':
          proseCount += 1;
          break;
        default:
          break;
      }
    }
    const canonPhase = get().phase;
    import('../lib/analytics.js').then(({ track, EVENTS }) => {
      track(EVENTS.EDIT_COMMITTED, {
        count: active.length,
        structural_count: structuralCount,
        rename_count: renameCount,
        prose_count: proseCount,
        canon_phase: canonPhase,
      });
    }).catch(() => {});

    // Research plane (edit_events) — feed the long-built but previously-unfed
    // edit ledger. Saved settlements only (a stable uuid is required), research
    // consent gated, payloads redacted to enum/count only (never edit prose).
    const editUuid = state.activeSaveId;
    if (editUuid) {
      const preSettlement = state.settlement; // Immer-immutable pre-commit ref
      Promise.all([
        import('../lib/consent.js'),
        import('../lib/analyticsQueue.js'),
        import('../lib/editFingerprint.js'),
        import('../domain/pendingEdits.js'),
      ]).then(([{ getConsent }, { enqueueEdit }, { extractEditRows }, { previewCascade }]) => {
        if (!getConsent().research) return;
        let cascade = null;
        try { cascade = previewCascade(preSettlement, queue); } catch { /* coarse cascade is best-effort */ }
        for (const row of extractEditRows(active, { settlementUuid: editUuid, cascade })) enqueueEdit(row);
      }).catch(() => {});
    }
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
  // Saved-settlement timelines persist immediately through the normal
  // save service (`version_history` in Supabase, `versionHistory` locally).
  // Unsaved draft timelines remain live-only until the settlement itself
  // is saved.

  /** @param {{saveId?: string|null, kind?: string, label?: string, ts?: number}} opts */
  recordSnapshot: (opts = {}) => {
    const state = get();
    const ts = opts.ts || Date.now();
    const targetSaveId = opts.saveId || state.activeSaveId || null;
    const activeTarget = targetSaveId && state.activeSaveId && String(targetSaveId) === String(state.activeSaveId);
    const sourceSettlement = targetSaveId
      ? (activeTarget ? state.settlement : state.savedSettlements.find(e => String(e.id) === String(targetSaveId))?.settlement)
      : state.settlement;
    const snapshot = {
      id: `snap_${ts}_${Math.random().toString(36).slice(2, 8)}`,
      ts,
      kind: opts.kind || 'manual',
      label: opts.label || 'Snapshot',
      settlement: sourceSettlement ? JSON.parse(JSON.stringify(sourceSettlement)) : null,
    };
    let persistedHistory = null;
    if (targetSaveId) {
      set(s => {
        const idx = s.savedSettlements.findIndex(e => String(e.id) === String(targetSaveId));
        if (idx === -1) return;
        const cur = s.savedSettlements[idx];
        cur.versionHistory = cappedVersionHistory([...(Array.isArray(cur.versionHistory) ? cur.versionHistory : []), snapshot]);
        persistedHistory = cloneJson(cur.versionHistory);
      });
    } else {
      // No saveId — write into the live settlement's history. This
      // lets unsaved sessions still build a local timeline.
      set(s => {
        if (!s.settlement) return;
        s.settlement.versionHistory = cappedVersionHistory([...(Array.isArray(s.settlement.versionHistory) ? s.settlement.versionHistory : []), snapshot]);
      });
    }
    if (targetSaveId && persistedHistory) persistSaveUpdate(targetSaveId, { versionHistory: persistedHistory });
    return snapshot;
  },

  /** Revert the live settlement (or a save) to a prior snapshot. Auto-
   *  snapshots the CURRENT state first so the user can re-revert if
   *  they meant the other thing. */
  revertToSnapshot: ({ saveId, snapshotId }) => {
    if (!snapshotId) return false;
    const state = get();
    const targetSaveId = saveId || state.activeSaveId || null;
    // Read the snapshot from the appropriate version-history slot.
    const history = targetSaveId
      ? state.savedSettlements.find(e => String(e.id) === String(targetSaveId))?.versionHistory
      : state.settlement?.versionHistory;
    if (!Array.isArray(history)) return false;
    const target = history.find(s => s.id === snapshotId);
    if (!target?.settlement) return false;
    // Snapshot the pre-revert state so this action is non-destructive.
    try {
      const fn = get().recordSnapshot;
      if (typeof fn === 'function') {
        fn({
          saveId: targetSaveId,
          kind: 'pre-revert',
          label: `Before revert to ${target.label || 'snapshot'}`,
        });
      }
    } catch (_e) { /* silent */ }
    // Apply.
    let persistedSettlement = null;
    let persistedHistory = null;
    set(s => {
      if (targetSaveId) {
        const idx = s.savedSettlements.findIndex(e => String(e.id) === String(targetSaveId));
        if (idx === -1) return;
        s.savedSettlements[idx].settlement = JSON.parse(JSON.stringify(target.settlement));
        persistedSettlement = cloneJson(s.savedSettlements[idx].settlement);
        persistedHistory = cloneJson(s.savedSettlements[idx].versionHistory || []);
      }
      // Always also refresh the live settlement view so the user sees
      // the revert immediately.
      s.settlement = JSON.parse(JSON.stringify(target.settlement));
    });
    if (targetSaveId && persistedSettlement) {
      persistSaveUpdate(targetSaveId, {
        settlement: persistedSettlement,
        versionHistory: cappedVersionHistory(persistedHistory),
      });
    }
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
  pendingBatchPreview: null, // BatchPreview — set by previewEventBatch, cleared by applyEventBatch/dismiss

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

    // Anonymous daily generation cap (Tier 7.2). Every full-settlement
    // generation funnels through this action, so this is the single point
    // of enforcement. A *regeneration* (a settlement is already on screen)
    // now counts the same as a first generation — previously rerolls were
    // free, which let an anon mint unlimited towns past the 3/day cap.
    // Captured before the engine runs so we can both block at-cap and pick
    // the right bucket (reroll vs. full) after a successful run.
    const isAnon = state.auth?.tier === 'anon';
    const hadSettlement = !!state.settlement;
    if (isAnon && anonAtCap()) {
      console.warn('[settlementSlice] anonymous daily generation cap reached.');
      return null;
    }

    const fullConfig = {
      ...config,
      _institutionToggles: institutionToggles,
      _categoryToggles:    categoryToggles,
      _goodsToggles:       goodsToggles,
      _servicesToggles:    servicesToggles,
      // "Random" slider mode: resolveConfig rolls the priorities per
      // generation (fresh seed per regenerate) instead of silently using
      // flat 50s — and never writes the rolls back into the stored config.
      ...(state.randomSliderMode === true ? { _randomizePriorities: true } : {}),
      ...(neighbor ? { _importedNeighbor: neighbor } : {}),
    };

    const eng = await loadEngine();

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
    const genStart = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    let result;
    try {
      result = eng.generateSettlementPipeline(fullConfig, neighbor, {
        seed,
        // §14 P2 — only expose homebrew that passes its tier gate to this
        // settlement's tier. Fail-open for random/custom/unknown types, so it
        // can correctly gate but never silently drop eligible content.
        customContent: state.config?.useCustomContent === false
          ? {}
          : eligibleCustomContent(state.customContent, { tier: state.config?.settType }),
        onComplete: (ctx) => { capturedCtx = ctx; },
        onStep: (name, ctx /*, patch */) => {
          const meta = metaForStep(name);
          let summary;
          try { summary = meta.summary ? meta.summary(ctx) : null; }
          catch { summary = null; }
          pipelineHistory.push({ id: name, ts: Date.now(), summary });
        },
      });
    } catch (genErr) {
      // Analytics — fire-and-forget GENERATION_FAILED, then re-throw so the
      // existing propagation behaviour is unchanged (additive only).
      import('../lib/analytics.js').then(({ track, EVENTS }) => {
        track(EVENTS.GENERATION_FAILED, {
          error_kind: 'exception',
          step_name: pipelineHistory.length ? pipelineHistory[pipelineHistory.length - 1].id : undefined,
        });
      }).catch(() => {});
      throw genErr;
    }
    const generationMs = Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) - genStart);
      // Regeneration policy (domain/worldPulse/reconcile.js): world/party-
      // authored conditions survive a local regeneration — a reroll replaces
      // the town, not the campaign layer's crises. No-op on a first
      // generation (no prior settlement). EVENT-authored conditions are
      // deliberately NOT carried here: they ride config.eventConditions, so
      // they survive only when the generation input actually records them.
      // Identity guard: the carry is only for a reroll OF the on-screen
      // working draft. When a SAVED settlement is on screen (activeSaveId
      // set), this generation mints a brand-new town (activeSaveId resets
      // below; the save keeps its own settlement and crises) — carrying the
      // old save's world/party conditions onto the new identity would clone
      // the campaign layer onto an unrelated town.
    const reconciled = state.activeSaveId
      ? result
      : reconcileSettlementChange(result, state.settlement, {
          source: 'regenerate',
          changeType: 'GENERATE_SETTLEMENT',
          changeLabel: result?.name,
        });
      // Derive the SystemState immediately so the UI never sees a settlement
      // without its accompanying state snapshot. The domain function is
      // pure — no store, no React — and tolerant of partial inputs, so a
      // sparse settlement still produces a usable state.
    let systemState = null;
    try {
      systemState = deriveSystemState(reconciled);
    } catch (e) {
      console.warn('[settlementSlice] deriveSystemState failed:', e);
    }
    const now = new Date().toISOString();
    set(state => {
        state.settlement = reconciled;
        state.activeSaveId = null;
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

    // Count this anonymous generation against the daily cap. A regeneration
    // (a settlement was already on screen) spends a reroll; the first
    // generation of the day spends the full allowance. Only on success.
    if (isAnon && result) {
      if (hadSettlement) incrementAnonReroll();
      else incrementAnonFull();
    }

    // Analytics — fire-and-forget, never affects the return. GENERATION_COMPLETED
    // carries the reduced (enum/count-only) fingerprint; fires alongside (not
    // replacing) the component-layer anonymous_generation_completed. When this
    // run replaced an on-screen draft it is also a re-roll, so REGENERATION_TRIGGERED
    // fires with regen_mode 'full' (this action does a fresh whole-pipeline roll).
    Promise.all([
      import('../lib/analytics.js'),
      import('../lib/structuralFingerprint.js'),
      import('../lib/regionalFingerprint.js'),
    ]).then(async ([{ track, EVENTS }, fp, { extractNeighbourGenerated }]) => {
      const { extractReducedFingerprint, computeFingerprintHash, computeConfigSignature, usedRandomSentinels, extractStressorGenesis, band5 } = fp;
      const reduced = extractReducedFingerprint(reconciled) || {};
      const power = reconciled?.powerStructure || {};
      // The variance grouping key (config_signature) + an output identity hash
      // (content_hash) are async (SubtleCrypto); resolve them, but never let a
      // hashing hiccup drop the event.
      let config_signature; let content_hash;
      try { config_signature = await computeConfigSignature(fullConfig); } catch { /* omit */ }
      try { content_hash = await computeFingerprintHash(reduced); } catch { /* omit */ }
      track(EVENTS.GENERATION_COMPLETED, {
        ...reduced,
        config_signature,
        content_hash,
        used_random_sentinels: usedRandomSentinels(fullConfig),
        is_regeneration: hadSettlement,
        duration_ms: generationMs,
        conflict_count: Array.isArray(power.conflicts) ? power.conflicts.length : 0,
        relationship_count: Array.isArray(reconciled?.relationships) ? reconciled.relationships.length : 0,
        service_count: Array.isArray(reconciled?.services) ? reconciled.services.length : 0,
        hook_count: Array.isArray(reconciled?.plotHooks || reconciled?.hooks) ? (reconciled.plotHooks || reconciled.hooks).length : 0,
        legitimacy_band: band5(power.publicLegitimacy?.score),
        defense_readiness: reconciled?.defenseProfile?.readiness?.label,
        neighbour_present: !!(neighbor || reconciled?.neighborRelationship),
        neighbour_relationship_type: reconciled?.neighborRelationship?.relationshipType || fullConfig._neighbourRelType,
        custom_content_active: fullConfig.useCustomContent !== false,
        // per-type stressor genesis (forced-pre / emergent / post-gen / suppressed)
        stressor_genesis: extractStressorGenesis(reconciled),
      });
      // Activate the dead neighbour_generated event: the generation-time
      // neighbour bias (which axes it shifted), only when a neighbour was bound.
      const neigh = extractNeighbourGenerated(reconciled);
      if (neigh) track(EVENTS.NEIGHBOUR_GENERATED, neigh);
      if (hadSettlement) {
        track(EVENTS.REGENERATION_TRIGGERED, { regen_mode: 'full', config_signature });
      }
    }).catch(() => {});

    return reconciled;
  },

  setSettlement: (settlement) =>
    set(state => {
      state.settlement = settlement;
      state.activeSaveId = null;
    }),

  clearSettlement: () =>
    set(state => {
      state.settlement = null;
      state.activeSaveId = null;
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

    // Analytics — fire-and-forget. A section regen re-rolls one subsystem
    // under the existing config (so config is, by construction, unchanged).
    import('../lib/analytics.js').then(({ track, EVENTS }) => {
      track(EVENTS.REGENERATION_TRIGGERED, { regen_mode: section, config_changed: false });
    }).catch(() => {});

    // Capture the pre-regen snapshot before mutation so the delta
    // composer has a clean `before` reference.
    const before = JSON.parse(JSON.stringify(settlement));

    if (section === 'npcs') {
      const parts = eng.regenNPCsPipeline(settlement, cfg);
      set(s => { Object.assign(s.settlement, parts); });
    } else if (section === 'history') {
      const history = eng.regenHistoryPipeline(settlement, cfg);
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
    const { settlement } = state;
    if (!settlement) return;

    // Build the config overrides for this change type. Stressor what-ifs
    // carry a config DELTA under overrides.config (selectedStresses /
    // selectedStressesRandom, occasionally stressorEdits) — never a whole
    // config object: applyChange layers these keys over the raw _config it
    // rebuilds, and spreading the resolved settlement.config snapshot here
    // would smuggle derived keys (stressTypes, _magicTradeOnly, …) back in
    // as generation input.
    let changedKeys = [];
    let overrides = {};

    // The stressor set the engine ACTUALLY produced (resolveStress →
    // stressConfirmPass thread it into the resolved config snapshot). This
    // — not the raw selectedStresses pool — is the base a stressor what-if
    // edits: under random mode the raw pool is empty, so a pool-based add
    // would erase every emergent stressor as a side effect, and a
    // pool-based remove would erase ALL of them (empty pool +
    // random:false ⇒ generateStress returns null). Promoting the visible
    // set into the pinned pool is a deliberate user act (the
    // ConfigurationPanel's un-random toggle does the same), not a silent
    // derived-config echo.
    const effectiveStressTypes = () =>
      settlement.config?.stressTypes
        || (settlement.config?.stressType ? [settlement.config.stressType] : []);

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
      case 'addStressor': {
        const effective = effectiveStressTypes();
        const config = {
          selectedStresses: effective.includes(payload.stressType)
            ? [...effective]
            : [...effective, payload.stressType],
          selectedStressesRandom: false,
        };
        // A RESOLVE_STRESSOR event suppresses config-forced re-rolls of its
        // type (resolveStress's stressorEdits.resolved filter). An explicit
        // re-add supersedes that suppression — without clearing it, this
        // what-if would pin the type into the pool and the overlay would
        // filter it right back out, a silent no-op. Raw-first read mirrors
        // applyChange's merge base.
        const edits = (settlement._config || settlement.config || {}).stressorEdits;
        const resolved = Array.isArray(edits?.resolved) ? edits.resolved : [];
        const lower = (v) => String(v || '').toLowerCase();
        if (resolved.some(r => lower(r) === lower(payload.stressType))) {
          config.stressorEdits = {
            ...edits,
            resolved: resolved.filter(r => lower(r) !== lower(payload.stressType)),
          };
        }
        overrides = { config };
        changedKeys = ['config'];
        break;
      }
      case 'removeStressor':
        // Event-authored stressors (config.stressorEdits.added) are NOT
        // touched here: the overlay re-applies them post-roll, and ending
        // one belongs to the event channel (RESOLVE_STRESSOR), not a config
        // what-if.
        overrides = {
          config: {
            selectedStresses: effectiveStressTypes().filter(t => t !== payload.stressType),
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
   * Edits run the WHOLE pipeline under the reused seed — deterministic and
   * correct, and the only model we keep. A step-level partial-rerun engine was
   * explored and retired (it was dead, buggy, and the wrong abstraction); the
   * derived state layer is already recomputed on demand, so a full same-seed
   * regen plus fresh derivation is both correct and fast enough at this scale.
   */
  applyChange: async () => {
    const state = get();
    const { pendingChange } = state;
    if (!pendingChange) return;

    const fullConfig = {
      // Prefer the RAW pre-resolution config (sentinels intact) so the
      // resolved choices stop propagating generation after generation.
      // Behavior-preserving for what-if edits: the same lastSeed below
      // re-resolves any 'random' sentinel to the identical value.
      // The settlement.config fallback (pre-_config saves) is the resolved
      // snapshot — strip its derived keys so emergent stress / stale
      // isolation flags don't come back as forced input.
      ...(state.settlement?._config
        || stripDerivedConfigKeys(state.settlement?.config)
        || state.config),
      // Stressor what-ifs ride a config DELTA (proposeChange builds only
      // the keys that change: selectedStresses / selectedStressesRandom,
      // occasionally stressorEdits) layered over the raw base so the
      // proposed change wins. Institution what-ifs keep their own
      // toggles channel below.
      ...(pendingChange.overrides.config || {}),
      _institutionToggles: pendingChange.overrides.institutionToggles || state.institutionToggles,
      _categoryToggles:    state.categoryToggles,
      _goodsToggles:       state.goodsToggles,
      _servicesToggles:    state.servicesToggles,
    };

    const eng = await loadEngine();

    const seed = state.lastSeed || eng.generateSeed();
    let capturedCtx = null;
    const result = eng.generateSettlementPipeline(fullConfig, state.importedNeighbour, {
        seed,
        // §14 P2 — tier-gate homebrew for this settlement (fail-open; see above).
        customContent: state.config?.useCustomContent === false
          ? {}
          : eligibleCustomContent(state.customContent, { tier: state.config?.settType }),
        onComplete: (ctx) => { capturedCtx = ctx; },
    });
    // Regeneration policy (domain/worldPulse/reconcile.js): world/party-
    // authored conditions survive a local regeneration. EVENT-authored ones
    // already ride through config.eventConditions (reapplyEventConditions, and
    // isWorldAuthoredCondition disclaims them so they aren't carried twice) —
    // without this reconcile, the same what-if click kept the DM's authored
    // crises but silently erased every pulse/party/regional one.
    const reconciled = reconcileSettlementChange(result, state.settlement, {
      source: 'what_if_change',
      changeType: pendingChange.type,
      changeLabel: pendingChange.payload?.name || pendingChange.payload?.stressType,
    });
    let nextSystemState = state.systemState;
    try { nextSystemState = deriveSystemState(reconciled); } catch (e) {
      console.warn('[settlementSlice.applyChange] deriveSystemState failed:', e);
    }
    set(s => {
        s.settlement     = reconciled;
        s.lastSeed       = seed;       // unchanged unless missing — preserves identity
        s.lastCtx        = capturedCtx;
        s.systemState    = nextSystemState;
        s.pendingChange  = null;
        s.whatIfPreview  = null;
    });
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
    const activeCount = activeSaveCount(state.savedSettlements);
    if (activeCount >= max) return false;

    const wasFirstSave = activeCount === 0;
    const wasThirdSave = activeCount === 2 && max === 3;

    // Lift the new save id + campaignState out of the set() so the
    // research-capture below can address the freshly-saved record by id.
    // Same id shape and value as before — purely a hoist, no behaviour change.
    const newSaveId = `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const newCampaignState = pickleCampaignState(state);

    set(s => {
      s.savedSettlements.push({
        ...settlement,
        savedAt: Date.now(),
        id: newSaveId,
        campaignState: newCampaignState,
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

    // Analytics — fire-and-forget structural snapshot at the 'saved' moment.
    // captureFingerprint skips silently without a stable uuid (local ids) or
    // consent; it never throws and never affects the save's return.
    import('../lib/researchCapture.js').then(({ captureFingerprint }) => {
      captureFingerprint('saved', settlement, {
        save: { ...settlement, id: newSaveId, campaignState: newCampaignState },
        settlementUuid: newSaveId,
      });
    }).catch(() => {});

    return true;
  },

  /** Bulk-replace the savedSettlements array (used for hydration from savesService). */
  setSavedSettlements: (settlements) =>
    set(state => {
      state.savedSettlements = settlements || [];
      state.savedSettlementsLoaded = true;
    }),

  clearSavedSettlements: () =>
    set(state => {
      state.savedSettlements = [];
      state.savedSettlementsLoaded = false;
      state.activeSaveId = null;
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

  destroySavedSettlement: (id, reason = 'destroyed') => {
    const now = new Date().toISOString();
    let persist = null;
    set(state => {
      const idx = state.savedSettlements.findIndex(s => String(s.id) === String(id));
      if (idx === -1) return;
      const save = state.savedSettlements[idx];
      const eventId = `destroy.${id}.${Date.now()}`;
      const nextSettlement = {
        ...(save.settlement || {}),
        status: 'destroyed',
        destroyedAt: now,
        destroyedReason: reason,
        destroyedByEventId: eventId,
      };
      const currentCampaignState = save.campaignState || {};
      const eventLog = Array.isArray(currentCampaignState.eventLog)
        ? [...currentCampaignState.eventLog]
        : [];
      eventLog.push({
        id: eventId,
        type: 'DESTROY_SETTLEMENT',
        targetId: reason,
        timestamp: now,
        narrativeSummary: `${nextSettlement.name || save.name || 'Settlement'} was destroyed${reason ? `: ${reason}` : ''}.`,
      });
      const campaignState = {
        ...currentCampaignState,
        phase: currentCampaignState.phase || 'canon',
        eventLog,
        editedAt: now,
      };
      state.savedSettlements[idx] = {
        ...save,
        settlement: nextSettlement,
        campaignState,
        timestamp: now,
      };
      if (String(state.activeSaveId || '') === String(id)) {
        state.settlement = nextSettlement;
        state.phase = campaignState.phase;
        state.eventLog = eventLog;
        state.editedAt = now;
      }
      persist = {
        settlement: cloneJson(nextSettlement),
        campaignState: cloneJson(campaignState),
        timestamp: now,
      };
    });
    if (persist) persistSaveUpdate(id, persist);
    return Boolean(persist);
  },

  // ── NPC / Faction renaming ─────────────────────────────────────────────────
  renameNPC: (npcIndex, newName) =>
    set(state => {
      // Campaign-clock identity lock: NPC names freeze at canonization. Renames
      // are a draft-only affordance (the UI hides them post-canon; guard here too).
      if (state.phase === 'canon') return;
      if (!state.settlement?.npcs?.[npcIndex]) return;
      state.settlement.npcs[npcIndex].name = newName;
    }),

  renameFaction: (factionIndex, newName) =>
    set(state => {
      // Campaign-clock identity lock: faction names freeze at canonization.
      if (state.phase === 'canon') return;
      // Canonical factions live on powerStructure.factions; settlement.factions
      // is a usually-empty legacy mirror. The old code only saw the mirror, so
      // a rename silently no-opped on every generated settlement. Resolve the
      // canonical list first, falling back to the legacy array.
      const list = state.settlement?.powerStructure?.factions?.length
        ? state.settlement.powerStructure.factions
        : state.settlement?.factions;
      const fac = list?.[factionIndex];
      if (!fac) return;
      // Faction records label on `.faction` (generated) or `.name` (edited/
      // legacy); keep both in sync so every reader (findFaction checks both)
      // sees the new name.
      fac.name = newName;
      if ('faction' in fac) fac.faction = newName;
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
  canonize: () => {
    const fromPhase = get().phase;
    set(state => {
      state.phase = 'canon';
      state.eventLog = [];
      state.canonizedAt = new Date().toISOString();
    });
    // Persist so canon sticks across reload and the library reflects it.
    get().persistActiveSaveLifecycle?.();
    // Analytics — fire-and-forget. CANON_PHASE_CHANGED records the transition;
    // captureFingerprint('canonized') snapshots the structural shape at canon
    // (skips silently without a stable settlement uuid / consent).
    const after = get();
    const activeSaveId = after.activeSaveId || null;
    const save = activeSaveId
      ? after.savedSettlements.find(s => String(s.id) === String(activeSaveId))
      : null;
    import('../lib/analytics.js').then(({ track, EVENTS }) => {
      track(EVENTS.CANON_PHASE_CHANGED, { from_phase: fromPhase, to_phase: 'canon' });
    }).catch(() => {});
    if (after.settlement && activeSaveId) {
      import('../lib/researchCapture.js').then(({ captureFingerprint }) => {
        captureFingerprint('canonized', after.settlement, { save, settlementUuid: activeSaveId });
      }).catch(() => {});
    }
  },

  /** Drop back to draft. Useful if the DM wants to keep tinkering before
   *  the campaign actually starts. Discards any prior event log. */
  uncanonize: () => {
    const fromPhase = get().phase;
    set(state => {
      state.phase = 'draft';
      state.eventLog = [];
      state.canonizedAt = null;
    });
    get().persistActiveSaveLifecycle?.();
    // Analytics — fire-and-forget; the canon→draft transition.
    import('../lib/analytics.js').then(({ track, EVENTS }) => {
      track(EVENTS.CANON_PHASE_CHANGED, { from_phase: fromPhase, to_phase: 'draft' });
    }).catch(() => {});
  },

  /**
   * Persist the live lifecycle (phase / eventLog / canonizedAt) + settlement
   * to the active save, so deliberate lifecycle changes (canonize, uncanonize)
   * survive reload and the library reflects them. Mirrors applyEvent's persist.
   */
  persistActiveSaveLifecycle: () => {
    const s = get();
    const activeSaveId = s.activeSaveId;
    if (!activeSaveId || !s.settlement) return;
    const campaignState = pickleCampaignState(s);
    const savePartial = {
      settlement: cloneJson(s.settlement),
      campaignState,
      timestamp: new Date().toISOString(),
    };
    if (typeof s.updateSavedSettlement === 'function') {
      s.updateSavedSettlement(activeSaveId, savePartial);
    }
    persistSaveUpdate(activeSaveId, {
      settlement: savePartial.settlement,
      campaignState: savePartial.campaignState,
    });
  },

  /** Stamp lastExportAt — called by export flows. Drives the
   *  ProvenanceBlock display. */
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
    const activeSaveId = state.activeSaveId || null;
    // Campaign-clock (Phase C1): a settlement bound to a CANONIZED campaign
    // world surrenders its independent timeline. Its events don't resolve now —
    // they queue as pending intentions and resolve simultaneously with every
    // other member at the next world-pulse advance (drainQueuedEvents). Only in
    // canon; draft edits stay authorial and immediate.
    if (activeSaveId && state.phase === 'canon'
        && typeof state.isSettlementClockBound === 'function'
        && state.isSettlementClockBound(activeSaveId)) {
      const queued = state.queueSettlementEvent(activeSaveId, event);
      if (queued) {
        set(s => { s.pendingPreview = null; s.pendingBatchPreview = null; });
        return queued;
      }
    }
    const beforeSave = activeSaveId
      ? state.savedSettlements.find(save => String(save.id) === String(activeSaveId))
      : null;
    const campaign = activeSaveId && state.phase === 'canon'
      ? (state.campaigns || []).find(c => (c.settlementIds || []).map(String).includes(String(activeSaveId)))
      : null;
    const beforeEnvelope = activeSaveId
      ? saveEnvelopeFor(activeSaveId, beforeSave, state.settlement, beforeSave?.campaignState)
      : null;

    let { logEntry, nextSystemState, nextSettlement } = domainApplyEvent({
      settlement: state.settlement,
      systemState: state.systemState,
      event,
    });
    nextSettlement = reconcileSettlementChange(nextSettlement, state.settlement, {
      source: state.phase === 'canon' ? 'canon_event' : 'draft_event',
      changeType: event?.type,
      changeLabel: event?.targetId || event?.payload?.label || event?.id,
      now: logEntry.appliedAt,
    });
    // Re-derive SystemState from the RECONCILED settlement (so reconciliation's
    // world-condition preservation is reflected) and RE-LAYER the event's authored
    // deltas — matching the domain pipeline's canonical afterState formula
    // (deriveSystemState + authored deltas). Previously this re-derived structurally
    // only, silently discarding the authored-effect surface (e.g. CUT_TRADE_ROUTE's
    // resilience/resourcePressure/externalThreat deltas), so the persisted afterState
    // disagreed with the preview the DM was shown. Pinned by the preview==apply invariant.
    nextSystemState = layerAuthoredDeltas(deriveSystemState(nextSettlement), event, state.settlement);
    logEntry = {
      ...logEntry,
      afterState: nextSystemState,
    };
    // Undo seam for the crisis twin directive below: snapshot the campaign
    // twin BEFORE the directive upserts/resolves it (logEntry.undo is the
    // established snapshot home; crisisWithdraw composes the restore from
    // it). Without this, undoing an onset that overwrote an earlier twin
    // loses that copy, and undoing a resolution has no pre-resolution
    // lifecycle to restore. Gated on the lifecycle's own event registry so
    // a new crisis event type gets its snapshot by construction.
    if (campaign && CRISIS_EVENT_TYPES.includes(event?.type)) {
      logEntry = {
        ...logEntry,
        undo: {
          ...(logEntry.undo || {}),
          campaignTwin: crisisTwinFor(campaign.worldState?.stressors, event, activeSaveId),
        },
      };
    }

    // Successor detection (pure; see computePendingSuccession): a dead
    // pillar-tier NPC surfaces a ranked, dismissible successor prompt for the DM.
    const pendingSuccession = computePendingSuccession(state.settlement, event);

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

    const afterState = get();
    let afterCampaignState = null;
    if (activeSaveId && afterState.settlement) {
      afterCampaignState = pickleCampaignState(afterState);
      const savePartial = {
        settlement: cloneJson(afterState.settlement),
        campaignState: afterCampaignState,
        timestamp: afterState.editedAt,
      };
      if (typeof afterState.updateSavedSettlement === 'function') {
        afterState.updateSavedSettlement(activeSaveId, savePartial);
      }
      persistSaveUpdate(activeSaveId, {
        settlement: savePartial.settlement,
        campaignState: savePartial.campaignState,
      });
    }

    // Propagate the committed event into the campaign world engine — regional
    // graph, crisis-lifecycle twin, party-impact pipeline. See the helper for
    // the per-consumer rationale; all canon-only and best-effort + guarded.
    rippleEventThroughWorld({ afterState, campaign, event, beforeEnvelope, beforeSave, activeSaveId, afterCampaignState });

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
   * Preview a batch of staged changes WITHOUT committing. Validates the
   * cross-references first (a dangling reference blocks the whole batch),
   * then runs the pure domain batch to compute the combined SystemState
   * delta + per-change narratives. Result is stashed in pendingBatchPreview
   * for the staging UI; nothing is mutated or persisted.
   */
  previewEventBatch: (events) => {
    const state = get();
    if (!state.settlement || !Array.isArray(events) || events.length === 0) return null;
    const validation = validateBatch(state.settlement, events);
    const result = computeEventBatch({
      settlement: state.settlement,
      systemState: state.systemState,
      events,
    });
    const preview = {
      events,
      validation,
      systemStateDeltas: result.systemStateDeltas,
      afterSystemState:  result.afterSystemState,
      perEvent:          result.perEvent,
      rerunKeys:         result.rerunKeys,
    };
    set(s => { s.pendingBatchPreview = preview; });
    return preview;
  },

  /**
   * Commit a batch of staged changes. Validates first; a blocking warning
   * aborts the WHOLE batch (nothing is applied). Otherwise applies each
   * change in order through the proven single-event `applyEvent` path, so
   * succession prompts, persistence, regional propagation, and the timeline
   * log all behave exactly as they do for one change. Forward references
   * resolve because each `applyEvent` threads the prior result into the next.
   */
  applyEventBatch: (events) => {
    const state = get();
    if (!state.settlement || !Array.isArray(events) || events.length === 0) {
      return { ok: false, warnings: [], logEntries: [] };
    }
    const validation = validateBatch(state.settlement, events);
    if (!validation.ok) {
      set(s => { s.pendingBatchPreview = { events, validation }; });
      return { ok: false, warnings: validation.warnings, logEntries: [] };
    }
    const logEntries = [];
    for (const event of events) {
      const entry = get().applyEvent(event);
      if (entry) logEntries.push(entry);
    }
    set(s => { s.pendingBatchPreview = null; });
    // Campaign-clock: on a clock-bound settlement every event only QUEUED (the
    // markers carry `queued:true`); nothing mutated, so callers should not raise
    // the stale-narrative notice.
    const queuedOnly = logEntries.length > 0 && logEntries.every(e => e?.queued);
    return { ok: true, warnings: [], logEntries, queuedOnly };
  },

  dismissBatchPreview: () => set(state => { state.pendingBatchPreview = null; }),

  /**
   * Undo the most recent canon event. Restores the systemState and scrubs
   * every settlement artifact the event left behind: impairments (each
   * carries its causeEventId), the activeCondition the event promoted, and
   * the authored records it dual-wrote into config/_config — eventConditions
   * / resourceEdits / customTradeGoods / stressorEdits / _cutRoutes plus the
   * annotation ledgers and stress entries (domain/events/undoEvent.js). The record
   * scrub matters because regeneration deliberately RE-APPLIES those records
   * (reapplyEventConditions, resolveResources, generateEconomy): without it
   * an undone PLAGUE re-promoted its condition on every what-if, permanently.
   *
   * Removal events (REMOVE_INSTITUTION setting status='removed') reverse via
   * the removedByEventId stamp in stripImpairmentsForEvent; resource/trade
   * records restore from the pre-event snapshot applyEvent stamped on the
   * log entry (legacy entries without one keep today's leave-it behavior).
   */
  undoLastEvent: () => {
    if (get().phase !== 'canon' || get().eventLog.length === 0) return;
    // Read the entry about to be popped while it is still in state — the
    // roaming-twin reconcile below needs its event + undo snapshot.
    const undoneEntry = get().eventLog[get().eventLog.length - 1];
    set(state => {
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
      // Conditions + authored config/_config records + provenance-stamped
      // annotations, finishing with the eventConditions re-sync.
      state.settlement = scrubUndoneEvent(state.settlement, popped);
      state.editedAt = new Date().toISOString();
    });
    // Persist the undo to the active save. applyEvent persisted the event,
    // so leaving the save untouched would resurrect the undone event — log
    // entry, condition, and records — on the next reload.
    const afterState = get();
    if (afterState.activeSaveId && afterState.settlement) {
      const savePartial = {
        settlement: cloneJson(afterState.settlement),
        campaignState: pickleCampaignState(afterState),
        timestamp: afterState.editedAt,
      };
      if (typeof afterState.updateSavedSettlement === 'function') {
        afterState.updateSavedSettlement(afterState.activeSaveId, savePartial);
      }
      persistSaveUpdate(afterState.activeSaveId, {
        settlement: savePartial.settlement,
        campaignState: savePartial.campaignState,
      });
    }
    // The crisis twin directive's inverse (canon-only — this action already
    // gates on canon, mirroring the forward consumer in applyEvent): the
    // lifecycle composes the withdrawal from the popped entry
    // (crisisLifecycle.crisisWithdraw — 'withdraw' pulls the twin the onset
    // injected, or the pulse keeps aging a crisis the timeline no longer
    // contains; 'restore' un-resolves the twin from the logEntry.undo
    // snapshot, or it stays an echo while the local condition un-eases).
    // The spread/re-ignited guards and the legacy-entry fallback live in
    // campaignSlice.undoCampaignStressorBridge. Same best-effort + guarded
    // posture as the forward consumer.
    const withdrawDirective = crisisWithdraw(undoneEntry);
    if (withdrawDirective) {
      try {
        const saveId = afterState.activeSaveId;
        const campaign = saveId
          ? (afterState.campaigns || []).find(c => (c.settlementIds || []).map(String).includes(String(saveId)))
          : null;
        const undoBridge = afterState.undoCampaignStressorBridge;
        if (campaign && typeof undoBridge === 'function') {
          undoBridge(campaign.id, {
            ...withdrawDirective,
            settlementId: String(saveId),
          });
        }
      } catch { /* world reconciliation is best-effort */ }
    }
  },

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
    state.activeSaveId   = save.id || null;
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
    // The refined narrative lives at save.aiData.aiSettlement, not a flat
    // save.aiSettlement. Reading the wrong path nulled the narrative on every
    // reload (it ran right after hydrateAiFromSave had loaded it correctly),
    // while daily life — untouched here — survived. Read aiData first.
    state.aiSettlement   = save.aiData?.aiSettlement || save.aiSettlement || null;

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
});
