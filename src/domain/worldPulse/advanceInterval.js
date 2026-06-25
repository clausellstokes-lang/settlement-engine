// advanceInterval — the multi-tick orchestrator (Advance-scaling Stage 1-5). An
// Advance is N REAL one-week kernel calls; `simulateCampaignWorldInterval` runs
// `simulateCampaignWorldPulse` (pulseKernel.js) `tickCount` times, threads each
// tick's output into the next, and composes one result with the kernel's shape —
// plus the Stage 3 autoresolve pause/resume state machine and the Stage 5
// history-ring collapse. Imports the kernel + the shared helpers (saveId,
// usableTickInterval); never imported BY the kernel (keeps the chain acyclic).
import { ensureWorldState } from './worldState.js';
import { wallClockNow } from '../clock.js';
import { simulateCampaignWorldPulse } from './pulseKernel.js';
import { saveId, usableTickInterval } from './pulseHelpers.js';

// Advance-scaling Stage 1: an Advance runs N REAL one-week ticks. The interval
// the DM picks is a DURATION, not a single coarse step — `simulateCampaignWorldPulse`
// is already a correct, pure one-week kernel (bumps tick +1, re-seeds its PRNG
// per tick), so N weeks is N kernel calls, ALWAYS at one_week granularity. This
// single-source table is the ONLY place interval → week-count lives.
export const weeksPerInterval = Object.freeze({
  one_week: 1,
  one_month: 4,
  one_season: 12,
  one_year: 48,
});

/**
 * Map a DM-facing interval onto its real one-week tick count (≥1).
 * @param {string} interval
 * @returns {number}
 */
export function ticksForInterval(interval) {
  return /** @type {Record<string, number>} */ (weeksPerInterval)[interval] ?? weeksPerInterval.one_month;
}

/**
 * Advance-scaling Stage 5 — history-ring policy (locked decision #2).
 *
 * Collapse a multi-tick interval's pulseHistory to ONE composed record. The
 * carry-over threads each tick's appended record forward, so a finished N-tick
 * interval lands `[...preInterval, rec_0 … rec_{N-1}]`. We keep the pre-interval
 * records plus ONLY the final tick's record (rec_{N-1}, the authoritative composed
 * end-of-interval beat) and drop the interior beats — they already live in the
 * chronicle / IntervalChronicleSummary, so nothing is lost for the DM.
 *
 * Pure: returns a new worldState (or the input untouched when there is nothing to
 * collapse). The degenerate one_week case (one record appended) slices to a no-op.
 *
 * @param {any} worldState  the final tick's composed worldState
 * @param {number} preIntervalHistoryLen  history length before the interval ran
 * @returns {any}
 */
function collapseIntervalHistory(worldState, preIntervalHistoryLen) {
  const history = Array.isArray(worldState?.pulseHistory) ? worldState.pulseHistory : [];
  const base = Math.max(0, preIntervalHistoryLen);
  // Fewer than two interval records means there is nothing interior to collapse
  // (a single committed tick already wrote exactly one record).
  if (history.length - base <= 1) return worldState;
  const composed = [...history.slice(0, base), history[history.length - 1]];
  return { ...worldState, pulseHistory: composed };
}

/**
 * Fold one tick's settlementUpdates onto the saves that feed the NEXT tick:
 * id-matched replace (last-write-wins), pure (returns a new array). Mirrors the
 * store-side foldSettlementUpdatesOntoSaves so the orchestrator can thread tick
 * outputs into tick inputs without importing the store layer.
 * @param {any[]} saves
 * @param {any[]} [updates]
 * @returns {any[]}
 */
function foldUpdatesOntoSaves(saves, updates) {
  if (!Array.isArray(updates) || updates.length === 0) return saves;
  /** @type {Map<string, any>} */
  const bySaveId = new Map();
  for (const update of updates) {
    if (!update) continue;
    bySaveId.set(String(update.saveId), update.settlement);
  }
  return saves.map((/** @type {any} */ save) => {
    const id = saveId(save);
    if (!bySaveId.has(id)) return save;
    return { ...save, settlement: bySaveId.get(id) };
  });
}

