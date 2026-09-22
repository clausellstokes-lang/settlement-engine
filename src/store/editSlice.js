/**
 * editSlice.js — THE STORE'S PLAIN-EDIT HALF (EM-C4a, wave 1).
 *
 * ONE named writer of the edited state, reached ONLY through the estate's existing
 * application-command boundary: envelope -> executor -> registered spec -> this
 * module's `applyPlainEditToDraft`, injected as `context.actions`. Design 2.3's law
 * is that there is NO SECOND PATH, and tests/lint/editMutationPath.walker.test.js
 * convicts any other `src/` module that reaches an op or the layer.
 *
 * ⛔ LAZY BY CONSTRUCTION. No eager module imports this file and `src/store/index.js`
 * does NOT compose it: `vite.config.js`'s eager first-paint graph walks STATIC edges
 * only, so a static import from the composed store would make this leaf and
 * everything it imports eager. The transient editor mode therefore rides uiSlice's
 * already-shipped `userPrefs` bag under the key this module names, and no eager file
 * is edited at all. The measurement is the packet's 2.2 and the arm is its A5.
 *
 * ⛔ THE KEY IS `editorMode`, NEVER `editMode`. `editMode` is the shipped Cartographer
 * "Edit Dossier" boolean (settlementSlice.js:806), read off the store by two
 * components and pinned by ten test files. Two meanings for one key is the ambiguity
 * the FINITE-SEMANTICS law exists to refuse, so the editor's mode carries VALUES and
 * takes its own name.
 *
 * ⛔ IT PERSISTS NOTHING. The layer is written onto the live record; carrying it to a
 * server is EM-B3's, re-deriving from it is EM-B2a4's (the no-op seam below), and the
 * decree registry is EM-C4b's.
 */

import { isCanonSave, savePhase } from '../domain/campaign/canon.js';
import { applyEdit } from '../domain/edit/dmLayer.js';
import { declarationsFor, isEditableCard } from '../domain/edit/fieldDeclarations.js';
import { validateOp } from '../domain/edit/operations.js';

/** The closed transient vocabulary. VALUES, never a boolean. `decree` joins at EM-C4b. */
export const EDITOR_MODES = Object.freeze(['off', 'plain']);

/** The key under uiSlice's shipped userPrefs bag. */
export const EDITOR_MODE_PREF_KEY = 'editorMode';

/**
 * The closed refusal set, EXPORTED so a test asserts it in both directions rather than
 * re-typing it. SEVEN, frozen, in `compareCodepoint` order. `rename_not_applied` is
 * not a new word: it is the spelling the estate's own dispatcher already derived from
 * the same writer (settlementPendingEdits.js:321).
 * @type {readonly string[]}
 */
export const PLAIN_EDIT_REFUSALS = Object.freeze([
  'canon_locked', 'invalid_op', 'no_save', 'not_a_draft_field',
  'rename_not_applied', 'undeclared_field', 'unknown_target',
]);

/**
 * ⭐ THE DECLARED WRITERS, AS DATA. `<card>:<field>` -> the STORE ACTION NAME the
 * writer resolves off `get()`. ONE ROW TODAY. Frozen.
 *
 * ⛔ THIS IS THE ONE HOME FOR THAT NAME. A domain module may not reach the store, so
 * EM-B1c1's op row names the PURE-DOMAIN cascade and names no store action; this map
 * names the store action and names no domain path. Two facts, two layers, one home
 * each. A `free-cascade` declaration with NO row here is refused `not_a_draft_field`
 * — already closed, and already glossed "a declaration whose kind the first door does
 * not carry". EM-R6 adds `institution:name` and EM-D2 adds `faction:faction` when
 * their cascades exist; neither is here.
 */
export const CASCADE_WRITERS = Object.freeze({ 'npc:name': 'renameNPC' });

