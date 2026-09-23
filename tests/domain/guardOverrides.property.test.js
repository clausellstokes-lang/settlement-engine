/**
 * guardOverrides.property.test.js — EM-C4c case B: an OVERRIDDEN finding stands marked, and
 * the entry applies (design §7 C: "property tests that any queue the guards accept applies
 * without contradiction, and that 'proceed' always applies").
 *
 * THE PROPERTY, over queues of one to ten built from the catalogue's own ops and judged by
 * EM-C3's real rule set with its two real injected writers:
 *   1. every guard carries `proceed`, because the engine appends it and no rule can mint a
 *      refusal — so the offer the DM needs is always there to take;
 *   2. recording an override through EM-C1's own verb MARKS exactly the findings it names and
 *      DROPS none: the verdict's ids, kinds, messages and offers are identical before and
 *      after, and only `overridden` moves. A surface may hide a marked guard; it could never
 *      recover a suppressed one, which is why the DM's word sits BESIDE the guard's;
 *   3. a proceeded queue APPLIES IN FULL — every entry reaches `applied` in the fold order
 *      with its op, its index and its override intact, and the verdict over the applied
 *      registry is empty because the guards judge pending entries. A queue with no override
 *      at all applies identically, so arm 3 measures the override route and not the tick.
 *
 * ⭐ AND THE RULE SET IS FROZEN. EM-C4c adds no rule and changes none: the marking is EM-C2's
 * engine reading the entry's own `overrode`, and `guardRules.js` never reads that key at all.
 * Arm 4 measures both — the five rules' ids, `appliesTo` and `needs` derived from the module,
 * and the two sources scanned for the key.
 *
 * ⛔ EVERY SET THIS SUITE ITERATES IS IMPORTED FROM ITS PRODUCER — the offers, the kinds, the
 * rules, the op catalogue — never re-typed here.
 *
 * ⛔ NO ARM ASSERTS INSIDE A LOOP: every matrix is COLLECTED and then asserted once, so a red
 * reports a COUNT and never a lower bound.
 *
 * @enforced-by this test
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { compareCodepoint } from '../../src/domain/deterministicSort.js';
import { evaluateGuards, GUARD_KINDS, GUARD_OFFERS } from '../../src/domain/edit/guards.js';
import { GUARD_RULE_DEPENDENCIES, GUARD_RULES, makeGuardRuleSet } from '../../src/domain/edit/guardRules.js';
import { makeOp, OP_TYPES } from '../../src/domain/edit/operations.js';
import { markApplied, orderedDecrees, recordOverride, stage } from '../../src/domain/edit/registry.js';
import { renormalizeFactionPower } from '../../src/generators/power/rulingStructure.js';
import { checkStructuralValidity } from '../../src/generators/structuralValidator.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const ORDERED_AT = '2026-09-23T12:00:00.000Z';
const TICK = { appliedAt: ORDERED_AT, tickRef: 'tick_1' };
const PHANTOM = 'ph-1';
const INSTITUTION = 'i1';

/** Design §12.8's claim is length-blind, so the property is measured to the same ten. */
const LONGEST_QUEUE = 10;

/** EM-C3's real rule set with the two writers its rules declare, injected by the caller as
 *  EM-C2's clause rules they must be. Built once: the engine takes it as data. */
const RULE_SET = makeGuardRuleSet({ checkStructuralValidity, renormalizeFactionPower });

/** The world the queue is judged against: a town holding one sound institution. */
const WORLD = Object.freeze({
  tier: 'town',
  name: 'Stoneford',
  npcs: [],
  institutions: [{ id: INSTITUTION, name: 'Market square', state: 'sound' }],
  powerStructure: { factions: [] },
  config: { settType: 'town' },
});

/**
 * The four op shapes a queue rotates through, each built by the catalogue's own constructor.
 * They are chosen so the rule set really speaks at EVERY length: a promotion with nothing
 * founded before it is a connection, a removal after a state change is a contradiction, and
 * two foundings of one phantom are a contention.
 */
const SHAPES = Object.freeze([
  () => makeOp('promote-phantom', { kind: 'phantom', id: PHANTOM }, {}),
  () => makeOp('set-institution-state', { kind: 'institution', id: INSTITUTION }, { state: 'impaired' }),
  () => makeOp('remove-institution', { kind: 'institution', id: INSTITUTION }, {}),
  () => makeOp('found-phantom', { kind: 'phantom', id: PHANTOM }, { name: 'Greywater' }),
]);

/** A queue of `length` entries, staged by EM-C1's own verb at the indices it assigns. */
function queueOf(length) {
  let rows = [];
  for (let index = 0; index < length; index += 1) {
    rows = stage(rows, SHAPES[index % SHAPES.length](), { id: `q${index}`, orderedAt: ORDERED_AT });
  }
  return rows;
}

