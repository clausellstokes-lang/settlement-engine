/**
 * domain/construct/intentComparator.js — the INTENT-VS-RESULT COMPARATOR + the bounded revise
 * loop (Surveyor S5/S6, DESIGN_AI_CONTROL_SURFACE §2 stage 5 / DESIGN_CONTENT_PLANE §3.4).
 *
 * After the compiler emits a CONFIG and declares its target CONSTRAINTS, the pipeline generates
 * DETERMINISTICALLY. This comparator — PURE CODE, ZERO AI (token-efficiency directive 6: the
 * judgment is deterministic, never a second model call) — judges the generated result against
 * the declared constraints and lists the DEVIATIONS HONESTLY: "you asked for hard-scarcity;
 * here is where the draft deviates." It reuses the existing read-models (deriveSystemState),
 * never re-deriving the world.
 *
 * THE REVISE LOOP is DELTA-ONLY (directive 5): a revise pass carries the DEVIATIONS + the
 * current config ONLY — never the full original context / dossier slices re-sent. The revise
 * DECISION is deterministic (deviations remain AND the round budget is not spent).
 *
 * PURE, headless, no store/React/transport. Reached only by the lazy construction surfaces.
 */

import { deriveSystemState } from '../state/deriveSystemState.js';
import { coarseBand, CONSTRAINT_DIMENSIONS } from './configVocabulary.js';

/** Which direction is "worse" for each dimension (higher-is-worse ⇒ a high band is bad). Used
 *  only to phrase a deviation's `direction` honestly (raise vs lower). resilience is the lone
 *  higher-is-better axis. */
const HIGHER_IS_BETTER = new Set(['resilience']);

const BAND_RANK = { low: 0, moderate: 1, high: 2 };

/**
 * One honest deviation: the constraint the result missed and by how far.
 * @typedef {{ dimension: string, target: 'low'|'moderate'|'high', actual: 'low'|'moderate'|'high',
 *            gap: number, direction: 'raise'|'lower' }} Deviation
 */

/**
 * Compare a generated settlement's system state to the declared constraints. Pure + deterministic.
 * For each constrained dimension, derive the ACTUAL coarse band and list a deviation when it
 * differs from the TARGET. `direction` says which way the value must move to satisfy the intent.
 * @param {import('../state/deriveSystemState.js').SystemStateSource | null | undefined} settlement  a generated settlement dossier
 * @param {Record<string, 'low'|'moderate'|'high'>} constraints
 * @returns {Deviation[]} sorted by gap (biggest miss first)
 */
export function compareResultToConstraints(settlement, constraints) {
  const state = deriveSystemState(settlement);
  /** @type {Deviation[]} */
  const deviations = [];
  for (const dim of CONSTRAINT_DIMENSIONS) {
    const target = constraints && constraints[dim];
    if (!target) continue;
    const dimState = /** @type {{ value?: number }} */ ((/** @type {Record<string, { value?: number }>} */ (state))[dim]) || {};
    const actual = coarseBand(typeof dimState.value === 'number' ? dimState.value : NaN);
    if (actual === target) continue;
    const gap = Math.abs(BAND_RANK[target] - BAND_RANK[actual]);
    // The value must RISE when the target band is above the actual, unless higher-is-better is
    // inverted — but band direction is uniform on the 0..100 axis, so "raise" = move toward the
    // higher band. HIGHER_IS_BETTER only colors the human phrasing elsewhere, not the mechanic.
    const direction = BAND_RANK[target] > BAND_RANK[actual] ? 'raise' : 'lower';
    deviations.push({ dimension: dim, target, actual, gap, direction });
  }
  deviations.sort((a, b) => b.gap - a.gap);
  return deviations;
}

/**
 * Compare a composed REALM (its member settlements) to the declared constraints — the comparator
 * generalized to realm scale (S6). Averages each dimension across members (the realm's aggregate
 * posture) and lists deviations the same way. Pure + deterministic.
 * @param {Array<{ settlement?: import('../state/deriveSystemState.js').SystemStateSource } | import('../state/deriveSystemState.js').SystemStateSource>} settlements
 * @param {Record<string, 'low'|'moderate'|'high'>} constraints
 * @returns {Deviation[]}
 */
export function compareRealmToConstraints(settlements, constraints) {
  const members = Array.isArray(settlements) ? settlements : [];
  if (members.length === 0) return [];
  /** @type {Record<string, number>} */
  const sums = {};
  for (const s of members) {
    const source = /** @type {{ settlement?: import('../state/deriveSystemState.js').SystemStateSource }} */ (s);
    const state = deriveSystemState(source?.settlement || /** @type {import('../state/deriveSystemState.js').SystemStateSource} */ (s));
    for (const dim of CONSTRAINT_DIMENSIONS) {
      const v = /** @type {{ value?: number }} */ ((/** @type {Record<string, { value?: number }>} */ (state))[dim])?.value;
      if (typeof v === 'number' && Number.isFinite(v)) sums[dim] = (sums[dim] || 0) + v;
    }
  }
  const avg = /** @type {Record<string, { value: number }>} */ ({});
  for (const dim of CONSTRAINT_DIMENSIONS) avg[dim] = { value: (sums[dim] || 0) / members.length };
  return compareAggregate(avg, constraints);
}

/** Compare a pre-derived aggregate state map to constraints (helper for the realm comparator).
 *  @param {Record<string, { value?: number }>} avgState
 *  @param {Record<string, 'low'|'moderate'|'high'>} constraints @returns {Deviation[]} */
function compareAggregate(avgState, constraints) {
  /** @type {Deviation[]} */
  const deviations = [];
  for (const dim of CONSTRAINT_DIMENSIONS) {
    const target = constraints && constraints[dim];
    if (!target) continue;
    const actual = coarseBand(avgState[dim]?.value ?? NaN);
    if (actual === target) continue;
    const gap = Math.abs(BAND_RANK[target] - BAND_RANK[actual]);
    deviations.push({ dimension: dim, target, actual, gap, direction: BAND_RANK[target] > BAND_RANK[actual] ? 'raise' : 'lower' });
  }
  deviations.sort((a, b) => b.gap - a.gap);
  return deviations;
}

/** True iff a deviation set + a round budget warrant another revise pass. Deterministic — the
 *  loop is bounded (never re-tries forever); a satisfied result (no deviations) stops. Pure.
 *  @param {Deviation[]} deviations @param {{ round?: number, maxRounds?: number }} [budget] */
export function shouldRevise(deviations, { round = 0, maxRounds = 2 } = {}) {
  return Array.isArray(deviations) && deviations.length > 0 && round < maxRounds;
}

/**
 * Build the DELTA-ONLY revise payload (directive 5): the deviations to correct + the current
 * config to adjust — and NOTHING ELSE. The full original context / dossier slices are NEVER
 * re-sent; a revise pass corrects, it does not re-ground. Pure. The `_noSlices` marker is
 * asserted by the pin so a future edit cannot silently re-attach the grounding.
 * @param {Deviation[]} deviations
 * @param {Record<string, unknown>} currentConfig
 * @returns {{ deviations: Deviation[], config: Record<string, unknown>, _noSlices: true }}
 */
export function buildRevisePayload(deviations, currentConfig) {
  return {
    deviations: Array.isArray(deviations) ? deviations : [],
    config: (currentConfig && typeof currentConfig === 'object' && !Array.isArray(currentConfig)) ? { ...currentConfig } : {},
    _noSlices: true,
  };
}
