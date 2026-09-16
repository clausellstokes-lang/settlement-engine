/**
 * EntityRef — the PDF mirror of the web's EntityLink primitive.
 *
 * Renders an in-dossier cross-reference as a react-pdf <Link> that jumps to the
 * target entity's card/section (an element carrying the matching `id` anchor).
 * Same contract as EntityLink, two surfaces, one id mechanism:
 *
 *   - STRUCTURED-ONLY — the link is driven by a stable id resolved through the
 *     dossier entity index (vm.entityIndex), never by scanning prose.
 *   - RENAME-SAFE — the displayed text is the entry's LIVE `currentName` (a
 *     getter that re-reads the raw entity at access time), so a renamed entity
 *     shows its current name and still resolves by id.
 *   - BROKEN-LINK-SAFE — an id that does not resolve in THIS document's entity
 *     set renders as plain <Text> (the fallback), never a dead anchor.
 *   - VERBATIM (pronoun) — when `verbatim` is set the link shows `fallback`
 *     exactly (the wrapped word) instead of the resolved current name, so a
 *     ⟦pronoun:id|he⟧ token prints "he" as a link, never the entity's name. The
 *     unresolved branch already renders `fallback`, so a broken pronoun link
 *     degrades to the bare word.
 *
 * The web primitive reads its index from React context; the PDF sections are
 * plain hook-free functions (smoke-tested by direct call), so this primitive
 * takes the index explicitly via props instead — no context, no hooks.
 *
 * @param {object} props
 * @param {string} props.id          Stable entity id (e.g. 'faction.iron_guild').
 * @param {object} [props.index]     The dossier entity index (vm.entityIndex);
 *                                    must expose `resolve(id) -> entry|null`.
 * @param {string} [props.type]      Advisory entity type ('faction' | 'npc' | …),
 *                                   kept for API parity with the web EntityLink;
 *                                   the index already knows the resolved type.
 * @param {string} [props.fallback]  Text shown when the id does not resolve, and
 *                                   the verbatim text shown when `verbatim` is set.
 * @param {boolean} [props.verbatim] Render `fallback` verbatim (a pronoun link)
 *                                   rather than the resolved current name.
 * @param {object} [props.style]     Extra style merged onto the rendered node.
 * @returns {object|null}
 */
import { Link, Text } from '@react-pdf/renderer';
import { palette } from '../theme.js';
import { safe } from '../lib/format.js';

// Gold-accent link styling — mirrors EntityLink's on-screen treatment (the
// `palette.gold` accent, bold weight) so a printed cross-reference reads as the
// same affordance the screen uses.
const LINK_STYLE = {
  color: palette.gold,
  fontWeight: 700,
  textDecoration: 'none',
};

/**
 * The anchor string a target element should carry as its `id` so an
 * <EntityRef> pointing at the same entity lands on it. Resolves the id through
 * the index (single source of truth for anchor strings); returns undefined when
 * the id does not resolve, so an unresolved card simply carries no anchor (and
 * any inbound EntityRef degrades to plain text — both ends fail safe together).
 *
 * @param {object} [index]  The dossier entity index (vm.entityIndex).
 * @param {string} [id]     Stable entity id.
 * @returns {string|undefined}
 */
export function anchorTarget(index, id) {
  if (!id || !index?.resolve) return undefined;
  const entry = index.resolve(id);
  return entry?.anchor || undefined;
}

export function EntityRef({ id, index, type: _type, fallback = '', verbatim = false, style }) {
  const entry = id && index?.resolve ? index.resolve(id) : null;

  // Broken / unresolved id -> plain text, never a dead anchor.
  if (!entry) {
    const text = safe(fallback);
    return text ? <Text style={style}>{text}</Text> : null;
  }

  // A pronoun link keeps the wrapped word; a name link resolves the live name.
  const label = safe(verbatim ? fallback : (entry.currentName || fallback || entry.label || ''));
  return (
    <Link src={`#${entry.anchor}`} style={{ ...LINK_STYLE, ...style }}>
      {label}
    </Link>
  );
}

export default EntityRef;
