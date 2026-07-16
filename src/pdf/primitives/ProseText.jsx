/**
 * ProseText — the PDF mirror of the web's ProseParagraph. Renders free-form
 * narrative prose that may carry ⟦entity:<id>|<name>⟧ tokens (see
 * src/lib/entityRefTokenizer.js).
 *
 * ENTITY-LINK CONSUMER (master 6d95adc7, wired on this lineage at master-merge
 * W5): a `ref` segment renders through the PDF EntityRef primitive — the
 * react-pdf <Link> resolved against vm.entityIndex, rename-safe, degrading to
 * plain <Text> when the id is gone. Text segments stay <Text>. react-pdf flows
 * inline <Text>/<Link> children inside a parent <Text>, so the component returns
 * inline nodes the caller wraps in its own styled <Text>.
 *
 * BYTE-IDENTITY (this is on the no-golden-shift track): tokens exist only in live
 * AI narratives, never in deterministic sim output — so EVERY same-seed golden
 * fixture is token-free. Token-free prose tokenizes to a single text segment and
 * renders exactly as before (one styled <Text> via proseToPlainText), so wiring
 * it at a golden-covered site (Overview thesis, NotableNPCs) changes zero bytes.
 * Use the plain-string proseToPlainText() helper inside a caller's existing
 * <Text>; use the <ProseText> component when you want inline entity links.
 */
import { Text } from '@react-pdf/renderer';
import { EntityRef } from './EntityRef.jsx';
import { tokenizeProse } from '../../lib/entityRefTokenizer.js';
import { safe } from '../lib/format.js';

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
 * Component form: renders inline entity links for token-bearing prose, plain text
 * otherwise. Token-free prose takes the byte-identical single-<Text> path.
 *
 * @param {object} props
 * @param {string} props.text        The (possibly token-bearing) prose string.
 * @param {object} [props.index]     The dossier entity index (vm.entityIndex).
 * @param {object} [props.style]     Style for the plain-text path / text segments.
 * @param {object} [props.linkStyle] Extra style merged onto each EntityRef.
 */
export function ProseText({ text, index, style, linkStyle }) {
  const segments = tokenizeProse(text);
  // Token-free prose (every same-seed golden, every pre-token narrative) is a
  // single text segment → render exactly as the pre-wiring version did (one
  // styled <Text> via proseToPlainText), so PDF byte-identity holds. Only
  // token-bearing live narratives branch into inline refs.
  if (segments.length <= 1 && (!segments[0] || segments[0].type === 'text')) {
    return <Text style={style}>{safe(proseToPlainText(text))}</Text>;
  }
  return (
    <>
      {segments.map((seg, i) =>
        seg.type === 'ref' ? (
          <EntityRef
            key={i}
            id={seg.id}
            index={index}
            fallback={seg.displayText}
            style={linkStyle}
          />
        ) : (
          <Text key={i} style={style}>{safe(seg.value)}</Text>
        ),
      )}
    </>
  );
}

export default ProseText;
