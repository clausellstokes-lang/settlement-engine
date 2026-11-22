/**
 * CurateMode.jsx — "Curate for visitors" (RULINGS-CROSS X-21 (e), X-21b, X-21e; W2-VEIL-B).
 *
 * The dossier redrawn as a visitor sees it, section by section in the dossier's tab order:
 * each section's groupings, its field-class master switches ("Secrets: hidden for
 * everyone"), and its boxes with an eye on every depth field the visitor's copy carries.
 * Identity fields carry no eye (existence is public); a criminal or clandestine house
 * carries a card eye (X-21e). A click veils in place: the row dims and says "Hidden from
 * visitors", marked "by default" apart from "by you". "Preview as visitor" drops every
 * hidden row. Done hands the delta list back to the share dialog, which saves it.
 *
 * Pure display over galleryVeil.js :: curateModelFor; this component owns only the draft.
 *
 * THE AFFORDANCE SLOT (X-23): wave three's shared slot primitive has not landed. The eye is
 * rendered by `CurateEye` at the slot's position, the trailing end of a card header or a
 * fact row, and carries `data-affordance-slot="eye"` so the slot primitive can absorb it
 * (curate mode: the eye; edit mode: the pencil; reading mode: empty).
 */

import { useMemo, useState } from 'react';
import Button from '../primitives/Button.jsx';
import { curateModelFor, toggleVeilDelta } from '../../domain/display/galleryVeil.js';
import { BORDER2, CARD, CARD_ALT, INK, BODY, MUTED, RED, sans, SP, FS } from '../theme.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../design/proseScale.js';

/** The words an eye's state reads as. */
function stateWords(hidden, defaultHidden) {
  if (hidden) return defaultHidden ? 'Hidden from visitors, by default' : 'Hidden from visitors, by you';
  return defaultHidden ? 'Shown, by you' : '';
}

/**
 * The eye, in the affordance slot. A text toggle (icons are off estate-wide): "Shown" or
 * "Hidden", pressed when hidden.
 * @param {{ hidden: boolean, label: string, onToggle: () => void }} props
 */
export function CurateEye({ hidden, label, onToggle }) {
  return (
    <Button
      variant={hidden ? 'secondary' : 'ghost'}
      size="sm"
      aria-pressed={hidden}
      aria-label={`${hidden ? 'Show' : 'Hide'} ${label}`}
      data-affordance-slot="eye"
      onClick={onToggle}
      style={{ marginLeft: 'auto', flexShrink: 0 }}
    >
      {hidden ? 'Hidden' : 'Shown'}
    </Button>
  );
}

/** One fact row: words on the left, the eye in the slot on the right. */
function Row({ eye, title, text, preview, onToggle, mobile }) {
  if (preview && eye.hidden) return null;
  const note = stateWords(eye.hidden, eye.defaultHidden);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.sm, padding: '4px 0',
      opacity: eye.hidden ? 0.55 : 1, minWidth: 0,
    }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ color: INK, fontFamily: sans, fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 700 }}>{title}</div>
        {text && <div style={{ color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xxs, mobile), lineHeight: 1.4, overflowWrap: 'anywhere' }}>{text}</div>}
        {note && !preview && <div style={{ color: eye.hidden ? RED : MUTED, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile) }}>{note}</div>}
      </div>
      {!preview && <CurateEye hidden={eye.hidden} label={title} onToggle={() => onToggle(eye.address)} />}
    </div>
  );
}

/** A box: its name (identity, no eye unless the house may hide whole) and its depth rows. */
function Box({ card, preview, onToggle, mobile }) {
  if (preview && card.whole?.hidden) return null;
  const head = card.whole || { address: '', hidden: false, defaultHidden: false };
  const note = card.whole ? stateWords(head.hidden, head.defaultHidden) : '';
  return (
    <div style={{ border: `1px solid ${BORDER2}`, background: CARD, padding: SP.sm, opacity: head.hidden ? 0.55 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ color: INK, fontFamily: sans, fontSize: chromeFontSize(FS.sm, mobile), fontWeight: 800, overflowWrap: 'anywhere' }}>{card.name}</div>
          {note && !preview && <div style={{ color: head.hidden ? RED : MUTED, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile) }}>{note}</div>}
        </div>
        {card.whole && !preview && <CurateEye hidden={head.hidden} label={card.name} onToggle={() => onToggle(head.address)} />}
      </div>
      {!head.hidden && card.eyes.map(e => (
        <Row key={e.address} eye={e} title={e.label} text={e.text} preview={preview} onToggle={onToggle} mobile={mobile} />
      ))}
    </div>
  );
}

