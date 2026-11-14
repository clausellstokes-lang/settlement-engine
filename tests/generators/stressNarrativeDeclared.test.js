/**
 * The Crisis tab's stress narrative declares what it presumes (CENSUS-2c unit 1; the chair's
 * R-P 1). `stressNarrative.js :: RENDERERS` prints one paragraph per active stressor, rendered at
 * assembly once the name exists; a sentence that asserts a consequence the record may not hold
 * is a declared sibling set (`STRESS_SUMMARY_SIBLINGS`), resolved through `resolveSiblingSentences`
 * after the render, draw-free. With no facts (the provisional roll-time render) every sentence is
 * kept, byte-identical.
 * MERGE-R2 (2026-11-07, the chair's ruling 1, re-keyed with its cause): the integration merge composes
 * WIRING-W0's `direction` (the fourth parameter, R-W7 e) with this census's `facts`, which moves to
 * the FIFTH; every call here passes `undefined` for the direction (an arrivals record by default).
 */
import { describe, it, expect } from 'vitest';
import { renderStressSummary, STRESS_SUMMARY_SIBLINGS } from '../../src/generators/stressNarrative.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { crisisBlindFindings } from '../../src/domain/coherence/crisisBlindFindings.js';

// W4 PEOPLE second seat 2026-11-07: re-keyed to the summary's plain wording (the owner's style law; rows 43-48, 254-260)
const FOOD = 'Newcomers arrive faster than housing, food and work can be found for them.';
const FED = 'Newcomers arrive faster than housing and work can be found for them.';

/** a record under these stressors whose food record stands on `band` */
const recordOf = (types, band) => ({ stress: types.map((type) => ({ type })), economicState: { foodSecurity: { foodRecord: { band } } } });

