/**
 * Bounded proposal admission for the DM docket.
 *
 * The persisted proposal ring is an audit-retention boundary, not a usable
 * attention budget. Admission therefore keeps two independent unresolved lanes:
 * minor questions may never consume the four places reserved for major choices,
 * and one settlement may not monopolize either lane. Existing rows are read only;
 * an over-cap legacy docket is preserved exactly and merely stops admitting more
 * questions in the saturated lane.
 *
 * Scope is deliberately organic pulse output. Explicit DM realm orders and
 * authored stressor-resolution aftermaths remain user-command paths and bypass
 * this policy; the generic proposal upsert is intentionally not a hidden cap.
 */

import { isMajorOutcome } from './decisionTier.js';
import {
  isStateOnlyOutcome,
  isSuppressionOnlyOutcome,
  proposalRequiresRecordModeSupersession,
} from './pulseHelpers.js';
import { REALM_SCALING, sublinearBonus } from './realmScaling.js';

export const PROPOSAL_DOCKET_POLICY = Object.freeze({
  baseMinorPending: 12,
  baseMajorPending: 4,
  perSettlementMinorPending: 3,
  perSettlementMajorPending: 1,
  majorProposalSlotsPerTick: 1,
});

/**
 * @typedef {{ minor: number, major: number }} ProposalLaneCounts
 * @typedef {{
 *   caps: ProposalLaneCounts & {
 *     perSettlementMinor: number,
 *     perSettlementMajor: number,
 *   },
 *   counts: ProposalLaneCounts,
 *   bySettlement: Record<string, ProposalLaneCounts>,
 * }} ProposalDocket
 */

/** @param {unknown} value @returns {Record<string, unknown>|null} */
function asRecord(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : null;
}

/** @param {unknown} outcome @returns {string} */
function settlementKeyOf(outcome) {
  const record = asRecord(outcome);
  const payload = asRecord(record?.proposalPayload);
  const args = asRecord(payload?.args);
  const values = [
    record?.targetSaveId,
    record?.settlementId,
    record?.saveId,
    record?.targetId,
    payload?.settlementId,
    payload?.targetSaveId,
    args?.settlementId,
    args?.targetId,
    args?.ownerId,
    args?.patronId,
  ];
  const value = values.find(candidate => (
    typeof candidate === 'string'
    || (typeof candidate === 'number' && Number.isFinite(candidate))
  ));
  return value == null ? 'realm' : String(value);
}

/** @param {unknown} candidate @returns {boolean} */
function requiresProposalAdmission(candidate) {
  const record = asRecord(candidate);
  return record?.applyMode === 'proposal'
    && !isStateOnlyOutcome(candidate)
    && !isSuppressionOnlyOutcome(candidate);
}

/** @param {unknown} candidate @returns {string} */
function stableAdmissionKey(candidate) {
  const record = asRecord(candidate);
  return String(record?.id || [
    record?.candidateType || record?.type || 'proposal',
    settlementKeyOf(candidate),
  ].join(':'));
}

/** @param {unknown} left @param {unknown} right @returns {number} */
function compareAdmissionKeys(left, right) {
  const a = stableAdmissionKey(left);
  const b = stableAdmissionKey(right);
  return a < b ? -1 : a > b ? 1 : 0;
}

/** @param {Record<string, ProposalLaneCounts>} counts @param {string} key */
function countsAt(counts, key) {
  return counts[key] || { minor: 0, major: 0 };
}

/**
 * Build the read-only admission snapshot from unresolved, still-actionable
 * proposal rows. Resolved rows and v3 mechanical questions awaiting v4
 * supersession consume no attention.
 *
 * Above the established 24-settlement base, each global lane grows only with
 * sqrt(N), matching the realm-wide decision-throughput law. Per-settlement caps
 * remain local and constant.
 *
 * @param {unknown} worldState
 * @param {number} [realmSize]
 * @returns {ProposalDocket}
 */