/**
 * ⛔ THE CALL, SPELLED LITERALLY — AND THAT IS A LANDED INSTRUMENT'S PREMISE, NOT A STYLE.
 * `tests/store/deadOperationRatchet.test.js` decides whether a registered op is DEAD by
 * COUNTING ITS CALL SITES, and its premise arm convicts ANY computed dispatch off the store
 * handle anywhere in `src/`, by name: one such dispatcher would make every op nominally
 * reachable and invalidate the whole ratchet. The two facts are therefore kept apart.
 * `CASCADE_WRITERS` above is
 * the DECLARATION — which store action owns a declared field — and this table is the CALL,
 * one row per writer, each reaching its action by the literal name the scanner can see.
 * EXPORTED because A1's assertion (d) reads BOTH tables from these frozen exports and pins
 * `Object.keys(CASCADE_DISPATCH)` SET-EQUAL BOTH WAYS to `Object.values(CASCADE_WRITERS)`, so
 * a row added to one and not the other cannot ship, and the estate's own dispatcher spells
 * its call exactly this way (`settlementPendingEdits.js:317`).
 */
export const CASCADE_DISPATCH = Object.freeze({
  renameNPC: (get, index, value) => get().renameNPC?.(index, value),
});

/**
 * ⭐ THE RE-DERIVATION SEAM, PLUGGED (EM-B2a4). It was a typed no-op from EM-C4a's
 * landing until this member; BOTH writers now consult it and take the SCOPED branch,
 * which reaches the re-derivation lane by a DYNAMIC import.
 * ⛔ `calls: 1` IS A SCOPE, NOT A TALLY: one re-derivation per applied edit is what the
 * lane exists for, and the lane is reached here and RUN BY ITS ONE CALLER, which a
 * successor wires. This member prices itself at ZERO direct consumers and lands the
 * leaf DORMANT, so nothing here rebuilds a world on an edit.
 * ⛔ Nothing here imports the domain leaf and nothing here names the orchestrator.
 */
export const REDERIVE_SEAM = Object.freeze({ kind: 'scoped', owner: 'EM-B2a4', calls: 1 });

/**
 * The declaration kinds the FIRST DOOR carries. EM-A1 declares four; `share`
 * (faction.power, its only row) is the one this door does not, because a power share
 * re-balances its siblings and that is EM-D2's arithmetic, not a field write.
 */
const DOOR_KINDS = Object.freeze(['free', 'free-cascade', 'pool']);

/**
 * ⭐ THE ROOT WRITE'S ONE HOME: `<card>` -> the settlement collection holding that
 * card's entities. ONE ROW TODAY, frozen, exactly as CASCADE_WRITERS is one row,
 * because THE FIRST DOOR IS THE NPC CARD. A root declaration whose card has no row
 * here is refused `not_a_draft_field` under the same gloss: institutions are EM-R6's,
 * factions EM-D2's, and a world fact is EM-B2b's, whose sub-object of the layer is
 * still minted empty and read by nobody.
 */
const ROOT_COLLECTIONS = Object.freeze({ npc: 'npcs' });

/**
 * The injected consult EM-B2a1's leaf takes as DATA. Supplied here, by the store
 * member that is allowed to wire two domain leaves together, from an import this file
 * already holds: the consult therefore adds ZERO import edges.
 */
const DECLARATION_CONSULT = Object.freeze({ isEditableCard, declarationsFor });

/** @type {?Promise<unknown>} */
let _rederiveLanePromise = null;

/**
 * ⭐ THE RE-DERIVATION LANE, REACHED DYNAMICALLY AND MEMOIZED (EM-B2a4).
 *
 * ⛔ A DYNAMIC import AND NEVER A STATIC ONE, for two measured reasons: this file's static
 * named-import list is pinned EXACT at four by the edit-path walker's own arm, and the eager
 * first-paint graph walks STATIC edges only, so a static edge here would pull the lane, the
 * domain leaf and the generation entry into first paint.
 *
 * ⛔ IT CANNOT THROW INTO A WRITER'S RESULT. A lane that fails to load leaves the edit itself
 * untouched: the layer write above it has already landed and the receipt below it is unchanged.
 * @returns {Promise<unknown>}
 */
function reachRederiveLane() {
  _rederiveLanePromise ||= import('./settlementRederiveAction.js').then(null, () => null);
  return _rederiveLanePromise;
}

/** @param {string} reason @returns {{ok: false, reason: string}} */
const refuse = (reason) => ({ ok: false, reason });

/**
 * ⭐ THE ONLY MINT of a root key, returning the key AND its coordinates in ONE frozen
 * record so no caller can spell them apart.
 * @param {string} cardType @param {string} entityId @param {string} field
 * @returns {Readonly<{key: string, cardType: string, entityId: string, field: string}>}
 */
