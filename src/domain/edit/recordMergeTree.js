/**
 * THE PURE TREE MERGE — leaf 1 of two (design §22.2 items 1, 2, 4, 5).
 *
 * `mergeTree(record, R0, R1) -> { value, receipts }`: a three-way merge of one record against two
 * re-derivations, with `R0` as the base. A node IDENTICAL in `R0` and `R1` keeps the RECORD's own
 * value — present or ABSENT. A declared CONSISTENCY GROUP moves WHOLE. A keyed collection merges
 * by its DECLARED key; a keyless one, a key-broken one, a collection under a cross-entry total and
 * an array of scalars are ONE value. ⛔ NOTHING is ever merged by position.
 *
 * PURE: no store, PRNG, clock, locale, I/O; the three arguments are never mutated.
 *
 * ⭐ THE TYPES ARE REAL AND THE VALUES ARE `unknown` ON PURPOSE — the same reason
 * `recordInvariants.js` gives: this leaf merges a GENERATED record a DM may have edited, so no
 * field can be promised by a signature, and every read goes through a TYPE GUARD rather than a
 * cast. `tests/lint/domainAnyCastBaseline.test.js` holds a new `src/domain` file at ZERO
 * suppression debt, and the register's three tables are read through MAPS built from
 * `Object.entries`, so a string key needs no index cast to reach one.
 */
import {
  RECORD_CLASSES, CLASS_EXCEPTIONS, KEYED_COLLECTIONS, ATOMIC_COLLECTIONS, CONSISTENCY_GROUPS,
} from './recordRegister.js';

/**
 * @typedef {Record<string, unknown>} RecordCard  One object of a settlement record.
 * @typedef {string|readonly string[]} KeySpec  One declared key field, or a composite of them.
 * @typedef {{ id: string, taken: boolean }} GroupVerdict
 * @typedef {{ taken: string[], takenWhole: string[], rideAlong: string[], settled: string[],
 *             settledWhole: string[], keptNodes: number, classKept: string[],
 *             atomicTaken: string[], keyBroken: string[], orderMoved: string[],
 *             groups: GroupVerdict[] }} Receipts
 */

/** @param {unknown} value @returns {value is RecordCard} A plain object, never an array. */
function isObj(value) { return typeof value === 'object' && value !== null && !Array.isArray(value); }
/** @template T @param {T} value @returns {T} A private copy; the arguments are never mutated. */
const clone = (value) => (value === undefined ? value : structuredClone(value));
/** @param {unknown} a @param {unknown} b @returns {boolean} Deep equality, ABSENT included. */
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** The register's own path spelling: `[]` means "at every index". */
export const collapse = (/** @type {string} */ path) => path.replace(/\[\d+\]/g, '[]');

/** The register's tables as real maps: a string key reads one with no index cast. */
const CLASS_OF = new Map(Object.entries(RECORD_CLASSES));
const EXCEPTION_OF = new Map(Object.entries(CLASS_EXCEPTIONS));
/** @type {Map<string, KeySpec>} */
const KEY_SPEC_OF = new Map(Object.entries(KEYED_COLLECTIONS));
const ATOMIC = new Set(ATOMIC_COLLECTIONS);
const GROUP_BY_ROOT = new Map(CONSISTENCY_GROUPS.map((group) => [group.root, group]));

/**
 * The two CLASS_EXCEPTIONS classes the node rule keeps from the record WHOLE (§22.2 item 7). It is
 * a declared SET rather than two comparisons because the register declares no `AUTHORED` sub-path
 * TODAY: chained equality against a value the table cannot currently hold is dead text the strict
 * config convicts (TS2367), while the rule itself governs both classes the day one is declared.
 */
const KEPT_BY_CLASS = new Set(['HISTORY', 'AUTHORED']);

/** Walk a dotted path. Array segments are walked by their own index segment. */
const at = (/** @type {unknown} */ root, /** @type {string} */ dotted) => dotted.split('.').reduce(
  (/** @type {unknown} */ node, step) => (isObj(node) || Array.isArray(node)
    ? /** @type {RecordCard} */ (node)[step] : undefined), root);

/** Write a dotted path into a private object; `undefined` DELETES the key rather than writing it. */
const put = (/** @type {RecordCard} */ root, /** @type {string} */ dotted, /** @type {unknown} */ value) => {
  const segs = dotted.split('.');
  const last = segs[segs.length - 1];
  let cur = root;
  for (const step of segs.slice(0, -1)) {
    if (!isObj(cur[step])) cur[step] = {};
    const next = cur[step];
    if (!isObj(next)) return;
    cur = next;
  }
  if (value === undefined) delete cur[last]; else cur[last] = value;
};

/** One entry's declared key, or null when the key is absent — which degrades the collection. */
const keyOfEntry = (/** @type {RecordCard} */ entry, /** @type {KeySpec} */ spec) => {
  const fields = typeof spec === 'string' ? [spec] : spec;
  const values = fields.map((field) => entry[field]);
  if (values.some((value) => value === undefined || value === null)) return null;
  return JSON.stringify(values);
};

