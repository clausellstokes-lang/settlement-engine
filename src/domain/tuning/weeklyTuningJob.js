/**
 * weeklyTuningJob.js — the PURE body of the §10 autonomous tuning loop: ingest the week's
 * rollups, diagnose divergences against ratified envelopes, classify each candidate into
 * lane A / lane B, and build the WORLD HEALTH REPORT. It APPLIES NOTHING (the §7 data-
 * endogeneity law is absolute): every output is a proposal / config-delta / report — no
 * write into any running world or generation path. The scheduled routine (§10 MECHANISM,
 * owner-created) supplies the rollup rows + the soak battery + the implementer agent that
 * actually commits lane-A nudges; this module is only its diagnose+classify+report core.
 *
 * SHIPS INERT: with the default empty envelopes + empty registry, DIAGNOSE finds nothing,
 * lane A is empty, and the report is pure distributions. Auto-tuning begins only after the
 * owner ratifies envelopes + registry AND enables the routine (§10: "owner rails ratified
 * once at setup"). Fully testable by injecting envelopes/registry/soak.
 *
 * PURITY / BUDGET: pure, no side effects, no eager importer. Zero first-paint bytes.
 */

import { classifyTuningProposal, LANE_A, LANE_B } from './laneClassifier.js';
import { AUTO_TUNABLE } from './autoTunableRegistry.js';

/** @typedef {{ metric: string, dims?: unknown, value: number|string }} RollupRow */
/** @typedef {{ metric: string, min: number, max: number, constantId?: string, proposedValue?: number }} Envelope */
/** @typedef {{ distributions: Record<string, Array<{ dims: unknown, value: number }>>, totals: Record<string, number> }} Ingested */
/** @typedef {{ metric: string, observed: number, min: number, max: number, direction: 'over'|'under', constantId?: string, proposedValue?: number }} DiagnoseCandidate */
/** @typedef {{ green?: boolean, shiftsGolden?: boolean }} SoakResult */

/**
 * INGEST — reduce the week's rollup rows into per-metric distributions + totals.
 * @param {ReadonlyArray<RollupRow>} rollups
 * @returns {Ingested}
 */
export function ingestRollups(rollups) {
  /** @type {Record<string, Array<{ dims: unknown, value: number }>>} */
  const distributions = {};
  /** @type {Record<string, number>} */
  const totals = {};
  for (const row of Array.isArray(rollups) ? rollups : []) {
    if (!row || typeof row.metric !== 'string') continue;
    const v = Number(row.value) || 0;
    (distributions[row.metric] ||= []).push({ dims: row.dims ?? {}, value: v });
    totals[row.metric] = (totals[row.metric] || 0) + v;
  }
  return { distributions, totals };
}

/**
 * DIAGNOSE — flag each ratified envelope whose observed value sits OUTSIDE [min, max].
 * `observedFor(envelope, ingested)` computes the observed value for an envelope; the default
 * reads totals[envelope.metric]. The domain-specific reduction (e.g. famine incidence %) is
 * the owner's ratified reducer — kept injectable so this module stays pure and generic.
 * @param {ReadonlyArray<Envelope>} envelopes
 * @param {Ingested} ingested
 * @param {(envelope: Envelope, ingested: Ingested) => number} [observedFor]
 * @returns {DiagnoseCandidate[]}
 */
export function diagnose(envelopes, ingested, observedFor) {
  /** @type {(envelope: Envelope, ingested: Ingested) => number} */
  const read = typeof observedFor === 'function'
    ? observedFor
    : (env, ing) => Number(ing.totals?.[env.metric]) || 0;
  /** @type {DiagnoseCandidate[]} */
  const out = [];
  for (const env of Array.isArray(envelopes) ? envelopes : []) {
    if (!env || typeof env.metric !== 'string' || !Number.isFinite(env.min) || !Number.isFinite(env.max)) continue;
    const observed = read(env, ingested);
    if (observed < env.min) out.push({ metric: env.metric, observed, min: env.min, max: env.max, direction: 'under', constantId: env.constantId, proposedValue: env.proposedValue });
    else if (observed > env.max) out.push({ metric: env.metric, observed, min: env.min, max: env.max, direction: 'over', constantId: env.constantId, proposedValue: env.proposedValue });
  }
  // Rank by magnitude of divergence (the §10 "rank divergences" step).
  return out.sort((a, b) => divergence(b) - divergence(a));
}

/** @param {DiagnoseCandidate} d */
function divergence(d) {
  return d.direction === 'over' ? d.observed - d.max : d.min - d.observed;
}

/**
 * Run the whole loop's diagnose→classify→report core. NEVER applies anything.
 * @param {{
 *   rollups?: ReadonlyArray<RollupRow>,
 *   envelopes?: ReadonlyArray<Envelope>,
 *   registry?: ReadonlyArray<import('./autoTunableRegistry.js').RegistryEntry>,
 *   observedFor?: (envelope: Envelope, ingested: Ingested) => number,
 *   soakFor?: (candidate: DiagnoseCandidate) => SoakResult | undefined,
 *   currentValueFor?: (constantId: string) => number,
 *   weekOf?: string,
 * }} [args]
 * @returns {{ healthReport: object, laneAEligible: object[], laneBProposals: object[], driftNotes: object[] }}
 */
export function runWeeklyTuningJob(args = {}) {
  const { rollups = [], envelopes = [], registry = AUTO_TUNABLE, observedFor, soakFor, currentValueFor, weekOf } = args;
  const ingested = ingestRollups(rollups);
  const candidates = diagnose(envelopes, ingested, observedFor);

  /** @type {object[]} */ const laneAEligible = [];
  /** @type {object[]} */ const laneBProposals = [];
  /** @type {object[]} */ const driftNotes = [];

  for (const c of candidates) {
    // A divergence with no mapped constant is a report-only drift note (nothing to tune).
    if (!c.constantId) { driftNotes.push({ ...c, reason: 'no mapped auto-tunable constant' }); continue; }
    const currentValue = typeof currentValueFor === 'function' ? Number(currentValueFor(c.constantId)) : NaN;
    const proposedValue = Number.isFinite(c.proposedValue) ? Number(c.proposedValue) : currentValue;
    const soak = typeof soakFor === 'function' ? soakFor(c) : undefined;
    const proposal = { id: c.constantId, currentValue, proposedValue, soak, metric: c.metric, direction: c.direction, observed: c.observed };
    const { lane, reasons } = classifyTuningProposal(proposal, registry);
    if (lane === LANE_A) laneAEligible.push({ ...proposal, lane: LANE_A });
    else laneBProposals.push({ ...proposal, lane: LANE_B, reasons });
  }

  const healthReport = {
    weekOf: weekOf || null,
    // The distributions from the rollups (§10 step 5: distributions vs envelopes).
    distributions: ingested.distributions,
    totals: ingested.totals,
    envelopeCount: Array.isArray(envelopes) ? envelopes.length : 0,
    divergences: candidates.length,
    laneAEligibleCount: laneAEligible.length,
    laneBProposalCount: laneBProposals.length,
    driftNoteCount: driftNotes.length,
    // Silence is never ambiguous (§10 step 5): an all-green week is reported explicitly.
    status: candidates.length === 0 ? 'all_within_envelope' : 'divergences_present',
  };

  return { healthReport, laneAEligible, laneBProposals, driftNotes };
}

export { LANE_A, LANE_B };
