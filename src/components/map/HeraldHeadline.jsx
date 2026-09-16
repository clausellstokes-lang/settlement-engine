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

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { BORDER, BORDER2, CARD, FS, GOLD, INK, MUTED, SECOND, sans, swatch } from '../theme.js';
import { AddressChain, AffectedSettlements } from './AddressChain.jsx';
import RealmEntityLink from '../primitives/RealmEntityLink.jsx';
import Button from '../primitives/Button.jsx';
import { Pill } from './WorldPulsePrimitives.jsx';
import { IconButton } from './IconButton.jsx';
import CauseWalkPanel from './CauseWalkPanel.jsx';
import CausalityPopup from './CausalityPopup.jsx';
import { headlineSlotsOf } from './heraldGrammar.js';
import { severityBand } from './heraldFilter.js';
import { buildCauseWalk } from '../../domain/display/causeWalk.js';
import { heraldCausalVoiceActive, heraldHeadlineRegister, heraldSubheaderRegister } from '../../domain/display/heraldCausalVoice.js';

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
export default function HeraldHeadline({ item, worldState, nameById, nested = false, seesSecrets = true }) {
  const [open, setOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const slots = headlineSlotsOf(item);
  const major = item.major;
  const severityLabel = severityBand(item);
  const canTrace = !!(worldState && item.rootId);
  const nameFor = (id) => nameById?.get(String(id)) || String(id);

  // THE TWO REGISTERS (SP-6, 2026-08-03). Dark ⇒ voiced is null ⇒ this component
  // renders exactly what it rendered before the amendment, byte for byte: the
  // recorded headline, the inline "Trace the causes" toggle, no subheader.
  const voiceLit = heraldCausalVoiceActive(worldState);
  const walk = useMemo(
    () => (voiceLit && canTrace ? buildCauseWalk({ worldState, rootId: item.rootId, seesSecrets }) : null),
    [voiceLit, canTrace, worldState, item.rootId, seesSecrets],
  );
  const voiced = useMemo(
    () => (voiceLit && walk
      ? heraldHeadlineRegister({ worldState, item, walk, seed: String(item.id || item.rootId || ''), seesSecrets })
      : null),
    [voiceLit, walk, worldState, item, seesSecrets],
  );
  const subheader = voiceLit ? heraldSubheaderRegister({ worldState, item }) : null;

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

      {/* ACTION + OBJECT — the recorded headline, byte-verbatim (the truth surface).
          When the causal voice is lit the glance gains AT MOST ONE causal gesture
          and becomes the popup's summoning point; the recorded headline is still
          the whole of the first clause, never rewritten. */}
      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
        {voiced ? (
          <Button
            variant="ghost"
            size="sm"
            data-testid="herald-headline-gesture"
            onClick={() => setPopupOpen(true)}
            title="Why this happened"
            style={{
              padding: 0, minHeight: 0, textAlign: 'left', justifyContent: 'flex-start',
              color: INK, fontSize: FS.xs, fontWeight: 900, lineHeight: 1.3, overflowWrap: 'anywhere', whiteSpace: 'normal',
            }}
          >
            {voiced.text}
          </Button>
        ) : (
          <span style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900, lineHeight: 1.3, overflowWrap: 'anywhere' }}>
            {slots.glance}
          </span>
        )}
        <ProvenanceChip provenance={slots.provenance} />
        <Pill tone={severityLabel === 'critical' ? 'major' : 'neutral'}>
          {severityLabel}
        </Pill>
      </div>

      {/* THE SUBHEADER — one plain, unembellished sentence of what happened. The
          visible honesty anchor: the headline may sing because the subheader
          states. Absent when the record holds no summary; never authored. */}
      {subheader?.text && (
        <div data-testid="herald-subheader" style={{ color: SECOND, fontFamily: sans, fontSize: FS.xxs, fontWeight: 650, lineHeight: 1.5, overflowWrap: 'anywhere' }}>
          {subheader.text}
        </div>
      )}

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

      {/* THE ARTICLE — click to trace the recorded cause chain off this item's
          rootId. When the causal voice is lit the POPUP carries the chain (and
          the table within it), so the inline toggle stands down rather than
          offering the DM the same walk twice. */}
      {canTrace && !voiced && (
        <div>
          <IconButton onClick={() => setOpen(o => !o)} aria-expanded={open} size="sm">
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

      {/* TIER 3 — THE CAUSALITY POPUP. Zero navigation: the Herald stays beneath. */}
      {voiced && (
        <CausalityPopup
          open={popupOpen}
          onClose={() => setPopupOpen(false)}
          item={item}
          worldState={worldState}
          nameById={nameById}
          seesSecrets={seesSecrets}
        />
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
