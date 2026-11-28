/**
 * TAIL-POWERS-4 · batch 2 (READ-ALL rows 03509, 04923; power/rulingStructure.js, no line added: P20).
 * - 03509: a town whose body is the "Town Council" but whose seat is another (an Arcane, Military, Church, Merchant or
 *   Corrupt Council) printed the council's "merchants, guilds, and prominent families compete for seats" as the
 *   governing power's line: the seat's own line prints (the tables' existing lines).
 * - 04923: a church of weight with a cathedral or a monastery read "tithes, land, and courts are all ecclesiastical"
 *   under a crown, a duke or a guild: it needs the church's own (Ecclesiastical) seat, else the ladder's next line.
 * A DECLARED MOVE: powerStructure.factions[].desc. Births as the census's 720 (each pair red at the base).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced?.[2], selectedStresses: [forced?.[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}

const gov = (s) => String(s.powerStructure.factions.find((f) => f.isGoverning)?.desc || '');
const all = (s) => s.powerStructure.factions.map((f) => String(f.desc || '')).join(' | ');

describe("TAIL-POWERS-4 · batch 2: the seat's own line; a church of weight claims no more than it holds", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const COUNCIL = 'merchants, guilds, and prominent families compete for seats';
  const ALL_ECCL = 'tithes, land, and courts are all ecclesiastical';
  const NOW_ECCL = "Church holds substantial temporal power; tithes fund civic works";

  /** seed -> [read, the text that must NOT be written, the text written instead] */
  const CURED = /** @type {Record<string, [Function, string, string]>} */ ({
    'r2r-town-1': [gov, COUNCIL, 'Mages govern'], // Arcane Council
    'r2r-town-13': [gov, COUNCIL, 'Military commanders'], // Military Council
    'r2r-town-16': [gov, COUNCIL, 'Clergy hold substantial political authority'], // Church Council
    'r2r-town-0': [gov, COUNCIL, 'systematically compromised'], // Corrupt Council
    'r2r-city-19': [all, ALL_ECCL, NOW_ECCL], // Royal Authority
    'r2r-metropolis-27': [all, ALL_ECCL, NOW_ECCL], // Grand Merchant Oligarchy
  });
  for (const [seed, [read, was, now]] of Object.entries(CURED)) {
    it(`${seed}: reads "${now}", not "${was}"`, () => {
      const text = read(born(seed));
      expectAbsentWithAnchor(text, was, now, seed);
      expect(text, seed).toContain(now);
    }, 120_000);
  }

  /** KEEP: the council's line where the Town Council governs */
  for (const seed of ['r2r-town-23', 'r2r-town-41']) {
    it(`KEEP ${seed}: the Town Council's own line still prints where it governs`, () => {
      expect(gov(born(seed)), seed).toContain(COUNCIL);
    }, 120_000);
  }
  it('KEEP r2r-city-36: "all ecclesiastical" still prints under the Ecclesiastical Council', () => {
    expect(all(born('r2r-city-36'))).toContain(ALL_ECCL);
  }, 120_000);
});
