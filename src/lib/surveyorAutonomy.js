/**
 * lib/surveyorAutonomy.js — the S7 AUTONOMOUS ADVANCE orchestrator (SURVEYOR S7,
 * DESIGN_AI_CONTROL_SURFACE §2 stage 7): "advance until condition OR max N weeks",
 * N hard-capped at the owner-ruled M10b constant.
 *
 * ORCHESTRATION GLUE, store-free by injection: the panel supplies the REGISTERED store
 * op (`advanceCampaignWorld(campaignId, 'one_week', ...)`) and the fresh-state readers;
 * this loop calls the op once per week and runs the PURE StopCondition evaluator at
 * every advance boundary — the deterministic engine advances, the evaluator only reads.
 * Nothing here writes state, calls a provider, or costs credits: the compose step
 * (lib/surveyorWrite.composeAutonomy) is the priced AI moment; the run is engine-local.
 *
 * DYNAMIC-IMPORTED by the lazy Autonomy panel only (never statically) — this module and
 * the domain/autonomy graph ride the panel chunk, zero first-paint bytes (the
 * surveyorPanelsLazy membership contract).
 */

import {
  clampAutonomousWeeks, prepareSignalFrame, evaluateStopCondition,
  validateStopCondition, autonomousRunReceipt,
} from '../domain/autonomy/index.js';

/**
 * @param {object} args
 * @param {string} args.campaignId
 * @param {object} args.condition — a validated StopCondition (schema-walled upstream)
 * @param {number} args.maxWeeks — clamped to [1, AUTONOMOUS_ADVANCE_CAP_WEEKS]
 * @param {{
 *   advance: (campaignId: string) => Promise<{ ok?: boolean, reason?: string } | undefined>,
 *   readCampaign: () => (object | null),
 *   readSaves: () => Array<object>,
 * }} args.deps — the registered store op + fresh-state readers (fresh reads each week:
 *   parallel sessions and the engine itself mutate the tree under us)
 * @param {(p: { week: number, budget: number, evaluation: object }) => void} [args.onProgress]
 * @returns {Promise<{ receipt: object, stopped: string }>} stopped ∈
 *   'condition' | 'cap' | 'invalid_condition' | 'advance_refused:<reason>'
 */
export async function runAutonomousAdvance({ campaignId, condition, maxWeeks, deps, onProgress }) {
  const budget = clampAutonomousWeeks(maxWeeks);
  const startCampaign = deps.readCampaign();
  const startTick = Number(startCampaign?.worldState?.tick ?? 0);
  const seed = String(startCampaign?.worldState?.rngSeed ?? '');

  // The wall, one more time at the mouth of the loop: an invalid condition NEVER
  // drives an advance (structurally dead — the no-op-type-no-effect law).
  const wall = validateStopCondition(condition);
  if (!wall.ok) {
    return {
      stopped: 'invalid_condition',
      receipt: autonomousRunReceipt({
        seed, condition: null, fired: false, capped: false,
        startTick, stopTick: startTick, weeksAdvanced: 0, maxWeeks: budget,
        evaluations: [], at: new Date().toISOString(),
      }),
    };
  }

  let weeks = 0;
  let evaluation = { fired: false, evaluations: [], errors: [] };
  let refusedReason = '';
  while (weeks < budget) {
    const result = await deps.advance(campaignId);
    if (result && result.ok === false) {
      // A guard refusal (in-flight / paused / frozen) stops the run honestly —
      // never a silent retry loop against a world that said no.
      refusedReason = typeof result.reason === 'string' ? result.reason : 'refused';
      break;
    }
    weeks += 1;
    const campaign = deps.readCampaign();
    const saves = deps.readSaves();
    evaluation = evaluateStopCondition(condition, prepareSignalFrame({ campaign, saves }));
    if (onProgress) onProgress({ week: weeks, budget, evaluation });
    if (evaluation.fired) break;
  }

  const endCampaign = deps.readCampaign();
  const stopTick = Number(endCampaign?.worldState?.tick ?? startTick);
  const capped = !evaluation.fired && !refusedReason && weeks >= budget;
  const receipt = autonomousRunReceipt({
    seed, condition,
    fired: evaluation.fired, capped,
    startTick, stopTick, weeksAdvanced: weeks, maxWeeks: budget,
    evaluations: evaluation.evaluations,
    at: new Date().toISOString(),
  });
  const stopped = evaluation.fired ? 'condition'
    : (refusedReason ? `advance_refused:${refusedReason}` : 'cap');
  return { receipt, stopped };
}
