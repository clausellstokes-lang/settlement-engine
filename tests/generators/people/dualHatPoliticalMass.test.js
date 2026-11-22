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
import { isCrisisOwnPower } from '../../../src/generators/density/applyDensityLaw.js';
import { STRESS_POWER_FACES } from '../../../src/data/stressPowerFaces.js';
import { membersByRank } from '../../../src/domain/people/membership.js';
import { leaderlessLineOf } from '../../../src/domain/people/stressPowerFaces.js';

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

  // U8 "THE CRISIS HAS A BODY" (the fortune lane's chair, E100, 2026-11-22): the same eight under the fortune law, on
  // its explicit arm. RED FIRST at 2689a1551: three thorps lost their crisis's power (slave_revolt-thorp-5 Revolt
  // Leadership, wartime-thorp-2 War Council, rvw-thorp-86 The Highborn Circle): the rival roll that alone seated it read
  // the lifted standing (measures/u8/DIAGNOSIS.md). The dark arm above is untouched.
  it('under the fortune law, a small place keeps the power its crisis names (U8: the crisis has a body)', () => {
    const misses = [];
    for (const [seed, settType, stress, power] of CASES) {
      const config = stress ? { ...DIALS, settType, selectedStresses: [stress], selectedStressesRandom: false } : { ...DIALS, settType };
      const s = generateSettlementPipeline({ ...birthConfig(config), _fortuneLawVersion: 2 }, null, { seed, customContent: {} });
      const roster = (s.powerStructure?.factions || []).map((f) => f.faction);
      if (!roster.includes(power)) misses.push(`${seed}: ${power} is not on the page (${roster.join(', ')})`);
    }
    expect(misses).toEqual([]);
  }, 120_000);

  // U8, THE PIN (c): under the fortune law every crisis a place states (its banner; the stability line names it) holds a
  // power of its own on the roster (applyDensityLaw.js :: isCrisisOwnPower), and that power its body in the cast: a card
  // of its own or its declared leaderless line (domain/people/stressPowerFaces.js :: leaderlessLineOf). RED FIRST at
  // 2689a1551: most small places in crisis held no power of it lit (measures/u8/crisis-body.mjs: 130 of 150 thorps). The
  // births are the measure's (`u8-<crisis>-<size>-<i>`, the crisis forced alone; the dials may add another), two a crisis
  // a size, on the law's explicit arm. Dark is not pinned: the rule is the fortune law's alone.
  it('under the fortune law, every crisis a place states has a power of its own on the roster and a body in the cast (U8)', () => {
    const crises = [...new Set(STRESS_POWER_FACES.map((row) => row.stress)), 'indebted', 'recently_betrayed', 'infiltrated', 'mass_migration', 'slave_revolt'];
    const faults = [];
    let stated = 0;
    for (const settType of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) for (const crisis of [...new Set(crises)]) for (const i of [0, 1]) {
      const seed = `u8-${crisis}-${settType}-${i}`;
      const config = { ...DIALS, settType, selectedStresses: [crisis], selectedStressesRandom: false };
      const s = generateSettlementPipeline({ ...birthConfig(config), _fortuneLawVersion: 2 }, null, { seed, customContent: {} });
      const factions = s.powerStructure?.factions || [];
      const types = [...new Set((Array.isArray(s.stress) ? s.stress : [s.stress]).map((x) => x?.type).filter(Boolean))];
      if (typeof s.powerStructure?.stability !== 'string') faults.push(`${seed}: no stability line`);
      for (const type of types) {
        stated += 1;
        const own = factions.filter((f) => isCrisisOwnPower(type, f));
        if (!own.length) { faults.push(`${seed}: ${type} is stated ("${s.powerStructure?.stability}") with no power of it (${factions.map((f) => f.faction).join(', ')})`); continue; }
        if (!own.some((f) => membersByRank(s.npcs || [], f.faction).length > 0 || leaderlessLineOf(s, f.faction) !== '')) faults.push(`${seed}: ${type}'s ${own.map((f) => f.faction).join(', ')} has no one on the page`);
      }
    }
    expect(faults).toEqual([]);
    expect(stated, 'anchored: the corpus states its crises (fifteen crises, six sizes, two seeds)').toBeGreaterThanOrEqual(180);
  }, 300_000);

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