describe('mass_migration: the food line needs hunger (R-P 1)', () => {
  it('a fed influx (the food record counts the influx and stays secure) prints the twin, not the food line', () => {
    const text = renderStressSummary('mass_migration', 'Avel', null, undefined, factsOf(recordOf(['mass_migration'], 'secure')));
    // anchored: the next two assertions pin the twin in the refused line's place and the paragraph's head
    expect(text).not.toContain(FOOD);
    expect(text).toContain(FED);
    expect(text.startsWith('Avel is taking in more people than it has houses or work for. ')).toBe(true);
  });
  it('an influx the record cannot feed (a deficit band) keeps the food line', () => {
    expect(renderStressSummary('mass_migration', 'Avel', null, undefined, factsOf(recordOf(['mass_migration'], 'deficit')))).toContain(FOOD);
  });
  it('an influx beside a famine keeps the food line (soak1k-30, -34; under the conjunction and the disjunction alike)', () => {
    expect(renderStressSummary('mass_migration', 'Avel', null, undefined, factsOf(recordOf(['famine', 'mass_migration'], 'famine')))).toContain(FOOD);
  });
  it('the provisional render (no facts) is byte-identical to the old paragraph', () => {
    expect(renderStressSummary('mass_migration', 'Avel', null)).toBe(`Avel is taking in more people than it has houses or work for. ${FOOD} The old residents and the new ones keep apart.`);
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

describe('plague_onset: "Healers are overwhelmed." needs a healer (CENSUS-2c unit 1b; Phase A ledger, R-G twin)', () => {
  const HEALERS = 'Healers are overwhelmed.';
  const TEND = 'The sick outnumber those who can tend them.';
  /** a record with a healer (an infirmary) on its roster, or none */
  const plagueRecord = (healer) => ({ ...recordOf(['plague_onset'], 'secure'), institutions: healer ? [{ name: 'Infirmary' }] : [{ name: 'Granary' }] });
  it('a place with no healer prints the twin', () => {
    const text = renderStressSummary('plague_onset', 'Avel', null, undefined, factsOf(plagueRecord(false)));
    // anchored: the next assertion pins the whole paragraph, the twin in the refused line's place
    expect(text).not.toContain(HEALERS);
    expect(text).toBe(`Something is spreading in Avel. It is not yet a plague, but it will be if nothing changes. ${TEND} The origin is disputed. Quarantine measures are being resisted.`);
  });
  it('a place with a healer keeps the line', () => {
    expect(renderStressSummary('plague_onset', 'Avel', null, undefined, factsOf(plagueRecord(true)))).toContain(HEALERS);
  });
  it('the sibling set: the original needs healer, the twin excludes it', () => {
    expect(STRESS_SUMMARY_SIBLINGS[HEALERS]).toEqual([{ text: HEALERS, needs: ['healer'] }, { text: TEND, twinOf: HEALERS, excludes: ['healer'] }]);
  });
});

describe('religious_conversion: the two variants that presume the old temple need it (CENSUS-2c unit 1c; Phase A ledger)', () => {
  /** names whose length % 3 picks variant 0, 1 and 2 */
  const N0 = 'Avelaa'; const N1 = 'Avelaaa'; const N2 = 'Avela';
  const convRecord = (temple) => ({ ...recordOf(['religious_conversion'], 'secure'), institutions: temple ? [{ name: 'Temple' }] : [{ name: 'Granary' }] });
  const V2 = (n) => `An outside authority is requiring ${n} to convert.`;
  it('with no temple, variants 0 and 1 resolve to variant 2 (the one that presumes no building)', () => {
    for (const n of [N0, N1]) expect(renderStressSummary('religious_conversion', n, null, undefined, factsOf(convRecord(false))).startsWith(V2(n))).toBe(true);
  });
  it('with a temple, each name keeps its own variant', () => {
    expect(renderStressSummary('religious_conversion', N0, null, undefined, factsOf(convRecord(true))).startsWith(`A new faith is gaining ground in ${N0}.`)).toBe(true);
    expect(renderStressSummary('religious_conversion', N1, null, undefined, factsOf(convRecord(true))).startsWith(`The religious community of ${N1} has fractured.`)).toBe(true);
    expect(renderStressSummary('religious_conversion', N2, null, undefined, factsOf(convRecord(false))).startsWith(V2(N2))).toBe(true);
  });
  it('with no facts (the provisional render) the name picks its variant, byte-identical', () => {
    expect(renderStressSummary('religious_conversion', N0, null).startsWith(`A new faith is gaining ground in ${N0}.`)).toBe(true);
    expect(renderStressSummary('religious_conversion', '', null).startsWith('A new faith is gaining ground in the settlement.')).toBe(true);
  });
});

describe('wartime (loss): "Food prices have doubled." needs hunger (CENSUS-2d unit 1; the chair\'s answer 1, R-U)', () => {
  const PRICES = 'Food prices have doubled.';
  const ROAD = 'The army has the carts and the road, and the fields are short of hands.';
  const loss = { profit: false };
  it('a war fought on a secure food record prints the twin in the refused line\'s place', () => {
    const text = renderStressSummary('wartime', 'Avel', loss, undefined, factsOf(recordOf(['wartime'], 'secure')));
    // anchored: the next assertion pins the whole paragraph, the twin in the refused line's place
    expect(text).not.toContain(PRICES);
    expect(text).toBe(`Avel is in a kingdom fighting a war it may not win. Conscription has taken a third of the working-age men. Supply caravans pass through on crown requisition. ${ROAD} The governing authority is demanding sacrifice while certain families are quietly thriving on contracts.`);
  });
  it('a war on a deficit keeps the price line (hunger on by the food record)', () => {
    expect(renderStressSummary('wartime', 'Avel', loss, undefined, factsOf(recordOf(['wartime'], 'deficit')))).toContain(PRICES);
  });
  it('the provisional render (no facts) keeps the old paragraph byte for byte', () => {
    expect(renderStressSummary('wartime', 'Avel', loss)).toContain(PRICES);
  });
  it('the sibling set: the original needs crisis: hunger, the twin excludes it', () => {
    expect(STRESS_SUMMARY_SIBLINGS[PRICES]).toEqual([{ text: PRICES, crisis: ['hunger'] }, { text: ROAD, twinOf: PRICES, excludes: ['crisis: hunger'] }]);
  });
});

describe('wartime (loss): no caravans pass through an isolated place (R2-CODE-B-6 item 0; the chair\'s ruling)', () => {
  const CARAVANS = 'Supply caravans pass through on crown requisition.';
  /** a war on a deficit food record, on the trade route `route` */
  const warOn = (route) => ({ ...recordOf(['wartime'], 'deficit'), config: { tradeRouteAccess: route } });
  it('an isolated place\'s loss text leaves the caravans sentence out (r2s-wartime-thorp-1, -hamlet-3)', () => {
    const text = renderStressSummary('wartime', 'Avel', { profit: false }, undefined, factsOf(warOn('isolated')));
    // anchored: the next assertion pins the whole paragraph, the clause left out and its neighbours joined by one space
    expect(text).not.toContain(CARAVANS);
    expect(text).toBe('Avel is in a kingdom fighting a war it may not win. Conscription has taken a third of the working-age men. Food prices have doubled. The governing authority is demanding sacrifice while certain families are quietly thriving on contracts.');
  });
  it('the profit coin refused in an isolated place resolves to the same loss text, without the caravans', () => {
    const text = renderStressSummary('wartime', 'Avel', { profit: true }, undefined, factsOf(warOn('isolated')));
    // anchored: the next assertion pins the paragraph's head, the loss text's
    expect(text).not.toContain(CARAVANS);
    expect(text.startsWith('Avel is in a kingdom fighting a war it may not win. Conscription has taken a third of the working-age men. Food prices have doubled.')).toBe(true);
  });
  it('the guard town: a place on a road keeps the caravans sentence', () => {
    for (const route of ['road', 'river', 'crossroads', 'port', 'mountain_pass']) {
      expect(renderStressSummary('wartime', 'Avel', { profit: false }, undefined, factsOf(warOn(route)))).toContain(CARAVANS);
    }
  });
  it('an unread record (no facts, or no route) keeps the sentence as it always read', () => {
    expect(renderStressSummary('wartime', 'Avel', { profit: false })).toContain(CARAVANS);
    expect(renderStressSummary('wartime', 'Avel', { profit: false }, undefined, factsOf(recordOf(['wartime'], 'deficit')))).toContain(CARAVANS);
  });
});

describe('slave_revolt: the summary presumes only slaves and a revolt (CENSUS-2d unit 1; the chair\'s answer 2, R-U)', () => {
  it('names no slave market (no fact home; listed under "needs a home")', () => {
    const text = renderStressSummary('slave_revolt', 'Avel', null, undefined, factsOf(recordOf(['slave_revolt'], 'secure')));
    // anchored: the next assertion pins the reworded paragraph whole
    expect(text).not.toMatch(/slave market/i);
    expect(text).toBe('The enslaved population of Avel has organised. What began as work stoppages and passive resistance has moved into open defiance. Whole work gangs have downed tools and will not take them up again. The governing authority\'s first response was inadequate. Its second response is still being decided.');
  });
});
