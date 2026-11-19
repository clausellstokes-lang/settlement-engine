/**
 * titleLinesClaimTheTrade.test.js — TAIL-POWERS-B-2 batch 5 (the chair's P9, P12 and P18, 2026-11-15): A TITLE LINE CLAIMS
 * THE TRADE, NOT PRESENT WORK ON AN INPUT THE RECORD MAY DENY. Where a house's input (clay, timber, hides, stone, ore, the
 * herd, the hunting) is missing or worked out in SOME towns that hold it, its line takes the hedge form ("when there is
 * clay to be had"); text only, no draw moved: the same person in the same town carries the reworded line. A gap in 90%
 * or more of the towns that hold the house is the record's (the vintner's grapes, 184 of 184): NAMED, not reworded (KEEP).
 * (P18) the castellan's secret says what he did and hid (the wall money, the buried survey), not what the walls look like.
 * RED AT THE BASE (700ba76cf): every refused pair; KEEP pairs green before and after.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced?.[2], selectedStresses: [forced?.[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}
/** [census town (where the record denies the input, or the reader read it), the line that must NOT print, the line its card prints instead] */
const ROWS = /** @type {Array<[string, string, string]>} */ ([
  ['r2s-famine-city-1', 'Talks while working; shows how a pot is thrown and lets visitors try.', 'Talks while working when there is clay to be had; shows how a pot is thrown and lets visitors try.'],
  ['r2s-famine-town-1', 'Has been digging clay from land that belongs to someone else and paying nothing for it', 'Has been selling pots bought in from another workshop as their own throwing, at their own prices'],
  ['r2s-occupied-town-0', 'Sells by the thousand and the cart; quick to quote and slow to deliver.', 'Sells by the thousand and the cart when there is clay to be had; quick to quote and slow to deliver.'],
  ['r2s-famine-city-3', 'Has been taking children to tread the clay for a few coppers a day, and one of them was hurt badly', 'Has taken children to tread the clay for a few coppers a day, when there was clay to tread, and one of them was hurt badly'],
  ['r2s-occupied-metropolis-1', 'Sells charcoal by the sack to anyone who can carry it away.', 'Sells charcoal by the sack, when there is timber to be had, to anyone who can carry it away.'],
  ['r2s-occupied-metropolis-1', 'Has been keeping back ore from the tally and selling it to a smelter elsewhere', 'Has kept back from the tally what ore the workings still give, and sold it to a smelter elsewhere'],
  ['r2r-metropolis-14', 'Sells stone by the block and the cart; wants half paid before cutting begins.', 'Sells stone by the block and the cart, from what the quarry still gives; wants half paid before cutting begins.'],
  ['r2s-plague_onset-village-2', 'Sells leather to anyone; cash only.', 'Sells leather to anyone when there are hides to be had; cash only.'],
  ['r2s-under_siege-hamlet-3', 'Offers a cup and talk of the herd and the weather.', 'Offers a cup and talk of the weather and the price of milk.'],
  ['r2s-indebted-hamlet-2', 'Waters the milk before it goes to market and has done so for years', 'Has watered the milk for years, whenever there was milk to sell'],
  ['r2s-religious_conversion-hamlet-1', 'Sells milk, butter and cheese at the posted price.', 'Sells milk, butter and cheese at the posted price, when the cows are giving.'],
  ['r2r-hamlet-12', "Has been grazing the herd on a neighbour's land at night", "Has grazed the herd on a neighbour's land at night, whenever there was a herd to graze"],
  ['r2r-hamlet-18', 'the best places to hunt', 'where the hunting has been best'],
  ['r2s-plague_onset-city-0', 'Has let the walls go unrepaired and pocketed the money that was granted for the work', 'Pocketed the money that was granted for the wall repairs, and buried the survey that said where they were needed'],
]);
/** KEEP: [town, a line that must still print] — the vintner's (NAMED for the record's seat: grapes are missing in 184 of 184 towns that hold one) */
const KEEP = /** @type {Array<[string, string]>} */ ([
  ['r2r-city-44', "Pours a taste, talks about the year's grapes and suggests a cask."],
]);
/** @type {Record<string, string>} */
const cards = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...ROWS.map((r) => r[0]), ...KEEP.map((r) => r[0])])) cards[seed] = JSON.stringify(born(seed).npcs);
}, 600000);

describe('TAIL-POWERS-B-2 batch 5 · a title line claims the trade, not an input the record may deny', () => {
  for (const [seed, refused, instead] of ROWS) {
    it(`${seed}: not "${refused.slice(0, 48)}…"; the same card prints the hedge`, () => {
      expectAbsentWithAnchor(cards[seed], refused, instead, `${seed}: the refused line; the same card prints the hedge`);
      expect(cards[seed]).toContain(instead);
    });
  }
  for (const [seed, kept] of KEEP) {
    it(`KEEP ${seed}: "${kept.slice(0, 48)}…" still prints`, () => {
      expect(cards[seed]).toContain(kept);
    });
  }
});
