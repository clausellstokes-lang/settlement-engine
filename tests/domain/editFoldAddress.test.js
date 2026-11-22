/**
 * editFoldAddress.test.js — U80: THE FOLD ADDRESSES A ROSTER ROW BY THE CATALOGUE'S OWN
 * TARGET KIND, SO A REBALANCE DECREE MOVES THE SHARE IT NAMES.
 *
 * THE DEFECT, MEASURED. `project()` — the fold every guard rule judges a post-op world
 * through — matched a faction row by the LITERAL address `faction:<name>`. Two of the
 * three faction ops declare that kind; `rebalance-power` does not. Its catalogue row
 * declares `power`, because a share is a fact of the POWER card (the record register
 * keys `powerStructure.factions` there, and `set-power-holder` declares the same kind),
 * and `offeredOp` mints every fulfil target AT THE ROW'S DECLARED KIND. So the compare
 * was `faction:Guild === power:Guild`, which is false for every row: the fold returned a
 * NEW world whose roster was UNCHANGED, and the totality rule judged a share that had
 * not moved. EM-C3's A8 arm could not see it — it asks whether `project` returns
 * non-null, and a new object with an unmoved roster is non-null.
 *
 * WHICH SIDE IS RIGHT WAS MEASURED, NOT CHOSEN. The design's model section makes the op
 * catalogue the place a type "declares its target kind"; `TARGET_KINDS`, `offeredOp`,
 * `isEntityRef` and the record register all read that declaration, and nothing but this
 * one literal read anything else. The catalogue row is therefore untouched and the fold
 * reads it — which also means the fold can never again disagree with a row that moves.
 *
 * ONE literal `describe`, TWO straight-line literal `it`, no `.each`, no nesting, no
 * parameter on any callback (EM-PREAMBLE §P3.4). Every title begins `U80-<n> - ` so it is
 * unique in `tests/`, and a hyphen rather than an em dash because `vitest -t` is a REGEX.
 *
 * ⛔ NO `not.toContain` / `not.toMatch` / `not.toHaveProperty` ANYWHERE IN THIS FILE.
 * Every absence below is an EQUALITY against a value asserted beside the POSITIVE that
 * fires on the same fixture, so no negative can go vacuous.
 */
import { describe, expect, it } from 'vitest';

import { compareCodepoint } from '../../src/domain/deterministicSort.js';
import { project } from '../../src/domain/edit/guardRules.js';
import { OP_TYPES, makeOp } from '../../src/domain/edit/operations.js';

/** The roster every arm folds over, cloned per call so no arm leaks a mutation. */
const rosterOf = () => ({
  institutions: [],
  npcs: [],
  config: {},
  powerStructure: { factions: [{ faction: 'Guild', power: 40 }, { faction: 'Court', power: 60 }] },
});

/** The shares a folded world holds, in roster order — the one fact these arms read. */
const sharesOf = (world) => (world?.powerStructure?.factions ?? [])
  .map((row) => [String(row.faction), Number(row.power)]);

/**
 * One op through the REAL writer, at the target kind the catalogue DECLARES for it —
 * which is exactly what `offeredOp` does when a guard mints a fulfil, and what the modal
 * does when the DM commits one. Nothing here re-spells a kind.
 */
const opOf = (type, id, payload) => makeOp(type, { kind: OP_TYPES[type].target, id }, payload);

describe('U80 - the fold addresses a roster row by the catalogue s own target kind', () => {
  it('U80-1 - a rebalance decree moves the share it names, and moves no other', () => {
    const world = rosterOf();
    const before = JSON.stringify(world);

    // THE ANCHOR the member rests on: the op really is minted at the kind the row
    // declares, and that kind is NOT `faction` — which is the whole of the defect.
    expect([OP_TYPES['rebalance-power'].target, opOf('rebalance-power', 'Guild', {}).target.kind],
      'the catalogue declares `rebalance-power` on the POWER card, and the op writer mints'
      + ' its target at that kind')
      .toEqual(['power', 'power']);

    const folded = project(world, opOf('rebalance-power', 'Guild', { faction: 'Guild', power: 62 }), OP_TYPES);
    expect([sharesOf(folded), sharesOf(world), JSON.stringify(world) === before],
      'the named faction holds the share the payload carries, the other is untouched, and'
      + ' the world handed in is byte-identical — the fold returns a NEW world and mutates'
      + ' neither argument')
      .toEqual([[['Guild', 62], ['Court', 60]], [['Guild', 40], ['Court', 60]], true]);

    // AND THE NEGATIVE CONTROL, on the same fixture: a rebalance naming a faction the
    // roster does not hold moves nothing at all, so the arm above measures the MATCH
    // rather than a fold that overwrites whatever it is handed.
    expect(sharesOf(project(world, opOf('rebalance-power', 'Nobody', { faction: 'Nobody', power: 62 }), OP_TYPES)),
      'a share addressed to a faction that is not seated moves no row')
      .toEqual([['Guild', 40], ['Court', 60]]);
  });

  it('U80-2 - every faction op the fold moves reads its address from the same declaration', () => {
    const world = rosterOf();

    // The three faction-roster ops, each at ITS OWN declared kind. `remove-faction`
    // declares `faction` and `rebalance-power` declares `power`: the two kinds differ,
    // which is why a literal could serve only one of them.
    const kinds = ['add-faction', 'rebalance-power', 'remove-faction']
      .map((type) => [type, OP_TYPES[type].target]).sort(compareCodepoint);
    expect(kinds, 'the three roster ops do NOT share one target kind')
      .toEqual([['add-faction', 'faction'], ['rebalance-power', 'power'], ['remove-faction', 'faction']]);

    const removed = project(world, opOf('remove-faction', 'Guild', { cause: 'dissolved' }), OP_TYPES);
    const added = project(world, opOf('add-faction', 'Ward', { faction: 'Ward', power: 5 }), OP_TYPES);
    const rebalanced = project(world, opOf('rebalance-power', 'Court', { faction: 'Court', power: 33 }), OP_TYPES);
    expect([sharesOf(removed), sharesOf(added), sharesOf(rebalanced)],
      'removal drops the addressed row, an addition appends its own, and a rebalance'
      + ' rewrites the addressed row s share — three ops, one reading of the address')
      .toEqual([
        [['Court', 60]],
        [['Guild', 40], ['Court', 60], ['Ward', 5]],
        [['Guild', 40], ['Court', 33]],
      ]);
  });
});
