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
import { useDossierEntities } from './dossier/DossierEntityContext.jsx';
import { linkMentions } from '../domain/dossier/linkMentions.js';

/**
 * MentionText — EVERY MENTION IS A DOOR (RULINGS-CROSS X-20). Renders one string with each
 * exact whole-word mention of a canonical entity name as an EntityLink (only the name is the
 * link), through the one linker (domain/dossier/linkMentions.js) and the viewer's scope from
 * the dossier context. With no dossier above it (an isolated test, the PDF's own primitives,
 * a surface outside a dossier) or no mention in the string, it renders the string itself:
 * the markup is byte-identical to the bare `{text}` it replaces.
 *
 * @param {object} props
 * @param {unknown} props.text            the string the site renders
 * @param {string|null} [props.selfId]    the card's own entity id: its own name stays text
 * @param {boolean} [props.structural]    a structured name (a chip, a row): common-word
 *                                        families (resources, services) may link too
 */
export function MentionText({ text, selfId = null, structural = false }) {
  const { index, scope } = useDossierEntities();
  if (typeof text !== 'string' || !text) return text ?? null;
  const segments = linkMentions(text, index, scope, { selfId, structural });
  if (segments.length === 1 && segments[0].type === 'text') return text;
  return (
    <>
      {segments.map((seg, i) => (seg.type === 'link'
        ? <EntityLink key={i} id={seg.id} type={seg.entityType} fallback={seg.value} verbatim />
        : seg.value))}
    </>
  );
}

/**
 * @param {object} props
 * @param {string} props.text  The (possibly token-bearing) prose string.
 * @param {string|null} [props.selfId]  The card's own entity id (never linked to itself).
 */
export default function ProseParagraph({ text, selfId = null }) {
  const segments = tokenizeProse(text);
  // A narrative token is consumed first and keeps its own path; only the plain text between
  // tokens goes through the mention linker, so a name is never linked twice.
  return (
    <>
      {segments.map((seg, i) =>
        seg.type === 'ref'
          ? <EntityLink key={i} id={seg.id} fallback={seg.value} verbatim={seg.verbatim} />
          : <span key={i}><MentionText text={seg.value} selfId={selfId} /></span>,
      )}
    </>
  );
}
