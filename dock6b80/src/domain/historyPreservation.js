/**
 * domain/historyPreservation.js — carrying committed record through a history reroll.
 *
 * "Reroll history" replaces `settlement.history` wholesale. Most of what that
 * discards is generation output and SHOULD be discarded — that is the reroll.
 * Two things in there are not generation output at all, and this module carries
 * them across. Pure: no RNG, no clock, no store or generator imports. Every
 * draw the generators make has already happened by the time a caller reaches
 * here, so preservation cannot perturb a seeded run — it only rewrites the
 * finished result.
 *
 * ── 1. Campaign-era events are campaign FACTS, not generation output ─────────
 *
 * When the world advances, worldPulse appends entries to
 * `history.historicalEvents` marked `campaignEra: true` with a stable
 * `campaignEventId` (settlementLifecycleFirstClass.js, stressorAftermath.js,
 * factionCapture.js). Those three writers share one explicit rule — the
 * campaign-era window is capped and pruned oldest-first, while "generation
 * history is never pruned". They record what happened at the table: a siege
 * the party lived through, a faction that took the town, a famine that broke.
 *
 * A generation reroll erased them, so rerolling history to get a nicer founding
 * paragraph silently deleted the campaign's own record. They are carried
 * UNCONDITIONALLY — no regeneration-mode gate. A mode describes how aggressively
 * to reroll GENERATED content; there is no mode under which the table's history
 * is a candidate for rerolling, and `reforge` deleting a siege the party fought
 * would be a data-loss bug wearing a feature's name.
 *
 * They are appended at the END, in their existing relative order, which is
 * exactly where worldPulse's own writers put them — so a rerolled history is
 * shaped like a post-advance one, not like a third thing. `eventsTimeline` is
 * deliberately NOT extended with them, for the same reason: worldPulse never
 * adds campaign entries there either, and matching the live shape beats
 * inventing a better one here.
 *
 * ── 2. Authored settlement-root history prose ────────────────────────────────
 *
 * `_userEdits` on the settlement ROOT records six editable `history.*` paths
 * (userEdits.js EDITABLE_FIELDS.settlement). Those records survive a reroll
 * untouched — they live on the settlement, not on `history` — while the VALUES
 * they describe are regenerated. The dossier then shows an "Edited" badge over
 * generated text, and Revert offers to restore a value the user never saw.
 * Re-applying the recorded value closes that gap.
 *
 * Identity here is the PATH STRING, which already exists and is already the
 * key `_userEdits` is stored under — nothing new is invented.
 *
 * ── DELIBERATELY DEFERRED — documented, not bugs to re-find ──────────────────
 *
 * A. Authored ENTRIES inside `historicalEvents[]` / `currentTensions[]` are
 *    still destroyed. Unlike the root paths above they have no identity to be
 *    carried by: no id, no provenance marker, and positional index is worthless
 *    across a reroll that changes the array's length and contents. Preserving
 *    them needs an identity scheme minted for the purpose, and whether a
 *    generated beat is worth minting one for is a product decision, not a
 *    merge's. OWNER QUESTION, not oversight.
 *
 * B. A restored root value leaves its `_userEdits` record's `originalValue`
 *    pointing at the pre-edit text from the roll the edit was authored against,
 *    so "Revert to generated" restores that older generated string rather than
 *    the current roll's. Fixing it means rewriting the user's own edit record
 *    from inside a history reroll — a settlement-root concern this module has
 *    no business owning. Strictly better than the pre-fix state either way,
 *    where the badge claimed an edit the content did not carry.
 */

import { deepClone } from './clone.js';
import { EDITABLE_FIELDS } from './userEdits.js';

/**
 * One entry of `history.historicalEvents`. Read structurally rather than by a
 * declared shape: the three worldPulse writers and the generator each stamp a
 * different field set, and this module only ever reads the two markers below.
 * @typedef {Record<string, unknown>} HistoryEvent
 */

/**
 * @typedef {Record<string, unknown>} HistoryLike
 */

/** The editable settlement-root paths that live under `history`. */
const HISTORY_EDIT_PATHS = Object.freeze(
  (EDITABLE_FIELDS.settlement || []).filter(path => path.startsWith('history.')),
);

