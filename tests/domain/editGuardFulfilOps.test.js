/**
 * editGuardFulfilOps.test.js — U65: EVERY FULFIL OFFER IS AN OP THE CATALOGUE ACCEPTS.
 *
 * EM-C4c measured the defect and could not cure it from the store: a guard minted
 * `fulfil` ops that `validateOp` refuses — `rebalance-power` carried a DISPLAY STRING
 * (`shares`) the row does not declare, `add-institution` left the row's required class
 * out, the owed act arrived with an empty payload, and NOT ONE of the three carried a
 * target at all. The verb C4c built stages a fulfil through the one op writer and
 * refuses what the catalogue refuses, so each of those offers was a dead control.
 *
 * ONE literal `describe`, FOUR straight-line literal `it`, no `.each`, no nesting, no
 * parameter on any callback (EM-PREAMBLE §P3.4). Every title begins `U65-<n> - ` so it is
 * unique in `tests/`, and a hyphen rather than an em dash because `vitest -t` is a REGEX.
 *
 * EM-C3's own battery (`editGuardRules.test.js`) is untouched by this member and stays the
 * home of the five rules' findings; this file judges ONE thing those arms never asked —
 * whether the op a finding hands the store is one the catalogue can express. The judge is
 * the REAL `validateOp` and the REAL catalogue, imported here: a test file sits outside
 * `tests/lint/editMutationPath.walker.test.js`'s walk, which reads `src/` alone.
 *
 * ⛔ NO `not.toContain` / `not.toMatch` / `not.toHaveProperty` ANYWHERE IN THIS FILE. Every
 * absence below is an EQUALITY against a value (`null`, `[]`) asserted beside the POSITIVE
 * that fires on the same fixture, so no negative can go vacuous.
 */
import { describe, expect, it } from 'vitest';

import { compareCodepoint } from '../../src/domain/deterministicSort.js';
import { GUARD_RULES, rulesFor } from '../../src/domain/edit/guardRules.js';
import { OP_TYPES, validateOp } from '../../src/domain/edit/operations.js';
import { checkStructuralValidity } from '../../src/generators/structuralValidator.js';
import { renormalizeFactionPower } from '../../src/generators/power/rulingStructure.js';

/** The catalogue's own key order, read from the producer rather than re-typed. */
const CATALOGUE_KEYS = Object.keys(OP_TYPES);

/** The two injected writers, at the names the rule set declares. */
const DEPS = Object.freeze({ checkStructuralValidity, renormalizeFactionPower });

/** One `EntityRef` per declared target kind, so any catalogue row can be staged. */
const TARGETS = Object.freeze({
  settlement: Object.freeze({ kind: 'settlement', id: 'town' }),
  institution: Object.freeze({ kind: 'institution', id: 'Citadel' }),
  npc: Object.freeze({ kind: 'npc', id: 'ada' }),
  faction: Object.freeze({ kind: 'faction', id: 'Guild' }),
  power: Object.freeze({ kind: 'power', id: 'Guild' }),
  phantom: Object.freeze({ kind: 'phantom', id: 'Ravenholt' }),
});

/** One PENDING decree entry at EM-C1's declared shape. */
const entryOf = (id, type, target, payload) => ({ id, status: 'pending', op: { type, target, payload } });

/** Every payload field the declaration names, filled from the catalogue rather than invented. */
const payloadFor = (type, name) => Object.fromEntries(
  Object.keys(OP_TYPES[type].payload).map((field) => [field, field === 'name' ? name : field]),
);

/** The frozen context the ENGINE builds, with the catalogue it hands a rule left open. */
const ctxOn = (entry, folded, catalogue, laterEntries) => Object.freeze({
  entry,
  op: entry.op,
  decl: OP_TYPES[entry.op.type] ?? null,
  index: 0,
  world: folded,
  folded,
  priorEntries: [],
  laterEntries: laterEntries ?? [],
  entries: [entry],
  catalogue,
  deps: DEPS,
});

