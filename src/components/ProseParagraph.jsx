/**
 * ProseParagraph — render free-form narrative prose that may carry the
 * ⟦entity:<id>|<name>⟧ tokens the narrative server injects (see
 * src/lib/entityRefTokenizer.js). It tokenizes the prose once and renders each
 * segment as inline text; the caller owns the block element (a <p>) and its
 * styling, so it drops into existing prose slots without changing layout.
 *
 * DIVERGENCE FROM master commit 6d95adc7 (recorded for the successor).
 * That commit rendered ref segments through an <EntityLink> primitive backed by a
 * DossierEntityContext provider. On THIS lineage the entire entity-link CONSUMER
 * architecture — EntityLink, the PDF EntityRef, DossierEntityContext, the provider
 * hoist, useDossierEntities, navigateToEntity — never landed; only the server
 * PRODUCER (generate-narrative + entityRefWrapper) and the tokenizer did. That is
 * the "half-merge" finding code-quality-1 describes: the tree ships a producer with
 * no consumer, so the raw ⟦entity:…⟧ tokens leak as literal text in narrated
 * dossiers. Porting the whole link layer (provider + hook + per-card anchors +
 * every PDF section) is a large cross-cutting change beyond this wave's scope and
 * fence.
 *
 * So this resolves the ACTUAL bug — the literal-token leak — via the tokenizer's
 * own documented degrade path: a ref renders as its plain display name (the same
 * text a real EntityLink would show, minus the link). Token-free prose (every
 * narrative authored before this layer) tokenizes to a single text segment and
 * renders as ordinary prose, so there is no reader-side branch. When the
 * link-consumer layer is later ported, ref segments upgrade to <EntityLink> here
 * with no caller change.
 */
import { tokenizeProse } from '../lib/entityRefTokenizer.js';

/**
 * @param {object} props
 * @param {string} props.text  The (possibly token-bearing) prose string.
 */
export default function ProseParagraph({ text }) {
  const segments = tokenizeProse(text);
  // Both 'text' and 'ref' segments carry the visible string in `value` (the
  // tokenizer sets a ref's value to its display name), so a plain <span> renders
  // both cleanly today; refs become <EntityLink> when the consumer layer lands.
  return (
    <>
      {segments.map((seg, i) => <span key={i}>{seg.value}</span>)}
    </>
  );
}
