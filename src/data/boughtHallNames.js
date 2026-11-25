/**
 * data/boughtHallNames.js — THE BOUGHT HALL'S BIRTH NAMES, IN ONE HOME (C1B, point 117; the tenth chair's RULING-R24 R24r
 * item 4). C1 (R24-C1, R24g (2), R24m) gave the hall a criminal interest has bought a plain name at birth, so that a player's
 * page no longer announces the crime: "Corrupt Council" -> "Council of Aldermen" (a town), "Corrupt City Council" ->
 * "Council of Syndics" (a city), "Shadow Senate" -> "Senate" (a metropolis). The old names stay readable for saved places.
 * The meaning the old names carried by their WORDS ("corrupt", "shadow") is now carried by the EXACT birth name, and every
 * reader that took that meaning from the words reads the birth name AS IT READS THE OLD NAME this table pairs it with:
 * `domain/factionArchetypes.js`, `generators/power/factionCategories.js`, `domain/seat/seatTable.js` and
 * `domain/worldPulse/thievesGuild.js`. (The birth itself, `generators/power/rulingStructure.js :: generatePowerStructure`'s
 * return, keeps its own literal rename: that module stands at its 800-line ceiling.) A reader that uses a power's name as an arbitrary key
 * may re-deal (R24m), and reads nothing here.
 *
 * WHY THE DATA LAYER: a pure leaf (no imports) that a domain file and a generator file may both import without a new layer
 * edge (`engine-core` -> `data` is the lawful direction; cf. `data/people/powerSentenceName.js`).
 *
 * ⛔ NEVER A USER'S OWN ROW: the exact-name reading never applies to a power the record marks as the user's own
 * (`isUserAuthoredPower`): a DM's ADD_FACTION row (`events/mutateEntities.js :: addFaction` stamps `createdByEventId`) or a
 * custom-content row (`content/settlementContentProvenance.js :: customObject`'s marks). A DM's EDIT of a generated hall's text
 * (`_authored`, `_userEdits`) is not authorship: the hall is still the one the birth bought. A bare string carries no mark and
 * is read by its exact name.
 * @enforced-by tests/domain/boughtHallNames.test.js
 * @enforced-by tests/domain/boughtHallReaders.test.js
 */

/** @typedef {{ readonly birthName: string, readonly oldName: string }} BoughtHall */

/** The three birth names, each with the old name it replaces (town, city, metropolis). @type {ReadonlyArray<BoughtHall>} */
export const BOUGHT_HALL_NAMES = Object.freeze([
  Object.freeze({ birthName: 'Council of Aldermen', oldName: 'Corrupt Council' }),
  Object.freeze({ birthName: 'Council of Syndics', oldName: 'Corrupt City Council' }),
  Object.freeze({ birthName: 'Senate', oldName: 'Shadow Senate' }),
]);

/** The old name a birth name replaces, for the EXACT birth name (trimmed; case and any suffix kept), else null.
 *  @param {unknown} name @returns {string | null} */
export function boughtHallOldName(name) {
  const n = typeof name === 'string' ? name.trim() : '';
  return BOUGHT_HALL_NAMES.find((h) => h.birthName === n)?.oldName ?? null;
}

/** Does the record mark this power as the user's own (a DM-added or custom-content row)?
 *  @param {unknown} row @returns {boolean} */
export function isUserAuthoredPower(row) {
  if (!row || typeof row !== 'object') return false;
  const r = /** @type {Record<string, unknown>} */ (row);
  const text = (/** @type {unknown} */ v) => typeof v === 'string' && v.trim() !== '';
  return text(r.createdByEventId) || r.custom === true || r.isCustom === true || r.source === 'custom'
    || text(r.customDefinitionId) || text(r.definitionId);
}

/** A row's own stored category, trimmed and lower-cased; '' when it carries none. @param {unknown} row @returns {string} */
const categoryOf = (row) => {
  const c = /** @type {{ category?: unknown }} */ (row).category;
  return typeof c === 'string' ? c.trim().toLowerCase() : '';
};

/** The old name a power ROW's birth name replaces (RULING C1B-2 (1): A ROW'S OWN CATEGORY IS THE TRUTH): its name in
 *  `rulingPower.nameOf`'s precedence (`.faction`, then `.name`), for a row whose own category is criminal (every born hall
 *  carries `category: 'criminal'`) or that carries no category at all (read by its name, as a bare string is); never for a
 *  row whose own category says anything else (a generated power the DM renamed "Senate" keeps its own kind), nor for a row
 *  the record marks as the user's own; else null. @param {unknown} row @returns {string | null} */
export function boughtHallOldNameOfRow(row) {
  if (!row || typeof row !== 'object' || isUserAuthoredPower(row)) return null;
  const cat = categoryOf(row);
  if (cat !== '' && cat !== 'criminal') return null;
  const r = /** @type {{ faction?: unknown, name?: unknown }} */ (row);
  return boughtHallOldName(String(r.faction || r.name || ''));
}

/** The same, STRICT (the world pulse, RULING C1B-2 (1)): only a row whose own category is criminal.
 *  @param {unknown} row @returns {string | null} */
export function boughtHallOldNameOfCriminalRow(row) {
  return row && typeof row === 'object' && categoryOf(row) === 'criminal' ? boughtHallOldNameOfRow(row) : null;
}
