/**
 * seatKeeperContender.test.js — COHERENCE-POWERS-6 (item 2; THE CHAIR'S RULING OF 2026-11-13, vetoable by the owner): THE
 * KEEPER OF A VACANT SEAT HEADS NO CONTENDER. The lane already drops a keeper's memberships in the claimants' parties by
 * rule (castPowers.js :: keeperLeavesTheClaim); this is the same rule one step on: where a succession leaves the seat
 * empty, the governing power's first keeps it meanwhile and is first of no power the Power tab prints as contesting the
 * seat. The contender is headed by its own next person (a noble body by a noble: item 1), minted and named where the
 * roster has none.
 *
 * Before the cure, at the item-1 tree (e969a75b7 + item 1): 7 of 31 vacancies on the review's 720 and 25 of 194 on the
 * lane's 4,305 (Merchant Guilds 18, Landed Gentry 2, Noble Houses 2, Noble Families 2, Craft Guilds 1).
 *
 * Births through birthConfig with the browser's dials (the review's through DEFAULT_CONFIG, as the census births them),
 * on the review's seeds, the lane's and fresh ones (`pfu-*`); every expected word a literal.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { derivePowerStrata } from '../../../src/domain/dossier/powerStrata.js';
import { seatKeeperOf } from '../../../src/domain/people/seatKeeper.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';

const DIALS = Object.freeze({
  tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
  magicExists: true, contentProfile: 'grounded',
});
const TIERS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
const VOID = Object.freeze({ selectedStresses: ['succession_void'], selectedStressesRandom: false });
/** @param {string} settType @param {string} seed @param {boolean} [crisis] @param {boolean} [census] */
const born = (settType, seed, crisis = true, census = false) => generateSettlementPipeline(birthConfig({
  ...(census ? DEFAULT_CONFIG : {}), ...DIALS, settType, ...(crisis ? VOID : {}) }), null, { seed, customContent: {} });

/** The titles of the noble line and the lord's own houses' faces (item 1), literals. */
const NOBLE_FACES = Object.freeze(['the lord', 'the steward', "the lord's appointee", 'the governor', 'the reeve', 'the monarch']);
const NOBLE_BODIES = Object.freeze(['Noble Families', 'Noble Houses', 'Landed Gentry', 'Manor Household']);

/** @param {any} s @param {string} power */
const firstOf = (s, power) => (s.npcs || []).find((c) => (c.memberships || []).some((m) => m.power === power && m.rank === 1)) || null;

/** Every miss of the rule in one birth, as a line. @param {any} s @param {string} key */
function missesOf(s, key) {
  const keeper = seatKeeperOf(s);
  if (!keeper) return [];
  const out = [];
  for (const p of derivePowerStrata(s).powers.filter((x) => x.role === 'contender')) {
    const first = firstOf(s, p.name);
    if (first && first.id === keeper.id) out.push(`${key}: the keeper ${keeper.name} heads ${p.name}, which contests the seat`);
    if (first && NOBLE_BODIES.includes(p.name) && !NOBLE_FACES.includes(first.title)) out.push(`${key}: ${p.name} is faced by ${first.title}`);
  }
  return out;
}

beforeAll(async () => { await loadGenerationLawPayloads(); });

describe('COHERENCE-POWERS-6 item 2: the keeper of a vacant seat heads no contender', () => {
  it('the review\'s seven keepers and the lane\'s', () => {
    const census = [['village', 'r2r-village-57', false], ['town', 'r2s-succession_void-town-0', true], ['city', 'r2s-succession_void-city-2', true],
      ['metropolis', 'r2s-succession_void-metropolis-0', true], ['metropolis', 'r2s-succession_void-metropolis-1', true],
      ['metropolis', 'r2s-succession_void-metropolis-2', true], ['metropolis', 'r2s-succession_void-metropolis-3', true]];
    const lane = [['town', 'rvf-succession_void-town-4'], ['metropolis', 'rvf-succession_void-metropolis-4'], ['hamlet', 'l2-succession_void-hamlet-15'],
      ['village', 'l2-succession_void-village-11'], ['town', 'l2-succession_void-town-3'], ['city', 'l2-succession_void-city-3']];
    const misses = [...census.map(([t, seed, crisis]) => missesOf(born(t, seed, crisis, true), seed)).flat(),
      ...lane.map(([t, seed]) => missesOf(born(t, seed), seed)).flat()];
    expect(misses).toEqual([]);
  });

  it('the contender keeps its people: the keeper of rvf-succession_void-town-4 stays a member of Landed Gentry and heads it no longer; a lord leads it', () => {
    const s = born('town', 'rvf-succession_void-town-4');
    const keeper = seatKeeperOf(s);
    expect(keeper?.title).toBe("the lord's appointee");
    const held = (keeper?.memberships || []).find((m) => m.power === 'Landed Gentry');
    expect(held, 'the keeper stays a member of the body his house backs').toBeTruthy();
    expect(held?.rank, 'the keeper heads no contender').not.toBe(1);
    expect(firstOf(s, 'Landed Gentry')?.title).toBe('the lord');
  });

  it('on fresh succession births at every size', () => {
    const misses = [];
    for (const t of TIERS) for (let i = 0; i < 8; i += 1) misses.push(...missesOf(born(t, `pfu-void-${t}-${i}`), `pfu-void-${t}-${i}`));
    expect(misses).toEqual([]);
  }, 300000);
});
