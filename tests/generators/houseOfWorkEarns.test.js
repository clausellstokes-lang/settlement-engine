/**
 * houseOfWorkEarns.test.js — UPKEEP-8, #93 (the chair's ruling of 2026-11-13, 23:48: a DECLARED MOVE of the income
 * family). Where Agricultural Rents is a small place's ONLY income line and a house of work stands on the roster, one line
 * is added at the branches' own weight for that house's WORK, worded from the trade and never from the house's stored
 * name; it claims no ground, export catch or route; under a siege the row prints its label and share alone.
 *
 * THE TOWNS are born in the app's shape. Each sentence prints in its own towns (the smallest tier among them a thorp);
 * THE GUARDS are a small place whose rents are not its only line, a small place with no house of work, and a town.
 * Red at the lane's base (995293e81).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

beforeAll(async () => { await loadGenerationLawPayloads(); });

/** The shapes: rv2-<crisis|calm>-<size>-<i> (the app's), rr2s-<size>-<crisis|calm>-<rand|port>-<i> (random dials). */
function cfgFor(seed) {
  let m = /^rv[23]-([a-z_+]+)-(\w+)-\d+$/.exec(seed);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, settType: m[2], selectedStresses: m[1] === 'calm' ? [] : m[1].split('+'), selectedStressesRandom: false });
  m = /^rr2s-(\w+?)-([a-z_+]+?)-(rand|port)-(\d+)$/.exec(seed);
  return birthConfig({ ...DEFAULT_CONFIG, ...(m[3] === 'port' ? { tradeRouteAccess: 'port' } : {}), settType: m[1],
    selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true });
}
const birth = (seed) => generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
const tradesOf = (s) => (s.economicState?.incomeSources || []).filter((e) => e.source === 'Local Trades');

describe('#93: a small place\'s house of work earns', () => {
  const ROWS = [
    ['rr2s-thorp-calm-port-1', 'What the fishers land is sold here.'], // the reader's town: a Fishing community, rents its only other line
    ['rv2-famine-thorp-13', 'What the fishers land is sold here.'],
    ['rv2-wartime-thorp-5', 'The wood the woodcutters cut is sold here.'],
    ['rv2-calm-hamlet-25', 'The game and hides the hunters bring in are sold here.'],
    ['rv2-calm-village-3', 'What the miners dig is sold here.'],
    ['rv3-recently_betrayed-village-1', 'The stone the quarrymen cut is sold here.'],
  ];
  test('each town prints its trade\'s line beside its rents, and no house\'s stored name', () => {
    for (const [seed, text] of ROWS) {
      const s = birth(seed);
      const sources = s.economicState.incomeSources.map((e) => e.source);
      expect(sources, seed).toEqual(['Agricultural Rents', 'Local Trades']);
      expect(tradesOf(s)[0].desc, seed).toBe(text);
      const esc = (n) => String(n).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      expect(s.institutions.length, seed).toBeGreaterThan(0);
      expect(s.institutions.filter((i) => new RegExp(`\\b${esc(i.name)}\\b`, 'i').test(text)).map((i) => i.name), seed).toEqual([]); // the roster's names, whole
    }
  });
  test('the guards: no line where the rents are not alone, where no house of work stands, or in a town', () => {
    for (const seed of ['rv2-calm-thorp-10', 'rv2-calm-thorp-5', 'rv2-calm-town-0']) {
      const s = birth(seed);
      expect(s.economicState.incomeSources.length, seed).toBeGreaterThan(0);
      expect(tradesOf(s), seed).toEqual([]);
    }
  });
  test('under a siege the row prints its label and share alone', async () => {
    const { houseOfWorkLine } = await import('../../src/generators/economy/incomeLineSiblings.js');
    const rents = [{ source: 'Agricultural Rents' }];
    expect(houseOfWorkLine('thorp', rents, ['fishing community'], true)).toEqual({ source: 'Local Trades', percentage: 10, desc: '' });
    expect(houseOfWorkLine('thorp', rents, ['fishing community'], false)?.desc).toBe('What the fishers land is sold here.');
    expect(houseOfWorkLine('town', rents, ['fishing community'], false)).toBeNull();
  });
});
