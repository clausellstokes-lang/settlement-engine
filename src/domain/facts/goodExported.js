/**
 * domain/facts/goodExported.js — A GOOD THE SCENE SENDS OUT IS ONE THE TOWN EXPORTS (BAR6-SCENES, LAW 6 rule 6b
 * "out", 2026-11-16; BRIEF-BAR6 seat BAR6-SCENES (b) and B6: a new atom beneath `exports`, vetoable by the owner, on the
 * veto list as new vocabulary).
 *
 *   goodExportedOf(record, key)   `exported: <key>`: the economy's export list (`canonicalAccessors.js :: canonExports`,
 *                                 the list the Economics tab's Exports print from) names the good. A sense pool is made
 *                                 dominant by the exports OR the income shares (`arrivalScene.js :: chooseSense`), so an
 *                                 income share "Wool & Textile Trade" opened "Bolts of cloth and bales of wool fill the
 *                                 carts waiting on the road out." beside exports that carry no cloth
 *                                 (bar0-city-wartime-rand-27; 12 towns of the census's 720 at 600b7683a).
 *
 * Layer 2 (over the economy). Pure: no randomness, no clock, no write.
 * @enforced-by tests/domain/bar6ScenesGoods.test.js
 */
import { canonExports } from '../canonicalAccessors.js';

/** The goods a scene of goods leaving shows, and the words an export names each by. */
export const EXPORTED_GOODS = Object.freeze({
  cloth: /\b(cloth|textiles?|linen|silk|wool)\b/i,
  flour: /\b(flour|grain|bread|baked)\b/i,
  hides: /\b(hides?|leather|pelts?|furs?)\b/i,
  ale: /\b(ale|beer|mead|malt|cider)\b/i,
  arms: /\b(weapons?|armou?r|blades?|swords?|spears?)\b/i,
});

/** @param {unknown} x @returns {string} */
const itemText = (x) => (typeof x === 'string' ? x : String(/** @type {{ name?: unknown, good?: unknown }} */ (x)?.name ?? /** @type {{ good?: unknown }} */ (x)?.good ?? ''));

/**
 * THE ONE READER of `exported: <key>`.
 * @param {unknown} record the settlement record
 * @param {string} key a good of `EXPORTED_GOODS`
 * @returns {boolean | undefined} undefined where there is no record or no such good
 */
export function goodExportedOf(record, key) {
  if (!record || typeof record !== 'object') return undefined;
  const words = Object.prototype.hasOwnProperty.call(EXPORTED_GOODS, key) ? /** @type {Record<string, RegExp>} */ (EXPORTED_GOODS)[key] : undefined;
  if (!words) return undefined;
  const list = canonExports(/** @type {Parameters<typeof canonExports>[0]} */ (record));
  return (Array.isArray(list) ? list : []).some((x) => words.test(itemText(x)));
}
