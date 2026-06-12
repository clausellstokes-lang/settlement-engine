/**
 * tests/generators/captureBirthScale.test.js — Wave 7 #1 pins.
 *
 * Birth-scale reconciliation of computeCriminalCaptureState with the
 * play-time capture ladder (domain/corruption.js CAPTURE_LADDER):
 *
 *   1. Self-comparison artifact is dead — a criminal-flavoured GOVERNMENT
 *      ('Corrupt Council' carries category 'criminal' via the 'Corrupt'
 *      keyword) is no longer matched against itself (ratio exactly 1.0).
 *   2. Deeply criminal births read contested/influenced (equilibrium /
 *      corrupted); ordinary births stay clean; full capture is extraordinary
 *      even at the deliberate extreme of the config space.
 *   3. An equilibrium+ birth stamps the rung onto the governing faction
 *      entry, so ensureFactionStates seeds the play-time ladder where
 *      generation says it already is (otherwise the first pulse's rollup
 *      would silently reset criminalCaptureState to 'none').
 *
 * Sweep thresholds are calibrated against measurement (2026-06-11, N=60-120
 * per config): ordinary town/city/village read 0% corrupted and 0% capture;
 * 90-criminal-priority fixtures read ~60% corrupted and 1.7-3.3% capture.
 * Bounds below leave drift margin without letting the rates become dishonest.
 * Deterministic: seeds derive from index, same numbers every run.
 */

import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { computeCriminalCaptureState } from '../../src/generators/factionDynamics.js';

const N = 40;
const LADDER = ['none', 'adversarial', 'equilibrium', 'corrupted', 'capture'];

const CRIMINAL_HEAVY = {
  priorityCriminal: 90,
  priorityMilitary: 20,
  priorityEconomy: 35,
  priorityReligion: 20,
  priorityMagic: 20,
};

function sweep(config, seedPrefix) {
  const out = [];
  for (let i = 0; i < N; i++) {
    out.push(generateSettlementPipeline(config, null, { seed: `${seedPrefix}-${i}`, customContent: {} }));
  }
  return out;
}

const capOf = s => s.powerStructure?.criminalCaptureState || 'none';
const rungOf = s => LADDER.indexOf(capOf(s));
const countAtLeast = (settlements, rung) =>
  settlements.filter(s => rungOf(s) >= LADDER.indexOf(rung)).length;

describe('computeCriminalCaptureState — unit semantics', () => {
  it('a criminal-flavoured government is classified deliberately, not via self-comparison', () => {
    // 'Corrupt Council' is both governing and category criminal — the old
    // finder compared it against ITSELF (crimP === govP → permanent
    // 'corrupted' whenever safety was low). The new finder excludes the
    // governing seat; the purchased-council branch classifies it instead.
    const factions = [{ faction: 'Corrupt Council', category: 'criminal', isGoverning: true, power: 46 }];
    expect(computeCriminalCaptureState(factions, 0.3, {})).toBe('corrupted');
    // ...and with enforcement intact, a criminal-flavoured name alone is not capture-track.
    expect(computeCriminalCaptureState(factions, 0.8, {})).toBe('none');
  });

  it('capture needs a real underworld overtopping a STILL-STANDING government', () => {
    const gov = p => ({ faction: 'Town Council', isGoverning: true, power: p });
    const crim = p => ({ faction: "Thieves' Guild", category: 'criminal', power: p });
    const mil = { faction: 'City Guard', power: 8 };
    // Dominates a standing government with enforcement broken: capture.
    expect(computeCriminalCaptureState([gov(18), crim(28), mil], 0.1, {})).toBe('capture');
    // Same underworld over a COLLAPSED government (power vacuum, nothing left
    // to wear as a front): not capture.
    expect(computeCriminalCaptureState([gov(10), crim(28), mil], 0.1, {})).not.toBe('capture');
    // Ordinary enforcement-winning posture stays adversarial.
    expect(computeCriminalCaptureState([gov(30), crim(6), mil], 1.2, {})).toBe('adversarial');
  });
});

describe('birth-scale distribution sweep', () => {
  const ordinaryTowns = sweep({ settType: 'town', culture: 'germanic' }, 'cap-ord-town');
  const ordinaryCities = sweep({ settType: 'city', culture: 'germanic' }, 'cap-ord-city');
  const ordinaryVillages = sweep({ settType: 'village', culture: 'germanic' }, 'cap-ord-village');
  const criminalTowns = sweep({ settType: 'town', culture: 'germanic', ...CRIMINAL_HEAVY }, 'cap-crim-town');
  const criminalCities = sweep({ settType: 'city', culture: 'germanic', ...CRIMINAL_HEAVY }, 'cap-crim-city');

  it('ordinary settlements essentially never read influenced (corrupted) at birth', () => {
    // Measured 0% — the ≤1/40 bound (2.5%) is drift margin, not an expectation.
    expect(countAtLeast(ordinaryTowns, 'corrupted')).toBeLessThanOrEqual(1);
    expect(countAtLeast(ordinaryCities, 'corrupted')).toBeLessThanOrEqual(1);
    expect(countAtLeast(ordinaryVillages, 'corrupted')).toBeLessThanOrEqual(1);
  });

  it('ordinary settlements never read full capture at birth', () => {
    expect(countAtLeast(ordinaryTowns, 'capture')).toBe(0);
    expect(countAtLeast(ordinaryCities, 'capture')).toBe(0);
    expect(countAtLeast(ordinaryVillages, 'capture')).toBe(0);
  });

  it('ordinary villages are overwhelmingly clean', () => {
    expect(ordinaryVillages.filter(s => capOf(s) === 'none').length).toBeGreaterThanOrEqual(N - 2);
  });

  it('overwhelming criminal presence reads contested/influenced at birth', () => {
    // Contested (equilibrium) or worse is the NORM for a 90-criminal-priority
    // settlement (measured ~80-100%) — the dossier must not call it clean.
    expect(countAtLeast(criminalTowns, 'equilibrium')).toBeGreaterThanOrEqual(Math.round(N * 0.5));
    expect(countAtLeast(criminalCities, 'equilibrium')).toBeGreaterThanOrEqual(Math.round(N * 0.5));
    // Influenced (corrupted) is reachable at birth.
    expect(countAtLeast(criminalTowns, 'corrupted')).toBeGreaterThanOrEqual(1);
    expect(countAtLeast(criminalCities, 'corrupted')).toBeGreaterThanOrEqual(1);
  });

  it('full capture stays extraordinary even at the criminal extreme', () => {
    // Measured 1.7-3.3% — bound at 10% of the sweep.
    expect(countAtLeast(criminalTowns, 'capture')).toBeLessThanOrEqual(Math.round(N * 0.1));
    expect(countAtLeast(criminalCities, 'capture')).toBeLessThanOrEqual(Math.round(N * 0.1));
  });

  it('an equilibrium+ birth stamps the rung onto the governing faction (the play-time seed)', () => {
    const all = [...ordinaryTowns, ...ordinaryCities, ...ordinaryVillages, ...criminalTowns, ...criminalCities];
    let stamped = 0;
    for (const s of all) {
      const govEntry = (s.powerStructure?.factions || []).find(f => f.isGoverning);
      if (rungOf(s) >= LADDER.indexOf('equilibrium')) {
        expect(govEntry?.captureState).toBe(capOf(s));
        stamped += 1;
      } else {
        // none/adversarial births do NOT seed a capture arc.
        expect(govEntry?.captureState).toBeUndefined();
      }
    }
    // Anti-vacuity: the criminal-heavy sweeps guarantee stamped births exist.
    expect(stamped).toBeGreaterThan(0);
  });
});
