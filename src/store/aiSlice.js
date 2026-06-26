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

import { generateNarrative } from '../lib/ai.js';
import { saves as savesService } from '../lib/saves.js';
import { applyRenameToAiData } from '../lib/narrativeMutations.js';
import { settlementFingerprint } from '../lib/settlementFingerprint.js';
import { getAiCostForModel, isFastModelPreference } from '../config/pricing.js';
import { track, EVENTS } from '../lib/analytics.js';
import { captureFingerprint } from '../lib/researchCapture.js';
import { CHRONICLE_LIMITS, createChronicleEntry, appendChronicleEntry } from '../lib/chronicle.js';
import { isCanonSave } from '../domain/campaign/canon.js';
import { verifyAiOverlay } from '../domain/aiOverlayVerifier.js';
import { buildChronicleFeed, selectChronicleContext } from '../domain/dossier/chronicleFeed.js';

// ── Verifier integration ────────────────────────────────────────────────────
//
// Every AI overlay commit runs through aiOverlayVerifier. The
// result is stored on state for UI/PDF surfaces to consume. We never
// REFUSE to commit on violations (display-only, no blocking): the user
// paid for the call, and a "your AI output had drift" warning is more
// useful than refusing to show the prose. Hard violations get a console
// warning so they show up in DEV-mode logs and Sentry breadcrumbs.

const HARD_VIOLATION_KINDS = Object.freeze(new Set([
  'invented_entity',
  'renamed_entity',
  'changed_fact',
  'changed_canon',
]));

function runOverlayVerifier(original, refined) {
  // Defensive: never let a verifier bug crash an AI commit. If the
  // verifier throws, we log and return a neutral pass-through report.
  try {
    return verifyAiOverlay(original, refined);
  } catch (e) {
    console.error('[ai-overlay-verifier] unexpected error', e);
    return { ok: true, violations: [], summary: {
      invented: 0, removed: 0, renamed: 0,
      contradicted: 0, canonChanged: 0, historyDropped: 0,
    } };
  }
}

function logHardViolations(verification, where) {
  if (verification.ok) return;
  const hard = verification.violations.filter(v => HARD_VIOLATION_KINDS.has(v.kind));
  if (hard.length === 0) return;
  // A single grouped warning so a noisy run doesn't drown the console.
  console.warn(
    `[ai-overlay] ${where}: ${hard.length} hard violation(s) detected`,
    hard.slice(0, 5),
  );
}

// ── Analytics helpers (coarse, fire-and-forget; never control-flow) ──────────
//
// The AI namespace events (docs/analytics-event-taxonomy.md §4) are additive and
// must carry only enums/bands/counts/hashes. These derive bands inline so no raw
// duration/error text ever reaches a prop.

/** Map a 'narrative'|'dailyLife'|'progression' request type to the taxonomy enum. */
const aiTypeEnum = (type) => (type === 'dailyLife' ? 'daily_life' : type);

/** duration_band vocabulary (taxonomy §Banding): lt_5s · 5_15s · 15_60s · 1_5m · 5_30m · gt_30m */
const durationBand = (ms) => {
  const n = Number(ms);
  if (!Number.isFinite(n) || n < 0) return 'unknown';
  if (n < 5000) return 'lt_5s';
  if (n < 15000) return '5_15s';
  if (n < 60000) return '15_60s';
  if (n < 300000) return '1_5m';
  if (n < 1800000) return '5_30m';
  return 'gt_30m';
};

/** Classify a thrown generation error into the coarse failure taxonomy. */
const errorKindFromError = (e) => {
  const msg = (e && typeof e.message === 'string' ? e.message : String(e || '')).toLowerCase();
  const name = (e && typeof e.name === 'string' ? e.name : '').toLowerCase();
  if (name === 'aborterror' || msg.includes('abort')) return 'aborted';
  if (msg.includes('insufficient credit') || msg.includes('credits')) return 'credits';
  if (/http 5\d\d/.test(msg) || msg.includes('truncated') || msg.includes('completion marker')) return 'server';
  if (msg.includes('failed to fetch') || msg.includes('network') || msg.includes('networkerror')
      || msg.includes('load failed') || msg.includes('timeout')) return 'network';
  return 'server';
};

