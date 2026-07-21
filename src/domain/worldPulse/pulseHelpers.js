// pulseHelpers — the shared low-level helpers used by BOTH the one-week kernel
// (pulseKernel.js) and the multi-tick interval orchestrator (advanceInterval.js):
// the clone shim, the history/digest compactors, the save-id resolver, and the
// interval normalizer. Imports nothing internal to worldPulse (acyclic base of
// the pulseHelpers ← pulseKernel ← advanceInterval ← barrel chain).
import { deepClone } from '../clone.js';

/** @param {any} value */
function clone(value) {
  return value == null ? value : deepClone(value);
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
  clone,
  compactNpcPatch,
  compactOutcomeForHistory,
  compactImpactDigest,
  saveId,
  VALID_INTERVALS,
  usableTickInterval,
  MAX_PERSISTED_MISSED_ROLL_EXPLANATIONS,
  capPersistedRollExplanations,
};