/** @param {HistoryEvent} event @returns {string} */
function campaignIdOf(event) {
  const id = event.campaignEventId;
  return typeof id === 'string' ? id : '';
}

/** @param {unknown} value @returns {value is HistoryEvent} */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * The `historicalEvents` array a reroll should store: the freshly generated
 * events plus every campaign-era entry the previous history held.
 *
 * Returns `freshEvents` UNCHANGED (same reference) when there is nothing to
 * carry — the dormancy contract a caller relies on to keep a never-advanced
 * settlement's reroll identical to what it produced before this existed.
 *
 * @param {HistoryLike|null|undefined} previousHistory  The history being replaced.
 * @param {HistoryEvent[]|null|undefined} freshEvents    What generateHistory just produced.
 * @returns {HistoryEvent[]}
 */
export function carryCampaignEvents(previousHistory, freshEvents) {
  const fresh = Array.isArray(freshEvents) ? freshEvents : [];
  const previous = isRecord(previousHistory) ? previousHistory.historicalEvents : null;
  if (!Array.isArray(previous)) return fresh;

  // Dedup by campaignEventId, the same key all three writers use for their own
  // idempotency. A fresh roll carries none, so this only fires if a caller hands
  // in a history that already went through this merge.
  const seen = new Set(
    fresh.filter(isRecord).map(campaignIdOf).filter(Boolean),
  );
  /** @type {HistoryEvent[]} */
  const carried = [];
  for (const event of previous) {
    if (!isRecord(event) || event.campaignEra !== true) continue;
    const id = campaignIdOf(event);
    if (id) {
      if (seen.has(id)) continue;
      seen.add(id);
    }
    carried.push(/** @type {HistoryEvent} */ (deepClone(event)));
  }
  return carried.length === 0 ? fresh : [...fresh, ...carried];
}

/**
 * How many campaign-era entries a reroll of this settlement must carry.
 * Exported for callers that want to report or assert on the carry.
 *
 * @param {HistoryLike|null|undefined} previousHistory
 * @returns {number}
 */
export function countCampaignEvents(previousHistory) {
  const previous = isRecord(previousHistory) ? previousHistory.historicalEvents : null;
  if (!Array.isArray(previous)) return 0;
  return previous.filter(event => isRecord(event) && event.campaignEra === true).length;
}

/**
 * Write the user's authored value back over a regenerated field.
 *
 * Fails safe on a missing parent: an authored `founding.reason` with no
 * `founding` object is skipped rather than invented, so this never adds shape
 * the generator did not produce.
 *
 * @param {HistoryLike} target
 * @param {string[]} segments
 * @param {unknown} value
 * @returns {void}
 */
function writeAtPath(target, segments, value) {
  /** @type {HistoryLike} */
  let ref = target;
  for (let i = 0; i < segments.length - 1; i += 1) {
    const next = ref[segments[i]];
    if (!isRecord(next)) return;
    ref = next;
  }
  ref[segments[segments.length - 1]] = value;
}

/**
 * Re-apply the settlement's authored `history.*` values onto a rerolled history.
 *
 * Runs AFTER the coherence tail, which is the load-bearing detail: the tail
 * mints `historicalCharacter`, and `historicalCharacter` is itself one of the
 * editable paths — enriching after restoring would undo the very edit being
 * preserved. (The NPC reroll orders its merge after enrichment for the same
 * reason.)
 *
 * Returns `history` UNCHANGED (same reference) when the settlement carries no
 * authored history path.
 *
 * @param {Record<string, unknown>|null|undefined} settlement  Carries `_userEdits`.
 * @param {HistoryLike} history  The rerolled history.
 * @returns {HistoryLike}
 */
export function restoreAuthoredHistory(settlement, history) {
  const edits = isRecord(settlement) ? settlement._userEdits : null;
  if (!isRecord(edits)) return history;

  /** @type {Array<{ segments: string[], value: unknown }>} */
  const restores = [];
  for (const path of HISTORY_EDIT_PATHS) {
    const record = edits[path];
    if (!isRecord(record) || !('value' in record)) continue;
    restores.push({
      segments: path.slice('history.'.length).split('.'),
      value: record.value,
    });
  }
  if (restores.length === 0) return history;

  const next = /** @type {HistoryLike} */ (deepClone(history));
  for (const { segments, value } of restores) writeAtPath(next, segments, value);
  return next;
}
