/**
 * FreeField.jsx — THE EDITOR'S FREE-TEXT CONTROL (EM-D0d, the first door).
 *
 * One already-resolved `FieldDeclaration` in, one plain-text control out. It resolves
 * nothing, reads no catalogue, touches no store, no URL and no browser storage, and
 * imports nothing from the edit volume at runtime: the only edge to `src/domain/edit/`
 * is the JSDoc typedef below, which is EM-A1's own idiom.
 *
 * ⭐ WHAT MOUNTS IT, AND WHAT IT READS (EM-D2c; the sentence here said "NOTHING MOUNTS
 * THIS YET" from EM-D0d until now, and it has been false since EM-D0e). The ONE caller is
 * `CardEditorDialog.jsx`: the door generates a control for every row EM-A1's table
 * declares and draws THIS one wherever the declared kind is `free` or `free-cascade`, and
 * the door is itself reached only through the one lazy edge EM-D1's edit shell holds. So
 * the product does render differently now -- behind the shell's gate, on a card the table
 * declares, for a DM who opened the pencil.
 *
 * Everything this leaf shows that it did not derive from its own props comes from that
 * door or from the copy registry, and from nowhere else:
 *   • `declaration` and `value` -- EM-A1's frozen row and the DM's in-flight text, both
 *     the door's; this leaf resolves neither and stores neither.
 *   • `coverage` -- the font-coverage reporter the door binds PER ROW (EM-D2b wired it;
 *     EM-D2c binds the face the field is really drawn in). Injected, never imported: see
 *     the chunk law below.
 *   • `edit.field.limit` and `edit.field.uncovered` -- the only two copy keys this leaf
 *     resolves, both through `t()`. Its caption is the declaration's own label, so the
 *     leaf mints no string at all and renders nothing en.js did not write.
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
 * ⭐ THE NOTE IS A SENTENCE NOW (EM-D2b, the slot EM-D2 recorded above). The landed key
 * `edit.field.uncovered` is the only string this leaf gained, and A7's DECLARED_KEYS
 * carries it in the same commit, so the leaf still mints no copy and still renders
 * nothing en.js did not write.
 *
 * ⛔ AND THE CHARACTERS KEEP AN ELEMENT OF THEIR OWN. The sentence is SPLIT AT ITS OWN
 * `{chars}` PLACEHOLDER rather than interpolated whole, so the glyphs stay one node with
 * one attribute: a reader -- a person's eye, a test, a future affordance that wants to
 * point at them -- can take the characters without parsing a sentence out from around
 * them, and the sentence's own wording stays en.js's business alone. The halves come
 * from `t()` with NO vars, which copy/index.js leaves placeholder-intact by its own
 * documented law, so not one word of the key is retyped here.
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
  // The sentence's two halves around the characters, resolved ONLY when there is
  // something to say. `t` with no vars leaves `{chars}` literal (copy/index.js), which is
  // what makes the split possible without retyping the key's words; a key that ever loses
  // the placeholder yields one half and an undefined second, which React renders as
  // nothing -- the sentence degrades, the characters never do.
  const sentence = unprintable === '' ? null : t('edit.field.uncovered').split('{chars}');

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
      {sentence === null
        ? null
        : (
          <span style={quiet}>
            {sentence[0]}
            <span data-uncovered={unprintable}>{unprintable}</span>
            {sentence[1]}
          </span>
        )}
    </div>
  );
}
