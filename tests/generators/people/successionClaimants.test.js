/**
 * successionClaimants.test.js — COHERENCE-POWERS-4 (REVIEW-POWERS F3; the chair's brief to the fourth seat): A CLAIMANT IS
 * THE SUCCESSION CRISIS'S OWN CAST. A power that is itself a claimant ("Noble Claimant (Senior Line)") is faced by that
 * claimant, minted and named as the occupier's governor is (the crisis's cast is derived after the powers' people, so it
 * never holds a claimant at the mint), and the seat row names the same persons. The declared leaderless line is not used
 * for it. The old families' body a succession pushes (The Peerage, The Highborn Circle) takes the next FREE rung of the
 * landed powers (a member of Noble Families, Noble Houses, Landed Gentry or Manor Household who leads no power) where one
 * stands, and keeps its declared line only where none does.
 *
 * Before the cure, on both corpora (R 1,845 with the golden's 525; S 2,460): 4 claimant powers with no one on the page
 * printing "No one claimant has stepped forward yet" under a seat row naming them claimants (R: rvf-succession_void-city-4
 * and -city-6, the review's two towns); 8 claimant powers faced by an unrelated house's face (a mine captain, a college
 * master); 9 old families' bodies printing their line while a free landed rung stood (R 1, S 8).
 *
 * Births through birthConfig with the browser's dials, on the review's and the second seat's own seeds; literals.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { rulingChainOf } from '../../../src/domain/dossier/powerStrata.js';
import { leaderlessLineOf, stressPowerRowOf } from '../../../src/domain/people/stressPowerFaces.js';

const DIALS = Object.freeze({
  tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
  magicExists: true, contentProfile: 'grounded',
});
const TIERS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
const LANDED = Object.freeze(['Noble Families', 'Noble Houses', 'Landed Gentry', 'Manor Household']);
const born = (settType, seed) => generateSettlementPipeline(
  birthConfig({ ...DIALS, settType, selectedStresses: ['succession_void'], selectedStressesRandom: false }), null, { seed, customContent: {} });

/** The old families' declared line (data/stressPowerFaces.js), a literal. */
const LINE = 'No one claimant has stepped forward yet: the old families press the claim together.';
/** @param {any} s @param {string} power */
const firstOf = (s, power) => (s.npcs || []).find((c) => (c.memberships || []).some((m) => m.power === power && m.rank === 1)) || null;
/** @param {any} c */
const leads = (c) => (c.memberships || []).some((m) => m.rank === 1);

/** Every miss of the rule in one birth, as a line. @param {any} s @param {string} key */
function missesOf(s, key) {
  const out = [];
  const factions = s.powerStructure?.factions || [];
  const claimants = factions.filter((f) => /claimant/i.test(f.faction || ''));
  const seat = rulingChainOf(s);
  const seatLine = seat.absence?.line || '';
  for (const f of claimants) {
    const first = firstOf(s, f.faction);
    if (!first) out.push(`${key}: ${f.faction} has no one on the page`);
    else if (first.institution?.kind !== 'power' || first.institution?.key !== f.faction) out.push(`${key}: ${f.faction} is faced by ${first.title} (${first.institution?.key})`);
    if (leaderlessLineOf(s, f.faction)) out.push(`${key}: ${f.faction} prints "${leaderlessLineOf(s, f.faction)}"`);
    if (first && !seatLine.includes(first.name)) out.push(`${key}: the seat row does not name ${first.name} (${seatLine})`);
  }
  const bodies = [];
  for (const f of factions) {
    const row = stressPowerRowOf(s, f);
    if (!row || row.stress !== 'succession_void' || /claimant/i.test(f.faction || '') || firstOf(s, f.faction)) continue;
    bodies.push(f);
    const free = (s.npcs || []).filter((c) => (c.memberships || []).some((m) => LANDED.includes(m.power)) && !leads(c));
    if (free.length) out.push(`${key}: ${f.faction} prints its line while ${free.map((c) => c.name).join(', ')} leads no power`);
  }
  // the leaderless line ONCE (the chair's ruling on the fourth seat's parked item 1): under the stronger body (power, then
  // roster order); every other faceless body points at it in its own declared line
  const stronger = bodies.reduce((best, f) => (!best || Number(f.power) > Number(best.power) ? f : best), null);
  for (const f of bodies) {
    const want = f === stronger ? LINE : `Presses the claim with ${stronger.faction}.`;
    if (leaderlessLineOf(s, f.faction) !== want) out.push(`${key}: ${f.faction} prints "${leaderlessLineOf(s, f.faction)}", not "${want}"`);
  }
  return out;
}

