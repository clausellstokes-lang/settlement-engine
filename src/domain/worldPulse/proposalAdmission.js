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
 *
 * The cap is an attention budget, and a budget may only ration work that can
 * come back. A ONE-SHOT VERDICT cannot: its trigger is consumed in the same tick
 * that produces it, so a deferral is a deletion. Those outcomes are admitted
 * regardless of saturation (ONE_SHOT_VERDICT_RULE_IDS below).
 *
 * And an unanswered question does not hold its place forever: a row nobody has answered for
 * DOCKET_TUNING.expiryWeeks of the world's clock EXPIRES through this module's writer (FP-22 U1,
 * expireUnansweredDocketRows below), and its lane frees in the tick it expires.
 */

import { isActorInitiatedMajorType } from './actorMajorApproval.js';
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
 * FP-22 U1 (the chair's ruling of 2026-09-24, taken under the owner's word of that day, "Again, I leave
 * all judgment to you"; CURE UNIT FP-PEACE-2) — THE DOCKET'S HORIZON. `expiryWeeks`, on the world's
 * 52-week clock, is how long a pending row may wait unanswered before it expires. DRAFT: its row in
 * tests/lint/.tuning-register.json carries the measurement, and the owner signs it at the tuning sitting.
 *
 * THE FLOOR IS A LAW, NOT A TASTE. No row may expire inside the advance that minted it (the DM-attention
 * law the actor-major hold keeps, worldpulse-core-3). The seam that retires the row cannot see the
 * advance's start tick (the kernel threads `intervalStartTick` to expireStaleActorMajors alone, and
 * pulseKernel.js takes no edit), so the horizon itself must reach past the longest advance: one year of
 * fifty-two weekly pulses (INTERVAL_WEEKS.one_year), after which every row has had one panel. The docket's
 * own history measured the same figure from the other side: the longest a row waited before a DM who
 * rules at every panel answered it is exactly one year.
 */
export const DOCKET_TUNING = Object.freeze({
  expiryWeeks: 52,
});

/**
 * The ruleIds whose outcomes are ONE-SHOT VERDICTS: the generating event is
 * consumed in the tick that emits them and cannot re-fire, so an unadmitted one
 * is lost outright rather than re-derived. A coup_detat stressor that resolves
 * leaves ageRoamingStressors as a residual ECHO (stressors.js), and the echo is
 * never handed back to coupVerdictOutcomes; the verdict is the settlement's only
 * one. OWNER RULING 2026-07-30: these bypass the docket cap. Only the FALL branch
 * can be proposal-routed today (a player-locked seat, or the forcing autonomy
 * modes); the hold branch is listed because it is the same spent trigger and must
 * not become droppable if its authority ever moves.
 *
 * MEMBERSHIP CRITERION, applied to every proposal-routed family sharing the
 * guaranteed-admission mouth in pulseKernel: a family belongs here only if its
 * trigger provably cannot re-derive. The two siblings that share the mouth both
 * can, and both stay under the cap:
 *   - strategy_deploy (warDeployment.js) withholds its deployment seed and its
 *     war_front channel under proposal mode, so an unadmitted march re-derives
 *     next tick from war-readiness that was never spent;
 *   - population_growth / _decline / _emigration (populationDynamics.js) apply
 *     no population delta when unadmitted, so the pressure persists and the
 *     candidate re-derives.
 *
 * @type {ReadonlyArray<string>}
 */
export const ONE_SHOT_VERDICT_RULE_IDS = Object.freeze([
  'coup_verdict_fall',
  'coup_verdict_hold',
]);

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

/**
 * Whether this outcome is a one-shot verdict (see ONE_SHOT_VERDICT_RULE_IDS).
 * Keyed on ruleId, so no marker field is added to the outcome shape and the
 * verdict travels the news / pulseRecord lanes byte-identically.
 *
 * @param {unknown} candidate
 * @returns {boolean}
 */
