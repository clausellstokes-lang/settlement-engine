/**
 * tensionDescriptionShown.js — a current tension's description as the page prints it (R6, RULING-R, the eleventh chair,
 * 2026-11-27).
 *
 * The resource-scarcity template's two stored sentences (`historyData.js :: HISTORICAL_EVENTS_DATA` resource_scarcity: its
 * `description`, and `byMemory.unanchored.description`, the words a tension takes where the timeline holds no event of its
 * own) say "a critical resource" and never which, while the Economics tab names the good the record holds short (the
 * DS-ECO shortfall line, through `economyStateProse.js :: criticalImportRow`). Where that reader names a good, the sentence
 * prints a named twin, the good set beside "a critical resource"; the stored string stays as it is. Where the record names
 * no good, or the description is any other sentence (a DM's edit, the words the selection wrote for this town), it prints
 * as stored. Print-time only: no record moves, and a saved town is reached.
 *
 * ONE HELPER, called by every surface that prints a tension's description: the History tab's tension row (and the
 * search's), the Overview's tension list, and the PDF's view model.
 *
 * It names the good for a CURRENT tension only: a past event (`history.historicalEvents[]`) is not named, because the
 * record's present shortfall does not say which good a past event was about (RULING 122-A-1, the eleventh chair).
 *
 * THE TWO STORED SENTENCES ARE HELD HERE, word for word, and `historyData.js` is NOT imported (RULING 122-A-1: the table
 * would ride into the PDF's render worker, 31 KB). tests/components/historyTab.test.jsx asserts each equals the table's
 * string, so a re-wording of the table reds until these follow.
 */
import { criticalImportRow } from './stateProse/economyStateProse.js';

/** `HISTORICAL_EVENTS_DATA` resource_scarcity `description`, as stored. */
export const SCARCITY_STORED_PAST = 'A critical resource became scarce, causing hoarding and price gouging';
/** `HISTORICAL_EVENTS_DATA` resource_scarcity `byMemory.unanchored.description`, as stored. */
export const SCARCITY_STORED_LIVE = 'A critical resource is running short, and some are hoarding it while others cannot pay the prices asked';
const LEAD = 'A critical resource ';

/** The two stored sentences, each led by "A critical resource ". @type {ReadonlySet<string>} */
const STORED = new Set([SCARCITY_STORED_PAST, SCARCITY_STORED_LIVE]);

/**
 * @param {unknown} settlement the record (its `resourceAnalysis.imports` is read)
 * @param {unknown} tension a current tension (its `description` is read)
 * @returns {unknown} the description as printed; a non-string description is handed back untouched
 */
export function tensionDescriptionShown(settlement, tension) {
  const description = /** @type {{ description?: unknown } | null | undefined} */ (tension)?.description;
  if (typeof description !== 'string' || !STORED.has(description)) return description;
  const imports = /** @type {{ resourceAnalysis?: { imports?: unknown } | null } | null | undefined} */ (settlement)?.resourceAnalysis?.imports;
  const good = criticalImportRow(/** @type {Parameters<typeof criticalImportRow>[0]} */ (imports))?.good;
  return good ? `A critical resource, ${good}, ${description.slice(LEAD.length)}` : description;
}
