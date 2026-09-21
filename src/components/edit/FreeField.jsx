/**
 * FreeField.jsx — THE EDITOR'S FREE-TEXT CONTROL (EM-D0d, the first door).
 *
 * One already-resolved `FieldDeclaration` in, one plain-text control out. It resolves
 * nothing, reads no catalogue, touches no store, no URL and no browser storage, and
 * imports nothing from the edit volume at runtime: the only edge to `src/domain/edit/`
 * is the JSDoc typedef below, which is EM-A1's own idiom.
 *
 * NOTHING MOUNTS THIS YET. EM-D0e is the first caller, so with this leaf landed the
 * product renders not one pixel differently.
 *
 * THE ELEMENT BRANCHES ON THE DECLARED KIND, NEVER ON A NUMBER. An annotation
 * (`free`) is a short paragraph and takes a textarea; a join key (`free-cascade`) is
 * one line and takes a single-line input. No threshold constant is minted, so nothing
 * in this leaf can read as a simulation dial.
 *
 * THE LIMIT IS REPORTED, NEVER SILENT. `maxLength` is the platform's own clamp and the
 * browser applies it without a word, so a pasted overflow would otherwise vanish
 * unseen. The same render carries the count beside the field once the text has reached
 * the declared limit, through the copy registry's own used-of-limit pair.
 *
 * THE NUMBER IS READ FROM THE DECLARATION AND NEVER RETYPED: EM-A1's `TEXT_LIMITS` is
 * the one authority for what a DM may type. And the cascade a `free-cascade` rename
 * sets off belongs to the op, not to this control: here the field is plain text.
 */
import { useId } from 'react';

import { t } from '../../copy/index.js';
import { chromeFontSize } from '../../design/proseScale.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { BORDER, CARD, INK, MUTED, sans, FS, SP } from '../theme.js';

/** @typedef {import('../../domain/edit/types.js').FieldDeclaration} FieldDeclaration */

/**
 * @param {{ declaration: FieldDeclaration, value: string|null|undefined,
 *   onChange: (next: string) => void, disabled?: boolean }} props
 */
export default function FreeField({ declaration, value, onChange, disabled = false }) {
  const fieldId = useId();
  const mobile = useIsMobile();
  // ONE normalization, at the top: the element stays CONTROLLED for every nullish
  // spelling instead of silently becoming uncontrolled on null.
  const text = String(value ?? '');
  const max = declaration.maxLength;
  const atLimit = text.length >= max;

  const quiet = { color: MUTED, fontFamily: sans, fontSize: chromeFontSize(FS.xs, mobile) };
  const shared = {
    id: fieldId,
    value: text,
    maxLength: max,
    disabled,
    onChange: (event) => onChange(event.target.value),
    style: {
      width: '100%',
      padding: `${SP.xs}px ${SP.sm}px`,
      border: `1px solid ${BORDER}`,
      background: CARD,
      color: INK,
      fontFamily: sans,
      fontSize: chromeFontSize(FS.sm, mobile),
    },
  };

  // The label BOTH nests its control and carries htmlFor: `jsx-a11y/label-has-for` is
  // error-level on every new src leaf and demands both, and the estate's shipped
  // labelled controls are written the same way. The BRANCH IS ON THE LABEL rather than
  // on its child because that rule reads only literal element children: a control
  // behind a conditional is invisible to it, and a leaf that hid one there would be
  // asking for the disable comment instead of the association.
  const caption = <span style={quiet}>{declaration.label}</span>;
  const labelStyle = { display: 'flex', flexDirection: 'column', gap: SP.xs };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
      {declaration.kind === 'free' ? (
        <label htmlFor={fieldId} style={labelStyle}>
          {caption}
          <textarea {...shared} rows={3} />
        </label>
      ) : (
        <label htmlFor={fieldId} style={labelStyle}>
          {caption}
          <input {...shared} type="text" />
        </label>
      )}
      {atLimit
        ? <span style={quiet}>{t('edit.field.limit', { actual: text.length, max })}</span>
        : null}
    </div>
  );
}
