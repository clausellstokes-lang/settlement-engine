/**
 * The Disasters & Famine row reads the one food record (lane RUNG1B-F9 unit 1, 2026-11-04).
 * Red on the base: soak1k-3 (Al-karez, town, famine) printed "Food Security Deficit — active
 * famine" on the Overview and "Disasters & Famine: Adequate" on the Defense tab; the soak's
 * coh:grade-vs-food counted 3 of 60 at 64aeda874.
 */
import { describe, expect, it } from 'vitest';

import {
  buildThreatAssessment, disasterReadinessScore, FAMINE_DISASTER_CEILING, FAMINE_SENTENCE,
} from '../../src/domain/display/threatAssessment.js';
import { deriveDefenseReadiness } from '../../src/domain/display/defenseDisplay.js';
import { scoreBand } from '../../src/domain/display/defenseScoreBands.js';

/** @param {string} band @param {Record<string, unknown>} [record] */
const place = (band, record = {}) => ({
  name: 'Al-karez',
  tier: 'town',
  defenseProfile: { scores: { disaster: 55, economic: 50 } },
  economicState: { foodSecurity: { foodRecord: { band, storageMonths: 7, hasGranary: true, ...record } } },
});

const disasterRow = (s) => buildThreatAssessment(s).find((row) => row.label === 'Disasters & Famine');

describe('Disasters & Famine under an active famine', () => {
  it('holds the grade to Weak at most, on the tab and in the PDF readiness rows alike', () => {
    const s = place('famine');
    expect(disasterReadinessScore(s)).toBe(FAMINE_DISASTER_CEILING);
    expect(scoreBand(disasterReadinessScore(s))).toBe('WEAK');
    const row = deriveDefenseReadiness(s).find((x) => x.label === 'Disasters & Famine');
    expect(row?.status).toBe('WEAK');
  });

  it('keeps a grade already below the ceiling where it is', () => {
    const s = place('famine');
    s.defenseProfile.scores.disaster = 12;
    expect(disasterReadinessScore(s)).toBe(12);
  });

  it('names the famine first, and nothing in store (the stores are the Food endurance line\'s)', () => {
    const assess = disasterRow(place('famine'))?.assess || '';
    expect(assess.startsWith(`${FAMINE_SENTENCE} `)).toBe(true);
    expect(assess).not.toMatch(/\bgranar(?:y|ies)\b|\bstores?\b|\bput by\b|\bmonths?\b|\d/i); // anchored: the line above proves assess opens with the famine sentence
  });
});

describe('Disasters & Famine without an active famine', () => {
  it('changes nothing: a plain Deficit with a full granary may stay Adequate', () => {
    const s = place('deficit');
    expect(disasterReadinessScore(s)).toBe(55);
    expect(scoreBand(disasterReadinessScore(s))).toBe('ADEQUATE');
    expect(disasterRow(s)?.assess).toMatch(/\S/);
    expect(disasterRow(s)?.assess).not.toMatch(/famine/i); // anchored: the line above proves the row's assess is live text
  });
});
