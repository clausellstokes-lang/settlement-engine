/**
 * tests/generators/tailDefeconBatch4Lines.test.js — TAIL-DEFECON-4 batch 4 (2026-11-15, by width, D27;
 * `docs/chair/2026-11-14/tail/TAIL-DEFECON-HANDBACK.md`): a crisis that adds MOUTHS (an occupation, an influx) is not
 * headed "Crisis Cutting the Food Supply", gap or none (B05887; the plague, the siege, the levy, the revolt and the
 * famine do cut the harvest, and keep it); the alchemist's trade does not "thrive" and "draw customers" in a place
 * whose own label is Struggling or Poor (03703, X9 03932); the slave revolt takes a fifth of the harvest, not all of it
 * (B27952); an export-potential row of a half-worked chain claims no export (15458, D3). Each GONE pair is red at the
 * base (21e578caa) and names what prints instead; each KEEP pair is a town where the original is true, and still prints it.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

// The census's 720 configuration (SECOND-WAVE-CENSUS births.mjs): every random dial on.
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed */
function censusBirth(seed) {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] }), null, { seed, customContent: {} });
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m?.[1]], selectedStressesRandom: false, settType: m?.[2] }), null, { seed, customContent: {} });
}
/** The rows as the tabs print them: the food crisis heading :: its note; the income source :: its line; the export potential's goods :: its reason. @param {any} s */
const pageText = (s) => [
  ...(s.economicViability?.issues ?? []).map((/** @type {any} */ i) => `${i.title} :: ${i.message}`),
  ...(s.economicState?.incomeSources ?? []).map((/** @type {any} */ e) => `${e.source} :: ${e.desc ?? ''}`),
  ...(s.resourceAnalysis?.exports ?? []).map((/** @type {any} */ x) => `${x.product} :: ${x.reason}`),
].join('\n');

/** [row, seed, the text that must NOT print, what prints instead] */
const GONE = [
  ['B05887', 'r2r-thorp-24', 'Crisis Cutting the Food Supply :: The occupiers are fed from local stores', 'Crisis Adding Mouths to Feed :: The occupiers are fed from local stores'],
  ['B05887', 'r2r-city-3', 'Crisis Cutting the Food Supply :: Newcomers keep arriving', 'Crisis Adding Mouths to Feed :: Newcomers keep arriving'],
  ['03703', 'r2r-city-19', 'A thriving alchemical trade', 'Apothecary & Alchemy :: Herbal remedies, minor alchemical preparations, and potion sales. The local alchemist supplements conventional trade.'],
  ['03703', 'r2s-famine-city-2', 'A thriving alchemical trade', 'The local alchemist supplements conventional trade.'],
  ['B27952', 'r2s-slave_revolt-city-0', 'nobody is bringing in the harvest', 'With the enslaved workers in revolt, the outlying fields lie idle, and less of the harvest is coming in.'],
  ['15458', 'r2r-city-1', 'exports semi-finished goods', 'cut stone, stone blocks :: Partial processing - worked only to semi-finished goods'],
];
/** [row, seed, a true sibling that must still print] */
const KEEP = [
  ['B05887', 'r2r-thorp-38', 'Crisis Cutting the Food Supply :: The crops failed'],
  // RE-KEYED BY IDENTITY (BAR4-CORPUS-ECO, 2026-11-16): the true sibling is the same line, its degree word gone (C38176:
  // "thriving" said of the smallest income share in all 70 of the 720 that print it); the town and the row are unchanged.
  ['03703', 'r2r-city-11', 'An alchemical trade in reagents, preparations, and curative potions draws customers from surrounding settlements.'],
  ['15458', 'r2r-city-0', 'Complete production chain in place'],
];

/** @type {Record<string, string>} */
const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...GONE, ...KEEP].map((r) => r[1]))) towns[seed] = pageText(censusBirth(seed));
}, 300_000);

describe('TAIL-DEFECON-4 batch 4: the food heading, the alchemist, the revolt and the half-worked chain say only what the record holds', () => {
  for (const [row, seed, gone, instead] of GONE) {
    test(`#${row} ${seed}: not "${gone}"; "${instead}"`, () => {
      expectAbsentWithAnchor(towns[seed], gone, instead, `#${row} ${seed}: gone beside what prints instead`);
      expect(towns[seed]).toContain(instead);
    });
  }
  for (const [row, seed, kept] of KEEP) {
    test(`#${row} ${seed} keeps "${kept}"`, () => expect(towns[seed]).toContain(kept));
  }
});
