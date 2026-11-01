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

/**
 * The active conditions as lower-case words, deduplicated, in record order.
 * @param {Parameters<typeof deriveAllActiveConditions>[0]} settlement
 * @returns {string[]}
 */
export function activeConditionWords(settlement) {
  const seen = new Set();
  const out = [];
  for (const c of deriveAllActiveConditions(settlement)) {
    const word = String(c?.label || c?.archetype || '').trim().toLowerCase();
    if (!word || seen.has(word)) continue;
    seen.add(word);
    out.push(word);
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
