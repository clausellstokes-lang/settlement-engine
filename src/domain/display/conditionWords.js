/**
 * domain/display/conditionWords.js — THE WORDS THE FOUNDATIONS SENTENCE PRINTS.
 *
 * THE TRIM (the owner, 2026-11-01, ODQ §934.103; rubric R4): the Foundations grid used
 * to end on a fixed line, "This reading includes current conditions: siege, drawdown,
 * outbreak", on every town, including the thousand with no condition at all. The
 * sentence is kept where it is true: it names the conditions the reading folds in
 * (settlement.activeConditions, the same record deriveCausalState reads) and prints
 * nothing when there are none. One leaf, read by the screen (SubstrateTab) and by print
 * (SystemStateSnapshot), so the two can never disagree on the words.
 */
import { deriveAllActiveConditions } from '../activeConditions.js';
import { archetypeForStressor } from '../conditionPromotion.js';
import { canonStressors } from '../canonicalAccessors.js';

/**
 * The names of the record's own crises that promote to one archetype (conditionPromotion.js's one mapping), in the
 * record's order. R3-CODE-C (ROUND-3-CUT #304): a beast threat is filed under `war_pressure`, whose label is
 * "Wartime pressure"; a condition promoted at generation IS the town's crisis, so the sentence names the crisis.
 * @param {unknown} settlement @param {string} archetype
 * @returns {string[]}
 */
function crisisNamesFor(settlement, archetype) {
  return canonStressors(/** @type {never} */ (settlement))
    .filter((st) => archetypeForStressor(st) === archetype)
    .map((st) => String(st?.name || st?.label || '').trim())
    .filter(Boolean);
}

/**
 * The active conditions as lower-case words, deduplicated, in record order. A condition promoted at generation is
 * named by the crisis it came from (its stressors' own names); any other condition (an event's, the world pulse's) by
 * its label.
 * @param {Parameters<typeof deriveAllActiveConditions>[0]} settlement
 * @returns {string[]}
 */
export function activeConditionWords(settlement) {
  const seen = new Set();
  const out = [];
  for (const c of deriveAllActiveConditions(settlement)) {
    const fromCrisis = c?.triggeredAt?.sourceEventType === 'GENERATION' ? crisisNamesFor(settlement, String(c.archetype || '')) : [];
    const names = fromCrisis.length ? fromCrisis : [String(c?.label || c?.archetype || '')];
    for (const name of names) {
      const word = name.trim().toLowerCase();
      if (!word || seen.has(word)) continue;
      seen.add(word);
      out.push(word);
    }
  }
  return out;
}

/**
 * The one sentence, or '' when there is nothing to say.
 * @param {string[]} words
 * @returns {string}
 */
export function conditionsSentence(words) {
  if (!words || words.length === 0) return '';
  return `This reading includes the current ${words.length === 1 ? 'condition' : 'conditions'}: ${words.join(', ')}.`;
}
