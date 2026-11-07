/**
 * The criminal structure reads the block's own operations list and the running criminal chains
 * (lane RUNG1B-F9 unit 3, 2026-11-04; A-06 in reverse). Red on the base: soak1k-28 (Innissike,
 * city, siege) listed "Active criminal operations: Red Light District" and the Economics tab's
 * "Slave trade · Operational", then printed DS-DEF-4's "No criminal infrastructure has been
 * identified at Innissike"; the soak's coh:crime-denied-and-listed counted 2 of 60 at 64aeda874.
 */
import { describe, expect, it } from 'vitest';

import { deriveCriminalStructure, runningCriminalChains } from '../../src/domain/display/defenseDisplay.js';
import { criminalStructurePoolKey } from '../../src/domain/display/stateProse/defenseStateProse.js';

/** @param {Record<string, unknown>} economicState */
const place = (economicState) => ({ name: 'Innissike', institutions: [{ name: 'Red Light District', category: 'entertainment' }], powerStructure: { factions: [] }, economicState });

describe('the null answer is never read beside the list it sits under', () => {
  it('fixture premise: neither the name ladder nor the crime signal reads a Red Light District', () => {
    expect(deriveCriminalStructure(place({}))).toBeNull();
    expect(criminalStructurePoolKey(null)).toBe('structure null (nothing organized recognized)');
  });

  it('a listed criminal operation makes the structure semi-organized', () => {
    expect(deriveCriminalStructure(place({ safetyProfile: { criminalInstitutions: ['Red Light District'] } }))?.key).toBe('semi-organized');
  });

  it('a running criminal supply chain makes it semi-organized; an impaired one does not', () => {
    const chain = (status) => place({ activeChains: [{ needKey: 'criminal_economy', chainId: 'slave_trade', status }] });
    expect(deriveCriminalStructure(chain('operational'))?.key).toBe('semi-organized');
    expect(runningCriminalChains(chain('running'))).toHaveLength(1);
    expect(deriveCriminalStructure(chain('impaired'))).toBeNull();
    expect(deriveCriminalStructure(chain('vulnerable'))).toBeNull();
  });

  it('a stronger reading is never lowered', () => {
    const guild = { ...place({ safetyProfile: { criminalInstitutions: ['Red Light District'] } }), institutions: [{ name: "Thieves' Guild" }] };
    expect(deriveCriminalStructure(guild)?.key).toBe('organized');
  });
});
