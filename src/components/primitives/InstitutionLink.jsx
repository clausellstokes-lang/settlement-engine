/**
 * primitives/InstitutionLink — an institution name as an accessible trigger.
 *
 * Renders an institution's name as an inline, text-styled control (built on the
 * Button primitive, so it keeps native <button> semantics, keyboard focus, and
 * the global focus ring — and adds nothing to the raw-<button> budget). Clicking
 * opens the InstitutionCard popover with the institution's derived profile.
 *
 * HONESTY GATE: the name becomes an interactive link ONLY when it resolves to a
 * real institution in the settlement that yields at least one derived
 * contribution. Otherwise it renders as plain text — a faction or service label
 * with no backing institution is never dressed up as clickable.
 *
 * Accepts either an `institution` object directly, or a `name` string that is
 * resolved against `settlement.institutions` (tolerating count-suffix / casing
 * drift, e.g. a "Merchant Guilds" faction → "Merchant guilds (15-40)").
 *
 * ⛔ THE TRIGGER IS INLINE; THIS COMPONENT IS NOT. It returns a FRAGMENT — the
 * trigger, and BESIDE IT the `InstitutionCard` dialog, rendered in place rather
 * than portalled. The card is a `position: fixed` overlay holding a `<section
 * role="dialog">`, a `<header>`, an `<h2>`, its own `<p>`s and a `<ul>`, so a
 * CALLER THAT WRAPS THIS IN A `<p>` NESTS BLOCK CONTENT INSIDE A PARAGRAPH the
 * moment a reader opens the card. That shipped on the Services tab's institution
 * attribution line (serviceComponents.jsx) and printed a React DOM-nesting error
 * per block element; `</p>` is implied by any block start tag in the HTML parser,
 * so the markup is not the tree React thinks it built. Give it a block container
 * — a `<div>` styled the way the line already was.
 *
 * ⚠ THE STRUCTURAL CURE WOULD BE TO PORTAL THE CARD to document.body, which would
 * make every caller safe by construction rather than by convention. It is
 * DELIBERATELY DEFERRED here, documented rather than forgotten: the card owns a
 * focus trap and focus restoration, and three suites query it inside their render
 * container, so moving its mount point is its own car with its own proof. Until
 * then this docblock and the nesting pin are what keep the class closed.
 * @enforced-by tests/components/servicesInstitutionCardNesting.test.jsx
 */

import { useMemo, useState } from 'react';
import Button from './Button.jsx';
import InstitutionCard from './InstitutionCard.jsx';
import { GOLD } from '../theme.js';
import {
  deriveInstitutionProfile, resolveInstitutionByName,
} from '../../domain/display/institutionProfile.js';

/**
 * @param {Object} props
 * @param {string} [props.name]          Institution/faction name to resolve.
 * @param {any} [props.institution]      A resolved institution object (skips lookup).
 * @param {any} [props.settlement]       Settlement providing institutions + derivation data.
 * @param {import('react').ReactNode} [props.children]  Visible label (defaults to the name).
 * @param {import('react').CSSProperties} [props.style] Extra style for the label/trigger.
 */
export default function InstitutionLink({ name, institution, settlement, children, style }) {
  const [open, setOpen] = useState(false);

  const label = children ?? institution?.name ?? name ?? 'Institution';
  const inst = useMemo(
    () => institution || resolveInstitutionByName(name ?? institution?.name, settlement),
    [institution, name, settlement],
  );
  const profile = useMemo(
    () => (inst ? deriveInstitutionProfile(inst, settlement || {}) : null),
    [inst, settlement],
  );

  // No real institution, or nothing to say about it → plain text.
  if (!inst || !profile || profile.contributions.length === 0) {
    return <span style={style}>{label}</span>;
  }

  // Stop propagation so embedding the trigger inside a clickable row (PowerTab's
  // expandable faction row) opens the card WITHOUT also firing the row's handler.
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
        title={`View ${inst.name || label} profile`}
        style={{
          display: 'inline',
          minHeight: 0,
          padding: 0,
          border: 'none',
          background: 'transparent',
          color: GOLD,
          fontFamily: 'inherit',
          fontSize: 'inherit',
          fontWeight: 'inherit',
          fontStyle: 'inherit',
          lineHeight: 'inherit',
          textDecoration: 'underline',
          textDecorationStyle: 'dotted',
          textDecorationColor: `${GOLD}99`,
          textUnderlineOffset: 3,
          cursor: 'pointer',
          whiteSpace: 'normal',
          ...style,
        }}
      >
        {label}
      </Button>
      <InstitutionCard open={open} institution={inst} settlement={settlement} onClose={() => setOpen(false)} />
    </>
  );
}
