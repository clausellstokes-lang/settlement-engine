/**
 * settlementRegenAction.js — SECTION REGENERATION (NPCs, history), lifted out of the slice.
 *
 * The store keeps the action KEY (`regenSection`) on its literal and delegates the body here
 * through a dynamic import, the established idiom (`settlementGenerateAction.js`'s header:
 * "the store keeps the action KEY on its literal and delegates the body here through a dynamic
 * import … so the eager first-paint closure no longer carries the lane"), so the
 * operation-registry walker still sees the action and the eager closure carries neither this
 * body nor the engine service's await (ENGINE-5 unit 1, the chair's ruling).
 *
 * ⭐ WHAT MOVED AND WHAT DID NOT. The body is the slice's old `regenSection` verbatim except for
 * ONE seam: the two regeneration passes (`regenNPCsPipeline`, `regenHistoryPipeline`) are
 * reached through the local engine seam's pipeline door (`lib/localPipeline.js`) with the build
 * flag off, and through engine-generate's `regenSection` op with it on
 * (`engineRemote.js :: runRemoteRegenSection`), where the service runs those same two functions
 * from the engine bundle and answers their return value verbatim. No local engine runs in a
 * flagged build, and nothing remote runs in an unflagged one (the flag is read as the generation
 * client reads it, so a flag-off regeneration fetches no service chunk).
 *
 * ⭐ THE RE-DERIVATION HALF OF THE CREATE BOUNDARY LIVES HERE NOW. A section regeneration reads
 * the world's OWN config first (`settlement.config || config`) and mints no law
 * (`tests/lint/densityCreateBoundary.walker.test.js` holds this module to both facts).
 */

import { makeActionResult } from './actionResult.js';
import { refusalOf } from '../lib/refusalReasons.js';
import { engineRefusalReason, ENGINE_REFUSAL_REASONS } from '../lib/engineRefusal.js';

/** The reasons this lane may record (engineRefusal.js), as a set. */
const ENGINE_REASONS = new Set(ENGINE_REFUSAL_REASONS);
import {
  cloneJson, persistSaveUpdate, pickleCampaignState, sectionLocked, foldRegeneratedRoster,
} from './settlementSliceHelpers.js';

/**
 * The slice state this body reads and writes: a structural view (the store holds more).
 * @typedef {Record<string, unknown> & { config?: Record<string, unknown>, history?: unknown, _regenSeed?: unknown }} RegenSettlement
 * @typedef {{
 *   settlement: RegenSettlement | null,
 *   config: Record<string, unknown>,
 *   locks: Record<string, unknown> | null | undefined,
 *   phase?: string,
 *   sessionRegenCount?: number,
 *   auth?: { tier?: string } | null,
 *   activeSaveId?: string | number | null,
 *   editedAt?: string,
 *   lastRegenerationDelta?: unknown,
 *   setActivePricingMoment: (content: unknown) => void,
 *   updateSavedSettlement?: (id: string | number, partial: Record<string, unknown>) => void,
 * }} RegenState
 * @typedef {(recipe: (draft: RegenState) => void) => void} RegenSet
 * @typedef {() => RegenState} RegenGet
 * @typedef {typeof import('../generators/generateSettlementPipeline.js')} PipelineModule
 * @typedef {{ preserved?: Array<{ id?: string, fromId?: string, name?: string }> } | null | undefined} PreservationReport
 */

/**
 * The regeneration-time module bag: the two passes, through the local engine seam.
 * @type {?Promise<{ regenNPCsPipeline: PipelineModule['regenNPCsPipeline'], regenHistoryPipeline: PipelineModule['regenHistoryPipeline'] }>}
 */
let _enginePromise = null;
function loadEngine() {
  // Through the local engine seam's pipeline door (ENGINE-3 unit 2), which a VITE_ENGINE_REMOTE
  // build resolves to its refusing twin; that build never reaches this loader (the remote branch
  // below takes the regeneration first).
  return (_enginePromise ||= import('../lib/localPipeline.js')
    .then((seam) => seam.loadLocalPipeline())
    .then((pipe) => ({
      regenNPCsPipeline: pipe.regenNPCsPipeline,
      regenHistoryPipeline: pipe.regenHistoryPipeline,
    })));
}

/**
 * The engine service's build flag, `engineRemote.js :: engineRemoteOpen`'s rule (closed unless
 * VITE_ENGINE_REMOTE is exactly 'true'), spelled as `generationClient.js :: remoteFlagOpen`
 * spells it, so a flag-off regeneration fetches no engine-service chunk at all.
 * @returns {boolean}
 */
