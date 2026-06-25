/**
 * ProseParagraph — render free-form narrative prose with inline entity links.
 *
 * The narrative server wraps known entity names in ⟦entity:<id>|<name>⟧ tokens
 * (see src/lib/entityRefTokenizer.js). This component tokenizes the prose once
 * and renders each segment: plain text as a <span>, a ref as the existing
 * EntityLink primitive (which resolves the id live, stays rename-safe, and
 * degrades to plain text when the id is gone). Prose with no tokens — every
 * narrative authored before this layer — tokenizes to a single text segment and
 * renders as ordinary prose, so there is no reader-side branch.
 *
 * It renders inline content only (spans + EntityLink buttons); the caller owns
 * the block element (a <p>) and its styling, so this drops into existing prose
 * slots without changing their layout.
 */
import EntityLink from './primitives/EntityLink.jsx';
import { tokenizeProse } from '../lib/entityRefTokenizer.js';

/**
 * @param {object} props
 * @param {string} props.text         The (possibly token-bearing) prose string.
 * @param {object} [props.linkStyle]  Extra inline style merged onto each EntityLink.
 */
export default function ProseParagraph({ text, linkStyle }) {
  const segments = tokenizeProse(text);
  return (
    <>
      {segments.map((seg, i) =>
        seg.type === 'ref' ? (
          <EntityLink
            key={i}
            id={seg.id}
            fallback={seg.displayText}
            style={linkStyle}
          />
        ) : (
          <span key={i}>{seg.value}</span>
        ),
      )}
    </>
  );
}
