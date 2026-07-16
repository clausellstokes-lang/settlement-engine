/**
 * ProseParagraph — render free-form narrative prose that may carry the
 * ⟦entity:<id>|<name>⟧ tokens the narrative server injects (see
 * src/lib/entityRefTokenizer.js). It tokenizes the prose once and renders each
 * segment inline; the caller owns the block element (a <p>) and its styling, so
 * it drops into existing prose slots without changing layout.
 *
 * ENTITY-LINK CONSUMER (master 6d95adc7, wired on this lineage at master-merge
 * W5): a `ref` segment renders through the <EntityLink> primitive, which resolves
 * the stable id against the DossierEntityContext index and renders a clickable
 * in-dossier link — or degrades to the plain display name when no provider is
 * mounted above it (Storybook, isolated tests) or the id does not resolve. A
 * `text` segment renders as a plain <span>. Token-free prose (every narrative
 * authored before this layer) tokenizes to a single text segment, so there is no
 * reader-side change for old dossiers. The provider is hoisted once in
 * OutputContainer; without it, this still resolves the literal-token leak via the
 * tokenizer's degrade path exactly as before.
 */
import { tokenizeProse } from '../lib/entityRefTokenizer.js';
import EntityLink from './primitives/EntityLink.jsx';

/**
 * @param {object} props
 * @param {string} props.text  The (possibly token-bearing) prose string.
 */
export default function ProseParagraph({ text }) {
  const segments = tokenizeProse(text);
  return (
    <>
      {segments.map((seg, i) =>
        seg.type === 'ref'
          ? <EntityLink key={i} id={seg.id} fallback={seg.value} />
          : <span key={i}>{seg.value}</span>,
      )}
    </>
  );
}
