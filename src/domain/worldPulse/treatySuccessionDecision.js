/**
 * GR-4d: the durable, typed decision boundary for a succession disavowal.
 * Identity is derived only from the complete landed question and its event tick.
 */
import { fnv1a32 } from '../../kernel/proseHash.js';
import { oathHolderActive } from './oathHolder.js';
import { routineMajorApprovalEnabled, SUCCESSION_QUESTION_TERMINALS } from './actorMajorApproval.js';
import { answerSuccessionQuestions } from './treatyBreach.js';
import { successionQuestionsForTick } from './treatySuccession.js';
import { RECORD_MODE_PROPOSAL_VERSION } from './pulseHelpers.js';
import { proposalIdFor, upsertProposal } from './worldState.js';

export const SUCCESSION_QUESTION_PAYLOAD_KIND = 'succession_question';
export const SUCCESSION_QUESTION_SCHEMA_VERSION = 1;
const QUESTION_KEYS = Object.freeze(['treatyKey', 'settlementId', 'otherId', 'npcId', 'cause', 'kind', 'answer', 'severity01', 'pressure01']);
const TERMINAL_KEYS = Object.freeze(['applied', 'dismissed', 'expired']);
const PAYLOAD_KEYS = Object.freeze(['kind', 'schemaVersion', 'openedTick', 'questionKey', 'question', 'terminals']);
const OUTCOME_KEYS = Object.freeze(['id', 'candidateId', 'candidateType', 'type', 'applyMode', 'targetSaveId',
  'affectedSettlementIds', 'openedTick', 'proposalPayload', 'severity', 'headline', 'summary', 'reasons']);

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) { return !!value && typeof value === 'object' && !Array.isArray(value); }
/** Canonically project one closed record without making insertion order authority.
 * @param {unknown} value @param {readonly string[]} keys @returns {unknown[]|null} */
function exactProjection(value, keys) {
  if (!isRecord(value)) return null;
  const entries = Object.entries(value);
  if (entries.length !== keys.length) return null;
  const positions = new Map(keys.map((key, index) => [key, index]));
  const projected = new Array(keys.length);
  for (const [key, entry] of entries) {
    const index = positions.get(key);
    if (index == null) return null;
    projected[index] = entry;
  }
  return projected;
}
/** @param {unknown} value */
function exactText(value) { return typeof value === 'string' && value.length > 0 && value.trim() === value; }
/** @param {unknown} value */
function unit(value) { return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1; }
/** @param {number} value */
function hex(value) { return value.toString(16).padStart(8, '0'); }

/**
 * @param {Record<string, unknown>} question
 * @param {number} openedTick
 */
export function successionQuestionKey(question, openedTick) {
  const projected = exactProjection(question, QUESTION_KEYS);
  return projected ? JSON.stringify([1, openedTick, ...projected]) : '';
}

/** @param {string} questionKey */
function candidateIdFor(questionKey) {
  return `succession_question.${questionKey.length}.${hex(fnv1a32(`gr4d:a\0${questionKey}`))}.${hex(fnv1a32(`gr4d:b\0${questionKey}`))}`;
}

/**
 * Deep-validates the complete persisted descriptor and its outcome identity.
 * @param {unknown} outcome
 * @returns {[import('./treatySuccession.js').SuccessionQuestion, number, string, string, 'proposal'|'auto', Record<string, unknown>] | null}
 */
export function successionQuestionPayloadTuple(outcome) {
  const outcomeValues = exactProjection(outcome, OUTCOME_KEYS);
  if (!outcomeValues) return null;
  const [outcomeId, candidateId, candidateType, type, applyMode, targetSaveId, affected,
    outcomeOpenedTick, payload, severity, headline, summary, reasons] = outcomeValues;
  const payloadValues = exactProjection(payload, PAYLOAD_KEYS);
  if (!payloadValues || !isRecord(payload)) return null;
  const [payloadKind, schemaVersion, openedTick, questionKey, question, terminals] = payloadValues;
  if (payloadKind !== SUCCESSION_QUESTION_PAYLOAD_KIND
      || schemaVersion !== SUCCESSION_QUESTION_SCHEMA_VERSION
      || !Number.isInteger(openedTick) || Number(openedTick) < 0
      || !exactText(questionKey) || !isRecord(question) || !isRecord(terminals)) return null;
  const questionValues = exactProjection(question, QUESTION_KEYS);
  const terminalValues = exactProjection(terminals, TERMINAL_KEYS);
  if (!questionValues || !terminalValues) return null;
  const [treatyKey, settlementId, otherId, npcId, cause, kind, answer, severity01, pressure01] = questionValues;
  const [applied, dismissed, expired] = terminalValues;
  if (![treatyKey, settlementId, otherId, npcId, cause].every(exactText)
      || (kind !== 'lineal' && kind !== 'coup_born') || answer !== 'disavow'
      || !unit(severity01) || !unit(pressure01)) return null;
  if (applied !== SUCCESSION_QUESTION_TERMINALS.applied
      || dismissed !== SUCCESSION_QUESTION_TERMINALS.dismissed
      || expired !== SUCCESSION_QUESTION_TERMINALS.expired) return null;
  const key = successionQuestionKey(question, Number(openedTick));
  const id = candidateIdFor(key);
  const valid = questionKey === key && outcomeId === id && candidateId === id
    && candidateType === 'treaty_breached' && type === 'treaty'
    && (applyMode === 'proposal' || applyMode === 'auto')
    && targetSaveId === settlementId && outcomeOpenedTick === openedTick
    && Array.isArray(affected) && affected.length === 2
    && affected[0] === settlementId && affected[1] === otherId
    && severity === severity01
    && headline === `Succession oath decision for ${settlementId}`
    && summary === `Apply to disavow the oath to ${otherId}; dismissing or leaving it unanswered honors the oath.`
    && Array.isArray(reasons) && reasons.length === 1
    && reasons[0] === 'A successor must decide whether to own the fallen holder\'s oath.';
  return valid ? [/** @type {import('./treatySuccession.js').SuccessionQuestion} */ (question), Number(openedTick),
    /** @type {string} */ (questionKey), /** @type {string} */ (outcomeId), /** @type {'proposal'|'auto'} */ (applyMode), payload] : null;
}