function remoteFlagOpen() {
  const env = /** @type {{ VITE_ENGINE_REMOTE?: unknown } | undefined} */ (import.meta.env);
  return Boolean(env) && env?.VITE_ENGINE_REMOTE === 'true';
}

/**
 * One section's regeneration parts from the engine service: the pass's own return value, which
 * engine-generate's `regenSection` op runs from the engine bundle and answers verbatim.
 *
 * @param {'npcs'|'history'} section
 * @param {RegenSettlement} settlement
 * @param {Record<string, unknown>} cfg
 * @param {unknown} locks
 * @param {import('../lib/engineRemote.js').RemoteOptions} [remoteOptions] the transport's seams (tests)
 * @returns {Promise<Record<string, unknown>>}
 */
async function remoteRegenParts(section, settlement, cfg, locks, remoteOptions) {
  const { runRemoteRegenSection } = await import('../lib/engineRemote.js');
  return runRemoteRegenSection(
    { section, settlement, config: cfg, ...(section === 'npcs' ? { locks } : {}) }, remoteOptions,
  );
}

/**
 * The service's remote pass, with its NAMED failures recorded (remote-path R3): a limit, an
 * unreachable service or a retired version is put on the store as its own refusal (unkeyed, so
 * the dossier's notice says it), then the rejection goes on exactly as before.
 * @param {(fn: (s: any) => void) => void} set
 * @param {'npcs'|'history'} section
 * @param {RegenSettlement} settlement
 * @param {Record<string, unknown>} cfg
 * @param {unknown} locks
 * @param {import('../lib/engineRemote.js').RemoteOptions} [remoteOptions]
 * @returns {Promise<Record<string, unknown>>}
 */
async function remoteRegenPartsSaid(set, section, settlement, cfg, locks, remoteOptions) {
  try {
    const parts = await remoteRegenParts(section, settlement, cfg, locks, remoteOptions);
    // A SUCCESS CLEARS THE FAILURE THIS LANE RECORDED (remote-path FU-2, the review's F2): the
    // record is unkeyed, so every surface says it, and it must not outlive the reroll that
    // cured it. Only this lane's own kind of record is cleared (an unkeyed engine reason); a
    // refusal another lane raised, or one keyed to a surface, is left exactly as it was.
    set((s) => {
      const said = s.lastRefusal;
      if (said && !said.at && ENGINE_REASONS.has(said.reason)) s.lastRefusal = null;
    });
    return parts;
  } catch (error) {
    const reason = engineRefusalReason(/** @type {{ code?: unknown }} */ (error)?.code);
    if (reason) set((s) => { s.lastRefusal = refusalOf(reason); });
    throw error;
  }
}

/**
 * THE SECTION REGENERATION, the slice's `regenSection` body.
 *
 * Async — same reason as generateSettlement (lazy engine load).
 * Tier 5.1: every regenerate computes a structured delta against the prior settlement so the
 * UI's RegenerationDeltaCard can show what changed. The delta is lazy-imported to keep its
 * transitive domain modules out of the cold-start chunk.
 *
 * @param {RegenSet} set the slice's immer `set`
 * @param {RegenGet} get the slice's `get`
 * @param {string} section 'npcs' | 'history' (any other value regenerates nothing)
 * @param {{ remote?: boolean, remoteOptions?: import('../lib/engineRemote.js').RemoteOptions }} [opts]
 *   `remote` defaults to the build flag; `remoteOptions` are the transport's seams (both for tests)
 * @returns {Promise<unknown>}
 */
