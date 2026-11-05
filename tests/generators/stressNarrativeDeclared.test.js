/**
 * The Crisis tab's stress narrative declares what it presumes (CENSUS-2c unit 1; the chair's
 * R-P 1). `stressNarrative.js :: RENDERERS` prints one paragraph per active stressor, rendered at
 * assembly once the name exists; a sentence that asserts a consequence the record may not hold
 * is a declared sibling set (`STRESS_SUMMARY_SIBLINGS`), resolved through `resolveSiblingSentences`
 * after the render, draw-free. With no facts (the provisional roll-time render) every sentence is
 * kept, byte-identical.
 */
import { describe, it, expect } from 'vitest';
import { renderStressSummary, STRESS_SUMMARY_SIBLINGS } from '../../src/generators/stressNarrative.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { crisisBlindFindings } from '../../src/domain/coherence/crisisBlindFindings.js';

const FOOD = 'New arrivals come faster than housing, food, and employment can absorb them.';
const FED = 'New arrivals come faster than housing and employment can absorb them.';

/** a record under these stressors whose food record stands on `band` */
const recordOf = (types, band) => ({ stress: types.map((type) => ({ type })), economicState: { foodSecurity: { foodRecord: { band } } } });

describe('mass_migration: the food line needs hunger (R-P 1)', () => {
  it('a fed influx (the food record counts the influx and stays secure) prints the twin, not the food line', () => {
    const text = renderStressSummary('mass_migration', 'Avel', null, factsOf(recordOf(['mass_migration'], 'secure')));
    expect(text).not.toContain(FOOD);
    expect(text).toContain(FED);
    expect(text.startsWith('Avel is receiving more people than its infrastructure was built for. ')).toBe(true);
  });
  it('an influx the record cannot feed (a deficit band) keeps the food line', () => {
    expect(renderStressSummary('mass_migration', 'Avel', null, factsOf(recordOf(['mass_migration'], 'deficit')))).toContain(FOOD);
  });
  it('an influx beside a famine keeps the food line (soak1k-30, -34; under the conjunction and the disjunction alike)', () => {
    expect(renderStressSummary('mass_migration', 'Avel', null, factsOf(recordOf(['famine', 'mass_migration'], 'famine')))).toContain(FOOD);
  });
  it('the provisional render (no facts) is byte-identical to the old paragraph', () => {
    expect(renderStressSummary('mass_migration', 'Avel', null)).toBe(`Avel is receiving more people than its infrastructure was built for. ${FOOD} The old residents and the new ones are not yet the same community.`);
  });
  it('the sibling set is keyed by the original text and declares crisis: hunger; the twin the complementary atom', () => {
    const set = STRESS_SUMMARY_SIBLINGS[FOOD];
    expect(set[0]).toEqual({ text: FOOD, crisis: ['hunger'] });
    expect(set[1]).toEqual({ text: FED, twinOf: FOOD, excludes: ['crisis: hunger'] });
  });
});

describe('the instrument: "Food Secure" under a fed influx is true (R-P 1, mirror maintenance)', () => {
  it('reads no crisis-blind finding for Food Secure under mass migration alone', () => {
    expect(crisisBlindFindings(recordOf(['mass_migration'], 'secure'), { economics: 'Food Secure: the stores hold.' })).toEqual([]);
  });
  it('still reads Food Secure under a famine (the hunger row stays)', () => {
    const f = crisisBlindFindings(recordOf(['famine'], 'famine'), { economics: 'Food Secure: the stores hold.' });
    expect(f.map((x) => x.claim)).toEqual(['food secure']);
  });
});
