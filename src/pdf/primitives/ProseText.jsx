/**
 * ProseText — the PDF mirror of the web's ProseParagraph.
 *
 * Renders free-form narrative prose with inline entity cross-references. The
 * narrative server wraps known entity names in ⟦entity:<id>|<name>⟧ tokens
 * (see src/lib/entityRefTokenizer.js). Each token becomes an EntityRef (the
 * react-pdf <Link> primitive, resolved through vm.entityIndex, rename-safe,
 * degrading to plain <Text> when the id is gone); plain stretches stay <Text>.
 *
 * react-pdf flows inline <Text> / <Link> children inside a parent <Text>, so
 * this returns a list of inline nodes the caller wraps in its own styled
 * <Text>. Prose with no tokens tokenizes to a single text segment and renders
 * as ordinary prose — no reader-side branch, full backward compatibility.
 */
import { Text } from '@react-pdf/renderer';
import { EntityRef } from './EntityRef.jsx';
import { tokenizeProse } from '../../lib/entityRefTokenizer.js';
import { safe } from '../lib/format.js';

/**
 * @param {object} props
 * @param {string} props.text        The (possibly token-bearing) prose string.
 * @param {object} [props.index]     The dossier entity index (vm.entityIndex).
 * @param {object} [props.linkStyle] Extra style merged onto each EntityRef.
 */
export function ProseText({ text, index, linkStyle }) {
  const segments = tokenizeProse(text);
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
          <Text key={i}>{safe(seg.value)}</Text>
        ),
      )}
    </>
  );
}

export default ProseText;
