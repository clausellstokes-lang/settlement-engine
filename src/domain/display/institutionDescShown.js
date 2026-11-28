/**
 * domain/display/institutionDescShown.js — A HOUSE's DESCRIPTION AS PRINTED (SURVEY S-A, the chair's ruling S-A-1).
 *
 * A house's description is drawn at birth (`generators/steps/institutionDescDraw.js`) against the record as it stood
 * then, and stored in `inst.desc`. Later passes move the record under it: `cascadePass` adds the docks after the customs
 * house's line was drawn "by road"; the terrain is written after the charcoal burner's line was drawn for a place with
 * no forest; a siege the draw did not read stands at the end. Where the description prints, its draw-time sibling set
 * (`institutionDescVariants.js :: DESC_VARIANT_SIBLINGS`, the table the draw and the close-time re-read
 * `assembleSettlement.js :: readHouseDescsLate` resolve) is re-answered on the FINAL record, by the door's own rule
 * (`facts/lineOnFinal.js`): the original where the record admits it, else its twin; nothing admitted keeps the stored
 * line (the slot is never emptied, as at the draw). A description the DM edited (the edits ledger's institution record
 * at `desc`, S-A-3) and one the tables do not know (a custom house's) print as written. No birth moves.
 *
 * THE AUDIENCE IS STATED (S-A-4): every caller says whose page it prints (`owner` or `reader`), from the page's own
 * source (`OutputContainer`'s `publicDossier`); a caller that states none prints the description AS STORED.
 * THE SHARED PAGE (the chair's condition (3)): a reader's page re-answers ONLY a set whose every atom reads what no veil
 * address reaches (the config's terrain, the stress record's crisis: `SHARE_SAFE_DIMENSIONS`); a set that reads the
 * roster (the docks, the walls, a gate) prints there AS STORED, so no re-answer lets a reader count a hidden house.
 * Read by the Institutions tab, and once for the whole-document surfaces by `printRecord.js` (S-A-2): one leaf.
 *
 * Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/domain/display/institutionDescShown.test.js
 */
import { DESC_VARIANT_SIBLINGS } from '../../data/institutionDescVariants.js';
import { atomsOf, declarationOf, parseAtom } from '../facts/factVocabulary.js';
import { factsOf } from '../facts/factsOf.js';
import { lineOnFinal } from '../facts/lineOnFinal.js';
import { lineText } from '../facts/drawDeclared.js';
import { walkUserEdits } from '../userEdits.js';
import { speakTierNoun } from './stateProse/stateProseKernel.js';
import { tierNounFor } from './stateProse/weaveBlock.js';

/** The fact dimensions no veil address reaches: a shared page may re-answer a set that reads only these. */
export const SHARE_SAFE_DIMENSIONS = Object.freeze(['terrain', 'crisis']);

/** @param {ReadonlyArray<unknown>} set @returns {boolean} */
const readsOnlyShareSafe = (set) => set.every((l) => atomsOf(declarationOf(l)).every((a) => {
  const atom = parseAtom(a.replace(/^no\s+/i, ''));
  return !!atom && SHARE_SAFE_DIMENSIONS.includes(atom.dimension);
}));

/** The sibling sets a shared page may re-answer (read once). */
const SHARE_SAFE_SIBLINGS = Object.freeze(Object.fromEntries(Object.entries(DESC_VARIANT_SIBLINGS)
  .filter(([, set]) => Array.isArray(set) && readsOnlyShareSafe(set))));

/**
 * @param {{ desc?: unknown } | null | undefined} inst the house as the record holds it
 * @param {{ tier?: unknown } | null | undefined} settlement the FINAL record the page reads
 * @param {{ audience?: 'owner' | 'reader' }} [options] THE AUDIENCE, STATED BY EVERY CALLER (S-A-4): `owner`, the owner's
 *   page and the whole-document surfaces (every set re-answered); `reader`, a shared page (only the share-safe sets).
 *   NONE STATED FAILS CLOSED: the description prints as stored.
 * @returns {string} the description to print ('' when the house carries none)
 */
export function institutionDescShown(inst, settlement, options = {}) {
  const own = typeof inst?.desc === 'string' ? inst.desc.trim() : '';
  const audience = options.audience === 'owner' || options.audience === 'reader' ? options.audience : null;
  if (!own || !audience || !settlement || typeof settlement !== 'object' || editedDescsOf(settlement).has(/** @type {object} */ (inst))) return own; // S-A-4: no audience, as stored; S-A-3: a DM's words are never re-answered
  const noun = tierNounFor(/** @type {never} */ (settlement.tier)) ?? '';
  const set = indexOf(audience === 'reader' ? SHARE_SAFE_SIBLINGS : DESC_VARIANT_SIBLINGS, noun).get(own);
  if (!set) return own;
  const shown = lineOnFinal(own, { siblings: { [own]: set }, keep: true, speak: (t) => speakTierNoun(t, noun) },
    () => factsOf(/** @type {never} */ (settlement)));
  return typeof shown === 'string' ? shown.trim() : own;
}

/** @type {WeakMap<object, Set<object>>} the record → the houses whose description the DM edited */
const EDITED = new WeakMap();

/**
 * The houses whose description the DM edited, by the edits ledger's own walk (`userEdits.js :: walkUserEdits`, the
 * institution record at path `desc`): never a second reading of the ledger. @param {object} settlement @returns {Set<object>}
 */
function editedDescsOf(settlement) {
  let set = EDITED.get(settlement);
  if (!set) {
    set = new Set(walkUserEdits(/** @type {never} */ (settlement)).filter((r) => r.kind === 'institution' && r.path === 'desc').map((r) => /** @type {object} */ (r.entity)));
    EDITED.set(settlement, set);
  }
  return set;
}

/** @type {WeakMap<object, Map<string, Map<string, ReadonlyArray<unknown>>>>} table → tier noun → spoken line → its set */
const INDEX = new WeakMap();

/**
 * Every member line of a table's sets, in the tier noun a description is stored in, to its set (built once a noun).
 * @param {Readonly<Record<string, ReadonlyArray<unknown>>>} table @param {string} noun
 * @returns {Map<string, ReadonlyArray<unknown>>}
 */
function indexOf(table, noun) {
  let byNoun = INDEX.get(table);
  if (!byNoun) INDEX.set(table, (byNoun = new Map()));
  let index = byNoun.get(noun);
  if (!index) {
    index = new Map();
    for (const set of Object.values(table)) {
      if (!Array.isArray(set)) continue;
      for (const l of set) {
        const t = lineText(l);
        if (typeof t === 'string' && !index.has(speakTierNoun(t, noun).trim())) index.set(speakTierNoun(t, noun).trim(), set);
      }
    }
    byNoun.set(noun, index);
  }
  return index;
}