export function isOneShotVerdictOutcome(candidate) {
  const record = asRecord(candidate);
  return ONE_SHOT_VERDICT_RULE_IDS.includes(String(record?.ruleId ?? ''));
}

/**
 * FP-17 (the chair's ruling of 2026-09-24, CURE LANE FP-PEACE-1 U1; vetoable) — THE STALE
 * PEACETIME SUIT RETIRES WHEN THE WAR BEGINS. A `strategy_sue_for_peace` row proposed while its
 * court was at peace asks the DM to step a label down in peacetime. Once a war opens against that
 * court (a live deployment, the court as attacker OR target, whose opening tick is LATER than the
 * row's), the question's premise is dead: a war-time peace is the war-time offer's, and the stale row
 * was holding one of the court's three minor places while nobody could answer it (measured:
 * findings/FP-PEACE-SUIT.md §0 item 2, four of the five refused wars). The docket reads such a row
 * as absent, exactly as it reads a row awaiting record-mode supersession, and the tick's docket-row
 * supersession seam retires it (`retireWarOvertakenPeaceSuits`), so the lane frees at the war's
 * opening. Rows the ruling does not reach keep their places: a suit proposed in or after the war's
 * opening tick (the WR-1-dark war-time suit), a bilateral offer (`proposalPayload.peaceOffer`, the
 * marker `warPeaceDecision.js :: isBilateralPeaceOffer` reads; its reader graph is not imported into
 * this light module), and every other question. The exemption list above is untouched.
 *
 * COURT, NOT PAIR (vetoable): a peacetime row names its counterparty only through the edge id in
 * `relationshipKey`, and neither worldState nor a relationship record carries that edge's endpoints
 * (the regional graph does, and no docket seam receives it), so the retirement reads the suing
 * court's own war. A peacetime suit the court made toward a third court retires with it.
 */
export const WAR_OVERTAKEN_PEACE_SUIT_REASON = 'peacetime_suit_overtaken_by_war';

/**
 * The latest opening tick of a live deployment touching each court, as attacker or as target.
 * @param {Record<string, unknown>|null} state
 * @returns {Map<string, number>}
 */
function latestWarOpeningByCourt(state) {
  /** @type {Map<string, number>} */
  const latest = new Map();
  const deployments = asRecord(state?.deployments);
  if (!deployments) return latest;
  for (const [attackerId, raw] of Object.entries(deployments)) {
    const deployment = asRecord(raw);
    const opened = deployment?.sinceTick;
    if (typeof opened !== 'number' || !Number.isFinite(opened)) continue;
    const targetId = deployment?.targetId;
    const courts = [attackerId, typeof targetId === 'string' || typeof targetId === 'number' ? String(targetId) : ''];
    for (const court of courts) {
      if (!court) continue;
      const prior = latest.get(court);
      if (prior === undefined || opened > prior) latest.set(court, opened);
    }
  }
  return latest;
}

/**
 * @param {unknown} raw a proposal row
 * @param {Map<string, number>} openings from latestWarOpeningByCourt
 * @returns {boolean}
 */
function overtakenByWar(raw, openings) {
  const proposal = asRecord(raw);
  if (proposal?.status !== 'pending' || !openings.size) return false;
  const outcome = asRecord(proposal.outcome);
  if (outcome?.candidateType !== 'strategy_sue_for_peace') return false;
  if (asRecord(outcome.proposalPayload)?.peaceOffer === true) return false;
  const proposedAt = proposal.tick ?? outcome.generatedAtTick;
  if (typeof proposedAt !== 'number' || !Number.isFinite(proposedAt)) return false;
  const court = outcome.targetSaveId;
  const opened = typeof court === 'string' || typeof court === 'number' ? openings.get(String(court)) : undefined;
  return opened !== undefined && opened > proposedAt;
}

/**
 * Whether this pending row is a peacetime suit a war has overtaken (FP-17 above).
 * @param {unknown} proposal
 * @param {unknown} worldState
 * @returns {boolean}
 */
