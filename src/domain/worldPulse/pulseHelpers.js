// pulseHelpers — the shared low-level helpers used by BOTH the one-week kernel
// (pulseKernel.js) and the multi-tick interval orchestrator (advanceInterval.js):
// the clone shim, the history/digest compactors, the save-id resolver, and the
// interval normalizer. Imports nothing internal to worldPulse (acyclic base of
// the pulseHelpers ← pulseKernel ← advanceInterval ← barrel chain).
import { deepClone } from '../clone.js';

/** @typedef {import('./pulseShapes.js').PulseOutcome} PulseOutcome */
/** @typedef {{ outcome?: PulseOutcome|null, recordModeVersion?: unknown }} RecordModeProposal */
/** @typedef {{ consequenceOutcomes?: PulseOutcome[], selectedOutcomes?: PulseOutcome[] }} PulseHistoryRecord */

/** Record-only lanes carried by outcome producers into the central pulse seams. */
const STATE_ONLY_RECORD_MODE = 'state_only';
const SUPPRESSION_ONLY_RECORD_MODE = 'suppression_only';
// Pending proposals are durable and may be approved long after the tick that
// minted them. Version the proposal row at the record-mode policy boundary so
// the apply seam can distinguish a current, intentionally public question from
// an ambiguous pre-v4 copy of a family whose Chronicle meaning changed.
const RECORD_MODE_PROPOSAL_VERSION = 4;
const LEGACY_RECORD_MODE_CANDIDATE_TYPES = new Set([
  'npc_goal_rebranch',
]);
const ALWAYS_SUPERSEDED_PROPOSAL_TYPES = new Set([
  'strategy_defend',
  'strategy_hold',
]);
// Keep the durable mechanical audit inside the provenance ledger's 4,096-edge
// history horizon: 24 public outcomes + 8 mechanical outcomes + 18 impact rows
// = 50 receipts/tick × 80 retained ticks = 4,000.
const MAX_MECHANICAL_OUTCOMES_PER_PULSE = 8;
// Private rumor replay is behavioral state, not provenance audit. Give it the
// same bounded horizon as interval collapse so the audit cap cannot crowd out
// a later significant seed before information mode is enabled.
const MAX_MECHANICAL_RUMOR_SEEDS_PER_PULSE = 48;

/** @param {any} value */
function clone(value) {
  return value == null ? value : deepClone(value);
}

/** @param {unknown} outcome */
function isStateOnlyOutcome(outcome) {
  const record = /** @type {{ recordMode?: unknown }|null|undefined} */ (outcome);
  return record?.recordMode === STATE_ONLY_RECORD_MODE;
}

/** @param {unknown} outcome */
function isSuppressionOnlyOutcome(outcome) {
  const record = /** @type {{ recordMode?: unknown }|null|undefined} */ (outcome);
  return record?.recordMode === SUPPRESSION_ONLY_RECORD_MODE;
}

/** @param {unknown} outcome */
function isPublicOutcome(outcome) {
  return !isStateOnlyOutcome(outcome) && !isSuppressionOnlyOutcome(outcome);
}

/**
 * Manual-apply fail-closed guard for durable proposal rows crossing the v4
 * record-mode upgrade. Hold/defend are now conflict suppressors and can never
 * be approved. For mixed families, only an unversioned legacy row is
 * ambiguous: v4 proposal rows are stamped when minted, so legitimate public
 * transitions (major population movement, a real NPC goal change, or a war
 * onset/band change) remain approvable.
 * @param {RecordModeProposal|null|undefined} proposal
 */
function proposalRequiresRecordModeSupersession(proposal) {
  const outcome = proposal?.outcome;
  const candidateType = String(outcome?.candidateType || '');
  if (ALWAYS_SUPERSEDED_PROPOSAL_TYPES.has(candidateType)) return true;
  if (isStateOnlyOutcome(outcome) || isSuppressionOnlyOutcome(outcome)) return true;
  const version = Number(proposal?.recordModeVersion);
  return LEGACY_RECORD_MODE_CANDIDATE_TYPES.has(candidateType)
    && (!Number.isFinite(version) || version < RECORD_MODE_PROPOSAL_VERSION);
}

