/**
 * "NO CRIMINAL INFRASTRUCTURE" NEVER PRINTS BESIDE A CRIMINAL NETWORK (lane RUNG1-TRUTH unit C,
 * 2026-11-04; docs/SOAK_1000_RUNG1_2026-11-04.md §2 row 16, A-06; the chair's ruling C).
 *
 * The safety profile's survival-crime line read "Theft driven by economic desperation rather than
 * organization. No criminal infrastructure: …" in places whose roster carries a criminal
 * institution (64 of rung 1's 94 A-06 places at this base). Where the record carries a criminal
 * network (a CRIMINAL-category institution, the Institutions tab's own mark,
 * `roleCategory.js :: institutionCategoryFlags`), the entry prints the pool's existing
 * "desperation theft" line instead; where no network exists the line is unchanged.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { generateSafetyProfile } from '../../src/generators/safetyProfile.js';

const CLAUSE = /No criminal infrastructure/;
const DESPERATION = 'Hunger-driven theft of food, livestock, and stored goods. Enforcement struggles to distinguish survival crime from organised theft.';
// A poor, crime-heavy town: criminalEffective >= 48 and economy < 35, the survival-crime gate.
const POOR = { priorityCriminal: 90, priorityEconomy: 20, priorityMilitary: 20 };
const survival = (profile) => profile.crimeTypes.find((c) => c.type === 'Survival crime');

describe('the survival-crime line reads the criminal network', () => {
  it("a town with a thieves' guild chapter prints the pool's desperation-theft line", () => {
    const profile = generateSafetyProfile(POOR, 'town', [{ name: "Thieves' guild chapter", category: 'Criminal' }]);
    expect(survival(profile)?.desc).toBe(DESPERATION);
    expect(profile.crimeTypes.map((c) => c.desc).join(' ')).not.toMatch(CLAUSE); // anchored: the line above pins the survival row's desc, so the crime list is live
  });

  it('a town with no criminal institution keeps the clause', () => {
    const profile = generateSafetyProfile(POOR, 'town', [{ name: 'Parish church', category: 'Religious' }]);
    expect(survival(profile)?.desc).toMatch(CLAUSE);
  });

  it('famine beside a network prints the desperation line once, not twice', () => {
    const profile = generateSafetyProfile({ ...POOR, stressTypes: ['famine'] }, 'town', [{ name: "Thieves' guild chapter", category: 'Criminal' }]);
    expect(profile.crimeTypes.filter((c) => c.desc === DESPERATION)).toHaveLength(1);
  });

  describe('on the corpus', () => {
    beforeAll(async () => { await ensureLaws(); });
    it('soak1k-136 (a city with a black market): no clause on the record', () => {
      const { settlement } = birth(136);
      const descs = settlement.economicState.safetyProfile.crimeTypes.map((c) => c.desc).join(' ');
      expect(descs.length).toBeGreaterThan(0);
      expect(descs).not.toMatch(CLAUSE); // anchored: the line above proves the crime descs are live
    });
  });
});