/** A collection indexed by its declared key, or null when a key is absent or not unique. */
const indexBy = (/** @type {unknown} */ rows, /** @type {KeySpec} */ spec) => {
  /** @type {Map<string, RecordCard>} */
  const found = new Map();
  for (const entry of Array.isArray(rows) ? rows : []) {
    if (!isObj(entry)) return null;
    const key = keyOfEntry(entry, spec);
    if (key === null || found.has(key)) return null;
    found.set(key, entry);
  }
  return found;
};

/**
 * Count every leaf inside a subtree taken WHOLE, so the honesty figure covers it. Recorded
 * SEPARATELY from the node rule's, so the MIXED census is never polluted by a declared group.
 * @param {unknown} rec @param {unknown} r0 @param {unknown} r1
 * @param {string} path @param {Receipts} r
 */
function accountWhole(rec, r0, r1, path, r) {
  /** @param {unknown} a @param {unknown} b @param {unknown} c @param {string} p */
  const walk = (a, b, c, p) => {
    if (isObj(b) && isObj(c)) {
      for (const k of new Set([...Object.keys(b), ...Object.keys(c)])) {
        walk(isObj(a) ? a[k] : undefined, b[k], c[k], `${p}.${k}`);
      }
    } else if (Array.isArray(b) && Array.isArray(c)) {
      for (let i = 0; i < Math.max(b.length, c.length); i += 1) {
        walk(Array.isArray(a) ? a[i] : undefined, b[i], c[i], `${p}[${i}]`);
      }
    } else if (eq(b, c)) {
      if (!eq(a, b)) r.settledWhole.push(p);
    } else {
      r.takenWhole.push(p);
      if (!eq(a, b)) r.rideAlong.push(p);
    }
  };
  walk(rec, r0, r1, path);
}

/**
 * A DECLARED GROUP MOVES WHOLE. A `members` list rebuilds every OTHER key of the root BY THE NODE
 * RULE first — which is what keeps an order-bearing collection under a group root reporting to
 * `delta.orderMoved` — and only then overwrites the members themselves.
 * @param {{ id: string, root: string, members: readonly string[]|null }} group
 * @param {unknown} rec @param {unknown} r0 @param {unknown} r1
 * @param {string} path @param {Receipts} r @returns {unknown}
 */
function mergeGroup(group, rec, r0, r1, path, r) {
  if (group.members === null) {
    const whole = !eq(r0, r1);
    r.groups.push({ id: group.id, taken: whole });
    if (whole) accountWhole(rec, r0, r1, path, r);
    return whole ? clone(r1) : clone(rec);
  }
  const touched = group.members.some((member) => !eq(at(r0, member), at(r1, member)));
  r.groups.push({ id: group.id, taken: touched });
  /** @type {RecordCard} */
  const out = {};
  const keys = new Set([
    ...Object.keys(isObj(r0) ? r0 : {}), ...Object.keys(isObj(r1) ? r1 : {}),
    ...Object.keys(isObj(rec) ? rec : {}),
  ]);
  for (const key of keys) {
    const value = mergeNode(isObj(rec) ? rec[key] : undefined, isObj(r0) ? r0[key] : undefined,
      isObj(r1) ? r1[key] : undefined, `${path}.${key}`, r);
    if (value !== undefined) out[key] = value;
  }
  for (const member of group.members) {
    if (touched) accountWhole(at(rec, member), at(r0, member), at(r1, member), `${path}.${member}`, r);
    put(out, member, clone(at(touched ? r1 : rec, member)));
  }
  return out;
}

/**
 * A KEYED COLLECTION MERGES BY ITS DECLARED KEY, never by position, and its ORDER is a reading
 * merged three-way: the record's order stands while the two re-derivations agree on the commons,
 * and `R1`'s governs when they do not — the second arm counted in `orderMoved`.
 * @param {KeySpec} spec @param {unknown} rec @param {unknown[]} r0 @param {unknown[]} r1
 * @param {string} path @param {Receipts} r @returns {unknown}
 */
