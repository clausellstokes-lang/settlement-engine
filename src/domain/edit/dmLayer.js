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
import { partitionTrace } from './tracePartition.js';
import { KEYED_COLLECTIONS } from './recordRegister.js';

// EM-R1c unit 2 — THE ONE EDITABLE COLLECTION THE REGISTER DECLARES ATOMIC, and its ruled join.
// `powerStructure.factions` is ATOMIC for its CROSS-ENTRY TOTAL (power sums to 100), not for want
// of a key; design §22.4 rules a faction's identity IS its display name, measured unique on every
// entry of every corpus row. The walker holds this one row against both.
/** @type {Readonly<Record<string, string>>} */
const _ATOMIC_EDIT_JOINS = Object.freeze({ 'powerStructure.factions': 'faction' });

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

/**
 * @typedef {{ name: string, provides: string[], transient: string[],
 *             paths: Record<string, unknown> }} StepRoster
 * @typedef {{ declarationsFor: (cardType: string) => readonly { field: string,
 *             outputKey?: string }[] }} DeclarationSet
 * @typedef {'step_not_pinnable'|'unknown_key'} RederiveUnappliedReason
 */

/**
 * (4) THE CLOSED REFUSAL SET for an override the pin bag will not take. TWO members, frozen,
 * in codepoint order, EXPORTED so a test asserts it in both directions rather than re-typing it.
 *
 * ⛔ THERE IS NO POOL REASON, AND THAT IS A RULING RATHER THAN AN OVERSIGHT (judgment 176). Pool
 * membership is a WRITE-TIME check at the single writer's door, so a value outside its pool is
 * meant never to enter the layer at all; this function trusts the layer's recorded values and
 * re-validates nothing. The packet's own raised matter records that no door performs that check
 * at this landing, and the refusal belongs to the adapter's next member, never to this one.
 * @type {readonly RederiveUnappliedReason[]}
 */
export const REDERIVE_UNAPPLIED_REASONS = Object.freeze(['step_not_pinnable', 'unknown_key']);

/** Codepoint order, the estate's own comparison, spelled locally so this leaf imports nothing. */
const byCodepoint = (/** @type {string} */ a, /** @type {string} */ b) => (a < b ? -1 : (a > b ? 1 : 0));

/**
 * Resolve the injected declaration set, FAILING CLOSED on EM-B2a1's own law: a set that is not an
 * object, or whose member cannot be read, or whose member is not a function, is UNUSABLE, and an
 * unusable set resolves no declaration at all. It can therefore only close the door.
 * @param {unknown} declarations
 * @returns {DeclarationSet|null}
 */
function usableDeclarations(declarations) {
  if (!isPlainObject(declarations)) return null;
  try {
    const { declarationsFor } = /** @type {DeclarationSet} */ (declarations);
    return typeof declarationsFor === 'function' ? { declarationsFor } : null;
  } catch { return null; }
}

/**
 * The step roster, read from its producer through the injected handle and never re-typed here.
 * A handle that cannot answer resolves an EMPTY roster, which pins nothing and throws nothing.
 * @param {unknown} engine
 * @returns {StepRoster[]}
 */
function rosterOf(engine) {
  if (!isPlainObject(engine)) return [];
  try {
    const { getStepMeta } = /** @type {{ getStepMeta: () => unknown }} */ (engine);
    const rows = typeof getStepMeta === 'function' ? getStepMeta() : null;
    if (!Array.isArray(rows)) return [];
    return rows.filter(isPlainObject).map((row) => {
      const step = /** @type {{ name: unknown, provides: unknown, transient: unknown, recordPaths: unknown }} */ (row);
      const provides = Array.isArray(step.provides) ? step.provides.filter((k) => typeof k === 'string') : [];
      const transient = Array.isArray(step.transient) ? step.transient.filter((k) => typeof k === 'string') : [];
      /** @type {Record<string, unknown>} */
      const paths = isPlainObject(step.recordPaths)
        ? /** @type {Record<string, unknown>} */ (step.recordPaths) : {};
      return { name: typeof step.name === 'string' ? step.name : '', provides, transient, paths };
    });
  } catch { return []; }
}

/**
 * Split a declaration's `outputKey` into the COLLECTION the runner pins and the LEAF inside it.
 * `npcs[].role` gives `['npcs', 'role']` and `powerStructure.governingName` gives
 * `['powerStructure', 'governingName']`. A key with no leaf segment resolves nothing.
 * @param {unknown} outputKey
 * @returns {[string, string]|null}
 */
function splitOutputKey(outputKey) {
  if (typeof outputKey !== 'string') return null;
  const match = /^([A-Za-z0-9_$]+)(?:\[\])?\.(.+)$/.exec(outputKey);
  return match ? [match[1], match[2]] : null;
}

