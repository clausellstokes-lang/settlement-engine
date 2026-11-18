/**
 * tests/generators/bar2Places2Rows.test.js — BAR2-PLACES-2 (REVIEW-BAR-2, 2026-11-15; the chair's grant PT3, vetoable by
 * the owner): the two rows the seat inherited, cured at their writers and read on census births (the census's own seeds,
 * born as the census bears them, CENSUS-3 seedcfg.mjs). Each CURED row names what must no longer print in that town AND
 * what prints in its place (the replacement asserted present first); each KEEP row is a true sibling that must still
 * print. Every CURED row was red at the base (fd4e69e8b).
 *
 * - C3396 (crisisCast.js :: exploiterCandidates): "exploits it: <a person> · the strongest figure in a power that gains"
 *   was said of the gaining powers' member with the highest CARD power, ranked or not (bar0-city-under_siege+famine-rand-5:
 *   Bertram Krüger, card power 9, holds no rank in the War Council, whose rank 1 is Hinrik Maier). The pick is kept (no
 *   draw moves); the reason says the person's standing: "the strongest figure" only for the one ranked first in a power
 *   that gains (membership.js :: membersByRank, the file's own order), else "one of a power that gains by the crisis"
 *   (the brunt's own form, bruntMember).
 * - the slavic socialTexture (cultureProfiles.js): "Shared ovens, bathhouses, wells, and seasonal work …" claimed an oven
 *   house the vocabulary names nowhere (27 of 27 towns), a bathhouse the declaration could not enforce at the draw (18 of
 *   27 hold none) and wells where the water comes by aqueduct (8 of 27). Reworded to what every town holds: the water
 *   source is required everywhere (institutionalCatalog.js :: 'Water source', the waterSupply group).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { CAST_REASONS } from '../../src/domain/crisis/crisisCast.js';
import { membersByRank } from '../../src/domain/people/membership.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's own configuration for its seed families (CENSUS-3 seedcfg.mjs: r2r-, r2s-, bar0-). @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(/^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] });
  m = seed.match(/^bar0-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-\d+$/);
  if (m) {
    const st = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
    return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true });
  }
  m = /** @type {RegExpMatchArray} */ (seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/));
  return birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
};
/** @type {Map<string, any>} */
const births = new Map();
/** @param {string} seed @returns {any} */
const born = (seed) => {
  if (!births.has(seed)) births.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return births.get(seed);
};
/** Every crisis entry of the record that carries a cast. @param {any} s @returns {any[]} */
const castEntries = (s) => [s.stress, ...(Array.isArray(s.stressors) ? s.stressors : [s.stressors])].filter((e) => e && e.cast);
/** The exploiter and profiteer rows of every crisis, with the powers that gain by that crisis. @param {any} s */
const gainerRows = (s) => castEntries(s).flatMap((e) => {
  const gains = (e.cast.stakes || []).filter((/** @type {any} */ k) => k.stake === 'gains').map((/** @type {any} */ k) => k.factionId);
  return (e.cast.roles || []).filter((/** @type {any} */ r) => r.role === 'exploiter' || r.role === 'profiteer').map((/** @type {any} */ r) => ({ type: e.type, row: r, gains }));
});
/** True when the person is ranked first (membersByRank's order) in a power of `gains`. @param {any} s @param {string} id @param {string[]} gains */
const firstOfAGainer = (s, id, gains) => gains.some((p) => { const top = membersByRank(s.npcs || [], p)[0]; return !!top && (top.id || top.name) === id; });

const OLD_SLAVIC = /Shared ovens, bathhouses, wells, and seasonal work/;
const NEW_SLAVIC = /Shared water and seasonal work make private life unusually communal\./;

describe('BAR2-PLACES-2: the rows read the town', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  describe('C3396: the exploiter is named by the standing the record holds', () => {
    it('CURED bar0-city-under_siege+famine-rand-5: the unranked blade captain is "one of a power that gains", not "the strongest figure"', () => {
      const s = born('bar0-city-under_siege+famine-rand-5');
      const row = gainerRows(s).find((x) => x.type === 'famine' && x.row.role === 'exploiter')?.row;
      expect(row?.name).toBe('Bertram Krüger');
      expect(row?.reason.startsWith(CAST_REASONS.exploiterMember)).toBe(true);
      expect(row?.reason.startsWith(CAST_REASONS.exploiterPower)).toBe(false);
    });
    it('KEEP r2s-famine-town-3 (exploiter) and r2s-under_siege-city-3 (profiteer): the one ranked first in a power that gains is still "the strongest figure"', () => {
      expectNoSeedFailures(collectSeedFailures([['r2s-famine-town-3', 'exploiter'], ['r2s-under_siege-city-3', 'profiteer']], ([seed, role]) => {
        const s = born(seed);
        const row = gainerRows(s).find((x) => x.row.role === role)?.row;
        expect(row?.reason.startsWith(CAST_REASONS.exploiterPower)).toBe(true);
      }), 'every KEEP town');
    });
    it('LAW over these births: "the strongest figure" is said only of the one ranked first in a power that gains', () => {
      const bad = ['bar0-city-under_siege+famine-rand-5', 'r2s-famine-town-3', 'r2s-under_siege-city-3', 'r2s-occupied-hamlet-0', 'r2s-indebted-town-1']
        .flatMap((seed) => gainerRows(born(seed)).filter((x) => x.row.reason.startsWith(CAST_REASONS.exploiterPower) && !firstOfAGainer(born(seed), x.row.id, x.gains)).map((x) => `${seed} ${x.type} ${x.row.name}`));
      expect(bad).toEqual([]);
    });
  });

  describe('the slavic social texture claims no oven house, no bathhouse and no wells the town may lack', () => {
    it('CURED r2r-thorp-23, r2s-wartime-metropolis-1, r2s-under_siege-thorp-1', () => {
      expectNoSeedFailures(collectSeedFailures(['r2r-thorp-23', 'r2s-wartime-metropolis-1', 'r2s-under_siege-thorp-1'], (seed) => {
        const s = born(seed);
        expect(s.culturalIdentity?.socialTexture).toMatch(NEW_SLAVIC);
        expectAbsentWithAnchor(JSON.stringify(s), OLD_SLAVIC.source, 'Shared water and seasonal work make private life unusually communal.', `${seed}: the old slavic texture is gone, its rewording prints`);
      }), 'every CURED town');
    });
    it('KEEP r2r-thorp-10: the pool\'s true sibling (row 0) still prints where it was drawn: the slot keeps its draw', () => {
      const s = born('r2r-thorp-10');
      expect(s.culturalIdentity?.key).toBe('slavic');
      expect(s.culturalIdentity?.socialTexture).toBe('Household and communal labor obligations are enforced through reputation, assembly, and local office.');
    });
  });
});
