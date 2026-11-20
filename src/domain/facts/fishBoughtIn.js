/**
 * domain/facts/fishBoughtIn.js — THE TOWN'S FISH IS BOUGHT IN (FAULTS-ROWS, the sixth chair's rulings FR4 and FR12 (3) of
 * 2026-11-18; NEW VOCABULARY, `fish bought in`, on the owner's veto list).
 *
 *   fishBoughtIn(record)   true where the town's fish ground is used up (`supplyStory.js :: usedGroundOf(record, 'fish')`) AND
 *                          the stored imports hold that ground's own shortage word ("Salted fish (local … exhausted)":
 *                          `resourceSemantics.js :: resourceShortageImport`, read by `supplyStory.js :: importsHold`): the
 *                          bought story, as every view reads it. False where a fish ground lives (the fishers land their own
 *                          catch), where none ever lay, and in an IDLE town (the ground spent and nothing brought in).
 *
 * ONE FACT, ONE READER: this is the condition under which BAR8-FISH-ROWS's swap gives the Fish market its "Preserved fish" row
 * (`steps/generateNarratives.js :: boughtFishRowsInPlace`, ruling BR24), and that step reads THIS function in place of its own
 * two calls; the atom `fish bought in` (`factVocabulary.js`) reads it too, so the card that speaks of the day's catch
 * (`institutionDescVariants.js :: DESC_LATE_SIBLINGS`) and the row cannot disagree. `supplyStory.js` holds both readings but
 * hands every shortage word in from its callers (it reads no `resourceSemantics.js`), so the join lives here, a leaf of its own.
 *
 * Layer 4 (over the resource record and the roster the grounds are read from, and the imports the birth writes in the
 * narratives step). Import-clean for the eager core (EG1): `supplyStory.js` and `resourceSemantics.js` ride it already
 * (`chainWorking.js` reads the second). Pure: no randomness, no clock, no write.
 * @enforced-by tests/generators/faultsRows.test.js
 */
import { importsHold, usedGroundOf } from './supplyStory.js';
import { resourceShortageImport } from '../resourceSemantics.js';

/**
 * The fish is bought in: the fish ground used up and its shortage word on the imports.
 * @param {unknown} record the settlement record (or the record in the making: `{ config, economicState, institutions, resourceAnalysis }`)
 * @returns {boolean}
 */
export function fishBoughtIn(record) {
  if (!record || typeof record !== 'object') return false;
  // no import, no fish bought in: read first, so the verdict is the same and every record answers the imports it reads
  const imports = /** @type {{ economicState?: { primaryImports?: unknown } }} */ (record).economicState?.primaryImports;
  if (!Array.isArray(imports) || imports.length === 0) return false;
  const story = /** @type {Parameters<typeof usedGroundOf>[0]} */ (record);
  const ground = usedGroundOf(story, 'fish');
  return !!ground && importsHold(story, String(resourceShortageImport(ground) || ''));
}
