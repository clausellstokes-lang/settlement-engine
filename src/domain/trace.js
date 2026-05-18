/**
 * domain/trace.js — Causal trace API for the simulation pipeline.
 *
 * Tier 2.1 of the roadmap. This is the foundation the rest of the
 * simulator's causality work compounds on: faction profiles, supply-
 * chain state, district simulation, AI grounded-in-trace prompts all
 * become much easier when every important decision the engine made
 * leaves a structured receipt.
 *
 * Storage:
 *   Traces live on `settlement.simulationTrace[]`. The container is
 *   created by `normalizeSettlement` (see Phase 6); this module never
 *   creates the array itself, only appends to it.
 *
 *   During a generation run, traces accumulate on `ctx.simulationTrace`
 *   inside the pipeline runner. The final `assembleSettlement` step
 *   propagates them onto the settlement object on its way out.
 *
 * Trace shape:
 *   Every trace is a structured fact about WHAT decision the engine
 *   made, WHY (the causes that pushed it), and WHAT DOWNSTREAM effects
 *   the decision has. Free-text reason strings are encouraged — the
 *   point of a trace is to be human-readable, not just parseable.
 *
 *     {
 *       targetType: 'institution' | 'faction' | 'npc' | 'resource' | …
 *       targetId:   stable id of the affected entity
 *       step:       pipeline step name that produced the trace
 *       result:     short verb describing what happened ('selected',
 *                   'subsumed', 'impaired', 'promoted', etc.)
 *       causes:     [{ source, effect, reason }]
 *       downstreamEffects: [{ target, effect, reason? }]
 *       ts:         timestamp (auto-stamped if absent)
 *     }
 *
 * Pure functions only. No React, no Zustand, no I/O. The pipeline
 * passes ctx; this module mutates ctx.simulationTrace in place because
 * the pipeline runner expects mutation for performance reasons. From
 * outside the pipeline, prefer the read-only helpers (getTraces,
 * tracesFor, tracesByStep) which never mutate.
 */

// ── Dev-only shape validation ──────────────────────────────────────────────
// Defensive enough to catch the most common authoring mistakes (forgot
// targetId, mixed up step/result, passed a string where an array was
// expected) without becoming a heavy validator. Disabled in prod via
// the early return.

const ALLOWED_TARGET_TYPES = new Set([
  'institution', 'faction', 'npc', 'resource', 'stressor',
  'service', 'supply_chain', 'threat', 'hook', 'event',
  'condition', 'district', 'history',
]);

function validateTrace(trace) {
  // Validation is cheap (a handful of property checks); always-on. If
  // the cost ever shows up in a profile, gate this behind a build-time
  // flag — but DON'T gate on import.meta.env here because the domain
  // tsconfig doesn't expose Vite's env type and we don't want to
  // introduce a global type augmentation just to skip a microcheck.
  if (!trace || typeof trace !== 'object') {
     
    console.warn('[trace] recordTrace received non-object:', trace);
    return;
  }
  if (typeof trace.targetType !== 'string' || !ALLOWED_TARGET_TYPES.has(trace.targetType)) {
     
    console.warn(`[trace] unknown or missing targetType: "${trace.targetType}". Add to ALLOWED_TARGET_TYPES if intentional.`);
  }
  if (typeof trace.targetId !== 'string' || !trace.targetId) {
     
    console.warn('[trace] missing or empty targetId on trace');
  }
  if (typeof trace.step !== 'string' || !trace.step) {
     
    console.warn('[trace] missing step name on trace');
  }
  if (typeof trace.result !== 'string' || !trace.result) {
     
    console.warn('[trace] missing result verb on trace');
  }
  if (trace.causes !== undefined && !Array.isArray(trace.causes)) {
     
    console.warn('[trace] causes must be an array if present');
  }
  if (trace.downstreamEffects !== undefined && !Array.isArray(trace.downstreamEffects)) {
     
    console.warn('[trace] downstreamEffects must be an array if present');
  }
}

// ── Recording ──────────────────────────────────────────────────────────────

