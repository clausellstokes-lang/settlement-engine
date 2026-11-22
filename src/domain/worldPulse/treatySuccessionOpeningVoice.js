/**
 * GR-4b-iii-a: compose the public beat for a newly opened succession question.
 *
 * The landed decision owns proposal insertion. This wrapper snapshots proposal identity,
 * invokes that decision exactly once, then narrates only complete pending rows inserted by
 * that call. Presentation fails closed without vetoing or rewriting the proposal. Names
 * come only from the persisted instrument: both courts from its orientation and `{npc}`
 * from the fallen holder's oath stamp. No successor lookup, clock, draw or ordering step
 * belongs here.
 *
 * @enforced-by tests/domain/treatySuccessionOpeningVoice.test.js
 *   + tests/lint/grammarLifecycleKindPools.walker.test.js
 */

import { grammarReceipt } from './grammarNews.js';
import { swornPartiesOf } from './oathHolder.js';
import { stablePart } from './stablePart.js';
import { treatyLedgerOf } from './treatyEnforcement.js';
import { treatyOrientationOf } from './treatyOrientation.js';
import {
  resolveSuccessionQuestions, successionQuestionPayloadTuple,
} from './treatySuccessionDecision.js';

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
 * @param {Record<string, unknown>} proposal
 * @param {[import('./treatySuccession.js').SuccessionQuestion, number, string, string,
 *   'proposal'|'auto', Record<string, unknown>]} tuple
 * @param {Record<string, Record<string, unknown>>} ledger
 * @returns {Array<Record<string, unknown>>}
 */
function openingBeat(proposal, tuple, ledger) {
  const [question, openedTick, , outcomeId] = tuple;
  const treaty = ledger[question.treatyKey];
  if (!treaty || typeof treaty !== 'object' || Array.isArray(treaty)) return [];
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
  const receipt = grammarReceipt('succession_question_opened', outcomeId, {
    settlement: settlementName, counterpart: counterpartName, npc,
  });
  if (!receipt) return [];
  const parties = Array.isArray(treaty.parties) ? [...treaty.parties] : [];
  if (!parties.includes(question.settlementId) || !parties.includes(question.otherId)) return [];
  const outcome = proposal.outcome && typeof proposal.outcome === 'object'
    ? /** @type {Record<string, unknown>} */ (proposal.outcome) : {};
  const reasons = Array.isArray(outcome.reasons) ? [...outcome.reasons] : [];
  if (!reasons.length) return [];
  return [{
    id: `wizard_news.${openedTick}.succession_question_opened.${stablePart(outcomeId)}`,
    kind: 'succession_question_opened',
    impactKind: 'succession_question_opened',
    significance: receipt.significance,
    severity: 0.56,
    score: 58,
    tick: openedTick,
    scope: 'regional',
    headline: `${settlementName}'s new seat weighs the oath sworn to ${counterpartName}`,
    summary: receipt.line,
    reasons,
    settlementIds: [question.settlementId, question.otherId],
    settlementNames: [settlementName, counterpartName],
    parties,
    sourceEventId: outcomeId,
    familyId: receipt.familyId,
    audience: receipt.audience,
    section: receipt.section,
    tags: ['world_pulse', 'pact_grammar', 'lifecycle'],
  }];
}

/**
 * Resolve succession questions once and append one opening beat per valid new pending row.
 * @param {Record<string, unknown>} worldState @param {unknown} tick @param {unknown} now
 * @returns {{worldState:Record<string, unknown>, newsEntries:Array<Record<string, unknown>>}}
 */
export function resolveSuccessionQuestionsWithOpeningVoice(worldState, tick, now) {
  const beforeIds = new Set(
    (Array.isArray(worldState.proposals) ? worldState.proposals : [])
      .map((proposal) => proposal?.id),
  );
  const result = resolveSuccessionQuestions(worldState, tick, now);
  const proposals = Array.isArray(result.worldState.proposals) ? result.worldState.proposals : [];
  const ledger = treatyLedgerOf(result.worldState) || {};
  const openingBeats = [];
  for (const proposal of proposals) {
    if (!proposal || typeof proposal !== 'object' || beforeIds.has(proposal.id)
        || proposal.status !== 'pending') continue;
    const tuple = successionQuestionPayloadTuple(proposal.outcome);
    if (!tuple) continue;
    openingBeats.push(...openingBeat(proposal, tuple, ledger));
  }
  return { ...result, newsEntries: [...result.newsEntries, ...openingBeats] };
}
