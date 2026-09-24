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
 *
 * ⭐ EM-F3d ADDS THE DELETE'S SCRUB at the very foot: `scrubDeletedCounterparty`, which the
 * store's delete chokepoint reaches by a DYNAMIC import so this leaf stays out of every eager
 * closure. It withdraws — through EM-C1's own typed verb — every PENDING entry whose off-stage
 * op named the row the DM just deleted, on the open save and on every member save, and leaves
 * applied history alone.
 *
 * ⭐ EM-C4c ADDS THE GUARD OFFERS' WRITER at the foot: `takeGuardOffer`, one door from an
 * offer EM-C2's engine minted to the act its name means — fulfil STAGES the guard's own op
 * before the entry it serves, proceed and keep-both RECORD the override on the entry through
 * EM-C1's eighth verb, and the two clash offers WITHDRAW the right one of the pair. It mints
 * no op type, no id policy and no vocabulary: every word it reads is `GUARD_OFFERS`',
 * `DECREE_AUTHORS`' or the catalogue's own.
 */

import { isCanonSave, savePhase } from '../domain/campaign/canon.js';
import { applyEdit, mintDmId } from '../domain/edit/dmLayer.js';
import { declarationsFor, isEditableCard } from '../domain/edit/fieldDeclarations.js';
import { EMPTY_RULE_SET, evaluateGuards, GUARD_OFFERS } from '../domain/edit/guards.js';
import { makeOp, OP_CONSEQUENCE_POLICIES, OP_TYPES, validateOp } from '../domain/edit/operations.js';
import {
  DECREE_AUTHORS, markApplied, recordOverride, reopen, reorder, RESOLUTION_MISSING_KINDS,
  resolveDecree, revertTick, stage, withdraw, WITHDRAWN_REASON_KINDS,
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
 * EM-C4c's override half of design 2.7's "proceed": the guard's own id is recorded on the
 * entry through the SAME one write site, so the DM's word and the guard's finding live in
 * one place and EM-C2 reads `overrode` to mark the finding rather than to drop it.
 * @param {Function} get @param {Function} set @param {object} request
 */
export const recordDecreeOverride = (get, set, request) =>
  commitRegistry(get, set, request?.saveId, (rows) => recordOverride(rows, request?.entryId, request?.guardId));

/**
 * ⭐ THE DECLARATION: EM-C1's verb name -> the store action that dispatches it. EXPORTED
 * so the battery pins it SET-EQUAL IN BOTH DIRECTIONS against the registry module's own
 * exported verbs, exactly as EM-C4a pins CASCADE_WRITERS against CASCADE_DISPATCH: a verb
 * added to one and not the other cannot ship. It is a DECLARATION and never a dispatcher
 * — nothing reads a name out of it at run time.
 */
export const DECREE_ACTIONS = Object.freeze({
  markApplied: markDecreeApplied,
  recordOverride: recordDecreeOverride,
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
/**
 * ⭐ THE WALK ITSELF, ONE HOME, TWO CLAIM SETS (EM-E4d unit 1). The two doors below claim
 * DIFFERENT things — a newcomer's id is the add-op's own target, a seal decree's id is an
 * ENTRY id and names nobody — so each builds its own set and both walk it the same way. The
 * add door's set is byte-identical to what it always was, so no minted identity moves.
 * @param {string} seed @param {ReadonlySet<string>} claimed
 * @returns {string} an id the set does not hold
 */
function mintClaimedId(seed, claimed) {
  let index = claimed.size;
  let id = mintDmId(seed, DM_MINT_KIND, index);
  // Bounded by construction: `claimed` is finite and every step tries a fresh index.
  while (claimed.has(id)) {
    index += 1;
    id = mintDmId(seed, DM_MINT_KIND, index);
  }
  return id;
}

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
  return mintClaimedId(seed, claimed);
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
 * @param {{cardType: string, values: object, pools: object, orderedAt?: string, when?: object,
 *   addedBy?: string}} request
 *   `pools` is the live pool catalogue, `<pool name> -> readonly values`; `orderedAt` is the
 *   caller's stamp (HZ-STAMP) and an absent one is read from the clock HERE, in the command
 *   that writes it; `addedBy` is a `DECREE_AUTHORS` member and an absent one reads `dm`.
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

  // 7. WHO STAGED IT. Absent it is the DM's own act, which is every caller but one: EM-C4c's
  //    `fulfil` offer stages through THIS binder and marks the entry the GUARD's, which is
  //    design 2.7's own words ("a visible, seeded, editable entry marked as added by the
  //    guard") and the first writer of `DECREE_AUTHORS`' second member. The word is READ FROM
  //    THE PRODUCER, never spelled here, and an author outside that closed vocabulary is
  //    refused rather than handed to `stage`, which would return the rows unchanged and leave
  //    this door reporting a decree id nothing holds.
  const authors = /** @type {readonly unknown[]} */ (DECREE_AUTHORS);
  const addedBy = request?.addedBy === undefined ? DECREE_AUTHORS[0] : request.addedBy;
  if (!authors.includes(addedBy)) return refuseAdd('not_staged');

  const committed = stageDecree(get, set, {
    saveId,
    op,
    meta: {
      id,
      orderedAt: typeof request?.orderedAt === 'string' && request.orderedAt.length > 0
        ? request.orderedAt
        : new Date().toISOString(),
      addedBy,
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

/* ── EM-E8 (C) · THE TICK'S HALF ───────────────────────────────────────────── */

/** EM-C1's applied status, spelled here so this leaf's import list stays the six A5 pins. */
const DECREE_APPLIED = 'applied';

/** One shared frozen empty list of ROWS, as NO_ERRORS is one of words. */
const NO_ROWS = /** @type {readonly object[]} */ (Object.freeze([]));

/** One shared frozen receipt for a tick that minted nobody, so a dormant advance allocates
 *  nothing and two dormant ticks compare alike. */
const NOTHING_MINTED = Object.freeze({
  ok: /** @type {true} */ (true), saveId: '', minted: NO_ERRORS, rederived: false, unapplied: NO_ROWS,
});

/**
 * One registry entry's add-op target id, or the empty string for anything that is not an
 * APPLIED roster add-decree. Own-property reads only; never a throw.
 * @param {unknown} row @returns {string}
 */
function appliedNewcomerIdOf(row) {
  if (!isPlainObject(row) || /** @type {{status?: unknown}} */ (row).status !== DECREE_APPLIED) return '';
  const op = isPlainObject(row.op) ? /** @type {{type?: unknown, target?: unknown}} */ (row.op) : null;
  const bound = /** @type {readonly unknown[]} */ (Object.values(ADD_OP_TYPES));
  if (op === null || !bound.includes(op.type) || !isPlainObject(op.target)) return '';
  const id = /** @type {{id?: unknown}} */ (op.target).id;
  return typeof id === 'string' ? id : '';
}

/**
 * ⛔ CARRY FORWARD EVERY OWN KEY A RE-DERIVATION CANNOT PRODUCE — the SAVED-ONLY class of
 * EM-R0a's record register, and the data-loss defect this member would otherwise be.
 *
 * A re-derivation is a FULL GENERATION of the same world, so every GENERATED key is present on
 * its output and the only own keys missing are the six nothing in generation writes
 * (`neighbourNetwork`, `interSettlementRelationships`, `crossSettlementConflicts`,
 * `populationHistory`, `dmLayer`, `decrees`). The rule is therefore STRUCTURAL rather than a
 * name list: a key the live record holds and the derived one does not survives. That is total
 * by construction — a seventh saved-only key added later is carried with no edit here — and it
 * needs no import, which is what keeps A5's six specifiers exact.
 *
 * @param {object} live the record being replaced @param {object} derived the re-derivation
 * @returns {object} `derived`, MUTATED — it is this function's own fresh allocation
 */
function carryForward(live, derived) {
  for (const key of Object.keys(live)) {
    if (!Object.hasOwn(derived, key)) {
      /** @type {Record<string, unknown>} */ (derived)[key] = /** @type {Record<string, unknown>} */ (live)[key];
    }
  }
  return derived;
}

/**
 * ⭐ EM-E8b B (U49): ONE MEMBER SAVE'S OWN RECORD, for a save that is not the hydrated one.
 * Design §2.5 puts `decrees` on the SAVED SETTLEMENT, so a campaign's tick is N registries and
 * the roster binder is owed to every one of them — not only to the save the DM has open.
 * Own-property reads only; a row with no record reads as nothing at all, never a throw.
 * @param {object} state @param {string} saveId @returns {object|null}
 */
function memberRecordOf(state, saveId) {
  const row = (state?.savedSettlements || [])
    .find((entry) => String(/** @type {{id?: unknown}} */ (entry)?.id ?? '') === saveId);
  const record = isPlainObject(row) ? row.settlement : undefined;
  return isPlainObject(record) ? record : null;
}

/**
 * The registry on ANY record — `selectDecrees`' own reading, one record wider, so the open
 * save and a member save are read by ONE rule. A value that is not an array reads as the
 * SHARED empty one, because a malformed legacy value is carried inert and repaired by nobody.
 * @param {unknown} record @returns {readonly object[]}
 */
function recordDecrees(record) {
  const rows = isPlainObject(record) ? record.decrees : undefined;
  return Array.isArray(rows) ? rows : NO_DECREES;
}

/**
 * The generation config a save stored, read where the estate's own bridge reads it
 * (`campaignContentBindingSession.js:47`): the library row's `config` first, the record's own
 * `_config` second, an empty bag last.
 *
 * ⛔ THE EMBEDDED FALLBACK IS THE **NAMED RECORD'S** OWN (EM-E8b B): for the open save that is
 * `get().settlement`, byte-identically to before, and for any other member it is that member's
 * record — reading the hydrated view's `_config` while re-deriving a different save would build
 * save Y's world from save X's configuration.
 *
 * @param {object} state @param {string} saveId @param {unknown} record the save's own record
 * @returns {object}
 */
function storedConfigFor(state, saveId, record) {
  const row = (state?.savedSettlements || [])
    .find((entry) => String(/** @type {{id?: unknown}} */ (entry)?.id ?? '') === saveId);
  const stored = isPlainObject(row) ? row.config : undefined;
  if (isPlainObject(stored)) return stored;
  const embedded = /** @type {{_config?: unknown}} */ (record)?._config;
  return isPlainObject(embedded) ? embedded : {};
}

/**
 * ⭐ THE TICK'S HALF OF THE ROSTER OPS (EM-E8 C; design §2.6's head of the tick, §14's
 * regeneration from the layer).
 *
 * EM-E1's hook marks a due decree APPLIED and produces its cause; "the world effect of each op
 * belongs to the members that bind the verbs", and this is the ROSTER family's binder. Every
 * APPLIED add-decree whose newcomer the layer does not already hold is applied to the layer
 * through the ONE writer, and the world is then re-derived ONCE through EM-B2a4's scoped seam —
 * one re-derivation per tick, never one per decree — so the newcomer exists on the record.
 *
 * ⛔ ANY MEMBER SAVE OF THE CAMPAIGN, NOT ONLY THE OPEN ONE (EM-E8b B, U49). MEASURED at
 * EM-E8's tip: a two-save campaign whose NON-ACTIVE member carried a due add-decree in ITS
 * registry came out of the tick with that registry `applied` and its roster holding NOBODY —
 * EM-E1's hook is N registries wide (design §2.5: `decrees` is a key on the SAVED SETTLEMENT)
 * and this binder was one save wide. So the OPEN save is read and written through the live
 * view, any other member through its own library row, and the run refuses to write if the save
 * it started on is no longer the save it would land on.
 *
 * ⛔ DORMANT BY REFERENCE. A save with no applied add-decree reads its registry, finds nothing
 * due, and returns ONE shared frozen receipt without touching the store, reaching the lane or
 * allocating anything: a world that carries no decree comes out of this exactly as it went in.
 *
 * ⛔ IT IS IDEMPOTENT, AND THAT IS THE WHOLE POINT OF KEYING ON THE LAYER RATHER THAN ON THE
 * TICK. An applied entry is history and is read at every later tick; the layer's `minted` rows
 * are the record of who already exists, so a second tick finds nothing due and mints nobody.
 *
 * ⛔ IT VOICES NOTHING. The chronicle cause is EM-E1's and EM-E2's; this member writes no
 * chronicle line, no news entry and no receipt beyond its own return value.
 *
 * ⛔ IT WRITES THE ACTIVE VIEW **AND THE LIBRARY ROW OF THE SAME SAVE** (EM-E8b A, U48), and
 * still persists nothing of its own. MEASURED at EM-E8's tip over the real advance in local
 * mode: the durable save came back carrying the decree as `applied` and NOBODY on the roster —
 * the record said the table's order had been carried out and the saved world held no such
 * person. Writing only the view left the row behind, and the row is what the advance's own
 * outbox reads (`applyWorldPulseResultToState` composes its `persistUpdates` from
 * `state.savedSettlements`). So the row moves HERE, in the same one write, and the DURABLE
 * half is the advance's — `withMintedRosterState` in `campaignAdvanceSession.js` folds this
 * record into the outbox payload that flush already carries, so the tick is ONE op per save
 * and this module still opens no persistence path of its own.
 *
 * ⛔ ONE `set`, AND BOTH HOMES MOVE IN IT OR NEITHER DOES. The layer is the INPUT and the
 * record is the OUTPUT (design §14), so a write that landed one without the other would be the
 * exact split design §12's finding 5 refuses — and it would be PERMANENT, because the next tick
 * reads the layer to decide who already exists and would mint nobody. A lane that cannot load
 * or a run that throws therefore writes NOTHING and reports `minted: []`; the id is a pure
 * function of the decree, so the next tick mints the SAME person and the member converges.
 *
 * @param {Function} get @param {Function} set
 * @param {{saveId: string}} request
 * @returns {Promise<{ok: true, saveId: string, minted: readonly string[], rederived: boolean,
 *                    unapplied: readonly object[]}
 *                  |{ok: false, reason: string, errors: readonly string[]}>} NEITHER branch
 *   throws.
 */
export async function applyRosterDecreesAtTick(get, set, request) {
  const saveId = String(request?.saveId ?? '');
  if (!saveId) return refuseAdd('no_save');
  // EM-E8b B (U49): the OPEN save is read through the live view — the hydrated record is the
  // authority for the save the DM has in front of them — and any OTHER member of the campaign
  // through its own library row. The save this run started on must still be that save when it
  // writes (`stillOurs` below), which is the same data-safety refusal the active-only guard
  // was: re-deriving save X's world onto save Y is the defect, not the save being unopened.
  const isActive = saveId === String(get().activeSaveId ?? '');
  const record = isActive ? get().settlement : memberRecordOf(get(), saveId);
  if (!isPlainObject(record)) return refuseAdd('no_save');
  const stillOurs = () => (isActive
    ? saveId === String(get().activeSaveId ?? '')
    : memberRecordOf(get(), saveId) === record);

  const held = mintedRowsOf(/** @type {{dmLayer?: unknown}} */ (record)?.dmLayer);
  // Codepoint order on the newcomer's id, so two ticks over one registry mint in one order.
  const due = recordDecrees(record)
    .map((row) => ({ row, id: appliedNewcomerIdOf(row) }))
    .filter((entry) => entry.id !== '' && !Object.hasOwn(held, entry.id))
    .sort((a, b) => byCodepoint(a.id, b.id));
  if (due.length === 0) return NOTHING_MINTED;

  /** @type {unknown} */
  let layer = /** @type {{dmLayer?: unknown}} */ (record)?.dmLayer;
  /** @type {string[]} */
  const minted = [];
  for (const entry of due) {
    const applied = applyEdit(layer, /** @type {{op: object}} */ (entry.row).op, DECLARATION_CONSULT);
    // A row the layer refuses is left unminted and the tick carries on: a decree the vocabulary
    // no longer resolves is EM-C1's withdrawal, not a half-written roster.
    if (applied.ok === false) continue;
    layer = applied.layer;
    minted.push(...applied.keys);
  }
  if (minted.length === 0) return NOTHING_MINTED;

  // ⭐ THE RE-DERIVATION SEAM, CONSULTED, AND THE LANE RUN — ONCE, for every newcomer this tick
  //    minted together. `calls: 1` is a SCOPE: one re-derivation per applied edit, which for a
  //    tick is one per tick.
  const seamIsScoped = REDERIVE_SEAM.kind === 'scoped' && REDERIVE_SEAM.calls === 1;
  const lane = seamIsScoped
    ? /** @type {{regenerateWithLayer?: Function}|null} */ (await reachRederiveLane())
    : null;
  // The lane load yielded. The save may have changed underneath, and re-deriving save X's
  // world onto save Y is the data-safety defect step 1 exists to prevent.
  if (typeof lane?.regenerateWithLayer !== 'function' || !stillOurs()) return NOTHING_MINTED;
  const live = isActive ? get().settlement : record;
  const out = await lane.regenerateWithLayer(
    live, storedConfigFor(get(), saveId, live), layer, DECLARATION_CONSULT,
  ).then(null, () => null);
  const derived = isPlainObject(out) ? /** @type {{record?: unknown}} */ (out).record : null;
  if (!isPlainObject(derived) || !stillOurs()) return NOTHING_MINTED;

  // ⛔ ONE WRITE, CARRYING BOTH HOMES. The derived record is a fresh full generation, so every
  //    key the live record holds and it does not is carried forward; the LAYER is this member's
  //    own write and is never carried from the pre-run record.
  const next = carryForward(/** @type {object} */ (live), /** @type {object} */ (derived));
  /** @type {Record<string, unknown>} */ (next).dmLayer = layer;
  set((state) => {
    // EM-E8b B (U49): the live view is the OPEN save's other home and nobody else's — writing
    // it for a member save the DM does not have hydrated would put save X's world on screen
    // under save Y's name.
    if (isActive) state.settlement = next;
    // EM-E8b A (U48): the SAME record onto the library row, inside the SAME write. The view
    // and the row are two homes for one save, and the advance's outbox reads the ROW — a
    // mint that moved only the view persisted nothing and left the durable save holding an
    // `applied` decree with nobody on the roster.
    const idx = (state.savedSettlements || [])
      .findIndex((row) => String(row?.id ?? '') === saveId);
    if (idx !== -1) {
      state.savedSettlements[idx] = { ...state.savedSettlements[idx], settlement: next };
    }
  });
  const reported = /** @type {{unapplied?: unknown}} */ (out).unapplied;
  return {
    ok: /** @type {true} */ (true),
    saveId,
    minted,
    rederived: true,
    unapplied: Array.isArray(reported) ? Object.freeze([...reported]) : NO_ROWS,
  };
}

/* ── EM-C4c · THE GUARD OFFERS' WRITER ─────────────────────────────────────── */

/** EM-C1's pending status, spelled here as EM-E8 spells `applied`, for the same reason. */
const DECREE_PENDING = 'pending';

/**
 * The refusal SHAPE both doors answer in, aliased so this member's refusals read in its own
 * vocabulary while the shape keeps one home. The two VOCABULARIES stay apart: a word of
 * `ADD_DECREE_REFUSALS` is never reported here except the ones E8's binder itself raises,
 * which travel back VERBATIM because the fulfil offer stages through that binder.
 */
const refuseOffer = refuseAdd;

/**
 * The closed refusal set of THIS door, EXPORTED so a test asserts it in both directions
 * rather than re-typing it. TEN, frozen, in codepoint order, and every one reachable.
 *
 * ⛔ IT WIDENS NO OTHER VOCABULARY. `GUARD_OFFERS` and `GUARD_KINDS` are EM-C2's and are
 * imported never re-spelled (the chair's judgment 236); a CATALOGUE refusal is not re-worded
 * here but travels verbatim in `errors` — `validateOp`'s own frozen sorted array under
 * `invalid_op`, and EM-C1's own `{ missing, was }` pair under `stale_vocabulary`.
 * @type {readonly string[]}
 */
export const GUARD_OFFER_REFUSALS = Object.freeze([
  'invalid_op', 'no_fulfil', 'no_save', 'no_writer', 'not_staged',
  'stale_vocabulary', 'unknown_entry', 'unknown_guard', 'unknown_offer', 'unknown_target',
]);

/**
 * @param {{saveId: string, offer: string, entry: Record<string, unknown>}} seat
 * @param {readonly object[]} decrees @param {string|null} decreeId
 * @returns {{ok: true, saveId: string, offer: string, entryId: string, decreeId: string|null,
 *            decrees: readonly object[]}}
 */
const offerReceipt = (seat, decrees, decreeId) => ({
  ok: /** @type {true} */ (true),
  saveId: seat.saveId,
  offer: seat.offer,
  entryId: String(seat.entry.id),
  decreeId,
  decrees,
});

/**
 * The inverse of `ADD_OP_TYPES`, READ OFF THE DECLARATION rather than re-spelled: the card
 * whose add-op this type is, or nothing. A type claimed by two cards is nothing, because a
 * fulfil that could mint two different newcomers is not one act.
 * @param {string} type @returns {string|null}
 */
function cardOfAddOp(type) {
  const claimed = Object.keys(ADD_OP_TYPES).filter((card) => ADD_OP_TYPES[card] === type);
  return claimed.length === 1 ? claimed[0] : null;
}

/** @param {Record<string, unknown>} request @returns {string} the caller's stamp, or this
 *  command's own clock read — HZ-STAMP: a clock is read where the write happens. */
const stampOf = (request) => (typeof request.orderedAt === 'string' && request.orderedAt.length > 0
  ? request.orderedAt
  : new Date().toISOString());

/**
 * The pending list EM-C1's `reorder` itself addresses: `orderIndex` ascending with a
 * codepoint tie-break on `id`. A move is a position in THAT list and in no other reading,
 * so a fulfil placed by any other order would land before the wrong entry.
 * @param {readonly object[]} rows @returns {string[]} the pending ids, in the DM's list order
 */
function pendingIdsOf(rows) {
  return rows
    .filter((row) => isPlainObject(row) && row.status === DECREE_PENDING)
    .map((row) => /** @type {{id: unknown, orderIndex?: unknown}} */ (row))
    .sort((a, b) => ((typeof a.orderIndex === 'number' ? a.orderIndex : 0)
      - (typeof b.orderIndex === 'number' ? b.orderIndex : 0))
      || byCodepoint(String(a.id), String(b.id)))
    .map((row) => String(row.id));
}

/**
 * ⭐ PROCEED, AND KEEP BOTH: the DM's word is RECORDED on the entry and the finding STANDS.
 * EM-C2 reads `overrode` and marks the guard `overridden` rather than suppressing it — "a
 * surface may hide a marked guard, and could never recover a suppressed one" — so proceeding
 * never loses the warning and never blocks the act. That is design 7 C's "proceed always
 * applies", written as a write.
 * @param {Function} get @param {Function} set
 * @param {{saveId: string, offer: string, guard: Record<string, unknown>,
 *   entry: Record<string, unknown>, request: Record<string, unknown>}} seat
 */
function overrideOffer(get, set, seat) {
  const committed = recordDecreeOverride(get, set, {
    saveId: seat.saveId, entryId: String(seat.entry.id), guardId: String(seat.guard.id),
  });
  if (committed.ok === false) return refuseOffer(committed.reason);
  return offerReceipt(seat, committed.decrees, null);
}

/**
 * One clash offer's withdrawal, through EM-C4b's landed action and EM-C1's own verb. The
 * entry is KEPT for the record with its order index (design 2.5a: application never deletes
 * an entry), and NO `withdrawnReason` is written — design 20.3 makes that absence mean the
 * DM withdrew it by hand, which a clash offer taken by the DM is.
 * @param {Function} get @param {Function} set
 * @param {{saveId: string, offer: string, guard: Record<string, unknown>,
 *   entry: Record<string, unknown>, request: Record<string, unknown>}} seat
 * @param {string} entryId
 */
function withdrawForOffer(get, set, seat, entryId) {
  const standing = selectDecrees(get())
    .find((row) => isPlainObject(row) && row.id === entryId && row.status === DECREE_PENDING);
  if (standing === undefined) return refuseOffer('unknown_entry');
  const committed = withdrawDecree(get, set, { saveId: seat.saveId, entryId });
  if (committed.ok === false) return refuseOffer(committed.reason);
  return offerReceipt(seat, committed.decrees, null);
}

/** KEEP THE FIRST: the earlier entry stands and the one the guard JUDGED is withdrawn. */
function keepFirstOffer(get, set, seat) {
  return withdrawForOffer(get, set, seat, String(seat.entry.id));
}

/** KEEP THE LAST: the entry the guard judged stands and the one it NAMES is withdrawn. A
 *  finding that names no related entry can keep no pair, and says so. */
function keepLastOffer(get, set, seat) {
  const related = typeof seat.guard.relatedEntryId === 'string' ? seat.guard.relatedEntryId : '';
  if (!related) return refuseOffer('unknown_entry');
  return withdrawForOffer(get, set, seat, related);
}

/**
 * The NON-ADD half of the fulfil offer: an op the catalogue can express that mints nobody, so
 * the entry's id is the CALLER's exactly as `stage`'s own contract makes it (HZ-STAMP). The
 * TARGET is the caller's too, because a guard's `fulfil` is a TYPE and a PAYLOAD and names no
 * subject; `makeOp` refuses a missing or empty-id target, which is the one refusal here.
 * @param {Function} get @param {Function} set
 * @param {{saveId: string, offer: string, guard: Record<string, unknown>,
 *   entry: Record<string, unknown>, request: Record<string, unknown>}} seat
 * @param {string} type @param {Record<string, unknown>} values
 */
function stageFulfilOp(get, set, seat, type, values) {
  const id = String(seat.request.id ?? '');
  const held = selectDecrees(get());
  if (!id || held.some((row) => String(/** @type {{id?: unknown}} */ (row)?.id ?? '') === id)) {
    return refuseOffer('not_staged');
  }
  const target = isPlainObject(seat.request.target) ? seat.request.target : null;
  const op = target === null ? null : makeOp(type, target, values);
  if (op === null) return refuseOffer('unknown_target');
  const verdict = validateOp(op, null);
  if (verdict.ok === false) return refuseOffer('invalid_op', verdict.errors);
  const resolution = /** @type {{ok: boolean, missing?: string, was?: string}} */ (
    resolveDecree({ id, op }, { opTypes: OP_TYPES, pools: seat.request.pools })
  );
  if (resolution.ok === false) {
    return refuseOffer('stale_vocabulary', Object.freeze([String(resolution.missing), String(resolution.was)]));
  }
  const committed = stageDecree(get, set, {
    saveId: seat.saveId,
    op,
    meta: { id, orderedAt: stampOf(seat.request), addedBy: DECREE_AUTHORS[1] },
  });
  if (committed.ok === false) return refuseOffer(committed.reason);
  return { ok: /** @type {true} */ (true), decreeId: id, decrees: committed.decrees };
}

/**
 * ⭐ FULFIL IT FOR ME (design 2.7): the guard's own op is staged as ITS OWN entry, marked as
 * added by the guard, and PLACED BEFORE the entry it serves — which is the whole point, since
 * the tick applies the pending entries in the DM's list order and a prerequisite staged after
 * its dependent grounds nothing.
 *
 * ⛔ ONE PATH AND NO SECOND OP MINT. An `add-` op is the ROSTER family's and goes through
 * EM-E8's binder, which mints the newcomer's stable id, builds the op through the catalogue's
 * own constructor, resolves its words against the caller's pools and stages it; everything
 * else is built here through the SAME constructor and the SAME resolver. Neither branch
 * re-implements a pool rule, an id policy or a validation.
 *
 * ⛔ THE GUARD'S PAYLOAD IS A COMPLETE ACT, AND THE DM'S `values` EDIT IT RATHER THAN FINISH
 * IT (U65, `94b90c042`). The claim this paragraph used to make — that every `fulfil` the
 * landed rules mint is catalogue-INCOMPLETE, so the merge below was the DM's completion of a
 * seed — stopped being true the day `guardRules.js :: offeredOp` began SHAPING each offer BY
 * THE ROW: every declared field takes the finding's value, else the entry's, else the target's
 * own id for a required plain string, and an offer whose required pool, int or enum value
 * nothing can name is DROPPED rather than minted short. So the merge is still the DM's word
 * winning over the guard's, and an act that is still incomplete is still refused with the
 * CATALOGUE's own words rather than with a second opinion about them; what changed is that the
 * incompleteness now arrives from the DM's edit and no longer from the rule.
 *
 * @param {Function} get @param {Function} set
 * @param {{saveId: string, offer: string, guard: Record<string, unknown>,
 *   entry: Record<string, unknown>, request: Record<string, unknown>}} seat
 */
function fulfilOffer(get, set, seat) {
  const fulfil = isPlainObject(seat.guard.fulfil) ? seat.guard.fulfil : null;
  const type = fulfil === null ? '' : String(fulfil.type ?? '');
  if (!type) return refuseOffer('no_fulfil');
  const values = {
    ...(fulfil !== null && isPlainObject(fulfil.payload) ? fulfil.payload : {}),
    ...(isPlainObject(seat.request.values) ? seat.request.values : {}),
  };
  const card = cardOfAddOp(type);
  const staged = card === null
    ? stageFulfilOp(get, set, seat, type, values)
    : stageAddDecreeIntent(get, set, {
      cardType: card,
      values,
      pools: seat.request.pools,
      orderedAt: stampOf(seat.request),
      addedBy: DECREE_AUTHORS[1],
    });
  if (staged.ok === false) return refuseOffer(staged.reason, staged.errors);

  // ⛔ PLACED BEFORE THE ENTRY IT SERVES, through EM-C1's own permutation. `stage` appended
  //    the new entry at the END of the DM's list; moving it to the served entry's OWN position
  //    in that list pushes the served entry one place down, so the ground is laid first and no
  //    other entry's index moves. The reading is `reorder`'s own, never a second one.
  const served = pendingIdsOf(staged.decrees).indexOf(String(seat.entry.id));
  if (served < 0) return refuseOffer('unknown_entry');
  const placed = reorderDecree(get, set, {
    saveId: seat.saveId, entryId: staged.decreeId, toIndex: served,
  });
  if (placed.ok === false) return refuseOffer(placed.reason);
  return offerReceipt(seat, placed.decrees, staged.decreeId);
}

/** REORDER and I WILL DO IT MYSELF have no writer in this member, and each absence is a
 *  measurement rather than an omission. `reorder` is the registry page's OWN move controls
 *  bound to EM-C4b's landed verb, and minting a second reorder path behind an offer would be
 *  the second path design 2.3 refuses; `self` is design 2.7's own "Cancel is always the DM's
 *  own choice", which writes nothing by definition. The refusal NAMES the offer, so a later
 *  member turns either row into a writer without widening one vocabulary. */
function noWriterOffer() {
  return refuseOffer('no_writer');
}

/**
 * ⭐ THE OFFER TABLE: EM-C2's seven offers -> the act each one is. It is a DECLARATION with
 * COMPUTED KEYS, so the seven words live in `GUARD_OFFERS` and nowhere else (judgment 236),
 * and a test pins it SET-EQUAL IN BOTH DIRECTIONS against that vocabulary: an offer the
 * engine can mint and this door cannot act on would show up there rather than falling
 * silently through. The dispatch is off THIS frozen table and never off the store handle,
 * which is the premise `tests/store/deadOperationRatchet.test.js` holds.
 * @type {Readonly<Record<string, (get: Function, set: Function, seat: {saveId: string,
 *   offer: string, guard: Record<string, unknown>, entry: Record<string, unknown>,
 *   request: Record<string, unknown>}) => object>>}
 */
export const GUARD_OFFER_ACTS = Object.freeze({
  [GUARD_OFFERS[0]]: fulfilOffer,
  [GUARD_OFFERS[1]]: overrideOffer,
  [GUARD_OFFERS[2]]: keepFirstOffer,
  [GUARD_OFFERS[3]]: keepLastOffer,
  [GUARD_OFFERS[4]]: overrideOffer,
  [GUARD_OFFERS[5]]: noWriterOffer,
  [GUARD_OFFERS[6]]: noWriterOffer,
});

/**
 * ⭐ THE GUARD OFFERS HAVE A WRITER (EM-C4c; design 2.7's three offers, 2.7a's connection
 * and 7 C's "overrides recorded").
 *
 * EM-D3's page renders each offer and calls `onGuardOffer(guard, offerName)` — "this page
 * invents no writer". This is the writer: one door from an offer the ENGINE minted to the
 * act it names, judged by the offer's own name out of `GUARD_OFFERS` and carried out by
 * EM-C4b's landed actions over EM-C1's pure verbs. It mints no op type, no guard rule, no
 * status and no author.
 *
 * ⛔ IT LIFTS NO GATE AND MAKES NO CANON RULE. `canEditSettlement()` is untouched; design
 * 2.6 puts a pooled act in the REGISTRY on canon, and the registry is where every branch
 * here leaves it, on every phase.
 *
 * ⛔ THE PRECONDITIONS FAIL CLOSED, AND THE ENTRY IS RESOLVED FROM THE LIVE REGISTRY RATHER
 * THAN FROM THE CALLER. A guard is a reading of a queue that may have moved since it was
 * read, so the entry it names must still be there and still be PENDING; and the request's
 * own `entryId` must AGREE with the guard's, because acting on one entry with another's
 * finding is the data-safety class step 1 of the plain-edit writer exists to prevent.
 *
 * @param {Function} get @param {Function} set
 * @param {{saveId: string, entryId: string, guard: object, offer: string, values?: object,
 *   pools?: object, target?: object, id?: string, orderedAt?: string}} request
 *   `values`, `pools`, `target` and `id` are the FULFIL offer's alone: the DM's completion of
 *   the guard's seeded payload, the live pool catalogue, the subject a non-add op acts on and
 *   the new entry's id. The other six offers need none of them.
 * @returns {{ok: true, saveId: string, offer: string, entryId: string, decreeId: string|null,
 *            decrees: readonly object[]}
 *          |{ok: false, reason: string, errors: readonly string[]}} NEITHER branch throws; on
 *   `ok:false` the store is unchanged and no argument is mutated.
 */
export function takeGuardOffer(get, set, request) {
  const bag = isPlainObject(request) ? request : {};

  // 1. THE ACTIVE SAVE, for the reason every registry write gives: the write indexes
  //    `get().settlement`.
  const saveId = String(bag.saveId ?? '');
  if (!saveId || saveId !== String(get().activeSaveId ?? '')) return refuseOffer('no_save');

  // 2. THE OFFER, against EM-C2's closed vocabulary AND against this door's own table, by an
  //    own-key lookup: `constructor` is an unknown offer like any other.
  const offer = String(bag.offer ?? '');
  const offers = /** @type {readonly unknown[]} */ (GUARD_OFFERS);
  if (!offers.includes(offer) || !Object.hasOwn(GUARD_OFFER_ACTS, offer)) {
    return refuseOffer('unknown_offer');
  }

  // 3. THE GUARD, which must be the engine's own shape and must CARRY the offer taken: an
  //    offer no finding made is not the DM's to take.
  const guard = isPlainObject(bag.guard) ? bag.guard : null;
  const carried = guard !== null && Array.isArray(guard.offers) ? guard.offers : [];
  if (guard === null || typeof guard.id !== 'string' || guard.id.length === 0
    || !carried.includes(offer)) {
    return refuseOffer('unknown_guard');
  }

  // 4. THE ENTRY, resolved from the LIVE registry and required PENDING.
  const entryId = String(bag.entryId ?? '');
  if (!entryId || entryId !== String(guard.entryId ?? '')) return refuseOffer('unknown_entry');
  const entry = selectDecrees(get())
    .find((row) => isPlainObject(row) && row.id === entryId && row.status === DECREE_PENDING);
  if (entry === undefined) return refuseOffer('unknown_entry');

  return GUARD_OFFER_ACTS[offer](get, set, {
    saveId, offer, guard, entry: /** @type {Record<string, unknown>} */ (entry), request: bag,
  });
}

/* ── EM-E4d (1) · THE SEALS' WRITERS ───────────────────────────────────────── */

/**
 * ⭐ THE SEAL TABLE: `<seal id>` -> the act behind it, as DATA (EM-E4d unit 1; design §13's
 * verbs, §17's acts, §18's preconditions; the chair's judgment 296).
 *
 * ⛔ ONE ROW TODAY, AND THE COUNT IS A MEASUREMENT RATHER THAN A STAGE OF THE WORK. The
 * shell offers SIXTEEN seals and the catalogue declares SEVEN off-stage acts, and the two
 * sets do not join by any fact the tree holds: twelve seals name an act the catalogue does
 * not express at all (`Resupply`, `Let the siege fall`, `Let the coup fail`, the three
 * rumour acts, the two envoy acts, `Refuse the peace`, `Schedule an event`, `Send on a
 * mission`, `Sue for peace`), and three more (`Direct the force`, `Direct trade`,
 * `Embargo`) would need somebody to RULE which catalogue verb a herald phrase means, which
 * is an authoring decision and not a reading. `Accept the peace` is the one seal whose ACT
 * and whose COUNTERPARTY are both fixed by the design's own words — design §13's peace seal
 * over §18's standing offer — so it is the one with a writer, and the other fifteen stay
 * shut rather than offering a control whose click would do nothing (judgment 296).
 *
 * ⛔ IT IS A DECLARATION AND NEVER A DISPATCHER. The row is reached by an own-key lookup and
 * the op type travels to `makeOp` as a VALUE, exactly as `ADD_OP_TYPES` does, so no computed
 * dispatch off the store handle is minted and `tests/store/deadOperationRatchet.test.js`'s
 * premise arm is untouched.
 *
 * ⛔ `needs` IS THE SAME §18 CONDITION THE SHELL'S OWN ROW NAMES, and the two are pinned
 * EQUAL by `tests/components/sealWriters.test.jsx` rather than trusted: a seal that opened on
 * one condition and wrote from another would be the drift that makes an open seal refuse.
 * @type {Readonly<Record<string, Readonly<{type: string, needs: string}>>>}
 */
export const SEAL_ACTS = Object.freeze({
  acceptPeace: Object.freeze({ type: 'make-peace', needs: 'pendingPeaceOffer' }),
});

/**
 * The closed refusal set of THIS door, EXPORTED so a test asserts it in both directions
 * rather than re-typing it. SEVEN, frozen, in codepoint order.
 *
 * ⛔ IT WIDENS NO OTHER VOCABULARY. A CATALOGUE refusal is never re-worded here but travels
 * VERBATIM in `errors` — `validateOp`'s own frozen sorted array under `invalid_op`, and
 * EM-C1's own `{ missing, was }` pair under `stale_vocabulary` — exactly as the two doors
 * above carry them.
 * @type {readonly string[]}
 */
export const SEAL_DECREE_REFUSALS = Object.freeze([
  'invalid_op', 'no_save', 'no_seed', 'no_writer', 'not_staged',
  'stale_vocabulary', 'unknown_target',
]);

/** The refusal SHAPE all three doors answer in, aliased as EM-C4c aliases it. */
const refuseSeal = refuseAdd;

/**
 * ⛔ THE DECREE-ENTRY SCOPE, AND IT IS A MEASURED CURE RATHER THAN A FLOURISH.
 *
 * A seal decree mints NOBODY: its id is an ENTRY's address and never an entity's, so it must
 * not compete for the newcomer's sequence. Drawn from the same `(seed, 'minted', n)` walk it
 * DOES, and the collision was EXECUTED before this scope existed: two seal acts took n=0 and
 * n=1, and the very next roster add — whose claim set is the add-ops' own targets and nothing
 * else — re-derived n=0, found the registry already holding that id and refused `not_staged`.
 * A DM who sealed a peace could no longer add a faction.
 *
 * Scoping the SEED puts the entries on a walk the newcomer's can never reach, and leaves
 * `mintNewcomerId` byte-identical, so no identity this estate has already minted moves. The
 * kind stays `minted`, because `DM_ID_KINDS` is a closed two-member vocabulary in the layer's
 * own leaf and widening a persisted id namespace is not this member's to do.
 */
const DECREE_ID_SCOPE = 'decree';

/**
 * One seal decree's ENTRY id, stable in the save's seed and unique in the registry. The claim
 * set is EVERY entry the registry already holds — the only home an entry id can collide in —
 * so two seal acts cannot take one address, which `stage` would answer by returning the rows
 * unchanged and leaving this door reporting a decree nothing holds.
 * @param {string} seed @param {readonly object[]} decrees @returns {string}
 */
function mintSealEntryId(seed, decrees) {
  /** @type {Set<string>} */
  const claimed = new Set();
  for (const row of decrees) {
    const id = isPlainObject(row) ? row.id : undefined;
    if (typeof id === 'string' && id.length > 0) claimed.add(id);
  }
  return mintClaimedId(`${seed}|${DECREE_ID_SCOPE}`, claimed);
}

/**
 * ⭐ A SEAL'S CLICK STAGES THE ACT IT NAMES (EM-E4d unit 1; design §13, §17, §18).
 *
 * The shell's seal block offered sixteen controls and every one of them was rendered
 * `disabled` with no handler at all, so design §17's acts existed as words. This is the
 * writer behind the one seal whose act the catalogue expresses: the DM seals the peace that
 * is standing, and the act travels the SAME road every other act travels — the catalogue's
 * own constructor, the catalogue's own validator, EM-C1's own resolver, and EM-C4b's ONE
 * registry write site. The tick applies it like any other entry.
 *
 * ⛔ NO SECOND STAGING PATH AND NO SECOND OP MINT. `makeOp` builds it, `validateOp` judges
 * it, `resolveDecree` resolves its words against the caller's catalogue and `stageDecree`
 * writes it; this door re-implements none of the four and mints no op type.
 *
 * ⛔ THE COUNTERPARTY IS THE CALLER'S, AND THAT IS EM-C4c's OWN SHAPE RATHER THAN A SHORTCUT.
 * `stageFulfilOp` one section up takes its target from the request for the same reason: a
 * staged op that mints nobody names a subject this leaf cannot derive, and the party that
 * OFFERED the control is the party that read which counterparty it was offered against. Design
 * §18 is explicit that a world-state condition decides WHICH SEALS A CARD OFFERS — "not a guard
 * refusing an act" — so re-testing it here would mint a refusal the design does not ask for,
 * and §2.7's "nothing blocks" would be broken by this door rather than honoured by it. The one
 * thing this door does refuse is a target the CATALOGUE cannot accept: `makeOp` answers null
 * for an empty id, which is `unknown_target`.
 *
 * ⛔ IT LIFTS NO GATE AND MAKES NO CANON RULE. `canEditSettlement()` is untouched, and design
 * §2.6 puts the act in the REGISTRY on every phase, which is where this leaves it.
 *
 * @param {Function} get @param {Function} set
 * @param {{seal: string, counterparty: string, pools?: object, orderedAt?: string}} request
 * @returns {{ok: true, saveId: string, seal: string, decreeId: string, op: object,
 *            decrees: readonly object[]}
 *          |{ok: false, reason: string, errors: readonly string[]}} NEITHER branch throws; on
 *   `ok:false` the store is unchanged and no argument is mutated.
 */
export function stageSealDecreeIntent(get, set, request) {
  const bag = isPlainObject(request) ? request : {};

  // 1. THE SEAL, against the one table, by an own-key lookup: `constructor` is a seal with no
  //    act like any other, and a seal with no row is a control that must never have opened.
  const seal = String(bag.seal ?? '');
  if (!Object.hasOwn(SEAL_ACTS, seal)) return refuseSeal('no_writer');
  const act = SEAL_ACTS[seal];
  const declared = Object.hasOwn(OP_TYPES, act.type) ? OP_TYPES[act.type] : null;
  if (declared === null) return refuseSeal('invalid_op');

  // 2. THE ACTIVE SAVE, for the data-safety reason every registry write gives: the write
  //    indexes `get().settlement`.
  const saveId = String(get().activeSaveId ?? '');
  if (!saveId) return refuseSeal('no_save');
  const record = get().settlement;

  // 3. THE SEED, which is what makes the entry's id STABLE rather than merely unique.
  const seed = typeof (/** @type {{_seed?: unknown}} */ (record)?._seed) === 'string'
    ? String(/** @type {{_seed: string}} */ (record)._seed)
    : '';
  if (!seed) return refuseSeal('no_seed');

  // 4. THE COUNTERPARTY THE CALLER READ THE SEAL OPEN AGAINST, carried verbatim. An act with
  //    nobody on the other side is the one target refusal this door makes.
  const counterparty = String(bag.counterparty ?? '');
  if (counterparty === '') return refuseSeal('unknown_target');

  // 5. THE OP, at the row's OWN declared target kind — the word is read off the catalogue and
  //    never spelled here, so a row that moved families moves this call with it.
  const op = makeOp(act.type, { kind: declared.target, id: counterparty }, { counterparty });
  if (op === null) return refuseSeal('invalid_op');
  const verdict = validateOp(op, null);
  if (verdict.ok === false) return refuseSeal('invalid_op', verdict.errors);

  // 6. THE ENTRY'S ID AND THE VOCABULARY, through EM-C1's own resolver.
  const decrees = selectDecrees(get());
  const id = mintSealEntryId(seed, decrees);
  const resolution = /** @type {{ok: boolean, missing?: string, was?: string}} */ (
    resolveDecree({ id, op }, { opTypes: OP_TYPES, pools: bag.pools })
  );
  if (resolution.ok === false) {
    return refuseSeal('stale_vocabulary', Object.freeze([String(resolution.missing), String(resolution.was)]));
  }

  // 7. THE REGISTRY ROW. `stage` is TOTAL and answers a refused amendment with the rows
  //    unchanged, so the receipt is checked against the rows it returned rather than assumed.
  const committed = stageDecree(get, set, {
    saveId, op, meta: { id, orderedAt: stampOf(bag), addedBy: DECREE_AUTHORS[0] },
  });
  if (committed.ok === false) return refuseSeal(committed.reason);
  if (!committed.decrees.some((row) => String(/** @type {{id?: unknown}} */ (row)?.id ?? '') === id)) {
    return refuseSeal('not_staged');
  }
  return {
    ok: /** @type {true} */ (true), saveId, seal, decreeId: id, op, decrees: committed.decrees,
  };
}

/* ── EM-F3d · THE DELETE'S SCRUB ───────────────────────────────────────────── */

/**
 * The off-stage consequence policy, READ OFF THE CATALOGUE'S OWN FROZEN VOCABULARY at the
 * index this leaf reads it at. EM-F1's `applyOffStage` gates on exactly this word, and its
 * leaf may not be imported here — `tests/lint/editMutationPath.walker.test.js` pins this
 * module's static import list EXACT at six — so the word comes from a module this file
 * already holds rather than being spelled a second time, which is the same discipline
 * `DECREE_APPLIED` and `DECREE_PENDING` keep one step less well.
 */
const BY_TARGET_REALITY = OP_CONSEQUENCE_POLICIES[1];

/**
 * ⭐ THE ONE CLOSED REASON THIS DOOR WRITES (design §20.3; the chair's judgment 308).
 * Both words are EM-C1's own, read off its frozen vocabularies at the indexes this leaf
 * reads them at and never re-typed here: a family this door invented would be dropped by
 * `withdrawnReasonOf` in silence, and an ABSENT reason is design §20.3's way of saying the
 * DM withdrew the entry BY HAND — so an un-typed reason would not merely be unhelpful, it
 * would write a lie onto the record.
 */
const TARGET_DELETED = Object.freeze({
  kind: WITHDRAWN_REASON_KINDS[1], missing: RESOLUTION_MISSING_KINDS[5],
});

/**
 * The closed reason set of THIS door, EXPORTED so a test asserts it in both directions
 * rather than re-typing it. ONE, frozen, and it is reachable: `tests/store/deleteScrub.test.js`
 * case D5 pins it SET-EQUAL against the reasons the scrub actually produced, which is
 * C4c-4's own idiom.
 *
 * ⛔ IT WIDENS NO OTHER VOCABULARY. `ADD_DECREE_REFUSALS`, `GUARD_OFFER_REFUSALS` and
 * `SEAL_DECREE_REFUSALS` are the three DOORS' refusal words and are untouched: this is not
 * a refusal at all but the reason carried ON a written entry, so putting it in one of
 * those sets would have made a member no door can produce and reddened their set-equal
 * arms in both directions.
 * @type {readonly string[]}
 */
export const DELETE_SCRUB_REASONS = Object.freeze([TARGET_DELETED.kind]);

/** One shared frozen receipt for a delete that named nobody, so the ordinary case
 *  allocates nothing and two edgeless deletes compare alike. */
const NOTHING_SCRUBBED = Object.freeze({
  ok: /** @type {true} */ (true), deletedId: '', withdrawn: NO_ERRORS,
});

/**
 * The id an off-stage op names as its counterparty, by the DOMAIN RESOLVER'S OWN
 * precedence — the payload's own ref field first, the op's target second. An op whose
 * declared consequence is not the off-stage one names no counterparty at all, which is
 * `applyOffStage`'s first gate and is why a home act is never touched by the scrub.
 * @param {unknown} op @returns {string} the empty string when the op names nobody
 */
function counterpartyIdOf(op) {
  if (!isPlainObject(op) || op.consequence !== BY_TARGET_REALITY) return '';
  const payload = isPlainObject(op.payload) ? op.payload : {};
  const ref = isPlainObject(op.target) ? op.target : {};
  const named = [payload.counterparty, ref.id]
    .find((value) => typeof value === 'string' && value.length > 0);
  return typeof named === 'string' ? named : '';
}

/**
 * Every PENDING entry of one registry whose op names `deletedId`, in the registry's own
 * order. An APPLIED entry is history and is never selected (THE PROMISE), and a WITHDRAWN
 * one is already at rest.
 * @param {readonly object[]} rows @param {string} deletedId @returns {string[]}
 */
function staleEntryIdsOf(rows, deletedId) {
  return rows
    .filter((row) => isPlainObject(row) && row.status === DECREE_PENDING
      && counterpartyIdOf(row.op) === deletedId)
    .map((row) => String(/** @type {{id: unknown}} */ (row).id));
}

/**
 * ⭐ THE DELETE'S SCRUB (EM-F3d; the verifier's STOP-2, the chair's judgments 291 and 308).
 *
 * THE DEFECT, EXECUTED BEFORE THIS EXISTED. `settlementSlice.js :: removeSavedSettlement`
 * pruned campaign membership and queued intentions and nothing else, so a PENDING decree
 * whose off-stage op named a phantom by id OUTLIVED its target; EM-F3b's claim walk then
 * re-minted the deleted id for the next counterparty, and both `rows.find` and
 * `counterpartyBadgeOf` resolved the DM's decree onto a STRANGER wearing a badge that said
 * nothing was wrong.
 *
 * ⛔ THE DELETE IS THE ONE ACT THAT KNOWS THE ID IS GONE, so the cure is here and not at
 * the readers. A guard at the badge, the fold and the tick would be three homes for one
 * fact and would still leave the stale row standing on the record (judgment 308).
 *
 * ⛔ THE ENTRY IS KEPT, AND APPLIED HISTORY IS UNTOUCHED. EM-C1's `withdraw` amends
 * PENDING rows only and keeps the entry with its original words and its own `orderIndex`
 * (design §2.5a: application never deletes an entry), so what the DM once ordered stays
 * legible and THE PROMISE's lived history is not rewritten.
 *
 * ⛔ N REGISTRIES WIDE, WHICH IS EM-E8b's OWN LESSON (U49). Design §2.5 puts `decrees` on
 * the SAVED SETTLEMENT, so a campaign's registries are N: the OPEN save moves through
 * EM-C4b's landed action and its one write site, and every other member's own row moves in
 * ONE further `set`, computed from finalized state so no draft is carried into a frozen row.
 *
 * ⛔ IT OPENS NO PERSISTENCE PATH AND MINTS NO KEY. Like every other registry write on this
 * leaf the scrub reaches the live view and the library rows; the durable half is the save
 * flow's, exactly as staging and the plain edits leave it. No tombstone list and no
 * high-water mark is written — that key stays the owner's (U82) and the scrub is what makes
 * it unnecessary.
 *
 * @param {Function} get @param {Function} set @param {unknown} deletedId
 * @returns {{ok: true, deletedId: string, withdrawn: readonly string[]}} NEVER throws; a
 *   delete that named nobody returns ONE shared frozen receipt and writes nothing at all.
 */
export function scrubDeletedCounterparty(get, set, deletedId) {
  const id = String(deletedId ?? '');
  if (!id) return NOTHING_SCRUBBED;
  const reason = { ...TARGET_DELETED, was: id };
  /** @type {string[]} */
  const withdrawn = [];

  // (1) THE OPEN SAVE, through EM-C4b's landed action: the registry's one store write site
  //     and EM-C1's own typed verb, so this door re-implements neither.
  const saveId = String(get().activeSaveId ?? '');
  for (const entryId of staleEntryIdsOf(selectDecrees(get()), id)) {
    if (withdrawDecree(get, set, { saveId, entryId, reason }).ok === true) withdrawn.push(entryId);
  }

  // (2) EVERY MEMBER SAVE'S OWN REGISTRY. Computed off FINALIZED state and written in one
  //     `set`, so either every home moves or none does.
  const rows = get().savedSettlements || [];
  /** @type {{index: number, row: object}[]} */
  const moved = [];
  for (const [index, row] of rows.entries()) {
    // A row with no record of its own carries no registry, which is a fact about the row
    // rather than a repair this leaf owes it.
    if (!isPlainObject(row) || !isPlainObject(row.settlement)) continue;
    const record = row.settlement;
    const stale = staleEntryIdsOf(recordDecrees(record), id);
    if (stale.length === 0) continue;
    let next = recordDecrees(record);
    for (const entryId of stale) next = withdraw(next, entryId, reason);
    moved.push({ index, row: { ...row, settlement: { ...record, decrees: next } } });
    for (const entryId of stale) if (!withdrawn.includes(entryId)) withdrawn.push(entryId);
  }
  if (moved.length > 0) {
    set((state) => {
      for (const move of moved) state.savedSettlements[move.index] = move.row;
    });
  }
  if (withdrawn.length === 0) return NOTHING_SCRUBBED;
  return { ok: /** @type {true} */ (true), deletedId: id, withdrawn: Object.freeze(withdrawn) };
}
