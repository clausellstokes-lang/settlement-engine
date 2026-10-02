/**
 * dmLayer.test.js — EM-B2a1's UNIT BATTERY for the DM layer's leaf (cases A1-A6).
 *
 * ⭐ THIS BATTERY EXISTS TO CONVICT A WRONG LEAF BEFORE ANYTHING IMPORTS IT. Nothing in the
 * estate imports `src/domain/edit/dmLayer.js` at this member's landing, and no instrument
 * convicts an unimported module under `src/` by totality, so the liveness proof is this
 * file's: every arm drives the real leaf over its WHOLE declared input space, including the
 * hostile one, and the packet's four plant-and-restore mutants are run against these same
 * arms by the gate script. A leaf that mutates, that throws where it should refuse, that
 * FAILS OPEN on a malformed consult, or that reaches for a clock is reddened here by name.
 *
 * ⭐ THE THREE CONSTRUCTION RULES (recordRegisterTotality's §6 header) are obeyed:
 *   1. `describe`, `it` and `expect` are each bound EXACTLY ONCE, at the import, and never
 *      re-bound - not even as a callback parameter. A stray rebind parks the whole file out
 *      of the sovereignty-lighting census.
 *   2. NOTHING RE-TYPES A PRODUCER'S SET. The refusal set is IMPORTED from the leaf and the
 *      observed reasons are DERIVED by driving it; the layer's key set is read off
 *      `EMPTY_DM_LAYER` itself. A local literal copy of either is what
 *      `contractTestAntiVacuity.walker.test.js` Rule 2 convicts.
 *   3. Every negative carries `// anchored:` on the line immediately above, or is a
 *      both-directions equality that cannot go vacuous.
 *
 * ⭐ NO ARM ASSERTS INSIDE A LOOP. Each matrix is COLLECTED and then asserted once, which is
 * why a case with eleven inputs is still ONE `it` (`seedLoopTotality.walker.test.js`).
 *
 * ⛔ THE CONSULT STUB IS A FROZEN LITERAL IN THIS FILE AND IS NEVER IMPORTED FROM EM-A1. The
 * leaf takes the consult as its third argument precisely so this battery can drive all three
 * refusals today; importing EM-A1 here would test the pair, not the leaf.
 */
import { describe, expect, it } from 'vitest';
import {
  APPLY_EDIT_REASONS,
  DM_ID_NS,
  EMPTY_DM_LAYER,
  applyEdit,
  layerRead,
  mintDmId,
} from '../../src/domain/edit/dmLayer.js';

/**
 * The injected consult, frozen, mirroring EM-A1's two members by shape. `npc` is the one
 * declared card type and `role` its one declared field, which is enough to reach every
 * refusal: an unknown card type and an undeclared field are then both nameable.
 */
const CONSULT = Object.freeze({
  isEditableCard: (cardType) => cardType === 'npc',
  declarationsFor: (cardType) => (cardType === 'npc'
    ? Object.freeze([Object.freeze({ field: 'role' }), Object.freeze({ field: 'goal.short' })])
    : Object.freeze([])),
});

/** One well-formed op. Every malformed op below is this one with a single member spoiled. */
const GOOD_OP = Object.freeze({
  kind: 'set-root',
  key: 'npc:3:role',
  cardType: 'npc',
  field: 'role',
  value: 'the harbourmaster',
});

/** A frozen, JSON-stable snapshot, so "nothing was mutated" is checkable after the fact. */
const snapshot = (value) => JSON.stringify(value);

/** Drive the leaf and report only what a refusal is required to carry. */
const refusalOf = (layer, op, declarations) => {
  const result = applyEdit(layer, op, declarations);
  return { ok: result.ok, reason: result.reason, sameLayer: result.layer === layer };
};

/** Run a thunk and name what came back, so "nothing throws" is an assertion, not a stack. */
const outcomeOf = (thunk) => {
  try {
    return { threw: false, value: thunk() };
  } catch (error) {
    return { threw: true, value: error instanceof Error ? error.constructor.name : String(error) };
  }
};