beforeAll(async () => { await loadGenerationLawPayloads(); });

describe('COHERENCE-POWERS-4 (F3) — a claimant is the succession crisis\'s own cast', () => {
  it('the review\'s two towns: each claimant is a minted person, printed by name on the seat row, never the leaderless line', () => {
    const misses = [];
    for (const key of ['rvf-succession_void-city-4', 'rvf-succession_void-city-6']) {
      const s = born('city', key);
      const claimants = (s.powerStructure?.factions || []).filter((f) => /claimant/i.test(f.faction || '')).map((f) => f.faction);
      expect(claimants).toEqual(['Noble Claimant (Senior Line)', 'Noble Claimant (Reform Line)']);
      for (const power of claimants) {
        const first = firstOf(s, power);
        if (!first || first.title !== 'the lord' || first.institution?.kind !== 'power') misses.push(`${key}: ${power} faced by ${first ? first.title : 'no one'}`);
      }
      misses.push(...missesOf(s, key));
    }
    expect(misses).toEqual([]);
  }, 120_000);

  it('the metropolises whose claimants a mine captain or a college master faced: the claimant faces them', () => {
    const misses = [];
    for (const key of ['rvf-succession_void-metropolis-3']) misses.push(...missesOf(born('metropolis', key), key));
    for (const key of ['l2-succession_void-metropolis-13', 'l2-succession_void-metropolis-18']) misses.push(...missesOf(born('metropolis', key), key));
    expect(misses).toEqual([]);
  }, 120_000);

  it('the old families\' body takes the next free landed rung where one stands (the review\'s town and the second seat\'s)', () => {
    const misses = [];
    for (const [tier, key] of [['metropolis', 'rvf-succession_void-metropolis-7'], ['metropolis', 'l2-succession_void-metropolis-11'],
      ['metropolis', 'l2-succession_void-metropolis-15'], ['town', 'l2-succession_void-town-17'], ['city', 'l2-succession_void-city-1'],
      ['city', 'l2-succession_void-city-10'], ['city', 'l2-succession_void-city-13']]) misses.push(...missesOf(born(tier, key), key));
    expect(misses).toEqual([]);
  }, 120_000);

  // The chair's ruling on the fourth seat's parked item 1 (2026-11-12): two old families' bodies with no free landed rung
  // printed the line twice on one Power tab (X-50, x50-trim-21, the generator's own corpus). It prints once, under the
  // stronger body; the other carries a declared line that points at it, never bare.
  it('two faceless bodies: the line prints once, under the stronger; the other presses the claim with it', () => {
    const s = generateSettlementPipeline({ settType: 'town', culture: 'mediterranean' }, null, { seed: 'x50-trim-21', customContent: {} });
    expect(leaderlessLineOf(s, 'The Highborn Circle')).toBe(LINE);
    expect(leaderlessLineOf(s, 'The Peerage')).toBe('Presses the claim with The Highborn Circle.');
    expect(missesOf(s, 'x50-trim-21')).toEqual([]);
  }, 120_000);

  it('on a corpus of succession births at every size, no claimant and no body breaks the rule', () => {
    const misses = [];
    for (const settType of TIERS) for (let i = 0; i < 6; i++) misses.push(...missesOf(born(settType, `claim-${settType}-${i}`), `claim-${settType}-${i}`));
    expect(misses).toEqual([]);
  }, 240_000);
});
