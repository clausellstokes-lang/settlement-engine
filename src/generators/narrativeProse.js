/**
 * narrativeProse.js
 * Generator-side prose normalization shared by composed narrative builders.
 *
 * These helpers operate only on already-selected text. They consume no random
 * draws and hold no generation state, so callers can use them without changing
 * deterministic stream budgets.
 */

/**
 * Capitalize the first character of a composed sentence fragment.
 *
 * @param {unknown} value
 * @returns {string}
 */
export const sentenceCase = value => {
  const text = String(value || '');
  return text ? text[0].toUpperCase() + text.slice(1) : text;
};

/**
 * Does a slot at `offset` in `text` open a sentence (the string's start, or just after a
 * sentence-terminal `.`, `!` or `?` and whitespace)? The grammar reading is the generation
 * receipt's own (`generationCoherence.js :: buildGenerationCoherenceReceipt`, "Sentence begins
 * with a lower-case word.").
 *
 * @param {string} text
 * @param {number} offset
 * @returns {boolean}
 */
export const opensSentence = (text, offset) => /(?:^|[.!?]\s+)$/.test(String(text).slice(0, offset));

/**
 * Fill `{key}` slots with the held value, else the FALLBACK (lower-case filler such as
 * 'someone', used when there is no name to put in the slot). A slot that opens a sentence is
 * sentence-cased (F11, rung 2B: the one-NPC thorp's "…attend. someone has not yet understood…");
 * a held name is already capitalised and prints unchanged, and a lower-case held phrase (the tier
 * wording "the village elders" standing for an absent governing faction) is capitalised there too,
 * as `power/settlementNarrative.js :: sentenceStart` does. Mid-sentence, every value prints as
 * given. An unknown slot stays as written. Draw-free.
 *
 * @param {string} template
 * @param {Record<string, unknown>} values
 * @param {Record<string, string>} [fallbacks]
 * @returns {string}
 */
export const fillSentenceSlots = (template, values, fallbacks = {}) => String(template).replace(
  /\{(\w+)\}/g,
  (whole, key, offset, text) => {
    const value = values[key] || fallbacks[key];
    if (!value) return whole;
    return opensSentence(text, offset) ? sentenceCase(value) : String(value);
  },
);

/**
 * Collapse article collisions introduced where two authored fragments meet.
 * The retained article preserves the original sentence-position casing.
 *
 * @param {unknown} value
 * @returns {string}
 */
export const collapseArticleSeams = value => String(value || '')
  .replace(
    /\b([Tt]he)\s+(?:[Tt]he|[Aa]|[Aa]n)\s+/g,
    (_match, leadingArticle) => `${leadingArticle} `,
  );
