import { swatch, FS } from '../theme.js';
import { useDossierEntities } from '../dossier/DossierEntityContext.jsx';

/**
 * EntityLink — an inline, in-dossier cross-reference. Renders an entity's
 * CURRENT name (resolved live from the index at render, so a rename shows the
 * new name) as a calm gold-accented link. Clicking it navigates to that
 * entity's tab and opens its card.
 *
 * Navigation is a JS tab switch, not a URL, so this is a <button> styled as an
 * inline link rather than an <a href>. (This is why the primitive lives under
 * primitives/ — the house rule keeps raw <button> elements here.)
 *
 * Rename-safe + broken-link-safe by construction:
 *   - resolves by STABLE id, never by name-matching;
 *   - shows `entry.currentName` (a live getter) when the entity is present;
 *   - renders the `fallback` as PLAIN TEXT (not a dead link) when the id no
 *     longer resolves or the target tab is gated out of this settlement.
 *
 * VERBATIM (pronoun) links: when `verbatim` is set the link shows `fallback`
 * exactly — the wrapped word — instead of the entity's current name. A pronoun
 * token ⟦pronoun:id|he⟧ must render "he" (linked), never "Aldric"; only the
 * TARGET is the entity. The unresolved branch already renders `fallback` as
 * plain text, so a broken pronoun link degrades to the bare word.
 *
 * @param {object} props
 * @param {string} props.id          Stable entity id (e.g. 'faction.iron_guild').
 * @param {string} [props.type]      Advisory entity type ('faction' | 'npc' | …).
 *                                   The index already knows the type; kept for
 *                                   the later generator-emitted {id,type} refs.
 * @param {string} [props.fallback]  Text shown when the id does not resolve, and
 *                                   the verbatim text shown when `verbatim` is set.
 * @param {boolean} [props.verbatim] Render `fallback` verbatim (a pronoun link)
 *                                   rather than the resolved current name.
 * @param {object} [props.style]     Extra inline style merged onto the link.
 */
export default function EntityLink({ id, type, fallback = '', verbatim = false, style }) {
  const { index, navigateToEntity } = useDossierEntities();
  const entry = id ? index?.resolve?.(id) : null;

  // Broken, unresolved, or identity-ambiguous references stay plain text. An
  // imported collision must never turn "first record wins" into navigation.
  if (!entry || entry?.identity?.interactive === false) {
    const text = fallback || '';
    return text ? (
      <span
        data-entity-type={type}
        data-entity-identity={entry?.identity?.state || undefined}
      >
        {text}
      </span>
    ) : null;
  }

  // A pronoun link keeps the wrapped word; a name link resolves the live name.
  const destination = entry.currentName || fallback || entry.label || '';
  const label = verbatim ? fallback : destination;

  const activate = () => navigateToEntity(id);
  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activate();
    }
  };

  return (
    <button
      type="button"
      data-entity-type={entry.type || type}
      aria-label={`Go to ${destination}`}
      onClick={activate}
      onKeyDown={onKeyDown}
      style={{
        display: 'inline',
        padding: 0,
        margin: 0,
        border: 'none',
        background: 'none',
        font: 'inherit',
        fontSize: 'inherit',
        color: swatch['#A0762A'],
        fontWeight: 700,
        textDecoration: 'underline',
        textDecorationColor: `${swatch['#A0762A']}80`,
        textUnderlineOffset: 2,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
    >
      {label}
    </button>
  );
}

// Re-export the constant so callers can keep type-string usage near the link.
export const ENTITY_LINK_TEXT_SIZE = FS.xs;
