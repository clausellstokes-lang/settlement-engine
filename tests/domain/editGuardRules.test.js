/**
 * editGuardRules.test.js — EM-C3's acceptance battery, A1 to A8.
 *
 * ONE literal `describe`, EIGHT straight-line literal `it`, no `.each`, no `runIf`, no nesting,
 * no parameter on any callback (EM-PREAMBLE §P3.4). Every title begins `A<n> - EM-C3: ` so it is
 * unique in `tests/`, and a hyphen rather than an em dash because `vitest -t` is a REGEX.
 *
 * Every set an arm iterates is IMPORTED from its producer — the catalogue from `operations.js`,
 * the two vocabularies and the absence value from the ENGINE (`guards.js`, judgment 236), the gate
 * table from `spatialData.js` — and the two injected writers are the REAL generator symbols,
 * imported HERE. A test file sits outside `tests/build/domainGeneratorsBoundary.test.js`'s walk,
 * which reads `src/domain` alone, so the rules are proved against the estate's own authored
 * knowledge rather than against a stub of it. That is the whole point of the injected seam: the
 * leaf may not import these two, and its battery must.
 *
 * ⛔ NO `not.toContain` / `not.toMatch` / `not.toHaveProperty` ANYWHERE IN THIS FILE. Every
 * absence below is an EQUALITY against a value (`null`, `[]`, `0`) asserted beside the POSITIVE
 * that fires on the same fixture, so no negative can go vacuous and no anchor row is owed.
 */
import { describe, expect, it } from 'vitest';

import { GATE_FEATURES } from '../../src/data/spatialData.js';
import { compareCodepoint } from '../../src/domain/deterministicSort.js';
import { EMPTY_RULE_SET, GUARD_KINDS, GUARD_OFFERS } from '../../src/domain/edit/guards.js';
import {
  GUARD_RULES, GUARD_RULE_DEPENDENCIES, makeGuardRuleSet, project, rulesFor,
} from '../../src/domain/edit/guardRules.js';
import { OP_TYPES, makeOp } from '../../src/domain/edit/operations.js';
import { checkStructuralValidity } from '../../src/generators/structuralValidator.js';
import { renormalizeFactionPower } from '../../src/generators/power/rulingStructure.js';

/** The catalogue's own key order, read from the producer rather than re-typed. */
const CATALOGUE_KEYS = Object.keys(OP_TYPES);

/** The two injected writers, at the names `GUARD_RULE_DEPENDENCIES` declares. */
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

/** The frozen context the ENGINE builds, at §5 clause item 5's eleven keys. */
const ctxOf = (entry, folded, priorEntries, laterEntries, deps) => Object.freeze({
  entry,
  op: entry.op,
  decl: OP_TYPES[entry.op.type] ?? null,
  index: 0,
  world: folded,
  folded,
  priorEntries: priorEntries ?? [],
  laterEntries: laterEntries ?? [],
  entries: [entry],
  catalogue: OP_TYPES,
  deps: deps ?? DEPS,
});

/** Run ONE rule by its stable id, which is the only handle a caller ever has on it. */
const fire = (ruleId, ctx) => GUARD_RULES.filter((rule) => rule.id === ruleId)[0].evaluate(ctx);

/** The gated institution A3 and A4 judge, and the outer defence it rests on. */
const CITADEL = 'Citadel';
const WALLS = 'City walls and gates';
const ADD_CITADEL = entryOf('c1', 'add-institution', TARGETS.institution, payloadFor('add-institution', CITADEL));
const seatedAt = (rows) => ({ institutions: rows, npcs: [], config: {} });
const UNWALLED = seatedAt([{ name: CITADEL }]);
const WALLED = seatedAt([{ name: CITADEL }, { name: WALLS }]);
const RUINED = seatedAt([{ name: CITADEL }, { name: WALLS, _worldPulseInactive: true }]);

/** A faction roster as a world, cloned per call so no arm can leak a mutation into the next. */
const rosterOf = (rows) => ({
  institutions: [],
  npcs: [],
  config: {},
  powerStructure: { factions: rows.map((row) => ({ ...row })) },
});
const SHORT = [{ faction: 'Guild', power: 60 }, { faction: 'Court', power: 37 }];
const EXACT = [{ faction: 'Guild', power: 60 }, { faction: 'Court', power: 40 }];
const ZEROED = [{ faction: 'Guild', power: 0 }, { faction: 'Court', power: 0 }];