/** A section: its heading, groupings and switches as rows, its boxes behind one toggle. */
function SectionBlock({ section, preview, onToggle, mobile }) {
  const [open, setOpen] = useState(false);
  if (!section.groupings.length && !section.switches.length && !section.cards.length) return null;
  return (
    <section aria-label={section.label} style={{ display: 'grid', gap: SP.xs, paddingTop: SP.sm, borderTop: `1px solid ${BORDER2}` }}>
      <h4 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: chromeFontSize(FS.sm, mobile), fontWeight: 900 }}>{section.label}</h4>
      {section.groupings.map(g => (
        <Row key={g.address} eye={g} title={g.label} text="" preview={preview} onToggle={onToggle} mobile={mobile} />
      ))}
      {section.switches.map(sw => (
        <Row key={sw.address} eye={sw} title={`${sw.label}, for everyone`} text="" preview={preview} onToggle={onToggle} mobile={mobile} />
      ))}
      {section.cards.length > 0 && (
        <Button variant="ghost" size="sm" aria-expanded={open} onClick={() => setOpen(v => !v)} style={{ justifySelf: 'start' }}>
          {open ? `Fold the ${section.cards.length} boxes` : `Open the ${section.cards.length} boxes`}
        </Button>
      )}
      {open && section.cards.map(c => (
        <Box key={`${c.kind}:${c.id}`} card={c} preview={preview} onToggle={onToggle} mobile={mobile} />
      ))}
    </section>
  );
}

/**
 * @param {{
 *   payload: Record<string, unknown>,
 *   deltas: ReadonlyArray<{ address: string, hidden: boolean }>,
 *   onDone: (deltas: Array<{ address: string, hidden: boolean }>) => void,
 *   onCancel: () => void,
 * }} props
 */
export default function CurateMode({ payload, deltas, onDone, onCancel }) {
  const mobile = useIsMobile();
  const [draft, setDraft] = useState(() => [...(deltas || [])]);
  const [preview, setPreview] = useState(false);
  const model = useMemo(() => curateModelFor(payload, draft), [payload, draft]);
  const toggle = (address) => setDraft(d => toggleVeilDelta(d, address, model.defaults));

  return (
    <div role="region" aria-label="Curate for visitors" style={{
      width: '100%', display: 'grid', gap: SP.sm, padding: SP.sm,
      border: `1px solid ${BORDER2}`, background: CARD_ALT, marginTop: SP.xs,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
        <strong style={{ color: INK, fontFamily: sans, fontSize: chromeFontSize(FS.sm, mobile) }}>Curate for visitors</strong>
        <span aria-live="polite" style={{ color: BODY, fontFamily: sans, fontSize: chromeFontSize(FS.xs, mobile) }}>
          {model.count === 1 ? '1 item hidden' : `${model.count} items hidden`}
        </span>
        <Button variant="ghost" size="sm" aria-pressed={preview} onClick={() => setPreview(v => !v)} style={{ marginLeft: 'auto' }}>
          Preview as visitor
        </Button>
        <Button variant="gold" size="sm" onClick={() => onDone(draft)}>Done</Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
      <p style={{ margin: 0, color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xxs, mobile), lineHeight: 1.45 }}>
        Names, roles and categories always show. A criminal or clandestine house is the exception: it can be hidden whole.
      </p>
      {model.sections.map(sec => (
        <SectionBlock key={sec.id} section={sec} preview={preview} onToggle={toggle} mobile={mobile} />
      ))}
    </div>
  );
}
