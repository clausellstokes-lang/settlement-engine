/**
 * prosePassageShapes.walker.test.js — THE FOURTH SEEDED DRAW, driven (REWRITE car 8a-2;
 * SITTING §T.4 adopting agenda C⁗; the owner's rulings (a)–(e) of 2026-09-08 ~22:4x).
 *
 * ⛔ WHAT THIS FILE MUST REFUSE, and why each is a plant rather than an assertion about the
 * module's prose:
 *
 *   THE SET IS CLOSED AT THREE (ruling (a)). A fourth shape is an owner act. The roster is
 *   pinned by NAME, so a shape added in code without an owner row reds here, and the draw
 *   itself THROWS on a shape outside the set rather than quietly hashing it.
 *
 *   LICENSED, NEVER RESCUED (ruling (b)). The order of operations is the rule, so the arms
 *   drive the ORDER: a shape that is not lawful is never in the set the draw sees, and the
 *   draw is handed only lawful sets. Each refusal is convicted by a plant that differs from
 *   its lawful control in exactly ONE fact, or the refusal proves nothing about that fact.
 *
 *   SHAPE MOVES NO FACT. The same unit under two lawful shapes carries the same claim set.
 *
 *   THE DRAW IS APPEND-SAFE, for the reason law 6 is: the lawful set's SIZE varies unit by
 *   unit, so a modulus over it would make one unit's shape depend on how many other shapes
 *   happened to be lawful for it. Driven as the property, not the percentage.
 *
 * @enforced-by this file
 */
import { describe, expect, it } from 'vitest';

import {
  PASSAGE_SHAPES,
  SHIPPED_SHAPE,
  arrangeUnderShape,
  drawPassageShape,
  lawfulPassageShapes,
  nounCarry,
  shapeSetMaterial,
} from '../../src/domain/prose/passageShapes.js';
import { contentWords } from '../../src/domain/prose/composedWalker.js';
import { CONNECTIVES } from '../../src/domain/display/stateProse/composeStateProse.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

/** A spine and an added face that SHARE a noun: `muster` appears in both. */
const CARRIES = {
  spineText: 'The wall is kept up and the gate is watched.',
  modifierText: 'The muster behind the wall is thinner than the works suggest.',
};
/** The same pair with the carry removed and nothing else changed. */
const NO_CARRY = {
  spineText: 'The wall is kept up and the gate is watched.',
  modifierText: 'Grain prices held steady through the season.',
};

/** A unit with one sentence-seated addition. */
const unitWith = (piece) => ({
  blockId: 'DS-DEF-11', poolKey: 'WALLED-LARGE', text: 'x',
  pieces: [{ role: 'spine', key: 'WALLED-LARGE' }, piece],
});
const ADDITION = { role: 'modifier', key: 'M', seat: 'sentence', relation: 'addition' };

describe('passage shapes — the set is CLOSED, and closed by the owner', () => {
  it('holds exactly the three shapes the owner named, by name and in order', () => {
    expect([...PASSAGE_SHAPES]).toEqual([
      'spine-then-sentence', 'sentence-then-spine', 'clause-seat',
    ]);
    expect(SHIPPED_SHAPE, 'the shipped arrangement is shape 1').toBe('spine-then-sentence');
    expect(shapeSetMaterial(), 'the digest material the SHIFT REGISTER pins')
      .toBe('spine-then-sentence|sentence-then-spine|clause-seat');
  });

  it('⛔ THROWS on a shape outside the set rather than hashing it', () => {
    // A draw that silently accepted a fourth shape would let one land without an owner row,
    // which is exactly what ruling (a) closed the set to prevent.
    expect(() => drawPassageShape(['spine-then-sentence', 'chiasmus'], 'B', 'P', 's'))
      .toThrow(/not one of the closed set/);
    // The live control: the same call with a lawful pair does not throw.
    expect(() => drawPassageShape(['spine-then-sentence', 'sentence-then-spine'], 'B', 'P', 's'))
      .not.toThrow();
  });
});