export function peacetimeSuitOvertakenByWar(proposal, worldState) {
  return overtakenByWar(proposal, latestWarOpeningByCourt(asRecord(worldState)));
}

/**
 * THE DOCKET'S WRITER FOR FP-17: retire every pending peacetime suit a war has overtaken, as a
 * terminal 'superseded' row carrying the stamp its readers read, and nothing else: `supersededAt`
 * (the Herald's resolved log times the row by it) and `supersessionReason` (the feed's reconcile
 * retires the row's queued question by it; registered engine-internal in
 * scripts/lib/writer-dark-register.mjs). `supersededAtTick` is deliberately NOT written: no surface
 * and no engine path reads it, and a generated fact nobody reads is the defect the writer-reach
 * walker refuses at ceiling 0 (CURE-PEACE-1, the walker's owed registration). The row is kept as an
 * audit tombstone. The same world reference when nothing is retired.
 * @template T
 * @param {T} worldState
 * @param {{ tick?: number, now?: string|null }} [context]
 * @returns {T}
 */
export function retireWarOvertakenPeaceSuits(worldState, context = {}) {
  const state = asRecord(worldState);
  const rows = state?.proposals;
  if (!state || !Array.isArray(rows) || rows.length === 0) return worldState;
  const openings = latestWarOpeningByCourt(state);
  if (!openings.size) return worldState;
  let changed = false;
  const next = rows.map((raw) => {
    if (!overtakenByWar(raw, openings)) return raw;
    changed = true;
    const proposal = /** @type {Record<string, unknown>} */ (raw);
    return {
      ...proposal,
      status: 'superseded',
      updatedAt: context.now ?? proposal.updatedAt ?? proposal.createdAt ?? null,
      supersededAt: context.now ?? null,
      supersessionReason: WAR_OVERTAKEN_PEACE_SUIT_REASON,
    };
  });
  return changed
    ? /** @type {T} */ (/** @type {unknown} */ ({ ...state, proposals: next }))
    : worldState;
}

/**
 * FP-22 U1 — AN UNANSWERED ROW EXPIRES. A pending row that has waited DOCKET_TUNING.expiryWeeks since it
 * was asked (its own `tick`, else its outcome's `generatedAtTick`) expires: the docket reads it as absent
 * in that tick, so its lane frees for the tick's own admission, and the tick's docket-row supersession
 * seam retires it after admission, exactly as FP-17's overtaken suit is read and retired. The row is kept
 * as an audit tombstone in the estate's retirement shape: 'superseded', with its stamp, its tick and
 * this reason. The receipt is written ONCE, in that tick, by the feed half of the writer
 * (worldPulseFeedCuration.js :: reconcileSupersededProposalNews): one 'expired' entry of the question's
 * own kind. No flag governs the docket, so the horizon binds every campaign.
 *
 * Two families are not this horizon's to expire. The DM's own orders (a realm-verb order, its payload
 * kind DM_ORDER_PAYLOAD_KIND below) are the table's commands, never the docket's questions (the scope in
 * this module's header). A held actor-initiated major keeps its own, shorter hold-then-expire and its own
 * terminal (actorMajorApproval.js :: expireStaleActorMajors, which runs first in every pulse).
 */
export const UNANSWERED_ROW_EXPIRY_REASON = 'unanswered_row_expired';

/**
 * The payload kind of a DM realm-verb order: realmVerbExecution.js :: REALM_VERB_PAYLOAD_KIND, spelled
 * here because that module's graph is not imported into this light one (a pin holds the two equal). Read
 * through the payload's `kind`, a key the executed corpus carries, rather than the outcome's
 * `provenance`, which it never does (the observed-shape readers' ratchet).
 */
const DM_ORDER_PAYLOAD_KIND = 'realm_verb_order';

/**
 * @param {unknown} raw a proposal row
 * @param {unknown} tick the tick being read
 * @returns {boolean}
 */
