/**
 * registry.js — THE DECREE REGISTRY, PURE (EM-C1, wave 2; ARCH §1 and §2, design §2.5,
 * §2.5a, §11, §12.1 and §20.3).
 *
 * The estate's single writer of the `decrees` key (§P4: "exactly one writer per state").
 * Seven verbs and one reading, all pure: every one takes a registry and returns a NEW
 * frozen registry, reads no clock, takes no draw, mints no id and mutates nothing it was
 * handed. The leaf lands DARK: no writer calls it, no consumer imports it, zero importers
 * at this tip, and EM-C4b's slice actions are its first caller.
 *
 * ⛔ THE CATALOGUES ARE ARGUMENTS, AND THAT IS MEASURED RATHER THAN CHOSEN. This leaf
 * imports ONE module, `../deterministicSort.js`. It does not import `./operations.js`:
 * `tests/domain/editOperations.test.js` case A6 pins the op catalogue's importer roster
 * EXACT in both directions at one row (`src/store/editSlice.js`), the same roster's
 * second-order arm in `tests/domain/editDeclarations.test.js` pins it again, and
 * `tests/lint/editMutationPath.walker.test.js` convicts BY NAME any `src/` module outside
 * the declared edit path that statically imports `makeOp`, `validateOp`, `OP_TYPES` or
 * `applyEdit`. A registry that imported the catalogue would be a second mutation path by
 * the walker's own predicate. So `resolveDecree` is handed the catalogues it resolves
 * against, exactly as EM-C2's engine is handed `OP_TYPES` (its §5 clause item 2).
 *
 * ⛔ THE ENTRY IS THE SHAPE EM-C2's §5 DECLARES AND ARCH §2 TYPES, AND NOTHING ELSE.
 * `id`, `op`, `status`, `addedBy`, `orderIndex`, `orderedAt` are written on every entry;
 * `when`, `appliedAt`, `tickRef`, `chronicleRef`, `overrode`, `followsFrom`,
 * `surveyorCredit` and `withdrawnReason` are OPTIONAL and their absence is a fact.
 * ARCH §2's optional-field spelling is SUPERSEDED for `Op` by `types.js`'s own header and
 * it STANDS for `Decree`: design §20.3 makes absence meaningful ("absent on an entry the
 * DM withdrew by hand") and EM-C2's reader contract narrows every absent key to a stated
 * default. A field EM-C2's §5 block and ARCH §2 do not both declare is not invented here.
 *
 * ⛔ TWO ORDERS, ONE FIELD, NO SECOND CLASSIFIER. `orderIndex` is the DM's own list
 * position: `stage` assigns the next one and `reorder` permutes the PENDING entries over
 * the index values they already occupy, so an applied entry never loses its place
 * (design §2.5a: "application never deletes an entry"). `compareDecrees` is the READING
 * of that field under design §11's schedule — `when` class, tick, season, then
 * `orderIndex`, then `id` — and it is spelled key-for-key as EM-C2's own fold order, so
 * the guards judge the sequence the tick will apply.
 *
 * ⛔ THE REGISTRY NEVER REFUSES OUT LOUD AND NEVER THROWS. A verb that cannot apply
 * returns the registry unchanged in content; the caller reads the entry's own `status` to
 * know what it may offer, which is the registry's own data and not a second authority
 * (design §12's one-refusal-site rule). Design §9 is the tie-break at every skip: a false
 * warning costs more trust than a missing one.
 */

/** @typedef {import('./types.js').Op} Op */

import { compareCodepoint } from '../deterministicSort.js';

/**
 * @typedef {'applied'|'pending'|'withdrawn'} DecreeStatus
 * @typedef {'dm'|'guard'|'surveyor'} DecreeAuthor
 * @typedef {{ kind: string, missing: string, was: string }} WithdrawnReason
 * @typedef {{ ok: true }|{ ok: false, missing: string, was: string }} Resolution
 * @typedef {{ opTypes: Record<string, unknown>, pools: Record<string, unknown> }} DecreeCatalogues
 *
 * @typedef {{ id: string, op: Op, status: DecreeStatus, addedBy: DecreeAuthor,
 *   orderIndex: number, orderedAt: string, when?: { tick?: number, season?: string },
 *   appliedAt?: string, tickRef?: string, chronicleRef?: string, overrode?: string[],
 *   followsFrom?: string[], surveyorCredit?: number,
 *   withdrawnReason?: WithdrawnReason }} Decree
 */