describe('passage shapes — LICENSED BY THE COMPOSITION, never rescued by it', () => {
  it('a unit with NO modifier has no shape question, and enters no denominator', () => {
    // Reporting a bare spine as "spine-then-sentence" would inflate shape 1's marginal share
    // with units that were never asked — the artefact ruling (c) splits marginal from
    // conditional to catch.
    const bare = { blockId: 'B', poolKey: 'P', pieces: [{ role: 'spine', key: 'P' }] };
    expect(lawfulPassageShapes(bare)).toEqual({ applicable: false, lawful: [], refused: [] });
    expect(drawPassageShape([], 'B', 'P', 's'), 'and nothing is drawn for it').toBeNull();
  });

  it('⭐ SHAPE 2 NEEDS THE NOUN CARRY — one fact apart, and the verdict flips', () => {
    const lawful = lawfulPassageShapes(unitWith(ADDITION), {
      ...CARRIES, jointPhrase: '', clauseJointsExist: false,
    });
    expect(lawful.lawful).toContain('sentence-then-spine');
    // THE PLANT: the same unit, the same relation, the same empty joint — only the added
    // face's vocabulary changed, so a refusal here can only be about the carry.
    const refused = lawfulPassageShapes(unitWith(ADDITION), {
      ...NO_CARRY, jointPhrase: '', clauseJointsExist: false,
    });
    // anchored: the very next line reads this refusal's own `why` off the same result, so an empty or drifted result reds there rather than passing here
    expect(refused.lawful).not.toContain('sentence-then-spine');
    expect(refused.refused.find((row) => row.shape === 'sentence-then-spine').why)
      .toMatch(/carries no noun into the spine/);
    // And the carry is a REAL shared noun, not an artefact of the stop list letting the
    // dossier's own subject through.
    expect(nounCarry(CARRIES.spineText, CARRIES.modifierText).shared).toEqual(['wall']);
    // Two sentences whose ONLY shared word is the dossier's own subject. `town` is on the
    // walker's stop list precisely because sharing it connects nothing, and this pair would
    // read as threaded under any carry test that counted it.
    expect(nounCarry('The town keeps its gate shut.', 'The town buys its grain abroad.'),
      'a shared `town` is the dossier\'s subject, not a thread')
      .toEqual({ carries: false, shared: [] });
  });

  it('⭐ SHAPE 2 NEEDS A PLAIN ADDITION — the chair\'s recorded caution, driven', () => {
    // A joint that spells a word colours the order it is put in, and arm A2 convicts a joint
    // that implies a relation with no row. Two plants, each one fact from the lawful control.
    const wrongRelation = lawfulPassageShapes(
      unitWith({ ...ADDITION, relation: 'contrast' }),
      { ...CARRIES, jointPhrase: '', clauseJointsExist: false },
    );
    // anchored: the next line reads this refusal's `why` off the same result, and the lawful CONTROL two blocks up proves the function can say yes
    expect(wrongRelation.lawful).not.toContain('sentence-then-spine');
    expect(wrongRelation.refused.find((r) => r.shape === 'sentence-then-spine').why)
      .toMatch(/only a plain addition may be re-ordered/);
    const spelledJoint = lawfulPassageShapes(unitWith(ADDITION), {
      ...CARRIES, jointPhrase: 'and so', clauseJointsExist: false,
    });
    // anchored: the next line reads this refusal's `why` off the same result, and the lawful CONTROL two blocks up proves the function can say yes
    expect(spelledJoint.lawful).not.toContain('sentence-then-spine');
    expect(spelledJoint.refused.find((r) => r.shape === 'sentence-then-spine').why)
      .toMatch(/colours the order it is put in/);
  });

  it('⛔ SHAPE 3 IS REFUSED FOR WANT OF A SEAT, and WITHHELD for want of a joint — read, not described', () => {
    // ⚠ THIS ARM'S PREMISE MOVED AT REWRITE car 8a-11, WHICH IS WHY IT READS THE LEAF (SITTING
    // §U c-5). It used to assert `CONNECTIVES.consequence.clause` was `[]` and call the
    // withholding the shipped state. That was true of the composer's own floor CONSTANT and
    // stopped being true of the LEAF at car 8a-9, and for one whole car the two disagreed with
    // nothing saying so. The composer reads the leaf now, so the shipped list is three and the
    // two refusals are told apart here rather than conflated.
    expect(CONNECTIVES.consequence.clause, 'the consequence.clause list at this tip')
      .toEqual([', so', ', and so', ', leaving']);

    // (i) THE SHIPPED CONDITION: joints exist, so what refuses shape 3 is the SEAT — no
    // modifier is seated at the clause seat, because `seatOf` answers `not-consequence` on all
    // 708 pools.
    const shipped = lawfulPassageShapes(unitWith(ADDITION), {
      ...CARRIES, jointPhrase: '', clauseJointsExist: CONNECTIVES.consequence.clause.length > 0,
    });
    // anchored: the next line reads this refusal's `why`, and the LIVE CONTROL below seats a clause and gets the shape back
    expect(shipped.lawful).not.toContain('clause-seat');
    expect(shipped.refused.find((r) => r.shape === 'clause-seat').why)
      .toBe('no modifier is seated at the clause seat');

    // (ii) THE WITHHELD BRANCH IS STILL REACHABLE AND STILL SAYS THE RIGHT THING, driven on a
    // corpus whose list is empty. A branch nobody can reach is a claim; this one is driven.
    const starved = lawfulPassageShapes(unitWith(ADDITION), {
      ...CARRIES, jointPhrase: '', clauseJointsExist: false,
    });
    const why = starved.refused.find((r) => r.shape === 'clause-seat').why;
    expect(why).toMatch(/^WITHHELD/);
    expect(why, 'and it names the COMPOSER\'S lists, which is where the emptiness would be')
      .toContain('the composer\'s connective lists');

    // (iii) THE LIVE CONTROL: a unit that DID seat a clause makes the shape lawful, so both
    // refusals are about the unit and the leaf rather than about the function being unable to
    // say yes.
    const seated = lawfulPassageShapes(
      unitWith({ role: 'modifier', key: 'M', seat: 'clause', relation: 'consequence' }),
      { ...CARRIES, jointPhrase: ', and so', clauseJointsExist: true },
    );
    expect(seated.lawful).toContain('clause-seat');
  });
});

