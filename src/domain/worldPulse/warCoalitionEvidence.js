/**
 * warCoalitionEvidence.js — WR-6's typed behavioral-fact boundary.
 *
 * Coalition mechanics may attach one fact or a list of facts to
 * `outcome.metadata.coalitionEvidence`, or pass an already-canonical row. This
 * leaf normalizes those shapes into the single evidence contract consumed by
 * the governed news projector. It does not infer that a call, refusal, payment,
 * or peace happened from ambient graph state: absent typed evidence is silence.
 */

import { WAR_COALITION_KINDS } from './eventProse.js';

const KIND_SET = new Set(WAR_COALITION_KINDS);
export const COALITION_REFUSAL_CAUSES = Object.freeze([
  'strategic',
  'army_committed',
  'army_returned',
  'home_threatened',
  'occupied',
  'front_infeasible',
]);
const REFUSAL_CAUSE_SET = new Set(COALITION_REFUSAL_CAUSES);
const THIRD_PARTY_KINDS = new Set([
  'coalition_entry_priced',
  'coalition_joined',
  'coalition_refused',
  'casus_alliance_obligation',
  'coalition_stayed',
  'coalition_separate_peace',
]);
const QUALITATIVE_BANDS = new Set([
  'none', 'quiet', 'light', 'low', 'small',
  'present', 'modest', 'moderate', 'fair',
  'pressing', 'high', 'heavy', 'large',
  'decisive', 'severe', 'extreme', 'greatest',
]);
const BAND_FIELDS = Object.freeze([
  'band', 'riskBand', 'expenditureBand', 'costBand',
  'shareBand', 'paymentBand', 'burdenBand', 'adequacyBand', 'claimBand',
]);

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @param {unknown} value @returns {number|null} */
function wholeTick(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : null;
}

/**
 * Canonicalize one explicit WR-6 fact. `callerId` is the compact's other party;
 * when a joined deployment supplies attacker/target plus caller, the target is
 * retained as the third party rather than being mistaken for the caller.
 * Private provenance fields remain structured evidence and are never rendered.
 *
 * @param {unknown} evidence
 * @param {{sourceId?:unknown,tick?:unknown}} [fallback]
 * @returns {Record<string, unknown>|null}
 */
export function normalizeWarCoalitionEvidence(evidence, fallback = {}) {
  const row = asObject(evidence);
  const receipt = asObject(row.receipt);
  const merged = { ...receipt, ...row };
  const rowKind = text(row.kind);
  const directKind = KIND_SET.has(rowKind) ? rowKind : text(row.candidateType);
  const kind = KIND_SET.has(directKind) ? directKind : text(receipt.kind);
  if (!KIND_SET.has(kind)) return null;

  const id = text(merged.id || merged.sourceEventId || merged.evidenceId || fallback.sourceId);
  const tick = wholeTick(merged.tick ?? fallback.tick);
  const settlementId = text(merged.settlementId || merged.actorId || merged.attackerId);
  const callerId = text(merged.callerId);
  const targetId = text(merged.targetId);
  const counterpartId = text(
    merged.counterpartId || callerId || merged.opponentId || targetId,
  );
  const thirdPartyId = text(
    merged.thirdPartyId || merged.enemyId || (callerId && targetId ? targetId : ''),
  );
  if (!id || tick == null || !settlementId || !counterpartId
    || settlementId === counterpartId) return null;
  if (THIRD_PARTY_KINDS.has(kind)
    && (!thirdPartyId || thirdPartyId === settlementId || thirdPartyId === counterpartId)) return null;

  const normalized = { ...merged };
  if (kind === 'coalition_refused') {
    const refusalCause = text(normalized.refusalCause);
    if (REFUSAL_CAUSE_SET.has(refusalCause)) normalized.refusalCause = refusalCause;
    else delete normalized.refusalCause;
  } else {
    delete normalized.refusalCause;
  }
  for (const field of BAND_FIELDS) {
    if (!Object.hasOwn(normalized, field)) continue;
    const value = text(normalized[field]);
    if (!QUALITATIVE_BANDS.has(value)) delete normalized[field];
    else normalized[field] = value;
  }

  return {
    ...normalized,
    kind,
    id,
    tick,
    settlementId,
    counterpartId,
    ...(thirdPartyId ? { thirdPartyId } : {}),
  };
}

/** @param {Record<string, unknown>} outcome @returns {unknown[]} */
function attachedEvidence(outcome) {
  const metadata = asObject(outcome.metadata);
  const attached = metadata.coalitionEvidence ?? outcome.coalitionEvidence;
  if (Array.isArray(attached)) return attached;
  if (attached && typeof attached === 'object') return [attached];
  const directKind = KIND_SET.has(text(outcome.candidateType))
    ? text(outcome.candidateType)
    : text(outcome.kind);
  return KIND_SET.has(directKind)
    ? [{ ...outcome, kind: directKind }]
    : [];
}

/**
 * Read canonical WR-6 facts from one outcome. The outcome id/tick may complete
 * an attached evidence row, but identities and kinds must be explicit on that
 * row. Duplicate source-kind facts fold deterministically.
 *
 * @param {unknown} outcome
 * @returns {Array<Record<string, unknown>>}
 */
export function warCoalitionEvidenceFromOutcome(outcome) {
  const source = asObject(outcome);
  const sourceId = text(source.id || source.sourceEventId);
  const sourceTick = source.tick;
  const byIdentity = new Map();
  for (const candidate of attachedEvidence(source)) {
    const fact = normalizeWarCoalitionEvidence(candidate, { sourceId, tick: sourceTick });
    if (!fact) continue;
    const identity = `${fact.kind}\u0000${fact.id}`;
    if (!byIdentity.has(identity)) byIdentity.set(identity, fact);
  }
  return [...byIdentity.values()].sort((left, right) => {
    const a = `${left.kind}\u0000${left.id}`;
    const b = `${right.kind}\u0000${right.id}`;
    return a < b ? -1 : a > b ? 1 : 0;
  });
}

/**
 * Batch companion for pulse composition. Input order and retries cannot change
 * the result or duplicate a source-kind fact.
 *
 * @param {unknown[]} outcomes
 * @returns {Array<Record<string, unknown>>}
 */
export function warCoalitionEvidenceFromOutcomes(outcomes = []) {
  const byIdentity = new Map();
  for (const outcome of Array.isArray(outcomes) ? outcomes : []) {
    for (const fact of warCoalitionEvidenceFromOutcome(outcome)) {
      const identity = `${fact.kind}\u0000${fact.id}`;
      if (!byIdentity.has(identity)) byIdentity.set(identity, fact);
    }
  }
  return [...byIdentity.values()].sort((left, right) => {
    const a = `${left.kind}\u0000${left.id}`;
    const b = `${right.kind}\u0000${right.id}`;
    return a < b ? -1 : a > b ? 1 : 0;
  });
}
