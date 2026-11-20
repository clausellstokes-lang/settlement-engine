/**
 * data/tensionSidePower.js — THE {power} FILL (PAGE-7, CAUSES-DATA addendum 3, item 4: the chair's ruling of 16:30). ONE
 * pure helper beside the sides table (`data/tensionSideMeanings.js`, whose rule 0 names it: "a power kind only where the
 * document holds EXACTLY ONE power of that kind (two or none: the row's own words)").
 *
 *   solePowerNameOf(record, category, start)   where the document in hand holds exactly one power of the category
 *                                              (`powerStructure.factions[].category`, the roster's own mark), its name as
 *                                              a sentence takes it (`people/powerSentenceName.js :: powerNameWithArticle`,
 *                                              the names lane's one reader: "the Merchant League", "The Guard" opening a
 *                                              sentence); else null (none, two or more, or a nameless power).
 *
 * Read by `domain/display/tensionCause.js` for outside_debt's `merchants_rule` (category economy): a cause whose wordings
 * hold `{power}` does not hold where this answers null. The sides table's own reader, when the display seat builds it,
 * fills its `named` rows here too: never a second fill.
 *
 * Pure: no randomness, no clock, no write.
 * @enforced-by tests/domain/tensionSidePower.test.js
 */
import { powerNameWithArticle } from './people/powerSentenceName.js';

/**
 * @param {unknown} record the document in hand
 * @param {string} category a power category of the roster (`economy`, `military`, `criminal`, …)
 * @param {boolean} [start] the name opens its sentence
 * @returns {string | null}
 */
export function solePowerNameOf(record, category, start = false) {
  const factions = /** @type {{ powerStructure?: { factions?: unknown } | null } | null | undefined} */ (record)?.powerStructure?.factions;
  if (!Array.isArray(factions)) return null;
  const ofKind = factions.filter((/** @type {{ category?: unknown } | null | undefined} */ f) => !!f && f.category === category);
  if (ofKind.length !== 1) return null;
  const name = powerNameWithArticle(ofKind[0].faction ?? '', start);
  return name || null;
}