const verdictOf = (rows) => evaluateGuards(rows, WORLD, OP_TYPES, RULE_SET);

/** The finding as a reader sees it, WITHOUT the flag: what must not move when one is set. */
const shapeOf = (guard) => [guard.id, guard.entryId, guard.ruleId, guard.kind, guard.message,
  [...guard.offers].join('|'), String(guard.relatedEntryId)].join('::');

/** Record the DM's word for every finding of a verdict, one at a time, through the pure verb. */
function proceedPastAll(rows, guards) {
  let next = rows;
  for (const guard of guards) next = recordOverride(next, guard.entryId, guard.id);
  return next;
}

describe('EM-C4c — an overridden finding stands marked and the entry applies', () => {
  it('C4c-B1 — PROPERTY: over queues of one to ten, every guard carries proceed, and recording the DM word marks EXACTLY the findings it names while every id, kind, message and offer list stays where it was', () => {
    const rows = [];
    for (let length = 1; length <= LONGEST_QUEUE; length += 1) {
      const queue = queueOf(length);
      const before = verdictOf(queue);
      const frozenInput = JSON.stringify(queue);
      const proceeded = proceedPastAll(queue, before.guards);
      const after = verdictOf(proceeded);
      rows.push({
        length,
        guards: before.guards.length,
        withoutProceed: before.guards.filter((guard) => !guard.offers.includes(GUARD_OFFERS[4])).length,
        outsideKinds: before.guards.filter((guard) => !GUARD_KINDS.includes(guard.kind)).length,
        unevaluated: before.unevaluated.length,
        // THE SHAPES ARE COMPARED WHOLE: a finding that changed its words, its offers or its
        // related entry when the DM proceeded would move this string and red the table.
        shapesHeld: before.guards.map(shapeOf).join(',') === after.guards.map(shapeOf).join(','),
        markedAfter: after.guards.filter((guard) => guard.overridden === true).length,
        markedBefore: before.guards.filter((guard) => guard.overridden === true).length,
        // PURE: the verb never touched the registry it was handed, and answered with a new
        // frozen array each time.
        inputHeld: JSON.stringify(queue) === frozenInput,
        newFrozenArray: Object.isFrozen(proceeded) && proceeded !== queue,
        idsHeld: orderedDecrees(proceeded).map((row) => row.id).join(',')
          === orderedDecrees(queue).map((row) => row.id).join(','),
      });
    }

    // ANTI-VACUITY FIRST: the population every claim below is made over, with the engine's own
    // counts, so a run that produced nothing reds here rather than passing.
    expect(rows.length).toBe(LONGEST_QUEUE);
    expect(rows.map((row) => row.guards)).toEqual([1, 1, 2, 2, 2, 4, 5, 6, 6, 8]);

    const failures = rows.filter((row) => row.withoutProceed > 0 || row.outsideKinds > 0
      || row.unevaluated > 0 || row.shapesHeld !== true || row.markedBefore !== 0
      || row.markedAfter !== row.guards || row.inputHeld !== true
      || row.newFrozenArray !== true || row.idsHeld !== true);
    expect(failures.map((row) => [row.length, row]),
      'every guard of every queue carries proceed and a declared kind, leaves no rule silently '
      + 'unrun, reads UNMARKED before the DM speaks and MARKED after, keeps its id, kind, '
      + 'message, offers and related entry exactly, and the verb that recorded the word '
      + 'returned a NEW frozen registry without touching the one it was handed')
      .toEqual([]);
  });

  it('C4c-B2 — PROCEED ALWAYS APPLIES: a queue proceeded past in full applies in full — every entry reaches applied in the fold order with its op, its index and its override intact — and a queue with no override at all applies identically', () => {
    const rows = [];
    for (let length = 1; length <= LONGEST_QUEUE; length += 1) {
      const queue = queueOf(length);
      const guards = verdictOf(queue).guards;
      const proceeded = proceedPastAll(queue, guards);

      // THE TICK'S OWN ORDER: the head takes the pending entries in the fold order and marks
      // each applied. `orderedDecrees` is EM-C1's reading of that order, key for key.
      let applied = proceeded;
      for (const entry of orderedDecrees(proceeded)) applied = markApplied(applied, entry.id, TICK);

      // THE CONTROL: the same queue, nothing proceeded past, applied the same way.
      let bare = queue;
      for (const entry of orderedDecrees(queue)) bare = markApplied(bare, entry.id, TICK);

      const overrodeHeld = guards.every((guard) => {
        const row = applied.find((each) => each.id === guard.entryId);
        return Array.isArray(row.overrode) && row.overrode.includes(guard.id);
      });
      rows.push({
        length,
        staged: queue.length,
        appliedCount: applied.filter((row) => row.status === 'applied').length,
        pendingLeft: applied.filter((row) => row.status === 'pending').length,
        // "WITHOUT CONTRADICTION": nothing refused the queue, nothing was dropped, and the
        // entries that came out are the entries that went in, in the same order.
        idsHeld: applied.map((row) => row.id).join(',') === queue.map((row) => row.id).join(','),
        opsHeld: JSON.stringify(applied.map((row) => row.op))
          === JSON.stringify(queue.map((row) => row.op)),
        indicesHeld: applied.map((row) => row.orderIndex).join(',')
          === queue.map((row) => row.orderIndex).join(','),
        overrodeHeld,
        // The guards judge PENDING entries, so an applied queue has nothing left to say.
        verdictAfter: verdictOf(applied).guards.length,
        // THE CONTROL AGREES on everything but the override, so this arm measures the
        // override route rather than the tick.
        controlAgrees: bare.map((row) => `${row.id}:${row.status}:${row.orderIndex}`).join(',')
          === applied.map((row) => `${row.id}:${row.status}:${row.orderIndex}`).join(','),
        controlOverrode: bare.filter((row) => Object.hasOwn(row, 'overrode')).length,
      });
    }

    expect(rows.length).toBe(LONGEST_QUEUE);
    expect(rows.map((row) => row.appliedCount)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const failures = rows.filter((row) => row.appliedCount !== row.staged || row.pendingLeft !== 0
      || row.idsHeld !== true || row.opsHeld !== true || row.indicesHeld !== true
      || row.overrodeHeld !== true || row.verdictAfter !== 0 || row.controlAgrees !== true
      || row.controlOverrode !== 0);
    expect(failures.map((row) => [row.length, row]),
      'every entry of every proceeded queue applied, none was dropped or reordered, each kept '
      + 'its op, its index and the guard ids the DM proceeded past, the applied registry has '
      + 'nothing left for a guard to judge, and the un-proceeded control reached the identical '
      + 'statuses and indices while carrying no override at all')
      .toEqual([]);
  });

  it('C4c-B3 — THE RULE SET IS FROZEN: EM-C4c adds no rule and changes none, the five rules are EM-C3 own by id, appliesTo and needs, and no rule reads the overridden key at all — the marking is the ENGINE reading the entry', () => {
    // (i) THE FIVE RULES, derived from the module rather than listed beside the claim.
    const declared = GUARD_RULES.map((rule) => [
      rule.id,
      rule.appliesTo === null ? 'every-type' : [...rule.appliesTo].join('|'),
      [...rule.needs].join('|'),
    ]);
    expect(declared).toEqual([
      ['connection', 'every-type', ''],
      ['contention', 'every-type', ''],
      ['contradiction', 'every-type', ''],
      ['prerequisite', 'every-type', GUARD_RULE_DEPENDENCIES[0]],
      ['totality', 'add-faction|rebalance-power|remove-faction', GUARD_RULE_DEPENDENCIES[1]],
    ]);
    // Their ids are the rule set's order and are half of every guard id, so a rename here
    // orphans an override a DM already recorded.
    expect(GUARD_RULES.map((rule) => rule.id))
      .toEqual([...GUARD_RULES.map((rule) => rule.id)].sort(compareCodepoint));

    // (ii) WHERE THE MARKING LIVES. The engine reads the entry's own key; the rules never do.
    const engine = readFileSync(join(ROOT, 'src/domain/edit/guards.js'), 'utf8');
    const rules = readFileSync(join(ROOT, 'src/domain/edit/guardRules.js'), 'utf8');
    const readsIn = (source) => source.split('overrode').length - 1;
    // anchored: the engine's own count is asserted non-zero on the same scan, so the rules'
    // zero is a real reading of a live file and not an extractor that stopped working.
    expect(readsIn(engine)).toBeGreaterThan(0);
    expect(readsIn(rules)).toBe(0);
    expect(engine.includes('overrode.includes(id)')).toBe(true);

    // (iii) AND A RULE CANNOT SEE ONE. The same rule set, run over a queue whose entries all
    //       carry an override, yields findings identical in every field but the flag — which
    //       is what "the DM's word stands beside the guard's" means in executed terms.
    const queue = queueOf(LONGEST_QUEUE);
    const before = verdictOf(queue);
    const after = verdictOf(proceedPastAll(queue, before.guards));
    expect(after.guards.map(shapeOf)).toEqual(before.guards.map(shapeOf));
    expect(after.guards.map((guard) => guard.overridden)).toEqual(before.guards.map(() => true));
    expect(before.guards.map((guard) => guard.overridden)).toEqual(before.guards.map(() => false));
  });
});
