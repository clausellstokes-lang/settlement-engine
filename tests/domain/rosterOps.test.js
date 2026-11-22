/**
 * rosterOps.test.js — EM-E8 case B: the DM layer's MINTED ROWS, and the roster they reach at
 * re-derivation (design §14's "the record is regenerated FROM the layer", §22.3 ruling 9's
 * newcomer, §22.4's identity table).
 *
 * THE CLAIM: a ROSTER ADD-OP is a row of the LAYER and never a write to a record; the layer's
 * own writer takes it under the SAME closed refusal set in the SAME fixed order; a second
 * apply of one id allocates nothing; and `pinsFrom` / `rederive` carry that row into the
 * record's roster of its card, wearing its id and whatever defaults the CALLER declares, in a
 * deterministic order.
 *
 * ⛔ THE ENGINE AND THE DECLARATIONS ARE INJECTED, as they are at the store's own seat: this
 * leaf imports neither, so a battery that reached for one would be testing the pair.
 *
 * ⛔ NOTHING RE-TYPES A PRODUCER'S SET. The mint roster, the refusal set and the declaration
 * table are IMPORTED from their producers; the catalogue's `add-` rows are read off the live
 * catalogue (tests/lint/contractTestAntiVacuity.walker.test.js Rule 2).
 *
 * ⛔ NO ARM ASSERTS INSIDE A LOOP: each matrix is COLLECTED and then asserted once.
 *
 * @enforced-by this test
 */

import { describe, expect, it } from 'vitest';

import { compareCodepoint } from '../../src/domain/deterministicSort.js';
import {
  APPLY_EDIT_REASONS,
  EMPTY_DM_LAYER,
  MINT_OP_TYPES,
  applyEdit,
  pinsFrom,
  rederive,
} from '../../src/domain/edit/dmLayer.js';
import { declarationsFor, isEditableCard } from '../../src/domain/edit/fieldDeclarations.js';
import { OP_TYPES } from '../../src/domain/edit/operations.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { getStepMeta } from '../../src/generators/pipeline.js';
import { censusCorpus } from '../helpers/generationForkCensus.js';

/** The injected handles, built the way the store's lazy seat builds them. */
const ENGINE = Object.freeze({ run: generateSettlementPipeline, getStepMeta });

/** The consult `applyEdit` takes: EM-A1's two members, by reference. */
const CONSULT = Object.freeze({ isEditableCard, declarationsFor });

/** The declaration set `pinsFrom` / `rederive` take, with NO defaults member wired. */
const DECLARATIONS = Object.freeze({ declarationsFor });

/**
 * The SAME set with the optional defaults member wired, which is the CALLER's declaration
 * that it has adopted the channel. `status` is a field the npc card declares, so a default
 * for it can only fill what the DM left absent.
 */
const DECLARED_DEFAULTS = Object.freeze({ status: 'active', note: '' });
const DECLARATIONS_WITH_DEFAULTS = Object.freeze({
  declarationsFor,
  mintedDefaults: (cardType) => (cardType === 'npc' ? DECLARED_DEFAULTS : {}),
});

const NEWCOMER = 'dm:minted:0123456789abcdef';
const SECOND = 'dm:minted:fedcba9876543210';

/** One ROSTER ADD-OP in the catalogue's own shape, carrying only declared payload fields. */
const addOp = (type, kind, id, payload) => Object.freeze({
  type, target: Object.freeze({ kind, id }), payload: Object.freeze(payload),
});

const NPC_OP = addOp('add-npc', 'npc', NEWCOMER, { name: 'Alda', role: 'Harbourmaster' });

/** A layer holding exactly the minted rows given. */
const layerOf = (rows) => ({ roots: {}, worldFacts: {}, minted: rows, phantoms: {} });

/** One world, and the config the save stored for it. */
function worldFor(row) {
  const { _seed: seed, ...config } = row;
  return { config, seed, record: generateSettlementPipeline(config, null, { seed, customContent: {} }) };
}

/** Drive the leaf and report only what a refusal is required to carry. */
const refusalOf = (layer, op, consult = CONSULT) => {
  const result = applyEdit(layer, op, consult);
  return { ok: result.ok, reason: result.reason, sameLayer: result.layer === layer };
};

/** The first census row, which is the corpus's own smallest complete world. */
const SUBJECT = worldFor(censusCorpus()[0]);