/**
 * Push a trace onto the active simulation context.
 *
 * Intended use is from inside a registered pipeline step:
 *
 *   recordTrace(ctx, {
 *     targetType: 'institution',
 *     targetId:   'institution.town_watch',
 *     step:       'assembleInstitutions',
 *     result:     'selected',
 *     causes: [
 *       { source: 'threat.banditry', effect: '+30% likelihood',
 *         reason: 'Bandit pressure increased demand for organized patrols.' },
 *     ],
 *     downstreamEffects: [
 *       { target: 'publicOrder', effect: 'improved' },
 *     ],
 *   });
 *
 * Mutates `ctx.simulationTrace` in place (initializing it if absent).
 * Returns the recorded trace for chaining.
 */
export function recordTrace(ctx, trace) {
  if (!ctx || typeof ctx !== 'object') return null;
  validateTrace(trace);
  const enriched = {
    causes: [],
    downstreamEffects: [],
    ...trace,
    ts: trace?.ts ?? Date.now(),
  };
  if (!Array.isArray(ctx.simulationTrace)) {
    ctx.simulationTrace = [];
  }
  ctx.simulationTrace.push(enriched);
  return enriched;
}

/**
 * Record many traces in one call. Useful for steps that emit a batch of
 * traces (e.g. assembleInstitutions emitting one per selected institution).
 */
export function recordTraces(ctx, traces) {
  if (!Array.isArray(traces)) return;
  for (const t of traces) recordTrace(ctx, t);
}

// ── Reading ───────────────────────────────────────────────────────────────
// Pure read-only helpers. Never mutate. Safe to call from React components,
// PDF renderers, AI prompt assemblers, etc.

/** All traces on a settlement, in insertion order. */
export function getTraces(settlement) {
  if (!settlement || typeof settlement !== 'object') return [];
  return Array.isArray(settlement.simulationTrace) ? settlement.simulationTrace : [];
}

/** Traces affecting a specific entity id. */
export function tracesFor(settlement, targetId) {
  if (!targetId) return [];
  return getTraces(settlement).filter(t => t.targetId === targetId);
}

/** Traces emitted by a specific pipeline step. */
export function tracesByStep(settlement, stepName) {
  if (!stepName) return [];
  return getTraces(settlement).filter(t => t.step === stepName);
}

/** Traces of a specific target type ('institution', 'faction', etc.). */
export function tracesByType(settlement, targetType) {
  if (!targetType) return [];
  return getTraces(settlement).filter(t => t.targetType === targetType);
}

/**
 * Reverse causality: which traces list `sourceId` in any of their causes?
 * Useful for "what did this stressor end up causing?" style queries.
 */
export function tracesCausedBy(settlement, sourceId) {
  if (!sourceId) return [];
  return getTraces(settlement).filter(t =>
    Array.isArray(t.causes) && t.causes.some(c => c.source === sourceId)
  );
}

/**
 * Forward causality: which traces declare `targetId` as a downstream
 * effect? "What feeds into the public-order subsystem?"
 */
export function tracesAffecting(settlement, targetId) {
  if (!targetId) return [];
  return getTraces(settlement).filter(t =>
    Array.isArray(t.downstreamEffects) && t.downstreamEffects.some(d => d.target === targetId)
  );
}

/**
 * Render-friendly summary of a single trace — short lines suitable for
 * a tooltip or expanded rail step. Pure; returns strings, not JSX.
 */
export function summarizeTrace(trace) {
  if (!trace) return null;
  const causeLines = (trace.causes || []).map(c => {
    const lead = c.effect ? `${c.effect}` : '';
    const tail = c.reason ? ` — ${c.reason}` : '';
    return `${c.source}${lead ? ' (' + lead + ')' : ''}${tail}`;
  });
  const downstreamLines = (trace.downstreamEffects || []).map(d => {
    return `${d.target}: ${d.effect}${d.reason ? ` — ${d.reason}` : ''}`;
  });
  return {
    headline: `${trace.targetId} ${trace.result}`,
    causes: causeLines,
    downstreamEffects: downstreamLines,
  };
}
