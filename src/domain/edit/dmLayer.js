/**
 * dmLayer.js — THE DM LAYER'S LEAF (EM-B2a1, wave 1, member 1 of the EM-B2a split).
 *
 * WHAT IT HOLDS. Under design §14 the record is regenerated FROM the layer, so the layer is
 * the INPUT and the record is the OUTPUT. `roots` holds THE DM'S OVERRIDE, keyed by the root
 * key EM-A1 declares; this leaf stores and returns that key as an OPAQUE STRING and asserts
 * nothing about its internal shape. That opacity is what makes the leaf landable today: the
 * key's regeneration-stable spelling is EM-P1's block, and no spelling of it can stale a
 * module that never reads inside it.
 *
 * ⛔ IT NEVER TOUCHES A RECORD, AND IT WRITES NOTHING. `applyEdit` returns a layer to its
 * caller; persistence is EM-B3's and the orchestration is EM-B2a4's. `recordRegister.js`
 * still declares `dmLayer` NOT YET WRITTEN, and this leaf's landing keeps that true.
 *
 * ⭐ THE CONSULT IS INJECTED, NEVER IMPORTED (the chair's judgment 77). `applyEdit` is arity
 * THREE and takes the declaration consult as data, so this leaf imports NOTHING from EM-A1,
 * stays pure, and all three refusals are provable against a frozen stub. If EM-A1's shapes
 * move, only the CALLER's adapter moves.
 *
 * ⛔ FAIL CLOSED. An absent, null or malformed consult RESOLVES NO CARD TYPE, so every op is
 * refused `unknown_target`. An unusable consult can therefore never widen what the DM may
 * override; it can only close the door. Nothing here throws and nothing here mutates.
 *
 * ⭐ PURITY IS THE POINT. No PRNG, no clock, no locale, no import of `src/components`,
 * `src/store` or `src/generators`: the leaf stays importable from a worker, a test and a bare
 * node script. Its one dependency is the estate's single synchronous SHA-256, which is pure
 * and import-free.
 */
import { sha256Hex } from '../content/contentFingerprint.js';

/**
 * @typedef {{ roots: Record<string, unknown>, worldFacts: Record<string, unknown>,
 *             minted: Record<string, object>, phantoms: Record<string, object> }} DmLayer
 */

/**
 * The consult's two members MIRROR BY SHAPE the two functions EM-A1 declares in
 * `src/domain/edit/fieldDeclarations.js`. The leaf reads only a declaration's `field`.
 * @typedef {{ isEditableCard: (cardType: string) => boolean,
 *             declarationsFor: (cardType: string) => readonly { field: string }[] }} DeclarationConsult
 */

/** @typedef {'invalid_op'|'undeclared_field'|'unknown_target'} ApplyEditReason */

/** The four sub-objects, in the register's own order. `entities` is the RETIRED spelling. */
const LAYER_KEYS = Object.freeze(['roots', 'worldFacts', 'minted', 'phantoms']);

/**
 * The ONE spelling of an untouched layer. Deeply frozen: the object and all four
 * sub-objects. `worldFacts` is minted EMPTY and read by nobody until EM-B2b; it is present
 * from the first landing because widening a shipped persistence shape costs a migration that
 * an empty frozen sub-object costs nothing to avoid.
 * @type {DmLayer}
 */
export const EMPTY_DM_LAYER = Object.freeze({
  roots: Object.freeze({}),
  worldFacts: Object.freeze({}),
  minted: Object.freeze({}),
  phantoms: Object.freeze({}),
});

/** Exactly `dm:`. The ONE identity namespace of the DM layer. */
export const DM_ID_NS = 'dm:';

/**
 * The closed refusal set, EXPORTED so a test asserts it in both directions rather than
 * re-typing it. ⛔ No other value. The ORDER OF REFUSAL is a separate fact and it is fixed:
 * `invalid_op` (shape) then `unknown_target` (card type) then `undeclared_field` (field).
 * @type {readonly ApplyEditReason[]}
 */
export const APPLY_EDIT_REASONS = Object.freeze(['invalid_op', 'undeclared_field', 'unknown_target']);

