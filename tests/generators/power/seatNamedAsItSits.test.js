/**
 * seatNamedAsItSits.test.js — TAIL-POWERS-B batch 2 (READ-ALL worklist POWERS; the chair's ruling P10, rows 06725, 18554,
 * 10424, 00339, 22709): A COUNCIL IS NAMED ONLY WHERE ONE SITS. A power card's claim or standing line that names "the
 * council" (the merchants fund it, the army's patronage and "the council knows it", the landowners it "works alongside",
 * "council access", "every council vote") under a seat that is no council (a Royal Authority, a Governorship, a Feudal
 * Stewardship, a Town Mayor) names the seat "the hall"; the trade nexus's merchants "control warehousing" only where a
 * warehouse stands; the thieves' guild "funds two charitable institutions" no more (a house the town may not hold): it
 * "gives openly to the poor".
 * RED AT THE BASE (40238d3ab): every refused pair; KEEP pairs (the same line under a council) green before and after.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline as bornVoiced } from '../../../src/generators/generateSettlementPipeline.js';
import { todayOf } from './powerLinesToday.js'; // PEOPLE-2 B2: re-keyed by identity, each voiced power line read back to the line it voices
/** @param {Parameters<typeof bornVoiced>} a */ const generateSettlementPipeline = (...a) => todayOf(bornVoiced(...a));
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { settleClaimsToLabel } from '../../../src/generators/power/claimStanding.js';
import { annotateFactionStanding } from '../../../src/generators/power/factionStanding.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';

const ARMY = 'Standing army with genuine political weight; command appointments are patronage, and the council knows it.';
const NEXUS = 'Dominant commercial class at a trade nexus; they set prices, control warehousing, and fund the council.';
/** @param {string} seat @param {string} desc @param {string[]} houses */
const settled = (seat, desc, houses = []) => {
  const roster = [{ faction: seat, isGoverning: true, power: 40, powerLabel: 'Dominant', desc: 'The seat.' }, { faction: 'Merchant Guilds', power: 30, powerLabel: 'Strong', desc }];
  settleClaimsToLabel(roster, 'metropolis', houses, null);
  return roster[1].desc;
};
/** three powers level (rank 2's line) under a seat @param {string} seat */
const level = (seat) => {
  const f = [{ faction: seat, isGoverning: true, power: 22, desc: '' }, { faction: 'Merchant Guilds', power: 20, desc: '' }, { faction: 'Arcane Orders', power: 18, desc: '' }, { faction: 'Grain Holders', power: 14, desc: '' }];
  annotateFactionStanding(f);
  return f[2].desc;
};
const thieves = () => {
  const f = [{ faction: 'Elder Council', isGoverning: true, power: 40, desc: '' }, { faction: 'Religious Authorities', power: 25, desc: '' }, { faction: "Thieves' Guild", power: 15, desc: '' }];
  annotateFactionStanding(f);
  return f[1].desc;
};

/** [what, the line, must NOT print, prints instead] */
const UNIT = /** @type {Array<[string, () => string, string, string]>} */ ([
  ['the army under a crown', () => settled('Royal Authority', ARMY), 'the council knows it', 'and the hall knows it.'],
  ['the nexus under a stewardship, no warehouse', () => settled('Feudal Stewardship', NEXUS), 'control warehousing', 'they set prices and fund the hall.'],
  // TAIL-POWERS-B-5 (P33/P34), RE-KEYED BY IDENTITY: the warehouse is now joined by the catalogue's own ids (claimStanding.js ::
  // WAREHOUSE_IDS, labelJoins.test.js), so the unit names a house the catalogue holds (the metropolis rung; was "bonded
  // warehouse", a name no catalogue or birth holds: the 720 hold "Warehouse district" and "Merchant warehouses" only)
  ['the nexus under a stewardship, a warehouse', () => settled('Feudal Stewardship', NEXUS, ['warehouse district']), 'fund the council', 'control warehousing, and fund the hall.'],
  ['the landowners under a governorship', () => settled('Noble Governorship', 'Hereditary landowners whose land rights and military obligations are structurally embedded in governance here; the council works alongside them, not over them.'), 'the council works', 'the hall works alongside them'],
  ['council access under a mayor', () => settled('Town Mayor', 'Established merchant community; fund civic works and expect council access in return.'), 'council access', 'expect access to the hall in return.'],
  ['three level under a governorship', () => level('Noble Governorship'), 'every council vote', 'every decision has to be bargained for.'],
  ['the thieves’ charity', () => thieves(), 'two charitable institutions', 'the guild gives openly to the poor'],
  // KEEP (green before and after): under a council the council is named
  ['KEEP: the army under a council', () => settled('City Council', ARMY), 'the hall knows it', 'and the council knows it.'],
  ['KEEP: council access under a council', () => settled('Corrupt Council', 'Established merchant community; fund civic works and expect council access in return.'), 'access to the hall', 'expect council access in return.'],
  ['KEEP: three level under a council', () => level('Guild Council'), 'every decision', 'every council vote has to be bargained for.'],
]);

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced?.[2], selectedStresses: [forced?.[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}
/** [census town, must NOT print on a power card, prints instead] */
const BIRTHS = /** @type {Array<[string, string, string]>} */ ([
  ['r2r-metropolis-31', 'the council knows it', 'and the hall knows it.'],
  ['r2r-hamlet-15', 'fund the council', 'they set prices and fund the hall.'],
  ['r2r-town-40', 'council access', 'expect access to the hall in return.'],
  // RE-KEYED BY IDENTITY 2026-11-15 (TAIL-POWERS-B-4, P31 (4), a declared move): 18/16/15 cross a rung, so the third power takes
  // the band's own line in place of the level line
  ['r2s-famine-city-2', 'every council vote', 'They are always at the table, but cannot set their own terms.'],
  ['r2r-town-0', 'access to the hall', 'expect council access in return.'], // KEEP: a Corrupt Council sits
]);
/** @type {Record<string, any>} */
const births = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const [seed] of BIRTHS) births[seed] = born(seed);
}, 240000);

describe('TAIL-POWERS-B batch 2 · a council is named only where one sits', () => {
  for (const [what, line, refused, instead] of UNIT) {
    it(what, () => {
      const text = line();
      expect(text, `prints instead: ${instead}`).toContain(instead);
      expectAbsentWithAnchor(text, refused, instead, `${what}: refused beside what prints instead`);
    });
  }
  for (const [seed, refused, instead] of BIRTHS) {
    it(`${seed}: not "${refused}"`, () => {
      const text = births[seed].powerStructure.factions.map((/** @type {any} */ f) => f.desc || '').join(' ');
      expect(text, `prints instead: ${instead}`).toContain(instead);
      expectAbsentWithAnchor(text, refused, instead, `${seed}: refused beside what prints instead`);
    });
  }
});
