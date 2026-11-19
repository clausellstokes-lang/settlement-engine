/**
 * tests/generators/safetyEnforcementReadsRoster.test.js — UPKEEP-14, the chair's ruling (h) (the bar's #256 and #280):
 * "Hunger-driven theft of food, livestock, and stored goods. Enforcement struggles to distinguish survival crime from
 * organised theft." printed where no watch, court, militia or garrison stands (84 of the 972). A line that names
 * enforcement reads the roster: where none stands, the sentence stops at the theft (`settleCrimeLinesToSignal`, on the
 * final roster). Guarded on a born town (the census's r2r-village-21, census shape) and on the settle step's two sides.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { settleCrimeLinesToSignal } from '../../src/generators/safetyProfile.js';
import { defenceOf } from '../../src/domain/facts/defence.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const LINE = 'Hunger-driven theft of food, livestock, and stored goods. Enforcement struggles to distinguish survival crime from organised theft.';
const ENF = /Enforcement struggles/;
const eco = () => ({ safetyProfile: { crimeTypes: [{ type: 'desperation theft', desc: LINE }], criminalInstitutions: [] }, activeChains: [], foodSecurity: { hasFamine: true } });

let town;
beforeAll(async () => {
  await loadGenerationLawPayloads();
  town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: 'village' }), null, { seed: 'r2r-village-21', customContent: {} });
}, 120_000);

describe('(h) the enforcement sentence reads the roster', () => {
  it('r2r-village-21 (no watch, court, militia or garrison): its hunger-theft line stops at the theft', () => {
    const d = defenceOf(town);
    expect(d.watch || d.court || d.militia || d.garrison, 'fixture premise: no enforcer stands').toBe(false);
    const descs = (town.economicState.safetyProfile.crimeTypes || []).map((c) => c.desc);
    expect(descs.some((x) => /^(?:Hunger-driven )?[Tt]heft of food, livestock, and stored goods/.test(x)), 'anti-vacuity: the theft line prints').toBe(true);
    expect(descs.filter((x) => ENF.test(x))).toEqual([]);
  });
  it('no enforcer: the line ends at the theft; a watch: the line is kept whole', () => {
    const bare = settleCrimeLinesToSignal(eco(), { seats: [], estate: [{ name: 'Dwellings (5-25)' }] });
    expect(bare.safetyProfile.crimeTypes[0].desc).toBe('Hunger-driven theft of food, livestock, and stored goods.');
    const watched = settleCrimeLinesToSignal(eco(), { seats: [], estate: [{ name: 'Town watch', category: 'Defense' }] });
    expect(watched.safetyProfile.crimeTypes[0].desc).toBe(LINE);
  });
});