/** The closed status vocabulary (design §2.5; ARCH §2's `DecreeStatus`). Codepoint order. */
export const DECREE_STATUSES = Object.freeze(/** @type {const} */ (['applied', 'pending', 'withdrawn']));

/** Who staged an entry (ARCH §2's `Decree.addedBy`; design §3 and §11's Surveyor row). */
export const DECREE_AUTHORS = Object.freeze(/** @type {const} */ (['dm', 'guard', 'surveyor']));

/**
 * The withdrawal-reason FAMILIES (design §20.3). One member today, and the vocabulary is
 * the partition's definition rather than this wave's usage: a hand withdrawal carries NO
 * `withdrawnReason` at all, which is why "the DM withdrew it" is not a member here.
 */
export const WITHDRAWN_REASON_KINDS = Object.freeze(/** @type {const} */ (['vocabulary-moved']));

/**
 * What a stale entry points at (design §20.3), codepoint order. TWO of the five are
 * REACHABLE at this tip and three are not, exactly as `OP_STAGES` carries both members
 * while EM-B1a uses one: the op catalogue's only vocabulary-bearing payload specs are
 * `pool` and `enum`, so `op-type` and `pool-value` fire and `event`, `fork` and `outcome`
 * wait for the members that mint their spec kinds (EM-E4's registered forks and their
 * outcome words, EM-E6's catalogue events). Minting this union half-populated would force
 * those members to edit a frozen constant, which is the second-home mistake.
 */
export const RESOLUTION_MISSING_KINDS = Object.freeze(
  /** @type {const} */ (['event', 'fork', 'op-type', 'outcome', 'pool-value']),
);

const APPLIED = DECREE_STATUSES[0];
const PENDING = DECREE_STATUSES[1];
const WITHDRAWN = DECREE_STATUSES[2];
const MISSING_OP_TYPE = RESOLUTION_MISSING_KINDS[2];
const MISSING_POOL_VALUE = RESOLUTION_MISSING_KINDS[4];

/** The two payload-spec kinds that NAME a catalogue. `operations.js` keeps its own
 *  `PAYLOAD_SPEC_KINDS` module-private, so these two words are spelled here and case A8
 *  asserts them SET-EQUAL to the live catalogue's vocabulary-bearing kinds. */
const POOL_SPEC = 'pool';
const ENUM_SPEC = 'enum';

/** @param {unknown} value @returns {value is Record<string, unknown>} a plain object, never an array and never null */
function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** @param {unknown} value @returns {value is string} a non-empty string */
function isName(value) {
  return typeof value === 'string' && value.length > 0;
}

/** @param {unknown} value @returns {value is Record<string, unknown>} an entry this module will read or write */
function isEntry(value) {
  return isPlainObject(value) && isName(value.id)
    && isPlainObject(value.op) && isName(value.op.type);
}

/** @param {unknown} registry @returns {readonly unknown[]} the rows, never mutated */
function rowsOf(registry) {
  return Array.isArray(registry) ? registry : [];
}

/** @param {unknown} row @returns {unknown} a malformed row is carried INERT, never repaired and never dropped */
function sealRow(row) {
  return isEntry(row) ? Object.freeze({ ...row }) : row;
}

/** @param {readonly unknown[]} rows @returns {readonly Decree[]} a NEW frozen registry */
function sealRegistry(rows) {
  return /** @type {readonly Decree[]} */ (Object.freeze(rows.map(sealRow)));
}

/** @param {unknown} row @returns {string} */
function idOf(row) {
  return isEntry(row) && typeof row.id === 'string' ? row.id : '';
}

/** @param {unknown} row @returns {number} an absent or non-finite index reads 0 (EM-C2 §6) */
function orderIndexOf(row) {
  const raw = isPlainObject(row) ? row.orderIndex : undefined;
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : 0;
}

/** @param {unknown} row @returns {{ cls: number, tick: number, season: string }} design §11's schedule */
function whenOf(row) {
  const when = isPlainObject(row) && isPlainObject(row.when) ? row.when : null;
  const tick = when && typeof when.tick === 'number' && Number.isFinite(when.tick) ? when.tick : null;
  const season = when && isName(when.season) ? when.season : '';
  if (tick !== null) return { cls: 1, tick, season };
  if (season) return { cls: 2, tick: 0, season };
  return { cls: 0, tick: 0, season: '' };
}