/**
 * Read the three coordinates out of an opaque root key WITHOUT asking what they mean. The key is
 * `<cardType>:<entityId>:<field>`; the entity id is whatever lies between the first and last
 * separators, so an id that carries one cannot be mis-read.
 * @param {string} key
 * @returns {{ cardType: string, entityId: string, field: string }|null}
 */
function coordsOf(key) {
  const parts = key.split(':');
  if (parts.length < 3) return null;
  const coords = { cardType: parts[0], entityId: parts.slice(1, -1).join(':'), field: parts[parts.length - 1] };
  return coords.cardType && coords.entityId && coords.field ? coords : null;
}

/** The join the register declares for a collection path, or the one atomic row this member declares. */
function joinFor(/** @type {string} */ collectionPath) {
  const spec = Object.hasOwn(KEYED_COLLECTIONS, collectionPath)
    ? /** @type {Record<string, unknown>} */ (KEYED_COLLECTIONS)[collectionPath]
    : (Object.hasOwn(_ATOMIC_EDIT_JOINS, collectionPath) ? _ATOMIC_EDIT_JOINS[collectionPath] : null);
  return typeof spec === 'string' ? spec : null;
}

/** The sole entry of `rows` whose declared join equals `entityId`, or null for zero or several. */
function soleEntry(/** @type {unknown[]} */ rows, /** @type {string} */ collectionPath, /** @type {string} */ entityId) {
  const field = joinFor(collectionPath);
  if (field === null) return null;
  const hits = rows.filter(isPlainObject)
    .filter((e) => String(/** @type {Record<string, unknown>} */ (e)[field] ?? '') === entityId);
  return hits.length === 1 ? /** @type {Record<string, unknown>} */ (hits[0]) : null;
}

/** Write `value` at `leaf` inside `bag`, hopping arrays by the declared join. TRUE when written. */
function writeDeclared(/** @type {unknown} */ bag, /** @type {string} */ collectionPath, /** @type {string} */ leaf, /** @type {string} */ entityId, /** @type {unknown} */ value) {
  let node = bag;
  let path = collectionPath;
  if (Array.isArray(node)) {
    node = soleEntry(node, path, entityId);
    if (node === null) return false;
  }
  const segs = leaf.split('.');
  for (const seg of segs.slice(0, -1)) {
    const hop = seg.endsWith('[]');
    const name = hop ? seg.slice(0, -2) : seg;
    if (!isPlainObject(node)) return false;
    path = `${path}.${name}`;
    let next = /** @type {Record<string, unknown>} */ (node)[name];
    if (hop) {
      if (!Array.isArray(next)) return false;
      next = soleEntry(next, path, entityId);
      if (next === null) return false;
    }
    node = next;
  }
  const last = segs[segs.length - 1];
  if (last.endsWith('[]') || !isPlainObject(node)) return false;
  /** @type {Record<string, unknown>} */ (node)[last] = value;
  return true;
}

/**
 * (5) THE CHOOSER ROSTER, READ FROM ITS PRODUCER, WITH THE DM'S OVERRIDES MERGED IN.
 *
 * ⛔ THE PINNABILITY RULE IS NOT A PER-STEP READ. The bag is keyed by the RECORD PATH a chooser
 * writes, and two steps may share one of those keys, so a key pinned on one step's behalf makes a
 * step that shares it PARTIAL and the runner refuses the whole run. A key is therefore pinnable
 * ONLY IF EVERY step that provides it can be wholly pinned from this record; every other key is
 * omitted and its steps are named in `missing`.
 *
 * ⛔ A LEAF OVERRIDE PINS ITS WHOLE COLLECTION. The choosers are collection keys and every root
 * declaration writes a LEAF inside one, so the DM's value is written INTO A DEEP CLONE of the
 * record's collection and the CLONE is pinned. The bag carries the DM's value at that one leaf
 * and the record's own value everywhere else, and ⛔ the record itself is never touched.
 *
 * @param {unknown} record a generated or saved settlement record
 * @param {unknown} layer read through EM-B2a1's absence rules
 * @param {unknown} declarations the INJECTED declaration set; ⛔ this leaf imports none
 * @param {unknown} engine the INJECTED handle; only its `getStepMeta` member is read here
 * @returns {{ pins: Record<string, unknown>,
 *            missing: Array<{ step: string, keys: string[] }>,
 *            unapplied: Array<{ key: string, value: unknown, reason: RederiveUnappliedReason }> }}
 *   `pins` keys are ASCII-ascending. THROWS NEVER.
 */
