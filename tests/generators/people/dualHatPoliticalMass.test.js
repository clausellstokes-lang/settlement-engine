/**
 * dualHatPoliticalMass.test.js — COHERENCE-POWERS-3, F1 (REVIEW-POWERS-1a32c200a-2026-11-12): THE DUAL HAT DOES NOT
 * SHRINK A PLACE'S POLITICAL MASS. The density law's seat ceiling reads the cast's size (steps/assembleSettlement.js,
 * `massOverride`; density/densityRoll.js, the faction ceiling). One person with two hats is one card, so before this
 * cure a thorp with two cards had one, its roster one seat, and the power that stood beside the elders left the page,
 * in eight of the reviewer's nineteen cases the crisis's own (an occupation with no occupier on the page, a revolt with
 * no revolt). The ceiling's input counts the leader's office and the leader's house as two, as before the dual hat.
 *
 * RED FIRST at the merged start e17edb8ee: the eight births below each lost the named power (the review's table).
 * Births go through the browser's create boundary (birthConfig). The expected powers are literals, never computed.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { seatFacesFoldedByDualHat } from '../../../src/generators/people/representatives.js';

/** The browser's dials (the charters' §0.4). */
const DIALS = Object.freeze({
  tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
  magicExists: true, contentProfile: 'grounded',
});

/** The reviewer's eight: [seed, size, the forced crisis or null, the power that must stand]. */
const CASES = Object.freeze([
  ['rvf-occupied-thorp-6', 'thorp', 'occupied', 'Occupation Authority'],
  ['rvf-occupied-hamlet-5', 'hamlet', 'occupied', 'Occupation Authority'],
  ['rvf-slave_revolt-thorp-5', 'thorp', 'slave_revolt', 'Revolt Leadership'],
  ['rvf-wartime-thorp-2', 'thorp', 'wartime', 'War Council'],
  ['rvf-famine-thorp-0', 'thorp', 'famine', 'Grain Holders'],
  ['rvw-thorp-86', 'thorp', null, 'The Highborn Circle'],
  ['rvw-hamlet-66', 'hamlet', null, 'Monster Hunters / Adventurers'],
  ['rvf-politically_fractured-hamlet-3', 'hamlet', 'politically_fractured', 'The Independent Bloc'],
]);

beforeAll(async () => { await loadGenerationLawPayloads(); });

describe('COHERENCE-POWERS-3 F1 — the dual hat does not shrink a place\'s political mass', () => {
  it('a small place keeps the power the fold of the office\'s face into the leader\'s house cut', () => {
    const misses = [];
    for (const [seed, settType, stress, power] of CASES) {
      const config = stress ? { ...DIALS, settType, selectedStresses: [stress], selectedStressesRandom: false } : { ...DIALS, settType };
      const s = generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
      const roster = (s.powerStructure?.factions || []).map((f) => f.faction);
      if (!roster.includes(power)) misses.push(`${seed}: ${power} is not on the page (${roster.join(', ')})`);
    }
    expect(misses).toEqual([]);
  }, 120_000);

  it('the office and the house count as two where the cast folded them, once where it did not', () => {
    const institutions = [{ name: 'Mayor and council', category: 'Government' }, { name: 'Mills (2-5)', category: 'Economy' }];
    const ruled = (government, npcs) => ({ institutions, npcs, powerStructure: { factions: [{ faction: government, category: 'government', power: 100, isGoverning: true }] } });
    const miller = { id: 'npc_mills_2_5', institution: { kind: 'house', key: 'Mills (2-5)' } };
    const mayor = { id: 'npc_mayor_and_council', institution: { kind: 'house', key: 'Mayor and council' } };
    // born under the dual hat: the miller leads and the seat's house bears no face
    expect(seatFacesFoldedByDualHat(ruled('Town Council', [miller]))).toBe(1);
    // a cast that carries the seat's own face (a save from before the dual hat, a held roster) folded nothing
    expect(seatFacesFoldedByDualHat(ruled('Town Council', [mayor, miller]))).toBe(0);
    // a government that sends its own man wears one hat: nothing folded
    expect(seatFacesFoldedByDualHat(ruled('Feudal Stewardship', [miller]))).toBe(0);
  });
});