/**
 * Internal history read-model for simulation mechanics. Public/display readers
 * intentionally consume selectedOutcomes only; domain readers must also see the
 * the exact legacy consequence window or moving state-only receipts out of the
 * Chronicle would alter next-tick consequence math. consequenceOutcomes is
 * written only when the public/mechanical split exists and preserves the
 * original selectedForApply.slice(0, 24) ordering and bound.
 * @param {PulseHistoryRecord|null|undefined} pulseRecord
 * @returns {PulseOutcome[]}
 */
function outcomesForMechanicalHistory(pulseRecord) {
  if (Array.isArray(pulseRecord?.consequenceOutcomes)) {
    return pulseRecord.consequenceOutcomes;
  }
  const selected = Array.isArray(pulseRecord?.selectedOutcomes)
    ? pulseRecord.selectedOutcomes
    : [];
  return selected;
}

/** @param {any} [patch] */
function compactNpcPatch(patch = null) {
  if (!patch) return null;
  return {
    shortGoal: patch.shortGoal || null,
    longGoal: patch.longGoal || null,
    contextSignature: patch.contextSignature || null,
    contextTier: patch.contextTier || null,
    dotRank: patch.dotRank ?? null,
    factionSeat: patch.factionSeat || null,
    lastAction: patch.lastAction || null,
  };
}

/** @param {any} [outcome] */
function compactOutcomeForHistory(outcome = {}) {
  return {
    id: outcome.id,
    // Preserve the covert marker on the DURABLE receipt: causeWalk's receiptIsCovert redaction
    // reads top-level `covert` (and stressor.covert, below) to hide a covert cause's headline from
    // non-DM viewers. Dropping them here let a covert coup/corruption cause leak its true headline
    // through a compacted pulseHistory receipt. Conditional ⇒ byte-identical for non-covert outcomes.
    ...(outcome.covert === true ? { covert: true } : {}),
    type: outcome.type || null,
    candidateType: outcome.candidateType || null,
    ruleId: outcome.ruleId || null,
    ruleFamily: outcome.ruleFamily || null,
    targetSaveId: outcome.targetSaveId || null,
    relationshipKey: outcome.relationshipKey || null,
    npcId: outcome.npcId || null,
    factionId: outcome.factionId || null,
    severity: outcome.severity ?? null,
    probability: outcome.probability ?? null,
    roll: outcome.roll ?? null,
    applyMode: outcome.applyMode || null,
    ...(outcome.recordMode ? { recordMode: outcome.recordMode } : {}),
    ...(outcome.recordMode === STATE_ONLY_RECORD_MODE
      && (outcome.tierChange || outcome.powerTransfer || outcome.resourcePatch
        || outcome.institutionPatch || outcome.condition || outcome.stressor
        || outcome.relationshipKey || outcome.relationshipPatch
        || outcome.proposalPayload || outcome.lifecyclePatch)
      ? { curationClass: 'transition' }
      : {}),
    headline: outcome.headline || 'World pulse outcome',
    summary: outcome.summary || '',
    reasons: (outcome.reasons || []).slice(0, 4),
    metadata: clone(outcome.metadata || null),
    populationDeltas: clone(outcome.populationDeltas || null),
    tierChange: clone(outcome.tierChange || null),
    resourcePatch: clone(outcome.resourcePatch || null),
    institutionPatch: clone(outcome.institutionPatch || null),
    proposalPayload: clone(outcome.proposalPayload || null),
    npcPatch: compactNpcPatch(outcome.npcPatch),
    relationshipPatch: clone(outcome.relationshipPatch || null),
    powerTransfer: clone(outcome.powerTransfer || null),
    stressor: outcome.stressor
      ? {
          id: outcome.stressor.id,
          type: outcome.stressor.type,
          label: outcome.stressor.label,
          severity: outcome.stressor.severity,
          affectedSettlementIds: clone(outcome.stressor.affectedSettlementIds || []),
          // Carry the stressor's covert marker (see receiptIsCovert above) — conditional ⇒
          // byte-identical when the stressor is not covert.
          ...(outcome.stressor.covert === true ? { covert: true } : {}),
        }
      : null,
  };
}

