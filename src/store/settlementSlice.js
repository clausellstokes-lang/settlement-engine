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
    import('../kernel/prng.js'),
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
import { activateLatentPantheon } from '../domain/worldPulse/latentPantheon.js';
import {
  buildEdit as _pe_buildEdit,
  appendEdit as _pe_appendEdit,
  revertEdit as _pe_revertEdit,
  activeEdits as _pe_activeEdits,
} from '../domain/pendingEdits.js';
import { previewEvent as domainPreviewEvent } from '../domain/events/previewEvent.js';
import { applyEvent   as domainApplyEvent   } from '../domain/events/applyEvent.js';
import { scrubUndoneEvent } from '../domain/events/undoEvent.js';
import { receiptFromEventLogEntry } from '../domain/events/mutate.js';
import { makeReceipt } from '../domain/trace.js';
import { layerAuthoredDeltas } from '../domain/events/eventPipeline.js';
import { mapEventToPartyImpact } from '../domain/events/partyEventLinkage.js';
// Lane 2 (domain-events-region-1): LIGHT (eager-safe, zero heavy imports) helpers
// for the NON-party canon relationship ripple — the undo-snapshot capture (in
// applyEvent) + the mapping gate (in rippleEventThroughWorld). The heavy applier
// rides the lazy world-engine chunk (recordCanonRelationshipRipple).
import { captureCanonRelationshipUndo, canonRelationshipTargetFor } from '../domain/events/canonRelationshipLinkage.js';
import { eligibleCustomContent } from '../domain/customContentSchema.js';
import {
  CRISIS_EVENT_TYPES,
  crisisTwinFor,
  crisisWithdraw,
  twinDirectiveForEvent,
} from '../domain/crisisLifecycle.js';
import { propagateRegionalEvent } from '../domain/region/index.js';
import { reconcileSettlementChange } from '../domain/settlementReconciliation.js';
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
// WS4 decomposition — pure/leaf helpers extracted to a sibling.
import {
  cloneJson, persistSaveUpdate, cappedVersionHistory, saveEnvelopeFor,
  visibleSettlementIdsForCampaign, _resolveEntity, pickleCampaignState,
  stripImpairmentsForEvent, computePendingSuccession, snapshotSettlement,
} from './settlementSliceHelpers.js';
// Track K §C1 — the ActionResult envelope. The five canon-path actions below
// (applyEvent / undoLastEvent / recordSnapshot / revertToSnapshot /
// destroySavedSettlement) return this SUPERSET shape. See src/store/actionResult.js
// for the per-action before/after mapping and the C2/C3 loose-field TODOs.
import { makeActionResult } from './actionResult.js';
// Wave 4a store composition — the god-slice + identity-edit action bodies adopted
// from the reference tree's helper split (§2B). setPrimaryDeity/imposeCult are the
// STORE half of the embed-on-assign bridge that flips the religion subsystem gate
// (subsystemActivation.js reads config.primaryDeitySnapshot / cultDeitySnapshots);
// the rename/canon-by-id/flavor/neighbour actions are the identity-edit surface the
// Settlements-list + change-queue affordances consume. See each helper's header.
import { setPrimaryDeityImpl, imposeCultImpl } from './settlementDeityHelpers.js';
import {
  renameSettlementImpl, syncActiveNeighbourFieldsImpl,
  recordCanonFlavorEntryImpl, canonizeSavedSettlementImpl,
} from './settlementRenameHelpers.js';

/**
 * Coarse SystemState summary for an ActionResult before/after slice — the four
 * dimension values (or null), never a clone. Tolerant of a null/partial state.
 * @param {*} ss
 * @returns {{resilience:number|null, volatility:number|null, externalThreat:number|null, resourcePressure:number|null}|null}
 */
function _dimsSummary(ss) {
  if (!ss || typeof ss !== 'object') return null;
  const pick = (d) => (d && typeof d.value === 'number' ? d.value : null);
  return {
    resilience:       pick(ss.resilience),
    volatility:       pick(ss.volatility),
    externalThreat:   pick(ss.externalThreat),
    resourcePressure: pick(ss.resourcePressure),
  };
}

// ── Event-keyed narrative snapshots (Wave E1 · canon-history preservation) ──
// As canon events accrue, the AI narrative that described each canon STATE is
// silently overwritten — the prose history of the settlement is lost. This
// stamps the narrative that was valid BEFORE an event, keyed by that event's id,
// into a bounded archive so the lineage survives. Home: the save's `aiData`
// archive (the least-invasive DURABLE home — already persisted, semantically the
// AI layer, and NOT the golden settlement object). Never balloons: the narrative
// is cloned ONCE per event and the archive is FIFO-capped.
export const MAX_EVENT_NARRATIVE_SNAPSHOTS = 10;

/**
 * Return the next aiData with an event-keyed narrative snapshot appended (FIFO,
 * capped, deduped by eventId). Pure — clones the narrative once; leaves aiData
 * untouched when there is nothing to snapshot.
 * @param {Object|null} aiData          the save's existing aiData blob
 * @param {Object} [entry]
 * @param {string} [entry.eventId]      the keying event id (no-op if absent)
 * @param {Object} [entry.aiSettlement] the narrative valid at this event (no-op if absent)
 * @param {string} [entry.ts]
 */
