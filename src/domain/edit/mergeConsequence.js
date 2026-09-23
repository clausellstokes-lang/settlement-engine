/**
 * THE MERGE — the consequence of ONE edit, applied to the saved record (design §22.1–§22.4).
 *
 * `mergeConsequence(record, R0, R1, { edit, base }) -> { record, delta }`
 *
 *   record  THE WRITE BASE — the saved record with the op's own writes already applied. The
 *           result is built FROM IT: a top-level key present in `record` is present in the result,
 *           and every HELD / AUTHORED / HISTORY / CONSTANT subtree is byte-identical to the
 *           record's except the declared MIRROR and RECEIPT sub-paths, which are RECOMPUTED
 *           (never merged).
 *   R0      the re-derivation of the record as it stood BEFORE the edit
 *   R1      the re-derivation of the record as it stands AFTER it
 *   edit    the op's own receipt — ONE edit — or `null` for none
 *   base    the record before the edit (the store's snapshot); defaults to `record`
 *
 * ⛔ THERE IS NO BATCH ENTRY POINT. This module exports ONE merge function, it takes ONE edit, an
 * array THROWS, and the chain is expressed in the RETURN (`delta.nextBase`): a second edit is only
 * reachable from a completed first call, against the record that call produced (§22.2 item 6).
 *
 * This leaf carries the POST-PASSES (mirrors, the receipt, the invariant guard and its escalation)
 * and the DELTA model; the pure tree merge is `recordMergeTree.js`.
 *
 * PURE: no store, PRNG, clock, locale or I/O; no argument is mutated.
 */
import { CLASS_EXCEPTIONS, RECORD_CLASSES, CONSISTENCY_GROUPS } from './recordRegister.js';
import { recordInvariants, CHECK_META, CROSS_KEY_CHECKS } from './recordInvariants.js';
import { fingerprintPowerEconomyInput } from '../../data/economyFingerprint.js';
import { mergeTree, __internals } from './recordMergeTree.js';

/**
 * @typedef {Record<string, unknown>} RecordCard  One object of a settlement record.
 * @typedef {{ id: string, path: string, message: string, kind: string,
 *             keys: readonly string[] }} Violation  As `recordInvariants` stamps it.
 * @typedef {{ id: string, opType: string, touched?: string[], orphaned?: object[] }} EditReceipt
 * @typedef {{ path: string, before: unknown, now: unknown,
 *             editAlone: { from: unknown, to: unknown } }} MovedReading
 * @typedef {{ violation: string, step: number|string, scope: string,
 *             group: string|null, cured: boolean }} Escalation
 * @typedef {{ appliedEdit: string|null, readings: MovedReading[], orderMoved: string[],
 *             escalations: Escalation[], orphaned: object[], groupsTaken: string[],
 *             groupsKept: number, honesty: { taken: number, rideAlong: number },
 *             nextBase: RecordCard }} MergeDelta
 * @typedef {{ step: number|string, scope: readonly string[], group: string|null }} LadderStep
 */

const { at, put } = __internals;
/** @template T @param {T} value @returns {T} */
const clone = (value) => (value === undefined ? value : structuredClone(value));
/** @param {unknown} value @returns {value is RecordCard} A plain object, never an array. */
function isObj(value) { return typeof value === 'object' && value !== null && !Array.isArray(value); }
/** @param {string} path @returns {string} An index segment read as an ordinary path step. */
const dotted = (path) => path.replace(/\[(\d+)\]/g, '.$1');
/** @param {Violation} violation @returns {string} One violation's identity. */
const vkey = (violation) => `${violation.id}@${violation.path}`;

/** Every top-level READING key, in the register's declaration order — the ladder's last step. */
const READING_KEYS = Object.entries(RECORD_CLASSES)
  .filter(([, cls]) => cls === 'READING').map(([key]) => key);

/** The declared MIRROR sub-paths. A mirror is RECOMPUTED after the merge, never merged. */
const MIRROR_PATHS = Object.entries(CLASS_EXCEPTIONS)
  .filter(([, cls]) => cls === 'MIRROR').map(([path]) => path);