describe('EM-E8 B — the DM layer\'s minted rows reach the roster at re-derivation', () => {
  it('B1 takes a roster add-op as a MINTED ROW, refuses a malformed one in the fixed order, and touches no record', () => {
    const applied = applyEdit(EMPTY_DM_LAYER, NPC_OP, CONSULT);
    const malformed = [
      { ...NPC_OP, target: undefined }, { ...NPC_OP, target: { kind: 'npc' } },
      { ...NPC_OP, target: { kind: '', id: NEWCOMER } }, { ...NPC_OP, payload: 'not-a-bag' },
    ].map((op) => refusalOf(EMPTY_DM_LAYER, op));
    const unknownCard = refusalOf(EMPTY_DM_LAYER, addOp('add-npc', 'dragon', NEWCOMER, {}));
    const closed = refusalOf(EMPTY_DM_LAYER, NPC_OP, null);
    const undeclared = refusalOf(EMPTY_DM_LAYER,
      addOp('add-npc', 'npc', NEWCOMER, { name: 'Alda', colour: 'blue' }));

    expect(applied.ok, 'a well-formed add-op is taken').toBe(true);
    expect(applied.layer.minted[NEWCOMER], 'the row is the card KIND plus the typed payload, and'
      + ' carries NO id of its own: the map key IS the id')
      .toEqual({ kind: 'npc', name: 'Alda', role: 'Harbourmaster' });
    expect(applied.keys, 'the receipt names the id this call wrote').toEqual([NEWCOMER]);
    expect(applied.layer.roots, 'and NO root was written: an add-op overrides nothing').toEqual({});
    expect(Object.isFrozen(applied.layer) && Object.isFrozen(applied.layer.minted),
      'the layer and its sub-object come back deeply frozen').toBe(true);
    // anchored: the accepted op above proves the branch is reachable, so the refusals below are
    // guards firing rather than a writer that takes nothing at all.
    expect(malformed.map((row) => row.reason), 'the op\'s own shape is answered FIRST')
      .toEqual(malformed.map(() => 'invalid_op'));
    expect(malformed.map((row) => row.sameLayer), 'and a refusal allocates nothing')
      .toEqual(malformed.map(() => true));
    expect([unknownCard.reason, closed.reason], 'an undeclared card and an unusable consult both CLOSE the door')
      .toEqual(['unknown_target', 'unknown_target']);
    expect(undeclared.reason, 'a payload key the card does not declare is the SAME refusal a root gets')
      .toBe('undeclared_field');
    const observed = [...new Set([...malformed, unknownCard, closed, undeclared].map((row) => row.reason))];
    expect(observed.sort(compareCodepoint), 'and the branch widens NO vocabulary: every reason is'
      + ' a member of the leaf\'s own exported set')
      .toEqual([...APPLY_EDIT_REASONS].filter((reason) => observed.includes(reason)).sort(compareCodepoint));
  });

  it('B2 carries every minted row into the record\'s roster at re-derivation, wearing its id and the declared defaults, deterministically', () => {
    const { record, config } = SUBJECT;
    const layer = layerOf({
      [SECOND]: { kind: 'npc', name: 'Bern', role: 'Reeve' },
      [NEWCOMER]: { kind: 'npc', name: 'Alda', role: 'Harbourmaster' },
    });
    const control = rederive(record, config, EMPTY_DM_LAYER, ENGINE, DECLARATIONS);
    const grown = rederive(record, config, layer, ENGINE, DECLARATIONS);
    const again = rederive(record, config, layer, ENGINE, DECLARATIONS);
    const filled = rederive(record, config, layer, ENGINE, DECLARATIONS_WITH_DEFAULTS);
    const pins = pinsFrom(record, layer, DECLARATIONS, ENGINE);

    const namesOf = (out) => (out.record.npcs || []).map((npc) => npc.id);
    const controlIds = namesOf(control);
    const grownIds = namesOf(grown);
    const alda = (grown.record.npcs || []).find((npc) => npc.id === NEWCOMER);
    const aldaFilled = (filled.record.npcs || []).find((npc) => npc.id === NEWCOMER);

    expect(controlIds.includes(NEWCOMER) || controlIds.includes(SECOND),
      'a dormant layer re-derives the world the record already had, with no newcomer').toBe(false);
    expect(grownIds.filter((id) => id === NEWCOMER).length, 'the newcomer is on the roster EXACTLY ONCE')
      .toBe(1);
    expect(grownIds.filter((id) => id === SECOND).length, 'and so is the second one').toBe(1);
    expect(alda.name, 'wearing the values the DM typed').toBe('Alda');
    expect(alda.role, 'both of them').toBe('Harbourmaster');
    expect(Object.hasOwn(alda, 'kind'), 'and NOT the layer\'s own bookkeeping word').toBe(false);
    expect(Object.hasOwn(alda, 'status'), 'with no default wired, an undeclared field stays ABSENT'
      + ' — the same absence a generated person has').toBe(false);
    expect(aldaFilled.status, 'and WIRED, the caller\'s declared default fills it')
      .toBe(DECLARED_DEFAULTS.status);
    expect(aldaFilled.name, 'while the DM\'s typed value still wins over every default').toBe('Alda');
    expect(namesOf(again), 'two runs over one layer append in ONE order').toEqual(grownIds);
    expect(pins.unapplied, 'and no minted row was reported unapplied').toEqual([]);
    expect(Object.hasOwn(pins.pins, 'npcs'), 'the newcomer PINNED its whole collection, which is'
      + ' what lets the runner take the held roster').toBe(true);
  });

  it('B3 is idempotent on one id: the second apply allocates nothing and the row is unchanged', () => {
    const once = applyEdit(EMPTY_DM_LAYER, NPC_OP, CONSULT);
    const twice = applyEdit(once.layer, NPC_OP, CONSULT);
    const overwrite = applyEdit(once.layer,
      addOp('add-npc', 'npc', NEWCOMER, { name: 'Someone else', role: 'Reeve' }), CONSULT);
    const second = applyEdit(once.layer, addOp('add-npc', 'npc', SECOND, { name: 'Bern', role: 'Reeve' }), CONSULT);

    expect(twice.ok, 'a repeat is accepted, never refused: the tick reads an applied decree many times')
      .toBe(true);
    expect(twice.layer === once.layer, 'and allocates NOTHING — the layer comes back by reference').toBe(true);
    expect(twice.keys, 'while the receipt still names the id').toEqual([NEWCOMER]);
    expect(overwrite.layer.minted[NEWCOMER], 'FIRST WRITE WINS: a second op on one id cannot rewrite a person')
      .toEqual(once.layer.minted[NEWCOMER]);
    // anchored: the same writer on a DIFFERENT id does allocate, so the identity above measures
    // the idempotence rule and not a writer that never writes twice.
    expect(second.layer === once.layer).toBe(false);
    expect(Object.keys(second.layer.minted).sort(compareCodepoint), 'two ids are two people')
      .toEqual([NEWCOMER, SECOND].sort(compareCodepoint));
  });

  it('B5 reaches the roster of ALL THREE cards, including the one behind an ARRAY HOP', () => {
    const { record, config } = SUBJECT;
    const cards = [
      ['npc', { kind: 'npc', name: 'Alda', role: 'Harbourmaster' }],
      ['institution', { kind: 'institution', name: 'The Salt Hall', category: 'Market' }],
      ['faction', { kind: 'faction', faction: 'The Salt Ring', category: 'merchant' }],
    ];
    const rosterOf = (out) => [
      ...(out.record.npcs || []),
      ...(out.record.institutions || []),
      ...((out.record.powerStructure || {}).factions || []),
    ];
    const control = rosterOf(rederive(record, config, EMPTY_DM_LAYER, ENGINE, DECLARATIONS)).length;
    const measured = cards.map(([card, row]) => {
      const layer = layerOf({ [NEWCOMER]: row });
      const pins = pinsFrom(record, layer, DECLARATIONS, ENGINE);
      const out = rederive(record, config, layer, ENGINE, DECLARATIONS);
      const found = rosterOf(out).filter((entry) => entry && entry.id === NEWCOMER);
      return {
        card,
        unapplied: pins.unapplied.length,
        found: found.length,
        grew: rosterOf(out).length - control,
      };
    });

    expect(control, 'the control world carries a roster, or the growth below measures nothing')
      .toBeGreaterThan(0);
    expect(measured.map((row) => row.found), 'each card\'s newcomer is on the record EXACTLY ONCE —'
      + ' `powerStructure.factions[].faction` included, which is the ARRAY HOP a leaf write must'
      + ' walk and an append must find')
      .toEqual(measured.map(() => 1));
    expect(measured.map((row) => row.grew), 'and each roster grew by exactly one')
      .toEqual(measured.map(() => 1));
    // anchored: the counts above are all 1, so an empty unapplied list is the append landing
    // rather than a reader that never resolved a row at all.
    expect(measured.map((row) => row.unapplied), 'no minted row was reported unapplied')
      .toEqual(measured.map(() => 0));
    expect(measured.map((row) => row.card).sort(compareCodepoint),
      'over the three cards the catalogue declares an add-op for, both directions')
      .toEqual([...MINT_OP_TYPES].map((type) => type.slice('add-'.length)).sort(compareCodepoint));
  });

  it('B4 takes EXACTLY the catalogue\'s three add rows, in both directions', () => {
    const catalogueAdds = Object.keys(OP_TYPES).filter((type) => type.startsWith('add-')).sort(compareCodepoint);
    const taken = [...MINT_OP_TYPES].sort(compareCodepoint);
    const refusedFamily = ['set-field', 'remove-npc', 'found-phantom']
      .map((type) => refusalOf(EMPTY_DM_LAYER, addOp(type, 'npc', NEWCOMER, {})).reason);

    expect(taken, 'the leaf takes the catalogue\'s add rows and no other word').toEqual(catalogueAdds);
    expect(taken.length, 'three, so the both-directions equality above is not over an empty set').toBe(3);
    expect(MINT_OP_TYPES.every((type) => OP_TYPES[type].target === type.slice('add-'.length)),
      'and every one\'s declared TARGET is the card its own name spells, which is why the leaf'
      + ' reads the card off `target.kind` and holds no second identity table').toBe(true);
    // anchored: the three taken types are accepted above, so these refusals are the family
    // boundary and not a writer that refuses every op.
    expect(refusedFamily, 'an op outside the family is not a mint at all')
      .toEqual(refusedFamily.map(() => 'invalid_op'));
  });
});
