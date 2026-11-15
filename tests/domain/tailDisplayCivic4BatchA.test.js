/**
 * TAIL-DISPLAY-CIVIC-4 · batch A (the chair's rulings V5, V6, V7 of 2026-11-15 04:00 UTC; each vetoable by the owner):
 *  - V5 THE CAMPAIGN'S WORD: "re-judged as the campaign advances" read as a war in a calm town; it is the table's
 *    campaign: "re-judged as your campaign goes on" (the Defense tab's Threat Assessment caption, the Systems Health
 *    pill's vintage sentence, and their PDF twins).
 *  - V6 THE BENCH: where no courthouse stands and a council or a town hall hears the cases, the Legal Infrastructure row
 *    names what stands ("Council bench + Prison", "Town hall bench only"), and the council's service row says who hears
 *    the pleas ("Hears the town's civil pleas at the council bench").
 *  - V7 THE GATES AND THE UNDERGROUND: "Everyone comes and goes by the gates, so smugglers have to get past the …" only
 *    where no house moves goods beneath the walls; else its twin.
 * Births of the census's own seeds (CENSUS-3 seedcfg.mjs :: cfgFor); every cured pair red at 6cf555801, kept pairs green.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, test } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { deriveSupportingCapabilities } from '../../src/domain/display/defenseDisplay.js';
import { SYSTEMS_HEALTH_VINTAGE } from '../../src/copy/sectionHelp.js';

const ROOT = join(__dirname, '..', '..');
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed the census's seed: r2r-<size>-<n> or r2s-<stress>-<size>-<n> */
const cfgFor = (seed) => {
  const s = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  if (s) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [s[1]], selectedStressesRandom: false, settType: s[2] });
  return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: seed.split('-')[1] });
};
/** @type {Map<string, any>} */
const TOWN = new Map();
/** @param {any} s */
const legal = (s) => deriveSupportingCapabilities(s).find((c) => c.label === 'Legal Infrastructure');
/** @param {any} s @returns {string} */
const services = (s) => Object.values(s.availableServices || {}).flat().map((r) => `${r?.name}: ${r?.desc ?? r?.description ?? ''}`).join('\n');

// V6 [seed, the status that must not print, the status that prints instead]
const BENCH = [
  ['r2r-town-1', 'Court + Prison', 'Council bench + Prison'],
  ['r2r-town-16', 'Court only', 'Council bench only'],
  ['r2r-town-6', 'Court only', 'Town hall bench only'],
  ['r2r-town-54', 'Court + Prison', 'Town hall bench + Prison'],
];
// V7 [seed, what must not print, what prints instead]
const GATES = [
  ['r2r-city-1', 'Everyone comes and goes by the gates', 'The garrison and city watch keep the gates, but smugglers have ways in beneath the walls.'],
];
// [seed, a true sibling that must still print]
const KEPT_STATUS = [['r2r-town-0', 'Court + Prison']]; // a courthouse stands
const KEPT_GATES = [['r2r-town-0', 'Everyone comes and goes by the gates, so smugglers have to get past the town watch.']]; // no house beneath the walls

beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...BENCH, ...GATES, ...KEPT_STATUS, ...KEPT_GATES].map((r) => r[0]))) {
    TOWN.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  }
}, 900000);

describe('V5: the campaign is the table\'s campaign', () => {
  test('the Defense tab\'s caption and the vintage sentence say "your campaign goes on", never "the campaign advances"', () => {
    const tab = readFileSync(join(ROOT, 'src/components/new/tabs/DefenseTab.jsx'), 'utf8');
    expectAbsentWithAnchor(tab, 're-judged as the campaign advances', 'Disasters & Famine is re-judged as your campaign goes on');
    expect(SYSTEMS_HEALTH_VINTAGE).toBe('As judged at the first survey · Food Security is re-judged as your campaign goes on.');
  });
});

describe('V6: the Legal Infrastructure row names the bench that stands', () => {
  test('<seed>: "<gone>" does not print; "<instead>" does (every BENCH row)', () => {
    expectNoSeedFailures(collectSeedFailures(BENCH, ([seed, gone, instead]) => {
      const row = legal(TOWN.get(seed));
      expect(row?.status, `${seed}: "${gone}" does not print`).not.toBe(gone);
      expect(row?.status, `${seed}: "${instead}" does`).toBe(instead);
    }), 'V6: each bench row names the bench that stands, never the court');
  });
  test('<seed> keeps "<kept>" (a courthouse stands) (every KEPT_STATUS row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEPT_STATUS, ([seed, kept]) => {
      expect(legal(TOWN.get(seed))?.status, `${seed} keeps "${kept}" (a courthouse stands)`).toBe(kept);
    }), 'V6: where a courthouse stands the court status still prints');
  });
  test('r2r-town-16: the council\'s service row says who hears the pleas', () => {
    const svc = services(TOWN.get('r2r-town-16'));
    expectAbsentWithAnchor(svc, 'Hears civil pleas in the town court', "Dispute adjudication: Hears the town's civil pleas at the council bench");
  });
});

describe('V7: the gates line only where nothing moves beneath the walls', () => {
  test('<seed>: "<gone>" does not print; "<instead>" does (every GATES row)', () => {
    expectNoSeedFailures(collectSeedFailures(GATES, ([seed, gone, instead]) => {
      const g = String(TOWN.get(seed)?.economicState?.safetyProfile?.guardEffectivenessDesc ?? '');
      expectAbsentWithAnchor(g, gone, instead, seed);
    }), 'V7: where a house moves goods beneath the walls the gates line takes its twin');
  });
  test('<seed> keeps "<kept>" (every KEPT_GATES row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEPT_GATES, ([seed, kept]) => {
      expect(String(TOWN.get(seed)?.economicState?.safetyProfile?.guardEffectivenessDesc ?? ''), `${seed} keeps "${kept}"`).toContain(kept);
    }), 'V7: where nothing moves beneath the walls the gates line still prints');
  });
});
