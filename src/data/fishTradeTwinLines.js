/**
 * fishTradeTwinLines.js — the cart twin of a fish-trade line, used ONLY where the place has no fish
 * of its own and buys none in (F11 unit 3, rung 2B; the chair's ruling of 2026-11-04: a fishmonger
 * needs a fish source OR fish among the imports, else it is the cart's trade). F10's rule for the
 * defence twins (`defenceTwinLines.js`): keyed by the line's own text, taken AFTER the draw, so no
 * roll moves and only the persisted string varies.
 *
 * WHAT A LINE NEEDS is the food record's fish (`economicState.foodSecurity.foodRecord.foodSources`
 * holding `fish`, the one food record: `foodGenerator.js :: fishSource`) or a fish good among
 * `economicState.primaryImports` (the food words' own fish reading, `domain/foodways.js ::
 * SOURCE_WORDS.fish`), so the writer and the food-words check cannot disagree about a sentence.
 *
 * VETOABLE (the owner's wording call): each twin is the smallest plain rewrite that keeps the
 * line's beat and names no catch of the place's own.
 */
import { SOURCE_WORDS } from '../domain/foodways.js';

/** @type {Readonly<Record<string, string>>} */
export const FISH_TRADE_TWIN_LINES = Object.freeze({
  // institutionDescVariants.js — the Fishmonger's first variant (its second sentence).
  'The trade that carries fish from the net to the table.': 'The trade that carries fish from the cart to the table.',
});

/**
 * Does the record give the place fish: a fish source of its own, or fish among its imports?
 * An unknown record (no food record) answers true, so a save older than the record keeps its text.
 * @param {any} economicState
 * @returns {boolean}
 */
export function recordHoldsFish(economicState) {
  const sources = economicState?.foodSecurity?.foodRecord?.foodSources;
  if (!Array.isArray(sources)) return true;
  if (sources.includes('fish')) return true;
  const imports = Array.isArray(economicState?.primaryImports) ? economicState.primaryImports : [];
  return imports.some((good) => typeof good === 'string' && SOURCE_WORDS.fish.test(good));
}

/**
 * A drawn passage as this place can speak it, sentence by sentence: a keyed fish-trade sentence
 * takes its cart twin where the place holds no fish; every other sentence is kept to the byte.
 * @template T
 * @param {T} text
 * @param {boolean} holdsFish `recordHoldsFish`'s answer
 * @returns {T}
 */
export function fishTradeTwinSentences(text, holdsFish) {
  if (typeof text !== 'string' || holdsFish) return text;
  const twinned = text.split(/(?<=[.!?])(\s+)/).map((part) => FISH_TRADE_TWIN_LINES[part] ?? part).join('');
  return /** @type {T} */ (/** @type {unknown} */ (twinned));
}

/**
 * The roster as the record can speak it: each institution whose description holds a keyed line
 * the place cannot speak gets a copy with the twin; every other institution is the same object.
 * @template {{ desc?: unknown }} I
 * @param {I[]} institutions
 * @param {any} economicState
 * @returns {I[]}
 */
export function fishTradeTwinned(institutions, economicState) {
  if (!Array.isArray(institutions) || recordHoldsFish(economicState)) return institutions;
  return institutions.map((inst) => {
    const desc = inst?.desc;
    const twin = fishTradeTwinSentences(desc, false);
    return twin === desc ? inst : { ...inst, desc: twin };
  });
}