export function pinsFrom(record, layer, declarations, engine) {
  const source = isPlainObject(record) ? /** @type {Record<string, unknown>} */ (record) : {};
  const roster = rosterOf(engine);
  /** Every step that provides a given record path. */
  const providersOf = (/** @type {string} */ key) => roster.filter((s) => s.provides.includes(key));
  /** @type {Map<string, string>} */
  const recordPaths = new Map();
  for (const s of roster) for (const [k, p] of Object.entries(s.paths || {})) if (typeof p === 'string') recordPaths.set(k, p);
  const readAt = (/** @type {string} */ key) => {
    const path = recordPaths.get(key);
    if (path === undefined) return Object.hasOwn(source, key) ? { found: true, value: source[key] } : { found: false, value: undefined };
    const segs = path.split('.');
    if (segs[0] !== 'record') return { found: false, value: undefined };
    /** @type {unknown} */ let cursor = source;
    for (const seg of segs.slice(1)) {
      if (!isPlainObject(cursor) || !Object.hasOwn(/** @type {Record<string, unknown>} */ (cursor), seg)) return { found: false, value: undefined };
      cursor = /** @type {Record<string, unknown>} */ (cursor)[seg];
    }
    return { found: true, value: cursor };
  };
  const held = (/** @type {string} */ key) => readAt(key).found;
  // A TRANSIENT CHOOSER IS NOT REQUIRED AND NOT PINNED (the runner's own rule, read through the
  // injected roster rather than re-declared here): its value never lands on the record, so a bag
  // built from this record can never carry it and the closure must not demand it.
  const transientKeys = new Set(roster.flatMap((s) => s.transient));
  const isTransient = (/** @type {string} */ key) => transientKeys.has(key);

  const consult = usableDeclarations(declarations);
  const { roots } = normalizeLayer(layer);

  // PASS 1 — resolve every override to its collection, refusing what cannot resolve at all.
  /** @type {Array<{ key: string, value: unknown, entityId: string, collection: string, leaf: string }>} */
  const resolved = [];
  /** @type {Array<{ key: string, value: unknown, reason: RederiveUnappliedReason }>} */
  const unapplied = [];
  for (const key of Object.keys(roots).sort(byCodepoint)) {
    const value = roots[key];
    const coords = consult === null ? null : coordsOf(key);
    /** @type {unknown} */
    let declared;
    try { declared = coords === null ? null : (consult?.declarationsFor(coords.cardType) ?? null); } catch { declared = null; }
    const row = (Array.isArray(declared) ? declared.filter(isPlainObject) : [])
      .find((r) => /** @type {{ field: unknown }} */ (r).field === coords?.field);
    const split = row === undefined
      ? null
      : splitOutputKey(/** @type {{ outputKey?: unknown }} */ (row).outputKey);
    if (split === null || providersOf(split[0]).length === 0) {
      unapplied.push({ key, value, reason: 'unknown_key' });
    } else {
      resolved.push({ key, value, entityId: coords?.entityId ?? '', collection: split[0], leaf: split[1] });
    }
  }

  // PASS 2 — THE PIN CLOSURE, and it is the whole reason an edit can be pinned at all. The
  // runner refuses a step whose choosers are pinned in part, so pinning an EDITED collection
  // drags in every chooser of every step that provides it, and then every chooser of every step
  // that provides one of THOSE, to a fixpoint. A closure that reaches a key the record does not
  // hold cannot be pinned at all, and every override inside it is reported rather than dropped.
  /** @param {string} seedKey @returns {Set<string>|null} */
  const closureFor = (seedKey) => {
    /** @type {Set<string>} */
    const need = new Set();
    /** @type {string[]} */
    const queue = [seedKey];
    while (queue.length > 0) {
      const key = /** @type {string} */ (queue.pop());
      if (need.has(key) || isTransient(key)) continue;
      need.add(key);
      if (!held(key)) return null;
      for (const step of providersOf(key)) queue.push(...step.provides.filter((k) => !need.has(k) && !isTransient(k)));
    }
    return need;
  };

  /** @type {Map<string, Set<string>|null>} */
  const closures = new Map();
  /** @type {Set<string>} */
  const pinKeys = new Set();
  /** @type {typeof resolved} */
  const applicable = [];
  for (const row of resolved) {
    if (!closures.has(row.collection)) closures.set(row.collection, closureFor(row.collection));
    const closure = closures.get(row.collection);
    if (closure === null || closure === undefined) { unapplied.push({ key: row.key, value: row.value, reason: 'step_not_pinnable' }); continue; }
    for (const key of closure) pinKeys.add(key);
    applicable.push(row);
  }

  // PASS 3 — the bag. ⛔ WITH NO APPLICABLE OVERRIDE THE BAG IS EMPTY, which is what makes a
  // dormant layer's re-derivation bit-for-bit today's generation: the caller passes no pins at
  // all and the runner takes its unpinned path. Keys are ASCII-ascending.
  /** @type {Record<string, unknown>} */
  const pins = {};
  for (const key of [...pinKeys].sort(byCodepoint)) pins[key] = structuredClone(readAt(key).value);

  // PASS 4 — THE DM'S VALUE, WRITTEN AT THE DECLARED RECORD PATH OF THE NAMED ENTITY, INSIDE THE
  // CLONE. ⛔ The record is never touched. The entity is found by the join the REGISTER declares for
  // that collection (`npcs` by 'id', `institutions` by 'name' — design §22.4's ruled identity,
  // never a bare `.id`), and a leaf path may carry an ARRAY HOP (`factions[].power`), which is why
  // a write that lands on a literal 'factions[].power' key is the defect this pass removes.
  for (const row of applicable) {
    if (!writeDeclared(pins[row.collection], row.collection, row.leaf, row.entityId, row.value)) {
      unapplied.push({ key: row.key, value: row.value, reason: 'unknown_key' });
    }
  }

  const missing = roster
    .map((step) => ({ step: step.name, keys: step.provides.filter((k) => !held(k)) }))
    .filter((row) => row.keys.length > 0);
  return { pins, missing, unapplied: dedupeByKey(unapplied) };
}

