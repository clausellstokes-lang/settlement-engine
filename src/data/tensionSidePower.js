/**
 * data/tensionSidePower.js — THE {power} FILL (PAGE-7, CAUSES-DATA addendum 3, item 4: the chair's ruling of 16:30). ONE
 * pure helper beside the sides table (`data/tensionSideMeanings.js`, whose rule 0 names it: "a power kind only where the
 * document holds EXACTLY ONE power of that kind (two or none: the row's own words)").
 *
 *   solePowerNameOf(record, 'ruler', start)    the GOVERNING power's name (`isGoverning`), as below (addendum 4, the
 *                                              chair's 17:32: outside_debt's `merchants_rule`), else null;
 *   solePowerNameOf(record, category, start)   where the document in hand holds exactly one power of the category
 *                                              (`powerStructure.factions[].category`, the roster's own mark), its name as
 *                                              a sentence takes it (`people/powerSentenceName.js :: powerNameWithArticle`,
 *                                              the names lane's one reader: "the Merchant League", "The Guard" opening a
 *                                              sentence); else null (none, two or more, or a nameless power).
 *
 * Read by `domain/display/tensionCause.js` for outside_debt's `merchants_rule` ('ruler'): a cause whose wordings
 * hold `{power}` does not hold where this answers null. The sides table's own reader, when the display seat builds it,
 * fills its `named` rows here too: never a second fill.
 *
 * Pure: no randomness, no clock, no write.
 * @enforced-by tests/domain/tensionSidePower.test.js
 */
import { powerNameWithArticle } from './people/powerSentenceName.js';

/**
 * @param {unknown} record the document in hand
 * @param {string} category 'ruler' (the governing power), or a power category of the roster (`economy`, `military`, …)
 * @param {boolean} [start] the name opens its sentence
 * @returns {string | null}
 */
export function solePowerNameOf(record, category, start = false) {
  const factions = /** @type {{ powerStructure?: { factions?: unknown } | null } | null | undefined} */ (record)?.powerStructure?.factions;
  if (!Array.isArray(factions)) return null;
  // 'ruler' (addendum 4, the chair's 17:32: merchants_rule): the GOVERNING power, however many share its category; every
  // other kind keeps the exactly-one test (the sides table's rule 0)
  const ofKind = category === 'ruler'
    ? factions.filter((/** @type {{ isGoverning?: unknown } | null | undefined} */ f) => !!f && f.isGoverning === true)
    : factions.filter((/** @type {{ category?: unknown } | null | undefined} */ f) => !!f && f.category === category);
  if (ofKind.length !== 1) return null;
  const name = powerNameWithArticle(ofKind[0].faction ?? '', start);
  return name || null;
}
