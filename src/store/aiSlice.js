/**
 * aiSlice — AI narrative layer and daily-life generation state.
 *
 * The narrative layer REFINES the settlement's prose in place rather than
 * adding a separate commentary layer. The server returns an `aiSettlement`
 * that mirrors the shape of `settlement` — same fields, better prose.
 * A `thesis` field is added at the top as the authorial voice.
 *
 * The UI flips between raw and narrative views by swapping which object
 * it reads from. Fields the AI never touched (or fell back on after a
 * failed refinement pass) still display correctly because `aiSettlement`
 * started as a deep clone of the source.
 *
 * Regenerate UX: clicking "Regenerate" during an existing narrative
 * stages the new one into `_aiStaging` while the old `aiSettlement`
 * keeps rendering (dimmed by the UI layer). On success, the staging
 * object atomically swaps into `aiSettlement`. On failure, the old
 * narrative is untouched.
 *
 * AI features are gated by credits (creditsSlice), not account tier.
 */

// THE ONE ai_data LANE. Every narrative write below goes through the durable
// outbox (campaignSliceShared.persistSaveUpdate), never savesService.update
// directly: the outbox keys its op on the DB COLUMN SET, so two racing ai_data
// writes for one save supersede rather than race, an in-flight stale write can
// never land over a fresher one, and an offline write parks + retries + survives
// a tab close instead of vanishing into a local catch. persistSaveUpdate never
// throws and never rejects — it resolves the FIRST attempt's outcome as a
// boolean, so each site below reports `false` the way its old catch reported an
// error, and the retry keeps running underneath.
import { persistSaveUpdate } from './campaignSliceShared.js';
import { settlementFingerprint } from '../lib/settlementFingerprint.js';
import { getAiCostForModel, isFastModelPreference } from '../config/pricing.js';
import { track, EVENTS } from '../lib/analytics.js';
import { captureFingerprint } from '../lib/researchCapture.js';
import { CHRONICLE_LIMITS, createChronicleEntry, appendChronicleEntry } from '../lib/chronicle.js';
import { isCanonSave } from '../domain/campaign/canon.js';
import {
  canonPhaseOf,
  durationBand,
  errorKindFromError,
  logHardViolations,
  reportVerifier,
  runOverlayVerifier,
} from './aiOverlayLifecycle.js';
import { buildAiDataBlob } from './aiPersistenceEnvelope.js';
import {
  aiRequestDisposition,
  DAILY_LIFE_FIELD_LABELS,
  NARRATIVE_FIELD_LABELS,
  resyncCreditBalanceAfterFailure,
  ROTATING_AI_PROGRESS,
} from './aiRequestLifecycle.js';
// NOTE: buildSettlementRelationshipMemoryContext (relationshipMemory.js →
// relationshipEvolution.js, ~117 kB) and buildWorldSnapshot are NOT imported
// here. They are only needed by buildDailyLifeRelationshipMemory(), inside the
// async requestDailyLife action, so they are dynamic-imported there to keep the
// heavy relationship-evolution graph off the first-paint boot path.

// FP-2a first-paint reclaim (−2,448 B closure): lib/ai.js (the AI transport) and
// narrativeMutations.js are SOLE-imported by this slice and only reached from
// inside async actions, AFTER each action's synchronous prefix (the guards, credit
// check, set(aiLoading), and the F18/F19 abort-controller stamp ALL still run
// synchronously). Dynamic-importing them at the call site — memoized like
// settlementSlice's loadEngine() — keeps them off the first-paint entry closure.
// The one observable shift: the transport (generateNarrative) is invoked one
// microtask LATER than before (the loadEngine ordering). The F18 abort CONTRACT is
// unchanged — the controller + its signal are stamped synchronously and a late
// result is still discarded — but two F18 tests that introspected the mock's
// SYNCHRONOUS capture now yield one tick first (see aiSlice.orchestration.test.js).
// @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget).
let _aiLibPromise;
const loadAiLib = () => {
  if (!_aiLibPromise) _aiLibPromise = import('../lib/ai.js');
  return _aiLibPromise;
};

let _aiChronicleContextPromise = null;
const loadAiChronicleContext = () => {
  if (!_aiChronicleContextPromise) {
    _aiChronicleContextPromise = import('./aiChronicleContext.js');
  }
  return _aiChronicleContextPromise;
};

async function buildDailyLifeRelationshipMemory(state, saveId) {
  try {
    const campaign = state.getCampaignForSettlement?.(saveId);
    if (!campaign) return null;
    // Lazy-load the world-pulse relationship-memory machinery — heavy and only
    // needed at Daily-Life generation time, never on first paint.
    const [{ buildWorldSnapshot }, { buildSettlementRelationshipMemoryContext }] = await Promise.all([
      import('../domain/worldPulse/worldSnapshot.js'),
      import('../domain/worldPulse/relationshipMemory.js'),
    ]);
    const worldState = state.getCampaignWorldState?.(campaign.id) || campaign.worldState;
    const regionalGraph = state.getCampaignRegionalGraph?.(campaign.id) || campaign.regionalGraph;
    const snapshot = buildWorldSnapshot({
      campaign: { ...campaign, worldState, regionalGraph },
      saves: state.savedSettlements || [],
      worldState,
      regionalGraph,
    });
    return buildSettlementRelationshipMemoryContext({
      settlementId: saveId,
      worldState,
      regionalGraph,
      snapshot,
      savedSettlements: state.savedSettlements || [],
      // Read the posture/memoryScore the pulse persisted onto each
      // relationshipState (stamped by refreshRelationshipMemory) instead of
      // recomputing live; legacy saves without the stamp fall back to the
      // live derivation inside buildRelationshipPostures.
      preferPersisted: true,
    });
  } catch (error) {
    console.warn('[daily-life-memory] failed to build relationship context', error);
    return null;
  }
}