/** The engine's own context, on the live catalogue. */
const ctxOf = (entry, folded) => ctxOn(entry, folded, OP_TYPES, []);

/** Run ONE rule by its stable id, which is the only handle a caller ever has on it. */
const fire = (ruleId, ctx) => GUARD_RULES.filter((rule) => rule.id === ruleId)[0].evaluate(ctx);

/** The gated institution the prerequisite arms judge, and the outer defence it rests on. */
const CITADEL = 'Citadel';
const WALLS = 'City walls and gates';
const ADD_CITADEL = entryOf('c1', 'add-institution', TARGETS.institution, payloadFor('add-institution', CITADEL));
const seatedAt = (rows) => ({ institutions: rows, npcs: [], config: {} });
const UNWALLED = seatedAt([{ name: CITADEL }]);
const WALLED = seatedAt([{ name: CITADEL }, { name: WALLS }]);

/** A faction roster as a world, cloned per call so no arm can leak a mutation into the next. */
const rosterOf = (rows) => ({
  institutions: [],
  npcs: [],
  config: {},
  powerStructure: { factions: rows.map((row) => ({ ...row })) },
});
const SHORT = [{ faction: 'Guild', power: 60 }, { faction: 'Court', power: 37 }];

/** The catalogue's verdict on ONE offered op, as a pair a message can read. */
const judged = (op) => [validateOp(op, null).ok, [...validateOp(op, null).errors]];

/** Every fulfil the five rules mint when the WHOLE catalogue is staged once. */
const fulfilsOverCatalogue = () => CATALOGUE_KEYS.flatMap((type) => {
  const entry = entryOf(`e-${type}`, type, TARGETS[OP_TYPES[type].target], payloadFor(type, CITADEL));
  const ctx = ctxOf(entry, { ...UNWALLED, powerStructure: { factions: SHORT.map((row) => ({ ...row })) } });
  return rulesFor(type)
    .map((rule) => rule.evaluate(ctx))
    .flatMap((yielded) => (Array.isArray(yielded) ? yielded : [yielded]))
    .filter((finding) => finding !== null)
    .map((finding) => finding.fulfil ?? null)
    .filter((op) => op !== null);
});

