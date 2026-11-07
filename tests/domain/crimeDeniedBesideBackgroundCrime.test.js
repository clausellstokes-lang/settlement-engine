/**
 * RUNG-2 LANDING phase E, R-E1 (the chair's ruling on phase D's question 1): the denial prints
 * again beside a pattern whose own text denies organisation. Phase D's R-D2 silenced DS-DEF-4's
 * "No criminal infrastructure has been identified" wherever the Defense block lists a crime
 * pattern; in 8 of the 1,000 the only pattern is "Background crime" ("… No single dominant
 * organisation: …"), and there the denial is true. The denial prints where the block lists no
 * crime the denial contradicts: no operation, no running criminal chain, and no pattern but those
 * whose own text denies organisation (`patternDeniesOrganisation`). soak1k-1801's conversion
 * patterns keep it silent.
 */
import { describe, expect, it } from 'vitest';

import { blockListsCrime, deriveCriminalStructure } from '../../src/domain/display/defenseDisplay.js';
import { buildPrintProse } from '../../src/domain/display/stateProse/printProse.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { bootHarness, renderSurfaces } from '../../scripts/audit/soak-review/renderHarness.mjs';

/** @param {Record<string, unknown>} safetyProfile */
const place = (safetyProfile) => ({ name: 'Drumburn', tier: 'village', institutions: [], powerStructure: { factions: [] }, economicState: { safetyProfile } });
const BACKGROUND = { type: 'Background crime', desc: 'Petty theft, minor fraud, and opportunistic violence are persistent. No single dominant organisation: just the steady pressure of too many people with too little, and too few consequences for taking.' };
const SURVIVAL_NO_NETWORK = { type: 'Survival crime', desc: 'Theft driven by economic desperation rather than organization. No criminal infrastructure: just too many people with too little, doing what they must to survive.' };
const SURVIVAL_NETWORK = { type: 'Survival crime', desc: 'Hunger-driven theft of food, livestock, and stored goods. Enforcement struggles to distinguish survival crime from organised theft.' };
const FRAUD = { type: 'religious fraud', desc: 'False conversion declarations sold or arranged for a fee.' };
const DENIAL = /No criminal infrastructure has been identified|goes wrong one thing at a time and belongs to whoever did it|met with genuine incomprehension|No organized criminal infrastructure detected/;

describe('R-E1: the denial prints beside a pattern that itself denies organisation', () => {
  it('the predicate: only organisation-denying patterns list no crime; any other pattern, operation or chain does', () => {
    expect(blockListsCrime(place({ crimeTypes: [BACKGROUND] }))).toBe(false);
    expect(blockListsCrime(place({ crimeTypes: [SURVIVAL_NO_NETWORK] }))).toBe(false);
    expect(blockListsCrime(place({ crimeTypes: [BACKGROUND, SURVIVAL_NO_NETWORK] }))).toBe(false);
    expect(blockListsCrime(place({ crimeTypes: [SURVIVAL_NETWORK] }))).toBe(true);
    expect(blockListsCrime(place({ crimeTypes: [BACKGROUND, FRAUD] }))).toBe(true);
    expect(blockListsCrime(place({ crimeTypes: [BACKGROUND], criminalInstitutions: ['Gambling Den'] }))).toBe(true);
  });

  it('soak1k-362 (Background crime alone): the Defense tab and the print chapter print the denial', async () => {
    await ensureLaws();
    const s = birth(362).settlement;
    expect((s.economicState.safetyProfile.crimeTypes || []).map((c) => c.type)).toEqual(['Background crime']);
    expect(deriveCriminalStructure(s)).toBeNull();
    const r = renderSurfaces(await bootHarness(), s);
    expect(r.tabs.defense).toMatch(/Active crime patterns\s*\n\s*Background crime/);
    expect(r.tabs.defense).toMatch(DENIAL);
    expect(buildPrintProse(s).defense?.['defense.criminalStructure'] ?? '').toMatch(DENIAL);
  }, 120_000);

  it('soak1k-1801 (a conversion\'s patterns): still no denial', async () => {
    await ensureLaws();
    const s = birth(1801).settlement;
    const r = renderSurfaces(await bootHarness(), s);
    expect(r.tabs.defense).toMatch(/Active crime patterns/);
    expect(r.tabs.defense).not.toMatch(DENIAL); // anchored: the patterns line is matched in this same tab on the line above
    expect(Object.keys(buildPrintProse(s).defense || {}).length, 'the print chapter\'s defence prose was built').toBeGreaterThan(0);
    expect(buildPrintProse(s).defense?.['defense.criminalStructure'] ?? '').not.toMatch(DENIAL); // anchored: the line above proves the defence prose is built for this record
  }, 120_000);
});