/**
 * The identity classes the layer holds, singular, and the whole closed vocabulary of
 * `mintDmId`'s `kind`. They are the layer's own two identity sub-objects (`minted`,
 * `phantoms`); `phantom` is the spelling design §14's phantom row already ships
 * (`dm:phantom:<seedHash>`).
 */
const DM_ID_KINDS = Object.freeze(['minted', 'phantom']);

/**
 * Not a tuning dial and not a simulation constant: 16 is the minted id's FORMAT, fixed by the
 * contract and asserted by `/^dm:[a-z]+:[0-9a-f]{16}$/`, so moving it would re-spell every id
 * ever minted rather than tune a behaviour.
 */
const DM_ID_SHAPE = Object.freeze({ hexLength: 16 });

/**
 * A plain, non-array object — the only shape a layer or a sub-object may legally have.
 * @param {unknown} value any value at all — this guard is the leaf’s narrowing entry point.
 * @returns {boolean}
 */
const isPlainObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * THE ABSENCE RULES, in one place. Absent, `null`, a non-object, an array or an object
 * missing any sub-object all read as `EMPTY_DM_LAYER` with the missing sub-objects
 * materialized empty. ⛔ NEVER a throw, and ⛔ an empty layer is NEVER normalized back to
 * absent. A layer that is already whole is returned BY REFERENCE, so nothing is allocated on
 * the read path.
 * @param {unknown} layer
 * @returns {DmLayer}
 */
function normalizeLayer(layer) {
  if (!isPlainObject(layer)) return EMPTY_DM_LAYER;
  const source = /** @type {Record<string, unknown>} */ (layer);
  if (LAYER_KEYS.every((key) => isPlainObject(source[key]))) return /** @type {DmLayer} */ (layer);
  const whole = /** @type {Record<string, unknown>} */ ({});
  for (const key of LAYER_KEYS) {
    whole[key] = isPlainObject(source[key]) ? source[key] : EMPTY_DM_LAYER[/** @type {'roots'} */ (key)];
  }
  return /** @type {DmLayer} */ (whole);
}

/**
 * (1) THE READ. Pure, total, THROWS NEVER.
 *
 * @param {unknown} layer any value at all — absent, null, a non-object, an array, or a DmLayer
 * @param {unknown} key
 * @returns {unknown} `undefined` means EXACTLY "the DM did not override this key". A stored
 *   `undefined` is impossible because `applyEdit` refuses it, so the two can never be
 *   confused. Own-property only: a key spelling a prototype member reads as `undefined`, and
 *   so does a non-string key, because the root key is a string by contract.
 */
export function layerRead(layer, key) {
  if (typeof key !== 'string') return undefined;
  const { roots } = normalizeLayer(layer);
  return Object.hasOwn(roots, key) ? roots[key] : undefined;
}

/**
 * Resolve the injected consult, FAILING CLOSED. A consult that is not an object, or whose
 * members cannot be read, or either of whose members is not a function, is UNUSABLE.
 * @param {unknown} declarations
 * @returns {DeclarationConsult|null} `null` means unusable, which closes the door.
 */
function usableConsult(declarations) {
  if (!isPlainObject(declarations)) return null;
  try {
    const { isEditableCard, declarationsFor } = /** @type {DeclarationConsult} */ (declarations);
    if (typeof isEditableCard !== 'function' || typeof declarationsFor !== 'function') return null;
    return { isEditableCard, declarationsFor };
  } catch {
    // A hostile consult may throw from a GETTER, before any member is ever called.
    return null;
  }
}

/**
 * (2) THE OP APPLICATION. Pure; a layer in, a NEW layer out. ⛔ IT NEVER TOUCHES A RECORD.
 *
 * @param {unknown} layer read through the absence rules
 * @param {unknown} op `{ kind: 'set-root', key, cardType, field, value }`. ⭐ `key` is the
 *   OPAQUE root key and is the ONLY thing the layer STORES. `cardType` and `field` are
 *   TRANSIENT COMMAND COORDINATES, used for the consult and then discarded, so ⛔ NO
 *   PERSISTED SHAPE MOVES.
 * @param {unknown} declarations a `DeclarationConsult`, read defensively
 * @returns {{ ok: true, layer: DmLayer, keys: string[] }
 *          | { ok: false, reason: ApplyEditReason, layer: unknown }}
 *   On `ok:true` the layer is a NEW deeply-frozen object and `keys` holds exactly the keys
 *   this call wrote, ASCII-ascending. On `ok:false` `layer` is `===` the argument and nothing
 *   is allocated. NEITHER branch throws and NEITHER mutates an argument.
 */
