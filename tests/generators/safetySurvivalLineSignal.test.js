/**
 * THE SURVIVAL LINE READS THE FINAL CRIME SIGNAL (lane RUNG1B-F4 unit 4, 2026-11-04;
 * docs/F4_CRIME_SIGNAL_2026-11-04.md §1, cause iii).
 *
 * The safety profile is born at the economy step, before the power roster exists, so its
 * survival-crime line printed "No criminal infrastructure: just too many people with too little"
 * beside a roster Thieves' Guild (soak1k-393, soak1k-248: two of A-06's 16). Assembly now settles
 * the line once, after the density law's trim, from the crime signal's one home
 * (`safetyProfile.js :: settleCrimeLinesToSignal`): the pool's desperation-theft line beside a
 * network, printed once, never twice; the clause where none exists; the entry's type kept.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { settleCrimeLinesToSignal } from '../../src/generators/safetyProfile.js';

const CLAUSE = /No criminal infrastructure/;
const DESPERATION = 'Hunger-driven theft of food, livestock, and stored goods. Enforcement struggles to distinguish survival crime from organised theft.';
const NO_NETWORK = 'Theft driven by economic desperation rather than organization. No criminal infrastructure: just too many people with too little, doing what they must to survive.';
const GUILD = { factions: [{ faction: "Thieves' Guild", category: 'criminal' }] };

describe('the survival line reads the final crime signal', () => {
  beforeAll(async () => { await ensureLaws(); });

  for (const i of [393, 248]) {
    it(`soak1k-${i}: beside a roster Thieves' Guild the survival line names no absence`, () => {
      const { settlement } = birth(i);
      expect(settlement.powerStructure.factions.some((f) => f.category === 'criminal')).toBe(true);
      const crimes = settlement.economicState.safetyProfile.crimeTypes;
      expect(crimes.find((c) => c.type === 'Survival crime')?.desc).toBe(DESPERATION);
      expect(crimes.map((c) => c.desc).join(' ')).not.toMatch(CLAUSE); // anchored: the line above pins the survival desc in this same list
      expect(crimes.filter((c) => c.desc === DESPERATION)).toHaveLength(1);
    });
  }

  it('beside a network under famine, the desperation-theft line is printed once', () => {
    const economicState = { safetyProfile: { crimeTypes: [
      { type: 'Survival crime', desc: NO_NETWORK }, { type: 'desperation theft', desc: DESPERATION },
    ] } };
    const settled = settleCrimeLinesToSignal(economicState, { seats: GUILD.factions, estate: [] });
    expect(settled.safetyProfile.crimeTypes).toEqual([{ type: 'Survival crime', desc: DESPERATION }]);
    expect(economicState.safetyProfile.crimeTypes).toHaveLength(2); // the input is not written
  });

  it('with no network the clause stays, and an unchanged profile is returned by reference', () => {
    const economicState = { safetyProfile: { crimeTypes: [{ type: 'Survival crime', desc: NO_NETWORK }] } };
    expect(settleCrimeLinesToSignal(economicState, { seats: [], estate: [] })).toBe(economicState);
  });
});
