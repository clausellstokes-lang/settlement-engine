/**
 * tests/domain/recordMerge.test.js — EM-R0c's eight acceptance arms.
 *
 * THE MERGE: the consequence of an edit is the DIFFERENCE between two re-derivations, applied to
 * the record by consistency group (design §22.1–§22.4). Every arm takes `R0` and `R1` as INPUTS,
 * so the whole file runs with the re-derivation seam (EM-R1–EM-R5) still unbuilt: the two
 * re-derivations are BUILT HERE from a generated record, one field at a time, which is what makes
 * each arm a statement about the MERGE rather than about the generator.
 *
 * ⛔ THE STRIDE IS DERIVED FROM `goldenCorpus()`, AND NO FIXTURE IS COMMITTED: one row per
 * `settType|terrainOverride` pair over the first 504 configurations, plus the 21-row tail — the
 * 63-row structured sample this packet's evidence was measured on.
 *
 * ⛔ THE LOOPS COLLECT AND ASSERT ONCE, never `expect` inside the loop body
 * (`tests/lint/seedLoopTotality.walker.test.js`; the precedent is
 * `tests/property/generatorGoldenMaster.test.js`), and every arm proves its SUBJECT is live before
 * it asserts an absence, so no arm can pass on nothing.
 *
 * CANNOT-CATCH:
 * 1.  The merge over the REAL re-derivation. A1–A8 take R0 and R1 as inputs; EM-R1–R5 are unbuilt.
 *     EM-R7's corpus ratchet is the only place the seam and the merge meet.
 * 2.  The 504-trial corpus figures themselves — identity 63/63 through the seam, zero escalations,
 *     the MIXED census, the order arm's 52/504, the 36 % honesty figure. Measured at this compile
 *     (E-3, E-4) and re-measured by EM-R7; not assertable in this file.
 * 3.  The cross-key escalation (step 1 taking BOTH keys). EM-R0b VERSION 3 now supplies `CHECK_META`
 *     and seven derived `CROSS_KEY_CHECKS` (STOP-4 discharged), but THE ARM IS STILL UNEXERCISED
 *     HERE: the prototype instrument is the recon's 25-check version with no cross-key entry, and the
 *     corpus produced ZERO escalations, so nothing measured in this packet depends on it. EM-R7 is
 *     where the ladder meets real cross-key data. ⭐ FROM EM-R8's LANDING THE ARM IS EXERCISED:
 *     `tests/domain/mergeLadderHeldKeys.test.js` drives the ladder over the eight-edit census
 *     through the REAL re-derivation and holds that no rung's scope ever carries a HELD key.
 * 9.  THE `history-age` GROUP'S EFFECT ON THE MERGED VALUE. V14 proves the group arm and the
 *     order arm do not interfere, and that `members: null` would silence the order arm. It does NOT
 *     prove the group changes any merged value here: `history` re-derives faithfully in this corpus
 *     (the record's order never settles away from `R0` — 0 of 693), so the merged `history` is
 *     byte-identical with the member list, with `members: null` in 674 of 693, and with no group at
 *     all in 693 of 693. G8 is PREVENTIVE and its value-population in the 63-row corpus is ZERO.
 * 10. Whether the 3 AGE-MOVING world-fact edits V14 runs are edits the editor will actually offer.
 *     The EM-A1 root-field surface decides whether a DM can reach them.
 * 4.  Whether the four MIXED objects outside a declared group are missing groups. None produced a
 *     conviction; the chair rules, and EM-R7 holds the family to zero.
 * 5.  The byte price. Zero bytes land while nothing imports these leaves; EM-B2a's pre-proof prices
 *     them.
 * 6.  Whether the record's key order matters downstream. This packet preserves it but nothing in
 *     the estate asserts it.
 * 7.  merge∘merge vs merge(both) beyond five pairs. Five were run, one disagrees; all 28 ordered
 *     pairs are EM-R7's.
 * 8.  A DM edit outside the eight-edit corpus. The runtime guard is what covers it, by design.
 * 11. ⭐ WHAT `recomputeReceipts` DOES FROM EM-R8's LANDING, so A7's account is not silently
 *     stale. At this file's own compile the whole of it is A7's: the mirrors recomputed, and the
 *     one declared RECEIPT recomputed over the merged record and never taken from `R1`. EM-R8
 *     gives the same function a SECOND act, before that body runs: a module-local restatement of
 *     the coherence receipt's two PROSE-COUNT evidence rows -- `finalGraph`'s NPC and
 *     relationship counts and `narrative`'s historical-event count -- from the MERGED record's
 *     own rosters, declared a MIRROR sub-path in `recordRegister.js :: CLASS_EXCEPTIONS`. It
 *     moves ONLY the digits those two patterns capture, it never reads or writes
 *     `generationCoherenceReceipt.repairs` (THE PROMISE's immutable lived history), and it
 *     leaves this function's RETURN exactly the economy fingerprint's own boolean that A7
 *     asserts. Its arms are `tests/domain/mergeLadderHeldKeys.test.js`'s, not this file's.
 */