describe('EM-B2a1 - the DM layer leaf: the read, the op application and the deterministic mint', () => {
  it('A1 applies one valid set-root op, stores the OPAQUE key alone, and mutates no argument', () => {
    const emptyBefore = snapshot(EMPTY_DM_LAYER);
    const consultBefore = snapshot(Object.keys(CONSULT));
    const result = applyEdit(EMPTY_DM_LAYER, GOOD_OP, CONSULT);

    expect(result.ok, 'a declared field on a declared card type is accepted').toBe(true);
    expect(result.layer.roots).toEqual({ [GOOD_OP.key]: GOOD_OP.value });
    expect(result.keys).toEqual([GOOD_OP.key]);

    // THE TRANSIENT COORDINATES ARE NOT STORED: a both-directions key-set equality against the
    // shape EMPTY_DM_LAYER itself declares, so a stored `cardType` or `field` reds here.
    expect(Object.keys(result.layer).sort()).toEqual(Object.keys(EMPTY_DM_LAYER).sort());
    expect(Object.keys(result.layer.roots)).toEqual([GOOD_OP.key]);

    // PURITY: the input is still the frozen module constant, byte-identical, and the three
    // untouched sub-objects came back BY REFERENCE rather than as fresh allocations.
    expect(snapshot(EMPTY_DM_LAYER)).toBe(emptyBefore);
    expect(snapshot(Object.keys(CONSULT))).toBe(consultBefore);
    expect(result.layer.worldFacts).toBe(EMPTY_DM_LAYER.worldFacts);
    expect(result.layer.minted).toBe(EMPTY_DM_LAYER.minted);
    expect(result.layer.phantoms).toBe(EMPTY_DM_LAYER.phantoms);
    expect(Object.isFrozen(result.layer) && Object.isFrozen(result.layer.roots)).toBe(true);
  });

  it('A2 reads own-properties only, is total over the hostile matrix, and never throws', () => {
    const stored = applyEdit(EMPTY_DM_LAYER, GOOD_OP, CONSULT).layer;
    const hostile = [undefined, null, 42, 'x', [], {}, { minted: {}, phantoms: {}, worldFacts: {} }];
    const prototypeKeys = ['__proto__', 'constructor', 'toString'];

    const hostileOutcomes = hostile.map((layer) => outcomeOf(() => layerRead(layer, GOOD_OP.key)));
    const prototypeOutcomes = prototypeKeys.map((key) => outcomeOf(() => layerRead(stored, key)));
    const nonStringOutcome = outcomeOf(() => layerRead(stored, 42));
    const hitOutcome = outcomeOf(() => layerRead(stored, GOOD_OP.key));

    const absence = [...hostileOutcomes, ...prototypeOutcomes, nonStringOutcome];
    expect(absence.length, 'the eleven declared absence inputs, driven in one arm').toBe(11);
    expect([...absence, hitOutcome].map((o) => o.threw), 'nothing throws, in any of the twelve')
      .toEqual([...absence, hitOutcome].map(() => false));

    // ABSENCE IS UNDEFINED, AND A PROTOTYPE MEMBER IS ABSENCE: every non-override reads
    // `undefined`, which is the value a stored `undefined` can never be confused with because
    // `applyEdit` refuses it (A3).
    expect(absence.map((o) => o.value)).toEqual(absence.map(() => undefined));
    expect(hitOutcome.value, 'and a real override still reads back').toBe(GOOD_OP.value);
  });

  it('A3 refuses in the FIXED order, fails CLOSED on an unusable consult, and carries exactly the exported reason set', () => {
    const malformed = [
      { ...GOOD_OP, kind: 'set-world-fact' }, { ...GOOD_OP, key: 42 }, { ...GOOD_OP, key: '' },
      { ...GOOD_OP, cardType: 42 }, { ...GOOD_OP, cardType: '' }, { ...GOOD_OP, field: 42 },
      { ...GOOD_OP, field: '' }, { ...GOOD_OP, value: undefined }, null, 'not-an-op',
    ];
    const unusableConsults = [
      undefined, null, 42, {}, { isEditableCard: CONSULT.isEditableCard },
      { declarationsFor: CONSULT.declarationsFor }, { isEditableCard: 1, declarationsFor: 2 },
      { isEditableCard: () => { throw new Error('hostile'); }, declarationsFor: CONSULT.declarationsFor },
      { isEditableCard: () => true, declarationsFor: () => { throw new Error('hostile'); } },
    ];

    const shapeOutcomes = malformed.map((op) => outcomeOf(() => refusalOf(EMPTY_DM_LAYER, op, CONSULT)));
    const closedOutcomes = unusableConsults.map((d) => outcomeOf(() => refusalOf(EMPTY_DM_LAYER, GOOD_OP, d)));
    const unknownCard = outcomeOf(() => refusalOf(EMPTY_DM_LAYER, { ...GOOD_OP, cardType: 'dragon' }, CONSULT));
    const undeclaredField = outcomeOf(() => refusalOf(EMPTY_DM_LAYER, { ...GOOD_OP, field: 'secret.what' }, CONSULT));
    // THE ORDER PROBE: one op that is malformed AND names an unknown card type AND an
    // undeclared field. Its single right answer is the FIRST guard's, which is what makes
    // "shape, then card type, then field" executable rather than asserted.
    const orderProbe = outcomeOf(() => refusalOf(
      EMPTY_DM_LAYER, { kind: 'nope', key: '', cardType: 'dragon', field: 'secret.what', value: undefined }, CONSULT,
    ));

    const every = [...shapeOutcomes, ...closedOutcomes, unknownCard, undeclaredField, orderProbe];
    expect(every.map((o) => o.threw), 'nothing throws, in any of them').toEqual(every.map(() => false));
    expect(every.map((o) => o.value.ok), 'every hostile input is REFUSED - a leaf that accepts one here has failed open')
      .toEqual(every.map(() => false));
    expect(every.map((o) => o.value.sameLayer), 'a refusal allocates nothing').toEqual(every.map(() => true));

    expect(shapeOutcomes.map((o) => o.value.reason), 'the op\'s own shape is answered FIRST, before any declaration is read')
      .toEqual(shapeOutcomes.map(() => 'invalid_op'));
    expect(closedOutcomes.map((o) => o.value.reason), 'an unusable consult can only CLOSE the door')
      .toEqual(closedOutcomes.map(() => 'unknown_target'));
    expect(unknownCard.value.reason).toBe('unknown_target');
    expect(undeclaredField.value.reason).toBe('undeclared_field');
    expect(orderProbe.value.reason).toBe('invalid_op');

    // THE CLOSED SET, BOTH DIRECTIONS, against the leaf's OWN export: a fourth reason the leaf
    // can return reds here, and a declared reason the leaf can never reach reds here too.
    const observed = [...new Set(every.map((o) => o.value.reason))].sort();
    expect(observed).toEqual([...APPLY_EDIT_REASONS].sort());
  });

  it('A4 replaces on a repeated key and is order-independent across three distinct keys', () => {
    const twice = applyEdit(applyEdit(EMPTY_DM_LAYER, GOOD_OP, CONSULT).layer,
      { ...GOOD_OP, value: 'the second value' }, CONSULT).layer;
    const same = applyEdit(applyEdit(EMPTY_DM_LAYER, GOOD_OP, CONSULT).layer, GOOD_OP, CONSULT).layer;
    const ops = ['npc:1:role', 'npc:2:role', 'npc:3:role']
      .map((key, index) => ({ ...GOOD_OP, key, value: `value ${index}` }));
    const permutations = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];

    const stable = (layer) => JSON.stringify(Object.keys(layer.roots).sort()
      .map((key) => [key, layer.roots[key]]));
    const built = permutations.map((order) => stable(
      order.reduce((layer, index) => applyEdit(layer, ops[index], CONSULT).layer, EMPTY_DM_LAYER),
    ));

    expect(twice.roots[GOOD_OP.key], 'the layer holds the override, so the second value stands')
      .toBe('the second value');
    expect(snapshot(same)).toBe(snapshot(applyEdit(EMPTY_DM_LAYER, GOOD_OP, CONSULT).layer));
    expect(built).toEqual(built.map(() => built[0]));
    expect(new Set(built).size, 'all six permutations yield one byte-identical layer').toBe(1);
  });

  it('A5 mints deterministically inside DM_ID_NS, refuses every invalid triple, and touches no clock or PRNG', () => {
    const invalid = [
      [42, 'phantom', 0], [null, 'phantom', 0], ['s', 'no-such-kind', 0], ['s', 42, 0],
      ['s', 'phantom', -1], ['s', 'phantom', 1.5], ['s', 'phantom', Number.MAX_VALUE], ['s', 'phantom', '0'],
    ];
    const valid = [['seed-a', 'phantom', 0], ['seed-a', 'minted', 0], ['seed-b', 'phantom', 1]];

    const invalidOutcomes = invalid.map((triple) => outcomeOf(() => mintDmId(...triple)));
    const minted = valid.map((triple) => mintDmId(...triple));

    // THE ENTROPY PROBE: the two ambient sources are replaced with throwing stubs, so a mint
    // that reaches for either REDS instead of quietly differing. The runs are then compared
    // byte for byte, which is what makes "no PRNG, no clock" executable rather than asserted.
    const realRandom = Math.random;
    const realNow = Date.now;
    let stubbed;
    try {
      Math.random = () => { throw new Error('mintDmId reached for Math.random'); };
      Date.now = () => { throw new Error('mintDmId reached for Date.now'); };
      stubbed = valid.map((triple) => outcomeOf(() => mintDmId(...triple)));
    } finally {
      Math.random = realRandom;
      Date.now = realNow;
    }

    expect(invalidOutcomes.map((o) => o.threw)).toEqual(invalidOutcomes.map(() => true));
    expect(invalidOutcomes.map((o) => o.value)).toEqual(invalidOutcomes.map(() => 'TypeError'));
    expect(minted.map((id) => /^dm:[a-z]+:[0-9a-f]{16}$/.test(id))).toEqual(minted.map(() => true));
    expect(minted.map((id) => id.startsWith(DM_ID_NS))).toEqual(minted.map(() => true));
    expect(mintDmId(...valid[0]), 'the same triple mints the same id, forever').toBe(minted[0]);
    expect(new Set(minted).size, 'and three distinct triples mint three distinct ids').toBe(3);
    expect(stubbed.map((o) => o.threw)).toEqual(stubbed.map(() => false));
    expect(stubbed.map((o) => o.value)).toEqual(minted);
  });

  it('A6 reads every absence shape as the empty layer, never normalizes empty back to absent, and stays frozen', () => {
    const shapes = [
      undefined, null, 42, 'x', [], {},
      { worldFacts: {}, minted: {}, phantoms: {} }, { roots: {}, minted: {}, phantoms: {} },
      { roots: {}, worldFacts: {}, phantoms: {} }, { roots: {}, worldFacts: {}, minted: {} },
      { roots: [], worldFacts: {}, minted: {}, phantoms: {} },
    ];
    const emptyLayer = { roots: {}, worldFacts: {}, minted: {}, phantoms: {} };

    const readOutcomes = shapes.map((layer) => outcomeOf(() => layerRead(layer, GOOD_OP.key)));
    const writeOutcomes = shapes.map((layer) => outcomeOf(() => applyEdit(layer, GOOD_OP, CONSULT)));
    const fromEmpty = applyEdit(emptyLayer, GOOD_OP, CONSULT);
    const frozenWrites = Object.keys(EMPTY_DM_LAYER).sort()
      .map((key) => outcomeOf(() => { EMPTY_DM_LAYER[key].planted = true; }));
    const frozenRoot = outcomeOf(() => { EMPTY_DM_LAYER.planted = true; });

    expect(readOutcomes.map((o) => o.threw), 'none of the eleven shapes throws on the read path')
      .toEqual(readOutcomes.map(() => false));
    expect(writeOutcomes.map((o) => o.threw), 'nor on the write path').toEqual(writeOutcomes.map(() => false));
    // EVERY SHAPE MATERIALIZES THE SAME WHOLE LAYER: the accepted result of each is identical
    // to the one an absent layer produces, with the missing sub-objects materialized empty.
    expect(writeOutcomes.map((o) => snapshot(o.value.layer)))
      .toEqual(writeOutcomes.map(() => snapshot(applyEdit(undefined, GOOD_OP, CONSULT).layer)));

    // AN EMPTY LAYER IS LEGAL AND IS NEVER NORMALIZED BACK TO ABSENT: it accepts the op and
    // yields the same whole shape, rather than being refused or collapsed.
    expect(fromEmpty.ok).toBe(true);
    expect(Object.keys(fromEmpty.layer).sort()).toEqual(Object.keys(EMPTY_DM_LAYER).sort());

    expect(Object.keys(EMPTY_DM_LAYER).sort()).toEqual(['minted', 'phantoms', 'roots', 'worldFacts']);
    expect(frozenWrites.map((o) => o.threw), 'all four sub-objects are frozen')
      .toEqual(frozenWrites.map(() => true));
    expect(frozenRoot.threw, 'and so is the layer itself').toBe(true);
  });
});
