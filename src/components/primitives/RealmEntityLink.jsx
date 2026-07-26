import { swatch } from '../theme.js';
import { useRealmEntities } from '../map/RealmEntityContext.jsx';

/**
 * RealmEntityLink — an inline CROSS-SETTLEMENT reference in the Realm Inspector.
 * Renders one address-chain level (a settlement / power / faction / npc) as a
 * calm gold-accented link; clicking it opens that entity's card in ITS
 * settlement's dossier (see useRealmEntityNav.navigateToRealmEntity).
 *
 * The realm analogue of the dossier's EntityLink. Same discipline:
 *   - navigation is a JS route + focus, not an href, so it is a <button> styled
 *     as an inline link (keyboard-native: a real button fires on Enter/Space);
 *   - a level with `linked: false`, or one rendered with no realm web/navigator
 *     in context, degrades to PLAIN TEXT — never a dead link.
 *
 * @param {object} props
 * @param {string|number} [props.settlementSaveId]  The dossier to open.
 * @param {string|null} [props.entityId]            The dossier-index id to focus (null = open the dossier only).
 * @param {string} props.label                      The display text.
 * @param {boolean} [props.linked]                  Whether this level resolves to a navigable card.
 * @param {object} [props.style]                    Extra inline style merged onto the link.
 */
export default function RealmEntityLink({ settlementSaveId, entityId = null, label, linked = true, style }) {
  const { navigateToRealmEntity } = useRealmEntities();
  const text = label == null ? '' : String(label);
  if (!text) return null;

  // Not navigable (record-gap level, or no navigator) -> calm plain text.
  if (!linked || settlementSaveId == null || typeof navigateToRealmEntity !== 'function') {
    return <span>{text}</span>;
  }

  const activate = () => navigateToRealmEntity({ settlementSaveId, entityId });
  // Presentation-only return address. RealmInspector records this key immediately
  // before routing and matches it after browser-back; it is never used as entity
  // identity or writer authority.
  const returnKey = [settlementSaveId, entityId || '']
    .map(value => encodeURIComponent(String(value)))
    .join(':');

  return (
    <button
      type="button"
      aria-label={`Go to ${text}`}
      data-realm-entity-key={returnKey}
      onClick={activate}
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
      {text}
    </button>
  );
}
