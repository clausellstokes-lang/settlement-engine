/**
 * domain/pipelineRail.js — Structured payload for the rail's
 * step-expansion view.
 *
 * The PipelineRail UI already exists; this
 * module produces the structured payload it consumes when the user
 * taps a step open. Composes traces + explainEntity.
 *
 *   expandPipelineStep(settlement, stepName) -> {
 *     step,
 *     decisions: [{
 *       targetType, targetId, result,
 *       why:    string[],   trace.causes lines
 *       downstreamEffects: string[],
 *       envelope: ExplanationEnvelope | null,   when targetId resolves
 *     }],
 *     summary
 *   }
 *
 * Pure read-only.
 */

import { tracesByStep } from './trace.js';
import { explainEntity } from './explanation.js';

function reasonLines(trace) {
  return (trace.causes || []).map(c =>
    c.reason || `${c.source}: ${c.effect}`
  );
}

function downstreamLines(trace) {
  return (trace.downstreamEffects || []).map(d =>
    d.reason || `${d.target}: ${d.effect}`
  );
}

/**
 * Expand one pipeline step into the structured decisions it made.
 *
 * @param {Object} settlement
 * @param {string} stepName
 * @returns {Object}
 */
export function expandPipelineStep(settlement, stepName) {
  if (!settlement || typeof stepName !== 'string') {
    return { step: stepName || null, decisions: [], summary: [] };
  }
  const traces = tracesByStep(settlement, stepName);
  const decisions = traces.map(t => ({
    targetType: t.targetType || null,
    targetId: t.targetId || null,
    result: t.result || null,
    why: reasonLines(t),
    downstreamEffects: downstreamLines(t),
    envelope: t.targetId
      ? explainEntity(settlement, { type: t.targetType, id: t.targetId })
      : null,
  }));

  const summary = [];
  if (decisions.length === 0) {
    summary.push(`No structured decisions recorded for step "${stepName}".`);
  } else {
    summary.push(`${decisions.length} decision(s) at step "${stepName}".`);
    for (const d of decisions.slice(0, 4)) {
      summary.push(`${d.targetType}: ${d.targetId} — ${d.result || 'recorded'}`);
    }
  }

  return { step: stepName, decisions, summary };
}

/**
 * List every step that has at least one trace, with a count.
 * Useful for the rail's overview density indicator.
 */
export function pipelineStepSummary(settlement) {
  if (!settlement) return [];
  const out = new Map();
  for (const t of settlement.simulationTrace || []) {
    if (!t || !t.step) continue;
    if (!out.has(t.step)) out.set(t.step, { step: t.step, decisionCount: 0 });
    out.get(t.step).decisionCount += 1;
  }
  return Array.from(out.values());
}

/** Total trace count. Cheap dashboard tile. */
export function totalTraceCount(settlement) {
  return Array.isArray(settlement?.simulationTrace) ? settlement.simulationTrace.length : 0;
}