/** Every catalogue row staged once, so a counterforce can drive the whole catalogue. */
const findingsOverCatalogue = () => CATALOGUE_KEYS.flatMap((type) => {
  const entry = entryOf(`e-${type}`, type, TARGETS[OP_TYPES[type].target], payloadFor(type, CITADEL));
  const ctx = ctxOf(entry, { ...UNWALLED, powerStructure: { factions: SHORT.map((row) => ({ ...row })) } });
  return rulesFor(type)
    .map((rule) => rule.evaluate(ctx))
    .flatMap((yielded) => (Array.isArray(yielded) ? yielded : [yielded]))
    .filter((finding) => finding !== null);
});

describe('EM-C3 - the five guard rules judge a folded world and never refuse', () => {
  it('A1 - EM-C3: the roster, the engine vocabulary and the catalogue agree in both directions', () => {
    const ids = GUARD_RULES.map((rule) => rule.id);
    expect(ids, 'the five ids ARE the five kinds, and the range rule of design 12.8 is dropped')
      .toEqual([...GUARD_KINDS]);
    expect(ids, 'and they are authored in compareCodepoint order, which is the order the engine runs')
      .toEqual([...ids].sort(compareCodepoint));
    const shapes = GUARD_RULES.map((rule) => [
      typeof rule.id, rule.appliesTo === null || Array.isArray(rule.appliesTo),
      Array.isArray(rule.needs), typeof rule.evaluate, Object.isFrozen(rule),
    ]);
    expect(shapes, 'every field is REQUIRED on every rule: an omitted key is not an absence value')
      .toEqual(GUARD_RULES.map(() => ['string', true, true, 'function', true]));
    const declared = GUARD_RULES.flatMap((rule) => rule.appliesTo ?? []);
    expect(declared.filter((type) => !Object.hasOwn(OP_TYPES, type)),
      'no rule claims an op type the catalogue does not carry').toEqual([]);
    expect([declared.length, [...GUARD_RULE_DEPENDENCIES]],
      'and the two injected names are declared in the same string order')
      .toEqual([3, ['checkStructuralValidity', 'renormalizeFactionPower']]);
  });

  it('A2 - EM-C3: no rule can refuse, driven twice over every row of the catalogue', () => {
    expect(CATALOGUE_KEYS.length, 'the real catalogue is live, or every count below counts nothing').toBe(22);
    const first = findingsOverCatalogue();
    const second = findingsOverCatalogue();
    expect(first.length, 'the drive is not vacuous: the whole catalogue yields this many findings').toBe(14);
    expect(second, 'and the same drive a second time is byte-identical, because no rule holds state')
      .toEqual(first);
    const kinds = [...new Set(first.map((finding) => finding.kind))].sort(compareCodepoint);
    const offers = [...new Set(first.flatMap((finding) => finding.offers ?? []))].sort(compareCodepoint);
    expect(kinds.filter((kind) => !GUARD_KINDS.includes(kind)), 'every kind is a member of the engine vocabulary').toEqual([]);
    expect(offers.filter((offer) => !GUARD_OFFERS.includes(offer)), 'and so is every offer a rule spells').toEqual([]);
    expect([kinds, offers], 'the kinds and offers this catalogue actually reaches, named rather than counted')
      .toEqual([['connection', 'prerequisite', 'totality'], ['fulfil', 'self']]);
  });

  it('A3 - EM-C3: the prerequisite gate reads the table through the REAL injected validator', () => {
    const fired = fire('prerequisite', ctxOf(ADD_CITADEL, UNWALLED));
    expect([fired.kind, fired.facet, fired.fulfil.type, fired.fulfil.payload.name],
      'the first missing prerequisite in compareCodepoint order becomes the fulfil offer')
      .toEqual(['prerequisite', 'gate', 'add-institution', WALLS]);
    expect(fired.message, 'and the words are the gate table s own authored reason, quoted, never rewritten')
      .toBe(`${CITADEL} rests on something the town does not have: ${GATE_FEATURES[CITADEL].reason}`);
    // anchored: the same entry and the same rule fire above on the unwalled roster, so this null
    // measures the seated wall rather than a rule that never speaks.
    expect(fire('prerequisite', ctxOf(ADD_CITADEL, WALLED)), 'a seated outer defence silences the gate').toBeNull();
    const calls = [];
    const counting = Object.freeze({
      checkStructuralValidity: (roster, config) => {
        calls.push([roster.length, typeof config]);
        return checkStructuralValidity(roster, config);
      },
      renormalizeFactionPower,
    });
    const ungated = entryOf('c2', 'add-institution', TARGETS.institution, payloadFor('add-institution', 'Tavern'));
    expect(fire('prerequisite', ctxOf(ungated, UNWALLED, [], [], counting)), 'an ungated name yields silence').toBeNull();
    expect([Object.hasOwn(GATE_FEATURES, 'Tavern'), calls],
      'and it yields it BEFORE the validator is called, because the table is consulted first')
      .toEqual([false, []]);
  });

  it('A4 - EM-C3: a ruined wall satisfies no gate, and the world facet names its own predicate', () => {
    const ruined = fire('prerequisite', ctxOf(ADD_CITADEL, RUINED));
    expect([ruined.kind, ruined.facet, ruined.fulfil.payload.name],
      'the SAME roster whose live wall silenced the gate fires it once the wall is calamity-ruined')
      .toEqual(['prerequisite', 'gate', WALLS]);
    expect(fire('prerequisite', ctxOf(ADD_CITADEL, WALLED)), 'the live-wall control, in this arm, is still silent').toBeNull();
    const removeNpc = entryOf('n1', 'remove-npc', TARGETS.npc, payloadFor('remove-npc', CITADEL));
    const absent = fire('prerequisite', ctxOf(removeNpc, seatedAt([])));
    expect([absent.kind, absent.facet, absent.offers, absent.message],
      'the world facet names the unmet predicate the DECLARATION carries')
      .toEqual(['prerequisite', 'world', ['self'], 'This act needs the world to be a way it is not yet: npcPresent.']);
    // anchored: the same entry fired one line above against the same shape of world, so this null
    // measures the seated person rather than an unreachable facet.
    expect(fire('prerequisite', ctxOf(removeNpc, { institutions: [], npcs: [{ id: 'ada' }], config: {} })),
      'and it falls silent the moment the person is present').toBeNull();
  });

  it('A5 - EM-C3: totality reads its target from the writer, and leaves the world byte-identical', () => {
    const rebalance = entryOf('f1', 'rebalance-power', TARGETS.power, payloadFor('rebalance-power', CITADEL));
    const measured = [SHORT, EXACT, ZEROED].map((rows) => {
      const world = rosterOf(rows);
      const before = JSON.stringify(world);
      const finding = fire('totality', ctxOf(rebalance, world));
      return [finding === null ? null : finding.message, JSON.stringify(world) === before];
    });
    expect(measured, 'a short roster names both sums and the rebalanced line; an exact and an all-zero one are silence')
      .toEqual([
        ['The factions hold 97 points of power between them, not 100. Rebalanced they would read: Court 38, Guild 62.', true],
        [null, true],
        [null, true],
      ]);
    const independent = rosterOf(SHORT);
    const clone = independent.powerStructure.factions.map((row) => ({ ...row }));
    renormalizeFactionPower(clone);
    expect([clone.reduce((sum, row) => sum + row.power, 0), independent.powerStructure.factions.map((row) => row.power)],
      'the target is the writer s own total, and the writer mutated only the CLONE the rule handed it')
      .toEqual([100, [60, 37]]);
  });

  it('A6 - EM-C3: contradiction and contention fire only on ONE target', () => {
    const here = TARGETS.institution;
    const elsewhere = { kind: 'institution', id: 'Temple' };
    const prior = entryOf('p1', 'set-institution-state', here, payloadFor('set-institution-state', CITADEL));
    const same = entryOf('p2', 'remove-institution', here, payloadFor('remove-institution', CITADEL));
    const other = entryOf('p3', 'remove-institution', elsewhere, payloadFor('remove-institution', CITADEL));
    const clash = fire('contradiction', ctxOf(same, UNWALLED, [prior]));
    expect([clash.kind, clash.relatedEntryId, clash.offers],
      'the earlier entry is NAMED so the DM may keep either, and neither offer can refuse')
      .toEqual(['contradiction', 'p1', ['keepBoth', 'keepFirst', 'keepLast']]);
    const first = entryOf('s1', 'set-field', TARGETS.settlement, { field: 'name', value: 'A' });
    const later = entryOf('s2', 'set-field', TARGETS.settlement, { field: 'name', value: 'B' });
    const away = entryOf('s3', 'set-field', { kind: 'settlement', id: 'other' }, { field: 'name', value: 'C' });
    const shared = fire('contention', ctxOf(later, UNWALLED, [first]));
    expect([shared.kind, shared.relatedEntryId, shared.offers],
      'two waiting acts setting one field contend, whatever their op types')
      .toEqual(['contention', 's1', ['keepFirst', 'keepLast']]);
    // anchored: both rules fired above on the SAME pair of entries moved onto one target, so these
    // two nulls measure the target split rather than two rules that never speak.
    expect([fire('contradiction', ctxOf(other, UNWALLED, [prior])), fire('contention', ctxOf(away, UNWALLED, [first]))],
      'and both fall silent the moment the two acts touch different things').toEqual([null, null]);
  });

  it('A7 - EM-C3: connection judges the registry half, never the flattened op.requires', () => {
    const promote = entryOf('q1', 'promote-phantom', TARGETS.phantom, payloadFor('promote-phantom', CITADEL));
    const found = entryOf('q0', 'found-phantom', TARGETS.phantom, payloadFor('found-phantom', 'Ravenholt'));
    const owed = fire('connection', ctxOf(promote, UNWALLED));
    const staged = fire('connection', ctxOf(promote, UNWALLED, [], [found]));
    expect([owed.kind, owed.facet, owed.offers, owed.fulfil.type],
      'an owed registry prerequisite nobody stages offers to fulfil it, and nothing else')
      .toEqual(['connection', 'sequence', ['fulfil'], 'found-phantom']);
    expect([staged.offers, staged.relatedEntryId],
      'reorder is offered ONLY when the owed entry is staged later, and it names that entry')
      .toEqual([['fulfil', 'reorder'], 'q0']);
    // anchored: the same rule, the same entry and the same catalogue spoke twice above, so this
    // null measures the staging order rather than a rule that cannot fire.
    expect(fire('connection', ctxOf(promote, UNWALLED, [found])), 'and it is silent once the ground is laid').toBeNull();
    const removeNpc = entryOf('n2', 'remove-npc', TARGETS.npc, payloadFor('remove-npc', CITADEL));
    expect([makeOp('remove-npc', TARGETS.npc, {}).requires, OP_TYPES['remove-npc'].requires.registry],
      'makeOp FLATTENS a WORLD predicate into op.requires, where a registry read would pick it up')
      .toEqual([['npcPresent'], []]);
    expect(fire('connection', ctxOf(removeNpc, seatedAt([]))),
      'so the rule that reads the DECLARATION has nothing to say about remove-npc').toBeNull();
  });

  it('A8 - EM-C3: the fold, the rule set and purity over the whole catalogue', () => {
    const world = { ...rosterOf(SHORT), institutions: [{ name: CITADEL }] };
    const before = JSON.stringify(world);
    const moved = CATALOGUE_KEYS.filter((type) => project(
      world,
      { type, target: TARGETS[OP_TYPES[type].target], payload: payloadFor(type, CITADEL) },
      OP_TYPES,
    ) !== null);
    expect([moved.sort(compareCodepoint), JSON.stringify(world) === before],
      'project returns a NEW world for the five rows that move a fact a rule reads, and null for the rest')
      .toEqual([['add-faction', 'add-institution', 'rebalance-power', 'remove-faction', 'remove-institution'], true]);
    const coverage = CATALOGUE_KEYS.map((type) => rulesFor(type).length);
    const share = CATALOGUE_KEYS.filter((type) => rulesFor(type).length === 5);
    expect([coverage.filter((n) => n === 4).length, share.sort(compareCodepoint), Math.min(...coverage)],
      'nineteen rows reach four rules and three reach five, so no catalogue row is guard-free')
      .toEqual([19, ['add-faction', 'rebalance-power', 'remove-faction'], 4]);
    const set = makeGuardRuleSet(DEPS);
    expect([Object.keys(set).sort(compareCodepoint), Object.isFrozen(set), set.rules === GUARD_RULES],
      'the rule set is frozen at EMPTY_RULE_SET s own three keys')
      .toEqual([Object.keys(EMPTY_RULE_SET).sort(compareCodepoint), true, true]);
    const broken = { institutions: 'not a roster', powerStructure: 7, npcs: null, config: 'none' };
    const survived = CATALOGUE_KEYS.flatMap((type) => rulesFor(type)
      .map((rule) => rule.evaluate(ctxOf(entryOf('m', type, undefined, undefined), broken))));
    expect([survived.length, survived.filter((finding) => finding !== null && typeof finding !== 'object').length],
      'and every rule is TOTAL over a malformed world: it returns, it never throws')
      .toEqual([91, 0]);
  });
});
