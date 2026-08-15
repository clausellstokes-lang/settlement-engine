/**
 * markdownEscape.js — THE ONE escaper for every Foundry journal page.
 *
 * Two lanes render settlement data into Foundry markdown: the in-app module
 * builder (src/foundry/journalPages.js, which zips journals.json into a
 * generated module) and this standalone world importer (build-journals.js).
 * They carried SEPARATE escapers with divergent character classes and opposite
 * pass ordering, with no cross-pin — a silent-drift hazard on a security-shaped
 * function. This module is the single writer; both lanes import it.
 *
 * It lives under foundry-module/ because that folder IS the shipped Foundry
 * module (README §Install: "this repository folder *is* the module"), so it must
 * stay self-contained. The dependency therefore runs app → module, never the
 * reverse: nothing here may import from src/.
 *
 * ORDER IS LOAD-BEARING. Markdown metacharacters are backslash-escaped FIRST,
 * HTML entities are emitted SECOND. Reversed, the markdown pass would re-escape
 * the `#` inside an already-emitted `&#39;` (O'Brien → O&\#39;Brien — a double
 * encode that mangles the stored JSON). Every entity emitted here is produced
 * AFTER the markdown pass, so its own `&`/`#` survive intact.
 *
 * Pure: no globals, no DOM, no Foundry API — node-testable from both lanes.
 */

/** The markdown structural characters a settlement string must never introduce. */
const MARKDOWN_META = /([\\`*_[\]()#+~|])/g;

/**
 * Neutralize HTML and markdown metacharacters so no settlement string can inject
 * markup or markdown structure once Foundry converts the page to HTML. Angle
 * brackets, ampersands and quotes become entities; markdown structural
 * characters are backslash-escaped.
 * @param {unknown} value
 * @returns {string}
 */
export function escapeMarkdown(value) {
  return String(value == null ? '' : value)
    .replace(MARKDOWN_META, '\\$1')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default escapeMarkdown;