/**
 * `factions[].members[]` — a complete copy of the NPC its `id` names, and a MIRROR by class: a pure
 * function of held facts, RECOMPUTED after the merge, never merged. A member whose id the merged
 * roster no longer carries is left exactly as the record has it (removing a person is the op's
 * cascade, never the merge's).
 * @param {RecordCard} merged @returns {number} members rewritten
 */
export function recomputeMirrors(merged) {
  if (!MIRROR_PATHS.includes('factions[].members[]')) return 0;
  const factions = merged.factions;
  const npcs = merged.npcs;
  if (!Array.isArray(factions) || !Array.isArray(npcs)) return 0;
  /** @type {Map<string, RecordCard>} */
  const byId = new Map();
  for (const npc of npcs) if (isObj(npc) && npc.id !== undefined) byId.set(String(npc.id), npc);
  let rewritten = 0;
  for (const faction of factions) {
    if (!isObj(faction) || !Array.isArray(faction.members)) continue;
    faction.members = faction.members.map((member) => {
      const source = isObj(member) ? byId.get(String(member.id)) : undefined;
      if (source === undefined) return member;
      rewritten += 1;
      return clone(source);
    });
  }
  return rewritten;
}

/**
 * The one declared RECEIPT — `powerStructure.economyInputFingerprint` — recomputed LAST, over the
 * merged record. ⛔ It is never taken from `R1`: wherever a declared group kept the record's own
 * economy, `R1`'s digest is a digest of inputs the merged record does not hold.
 * @param {RecordCard} merged @returns {boolean} whether the digest moved
 */
export function recomputeReceipts(merged) {
  const power = merged.powerStructure;
  const economy = merged.economicState;
  if (!isObj(power) || !isObj(economy)) return false;
  const before = power.economyInputFingerprint;
  const after = fingerprintPowerEconomyInput(
    economy, merged.tier !== undefined ? merged.tier : economy.tier,
  );
  power.economyInputFingerprint = after;
  return before !== after;
}

/**
 * The SMALLEST declared consistency group whose extent contains `path`, or null.
 * @param {string} path @returns {{ id: string, root: string, members: readonly string[]|null }|null}
 */
export function enclosingGroup(path) {
  /** @type {{ id: string, root: string, members: readonly string[]|null }|null} */
  let best = null;
  for (const group of CONSISTENCY_GROUPS) {
    const root = group.root.replace(/\[\]$/, '');
    if (path !== root && !path.startsWith(`${root}.`) && !path.startsWith(`${root}[`)) continue;
    if (best === null || group.root.length > best.root.length) best = group;
  }
  return best;
}

/**
 * ONE VIOLATION'S DETERMINISTIC LADDER (§22.2 item 3). Step 1 is the enclosing declared group —
 * or, for a CROSS-KEY check, BOTH of its keys, which is why this reads the violation's own `keys`
 * and the register's DERIVED `CROSS_KEY_CHECKS` rather than re-deriving either: a violation of a
 * check that declares independent ARMS carries the keys of the arm that fired, never the union.
 * Step 2 is the violated path's top-level key(s); step 3 is every READING key.
 * @param {Violation} violation @returns {LadderStep[]}
 */
