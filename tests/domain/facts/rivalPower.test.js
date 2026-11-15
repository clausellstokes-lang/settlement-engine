/**
 * tests/domain/facts/rivalPower.test.js — TAIL-CRISIS-2, THE CHAIR'S RULING K6 of 2026-11-15: the third atom, `rival
 * power`, granted (`src/domain/facts/rivalPower.js`), through the vocabulary's own door (`factVocabulary.js`,
 * `factsOf.js`, `factLayers.js`; the self-check's settled view reads a getter as it is).
 *
 * @enforced-by npx vitest run tests/domain/facts/rivalPower.test.js
 */
import { describe, expect, it } from 'vitest';
import { RIVAL_STANDINGS, rivalPowerOf } from '../../../src/domain/facts/rivalPower.js';
import * as V from '../../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { LEAVES } from '../../../src/domain/facts/factLayers.js';
import { presumptionFindings } from '../../../src/domain/facts/presumptionCheck.js';

const power = (faction, powerLabel, isGoverning) => ({ faction, powerLabel, ...(isGoverning === undefined ? {} : { isGoverning }) });
const rec = (...factions) => ({ powerStructure: { government: 'Elder Council', factions } });
const alone = rec(power('Elder Council', 'Dominant', true));
const rival = rec(power('Reform Movement', 'Strong'), power('Elder Council', 'Strong', true));
const minors = rec(power('Ducal Governorship', 'Significant', true), power('Noble Houses', 'Minor'), power('Arcane Orders', 'Suppressed'));

describe('the home: a power not the governing one, by its own standing', () => {
  it('reads Significant, Strong and Dominant as standing; Minor and Suppressed as not', () => {
    expect(RIVAL_STANDINGS).toEqual(['Significant', 'Strong', 'Dominant']);
    expect(rivalPowerOf(rival)).toBe(true);
    expect(rivalPowerOf(rec(power('People\'s Council', 'Significant', false), power('Elder Council', 'Dominant', true)))).toBe(true);
    expect(rivalPowerOf(minors)).toBe(false);
  });
  it('never counts the governing power itself, however strong', () => {
    expect(rivalPowerOf(alone)).toBe(false);
  });
  it('reads the power\'s own label, not its share (a label the page prints)', () => {
    expect(rivalPowerOf(rec(power('Elder Council', 'Strong', true), { faction: 'Military/Guard', power: 31, powerLabel: 'Minor' }))).toBe(false);
  });
  it('is UNANSWERED where the record holds no power list (fail-closed)', () => {
    expect(rivalPowerOf({})).toBeUndefined();
    expect(rivalPowerOf(null)).toBeUndefined();
    expect(rivalPowerOf({ powerStructure: {} })).toBeUndefined();
  });
});

describe('THE HAZARD (K10): true of the SETTLED record; a line rendered before the powers settle must not be keyed by it', () => {
  it('reads the record as it stands now: a roster resized to the governing power alone answers false', () => {
    const early = rec(power('Elder Council', 'Dominant', true), power('People\'s Council', 'Strong'));
    const settled = rec(power('Elder Council', 'Dominant', true));
    expect(rivalPowerOf(early)).toBe(true);
    expect(rivalPowerOf(settled)).toBe(false);
  });
  // TAIL-CRISIS-5 (K21): the insurgency summary IS keyed by it, and the line stored is the assembly's LATE RE-READ, after the
  // last roster write (tests/generators/stressLateReRead.test.js holds the births and the source order).
  it('the insurgency summary is keyed by it: the strong line with a rival of standing, the plain line without', async () => {
    const { renderStressSummary } = await import('../../../src/generators/stressNarrative.js');
    expect(renderStressSummary('insurgency', 'Dioneia', null, null, factsOf(rival))).toBe('A strong power in Dioneia has stopped obeying the government. Its people stall, its taxes go unpaid, and it waits.');
    expect(renderStressSummary('insurgency', 'Dioneia', null, null, factsOf(alone))).toBe('Some in Dioneia have stopped obeying the government. They stall, their taxes go unpaid, and they wait.');
  });
});

describe('the word, through the vocabulary\'s door', () => {
  it('is a declarable presence atom, homed in factsOf and in the layer table', () => {
    expect(V.assertDeclarable('rival power').dimension).toBe('rival power');
    expect(V.FACT_DIMENSIONS['rival power']).toMatchObject({ shape: 'presence', home: 'rivalPower' });
    expect(LEAVES.rivalPower).toMatchObject({ layer: 3, reads: ['powerStructure'] });
  });
  it('holds, refuses and stays unanswered as the record does', () => {
    expect(V.atomHolds('rival power', factsOf(rival))).toBe(true);
    expect(V.atomHolds('rival power', factsOf(alone))).toBe(false);
    expect(V.atomHolds('rival power', factsOf({}))).toBeUndefined();
    const line = { line: () => '', needs: ['rival power'] };
    expect(V.declarationAdmits(V.declarationOf(line), factsOf(rival)).admitted).toBe(true);
    expect(V.declarationAdmits(V.declarationOf(line), factsOf(minors)).refused).toEqual(['rival power']);
  });
  it('the birth self-check re-asserts it against the final record', () => {
    const entry = { pool: 'P', lineId: 0, atoms: ['rival power'], surface: 'crisis', drawKind: 'H', resolvedBy: 'drawn' };
    expect(presumptionFindings(alone, [entry])).toEqual([expect.objectContaining({ code: 'false-presumption', atom: 'rival power', answer: 'false' })]);
    expect(presumptionFindings(rival, [entry])).toEqual([]);
  });
});
