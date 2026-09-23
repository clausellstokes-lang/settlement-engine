/**
 * editGuards.test.js — EM-C2's acceptance battery, A1 to A7 (A8 is the property file
 * `tests/property/guardsAcceptApplies.test.js`).
 *
 * ONE literal `describe`, SEVEN straight-line literal `it`, no `.each`, no `runIf`, no nesting,
 * no parameter on any callback (EM-PREAMBLE §P3.4). Every title begins `A<n> - EM-C2: ` so it is
 * unique in `tests/`, and a hyphen rather than an em dash because `vitest -t` is a REGEX.
 *
 * ⛔ THE ARM THIS FILE EXISTS FOR IS A2. `src/domain/edit/operations.js :: makeOp` FLATTENS the
 * declaration's `{ world, registry }` pair into one array, so a rule reading `op.requires` picks
 * up `npcPresent` — a design §18 WORLD predicate that decides which seals a card OFFERS and is
 * not a guard's business at all. A2 measures BOTH directions over the real catalogue and names
 * the two op types the flattened read invents, so an engine that silently handed `op.requires`
 * through reds by name rather than by a count nobody can read.
 *
 * The rules here are SYNTHETIC. EM-C3 owns the real five; this file imports no rules module, and
 * it asserts the ENGINE: the fold, the order, the offers, the ids, the wiring report and purity.
 */
import { describe, expect, it } from 'vitest';

import {
  EMPTY_RULE_SET, GUARD_KINDS, GUARD_OFFERS, evaluateGuards,
} from '../../src/domain/edit/guards.js';
import { OP_TYPES, makeOp } from '../../src/domain/edit/operations.js';

/** The catalogue's own key order, read from the producer rather than re-typed. */
const CATALOGUE_KEYS = Object.keys(OP_TYPES);

/** One decree entry at EM-C1's declared shape, built through the real constructor. */
const entryOf = (id, type, extra) => ({
  id,
  op: makeOp(type, { kind: OP_TYPES[type].target, id }, {}),
  status: 'pending',
  ...extra,
});

/** A rule set at §5 clause item 1's spelling, with the two absence values spelled once. */
const setOf = (rules, project, deps) => ({
  rules,
  project: project === undefined ? null : project,
  deps: deps === undefined ? {} : deps,
});

/**
 * THE PREREQUISITE RULE, in the two sources A2 separates. It emits one finding per declared
 * requirement no EARLIER pending entry already stages, which is the only reading that can tell
 * an ordered queue from a disordered one.
 */
const prereqFrom = (id, read) => ({
  id,
  appliesTo: null,
  needs: [],
  evaluate: (ctx) => {
    const staged = new Set(ctx.priorEntries.map((row) => row.op.type));
    return read(ctx)
      .filter((want) => !staged.has(want))
      .map((want) => ({ kind: 'prerequisite', message: 'the ground is not laid', facet: want }));
  },
});

/** The DECLARATION reading (§5 clause item 3), and the FLATTENED `Op` reading it refutes. */
const FROM_DECL = prereqFrom('prereq-from-decl', (ctx) => ctx.decl.requires.registry);
const FROM_OP = prereqFrom('prereq-from-op', (ctx) => ctx.op.requires);

/** A rule that speaks on every entry, so an order or a count can be read off the result. */
const firesAlways = (id, kind) => ({
  id, appliesTo: null, needs: [], evaluate: () => ({ kind, message: 'the herald has a word' }),
});

/** The two-entry queue A1, A6 and A7 all read, in each of its two orders. */
const IN_ORDER = [
  entryOf('f', 'found-phantom', { orderIndex: 0 }),
  entryOf('p', 'promote-phantom', { orderIndex: 1 }),
];
const OUT_OF_ORDER = [
  entryOf('p', 'promote-phantom', { orderIndex: 0 }),
  entryOf('f', 'found-phantom', { orderIndex: 1 }),
];

/** Every row of the real catalogue staged at once, in the catalogue's own order. */
const WHOLE_CATALOGUE = CATALOGUE_KEYS.map((type, index) => entryOf('e' + index, type, { orderIndex: index }));

/** The op type behind one of those entry ids, so an arm can name the ROW rather than the id. */
const typeOfEntry = (id) => WHOLE_CATALOGUE.filter((row) => row.id === id).map((row) => row.op.type)[0];

