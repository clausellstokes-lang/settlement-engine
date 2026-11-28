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
 * line (the slot is never emptied, as at the draw). A description the tables do not know prints as written: a DM's own
 * words (an edited description is the DM's text, which no table holds) and a custom house's. No birth moves.
 *
 * THE SHARED PAGE (the chair's condition (3)): a reader's page re-answers ONLY a set whose every atom reads what no veil
 * address reaches (the config's terrain, the stress record's crisis: `SHARE_SAFE_DIMENSIONS`); a set that reads the
 * roster (the docks, the walls, a gate) prints there AS STORED, so no re-answer lets a reader count a hidden house.
 * Read by the Institutions tab and the PDF's services slice: one leaf.
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
 * @param {{ reader?: boolean }} [options] `reader`: the shared page (the served record)
 * @returns {string} the description to print ('' when the house carries none)
 */
export function institutionDescShown(inst, settlement, options = {}) {
  const own = typeof inst?.desc === 'string' ? inst.desc.trim() : '';
  if (!own || !settlement || typeof settlement !== 'object') return own;
  const noun = tierNounFor(/** @type {never} */ (settlement.tier)) ?? '';
  const set = indexOf(options.reader === true ? SHARE_SAFE_SIBLINGS : DESC_VARIANT_SIBLINGS, noun).get(own);
  if (!set) return own;
  const shown = lineOnFinal(own, { siblings: { [own]: set }, keep: true, speak: (t) => speakTierNoun(t, noun) },
    () => factsOf(/** @type {never} */ (settlement)));
  return typeof shown === 'string' ? shown.trim() : own;
}

/**
 * Every house's description as printed, by its position in `settlement.institutions` (the PDF's services slice).
 * @param {{ institutions?: unknown, tier?: unknown } | null | undefined} settlement @param {{ reader?: boolean }} [options]
 * @returns {string[]}
 */
export function institutionDescsShown(settlement, options = {}) {
  const roster = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  return roster.map((inst) => institutionDescShown(inst, settlement, options));
}

/**
 * The PDF's services slice with each house's description as printed (`detailed[k]` is the slice's row of
 * `settlement.institutions[k]`; a house that stores none keeps the slice's own reading).
 * @template {{ detailed?: Array<{ description?: unknown }> }} S
 * @param {S} slice @param {{ institutions?: unknown, tier?: unknown } | null | undefined} settlement
 * @returns {S}
 */
export function withDescsShown(slice, settlement) {
  if (!slice || !Array.isArray(slice.detailed)) return slice;
  const shown = institutionDescsShown(settlement);
  return { ...slice, detailed: slice.detailed.map((row, k) => (shown[k] ? { ...row, description: shown[k] } : row)) };
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