/**
 * Advance-scaling Stage 1/3 orchestrator. Runs the one-week kernel `tickCount`
 * times and composes the per-tick outputs into ONE result with the SAME shape the
 * kernel returns. The kernel is pure and re-seeds per tick, so this is
 * deterministic with no seed plumbing — `simulateCampaignWorldInterval(year)`
 * composes EXACTLY the same end state as 48 sequential one_week kernel calls.
 *
 * AUTORESOLVE (Stage 3):
 *   • autoResolve ON (default) — every tick auto-resolves its majors (the Stage
 *     1/2 path, byte-identical to today: one apply pass per tick, no pause).
 *   • autoResolve OFF — each tick runs with deferMajors, applying its MINORS and
 *     WITHHOLDING its structural majors. The FIRST tick that surfaces majors PAUSES
 *     at that tick boundary: the minors are committed (for the DM to read), the
 *     majors are batched onto `pendingMajors`, and the orchestrator returns
 *     { status:'paused', … }. The cursor also carries the PRE-tick world (preWorldState
 *     / preRegionalGraph / preWizardNews / preSaves) — the exact inputs that tick was
 *     computed from — so RESUME can RE-DERIVE the full tick deterministically.
 *
 * RESUME — a present `resume` cursor means the caller is continuing a paused
 * advance. The orchestrator RE-RUNS the paused tick from its PRE-tick inputs with
 * the DM's verdicts folded in: every recommended major auto-resolves (deferMajors
 * OFF ⇒ the single-pass apply), every dismissed major is excluded via
 * dismissMajorIds. Because the kernel is pure and re-seeds per tick, re-running the
 * paused tick from the SAME pre-tick state with NO dismissals is BYTE-IDENTICAL to
 * the autoresolve-ON tick — so the equivalence invariant holds by construction
 * (seed replay), and the minors-only commit the pause showed is superseded by the
 * authoritative full tick. Ticks ticksDone..N-1 then continue from there. Resume is
 * STATELESS: the cursor IS the state, so a reload that rehydrates it re-derives the
 * identical remaining ticks.
 *
 * State carry-over between ticks: the next campaign threads the prior tick's
 * worldState / regionalGraph / wizardNews; the next saves fold the prior tick's
 * settlementUpdates (id-matched, last-write-wins). wizardNews is the LAST tick's;
 * candidates / selected / rollExplanations / autoApplied / proposals /
 * resolvedStressors / majors concatenate across ticks.
 *
 * @param {Object} [args]
 * @param {any} [args.campaign]
 * @param {any[]} [args.saves]
 * @param {string} [args.interval]   DM-facing duration (one_week|one_month|one_season|one_year)
 * @param {boolean} [args.commit]
 * @param {string} [args.now]
 * @param {boolean} [args.autoResolve] Stage 3: default true (auto-resolve majors,
 *   run to the end). false ⇒ pause on the first tick that surfaces majors.
 * @param {{
 *   interval?: string,
 *   ticksTotal?: number,
 *   resumeTick?: number,
 *   preWorldState?: any,
 *   preRegionalGraph?: any,
 *   preWizardNews?: any,
 *   preSaves?: any[],
 *   preIntervalHistoryLen?: number,
 *   pendingMajors?: any[],
 *   decisions?: Record<string, { decision?: string }>,
 * }|null} [args.resume] Stage 3 RESUME cursor (from a prior pause). When set, the
 *   orchestrator re-runs `resumeTick` from the pre-tick inputs (with decisions
 *   folded in), then continues.
 */
