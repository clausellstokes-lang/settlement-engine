/**
 * The rung-2 window (2026-11-04), the chair's ruling on F12's hunger family: HUNGER reads the
 * food record's deficit band, not the crisis kind alone. A place under any active crisis whose
 * food record stands on a deficit band (`economicState.foodSecurity.foodRecord.band`, 'deficit'
 * or 'famine') is hungry; the same crisis with the record secure (soak1k-5: wartime, band
 * 'secure', 15.3 months in store, a 1% gap) is not. A crisis-free place is never answered by a
 * crisis family (F12's control: 0 of 84 crisis-free places move). The famine and siege kinds
 * stay hungry by kind.
 *
 * The anchor is DS-ECO-9 `SECURE` v2 through the shipped read path (never quoted;
 * `tests/lint/proseDrawnAnchors.walker.test.js`).
 */
import { describe, expect, it } from 'vitest';
import { crisisBlindFindings } from '../../../src/domain/coherence/crisisBlindFindings.js';
import { crisisDimensionsOf } from '../../../src/domain/crisis/crisisFacts.js';
import { speakTierNoun } from '../../../src/domain/display/stateProse/stateProseKernel.js';
import { variantByVid } from '../../helpers/drawnProse.js';

/** @param {string} band @param {...string} types */
const place = (band, ...types) => ({
  name: 'Eishavn', tier: 'metropolis',
  stress: types.map((type) => ({ type, label: type })),
  economicState: { foodSecurity: { foodRecord: { band, gapPct: band === 'secure' ? 1 : 45, storageMonths: band === 'secure' ? 15.3 : 1 } } },
});

/** DS-ECO-9 `SECURE` v2: the food is not a subject. */
const eats = speakTierNoun(variantByVid({
  leaf: 'economy', blockId: 'DS-ECO-9', poolKey: 'SECURE', vid: 2, slots: { settlement: 'Eishavn' },
}), 'metropolis');

describe('rung-2 window · hunger reads the food record\'s deficit band', () => {
  it('a wartime place on a deficit band is hungry: the calm food line is a finding', () => {
    expect(crisisDimensionsOf(place('deficit', 'wartime')).hunger).toBe('hunger');
    const found = crisisBlindFindings(place('deficit', 'wartime'), { economics: eats });
    expect(found.map((f) => [f.family, f.crises])).toEqual([['hunger', ['wartime']]]);
  });

  it('soak1k-5\'s shape (wartime, band secure, stores in hand) is not hungry: silent', () => {
    expect(crisisDimensionsOf(place('secure', 'wartime')).hunger).toBe('no hunger');
    expect(crisisBlindFindings(place('secure', 'wartime'), { economics: eats })).toEqual([]);
  });

  it('a crisis-free place on a deficit band is answered by no crisis family', () => {
    expect(crisisDimensionsOf(place('deficit')).hunger).toBe('no hunger');
    expect(crisisBlindFindings(place('deficit'), { economics: eats })).toEqual([]);
  });

  it('famine and siege stay hungry by kind, whatever the band', () => {
    expect(crisisDimensionsOf(place('secure', 'under_siege')).hunger).toBe('hunger');
    expect(crisisDimensionsOf(place('famine', 'famine')).hunger).toBe('hunger');
  });
});
