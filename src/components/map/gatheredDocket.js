/**
 * gatheredDocket.js — THE HELD DOCKET, as a read model.
 *
 * Realm directive 7 / J-D7: "Dismissal parks unresolved items in a durable HELD
 * DOCKET that re-surfaces on the next advance and shows a one-line Herald pointer;
 * nothing is ever silently dropped."
 *
 * ── THERE IS NO SECOND STORE ────────────────────────────────────────────────
 * The durable store already exists: `campaign.worldState.proposals` rows whose
 * status is 'pending'. They ride the campaign record into localStorage and the
 * cloud snapshot, ensureWorldState clones them wholesale on rehydrate, and the
 * pulse-undo snapshot reverts them with the advance that made them. So the HELD
 * DOCKET is a VIEW DISCIPLINE over that one truth, not a rival container:
 * dismissing the gathered screen writes NOTHING, which is exactly why nothing can
 * be dropped by dismissing it. A second "held" list would be a second truth to
 * keep in sync, and the first divergence would be a silently-lost decision.
 *
 * ── WHAT "HELD" MEANS ───────────────────────────────────────────────────────
 * A row is HELD when it was already pending before the advance the caller is
 * reporting on. The caller supplies that boundary as `sinceTick` (the world clock
 * READ BEFORE the advance ran), because only the advance flow knows it — deriving
 * it from pulse history would mis-read a multi-week interval's own mid-interval
 * rows as backlog. With no boundary supplied (the Herald pointer, a fresh mount)
 * every row simply reads as pending, which is honest rather than guessed.
 *
 * ── ORDER ───────────────────────────────────────────────────────────────────
 * OLDEST FIRST: tick, then the recorded createdAt stamp, then the row id. This is
 * the SAME ordering the engine's full-auto path uses for the held queue
 * (autoAdjudication.heldProposalIds), so the manual desk and the engine rule on a
 * backlog in the same order and the receipts read alike. Every key already lives
 * on the persisted row, so the order survives a JSON round trip.
 *
 * Pure: no store, no clock, no DOM, no React.
 */

import { tickCalendarLabel } from '../../domain/display/humanizeEngineTokens.js';

/** Reader-facing counts. Past the twelfth matter the digit reads better than the word. */
const COUNT_WORDS = Object.freeze([
  'No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six',
  'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
]);

/** @param {unknown} value @returns {Record<string, any>|null} */
function asRecord(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, any>} */ (value)
    : null;
}

/**
 * Every UNRESOLVED proposal row on a campaign, oldest first.
 *
 * The predicate is `status === 'pending'` and nothing else: the same predicate the
 * docket admission policy counts (proposalAdmission.buildProposalDocket) and the
 * same one the engine's held queue uses. One membership rule, three readers.
 *
 * @param {any} campaign
 * @returns {Array<Record<string, any>>}
 */
export function pendingDecisionRows(campaign) {
  const rows = campaign?.worldState?.proposals;
  const pending = (Array.isArray(rows) ? rows : []).filter(
    (/** @type {any} */ row) => asRecord(row)?.status === 'pending',
  );
  return pending.sort((/** @type {any} */ a, /** @type {any} */ b) => {
    const at = Number.isFinite(Number(a?.tick)) ? Number(a.tick) : -1;
    const bt = Number.isFinite(Number(b?.tick)) ? Number(b.tick) : -1;
    if (at !== bt) return at - bt;
    const ac = a?.createdAt == null ? '' : String(a.createdAt);
    const bc = b?.createdAt == null ? '' : String(b.createdAt);
    if (ac !== bc) return ac < bc ? -1 : 1;
    const ai = a?.id == null ? '' : String(a.id);
    const bi = b?.id == null ? '' : String(b.id);
    return ai < bi ? -1 : ai > bi ? 1 : 0;
  });
}

/**
 * How many matters await the DM's word. The count the Herald pointer states and
 * the gathered screen lists MUST come from this one function, or the pointer can
 * promise a number the desk does not show.
 *
 * @param {any} campaign
 * @returns {number}
 */
export function pendingDecisionCount(campaign) {
  return pendingDecisionRows(campaign).length;
}

/**
 * The gathered screen's rows: every pending decision, oldest first, each marked
 * with whether it was already waiting before the reported advance and with the
 * in-world date it was raised.
 *
 * @param {any} campaign
 * @param {{ sinceTick?: number|null }} [options]
 * @returns {Array<{ id: string, proposal: Record<string, any>, held: boolean, raisedLabel: string }>}
 */
export function gatheredDecisionRows(campaign, { sinceTick = null } = {}) {
  const boundary = Number.isFinite(Number(sinceTick)) ? Number(sinceTick) : null;
  return pendingDecisionRows(campaign).map((proposal) => {
    const tick = Number(proposal?.tick);
    return {
      id: String(proposal?.id ?? ''),
      proposal,
      held: boundary != null && Number.isFinite(tick) && tick <= boundary,
      raisedLabel: Number.isFinite(tick) ? tickCalendarLabel(tick) : '',
    };
  });
}

/**
 * The ONE-LINE Herald pointer (J-D7). In-world, glanceable, and honest about the
 * number — the legibility law's "glance to sentence" rung, with the table living
 * on the gathered screen the pointer routes to.
 *
 * @param {number} count
 * @returns {string}
 */
export function judgmentPointerSentence(count) {
  const n = Math.max(0, Math.floor(Number(count) || 0));
  if (n === 0) return 'No matter awaits the realm’s judgment.';
  const word = COUNT_WORDS[n] || String(n);
  return n === 1
    ? `${word} matter awaits the realm’s judgment.`
    : `${word} matters await the realm’s judgment.`;
}

/**
 * What the DM is told when they close the gathered screen with matters unruled.
 * The promise the held docket keeps, said out loud.
 *
 * @param {number} count
 * @returns {string}
 */
export function heldDocketPromise(count) {
  const n = Math.max(0, Math.floor(Number(count) || 0));
  if (n === 0) return 'Every matter is settled.';
  const word = COUNT_WORDS[n] || String(n);
  return n === 1
    ? `${word} matter stays on the docket and returns when time next moves.`
    : `${word} matters stay on the docket and return when time next moves.`;
}
