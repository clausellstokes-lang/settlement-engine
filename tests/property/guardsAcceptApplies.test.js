/**
 * guardsAcceptApplies.test.js — EM-C2's property arm, A8 (ARCH §6, design §7 C).
 *
 * THE PROPERTY: any registry the guards accept applies without contradiction, and `proceed`
 * ALWAYS applies. The engine can return no refusal because there is no refusal value to return,
 * so the property is proved by what every guard CARRIES rather than by what none of them says:
 * every guard offers `proceed`, every guard id is unique within its run, and the guards come
 * back ordered by the fold and then by rule id.
 *
 * ⭐ AND ITS OTHER HALF, WHICH IS WHY `unevaluated` EXISTS. A rule the caller under-supplied that
 * simply vanished would read as clean coverage, so the wired run asserts `unevaluated` EMPTY at
 * every length: the property is worth nothing if a silently unrun rule can produce it.
 *
 * ONE literal `describe`, ONE straight-line literal `it`, no parameter on either callback. Every
 * row is COLLECTED and the table is asserted ONCE (`tests/lint/seedLoopTotality.walker.test.js`
 * convicts a loop that asserts inside its own body).
 */
import { describe, expect, it } from 'vitest';

import { GUARD_OFFERS, evaluateGuards } from '../../src/domain/edit/guards.js';
import { OP_TYPES, makeOp } from '../../src/domain/edit/operations.js';

/** The longest queue the property is measured over; design §12.8's claim is length-blind. */
const LONGEST_QUEUE = 10;

/** One decree entry at EM-C1's declared shape, built through the real constructor. */
const entryOf = (id, type, index) => ({
  id,
  op: makeOp(type, { kind: OP_TYPES[type].target, id }, {}),
  status: 'pending',
  orderIndex: index,
});

/** A queue of `length` entries alternating the two phantom ops, in a lawful order. */
const queueOf = (length) => Array.from({ length }, (unused, index) => (
  entryOf('q' + index, index % 2 === 0 ? 'found-phantom' : 'promote-phantom', index)
));

/** The prerequisite rule, reading the DECLARATION against the entries the fold already passed. */
const PREREQUISITE = {
  id: 'prerequisite-from-declaration',
  appliesTo: null,
  needs: [],
  evaluate: (ctx) => {
    const staged = new Set(ctx.priorEntries.map((row) => row.op.type));
    return ctx.decl.requires.registry
      .filter((want) => !staged.has(want))
      .map((want) => ({ kind: 'prerequisite', message: 'the ground is not laid', facet: want }));
  },
};

/** A rule that speaks on every entry, so every length yields a population to measure. */
const ALWAYS = {
  id: 'always', appliesTo: null, needs: [], evaluate: () => ({ kind: 'connection', message: 'a link is implied' }),
};

/** The third rule, which declares an injected dependency and is judged against a supplied bag. */
const NEEDS_STRUCTURE = 'checkStructuralValidity';
const NEEDY = {
  id: 'needy',
  appliesTo: null,
  needs: [NEEDS_STRUCTURE],
  evaluate: () => ({ kind: 'totality', message: 'the shares do not sum' }),
};
const SUPPLIED = Object.freeze({ [NEEDS_STRUCTURE]: () => true });

/** The two runs the property is measured under, named so a red names the run. */
const RUNS = Object.freeze([
  Object.freeze({ name: 'unwired', rules: [PREREQUISITE, ALWAYS], deps: {} }),
  Object.freeze({ name: 'wired', rules: [PREREQUISITE, ALWAYS, NEEDY], deps: SUPPLIED }),
]);

/** What a verdict is supposed to look like: the fold's entry order, then the rule ids sorted. */
function expectedOrder(queue, rules, guards) {
  const ruleIds = rules.map((rule) => rule.id).sort();
  const seen = guards.map((guard) => guard.entryId + '|' + guard.ruleId);
  const lawful = queue.flatMap((row) => ruleIds.map((ruleId) => row.id + '|' + ruleId));
  return lawful.filter((pair) => seen.includes(pair)).join(',') === seen.join(',');
}

describe('EM-C2 - the guard engine property: proceed always, every id unique, coverage stated', () => {
  it('A8 - EM-C2: over queues of 1 to 10, wired and unwired, every guard offers proceed and no coverage goes silent', () => {
    const rows = [];
    for (const run of RUNS) {
      for (let length = 1; length <= LONGEST_QUEUE; length += 1) {
        const queue = queueOf(length);
        const verdict = evaluateGuards(queue, {}, OP_TYPES, { rules: run.rules, project: null, deps: run.deps });
        const ids = verdict.guards.map((guard) => guard.id);
        rows.push({
          run: run.name,
          length,
          guards: verdict.guards.length,
          uniqueIds: new Set(ids).size,
          withoutProceed: verdict.guards.filter((guard) => !guard.offers.includes('proceed')).length,
          outsideVocabulary: verdict.guards.filter((guard) => guard.offers.filter((offer) => !GUARD_OFFERS.includes(offer)).length > 0).length,
          ordered: expectedOrder(queue, run.rules, verdict.guards),
          unevaluated: verdict.unevaluated.length,
        });
      }
    }

    // ANTI-VACUITY FIRST: the table is the population every claim below is made over, and the
    // counts are the engine's own, so a run that produced nothing reds here rather than passing.
    expect(rows.length, 'twenty queues were judged').toBe(RUNS.length * LONGEST_QUEUE);
    expect(rows.map((row) => row.guards), 'the measured guard counts, one per queue')
      .toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);

    const failures = rows.filter((row) => row.withoutProceed > 0 || row.outsideVocabulary > 0
      || row.uniqueIds !== row.guards || row.ordered !== true || row.unevaluated !== 0);
    expect(failures.map((row) => [row.run, row.length, row]),
      'every guard of every queue offers proceed, carries only declared offers, has an id unique '
      + 'within its run, sits in the fold order and then the rule order, and leaves no rule '
      + 'silently unrun')
      .toEqual([]);
  });
});
