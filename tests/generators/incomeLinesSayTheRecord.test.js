/**
 * incomeLinesSayTheRecord.test.js — UPKEEP-8, step 1 (the chair's ruling on the round-three cut's income lines,
 * 2026-11-13): an income line says only what the record holds. It names a trade only where the roster holds a
 * house of that trade (an apothecary is not an alchemist); under a siege nothing is bought in or sold out by road;
 * an impaired chain is not described as working. `incomeLineSiblings.js :: trueIncomeDesc` gives each original its
 * declared twin, or no sentence, from the finished record.
 *
 * THE GUARDS are the reader's own towns, born in the reader's shape (the configuration panel's, every other dial
 * random): in each, the cured line must not print. THE ANCHOR is a town where the original is true and still prints.
 * THE LAW runs over births of every crisis the lines can print under; it carries the measuring seat's census lines in
 * this family too (CENSUS-2: sawmilling with no sawmill; tolls, customs and transit trade under a siege). Red at the
 * lane's base (995293e81).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import {
  ALCHEMY_TRADE_LINE, GRAIN_BOUGHT_LINE, IRON_IMPORTED_LINE, LOCAL_COAL_LINE, LOCAL_COAL_SOLD_LINE, QUARRY_LINE, FISH_EXPORT_LINE,
  WOOL_LOCAL_LINE, TITHES_RENTS_LINE, TITHES_RENTS_PLAIN_LINE, REMEDIES_SHORT_LINE, METAL_WORKED_LINE, WOOL_LOCAL_WORKED_LINE,
  ALCHEMY_UNDER_SIEGE_LINE, INCOME_STATE_SIBLINGS, SIEGE_CLOSED_SOURCES, GRAIN_OWN_FIELDS_LINE,
} from '../../src/generators/economy/incomeLineSiblings.js';

beforeAll(async () => { await loadGenerationLawPayloads(); });

/** The reader's shape: rr2s-<size>-<crisis|calm>-<route|rand>-<i>, rww-<size>-<crisis|calm>-<i>. */
function cfgFor(seed) {
  const m = /^(rr2s|rww)-(\w+?)-([a-z_+]+?)(?:-(rand|port))?-(\d+)$/.exec(seed);
  if (!m) throw new Error(seed);
  return birthConfig({ ...DEFAULT_CONFIG, ...(m[4] === 'port' ? { tradeRouteAccess: 'port' } : {}), settType: m[2],
    selectedStressesRandom: false, selectedStresses: m[3] === 'calm' ? [] : m[3].split('+'), _randomizePriorities: true });
}
const birth = (seed) => generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
const lines = (s) => (s.economicState?.incomeSources || []).map((e) => e.desc);

describe('the reader\'s towns: the cured line does not print', () => {
  const ROWS = [
    ['rr2s-town-under_siege-rand-1', ALCHEMY_TRADE_LINE, REMEDIES_SHORT_LINE], // #439: an apothecary, the herbs short, a siege
    ['rr2s-town-under_siege-rand-1', LOCAL_COAL_SOLD_LINE, null], // #501: nothing sold out by road under a siege
    ['rr2s-town-under_siege-rand-1', GRAIN_BOUGHT_LINE, null], // #438: nothing bought in under a siege
    ['rr2s-town-under_siege-rand-1', WOOL_LOCAL_LINE, WOOL_LOCAL_WORKED_LINE], // #437: no fullers, and no cloth sold across the region
    ['rr2s-hamlet-calm-rand-1', IRON_IMPORTED_LINE, null], // #145: no smithy, no iron brought in
    ['rr2s-village-famine-rand-1', QUARRY_LINE, null], // #277: a stone resource, no quarry house
    ['rr2s-town-indebted-port-1', FISH_EXPORT_LINE, null], // #621: no fishing house
    ['rr2s-city-under_siege+famine-rand-1', FISH_EXPORT_LINE, null], // #910: no fishing house, and a siege
    ['rr2s-city-under_siege+famine-rand-1', ALCHEMY_TRADE_LINE, ALCHEMY_UNDER_SIEGE_LINE], // an alchemist, under a siege
    ['rr2s-metropolis-wartime-rand-1', LOCAL_COAL_LINE, METAL_WORKED_LINE], // #1301: no iron among the imports
    ['rww-metropolis-wartime-1', TITHES_RENTS_LINE, TITHES_RENTS_PLAIN_LINE], // #ww-414: the third source does not dominate
  ];
  test("each reader's town: the cured line does not print, and its twin or the silent row does", () => {
    for (const [seed, cured, twin] of ROWS) {
      const printed = lines(birth(seed));
      if (twin) expect(printed).toContain(twin);
      else expect(printed).toContain(''); // the row prints its source and share alone
      expect(printed).not.toContain(cured); // anchored: the twin, or the silent row, was asserted present on the line above
    }
  });
  test('the anchor: where an alchemist house stands and no siege, the original prints', () => {
    const s = birth('rr2s-metropolis-wartime-rand-1'); // #1248's town: at this tip its roster holds an Alchemist quarter
    expect(s.institutions.some((i) => /alchemist/i.test(i.name))).toBe(true);
    expect(lines(s)).toContain(ALCHEMY_TRADE_LINE);
  });
});

