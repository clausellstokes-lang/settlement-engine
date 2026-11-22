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
 * ⭐ ONE SURFACE, TWO ERRANDS (EM-F3). The same generated body EDITS a subject that exists and
 * CREATES one that does not, and which errand it is on is read off the injected seams rather
 * than off a mode word: with `create` bound the door is a CREATE form — one Confirm that hands
 * the caller EVERY declared field's value at once — and with `apply` bound it is the editor it
 * has always been, one call per CHANGED field. The two seams are never both bound by the same
 * mount, and neither knows what the other writes.
 *
 * ⭐ AND THE CREATE ERRAND'S FIELDS ARE THE CALLER'S, NOT THIS DOOR'S GUESS (EM-D1c). A roster
 * newcomer is ordered as a DECREE whose payload the op catalogue declares, and that payload is a
 * SUBSET of the card's declared rows: a person joins the roster with a name and a role, and her
 * status and her note are written afterwards through the ordinary pencil. So the mount NAMES the
 * fields its errand writes and this door draws EM-A1's own rows for exactly those — their
 * labels, their limits and their pools, in the table's authored order — while a mount that names
 * none draws every declared row, which is what the editor and the phantom's create both want. A
 * named field the table does not declare draws nothing at all, because a control this door
 * cannot label is one it cannot honestly render.
 *
 * ⛔ AND THE POOL CATALOGUE TRAVELS WITH THE VALUES. The writer resolves every pooled value
 * against the catalogue its CALLER hands in, and this door is the only party that knows which
 * pools it drew; so Confirm hands over the pool table's OWN answer for each pooled row it
 * rendered, under that pool's own name. It is the RAW answer and never the option list the
 * control shows: that list may carry a value the record holds off-list, and handing that back as
 * the vocabulary would make the writer's own check agree with anything.
 *
 * ⛔ THE CANON RULE HAS NO SUBJECT ON THE CREATE ERRAND, and the door says so by construction
 * rather than by disabling a control it cannot explain. `readOnly` exists because design §2.6
 * turns an EDIT OF THIS RECORD into an event once the settlement is canonized; a CREATE form
 * writes no field of this record at all — EM-F3's phantom is a save of its own — so the one
 * derivation simply has no subject there, spelled once, in one place.
 *
 * ⛔ IT DRAWS NO RANDOM NUMBER AND READS NO CLOCK. Its options come from `poolValues`
 * and its roller is `rollFrom`, both bound per declaration and both the producer's; two
 * renders with the same props reach the same markup, and it runs no effect, sets no
 * timeout, mounts no portal and touches no browser storage.
 *
 * ── WHAT THE PRINTED DOSSIER CANNOT DRAW: THIS DOOR IS THE READER'S ONE IMPORTER (EM-D2b) ──
 * EM-D2 landed the cmap reader and EM-D0d landed the field that reports it, and the two
 * were never joined: `FreeField` takes its check as a PURE FUNCTION PROP and imports
 * nothing, because a static edge from a field control into the PDF volume is the chunk
 * cost that leaf's own header forbids. THE JOIN BELONGS HERE, and it is made the only way
 * a door may make it -- through a DYNAMIC import, which the build's own eager-graph
 * derivation treats as a lazy boundary by construction (`computeEagerModuleGraph` in
 * vite.config.js follows static specifiers alone). So the reader can never enter the
 * first-paint closure behind this file, and the roster row in
 * tests/build/vendorPdfLazy.test.js is what convicts a static edge the day one is typed.
 *
 * THE ANSWER IS KEPT HERE BECAUSE THE LEAF REFUSES TO KEEP IT: `loadFamilyCoverage`
 * caches nothing and says why -- a cache is a lifecycle, and the caller that decides WHEN
 * to read is the one that decides how long to hold. BOTH registered families are read, and
 * read ONCE per page load.
 *
 * ⭐ AND EACH FIELD IS MEASURED AGAINST THE FACE IT IS REALLY DRAWN IN (EM-D2c, U84). The
 * first wiring asked Lora for every field, which was the wrong question for half of them:
 * the dossier sets a NAME as a Lora card title AND in a Nunito caption, pill or running
 * page header, so a character only one family carries printed wrong in one of those places
 * while the field either said nothing or slandered a name it could draw. The join is made
 * HERE because this door is the one party that knows both halves -- EM-A1's declared rows
 * and the dossier's type scale -- and it is made ONCE, in `FIELD_GROUP_ROLES` below.
 *
 * ⛔ AND IT IS READ WITH NO EFFECT, NO TIMER AND NO PIECE OF STATE, which is this door's
 * standing law four lines up and not a rule bent for a new errand. The request is kicked
 * off by the first render that actually DRAWS a free control, and the answer is read from
 * that same call on the next one. THE COST IS NAMED RATHER THAN HIDDEN: a card whose
 * stored text already carries an uncovered character is silent on the door's first paint
 * and speaks from the next render on -- the first keystroke, the first roll, the first
 * anything. Silence while unmeasured is `coverageOf`'s own FAILS-OPEN rule, written down
 * there in full; a door that re-rendered itself from a promise would be exactly the state
 * this file does not hold.
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
 * One character the embedded faces cannot draw, in the reader's own shape. RESTATED
 * rather than imported, exactly as `FreeField` restates it: a JSDoc edge would be free at
 * runtime, but the two leaves that must not import the PDF volume are the two that read
 * this shape, and one spelling of the rule is easier to keep than two.
 * @typedef {{ char: string, codePoint: number, index: number }} UncoveredCharacter
 */

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

