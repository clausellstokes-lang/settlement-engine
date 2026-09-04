/**
 * domain/autonomy/autonomousRun.js — the bounded autonomous advance: cap + receipt
 * (SURVEYOR S7, DESIGN_AI_CONTROL_SURFACE §2 stage 7).
 *
 * "Advance until condition OR max N weeks", N hard-capped. The cap CONSUMES the
 * owner-ruled M10b constant (CATCH_UP_CAP_WEEKS = 26, simulationRules.js — "half a
 * game-year", owner decision 2026-07-13): one vocabulary for "how far the world may
 * run unattended" (JUDGMENT: imported, not copied — vetoable).
 *
 * Every stop emits a RECEIPT: which condition fired (or the cap), at which tick, the
 * signal values the decision was made on, seed + engine version — so the op log + seed
 * reproduce every autonomous run (the determinism constitution; the receipt proves it).
 * Pure builders only: the orchestration loop lives in src/lib/surveyorAutonomy.js
 * (glue), the store advances through the EXISTING registered advanceCampaignWorld op.
 */

import { CATCH_UP_CAP_WEEKS } from '../worldPulse/simulationRules.js';
import { ENGINE_VERSION } from '../intent/applyDispatch.js';
import { describeStopCondition } from './stopConditions.js';

/** The hard ceiling on one autonomous run — the M10b owner-ruled constant, consumed. */
export const AUTONOMOUS_ADVANCE_CAP_WEEKS = CATCH_UP_CAP_WEEKS;

/**
 * Clamp a requested week budget to [1, AUTONOMOUS_ADVANCE_CAP_WEEKS]. Non-numeric ⇒ 1.
 * @param {unknown} weeks
 * @returns {number}
 */
export function clampAutonomousWeeks(weeks) {
  const n = typeof weeks === 'number' && Number.isFinite(weeks) ? Math.floor(weeks) : 1;
  return Math.min(AUTONOMOUS_ADVANCE_CAP_WEEKS, Math.max(1, n));
}

/**
 * @typedef {object} AutonomousRunReceipt
 * @property {'autonomous_advance'} kind
 * @property {string} engineVersion
 * @property {string} seed — worldState.rngSeed (replay: same seed + same ops ⇒ same run)
 * @property {string} conditionLabel — human reading of the StopCondition
 * @property {boolean} fired — true ⇒ the condition stopped the run
 * @property {boolean} capped — true ⇒ the week budget stopped it instead
 * @property {number} startTick
 * @property {number} stopTick — the tick at which the run stopped
 * @property {number} weeksAdvanced
 * @property {number} maxWeeks — the clamped budget this run was granted
 * @property {ReadonlyArray<import('./stopConditions.js').SignalEvaluation>} evaluations — the
 *   final boundary's signal values (what the stop decision was made on)
 * @property {string} at — ISO timestamp (caller-supplied; these builders stay clock-free)
 */

/**
 * Build the stop receipt. Pure — the caller supplies every observed fact.
 * @param {object} args
 * @param {string} [args.seed]
 * @param {string} [args.engineVersion]
 * @param {import('./stopConditions.js').StopCondition | null} [args.condition]
 * @param {boolean} [args.fired]
 * @param {boolean} [args.capped]
 * @param {number} [args.startTick]
 * @param {number} [args.stopTick]
 * @param {number} [args.weeksAdvanced]
 * @param {number} [args.maxWeeks]
 * @param {import('./stopConditions.js').SignalEvaluation[]} [args.evaluations]
 * @param {string} [args.at]
 * @returns {AutonomousRunReceipt}
 */
export function autonomousRunReceipt({
  seed = '', engineVersion = ENGINE_VERSION, condition = null, fired = false, capped = false,
  startTick = 0, stopTick = 0, weeksAdvanced = 0, maxWeeks = 0, evaluations = [], at = '',
} = {}) {
  return Object.freeze({
    kind: 'autonomous_advance',
    engineVersion: engineVersion || ENGINE_VERSION,
    seed: String(seed || ''),
    conditionLabel: describeStopCondition(condition),
    fired: Boolean(fired),
    capped: Boolean(capped),
    startTick: Math.max(0, Math.floor(Number.isFinite(startTick) ? startTick : 0)),
    stopTick: Math.max(0, Math.floor(Number.isFinite(stopTick) ? stopTick : 0)),
    weeksAdvanced: Math.max(0, Math.floor(Number.isFinite(weeksAdvanced) ? weeksAdvanced : 0)),
    maxWeeks: Math.max(0, Math.floor(Number.isFinite(maxWeeks) ? maxWeeks : 0)),
    evaluations: Object.freeze([...evaluations]),
    at: String(at || ''),
  });
}

/**
 * The id-free analytics/log projection of a receipt (counts + flags, never world
 * content — the aiOperationLog discipline applied client-side).
 * @param {AutonomousRunReceipt} receipt
 * @returns {{ kind: 'autonomous_advance', engineVersion: string, fired: boolean,
 *             capped: boolean, weeksAdvanced: number, maxWeeks: number, testCount: number }}
 */
export function autonomousRunLogRecord(receipt) {
  return {
    kind: 'autonomous_advance',
    engineVersion: receipt.engineVersion,
    fired: receipt.fired,
    capped: receipt.capped,
    weeksAdvanced: receipt.weeksAdvanced,
    maxWeeks: receipt.maxWeeks,
    testCount: receipt.evaluations.length,
  };
}
