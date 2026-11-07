/**
 * tests/domain/facts/defence.test.js — CENSUS-1 wave 0, fact 3: THE DEFENCE-PRESENCE HOME.
 *
 * RED-FIRST. (1) The safety profile read the walls / watch / garrison / gate flags off the RAW
 * roster by substring (`priorityHelpers.js :: getInstitutionNames`), so a ruined town watch still
 * "managed quarantine compliance". (2) Hook-truth's `hasWatch` meant "a watch OR a militia": one
 * answer for two atoms. Both arms were red at the window tip through the public functions.
 *
 * CENSUS-1 withdrew two re-points under the old byte-identity law: the militia flag (the two
 * readers disagree on 130 of soak1k-0..1999; soak1k-18's record moves) and DS-GEN-17's
 * PROVISIONED hospital read (4 of 2,000 pages move PROVISIONED → BARE). The chair ruled both
 * made (CENSUS-1b unit A); their red-firsts live in `declaredMoves.test.js`.
 *
 * @enforced-by npx vitest run tests/domain/facts/defence.test.js
 */
import { describe, expect, it } from 'vitest';
import { generateSafetyProfile } from '../../../src/generators/safetyProfile.js';
import { settlementHookFacts, hookTruthViolations } from '../../../src/domain/coherence/hookTruth.js';

const PLAGUE = { stressTypes: ['plague_onset'], monsterThreat: 'civilized' };

describe('the defence-presence home (CENSUS-1 fact 3)', () => {
  it('RED-FIRST: a ruined watch does not manage the quarantine', () => {
    const live = [{ name: 'Town watch', category: 'Defense' }];
    expect(JSON.stringify(generateSafetyProfile(PLAGUE, 'town', live))).toContain('The watch manages quarantine compliance');
    const ruined = [{ name: 'Town watch', category: 'Defense', status: 'ruined' }];
    const text = JSON.stringify(generateSafetyProfile(PLAGUE, 'town', ruined));
    // anchored: the same profile prints the line for the live watch above; only the ruin differs
    expect(text).not.toContain('The watch manages quarantine compliance');
  });

  it('RED-FIRST: watch and militia are two atoms, and the watch word is still licensed by either', () => {
    const militiaOnly = { tier: 'village', institutions: [{ name: 'Citizen militia', category: 'Defense' }], defenseProfile: { institutions: {} } };
    const facts = settlementHookFacts(militiaOnly);
    expect(facts.hasWatch).toBe(false);
    expect(facts.hasMilitia).toBe(true);
    expect(hookTruthViolations('The watch looks the other way.', facts).map((v) => v.code ?? v.rule ?? v)).not.toContainEqual(expect.stringContaining('watch_without'));
  });

  it('the one reader names one meaning per atom', async () => {
    const { defenceOf } = await import('../../../src/domain/facts/defence.js');
    const palisade = defenceOf({ institutions: [{ name: 'Palisade', category: 'Defense' }] });
    expect(palisade).toMatchObject({ walls: true, palisade: true, gate: false });
    const monastery = defenceOf({ institutions: [{ name: 'Monastery or friary', category: 'Religious' }] });
    expect(monastery.hospital).toBe(false);
    const ruinedWalls = defenceOf({ institutions: [{ name: 'Town walls', category: 'Defense', status: 'ruined' }] });
    expect(ruinedWalls.walls).toBe(false);
  });
});
