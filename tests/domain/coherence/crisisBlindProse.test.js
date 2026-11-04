/**
 * F12 CRISIS-BLIND PROSE (rung 2, 2026-11-04), unit 1: the instrument.
 *
 * Rung 2's sixty-settlement read (`docs/SOAK_10000_RUNG2_2026-11-04.md` §3c) found about a
 * third of the pages printing a stock calm sentence under an active crisis the sentence
 * denies. `coh:crisis-blind-prose` (kind 10, crisis) reads every rendered surface against the
 * crisis record (`settlement.stress`) and flags such a sentence.
 *
 * The fixtures are the §3c seeds' own lines: `soak1k-5404` (city, under siege) printed
 * DS-DEF-1 `readiness STRONG` v4, `soak1k-4800` (thorp, succession void) printed DS-POW-4
 * `riskLabel: Stable (no challengers)` v1, `soak1k-0` (thorp, mass migration, an influx) printed
 * the governance narrative's "families left" line. State-prose anchors are computed through
 * the shipped read path (`tests/helpers/drawnProse.js`), never quoted
 * (`tests/lint/proseDrawnAnchors.walker.test.js`).
 */
import { describe, expect, it } from 'vitest';
import { crisisBlindFindings } from '../../../src/domain/coherence/crisisBlindFindings.js';
import { BATTERY_CHECKS, coherenceBattery } from '../../../src/domain/coherence/coherenceBattery.js';
import { activeCrisisTypes, crisisDimensionsOf } from '../../../src/domain/crisis/crisisFacts.js';
import { speakTierNoun } from '../../../src/domain/display/stateProse/stateProseKernel.js';
import { variantByVid } from '../../helpers/drawnProse.js';
import { KIND_OF } from '../../../scripts/audit/soak-review/checks.mjs';

/** @param {...string} types */
const placeUnder = (...types) => ({ name: 'Rundfeld', tier: 'city', stress: types.map((type) => ({ type, label: type })) });

/** DS-DEF-1 `readiness STRONG` v4, as soak1k-5404 printed it. */
const nothingPresses = speakTierNoun(variantByVid({
  leaf: 'defense', blockId: 'DS-DEF-1', poolKey: 'readiness STRONG', vid: 4, slots: { settlement: 'Rundfeld' },
}), 'city');

/** DS-POW-4 `riskLabel: Stable (no challengers)` v1, as soak1k-4800 printed it. */
const noRival = speakTierNoun(variantByVid({
  leaf: 'power', blockId: 'DS-POW-4', poolKey: 'riskLabel: Stable (no challengers)', vid: 1,
  slots: { settlement: 'Grudets', seat: 'headman', faction: "Headman's Authority" },
}), 'thorp');

/** A crisis-aware line: DS-STR-1 `UNDER SIEGE` v3, the siege named. */
const siegeNamed = variantByVid({
  leaf: 'stressors', blockId: 'DS-STR-1', poolKey: 'UNDER SIEGE', vid: 3, slots: { settlement: 'Rundfeld' },
});

describe('F12 · coh:crisis-blind-prose, the instrument', () => {
  it('soak1k-5404: the calm defence line under a siege is a finding, on its own surface', () => {
    const found = crisisBlindFindings(placeUnder('under_siege'), { defense: nothingPresses });
    expect(found).toHaveLength(1);
    expect(found[0]).toMatchObject({ surface: 'defense', family: 'threat', crises: ['under_siege'] });
    expect(found[0].sentence).toBe(nothingPresses);
  });

  it('the same calm line in a place with no crisis is silent', () => {
    expect(crisisBlindFindings({ name: 'Rundfeld', tier: 'city' }, { defense: nothingPresses })).toEqual([]);
    expect(crisisBlindFindings({ name: 'Rundfeld', tier: 'city', stress: [] }, { defense: nothingPresses })).toEqual([]);
  });

  it('a calm line under a crisis it does not deny is silent (no siege line is false in a famine)', () => {
    expect(crisisBlindFindings(placeUnder('famine'), { defense: nothingPresses })).toEqual([]);
    expect(crisisBlindFindings(placeUnder('famine'), { power: noRival })).toEqual([]);
  });

  it('a crisis-aware line under its crisis is silent', () => {
    expect(crisisBlindFindings(placeUnder('under_siege'), { overview: siegeNamed })).toEqual([]);
  });

  it('soak1k-4800: "the succession question is not a live one" in a succession void is a finding', () => {
    const found = crisisBlindFindings(placeUnder('succession_void'), { power: noRival });
    expect(found.map((f) => f.family)).toEqual(['succession']);
  });

  it('soak1k-0: families leaving under a mass-migration influx is a finding (counted; the cure is the migration lane\'s)', () => {
    const found = crisisBlindFindings(placeUnder('mass_migration'), { power: 'Three families left this week. Two more last week.' });
    expect(found.map((f) => [f.family, f.crises])).toEqual([['migration', ['mass_migration']]]);
  });

  it('two crises: a claim reports the active crises of the family it denies', () => {
    const found = crisisBlindFindings(placeUnder('famine', 'under_siege', 'occupied'), { defense: nothingPresses });
    expect(found[0].crises).toEqual(['under_siege', 'occupied']);
  });

  it('the crisis reader takes one entry or a list, without repeats, and answers every family', () => {
    expect(activeCrisisTypes({ stress: { type: 'famine' } })).toEqual(['famine']);
    expect(activeCrisisTypes({ stress: [{ type: 'famine' }, { type: 'famine' }, null] })).toEqual(['famine']);
    expect(crisisDimensionsOf({})).toEqual({
      threat: 'no threat', hunger: 'no hunger', succession: 'succession settled', unrest: 'no unrest', crisis: 'no crisis',
    });
    expect(crisisDimensionsOf(placeUnder('under_siege'))).toEqual({
      threat: 'threat', hunger: 'hunger', succession: 'succession settled', unrest: 'no unrest', crisis: 'crisis',
    });
  });

  it('the battery runs it as a page check and the soak reads it as kind 10 (crisis)', () => {
    expect(BATTERY_CHECKS).toContain('crisis-blind-prose');
    const found = coherenceBattery(placeUnder('under_siege'), { defense: nothingPresses, overview: siegeNamed });
    expect(found.filter((f) => f.check === 'crisis-blind-prose').map((f) => f.surface)).toEqual(['defense']);
    expect(KIND_OF['coh:crisis-blind-prose']).toBe(10);
  });
});
