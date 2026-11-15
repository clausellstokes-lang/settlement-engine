/**
 * tests/generators/tailDefeconIncomeRows.test.js — TAIL-DEFECON-2 batch 2 (2026-11-15; the DEFECON worklist's income
 * rows of `economicState.js :: generateEconomicState`, `docs/chair/2026-11-14/tail/TAIL-DEFECON-HANDBACK.md`): an income
 * row says only what the record holds. Each GONE pair is a census town (the 720's configuration) that printed the row
 * where its own record makes it false, red at the base 345f13157; each names what prints in its place, or that the
 * slot is silent by design. Each KEEP pair is a town where the original is true, and still prints it.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

// The census's 720 configuration (SECOND-WAVE-CENSUS births.mjs): every random dial on.
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
function censusBirth(seed) {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] }), null, { seed, customContent: {} });
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} });
}
/** Every income row as the Economics tab, the PDF and the journal print it: the source, then its line. */
const incomeText = (s) => (s.economicState?.incomeSources ?? []).map((e) => `${e.source} :: ${e.desc ?? ''}`).join('\n');

const SILENT = null;
/** For a SILENT pair, the row whose slot is silent: it still stands on the town's page (read off the birth). */
const SILENT_ROW = { '16644': 'River Tolls :: ', '17619': 'Security Contracts :: ' };
/** [row, seed, the text that must NOT print, what prints instead (SILENT: the slot is silent by design)] */
const GONE = [
  ['03348', 'r2r-thorp-0', 'Agricultural Rents', 'Harvest :: What the households grow and raise on their holdings; the main living at this scale.'],
  ['03348', 'r2r-village-3', 'from tenant farmers', 'Harvest :: What the households grow and raise on their holdings'],
  ['15707', 'r2r-village-3', 'Pilgrim Trade', 'Church Tithes :: '], // D14: no shrine, cathedral, monastery or abbey
  ['15707', 'r2r-village-9', 'visiting pilgrims', 'Church Tithes :: '],
  ['00386', 'r2s-under_siege-town-0', 'visiting pilgrims', 'Pilgrim Trade :: '],
  ['11426', 'r2r-town-6', 'contract-grade enchanting brings steady coin', 'contract-grade enchanting bring steady coin.'],
  ['B17543', 'r2s-under_siege-city-0', 'A busy market for spell services', 'Spellcasting Services :: '],
  ['16644', 'r2s-under_siege-metropolis-3', 'Tolls on river traffic', SILENT],
  ['17619', 'r2s-under_siege-metropolis-3', 'privatised protection tax on trade', SILENT],
  ['B05884', 'r2r-town-11', 'Smuggling Network Revenue', 'but it goes to the criminals who run them'],
  ['06146', 'r2r-thorp-10', 'the criminals who run them', 'Black Market Revenue :: Untaxed trade, fencing and theft bring money in here, but none of it reaches the treasury.'],
  ['06148', 'r2r-thorp-22', 'the criminals who run them', 'Shadow Economy (untaxed) :: Untaxed trade, fencing and theft bring money in here, but none of it reaches the treasury.'],
];
/** [row, seed, a true sibling that must still print] */
const KEEP = [
  ['03348', 'r2r-thorp-4', 'Agricultural Rents :: Payments in kind or coin from tenant farmers'],
  ['15707', 'r2r-village-13', 'Pilgrim Trade :: Offerings, hospitality fees, relic sales'], // a cathedral town
  ['B17543', 'r2r-city-1', 'Spellcasting Services :: A busy market for spell services.'],
  ['16644', 'r2r-town-17', 'River Tolls :: Tolls on river traffic, dock fees, and ferry rights.'],
  ['17619', 'r2r-city-13', 'Security Contracts :: Guild-funded private security surcharges'],
  ['B05884', 'r2r-town-5', 'Smuggling Network Revenue :: Smuggling, contraband and protection rackets'],
  ['06146', 'r2r-town-45', 'Black Market Revenue :: Untaxed trade, fencing and theft bring money in here, but it goes to the criminals who run them'],
  ['06148', 'r2r-town-0', 'but it goes to the criminals who run them'],
];

const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...GONE, ...KEEP].map((r) => r[1]))) towns[seed] = incomeText(censusBirth(seed));
}, 300_000);

describe('TAIL-DEFECON-2 batch 2: an income row says only what the record holds', () => {
  for (const [row, seed, gone, instead] of GONE) {
    test(`#${row} ${seed}: not "${gone}"; ${instead === SILENT ? 'silent by design' : `"${instead}"`}`, () => {
      const anchor = instead === SILENT ? SILENT_ROW[row] : instead;
      expectAbsentWithAnchor(towns[seed], gone, anchor, `#${row} ${seed}: gone beside ${instead === SILENT ? 'its silent row' : 'what prints instead'}`);
    });
  }
  for (const [row, seed, kept] of KEEP) {
    test(`#${row} ${seed} keeps "${kept}"`, () => expect(towns[seed]).toContain(kept));
  }
});