/**
 * WHICH DOSSIER ROLE A DECLARED FIELD'S VALUE IS DRAWN IN, keyed by the row's OWN `group`
 * and MEASURED rather than assumed (2026-09-23, against src/pdf/sections and the two
 * primitives every section draws through):
 *
 *   'identity' -- a NAME. It is a Lora card title (`type.body_em` in Institutions,
 *      NotableNPCs, NPCQuickRef, PowerStructure and Relationships; `type.cover_title` on a
 *      cover) AND a Nunito label: `KeyValRow` sets an institution's Head and a chain's
 *      processors in `type.caption`, `Pill` sets an NPC's faction in `type.pill`, and
 *      `PageChrome` sets the settlement's own name in `type.label` on EVERY page header.
 *      Drawn in both, so the honest report is what either family cannot draw.
 *   'annotation' -- a NOTE. `Institutions.jsx` sets it in `type.italic` and every other
 *      prose slot is `type.body` / `type.prose`: Lora, and only Lora.
 *
 * ⛔ THE KEY IS `group` BECAUSE `kind` DOES NOT PARTITION: `phantom.name` is kind 'free'
 * like the two notes and is a name like the three cascades, while `group` splits the six
 * free rows exactly two ways. A group this map does not name takes the widest answer
 * `familiesForRole` gives -- the default is spelled THERE, once, and never here.
 *
 * EXPORTED so the arm that walks EM-A1's whole table can assert every free row's group is
 * one of these two and every value is a role the reader really knows.
 */
export const FIELD_GROUP_ROLES = Object.freeze({
  annotation: 'body',
  identity: 'both',
});

/**
 * The dossier role one declared row is drawn in, or null for a group this door has not
 * measured -- which the reader answers with its own widest list.
 * `Object.hasOwn`, never a bracket read: 'constructor' is an unmeasured group like any other.
 * @param {FieldDeclaration|null|undefined} declaration @returns {string|null}
 */
function roleOf(declaration) {
  const group = declaration && typeof declaration.group === 'string' ? declaration.group : '';
  return Object.hasOwn(FIELD_GROUP_ROLES, group) ? FIELD_GROUP_ROLES[group] : null;
}

/**
 * The per-role reporter factory once every face is in, or null until then.
 * @type {((role: string|null) => (text: string) => UncoveredCharacter[])|null}
 */
let reporterForRole = null;
/** The one request, so the eight faces are fetched once per page load. @type {Promise<void>|null} */
let facesRequested = null;

/**
 * THE FONT-COVERAGE REPORTER FOR ONE ROW, or null while the faces are still coming.
 * Calling this is what KICKS THE READ OFF, so the read happens only for a door that really
 * drew a free control, and never at import time.
 *
 * ⛔ IT WAITS FOR EVERY FAMILY BEFORE IT ANSWERS FOR ANY. A union taken over the one family
 * that happened to arrive first would be a report that says "these will print" about a face
 * it has not read -- silence is the honest state until the whole answer exists, and silence
 * while unmeasured is `coverageOf`'s own fail-open rule.
 *
 * ⛔ IT SWALLOWS A FAILED READ ON PURPOSE. A face that will not load leaves the factory
 * null, and a null reporter is a silent field, for that same reason: slandering a DM's
 * perfectly good writing because a font request was slow teaches every user to ignore the
 * note.
 *
 * EXPORTED because the seam is ASYNCHRONOUS: a test that could not await it could only
 * ever assert the null, which is the half that was already true.
 * @param {FieldDeclaration|null} [declaration] the row whose control will show the report
 * @returns {((text: string) => UncoveredCharacter[])|null}
 */
