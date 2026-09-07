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
