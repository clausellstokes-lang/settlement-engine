/**
 * crimeLineDisqualifiers.test.js — the crime desk's lines, each struck only where the town makes it false
 * (W2-A-LEAVES-2, 2026-11-13; REVIEW-W2A F3; the chair's ruling: "each line of the crime desk carries the disqualifier
 * for the stored state that makes it false, and the true lines print again").
 */
import { describe, expect, test } from 'vitest';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { CRIME_LINE_DISQUALIFIERS, corpusAdmittingCrimeLines } from '../../src/domain/display/stateProse/crimeLineDisqualifiers.js';
import { officialsInCriminalPayOf } from '../../src/domain/facts/officialsInPay.js';
import { powerStateProse } from '../../src/domain/display/stateProse/powerStateProse.js';
import { defenseCriminalProse } from '../../src/domain/display/stateProse/defenseStateProse.js';
import { deriveCriminalStructure } from '../../src/domain/display/defenseDisplay.js';

const CORPORA = { 'DS-POW-6': DOSSIER_STATE_PROSE_POWER, 'DS-DEF-4': DOSSIER_STATE_PROSE_DEFENSE };
/** A card who answers to a criminal house through their office, and one who answers as a retainer. */
const OFFICIAL = { id: 'n1', name: 'Panayot Pavlov', allegiance: { house: 'Smuggling network', vector: 'greed', via: 'office' } };
const RETAINER = { id: 'n2', name: 'Vira Cvjetkovic', allegiance: { house: 'Smuggling network', vector: 'greed', via: 'retainer' } };
const vidsOf = (blockId, pool, facts) => corpusAdmittingCrimeLines(CORPORA[blockId], blockId, facts)[blockId].pools[pool].map((v) => v.vid);
const town = (state, npcs, legitimacy) => ({
  name: 'Thornwall', _seed: 'seed-pow6', npcs,
  powerStructure: { publicLegitimacy: legitimacy, governingName: 'Merchant Council', government: 'Merchant Council', criminalCaptureState: state },
  economicState: { safetyProfile: { criminalInstitutions: [] } },
});
const BREAK = (b) => ({ score: 50, label: 'Tolerated', breakdown: { prosperity: 0, safety: 0, defense: 0, food: 0, ...b }, governanceFractured: false });

describe('the declarations are held to the corpus line by line', () => {
  test('every declared vid opens with the words its declaration names (a re-generated corpus cannot shift one)', () => {
    for (const [key, byVid] of Object.entries(CRIME_LINE_DISQUALIFIERS)) {
      const [blockId, pool] = [key.slice(0, key.indexOf('::')), key.slice(key.indexOf('::') + 2)];
      const variants = CORPORA[blockId][blockId].pools[pool];
      expect(variants, key).toBeTruthy();
      for (const [vid, d] of Object.entries(byVid)) {
        expect(variants.find((v) => v.vid === Number(vid))?.text.startsWith(d.opens), `${key} #${vid}`).toBe(true);
      }
    }
  });
});

describe('an official in a criminal\'s pay is the cast\'s fact (facts/officialsInPay.js)', () => {
  test('office, not retainer; no cast, no official', () => {
    expect(officialsInCriminalPayOf({ npcs: [OFFICIAL, RETAINER, { name: 'Plain' }] })).toEqual(['Panayot Pavlov']);
    expect(officialsInCriminalPayOf({ npcs: [RETAINER] })).toEqual([]);
    expect(officialsInCriminalPayOf(null)).toEqual([]);
  });
});

