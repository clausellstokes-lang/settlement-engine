/**
 * conquestDoctrineDormancyFence.test.js — the WR-8 conquest-doctrine dormancy fence
 * (LGT-P13-FENCES, the lighting wave's L-HOMES car 3).
 *
 * ⭐⭐ THE GAP THIS FILE CLOSES, named precisely, because a fence that duplicates an existing
 * proof is an elaborate way of saying nothing. `tests/domain/vengeanceLicenseWr8.test.js`
 * already carries an explicit `DARK`/`LIT` pair and the same-reference mint identity, and
 * that arm survives lighting because both rules objects are literals in that file. What
 * NOTHING in the estate carried is a census over the OUTER gate: `conquestDoctrineActive`
 * is an EIGHT-FLAG conjunction, and no test ever dropped its conjuncts one at a time. A
 * conjunction nobody censuses is the shape in which a deleted guard hides behind a surviving
 * one — the estate's own words for it, at `pactFormationActive`.
 *
 * ⛔ TWO GATES, AND THEY ARE DELIBERATELY DIFFERENT, so the file keeps them apart rather than
 * proving the easy one twice:
 *
 *   THE LAYER GATE — `vengeanceLicensesActive` (`vengeanceLicense.js`) reads the layer's own
 *     flag ALONE and deliberately does not duplicate the lighting order. It is the door the
 *     mint stands behind.
 *   THE COMPOSED GATE — `conquestDoctrineActive` (`conquestDoctrineStage.js`) is the
 *     eight-flag conjunction the stage's callers use. A receipt that lit the layer flag alone
 *     would still read zero through it, and that is a correct reading of an absent
 *     precondition rather than a dead lane.
 *
 * ⛔ EVERY FENCE CARRIES ITS OWN LIT-MUTANT CONTROL. "The dark world minted nothing" is
 * trivially true of a razing that would have minted nothing anyway, so each dark assertion
 * sits beside the SAME fixture read with the flag lit, producing a real license with real
 * holders. A DORMANCY CLAIM IS A BIT CLAIM: fence 3 compares the mint's REFERENCE and a
 * sha256 over the composed ledger, never a sentence about them.
 *
 * ⛔ NO 64-HEX LITERAL IS AUTHORED HERE. Both sides of every hash comparison are computed
 * in-file from two live runs. A pinned 64-hex string under `tests/property/` is a recorded
 * corpus constant to `tests/lint/goldenFreeze.walker.test.js`, owing a register row against
 * a register that is UNFROZEN and whose measured fields must stay null until the freeze act.
 */
import { createHash } from 'node:crypto';
import { describe, expect, test } from 'vitest';

import {
  CONQUEST_REQUIRED_RULES,
  conquestDoctrineActive,
} from '../../src/domain/worldPulse/conquestDoctrineStage.js';
import {
  mintVengeanceLicenses,
  readVengeanceLicenses,
  vengeanceLicensesActive,
} from '../../src/domain/worldPulse/vengeanceLicense.js';

/** @param {unknown} value */
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/**
 * THE LIGHTING ORDER, transcribed from the ruling rather than read off the constant it is
 * meant to guard. A census that derived its expectation from `CONQUEST_REQUIRED_RULES` would
 * agree with itself however that list drifted — the self-referential-pin class this estate
 * has caught before. These eight are the flag-dependency ruling's own: WR-8 lights only
 * behind WR-1 / WR-2 / WR-6 / WR-7 and behind demographics.
 */
const RULED_CONJUNCTS = Object.freeze([
  'coalitionLedgerEnabled',
  'conquestDoctrineEnabled',
  'demographicsEnabled',
  'dispositionChannelsEnabled',
  'envoyDiplomacyEnabled',
  'peaceEngineEnabled',
  'warLayerEnabled',
  'warTerminationEnabled',
]);

/** Every value that is not exactly `true`, including the truthy-non-true probes a strict read exists to refuse. */
const NOT_TRUE = Object.freeze([false, 1, 'true', 0, '', {}, [], null]);

/** The three friends of the victim; CR-WR8-A refuses the one who never bordered the razer. */
const CANDIDATES = Object.freeze([
  { holderId: 'greyford', adequacyToVictim01: 0.9, sharesEdgeWithRazer: true },
  { holderId: 'far-harbour', adequacyToVictim01: 0.95, sharesEdgeWithRazer: false },
  { holderId: 'indifferent-vale', adequacyToVictim01: 0.2, sharesEdgeWithRazer: true },
  { holderId: 'stonemere', adequacyToVictim01: 0.88, sharesEdgeWithRazer: true },
]);

/** A razing, spelled once, so every arm below drives the identical act. */
const RAZING = Object.freeze({
  razerId: 'karrow', victimId: 'thornwall', tick: 100, road: 'initiation',
});

/** ⚠ Spelled as a LITERAL: a computed member access attributes to no key. */
const LAYER_LIT = Object.freeze({ conquestDoctrineEnabled: true });
const LAYER_DARK = Object.freeze({ conquestDoctrineEnabled: false });

