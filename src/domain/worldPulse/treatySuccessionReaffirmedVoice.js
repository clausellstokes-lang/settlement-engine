/**
 * GR-4b-ii-W2: the HONOR terminal, answered aloud.
 *
 * The store owns the dismiss road; this leaf performs that one transition through the
 * existing status writer and narrates the single beat it earns. It is mounted AT the
 * transition rather than re-derived at the treaty stage, and that is what makes
 * exactly-once STRUCTURAL rather than timestamp-derived: the caller's compare-and-set on
 * `pending` is repeated here, no path anywhere returns a dismissed row to pending, and the
 * canonical feed append collapses two entries sharing one id. Nothing is persisted beyond
 * the status the store already wrote, and no stamp is ever read back to decide whether to
 * speak — which is exactly why this road owes no new persisted key and the EXPIRY road,
 * having no transition site at all, is not part of this wave.
 *
 * Presentation fails closed and never vetoes mechanics: an unaddressable dismissal is
 * still a dismissal, so every silent return below has already made the status write.
 * Names come only from the persisted instrument — both courts from its orientation and
 * `{npc}` from the fallen holder's own oath stamp, never the successor, who is on no
 * surface this road can read. No roster lookup, clock, draw or ordering step belongs here.
 *
 * @enforced-by tests/domain/treatySuccessionReaffirmedVoice.test.js
 *   + tests/lint/grammarLifecycleKindPools.walker.test.js
 */

import { grammarReceipt } from './grammarNews.js';
import { swornPartiesOf } from './oathHolder.js';
import { stablePart } from './stablePart.js';
import { isSuccessionDisavowable } from './treatySuccession.js';
import { successionQuestionPayloadTuple } from './treatySuccessionDecision.js';
import { treatyLedgerOf } from './treatyEnforcement.js';
import { treatyOrientationOf } from './treatyOrientation.js';
import { updateProposalStatus } from './worldState.js';

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** A persisted reader name, never an id echoed back as a name.
 * @param {string} id @param {string} name */
function readerName(id, name) {
  const resolved = text(name);
  return resolved && resolved !== text(id) ? resolved : '';
}

/** @param {ReturnType<typeof treatyOrientationOf>} orientation @param {string} id */
function courtName(orientation, id) {
  if (orientation.obligeeId === id) return readerName(id, orientation.obligeeName);
  if (orientation.obligorId === id) return readerName(id, orientation.obligorName);
  return '';
}

/**
 * The zero-or-one beat a dismissed row earns, composed from the world AS DISMISSED.
 *
 * ⭐ THE LIVENESS GATE IS THE HONESTY WARRANT. `isSuccessionDisavowable` is the one
 * exported eligibility predicate: it refuses a repudiation-breached record, a defaulted
 * compliance state, an instrument with no live term, and a stamp that does not name this
 * exact fallen holder. The corrected corpus may say "the oath stands" only because that
 * predicate has already said so — re-spelling any of its four checks here would fork the
 * rule into a second home.
 *
 * @param {Record<string, unknown>} proposal
 * @param {Record<string, unknown>} worldState the world AFTER the status write
 * @param {number} tick
 * @returns {Array<Record<string, unknown>>}
 */
function reaffirmedBeat(proposal, worldState, tick) {
  const tuple = successionQuestionPayloadTuple(proposal.outcome);
  if (!tuple) return [];
  const [question, , , outcomeId] = tuple;
  const treaty = (treatyLedgerOf(worldState) || {})[question.treatyKey];
  if (!treaty || typeof treaty !== 'object' || Array.isArray(treaty)) return [];
  if (!isSuccessionDisavowable(treaty, question.settlementId, question.npcId, tick)) return [];
  const orientation = treatyOrientationOf(treaty);
  if (!orientation.resolved || question.settlementId === question.otherId) return [];
  const settlementName = courtName(orientation, question.settlementId);
  const counterpartName = courtName(orientation, question.otherId);
  if (!settlementName || !counterpartName) return [];
  const fallen = swornPartiesOf(treaty).find((stamp) => (
    stamp.settlementId === question.settlementId && stamp.npcId === question.npcId
  ));
  const npc = fallen ? readerName(fallen.npcId, fallen.name) : '';
  if (!npc) return [];
  const outcome = proposal.outcome && typeof proposal.outcome === 'object'
    ? /** @type {Record<string, unknown>} */ (proposal.outcome) : {};
  // The RECORDED reason, read back off the row rather than re-spelled here (news address
  // law). A beat shipping empty reasons passes every walker and then collides with its own
  // siblings under the feed's repeat suppression.
  const reasons = Array.isArray(outcome.reasons) ? [...outcome.reasons] : [];
  if (!reasons.length) return [];
  // The validated outcome identity is the seed, and `grammarReceipt` namespaces every seed
  // by kind — so this pool's pick is independent of the opening beat's pick on the same row.
  const receipt = grammarReceipt('reaffirmed', outcomeId, {
    settlement: settlementName, counterpart: counterpartName, npc,
  });
  if (!receipt) return [];
  const parties = Array.isArray(treaty.parties) ? [...treaty.parties] : [];
  if (!parties.includes(question.settlementId) || !parties.includes(question.otherId)) return [];
  return [{
    id: `wizard_news.${tick}.reaffirmed.${stablePart(outcomeId)}`,
    kind: 'reaffirmed',
    // ⛔ LITERAL, never a shared constant: the SINGLE_PRODUCER_KEYS walker pins a token to
    // one producer, so a constant borrowed from a sibling would inherit its desk in silence.
    impactKind: 'reaffirmed',
    significance: receipt.significance,
    // The landed `notable` GR pair, copied from the opening beat rather than re-derived as
    // a second weight spelling for the same cohort.
    severity: 0.56,
    score: 58,
    tick,
    scope: 'regional',
    headline: `${settlementName}'s new seat keeps the oath sworn to ${counterpartName}`,
    summary: receipt.line,
    reasons,
    settlementIds: [question.settlementId, question.otherId],
    settlementNames: [settlementName, counterpartName],
    parties,
    ending: 'reaffirmed',
    familyId: receipt.familyId,
    audience: receipt.audience,
    section: receipt.section,
    tags: ['world_pulse', 'pact_grammar', 'lifecycle'],
  }];
}

/**
 * Dismiss one proposal through the existing status writer, and narrate the beat it earns.
 *
 * @param {Record<string, unknown>} worldState
 * @param {string} proposalId
 * @param {number} tick the tick the world last advanced to — a FEED-ORDERING stamp only,
 *   never read back as a derivation key (see the module header on exactly-once)
 * @param {string} now the caller's own wall-clock stamp, passed through unchanged
 * @returns {{worldState:Record<string, unknown>, newsEntries:Array<Record<string, unknown>>}}
 *   `newsEntries` is always an array, never null and never absent.
 */
export function dismissSuccessionQuestionWithVoice(worldState, proposalId, tick, now) {
  const proposals = Array.isArray(worldState?.proposals) ? worldState.proposals : null;
  const row = proposals ? proposals.find((proposal) => (
    proposal && typeof proposal === 'object' && proposal.id === proposalId
  )) : null;
  // ⛔ THE CAS, and it is the exactly-once guard. Anything but `pending` — a second click,
  // an already-terminal row, a concurrent invocation — is a total no-op that writes no
  // status and returns the CALLER'S OWN reference, so a dark world is byte-identical.
  if (!row || row.status !== 'pending') return { worldState, newsEntries: [] };
  const next = updateProposalStatus(worldState, proposalId, 'dismissed', { dismissedAt: now });
  return { worldState: next, newsEntries: reaffirmedBeat(row, next, tick) };
}
