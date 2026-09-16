/** GR-4d: apply one withheld succession DISAVOW act through the treaty writer. */
import { getSpatialLedger } from '../spatial/distanceRead.js';
import { oathHolderActive } from './oathHolder.js';
import { repudiateTreaty } from './treatyBreach.js';
import { successionDisavowalBeat } from './treatySuccessionVoice.js';
import {
  successionQuestionPayloadTuple, successionQuestionRawKey, SUCCESSION_QUESTION_PAYLOAD_KIND,
} from './treatySuccessionDecision.js';
import { RECORD_MODE_PROPOSAL_VERSION } from './pulseHelpers.js';
import { proposalIdFor } from './worldState.js';

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) { return !!value && typeof value === 'object' && !Array.isArray(value); }

/** Claim the namespace even when the rest of its descriptor is malformed. @param {unknown} payload */
export function claimsSuccessionQuestionNamespace(payload) {
  const kind = isRecord(payload) ? Object.entries(payload).find(([key]) => key === 'kind') : null;
  return kind?.[1] === SUCCESSION_QUESTION_PAYLOAD_KIND;
}

/**
 * @param {{state:Record<string, unknown>, outcome:Record<string, unknown>, tick:unknown, now?:unknown}} args
 * @returns {{state:Record<string, unknown>, newsEntries:Array<Record<string, unknown>>, lapsed:boolean, ownsOutcomeNews:boolean}}
 */
export function applySuccessionQuestionProposal({ state, outcome, tick }) {
  const validated = successionQuestionPayloadTuple(outcome);
  if (!validated) {
    return { state, newsEntries: [], lapsed: true, ownsOutcomeNews: false };
  }
  const [question, openedTick, questionKey] = validated;
  const expectedProposalId = proposalIdFor(outcome, openedTick);
  const proposals = Array.isArray(state.proposals) ? state.proposals : [];
  const collision = proposals.some((row) => {
    const key = successionQuestionRawKey(row?.outcome);
    return (row?.id === expectedProposalId && key !== questionKey)
      || (key === questionKey && row?.id !== expectedProposalId);
  });
  if (collision || !oathHolderActive(state)) {
    return { state, newsEntries: [], lapsed: true, ownsOutcomeNews: false };
  }
  const matching = proposals.filter((row) => row?.id === expectedProposalId);
  const wrapper = matching.length === 1 ? matching[0] : null;
  const stored = isRecord(wrapper?.outcome) ? wrapper.outcome : null;
  const storedTuple = stored ? successionQuestionPayloadTuple(stored) : null;
  const canonicalStored = stored && storedTuple
    && storedTuple[4] === 'proposal'
    && storedTuple[3] === validated[3] && storedTuple[2] === questionKey;
  const wrapperReasons = /** @type {unknown[]} */ (Array.isArray(wrapper?.reasons) ? wrapper.reasons : []);
  const outcomeReasons = /** @type {unknown[]} */ (Array.isArray(outcome.reasons) ? outcome.reasons : []);
  if (!wrapper || wrapper.status !== 'pending' || wrapper.tick !== openedTick
      || wrapper.recordModeVersion !== RECORD_MODE_PROPOSAL_VERSION || !canonicalStored
      || wrapper.headline !== outcome.headline || wrapper.summary !== outcome.summary
      || wrapper.severity !== outcome.severity || wrapperReasons.length !== outcomeReasons.length
      || wrapperReasons.some((reason, index) => reason !== outcomeReasons[index])) {
    return { state, newsEntries: [], lapsed: true, ownsOutcomeNews: false };
  }
  const treaties = getSpatialLedger(state, 'treaties');
  const treaty = isRecord(treaties) ? treaties[String(question.treatyKey)] : null;
  const parties = isRecord(treaty) && Array.isArray(treaty.parties) ? treaty.parties : [];
  if (!parties.includes(question.settlementId) || !parties.includes(question.otherId)
      || question.settlementId === question.otherId) {
    return { state, newsEntries: [], lapsed: true, ownsOutcomeNews: false };
  }
  const nowTick = Math.max(0, Math.floor(Number.isFinite(Number(tick)) ? Number(tick) : 0));
  const applied = repudiateTreaty(state, { tick: nowTick, succession: question });
  if (!applied.ok) return { state, newsEntries: [], lapsed: true, ownsOutcomeNews: false };
  const written = getSpatialLedger(applied.worldState, 'treaties');
  const broken = isRecord(written) && isRecord(written[String(question.treatyKey)])
    ? /** @type {Record<string, unknown>} */ (written[String(question.treatyKey)]) : {};
  return {
    state: applied.worldState,
    newsEntries: successionDisavowalBeat({ treaty: broken, question, tick: nowTick }),
    lapsed: false,
    ownsOutcomeNews: true,
  };
}
