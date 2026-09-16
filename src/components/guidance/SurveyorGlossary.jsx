/**
 * components/guidance/SurveyorGlossary — THE "WHAT AM I READING?" AFFORDANCE (W-GUIDE-2 §6).
 *
 * A uniform, in-place glossary touch target for instrument displays: a term is
 * wrapped as an accessible trigger (built on the Button primitive — native
 * button semantics, focus ring, and zero raw-button budget), and clicking opens
 * a small card that names the term, gives its code-truthful definition, and
 * deep-links into the Compendium (?tab= + #anchor). It mirrors the InstitutionCard
 * popover a11y grammar (role="dialog", aria-modal, focus trap, Escape +
 * click-outside, focus restore).
 *
 * HONESTY GATE (§9): the term becomes interactive ONLY when it resolves to a real
 * glossary entry (glossary.js, derived from code). Otherwise it renders as plain
 * text — a word with no backing definition is never dressed up as clickable, and
 * the card never invents a fact.
 *
 * FIRST-PAINT: this imports the glossary derivation (glossary.js), so it must be
 * mounted ONLY on lazy instrument surfaces (settlement cards, dossier panels,
 * the realm inspector — all lazy). The glossary lazy-leaf guard in vendorPdfLazy
 * fails if it ever reaches the entry closure.
 */

import { useState } from 'react';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import { useDialogFocusTrap } from '../primitives/useDialogFocusTrap.js';
import { BODY, BORDER, CARD, CARD_ALT, ELEV, FS, GOLD, INK, SP, sans, swatch } from '../theme.js';
import { glossaryEntryFor } from '../../domain/display/glossary.js';

/** The in-place glossary card (InstitutionCard grammar; neutral ✦ glyph header). */
function GlossaryCard({ open, entry, onClose }) {
  // Shared focus trap keyed on `open` ALONE (onClose read through a ref inside
  // the hook). SurveyorGlossary passes a fresh `() => setOpen(false)` on every
  // render; keying on that identity — as the old hand-rolled effect did — made a
  // background re-render re-run the trap and yank focus back to the first
  // control mid-read. Routing through the primitive retires that bug class.
  const cardRef = useDialogFocusTrap(open, onClose);

  if (!open || !entry) return null;
  const href = `/compendium?tab=${encodeURIComponent(entry.tab)}#${encodeURIComponent(entry.anchor)}`;

  return (
    <div
      role="presentation"
      style={{
        position: 'fixed', inset: 0, zIndex: 300, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: SP.lg,
        background: 'rgba(27,20,8,0.46)',
      }}
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose?.(); }}
    >
      <section
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${entry.term} (glossary)`}
        tabIndex={-1}
        style={{
          width: 'min(100%, 380px)', maxHeight: 'min(90vh, 520px)', overflow: 'auto',
          border: `1px solid ${BORDER}`, background: CARD, boxShadow: ELEV[3],
        }}
      >
        <header style={{
          display: 'flex', alignItems: 'flex-start', gap: SP.md,
          padding: `${SP.lg}px ${SP.lg}px ${SP.md}px`,
          borderBottom: `1px solid ${BORDER}`, background: CARD_ALT,
        }}>
          <span aria-hidden="true" style={{ fontSize: FS.lg, color: swatch['#7A4F0F'], flexShrink: 0, marginTop: 2 }}>{'✦'}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: FS.micro, fontWeight: 800, color: swatch['#7A4F0F'], textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              What am I reading?
            </div>
            <h2 style={{ margin: `${SP.xs}px 0 0`, color: INK, fontFamily: sans, fontSize: FS.lg, lineHeight: 1.25, fontWeight: 900 }}>
              {entry.term}
            </h2>
          </div>
          <IconButton glyph="×" label="Close" tone="ghost" size="sm" onClick={onClose} />
        </header>
        <div style={{ padding: SP.lg, display: 'grid', gap: SP.md }}>
          <p style={{ margin: 0, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.5 }}>
            {entry.definition}
          </p>
          <a href={href} style={{ fontSize: FS.sm, color: GOLD, fontFamily: sans, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Read more in the Compendium
          </a>
        </div>
      </section>
    </div>
  );
}

/**
 * @param {Object} props
 * @param {string} props.id            The glossary entry id (glossary.js).
 * @param {import('react').ReactNode} [props.children]  Visible label (defaults to the term).
 * @param {import('react').CSSProperties} [props.style]
 */
export default function SurveyorGlossary({ id, children, style }) {
  const [open, setOpen] = useState(false);
  const entry = glossaryEntryFor(id);

  // Honesty gate: no backing entry ⇒ plain text (or nothing).
  if (!entry) return children != null ? <span style={style}>{children}</span> : null;
  const label = children ?? entry.term;

  const openCard = (event) => { event?.stopPropagation?.(); setOpen(true); };
  const onKeyDown = (event) => { if (event.key === 'Enter' || event.key === ' ') event.stopPropagation(); };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={openCard}
        onKeyDown={onKeyDown}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`What is “${entry.term}”?`}
        style={{
          display: 'inline', minHeight: 0, padding: 0, border: 'none', background: 'transparent',
          color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit',
          lineHeight: 'inherit', textDecoration: 'underline', textDecorationStyle: 'dotted',
          textDecorationColor: `${GOLD}99`, textUnderlineOffset: 3, cursor: 'help', whiteSpace: 'normal',
          ...style,
        }}
      >
        {label}
        <span aria-hidden="true" style={{ fontSize: '0.72em', color: GOLD, verticalAlign: 'super', marginLeft: 2, fontWeight: 800 }}>?</span>
      </Button>
      <GlossaryCard open={open} entry={entry} onClose={() => setOpen(false)} />
    </>
  );
}