export function rootKeyFor(cardType, entityId, field) {
  return Object.freeze({
    key: `${cardType}:${entityId}:${field}`, cardType, entityId, field,
  });
}

/**
 * The exact inverse, and the ONLY reader. A key that is not three non-empty
 * colon-separated parts returns `null`, which the caller turns into `unknown_target`:
 * it never throws and never guesses.
 * @param {unknown} key
 * @returns {Readonly<{key: string, cardType: string, entityId: string, field: string}>|null}
 */
export function readRootKey(key) {
  if (typeof key !== 'string') return null;
  const parts = key.split(':');
  if (parts.length !== 3 || parts.some((part) => part.length === 0)) return null;
  return rootKeyFor(parts[0], parts[1], parts[2]);
}

/**
 * @param {object} state the live store state
 * @returns {'off'|'plain'} never undefined; an unknown stored value reads as 'off'
 */
export function selectEditorMode(state) {
  const stored = state?.userPrefs?.[EDITOR_MODE_PREF_KEY];
  return /** @type {'off'|'plain'} */ (
    EDITOR_MODES.includes(stored) ? stored : EDITOR_MODES[0]
  );
}

/**
 * ⛔ THE CANON RULE'S READ (design 2.6). DELEGATES to canon.js: it never re-types a
 * phase comparison, because `campaignState.phase` is one of four spellings `savePhase`
 * accepts and a save carrying `canonizedAt` with no phase string is canon.
 *
 * For the ACTIVE save the subject is the LIVE store state, which is `CanonSaveLike` by
 * shape (`savePhase` reads `save.phase` first and the store carries `phase` at top
 * level, settlementSlice.js:337) and is exactly what the declared writer's own canon
 * lock reads, so the two can never disagree. Reading the CACHED `savedSettlements`
 * envelope for the active save is the defect this avoids: `setActiveSaveId` does not
 * upsert that row, so the envelope may be absent on a freshly-saved draft.
 *
 * @param {object} state @param {string} saveId
 * @returns {{found: boolean, canon: boolean, phase: string}} `found:false` with
 *   `canon:true` for an unknown save: UNKNOWN FAILS CLOSED.
 */
export function selectCanonState(state, saveId) {
  const id = String(saveId ?? '');
  if (id && id === String(state?.activeSaveId ?? '')) {
    return { found: true, canon: isCanonSave(state), phase: savePhase(state) };
  }
  const row = (state?.savedSettlements || [])
    .find((entry) => String(entry?.id ?? '') === id);
  // The fail-closed verdict is `canon`, not `phase`: no phase was read at all.
  if (!row) return { found: false, canon: true, phase: savePhase(null) };
  return { found: true, canon: isCanonSave(row), phase: savePhase(row) };
}

/**
 * Resolve ONE entity by id inside a settlement collection, with the estate's own
 * exactly-one-match guard (settlementPendingEdits.js `npcFor`): two matches is no
 * match, never the first.
 * @param {unknown} rows @param {string} entityId
 * @returns {number} the index, or -1 for zero or several matches
 */
function soleIndexOf(rows, entityId) {
  if (!Array.isArray(rows)) return -1;
  const wanted = String(entityId ?? '');
  const found = rows
    .map((row, index) => (String(row?.id ?? '') === wanted ? index : -1))
    .filter((index) => index >= 0);
  return found.length === 1 ? found[0] : -1;
}

/**
 * ⛔ A `free-cascade` FIELD ROUTES TO ITS DECLARED WRITER, NEVER TO `set-root`.
 *
 * An NPC's name is a JOIN KEY held on FIVE surfaces (`NPC_RENAME_SURFACES`). Pushing
 * it through `set-root` would write the first and leave four stale, which is the exact
 * two-lane divergence settlementRenameHelpers.js:391-406 records as already fixed and
 * which is INVISIBLE in memory because the two homes are the same object until JSON
 * splits them on save. So this branch calls ONE store action, which calls ONE cascade:
 * it imports no rename helper, re-implements no surface and writes `npcs[].name`
 * nowhere itself. Resolving the writer off `get()` BY ITS LITERAL NAME is also why it adds
 * ZERO import edges, and why the dead-op ratchet's scanner can still see the call.
 *
 * The active-save pre-condition is an INVARIANT here, not an arm: reaching this branch
 * means step 1 resolved the request AS the active save, and a second `no_save` arm
 * would be unreachable code.
 *
 * @param {Function} get @param {Function} set
 * @param {Readonly<{key: string, cardType: string, entityId: string, field: string}>} coords
 * @param {unknown} value @param {object} layerOp
 * @returns {Promise<{ok: true, saveId: string, keys: string[], layer: object}
 *                  | {ok: false, reason: string}>}
 */