/**
 * Map a thrown generation error to GM-facing domain language for the aiError
 * surface. Transport/engine internals (fetch/RPC/parse) must never reach the
 * trust surface verbatim — the raw message is logged via telemetry, not shown.
 * (P10 plain-language / P11 no engine-jargon leak.) `fallback` lets each action
 * name its own generic case ('narrative', 'daily life', 'progression').
 */
const friendlyAiError = (e, fallback) => {
  const kind = errorKindFromError(e);
  if (kind === 'credits') {
    // The specific need/have message is set on its own pre-flight path; a
    // credits failure that surfaces here is still domain-readable.
    return 'Not enough credits for this action.';
  }
  if (kind === 'network') return "Couldn't reach the simulator — check your connection and try again.";
  return `The ${fallback} couldn't be generated. Try again.`;
};

/** Derive the canon phase enum for a save entry, analytics-only. */
const canonPhaseOf = (entry) => (isCanonSave(entry) ? 'canon' : 'draft');

/**
 * Fire AI_VERIFIER_REPORT from an overlay verification result. Counters are
 * read verbatim from the verifier summary (counts only — never entity names).
 */
const reportVerifier = (type, verification) => {
  const s = verification?.summary || {};
  const hardCount = (s.invented || 0) + (s.renamed || 0) + (s.contradicted || 0) + (s.canonChanged || 0);
  track(EVENTS.AI_VERIFIER_REPORT, {
    type: aiTypeEnum(type),
    ok: !!verification?.ok,
    invented: s.invented || 0,
    removed: s.removed || 0,
    renamed: s.renamed || 0,
    contradicted: s.contradicted || 0,
    canon_changed: s.canonChanged || 0,
    history_dropped: s.historyDropped || 0,
    hard_violation_count: hardCount,
  });
};

// §8 M3c — compact, weighted Chronicle context (recent + party-caused events)
// sent to the AI overlay + Daily Life so prose can reference what's been
// happening. PII-free; the edge function leans on it as grounding.
function buildChronicleContextFromSave(saveEntry, settlement) {
  try {
    if (!saveEntry) return null;
    const cs = saveEntry.campaignState || {};
    const feed = buildChronicleFeed({
      manual: cs.eventLog,
      worldPulse: cs.worldPulse?.events,
      worldLog: cs.worldState?.eventLog,
      recent: settlement?.recentEvents || saveEntry.settlement?.recentEvents,
    }, { limit: 40, reference: cs.worldState?.canonizedAt || cs.canonizedAt || null });
    const items = selectChronicleContext(feed, { limit: 8 });
    return items.length ? { items } : null;
  } catch {
    return null;
  }
}

/**
 * Build the ai_data blob to persist on a saved settlement.
 * Preserves chronicle/pinnedNpcs across updates.
 */
function buildAiDataBlob(existing, patch) {
  const prev = existing || {};
  return {
    aiSettlement:         patch.aiSettlement !== undefined ? patch.aiSettlement : (prev.aiSettlement || null),
    aiDailyLife:          patch.aiDailyLife  !== undefined ? patch.aiDailyLife  : (prev.aiDailyLife  || null),
    narrativeMode:        patch.narrativeMode        || prev.narrativeMode        || 'raw',
    narrativeGeneratedAt: patch.narrativeGeneratedAt !== undefined ? patch.narrativeGeneratedAt : (prev.narrativeGeneratedAt || null),
    narrativeSourceFingerprint: patch.narrativeSourceFingerprint !== undefined
      ? patch.narrativeSourceFingerprint
      : (prev.narrativeSourceFingerprint || null),
    chronicle:            Array.isArray(prev.chronicle)  ? prev.chronicle  : [],
    pinnedNpcs:           Array.isArray(prev.pinnedNpcs) ? prev.pinnedNpcs : [],
    dossierNotes:         patch.dossierNotes !== undefined
      ? patch.dossierNotes
      : (prev.dossierNotes && typeof prev.dossierNotes === 'object' ? prev.dossierNotes : null),
  };
}