function mergeKeyed(spec, rec, r0, r1, path, r) {
  const k0 = indexBy(r0, spec);
  const k1 = indexBy(r1, spec);
  const kr = indexBy(Array.isArray(rec) ? rec : [], spec);
  if (!k0 || !k1 || !kr) {
    r.keyBroken.push(collapse(path));
    accountWhole(rec, r0, r1, path, r);
    return clone(r1);
  }
  const removed = new Set([...k0.keys()].filter((key) => !k1.has(key)));
  const added = [...k1.keys()].filter((key) => !k0.has(key) && !kr.has(key));
  /** @type {Map<string, unknown>} */
  const entries = new Map();
  for (const key of kr.keys()) {
    if (removed.has(key)) continue;
    entries.set(key, (k0.has(key) || k1.has(key))
      ? mergeNode(kr.get(key), k0.get(key), k1.get(key), `${path}[]`, r)
      : clone(kr.get(key)));
  }
  for (const key of added) entries.set(key, clone(k1.get(key)));
  const common = [...kr.keys()].filter((key) => k0.has(key) && k1.has(key) && !removed.has(key));
  const inCommon = (/** @type {Map<string, RecordCard>} */ index) => [...index.keys()]
    .filter((key) => common.includes(key));
  /** @type {string[]} */
  let order;
  if (!eq(inCommon(k0), inCommon(k1))) {
    r.orderMoved.push(collapse(path));
    order = [...[...k1.keys()].filter((key) => entries.has(key)),
      ...[...kr.keys()].filter((key) => entries.has(key) && !k1.has(key))];
  } else {
    order = [...kr.keys()].filter((key) => entries.has(key));
    const r1keys = [...k1.keys()];
    for (const key of added) {
      let anchor = -1;
      for (let j = r1keys.indexOf(key) - 1; j >= 0; j -= 1) {
        const seat = order.indexOf(r1keys[j]);
        if (seat >= 0) { anchor = seat; break; }
      }
      order.splice(anchor + 1, 0, key);
    }
  }
  return order.map((key) => entries.get(key));
}

/**
 * THE NODE RULE, in the order §6's transition table applies it.
 * @param {unknown} rec @param {unknown} r0 @param {unknown} r1
 * @param {string} path @param {Receipts} r @returns {unknown}
 */
function mergeNode(rec, r0, r1, path, r) {
  const here = collapse(path);
  const exception = EXCEPTION_OF.get(here);
  if (exception !== undefined && KEPT_BY_CLASS.has(exception)) { r.classKept.push(here); return clone(rec); }
  if (eq(r0, r1)) {
    r.keptNodes += 1;
    if (!eq(rec, r0)) r.settled.push(path);
    return clone(rec);
  }
  const group = GROUP_BY_ROOT.get(here);
  if (group && (isObj(r0) || isObj(r1))) return mergeGroup(group, rec, r0, r1, path, r);
  if (Array.isArray(r0) && Array.isArray(r1)) {
    const spec = KEY_SPEC_OF.get(here);
    if (spec !== undefined && !ATOMIC.has(here)) return mergeKeyed(spec, rec, r0, r1, path, r);
    r.atomicTaken.push(here);
    accountWhole(rec, r0, r1, path, r);
    return clone(r1);
  }
  if (isObj(r0) && isObj(r1)) {
    /** @type {RecordCard} */
    const out = {};
    const keys = new Set([...Object.keys(r0), ...Object.keys(r1),
      ...(isObj(rec) ? Object.keys(rec) : [])]);
    for (const key of keys) {
      const value = mergeNode(isObj(rec) ? rec[key] : undefined, r0[key], r1[key],
        path ? `${path}.${key}` : key, r);
      if (value !== undefined) out[key] = value;
    }
    return out;
  }
  r.taken.push(path);
  if (!eq(rec, r0)) r.rideAlong.push(path);
  return clone(r1);
}

/** The accounting shape the merge fills, empty. @returns {Receipts} */
export function newReceipts() {
  return {
    taken: [], takenWhole: [], rideAlong: [], settled: [], settledWhole: [], keptNodes: 0,
    classKept: [], atomicTaken: [], keyBroken: [], orderMoved: [], groups: [],
  };
}

/**
 * Merge every READING of the record against the two re-derivations. Keys whose CLASS is HELD,
 * AUTHORED, HISTORY, CONSTANT or unknown are taken from the RECORD untouched; WORLD keys are the
 * input and take `R1`'s. ⛔ THE RECORD IS THE WRITE BASE: a TOP-LEVEL key present in `record` is
 * present in the result, whatever the two re-derivations carry.
 * @param {RecordCard} record @param {RecordCard} R0 @param {RecordCard} R1
 * @returns {{ value: RecordCard, receipts: Receipts }}
 */
export function mergeTree(record, R0, R1) {
  const receipts = newReceipts();
  const rec = clone(record); const r0 = clone(R0); const r1 = clone(R1);
  /** @type {RecordCard} */
  const out = {};
  for (const key of new Set([...Object.keys(rec), ...Object.keys(r0), ...Object.keys(r1)])) {
    const cls = CLASS_OF.get(key);
    if (cls === 'WORLD') { out[key] = clone(r1[key] !== undefined ? r1[key] : rec[key]); continue; }
    if (cls !== 'READING') { if (rec[key] !== undefined) out[key] = clone(rec[key]); continue; }
    const value = mergeNode(rec[key], r0[key], r1[key], key, receipts);
    if (value !== undefined) out[key] = value;
  }
  return { value: out, receipts };
}

export const __internals = { at, put, mergeNode, collapse };
