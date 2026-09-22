/**
 * CardEditorDialog.jsx — THE FIRST EDITOR DOOR (EM-D0e, the last member of EM-D0).
 *
 * ONE generated surface: a control for every field EM-A1's table declares for the card,
 * in the table's own AUTHORED order, and for no undeclared one. It is a CONTAINER, not a
 * writer: it owns the DM's in-flight text and the notice it shows, and nothing else. It
 * holds no shared state, resolves no save, mints no op and knows no command name.
 *
 * ⛔ IT LANDS DARK. Nothing mounts it at this landing, so a non-staff account sees
 * nothing new and the eager first-paint closure gains 0 members. Whether the door may be
 * opened at all is the MOUNT's conjunct, and the mount rides EM-D1 (judgment 146a).
 *
 * ⛔ IT SPELLS NO GATE AND READS NO SHARED STATE. Everything it cannot honestly know
 * arrives as a prop, which is EM-D0d's landed idiom one layer up: the writer is the
 * INJECTED `apply` seam, defaulted null and guarded by ONE predicate spelled TWICE — once
 * where the Save control's disabled state is computed and again as the handler's FIRST
 * statement — so an absent seam has no call path. A6 pins the pair by reading this file's
 * own bytes, which is the only channel that can see it: react-dom's `getListener` returns
 * null for onClick on a disabled button by its REACT PROPS, so a click fired at a
 * DOM-re-enabled control never reaches the handler and the second guard is unobservable
 * from the rendered surface.
 *
 * ⛔ IT DRAWS NO RANDOM NUMBER AND READS NO CLOCK. Its options come from `poolValues`
 * and its roller is `rollFrom`, both bound per declaration and both the producer's; two
 * renders with the same props reach the same markup, and it runs no effect, sets no
 * timeout, mounts no portal and touches no browser storage.
 */
import { useState } from 'react';

import { t } from '../../copy/index.js';
import { declarationsFor, isEditableCard } from '../../domain/edit/fieldDeclarations.js';
import { poolValues, rollFrom } from '../../domain/edit/pools.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { ClerkNote } from '../generate/ClerkNote.jsx';
import BottomSheet from '../primitives/BottomSheet.jsx';
import Button from '../primitives/Button.jsx';
import PortablePopup from '../primitives/PortablePopup.jsx';
import { SP } from '../theme.js';
import FreeField from './FreeField.jsx';
import PoolField from './PoolField.jsx';

/** @typedef {import('../../domain/edit/types.js').FieldDeclaration} FieldDeclaration */

/**
 * One edit, in the coordinates the adapter's caller needs and in NO other shape.
 * @typedef {{ cardType: string, entityId: string, field: string, value: string }} CardEdit
 */

/**
 * The injected seam's answer. `reason` is a member of the closed set below, or any other
 * word the executor may return; an unknown word takes the fallback line and invents nothing.
 * @typedef {{ ok: true } | { ok: false, reason?: string }} ApplyResult
 */

/**
 * ONE shared frozen empty array for a card the table does not declare, so a reader never
 * allocates and the two early returns below are one shape.
 * @type {readonly FieldDeclaration[]}
 */
const NO_ROWS = Object.freeze([]);

/** The closed refusal set, mapped to copy. FROZEN, in codepoint order. */
export const REFUSAL_COPY_KEYS = Object.freeze({
  canon_locked: 'edit.dialog.refusalCanonLocked',
  invalid_op: 'edit.dialog.refusalInvalidOp',
  no_save: 'edit.dialog.refusalNoSave',
  not_a_draft_field: 'edit.dialog.refusalNotADraftField',
  rename_not_applied: 'edit.dialog.refusalRenameNotApplied',
  undeclared_field: 'edit.dialog.refusalUndeclaredField',
  unknown_target: 'edit.dialog.refusalUnknownTarget',
});

/** The ONE line any other word takes, the executor's among them. */
export const REFUSAL_FALLBACK_KEY = 'edit.dialog.refusalUnknown';

/**
 * @param {{ open: boolean, cardType: string, entityId: string,
 *   values: Readonly<Record<string, string>>, world: object|null, seed: string,
 *   phase: 'draft'|'canon',
 *   apply?: ((edit: CardEdit) => Promise<ApplyResult>)|null,
 *   onClose: () => void }} props
 */