/** @param {unknown} payload @param {unknown} outcome @returns {boolean} */
export function isSuccessionQuestionPayload(payload, outcome) {
  const tuple = successionQuestionPayloadTuple(outcome);
  return !!tuple && tuple[5] === payload;
}

/** Read collision identity permissively even when either enclosing record is malformed. @param {unknown} outcome */
export function successionQuestionRawKey(outcome) {
  if (!isRecord(outcome)) return undefined;
  const payloadEntry = Object.entries(outcome).find(([key]) => key === 'proposalPayload');
  if (!payloadEntry || !isRecord(payloadEntry[1])) return undefined;
  const keyEntry = Object.entries(payloadEntry[1]).find(([key]) => key === 'questionKey');
  return keyEntry?.[1];
}

/** @param {Record<string, unknown>} question @param {number} openedTick */
function outcomeFor(question, openedTick) {
  const questionKey = successionQuestionKey(question, openedTick);
  const id = candidateIdFor(questionKey);
  const [, settlementId, otherId, , , , , severity01] = exactProjection(question, QUESTION_KEYS) || [];
  const payload = {
    kind: SUCCESSION_QUESTION_PAYLOAD_KIND, schemaVersion: SUCCESSION_QUESTION_SCHEMA_VERSION,
    openedTick, questionKey, question: { ...question }, terminals: { ...SUCCESSION_QUESTION_TERMINALS },
  };
  return {
    id, candidateId: id, candidateType: 'treaty_breached', type: 'treaty', applyMode: 'proposal',
    targetSaveId: settlementId, affectedSettlementIds: [settlementId, otherId],
    openedTick, proposalPayload: payload, severity: severity01,
    headline: `Succession oath decision for ${settlementId}`,
    summary: `Apply to disavow the oath to ${otherId}; dismissing or leaving it unanswered honors the oath.`,
    reasons: ['A successor must decide whether to own the fallen holder\'s oath.'],
  };
}

/**
 * @param {Record<string, unknown>} worldState
 * @param {unknown} tick
 * @param {unknown} now
 * @returns {{worldState:Record<string, unknown>, newsEntries:Array<Record<string, unknown>>}}
 */
export function resolveSuccessionQuestions(worldState, tick, now) {
  if (!routineMajorApprovalEnabled(/** @type {Record<string, unknown>} */ (worldState.simulationRules))) {
    return answerSuccessionQuestions(worldState, tick);
  }
  if (!oathHolderActive(worldState)) return { worldState, newsEntries: [] };
  const openedTick = Number(tick);
  if (!Number.isInteger(openedTick) || openedTick < 0) return { worldState, newsEntries: [] };
  let out = worldState;
  for (const landed of successionQuestionsForTick(worldState, openedTick)) {
    if (landed.answer !== 'disavow') continue;
    const question = /** @type {Record<string, unknown>} */ ({ ...landed });
    const outcome = outcomeFor(question, openedTick);
    const proposalId = proposalIdFor(outcome, openedTick);
    const retained = Array.isArray(out.proposals) ? out.proposals : [];
    const outcomeValues = exactProjection(outcome, OUTCOME_KEYS);
    if (!outcomeValues) continue;
    const [, , , , , , , , , severity, headline, summary, reasons] = outcomeValues;
    const outcomeKey = successionQuestionRawKey(outcome);
    const keyMatches = retained.filter((row) => successionQuestionRawKey(row?.outcome) === outcomeKey);
    const idMatches = retained.filter((row) => row?.id === proposalId);
    if (keyMatches.length || idMatches.length) {
      const duplicate = idMatches.some((row) => successionQuestionRawKey(row?.outcome) === outcomeKey);
      if (duplicate) continue;
      continue;
    }
    out = upsertProposal(out, {
      id: proposalId, status: 'pending', recordModeVersion: RECORD_MODE_PROPOSAL_VERSION,
      createdAt: now, updatedAt: now, tick: openedTick, outcome: { ...outcome },
      headline, summary, severity, reasons: [.../** @type {unknown[]} */ (reasons)],
    });
  }
  return { worldState: out, newsEntries: [] };
}
