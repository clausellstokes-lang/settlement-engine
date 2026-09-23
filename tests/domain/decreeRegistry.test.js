/**
 * decreeRegistry.test.js — EM-C1 acceptance cases A1 to A8 (wave 2; ARCH §1 and §2, design
 * §2.5, §2.5a, §11, §12.1 and §20.3).
 *
 * THE CLAIM. `src/domain/edit/registry.js` is the estate's ONE writer of the `decrees` key
 * and it is pure: every verb takes a registry and returns a NEW frozen registry, reads no
 * clock, takes no draw, mints no id and mutates nothing it was handed. A pending entry is
 * stageable, reorderable, withdrawable and reopenable; an APPLIED entry is read-only and
 * only the rewind returns it to pending (THE PROMISE, design §12's product ruling); a
 * withdrawn entry is kept for the record.
 *
 * ⛔ THE LEAF IMPORTS NEITHER THE CATALOGUE NOR THE POOLS, so this battery imports both and
 * hands them in, exactly as EM-C2's engine is handed `OP_TYPES`. That is what keeps
 * `tests/domain/editOperations.test.js` case A6's importer roster and
 * `tests/lint/editMutationPath.walker.test.js` green: a registry that imported `makeOp`
 * would be a second mutation path by that walker's own predicate.
 *
 * Proof shape copied from `tests/domain/editOperations.test.js` (a `tests/domain` battery
 * over a frozen `src/domain/edit` leaf: straight-line literal `it`s under ONE literal
 * `describe`, with its own `vitest` import).
 *
 * @enforced-by this test
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { compareCodepoint } from '../../src/domain/deterministicSort.js';
import { OP_TYPES, makeOp } from '../../src/domain/edit/operations.js';
import { POOLS, poolValues } from '../../src/domain/edit/pools.js';
import {
  DECREE_AUTHORS, DECREE_STATUSES, RESOLUTION_MISSING_KINDS, WITHDRAWN_REASON_KINDS,
  compareDecrees, markApplied, orderedDecrees, reopen, reorder, resolveDecree, revertTick,
  stage, withdraw,
} from '../../src/domain/edit/registry.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF_REL = 'src/domain/edit/registry.js';
const NPC = { kind: 'npc', id: 'n1' };
const SETTLEMENT = { kind: 'settlement', id: 's1' };
const INSTITUTION = { kind: 'institution', id: 'i1' };
const STAMP = '2026-09-23T00:00:00.000Z';

/** One op from the REAL catalogue, so no fixture can drift from the vocabulary. */
const op = (type, target, payload) => makeOp(type, target || NPC, payload || {});
/** One `stage` meta: the id and the clock are the CALLER's (HZ-STAMP). */
const meta = (id, extra) => ({ id, orderedAt: STAMP, ...(extra || {}) });
/** The row shape every assertion below reads. */
const rowOf = (entry) => [entry.id, entry.status, entry.orderIndex];
/** The live pool values, handed to `resolveDecree` as the catalogues argument. */
const livePools = () => Object.fromEntries(Object.keys(POOLS)
  .map((id) => [id, poolValues(id, { npcs: [], institutions: [], tier: 'town' })]));
/** A well-formed entry for every catalogue row, built from each payload spec's own vocabulary. */
function everyOpStaged(pools) {
  const rows = [];
  for (const [type, decl] of Object.entries(OP_TYPES)) {
    const payload = {};
    for (const [field, spec] of Object.entries(decl.payload)) {
      if (spec.kind === 'enum') payload[field] = spec.values[0];
      else if (spec.kind === 'pool') payload[field] = (pools[spec.pool] || [])[0];
      else if (spec.kind === 'int') payload[field] = 1;
      else payload[field] = 'x';
    }
    rows.push({
      id: `r-${type}`, op: makeOp(type, { kind: decl.target, id: 'e1' }, payload),
      status: DECREE_STATUSES[1], orderIndex: 0,
    });
  }
  return rows;
}