describe('the law, over births of every crisis the lines print under', () => {
  const CRISES = [[], ['under_siege'], ['famine'], ['occupied'], ['wartime'], ['under_siege', 'famine']];
  const SIZES = ['village', 'town', 'city', 'metropolis'];
  const seeds = SIZES.flatMap((t) => CRISES.flatMap((c, ci) => [0, 1, 2].map((i) => `rr2s-${t}-${c.length ? c.join('+') : 'calm'}-rand-${10 + ci * 3 + i}`)));
  test('no line names an absent house, trades by road under a siege, or calls an impaired chain thriving', () => {
    let alch = 0, siegeRows = 0;
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      const s = birth(seed);
      const names = s.institutions.map((i) => String(i.name).toLowerCase());
      const has = (re) => names.some((n) => re.test(n));
      const siege = (s.config.stressTypes || []).includes('under_siege');
      const impaired = (re) => (s.economicState.activeChains || []).some((c) => re.test(c.label || '') && c.status === 'impaired');
      for (const d of lines(s)) {
        if (/alchemi/i.test(d)) { alch++; expect(has(/alchemist/), `${seed}: ${d}`).toBe(true); }
        if (d === ALCHEMY_TRADE_LINE) expect(siege || impaired(/^(?:Alchemy|Herbalism)\b/), `${seed}: ${d}`).toBe(false);
        if (siege) { siegeRows++; expect(/\b(?:imported|bought|purchased|sold to the forges of other towns|regional export|regional builders|across the region|surrounding settlements)\b/.test(d), `${seed}: ${d}`).toBe(false); }
        if (/feeds the smithy/.test(d)) expect(has(/smith/), `${seed}: ${d}`).toBe(true);
        if (/^Local quarry\b/.test(d)) expect(has(/quarr/), `${seed}: ${d}`).toBe(true);
        if (d === FISH_EXPORT_LINE) expect(has(/fisher|fishing/), `${seed}: ${d}`).toBe(true);
        if (/sawmilling/.test(d)) expect(has(/sawmill|lumber/), `${seed}: ${d}`).toBe(true);
      }
      // the census's siege lines (CENSUS-2): tolls on the roads, at the gates, customs and transit trade print no sentence
      for (const e of s.economicState.incomeSources) if (siege && SIEGE_CLOSED_SOURCES.includes(e.source)) expect(e.desc, `${seed}: ${e.source}`).toBe('');
    }));
    expect(alch, 'an alchemist line printed somewhere in the corpus').toBeGreaterThan(0);
    expect(siegeRows, 'sieges were read').toBeGreaterThan(0);
  });
});