export default function CardEditorDialog({
  open, cardType, entityId, values, world, seed, phase, apply = null, onClose,
}) {
  // THE HOOKS STAND ABOVE THE TWO EARLY RETURNS, which is React's own invariant and the
  // shape both door primitives already use; the observable algorithm is unchanged.
  const mobile = useIsMobile();
  const [draft, setDraft] = useState({});
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!open) return null;
  const declarations = isEditableCard(cardType) ? declarationsFor(cardType) : NO_ROWS;
  if (declarations.length === 0) return null;

  // ONE derivation, spelled ONCE: the first door is a DRAFT surface, and on canon the
  // record's fields are not this door's to write, so it SAYS SO rather than offering a
  // control that will be refused.
  const readOnly = phase !== 'draft';

  const storedOf = (row) => String(values?.[row.field] ?? '');
  // `Object.hasOwn`, never truthiness, so a field the DM has CLEARED reads as the empty
  // string and not as the record's old value.
  const valueOf = (row) => (Object.hasOwn(draft, row.field) ? draft[row.field] : storedOf(row));
  const setField = (field, next) => setDraft({ ...draft, [field]: next });

  // THE OFF-LIST STORED VALUE IS PREPENDED, never sorted in and never dropped: the pool's
  // own order survives untouched and the record's truth stays visible and re-selectable.
  const optionsFor = (row) => {
    const pool = poolValues(row.pool, world ?? null);
    const held = valueOf(row);
    return held !== '' && !pool.includes(held) ? [held, ...pool] : pool;
  };

  const dispatchable = typeof apply === 'function';
  const refusalOf = (row, reason) => ({
    rubric: t('edit.dialog.refusalRubric'),
    line: t(REFUSAL_COPY_KEYS[reason] ?? REFUSAL_FALLBACK_KEY, { field: row.label }),
  });

  // ONE call per CHANGED field, in AUTHORED order, awaited, STOPPING at the first refusal.
  // Atomicity is single-target and the estate has no multi-field transaction, so the notice
  // NAMES THE FIELD rather than implying the card rolled back. A thrown seam is a refusal
  // the DM sees: the await sits in a try whose catch takes the fallback line.
  const onSave = async () => {
    if (typeof apply !== 'function') return;
    setBusy(true);
    // ⛔ SPELLED AS A LOOP WITH A GUARD, NEVER AS AN ARRAY METHOD: A3's source scan reads this
    // leaf's RAW bytes and forbids the three selecting and ordering spellings anywhere in them,
    // a comment included (§9 A3). The walk is the authored order either way, and an UNCHANGED
    // field is never dispatched.
    for (const row of declarations) {
      if (valueOf(row) === storedOf(row)) continue;
      let result;
      try {
        result = await apply({ cardType, entityId, field: row.field, value: valueOf(row) });
      } catch {
        result = null;
      }
      if (!result || result.ok !== true) {
        setNotice(refusalOf(row, result?.reason));
        setBusy(false);
        return;
      }
    }
    setBusy(false);
    onClose();
  };

  const controlFor = (row) => {
    if (row.kind === 'pool') {
      return (
        <PoolField
          key={row.field}
          declaration={row}
          options={optionsFor(row)}
          value={valueOf(row)}
          onChange={(next) => setField(row.field, next)}
          seed={seed}
          entryId={entityId}
          roll={(rollSeed, rollEntry, n) => rollFrom(row.pool, world, rollSeed, rollEntry, n)}
          disabled={readOnly}
        />
      );
    }
    if (row.kind === 'free' || row.kind === 'free-cascade') {
      return (
        <FreeField
          key={row.field}
          declaration={row}
          value={valueOf(row)}
          onChange={(next) => setField(row.field, next)}
          disabled={readOnly}
        />
      );
    }
    // Any other kind renders NO control, no label, no placeholder and no note.
    return null;
  };

  // The body is identical on both surfaces: the notices, the generated controls in the
  // table's order, then the one Save control.
  const body = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
      {notice === null ? null : (
        <ClerkNote role="alert" rubric={notice.rubric}>{notice.line}</ClerkNote>
      )}
      {readOnly ? (
        <ClerkNote rubric={t('edit.dialog.refusalRubric')}>{t('edit.dialog.canonNotice')}</ClerkNote>
      ) : null}
      {declarations.map((row) => controlFor(row))}
      <Button variant="primary" disabled={readOnly || !dispatchable || busy} onClick={onSave}>
        {t('edit.dialog.save')}
      </Button>
    </div>
  );

  // THE PHONE SHEET OWNS ITS OWN OPEN STATE AND RENDERS ITS OWN TRIGGER, so on the phone
  // this leaf's `open` decides whether the sheet and its trigger EXIST and the DM's tap
  // raises it. No second open state is minted and no shared primitive is edited.
  if (mobile) {
    return (
      <BottomSheet
        title={t('edit.dialog.title')}
        triggerLabel={t('edit.dialog.open')}
        onClose={onClose}
        editorHalo
      >
        {body}
      </BottomSheet>
    );
  }

  return (
    <PortablePopup
      open
      title={t('edit.dialog.title')}
      onClose={onClose}
      testId="card-editor-dialog"
      editorHalo
    >
      {body}
    </PortablePopup>
  );
}