describe('EM-C1 - the decree registry, pure: stage, reorder, withdraw, reopen, markApplied, revertTick, resolveDecree', () => {
  it('A1 - EM-C1: the four vocabularies are frozen and closed, the reading order is design 11s, and every verb returns a NEW frozen registry that leaves its input untouched', () => {
    expect(DECREE_STATUSES, 'the status three, codepoint order').toEqual(['applied', 'pending', 'withdrawn']);
    expect(DECREE_AUTHORS, 'the author three (ARCH 2 Decree.addedBy)').toEqual(['dm', 'guard', 'surveyor']);
    expect(WITHDRAWN_REASON_KINDS, 'the withdrawal families (design 20.3); a hand withdrawal carries NO reason at all')
      .toEqual(['vocabulary-moved']);
    expect(RESOLUTION_MISSING_KINDS, 'what a stale entry points at (design 20.3), codepoint order')
      .toEqual(['event', 'fork', 'op-type', 'outcome', 'pool-value']);
    const frozen = [DECREE_STATUSES, DECREE_AUTHORS, WITHDRAWN_REASON_KINDS, RESOLUTION_MISSING_KINDS]
      .map((vocabulary) => Object.isFrozen(vocabulary));
    expect(frozen, 'all four frozen').toEqual([true, true, true, true]);

    // THE FOLD ORDER, spelled key-for-key as EM-C2's engine spells it and proved on the
    // SAME five-entry shuffled fixture its own compile executed: when class, tick, season,
    // orderIndex, id. The guards must judge the sequence the tick will apply.
    const shuffled = [
      { id: 'z', op: op('add-npc'), status: 'pending', orderIndex: 9 },
      { id: 'x', op: op('add-npc'), status: 'pending', orderIndex: 0, when: { tick: 3 } },
      { id: 'y', op: op('add-npc'), status: 'pending', orderIndex: 0, when: { season: 'winter' } },
      { id: 'w', op: op('add-npc'), status: 'pending', orderIndex: 0, when: { tick: 1 } },
      { id: 'v', op: op('add-npc'), status: 'pending', orderIndex: 2 },
    ];
    expect(orderedDecrees(shuffled).map((entry) => entry.id), 'EM-C2 6 Ordering and precedence, executed')
      .toEqual(['v', 'z', 'w', 'x', 'y']);
    expect(orderedDecrees([...shuffled].reverse()).map((entry) => entry.id), 'a shuffle never moves the result')
      .toEqual(['v', 'z', 'w', 'x', 'y']);
    expect(compareDecrees(shuffled[0], shuffled[0]), 'the comparator is reflexive on one row').toBe(0);

    const before = JSON.stringify(shuffled);
    const outputs = [
      stage(shuffled, op('add-npc'), meta('new')),
      reorder(shuffled, 'v', 0),
      withdraw(shuffled, 'v'),
      reopen(shuffled, 'v', op('remove-npc')),
      markApplied(shuffled, 'v', { appliedAt: 'A', tickRef: 'T' }),
      revertTick(shuffled, []),
    ];
    expect(JSON.stringify(shuffled), 'PURE: the input registry is byte-identical after six verbs').toBe(before);
    expect(outputs.map((registry) => Object.isFrozen(registry)), 'every return is frozen')
      .toEqual([true, true, true, true, true, true]);
    // anchored: the six returns are asserted frozen one line above, so a verb that returned
    // its own argument would still be frozen and this identity check is what separates them.
    expect(outputs.some((registry) => registry === shuffled), 'and none of them IS the input array').toBe(false);
  });

  it('A2 - EM-C1: stage appends one pending entry at the next index, writes only the six required keys plus what the caller supplied, and refuses five malformed calls without throwing', () => {
    const first = stage([], op('add-npc'), meta('d1'));
    const second = stage(first, op('add-institution', INSTITUTION, { name: 'Almshouse', category: 'civic' }),
      meta('d2', { addedBy: 'surveyor', surveyorCredit: 3 }));
    const third = stage(second, op('set-field', SETTLEMENT, { field: 'name', value: 'Aldermoor' }),
      meta('d3', { when: { tick: 4 } }));
    expect(third.map(rowOf), 'three pending entries at indices 0, 1, 2').toEqual([
      ['d1', 'pending', 0], ['d2', 'pending', 1], ['d3', 'pending', 2],
    ]);
    expect(third.map((entry) => Object.keys(entry).sort(compareCodepoint)),
      'the six required keys on every entry; surveyorCredit and when ONLY where the caller supplied them,'
      + ' because design 20.3 makes an absent optional key a fact rather than a default').toEqual([
      ['addedBy', 'id', 'op', 'orderIndex', 'orderedAt', 'status'],
      ['addedBy', 'id', 'op', 'orderIndex', 'orderedAt', 'status', 'surveyorCredit'],
      ['addedBy', 'id', 'op', 'orderIndex', 'orderedAt', 'status', 'when'],
    ]);
    expect(third[0].addedBy, 'an absent addedBy reads dm').toBe('dm');
    expect(third[1].addedBy, 'and a declared one is kept').toBe('surveyor');

    const refusals = [
      ['a blank id', stage(third, op('add-npc'), meta(''))],
      ['no orderedAt (the clock is the callers, HZ-STAMP)', stage(third, op('add-npc'), { id: 'd9' })],
      ['an op that is not a plain object with a string type', stage(third, { nope: 1 }, meta('d9'))],
      ['an addedBy outside the vocabulary (defaulting would MISATTRIBUTE)', stage(third, op('add-npc'), meta('d9', { addedBy: 'wizard' }))],
      ['a duplicate id', stage(third, op('add-npc'), meta('d1'))],
    ];
    expect(refusals.map(([why, registry]) => [why, registry.length]),
      'each refusal returns the registry unchanged in content; what the caller reads instead is the status'
      + ' on the entry itself, which is the registrys own data and not a second authority').toEqual([
      ['a blank id', 3],
      ['no orderedAt (the clock is the callers, HZ-STAMP)', 3],
      ['an op that is not a plain object with a string type', 3],
      ['an addedBy outside the vocabulary (defaulting would MISATTRIBUTE)', 3],
      ['a duplicate id', 3],
    ]);
    expect(stage(null, op('add-npc'), meta('d1')).map(rowOf), 'a non-array registry reads empty and never throws')
      .toEqual([['d1', 'pending', 0]]);
  });

  it('A3 - EM-C1: reorder permutes the PENDING entries over the index values they already occupy, so an applied entry never loses its place, and an unknown id, a non-finite target and an applied entry are each a no-op', () => {
    let registry = stage([], op('add-npc'), meta('d1'));
    registry = stage(registry, op('remove-npc', NPC, { cause: 'left' }), meta('d2'));
    registry = stage(registry, op('set-field', SETTLEMENT, { field: 'name', value: 'A' }), meta('d3'));
    registry = markApplied(registry, 'd1', { appliedAt: 'A', tickRef: 'T' });
    registry = stage(registry, op('add-npc'), meta('d4'));
    expect(registry.map(rowOf), 'one applied at 0 and three pending at 1, 2, 3')
      .toEqual([['d1', 'applied', 0], ['d2', 'pending', 1], ['d3', 'pending', 2], ['d4', 'pending', 3]]);

    const moved = reorder(registry, 'd4', 0);
    expect(moved.map(rowOf), 'd4 takes the FIRST pending slot and the others shift down; the applied entry keeps 0')
      .toEqual([['d1', 'applied', 0], ['d2', 'pending', 2], ['d3', 'pending', 3], ['d4', 'pending', 1]]);
    expect(orderedDecrees(moved).map((entry) => entry.id), 'and the reading order follows the field')
      .toEqual(['d1', 'd4', 'd2', 'd3']);
    expect(reorder(registry, 'd2', 99).map(rowOf), 'an out-of-range target clamps to the last pending slot')
      .toEqual([['d1', 'applied', 0], ['d2', 'pending', 3], ['d3', 'pending', 1], ['d4', 'pending', 2]]);

    const noops = [
      ['an unknown id', reorder(registry, 'nope', 0)],
      ['a non-finite target', reorder(registry, 'd4', Number.NaN)],
      ['an APPLIED entry (it is history)', reorder(registry, 'd1', 0)],
      ['a single pending entry', reorder(stage([], op('add-npc'), meta('only')), 'only', 0)],
    ];
    const still = [['d1', 'applied', 0], ['d2', 'pending', 1], ['d3', 'pending', 2], ['d4', 'pending', 3]];
    expect(noops.slice(0, 3).map(([why, next]) => [why, next.map(rowOf)]),
      'each leaves every index exactly where it was').toEqual([
      ['an unknown id', still], ['a non-finite target', still], ['an APPLIED entry (it is history)', still],
    ]);
    expect(noops[3][1].map(rowOf), 'and a list of one has no permutation to make').toEqual([['only', 'pending', 0]]);
  });

  it('A4 - EM-C1: withdraw and reopen touch PENDING entries only, the withdrawn row is kept with its original words and its index, and withdrawnReason is written ONLY for design 20.3s exact shape', () => {
    let registry = stage([], op('add-npc'), meta('d1'));
    registry = stage(registry, op('add-institution', INSTITUTION, { name: 'Almshouse', category: 'civic' }), meta('d2'));
    registry = stage(registry, op('set-field', SETTLEMENT, { field: 'name', value: 'A' }), meta('d3', { when: { tick: 4 } }));

    const byHand = withdraw(registry, 'd2');
    const held = byHand.filter((entry) => entry.id === 'd2')[0];
    expect([held.status, held.orderIndex, held.op.type], 'kept for the record with its index and its original words')
      .toEqual(['withdrawn', 1, 'add-institution']);
    // anchored: the same row is read three ways one line above, so this absence cannot pass
    // against an entry the verb dropped.
    expect(Object.hasOwn(held, 'withdrawnReason'), 'and NO reason, which is what says the DM withdrew it by hand').toBe(false);

    const reason = { kind: 'vocabulary-moved', missing: 'pool-value', was: 'thaumaturge' };
    const byReason = withdraw(registry, 'd2', reason).filter((entry) => entry.id === 'd2')[0];
    expect([byReason.status, byReason.withdrawnReason], 'design 20.3s exact shape, frozen onto the entry')
      .toEqual(['withdrawn', reason]);
    const malformed = [
      withdraw(registry, 'd2', { kind: 'nope', missing: 'pool-value', was: 'x' }),
      withdraw(registry, 'd2', { kind: 'vocabulary-moved', missing: 'nope', was: 'x' }),
      withdraw(registry, 'd2', { kind: 'vocabulary-moved', missing: 'pool-value', was: '' }),
      withdraw(registry, 'd2', 'nonsense'),
    ].map((next) => Object.hasOwn(next.filter((entry) => entry.id === 'd2')[0], 'withdrawnReason'));
    expect(malformed, 'a reason outside the two vocabularies is no reason at all, never a repaired one')
      .toEqual([false, false, false, false]);

    const applied = markApplied(registry, 'd1', { appliedAt: 'A', tickRef: 'T' });
    const readOnly = [
      ['withdraw on an applied entry', withdraw(applied, 'd1').filter((entry) => entry.id === 'd1')[0].status],
      ['reopen on an applied entry', reopen(applied, 'd1', op('remove-npc', NPC, { cause: 'left' }))
        .filter((entry) => entry.id === 'd1')[0].op.type],
      ['withdraw on an already withdrawn entry', withdraw(byHand, 'd2', reason)
        .filter((entry) => entry.id === 'd2')[0].withdrawnReason],
    ];
    expect(readOnly, 'an APPLIED entry is history and only a rewind returns it to pending (design 12, THE PROMISE);'
      + ' a withdrawn entry is restaged as a NEW entry through stage, never un-withdrawn')
      .toEqual([['withdraw on an applied entry', 'applied'],
        ['reopen on an applied entry', 'add-npc'],
        ['withdraw on an already withdrawn entry', undefined]]);

    const saved = reopen(registry, 'd3', op('set-field', SETTLEMENT, { field: 'name', value: 'Ashford' }))
      .filter((entry) => entry.id === 'd3')[0];
    expect([saved.op.payload.value, saved.orderIndex, saved.when],
      'Save returns a reopened card to exactly its place in the order (design 2.5a), schedule included')
      .toEqual(['Ashford', 2, { tick: 4 }]);
    expect(reopen(registry, 'd3', { nope: 1 }).filter((entry) => entry.id === 'd3')[0].op.payload.value,
      'and an op that is not a plain object with a string type is refused, not written').toBe('A');
  });

  it('A5 - EM-C1: markApplied moves a pending entry to applied with the callers stamps, writes chronicleRef only when it is supplied, keeps the index, and never re-applies', () => {
    let registry = stage([], op('add-npc'), meta('d1'));
    registry = stage(registry, op('remove-npc', NPC, { cause: 'left' }), meta('d2'));
    const applied = markApplied(registry, 'd1', { appliedAt: 'A', tickRef: 'T7', chronicleRef: 'C1' })
      .filter((entry) => entry.id === 'd1')[0];
    expect([applied.status, applied.appliedAt, applied.tickRef, applied.chronicleRef, applied.orderIndex],
      'the three refs and the index the entry already held').toEqual(['applied', 'A', 'T7', 'C1', 0]);

    const bare = markApplied(registry, 'd1', { appliedAt: 'A', tickRef: 'T7' }).filter((entry) => entry.id === 'd1')[0];
    expect(bare.status, 'a tick with no chronicle line still applies').toBe('applied');
    // anchored: the same entry is asserted applied one line above, so this absence cannot
    // pass against an entry markApplied refused.
    expect(Object.hasOwn(bare, 'chronicleRef'), 'and chronicleRef stays ABSENT, because EM-E2 owns the line').toBe(false);

    const refused = [
      ['no tickRef', markApplied(registry, 'd1', { appliedAt: 'A' }).filter((entry) => entry.id === 'd1')[0].status],
      ['no appliedAt', markApplied(registry, 'd1', { tickRef: 'T7' }).filter((entry) => entry.id === 'd1')[0].status],
      ['no meta at all', markApplied(registry, 'd1', null).filter((entry) => entry.id === 'd1')[0].status],
      ['already applied', markApplied(markApplied(registry, 'd1', { appliedAt: 'A', tickRef: 'T7' }), 'd1',
        { appliedAt: 'B', tickRef: 'T8' }).filter((entry) => entry.id === 'd1')[0].appliedAt],
    ];
    expect(refused, 'the stamps are required and an applied entry is never stamped twice').toEqual([
      ['no tickRef', 'pending'], ['no appliedAt', 'pending'], ['no meta at all', 'pending'], ['already applied', 'A'],
    ]);
  });

  it('A6 - EM-C1: revertTick re-appends every entry staged after the tick onto the restored snapshot, loses nothing, reorders nothing, and lets the RESTORED entry win an id that is in both', () => {
    let snapshot = stage([], op('add-npc'), meta('d1'));
    snapshot = stage(snapshot, op('remove-npc', NPC, { cause: 'left' }), meta('d2'));
    snapshot = stage(snapshot, op('set-field', SETTLEMENT, { field: 'name', value: 'A' }), meta('d3', { when: { tick: 4 } }));

    let preUndo = markApplied(snapshot, 'd1', { appliedAt: 'A', tickRef: 'T7', chronicleRef: 'C1' });
    preUndo = markApplied(preUndo, 'd2', { appliedAt: 'A', tickRef: 'T7', chronicleRef: 'C2' });
    preUndo = stage(preUndo, op('add-npc'), meta('d4'));
    preUndo = stage(preUndo, op('add-institution', INSTITUTION, { name: 'Almshouse', category: 'civic' }), meta('d5'));
    const laterStaged = preUndo.filter((entry) => !snapshot.some((restored) => restored.id === entry.id));
    expect(laterStaged.map(rowOf), 'two entries were staged after the tick').toEqual([['d4', 'pending', 3], ['d5', 'pending', 4]]);

    const reverted = revertTick(snapshot, laterStaged);
    expect(reverted.map(rowOf), 'the snapshot already holds the ticks decrees as pending (design 12.1);'
      + ' the later two are RE-APPENDED and every index is verbatim')
      .toEqual([['d1', 'pending', 0], ['d2', 'pending', 1], ['d3', 'pending', 2],
        ['d4', 'pending', 3], ['d5', 'pending', 4]]);
    const lost = preUndo.filter((entry) => !reverted.some((row) => row.id === entry.id)).map((entry) => entry.id);
    expect(lost, 'a rewind never loses a decree (design 2.5a)').toEqual([]);
    expect(orderedDecrees(reverted).map((entry) => entry.id), 'and the reading order puts the tick-4 entry last')
      .toEqual(['d1', 'd2', 'd4', 'd5', 'd3']);
    expect(revertTick(snapshot, preUndo).map((entry) => [entry.id, entry.status]),
      'an id in BOTH takes the RESTORED entry: the snapshot is the authority for whatever the tick touched,'
      + ' and its chronicle line is retracted')
      .toEqual([['d1', 'pending'], ['d2', 'pending'], ['d3', 'pending'], ['d4', 'pending'], ['d5', 'pending']]);
    expect(revertTick(snapshot, []).map((entry) => entry.id), 'a tick with nothing staged after it restores the snapshot alone')
      .toEqual(['d1', 'd2', 'd3']);
    expect(revertTick(snapshot, [null, 7, { id: 'junk' }]).map((entry) => entry.id),
      'a laterStaged row that is not an entry is skipped: that argument is computed by the caller, never carried from a save')
      .toEqual(['d1', 'd2', 'd3']);
  });

  it('A7 - EM-C1: resolveDecree answers ok for all 22 live op types, names op-type on a retired type and pool-value on a moved word, is stable, never throws, and reaches exactly two of the five declared missing kinds at this tip', () => {
    const pools = livePools();
    const catalogues = { opTypes: OP_TYPES, pools };
    const staged = everyOpStaged(pools);
    const verdicts = staged.map((entry) => [entry.op.type, resolveDecree(entry, catalogues).ok]);
    expect(verdicts.filter(([, ok]) => ok).length, 'every catalogue row resolves against its own vocabularies')
      .toBe(Object.keys(OP_TYPES).length);
    expect(verdicts.filter(([, ok]) => !ok), 'and none of them fails, with the offender list printed').toEqual([]);

    const retired = { ...staged[0], op: { ...staged[0].op, type: 'no-such-op' } };
    const staleEnum = { id: 's', op: makeOp('set-npc-status', NPC, { status: 'transmogrified' }), status: 'pending', orderIndex: 0 };
    const stalePool = { id: 'p', op: makeOp('remove-npc', NPC, { cause: 'eaten-by-a-grue' }), status: 'pending', orderIndex: 0 };
    const misses = [
      ['a retired op type', resolveDecree(retired, catalogues)],
      ['a value outside an enum spec', resolveDecree(staleEnum, catalogues)],
      ['a value outside a pool spec', resolveDecree(stalePool, catalogues)],
      ['a pool id the catalogues no longer carry', resolveDecree(stalePool, { opTypes: OP_TYPES, pools: {} })],
      ['an entry that is not an entry', resolveDecree(null, catalogues)],
    ];
    expect(misses, 'was is THE WORD THAT FAILED (design 20.3), and the resolver judges without writing').toEqual([
      ['a retired op type', { ok: false, missing: 'op-type', was: 'no-such-op' }],
      ['a value outside an enum spec', { ok: false, missing: 'pool-value', was: 'transmogrified' }],
      ['a value outside a pool spec', { ok: false, missing: 'pool-value', was: 'eaten-by-a-grue' }],
      ['a pool id the catalogues no longer carry', { ok: false, missing: 'pool-value', was: 'cause.remove' }],
      ['an entry that is not an entry', { ok: false, missing: 'op-type', was: '' }],
    ]);
    expect(JSON.stringify(resolveDecree(stalePool, catalogues)), 'two runs over one entry answer alike')
      .toBe(JSON.stringify(resolveDecree(stalePool, catalogues)));

    const reachable = [...new Set(misses.map(([, verdict]) => verdict.missing))].sort(compareCodepoint);
    expect(reachable, 'TWO of the five fire at this tip').toEqual(['op-type', 'pool-value']);
    expect(RESOLUTION_MISSING_KINDS.filter((kind) => !reachable.includes(kind)),
      'and THREE are provably unreached, exactly as OP_STAGES carries both members while EM-B1a uses one:'
      + ' they wait for EM-E4s registered forks and outcome words and EM-E6s catalogue events. Minting this'
      + ' union half-populated would force those members to edit a frozen constant')
      .toEqual(['event', 'fork', 'outcome']);
  });

  it('A8 - EM-C1: every op type NAMES the catalogues its payload points into, the two spec kinds that carry a vocabulary are exactly the two the leaf spells, and the leaf imports one module and is imported by none', () => {
    const vocabularyKinds = new Set();
    const unnamed = [];
    const specs = [];
    for (const [type, decl] of Object.entries(OP_TYPES)) {
      for (const [field, spec] of Object.entries(decl.payload)) {
        specs.push(spec.kind);
        if (typeof spec.pool === 'string' || Array.isArray(spec.values)) vocabularyKinds.add(spec.kind);
        if (spec.kind === 'pool' && !(typeof spec.pool === 'string' && Object.hasOwn(POOLS, spec.pool))) {
          unnamed.push(`${type}.${field}: a pool spec whose pool id is not a key of POOLS`);
        }
        if (spec.kind === 'enum' && !(Array.isArray(spec.values) && spec.values.length > 0)) {
          unnamed.push(`${type}.${field}: an enum spec with no values`);
        }
      }
    }
    expect(specs.length, 'the catalogue loaded nothing, so every claim below would be vacuous').toBeGreaterThan(30);
    expect(unnamed, 'THE CHARTERS WALKER (design 20.3): an op that cannot be resolved cannot ship, so every'
      + ' pool spec names a live pool id and every enum spec names a non-empty vocabulary. Both sets are'
      + ' IMPORTED from their producers, never re-typed').toEqual([]);
    expect([...vocabularyKinds].sort(compareCodepoint), 'and the ONLY two spec kinds that carry a vocabulary are'
      + ' the two resolveDecree reads; operations.js keeps PAYLOAD_SPEC_KINDS module-private, so a new'
      + ' vocabulary-bearing kind reds HERE rather than going silently unresolved').toEqual(['enum', 'pool']);

    const source = readFileSync(join(ROOT, LEAF_REL), 'utf8');
    const specifiers = [...source.matchAll(/from\s*['"]([^'"]+)['"]/g)].map((hit) => hit[1]);
    expect(specifiers, 'THE LEAFS IMPORT LIST IS EXACTLY ONE. Importing operations.js would put this leaf on'
      + ' tests/lint/editMutationPath.walker.test.js OFFENDER list and widen the importer roster that'
      + ' tests/domain/editOperations.test.js case A6 pins EXACT in both directions')
      .toEqual(['../deterministicSort.js']);
    const fenced = specifiers.filter((specifier) => /prng|rngContext|\/store\/|\/components\/|generators|edit\/operations\.js|edit\/dmLayer\.js/.test(specifier));
    expect(fenced, 'the import fence: no PRNG, no store, no components, no generators, not the op catalogue and not the layer')
      .toEqual([]);
    expect(source.includes('Date.now') || source.includes('Math.random'), 'and the leaf reads no clock and takes no draw')
      .toBe(false);
  });
});
