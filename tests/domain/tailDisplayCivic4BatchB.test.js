/**
 * TAIL-DISPLAY-CIVIC-4 · batch B (the chair's rulings V8 and V10 of 2026-11-15 04:00 UTC; each vetoable by the owner;
 * V9, one food ledger, was withdrawn by the chair's ruling V12 and is not built here):
 *  - V8 THE CRIME'S HEAD: "lacks a single controlling authority" beside one criminal power whose first seat is a person of
 *    the roster: the note says the power answers to one head and rival gangs contest its ground.
 *  - V10 two narrower safety lines: the smuggling hook whose load "arrives" under a siege takes its twin; "organized
 *    crime has a limited foothold" where no criminal house stands reads "has found no foothold".
 * Births of the census's own seeds (CENSUS-3 seedcfg.mjs :: cfgFor); every cured pair red at 6cf555801, kept pairs green.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { deriveCriminalStructure } from '../../src/domain/display/defenseDisplay.js';

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
/** @param {string} seed @returns {string} every text this batch cures, joined */
const textOf = (seed) => {
  const s = TOWN.get(seed); const sp = s?.economicState?.safetyProfile || {};
  return [deriveCriminalStructure(s)?.note ?? '', sp.safetyDesc ?? '', ...(sp.plotHooks || []).map(String)].join('\n');
};

// [seed, what must not print, what prints instead]
const CURED = [
  ['r2r-city-15', 'lacks a single controlling authority', "The Thieves' Guild answers to one head and holds routes and territories, but rival gangs contest its ground: no single authority rules all crime here."],
  ['r2s-under_siege-metropolis-0', 'Someone wants to know what it is before it arrives.', 'The smugglers have gone quiet since the siege closed the roads, and someone wants to know what their last load was.'],
  ['r2r-thorp-12', 'organized crime has a limited foothold', 'Petty theft is the primary risk; organized crime has found no foothold.'],
];
// [seed, a true sibling that must still print]
const KEPT = [
  ['r2r-city-5', 'lacks a single controlling authority'], // two criminal powers
  ['r2r-town-18', 'Someone wants to know what it is before it arrives.'], // no siege
  ['r2r-town-33', 'Petty theft is the primary risk; organized crime has a limited foothold.'], // a criminal house stands
  ['r2r-city-58', 'Petty theft is the primary risk; organized crime has a limited foothold.'], // gambling halls (the Defense tab: semi-organized)
];

beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...CURED, ...KEPT].map((r) => r[0]))) {
    TOWN.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  }
}, 900000);

describe('batch B: the crime\'s head, two safety lines', () => {
  test('<seed>: "<gone>" does not print; "<instead>" does (every CURED row)', () => {
    expectNoSeedFailures(collectSeedFailures(CURED, ([seed, gone, instead]) => {
      const t = textOf(seed);
      expectAbsentWithAnchor(t, gone, instead, seed);
    }), 'V8/V10: each cured line takes its twin');
  });
  test('<seed> keeps "<kept>" (every KEPT row)', () => {
    expectNoSeedFailures(collectSeedFailures(KEPT, ([seed, kept]) => {
      expect(textOf(seed), `${seed} keeps "${kept}"`).toContain(kept);
    }), 'V8/V10: each true sibling still prints');
  });
});
