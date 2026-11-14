/**
 * lordNotGovernment.test.js — COHERENCE-POWERS-7 (the chair's R1, from REVIEW-POWERS-FU F1): A MINTED LORD, AND A CLAIMANT WHO
 * DOES NOT HOLD THE SEAT, IS NOT OF THE GOVERNMENT. Every lord of a noble body and every claimant was minted from
 * CLAIMANT_FACE's row in the government's card category, so the card deal gave it an office it does not hold ("Holds an
 * office that runs from day to day, with no crisis to answer.", r2r-city-1's Oengus Treacy of Noble Families) and the tie deal
 * the governor's debts ("The council's decisions are made in <the lord>'s chamber"). The row is minted in the card pools'
 * `other` category: the old families' own (npcStructure.js: "Heads an old family …", placed among its kind by houseRankOf).
 *
 * Before the cure, at the lane's tip before it (the census's 720): 151 minted lords and claimants, all government; 45 office
 * lines; 11 "Financial Dependence" rows with a lord on the governing side.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { CLAIMANT_FACE } from '../../../src/data/stressPowerFaces.js';

const DIALS = Object.freeze({ tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' });
/** @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced[2], selectedStresses: [forced[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}
const minted = (/** @type {any} */ s) => s.npcs.filter((c) => c.institution?.kind === 'power' && c.title === CLAIMANT_FACE.title);

describe('COHERENCE-POWERS-7 (R1) · a minted lord holds no office and owes no governor\'s debts', () => {
  it('the row: a lord is minted in the old families\' category, never the government\'s', () => {
    expect(CLAIMANT_FACE.category).toBe('other');
  });
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('every seed: a minted lord holds no office and owes no governor\'s debts', () => {
    expectNoSeedFailures(collectSeedFailures(['r2r-city-1', 'r2r-town-9', 'r2r-village-27', 'r2s-recently_betrayed-city-2', 'r2s-succession_void-metropolis-3'], (seed) => {
    const s = born(seed);
    const lords = minted(s);
    expect(lords.length, 'premise: a lord is minted here').toBeGreaterThan(0);
    const ids = new Set(lords.map((c) => c.id));
    expect(lords.filter((c) => /\boffice\b/i.test(String(c.structuralPosition || ''))).map((c) => `${c.name}: ${c.structuralPosition}`)).toEqual([]);
    expect(s.relationships.filter((r) => r.typeName === 'Financial Dependence' && ids.has(r.from)).map((r) => r.description)).toEqual([]);
  }), 'every seed: a minted lord holds no office and owes no governor\'s debts');
  }, 300_000);
});