export function simulateCampaignWorldInterval({
  campaign, saves = [], interval = 'one_month', commit = false, now = wallClockNow(),
  autoResolve = true, resume = null,
} = {}) {
  // The DM-CHOSEN interval (one_year/one_month/…). Interior ticks always run at
  // one_week granularity; the composed metadata folds the DM's chosen label back.
  const resuming = !!resume;
  const chosenInterval = usableTickInterval(resuming ? resume.interval : interval);
  const tickCount = resuming ? (Number(resume.ticksTotal) || ticksForInterval(chosenInterval)) : ticksForInterval(chosenInterval);

  let runningCampaign = campaign;
  let runningSaves = saves;
  /** @type {any} */
  let last = null;
  // id-keyed accumulator (last-write-wins) for the composed settlementUpdates.
  /** @type {Map<string, any>} */
  const updatesById = new Map();
  const candidates = [];
  const selected = [];
  const rollExplanations = [];
  const autoApplied = [];
  const proposals = [];
  const resolvedStressors = [];
  const majors = [];
  // RESUME re-run filter: the ids of the majors the DM DISMISSED on the paused
  // tick. Empty ⇒ every major auto-resolves to recommended ⇒ the paused tick
  // re-runs byte-identically to the autoresolve-ON tick.
  let dismissMajorIds = null;
  // The tick to re-run on resume (the paused tick) — its pre-inputs come from the
  // cursor. A fresh advance starts at 0.
  let startTick = 0;

  // Advance-scaling Stage 5 — history-ring policy (locked decision #2): the
  // composed interval writes EXACTLY ONE pulseHistory record (the final tick's),
  // not N. The one-week kernel appends a record every tick; the carry-over threads
  // each onto the next, so a naive 48-tick year would deposit 48 records and burn
  // 48/80 of the ring for one advance. We snapshot the PRE-interval history length
  // here, then on the composed `complete` return collapse the interior beats —
  // keeping the pre-interval records + the single final composed record. The
  // per-tick beats are not lost: they live in the chronicle / IntervalChronicleSummary.
  //
  // RESUME subtlety: a paused interval already committed the records of its first
  // segment into worldState, so `resume.preWorldState` is NOT the pre-INTERVAL state
  // — collapsing against it would keep one record PER segment. The original tick-0
  // length rides the cursor (preIntervalHistoryLen, parked at pause time) so the
  // whole multi-segment interval still collapses to ONE record. Fallback to the
  // pre-paused-tick length only if a legacy cursor lacks the field.
  const preIntervalHistoryLen = resuming
    ? (Number.isFinite(resume.preIntervalHistoryLen)
        ? resume.preIntervalHistoryLen
        : ensureWorldState(resume.preWorldState, campaign).pulseHistory.length)
    : ensureWorldState(campaign?.worldState, campaign).pulseHistory.length;

  if (resuming) {
    // RE-DERIVE the paused tick from its PRE-tick inputs. This supersedes the
    // minors-only commit shown during the pause with the authoritative FULL tick.
    runningCampaign = {
      ...runningCampaign,
      worldState: resume.preWorldState,
      regionalGraph: resume.preRegionalGraph,
      wizardNews: resume.preWizardNews,
    };
    runningSaves = Array.isArray(resume.preSaves) ? resume.preSaves : runningSaves;
    startTick = Math.max(0, Math.min(tickCount - 1, Number(resume.resumeTick) || 0));
    const dismissed = (resume.pendingMajors || [])
      .filter((/** @type {any} */ m) => (resume.decisions || {})[String(m?.id)]?.decision === 'dismissed')
      .map((/** @type {any} */ m) => String(m.id));
    dismissMajorIds = dismissed.length ? new Set(dismissed) : null;
  }

  for (let i = startTick; i < tickCount; i++) {
    // The tick under the resume cursor re-runs as a FULL single-pass apply (with the
    // DM's dismissals filtered out); every other tick under autoresolve OFF defers
    // its majors so the loop can pause on the first that surfaces them.
    const isResumeTick = resuming && i === startTick;
    const tickResult = simulateCampaignWorldPulse({
      campaign: runningCampaign,
      saves: runningSaves,
      interval: 'one_week',
      commit: commit && i === tickCount - 1,
      now,
      deferMajors: !autoResolve && !isResumeTick,
      dismissMajorIds: isResumeTick ? dismissMajorIds : null,
    });

    for (const update of tickResult.settlementUpdates || []) {
      updatesById.set(String(update.saveId), update);
    }
    if (tickResult.candidates) candidates.push(...tickResult.candidates);
    if (tickResult.selected) selected.push(...tickResult.selected);
    if (tickResult.rollExplanations) rollExplanations.push(...tickResult.rollExplanations);
    if (tickResult.autoApplied) autoApplied.push(...tickResult.autoApplied);
    if (tickResult.proposals) proposals.push(...tickResult.proposals);
    if (tickResult.resolvedStressors) resolvedStressors.push(...tickResult.resolvedStressors);
    if (tickResult.majors) majors.push(...tickResult.majors);

    // PAUSE BOUNDARY (autoresolve OFF): this tick committed its minors and surfaced
    // majors. STOP at the tick boundary — after the minor-commit, before tick i+1's
    // compute. The cursor carries the PRE-tick inputs so resume can re-derive the
    // full tick deterministically. ticksDone = i+1 (minors committed); remainingTicks
    // = tickCount - i - 1. The resume tick itself never pauses (it re-runs full).
    if (!autoResolve && !isResumeTick
        && Array.isArray(tickResult.deferredMajors) && tickResult.deferredMajors.length) {
      const ticksDone = i + 1;
      return {
        ...tickResult,
        status: 'paused',
        atTick: tickResult.tick,
        interval: chosenInterval,
        ticksTotal: tickCount,
        ticksDone,
        remainingTicks: tickCount - ticksDone,
        resumeTick: i,
        // Stage 5 ring policy: carry the ORIGINAL pre-interval history length so the
        // eventual `complete` return collapses the WHOLE interval (every segment)
        // down to one composed record, not one per resume segment. Survives a
        // serialized reload of the cursor.
        preIntervalHistoryLen,
        // The withheld majors, batched (NO cap), awaiting the DM's verdict.
        pendingMajors: tickResult.deferredMajors,
        // PRE-tick inputs — the exact state this tick was computed from. Resume
        // re-derives the full tick from these (seed replay), so a reload that
        // rehydrates them resumes to identical ticks with NO double-advance.
        preWorldState: runningCampaign.worldState,
        preRegionalGraph: runningCampaign.regionalGraph,
        preWizardNews: runningCampaign.wizardNews,
        preSaves: runningSaves,
        settlementUpdates: [...updatesById.values()],
        candidates, selected, rollExplanations, autoApplied, proposals, resolvedStressors, majors,
      };
    }

    // Thread this tick's output into the next tick's input.
    runningCampaign = {
      ...runningCampaign,
      worldState: tickResult.worldState,
      regionalGraph: tickResult.regionalGraph,
      wizardNews: tickResult.wizardNews,
    };
    runningSaves = foldUpdatesOntoSaves(runningSaves, tickResult.settlementUpdates);
    last = tickResult;
  }

  // Ran to the end with no pause (autoResolve ON, or OFF with no majors surfaced).
  // tickCount ≥ 1, so `last` is the final tick (or the resume prologue's result).
  //
  // Stage 5 history-ring collapse: keep the pre-interval records + ONLY the final
  // tick's composed record, dropping the interior per-tick beats the carry-over
  // accumulated. One advance ⇒ one ring entry (decision #2). The degenerate
  // one_week case (tickCount=1) appended exactly one record already, so its slice
  // is a no-op. The slice is on the FINAL composed worldState only — every interior
  // computation still threaded its full history forward, so determinism is untouched.
  const composedWorldState = collapseIntervalHistory(last.worldState, preIntervalHistoryLen);
  return {
    ...last,
    worldState: composedWorldState,
    status: 'complete',
    interval: chosenInterval,
    settlementUpdates: [...updatesById.values()],
    candidates,
    selected,
    rollExplanations,
    autoApplied,
    proposals,
    resolvedStressors,
    majors,
  };
}
