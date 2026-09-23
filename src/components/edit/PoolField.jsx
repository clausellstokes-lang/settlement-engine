/**
 * PoolField.jsx — THE EDITOR'S POOL CONTROL (EM-D0d, the first door).
 *
 * One already-resolved `FieldDeclaration` and ONE already-resolved options array in,
 * one native drop-down out. IT RESOLVES NO POOL: it imports nothing from
 * `src/domain/edit/` at runtime, reads no generator catalogue and reads no display
 * seam, which is design item 7's rule kept by construction rather than by review. The
 * only edge to the edit volume is the JSDoc typedef below.
 *
 * WHAT MOUNTS IT: `CardEditorDialog.jsx`'s `controlFor` renders this for every
 * `kind: 'pool'` row (EM-D0e landed), handing it the resolved `declaration` and
 * `options` above plus a `roll` already bound to `rollFrom(row.pool, world, ...)`.
 *
 * WHY A NATIVE SELECT AND NOT THE ESTATE'S ARIA COMBOBOX (ratified): every pool the
 * first door draws is a CLOSED bounded vocabulary of a few members, the estate's
 * drop-down idiom is the native element by 53 files to 3, and the three combobox
 * files are open registries of hundreds of entries whose option rows are raw buttons
 * in a grandfathered file a new leaf may not join. The native element also brings the
 * label join, the disabled state, keyboard type-ahead and the phone's own picker
 * without minting a second idiom.
 *
 * THE CONTROL IS SAFE WITH NO ROLLER, AND THAT IS NOT AN EDGE CASE. The roller is
 * INJECTED already bound to its pool and its world; the module that binds it is
 * unwritten at this leaf's landing, so a mount may legitimately have nothing to pass.
 * `roll` therefore defaults to null and `typeof roll === 'function'` is the ONE
 * predicate that decides whether the affordance is live: once where the button's
 * disabled state is computed, and again as the handler's first statement, so an absent
 * roller has no call path even if a caller re-enables the button through a spread prop.
 *
 * IT DRAWS NO RANDOM NUMBER AND READS NO CLOCK, in render or in an effect. Its only
 * source of a value is the injected roller, and its only state is the integer roll
 * index plus one boolean that remembers a refusal: a roller that answers with nothing
 * changes no value, so nothing else would re-render and the refusal could never be
 * shown. Two mounts with the same props reach the same markup.
 */
import { useId, useState } from 'react';

import { t } from '../../copy/index.js';
import { chromeFontSize } from '../../design/proseScale.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import Button from '../primitives/Button.jsx';
import { BORDER, CARD, INK, MUTED, sans, FS, SP } from '../theme.js';

/** @typedef {import('../../domain/edit/types.js').FieldDeclaration} FieldDeclaration */

/**
 * @param {{ declaration: FieldDeclaration, options: readonly string[],
 *   value: string|null|undefined, onChange: (next: string) => void, seed: string,
 *   entryId: string,
 *   roll?: ((seed: string, entryId: string, n: number) => string|null)|null,
 *   disabled?: boolean }} props
 */
export default function PoolField({
  declaration,
  options,
  value,
  onChange,
  seed,
  entryId,
  roll = null,
  disabled = false,
}) {
  const fieldId = useId();
  const mobile = useIsMobile();
  const [rollIndex, setRollIndex] = useState(0);
  const [rollRefused, setRollRefused] = useState(false);

  // ONE normalization, at the top: the select stays CONTROLLED for every nullish
  // spelling instead of being handed null or undefined as a value.
  const selected = String(value ?? '');
  const empty = options.length === 0;
  const rollable = typeof roll === 'function';

  const onRoll = () => {
    if (typeof roll !== 'function') return;
    const next = roll(seed, entryId, rollIndex + 1);
    if (typeof next === 'string' && next.length > 0) {
      setRollIndex(rollIndex + 1);
      setRollRefused(false);
      onChange(next);
      return;
    }
    setRollRefused(true);
  };

  // The array's OWN order, never sorted, filtered or de-duplicated. The empty member
  // is always first and always SELECTABLE, so a DM may clear a field back to empty.
  const optionNodes = empty
    ? [<option key="no-options" value="">{t('edit.field.noOptions')}</option>]
    : [
      <option key="not-set" value="">{t('edit.field.emptyOption')}</option>,
      ...options.map((option) => <option key={option} value={option}>{option}</option>),
    ];

  const quiet = { color: MUTED, fontFamily: sans, fontSize: chromeFontSize(FS.xs, mobile) };

  // The label BOTH nests its control and carries htmlFor: `jsx-a11y/label-has-for` is
  // error-level on every new src leaf and demands both, and the estate's shipped
  // labelled controls are written the same way. The roll affordance stays OUTSIDE the
  // label, because a second control inside one label belongs to neither.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: SP.sm }}>
        <label htmlFor={fieldId} style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
          <span style={quiet}>{declaration.label}</span>
          <select
            id={fieldId}
            value={selected}
            disabled={disabled || empty}
            onChange={(event) => onChange(event.target.value)}
            style={{
              padding: `${SP.xs}px ${SP.sm}px`,
              border: `1px solid ${BORDER}`,
              background: CARD,
              color: INK,
              fontFamily: sans,
              fontSize: chromeFontSize(FS.sm, mobile),
            }}
          >
            {optionNodes}
          </select>
        </label>
        <Button
          variant="secondary"
          size="sm"
          disabled={disabled || empty || !rollable}
          onClick={onRoll}
        >
          {t('edit.field.rollAnother')}
        </Button>
      </div>
      {rollRefused
        ? <span style={quiet}>{t('edit.field.rollUnavailable')}</span>
        : null}
    </div>
  );
}
