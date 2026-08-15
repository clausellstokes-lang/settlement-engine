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
