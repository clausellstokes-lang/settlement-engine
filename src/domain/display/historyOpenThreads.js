/**
 * historyOpenThreads.js — THE "STILL RELEVANT TODAY" MARK, derived once (owner addendum
 * X-14b, 2026-10-30).
 *
 * The mark is a HOOK MARKER for the DM, not a claim about the town's state: everything in a
 * town's history is already part of its present. An event wears it when it carries an open
 * thread the DM could pull:
 *   (a) the event has at least one plot hook (`plotHooks[]` non-empty; the hook TEXT lives on
 *       the Plot Hooks tab, X-2, and the mark is the by-reference coupling), or
 *   (b) a current tension cites the event by name (in its description or its hooks: the two
 *       fields a tension's reader already shows). Measured on the 1001-town sample: names are the only coupling a
 *       tension carries to an event (no id; a shared type is a category, not a citation).
 * The generator's `anchored` flag is template provenance and is NOT read. Age, severity and
 * the character line play no part.
 *
 * Pure; reads only its arguments. The History tab's timeline dot, its event cards and the PDF
 * read this one function.
 */

/** @param {unknown} v */
const text = (v) => (typeof v === 'string' ? v : '');

/**
 * Every tension's citable text, lower-cased and joined, so one event check is one search.
 * @param {ReadonlyArray<any>} tensions
 * @returns {string}
 */
function tensionCorpus(tensions) {
  return (Array.isArray(tensions) ? tensions : [])
    .map((t) => (t && typeof t === 'object'
      ? [text(t.description), ...(t.plotHooks || []).map(text)].join(' ')
      : text(t)))
    .join('\n')
    .toLowerCase();
}

/**
 * Does this event carry an open thread?
 * @param {{ name?: unknown, plotHooks?: unknown }|null|undefined} event
 * @param {{ currentTensions?: unknown }|null|undefined} history the settlement's `history`
 * @returns {boolean}
 */
export function eventHasOpenThread(event, history) {
  if (!event || typeof event !== 'object') return false;
  if (Array.isArray(event.plotHooks) && event.plotHooks.some((h) => (typeof h === 'string' ? h.trim() : h))) return true;
  const name = text(event.name).trim().toLowerCase();
  if (!name) return false;
  return tensionCorpus(/** @type {any} */ (history)?.currentTensions).includes(name);
}

/**
 * The open-thread answer for a TIMELINE entry ({ name, yearsAgo, type }), resolved to its
 * event by name and years ago (the timeline is a chart of the event list).
 * @param {{ name?: unknown, yearsAgo?: unknown }|null|undefined} entry
 * @param {{ historicalEvents?: unknown, currentTensions?: unknown }|null|undefined} history
 * @returns {boolean}
 */
export function timelineEntryHasOpenThread(entry, history) {
  const events = Array.isArray(/** @type {any} */ (history)?.historicalEvents) ? /** @type {any} */ (history).historicalEvents : [];
  const match = events.find((e) => e && e.name === entry?.name && (e.yearsAgo ?? null) === (entry?.yearsAgo ?? null))
    || events.find((e) => e && e.name === entry?.name);
  return eventHasOpenThread(match || entry, history);
}
