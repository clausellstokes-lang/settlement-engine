/**
 * nobleFaces.test.js — COHERENCE-POWERS-6 (item 1; THE CHAIR'S RULING OF 2026-11-13, standing): A NOBLE POWER IS FACED BY A
 * NOBLE, in every town and not only under a succession. A noble power that does not govern is faced by the head of a landed
 * house on the roster where there is one (a face of the lord's own house, the steward's family, the lord's reeve or the
 * royal seat, whose largest loyalty lands on that body), and otherwise by a lord of that body, minted and named, who is
 * styled a claimant only where the power itself claims. The face reads at that body's standing (a lord of a Dominant or
 * Strong body high, a Significant or Minor one moderate, a Suppressed one low), never below; a minted claimant reads at the
 * band of the seat it claims (an Elder's below the village, a Mayor's above).
 *
 * Before the cure, at e969a75b7 on the lane's corpora (R 1,845 with the golden's 525; S 2,460): 856 noble powers that do
 * not govern faced by a miller (313 + 38 + 23), a college master, an impresario, a mine captain, a theatre manager, a
 * peat-reeve or no one (53 in succession births); 124 of 124 minted claimants of the old families' bodies at low influence.
 *
 * Births through birthConfig with the browser's dials, on the review's seeds and on fresh ones (`pfu-*`) this seat did not
 * tune on; every expected word a literal.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { isVeiledPower } from '../../../src/domain/people/cardVeil.js';
import { rulingChainOf } from '../../../src/domain/dossier/powerStrata.js';
import { backingArchetypeOf } from '../../../src/domain/dossier/powerSupport.js';
import { stressPowerRowOf } from '../../../src/domain/people/stressPowerFaces.js';
import { governingFactionOf, nameOf } from '../../../src/domain/rulingPower.js';

const DIALS = Object.freeze({
  tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
  magicExists: true, contentProfile: 'grounded',
});
const TIERS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
/** @param {string} settType @param {string} seed @param {string | null} [stress] */
const born = (settType, seed, stress = null) => generateSettlementPipeline(birthConfig({ ...DIALS, settType,
  ...(stress ? { selectedStresses: [stress], selectedStressesRandom: false } : {}) }), null, { seed, customContent: {} });

/** The landed houses' faces (the lord's own house on the roster), literals. */
const LANDED_FACES = Object.freeze(['the steward', "the lord's appointee", 'the governor', 'the reeve', 'the monarch']);
/** The body's standing as the page prints it -> the least band its face reads at, literals. */
const STANDING_BAND = Object.freeze({ Dominant: 'high', Strong: 'high', Significant: 'moderate', Minor: 'moderate', Suppressed: 'low' });
const ORDER = Object.freeze({ low: 0, moderate: 1, high: 2 });
/** The seat a claimant claims: an Elder below the village (low), a Mayor or Governor above (high), literals. */
const SEAT_BAND = Object.freeze({ thorp: 'low', hamlet: 'low', village: 'high', town: 'high', city: 'high', metropolis: 'high' });

/** @param {any} s @param {string} power */
const firstOf = (s, power) => (s.npcs || []).find((c) => (c.memberships || []).some((m) => m.power === power && m.rank === 1)) || null;

/** Every miss of the rule in one birth, as a line. @param {any} s @param {string} key */
function missesOf(s, key) {
  const out = [];
  const governing = nameOf(governingFactionOf(s));
  const seat = rulingChainOf(s);
  const seatWords = `${seat.absence?.line || ''} ${(seat.absence?.claimants || []).join(' ')}`;
  for (const f of s.powerStructure?.factions || []) {
    const power = nameOf(f);
    if (!power || power === governing || backingArchetypeOf(f) !== 'noble' || isVeiledPower(f)) continue;
    const row = stressPowerRowOf(s, f);
    const first = firstOf(s, power);
    if (!first) { out.push(`${key}: ${power} has no one on the page`); continue; }
    const minted = first.institution?.kind === 'power' && first.institution?.key === power;
    if (minted && first.title !== 'the lord') out.push(`${key}: ${power}'s minted face is "${first.title}"`);
    if (!minted && !LANDED_FACES.includes(first.title)) out.push(`${key}: ${power} is faced by ${first.name}, ${first.title} (${first.institution?.key})`);
    const least = row?.claimant && minted ? SEAT_BAND[s.tier] : STANDING_BAND[f.powerLabel];
    if (least && !(ORDER[first.influence] >= ORDER[least])) out.push(`${key}: ${power} (${f.powerLabel}) is faced at ${first.influence}, below ${least}`);
    // styled a claimant only where the power itself claims
    if (minted && !row?.claimant && !/claimant/i.test(power) && seatWords.includes(first.name)) out.push(`${key}: ${first.name} of ${power} is named a claimant`);
  }
  return out;
}

beforeAll(async () => { await loadGenerationLawPayloads(); });

describe('COHERENCE-POWERS-6 item 1: a noble power is faced by a noble', () => {
  it('the review\'s towns and the lane\'s: no miller, college master, impresario or mine captain heads a noble body', () => {
    const towns = [
      ['town', 'rvw-town-4', null], ['city', 'rvw-city-32', null], ['metropolis', 'rvw-metropolis-0', null],
      ['city', 'rvw-city-72', null], ['city', 'rvw-city-20', null], ['metropolis', 'rvw-metropolis-4', null],
      ['city', 'l2-politically_fractured-city-7', 'politically_fractured'], ['city', 'l2-succession_void-city-7', 'succession_void'],
      ['metropolis', 'l2-succession_void-metropolis-15', 'succession_void'], ['village', 'l2-plague_onset-village-1', 'plague_onset'],
    ];
    const misses = towns.flatMap(([t, seed, st]) => missesOf(born(t, seed, st), seed));
    expect(misses).toEqual([]);
  });

  it('the face of the lord\'s own house stays where its largest loyalty lands (the governor of Noble Families, rvw-city-20)', () => {
    const s = born('city', 'rvw-city-20');
    const first = firstOf(s, 'Noble Families');
    expect(first?.title).toBe('the governor');
    expect(firstOf(s, 'The Old Houses')?.title).toBe('the lord');
  });

  it('on fresh births at every size, calm and in crisis: every noble body is faced by a noble at its standing', () => {
    const misses = [];
    for (const t of TIERS) {
      for (let i = 0; i < 5; i += 1) misses.push(...missesOf(born(t, `pfu-${t}-${i}`), `pfu-${t}-${i}`));
      for (const st of ['succession_void', 'politically_fractured', 'indebted', 'insurgency']) {
        for (let i = 0; i < 2; i += 1) misses.push(...missesOf(born(t, `pfu-${st}-${t}-${i}`, st), `pfu-${st}-${t}-${i}`));
      }
    }
    expect(misses).toEqual([]);
  }, 300000);
});