export function appendEventNarrativeSnapshot(aiData, { eventId, aiSettlement, ts } = {}) {
  if (!eventId || !aiSettlement) return aiData;
  const prev = (aiData && typeof aiData === 'object') ? aiData : {};
  const existing = Array.isArray(prev.eventNarrativeSnapshots) ? prev.eventNarrativeSnapshots : [];
  // Dedupe: a re-applied event id replaces its prior snapshot rather than doubling.
  const kept = existing.filter(s => s?.eventId !== eventId);
  kept.push({ eventId, ts: ts || new Date().toISOString(), aiSettlement: cloneJson(aiSettlement) });
  return { ...prev, eventNarrativeSnapshots: kept.slice(-MAX_EVENT_NARRATIVE_SNAPSHOTS) };
}

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

  // Lane 2 (domain-events-region-1): a NON-party DM canon relationship event
  // (BROKERED_ALLIANCE / SETTLEMENT_DISPUTE / OPENED_TRADE_ROUTE, or an
  // APPLY_STRESSOR carrying an instigator) ALSO ripples to the campaign's pulse
  // relationship edge — the worldState.relationshipStates the war layer reads +
  // the regionalGraph edge label — mirroring the settlement-level neighbourNetwork
  // mutation into the world engine. The light mapping gate avoids the lazy engine
  // load for every non-relationship event; the undo snapshot was captured in
  // applyEvent (logEntry.undo.relationshipRipple) and is reversed synchronously by
  // reverseCanonRelationshipRipple, so this async ripple is never awaited for undo.
  if (campaign && !event?.partyCaused) {
    try {
      const relRipple = afterState.recordCanonRelationshipRipple;
      if (typeof relRipple === 'function' && canonRelationshipTargetFor(event, activeSaveId)) {
        Promise.resolve(relRipple(campaign.id, { event, homeId: activeSaveId }))
          .catch(() => { /* world ripple is best-effort */ });
      }
    } catch { /* linkage is best-effort */ }
  }
}

/**
 * W-F6 THE PREMIUM GATE — the store-side half of the latent-pantheon activation
 * seam (owner 2026-07-10; PHASE4_FAITH_DELTA). The generation pipeline bakes a
 * starting pantheon LATENTLY into every seed (config.latentPantheon), identical
 * for all tiers — tier never touches generation. This is where the key turns:
 * a PREMIUM (or elevated) account activates on generation-complete / save-open,
 * copying the latent patron + cults into the LIVE embeds via the pure, rng-free,
 * idempotent activateLatentPantheon. FREE / ANON never activate — the latent
 * record stays private (stripped from every public projection, publicSafe.js /
 * migration 128) and the engine stays the certified inert ground state (the
 * neutrality theorem). Defensive: any auth-read failure ⇒ no activation.
 * @template T
 * @param {T} settlement
 * @param {() => any} get  the store getter (auth tier + role live here)
 * @returns {T}
 */
function activateFaithIfEntitled(settlement, get) {
  try {
    const s = typeof get === 'function' ? get() : null;
    const entitled = s?.auth?.tier === 'premium'
      || (typeof s?.isElevated === 'function' && s.isElevated());
    return entitled ? activateLatentPantheon(settlement) : settlement;
  } catch {
    return settlement;
  }
}

/**
 * resetSettlementIdentity — THE single chokepoint for clearing a settlement's
 * session-only identity residue on ANY active-settlement swap: generateSettlement,
 * hydrateFromSave (open a save), setSettlement, clearSettlement. Every field reset
 * here is session-scoped (never persisted) and must NOT survive an identity change,
 * or the new settlement inherits the previous one's in-flight state — the exact
 * cross-identity leak class the slice documents (F17/F19):
 *   • a queued rename commits against the wrong town (pending edits address NPCs by
 *     INDEX, so save B's index-N is a different NPC than A's);
 *   • a stale successor prompt fires on the wrong lineage;
 *   • B renders A's draft version timeline;
 *   • the pipeline rail renders A's "how this was simulated" receipts against B's
 *     dossier (components-dossier-5);
 *   • a stale regen-delta card describes the prior settlement.
 * Structural prevention (state-lifecycle-3 / store-5): the ONE writer for this
 * class, so a NEW load path cannot re-open the leak by hand-maintaining its own
 * partial reset list — every entry point routes through here.
 *
 * NOTE: the LIFECYCLE slots that DIFFER by path (settlement / activeSaveId / phase /
 * eventLog / locks / canonizedAt / systemState / generatedAt / editedAt /
 * lastExportAt / aiSettlement) are deliberately NOT reset here — each caller sets
 * them itself: hydrateFromSave from the save's persisted campaignState; generate /
 * set / clear to their own DRAFT defaults.
 *
 * @param {*} state the Immer store draft
 */
function resetSettlementIdentity(state) {
  state.pendingEditsQueue     = [];
  state.pendingEditsClock     = 0;
  state.pendingSuccession     = null;
  state.draftVersionHistory   = [];
  // The generation-id spine is per-generation identity: a loaded/new settlement
  // must never inherit the prior generation's id (a save re-derives its own from
  // seed + generatedAt; a fresh generate mints one after the pipeline).
  state.generationId          = null;
  // The pipeline rail + reveal overlay are per-run receipts (components-dossier-5).
  state.pipelineHistory       = [];
  state.pipelineRevealActive  = false;
  // A stale regenerate-delta card must not describe an unrelated settlement.
  state.lastRegenerationDelta = null;
  // Any pending single/batch event preview belongs to the prior identity.
  state.pendingPreview        = null;
}