async function applyCascadeEdit(get, set, coords, value, layerOp) {
  const action = CASCADE_WRITERS[`${coords.cardType}:${coords.field}`];
  if (!action || !Object.hasOwn(CASCADE_DISPATCH, action)) return refuse('not_a_draft_field');

  const index = soleIndexOf(get().settlement?.npcs, coords.entityId);
  if (index < 0) return refuse('unknown_target');

  // ⛔ AWAITED, never a bare call. The writer fetches its ~8.6 kB cascade at the call
  // seam to keep it off first paint, so the write lands a microtask later; reading the
  // roster off the un-awaited call would score every real rename as a refusal while
  // the write still landed - a FALSE REFUSAL over a REAL WRITE.
  await CASCADE_DISPATCH[action](get, index, value);

  // ⛔ READ BACK. The writer returns a bare `false` for five different causes and names
  // none of them, so the record is re-resolved and compared; this is the same
  // derivation the estate's own dispatcher makes from the same writer.
  const afterIndex = soleIndexOf(get().settlement?.npcs, coords.entityId);
  const after = afterIndex < 0 ? null : get().settlement.npcs[afterIndex];
  if (!after || after[coords.field] !== value) return refuse('rename_not_applied');

  // The record was written and persisted by the declared writer; the layer still
  // records that the field is the DM's. TWO writes, and the order is fixed: the
  // record first, the layer only after the read-back confirms.
  const applied = applyEdit(get().settlement?.dmLayer, layerOp, DECLARATION_CONSULT);
  if (applied.ok === false) return refuse(applied.reason);
  set((state) => { state.settlement.dmLayer = applied.layer; });

  // ⭐ THE SEAM'S SECOND CONSULT SITE (judgment 145). EM-C4a consulted the seam on the
  //    `set-root` path ALONE; the cascade branch consults it here, so ONE site becomes TWO
  //    and the two writers cannot drift apart about what the seam is.
  if (REDERIVE_SEAM.kind === 'scoped' && REDERIVE_SEAM.calls === 1) await reachRederiveLane();

  return {
    ok: /** @type {true} */ (true),
    saveId: String(get().activeSaveId ?? ''),
    keys: applied.keys,
    layer: applied.layer,
  };
}

/**
 * THE ONE NAMED WRITER of the edited state. Called ONLY by the adapter, through
 * `context.actions.applyPlainEditToDraft`. It draws no random number, reads no clock
 * and resolves no pool.
 *
 * @param {Function} get @param {Function} set
 * @param {{saveId: string, op: object, rootKey: string, value: unknown}} request
 * @returns {Promise<{ok: true, saveId: string, keys: string[], layer: object}
 *                  | {ok: false, reason: string}>} NEITHER branch throws. On
 *   `ok:false` the store is unchanged and no argument is mutated.
 */