export function buildProposalDocket(worldState, realmSize = 0) {
  const state = asRecord(worldState);
  const rows = Array.isArray(state?.proposals) ? state.proposals : [];
  const counts = { minor: 0, major: 0 };
  /** @type {Record<string, ProposalLaneCounts>} */
  const bySettlement = {};

  for (const raw of rows) {
    const proposal = asRecord(raw);
    if (proposal?.status !== 'pending') continue;
    if (proposalRequiresRecordModeSupersession(proposal)) continue;
    const outcome = proposal?.outcome;
    const lane = isMajorOutcome(outcome) ? 'major' : 'minor';
    const settlementKey = settlementKeyOf(outcome);
    counts[lane] += 1;
    const local = countsAt(bySettlement, settlementKey);
    bySettlement[settlementKey] = { ...local, [lane]: local[lane] + 1 };
  }

  const scaleBonus = sublinearBonus(
    realmSize,
    REALM_SCALING.BASE_REALM,
    REALM_SCALING.PROPOSAL_SCALE_PER_ROOT,
  );
  return {
    caps: {
      minor: PROPOSAL_DOCKET_POLICY.baseMinorPending + scaleBonus,
      major: PROPOSAL_DOCKET_POLICY.baseMajorPending + scaleBonus,
      perSettlementMinor: PROPOSAL_DOCKET_POLICY.perSettlementMinorPending,
      perSettlementMajor: PROPOSAL_DOCKET_POLICY.perSettlementMajorPending,
    },
    counts,
    bySettlement,
  };
}

/**
 * Whether a proposal candidate has room in both its realm-global lane and its
 * settlement-local lane. Major and minor lanes are independent so a flood of
 * routine questions can never consume major-choice capacity.
 *
 * @param {ProposalDocket} docket
 * @param {unknown} candidate
 * @returns {boolean}
 */
export function proposalDocketAllows(docket, candidate) {
  const lane = isMajorOutcome(candidate) ? 'major' : 'minor';
  const settlementKey = settlementKeyOf(candidate);
  const local = countsAt(docket.bySettlement, settlementKey);
  return docket.counts[lane] < docket.caps[lane]
    && local[lane] < (
      lane === 'major'
        ? docket.caps.perSettlementMajor
        : docket.caps.perSettlementMinor
    );
}

/**
 * Return the next admission snapshot after one proposal actually passes its
 * roll. Failed rolls never consume a slot.
 *
 * @param {ProposalDocket} docket
 * @param {unknown} candidate
 * @returns {ProposalDocket}
 */
export function recordProposalAdmission(docket, candidate) {
  const lane = isMajorOutcome(candidate) ? 'major' : 'minor';
  const settlementKey = settlementKeyOf(candidate);
  const local = countsAt(docket.bySettlement, settlementKey);
  return {
    ...docket,
    counts: { ...docket.counts, [lane]: docket.counts[lane] + 1 },
    bySettlement: {
      ...docket.bySettlement,
      [settlementKey]: { ...local, [lane]: local[lane] + 1 },
    },
  };
}

/**
 * Admit guaranteed organic proposal outcomes as one deterministic batch.
 * Guaranteed work has priority over stochastic questions; proposal contenders
 * are ranked by stable identity, while the returned array retains its supplied
 * ordering for every admitted outcome. Non-proposals and record-only lanes are
 * always retained and never consume capacity.
 *
 * @template T
 * @param {ProposalDocket} docket
 * @param {T[]} outcomes
 * @returns {{ outcomes: T[], docket: ProposalDocket }}
 */
export function admitGuaranteedProposalOutcomes(docket, outcomes) {
  const proposals = outcomes
    .filter(requiresProposalAdmission)
    .sort(compareAdmissionKeys);
  /** @type {Set<T>} */
  const admitted = new Set();
  let nextDocket = docket;
  for (const proposal of proposals) {
    if (!proposalDocketAllows(nextDocket, proposal)) continue;
    admitted.add(proposal);
    nextDocket = recordProposalAdmission(nextDocket, proposal);
  }
  return {
    outcomes: outcomes.filter(outcome => (
      !requiresProposalAdmission(outcome) || admitted.has(outcome)
    )),
    docket: nextDocket,
  };
}
