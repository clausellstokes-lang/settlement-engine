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
 * ⛔ IT PERSISTS NOTHING OF ITS OWN. The layer and the registry are written onto the
 * live record, whose save path EM-B3a already proved byte-exact for both keys; carrying
 * the layer to a server is EM-B3's and re-deriving from it is EM-B2a4's (the seam below).
 *
 * ⭐ EM-C4b ADDS THE REGISTRY HALF on this same leaf: the `decree` mode, six store actions
 * over EM-C1's PURE registry through ONE write site, and `selectGuards`, memoized, whose
 * rule set is an ARGUMENT so this module imports no rule and reaches no generator. It also
 * carries the DIALOG'S BINDER (judgment 146c), which reaches the plain-edit writer through
 * the one generic adapter and mints no second one.
 */

import { isCanonSave, savePhase } from '../domain/campaign/canon.js';
import { applyEdit, mintDmId } from '../domain/edit/dmLayer.js';
import { declarationsFor, isEditableCard } from '../domain/edit/fieldDeclarations.js';
import { EMPTY_RULE_SET, evaluateGuards } from '../domain/edit/guards.js';
import { makeOp, OP_TYPES, validateOp } from '../domain/edit/operations.js';
import {
  markApplied, reopen, reorder, resolveDecree, revertTick, stage, withdraw,
} from '../domain/edit/registry.js';

/**
 * The closed transient vocabulary. VALUES, never a boolean. `decree` JOINS HERE (EM-C4b)
 * and the list is written in `compareCodepoint` order, which is why the default below is
 * NAMED: EM-C4a read it as `EDITOR_MODES[0]`, and a codepoint splice would have made
 * `decree` the value an unknown stored word falls back to.
 */
export const EDITOR_MODES = Object.freeze(['decree', 'off', 'plain']);

/** The member an absent or unknown stored value reads as. Named, never positional. */
export const EDITOR_MODE_OFF = 'off';

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
 * @returns {'decree'|'off'|'plain'} never undefined; an unknown stored value reads as 'off'
 */
