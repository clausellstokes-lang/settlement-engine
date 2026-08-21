/**
 * domain/magicAssertionText.js — THE ONE READING OF "does this text claim magic works?".
 *
 * These three constants were born inside `generators/generationContext.js`, where the
 * generation world law uses them to decide whether a generated line asserts functional
 * magic. MG-3h needed the identical reading one layer down — the arcane-identity detector's
 * name fallback must strip the SAME negations before it tests the SAME assertion vocabulary,
 * because two spellings of "this text claims magic" is precisely the drift the leak register
 * kept finding (L10-L12 are all one class: a second spelling of the magic gate).
 *
 * So the reading moved here, to a leaf src/domain can import, and generationContext now
 * re-exports it. NOTHING about the patterns changed in the move — the world law's answers
 * are byte-identical, which `tests/generators/generationWorldLaw.test.js` still pins.
 *
 * Pure; no imports; never throws.
 */

/**
 * The affirmative vocabulary. A line matching this claims magic FUNCTIONS — it is not a
 * list of fantasy-flavoured words, it is the set of claims a mundane world must not make.
 */
export const MAGIC_ASSERTION_PATTERN =
  /\b(?:arcane|artificer|cantrips?|curses?|druid|enchant(?:ed|ing|ment)?|golems?|mage|magic|magical|necromanc(?:er|y|tic)|planar|runes?|scry(?:ing)?|sorcerer|spells?|teleport(?:ation)?|undead|warlock|witch|wizard)\b/i;

/**
 * Explicit denials of functional magic. These are clause-shaped instead of
 * deleting broad words such as "no" or "not": "no magic in it" is benign,
 * while "no ward stops the wizard" still retains its affirmative wizard claim.
 * The final certification receipt uses this same predicate as the producers.
 */
export const NEGATED_MAGIC_PATTERNS = Object.freeze([
  /\bnon[- ]magical\b/gi,
  /\bno\s+(?:actual\s+|real\s+|functional\s+)?magic(?:al)?(?:\s+(?:ability|compound|effect|ingredient|power|properties|quality|value)s?)?(?:\s+(?:in|to|within)\s+(?:it|them|this|the\s+[a-z'-]+))?\b/gi,
  /\bnothing\s+magical(?:\s+(?:here|about\s+(?:it|this)))?\b/gi,
  /\brather than (?:any\s+)?(?:actual\s+|real\s+|functional\s+)?magic\b/gi,
  /\bwhere the alchemist deals in magical compounds? and acid, this trade does not\b/gi,
  /\b(?:mere|only|purely)\s+stage magic\b/gi,
  /\bstage magic\b/gi,
]);

/**
 * Remove every explicit denial clause from a line, leaving whatever affirmative claim
 * survives. Exported because a classifier that reads names must strip the SAME denials
 * before it reads them — a faction described as "a non-magical college of letters" is a
 * college of letters.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function stripNegatedMagic(value) {
  let text = String(value || '');
  for (const pattern of NEGATED_MAGIC_PATTERNS) {
    text = text.replace(pattern, '');
  }
  return text;
}

/**
 * True when the text, once its denials are struck out, still claims magic functions.
 * @param {unknown} value
 * @returns {boolean}
 */
export function textAssertsFunctionalMagic(value) {
  return MAGIC_ASSERTION_PATTERN.test(stripNegatedMagic(value));
}