describe('passage shapes — the draw', () => {
  it('takes NO hash when one shape is lawful, and is canonical-at-zero with no seed', () => {
    expect(drawPassageShape(['spine-then-sentence'], 'B', 'P', 'anything'))
      .toBe('spine-then-sentence');
    expect(drawPassageShape(['spine-then-sentence', 'sentence-then-spine'], 'B', 'P', ''))
      .toBe('spine-then-sentence');
  });

  it('⭐ APPEND-SAFE: a shape becoming lawful takes only the reads it wins', () => {
    // THE PROPERTY LAW 6 IS BUILT ON, at the shape grain. The lawful set's SIZE varies unit
    // by unit here, so this is not a one-time re-index question but a permanent one: under a
    // modulus, a unit whose sibling shape happened to be lawful would read a different shape
    // for that reason alone. Driven as the property: not one read moves BETWEEN two shapes
    // that were both already lawful.
    const one = ['spine-then-sentence'];
    const two = ['spine-then-sentence', 'sentence-then-spine'];
    const three = [...PASSAGE_SHAPES];
    let movedToNew = 0;
    let movedBetweenOld = 0;
    let reads = 0;
    for (let i = 0; i < 4000; i += 1) {
      const seed = `shape-${i}`;
      reads += 1;
      const wasOne = drawPassageShape(one, 'DS-DEF-11', 'WALLED-LARGE', seed);
      const nowTwo = drawPassageShape(two, 'DS-DEF-11', 'WALLED-LARGE', seed);
      if (wasOne !== nowTwo) {
        if (nowTwo === 'sentence-then-spine') movedToNew += 1; else movedBetweenOld += 1;
      }
      const nowThree = drawPassageShape(three, 'DS-DEF-11', 'WALLED-LARGE', seed);
      if (nowTwo !== nowThree && nowThree !== 'clause-seat') movedBetweenOld += 1;
    }
    expect(movedBetweenOld, 'a read that moved between two ALREADY-LAWFUL shapes').toBe(0);
    // And the newcomer really does take reads, or the arm above is vacuous.
    const share = (movedToNew / reads) * 100;
    expect(share, 'the share the second shape takes').toBeGreaterThan(40);
    expect(share, 'and it does not take them all').toBeLessThan(60);
  });

  it('is repeat-call identical, and binds to the unit identity', () => {
    expectNoSeedFailures(collectSeedFailures(['a', 'b', 'world-7'], (seed) => {
      const first = drawPassageShape([...PASSAGE_SHAPES], 'DS-DEF-11', 'WALLED-LARGE', seed);
      expect(drawPassageShape([...PASSAGE_SHAPES], 'DS-DEF-11', 'WALLED-LARGE', seed)).toBe(first);
    }), 'the shape draw is a function of its key alone');
    // Two pools on one seed do not move together, or a page would take one shape throughout.
    const a = Array.from({ length: 200 }, (_, i) => drawPassageShape([...PASSAGE_SHAPES], 'DS-A-1', 'P', `s${i}`));
    const b = Array.from({ length: 200 }, (_, i) => drawPassageShape([...PASSAGE_SHAPES], 'DS-B-2', 'P', `s${i}`));
    expect(a).not.toEqual(b);
  });
});

describe('passage shapes — a shape is a SURFACE, and moves no fact', () => {
  it('⭐ the same unit under two lawful shapes carries the same claim vocabulary', () => {
    const first = arrangeUnderShape('spine-then-sentence', {
      spineText: CARRIES.spineText, modifierText: CARRIES.modifierText, opener: '',
    });
    const second = arrangeUnderShape('sentence-then-spine', {
      spineText: CARRIES.spineText, modifierText: CARRIES.modifierText, opener: '',
    });
    expect(second, 'the two arrangements really are different strings').not.toBe(first);
    expect(contentWords(second).sort(), 'the same claim vocabulary, re-ordered')
      .toEqual(contentWords(first).sort());
    // And shape 2 puts the added fact FIRST — the thing the reader meets is what moved.
    expect(second.startsWith(CARRIES.modifierText)).toBe(true);
    expect(first.startsWith(CARRIES.spineText)).toBe(true);
  });

  it('shape 1 with a spelled opener is the composer\'s own arrangement', () => {
    expect(arrangeUnderShape('spine-then-sentence', {
      spineText: 'The wall stands.', modifierText: 'the muster is thin.', opener: 'Even so',
    })).toBe('The wall stands. Even so the muster is thin.');
  });
});