export async function applyPlainEditToDraft(get, set, request) {
  // 1. ⛔ THE ONE `no_save` SITE, and the data-safety gate for BOTH branches: the
  //    declared writer indexes `get().settlement`, so routing a non-active save's
  //    request would hand an index computed from save X's roster to a writer operating
  //    on save Y and rename a different person. The `savedSettlements` row is the
  //    ENVELOPE this step reads when present; its ABSENCE for the active save is not a
  //    refusal, because `setActiveSaveId` does not upsert that row and refusing would
  //    refuse the first door's likeliest first use.
  const saveId = String(request?.saveId ?? '');
  if (!saveId || saveId !== String(get().activeSaveId ?? '')) return refuse('no_save');

  // 2. THE CANON RULE. It guards a `pool` field and a `free-cascade` field alike: the
  //    estate's declared writer freezes an NPC's name at canonization, so sending the
  //    edit through would produce a refusal wearing the wrong reason.
  if (selectCanonState(get(), saveId).canon === true) return refuse('canon_locked');

  // 3. `validateOp` REPORTS, never refuses; the refusal is this writer's act on its
  //    report. Its second parameter is read at NO step of the landed algorithm, and
  //    this module binds no world view, so `null` is passed EXPLICITLY at the declared
  //    arity rather than an identifier it cannot bind.
  if (validateOp(request?.op, null).ok === false) return refuse('invalid_op');

  // 4. The coordinates, then the declaration. `readRootKey` is the only reader of the
  //    key and the malformed-key refusal is its one site; every coordinate below is
  //    read off this ONE frozen record and never re-spelled from the request.
  const coords = readRootKey(request?.rootKey);
  if (coords === null) return refuse('unknown_target');
  if (!isEditableCard(coords.cardType)) return refuse('unknown_target');
  const declaration = declarationsFor(coords.cardType)
    .find((row) => row.field === coords.field);
  if (!declaration) return refuse('undeclared_field');
  if (!DOOR_KINDS.includes(declaration.kind)) return refuse('not_a_draft_field');

  const layerOp = {
    kind: 'set-root',
    key: coords.key,
    cardType: coords.cardType,
    field: coords.field,
    value: request.value,
  };

  // 5. The ONE branch: a `free-cascade` field goes to its declared writer and RETURNS.
  //    Steps 6 and 7 are the `set-root` path and are not reached for it, because
  //    writing the key here is the defect the branch exists to prevent.
  if (declaration.kind === 'free-cascade') {
    return applyCascadeEdit(get, set, coords, request.value, layerOp);
  }

  // 6. The layer, through EM-B2a1's leaf at its declared arity three.
  const applied = applyEdit(get().settlement?.dmLayer, layerOp, DECLARATION_CONSULT);
  if (applied.ok === false) return refuse(applied.reason);

  // 7. ONE `set` writes BOTH the record's edited value and the returned layer. The base
  //    of the write is the SAVE, never a projection of it. An ANNOTATION carries no
  //    `outputKey` by EM-A1's own contract - the absence IS the claim that nothing on
  //    the record reads it - so it writes the layer alone.
  const collection = Object.hasOwn(ROOT_COLLECTIONS, coords.cardType)
    ? ROOT_COLLECTIONS[coords.cardType]
    : null;
  const writesRecord = Boolean(declaration.outputKey);
  if (writesRecord && !collection) return refuse('not_a_draft_field');
  const index = writesRecord ? soleIndexOf(get().settlement?.[collection], coords.entityId) : -1;
  if (writesRecord && index < 0) return refuse('unknown_target');
  set((state) => {
    if (writesRecord) state.settlement[collection][index][coords.field] = request.value;
    state.settlement.dmLayer = applied.layer;
  });

  // 8. ⭐ THE RE-DERIVATION SEAM, CONSULTED, AND THE SCOPED BRANCH TAKEN (EM-B2a4). The seam
  //    declares `kind: 'scoped'` and `calls: 1`, so the lane is REACHED from this writer rather
  //    than skipped. ⛔ The lane is not RUN on an edit: this member prices itself at zero direct
  //    consumers and lands the leaf dormant, and a successor wires the one caller.
  const seamIsScoped = REDERIVE_SEAM.kind === 'scoped' && REDERIVE_SEAM.calls === 1;
  if (seamIsScoped) await reachRederiveLane();

  // 9. The receipt, and EM-C4a's own question ANSWERED rather than inherited. Its comment asked
  //    this expression to learn what else moved once the seam was plugged. Measured, the answer
  //    is NOTHING ELSE that this receipt can name: `keys` is a list of ROOT KEYS, a re-derivation
  //    moves RECORD PATHS, and the two vocabularies do not meet until an edit's consequence is
  //    reported as the difference between two re-derivations, which is the re-entry family's.
  //    So the keys the layer write moved are the whole of what this receipt claims, on BOTH
  //    branches of the seam, and no landed arm is weakened to say so.
  return {
    ok: /** @type {true} */ (true),
    saveId,
    keys: applied.keys,
    layer: applied.layer,
  };
}