describe('U65 - every guard fulfil offer is an op the catalogue accepts', () => {
  it('U65-1 - the gate offer seats the missing prerequisite, whole enough for the catalogue', () => {
    const fired = fire('prerequisite', ctxOf(ADD_CITADEL, UNWALLED));
    expect([fired.fulfil.type, fired.fulfil.target, fired.fulfil.payload],
      'the op names the missing prerequisite as its target and carries EVERY field the row declares:'
      + ' the name from the finding, the class from the act that needs it')
      .toEqual(['add-institution', { kind: 'institution', id: WALLS }, { category: 'category', name: WALLS }]);
    expect(judged(fired.fulfil), 'so the catalogue accepts it, which is what the store asks before it stages')
      .toEqual([true, []]);
    expect(Object.keys(fired.fulfil.payload).sort(compareCodepoint),
      'and it carries NOTHING the row leaves undeclared, which is the other half of validateOp')
      .toEqual(Object.keys(OP_TYPES['add-institution'].payload).sort(compareCodepoint));
    // anchored: the same entry and the same rule fired three lines above on the unwalled roster,
    // so this null measures the seated wall rather than a rule that never speaks.
    expect(fire('prerequisite', ctxOf(ADD_CITADEL, WALLED)), 'a seated outer defence still silences the gate').toBeNull();
  });

  it('U65-2 - the share offer names one faction at the writer s own power', () => {
    const rebalance = entryOf('f1', 'rebalance-power', TARGETS.power, payloadFor('rebalance-power', CITADEL));
    const fired = fire('totality', ctxOf(rebalance, rosterOf(SHORT)));
    expect([fired.fulfil.type, fired.fulfil.target, fired.fulfil.payload],
      'the offer is the faction THIS act touches at the power the injected writer would give it,'
      + ' never the display string the message reads')
      .toEqual(['rebalance-power', { kind: 'power', id: 'Guild' }, { faction: 'Guild', power: 62 }]);
    expect(judged(fired.fulfil), 'and the catalogue accepts it').toEqual([true, []]);
    expect(fired.message,
      'while the MESSAGE still reads the whole rebalanced roster, because one op cannot say it and the DM must see it')
      .toBe('The factions hold 97 points of power between them, not 100. Rebalanced they would read: Court 38, Guild 62.');
    const elsewhere = entryOf('f2', 'rebalance-power', { kind: 'power', id: 'Nobody' }, payloadFor('rebalance-power', CITADEL));
    expect(fire('totality', ctxOf(elsewhere, rosterOf(SHORT))).fulfil.payload,
      'an act against a faction the folded roster does not hold falls back to the first row in codepoint order')
      .toEqual({ faction: 'Court', power: 38 });
  });

  it('U65-3 - the owed act takes this entry s target, and an unnameable value drops the op', () => {
    const promote = entryOf('q1', 'promote-phantom', TARGETS.phantom, payloadFor('promote-phantom', CITADEL));
    const owed = fire('connection', ctxOf(promote, UNWALLED));
    expect([owed.fulfil.type, owed.fulfil.target, owed.fulfil.payload],
      'the owed act is about the same thing this entry is about, so it takes that target and is named by it')
      .toEqual(['found-phantom', { kind: 'phantom', id: 'Ravenholt' }, { name: 'Ravenholt' }]);
    expect(judged(owed.fulfil), 'and the catalogue accepts it').toEqual([true, []]);
    const bent = Object.freeze({
      ...OP_TYPES,
      'found-phantom': Object.freeze({
        ...OP_TYPES['found-phantom'],
        payload: Object.freeze({ name: Object.freeze({ kind: 'pool', pool: 'name.settlement', required: true }) }),
      }),
    });
    const dropped = fire('connection', ctxOn(promote, UNWALLED, bent, []));
    // anchored: the SAME rule and the SAME entry minted an op four lines above against the live
    // catalogue, so this null measures the bent required value rather than a rule that fell silent.
    expect([dropped.kind, dropped.facet, dropped.offers, dropped.fulfil ?? null],
      'a required POOL value is the catalogue s word to choose, so the finding stands and offers to fulfil it'
      + ' while the OP is dropped rather than guessed')
      .toEqual(['connection', 'sequence', ['fulfil'], null]);
  });

  it('U65-4 - every fulfil the whole catalogue can drive is one validateOp accepts', () => {
    const minted = fulfilsOverCatalogue();
    expect(minted.map((op) => op.type).sort(compareCodepoint),
      'the drive is not vacuous: staging every row of the live catalogue once mints these offers')
      .toEqual(['add-institution', 'declare-war', 'declare-war', 'found-phantom', 'open-trade',
        'rebalance-power', 'rebalance-power', 'rebalance-power']);
    const refused = minted
      .filter((op) => !validateOp(op, null).ok)
      .map((op) => [op.type, [...validateOp(op, null).errors]]);
    expect(refused, 'and the catalogue accepts every one of them, which is the whole of U65').toEqual([]);
    const kinds = [...new Set(Object.values(OP_TYPES)
      .flatMap((row) => Object.values(row.payload).map((spec) => spec.kind)))].sort(compareCodepoint);
    expect(kinds, 'operations.js keeps PAYLOAD_SPEC_KINDS module-private and the rule set may not import it at all,'
      + ' so a NEW spec kind the fill cannot judge reds HERE rather than shipping an op nobody can stage')
      .toEqual(['enum', 'free', 'int', 'pool', 'ref']);
    expect([kinds.includes('free'), kinds.includes('ref')],
      'and the two the leaf spells as fillable are live members of that set').toEqual([true, true]);
  });
});