export function applyEdit(layer, op, declarations) {
  /** @param {ApplyEditReason} reason */
  const refuse = (reason) => ({ ok: /** @type {false} */ (false), reason, layer });
  /**
   * @param {unknown} value a command coordinate, read straight off an unknown op.
   * @returns {boolean} true ONLY for a non-empty string.
   */
  const isFilled = (value) => typeof value === 'string' && value.length > 0;

  // 1. SHAPE ONLY, no consult. A wrong kind, an unfilled coordinate or an absent value is the
  //    op's own fault and is answered before any declaration is read.
  if (!isPlainObject(op)) return refuse('invalid_op');
  const command = /** @type {{ kind: unknown, key: unknown, cardType: unknown, field: unknown, value: unknown }} */ (op);
  if (command.kind !== 'set-root') return refuse('invalid_op');
  if (!isFilled(command.key) || !isFilled(command.cardType) || !isFilled(command.field)) return refuse('invalid_op');
  if (command.value === undefined) return refuse('invalid_op');
  const key = /** @type {string} */ (command.key);
  const cardType = /** @type {string} */ (command.cardType);

  // 2. THE CARD TYPE, against the injected consult, FAIL CLOSED. Both members are called
  //    inside one guard: a consult that throws from EITHER resolves no card type at all.
  const consult = usableConsult(declarations);
  if (consult === null) return refuse('unknown_target');
  /** @type {boolean} */
  let editable;
  /** @type {unknown} */
  let declared;
  try {
    editable = consult.isEditableCard(cardType) === true;
    declared = consult.declarationsFor(cardType);
  } catch {
    return refuse('unknown_target');
  }
  if (!editable) return refuse('unknown_target');

  // 3. THE FIELD, against the same consult. A non-array is "no declarations", never a throw.
  const rows = Array.isArray(declared) ? declared : [];
  const found = rows.some((row) => isPlainObject(row)
    && /** @type {{ field: unknown }} */ (row).field === command.field);
  if (!found) return refuse('undeclared_field');

  // 4/5. Read through the absence rules, then allocate ONE new frozen layer. The other three
  //      sub-objects are carried BY REFERENCE: they are already frozen.
  const base = normalizeLayer(layer);
  const next = Object.freeze({
    roots: Object.freeze({ ...base.roots, [key]: command.value }),
    worldFacts: base.worldFacts,
    minted: base.minted,
    phantoms: base.phantoms,
  });
  return { ok: /** @type {true} */ (true), layer: next, keys: [key] };
}

/**
 * (3) THE DETERMINISTIC DM ID MINT.
 *
 * `dm:<kind>:<the first 16 lowercase hex of sha256(`${seed}|${kind}|${n}`)>`.
 *
 * @param {unknown} seed
 * @param {unknown} kind one of the layer's two identity classes
 * @param {unknown} n a non-negative safe integer
 * @returns {string}
 * @throws {TypeError} on a non-string seed, an unknown kind, or an `n` that is not a
 *   non-negative safe integer. ⛔ No PRNG, no clock, no locale, and no namespace other than
 *   `DM_ID_NS`, which is what makes the same triple mint the same id forever.
 */
export function mintDmId(seed, kind, n) {
  if (typeof seed !== 'string') throw new TypeError('mintDmId: seed must be a string');
  if (typeof kind !== 'string' || !DM_ID_KINDS.includes(kind)) {
    throw new TypeError(`mintDmId: kind must be one of ${DM_ID_KINDS.join(', ')}`);
  }
  if (typeof n !== 'number' || !Number.isSafeInteger(n) || n < 0) {
    throw new TypeError('mintDmId: n must be a non-negative safe integer');
  }
  return `${DM_ID_NS}${kind}:${sha256Hex(`${seed}|${kind}|${n}`).slice(0, DM_ID_SHAPE.hexLength)}`;
}