export function selectEditorMode(state) {
  const stored = state?.userPrefs?.[EDITOR_MODE_PREF_KEY];
  return /** @type {'decree'|'off'|'plain'} */ (
    EDITOR_MODES.includes(stored) ? stored : EDITOR_MODE_OFF
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

/**
 * ⭐ THE DIALOG'S `apply` SEAM, BOUND (judgment 146c, carried here by judgment 264).
 *
 * EM-D0e's `CardEditorDialog` takes `apply(edit) => Promise<result>` INJECTED with a `null`
 * default, and its contract is the four COORDINATES a component can honestly know:
 * `{ cardType, entityId, field, value }`. Turning those into the writer's `request` — the
 * op, the root key and the live save — is STORE work with no home until this member, so it
 * lives here beside the writer and EM-D1's shell wires the prop to this ONE export.
 *
 * ⛔ IT REACHES THE WRITER THROUGH THE ONE GENERIC ADAPTER, NEVER AROUND IT. The act travels
 * envelope -> executor -> the registered `plainEditApply` spec -> `context.actions`, which is
 * exactly the path EM-C4a's own A1 drives; this module registers NO second adapter and no
 * second spec, and a decree COMMAND is its own slot (EM-C4c) rather than a shape borrowed here.
 *
 * ⛔ THE RUNTIME ARRIVES BY A DYNAMIC IMPORT, which is the estate's own store-side idiom
 * (`settlementPendingEditActions.js` reaches `pendingEditCommitRuntime.js` the same way) and
 * is what keeps this leaf's STATIC import list at the six the walker pins: a static edge here
 * would hang the whole command registry off a leaf whose whole price is that first paint
 * never pulls it.
 *
 * ⛔ IT WIDENS NO VOCABULARY. The writer's refusal travels back VERBATIM through
 * `plainEditFacadeResult`, so every refusal this seam can report for a reached edit is a
 * member of `PLAIN_EDIT_REFUSALS`; the one refusal made HERE is `no_save`, for the store that
 * owns no edit scope at all and can therefore name no owner on an envelope.
 *
 * @param {Function} get @param {Function} set
 * @param {{cardType: string, entityId: string, field: string, value: unknown}} intent
 * @returns {Promise<{ok: true, saveId: string, keys: string[], layer: object}
 *                  |{ok: false, reason: string}>} NEITHER branch throws.
 */
export async function applyPlainEditIntent(get, set, intent) {
  const coords = rootKeyFor(
    String(intent?.cardType ?? ''),
    String(intent?.entityId ?? ''),
    String(intent?.field ?? ''),
  );
  const value = intent?.value;
  const [runtime, intents] = await Promise.all([
    import('../application/commands/plainEditRuntime.js'),
    import('../domain/pendingEditIntents.js'),
  ]);
  // The save/draft namespace that owns pending work, read from the estate's ONE home for it
  // (`pendingEditOwnerScope`) rather than re-spelled here, so this seam and the pending-edit
  // commit seam address the same owner for the same save.
  const ownerScope = () => intents.pendingEditOwnerScope(get()).ownerKey;
  const liveSaveId = () => String(get().activeSaveId ?? '');
  const ownerKey = ownerScope();
  if (!ownerKey) return refuse('no_save');
  return runtime.runPlainEditCommand(
    {
      ownerKey,
      saveId: liveSaveId(),
      rootKey: coords.key,
      op: makeOp(
        'set-field',
        { kind: coords.cardType, id: coords.entityId },
        { field: coords.field, value },
      ),
      value,
    },
    {
      journalScope: get,
      readContext: () => ({ ownerKey: ownerScope(), saveId: liveSaveId() }),
      applyPlainEdit: (request) => applyPlainEditToDraft(get, set, request),
    },
  );
}

/* ── EM-C4b · THE REGISTRY HALF ─────────────────────────────────────────────── */

/** The shared frozen empty registry. A READ never materializes the key: EM-B3a's case
 *  A2 is that a world which was never edited carries neither editor key at any hop. */
const NO_DECREES = Object.freeze([]);

/**
 * The registry as it stands on the live record. Own-property only, never a throw and
 * never a write; a value that is not an array reads as the shared empty one, because a
 * malformed legacy value is CARRIED INERT on the record and repaired by nobody.
 * @param {object} state @returns {readonly object[]}
 */
export function selectDecrees(state) {
  const rows = state?.settlement?.decrees;
  return Array.isArray(rows) ? rows : NO_DECREES;
}

/**
 * ⛔ THE REGISTRY'S ONE STORE WRITE SITE. Every action below is this function with a
 * different PURE verb, BOUND BY THE CALLER and never resolved from a string: a table
 * keyed by verb name would be a computed dispatch at one remove, and
 * `tests/store/deadOperationRatchet.test.js`'s premise arm exists to keep every dispatch
 * a scanner can see. The verbs are EM-C1's and they are TOTAL — none throws, each returns
 * a NEW frozen array, and a refused amendment returns the rows unchanged — so this site
 * has no second refusal to make about them.
 *
 * ⛔ NO CANON GATE, AND THAT IS DESIGN LAW RATHER THAN AN OMISSION. Design 2.6: a
 * CANONIZED settlement turns every edit into an EVENT applied at the next advance, and
 * the registry is where that event waits. `canon_locked` therefore belongs to the
 * plain-edit writer above and to nothing here. The one precondition is the ACTIVE SAVE,
 * for the same data-safety reason step 1 gives there: the write indexes `get().settlement`.
 *
 * @param {Function} get @param {Function} set @param {unknown} saveId
 * @param {(rows: readonly object[]) => readonly object[]} produce EM-C1's verb, bound
 * @returns {{ok: true, saveId: string, decrees: readonly object[]}
 *          |{ok: false, reason: string}} NEITHER branch throws; on `ok:false` the store
 *   is unchanged and no argument is mutated.
 */
function commitRegistry(get, set, saveId, produce) {
  const id = String(saveId ?? '');
  if (!id || id !== String(get().activeSaveId ?? '')) return refuse('no_save');
  const decrees = produce(selectDecrees(get()));
  set((state) => { state.settlement.decrees = decrees; });
  return { ok: /** @type {true} */ (true), saveId: id, decrees };
}

/** @param {Function} get @param {Function} set @param {object} request */
export const stageDecree = (get, set, request) =>
  commitRegistry(get, set, request?.saveId, (rows) => stage(rows, request?.op, request?.meta));
/** @param {Function} get @param {Function} set @param {object} request */
export const reorderDecree = (get, set, request) =>
  commitRegistry(get, set, request?.saveId, (rows) => reorder(rows, request?.entryId, request?.toIndex));
/** @param {Function} get @param {Function} set @param {object} request */
export const withdrawDecree = (get, set, request) =>
  commitRegistry(get, set, request?.saveId, (rows) => withdraw(rows, request?.entryId, request?.reason));
/** @param {Function} get @param {Function} set @param {object} request */
export const reopenDecree = (get, set, request) =>
  commitRegistry(get, set, request?.saveId, (rows) => reopen(rows, request?.entryId, request?.op));
/** @param {Function} get @param {Function} set @param {object} request */
export const markDecreeApplied = (get, set, request) =>
  commitRegistry(get, set, request?.saveId, (rows) => markApplied(rows, request?.entryId, request?.meta));
/**
 * The rewind's registry half (design 12.1). `restored` is the snapshot's registry and the
 * LIVE rows are the later-staged ones, so a restored entry wins on a shared id and every
 * decree staged after the tick is re-appended in its own order.
 * @param {Function} get @param {Function} set @param {object} request
 */
export const revertDecreesOfTick = (get, set, request) =>
  commitRegistry(get, set, request?.saveId, (rows) => revertTick(request?.restored, rows));

/**
 * ⭐ THE DECLARATION: EM-C1's verb name -> the store action that dispatches it. EXPORTED
 * so the battery pins it SET-EQUAL IN BOTH DIRECTIONS against the registry module's own
 * exported verbs, exactly as EM-C4a pins CASCADE_WRITERS against CASCADE_DISPATCH: a verb
 * added to one and not the other cannot ship. It is a DECLARATION and never a dispatcher
 * — nothing reads a name out of it at run time.
 */
export const DECREE_ACTIONS = Object.freeze({
  markApplied: markDecreeApplied,
  reopen: reopenDecree,
  reorder: reorderDecree,
  revertTick: revertDecreesOfTick,
  stage: stageDecree,
  withdraw: withdrawDecree,
});

/** @type {?{registry: unknown, record: unknown, ruleSet: unknown, value: unknown}} */
let _guardsMemo = null;

/**
 * ⭐ THE MEMOIZED GUARD READ (the architecture's store row: memoized over `decrees` and
 * the record).
 *
 * ⛔ THE RULE SET IS AN ARGUMENT AND THIS MODULE IMPORTS NO RULE. EM-C2's shared clause
 * item 10 rules the two generator writers INJECTED by the engine's CALLER from outside
 * `src/domain/**`; `src/store` composes neither and reaches `src/generators` nowhere, so
 * `makeGuardRuleSet(deps)` is the caller's act and its first caller is the registry page.
 * With no rule set the engine gives EMPTY_RULE_SET's honest answer: no guard, and nothing
 * left unevaluated.
 *
 * ⛔ THE KEY IS IDENTITY ON THREE HANDLES. `ruleSet` joins the registry and the record
 * because a different rule set is a different question about the same world, and a memo
 * that ignored it would answer the previous one. The cache holds ONE entry and is a pure
 * function of its key, so it is a cache and never a second state.
 *
 * @param {object} state @param {object} [ruleSet]
 * @returns {{guards: readonly object[], unevaluated: readonly string[]}}
 */
export function selectGuards(state, ruleSet = EMPTY_RULE_SET) {
  const registry = selectDecrees(state);
  const record = state?.settlement ?? null;
  if (_guardsMemo !== null
    && _guardsMemo.registry === registry
    && _guardsMemo.record === record
    && _guardsMemo.ruleSet === ruleSet) {
    return /** @type {{guards: readonly object[], unevaluated: readonly string[]}} */ (
      _guardsMemo.value
    );
  }
  const value = evaluateGuards(registry, record, OP_TYPES, ruleSet);
  _guardsMemo = { registry, record, ruleSet, value };
  return value;
}

/* ── EM-E8 (A) · THE ROSTER ADD-DECREE BINDER ──────────────────────────────── */

/**
 * ⭐ THE CARD TABLE OF THE THREE HOME ROSTER OPS. `<cardType>` -> the catalogue's op type,
 * frozen, in codepoint order. It is a DECLARATION and never a dispatcher: the row is read by
 * an `Object.hasOwn` key lookup and the op type reaches `makeOp` as a VALUE, so no computed
 * dispatch off the store handle is minted and `tests/store/deadOperationRatchet.test.js`'s
 * premise arm is untouched.
 *
 * ⛔ THE THREE WORDS LIVE HERE AND IN THE CATALOGUE, AND NOWHERE ELSE IN THE STORE. Case
 * A4 pins this table SET-EQUAL IN BOTH DIRECTIONS against the live catalogue's `add-` rows,
 * exactly as CASCADE_WRITERS is pinned against CASCADE_DISPATCH, so a fourth add-op cannot
 * ship half-bound and a retired one cannot leave a dead row here.
 */
export const ADD_OP_TYPES = Object.freeze({
  faction: 'add-faction', institution: 'add-institution', npc: 'add-npc',
});

/**
 * The identity class `mintDmId` mints a NEWCOMER under (`dm:minted:<hash16>`). The layer's
 * own `DM_ID_KINDS` is module-private by design, so this is the argument's value and not a
 * second vocabulary: case A3 asserts the minted id lands inside the layer's exported
 * namespace and inside `minted`, which is the only claim this word makes.
 */
const DM_MINT_KIND = 'minted';

/**
 * The closed refusal set of THIS door, EXPORTED so a test asserts it in both directions
 * rather than re-typing it. SIX, frozen, in codepoint order, and every one reachable.
 *
 * ⛔ IT WIDENS NO OTHER VOCABULARY. `PLAIN_EDIT_REFUSALS` belongs to the plain-edit writer
 * and is untouched; a CATALOGUE refusal is never re-worded here but travels VERBATIM in the
 * result's `errors` — `validateOp`'s own frozen sorted array under `invalid_op`, and EM-C1's
 * own `{ missing, was }` pair under `stale_vocabulary`.
 * @type {readonly string[]}
 */
export const ADD_DECREE_REFUSALS = Object.freeze([
  'invalid_op', 'no_save', 'no_seed', 'not_staged', 'stale_vocabulary', 'unknown_target',
]);

/** One shared frozen empty list, returned BY IDENTITY for every card with no add-op. */
const NO_PAYLOAD_FIELDS = /** @type {readonly object[]} */ (Object.freeze([]));

/** One shared frozen empty list for a refusal that names no catalogue word. */
const NO_ERRORS = /** @type {readonly string[]} */ (Object.freeze([]));

/** Codepoint order, spelled locally so this leaf's import list stays the six A5 pins. */
const byCodepoint = (/** @type {string} */ a, /** @type {string} */ b) => (a < b ? -1 : (a > b ? 1 : 0));

/** @param {unknown} value @returns {value is Record<string, unknown>} a plain, non-array object */
const isPlainObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * @param {string} reason a member of ADD_DECREE_REFUSALS
 * @param {readonly string[]} [errors] the CATALOGUE's own words, verbatim
 * @returns {{ok: false, reason: string, errors: readonly string[]}}
 */
const refuseAdd = (reason, errors = NO_ERRORS) => ({ ok: /** @type {false} */ (false), reason, errors });

/** @param {unknown} cardType @returns {string|null} the catalogue's op type, or nothing */
function addOpTypeFor(cardType) {
  const card = String(cardType ?? '');
  return Object.hasOwn(ADD_OP_TYPES, card) ? ADD_OP_TYPES[card] : null;
}

/**
 * ⭐ THE READ SHAPE THE DOOR RENDERS **CREATE** MODE FROM, so no component ever imports the
 * op catalogue (A6 pins its importer roster EXACT at this one module, in both directions).
 *
 * Each row is the catalogue's own payload spec, flattened and frozen: `field`, `kind`,
 * `required`, plus `pool` ONLY when the spec names one and `values` ONLY when it declares
 * them — ABSENCE IS A FACT here exactly as it is on a declaration row.
 *
 * ⛔ THE `pool` NAME IS THE CALLER'S CONTRACT. `stageAddDecreeIntent` resolves every pooled
 * value against the pool catalogue the caller HANDS IN, so a door that renders a field from
 * this row must serve the same pool under the same name.
 *
 * @param {unknown} cardType
 * @returns {readonly object[]} codepoint order by `field`; the SHARED frozen empty array by
 *   identity for a card with no add-op, never null and never a throw.
 */
export function addOpPayloadFor(cardType) {
  const type = addOpTypeFor(cardType);
  if (type === null) return NO_PAYLOAD_FIELDS;
  const specs = /** @type {Record<string, {kind: string, pool?: string, values?: readonly string[], required: boolean}>} */ (
    OP_TYPES[type].payload
  );
  return Object.freeze(Object.keys(specs).sort(byCodepoint).map((field) => {
    const spec = specs[field];
    /** @type {Record<string, unknown>} */
    const row = { field, kind: spec.kind, required: spec.required === true };
    if (typeof spec.pool === 'string') row.pool = spec.pool;
    if (Array.isArray(spec.values)) row.values = Object.freeze([...spec.values]);
    return Object.freeze(row);
  }));
}

/**
 * The layer's `minted` sub-object as it stands on a record, own-property only and never a
 * write. A malformed value reads as EMPTY, which claims no id at all.
 * @param {unknown} layer @returns {Record<string, unknown>}
 */
function mintedRowsOf(layer) {
  const rows = isPlainObject(layer) ? layer.minted : undefined;
  return isPlainObject(rows) ? rows : {};
}

/**
 * ⭐ THE ID IS STABLE AND UNIQUE, AND BOTH HALVES ARE MEASURED RATHER THAN HOPED.
 *
 * STABLE because `mintDmId` is a pure hash of `(seed, kind, n)` — the same save in the same
 * state mints the same id forever. UNIQUE because `n` starts at the count of ids this save
 * has ALREADY CLAIMED and then walks past any that are taken.
 *
 * ⛔ THE CLAIM SET IS THE LAYER **AND** THE REGISTRY, which is the whole reason the walk
 * exists. The layer's `minted` rows are written at the TICK, so two newcomers staged before
 * any advance would both read a layer count of zero and collide on one id; the pending
 * entries are therefore claims too. A claim is an add-op entry's own `target.id`.
 *
 * @param {string} seed @param {unknown} layer @param {readonly object[]} decrees
 * @returns {string} an id no row of either home holds
 */
function mintNewcomerId(seed, layer, decrees) {
  /** @type {Set<string>} */
  const claimed = new Set(Object.keys(mintedRowsOf(layer)));
  for (const row of decrees) {
    const op = /** @type {{type?: unknown, target?: unknown}} */ (isPlainObject(row) ? row.op : null);
    const target = isPlainObject(op) ? /** @type {{id?: unknown}} */ (op.target) : null;
    // WIDENED to `readonly unknown[]` at the membership test, never the value NARROWED: a row
    // arriving with any other op type must read as "not an add-op", which is what `includes`
    // answers — the same shape `validateOp` takes for its own declared vocabularies.
    const bound = /** @type {readonly unknown[]} */ (Object.values(ADD_OP_TYPES));
    const claims = bound.includes(op?.type)
      && isPlainObject(target) && typeof target.id === 'string';
    if (claims) claimed.add(String(/** @type {{id: string}} */ (target).id));
  }
  let index = claimed.size;
  let id = mintDmId(seed, DM_MINT_KIND, index);
  // Bounded by construction: `claimed` is finite and every step tries a fresh index.
  while (claimed.has(id)) {
    index += 1;
    id = mintDmId(seed, DM_MINT_KIND, index);
  }
  return id;
}

/**
 * ⭐ THE BINDER FROM A CREATE INTENT TO AN `add-<card>` DECREE (EM-E8 A; design §12's ops,
 * §2.5's registry, §22.3 ruling 9's newcomer).
 *
 * The four coordinates a CREATE door can honestly know are the card type and the values the
 * DM typed; turning those into a NEWCOMER'S STABLE ID, the catalogue's op and a registry
 * entry is STORE work with no home until this member, so it lives here beside the plain-edit
 * binder and reaches the registry through EM-C4b's ONE write site.
 *
 * ⛔ IT ADDS NO IMPORT EDGE AND NO OP TYPE. `mintDmId` and `resolveDecree` ride specifiers
 * this module already holds (A5 pins the list EXACT at six), `operations.js` is byte-untouched
 * and the three op types are the catalogue's own.
 *
 * ⛔ IT MAKES NO POOL RULE OF ITS OWN. Pool membership is judged by EM-C1's `resolveDecree`
 * against the catalogue the CALLER hands in — the same verb design §20.3 resolves a stale
 * entry with — so this door and the tick's own resolution can never disagree, and the refusal
 * carries EM-C1's two words rather than a third spelling of them. A caller that serves no
 * pool for a pooled field is REFUSED, not waved through: an unverifiable pooled value is
 * exactly what FINITE-SEMANTICS exists to keep off the record.
 *
 * ⛔ IT LIFTS NO GATE. `canEditSettlement()` is untouched and no canon rule is made here:
 * design §2.6 puts a pooled act in the REGISTRY on canon, and the registry is where this
 * lands it on every phase.
 *
 * @param {Function} get @param {Function} set
 * @param {{cardType: string, values: object, pools: object, orderedAt?: string, when?: object}} request
 *   `pools` is the live pool catalogue, `<pool name> -> readonly values`; `orderedAt` is the
 *   caller's stamp (HZ-STAMP) and an absent one is read from the clock HERE, in the command
 *   that writes it.
 * @returns {{ok: true, saveId: string, decreeId: string, op: object, decrees: readonly object[]}
 *          |{ok: false, reason: string, errors: readonly string[]}} NEITHER branch throws; on
 *   `ok:false` the store is unchanged and no argument is mutated.
 */
export function stageAddDecreeIntent(get, set, request) {
  // 1. THE CARD, against BOTH tables. A card with no add-op and a card EM-A1 declares
  //    nothing for are the same refusal, because neither can name a newcomer's fields.
  const cardType = String(request?.cardType ?? '');
  const type = addOpTypeFor(cardType);
  if (type === null || !isEditableCard(cardType)) return refuseAdd('unknown_target');

  // 2. THE ACTIVE SAVE, for the same data-safety reason the plain-edit writer gives: the
  //    registry write indexes `get().settlement`.
  const saveId = String(get().activeSaveId ?? '');
  if (!saveId || saveId !== String(get().activeSaveId ?? '')) return refuseAdd('no_save');

  // 3. THE SEED, which is what makes the id STABLE rather than merely unique. A save with no
  //    stored seed can mint no reproducible identity, and inventing one is the defect
  //    §22.4's identity table refuses.
  const record = get().settlement;
  const seed = typeof (/** @type {{_seed?: unknown}} */ (record)?._seed) === 'string'
    ? String(/** @type {{_seed: string}} */ (record)._seed)
    : '';
  if (!seed) return refuseAdd('no_seed');

  const decrees = selectDecrees(get());
  const id = mintNewcomerId(seed, /** @type {{dmLayer?: unknown}} */ (record)?.dmLayer, decrees);

  // 4. THE OP, built by the catalogue's own constructor from the values VERBATIM — every key
  //    the DM sent, so an UNDECLARED one is answered by `validateOp` in the catalogue's own
  //    words rather than silently dropped here.
  const op = makeOp(type, { kind: cardType, id }, isPlainObject(request?.values) ? request.values : {});
  if (op === null) return refuseAdd('invalid_op');
  const verdict = validateOp(op, null);
  if (verdict.ok === false) return refuseAdd('invalid_op', verdict.errors);

  // 5. THE VOCABULARY, through EM-C1's own resolver against the caller's catalogue.
  const resolution = /** @type {{ok: boolean, missing?: string, was?: string}} */ (
    resolveDecree({ id, op }, { opTypes: OP_TYPES, pools: request?.pools })
  );
  if (resolution.ok === false) {
    return refuseAdd('stale_vocabulary', Object.freeze([String(resolution.missing), String(resolution.was)]));
  }

  // 6. THE ID IS THE ENTRY'S TOO, and that is one act with one name rather than two
  //    namespaces for one newcomer: the entry the DM ordered and the row the tick will mint
  //    name the same person, which is what makes the tick's apply idempotent without a
  //    second join. A registry that already holds this id is a refusal and NOTHING IS
  //    STAGED — `stage` would return the rows unchanged and this door would have written an
  //    equal registry for no act.
  if (decrees.some((row) => String(/** @type {{id?: unknown}} */ (row)?.id ?? '') === id)) {
    return refuseAdd('not_staged');
  }

  const committed = stageDecree(get, set, {
    saveId,
    op,
    meta: {
      id,
      orderedAt: typeof request?.orderedAt === 'string' && request.orderedAt.length > 0
        ? request.orderedAt
        : new Date().toISOString(),
      addedBy: 'dm',
      ...(isPlainObject(request?.when) ? { when: request.when } : {}),
    },
  });
  if (committed.ok === false) return refuseAdd(committed.reason);
  return {
    ok: /** @type {true} */ (true),
    saveId,
    decreeId: id,
    op,
    decrees: committed.decrees,
  };
}