describe('the declarations', () => {
  test('each set opens on its original, each twin answers it, and every original prints from economicState.js by its constant', async () => {
    const { readFileSync } = await import('node:fs');
    const site = readFileSync(new URL('../../src/generators/economy/economicState.js', import.meta.url), 'utf8');
    for (const [key, set] of Object.entries(INCOME_STATE_SIBLINGS)) {
      expect(set[0].text).toBe(key);
      for (const twin of set.slice(1)) expect(twin.twinOf).toBe(key);
    }
    for (const name of ['ALCHEMY_TRADE_LINE', 'ALCHEMIST_SUPPLEMENTS_LINE', 'GRAIN_BOUGHT_LINE', 'WOOL_LOCAL_LINE', 'WOOL_BOUGHT_LINE', 'LOCAL_ORE_LINE', 'IRON_IMPORTED_LINE', 'FISH_EXPORT_LINE', 'QUARRY_LINE', 'MASONS_LINE', 'TIMBER_LINE', 'TIMBER_BOUGHT_LINE']) {
      expect(site, name).toMatch(new RegExp(`\\b${name}\\b,?(?:\\s*//.*)?$`, 'm'));
    }
  });
});

/**
 * UPKEEP-10, THE GRAIN LINE (the eighth seat's LEFT 1 (a); the chair, 2026-11-14 00:20; #ww-339, #ww-1357). The
 * own-fields twin says the town's grain is "sold within the settlement ... none is left to sell to other
 * settlements". It was chosen wherever the grain line stood and the food record held no surplus, and read neither a
 * failed grain harvest nor a grain or flour export. `trueIncomeDesc` now gives it no sentence where the food record
 * names grain as the failed source or the final export list sells grain or flour: the row prints its source and share
 * alone (silence, not a false sentence). Red at the lane's tip 1bdf565ec.
 */
describe('the grain line: none left to sell, only where none is sold and the harvest stands', () => {
  const GRAIN_SOLD_OUT = /\b(?:grain|flour)\b/i;
  const grainRow = (s) => (s.economicState?.incomeSources || []).find((e) => e.source === 'Grain Sales');
  test("the reader's towns (#ww-339: the grain harvest failed, flour sold out; #ww-1357: flour sold out) and a calm town selling flour: the line does not print", () => {
    for (const seed of ['rww-metropolis-famine-1', 'rww-city-recently_betrayed-1', 'rr2s-town-calm-rand-1']) {
      const s = birth(seed);
      expect(grainRow(s)?.desc, seed).toBe(''); // the Grain Sales row stands, with no sentence
      expect(lines(s), seed).not.toContain(GRAIN_OWN_FIELDS_LINE); // anchored: the row was asserted present above
    }
  });
  test('the anchor: a city under a siege, no flour sold and the harvest standing, keeps the line', () => {
    const seed = 'rv2-under_siege-city-0'; // the lane's 1,490 (UPKEEP-8's shape: no randomized priorities)
    const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'city', selectedStresses: ['under_siege'], selectedStressesRandom: false }), null, { seed, customContent: {} });
    expect(s.economicState.foodSecurity.foodRecord.failedSource).not.toBe('grain');
    expect(s.economicState.primaryExports.some((x) => GRAIN_SOLD_OUT.test(String(x)))).toBe(false);
    expect(grainRow(s)?.desc).toBe(GRAIN_OWN_FIELDS_LINE);
  });
  test('the law, over births of every crisis: the line never stands beside a failed grain harvest or grain or flour sold out', () => {
    const CRISES = ['calm', 'famine', 'wartime', 'under_siege', 'recently_betrayed', 'indebted'];
    const seeds = ['town', 'city', 'metropolis'].flatMap((t) => CRISES.flatMap((c) => [40, 41, 42, 43].map((i) => `rr2s-${t}-${c}-rand-${i}`)));
    let silenced = 0;
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      const s = birth(seed);
      const row = grainRow(s);
      if (!row) return;
      const failed = s.economicState.foodSecurity?.foodRecord?.failedSource === 'grain';
      const soldOut = (s.economicState.primaryExports || []).some((x) => GRAIN_SOLD_OUT.test(String(x)));
      if (failed || soldOut) { silenced++; expect(row.desc, `${seed}: failed=${failed} soldOut=${soldOut}`).not.toBe(GRAIN_OWN_FIELDS_LINE); }
    }));
    expect(silenced, 'a failed grain harvest or a flour export was read beside a grain row').toBeGreaterThan(0);
  });
});
