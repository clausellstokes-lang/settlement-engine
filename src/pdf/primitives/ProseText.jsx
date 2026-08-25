/**
 * ProseText — the PDF mirror of the web's ProseParagraph. Renders free-form
 * narrative prose that may carry ⟦entity:<id>|<name>⟧ tokens (see
 * src/lib/entityRefTokenizer.js).
 *
 * Same DIVERGENCE as ProseParagraph (see that file): the PDF EntityRef primitive
 * and the vm.entityIndex it resolves against never landed on this lineage, so a ref
 * degrades to its plain display name rather than a react-pdf <Link>. This still
 * fixes the real bug — the raw ⟦entity:…⟧ tokens leaking as literal text in a
 * narrated PDF export.
 *
 * BYTE-IDENTITY (this is on the no-golden-shift track): proseToPlainText returns
 * the input UNCHANGED for token-free prose — every same-seed golden fixture has no
 * tokens (tokens exist only in live AI narratives, never in deterministic sim
 * output) — so wiring it at a golden-covered site (Overview thesis, NotableNPCs)
 * changes zero bytes. Use the plain-string helper at those sites (drop it inside
 * the caller's existing <Text> — no structural change); the <ProseText> component
 * wrapper is offered for standalone use.
 */
import { Text } from '@react-pdf/renderer';
import { tokenizeProse } from '../../lib/entityRefTokenizer.js';

/**
 * De-tokenize prose to plain text: entity-ref tokens collapse to their display
 * name; text passes through. Returns the input unchanged when it carries no tokens
 * (so golden byte-identity holds) and passes non-strings straight through.
 *
 * @param {unknown} text
 * @returns {unknown}  the de-tokenized string, or the original non-string input.
 */
export function proseToPlainText(text) {
  if (typeof text !== 'string' || text.length === 0) return text;
  return tokenizeProse(text).map(seg => seg.value).join('');
}

/**
 * Standalone component form. Wraps the de-tokenized text in its own <Text>; when a
 * caller already owns a <Text>, prefer proseToPlainText() inline to avoid nesting.
 *
 * @param {object} props
 * @param {string} props.text
 * @param {object} [props.style]
 */
export function ProseText({ text, style }) {
  return <Text style={style}>{proseToPlainText(text)}</Text>;
}

export default ProseText;
