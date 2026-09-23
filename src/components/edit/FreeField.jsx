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
 *
 * ── THE SECOND SILENT LOSS: A CHARACTER THE PRINTED DOSSIER CANNOT DRAW (EM-D2) ──
 * The limit is not the only thing that used to vanish without a word. This text is
 * carried verbatim into the paid PDF, which embeds eight faces and nothing else, and
 * @react-pdf does not print an uncovered character as a box -- it substitutes a
 * non-embedded Helvetica and truncates to the low byte, so the customer prints a
 * plausible WRONG LETTER. The same law therefore covers it: REPORTED, NEVER SILENT.
 *
 * ⛔ AND REPORTED IS ALL. The control does not strip, substitute, clamp or refuse a
 * character it cannot print, and the text the parent holds is byte-identical either
 * way. What a DM types is theirs; what the fonts can draw is a fact about the fonts.
 *
 * THE CHECK IS INJECTED, NEVER IMPORTED, and that is a chunk law rather than a taste:
 * the reader lives in `src/pdf/lib/fontCoverage.js`, the PDF tree is lazy and budgeted,
 * and one static edge from this leaf would price the whole editor against
 * `editorTrain` in tests/build/vendorPdfLazy.test.js. So `coverage` arrives as a PURE
 * FUNCTION the caller supplies -- `PoolField`'s own `roll` idiom -- and with no
 * function passed the report simply never appears.
 *
 * ⚠ THE NOTE CARRIES THE CHARACTERS AND NOT YET A SENTENCE, and this is a recorded
 * boundary rather than an oversight: `en.js` and `editFields.test.jsx`'s A7 (which pins
 * the leaves' copy keys to an EXACT five-key set) both sit outside this member's file
 * manifest, so minting a key here would be a silent edit to another owner's file. The
 * slot the chair owns is one row -- `edit.field.uncovered`, reading
 * 'These characters will not print: {chars}' -- plus that key in A7's DECLARED_KEYS.
 * Until it lands the glyphs themselves are the report, which is the whole of the law
 * even if not yet the whole of the sentence.
 */
import { useId } from 'react';

import { t } from '../../copy/index.js';
import { chromeFontSize } from '../../design/proseScale.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { BORDER, CARD, INK, MUTED, sans, FS, SP } from '../theme.js';

/** @typedef {import('../../domain/edit/types.js').FieldDeclaration} FieldDeclaration */

/** @typedef {{ char: string, codePoint: number, index: number }} UncoveredCharacter */

/**
 * @param {{ declaration: FieldDeclaration, value: string|null|undefined,
 *   onChange: (next: string) => void, disabled?: boolean,
 *   coverage?: ((text: string) => UncoveredCharacter[])|null }} props
 */
export default function FreeField({
  declaration, value, onChange, disabled = false, coverage = null,
}) {
  const fieldId = useId();
  const mobile = useIsMobile();
  // ONE normalization, at the top: the element stays CONTROLLED for every nullish
  // spelling instead of silently becoming uncontrolled on null.
  const text = String(value ?? '');
  const max = declaration.maxLength;
  const atLimit = text.length >= max;

  // The report, DEDUPED BY CHARACTER IN FIRST-APPEARANCE ORDER. The reader answers per
  // OCCURRENCE, because a caller that wants to point at the third one needs the third
  // one; a note that said the same glyph four times would only be noise. No sort: the
  // DM's own order is the order they will look for it in.
  const reported = typeof coverage === 'function' ? coverage(text) : null;
  const distinct = [];
  for (const entry of Array.isArray(reported) ? reported : []) {
    const char = entry && typeof entry.char === 'string' ? entry.char : '';
    if (char !== '' && !distinct.includes(char)) distinct.push(char);
  }
  const unprintable = distinct.join(' ');

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
      {unprintable === ''
        ? null
        : <span style={quiet} data-uncovered={unprintable}>{unprintable}</span>}
    </div>
  );
}
