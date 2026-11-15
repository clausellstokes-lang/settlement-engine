/**
 * tests/generators/tailDefecon5RecordCures.test.js — TAIL-DEFECON-5 (2026-11-15; rulings R1 to R5 of 04:40 UTC on
 * RECORD-MEASURE-3; `docs/chair/2026-11-14/tail/TAIL-DEFECON-HANDBACK.md`): five record cures, each a DECLARED MOVE, each
 * guarded here on the census's own births. Every GONE pair is a town where the record held the fault at the base
 * (694621784) and names what it holds instead; every KEEP pair is a town where the record was already true, and stays so.
 *
 * (R3) ONE FOOD LEDGER: the viability's food balance READS the writer's split, so its shortfall is the Economics tab's
 * own remainder (`foodRowShown.js`) and its import the writer's, pound for pound.
 * (R2) ONE SHADOW FIGURE: a criminal income row is held at the capture the Shadow Economy section prints, in both
 * normalisers; the lawful rows share the rest (the shares still sum to 100).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { foodRowShown } from '../../src/domain/display/foodRowShown.js';
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

/** R3: [seed, the tab's shortfall (lb/day) the view must now hold, its old figure at the base] */
const R3_GONE = [
  ['r2s-succession_void-metropolis-3', 2035, 0],
  ['r2s-wartime-metropolis-2', 20281, 19232],
  ['r2s-under_siege-hamlet-2', 65, 66],
  ['r2r-thorp-32', 1, 2],
];
/** R3: [seed, the shortfall both homes already shared] */
const R3_KEEP = [['r2r-city-20', 1033], ['r2s-under_siege-town-3', 3331]];

/** R2: [seed, the capture the row must now read, the row's old share at the base] */
const R2_GONE = [['r2s-slave_revolt-metropolis-3', 46, 16], ['r2s-under_siege-metropolis-3', 45, 18], ['r2r-city-17', 18, 9], ['r2r-city-19', 23, 11]];
/** R2: [seed, the capture its row already read] */
const R2_KEEP = [['r2r-village-21', 13], ['r2s-indebted-hamlet-2', 20]];

/** @type {Record<string, any>} */
const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...R3_GONE, ...R3_KEEP, ...R2_GONE, ...R2_KEEP].map((r) => String(r[0])))) towns[seed] = censusBirth(seed);
}, 300_000);

/** The two homes of the food balance: the writer's row as the tab prints it, and the viability's view. @param {any} s */
const ledgers = (s) => {
  const fs = s.economicState.foodSecurity; const view = s.economicViability.metrics.foodBalance; const row = foodRowShown(s, true);
  return { tabShort: row?.fb.deficit ?? 0, tabPct: row?.deficitPct ?? 0, writerImport: Math.round(Number(fs.importCoverage) || 0),
    viewShort: view.deficit ?? 0, viewPct: view.deficitPercent ?? 0, viewImport: view.importCoverage ?? 0 };
};

describe('(R3) one food ledger: the viability reads the writer\'s split, and its shortfall is the tab\'s', () => {
  for (const [seed, short, old] of R3_GONE) {
    test(`${seed}: the view's shortfall is ${short} lb/day (the tab's), not ${old}`, () => {
      const l = ledgers(towns[seed]);
      expect(l.tabShort).toBe(short);
      // the old figure is gone from the view's shortfall, anchored on the tab's figure the same view now holds (TAIL-DEFECON-6)
      expectAbsentWithAnchor([l.viewShort], old, short, `${seed}: the view's shortfall`);
      expect([l.viewShort, l.viewPct, l.viewImport]).toEqual([l.tabShort, l.tabPct, l.writerImport]);
    });
  }
  for (const [seed, short] of R3_KEEP) {
    test(`KEEP ${seed}: both homes still read ${short} lb/day`, () => {
      const l = ledgers(towns[seed]);
      expect([l.tabShort, l.viewShort]).toEqual([short, short]);
      expect([l.viewPct, l.viewImport]).toEqual([l.tabPct, l.writerImport]);
    });
  }
});

/** The criminal income row's share, the capture, and the shares' sum. @param {any} s */
const shadow = (s) => {
  const rows = s.economicState.incomeSources ?? [];
  return { row: rows.find((/** @type {any} */ e) => e.isCriminal)?.percentage, capture: s.economicState.safetyProfile?.blackMarketCapture,
    sum: rows.reduce((/** @type {number} */ a, /** @type {any} */ e) => a + e.percentage, 0) };
};

describe('(R2) one shadow figure: the criminal income row reads the capture the Shadow Economy section prints', () => {
  for (const [seed, capture, old] of R2_GONE) {
    test(`${seed}: the criminal row is ${capture}% (the capture), not ${old}%`, () => {
      expect(shadow(towns[seed])).toEqual({ row: capture, capture, sum: 100 });
    });
  }
  for (const [seed, capture] of R2_KEEP) {
    test(`KEEP ${seed}: the row still reads its capture, ${capture}%`, () => {
      expect(shadow(towns[seed])).toEqual({ row: capture, capture, sum: 100 });
    });
  }
});
