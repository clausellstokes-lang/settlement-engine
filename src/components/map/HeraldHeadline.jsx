// HeraldHeadline.jsx — one item's HEADLINE (the glance) + its ARTICLE (the click-
// through cause chain). Renders the shared grammar line from typed slots
// (heraldGrammar.headlineSlotsOf); reuses AddressChain / AffectedSettlements /
// RealmEntityLink — no re-derivation, ids only.
//
// THE HEADLINE IS A GLANCE: a DM forms a take from it alone. Click "Trace the
// causes" and THE ARTICLE expands — the recorded cause DAG for this item's rootId,
// via CauseWalkPanel (the engine's own memory; nothing invented, absent when
// unrecorded). CauseWalkPanel is already static in this lazy chunk (AdvanceReport),
// so no first-paint cost.
//
// The "—" reason separator in the spec's line is a STYLED layout element here (a
// gold vertical rule), never a literal em-dash character in a copy string — so the
// voice-family scans stay green.

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { BORDER, BORDER2, CARD, FS, GOLD, INK, MUTED, SECOND, sans, swatch } from '../theme.js';
import { AddressChain, AffectedSettlements } from './AddressChain.jsx';
import RealmEntityLink from '../primitives/RealmEntityLink.jsx';
import { Pill } from './WorldPulsePrimitives.jsx';
import { IconButton } from './IconButton.jsx';
import CauseWalkPanel from './CauseWalkPanel.jsx';
import { headlineSlotsOf } from './heraldGrammar.js';

/** The non-canonical provenance chip; canon/derived stay silent (the spec's rule). */
function ProvenanceChip({ provenance }) {
  if (!provenance || provenance === 'canon') return null;
  return <Pill tone={provenance === 'covert' ? 'major' : 'neutral'}>{provenance}</Pill>;
}

/**
 * @param {object} props
 * @param {import('./heraldFeed.js').HeraldItem} props.item
 * @param {any} [props.worldState]   for the article (cause walk); absent ⇒ no article toggle
 * @param {Map<string,string>} [props.nameById]
 * @param {boolean} [props.nested]   omit the settlement level (a group header hoists it)
 */
export default function HeraldHeadline({ item, worldState, nameById, nested = false }) {
  const [open, setOpen] = useState(false);
  const slots = headlineSlotsOf(item);
  const major = item.major;
  const canTrace = !!(worldState && item.rootId);
  const nameFor = (id) => nameById?.get(String(id)) || String(id);

  return (
    <article
      data-testid="herald-headline"
      data-section={item.section}
      style={{
        borderLeft: `2px solid ${major ? GOLD : BORDER2}`,
        paddingLeft: 9,
        display: 'grid',
        gap: 4,
      }}
    >
      {/* SUBJECT-ADDRESS — the linked containment chain (settlement › power › faction
          › npc), as deep as the record identifies; nothing when subjectless. In the
          nested form the settlement level is hoisted to the group header. */}
      <AddressChain descriptor={slots.subject} omitSettlement={nested} />

      {/* ACTION + OBJECT — the recorded headline, byte-verbatim (the truth surface). */}
      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
        <span style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900, lineHeight: 1.3, overflowWrap: 'anywhere' }}>
          {slots.glance}
        </span>
        <ProvenanceChip provenance={slots.provenance} />
      </div>

      {/* AFFECTED · REASON — the settlements touched, then the recorded reason behind
          a styled gold rule (the spec's "—" separator, as a layout element). */}
      {(slots.affectedIds.length > 0 || slots.reason) && (
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          {slots.affectedIds.length > 0 && <AffectedSettlements ids={slots.affectedIds} />}
          {slots.reason && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span aria-hidden="true" style={{ width: 1, alignSelf: 'stretch', minHeight: 12, background: swatch['#A0762A'] }} />
              <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{slots.reasonLabel}</span>
              <span style={{ color: SECOND, fontFamily: sans, fontSize: FS.xxs, fontWeight: 700, overflowWrap: 'anywhere' }}>{slots.reason}</span>
            </span>
          )}
        </div>
      )}

      {/* THE ARTICLE — click to trace the recorded cause chain off this item's rootId. */}
      {canTrace && (
        <div>
          <IconButton onClick={() => setOpen(o => !o)} aria-expanded={open} size="sm" title="Trace the recorded causes">
            {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            {open ? 'Hide the causes' : 'Trace the causes'}
          </IconButton>
          {open && (
            <div style={{ marginTop: 4 }}>
              <CauseWalkPanel worldState={worldState} rootId={item.rootId} resolveName={nameFor} seesSecrets />
            </div>
          )}
        </div>
      )}
    </article>
  );
}

/** A settlement group header for the nested form: the hoisted settlement name, linked,
 *  with the group's item count. Renders the realm-wide group as a plain heading. */
export function HeraldGroupHeader({ group }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, borderBottom: `1px solid ${BORDER}`, paddingBottom: 3 }}>
      <span style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>
        {group.settlementId != null
          ? <RealmEntityLink settlementSaveId={group.settlementId} label={group.name} />
          : group.name}
      </span>
      <span style={{ marginLeft: 'auto', color: MUTED, fontFamily: sans, fontSize: FS.micro, fontWeight: 800, background: CARD, padding: '1px 5px', border: `1px solid ${BORDER2}` }}>
        {group.items.length}
      </span>
    </div>
  );
}

export { ProvenanceChip };