/** @param {any[]} [entries] */
function compactImpactDigest(entries = []) {
  return entries
    .filter(Boolean)
    .map(entry => ({
      id: entry.id,
      headline: entry.headline || 'World pulse impact',
      summary: entry.summary || '',
      kind: entry.kind || 'queued',
      scope: entry.scope || 'regional',
      significance: entry.significance || 'notable',
      score: entry.score ?? 0,
      impactKind: entry.impactKind || null,
      channelType: entry.channelType || null,
      severity: entry.severity ?? null,
      settlementIds: clone(entry.settlementIds || []),
      impactIds: clone(entry.impactIds || []),
      channelIds: clone(entry.channelIds || []),
      tags: clone((entry.tags || []).slice(0, 8)),
      reasons: clone((entry.reasons || []).slice(0, 4)),
    }))
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 18);
}

/** @param {any} save */
function saveId(save) {
  return String(save?.id || save?.settlement?.id || save?.name || 'unknown');
}

const VALID_INTERVALS = new Set(['one_week', 'one_month', 'one_season', 'one_year']);

/**
 * @param {any} interval
 * @returns {import('../settlement.schema.js').TickInterval}
 */
function usableTickInterval(interval) {
  return VALID_INTERVALS.has(interval) ? interval : 'one_month';
}

// performance-scale-5: the PERSISTED pulseRecord.rollExplanations was the only
// uncapped field in worldState (its siblings — selectedOutcomes / corruptionEvents /
// factionCaptureEvents — all slice(0, 24)). candidateEvents pushes an explanation for
// EVERY rolled candidate (passed AND missed) plus every deterministic outcome; at 30
// settlements with the war/faction lanes on, a tick rolls 100+ candidates (~300B each),
// so one record reaches 30-50KB and the MAX_HISTORY=80 ring holds 2-4MB — riding every
// Supabase upsert, localStorage cache write, and undo snapshot. RETENTION: keep every
// deterministic + every PASSED roll (the meaningful, low-count set an event fired from)
// and only the FIRST MAX_PERSISTED_MISSED_ROLL_EXPLANATIONS *missed* rolls (the bulk on
// a busy tick), preserving original order. The cap is far above any golden / realistic
// per-record count (measured max ~65 missed at 12 settlements × 60 ticks; the cl0 pin
// captures the RETURN value, not this persisted field), so short-horizon records are
// byte-identical (nothing dropped). The FULL uncapped set still rides the RETURN value
// (the tick result → session UI, which renders only 18) — only the PERSISTED copy is
// bounded.
const MAX_PERSISTED_MISSED_ROLL_EXPLANATIONS = 48;

/**
 * Cap the persisted rollExplanations: all deterministic + all passed + the first K
 * missed, in original order. Byte-identical when the record holds ≤ K missed rolls
 * (nothing is dropped or reordered).
 * @param {Array<{ passed?: boolean }>} deterministicExplanations
 * @param {Array<{ passed?: boolean }>} rollExplanations
 * @returns {Array<{ passed?: boolean }>}
 */
function capPersistedRollExplanations(deterministicExplanations = [], rollExplanations = []) {
  const combined = [...deterministicExplanations, ...rollExplanations];
  let missedBudget = MAX_PERSISTED_MISSED_ROLL_EXPLANATIONS;
  const kept = [];
  for (const e of combined) {
    if (e && e.passed === false) {
      if (missedBudget <= 0) continue;
      missedBudget -= 1;
    }
    kept.push(e);
  }
  return kept;
}

export {
  STATE_ONLY_RECORD_MODE,
  SUPPRESSION_ONLY_RECORD_MODE,
  RECORD_MODE_PROPOSAL_VERSION,
  MAX_MECHANICAL_OUTCOMES_PER_PULSE,
  MAX_MECHANICAL_RUMOR_SEEDS_PER_PULSE,
  clone,
  isStateOnlyOutcome,
  isSuppressionOnlyOutcome,
  isPublicOutcome,
  proposalRequiresRecordModeSupersession,
  outcomesForMechanicalHistory,
  compactNpcPatch,
  compactOutcomeForHistory,
  compactImpactDigest,
  saveId,
  VALID_INTERVALS,
  usableTickInterval,
  MAX_PERSISTED_MISSED_ROLL_EXPLANATIONS,
  capPersistedRollExplanations,
};