export function faceCoverageReporter(declaration = null) {
  if (facesRequested === null) {
    facesRequested = import('../../pdf/lib/fontCoverage.js')
      .then(async (faces) => {
        /** @type {Record<string, object>} */
        const loaded = {};
        // THE FAMILIES ARE THE READER'S OWN WIDEST ROLE, never a name typed here: this door
        // spells no font family at all, so a re-cut dossier moves one file and not two.
        for (const family of faces.ROLE_FAMILIES.both) {
          loaded[family] = await faces.loadFamilyCoverage(family, faces.fetchFace);
        }
        reporterForRole = (role) => {
          const wanted = faces.familiesForRole(role).map((family) => loaded[family]);
          return (text) => faces.coverageAcross(text, wanted).uncovered;
        };
      })
      .catch(() => { reporterForRole = null; });
  }
  return reporterForRole === null ? null : reporterForRole(roleOf(declaration));
}

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
 * EM-F3's CREATE refusals, mapped to copy. FROZEN, in codepoint order, and a SECOND map rather
 * than five more rows on the one above: `REFUSAL_COPY_KEYS` is asserted set-equal to the landed
 * plain-edit refusal set in both directions, and a create refusal is not a plain-edit refusal.
 * An unknown word takes the same one fallback line.
 */
export const CREATE_REFUSAL_COPY_KEYS = Object.freeze({
  invalid_name: 'edit.dialog.refusalMintInvalidName',
  mint_failed: 'edit.dialog.refusalMintFailed',
  no_seed: 'edit.dialog.refusalMintNoSeed',
  off_pool: 'edit.dialog.refusalMintOffPool',
  save_failed: 'edit.dialog.refusalMintSaveFailed',
});

/**
 * EM-D1c's ROSTER CREATE refusals, mapped to copy. FROZEN, in codepoint order, and a THIRD map
 * for the reason the second one exists: the roster writer's closed set is its own vocabulary and
 * not the phantom mint's. The two CREATE sets meet in exactly ONE word — a save with no seed can
 * found nothing, whichever errand asked — so that word keeps ONE line, spelled in the map above
 * and subject-free, and these five are the words only this errand can say. The lookup below
 * reads both maps and needs no errand flag, which is only true while they stay disjoint.
 */
export const ADD_REFUSAL_COPY_KEYS = Object.freeze({
  invalid_op: 'edit.dialog.refusalAddInvalidOp',
  no_save: 'edit.dialog.refusalAddNoSave',
  not_staged: 'edit.dialog.refusalAddNotStaged',
  stale_vocabulary: 'edit.dialog.refusalAddStaleVocabulary',
  unknown_target: 'edit.dialog.refusalAddUnknownTarget',
});

/**
 * ONE CREATE refusal's line, by OWN-KEY lookup in both maps and then the one fallback. The
 * lookup is `Object.hasOwn` rather than a bracket read because the word arrives from an
 * executor: an inherited name is an unknown refusal like any other and takes the fallback.
 * @param {unknown} reason @returns {string} a copy key
 */
const createRefusalKey = (reason) => {
  const word = String(reason ?? '');
  if (Object.hasOwn(CREATE_REFUSAL_COPY_KEYS, word)) return CREATE_REFUSAL_COPY_KEYS[word];
  if (Object.hasOwn(ADD_REFUSAL_COPY_KEYS, word)) return ADD_REFUSAL_COPY_KEYS[word];
  return REFUSAL_FALLBACK_KEY;
};

/**
 * The rows one errand draws: EM-A1's declared rows in the table's AUTHORED order, kept to the
 * field names the caller named. No list at all is the whole card. A named field the table does
 * not declare is not drawn, and a call that names only such fields draws no form at all.
 *
 * ⛔ SPELLED AS A LOOP WITH A GUARD for the reason the save walk gives below: A3's source scan
 * reads this leaf's RAW bytes and forbids the selecting and ordering spellings anywhere in them.
 * @param {readonly FieldDeclaration[]} rows @param {readonly string[]|null|undefined} fields
 * @returns {readonly FieldDeclaration[]}
 */
