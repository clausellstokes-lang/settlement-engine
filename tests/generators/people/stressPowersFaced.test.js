/**
 * stressPowersFaced.test.js — COHERENCE-POWERS item 3's guard, written first (the chair's ruling of 2026-11-12 on the
 * second seat's item 0 STOP): every power on the page has a person, or its declared leaderless line.
 *
 * The rule, in order: (0) where the town has a house the stress power sits in by its nature, its face is a person of
 * that house (the head, or the next house where the head already leads another power); (a) else the stress's own
 * cast figure, never a fabricated citizen; (b) else, where the power by its nature has no single voice, it is
 * DECLARED leaderless and the page says so in one declared line; (c) else it is not built. An appointed power (an
 * occupation authority) wears one hat: the occupier's man. A clandestine power's face is veiled. A criminal power
 * with no house of its own (a small place's protection operation) has its master, veiled.
 *
 * Births go through birthConfig with the browser's dials; the stressed seeds force their stress
 * (`selectedStresses: [stress], selectedStressesRandom: false`). RED FIRST at fbbaa82e6: every seed below carries a
 * power with no one on the page (the second seat's item 0 table). Read-only over the record: no new key is read.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { nameOf } from '../../../src/domain/rulingPower.js';
import { leaderlessLineOf, stressPowerRowOf } from '../../../src/domain/people/stressPowerFaces.js';

const DIALS = Object.freeze({
  tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
  magicExists: true, contentProfile: 'grounded',
});

/** Seeds from the second seat's corpus, each with a power that had no one on the page at fbbaa82e6. */
const SEEDS = Object.freeze([
  'l2-under_siege-hamlet-0', 'l2-under_siege-village-2', 'l2-wartime-village-2', 'critique-village-43', // War Council
  'l2-occupied-village-0', 'l2-occupied-hamlet-19', // Occupation Authority
  'l2-occupied-town-15', 'l2-occupied-village-18', // Resistance Network
  'l2-plague_onset-village-5', 'l2-plague_onset-hamlet-1', // Quarantine Council
  'l2-religious_conversion-hamlet-3', 'critique-town-46', // Reform Congregation
  'l2-religious_conversion-hamlet-2', // New Faith Community
  'l2-religious_conversion-town-8', // Conversion Enforcement Office
  'l2-insurgency-village-0', 'critique-village-9', // People's Council
  'l2-succession_void-town-17', 'critique-city-17', // The Peerage, The Highborn Circle
  'l2-famine-village-7', // Grain Holders, the strongest power of its town
  'l2-monster_pressure-village-11', // Monster Hunters / Adventurers
  'l2-famine-hamlet-6', 'l2-insurgency-hamlet-12', // the Thieves' Guild with no house
  // COHERENCE-POWERS-3, REVIEW-POWERS F5: the Resistance Network's members dealt by a house's share, unveiled at 1a32c200a
  'rvf-occupied-city-1', 'rvw-town-63', 'rvf-occupied-metropolis-0', 'rvf-occupied-metropolis-1', 'rvf-occupied-metropolis-2',
  'rvf-occupied-metropolis-4', 'rvf-occupied-metropolis-7',
  // COHERENCE-POWERS-3, REVIEW-POWERS F4: a power with neither a member nor a line at 1a32c200a (the noble blocs; a
  // Thieves' Guild whose one backer bears no face)
  'rvw-city-31', 'rvw-metropolis-81', 'rvf-plague_onset-town-3',
  // COHERENCE-POWERS-3, REVIEW-POWERS F6: a crisis power led by a face that leads another power, dealt by a house's share
  'rvw-hamlet-23', 'rvf-famine-village-5', 'rvf-famine-town-1', 'rvf-famine-metropolis-0',
]);

/** @param {string} seed */
function configOf(seed) {
  const m = /^(?:l2|rvf)-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  if (m) return { ...DIALS, settType: m[2], selectedStresses: [m[1]], selectedStressesRandom: false };
  if (/^rvw-/.test(seed)) return { ...DIALS, settType: seed.split('-')[1] };
  return { ...DIALS, settType: seed.split('-')[1] };
}

/** @type {Map<string, any>} */
const births = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SEEDS) births.set(seed, generateSettlementPipeline(birthConfig(configOf(seed)), null, { seed, customContent: {} }));
}, 300_000);

/** @param {any} s @param {string} power */
const membersOf = (s, power) => (s.npcs || []).filter((card) => (card.memberships || []).some((m) => m.power === power));
/** @param {any} s @param {string} power */
const firstOf = (s, power) => (s.npcs || []).find((card) => (card.memberships || []).some((m) => m.power === power && m.rank === 1));

describe('COHERENCE-POWERS item 3 guard — every power has a person, or its declared leaderless line', () => {
  it('no power on the page has neither a member nor a declared leaderless line', () => {
    const misses = [];
    for (const seed of SEEDS) {
      const s = births.get(seed);
      for (const f of s.powerStructure.factions) {
        const power = nameOf(f);
        if (membersOf(s, power).length) continue;
        if (!leaderlessLineOf(s, power)) misses.push(`${seed}: ${power}`);
      }
    }
    expect(misses).toEqual([]);
  });

  // COHERENCE-POWERS-3 (F6): by whichever path the face was dealt (the rule's seat or a house's own share)
  it('a stress power\'s first leads no other power of the town', () => {
    const misses = [];
    for (const seed of SEEDS) {
      const s = births.get(seed);
      for (const f of s.powerStructure.factions) {
        const power = nameOf(f);
        if (!stressPowerRowOf(s, f)) continue;
        const first = firstOf(s, power);
        if (!first || first.institution?.kind !== 'house') continue;
        const other = (first.memberships || []).find((m) => m.rank === 1 && m.power !== power);
        if (other) misses.push(`${seed}: ${first.name} leads ${power} and ${other.power}`);
      }
    }
    expect(misses).toEqual([]);
  });

  it('an appointed power is faced by a person sent in, not a house of the town', () => {
    const misses = [];
    for (const seed of SEEDS) {
      const s = births.get(seed);
      for (const f of s.powerStructure.factions) {
        const row = stressPowerRowOf(s, f);
        if (!row?.appointed) continue;
        const first = firstOf(s, nameOf(f));
        if (!first || first.institution?.kind !== 'power') misses.push(`${seed}: ${nameOf(f)} is faced by ${first ? first.name : 'no one'}`);
      }
    }
    expect(misses).toEqual([]);
  });

  it('a clandestine or criminal power\'s face is veiled', () => {
    const misses = [];
    for (const seed of SEEDS) {
      const s = births.get(seed);
      for (const f of s.powerStructure.factions) {
        const row = stressPowerRowOf(s, f);
        if (!row?.veiled) continue;
        for (const card of membersOf(s, nameOf(f))) {
          const m = card.memberships.find((x) => x.power === nameOf(f));
          if (!m.veiled) misses.push(`${seed}: ${card.name} in ${nameOf(f)}`);
        }
      }
    }
    expect(misses).toEqual([]);
  });
});