describe('WR-8 FENCE 1 — the COMPOSED gate is an eight-flag census, dropped one at a time', () => {
  test('THE LIT MUTANT: all eight conjuncts explicitly true opens the composed gate', () => {
    const lit = Object.fromEntries(RULED_CONJUNCTS.map((key) => [key, true]));
    expect(conquestDoctrineActive({ simulationRules: lit })).toBe(true);
    // The bare-rules receiver is the same gate, and both are exercised so neither can rot.
    expect(conquestDoctrineActive(lit)).toBe(true);
  });

  test('dropping ANY ONE conjunct closes it — no conjunct is decorative', () => {
    const lit = Object.fromEntries(RULED_CONJUNCTS.map((key) => [key, true]));
    for (const key of RULED_CONJUNCTS) {
      const absent = { ...lit };
      delete absent[key];
      expect(conquestDoctrineActive({ simulationRules: absent }), `${key} absent still lit the doctrine`)
        .toBe(false);
      for (const value of NOT_TRUE) {
        expect(
          conquestDoctrineActive({ simulationRules: { ...lit, [key]: value } }),
          `${key}=${JSON.stringify(value)} still lit the doctrine`,
        ).toBe(false);
      }
    }
  });

  test('the ruled conjunct list and the built one are the SAME SET, both directions', () => {
    // Without this the census above would keep passing over a shrunken constant: dropping a
    // conjunct from `CONQUEST_REQUIRED_RULES` removes the very key whose absence it tests.
    expect([...CONQUEST_REQUIRED_RULES].sort()).toEqual([...RULED_CONJUNCTS]);
    expect(CONQUEST_REQUIRED_RULES.length).toBe(8);
  });

  test('a missing or non-object rules bag is dark, never permissive', () => {
    for (const junk of [undefined, null, 0, '', 'true', []]) {
      expect(conquestDoctrineActive(/** @type {never} */ (junk)), `${String(junk)} lit the doctrine`)
        .toBe(false);
    }
  });
});

describe('WR-8 FENCE 2 — the LAYER gate reads its own flag alone, strictly', () => {
  test('the lit control opens it; every not-true spelling and every empty world closes it', () => {
    expect(vengeanceLicensesActive({ simulationRules: { ...LAYER_LIT } })).toBe(true);
    expect(vengeanceLicensesActive({ ...LAYER_LIT })).toBe(true);
    for (const value of NOT_TRUE) {
      expect(
        vengeanceLicensesActive({ simulationRules: { conquestDoctrineEnabled: value } }),
        `${JSON.stringify(value)} lit the license layer`,
      ).toBe(false);
    }
    for (const junk of [undefined, null, {}, { simulationRules: {} }]) {
      expect(vengeanceLicensesActive(/** @type {never} */ (junk))).toBe(false);
    }
  });
});

describe('WR-8 FENCE 3 — a dark razing mints nothing, and dormancy is the SAME REFERENCE', () => {
  test('the LIT MUTANT first: the identical razing really mints a license with real holders', () => {
    const before = { simulationRules: { ...LAYER_LIT } };
    const after = mintVengeanceLicenses({ ...RAZING, worldState: before, candidates: CANDIDATES });
    expect(after === before, 'the lit mint returned the same world — it minted nothing').toBe(false);
    const minted = readVengeanceLicenses(after);
    const ids = Object.keys(minted);
    expect(ids.length).toBe(1);
    // CR-WR8-A: only the avengers who both cared AND bordered the razer hold the right.
    expect(minted[ids[0]].holders).toEqual(['greyford', 'stonemere']);
  });

  test('every dark spelling returns the SAME OBJECT, so a dormant pass is identical and not merely equal', () => {
    for (const value of NOT_TRUE) {
      const before = { simulationRules: { conquestDoctrineEnabled: value } };
      const after = mintVengeanceLicenses({ ...RAZING, worldState: before, candidates: CANDIDATES });
      expect(after === before, `${JSON.stringify(value)}: the dark mint built a new world`).toBe(true);
    }
    // An absent key is the shape every campaign that never lights this key actually holds.
    const absent = { simulationRules: {} };
    expect(mintVengeanceLicenses({ ...RAZING, worldState: absent, candidates: CANDIDATES }) === absent)
      .toBe(true);
  });

  test('the composed ledger is byte-identical across every dark spelling, and the lit one is not', () => {
    const prints = NOT_TRUE.map((value) => hash(readVengeanceLicenses(mintVengeanceLicenses({
      ...RAZING, worldState: { simulationRules: { conquestDoctrineEnabled: value } }, candidates: CANDIDATES,
    }))));
    const baseline = hash(readVengeanceLicenses({ simulationRules: { ...LAYER_DARK } }));
    for (const [index, print] of prints.entries()) {
      expect(print, `${JSON.stringify(NOT_TRUE[index])} moved the ledger`).toBe(baseline);
    }
    // ANTI-VACUITY: the identical comparator SEES the lit mint. Without this the equality
    // above would hold just as well over nine empty reads of a broken reader.
    const lit = hash(readVengeanceLicenses(mintVengeanceLicenses({
      ...RAZING, worldState: { simulationRules: { ...LAYER_LIT } }, candidates: CANDIDATES,
    })));
    expect(lit === baseline, 'the lit ledger hashed the same as the dark one').toBe(false);
  });
});

describe('WR-8 FENCE 4 — the dark claim survives the day the default lights', () => {
  test('every rules object here is built in this file, so no arm inherits a default', () => {
    // THE POINT OF THE CAR. Once a preset carries `conquestDoctrineEnabled`, a fence resting on
    // "the default is dark" would begin measuring a lit world and go on passing. These are
    // literals; the dark arms keep exercising darkness for as long as the two gates exist.
    expect(LAYER_DARK).toEqual({ conquestDoctrineEnabled: false });
    expect(LAYER_LIT).toEqual({ conquestDoctrineEnabled: true });
    expect(NOT_TRUE.some((value) => value === true)).toBe(false);
    expect(NOT_TRUE.length).toBe(8);
  });
});