/** A registry of one applied, one withdrawn and one pending entry. */
const MIXED_REGISTRY = [
  { ...entryOf('a', 'set-field', { orderIndex: 0 }), status: 'applied' },
  { ...entryOf('w', 'set-field', { orderIndex: 1 }), status: 'withdrawn' },
  entryOf('p', 'set-field', { orderIndex: 2 }),
];

/** The three wired rules of A5: one per injected writer, and one that omits `needs` entirely. */
const NEEDS_STRUCTURE = 'checkStructuralValidity';
const NEEDS_POWER = 'renormalizeFactionPower';
const BOTH_DEPS = Object.freeze({
  [NEEDS_STRUCTURE]: () => true,
  [NEEDS_POWER]: () => true,
});

/** Freeze a value and everything under it, so a mutation anywhere inside throws or is refused. */
function deepFreeze(value) {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

describe('EM-C2 - the guard engine: a pure fold that judges nothing itself', () => {
  it('A1 - EM-C2: the fold is what makes the property non-vacuous, and a queue of one is judged like a queue of ten', () => {
    const ordered = evaluateGuards(IN_ORDER, {}, OP_TYPES, setOf([FROM_DECL]));
    const disordered = evaluateGuards(OUT_OF_ORDER, {}, OP_TYPES, setOf([FROM_DECL]));
    // The liveness anchor for the empty result: the SAME rule, the SAME two entries and the
    // SAME catalogue speak once when the ground is not laid, so the zero above measures the
    // order rather than a rule that never fires.
    expect(disordered.guards.map((guard) => [guard.entryId, guard.kind, guard.id]))
      .toEqual([['p', 'prerequisite', 'prereq-from-decl:p:-:found-phantom']]);
    expect(ordered.guards, 'promote-phantom follows found-phantom, so the fold has nothing to say')
      .toEqual([]);
    const alone = evaluateGuards([OUT_OF_ORDER[0]], {}, OP_TYPES, setOf([FROM_DECL]));
    expect(alone.guards.map((guard) => guard.id), 'a queue of one is judged exactly as a queue of ten')
      .toEqual(['prereq-from-decl:p:-:found-phantom']);
  });

  it('A2 - EM-C2: the rule reads the DECLARATION, never the flattened Op', () => {
    expect(CATALOGUE_KEYS.length, 'the real catalogue is live, or every count below counts nothing').toBe(22);
    const fromDecl = evaluateGuards(WHOLE_CATALOGUE, {}, OP_TYPES, setOf([FROM_DECL]));
    const fromOp = evaluateGuards(WHOLE_CATALOGUE, {}, OP_TYPES, setOf([FROM_OP]));
    expect(fromDecl.guards.length, 'the declaration reading over the whole catalogue').toBe(3);
    expect(fromOp.guards.length, 'the flattened reading over the same catalogue').toBe(5);
    const declared = new Set(fromDecl.guards.map((guard) => guard.entryId));
    const invented = fromOp.guards.map((guard) => guard.entryId).filter((id) => !declared.has(id));
    // THE ANTI-VACUITY ARM, BOTH DIRECTIONS AND BY NAME: the two extra rows are the two whose
    // `requires.world` is a §18 world condition, so an engine that handed `op.requires` through
    // reds here with the op types printed rather than with an unreadable count.
    expect(invented.map(typeOfEntry).sort(), 'the flattened read invents exactly these rows')
      .toEqual(['remove-npc', 'set-npc-status']);
    expect(fromDecl.guards.map((guard) => typeOfEntry(guard.entryId)).sort(),
      'and the declaration read speaks only where a REGISTRY prerequisite is unstaged')
      .toEqual(['close-trade', 'recall-force', 'resolve-outcome']);
    expect(OP_TYPES['remove-npc'].requires.world, 'the row the flattened read invents, at its producer')
      .toEqual(['npcPresent']);
  });

  it('A3 - EM-C2: proceed is always offered, and only declared offers survive', () => {
    const loud = {
      id: 'loud',
      appliesTo: null,
      needs: [],
      evaluate: () => ({
        kind: 'contention',
        message: 'two hands are on one field',
        offers: ['reorder', 'nonsense', 'reorder', 'fulfil'],
      }),
    };
    const quiet = firesAlways('quiet', 'totality');
    const verdict = evaluateGuards([entryOf('one', 'set-field', { orderIndex: 0 })], {}, OP_TYPES, setOf([loud, quiet]));
    expect(verdict.guards.map((guard) => [guard.ruleId, guard.offers])).toEqual([
      ['loud', ['reorder', 'fulfil', 'proceed']],
      ['quiet', ['proceed']],
    ]);
    const empties = verdict.guards.filter((guard) => guard.offers.length === 0);
    const refusals = verdict.guards.filter((guard) => !guard.offers.includes('proceed'));
    expect([empties.length, refusals.length], 'no guard anywhere in this file is a refusal').toEqual([0, 0]);
    expect(GUARD_OFFERS.includes('nonsense'), 'the dropped member is dropped because it is not one').toBe(false);
  });

  it('A4 - EM-C2: the order is design 11s, it is total, and shuffling the input does not move it', () => {
    const shuffled = [
      entryOf('y', 'set-field', { orderIndex: 0, when: { season: 'winter' } }),
      entryOf('z', 'set-field', { orderIndex: 9 }),
      entryOf('x', 'set-field', { orderIndex: 0, when: { tick: 3 } }),
      entryOf('v', 'set-field', { orderIndex: 2 }),
      entryOf('w', 'set-field', { orderIndex: 0, when: { tick: 1 } }),
    ];
    const rule = [firesAlways('fires', 'connection')];
    const first = evaluateGuards(shuffled, {}, OP_TYPES, setOf(rule));
    const again = evaluateGuards([shuffled[3], shuffled[0], shuffled[4], shuffled[1], shuffled[2]], {}, OP_TYPES, setOf(rule));
    expect(first.guards.map((guard) => guard.entryId),
      'absent when first by orderIndex, then the ticks ascending, then the season-only entry')
      .toEqual(['v', 'z', 'w', 'x', 'y']);
    expect(again.guards.map((guard) => guard.entryId), 'and a different input order gives the same output order')
      .toEqual(['v', 'z', 'w', 'x', 'y']);
  });

  it('A5 - EM-C2: only pending, only well-formed, and only wired', () => {
    const messy = {
      id: 'messy',
      appliesTo: null,
      needs: [],
      evaluate: () => [
        null,
        42,
        { kind: 'nope', message: 'a kind outside the vocabulary' },
        { kind: 'prerequisite', message: '' },
        { kind: 'prerequisite', message: 'kept' },
      ],
    };
    const survived = evaluateGuards(MIXED_REGISTRY, {}, OP_TYPES, setOf([messy]));
    expect(survived.guards.map((guard) => [guard.entryId, guard.message]),
      'one entry is judged of three, and one finding survives of five')
      .toEqual([['p', 'kept']]);
    expect(GUARD_KINDS.includes('nope'), 'the refused kind is refused because it is not one').toBe(false);

    const saw = [];
    const also = {
      id: 'also',
      appliesTo: null,
      needs: [NEEDS_STRUCTURE],
      evaluate: (ctx) => {
        saw.push(Object.keys(ctx.deps).sort());
        return { kind: 'prerequisite', message: 'also' };
      },
    };
    const wired = { id: 'wired', appliesTo: null, needs: [NEEDS_POWER], evaluate: () => ({ kind: 'totality', message: 'wired' }) };
    const loose = { id: 'loose', appliesTo: null, evaluate: () => ({ kind: 'connection', message: 'loose' }) };
    const three = [also, wired, loose];
    const withBoth = evaluateGuards(MIXED_REGISTRY, {}, OP_TYPES, setOf(three, null, BOTH_DEPS));
    const withOne = evaluateGuards(MIXED_REGISTRY, {}, OP_TYPES, setOf(three, null, { [NEEDS_STRUCTURE]: BOTH_DEPS[NEEDS_STRUCTURE] }));
    const withNone = evaluateGuards(MIXED_REGISTRY, {}, OP_TYPES, setOf(three));
    const onNothing = evaluateGuards([], {}, OP_TYPES, setOf(three));
    expect([withBoth.guards.map((guard) => guard.ruleId), withBoth.unevaluated]).toEqual([['also', 'wired'], []]);
    expect(saw[0], 'the rule that ran was handed both injected names').toEqual([NEEDS_STRUCTURE, NEEDS_POWER].sort());
    expect([withOne.guards.map((guard) => guard.ruleId), withOne.unevaluated]).toEqual([['also'], ['wired']]);
    expect([withNone.guards.map((guard) => guard.ruleId), withNone.unevaluated]).toEqual([[], ['also', 'wired']]);
    expect([onNothing.guards.length, onNothing.unevaluated],
      'an empty registry still reports the wiring, because what is wrong is the caller')
      .toEqual([0, ['also', 'wired']]);
    const loosely = [withBoth, withOne, withNone, onNothing]
      .flatMap((verdict) => [...verdict.guards.map((guard) => guard.ruleId), ...verdict.unevaluated])
      .filter((id) => id === 'loose');
    expect(loosely, 'a rule with no needs key at all is malformed and appears in NEITHER half').toEqual([]);

    const notARegistry = evaluateGuards('a registry this is not', {}, OP_TYPES, setOf(three, null, BOTH_DEPS));
    const noRuleSet = evaluateGuards(MIXED_REGISTRY, {}, OP_TYPES);
    expect([notARegistry.guards.length, notARegistry.unevaluated], 'a non-array registry yields no guards').toEqual([0, []]);
    expect([noRuleSet.guards.length, noRuleSet.unevaluated], 'and an absent rule set reads as the empty one').toEqual([0, []]);
    expect(EMPTY_RULE_SET, 'which is the exported absence value itself').toEqual({ rules: [], project: null, deps: {} });
    expect([Object.isFrozen(noRuleSet), Object.isFrozen(noRuleSet.guards), Object.isFrozen(noRuleSet.unevaluated)],
      'the verdict and both halves are frozen').toEqual([true, true, true]);
  });

  it('A6 - EM-C2: the id is stable, an override marks its guard, and a twin takes an ordinal', () => {
    const once = evaluateGuards(OUT_OF_ORDER, {}, OP_TYPES, setOf([FROM_DECL]));
    const twice = evaluateGuards(OUT_OF_ORDER, {}, OP_TYPES, setOf([FROM_DECL]));
    expect([once.guards.map((guard) => guard.id), twice.guards.map((guard) => guard.id)],
      'the id is derived from the rule and the entry, never counted, so a reload mints the same one')
      .toEqual([['prereq-from-decl:p:-:found-phantom'], ['prereq-from-decl:p:-:found-phantom']]);

    const marked = [{ ...OUT_OF_ORDER[0], overrode: [once.guards[0].id] }, OUT_OF_ORDER[1]];
    const afterOverride = evaluateGuards(marked, {}, OP_TYPES, setOf([FROM_DECL]));
    expect(afterOverride.guards.map((guard) => [guard.id, guard.overridden]),
      'an overridden guard is MARKED and still returned, because a surface could not recover a suppressed one')
      .toEqual([['prereq-from-decl:p:-:found-phantom', true]]);

    const twin = {
      id: 'twin',
      appliesTo: null,
      needs: [],
      evaluate: () => [{ kind: 'contradiction', message: 'one' }, { kind: 'contradiction', message: 'two' }],
    };
    const twinned = evaluateGuards([entryOf('t', 'set-field', { orderIndex: 0 })], {}, OP_TYPES, setOf([twin]));
    expect(twinned.guards.map((guard) => guard.id), 'two findings under one identity take an ordinal, and both survive')
      .toEqual(['twin:t:-:-', 'twin:t:-:-:2']);
  });

  it('A7 - EM-C2: nothing the engine was handed moves, and project is the only fold', () => {
    const world = deepFreeze({ trail: [] });
    const queue = deepFreeze([
      entryOf('p', 'promote-phantom', { orderIndex: 0 }),
      entryOf('f', 'found-phantom', { orderIndex: 1 }),
    ]);
    const before = JSON.stringify(queue);
    const trails = [];
    const watcher = {
      id: 'watcher',
      appliesTo: null,
      needs: [],
      evaluate: (ctx) => {
        trails.push(ctx.folded.trail.join(','));
        return null;
      },
    };
    const project = (folded, op) => ({ trail: [...folded.trail, op.type] });
    evaluateGuards(queue, world, OP_TYPES, setOf([watcher], project));
    expect(trails, 'entry 0 is judged against the world itself, entry 1 against the world with entry 0 applied')
      .toEqual(['', 'promote-phantom']);
    expect([world.trail.length, JSON.stringify(queue) === before],
      'the frozen world is still empty and the registry is byte-identical')
      .toEqual([0, true]);

    const identities = [];
    const byIdentity = {
      id: 'identity',
      appliesTo: null,
      needs: [],
      evaluate: (ctx) => {
        identities.push(ctx.folded === world);
        return null;
      },
    };
    evaluateGuards(queue, world, OP_TYPES, setOf([byIdentity]));
    expect(identities, 'with no projector the engine synthesises nothing: folded IS the world, by identity')
      .toEqual([true, true]);
  });
});
