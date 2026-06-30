/**
 * EventComposerLinkNeighbourField — the neighbour-link CREATION inputs for the Make
 * Changes dropdown, folded in from the retired standalone "Link a neighbour" card.
 *
 * Link creation is NOT an applyEvent event (unlike SHIFT_TIER): the rich
 * bidirectional cascade (partner row, ISR + NPC contacts + conflicts, realm-graph
 * rebuild) lives in useChangeQueueCascade. So the composer does not build/stage an
 * event for this — it picks a partner + relationship here and, on Apply, delegates
 * to the SAME `onLink` (handleLink) the card used, which already stages the `link`
 * change-queue order for a standalone save and applies the full cascade immediately
 * for a clock-bound member. No reimplementation, no degraded path.
 */

import { RELATIONSHIP_SELECTIONS, relationshipDefinition, directionalRelationshipLabel } from '../../../domain/relationships/canonicalRelationship.js';
import { INK, SECOND, MUTED, sans, FS } from '../../theme.js';
import { Field } from './Field.jsx';
import { selectStyle } from './EventComposerConstants.js';

/**
 * The OTHER saved settlements this one can still link to: every save that is not
 * itself and not already in its neighbour network (mirrors the card's `others`).
 */
export function linkableSiblings(savedSettlements, settlement, activeSaveId) {
  const network = settlement?.neighbourNetwork || [];
  return (Array.isArray(savedSettlements) ? savedSettlements : []).filter(s => {
    if (!s || String(s.id) === String(activeSaveId)) return false;
    if (network.some(n => String(n.id) === String(s.id) || n.name === s.name)) return false;
    return true;
  });
}

export function EventComposerLinkNeighbourField({
  settlement, savedSettlements, activeSaveId, partnerSaveId, setPartnerSaveId, linkRelType, setLinkRelType,
}) {
  const others = linkableSiblings(savedSettlements, settlement, activeSaveId);
  if (others.length === 0) {
    return (
      <Field label="Link a neighbour">
        <div style={{ fontSize: FS.xs, color: MUTED, lineHeight: 1.5, maxWidth: 320, fontFamily: sans, padding: '5px 0' }}>
          A link connects this settlement to another in your library. You have no other saved settlements to link yet.
        </div>
      </Field>
    );
  }

  const selected = others.find(s => String(s.id) === String(partnerSaveId)) || null;
  const def = selected ? relationshipDefinition(linkRelType, activeSaveId || 'home', selected.id) : null;
  const phrase = def ? directionalRelationshipLabel({ localRelationshipRole: def.sourceRole }, selected.name) : null;

  return (
    <>
      <Field label="Neighbour" hint="Connect this settlement to another in your library">
        <select value={partnerSaveId || ''} onChange={e => setPartnerSaveId(e.target.value)} style={selectStyle}>
          <option value="">Pick a settlement…</option>
          {others.map(s => <option key={s.id} value={s.id}>{s.name}{s.tier ? ` (${s.tier})` : ''}</option>)}
        </select>
      </Field>
      <Field
        label="Relationship"
        hint={phrase
          ? `This settlement will be: ${phrase}`
          : 'If both settlements share a campaign, the link surfaces in the realm graph automatically'}
      >
        <select value={linkRelType} onChange={e => setLinkRelType(e.target.value)} style={selectStyle}>
          {RELATIONSHIP_SELECTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </Field>
      {phrase && (
        <span style={{ fontSize: FS.xxs, color: SECOND, alignSelf: 'flex-end', maxWidth: 200, lineHeight: 1.4 }}>
          <span style={{ color: INK, fontWeight: 700 }}>{phrase}</span>
        </span>
      )}
    </>
  );
}