export async function regenSectionAction(set, get, section, { remote = remoteFlagOpen(), remoteOptions } = {}) {
  const state = get();
  const { settlement, config, locks } = state;
  if (!settlement) return;
  // LOCKS ENGINE Phase A — a whole-section lock was the user's standing "do not
  // reroll this", and this was the typed refusal behind the disabled button.
  // ⛔ DORMANT since owner order 2026-09-17 ("remove the other padlocks"): the
  // controls and the store's `setLock` writer are retired, and `sectionLocked`
  // reads the honoured view (domain/locksPreservation.js normalizeLocks), which
  // reads no lock, so a `section_locked` refusal cannot fire. The call stays as the
  // one seat a veto re-arms. Refusal-only envelope, the updateSavedSettlement shape.
  if (sectionLocked(locks, section)) return makeActionResult('regenSection', { ok: false, before: { reason: 'section_locked', section } });
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
  set((s) => { s.sessionRegenCount = (s.sessionRegenCount || 0) + 1; });
  if ((state.sessionRegenCount || 0) + 1 === 5) {
    import('../lib/pricingMoments.js').then(({ triggerPricingMoment }) => {
      triggerPricingMoment('regen_burst', (/** @type {unknown} */ content) => {
        get().setActivePricingMoment(content);
      }, { tier: state.auth?.tier });
    }).catch(() => { /* never block a regen */ });
  }
  const cfg = settlement.config || config;
  // The local bag is loaded where the slice loaded it (before the analytics fire) and its
  // passes are called synchronously as they were, so a flag-off regeneration keeps its order of
  // effects; a flagged build loads no local bag and awaits the service instead.
  const eng = remote ? null : await loadEngine();

  // Analytics — fire-and-forget. A section regen re-rolls one subsystem
  // under the existing config (so config is, by construction, unchanged).
  import('../lib/analytics.js').then(({ track, EVENTS }) => {
    track(EVENTS.REGENERATION_TRIGGERED, { regen_mode: section, config_changed: false });
  }).catch(() => {});

  // Capture the pre-regen snapshot before mutation so the delta
  // composer has a clean `before` reference.
  const before = cloneJson(settlement);

  if (section === 'npcs') {
    // `_preservation` is the pipeline's report, carried OUT OF BAND of the parts
    // (it must never land in the settlement blob) and destructured off here. A
    // locked keeper INHERITS the id of the slot it took over, so EVERY npc-id-keyed
    // map has to be rewritten in the same step that folds the roster in —
    // otherwise each one silently follows the stranger who got the old id on the
    // next reroll. foldRegeneratedRoster owns all the writes (roster, `locks`, the
    // save row's `aiData.pinnedNpcs`, and the owning campaign's
    // `worldState.npcStates` + npcLedger originRefs) so they can never disagree.
    /** @type {Record<string, unknown>} */
    const result = eng
      ? eng.regenNPCsPipeline(settlement, cfg, { locks })
      : await remoteRegenPartsSaid(set, 'npcs', settlement, cfg, locks, remoteOptions);
    const { _preservation, ...parts } = result;
    await foldRegeneratedRoster(get, set, parts, /** @type {PreservationReport} */ (_preservation));
  } else if (section === 'history') {
    // This branch still assigns the whole history object, but the pipeline now
    // carries the parts a reroll has no business discarding, so the assignment
    // is no longer lossy in the ways recorded here before:
    //   • the campaignEra entries worldPulse appended are carried by
    //     campaignEventId (domain/historyPreservation.js),
    //   • the coherence tail assembly runs now runs here too, so
    //     siegeNarrative / legacyAnnotations are minted and
    //     historicalCharacter is real prose rather than the generator's stub
    //     (generators/narrative/historyCoherence.js), and
    //   • authored settlement-root `history.*` paths are re-applied, so the
    //     "Edited" badge no longer sits over regenerated text.
    // All three live in the pipeline rather than here: the pipeline already holds
    // the settlement it needs to read the previous history from.
    //
    // DELIBERATELY DEFERRED — documented, not a bug to re-find. Authored
    // ENTRIES inside historicalEvents[] / currentTensions[] still reroll away.
    // The NPC fix does not transfer to them: they carry no id and no
    // provenance marker, so there is nothing to preserve them BY
    // (regenerationMode's `history_beat` rule covers the seven DERIVED
    // summaries in explanation.js, not these arrays, and lookupTagForEntity
    // has no branch for them, so it tags every one 'generated'/'draft' and
    // both canon-aware modes preserve nothing). Curing that needs an identity
    // scheme minted for the purpose — an owner decision, not oversight.
    //
    // THE SEED FOLD [generators-pipeline-5, closed 2026-07-30]. The pipeline now
    // returns settlement-ROOT parts, exactly like the npcs branch above, so the
    // seed it minted lands at the settlement root and a persisted history reroll
    // is replayable (`regenHistoryPipeline(settlement, cfg, { seed: _regenSeed })`).
    // Root, never `history._regenSeed`: the DM-share gallery strip is a top-level
    // KEY list (migration 121 + publicSafe.js), so only the root spelling is
    // covered, and the history blob stays shape-identical to a generated one.
    /** @type {Record<string, unknown>} */
    const result = eng
      ? eng.regenHistoryPipeline(settlement, cfg)
      : await remoteRegenPartsSaid(set, 'history', settlement, cfg, locks, remoteOptions);
    const { history, _regenSeed } = result;
    set((s) => {
      const draft = /** @type {RegenSettlement} */ (s.settlement);
      draft.history = history; draft._regenSeed = _regenSeed;
    });
  }

  // Compute the delta against the post-regen settlement.
  try {
    const { deriveRegenerationDelta } = await import('../domain/regenerationDelta.js');
    const after = get().settlement;
    const delta = deriveRegenerationDelta(before, after);
    set((s) => { s.lastRegenerationDelta = delta; });
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
    set((s) => { s.editedAt = now; });
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
}