describe('each line struck only where its fact makes it false, and no case left dry', () => {
  const ADV = 'capture pressure ADVANCING (weak security, poor prosperity)';
  const REC = 'capture pressure RECOVERING (strong security, prosperity)';
  test('the pressure pools, every rung below corrupted with and without an official in pay', () => {
    const at = (captureState, officialsInPay) => ({ captureState, officialsInPay });
    expect(vidsOf('DS-POW-6', ADV, at('none', 0))).toEqual([2]);
    expect(vidsOf('DS-POW-6', ADV, at('none', 1))).toEqual([1, 2, 3]);
    expect(vidsOf('DS-POW-6', REC, at('none', 0))).toEqual([2]);
    expect(vidsOf('DS-POW-6', REC, at('none', 1))).toEqual([3]);
    expect(vidsOf('DS-POW-6', REC, at('adversarial', 0))).toEqual([2]);
    expect(vidsOf('DS-POW-6', REC, at('adversarial', 1))).toEqual([3]);
    expect(vidsOf('DS-POW-6', REC, at('equilibrium', 0))).toEqual([1, 2]);
    expect(vidsOf('DS-POW-6', REC, at('equilibrium', 1))).toEqual([1, 3]);
    for (const state of ['none', 'adversarial', 'equilibrium']) for (const n of [0, 1]) {
      expect(vidsOf('DS-POW-6', ADV, at(state, n)).length).toBeGreaterThan(0);
      expect(vidsOf('DS-POW-6', REC, at(state, n)).length).toBeGreaterThan(0);
      expect(vidsOf('DS-DEF-4', 'capture none', at(state, n)).length).toBeGreaterThan(0);
      expect(vidsOf('DS-DEF-4', 'capture equilibrium', at(state, n)).length).toBeGreaterThan(0);
    }
    // the Defense capture lens: "nothing is bought", "has not reached", "business with the hall is straight"
    expect(vidsOf('DS-DEF-4', 'capture equilibrium', at('equilibrium', 1))).toEqual([2, 3]);
    expect(vidsOf('DS-DEF-4', 'capture none', at('none', 1))).toEqual([1]);
    expect(vidsOf('DS-DEF-4', 'capture none', at('none', 0))).toEqual([1, 2, 3]);
  });
  test('the desks draw through the struck corpus', () => {
    /** @type {string[]} */ const wrong = [];
    for (let i = 0; i < 12; i += 1) {
      const free = powerStateProse(town('none', [], BREAK({ prosperity: -10, safety: -12 })), {}, { seed: `s${i}`, audience: 'dm' });
      if (!/^Each season it gets easier to buy an official/.test(free.captureReading?.sentence ?? '')) wrong.push(`s${i} free: ${free.captureReading?.sentence}`);
      const bought = powerStateProse(town('none', [OFFICIAL], BREAK({ prosperity: 10, safety: 12 })), {}, { seed: `s${i}`, audience: 'dm' });
      if (!/still own a few officials/.test(bought.captureReading?.sentence ?? '')) wrong.push(`s${i} bought: ${bought.captureReading?.sentence}`);
      const def = defenseCriminalProse(town('equilibrium', [OFFICIAL]), 'organized', { seed: `s${i}`, audience: 'dm' });
      if (!def.capture?.sentence || /nothing is bought/.test(def.capture.sentence)) wrong.push(`s${i} defense: ${def.capture?.sentence}`);
    }
    expect(wrong).toEqual([]);
  });
});

describe('F3b (the read of thirty): an official of the hall, and a hall the criminals hold, are officials in pay', () => {
  const MEMBER = { id: 'n3', name: 'Liliya Gusev', memberships: [{ power: 'Merchant Council', rank: 2 }], allegiance: { house: 'Smuggling network', vector: 'greed', via: 'retainer' } };
  const council = (state, npcs) => ({ _seed: 'a', npcs, institutions: [{ name: "Thieves' guild" }], powerStructure: { criminalCaptureState: state, factions: [{ faction: 'Merchant Council', name: 'Merchant Council', power: 60, isGoverning: true }] } });
  test('a member of the ruling power who answers to a criminal house is an official in pay', () => {
    expect(officialsInCriminalPayOf(council('none', [MEMBER]))).toEqual(['Liliya Gusev']);
    expect(deriveCriminalStructure(council('none', [MEMBER])).note).toMatch(/official/i);
  });
  test('at corrupted the criminals hold the hall: the ring\'s note keeps its officials', () => {
    expect(deriveCriminalStructure(council('corrupted', [])).note).toMatch(/official/i);
    expect(deriveCriminalStructure(council('none', [])).note).toMatch(/one ring/);
    expect(deriveCriminalStructure(council('none', [])).note).not.toMatch(/official/i); // anchored: the same note matched 'one ring' on the line above
  });
});

describe('the organised ring\'s note says "bought officials" only where the cast holds one', () => {
  const ring = (npcs, seed) => deriveCriminalStructure({ _seed: seed, npcs, institutions: [{ name: "Thieves' guild" }] });
  test('the same vantage, with the clause only where an official is in pay; the key is untouched', () => {
    /** @type {string[]} */ const wrong = [];
    for (const seed of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
      const none = ring([], seed); const one = ring([OFFICIAL], seed);
      if (none.key !== 'organized' || /official/i.test(none.note) || !/official/i.test(one.note)) wrong.push(`${seed}: ${none.note} | ${one.note}`);
      // the pick is unchanged: the note without the clause is the same vantage's opening
      if (none.note.slice(0, 24) !== one.note.slice(0, 24)) wrong.push(`${seed}: another vantage`);
    }
    expect(wrong).toEqual([]);
    expect(ring([], 'a').note).toMatch(/one ring/);
  });
});