import { describe, it, expect } from 'vitest';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import * as mergeModule from '../../src/domain/edit/mergeConsequence.js';
import {
  mergeConsequence, recomputeMirrors, recomputeReceipts, enclosingGroup, guardMergedRecord,
} from '../../src/domain/edit/mergeConsequence.js';
import { mergeTree, newReceipts, __internals } from '../../src/domain/edit/recordMergeTree.js';

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

const build = (row) => {
  const { _seed, ...cfg } = row;
  return generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
};
const h = (value) => JSON.stringify(value);
const cl = (value) => structuredClone(value);

/** The stride, generated ONCE and shared by every arm. */
let stride = null;
function rows() {
  if (stride === null) stride = sample63().map((row) => ({ key: keyOf(row), rec: build(row) }));
  return stride;
}
const withChains = () => rows().filter(({ rec }) => (rec.economicState?.activeChains || []).length >= 2);
const withFood = () => rows().filter(({ rec }) => (rec.availableServices?.food || []).length >= 2);
const withIncome = () => rows().filter(({ rec }) => (rec.economicState?.incomeSources || []).length >= 2);
const withMembers = () => rows().filter(({ rec }) => (rec.factions || [])
  .some((faction) => (faction.members || []).length > 0));

describe('EM-R0c — the merge: the consequence of an edit is the difference of two re-derivations', () => {
  it('A1 · identity and the write base: merge(record, X, X) returns the record byte-identical, unmutated, with no key lost', () => {
    const subjects = rows();
    expect(subjects.length, 'the 63-row stride is derived from goldenCorpus(), never a fixture').toBe(63);

    const notIdentical = [];
    const mutated = [];
    const lost = [];
    const noisy = [];
    for (const { key, rec } of subjects) {
      const before = h(rec);
      const out = mergeConsequence(rec, cl(rec), cl(rec), { edit: null });
      if (h(out.record) !== before) notIdentical.push(key);
      if (h(rec) !== before) mutated.push(key);
      const missing = Object.keys(rec).filter((name) => !Object.hasOwn(out.record, name));
      if (missing.length > 0) lost.push(`${key}: ${missing.join(',')}`);
      if (out.delta.escalations.length > 0 || out.delta.readings.length > 0) {
        noisy.push(`${key}: ${out.delta.escalations.length} escalations, ${out.delta.readings.length} readings`);
      }
    }
    expect(notIdentical, 'with the two re-derivations deep-equal, every node short-circuits and the record stands').toEqual([]);
    expect(mutated, 'no caller record is mutated: the merge clones on entry and writes only its own value').toEqual([]);
    expect(lost, 'THE WRITE BASE: no top-level key of the record is absent from the result').toEqual([]);
    expect(noisy, 'the identity carries no escalation and moves no reading').toEqual([]);
  });

  it('A2 · the group is the unit: a label never sits beside a flag that contradicts it', () => {
    const subjects = rows().filter(({ rec }) => rec.economicState?.foodSecurity?.label !== undefined
      && rec.economicState.foodSecurity.isSecure !== undefined);
    expect(subjects.length, 'every row of the stride carries the food card the group is declared over').toBe(63);
    expect(enclosingGroup('economicState.foodSecurity.label').id, 'the declared group the label sits in').toBe('food-security');
    // anchored: the line above proves the lookup answers a real group, so this null is a measured
    // NON-group (design §22.3 item 4) rather than a lookup that answers nothing at all.
    expect(enclosingGroup('availableServices.legal'), 'availableServices is a measured non-group').toBe(null);

    const split = [];
    const uncontradicted = [];
    for (const { key, rec } of subjects) {
      const R0 = cl(rec);
      const R1 = cl(rec);
      R1.economicState.foodSecurity.label = `${R0.economicState.foodSecurity.label}-moved`;
      const edited = cl(rec);
      edited.economicState.foodSecurity.isSecure = !rec.economicState.foodSecurity.isSecure;
      const out = mergeConsequence(edited, R0, R1, { edit: null });
      if (h(out.record.economicState.foodSecurity) !== h(R1.economicState.foodSecurity)) split.push(key);
      // THE PAIRED NEGATIVE, through the module's own node rule at a path the register declares
      // no group over: the label comes from R1 while the flag stays the record's — the pair the
      // group rule exists to prevent.
      const node = __internals.mergeNode(
        edited.economicState.foodSecurity, R0.economicState.foodSecurity,
        R1.economicState.foodSecurity, 'availableServices', newReceipts(),
      );
      const contradicts = node.label === R1.economicState.foodSecurity.label
        && node.isSecure === edited.economicState.foodSecurity.isSecure
        && h(node) !== h(R1.economicState.foodSecurity);
      if (!contradicts) uncontradicted.push(key);
    }
    expect(split, 'the declared group moves WHOLE: the merged card is R1\'s card entire').toEqual([]);
    expect(uncontradicted, 'and with the group rule off the same two cards produce the contradictory pair').toEqual([]);
  });

  it('A3 · absent is a value, and nothing is merged by position', () => {
    const subjects = withFood();
    expect(subjects.length, 'the rows carrying a food collection the two re-derivations can outgrow').toBe(54);

    const padded = [];
    const leaked = [];
    for (const { key, rec } of subjects) {
      const R0 = cl(rec);
      const R1 = cl(rec);
      const extra = { ...R0.availableServices.food[0], name: 'A Planted Stall' };
      R0.availableServices.food = [...R0.availableServices.food, extra];
      R1.availableServices.food = [...R1.availableServices.food, cl(extra)];
      R0.economicState.plantedReading = 'planted';
      R1.economicState.plantedReading = 'planted';
      const out = mergeConsequence(rec, R0, R1, { edit: null });
      if (out.record.availableServices.food.length !== rec.availableServices.food.length) padded.push(key);
      if (Object.hasOwn(out.record.economicState, 'plantedReading')) leaked.push(key);
    }
    expect(padded, 'the two re-derivations agree on a LONGER collection and the record\'s own array stands unpadded').toEqual([]);
    // anchored: the same loop proved the planted key really reached both re-derivations by growing
    // their collections from it, so an empty list here is agreement withheld, not a walk that ran dry.
    expect(leaked, 'a key both re-derivations carry and the record does not stays ABSENT').toEqual([]);
  });

  it('A4 · keyed by the declared key: a permuted collection joins by name and the order arm is counted', () => {
    const subjects = withFood();
    expect(subjects.length, 'the rows whose food collection has two entries to permute').toBe(54);

    const notJoined = [];
    const neighboursMoved = [];
    const uncounted = [];
    for (const { key, rec } of subjects) {
      const R0 = cl(rec);
      const R1 = cl(rec);
      R1.availableServices.food = [...R1.availableServices.food].reverse();
      R1.availableServices.food[0] = { ...R1.availableServices.food[0], quality: 'PLANTED-QUALITY' };
      const changed = R1.availableServices.food[0].name;
      const out = mergeConsequence(rec, R0, R1, { edit: null });
      const merged = out.record.availableServices.food;
      const joined = merged.find((entry) => entry.name === changed);
      if (joined === undefined || joined.quality !== 'PLANTED-QUALITY') notJoined.push(key);
      const strays = merged.filter((entry) => entry.name !== changed)
        .filter((entry) => h(entry) !== h(rec.availableServices.food.find((own) => own.name === entry.name)));
      if (strays.length > 0) neighboursMoved.push(key);
      if (!out.delta.orderMoved.includes('availableServices.food')) uncounted.push(key);
    }
    expect(notJoined, 'the changed entry joins BY NAME, never by position').toEqual([]);
    expect(neighboursMoved, 'and every other entry is byte-identical to the record\'s own').toEqual([]);
    expect(uncounted, 'the permutation is reported as an order move, never silently').toEqual([]);
  });

  it('A5 · a cross-entry total is atomic: incomeSources comes from R1 as one value', () => {
    const subjects = withIncome();
    expect(subjects.length, 'the rows whose income shares have two entries to re-cut').toBe(61);

    const notWhole = [];
    const survived = [];
    const broken = [];
    for (const { key, rec } of subjects) {
      const R0 = cl(rec);
      const R1 = cl(rec);
      const shares = R1.economicState.incomeSources;
      shares[0] = { ...shares[0], percentage: shares[0].percentage + 10 };
      shares[1] = { ...shares[1], percentage: shares[1].percentage - 10 };
      const edited = cl(rec);
      edited.economicState.incomeSources[0] = {
        ...edited.economicState.incomeSources[0], source: 'A SETTLED SOURCE',
      };
      const out = mergeConsequence(edited, R0, R1, { edit: null });
      const merged = out.record.economicState.incomeSources;
      if (h(merged) !== h(R1.economicState.incomeSources)) notWhole.push(key);
      if (merged.some((entry) => entry.source === 'A SETTLED SOURCE')) survived.push(key);
      if (merged.reduce((sum, entry) => sum + entry.percentage, 0) !== 100) broken.push(key);
    }
    expect(notWhole, 'the collection under a cross-entry total comes from R1 as ONE value').toEqual([]);
    // anchored: `notWhole` above is empty only because the merged array really is R1's, which is
    // the same read that makes the record's own settled entry absent here.
    expect(survived, 'so the record\'s settled entry is not carried in beside R1\'s re-cut shares').toEqual([]);
    expect(broken, 'and the shares still total one hundred, which entry-by-entry merging breaks').toEqual([]);
  });

  it('A6 · the order rule has two arms on economicState.activeChains', () => {
    const subjects = withChains();
    expect(subjects.length, 'the rows whose active chains have an order to keep or to move').toBe(57);

    const armOne = [];
    const armTwo = [];
    const labels = (record) => record.economicState.activeChains.map((chain) => chain.label);
    for (const { key, rec } of subjects) {
      const R0 = cl(rec);
      const agreed = cl(rec);
      agreed.economicState.activeChains[0] = {
        ...agreed.economicState.activeChains[0], plantedNote: 'moved',
      };
      const kept = mergeConsequence(rec, R0, agreed, { edit: null });
      if (h(labels(kept.record)) !== h(labels(rec))
        || kept.delta.orderMoved.includes('economicState.activeChains')) armOne.push(key);
      const reversed = cl(rec);
      reversed.economicState.activeChains = [...reversed.economicState.activeChains].reverse();
      const moved = mergeConsequence(rec, R0, reversed, { edit: null });
      if (h(labels(moved.record)) !== h(labels(reversed))
        || !moved.delta.orderMoved.includes('economicState.activeChains')) armTwo.push(key);
    }
    expect(armOne, 'the two re-derivations agree on the commons\' order, so the record\'s order stands and the delta is silent').toEqual([]);
    expect(armTwo, 'the edit moved the order, so R1\'s order governs and the delta names the collection').toEqual([]);
  });

  it('A7 · mirrors recomputed, the receipt recomputed and never taken', () => {
    const subjects = withMembers();
    expect(subjects.length, 'the rows whose factions carry the member chips the mirror is declared over').toBe(63);

    const changed = [];
    const idle = [];
    const chipStale = [];
    const takenFromR1 = [];
    const receiptFrozen = [];
    for (const { key, rec } of subjects) {
      const plain = cl(rec);
      const before = h(plain);
      const rewritten = recomputeMirrors(plain);
      if (h(plain) !== before) changed.push(key);
      if (rewritten === 0) idle.push(key);

      const roleMoved = cl(rec);
      const chip = roleMoved.factions.flatMap((faction) => faction.members || [])[0];
      const npc = roleMoved.npcs.find((person) => String(person.id) === String(chip.id));
      npc.role = 'PLANTED ROLE';
      recomputeMirrors(roleMoved);
      const followed = roleMoved.factions.flatMap((faction) => faction.members || [])
        .find((member) => String(member.id) === String(chip.id));
      if (followed.role !== 'PLANTED ROLE') chipStale.push(key);

      const R0 = cl(rec);
      const R1 = cl(rec);
      R1.economicState.prosperity = R0.economicState.prosperity === 'Moderate' ? 'Prosperous' : 'Moderate';
      R1.powerStructure.economyInputFingerprint = 'planted-digest';
      const out = mergeConsequence(rec, R0, R1, { edit: null });
      const digest = out.record.powerStructure.economyInputFingerprint;
      if (digest === 'planted-digest') takenFromR1.push(key);
      if (recomputeReceipts(cl(out.record)) !== false) receiptFrozen.push(key);
      if (digest === rec.powerStructure.economyInputFingerprint) receiptFrozen.push(`${key}: unmoved`);
    }
    expect(changed, 'recomputeMirrors rewrites a plain record\'s chips to the values it already holds').toEqual([]);
    expect(idle, 'and it really rewrote them, so the arm above is not a walk over nothing').toEqual([]);
    expect(chipStale, 'after a role change the member chip follows the merged roster').toEqual([]);
    expect(takenFromR1, 'the declared receipt is never taken from R1, however R1 spells it').toEqual([]);
    expect(receiptFrozen, 'it is the value a recompute over the MERGED record produces, and here it moved').toEqual([]);
  });

  it('A8 · the chain is the semantics: an array of edits throws and no export takes more than one', () => {
    const { rec } = rows()[0];
    const R1 = cl(rec);
    expect(() => mergeConsequence(rec, cl(rec), cl(rec), { edit: [{ id: 'a' }, { id: 'b' }] }),
      'an ARRAY of edits is refused with the law in the message').toThrow(TypeError);
    expect(() => mergeConsequence(rec, cl(rec), cl(rec), { edit: [{ id: 'a' }] }),
      'and a one-element array is still an array, so it is refused too').toThrow(/takes ONE edit/);

    const single = mergeConsequence(rec, cl(rec), R1, {
      edit: { id: 'edit-1', opType: 'set-field', orphaned: [{ kind: 'NPC_REMOVED', id: 'npc.1' }] },
    });
    expect(single.delta.appliedEdit, 'one edit yields its id as a STRING, never a list').toBe('edit-1');
    expect(single.delta.nextBase, 'the chain is expressed in the return: nextBase IS R1').toBe(R1);
    expect(single.delta.orphaned, 'EM-R6\'s rows are carried verbatim; the writer reports and the guard engine judges')
      .toEqual([{ kind: 'NPC_REMOVED', id: 'npc.1' }]);
    const none = mergeConsequence(rec, cl(rec), cl(rec), { edit: { id: 'edit-2', opType: 'set-field' } });
    expect(none.delta.orphaned, 'and an op with no orphans carries the empty list').toEqual([]);

    expect(Object.keys(mergeModule).sort(),
      'FIVE exports, enumerated: there is no symbol here that accepts more than one edit').toEqual([
      'enclosingGroup', 'guardMergedRecord', 'mergeConsequence', 'recomputeMirrors', 'recomputeReceipts',
    ]);
    expect([mergeConsequence, recomputeMirrors, recomputeReceipts, enclosingGroup, guardMergedRecord]
      .map((symbol) => typeof symbol), 'and every one of them is a function').toEqual(
      ['function', 'function', 'function', 'function', 'function'],
    );
    expect(mergeTree(cl(rec), cl(rec), cl(rec)).receipts.keptNodes > 0,
      'the tree merge the public surface is built on really ran over this record').toBe(true);
  });
});
