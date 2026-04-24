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
import { CREDIT_COSTS } from './creditsSlice.js';
import { CHRONICLE_LIMITS, createChronicleEntry, appendChronicleEntry } from '../lib/chronicle.js';

/**
 * Build the ai_data blob to persist on a saved settlement.
 * Preserves chronicle/pinnedNpcs across updates (populated in AI-3+/AI-4+).
 */
function buildAiDataBlob(existing, patch) {
  const prev = existing || {};
  return {
    aiSettlement:         patch.aiSettlement !== undefined ? patch.aiSettlement : (prev.aiSettlement || null),
    aiDailyLife:          patch.aiDailyLife  !== undefined ? patch.aiDailyLife  : (prev.aiDailyLife  || null),
    narrativeMode:        patch.narrativeMode        || prev.narrativeMode        || 'raw',
    narrativeGeneratedAt: patch.narrativeGeneratedAt !== undefined ? patch.narrativeGeneratedAt : (prev.narrativeGeneratedAt || null),
    chronicle:            Array.isArray(prev.chronicle)  ? prev.chronicle  : [],
    pinnedNpcs:           Array.isArray(prev.pinnedNpcs) ? prev.pinnedNpcs : [],
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

  // ── Actions ────────────────────────────────────────────────────────────────
  setAiSettlement: (aiData) =>
    set(state => {
      state.aiSettlement = aiData;
      state.aiDataVersion = Date.now();
    }),

  clearAiSettlement: () =>
    set(state => {
      state.aiSettlement = null;
      state.aiDailyLife = null;
      state.aiDataVersion = null;
      state.aiPartialFailure = null;
    }),

  setAiDailyLife: (prose) =>
    set(state => { state.aiDailyLife = prose; }),

  setAiLoading: (loading) =>
    set(state => { state.aiLoading = loading; }),

  setAiError: (error) =>
    set(state => { state.aiError = error; }),

  setAiProgress: (msg) =>
    set(state => { state.aiProgress = msg; }),

  toggleNarrativeView: () =>
    set(state => { state.showNarrative = !state.showNarrative; }),

  setShowNarrative: (show) =>
    set(state => { state.showNarrative = show; }),

  /**
   * Check if the current narrative is stale (settlement changed since generation).
   */
  isNarrativeStale: () => {
    const { aiDataVersion, settlement } = get();
    if (!aiDataVersion || !settlement) return true;
    return false;
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

    const isRegenerate = !!aiSettlement;
    const cost = CREDIT_COSTS.narrative;
    const elevated = get().isElevated();
    if (!elevated && creditBalance < cost) {
      set(state => { state.aiError = `Insufficient credits (need ${cost}, have ${state.creditBalance})`; });
      get().setPurchaseModalOpen(true);
      return;
    }

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

    // Write dotted paths ("powerStructure.factions") into nested objects.
    const setNestedPath = (root, path, value) => {
      const keys = path.split('.');
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
    const saveEntry = get().savedSettlements.find(s => s.id === saveId);
    const pinnedNpcIds = Array.isArray(saveEntry?.aiData?.pinnedNpcs)
      ? saveEntry.aiData.pinnedNpcs
      : [];

    try {
      const { result, creditsRemaining, partialFailure, failedFields } =
        await generateNarrative('narrative', settlement, saveId, {
          pinnedNpcIds,
          onField(fieldName, value, error) {
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

      set(state => {
        state.aiSettlement = result;
        state.aiDataVersion = Date.now();
        state.aiLoading = false;
        state.aiRegenerating = false;
        state.aiProgress = '';
        state.showNarrative = true;
        state.aiPartialFailure = partialFailure ? { failedFields: failedFields || [] } : null;
        if (typeof creditsRemaining === 'number') state.creditBalance = creditsRemaining;
      });

      // Persist the refined narrative + mode flip to the saved settlement.
      // Generation succeeded — don't let a persist error lose what the user just paid for.
      try {
        const existingEntry = get().savedSettlements.find(s => s.id === saveId);
        const aiData = buildAiDataBlob(existingEntry?.aiData, {
          aiSettlement:         result,
          aiDailyLife:          get().aiDailyLife,
          narrativeMode:        'narrated',
          narrativeGeneratedAt: new Date().toISOString(),
        });
        await savesService.update(saveId, { aiData });
        get().updateSavedSettlement(saveId, { aiData });
      } catch (persistErr) {
        console.error('Failed to persist narrative to save:', persistErr);
        set(state => { state.aiError = 'Narrative generated but save failed — it may not persist across sessions.'; });
      }

      // Chronicle: after a successful generation, append an entry logging this
      // run. Tier-based rotation handled inside _appendChronicleEntry.
      // Non-fatal on failure — the narrative itself is already persisted above.
      try {
        await get()._appendChronicleEntry(saveId, {
          reason: isRegenerate ? 'regenerate' : 'initial',
        });
      } catch (chronErr) {
        console.error('Chronicle append failed:', chronErr);
      }
    } catch (e) {
      set(state => {
        state.aiError = e.message || 'Narrative generation failed';
        state.aiLoading = false;
        state.aiRegenerating = false;
        state.aiProgress = '';
        // On failure during regenerate, keep the old aiSettlement intact.
        // On first-time failure, it was already null.
      });
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

    const isRegenerate = !!aiDailyLife;
    const cost = CREDIT_COSTS.dailyLife;
    const elevated = get().isElevated();
    if (!elevated && creditBalance < cost) {
      set(state => { state.aiError = `Insufficient credits (need ${cost}, have ${state.creditBalance})`; });
      get().setPurchaseModalOpen(true);
      return;
    }

    set(state => {
      state.aiLoading = true;
      state.aiRegenerating = isRegenerate;
      state.aiError = null;
      state.aiProgress = ROTATING_MSGS[0];
      if (!isRegenerate) state.aiDailyLife = null;
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

    const totalFields = Object.keys(DAILY_LIFE_FIELD_LABELS).length;
    let fieldsDone = 0;

    try {
      const { result, creditsRemaining } = await generateNarrative('dailyLife', settlement, saveId, {
        onField(fieldName, value, error) {
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
      set(state => {
        state.aiDailyLife = result;
        state.aiLoading = false;
        state.aiRegenerating = false;
        state.aiProgress = '';
        if (typeof creditsRemaining === 'number') state.creditBalance = creditsRemaining;
      });

      // Persist daily-life prose to the saved settlement. Mode flips to 'narrated'
      // if either narrative OR daily life exists.
      try {
        const existingEntry = get().savedSettlements.find(s => s.id === saveId);
        const aiData = buildAiDataBlob(existingEntry?.aiData, {
          aiSettlement:         get().aiSettlement,
          aiDailyLife:          result,
          narrativeMode:        'narrated',
          narrativeGeneratedAt: existingEntry?.aiData?.narrativeGeneratedAt || new Date().toISOString(),
        });
        await savesService.update(saveId, { aiData });
        get().updateSavedSettlement(saveId, { aiData });
      } catch (persistErr) {
        console.error('Failed to persist daily-life to save:', persistErr);
        set(state => { state.aiError = 'Daily life generated but save failed — it may not persist across sessions.'; });
      }
    } catch (e) {
      set(state => {
        state.aiError = e.message || 'Daily life generation failed';
        state.aiLoading = false;
        state.aiRegenerating = false;
        state.aiProgress = '';
      });
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

    const cost = CREDIT_COSTS.progression;
    const elevated = get().isElevated();
    if (!elevated && creditBalance < cost) {
      set(state => { state.aiError = `Insufficient credits (need ${cost}, have ${state.creditBalance})`; });
      get().setPurchaseModalOpen(true);
      return;
    }

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

    const saveEntry = get().savedSettlements.find(s => s.id === saveId);
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

      set(state => {
        state.aiSettlement = result;
        state.aiDataVersion = Date.now();
        state.aiLoading = false;
        state.aiRegenerating = false;
        state.aiProgress = '';
        state.showNarrative = true;
        state.aiPartialFailure = partialFailure ? { failedFields: failedFields || [] } : null;
        if (typeof creditsRemaining === 'number') state.creditBalance = creditsRemaining;
      });

      // Persist the evolved narrative. Daily life is carried through
      // unchanged — progression v1 doesn't touch it.
      try {
        const existingEntry = get().savedSettlements.find(s => s.id === saveId);
        const aiData = buildAiDataBlob(existingEntry?.aiData, {
          aiSettlement:         result,
          aiDailyLife:          get().aiDailyLife,
          narrativeMode:        'narrated',
          narrativeGeneratedAt: new Date().toISOString(),
        });
        await savesService.update(saveId, { aiData });
        get().updateSavedSettlement(saveId, { aiData });
      } catch (persistErr) {
        console.error('Failed to persist progression to save:', persistErr);
        set(state => { state.aiError = 'Progression generated but save failed — it may not persist across sessions.'; });
      }

      // Chronicle: record the progression with its human-readable trigger so
      // the DM can trace which edit drove which evolution.
      try {
        await get()._appendChronicleEntry(saveId, {
          reason: 'progression',
          triggeredBy: typeof changeLabel === 'string' && changeLabel ? changeLabel : null,
        });
      } catch (chronErr) {
        console.error('Chronicle append (progression) failed:', chronErr);
      }
    } catch (e) {
      set(state => {
        state.aiError = e.message || 'Progression failed';
        state.aiLoading = false;
        state.aiRegenerating = false;
        state.aiProgress = '';
        // Old aiSettlement stays intact — the user didn't lose anything.
      });
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
   * @param {string} saveId
   * @param {object} opts
   * @param {'initial'|'regenerate'|'progression'|'revert'} opts.reason
   * @param {string|null} [opts.triggeredBy]
   * @param {'full'|'summary'} [opts.mode='full']
   */
  _appendChronicleEntry: async (saveId, { reason, triggeredBy = null, mode = 'full' }) => {
    if (!saveId) return;
    const state = get();
    const entry = state.savedSettlements.find(s => s.id === saveId);
    if (!entry) return;

    const limit = state.isElevated?.() ? CHRONICLE_LIMITS.elevated
                : state.isPremium?.()  ? CHRONICLE_LIMITS.premium
                : CHRONICLE_LIMITS.free;

    const newEntry = createChronicleEntry({
      reason,
      aiSettlement: state.aiSettlement,
      aiDailyLife:  state.aiDailyLife,
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
   * This is the cosmetic tier of the AI-2 change classifier — mechanical
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
    // UI responsive even if the persist round-trip takes a moment.
    if (state.aiSettlement || state.aiDailyLife) {
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
    });
    set(state => {
      state.aiSettlement     = null;
      state.aiDailyLife      = null;
      state.aiDataVersion    = null;
      state.showNarrative    = false;
      state.aiPartialFailure = null;
      state.aiError          = null;
    });
    try {
      await savesService.update(saveId, { aiData });
      get().updateSavedSettlement(saveId, { aiData });
    } catch (e) {
      console.error('Failed to persist revert-to-raw:', e);
      set(state => { state.aiError = 'Reverted in view but save failed — it may persist on reload.'; });
    }
  },
});