/**
 * (6) ONE RE-DERIVATION. Pure with respect to its arguments.
 *
 * ⛔⛔ THE RUN MEMBER IS NAMED `run`. The create-boundary walker computes its reacher set from the
 * comment- and string-stripped BARE symbol of the real entry, so naming that symbol here would
 * make this leaf an unclassified pipeline reacher. The store leaf binds the real function onto
 * `run` and is the one file of this member that spells it.
 *
 * ⛔ AN EMPTY OR ABSENT LAYER NEVER REACHES THE RUNNER AS AN EMPTY BAG. The pins option is passed
 * only when the bag has an own key, so a fresh generation with no pins is bit-for-bit today's
 * behaviour and the golden cannot move.
 *
 * ⛔ THE BAG IS DEEP-CLONED AGAIN IMMEDIATELY BEFORE THE RUN. The runner spreads the bag into its
 * context AND hands the same object to every step, so a caller that passes an aliased bag can have
 * its own record written through by the run. Cloning severs both channels.
 *
 * @param {unknown} record @param {object} config @param {unknown} layer
 * @param {{ run: Function, getStepMeta: Function }} engine ⛔ INJECTED
 * @param {unknown} declarations the INJECTED declaration set
 * @returns {{ record: unknown,
 *            unapplied: Array<{ key: string, value: unknown, reason: RederiveUnappliedReason }> }}
 *   `unapplied` is ASCII-ascending on `key` and deduplicated. THROWS NEVER for a malformed layer;
 *   it throws only what the engine throws.
 */
export function rederive(record, config, layer, engine, declarations) {
  const { pins, unapplied } = pinsFrom(record, layer, declarations, engine);
  const seed = isPlainObject(record) ? /** @type {{ _seed?: unknown }} */ (record)._seed : undefined;
  const run = /** @type {{ run?: unknown }} */ (engine)?.run;
  const derived = typeof run !== 'function' ? undefined : (Object.keys(pins).length === 0
    ? run(config, null, { seed })
    : run(config, null, { seed, pins: structuredClone(pins) }));
  // ⭐ THE TRACE IS PARTITIONED BY STEP (EM-R5; design §22 ruling 8 as §22.1 correction 4
  //    amends it). A step whose entries are ABOUT a held key contributes the RECORD's run and
  //    every other step the re-derivation's own; with nothing held the leaf returns the derived
  //    array BY IDENTITY, so a dormant layer's re-derivation is still the committed golden.
  const heldKeys = Object.keys(pins);
  const out = /** @type {Record<string, unknown>} */ (isPlainObject(derived) ? derived : {});
  if (heldKeys.length > 0 && Array.isArray(out.simulationTrace)) {
    const kept = /** @type {Record<string, unknown>} */ (isPlainObject(record) ? record : {});
    out.simulationTrace = partitionTrace(
      Array.isArray(kept.simulationTrace) ? kept.simulationTrace : [], out.simulationTrace, heldKeys,
    );
  }
  return { record: derived, unapplied };
}

/**
 * ASCII-ascending on `key`, first row per key kept. The list is built in key order already, so
 * this is the law made explicit rather than a second sort with a second meaning.
 * @template {{ key: string }} T
 * @param {T[]} rows
 * @returns {T[]}
 */
function dedupeByKey(rows) {
  /** @type {Set<string>} */
  const seen = new Set();
  return [...rows].sort((a, b) => byCodepoint(a.key, b.key)).filter((row) => !seen.has(row.key) && seen.add(row.key) !== null);
}
