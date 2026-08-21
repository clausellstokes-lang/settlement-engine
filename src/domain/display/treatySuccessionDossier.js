/**
 * domain/display/treatySuccessionDossier.js — GR-4b-iii-b: THE OPEN-QUESTION DOSSIER LINE.
 *
 * A PURE DISPLAY LEAF, cut to the same pattern as `treatyAgeLine` next door: it READS the
 * pending succession questions standing against one exact treaty and returns zero or more
 * authored lines saying the question is open and the parchment still stands. It claims no
 * answer, no successor name, no breach, and no per-treaty uniqueness.
 *
 * ── READER, NEVER WRITER (HZ-READERNOWRITER) ─────────────────────────────────────
 *
 * The pending rows narrated here were written by the LATE TREATY STAGE in an earlier tick.
 * This leaf never calls `resolveSuccessionQuestions` or any other writer, and it mutates
 * nothing: not the world, not the ledger, not the proposals, not the treaty, not the
 * document. The pending proposal is MECHANICS and this line is PRESENTATION — missing
 * presentation data suppresses the line and must never veto, alter or write any proposal,
 * treaty or ledger.
 *
 * ── EVERY FACT COMES FROM A CANONICAL READER ─────────────────────────────────────
 *
 * `successionQuestionPayloadTuple` is the ONLY admissible projection of the outcome (the
 * closed validator — never a hand-walked payload shape), `treatyLedgerOf` the canonical
 * ledger, `treatyOrientationOf` the one orientation reader, and `swornPartiesOf` the
 * treaty's total oath-stamp reader. NO successor, ruler, standings or roster lookup is
 * permitted: the heir's name is on no surface this stage can read, which is exactly why the
 * ANNEX was corrected rather than the slot filled (CR-GR4B-3, restated at A-22).
 *
 * ── ELIGIBILITY IS A STAMPED, LIVE-TERM TREATY (CR-GR4B-14) ──────────────────────
 *
 * A treaty carrying no written term does not entail this pool — variant 6 says it "remains
 * live under the terms already written" and variant 4 that the parchment "still joins" the
 * two courts. So a row speaks only when its treaty key resolves in the live ledger, the
 * document carries at least one term, the orientation resolves BOTH persisted court names,
 * and the acting court's `sworn` stamp names the exact holder the question carries. Any
 * miss yields ZERO lines for that row and never a partial line.
 *
 * ⭐ `{settlement}` IS THE ACTING COURT, FOR EVERY VIEWER (CR-GR4B-15). It binds to the
 * court that must answer and `{counterpart}` to the other, identically on both mounts and
 * for both parties' dossiers. Variant 3 is authored from the counterpart's vantage in its
 * own words, so re-binding the slots per viewer would invert that family's meaning. This is
 * the exact binding `treatySuccessionOpeningVoice.js` already uses, and it deliberately
 * does NOT route through `grammarSlotRoles`: the obligee/obligor axis is not this pool's.
 *
 * DETERMINISTIC: no locale operation, no draw, no clock, no `Date`, no `Math.random`.
 *
 * @enforced-by tests/domain/treatySuccessionDossier.test.js
 *   + tests/lint/grammarLifecycleKindPools.walker.test.js
 */

import { grammarReceipt } from '../worldPulse/grammarNews.js';
import { swornPartiesOf } from '../worldPulse/oathHolder.js';
import { treatyLedgerOf } from '../worldPulse/treatyEnforcement.js';
import { treatyOrientationOf } from '../worldPulse/treatyOrientation.js';
import { successionQuestionPayloadTuple } from '../worldPulse/treatySuccessionDecision.js';

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function isRecord(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** A persisted reader name, never an id echoed back as a name.
 *  @param {string} id @param {string} name @returns {string} */
function readerName(id, name) {
  const resolved = text(name);
  return resolved && resolved !== text(id) ? resolved : '';
}

/** One party's persisted court name on this instrument, or '' when it never resolved.
 *  @param {ReturnType<typeof treatyOrientationOf>} orientation @param {string} id */
function courtName(orientation, id) {
  if (orientation.obligeeId === id) return readerName(id, orientation.obligeeName);
  if (orientation.obligorId === id) return readerName(id, orientation.obligorName);
  return '';
}

/**
 * The authored line for ONE validated pending question against ONE treaty, or '' when the
 * address is incomplete. Fails closed at every step — never a partial sentence.
 * @param {[import('../worldPulse/treatySuccession.js').SuccessionQuestion, number, string,
 *   string, 'proposal'|'auto', Record<string, unknown>]} tuple
 * @param {Record<string, unknown>} treaty @param {string} pairKey @returns {string}
 */
function questionLine(tuple, treaty, pairKey) {
  const [question, , , outcomeId] = tuple;
  if (question.treatyKey !== pairKey || question.settlementId === question.otherId) return '';
  const orientation = treatyOrientationOf(treaty);
  if (!orientation.resolved) return '';
  const settlement = courtName(orientation, question.settlementId);
  const counterpart = courtName(orientation, question.otherId);
  if (!settlement || !counterpart) return '';
  // The fallen holder, and ONLY from this instrument's own stamp: the exact acting court
  // plus the exact holder the question names. A half-written stamp reads back as no stamp.
  const fallen = swornPartiesOf(treaty).find((stamp) => (
    stamp.settlementId === question.settlementId && stamp.npcId === question.npcId
  ));
  const npc = fallen ? readerName(fallen.npcId, fallen.name) : '';
  if (!npc) return '';
  // THE SEED IS THE VALIDATED OUTCOME IDENTITY, and `grammarReceipt` namespaces every seed
  // with its own kind — so this pool's pick is independent of the opening beat's pick on
  // the same identity. No context argument: every family is honest while the question is
  // open, because open is the only moment this kind speaks.
  const receipt = grammarReceipt('succession_question_open', outcomeId, {
    settlement, counterpart, npc,
  });
  return receipt ? receipt.line : '';
}

/**
 * EVERY OPEN SUCCESSION QUESTION STANDING AGAINST ONE TREATY, as authored dossier lines.
 * ALWAYS AN ARRAY — never null and never absent, which is what keeps the treaty document's
 * new key byte-neutral across the lifecycle-voice flag (HZ-DORMANCYFENCE).
 *
 * @param {unknown} worldState
 * @param {unknown} pairKey the exact treaty being rendered
 * @param {unknown} terms the document read-model's own term list
 * @returns {string[]}
 */
export function successionQuestionOpenLines(worldState, pairKey, terms) {
  const root = isRecord(worldState) ? worldState : {};
  if (!Array.isArray(root.proposals)) return [];
  if (!Array.isArray(terms) || terms.length === 0) return [];
  const key = text(pairKey);
  const ledger = key ? treatyLedgerOf(root) : null;
  const treaty = ledger ? ledger[key] : null;
  if (!isRecord(treaty)) return [];
  /** @type {string[]} */
  const lines = [];
  // THE PERSISTED ARRAY ORDER IS ALREADY CANONICAL: `successionQuestionsForTick`
  // codepoint-sorts seat-transition rows and treaty keys BEFORE insertion, so a second sort
  // here would be a divergent authority. Two distinct questions may lawfully share one
  // treaty, so no uniqueness, dedupe or court-pair pairing is applied — each surviving row
  // renders its own line.
  for (const proposal of root.proposals) {
    if (!isRecord(proposal) || proposal.status !== 'pending') continue;
    const tuple = successionQuestionPayloadTuple(proposal.outcome);
    if (!tuple) continue;
    const line = questionLine(tuple, treaty, key);
    if (line) lines.push(line);
  }
  return lines;
}