export const createAiSlice = (set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  aiSettlement:     null,   // AI-refined version of settlement (display only)
  aiDailyLife:      null,   // AI-generated daily life prose ({dawn, morning, ..., night})
  aiLoading:        false,  // true while an AI request is in-flight
  aiRegenerating:   false,  // true when regenerating — UI keeps showing old content dimmed
  aiError:          null,   // error message from last failed request
  aiProgress:       '',     // human-readable progress text shown in UI
  aiPartialFailure: null,   // { failedFields: [] } when some passes fell back to raw
  showNarrative:    false,  // toggle: true = show AI narrative, false = show raw data
  aiDataVersion:    null,   // timestamp of settlement data the narrative was built from
  aiSourceFingerprint: null, // stable settlement content hash for stale detection
  aiViolations:     null,   // Tier 6.5 verifier report (null when no overlay committed)
  aiAbortController: null,  // F18: AbortController for the in-flight generation (cancel / stall teardown)
  aiRequestId:      0,      // F18/F19: monotonic token; a superseded or aborted request must not commit
  aiRefundNotice:   null,   // F1: { status, spendId, reason, supportNote } when a failed paid run's auto-refund ALSO failed

  // ── Actions ────────────────────────────────────────────────────────────────
  setAiSettlement: (aiData) =>
    set(state => {
      // Tier 6.5: run the canon-preservation verifier against the
      // current raw settlement BEFORE committing. The overlay still
      // commits regardless (display-only guard); the verification
      // report is surfaced on state so UI/PDF can show warnings.
      const verification = runOverlayVerifier(state.settlement, aiData);
      logHardViolations(verification, 'setAiSettlement');
      state.aiSettlement = aiData;
      state.aiDataVersion = Date.now();
      state.aiSourceFingerprint = aiData ? settlementFingerprint(state.settlement) : null;
      state.aiViolations = aiData ? verification : null;
      if (aiData) reportVerifier('narrative', verification);
    }),

  clearAiSettlement: () =>
    set(state => {
      // F18/F19: this runs on detail-view unmount (i.e. a settlement switch).
      // Abort any in-flight generation and bump the request token so a late or
      // stalled completion for the OLD settlement can never commit its prose /
      // violations onto the NEW view, and the loading lock is released.
      if (state.aiAbortController) {
        try { state.aiAbortController.abort(); } catch (_) { /* already aborted */ }
      }
      state.aiAbortController = null;
      state.aiRequestId = (state.aiRequestId || 0) + 1;
      state.aiSettlement = null;
      state.aiDailyLife = null;
      state.aiDataVersion = null;
      state.aiSourceFingerprint = null;
      state.aiPartialFailure = null;
      state.aiViolations = null;
      state.aiRefundNotice = null;
      state.aiLoading = false;
      state.aiRegenerating = false;
      state.aiProgress = '';
      state.aiError = null;
    }),

  /**
   * F18 — explicitly cancel the in-flight AI generation. Aborts the stream,
   * supersedes the request token so the aborted request's late completion can
   * never commit, and releases the loading lock so the user can retry
   * immediately (the retry guard `if (aiLoading) return` no longer wedges).
   */
  cancelAiGeneration: () =>
    set(state => {
      if (state.aiAbortController) {
        try { state.aiAbortController.abort(); } catch (_) { /* already aborted */ }
      }
      state.aiAbortController = null;
      state.aiRequestId = (state.aiRequestId || 0) + 1;
      state.aiLoading = false;
      state.aiRegenerating = false;
      state.aiProgress = '';
    }),

  /**
   * F1 — dismiss the refund-failure notice (the support-reference card shown
   * when a paid generation failed AND its automatic refund also failed).
   */
  clearAiRefundNotice: () =>
    set(state => { state.aiRefundNotice = null; }),

  /** Dismiss the violations notice without clearing the AI settlement
   *  itself. Used by the AiOverlayViolations card's close button.
   *  Violations resurface if a subsequent generation flags drift. */
  clearAiViolations: () =>
    set(state => { state.aiViolations = null; }),

  // RETIRED (R-5b, owner queue #21): `setAiDailyLife`. A redundant setter with no
  // caller — the daily-life generation path writes `state.aiDailyLife` directly
  // (both the streamed per-field write and the final assignment below), and the
  // identity-hygiene clears null it. A second public writer onto a field that
  // already has one is how a single-writer invariant rots.

  setAiLoading: (loading) =>
    set(state => { state.aiLoading = loading; }),

  setAiError: (error) =>
    set(state => { state.aiError = error; }),

  setAiProgress: (msg) =>
    set(state => { state.aiProgress = msg; }),

  toggleNarrativeView: () =>
    set(state => {
      state.showNarrative = !state.showNarrative;
      track(EVENTS.NARRATIVE_VIEW_TOGGLED, {
        to_mode: state.showNarrative ? 'ai' : 'raw',
        has_daily_life: !!state.aiDailyLife,
      });
    }),

  setShowNarrative: (show) =>
    set(state => {
      const next = !!show;
      // Only emit when the mode actually changes — programmatic no-op sets
      // shouldn't look like user toggles. Additive; never affects the set.
      if (next !== state.showNarrative) {
        track(EVENTS.NARRATIVE_VIEW_TOGGLED, {
          to_mode: next ? 'ai' : 'raw',
          has_daily_life: !!state.aiDailyLife,
        });
      }
      state.showNarrative = show;
    }),

  /**
   * Check if the current narrative is stale (settlement changed since generation).
   */
  isNarrativeStale: () => {
    const { aiSettlement, aiDataVersion, aiSourceFingerprint, settlement } = get();
    if (!aiSettlement || !aiDataVersion || !settlement) return true;
    if (!aiSourceFingerprint) return true;
    return aiSourceFingerprint !== settlementFingerprint(settlement);
  },

  // ── AI generation actions ─────────────────────────────────────────────────

  /**
   * Generate an AI narrative synthesis for the current settlement.
   *
   * Streams refinement-pass snapshots field-by-field. During first-time
   * generation, the UI progressively fills in. During regeneration, we
   * stage into a local variable so the old narrative remains visible
   * until the new one completes atomically.
   */
  requestNarrative: async (saveId) => {
    const { settlement, aiLoading, creditBalance, aiSettlement } = get();
    if (!settlement || aiLoading) return;

    // AI narrative is gated behind saved settlements so ai_data has a durable home.
    if (!saveId) {
      set(state => { state.aiError = 'Save this settlement first to generate an AI narrative.'; });
      return;
    }

    const saveEntry = get().savedSettlements.find(s => s.id === saveId);
    const dossierNotes = saveEntry?.aiData?.dossierNotes || {};
    const aiGuidance = typeof dossierNotes.aiGuidance === 'string' ? dossierNotes.aiGuidance.trim() : '';
    const modelPreference = get().auth?.modelPreference;
    const isRegenerate = !!aiSettlement;
    // Captured at run entry, when the live view still belongs to THIS save: the
    // run's own daily-life bundle for the chronicle snapshot below. A mid-run
    // settlement switch must not let the chronicle read another save's live view.
    const runDailyLife = get().aiDailyLife;
    const cost = getAiCostForModel('narrative', modelPreference);
    const elevated = get().isElevated();
    if (!elevated && creditBalance < cost) {
      set(state => { state.aiError = `Insufficient credits (need ${cost}, have ${state.creditBalance})`; });
      get().setPurchaseModalOpen(true);
      track(EVENTS.AI_GENERATION_FAILED, { type: 'narrative', error_kind: 'credits' });
      return;
    }

    track(EVENTS.AI_GENERATION_STARTED, {
      type: 'narrative',
      fast_variant: isFastModelPreference(modelPreference),
      credits_cost: cost,
      is_regeneration: isRegenerate,
      canon_phase: canonPhaseOf(saveEntry),
    });
    const startedAt = Date.now();

    // F18/F19 — stamp this request with an abort controller + a monotonic
    // token bound to the settlement it was launched for. `isCurrentRequest()`
    // gates every commit: a request is stale if its token was superseded (a
    // newer run, an explicit cancel, or a settlement switch bumped it) OR the
    // active view has moved to a different save. A stale request must not
    // commit prose/violations onto the wrong settlement, nor touch the loading
    // lock the superseding action now owns.
    const capturedSaveId = saveId;
    const controller = new AbortController();
    const myRequestId = (get().aiRequestId || 0) + 1;
    const isCurrentRequest = () =>
      get().aiRequestId === myRequestId &&
      String(get().activeSaveId) === String(capturedSaveId);

    set(state => {
      state.aiRequestId = myRequestId;
      state.aiAbortController = controller;
      state.aiRefundNotice = null; // clear a stale notice from a prior run
      state.aiLoading = true;
      state.aiRegenerating = isRegenerate;
      state.aiError = null;
      state.aiProgress = ROTATING_AI_PROGRESS[0];
      state.aiPartialFailure = null;
      // First-time: clear old (so UI shows progressive fill-in)
      // Regenerate:   keep old aiSettlement in place (UI will dim it)
      if (!isRegenerate) state.aiSettlement = null;
    });

    // Fallback rotation in case the stream stalls (e.g. long first TTFB)
    let rotIdx = 0;
    let lastFieldMsg = false;
    const rotation = setInterval(() => {
      const st = get();
      if (!st.aiLoading) return;
      if (lastFieldMsg) return; // don't clobber real field progress
      rotIdx = (rotIdx + 1) % ROTATING_AI_PROGRESS.length;
      set(state => { state.aiProgress = ROTATING_AI_PROGRESS[rotIdx]; });
    }, 2500);

    const totalFields = Object.keys(NARRATIVE_FIELD_LABELS).length;
    let fieldsDone = 0;

    // Write dotted paths ("powerStructure.factions") into nested objects.
    const setNestedPath = (root, path, value) => {
      const keys = path.split('.');
      // Prototype-pollution guard (ported master fix): a streamed beat key like
      // "__proto__.polluted" must never write through Object.prototype.
      if (keys.some(k => k === '__proto__' || k === 'constructor' || k === 'prototype')) return;
      let ref = root;
      for (let i = 0; i < keys.length - 1; i++) {
        if (typeof ref[keys[i]] !== 'object' || ref[keys[i]] === null) ref[keys[i]] = {};
        ref = ref[keys[i]];
      }
      ref[keys[keys.length - 1]] = value;
    };

    // Pinned NPC ids travel to the edge function so the `npcs` refinement pass
    // skips them. Read from the persisted ai_data, not from in-session state,
    // so the pin survives page reloads.
    const pinnedNpcIds = Array.isArray(saveEntry?.aiData?.pinnedNpcs)
      ? saveEntry.aiData.pinnedNpcs
      : [];

    try {
      const [
        { generateNarrative },
        { buildChronicleContextFromSave },
      ] = await Promise.all([
        loadAiLib(),
        loadAiChronicleContext(),
      ]);
      const { result, creditsRemaining, partialFailure, failedFields } =
        await generateNarrative('narrative', settlement, saveId, {
          pinnedNpcIds,
          aiGuidance,
          modelPreference,
          signal: controller.signal,
          chronicleContext: buildChronicleContextFromSave(saveEntry, settlement),
          onRefundFailure(notice) {
            // F1 \u2014 surface UNCONDITIONALLY. This is about the user's money (a
            // failed paid run whose auto-refund also failed), not about which
            // settlement is on screen; the support reference must survive even
            // if the user has navigated away.
            set(state => { state.aiRefundNotice = notice; });
          },
          onField(fieldName, value, error) {
            // F19 \u2014 a superseded/aborted request must stop writing progress or
            // partial prose into the store (it would clobber the new view).
            if (!isCurrentRequest()) return;
            // Per-pass error: not fatal. Progress counter still advances so
            // the percentage reflects passes *attempted*, not successful.
            if (error) {
              fieldsDone += 1;
              lastFieldMsg = true;
              set(state => {
                state.aiProgress = `\u26a0 ${fieldName} fell back to raw (${fieldsDone}/${totalFields})`;
              });
              return;
            }

            fieldsDone += 1;
            lastFieldMsg = true;
            const label = NARRATIVE_FIELD_LABELS[fieldName] || `Writing ${fieldName}`;
            set(state => {
              // During regenerate, don't overwrite the old aiSettlement — the
              // final result will swap in atomically on success.
              if (!isRegenerate) {
                if (!state.aiSettlement) state.aiSettlement = {};
                setNestedPath(state.aiSettlement, fieldName, value);
              }
              state.aiProgress = `${label}\u2026 (${fieldsDone}/${totalFields})`;
            });
          },
        });

      // F19 — gate the commit. A superseded run ('abandon') is discarded
      // wholesale: no prose/violations onto the now-active view, no persist,
      // no chronicle (chronicle snapshots the LIVE store, which now belongs to
      // a different settlement). A view-moved run ('release') just frees the
      // loading lock. `finally` still clears this run's rotation interval.
      const disposition = aiRequestDisposition(get, myRequestId, capturedSaveId);
      if (disposition === 'abandon') return;
      if (disposition === 'release') {
        set(state => {
          state.aiLoading = false; state.aiRegenerating = false;
          state.aiProgress = '';
          state.aiAbortController = null;
        });
        return;
      }

      const sourceFingerprint = settlementFingerprint(settlement);

      // Tier 6.5: verify the final atomic result against the source
      // settlement so UI surfaces (and the upcoming PDF appendix) can
      // show violation warnings.
      const verificationN = runOverlayVerifier(settlement, result);
      logHardViolations(verificationN, 'requestNarrative');

      set(state => {
        state.aiSettlement = result;
        state.aiDataVersion = Date.now();
        state.aiSourceFingerprint = sourceFingerprint;
        state.aiLoading = false; state.aiRegenerating = false;
        state.aiProgress = '';
        state.showNarrative = true;
        state.aiPartialFailure = partialFailure ? { failedFields: failedFields || [] } : null;
        state.aiViolations = verificationN;
        state.aiAbortController = null; // this run is done; release the controller
        if (typeof creditsRemaining === 'number') state.creditBalance = creditsRemaining;
      });
      // P104 / F34 — this paid generation actually completed and committed.
      // Keep the reader-audience signal behind the same disposition gate so an
      // abandoned or switched-away run never counts as engagement.
      get().bumpLifetimeNarrate?.();

      track(EVENTS.AI_GENERATION_COMPLETED, {
        type: 'narrative',
        duration_band: durationBand(Date.now() - startedAt),
        partial_failure: !!partialFailure,
        failed_field_count: Array.isArray(failedFields) ? failedFields.length : 0,
      });
      reportVerifier('narrative', verificationN);
      // Structural snapshot at the ai-polish lifecycle moment (consent-gated,
      // best-effort). saveId is a saved-settlement uuid here (gated above).
      captureFingerprint('ai_polished', result, {
        settlementUuid: saveId,
        save: get().savedSettlements.find(s => s.id === saveId) || null,
      });
      // Wave E1 — 'narrate' milestone on the generation-id spine (fire-and-forget).
      import('../lib/generationTelemetry.js').then(({ recordGenerationMilestone }) => {
        recordGenerationMilestone('narrate', settlement, {
          generationId: get().generationId, seed: get().lastSeed, stampIso: get().generatedAt,
        });
      }).catch(() => {});

      // Persist the refined narrative + mode flip to the saved settlement. The
      // local mirror commits FIRST and the outbox catches up, so what the user
      // just paid for is on screen in one frame and durable underneath.
      const existingEntry = get().savedSettlements.find(s => s.id === saveId);
      const aiData = buildAiDataBlob(existingEntry?.aiData, {
        aiSettlement:         result,
        aiDailyLife:          get().aiDailyLife,
        narrativeMode:        'narrated',
        narrativeGeneratedAt: new Date().toISOString(),
        narrativeSourceFingerprint: sourceFingerprint,
      });
      get().updateSavedSettlement(saveId, { aiData });
      if (!(await persistSaveUpdate(saveId, { aiData }))) {
        set(state => { state.aiError = 'Narrative generated but save failed — it may not persist across sessions.'; });
      }

      // Chronicle: after a successful generation, append an entry logging this
      // run. Tier-based rotation handled inside _appendChronicleEntry.
      // Non-fatal on failure — the narrative itself is already persisted above.
      try {
        await get()._appendChronicleEntry(saveId, {
          reason: isRegenerate ? 'regenerate' : 'initial',
          // Thread THIS run's prose so a mid-generation settlement switch can't
          // snapshot the now-active settlement's narrative under this save.
          aiSettlement: result,
          aiDailyLife:  runDailyLife ?? null,
        });
      } catch (chronErr) {
        console.error('Chronicle append failed:', chronErr);
      }
    } catch (e) {
      // F19 — 'abandon' (superseded) leaves cleanup to the owner. Otherwise
      // this request owns loading cleanup and releases the lock (so a stalled
      // stream that aborted here can't wedge future AI actions — F18).
      const disposition = aiRequestDisposition(get, myRequestId, capturedSaveId);
      if (disposition !== 'abandon') {
        set(state => {
          state.aiLoading = false;
          state.aiRegenerating = false;
          state.aiProgress = '';
          state.aiAbortController = null;
          if (disposition === 'commit') {
            state.aiError = e.message || 'Narrative generation failed';
            // F20 — a FIRST-TIME failure progressively wrote partial fields
            // into aiSettlement; clear them so the dossier doesn't offer a
            // "View Narrative" toggle over a half-written, credit-charged
            // fragment. A regenerate never touched the live object.
            if (!isRegenerate) state.aiSettlement = null;
          }
        });
        if (disposition === 'commit') {
          track(EVENTS.AI_GENERATION_FAILED, { type: 'narrative', error_kind: errorKindFromError(e) });
          resyncCreditBalanceAfterFailure(get, myRequestId, capturedSaveId);
        }
      }
    } finally {
      clearInterval(rotation);
    }
  },

  /**
   * Generate AI daily-life prose for the current settlement.
   * Streams field-by-field (dawn \u2192 morning \u2192 midday \u2192 evening \u2192 night).
   *
   * Regenerate behavior matches narrative: keep old prose visible until
   * new one lands atomically.
   */
  requestDailyLife: async (saveId) => {
    const { settlement, aiLoading, creditBalance, aiDailyLife } = get();
    if (!settlement || aiLoading) return;

    // Daily life is gated behind saved settlements for the same reason as narrative.
    if (!saveId) {
      set(state => { state.aiError = 'Save this settlement first to generate AI daily life.'; });
      return;
    }

    const saveEntry = get().savedSettlements.find(s => s.id === saveId);
    const dossierNotes = saveEntry?.aiData?.dossierNotes || {};
    const aiGuidance = typeof dossierNotes.aiGuidance === 'string' ? dossierNotes.aiGuidance.trim() : '';
    const modelPreference = get().auth?.modelPreference;
    // store-3 / FP-2a: the buildDailyLifeRelationshipMemory await (two dynamic imports
    // + a world-snapshot build, hundreds of ms on the first click) is deferred to
    // AFTER the sync prefix — the credit check, F18/F19 token/abort stamp, and
    // set(aiLoading:true) below all run SYNCHRONOUSLY now, so a second click hits the
    // `if (!settlement || aiLoading) return` guard and cannot double-charge. The build
    // moves into the try, alongside loadAiLib (the pattern requestNarrative already
    // follows).
    const isRegenerate = !!aiDailyLife;
    const cost = getAiCostForModel('dailyLife', modelPreference);
    const elevated = get().isElevated();
    if (!elevated && creditBalance < cost) {
      set(state => { state.aiError = `Insufficient credits (need ${cost}, have ${state.creditBalance})`; });
      get().setPurchaseModalOpen(true);
      track(EVENTS.AI_GENERATION_FAILED, { type: 'daily_life', error_kind: 'credits' });
      return;
    }

    track(EVENTS.AI_GENERATION_STARTED, {
      type: 'daily_life',
      fast_variant: isFastModelPreference(modelPreference),
      credits_cost: cost,
      is_regeneration: isRegenerate,
      canon_phase: canonPhaseOf(saveEntry),
    });
    const startedAt = Date.now();

    // F18/F19 — abort controller + monotonic token bound to this save (see
    // requestNarrative for the full rationale).
    const capturedSaveId = saveId;
    const controller = new AbortController();
    const myRequestId = (get().aiRequestId || 0) + 1;
    const isCurrentRequest = () =>
      get().aiRequestId === myRequestId &&
      String(get().activeSaveId) === String(capturedSaveId);

    set(state => {
      state.aiRequestId = myRequestId;
      state.aiAbortController = controller;
      state.aiRefundNotice = null;
      state.aiLoading = true;
      state.aiRegenerating = isRegenerate;
      state.aiError = null;
      state.aiProgress = ROTATING_AI_PROGRESS[0];
      if (!isRegenerate) state.aiDailyLife = null;
    });

    let rotIdx = 0;
    let lastFieldMsg = false;
    const rotation = setInterval(() => {
      const st = get();
      if (!st.aiLoading) return;
      if (lastFieldMsg) return;
      rotIdx = (rotIdx + 1) % ROTATING_AI_PROGRESS.length;
      set(state => { state.aiProgress = ROTATING_AI_PROGRESS[rotIdx]; });
    }, 2500);

    const totalFields = Object.keys(DAILY_LIFE_FIELD_LABELS).length;
    let fieldsDone = 0;

    try {
      const [
        { generateNarrative },
        { buildChronicleContextFromSave },
      ] = await Promise.all([
        loadAiLib(),
        loadAiChronicleContext(),
      ]);
      // Built HERE (post-lock) — see the sync-prefix note above. The loading lock is
      // already held, so this awaited build cannot admit a second concurrent request.
      const relationshipMemoryContext = await buildDailyLifeRelationshipMemory(get(), saveId);
      const { result, creditsRemaining } = await generateNarrative('dailyLife', settlement, saveId, {
        aiGuidance,
        modelPreference,
        relationshipMemoryContext,
        signal: controller.signal,
        chronicleContext: buildChronicleContextFromSave(saveEntry, settlement),
        onRefundFailure(notice) {
          set(state => { state.aiRefundNotice = notice; });
        },
        onField(fieldName, value, error) {
          if (!isCurrentRequest()) return;
          if (error) {
            fieldsDone += 1;
            lastFieldMsg = true;
            set(state => {
              state.aiProgress = `\u26a0 ${fieldName} failed (${fieldsDone}/${totalFields})`;
            });
            return;
          }
          fieldsDone += 1;
          lastFieldMsg = true;
          const label = DAILY_LIFE_FIELD_LABELS[fieldName] || `Writing ${fieldName}`;
          set(state => {
            if (!isRegenerate) {
              state.aiDailyLife = { ...(state.aiDailyLife || {}), [fieldName]: value };
            }
            state.aiProgress = `${label}\u2026 (${fieldsDone}/${totalFields})`;
          });
        },
      });

      // F19 — discard a superseded run rather than committing daily life onto
      // whatever settlement is now on screen; 'release' just frees the lock.
      const disposition = aiRequestDisposition(get, myRequestId, capturedSaveId);
      if (disposition === 'abandon') return;
      if (disposition === 'release') {
        set(state => {
          state.aiLoading = false;
          state.aiRegenerating = false;
          state.aiProgress = '';
          state.aiAbortController = null;
        });
        return;
      }

      set(state => {
        state.aiDailyLife = result;
        state.aiLoading = false;
        state.aiRegenerating = false;
        state.aiProgress = '';
        state.aiAbortController = null;
        if (typeof creditsRemaining === 'number') state.creditBalance = creditsRemaining;
      });

      track(EVENTS.AI_GENERATION_COMPLETED, {
        type: 'daily_life',
        duration_band: durationBand(Date.now() - startedAt),
        partial_failure: false,
        failed_field_count: 0,
      });

      // Persist daily-life prose to the saved settlement. Mode flips to 'narrated'
      // if either narrative OR daily life exists.
      const existingEntry = get().savedSettlements.find(s => s.id === saveId);
      const aiData = buildAiDataBlob(existingEntry?.aiData, {
        aiSettlement:         get().aiSettlement,
        aiDailyLife:          result,
        narrativeMode:        'narrated',
        narrativeGeneratedAt: existingEntry?.aiData?.narrativeGeneratedAt || new Date().toISOString(),
        narrativeSourceFingerprint: get().aiSourceFingerprint || settlementFingerprint(settlement),
      });
      get().updateSavedSettlement(saveId, { aiData });
      if (!(await persistSaveUpdate(saveId, { aiData }))) {
        set(state => { state.aiError = 'Daily life generated but save failed — it may not persist across sessions.'; });
      }
    } catch (e) {
      // F19 — 'abandon' leaves cleanup to the owner; otherwise release the lock.
      const disposition = aiRequestDisposition(get, myRequestId, capturedSaveId);
      if (disposition !== 'abandon') {
        set(state => {
          state.aiLoading = false;
          state.aiRegenerating = false;
          state.aiProgress = '';
          state.aiAbortController = null;
          if (disposition === 'commit') {
            state.aiError = e.message || 'Daily life generation failed';
            // F20 — first-time failure progressively wrote partial prose into
            // aiDailyLife; clear it so the dossier doesn't present a
            // half-written day as complete. Regenerate leaves prior prose.
            if (!isRegenerate) state.aiDailyLife = null;
          }
        });
        if (disposition === 'commit') {
          track(EVENTS.AI_GENERATION_FAILED, { type: 'daily_life', error_kind: errorKindFromError(e) });
          resyncCreditBalanceAfterFailure(get, myRequestId, capturedSaveId);
        }
      }
    } finally {
      clearInterval(rotation);
    }
  },

  /**
   * Progress the AI narrative against a specific structural edit (AI-4b).
   *
   * Unlike `requestNarrative` (which rewrites from raw), progression evolves
   * the existing refined prose against a `changeType` + `changeLabel` pair
   * (from classifyChange). The server:
   *   • re-runs the Opus thesis with the prior thesis + the change as context
   *   • runs only the refinement passes PROGRESSION_AFFECTED_FIELDS marks
   *     affected for this changeType
   *   • preserves prior refined prose for every other pass
   *   • honors pinned NPCs (never in the default affected set; backend
   *     filter is belt-and-suspenders for future expansion)
   *
   * Always behaves like a regenerate from the UI's perspective — old narrative
   * stays visible (dimmed) until the new one lands atomically. Chronicle gets
   * a `progression` entry tagged with `triggeredBy: changeLabel` so the DM
   * can see what prompted each evolution.
   *
   * Preconditions: settlement loaded, saveId present, an aiSettlement already
   * exists (can't progress nothing). The drift modal gates seismic changes
   * out on the client; if one sneaks through the server rejects it.
   */
  requestProgression: async (saveId, { changeType, changeLabel }) => {
    const { settlement, aiLoading, creditBalance, aiSettlement, aiDailyLife } = get();
    if (!settlement || aiLoading) return;

    if (!saveId) {
      set(state => { state.aiError = 'Save this settlement first to progress the AI narrative.'; });
      return;
    }
    if (!aiSettlement) {
      set(state => { state.aiError = 'Progress requires an existing narrative. Generate one first.'; });
      return;
    }
    if (!changeType || typeof changeType !== 'string') {
      set(state => { state.aiError = 'Progress requires a change type.'; });
      return;
    }

    const saveEntry = get().savedSettlements.find(s => s.id === saveId);
    const dossierNotes = saveEntry?.aiData?.dossierNotes || {};
    const aiGuidance = typeof dossierNotes.aiGuidance === 'string' ? dossierNotes.aiGuidance.trim() : '';
    const modelPreference = get().auth?.modelPreference;
    const cost = getAiCostForModel('progression', modelPreference);
    const elevated = get().isElevated();
    if (!elevated && creditBalance < cost) {
      set(state => { state.aiError = `Insufficient credits (need ${cost}, have ${state.creditBalance})`; });
      get().setPurchaseModalOpen(true);
      track(EVENTS.AI_GENERATION_FAILED, { type: 'progression', error_kind: 'credits' });
      return;
    }

    track(EVENTS.AI_GENERATION_STARTED, {
      type: 'progression',
      fast_variant: isFastModelPreference(modelPreference),
      credits_cost: cost,
      is_regeneration: true, // progression is always regenerate-shaped
      canon_phase: canonPhaseOf(saveEntry),
    });
    const startedAt = Date.now();

    // F18/F19 — abort controller + monotonic token bound to this save.
    const capturedSaveId = saveId;
    const controller = new AbortController();
    const myRequestId = (get().aiRequestId || 0) + 1;
    const isCurrentRequest = () =>
      get().aiRequestId === myRequestId &&
      String(get().activeSaveId) === String(capturedSaveId);

    // Progression is always "regenerate-shaped": keep old aiSettlement
    // rendering (dimmed) until the new one is ready to swap in.
    set(state => {
      state.aiRequestId = myRequestId;
      state.aiAbortController = controller;
      state.aiRefundNotice = null;
      state.aiLoading = true;
      state.aiRegenerating = true;
      state.aiError = null;
      state.aiProgress = ROTATING_AI_PROGRESS[0];
      state.aiPartialFailure = null;
    });

    let rotIdx = 0;
    let lastFieldMsg = false;
    const rotation = setInterval(() => {
      const st = get();
      if (!st.aiLoading) return;
      if (lastFieldMsg) return;
      rotIdx = (rotIdx + 1) % ROTATING_AI_PROGRESS.length;
      set(state => { state.aiProgress = ROTATING_AI_PROGRESS[rotIdx]; });
    }, 2500);

    const pinnedNpcIds = Array.isArray(saveEntry?.aiData?.pinnedNpcs)
      ? saveEntry.aiData.pinnedNpcs
      : [];

    let fieldsDone = 0;

    try {
      const { generateNarrative } = await loadAiLib();
      const { result, creditsRemaining, partialFailure, failedFields } =
        await generateNarrative('progression', settlement, saveId, {
          pinnedNpcIds,
          changeType,
          changeLabel,
          aiGuidance,
          modelPreference,
          signal: controller.signal,
          priorNarrative: aiSettlement,
          priorDailyLife: aiDailyLife,
          onRefundFailure(notice) {
            set(state => { state.aiRefundNotice = notice; });
          },
          onField(fieldName, value, error) {
            if (!isCurrentRequest()) return;
            if (error) {
              fieldsDone += 1;
              lastFieldMsg = true;
              set(state => {
                state.aiProgress = `\u26a0 ${fieldName} fell back to prior (${fieldsDone})`;
              });
              return;
            }
            fieldsDone += 1;
            lastFieldMsg = true;
            const label = NARRATIVE_FIELD_LABELS[fieldName] || `Evolving ${fieldName}`;
            set(state => { state.aiProgress = `${label}\u2026 (${fieldsDone})`; });
          },
        });

      // F19 \u2014 progression is regenerate-shaped (old narrative still on screen);
      // a superseded run must not swap its evolved prose onto the new view.
      const disposition = aiRequestDisposition(get, myRequestId, capturedSaveId);
      if (disposition === 'abandon') return;
      if (disposition === 'release') {
        set(state => {
          state.aiLoading = false;
          state.aiRegenerating = false;
          state.aiProgress = '';
          state.aiAbortController = null;
        });
        return;
      }

      const sourceFingerprint = settlementFingerprint(settlement);

      // Tier 6.5: verify the evolved narrative against the source
      // settlement (progression v1 only refines existing prose).
      const verificationP = runOverlayVerifier(settlement, result);
      logHardViolations(verificationP, 'requestProgression');

      set(state => {
        state.aiSettlement = result;
        state.aiDataVersion = Date.now();
        state.aiSourceFingerprint = sourceFingerprint;
        state.aiLoading = false;
        state.aiRegenerating = false;
        state.aiProgress = '';
        state.showNarrative = true;
        state.aiPartialFailure = partialFailure ? { failedFields: failedFields || [] } : null;
        state.aiViolations = verificationP;
        state.aiAbortController = null;
        if (typeof creditsRemaining === 'number') state.creditBalance = creditsRemaining;
      });
      get().bumpLifetimeNarrate?.();

      track(EVENTS.AI_GENERATION_COMPLETED, {
        type: 'progression',
        duration_band: durationBand(Date.now() - startedAt),
        partial_failure: !!partialFailure,
        failed_field_count: Array.isArray(failedFields) ? failedFields.length : 0,
      });
      reportVerifier('progression', verificationP);
      captureFingerprint('ai_polished', result, {
        settlementUuid: saveId,
        save: get().savedSettlements.find(s => s.id === saveId) || null,
      });

      // Persist the evolved narrative. Daily life is carried through
      // unchanged — progression v1 doesn't touch it.
      const existingEntry = get().savedSettlements.find(s => s.id === saveId);
      const aiData = buildAiDataBlob(existingEntry?.aiData, {
        aiSettlement:         result,
        aiDailyLife:          get().aiDailyLife,
        narrativeMode:        'narrated',
        narrativeGeneratedAt: new Date().toISOString(),
        narrativeSourceFingerprint: sourceFingerprint,
      });
      get().updateSavedSettlement(saveId, { aiData });
      if (!(await persistSaveUpdate(saveId, { aiData }))) {
        set(state => { state.aiError = 'Progression generated but save failed — it may not persist across sessions.'; });
      }

      // Chronicle: record the progression with its human-readable trigger so
      // the DM can trace which edit drove which evolution.
      try {
        await get()._appendChronicleEntry(saveId, {
          reason: 'progression',
          triggeredBy: typeof changeLabel === 'string' && changeLabel ? changeLabel : null,
          // Thread THIS run's prose; progression carries the daily life captured
          // at run entry, never the live view, which a mid-call settlement
          // switch may have replaced.
          aiSettlement: result,
          aiDailyLife:  aiDailyLife ?? null,
        });
      } catch (chronErr) {
        console.error('Chronicle append (progression) failed:', chronErr);
      }
    } catch (e) {
      // F19 — 'abandon' leaves cleanup to the owner; otherwise release the lock.
      const disposition = aiRequestDisposition(get, myRequestId, capturedSaveId);
      if (disposition !== 'abandon') {
        set(state => {
          state.aiLoading = false;
          state.aiRegenerating = false;
          state.aiProgress = '';
          state.aiAbortController = null;
          // Old aiSettlement stays intact — progression never wrote partials
          // into the live object, so the user didn't lose anything.
          if (disposition === 'commit') state.aiError = e.message || 'Progression failed';
        });
        if (disposition === 'commit') {
          track(EVENTS.AI_GENERATION_FAILED, { type: 'progression', error_kind: errorKindFromError(e) });
          resyncCreditBalanceAfterFailure(get, myRequestId, capturedSaveId);
        }
      }
    } finally {
      clearInterval(rotation);
    }
  },

  /**
   * Internal: append a chronicle entry to the saved settlement's ai_data.
   *
   * Called on narrative generation success (initial/regenerate) and on
   * revert-to-raw. Snapshots the CURRENT `aiSettlement` / `aiDailyLife`
   * from store state — so callers should invoke this BEFORE clearing those
   * fields (e.g. before the revert nulls them).
   *
   * Chronicle cap is tier-based:
   *   • elevated (dev/admin) → unlimited full entries
   *   • premium              → unlimited full entries
   *   • free / anon          → CHRONICLE_LIMITS.free (5) full entries, older
   *                            full entries rotate to `summary` mode
   *
   * Persist failure is logged but non-fatal: the generation/revert itself
   * succeeded from the user's perspective; only cross-session history is
   * at risk.
   *
   * Pre-canon regenerations are NOT recorded (owner decision, 2026-06-11):
   * before canonization a regenerate is exploratory churn, not history.
   * Owner scoped this to regenerations only — 'initial', 'progression',
   * and 'revert' keep recording regardless of phase.
   *
   * @param {string} saveId
   * @param {object} opts
   * @param {'initial'|'regenerate'|'progression'|'revert'} opts.reason
   * @param {string|null} [opts.triggeredBy]
   * @param {'full'|'summary'} [opts.mode='full']
   * @param {object|null} [opts.aiSettlement] - this run's own aiSettlement prose; preferred over the live store view so a mid-generation settlement switch can't bleed another save's prose into this entry
   * @param {object|null} [opts.aiDailyLife] - this run's own aiDailyLife prose; same mid-switch guard as aiSettlement
   */
  _appendChronicleEntry: async (
    saveId,
    { reason, triggeredBy = null, mode = 'full', aiSettlement, aiDailyLife },
  ) => {
    if (!saveId) return;
    const state = get();
    const entry = state.savedSettlements.find(s => s.id === saveId);
    if (!entry) return;

    // Canon gate — regenerations only start chronicling after the save is
    // canonized. canonize() persists campaignState to the save immediately
    // (persistActiveSaveLifecycle), so the entry read above is never stale.
    if (reason === 'regenerate' && !isCanonSave(entry)) return;

    const limit = state.isElevated?.() ? CHRONICLE_LIMITS.elevated
                : state.isPremium?.()  ? CHRONICLE_LIMITS.premium
                : CHRONICLE_LIMITS.free;

    // Prefer the run's OWN prose (threaded by the caller). Only fall back to the
    // live store view when this save is the one on screen — otherwise a
    // mid-generation switch would snapshot another settlement's prose under this
    // save's chronicle. (Ported master fix.)
    const sourceProvided = aiSettlement !== undefined || aiDailyLife !== undefined;
    const liveIsThisSave = state.activeSaveId == null || state.activeSaveId === saveId;
    const snapshotSettlement = sourceProvided
      ? (aiSettlement ?? null)
      : (liveIsThisSave ? state.aiSettlement : null);
    const snapshotDailyLife = sourceProvided
      ? (aiDailyLife ?? null)
      : (liveIsThisSave ? state.aiDailyLife : null);

    const newEntry = createChronicleEntry({
      reason,
      aiSettlement: snapshotSettlement,
      aiDailyLife:  snapshotDailyLife,
      triggeredBy,
      mode,
    });

    const nextChronicle = appendChronicleEntry(
      Array.isArray(entry.aiData?.chronicle) ? entry.aiData.chronicle : [],
      newEntry,
      { limit },
    );

    const nextAiData = { ...(entry.aiData || {}), chronicle: nextChronicle };
    get().updateSavedSettlement(saveId, { aiData: nextAiData });
    // Non-fatal by contract: a first-attempt failure is reported by the outbox
    // runner (console warn + campaignSyncError) and the op retries on its own.
    await persistSaveUpdate(saveId, { aiData: nextAiData });
  },

  updateDossierNotes: async (saveId, notes = {}) => {
    if (!saveId) return null;
    const entry = get().savedSettlements.find(s => s.id === saveId);
    if (!entry) return null;
    const dossierNotes = {
      dmNotes: typeof notes.dmNotes === 'string' ? notes.dmNotes : '',
      aiGuidance: typeof notes.aiGuidance === 'string' ? notes.aiGuidance : '',
      updatedAt: new Date().toISOString(),
    };
    const nextAiData = buildAiDataBlob(entry.aiData, { dossierNotes });
    get().updateSavedSettlement(saveId, { aiData: nextAiData });
    // The ONE ai_data writer that rejects: NotesTab shows a retry affordance off
    // this rejection (its catch is load-bearing). The outbox still holds the
    // write and retries it, so the rejection now means "not landed yet", not
    // "lost" — the local draft text and the queued op both survive.
    if (!(await persistSaveUpdate(saveId, { aiData: nextAiData }))) {
      throw new Error('Dossier notes did not reach the cloud on this attempt; the write is queued for retry.');
    }
    return dossierNotes;
  },

  // ── Pinned NPCs (AI-4a) ───────────────────────────────────────────────────
  //
  // The DM can pin specific NPCs on a save; pinned ids ride along with every
  // narrative and (future) progression request, and the `npcs` refinement pass
  // filters them out before building its payload. Net effect: pinned NPCs are
  // byte-identical across regenerations. Persistence is through ai_data so the
  // pin survives reload and is scoped per-save.
  //
  // Storage: `savedSettlements[].aiData.pinnedNpcs: Array<string|number>`
  // (normalized to strings at call sites — the edge function coerces).
  //
  // No in-session mirror — the save entry is the single source of truth,
  // read live via `useStore(s => s.savedSettlements.find(...))` in components.

  /**
   * Pin an NPC on a save so regenerations don't rewrite it. No-op if already
   * pinned. Persists through the ai_data outbox lane; a failed first attempt
   * leaves the in-memory pin in place and retries (same policy as cosmetic rename).
   */
  pinNpc: async (saveId, npcId) => {
    if (!saveId || npcId == null) return;
    const key = String(npcId);
    const entry = get().savedSettlements.find(s => s.id === saveId);
    if (!entry) return;
    const current = Array.isArray(entry.aiData?.pinnedNpcs) ? entry.aiData.pinnedNpcs : [];
    if (current.some(x => String(x) === key)) return; // already pinned
    const nextAiData = { ...(entry.aiData || {}), pinnedNpcs: [...current, key] };
    get().updateSavedSettlement(saveId, { aiData: nextAiData });
    await persistSaveUpdate(saveId, { aiData: nextAiData });
  },

  /**
   * Unpin an NPC. No-op if not pinned. Mirror of pinNpc.
   */
  unpinNpc: async (saveId, npcId) => {
    if (!saveId || npcId == null) return;
    const key = String(npcId);
    const entry = get().savedSettlements.find(s => s.id === saveId);
    if (!entry) return;
    const current = Array.isArray(entry.aiData?.pinnedNpcs) ? entry.aiData.pinnedNpcs : [];
    const next = current.filter(x => String(x) !== key);
    if (next.length === current.length) return; // not pinned; nothing to do
    const nextAiData = { ...(entry.aiData || {}), pinnedNpcs: next };
    get().updateSavedSettlement(saveId, { aiData: nextAiData });
    await persistSaveUpdate(saveId, { aiData: nextAiData });
  },

  /**
   * Selector: is this NPC currently pinned on this save? Reads from live
   * savedSettlements state; safe to call in render.
   */
  isNpcPinned: (saveId, npcId) => {
    if (!saveId || npcId == null) return false;
    const key = String(npcId);
    const entry = get().savedSettlements.find(s => s.id === saveId);
    const pinned = Array.isArray(entry?.aiData?.pinnedNpcs) ? entry.aiData.pinnedNpcs : [];
    return pinned.some(x => String(x) === key);
  },

  /**
   * Hydrate the AI session state from a saved entry's ai_data blob.
   * Called when a saved settlement is opened for viewing/editing so the
   * persisted narrative shows up immediately.
   */
  hydrateAiFromSave: (saveEntry) => {
    const blob = saveEntry?.aiData || {};
    set(state => {
      state.aiSettlement     = blob.aiSettlement || null;
      state.aiDailyLife      = blob.aiDailyLife  || null;
      state.aiDataVersion    = blob.narrativeGeneratedAt ? new Date(blob.narrativeGeneratedAt).getTime() : null;
      state.aiSourceFingerprint = blob.narrativeSourceFingerprint || null;
      state.showNarrative    = blob.narrativeMode === 'narrated' && !!blob.aiSettlement;
      state.aiError          = null;
      state.aiProgress       = '';
      state.aiPartialFailure = null;
      // Identity hygiene: opening a save establishes a NEW settlement identity,
      // so every ai-identity field must be (re)set together — otherwise the
      // previous view's verifier report or refund notice bleeds onto this one.
      // The persisted blob carries neither (they're session-derived), so both
      // reset to null; a fresh commit repopulates aiViolations.
      state.aiViolations     = null;
      state.aiRefundNotice   = null;
    });
  },

  /**
   * Apply a cosmetic rename (NPC, faction, or settlement name) through every
   * string leaf of the save's ai_data blob. Safe no-op when the save has no
   * narrative yet. Persists through to Supabase and mirrors the change into
   * both the savedSettlements entry and (if it's the currently viewed save)
   * the in-session aiSettlement/aiDailyLife state.
   *
   * This is the cosmetic tier of the AI-2 change classifier — mechanical
   * substitution is semantically safe, no credit spend, no user confirm.
   */
  applyCosmeticRename: async ({ saveId, oldName, newName }) => {
    if (!saveId || !oldName || oldName === newName) return;
    const state = get();
    const entry = state.savedSettlements.find(s => s.id === saveId);
    if (!entry) return;

    const { applyRenameToAiData } = await import('../lib/narrativeMutations.js');
    const nextAiData = applyRenameToAiData(entry.aiData, oldName, newName);
    // If nothing changed (no narrative, or the name didn't appear anywhere),
    // skip the network round-trip.
    if (nextAiData === entry.aiData) return;

    // Update the session view first if this is the active save — keeps the
    // UI responsive even if the persist round-trip takes a moment. The guard
    // must check the save IS active (ported master fix): renaming a non-active
    // save must never overwrite the on-screen save's prose.
    if (state.activeSaveId === saveId && (state.aiSettlement || state.aiDailyLife)) {
      set(s => {
        if (nextAiData.aiSettlement) s.aiSettlement = nextAiData.aiSettlement;
        if (nextAiData.aiDailyLife)  s.aiDailyLife  = nextAiData.aiDailyLife;
      });
    }
    get().updateSavedSettlement(saveId, { aiData: nextAiData });
    // Non-fatal: in-memory state is correct and the outbox owns the retry, so no
    // aiError is surfaced — the rename DID succeed from the user's perspective.
    await persistSaveUpdate(saveId, { aiData: nextAiData });
  },

  /**
   * Revert the current settlement to its raw (pre-AI) view AND persist.
   * Clears aiSettlement + aiDailyLife on the save, flips mode to 'raw',
   * but preserves chronicle + pinnedNpcs so prior progression history is
   * not lost (they're additive DM-facing metadata, not display state).
   */
  revertCurrentToRaw: async (saveId) => {
    if (!saveId) {
      set(state => { state.aiError = 'No save to revert.'; });
      return;
    }
    // Captured at entry (ported master fix): the on-screen session view is only
    // nulled below when the reverted save IS the active one — reverting a
    // non-active save must not blank the save the user is currently reading.
    const stillActive = get().activeSaveId === saveId;

    // Chronicle FIRST: snapshot the narrative we're about to discard as a
    // summary-mode entry. We call this BEFORE nulling state so the snapshot
    // reads the still-live aiSettlement/aiDailyLife. Summary-at-birth matches
    // user intent — they explicitly asked to drop the narrative, so retaining
    // the full payload would contradict that. Thesis + summaryText survive
    // so the chronicle still shows WHAT was reverted.
    try {
      if (get().aiSettlement || get().aiDailyLife) {
        await get()._appendChronicleEntry(saveId, { reason: 'revert', mode: 'summary' });
      }
    } catch (chronErr) {
      console.error('Chronicle append (revert) failed:', chronErr);
    }

    // Re-read the entry AFTER the chronicle update so buildAiDataBlob picks
    // up the freshly-appended entry and preserves it through the revert write.
    const existingEntry = get().savedSettlements.find(s => s.id === saveId);
    const aiData = buildAiDataBlob(existingEntry?.aiData, {
      aiSettlement:         null,
      aiDailyLife:          null,
      narrativeMode:        'raw',
      narrativeGeneratedAt: null,
      narrativeSourceFingerprint: null,
    });
    // Session-view null only when the reverted save is the one on screen; the
    // persisted raw write below happens for the TARGET save regardless.
    if (stillActive) {
      set(state => {
        state.aiSettlement     = null;
        state.aiDailyLife      = null;
        state.aiDataVersion    = null;
        state.aiSourceFingerprint = null;
        state.showNarrative    = false;
        state.aiPartialFailure = null;
        state.aiError          = null;
      });
    }
    // Local mirror first (it used to sit INSIDE the try, after the await, so a
    // failed cloud write left the cached row still carrying the reverted-away
    // prose while the durable write was queued to remove it — the two disagreed).
    get().updateSavedSettlement(saveId, { aiData });
    if (!(await persistSaveUpdate(saveId, { aiData }))) {
      set(state => { state.aiError = 'Reverted in view but save failed — it may persist on reload.'; });
    }
  },
});