export const createSettlementSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  settlement:    null,   // current generated settlement object
  savedSettlements: [],  // persisted to Supabase (or localStorage for anon)
  savedSettlementsLoaded: false, // true once hydrated from savesService
  activeSaveId:  null,   // save id backing the currently-open detail view
  lastSeed:      null,   // seed from last generation (for replay/determinism)
  // Wave E1 — the generation-id SPINE. A pseudonymous, per-generation telemetry
  // identity threaded to lifecycle milestone events (generate/save/canonize/
  // export/narrate). NOT sim state and NEVER written onto the golden settlement:
  // it lives here and is derived from seed+generatedAt so it recomputes across a
  // reload. Reset on hydrate so a loaded save can't inherit a prior id.
  generationId:  null,
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

  // P104 / X-4 — Lifetime narrate count, read by hooks/useReaderAudience.js to
  // promote anonymous → intermediate after the first narrate spend.
  //
  // TODO(F34 · cross-slice wiring): bumpLifetimeNarrate has no caller yet, so the
  // count never increments and the audience-promotion signal never fires. The
  // real narrate-success point lives in aiSlice.requestNarrative — right after the
  // `set(state => { state.aiSettlement = result; ... })` commit and the
  // `track(EVENTS.AI_GENERATION_COMPLETED, { type: 'narrative', ... })` call
  // (src/store/aiSlice.js, the requestNarrative success branch). Add
  // `get().bumpLifetimeNarrate();` there. That file is outside this change's fence,
  // so the incrementer is left in place (not deleted) to be wired from aiSlice.
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
          case 'rename-settlement': {
            // §10.4: the inline mutation touched only the live store, so a
            // queued town rename GHOSTED on reload — and renameSettlement (the
            // persisting helper) has no direct caller, so this queue path is the
            // only town-rename surface. Mirror the rename-npc dispatch above:
            // mutate live, then persist through the shared edit-persist (no-ops
            // on an unsaved draft, which correctly needs no cloud write). Without
            // this, committing a queued town rename ghosts while a queued NPC
            // rename (same commit) survives.
            let renamed = false;
            set(s => { if (s.settlement) { s.settlement.name = edit.payload?.newName; renamed = true; } });
            if (renamed) get().persistActiveSaveEdit?.();
            break;
          }
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
  // Draft (unsaved) version-history timeline. A SIBLING to the live
  // settlement — mirroring how a saved settlement keeps its versionHistory
  // BESIDE the settlement on its savedSettlements entry, never inside it.
  // Draft history used to live INSIDE settlement.versionHistory, so every
  // snapshot (a full clone of the settlement) embedded all prior snapshots:
  // size ≈ base × 2^N. Keeping the timeline as a sibling — and stripping
  // versionHistory from every snapshot payload (snapshotSettlement) — makes
  // growth linear and revert non-destructive (the timeline is no longer
  // clobbered when the settlement content is restored). Session-only:
  // excluded from the persist partialize allowlist (like pendingEditsQueue)
  // and reset on hydrateFromSave.
  draftVersionHistory: [],
  //
  // `recordSnapshot({ saveId?, kind, label, ts? })` appends a frozen
  // snapshot of the live settlement (or a specified save) into the
  // appropriate timeline sibling. Snapshots are immutable — the timeline
  // never mutates an existing entry, and its payload never carries a nested
  // versionHistory.
  //
  // `revertToSnapshot({ saveId, snapshotId })` finds the snapshot in the
  // timeline and overwrites the live settlement (or the save's settlement
  // payload) with the snapshot's content. The CURRENT state is auto-
  // snapshotted FIRST so reverting is never destructive — the critique was
  // explicit about that.
  //
  // Saved-settlement timelines persist immediately through the normal
  // save service (`version_history` in Supabase, `versionHistory` locally).
  // Unsaved draft timelines live in `draftVersionHistory` until the
  // settlement itself is saved.

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
      // Snapshot CONTENT only — snapshotSettlement strips the settlement's own
      // versionHistory so a snapshot never embeds the timeline (no 2^N nesting).
      settlement: snapshotSettlement(sourceSettlement),
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
      // No saveId — append to the SIBLING draft timeline (never into the
      // settlement itself), so unsaved sessions build a local timeline
      // without the settlement content ever nesting its own history.
      set(s => {
        s.draftVersionHistory = cappedVersionHistory([...(Array.isArray(s.draftVersionHistory) ? s.draftVersionHistory : []), snapshot]);
      });
    }
    const persisted = Boolean(targetSaveId && persistedHistory);
    if (persisted) persistSaveUpdate(targetSaveId, { versionHistory: persistedHistory });
    // Track K §C2 — ActionResult envelope. The immutable snapshot maps to an
    // 'edit'-source Receipt (kind 'history': a checkpoint in the settlement's
    // timeline); the snapshot id is also surfaced on `after.snapshotId` for
    // callers that only need to reference it.
    const timeline = targetSaveId ? 'saved' : 'draft';
    return makeActionResult('recordSnapshot', {
      before: { targetSaveId: targetSaveId ?? null, timeline },
      after:  { snapshotId: snapshot.id, kind: snapshot.kind, label: snapshot.label, timeline },
      receipts: [makeReceipt({
        source: 'edit',
        kind: 'history',
        targetId: snapshot.id,
        causes: [{ source: 'edit', effect: snapshot.kind, reason: snapshot.label }],
      })],
      persistenceOps: persisted
        ? [{ saveId: String(targetSaveId), kind: 'save-update', fields: ['versionHistory'] }]
        : [],
    });
  },

  /** Revert the live settlement (or a save) to a prior snapshot. Auto-
   *  snapshots the CURRENT state first so the user can re-revert if
   *  they meant the other thing. */
  revertToSnapshot: ({ saveId, snapshotId }) => {
    if (!snapshotId) return false;
    const state = get();
    const targetSaveId = saveId || state.activeSaveId || null;
    // Read the snapshot from the appropriate version-history slot: the saved
    // entry's sibling for a save, or the draft sibling for an unsaved session.
    const history = targetSaveId
      ? state.savedSettlements.find(e => String(e.id) === String(targetSaveId))?.versionHistory
      : state.draftVersionHistory;
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
    const activeTarget = Boolean(targetSaveId && String(targetSaveId) === String(state.activeSaveId));
    let persistedSettlement = null;
    let persistedHistory = null;
    set(s => {
      if (targetSaveId) {
        const idx = s.savedSettlements.findIndex(e => String(e.id) === String(targetSaveId));
        if (idx === -1) return;
        s.savedSettlements[idx].settlement = cloneJson(target.settlement);
        persistedSettlement = cloneJson(s.savedSettlements[idx].settlement);
        persistedHistory = cloneJson(s.savedSettlements[idx].versionHistory || []);
      }
      // Always refresh the live settlement view so the user sees the revert
      // immediately. Restore CONTENT only (snapshotSettlement strips any
      // versionHistory the payload may carry): the timeline lives in the
      // sibling (draftVersionHistory here, the saved entry above), so this
      // restore no longer clobbers it — the freshly-recorded pre-revert
      // snapshot survives and re-revert works. This is the F16 non-destructive
      // fix: the draft revert used to overwrite the whole object (timeline and
      // all) with the target's stale embedded history.
      s.settlement = snapshotSettlement(target.settlement);
      // state-lifecycle-2: re-derive systemState from the RESTORED settlement and
      // stamp editedAt. Without this the live state rail / timeline deltas / event
      // previews (which take state.systemState as input) reflected the reverted-AWAY
      // settlement, and the persisted campaign_state.systemState stayed stale too —
      // a ghost that survived reload (hydrateFromSave prefers cs.systemState). Every
      // sibling mutator (applyEvent / undoLastEvent / destroySavedSettlement) already
      // re-derives + persists campaignState; revert was the one path that didn't.
      try { s.systemState = deriveSystemState(s.settlement); }
      catch (e) {
        console.warn('[settlementSlice] revert deriveSystemState failed:', e);
        s.systemState = null;
      }
      s.editedAt = new Date().toISOString();
    });
    const persisted = Boolean(targetSaveId && persistedSettlement);
    if (persisted) {
      // For the ACTIVE save, fold the re-derived systemState (and the rest of the
      // live lifecycle) into the persisted campaignState so the stored row + a reload
      // agree with the reverted settlement. A non-active-save revert (unreachable via
      // current UI) keeps the prior behavior — settlement + versionHistory only.
      let afterCampaignState = null;
      if (activeTarget) {
        afterCampaignState = pickleCampaignState(get());
        if (typeof get().updateSavedSettlement === 'function') {
          get().updateSavedSettlement(targetSaveId, { campaignState: afterCampaignState });
        }
      }
      persistSaveUpdate(targetSaveId, {
        settlement: persistedSettlement,
        versionHistory: cappedVersionHistory(persistedHistory),
        ...(afterCampaignState ? { campaignState: afterCampaignState } : {}),
      });
    }
    // Track K §C1 — ActionResult envelope on the SUCCESS path. The failure
    // fast-paths above deliberately keep returning bare `false`: VersionsTab
    // (`const ok = revertToSnapshot(...); if (!ok)`) and its component test read
    // the raw return as a boolean, and an envelope object is always truthy — so
    // failure must stay falsy until that call site migrates to `.ok` (a
    // component change outside this store-only fence). Success returning a
    // truthy envelope keeps `if (!ok)` correct.
    const timeline = targetSaveId ? 'saved' : 'draft';
    return makeActionResult('revertToSnapshot', {
      before: { targetSaveId: targetSaveId ?? null, snapshotId, timeline },
      after:  { restoredSnapshotId: snapshotId, restoredLabel: target.label ?? null, timeline },
      persistenceOps: persisted
        ? [{ saveId: String(targetSaveId), kind: 'save-update', fields: activeTarget ? ['settlement', 'versionHistory', 'campaignState'] : ['settlement', 'versionHistory'] }]
        : [],
    });
  },

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
      // Capture the full pipeline context (lastCtx) so the pipeline-rail
      // diagnostics and section-regen config recovery can read the exact
      // resolved context this run produced, instead of re-deriving it.
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
      // W-F6 THE PREMIUM GATE — turn the key at generation-complete. A premium
      // account activates the seed's latent starting pantheon into live embeds
      // (day-one faith life); free/anon leave it latent + private. Idempotent,
      // rng-free, tier-gated — the golden (generator output) is untouched because
      // this fires in the STORE, after the pipeline.
    const withFaith = activateFaithIfEntitled(reconciled, get);
      // Derive the SystemState immediately so the UI never sees a settlement
      // without its accompanying state snapshot. The domain function is
      // pure — no store, no React — and tolerant of partial inputs, so a
      // sparse settlement still produces a usable state.
    let systemState = null;
    try {
      systemState = deriveSystemState(withFaith);
    } catch (e) {
      console.warn('[settlementSlice] deriveSystemState failed:', e);
    }
    const now = new Date().toISOString();
    set(state => {
        // state-lifecycle-3: a fresh generation is a new identity — clear ALL
        // session-only residue through the single chokepoint FIRST (pendingEditsQueue,
        // pendingSuccession, draftVersionHistory, generationId, …), then set this
        // run's own lifecycle fields below. Without this, the prior settlement's
        // queued edits / successor prompt / draft timeline survived onto the new town.
        resetSettlementIdentity(state);
        state.settlement = withFaith;
        state.activeSaveId = null;
        state.lastSeed = seed;
        state.lastCtx = capturedCtx;
        state.systemState = systemState;
        // A freshly generated settlement carries NO AI overlay — clear the FULL
        // AI-identity slate, not just aiSettlement, so a prior settlement's
        // daily-life / verifier report / refund notice / stale-detection
        // fingerprints can't leak onto the new one (F17/F19 identity hygiene).
        state.aiSettlement = null;
        state.aiDailyLife = null;
        state.aiViolations = null;
        state.aiRefundNotice = null;
        state.aiDataVersion = null;
        state.aiSourceFingerprint = null;
        state.aiPartialFailure = null;
        state.showNarrative = false;
        // pendingPreview cleared by resetSettlementIdentity above.
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

    // Wave E1 — the generation-id spine. Mint the pseudonymous id (stable across
    // reload via seed+stamp), stash it in the store field (NOT on the settlement),
    // and fire the 'generate' milestone. Lazy + fire-and-forget so it never touches
    // cold start or the return value.
    import('../lib/generationTelemetry.js').then(({ recordGenerationMilestone, deriveGenerationId }) => {
      const genId = deriveGenerationId(seed, now);
      set(s => { s.generationId = genId; });
      recordGenerationMilestone('generate', reconciled, { generationId: genId });
    }).catch(() => {});

    // Return the activated settlement so a caller that saves the return value
    // persists the SAME faith-active shape the store holds (state.settlement =
    // withFaith). Generation telemetry above intentionally reads `reconciled`
    // (generator truth — activation is a post-pipeline store overlay).
    return withFaith;
  },

  setSettlement: (settlement) =>
    set(state => {
      state.settlement = settlement;
      state.activeSaveId = null;
      // store-5 identity hygiene: setSettlement is a NON-save load path (the
      // "Apply Saved Configuration & Regenerate" flow + a couple of reload paths).
      // Route the session residue through the single chokepoint, and reset the
      // lifecycle slots to a fresh DRAFT so the new settlement can't inherit the
      // previous view's canon phase / event log / locks / stamps — after viewing a
      // canon town, loading another here used to leave phase 'canon' (renames no-op,
      // a stale eventLog/successor ride an unrelated town).
      resetSettlementIdentity(state);
      state.phase        = 'draft';
      state.eventLog     = [];
      state.locks        = {};
      state.canonizedAt  = null;
      state.lastExportAt = null;
      // Re-derive systemState from the NEW settlement so the state rail / previews
      // never reflect the prior identity; tolerate a partial/absent settlement.
      if (settlement) {
        try { state.systemState = deriveSystemState(settlement); }
        catch (e) { state.systemState = null; }
      } else {
        state.systemState = null;
      }
    }),

  clearSettlement: () =>
    set(state => {
      state.settlement = null;
      state.activeSaveId = null;
      state.lastSeed = null;
      state.lastCtx = null;
      // Same identity chokepoint + lifecycle reset as setSettlement (store-5): clear
      // the view entirely, leaving no residue of the prior settlement's identity.
      resetSettlementIdentity(state);
      state.phase        = 'draft';
      state.eventLog     = [];
      state.locks        = {};
      state.canonizedAt  = null;
      state.lastExportAt = null;
      state.systemState  = null;
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
    // state-lifecycle-4: CANON identity lock — canon freezes the roster's identity
    // (renameNPC/renameFaction already guard on this). A reroll of the whole NPC set
    // or history on a canon settlement would silently invalidate campaign canon with
    // no event-log entry, so block it here (matching the rename locks); canon changes
    // must route through the event system. Draft rerolls proceed.
    if (get().phase === 'canon') return;

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
    const before = cloneJson(settlement);

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

    // state-lifecycle-4: when a SAVE is hydrated into the live editor (activeSaveId
    // set — SettlementDetail hydrates on open, then the Create page offers reroll),
    // a section reroll mutated only memory and GHOSTED on reload. Persist it via the
    // applyEvent pattern: stamp editedAt, update the in-memory save entry, and durably
    // write the settlement + a re-derived campaignState. (Draft-only: the canon guard
    // above already returned, so this never persists a canon reroll.)
    const activeSaveId = get().activeSaveId;
    if (activeSaveId) {
      const now = new Date().toISOString();
      set(s => { s.editedAt = now; });
      const afterState = get();
      const savePartial = {
        settlement: cloneJson(afterState.settlement),
        campaignState: pickleCampaignState(afterState),
        timestamp: now,
      };
      if (typeof afterState.updateSavedSettlement === 'function') {
        afterState.updateSavedSettlement(activeSaveId, savePartial);
      }
      persistSaveUpdate(activeSaveId, {
        settlement: savePartial.settlement,
        campaignState: savePartial.campaignState,
      });
    }
  },

  // Tier 5.1: dismiss the most recent delta summary card.
  clearLastRegenerationDelta: () =>
    set(state => { state.lastRegenerationDelta = null; }),

  // ── Saved settlements ──────────────────────────────────────────────────────

  // NOTE (F34): the old `saveSettlement` store action lived here but was DEAD —
  // every real save path (SaveToLibraryButton + the SAVE_SETTLEMENT auth intent)
  // calls savesService.save() directly, so this action never ran and its
  // first_save/third_save pricing moments + 'saved' research capture never fired.
  // Those side effects were revived as a testable helper (src/store/saveMoments.js,
  // recordSaveMomentForActiveSave) and are now invoked from the real save
  // chokepoints. The dead action was removed rather than kept as a decoy.

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
    // Annotated so tsc keeps the shape across the immer `set` closure assignment
    // below (otherwise it infers `null` and the C1 envelope's persist.campaignState
    // read narrows to `never`).
    /** @type {{settlement: any, campaignState: any, timestamp: string}|null} */
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
    // Track K §C2 — ActionResult envelope. `receipts` carries an 'event'
    // Receipt derived from the DESTROY_SETTLEMENT eventLog entry this action
    // appended to the save's log. No current consumer reads the return, so both
    // branches are full envelopes (ok:false when the save wasn't found).
    if (!persist) {
      return makeActionResult('destroySavedSettlement', {
        ok: false,
        before: { id: String(id), reason },
      });
    }
    const destroyLog = persist.campaignState?.eventLog || [];
    const destroyReceipt = destroyLog.length
      ? receiptFromEventLogEntry(destroyLog[destroyLog.length - 1], destroyLog.length - 1)
      : null;
    return makeActionResult('destroySavedSettlement', {
      before: { id: String(id), reason },
      after:  { id: String(id), status: 'destroyed', destroyedReason: reason },
      receipts: destroyReceipt ? [destroyReceipt] : [],
      persistenceOps: [{ saveId: String(id), kind: 'save-update', fields: ['settlement', 'campaignState', 'timestamp'] }],
    });
  },

  // ── NPC / Faction renaming ─────────────────────────────────────────────────
  renameNPC: (npcIndex, newName) => {
    let changed = false;
    set(state => {
      // Campaign-clock identity lock: NPC names freeze at canonization. Renames
      // are a draft-only affordance (the UI hides them post-canon; guard here too).
      if (state.phase === 'canon') return;
      if (!state.settlement?.npcs?.[npcIndex]) return;
      state.settlement.npcs[npcIndex].name = newName;
      changed = true;
    });
    // Persist so the rename survives reload instead of ghosting until some later
    // action happens to write the blob (§10.4). No-op without a hydrated save.
    if (changed) get().persistActiveSaveEdit?.();
  },

  renameFaction: (factionIndex, newName) => {
    let changed = false;
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
      changed = true;
    });
    if (changed) get().persistActiveSaveEdit?.();
  },

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

  applyUserEditAction: (kind, entityIndex, path, value) => {
    let changed = false;
    set(state => {
      if (!state.settlement) return;
      if (!isEditablePath(kind, path)) return;  // strict registry gate
      const entity = _resolveEntity(state.settlement, kind, entityIndex);
      if (!entity) return;
      domainApplyUserEdit(entity, path, value);
      changed = true;
    });
    // Persist the authored value so it survives reload (§10.4). No-op without a
    // hydrated save (the edit lives in memory only, which is correct).
    if (changed) get().persistActiveSaveEdit?.();
  },

  revertUserEditAction: (kind, entityIndex, path) => {
    let changed = false;
    set(state => {
      if (!state.settlement) return;
      const entity = _resolveEntity(state.settlement, kind, entityIndex);
      if (!entity) return;
      // Only a real revert is a blob mutation worth persisting — a revert of an
      // unedited path is a no-op, so don't bump editedAt / write for it.
      const wasEdited = !!(entity._userEdits && path in entity._userEdits);
      domainRevertUserEdit(entity, path);
      changed = wasEdited;
    });
    if (changed) get().persistActiveSaveEdit?.();
  },

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
    // Wave E1 — 'canonize' milestone on the generation-id spine. generationId is
    // held in-store (reset on hydrate), so re-derive from the save's seed+stamp
    // when a reloaded save has no live id.
    if (after.settlement) {
      import('../lib/generationTelemetry.js').then(({ recordGenerationMilestone }) => {
        recordGenerationMilestone('canonize', after.settlement, {
          generationId: after.generationId, seed: after.lastSeed, stampIso: after.generatedAt,
        });
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

  /**
   * Persist an in-place CONTENT edit (an authored prose value, or an NPC /
   * faction rename) on the active save. This is the persist half every
   * settlement-blob edit needs and that the four edit actions historically
   * LACKED: without it the edit mutated only the live store and GHOSTED on
   * reload until some LATER persisting action (applyEvent / regenerateSection /
   * canonize / revert) happened to write the blob — the owner's most-bitten
   * "survives one path, ghosts another" class (docs/DESIGN_SETTLEMENT_MAP.md
   * §10.4). Mirrors applyEvent's / the section-reroll persist exactly: stamp
   * editedAt on the live slice (rail + provenance parity), sync the in-memory
   * save entry, and durably write the settlement + a re-derived campaignState.
   *
   * No-ops when no save is hydrated (an unsaved draft has nowhere to persist —
   * the edit lives in memory only, which is correct), and defers to an
   * in-progress change-queue flush (flushSuppressPersist), which owns the single
   * atomic commit — the same invariant renameSettlement honours. Content edits
   * are not in-world events, so this never touches the eventLog: campaignState
   * is re-pickled from the (unchanged) live phase/eventLog/systemState, only
   * bumping editedAt.
   */
  persistActiveSaveEdit: () => {
    const s = get();
    const activeSaveId = s.activeSaveId;
    if (!activeSaveId || !s.settlement) return;
    // A change-queue flush replays these edits and owns the single atomic
    // commit, so defer this row's write while suppressed (renameSettlement R2).
    if (s.flushSuppressPersist) return;
    const now = new Date().toISOString();
    set(st => { st.editedAt = now; });
    const afterState = get();
    const savePartial = {
      settlement: cloneJson(afterState.settlement),
      campaignState: pickleCampaignState(afterState),
      timestamp: now,
    };
    if (typeof afterState.updateSavedSettlement === 'function') {
      afterState.updateSavedSettlement(activeSaveId, savePartial);
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
    // Wave E1 — 'export' milestone on the generation-id spine (fire-and-forget).
    const exp = get();
    if (exp.settlement) {
      import('../lib/generationTelemetry.js').then(({ recordGenerationMilestone }) => {
        recordGenerationMilestone('export', exp.settlement, {
          generationId: exp.generationId, seed: exp.lastSeed, stampIso: exp.generatedAt,
        });
      }).catch(() => {});
    }
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
      // The store is the I/O boundary: thread the real apply time so the domain
      // stays a pure function of (settlement, event, now) (A+ domain.6).
      now: new Date().toISOString(),
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
    // Undo seam for the Lane-2 relationship ripple (domain-events-region-1):
    // snapshot the campaign's pre-ripple pulse relationshipState + edge label
    // BEFORE rippleEventThroughWorld upserts them, so undoLastEvent can restore
    // them (same campaignTwin pattern above). captureCanonRelationshipUndo is a
    // pure LIGHT read that returns null for every non-relationship (or
    // party-caused) event, so the common event stashes nothing.
    if (campaign && !event?.partyCaused) {
      const relRippleUndo = captureCanonRelationshipUndo(campaign, event, activeSaveId);
      if (relRippleUndo) {
        logEntry = {
          ...logEntry,
          undo: { ...(logEntry.undo || {}), relationshipRipple: relRippleUndo },
        };
      }
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
      // Wave E1 — event-keyed narrative snapshot. When the active save carries an
      // AI narrative, preserve the prose that described the PRE-event canon state,
      // keyed by this event's id, so the narrative lineage isn't lost as events
      // accrue. Clones once, FIFO-capped; stored in the durable aiData archive.
      const eventId = event?.id || logEntry?.event?.id;
      const priorNarrative = beforeSave?.aiData?.aiSettlement;
      const nextAiData = (priorNarrative && eventId)
        ? appendEventNarrativeSnapshot(beforeSave.aiData, {
            eventId: String(eventId), aiSettlement: priorNarrative, ts: afterState.editedAt,
          })
        : null;
      const savePartial = {
        settlement: cloneJson(afterState.settlement),
        campaignState: afterCampaignState,
        timestamp: afterState.editedAt,
        ...(nextAiData ? { aiData: nextAiData } : {}),
      };
      if (typeof afterState.updateSavedSettlement === 'function') {
        afterState.updateSavedSettlement(activeSaveId, savePartial);
      }
      persistSaveUpdate(activeSaveId, {
        settlement: savePartial.settlement,
        campaignState: savePartial.campaignState,
        ...(nextAiData ? { aiData: nextAiData } : {}),
      });
    }

    // Propagate the committed event into the campaign world engine — regional
    // graph, crisis-lifecycle twin, party-impact pipeline. See the helper for
    // the per-consumer rationale; all canon-only and best-effort + guarded.
    rippleEventThroughWorld({ afterState, campaign, event, beforeEnvelope, beforeSave, activeSaveId, afterCampaignState });

    // Wave E1 — revealed preference: WHICH in-world event type DMs actually apply
    // (the C1 envelope's before.eventType, enum only). Fire-and-forget.
    if (event?.type) {
      import('../lib/analytics.js').then(({ track, EVENTS }) => {
        track(EVENTS.EVENT_EDIT_APPLIED, { event_type: event.type });
      }).catch(() => {});
    }

    // Track K §C2 — ActionResult envelope. `receipts` carries an 'event'
    // Receipt derived from the eventLog entry this apply produced (the event is
    // the cause, the SystemState deltas the effects); consumers that need it
    // read result.receipts[0]. The direct-apply path fires no single analytics
    // event of its own — regional propagation fires its own inside the ripple
    // helper, conditionally — so analyticsEvent is null. The clock-bound
    // (`return queued`) and no-settlement (`return null`) early returns above
    // are deliberately NOT enveloped: they delegate to queueSettlementEvent /
    // bail, and their callers already read those shapes.
    const persistedToSave = Boolean(activeSaveId && afterState.settlement);
    const eventReceipt = receiptFromEventLogEntry(logEntry);
    return makeActionResult('applyEvent', {
      before: {
        eventType: event?.type ?? null,
        targetId: event?.targetId ?? null,
        phase: state.phase,
        activeSaveId: activeSaveId ?? null,
        systemState: _dimsSummary(state.systemState),
      },
      after: {
        phase: afterState.phase,
        logged: afterState.phase === 'canon',
        appliedAt: logEntry.appliedAt ?? null,
        systemState: _dimsSummary(afterState.systemState),
      },
      receipts: eventReceipt ? [eventReceipt] : [],
      persistenceOps: persistedToSave
        ? [{ saveId: String(activeSaveId), kind: 'save-update', fields: ['settlement', 'campaignState'] }]
        : [],
    });
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
    if (get().phase !== 'canon' || get().eventLog.length === 0) {
      // Track K §C1 — nothing to undo: a conformant ok:false envelope. No
      // consumer reads undoLastEvent's return today (Timeline's onUndo ignores
      // it); the success path below is the real contract.
      return makeActionResult('undoLastEvent', { ok: false });
    }
    const eventLogLengthBefore = get().eventLog.length;
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
    // Lane 2 (domain-events-region-1) — reverse the NON-party relationship ripple
    // the undone event landed on the campaign world engine. The pre-ripple pulse
    // relationshipState + edge label were snapshotted into
    // logEntry.undo.relationshipRipple at apply time (the campaignTwin pattern);
    // reverseCanonRelationshipRipple restores them. Fire-and-forget + guarded
    // (the channel-bundle re-sync rides the lazy engine chunk kept out of first
    // paint); race-safe with the forward ripple via the forward's orphan guard.
    const relRippleUndo = undoneEntry?.undo?.relationshipRipple;
    if (relRippleUndo?.campaignId != null) {
      try {
        const reverse = afterState.reverseCanonRelationshipRipple;
        if (typeof reverse === 'function') {
          Promise.resolve(reverse(relRippleUndo.campaignId, relRippleUndo))
            .catch(() => { /* world reconciliation is best-effort */ });
        }
      } catch { /* world reconciliation is best-effort */ }
    }
    // Track K §C1 — ActionResult envelope. The undo REVERSES the popped event,
    // so `receipts` is empty this step (C2 may surface the reversed entry).
    const persistedToSave = Boolean(afterState.activeSaveId && afterState.settlement);
    return makeActionResult('undoLastEvent', {
      before: {
        poppedEventId: undoneEntry?.event?.id ?? null,
        poppedEventType: undoneEntry?.event?.type ?? null,
        eventLogLength: eventLogLengthBefore,
      },
      after: {
        phase: afterState.phase,
        eventLogLength: afterState.eventLog.length,
        systemState: _dimsSummary(afterState.systemState),
      },
      persistenceOps: persistedToSave
        ? [{ saveId: String(afterState.activeSaveId), kind: 'save-update', fields: ['settlement', 'campaignState'] }]
        : [],
    });
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
    // W-F6 THE PREMIUM GATE — turn the key on open. A premium (or upgraded)
    // account activates the seed's latent starting pantheon into live embeds:
    // "the gods were always there, latent in the seed". Idempotent (a save that
    // already carries live embeds is unchanged) + tier-gated (free/anon load the
    // save verbatim, faith latent + private).
    const loadedSettlement = save.settlement
      ? activateFaithIfEntitled(save.settlement, get)
      : null;
    state.settlement     = loadedSettlement || state.settlement;
    state.activeSaveId   = save.id || null;
    // Recover the seed from the save (row column first, then the blob's stamped
    // `_seed`), and NEVER fall back to the stale session seed (finding F2): the
    // seed is surfaced in ProvenanceBlock "for replay / sharing", so a wrong seed
    // is worse than none. null is honest — ProvenanceBlock shows "unknown".
    state.lastSeed       = save.seed ?? save.settlement?._seed ?? null;
    state.phase          = cs.phase || 'draft';
    state.eventLog       = Array.isArray(cs.eventLog) ? [...cs.eventLog] : [];
    state.locks          = cs.locks || {};
    state.generatedAt    = cs.generatedAt || null;
    state.editedAt       = cs.editedAt || null;
    state.canonizedAt    = cs.canonizedAt || null;
    state.lastExportAt   = cs.lastExportAt || null;
    // Identity-leak audit (same class as the phase/eventLog hydration fix above):
    // reset ALL session-only, non-persisted UI residue through the single chokepoint
    // so opening save B never inherits save A's in-flight state — a rename queued
    // against A committing against B (cross-identity mutation), a stale successor
    // prompt firing on the wrong town, B inheriting A's draft timeline, and (the
    // components-dossier-5 add) the pipeline rail showing A's receipts against B.
    // draftVersionHistory is a sibling to the DRAFT settlement only — a loaded save
    // uses its own entry.versionHistory. Milestones on a reloaded save re-derive a
    // stable generation id from the save's seed + generatedAt.
    resetSettlementIdentity(state);
    // The refined narrative lives at save.aiData.aiSettlement, not a flat
    // save.aiSettlement. Reading the wrong path nulled the narrative on every
    // reload (it ran right after hydrateAiFromSave had loaded it correctly),
    // while daily life — untouched here — survived. Read aiData first.
    state.aiSettlement   = save.aiData?.aiSettlement || save.aiSettlement || null;

    // SystemState: prefer the persisted snapshot; if absent or stale,
    // re-derive from the settlement so the rail/timeline never crashes.
    if (cs.systemState) {
      state.systemState = cs.systemState;
    } else if (loadedSettlement) {
      try { state.systemState = deriveSystemState(loadedSettlement); }
      catch (e) { state.systemState = null; }
    } else {
      state.systemState = null;
    }
  }),

  // ── Deity / cult mounts (Wave 4a) ─────────────────────────────────────────
  // The STORE half of the embed-on-assign bridge. Thin delegations: the impls
  // resolve the deity ref against customContent HERE (intent time) and dispatch
  // SET_PRIMARY_DEITY / IMPOSE_CULT through applyEvent with the frozen snapshot in
  // the payload, so the pure mutate handler + pulse read ONLY config.*DeitySnapshot
  // and the religion subsystem gate (subsystemActivation.js) flips off the embed.
  // The return value is applyEvent's ActionResult envelope (null when refused).
  setPrimaryDeity: (deityRefId) => setPrimaryDeityImpl(get, deityRefId),
  imposeCult: (deityRefId, removeRef = null) => imposeCultImpl(get, deityRefId, removeRef),

  // ── Identity edits + canon-by-id (Wave 4a) ────────────────────────────────
  // The always-allowed town rename, the Settlements-list canonize-by-id, and the
  // change-queue flavor/neighbour companions. Delegated to settlementRenameHelpers.
  renameSettlement: (id, newName) => renameSettlementImpl(get, set, id, newName),
  syncActiveNeighbourFields: (neighbourFields) => syncActiveNeighbourFieldsImpl(get, set, neighbourFields),
  recordCanonFlavorEntry: (entry) => recordCanonFlavorEntryImpl(get, set, entry),
  canonizeSavedSettlement: (id) => canonizeSavedSettlementImpl(get, set, id),

  /**
   * Instrumentation hook for the REAL (cloud/localStorage) save path — the
   * Save-to-Library buttons + the SAVE_SETTLEMENT auth intent call
   * savesService.save() directly and rehydrate via setSavedSettlements, bypassing
   * any store save action, so the pricing moments + 'saved' research fingerprint
   * never fire for real users without an explicit hook (F34). Call this AFTER a
   * successful save AND after savedSettlements is refreshed.
   *
   * Wave 4a composition (§2B): the moment/fingerprint block routes through OUR
   * extracted saveMoments.recordSaveMomentForActiveSave (session-deduped per save
   * id, authoritative post-save count, generation-id spine) rather than a second
   * inline funnel copy. Fully fire-and-forget — never throws, never blocks the save.
   *
   * HANDOFF (pricing sub-wave 4e): §2B also has notePersistedSave arm the
   * same-device dossier retro auto-upgrade (108). That is DEFERRED here because its
   * module (src/lib/dossierRetroClaim.js) has not landed in this tree — a static
   * `import('../lib/dossierRetroClaim.js')` fails BOTH tsc and `vite build` on a
   * missing target. 4e must add, right after the saveMoments call:
   *   if (saveId != null) import('../lib/dossierRetroClaim.js')
   *     .then(({ runDossierRetroClaimForSave }) => runDossierRetroClaimForSave({ settlement, saveId, get }))
   *     .catch(() => {});
   *
   * @param {object} settlement the settlement that was just persisted
   * @param {string|number} [saveId] the real save's id (from savesService.save)
   * @returns {void}
   */
  notePersistedSave: (settlement, saveId) => {
    try {
      import('./saveMoments.js')
        .then(({ recordSaveMomentForActiveSave }) =>
          recordSaveMomentForActiveSave({ saveId, settlement, store: { getState: get } }))
        .catch(() => { /* instrumentation must never block a save */ });
    } catch { /* instrumentation must never throw */ }
    // Arm the same-device dossier retro auto-upgrade (108): if THIS settlement was
    // bought anonymously on this device before sign-up, silently attach its durable
    // export right now that it has a real save id. Fully fire-and-forget — dynamic
    // import so a missing target never breaks tsc/build, and never blocks the save.
    try {
      if (saveId != null) import('../lib/dossierRetroClaim.js')
        .then(({ runDossierRetroClaimForSave }) => runDossierRetroClaimForSave({ settlement, saveId, get }))
        .catch(() => {});
    } catch { /* retro claim must never throw */ }
  },
});