const NARRATIVE_FIELD_LABELS = {
  thesis:                         'Writing the settlement\u2019s identity',
  institutions:                   'Polishing institution descriptions',
  'powerStructure.factions':      'Reweaving faction blurbs',
  npcs:                           'Voicing the NPCs',
  stress:                         'Grounding the stressors',
  'powerStructure.conflicts':     'Sharpening the conflicts',
  history:                        'Retelling the past',
  economicViability:              'Rethinking the economy',
  identityMarkers:                'Marking signature details',
  frictionPoints:                 'Surfacing local grievances',
  connectionsMap:                 'Mapping the political web',
  dmCompass:                      'Drafting DM guidance',
};
const DAILY_LIFE_FIELD_LABELS = {
  dawn:    'Lighting the dawn',
  morning: 'Opening the market',
  midday:  'Gathering for midday',
  evening: 'Filling the tavern',
  night:   'Walking the night watch',
};
const ROTATING_MSGS = [
  'Summoning the scribes\u2026',
  'Consulting the archives\u2026',
  'Weaving the threads\u2026',
  'Polishing the prose\u2026',
  'Almost there\u2026',
];

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
  aiViolations:     null,   // verifier report (null when no overlay committed)

  // ── Actions ────────────────────────────────────────────────────────────────
  setAiSettlement: (aiData) =>
    set(state => {
      // Run the canon-preservation verifier against the
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
      state.aiSettlement = null;
      state.aiDailyLife = null;
      state.aiDataVersion = null;
      state.aiSourceFingerprint = null;
      state.aiPartialFailure = null;
      state.aiViolations = null;
    }),

  /** Dismiss the violations notice without clearing the AI settlement
   *  itself. Used by the AiOverlayViolations card's close button.
   *  Violations resurface if a subsequent generation flags drift. */
  clearAiViolations: () =>
    set(state => { state.aiViolations = null; }),

  setAiDailyLife: (prose) =>
    set(state => { state.aiDailyLife = prose; }),

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

    // Snapshot which save is on screen now. The global narrative view is only
    // committed on success if THIS save is still the active one — the user may
    // switch settlements (hydrateFromSave flips activeSaveId) during the long
    // generate call, and one settlement's prose must not bleed onto another.
    const requestedActiveSaveId = get().activeSaveId;

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

    set(state => {
      state.aiLoading = true;
      state.aiRegenerating = isRegenerate;
      state.aiError = null;
      state.aiProgress = ROTATING_MSGS[0];
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
      rotIdx = (rotIdx + 1) % ROTATING_MSGS.length;
      set(state => { state.aiProgress = ROTATING_MSGS[rotIdx]; });
    }, 2500);

    const totalFields = Object.keys(NARRATIVE_FIELD_LABELS).length;
    let fieldsDone = 0;

    // Write dotted paths ("powerStructure.factions") into nested objects. The
    // field name comes from the (untrusted) stream, so reject any segment that
    // would walk the prototype chain (__proto__/constructor/prototype) before
    // descending — a crafted path must not pollute Object.prototype.
    const setNestedPath = (root, path, value) => {
      const keys = path.split('.');
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
      const { result, dailyLife, creditsRemaining, partialFailure, failedFields } =
        await generateNarrative('narrative', settlement, saveId, {
          pinnedNpcIds,
          aiGuidance,
          chronicleContext: buildChronicleContextFromSave(saveEntry, settlement),
          onField(fieldName, value, error) {
            // Daily-life beats stream as `dailyLife.<beat>` because the
            // narrative run now folds in daily life under the single spend.
            // Route them into aiDailyLife state (progressive fill-in mirrors
            // the old standalone daily-life flow); progress shows the
            // daily-life label set rather than the narrative field counter.
            if (typeof fieldName === 'string' && fieldName.startsWith('dailyLife.')) {
              const beat = fieldName.slice('dailyLife.'.length);
              // Defense in depth: ai.js already drops dangerous beats before
              // forwarding, but the beat name is untrusted server input, so the
              // consumer refuses to act on a prototype-walking key too — neither
              // layer writes __proto__/constructor/prototype into aiDailyLife.
              if (beat === '__proto__' || beat === 'constructor' || beat === 'prototype') return;
              lastFieldMsg = true;
              if (error) {
                set(state => { state.aiProgress = `\u26a0 ${beat} fell back to raw`; });
                return;
              }
              const dlLabel = DAILY_LIFE_FIELD_LABELS[beat] || `Writing ${beat}`;
              set(state => {
                if (!isRegenerate
                  && (get().activeSaveId === saveId || get().activeSaveId === requestedActiveSaveId)) {
                  state.aiDailyLife = { ...(state.aiDailyLife || {}), [beat]: value };
                }
                state.aiProgress = `${dlLabel}\u2026`;
              });
              return;
            }

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
              // Guard the global streamed write on the active save: a mid-stream
              // settlement switch must not bleed this run's partial prose into the
              // now-open settlement (the final commit is already activeSaveId-guarded).
              const onScreen = get().activeSaveId === saveId || get().activeSaveId === requestedActiveSaveId;
              if (!isRegenerate && onScreen) {
                if (!state.aiSettlement) state.aiSettlement = {};
                setNestedPath(state.aiSettlement, fieldName, value);
              }
              state.aiProgress = `${label}\u2026 (${fieldsDone}/${totalFields})`;
            });
          },
        });

      const sourceFingerprint = settlementFingerprint(settlement);

      // Verify the final atomic result against the source
      // settlement so UI surfaces (and the upcoming PDF appendix) can
      // show violation warnings.
      const verificationN = runOverlayVerifier(settlement, result);
      logHardViolations(verificationN, 'requestNarrative');

      // The user may have switched settlements while this long call was in
      // flight (hydrateFromSave flips activeSaveId). Only write the global
      // narrative view if THIS save is still the one on screen — otherwise
      // one settlement's prose bleeds onto another. Credit balance, loading
      // flags, and the engagement counter are settlement-agnostic, so they
      // commit regardless. A null activeSaveId (no detail view tracking)
      // matches its start value, so the write proceeds as before.
      const currentActiveSaveId = get().activeSaveId;
      const stillActive = currentActiveSaveId === saveId
        || currentActiveSaveId === requestedActiveSaveId;

      set(state => {
        if (stillActive) {
          state.aiSettlement = result;
          // Daily life is folded into the narrative run — commit the bundled
          // beats as the authoritative aiDailyLife so the DailyLifeTab shows
          // prose after a single narrate action. A null means every beat failed
          // (partial run); keep whatever the progressive stream already set.
          if (dailyLife && typeof dailyLife === 'object') {
            state.aiDailyLife = dailyLife;
          }
          state.aiDataVersion = Date.now();
          state.aiSourceFingerprint = sourceFingerprint;
          state.showNarrative = true;
          state.aiPartialFailure = partialFailure ? { failedFields: failedFields || [] } : null;
          state.aiViolations = verificationN;
        }
        state.aiLoading = false;
        state.aiRegenerating = false;
        state.aiProgress = '';
        if (typeof creditsRemaining === 'number') state.creditBalance = creditsRemaining;
        // Reader-audience signal: a successful narrate run is the
        // "I'm coming back to use this" behaviour useReaderAudience keys on.
        // Bumped here on the success path (the server-authoritative spend has
        // just landed) rather than from the never-called spendCredits action.
        state.lifetimeNarrateCount = (state.lifetimeNarrateCount || 0) + 1;
      });

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

      // Persist the refined narrative + mode flip to the saved settlement.
      // Generation succeeded — don't let a persist error lose what the user just paid for.
      try {
        const existingEntry = get().savedSettlements.find(s => s.id === saveId);
        // Persist the daily-life bundle this run produced. Prefer the locally
        // bundled `dailyLife` over `get().aiDailyLife`: if the user switched
        // settlements mid-generation, global state now holds the OTHER save's
        // prose, which must not bleed onto this save's ai_data.
        const persistedDailyLife = (dailyLife && typeof dailyLife === 'object')
          ? dailyLife
          : (stillActive ? get().aiDailyLife : (existingEntry?.aiData?.aiDailyLife || null));
        const aiData = buildAiDataBlob(existingEntry?.aiData, {
          aiSettlement:         result,
          aiDailyLife:          persistedDailyLife,
          narrativeMode:        'narrated',
          narrativeGeneratedAt: new Date().toISOString(),
          narrativeSourceFingerprint: sourceFingerprint,
        });
        await savesService.update(saveId, { aiData });
        get().updateSavedSettlement(saveId, { aiData });
      } catch (persistErr) {
        console.error('Failed to persist narrative to save:', persistErr);
        set(state => { state.aiError = 'Narrative generated but save failed. It may not persist across sessions.'; });
      }

      // Chronicle: after a successful generation, append an entry logging this
      // run. Tier-based rotation handled inside _appendChronicleEntry.
      // Non-fatal on failure — the narrative itself is already persisted above.
      try {
        await get()._appendChronicleEntry(saveId, {
          reason: isRegenerate ? 'regenerate' : 'initial',
          // Thread THIS run's prose so a mid-generation settlement switch can't
          // snapshot the now-active settlement's narrative under this save. The
          // run's OWN bundled daily life — never the live view, which may now
          // belong to another save.
          aiSettlement: result,
          aiDailyLife:  (dailyLife && typeof dailyLife === 'object') ? dailyLife : null,
        });
      } catch (chronErr) {
        console.error('Chronicle append failed:', chronErr);
      }
    } catch (e) {
      set(state => {
        state.aiError = friendlyAiError(e, 'narrative layer');
        state.aiLoading = false;
        state.aiRegenerating = false;
        state.aiProgress = '';
        // On failure during regenerate, keep the old aiSettlement intact.
        // On first-time failure, it was already null.
      });
      track(EVENTS.AI_GENERATION_FAILED, { type: 'narrative', error_kind: errorKindFromError(e) });
    } finally {
      clearInterval(rotation);
    }
  },

  /**
   * Progress the AI narrative against a specific structural edit.
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

    // See requestNarrative: snapshot the on-screen save so the global view is
    // only written on success if the user hasn't switched settlements during
    // the long generate call.
    const requestedActiveSaveId = get().activeSaveId;

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

    // Progression is always "regenerate-shaped": keep old aiSettlement
    // rendering (dimmed) until the new one is ready to swap in.
    set(state => {
      state.aiLoading = true;
      state.aiRegenerating = true;
      state.aiError = null;
      state.aiProgress = ROTATING_MSGS[0];
      state.aiPartialFailure = null;
    });

    let rotIdx = 0;
    let lastFieldMsg = false;
    const rotation = setInterval(() => {
      const st = get();
      if (!st.aiLoading) return;
      if (lastFieldMsg) return;
      rotIdx = (rotIdx + 1) % ROTATING_MSGS.length;
      set(state => { state.aiProgress = ROTATING_MSGS[rotIdx]; });
    }, 2500);

    const pinnedNpcIds = Array.isArray(saveEntry?.aiData?.pinnedNpcs)
      ? saveEntry.aiData.pinnedNpcs
      : [];

    let fieldsDone = 0;

    try {
      const { result, creditsRemaining, partialFailure, failedFields } =
        await generateNarrative('progression', settlement, saveId, {
          pinnedNpcIds,
          changeType,
          changeLabel,
          aiGuidance,
          priorNarrative: aiSettlement,
          priorDailyLife: aiDailyLife,
          onField(fieldName, value, error) {
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

      const sourceFingerprint = settlementFingerprint(settlement);

      // Verify the evolved narrative against the source
      // settlement (progression v1 only refines existing prose).
      const verificationP = runOverlayVerifier(settlement, result);
      logHardViolations(verificationP, 'requestProgression');

      // Only write the global narrative view if THIS save is still on screen —
      // the user may have switched settlements mid-generation (activeSaveId
      // flipped via hydrateFromSave). Credit balance, loading flags, and the
      // engagement counter commit regardless.
      const currentActiveSaveId = get().activeSaveId;
      const stillActive = currentActiveSaveId === saveId
        || currentActiveSaveId === requestedActiveSaveId;

      set(state => {
        if (stillActive) {
          state.aiSettlement = result;
          state.aiDataVersion = Date.now();
          state.aiSourceFingerprint = sourceFingerprint;
          state.showNarrative = true;
          state.aiPartialFailure = partialFailure ? { failedFields: failedFields || [] } : null;
          state.aiViolations = verificationP;
        }
        state.aiLoading = false;
        state.aiRegenerating = false;
        state.aiProgress = '';
        if (typeof creditsRemaining === 'number') state.creditBalance = creditsRemaining;
        // Reader-audience signal: see requestNarrative — a paid
        // progression run is the same return-engagement signal.
        state.lifetimeNarrateCount = (state.lifetimeNarrateCount || 0) + 1;
      });

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
      try {
        const existingEntry = get().savedSettlements.find(s => s.id === saveId);
        // Carry through the daily life captured when this run began, not the
        // live `get().aiDailyLife`: if the user switched settlements
        // mid-generation, global state now holds the OTHER save's prose.
        const persistedDailyLife = stillActive
          ? get().aiDailyLife
          : (aiDailyLife ?? existingEntry?.aiData?.aiDailyLife ?? null);
        const aiData = buildAiDataBlob(existingEntry?.aiData, {
          aiSettlement:         result,
          aiDailyLife:          persistedDailyLife,
          narrativeMode:        'narrated',
          narrativeGeneratedAt: new Date().toISOString(),
          narrativeSourceFingerprint: sourceFingerprint,
        });
        await savesService.update(saveId, { aiData });
        get().updateSavedSettlement(saveId, { aiData });
      } catch (persistErr) {
        console.error('Failed to persist progression to save:', persistErr);
        set(state => { state.aiError = 'Progression generated but save failed. It may not persist across sessions.'; });
      }

      // Chronicle: record the progression with its human-readable trigger so
      // the DM can trace which edit drove which evolution.
      try {
        await get()._appendChronicleEntry(saveId, {
          reason: 'progression',
          triggeredBy: typeof changeLabel === 'string' && changeLabel ? changeLabel : null,
          // Thread THIS run's prose; progression carries daily life through
          // unchanged (the bundle captured when the run began), never the live
          // view, which a mid-call settlement switch may have replaced.
          aiSettlement: result,
          aiDailyLife:  aiDailyLife ?? null,
        });
      } catch (chronErr) {
        console.error('Chronicle append (progression) failed:', chronErr);
      }
    } catch (e) {
      set(state => {
        state.aiError = friendlyAiError(e, 'progression');
        state.aiLoading = false;
        state.aiRegenerating = false;
        state.aiProgress = '';
        // Old aiSettlement stays intact — the user didn't lose anything.
      });
      track(EVENTS.AI_GENERATION_FAILED, { type: 'progression', error_kind: errorKindFromError(e) });
    } finally {
      clearInterval(rotation);
    }
  },

  /**
   * Internal: append a chronicle entry to the saved settlement's ai_data.
   *
   * Called on narrative generation success (initial/regenerate/progression)
   * and on revert-to-raw.
   *
   * Source prose: a generation run produces the prose for THIS saveId, but the
   * user may switch settlements mid-call (hydrateFromSave flips activeSaveId),
   * leaving the live `aiSettlement`/`aiDailyLife` holding the OTHER save's view.
   * So the long-running callers thread the run's OWN result through
   * `opts.aiSettlement`/`opts.aiDailyLife`; only revert (which snapshots the
   * still-live view synchronously, before nulling it) falls back to store state.
   * When no source is threaded, the live view is only trusted if it belongs to
   * this save (`activeSaveId === saveId`) so a non-active write can't bleed.
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
   * @param {object} [opts]
   * @param {'initial'|'regenerate'|'progression'|'revert'} [opts.reason='initial']
   * @param {string|null} [opts.triggeredBy]
   * @param {'full'|'summary'} [opts.mode='full']
   * @param {object|null} [opts.aiSettlement] - this run's own refined prose; threaded
   *   by long-running callers so a mid-call settlement switch can't snapshot the
   *   wrong save. Omit to fall back to the active-save live view.
   * @param {object|null} [opts.aiDailyLife]  - this run's own daily-life bundle.
   */
  _appendChronicleEntry: async (
    saveId,
    { reason = 'initial', triggeredBy = null, mode = 'full', aiSettlement, aiDailyLife } = {},
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
    // save's chronicle.
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

    try { await savesService.update(saveId, { aiData: nextAiData }); }
    catch (e) { console.error('Failed to persist chronicle entry:', e); }
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
    try {
      await savesService.update(saveId, { aiData: nextAiData });
    } catch (e) {
      console.error('Failed to persist dossier notes:', e);
      throw e;
    }
    return dossierNotes;
  },

  // ── Pinned NPCs ───────────────────────────────────────────────────────────
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
   * pinned. Persists through savesService; a persist failure is logged but
   * leaves the in-memory pin in place (same policy as cosmetic rename).
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
    try { await savesService.update(saveId, { aiData: nextAiData }); }
    catch (e) { console.error('Failed to persist pinNpc:', e); }
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
    try { await savesService.update(saveId, { aiData: nextAiData }); }
    catch (e) { console.error('Failed to persist unpinNpc:', e); }
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
    });
  },

  /**
   * Apply a cosmetic rename (NPC, faction, or settlement name) through every
   * string leaf of the save's ai_data blob. Safe no-op when the save has no
   * narrative yet. Persists through to Supabase and mirrors the change into
   * both the savedSettlements entry and (if it's the currently viewed save)
   * the in-session aiSettlement/aiDailyLife state.
   *
   * This is the cosmetic tier of the change classifier — mechanical
   * substitution is semantically safe, no credit spend, no user confirm.
   */
  applyCosmeticRename: async ({ saveId, oldName, newName }) => {
    if (!saveId || !oldName || oldName === newName) return;
    const state = get();
    const entry = state.savedSettlements.find(s => s.id === saveId);
    if (!entry) return;

    const nextAiData = applyRenameToAiData(entry.aiData, oldName, newName);
    // If nothing changed (no narrative, or the name didn't appear anywhere),
    // skip the network round-trip.
    if (nextAiData === entry.aiData) return;

    // Update the session view first if this is the active save — keeps the
    // UI responsive even if the persist round-trip takes a moment. Guard on the
    // rename TARGETING the active save: `aiSettlement || aiDailyLife` alone is
    // too broad — renaming a NON-active save while another save's narrative is
    // on screen would otherwise overwrite the on-screen prose with this save's.
    const targetsActiveSave = state.activeSaveId === saveId
      && (state.aiSettlement || state.aiDailyLife);
    if (targetsActiveSave) {
      set(s => {
        if (nextAiData.aiSettlement) s.aiSettlement = nextAiData.aiSettlement;
        if (nextAiData.aiDailyLife)  s.aiDailyLife  = nextAiData.aiDailyLife;
      });
    }
    get().updateSavedSettlement(saveId, { aiData: nextAiData });

    try {
      await savesService.update(saveId, { aiData: nextAiData });
    } catch (e) {
      console.error('Failed to persist cosmetic rename to ai_data:', e);
      // Non-fatal: in-memory state is correct, next save-triggered update
      // will retry. We don't surface an aiError because the rename DID
      // succeed from the user's perspective — only the cross-session
      // persistence is at risk.
    }
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

    // Snapshot the on-screen save at entry. We only blank the GLOBAL narrative
    // view if THIS save is the one on screen — reverting a non-active save must
    // not wipe another settlement's prose from the display. The captured value
    // lets a null-tracking (no detail view) entry still clear as before. The
    // persisted raw aiData write to the target always happens.
    const requestedActiveSaveId = get().activeSaveId;

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
    set(state => {
      // Only blank the on-screen view if the reverted save is still the one
      // displayed. A null activeSaveId (no detail-view tracking) matches its
      // entry value, so the clear proceeds as before.
      const stillActive = state.activeSaveId === saveId
        || (requestedActiveSaveId == null && state.activeSaveId == null);
      if (stillActive) {
        state.aiSettlement     = null;
        state.aiDailyLife      = null;
        state.aiDataVersion    = null;
        state.aiSourceFingerprint = null;
        state.showNarrative    = false;
        state.aiPartialFailure = null;
        state.aiError          = null;
      }
    });
    try {
      await savesService.update(saveId, { aiData });
      get().updateSavedSettlement(saveId, { aiData });
    } catch (e) {
      console.error('Failed to persist revert-to-raw:', e);
      set(state => { state.aiError = 'Reverted in view but save failed. It may persist on reload.'; });
    }
  },
});