function ladderFor(violation) {
  const meta = CHECK_META[violation.id];
  const declared = Array.isArray(violation.keys) && violation.keys.length > 0
    ? [...violation.keys] : [...(meta ? meta.keys : [])];
  const keys = declared.length > 0 ? declared : [violation.path.split(/[.[]/)[0]];
  /** @type {LadderStep[]} */
  const steps = [];
  if (CROSS_KEY_CHECKS.includes(violation.id)) steps.push({ step: 1, scope: keys, group: null });
  else {
    const group = enclosingGroup(violation.path);
    if (group !== null) steps.push({ step: 1, scope: [group.root.replace(/\[\]$/, '')], group: group.id });
  }
  steps.push({ step: 2, scope: keys, group: null });
  steps.push({ step: 3, scope: READING_KEYS, group: null });
  return steps;
}

/**
 * Judge the merged record with the town's own invariants and repair it deterministically. A
 * violation the pre-edit record, the edited record or `R1` already carries is EXEMPT (it is not the
 * merge's). Every other one escalates up `ladderFor`, taking its scope from `R1`; it terminates
 * because a generated world agrees with itself. The record is repaired IN PLACE — it is the merge's
 * own private value, never a caller's.
 * @param {RecordCard} merged @param {RecordCard} R1 @param {Set<string>} exempt
 * @returns {Escalation[]}
 */
export function guardMergedRecord(merged, R1, exempt) {
  /** @type {Escalation[]} */
  const escalations = [];
  const live = () => recordInvariants(merged).filter((violation) => !exempt.has(vkey(violation)));
  let outstanding = live();
  /** @type {Set<string>} */
  const settled = new Set();
  while (outstanding.length > 0) {
    const violation = outstanding.find((candidate) => !settled.has(vkey(candidate)));
    if (violation === undefined) break;
    let cured = false;
    for (const rung of ladderFor(violation)) {
      for (const key of rung.scope) {
        const source = clone(at(R1, key));
        if (source === undefined) continue;
        put(merged, key, source);
      }
      recomputeReceipts(merged);
      outstanding = live();
      cured = !outstanding.some((candidate) => vkey(candidate) === vkey(violation));
      escalations.push({
        violation: vkey(violation), step: rung.step, scope: rung.scope.join(','),
        group: rung.group, cured,
      });
      if (cured) break;
    }
    if (!cured) {
      escalations.push({
        violation: vkey(violation), step: 'EXHAUSTED', scope: 'every reading',
        group: null, cured: false,
      });
    }
    settled.add(vkey(violation));
    outstanding = live();
  }
  return escalations;
}

/**
 * THE ONE PUBLIC SURFACE. It takes ONE edit; an ARRAY throws, and the chain is the RETURN.
 * @param {RecordCard} record  the EDITED record — the write base
 * @param {RecordCard} R0      rederive(base)
 * @param {RecordCard} R1      rederive(record)
 * @param {{ edit?: EditReceipt|null, base?: RecordCard }} [options]
 * @returns {{ record: RecordCard, delta: MergeDelta }}
 */
export function mergeConsequence(record, R0, R1, options = {}) {
  const edit = options.edit !== undefined ? options.edit : null;
  const base = options.base !== undefined ? options.base : record;
  if (Array.isArray(edit)) {
    throw new TypeError(
      'mergeConsequence takes ONE edit; apply a sequence one at a time, each against the record '
      + 'the previous call produced (design §22.2 item 6: the chain is the semantics).',
    );
  }
  const { value, receipts } = mergeTree(record, R0, R1);
  recomputeMirrors(value);
  recomputeReceipts(value);
  /** @type {Set<string>} */
  const exempt = new Set([
    ...recordInvariants(base).map(vkey),
    ...recordInvariants(record).map(vkey),
    ...recordInvariants(R1).map(vkey),
  ]);
  const escalations = guardMergedRecord(value, R1, exempt);
  const moved = [...receipts.taken, ...receipts.takenWhole];
  return {
    record: value,
    delta: {
      appliedEdit: edit !== null ? edit.id : null,
      readings: moved.map((path) => ({
        path,
        before: at(record, dotted(path)),
        now: at(value, dotted(path)),
        editAlone: { from: at(R0, dotted(path)), to: at(R1, dotted(path)) },
      })),
      orderMoved: [...new Set(receipts.orderMoved)],
      escalations,
      orphaned: edit !== null && Array.isArray(edit.orphaned) ? edit.orphaned : [],
      groupsTaken: receipts.groups.filter((group) => group.taken).map((group) => group.id),
      groupsKept: receipts.groups.filter((group) => !group.taken).length,
      honesty: { taken: moved.length, rideAlong: receipts.rideAlong.length },
      nextBase: R1,
    },
  };
}