function expiredUnanswered(raw, tick) {
  const proposal = asRecord(raw);
  if (proposal?.status !== 'pending') return false;
  if (typeof tick !== 'number' || !Number.isFinite(tick)) return false;
  const outcome = asRecord(proposal.outcome);
  if (asRecord(outcome?.proposalPayload)?.kind === DM_ORDER_PAYLOAD_KIND) return false;
  if (isActorInitiatedMajorType(String(outcome?.candidateType ?? ''))) return false;
  const askedAt = proposal.tick ?? outcome?.generatedAtTick;
  if (typeof askedAt !== 'number' || !Number.isFinite(askedAt)) return false;
  return tick - askedAt >= DOCKET_TUNING.expiryWeeks;
}

/**
 * Whether this pending row has waited out the docket's horizon unanswered at `tick` (FP-22 U1 above).
 * @param {unknown} proposal
 * @param {unknown} tick
 * @returns {boolean}
 */
export function proposalExpiredUnanswered(proposal, tick) {
  return expiredUnanswered(proposal, tick);
}

/**
 * THE DOCKET'S WRITER FOR FP-22 U1: expire every pending row that has waited out the horizon, as a
 * terminal 'superseded' row carrying the estate's retirement stamp, and nothing else. The same world
 * reference when nothing expires.
 * @template T
 * @param {T} worldState
 * @param {{ tick?: number, now?: string|null }} [context]
 * @returns {T}
 */
export function expireUnansweredDocketRows(worldState, context = {}) {
  const state = asRecord(worldState);
  const rows = state?.proposals;
  if (!state || !Array.isArray(rows) || rows.length === 0) return worldState;
  const tick = typeof context.tick === 'number' ? context.tick : state.tick;
  if (typeof tick !== 'number' || !Number.isFinite(tick)) return worldState;
  let changed = false;
  const next = rows.map((raw) => {
    if (!expiredUnanswered(raw, tick)) return raw;
    changed = true;
    const proposal = /** @type {Record<string, unknown>} */ (raw);
    return {
      ...proposal,
      status: 'superseded',
      updatedAt: context.now ?? proposal.updatedAt ?? proposal.createdAt ?? null,
      supersededAt: context.now ?? null,
      supersededAtTick: tick,
      supersessionReason: UNANSWERED_ROW_EXPIRY_REASON,
    };
  });
  return changed
    ? /** @type {T} */ (/** @type {unknown} */ ({ ...state, proposals: next }))
    : worldState;
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
  const openings = latestWarOpeningByCourt(state);
  const tick = state?.tick;

  for (const raw of rows) {
    const proposal = asRecord(raw);
    if (proposal?.status !== 'pending') continue;
    if (proposalRequiresRecordModeSupersession(proposal)) continue;
    // FP-17: a peacetime suit a war overtook is read as absent in the war's own opening tick; the
    // tick's supersession seam retires the row after admission.
    if (overtakenByWar(proposal, openings)) continue;
    // FP-22 U1: a row past the docket's horizon is read as absent in the tick it expires, the same way.
    if (expiredUnanswered(proposal, tick)) continue;
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
 * Two passes, both over the same stable-identity ranking. One-shot verdicts go
 * first and unconditionally: their trigger is already spent, so the cap has
 * nothing left to ration. They still RECORD their occupancy, which keeps the
 * lane counts an honest reading of the DM's load and keeps the cap binding on
 * the re-deriving families in the second pass; a saturated lane simply carries
 * the verdict above its cap, the way an over-cap legacy docket already does.
 * Nothing already admitted is evicted, here or in the stochastic lane that
 * inherits this docket.
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
    if (!isOneShotVerdictOutcome(proposal)) continue;
    admitted.add(proposal);
    nextDocket = recordProposalAdmission(nextDocket, proposal);
  }
  for (const proposal of proposals) {
    if (isOneShotVerdictOutcome(proposal)) continue;
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