function rowsFor(rows, fields) {
  if (!Array.isArray(fields)) return rows;
  /** @type {FieldDeclaration[]} */
  const kept = [];
  for (const row of rows) {
    if (fields.includes(row.field)) kept.push(row);
  }
  return kept;
}

/**
 * @param {{ open: boolean, cardType: string, entityId: string,
 *   values: Readonly<Record<string, string>>, world: object|null, seed: string,
 *   phase: 'draft'|'canon',
 *   apply?: ((edit: CardEdit) => Promise<ApplyResult>)|null,
 *   create?: ((values: Record<string, string>,
 *     pools: Readonly<Record<string, readonly string[]>>) => Promise<ApplyResult>)|null,
 *   createFields?: readonly string[]|null,
 *   onClose: () => void }} props
 */
export default function CardEditorDialog({
  open, cardType, entityId, values, world, seed, phase,
  apply = null, create = null, createFields = null, onClose,
}) {
  // THE HOOKS STAND ABOVE THE TWO EARLY RETURNS, which is React's own invariant and the
  // shape both door primitives already use; the observable algorithm is unchanged.
  const mobile = useIsMobile();
  const [draft, setDraft] = useState({});
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!open) return null;
  const declared = isEditableCard(cardType) ? declarationsFor(cardType) : NO_ROWS;
  // THE ERRAND'S OWN ROWS. With no field list this is the card, by identity, which is every
  // mount this door had before EM-D1c; a form with no row at all renders nothing, exactly as an
  // undeclared card does, because a Confirm over no field would write an empty subject.
  const declarations = rowsFor(declared, createFields);
  if (declarations.length === 0) return null;

  // ONE derivation, spelled ONCE: the first door is a DRAFT surface, and on canon the
  // record's fields are not this door's to write, so it SAYS SO rather than offering a
  // control that will be refused. On the CREATE errand the rule has no subject — the form
  // writes no field of this record — so the derivation answers false there by construction.
  const creating = typeof create === 'function';
  const readOnly = !creating && phase !== 'draft';

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

  // THE POOL CATALOGUE THIS ERRAND DREW, keyed by the pool's own name (see the header). It is
  // the pool table's RAW answer — `optionsFor` above may prepend a value the record holds
  // off-list, and a catalogue carrying that would agree with anything.
  const poolsDrawn = () => {
    /** @type {Record<string, readonly string[]>} */
    const bag = {};
    for (const row of declarations) {
      if (row.kind === 'pool' && typeof row.pool === 'string') {
        bag[row.pool] = poolValues(row.pool, world ?? null);
      }
    }
    return bag;
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

  // THE CREATE ERRAND. ONE call carrying every field THIS ERRAND DRAWS, in the table's authored
  // order, because a subject that does not exist yet cannot be written one field at a time, and
  // with the pool catalogue those fields were drawn from. The values are gathered by the same
  // reader the controls render from, so what the caller receives is exactly what the DM sees,
  // and no row the door did not show is sent. The guard is spelled twice for the editor's reason:
  // once where the control's disabled state is computed and again as the handler's first
  // statement, so an absent seam has no call path.
  const onConfirm = async () => {
    if (typeof create !== 'function') return;
    setBusy(true);
    /** @type {Record<string, string>} */
    const gathered = {};
    for (const row of declarations) gathered[row.field] = valueOf(row);
    let result;
    try {
      result = await create(gathered, poolsDrawn());
    } catch {
      result = null;
    }
    if (!result || result.ok !== true) {
      setNotice({
        rubric: t('edit.dialog.refusalRubric'),
        line: t(createRefusalKey(result?.reason), { field: t('edit.dialog.createSubject') }),
      });
      setBusy(false);
      return;
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
          coverage={faceCoverageReporter(row)}
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
      {creating ? (
        <Button variant="primary" disabled={busy} onClick={onConfirm}>
          {t('edit.dialog.confirm')}
        </Button>
      ) : (
        <Button variant="primary" disabled={readOnly || !dispatchable || busy} onClick={onSave}>
          {t('edit.dialog.save')}
        </Button>
      )}
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
