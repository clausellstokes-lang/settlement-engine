/**
 * tests/domain/mergeLadderHistory.test.js — EM-R8b's five acceptance arms.
 *
 * THE LAW: the merge's escalation ladder repairs a violated invariant by taking a READING key
 * whole from `R1`, and THE PROMISE's immutable lived history is not part of what it takes. Every
 * sub-path the register classes HISTORY keeps the value the merged record already carried, so a
 * repair can neither rewrite, invent nor erase what happened to the saved town.
 *
 * WHAT THIS FILE EXISTS TO PREVENT, MEASURED AT EM-R8's LANDED LEAF: changing a metropolis's
 * terrain to desert made the saved record's `generationCoherenceReceipt.repairs` grow from ONE
 * recorded repair to THREE, two of them repairs a DESERT town's generation had made and this town
 * never lived. Over the config channel's 120 trials the ladder rewrote the lived history in 12,
 * in every one of them because a rung took `generationCoherenceReceipt` whole from `R1`. H2 is
 * that red, standing. (EM-R8's own A5 recorded the same 12 and said the cure was not its own.)
 *
 * THREE CONSTRUCTION RULES (packet §6), each with its own instrument:
 *   1. `it`, `test` and `describe` are bound EXACTLY ONCE each, never re-bound, not even as an
 *      arrow parameter: the sovereignty-lighting census parks a whole file for that alone.
 *   2. Every loop COLLECTS and the arm asserts ONCE after it, because `seedLoopTotality
 *      .walker.test.js` convicts a `for (` line carrying a seed whose body holds a bare `expect(`
 *      and `tests/domain` sits in its shrink-only frozen habitat.
 *   3. Every set an arm iterates is IMPORTED from the register or DERIVED by running the real
 *      generator; no local literal copy of a declaration table.
 *
 * THE STRIDE IS DERIVED FROM `goldenCorpus()` and NO FIXTURE IS COMMITTED — the same 63-row
 * structured sample `tests/domain/recordMerge.test.js`, `tests/domain/mergeLadderHeldKeys.test.js`
 * and `tests/lint/recordRegisterTotality.walker.test.js` derive.
 *
 * CANNOT-CATCH:
 * 1.  THE LAYER CHANNEL. The census here is the CONFIG channel (E7, E8), because that is where
 *     every rung in this corpus fires: `mergeLadderHeldKeys.test.js :: A2` holds the layer
 *     channel at ZERO escalations over its 378 trials, and a ladder that never runs cannot move a
 *     history. If that arm ever reds, this file's population is stale, not its law.
 * 2.  A HISTORY SUB-PATH SPELLED WITH `[]`. The restore addresses a dotted path; no declared
 *     HISTORY row carries an index segment and H1 holds the table to that shape, so the day one
 *     is declared H1 reds and the restore is widened deliberately rather than silently.
 * 3.  THE OTHER DECLARED CLASSES. A MIRROR or RECEIPT sub-path is RECOMPUTED after every rung and
 *     is not restored; that is EM-R8's A3 and A4, not this file's.
 * 4.  THE CONFIG CHANNEL'S OWN REPAIR. What the ladder still leaves live on that channel
 *     (`V-DEFENSE-INST`, `V-EVIDENCE-CONFLICT`) is EM-B2b's seam. This file asserts nothing
 *     about it and pins no count of it.
 */
import { describe, it, expect } from 'vitest';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { getStepMeta } from '../../src/generators/pipeline.js';
import { rederive } from '../../src/domain/edit/dmLayer.js';
import { declarationsFor } from '../../src/domain/edit/fieldDeclarations.js';
import { mergeConsequence, recomputeMirrors, recomputeReceipts } from '../../src/domain/edit/mergeConsequence.js';
import { mergeTree } from '../../src/domain/edit/recordMergeTree.js';
import { CHECK_META } from '../../src/domain/edit/recordInvariants.js';
import { CLASS_EXCEPTIONS, RECORD_CLASSES } from '../../src/domain/edit/recordRegister.js';

const ENGINE = Object.freeze({ run: generateSettlementPipeline, getStepMeta });
const DECLARATIONS = Object.freeze({ declarationsFor });
const EMPTY = Object.freeze({ roots: {}, worldFacts: {}, minted: {}, phantoms: {} });
const SLOW = 300_000;
const RECEIPT = 'generationCoherenceReceipt';

const h = (value) => JSON.stringify(value);
const cl = (value) => structuredClone(value);

/** The declared HISTORY sub-paths, READ FROM THE REGISTER — the leaf reads the same table. */
const HISTORY_PATHS = Object.entries(CLASS_EXCEPTIONS)
  .filter(([, cls]) => cls === 'HISTORY').map(([path]) => path);
