/**
 * store/scribeEpochLane.js — THE PAST LANE'S TWO MOVES, and the one number that bounds it.
 *
 * The Scribe's artefact is write-once per EPOCH (design §5b). Two verbs move a render off
 * `current` without ever deleting it, and both are the owner's own words:
 *
 *   UNDO  (2026-09-14 ~06:4x) "if advanced time is reverted back, then that past one should be
 *         saved." An undone advance's prose MOVES, whole, into the past lane marked `undone`, and
 *         `current` re-points at the surviving epoch. The pair (advanceSeq, nonce) keeps two
 *         renders of the same seq apart, because the living-futures law means the seq an undo
 *         freed will be re-used by a DIFFERENT future.
 *   REDO  (2026-09-14 ~06:5x) "there should be an option to redo the AI narrative, to redraw based
 *         on the current settlement's facts." The render a redraw replaces moves the same way,
 *         marked `redone`, so the DM can compare and nothing is lost.
 *
 * ⛔ THE ARTEFACT IS NEVER RESTORED FROM A SNAPSHOT; IT IS MOVED ON THE LIVE OBJECT.
 * A pulse-undo snapshot is a deep clone of every member save (`campaignPulseHelpers.js`
 * `capturePulseSnapshot`), retained up to PULSE_UNDO_CAP deep. If those clones carried the prose,
 * one campaign's undo ring would hold several megabytes of duplicated text AND a restore would
 * write back the artefact as it stood BEFORE the advance, silently deleting the epoch the owner
 * just said must be saved. So the snapshot strips it and the restore re-attaches from the LIVE
 * settlement after moving it through `restoreToDepth`. The two halves are one rule with two
 * spellings, and the test that proves it round-trips the real chokepoint rather than this module.
 *
 * This module is PURE (no store access, no async) and imports only the artefact writer, so the
 * lazily-loaded pulse body and any future eager caller may both reach it.
 */

import { CHRONICLE_LIMITS } from '../lib/chronicle.js';
import {
  SCRIBE_PAST_EPOCH_LIMIT,
  attachProse,
  proseOf,
  restoreToDepth,
  retireCurrent,
} from '../lib/scribeArtefact.js';

/**
 * ⭐ HOW MANY PAST EPOCHS A TIER KEEPS (design §5b, owner-gated item 13).
 *
 * The number is READ FROM the product's existing narrative-history promise rather than invented:
 * `CHRONICLE_LIMITS` is what the chronicle lane already rotates on, so a paid tier keeps more
 * lived past in prose for the same reason it keeps more of it in the chronicle. Two of those three
 * tiers are `Infinity`, and a JSONB save row cannot be unbounded, so the artefact's own hard
 * ceiling clamps them; `rotate` in the writer clamps again, so a caller that forgets this function
 * still cannot widen the blob.
 *
 * JUDGMENT (vetoable): the OWNER-GATED half of item 13 is whether past epochs rotate onward into
 * `ai_data.chronicle` or live forever on the blob. Neither is done here. What is done is the part
 * the brief asks for: the move is COMPACT (units only, no card and no report) and the cap is the
 * chronicle's existing tier numbers rather than a new hand-picked one.
 *
 * @param {{isElevated?: Function, isPremium?: Function}} state the store state (or any shape
 *   carrying the two entitlement predicates)
 * @returns {number}
 */
export function scribePastLaneLimit(state) {
  const raw = state?.isElevated?.() ? CHRONICLE_LIMITS.elevated
    : state?.isPremium?.() ? CHRONICLE_LIMITS.premium
      : CHRONICLE_LIMITS.free;
  return Number.isFinite(raw) ? Math.min(raw, SCRIBE_PAST_EPOCH_LIMIT) : SCRIBE_PAST_EPOCH_LIMIT;
}

/**
 * ⭐ THE UNDO MOVE, applied to ONE settlement pair.
 *
 * `live` is the settlement as it stands NOW (it carries the artefact, because the snapshot does
 * not); `restored` is the settlement the snapshot restores. Returns `restored` with the live
 * artefact re-attached after every epoch above `advanceSeq` has been moved into the past lane.
 *
 * Returns the SAME reference when the live settlement carries no artefact, so an unscribed estate
 * pays nothing and the caller's own identity checks are untouched.
 *
 * @param {object|null|undefined} live
 * @param {object} restored
 * @param {{advanceSeq: number, nonce?: string, at?: string, limit?: number}} to the depth restored TO
 * @returns {object}
 */
export function carryProseThroughRestore(live, restored, to) {
  const moved = proseAfterRestore(live, to);
  if (!moved || !restored || typeof restored !== 'object') return restored;
  return attachProse(restored, moved);
}

/**
 * The artefact ALONE, after the undo move. Split out because the chokepoint restores the same
 * settlement TWICE — once into the saved-settlements row and once into the live view — and the
 * move must happen exactly ONCE, or one undo would file two past-lane entries for one epoch.
 * Returns null when there is no artefact to move.
 *
 * @param {object|null|undefined} live
 * @param {{advanceSeq: number, nonce?: string, at?: string, limit?: number}} to
 * @returns {object|null}
 */
export function proseAfterRestore(live, to) {
  const prose = proseOf(live);
  if (!prose) return null;
  return restoreToDepth(prose, {
    advanceSeq: Number.isFinite(to?.advanceSeq) ? Number(to.advanceSeq) : 0,
    nonce: to?.nonce,
    at: to?.at,
    limit: to?.limit,
  });
}

/**
 * ⭐ THE REDO MOVE (§5c rule 1, ruling 16). The render a redraw replaces moves whole into the past
 * lane marked `redone` and `current` is emptied, so the next render lands on a clean epoch and the
 * prior one stays readable. Nothing is deleted and nothing is re-rendered here: this is the state
 * move only, and the render itself is the trigger's job.
 *
 * Returns the SAME reference when there is no current render to retire, so a REDO pressed on a
 * town that has never been scribed is a no-op rather than an empty artefact.
 *
 * @param {object|null|undefined} settlement
 * @param {{at?: string, nonce?: string, limit?: number}} [how]
 * @returns {object|null|undefined}
 */
export function retireCurrentForRedo(settlement, how = {}) {
  const prose = proseOf(settlement);
  if (!prose || !prose.current) return settlement;
  return attachProse(/** @type {object} */ (settlement), retireCurrent(prose, {
    state: 'redone', at: how?.at, nonce: how?.nonce, limit: how?.limit,
  }));
}

/**
 * The campaign's LOGICAL advance depth, spelled exactly as `campaignWorldPulseDeferred.js`
 * spells it. Stated once here so the epoch key and the ring guard can never read two different
 * numbers.
 * @param {object} state @param {string} campaignId @returns {number}
 */
export function advanceSeqOf(state, campaignId) {
  return Number(/** @type {any} */ (state)?.advanceSeqByCampaign?.[String(campaignId)]) || 0;
}