/**
 * THE READING ORDER, spelled key-for-key as EM-C2's fold order (its §6 "Ordering and
 * precedence"): `when` class ascending (0 absent, 1 tick-scheduled, 2 season-only), then
 * `when.tick`, then `when.season` by `compareCodepoint`, then `orderIndex`, then `id`.
 * Total on any two rows, so a shuffle never moves the result.
 * @param {unknown} left @param {unknown} right @returns {number}
 */
export function compareDecrees(left, right) {
  const a = whenOf(left);
  const b = whenOf(right);
  if (a.cls !== b.cls) return a.cls - b.cls;
  if (a.tick !== b.tick) return a.tick - b.tick;
  const bySeason = compareCodepoint(a.season, b.season);
  if (bySeason !== 0) return bySeason;
  const byIndex = orderIndexOf(left) - orderIndexOf(right);
  if (byIndex !== 0) return byIndex;
  return compareCodepoint(idOf(left), idOf(right));
}

/**
 * The registry in its reading order. A READING, never a write: the rows come back by the
 * same reference and only the array is frozen.
 * @param {unknown} registry @returns {readonly Decree[]}
 */
export function orderedDecrees(registry) {
  return /** @type {readonly Decree[]} */ (Object.freeze([...rowsOf(registry)].sort(compareDecrees)));
}

/** @param {readonly unknown[]} rows @returns {number} one past the highest index any row holds */
function nextIndex(rows) {
  let next = 0;
  for (const row of rows) if (isEntry(row)) next = Math.max(next, orderIndexOf(row) + 1);
  return next;
}

/**
 * THE ONE REFUSAL SITE for "pending only". `withdraw`, `reopen` and `markApplied` all
 * reach their entry through it, so the applied-is-read-only law is tested once.
 * @param {unknown} registry @param {unknown} entryId
 * @param {(row: Record<string, unknown>) => Record<string, unknown>} amend
 * @returns {readonly Decree[]}
 */
function amendPending(registry, entryId, amend) {
  const rows = rowsOf(registry);
  if (!isName(entryId)) return sealRegistry(rows);
  return sealRegistry(rows.map((row) => (
    isEntry(row) && row.id === entryId && row.status === PENDING ? amend(row) : row
  )));
}

/**
 * Stage one op as a new PENDING entry at the end of the DM's list.
 *
 * PURE: the id, the author and the timestamp are the CALLER's (HZ-STAMP — a clock is read
 * in the command that writes it), and this module reads neither clock nor stream.
 * REFUSED, with the registry returned unchanged: a `meta.id` that is not a non-empty
 * string, an `orderedAt` that is not a non-empty string, an `op` that is not a plain
 * object with a string `type`, an `addedBy` PRESENT but outside `DECREE_AUTHORS`
 * (defaulting a bad author would misattribute an entry), or an id already in the registry.
 * An ABSENT `addedBy` reads `dm`.
 *
 * @param {unknown} registry @param {unknown} op @param {unknown} meta
 * @returns {readonly Decree[]}
 */
export function stage(registry, op, meta) {
  const rows = rowsOf(registry);
  const bag = isPlainObject(meta) ? meta : {};
  const authors = /** @type {readonly unknown[]} */ (DECREE_AUTHORS);
  const addedBy = bag.addedBy === undefined ? DECREE_AUTHORS[0] : bag.addedBy;
  if (!isName(bag.id) || !isName(bag.orderedAt) || !authors.includes(addedBy)) return sealRegistry(rows);
  if (!isPlainObject(op) || !isName(op.type)) return sealRegistry(rows);
  if (rows.some((row) => idOf(row) === bag.id)) return sealRegistry(rows);
  /** @type {Record<string, unknown>} */
  const entry = {
    id: bag.id, op, status: PENDING, addedBy, orderIndex: nextIndex(rows), orderedAt: bag.orderedAt,
  };
  if (isPlainObject(bag.when)) entry.when = bag.when;
  if (Array.isArray(bag.followsFrom)) entry.followsFrom = [...bag.followsFrom];
  if (typeof bag.surveyorCredit === 'number' && Number.isFinite(bag.surveyorCredit)) {
    entry.surveyorCredit = bag.surveyorCredit;
  }
  return sealRegistry([...rows, entry]);
}