/** Every key a rung can ever carry: the checks' declared keys and every READING key. */
const REACHABLE_KEYS = new Set([
  ...Object.values(CHECK_META).flatMap((meta) => (Array.isArray(meta.keys) ? meta.keys : [])),
  ...Object.entries(RECORD_CLASSES).filter(([, cls]) => cls === 'READING').map(([key]) => key),
]);

/** The 63-row structured sample, from `goldenCorpus()` alone. */
function sample63() {
  const all = goldenCorpus();
  const seen = new Set();
  const oneEach = [];
  for (const row of all.slice(0, 504)) {
    const pair = `${row.settType}|${row.terrainOverride}`;
    if (seen.has(pair)) continue;
    seen.add(pair);
    oneEach.push(row);
  }
  return [...oneEach, ...all.slice(504)];
}

/** THE LADDER'S OWN WORK, field by field: the receipt as the DECLARED POST-PASS PIPELINE leaves
 *  it (`mergeTree` then `recomputeMirrors` then `recomputeReceipts`, which is the shape
 *  `mergeLadderHeldKeys.test.js :: A6` proves for every quiet trial) against the receipt the
 *  merge returns. Whatever differs, a rung wrote. */
function fieldsTheRungMoved(pipeline, merged) {
  const fields = new Set([...Object.keys(pipeline[RECEIPT] || {}), ...Object.keys(merged[RECEIPT] || {})]);
  const moved = [];
  for (const field of fields) {
    if (h(pipeline[RECEIPT]?.[field]) === h(merged[RECEIPT]?.[field])) continue;
    moved.push(field);
  }
  return moved.sort();
}

/** THE TWO WORLD-FACT EDITS — the config channel, where every rung of this corpus fires. */
const EDITS = [
  ['E7 terrain to desert', (config) => (config.terrainOverride === 'desert' ? null
    : { ...config, terrainOverride: 'desert' })],
  ['E8 culture to norse', (config) => (config.culture === 'norse' ? null
    : { ...config, culture: 'norse' })],
];

/** THE CENSUS, built ONCE, through the REAL re-derivation and the REAL merge. */
let census = null;
function trials() {
  if (census !== null) return census;
  const rows = [];
  for (const row of sample63()) {
    const { _seed: seed, ...config } = row;
    const key = keyOf(row);
    const base = generateSettlementPipeline(config, null, { seed, customContent: {} });
    const R0 = rederive(base, config, EMPTY, ENGINE, DECLARATIONS).record;
    for (const [label, plan] of EDITS) {
      const edited = plan(config);
      if (edited === null) continue;
      const record = cl(base);
      const R1 = rederive(record, edited, EMPTY, ENGINE, DECLARATIONS).record;
      const out = mergeConsequence(record, cl(R0), cl(R1), { edit: { id: label, opType: label } });
      const merged = out.record;
      const tree = mergeTree(cl(record), cl(R0), cl(R1));
      const pipeline = cl(tree.value);
      recomputeMirrors(pipeline);
      recomputeReceipts(pipeline);
      rows.push({
        key,
        label,
        escalations: out.delta.escalations.length,
        rungTookReceipt: out.delta.escalations
          .some((step) => String(step.scope).split(',').includes(RECEIPT)),
        treeKeptHistory: tree.receipts.classKept.includes(`${RECEIPT}.repairs`),
        recordHistory: h(record[RECEIPT]?.repairs),
        r1History: h(R1[RECEIPT]?.repairs),
        mergedHistory: h(merged[RECEIPT]?.repairs),
        recordCount: (record[RECEIPT]?.repairs || []).length,
        mergedCount: (merged[RECEIPT]?.repairs || []).length,
        rungMoved: fieldsTheRungMoved(pipeline, merged),
      });
    }
  }
  census = rows;
  return census;
}

/** One config-channel merge of one corpus row, with the record's receipt bent by the caller. */
function mergeWithReceipt(bend) {
  const row = sample63().find((candidate) => keyOf(candidate)
    === 'metropolis|germanic|plains|road|civilized|golden-master-v3');
  const { _seed: seed, ...config } = row;
  const base = generateSettlementPipeline(config, null, { seed, customContent: {} });
  const R0 = rederive(base, config, EMPTY, ENGINE, DECLARATIONS).record;
  const desert = { ...config, terrainOverride: 'desert' };
  const R1 = rederive(cl(base), desert, EMPTY, ENGINE, DECLARATIONS).record;
  const record = cl(base);
  bend(record[RECEIPT]);
  const out = mergeConsequence(record, cl(R0), cl(R1), { edit: null });
  return { record, R1, merged: out.record, delta: out.delta };
}

