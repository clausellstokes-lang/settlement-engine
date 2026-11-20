/**
 * TAIL-POWERS-B-4 batch 8 (the chair's P31, 2026-11-15; each vetoable by the owner): the eight rows two cold reads met in this
 * seat's files, each measured by the record over every census town that prints it (cce57ff35), cured by a condition, a declared
 * twin or a rewording, text only, no draw moved:
 *  (1) claimStanding.js: the clergy "at the margins" where the faith stands at or above the seat, or at Significant (final roster);
 *  (2) titleSecretsPresentations.js: the potter's clay secret where no clay reaches the potter (84 of 85);
 *  (3) factionDynamics.js: the merchants' and craftsmen's vote where the conflicts hold the pair at HIGH;
 *  (4) factionStanding.js: "Three powers stand almost level" reads the count and the ladder's rung;
 *  (5) factionDynamics.js: the seat and the ordaining faith "prop each other up" beside a HIGH quarrel; "collects the taxes"
 *      under an occupation;
 *  (6) stressFactions.js: a thieves' guild "lobbying for compensation" in wartime.
 * RED AT THE BASE (cce57ff35): every refused pair; KEEP pairs green before and after.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced?.[2], selectedStresses: [forced?.[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}
const CLERGY = 'Clergy are present but operate at the margins of civic life';
const CLERGY_TWIN = 'The faith holds no office in the hall, but its moral authority is real and its word carries political weight here.';
const DIG = 'dug clay from land that belongs to someone else';
const POTS = 'Has been selling pots bought in from another workshop as their own throwing, at their own prices';
const WAR_MERCH = 'Trade disruption and requisition are hurting the bottom line.';
/** [census town, the text that must NOT print in it, the text that prints instead] */
const ROWS = /** @type {Array<[string, string, string]>} */ ([
  // (1) the faith's own card: CARD_ROWS
  // (2) no clay reaches the potter
  ['r2s-famine-town-1', DIG, POTS],
  ['r2r-village-43', DIG, POTS],
  // (3) the conflicts hold the merchants and the craft guilds at HIGH
  ['r2r-town-29', 'The Merchant Guilds and the Craft Guilds vote together whenever trade is at stake', 'The Merchant Guilds and the Craft Guilds are at odds over weights and measures used in trade, and fight over who keeps the profit of the trade.'], // NAMES-1 (CN1): the article
  ['r2r-town-34', 'The Merchant Guilds and the Craft Guilds vote together whenever trade is at stake', 'The Merchant Guilds and the Craft Guilds are at odds over who speaks for the place to outsiders'], // NAMES-1 (CN1): the article
  // (4) not three level: a Significant power over Minor ones; or five level, said so
  ['r2r-city-7', 'Three powers stand almost level here', 'They are always at the table, but cannot set their own terms.'],
  ['r2r-metropolis-39', 'Three powers stand almost level here', 'Five powers stand almost level here, and no one leads'],
  // (5) a HIGH quarrel between the seat and the faith; an occupation
  ['r2r-metropolis-15', 'Each props up the other. Even so', 'long told people that'],
  ['r2s-occupied-town-2', 'holds the seat and collects the taxes', 'The Guild Council holds the seat; the Religious Authorities tell people'], // NAMES-1 (CN1): the article
  // (6) the thieves' guild in wartime: its own card (CARD_ROWS)
]);
/** (1) and (6) [town, the card, the text its card must NOT carry, the text it carries instead] */
const CARD_ROWS = /** @type {Array<[string, string, string, string]>} */ ([
  // (1) the faith stands above the seat (17 to 14), level with it (24 to 24), or at Significant; a density rival far behind
  // the seat (The Holy Compact, 9 to 14) keeps the margins line, true of it (KEEP)
  ['r2s-politically_fractured-metropolis-1', 'Religious Authorities', CLERGY, CLERGY_TWIN],
  ['r2s-religious_conversion-town-1', 'Religious Authorities', CLERGY, CLERGY_TWIN],
  ['r2r-village-12', 'Religious Authorities', CLERGY, CLERGY_TWIN],
  ['r2s-wartime-town-3', "Thieves' Guild", WAR_MERCH, 'Shortage and requisition have pushed trade into the black market, where the guild takes its cut.'],
  ['r2s-wartime-city-2', "Thieves' Guild", WAR_MERCH, 'Shortage and requisition have pushed trade into the black market, where the guild takes its cut.'],
]);
/** KEEP: [town, a text that must still print]: a true sibling of each cured line */
const KEEP = /** @type {Array<[string, string]>} */ ([
  ['r2r-town-9', CLERGY], // a Minor faith far behind the seat (14 to 31)
  ['r2s-politically_fractured-metropolis-1', CLERGY], // The Holy Compact, 9 to the seat's 14
  ['r2r-village-0', 'The Merchant Guilds and the Craft Guilds vote together whenever trade is at stake'], // no quarrel on the record // NAMES-1 (CN1): the article
  ['r2s-succession_void-metropolis-3', 'Three powers stand almost level here'], // 17, 16, 14: three, all Minor
  ['r2r-village-7', 'holds the seat and collects the taxes; the Religious Authorities tell people'], // no quarrel, no occupation // NAMES-1 (CN1): the article
  ['r2s-wartime-town-3', WAR_MERCH], // the merchant powers of the same town
]);
/** @type {Record<string, string>} */
const pages = {};
/** @type {Record<string, Record<string, string>>} */
const cards = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...ROWS.map((r) => r[0]), ...KEEP.map((r) => r[0]), ...CARD_ROWS.map((r) => r[0])])) {
    const s = born(seed);
    cards[seed] = Object.fromEntries((s.powerStructure?.factions || []).map((/** @type {any} */ f) => [f.faction, String(f.desc || '')]));
    pages[seed] = JSON.stringify({ factions: s.powerStructure?.factions, rels: s.powerStructure?.factionRelationships, npcs: s.npcs });
  }
}, 600000);

describe('TAIL-POWERS-B-4 batch 8 (P31) · the powers lines read the roster, the conflicts and the land', () => {
  for (const [seed, refused, instead] of ROWS) {
    it(`${seed}: not "${refused.slice(0, 48)}…"; prints "${instead.slice(0, 40)}…"`, () => {
      expectAbsentWithAnchor(pages[seed], refused, instead, `${seed}: the cured line`);
    });
  }
  for (const [seed, card, refused, instead] of CARD_ROWS) {
    it(`${seed}: the ${card}'s card does not say "${refused.slice(0, 40)}…"; it says "${instead.slice(0, 40)}…"`, () => {
      expectAbsentWithAnchor(cards[seed][card], refused, instead, `${seed}: the ${card}'s card`);
    });
  }
  for (const [seed, kept] of KEEP) {
    it(`KEEP ${seed}: "${kept.slice(0, 48)}…" still prints`, () => {
      expect(pages[seed]).toContain(kept);
    });
  }
});