/**
 * Move one PENDING entry to `toIndex` in the DM's list (design §2.5's up/down, and the
 * registry page's move). The pending entries are permuted over the index values they
 * ALREADY occupy, so every applied and withdrawn entry keeps its own place and no index
 * is minted or retired. `toIndex` is clamped into the pending list; a non-finite one, an
 * unknown id and a list of fewer than two pending entries each leave the registry as it is.
 *
 * @param {unknown} registry @param {unknown} entryId @param {unknown} toIndex
 * @returns {readonly Decree[]}
 */
export function reorder(registry, entryId, toIndex) {
  const rows = rowsOf(registry);
  const pending = rows
    .filter((row) => isEntry(row) && row.status === PENDING)
    .sort((a, b) => (orderIndexOf(a) - orderIndexOf(b)) || compareCodepoint(idOf(a), idOf(b)));
  const from = pending.findIndex((row) => idOf(row) === entryId);
  if (from < 0 || pending.length < 2 || typeof toIndex !== 'number' || !Number.isFinite(toIndex)) {
    return sealRegistry(rows);
  }
  const slots = pending.map(orderIndexOf);
  const to = Math.min(Math.max(Math.trunc(toIndex), 0), pending.length - 1);
  const moved = pending.filter((_, at) => at !== from);
  moved.splice(to, 0, pending[from]);
  /** @type {Map<string, number>} */
  const assigned = new Map(moved.map((row, at) => [idOf(row), slots[at]]));
  return sealRegistry(rows.map((row) => {
    const slot = assigned.get(idOf(row));
    return isEntry(row) && slot !== undefined ? { ...row, orderIndex: slot } : row;
  }));
}

/** @param {unknown} reason @returns {WithdrawnReason|null} design §20.3's shape, or nothing */
function withdrawnReasonOf(reason) {
  if (!isPlainObject(reason)) return null;
  const kinds = /** @type {readonly unknown[]} */ (WITHDRAWN_REASON_KINDS);
  const missing = /** @type {readonly unknown[]} */ (RESOLUTION_MISSING_KINDS);
  if (!kinds.includes(reason.kind) || !missing.includes(reason.missing) || !isName(reason.was)) return null;
  return /** @type {WithdrawnReason} */ (Object.freeze({
    kind: String(reason.kind), missing: String(reason.missing), was: reason.was,
  }));
}

/**
 * Withdraw one PENDING entry. It is KEPT for the record with its original words and its
 * own `orderIndex` (design §2.5). `withdrawnReason` is written only when `reason` is
 * design §20.3's exact shape and is ABSENT otherwise, which is what says the DM withdrew
 * it by hand. There is no un-withdraw verb: §20.3's pencil RESTAGES a withdrawn entry as
 * a new one through `stage`, and the withdrawn row stays. An applied entry is history.
 *
 * @param {unknown} registry @param {unknown} entryId @param {unknown} [reason]
 * @returns {readonly Decree[]}
 */
export function withdraw(registry, entryId, reason) {
  return amendPending(registry, entryId, (row) => {
    const clean = withdrawnReasonOf(reason);
    /** @type {Record<string, unknown>} */
    const next = { ...row, status: WITHDRAWN };
    if (clean) next.withdrawnReason = clean;
    return next;
  });
}

/**
 * Save a reopened card back onto its PENDING entry: the op is replaced and the entry
 * returns to exactly its place in the order (design §2.5a). An APPLIED entry reopens
 * READ-ONLY, so this leaves it untouched; only a rewind returns it to pending (design
 * §12's product ruling, THE PROMISE).
 *
 * @param {unknown} registry @param {unknown} entryId @param {unknown} op
 * @returns {readonly Decree[]}
 */
export function reopen(registry, entryId, op) {
  if (!isPlainObject(op) || !isName(op.type)) return sealRegistry(rowsOf(registry));
  return amendPending(registry, entryId, (row) => ({ ...row, op }));
}

/**
 * Mark one PENDING entry applied at a tick. `appliedAt` and `tickRef` are required and
 * the CALLER's; `chronicleRef` is written only when supplied, because the chronicle line
 * is EM-E2's and does not exist at this wave. The entry keeps its `orderIndex`.
 *
 * @param {unknown} registry @param {unknown} entryId @param {unknown} meta
 * @returns {readonly Decree[]}
 */
