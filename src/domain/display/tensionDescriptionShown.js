/**
 * tensionDescriptionShown.js — a current tension's description as the page prints it (R6, RULING-R, the eleventh chair,
 * 2026-11-27).
 *
 * The resource-scarcity template's two stored sentences (`historyData.js :: HISTORICAL_EVENTS_DATA` resource_scarcity: its
 * `description`, and `byMemory.unanchored.description`, the words a tension takes where the timeline holds no event of its
 * own) say "a critical resource" and never which, while the Economics tab names the good the record holds short (the
 * DS-ECO shortfall line, through `criticalImportRow.js :: criticalImportRow`). Where that reader names a good, the sentence
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
 *
 * NOT WHERE THE PAGE'S OWN STORES HOLD THE GOOD (RULING 122-A-2, the independent reader by rendering: eleven towns of V named
 * grain beside the Tonight sheet's "Stores: a granary, about nine months of grain"; the record's grain there is an input its
 * work brings in, not a want of food). The stores line's one reader is `summary/tonightSheet.js :: foodStoresWords` over
 * `economicState.foodSecurity.foodRecord`; the one good it names is grain, the granary's (its held form, "a granary of …",
 * is the same store). The reader is ASKED, not copied: its line is read with the record's granary and again without it, and
 * where the two differ it reports a granary. There, a short good spelt "grain" (the import key's bare-common fill, matched
 * whole, trimmed and in lower case) prints the stored sentence. Every other good is named as before. The import adds no
 * module to a closure that holds this leaf: the PDF render worker and Foundry's export hold the tonight sheet already.
 */
import { criticalImportRow } from './criticalImportRow.js'; // RULING 122-B-2 (F7): the leaf, not the desk
import { foodStoresWords } from '../summary/tonightSheet.js';

/** The one good the stores reader names: a granary's stores are "months of grain". */
const STORES_GOOD = 'grain';

/**
 * Whether the stores reader reports a store of `good` for this record.
 * @param {unknown} settlement @param {string} good @returns {boolean}
 */
function storesHold(settlement, good) {
  if (good.trim().toLowerCase() !== STORES_GOOD) return false;
  const record = /** @type {{ economicState?: { foodSecurity?: { foodRecord?: unknown } | null } | null } | null | undefined} */ (settlement)
    ?.economicState?.foodSecurity?.foodRecord;
  if (!record || typeof record !== 'object') return false;
  const rec = /** @type {Parameters<typeof foodStoresWords>[0]} */ (record);
  const line = foodStoresWords(rec);
  return line !== '' && line !== foodStoresWords({ ...rec, hasGranary: false });
}

/** `HISTORICAL_EVENTS_DATA` resource_scarcity `description`, as stored. */
export const SCARCITY_STORED_PAST = 'A critical resource became scarce, causing hoarding and price gouging';
/** `HISTORICAL_EVENTS_DATA` resource_scarcity `byMemory.unanchored.description`, as stored. */
export const SCARCITY_STORED_LIVE = 'A critical resource is running short, and some are hoarding it while others cannot pay the prices asked';
const LEAD = 'A critical resource ';

/** The two stored sentences, each led by "A critical resource ". @type {ReadonlySet<string>} */
const STORED = new Set([SCARCITY_STORED_PAST, SCARCITY_STORED_LIVE]);

/**
 * @param {unknown} settlement the record (its `resourceAnalysis.imports` and `economicState.foodSecurity.foodRecord` are read)
 * @param {unknown} tension a current tension (its `description` is read)
 * @returns {unknown} the description as printed; a non-string description is handed back untouched
 */
export function tensionDescriptionShown(settlement, tension) {
  const description = /** @type {{ description?: unknown } | null | undefined} */ (tension)?.description;
  if (typeof description !== 'string' || !STORED.has(description)) return description;
  const imports = /** @type {{ resourceAnalysis?: { imports?: unknown } | null } | null | undefined} */ (settlement)?.resourceAnalysis?.imports;
  const good = criticalImportRow(/** @type {Parameters<typeof criticalImportRow>[0]} */ (imports))?.good;
  return good && !storesHold(settlement, good) ? `A critical resource, ${good}, ${description.slice(LEAD.length)}` : description;
}
