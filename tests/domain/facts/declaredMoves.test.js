/**
 * tests/domain/facts/declaredMoves.test.js — CENSUS-1b unit A: THE DECLARED-MOVE UNIT.
 *
 * CENSUS-1 measured four correct re-points and withdrew them under the old byte-identity law
 * (`docs/CENSUS_1_LANE_2026-11-04.md`, "What was NOT re-pointed", items 1, 2, 3 and 9). The
 * chair's ruling on CENSUS-1's questions 1 and 2: they are made now, each red-first, each counted
 * by cause — "the home's truth over the retired reader". The births each one moves are counted
 * in `docs/CENSUS_1B_LANE_2026-11-04.md`, never re-recorded.
 *
 * @enforced-by npx vitest run tests/domain/facts/declaredMoves.test.js
 */
import { describe, expect, it } from 'vitest';
import { generateSafetyProfile } from '../../../src/generators/safetyProfile.js';

const CALM = { monsterThreat: 'civilized' };

describe('unit A (a): the safety profile reads the militia atom from the home', () => {
  it('RED-FIRST: a ruined militia patrols nothing; a household levy is a militia', () => {
    const ruined = generateSafetyProfile(CALM, 'village', [{ name: 'Citizen militia', category: 'Defense', status: 'ruined' }]);
    expect(ruined.safetyDesc).not.toMatch(/militia/i);
    const levy = generateSafetyProfile(CALM, 'village', [{ name: 'Household levy', category: 'Defense' }]);
    expect(levy.safetyDesc).toMatch(/militia/i);
    const live = generateSafetyProfile(CALM, 'village', [{ name: 'Citizen militia', category: 'Defense' }]);
    expect(live.safetyDesc).toMatch(/militia/i);
  });
});