export function markApplied(registry, entryId, meta) {
  const bag = isPlainObject(meta) ? meta : {};
  if (!isName(bag.appliedAt) || !isName(bag.tickRef)) return sealRegistry(rowsOf(registry));
  return amendPending(registry, entryId, (row) => {
    /** @type {Record<string, unknown>} */
    const next = { ...row, status: APPLIED, appliedAt: bag.appliedAt, tickRef: bag.tickRef };
    if (isName(bag.chronicleRef)) next.chronicleRef = bag.chronicleRef;
    return next;
  });
}

/**
 * THE REWIND's registry half (design §12.1; ARCH §1's own parenthetical). `undoLastPulse`
 * restores a whole-state snapshot whose registry ALREADY holds that tick's decrees as
 * pending, in order; this re-appends every entry staged after the tick, taken from the
 * pre-undo registry, so nothing staged later is lost and nothing is reordered: every
 * entry keeps its own `orderIndex` verbatim. An id present in BOTH takes the RESTORED
 * entry, because the snapshot is the authority for anything the tick touched and its
 * chronicle line is retracted. A row of `laterStaged` that is not an entry is skipped:
 * that argument is computed by the caller, not carried from a save.
 *
 * @param {unknown} restoredRegistry @param {unknown} laterStaged
 * @returns {readonly Decree[]}
 */
export function revertTick(restoredRegistry, laterStaged) {
  const restored = rowsOf(restoredRegistry);
  /** @type {Set<string>} */
  const held = new Set();
  for (const row of restored) if (isEntry(row)) held.add(idOf(row));
  const appended = rowsOf(laterStaged).filter((row) => isEntry(row) && !held.has(idOf(row)));
  return sealRegistry([...restored, ...appended]);
}

/** @param {string} missing @param {string} was @returns {Resolution} */
function refusal(missing, was) {
  return /** @type {Resolution} */ (Object.freeze({ ok: false, missing, was }));
}

/**
 * @param {unknown} spec @param {unknown} value @param {Record<string, unknown>} pools
 * @returns {string|null} the word that failed, or nothing
 */
function staleWord(spec, value, pools) {
  if (!isPlainObject(spec)) return null;
  if (spec.kind === POOL_SPEC) {
    if (!isName(spec.pool)) return null;
    if (!Object.hasOwn(pools, spec.pool)) return spec.pool;
    const live = /** @type {readonly unknown[]} */ (Array.isArray(pools[spec.pool]) ? pools[spec.pool] : []);
    return value === undefined || live.includes(value) ? null : String(value);
  }
  if (spec.kind === ENUM_SPEC) {
    const declared = /** @type {readonly unknown[]} */ (Array.isArray(spec.values) ? spec.values : []);
    return value === undefined || declared.includes(value) ? null : String(value);
  }
  return null;
}

/**
 * Resolve ONE entry against the live catalogues (design §20.3). PURE and TOTAL: it judges
 * and never writes, so the caller that withdraws on a refusal is the one refusal site for
 * that act. `catalogues` is `{ opTypes, pools }` — the op catalogue's rows and the live
 * pool values — handed in, never imported. The first failure in `compareCodepoint` order
 * of the payload field names wins, so two runs over one entry answer alike.
 *
 * Status is not read here: design §20.3 resolves PENDING entries on load and at the head
 * of the tick, and an applied entry is history. The caller selects; this judges.
 *
 * @param {unknown} entry @param {unknown} catalogues
 * @returns {Resolution}
 */
export function resolveDecree(entry, catalogues) {
  const bag = isPlainObject(catalogues) ? catalogues : {};
  const opTypes = isPlainObject(bag.opTypes) ? bag.opTypes : {};
  const pools = isPlainObject(bag.pools) ? bag.pools : {};
  if (!isEntry(entry) || !isPlainObject(entry.op) || !isName(entry.op.type)) {
    return refusal(MISSING_OP_TYPE, '');
  }
  const type = entry.op.type;
  if (!Object.hasOwn(opTypes, type)) return refusal(MISSING_OP_TYPE, type);
  const decl = opTypes[type];
  const specs = isPlainObject(decl) && isPlainObject(decl.payload) ? decl.payload : {};
  const payload = isPlainObject(entry.op.payload) ? entry.op.payload : {};
  for (const field of Object.keys(specs).sort(compareCodepoint)) {
    const stale = staleWord(specs[field], payload[field], pools);
    if (stale !== null) return refusal(MISSING_POOL_VALUE, stale);
  }
  return /** @type {Resolution} */ (Object.freeze({ ok: true }));
}