describe('EM-R8b — a rung takes a reading from R1 and never the lived history under it', () => {
  it('H1 · every declared HISTORY sub-path is one the restore can address, under a key a rung takes', () => {
    const unaddressable = HISTORY_PATHS.filter((path) => path.includes('[') || !path.includes('.'));
    const unreachable = HISTORY_PATHS.filter((path) => !REACHABLE_KEYS.has(path.split('.')[0]));
    expect(HISTORY_PATHS.length, 'the register declares at least one HISTORY sub-path, so this arm has a subject').toBeGreaterThan(0);
    expect(unaddressable, 'a HISTORY row the dotted restore cannot address: it carries an index '
      + `segment or no parent key, so a rung's take would carry it along unseen:\n${unaddressable.join('\n')}`).toEqual([]);
    expect(unreachable, 'a HISTORY row under a key no rung can ever take: the restore is dead text '
      + `for it and the class is declared somewhere the ladder never reaches:\n${unreachable.join('\n')}`).toEqual([]);
  });

  it('H2 · the lived history is byte-identical in every trial, and the ladder explains itself', () => {
    const all = trials();
    const moved = all.filter((trial) => trial.mergedHistory !== trial.recordHistory)
      .map((trial) => `${trial.label}  ${trial.key}  the town recorded ${trial.recordCount} repair(s), `
        + `the merge left ${trial.mergedCount}`);
    const took = all.filter((trial) => trial.rungTookReceipt);
    const treeTookToo = took.filter((trial) => !trial.treeKeptHistory)
      .map((trial) => `${trial.label}  ${trial.key}`);
    expect(all.length, 'the config channel of the 63-row stride').toBeGreaterThan(100);
    expect(took.length, 'the trials in which a rung takes the coherence receipt whole from R1, which is the '
      + 'population this member exists for').toBeGreaterThan(0);
    expect(treeTookToo, 'a rung-firing trial in which the TREE MERGE did NOT declare the same sub-path kept '
      + `from the record: the two writers no longer agree about the class:\n${treeTookToo.join('\n')}`).toEqual([]);
    expect(moved, 'THE PROMISE: a saved town\'s lived history moved during a merge. Each line is '
      + `the record's own repairs, then what the merge left:\n${moved.join('\n')}`).toEqual([]);
  }, SLOW);

  it('H3 · the take is attributable: a rung writes nothing the post-pass pipeline had not written', () => {
    const all = trials();
    const took = all.filter((trial) => trial.rungTookReceipt);
    const moved = took.filter((trial) => trial.rungMoved.length > 0)
      .map((trial) => `${trial.label}  ${trial.key}  ${trial.rungMoved.join(', ')}`);
    expect(took.length, 'the rung-firing population, again').toBeGreaterThan(0);
    expect(moved, 'a receipt field a rung wrote over the declared post-pass pipeline. The ladder takes '
      + 'the receipt to repair a READING, and on this corpus the only byte its take has ever changed is '
      + `THE PROMISE's own history:\n${moved.join('\n')}`).toEqual([]);
  }, SLOW);

  it('H4 · three constructed controls: a history is never rewritten, invented or made from absence', () => {
    const planted = [{ type: 'dm-control', subject: 'The Sunken Bell', action: 'kept' }];
    const kept = mergeWithReceipt((receipt) => { receipt.repairs = cl(planted); });
    const empty = mergeWithReceipt((receipt) => { receipt.repairs = []; });
    const absent = mergeWithReceipt((receipt) => { delete receipt.repairs; });
    expect(kept.delta.escalations.some((step) => String(step.scope).split(',').includes(RECEIPT)),
      'the control really drives a rung that takes the receipt, so all three controls have a subject').toBe(true);
    expect((kept.R1[RECEIPT].repairs || []).length, 'and R1 really carries a history of its own to overwrite with')
      .toBeGreaterThan(0);
    expect(kept.merged[RECEIPT].repairs, 'a planted entry no re-derivation writes is kept verbatim').toEqual(planted);
    expect(empty.merged[RECEIPT].repairs, 'a town that recorded no repair is not given R1\'s').toEqual([]);
    expect(Object.prototype.hasOwnProperty.call(absent.merged[RECEIPT], 'repairs'),
      'and absence is history too: a record with no repairs sub-path does not gain one').toBe(false);
  }, SLOW);

  it('H5 · nothing judges the restored history: no invariant check reads it', () => {
    const readers = Object.entries(CHECK_META)
      .filter(([, meta]) => (Array.isArray(meta.paths) ? meta.paths : [])
        .some((path) => HISTORY_PATHS.some((history) => String(path).startsWith(history))))
      .map(([id]) => id);
    expect(Object.keys(CHECK_META).length, 'the check table is live, so this arm reads a real set').toBeGreaterThan(0);
    expect(readers, 'an invariant check reads a declared HISTORY sub-path, so a restored history could '
      + `now contradict a judgment the same record carries:\n${readers.join('\n')}`).toEqual([]);
  });
});
