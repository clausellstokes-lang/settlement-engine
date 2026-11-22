/**
 * tests/generators/foodRecord.test.js — FOOD-1: ONE FOOD RECORD (fix shape D of
 * docs/GENERATION_ROOT_CAUSES_2026-11-02.md, appendix 1; chair ruling 1 of the FOOD lane,
 * 2026-11-03).
 *
 * THE DEFECT. "How fed is this place" had seven sets of cut-offs and four writers of "how
 * much is stored", so one settlement read Secure on the Overview, "starving" in a hook,
 * "Subsistence with surplus" in its economy line and "16 days of reserves" against 1.9 months
 * in the data. The cure derives ONE record (src/generators/economy/foodBalance.js ::
 * deriveFoodRecord), stores it once on economicState.foodSecurity.foodRecord, and the food
 * writers read it: the band, the flags, the prosperity modifier, the situation sentence, the
 * economy line's surplus words.
 */
import { describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { foodProsperityModOf } from '../../src/generators/foodGenerator.js';
import { deriveFoodRecord } from '../../src/generators/economy/foodBalance.js';
import {
  deriveEconomicComplexity,
  deriveEconomicSituationDesc,
} from '../../src/generators/economy/prosperity.js';
import { FOOD_SECURITY_BANDS, FOOD_SECURITY_CUTS, foodSecurityFlagsOf } from '../../src/data/bandLadders.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const corpus = (perTier) => TIERS.flatMap((tier) => Array.from({ length: perTier }, (_, i) => {
  const s = generateSettlementPipeline({ settType: tier }, null, { seed: `food-record-${tier}-${i}`, customContent: {} });
  return { tier, s, fs: s.economicState.foodSecurity };
}));

/** A metropolis one percent short of need with fifteen months in its state granary. */
const ONE_PERCENT_SHORT_METROPOLIS = Object.freeze({
  dailyNeed: 120000, dailyProduction: 118800, importCoverage: 0, magicOffset: 0,
  deficitPct: 1, surplusPct: 0, stressFamine: false, storageMonths: 15, hasGranary: true,
});

describe('FOOD-1 — one food record', () => {
  it('every settlement carries one food record, and its figures are the food security figures', () => {
    const rows = corpus(3);
    const disagreements = [];
    for (const { tier, fs } of rows) {
      const r = fs.foodRecord;
      if (!r) { disagreements.push(`${tier}: no record`); continue; }
      if (r.gapPct !== fs.deficitPct) disagreements.push(`${tier}: gap ${r.gapPct} vs ${fs.deficitPct}`);
      if (r.storageMonths !== fs.storageMonths) disagreements.push(`${tier}: months ${r.storageMonths} vs ${fs.storageMonths}`);
      if (FOOD_SECURITY_BANDS[r.band]?.label !== fs.label) disagreements.push(`${tier}: band ${r.band} vs ${fs.label}`);
      if (r.growsMoreThanEats !== (fs.dailyProduction > fs.dailyNeed)) disagreements.push(`${tier}: grows-more-than-eats disagrees`);
    }
    expect(disagreements).toEqual([]);
  });

  it('the flags cut the gap where the band does: one set of cut-offs', () => {
    // Inside (15, 20] the old flag ladder said "pressured" while the band said Import-Dependent.
    const flags = foodSecurityFlagsOf(false, 18, 0);
    expect(flags.isDeficit, 'a gap the band calls Import-Dependent is a deficit').toBe(true);
    expect(flags.isPressured, 'and not also merely pressured').toBe(false);
    expect(foodSecurityFlagsOf(false, FOOD_SECURITY_CUTS.importDependent, 0).isPressured).toBe(true);
  });

  it('a very large place one percent short with months in store reads Secure and is never called a surplus', () => {
    const record = deriveFoodRecord(ONE_PERCENT_SHORT_METROPOLIS);
    expect(record.band).toBe('secure');
    expect(record.growsMoreThanEats).toBe(false);
    expect(record.storageMonths).toBe(15);
    const words = [
      deriveEconomicComplexity('metropolis', 10, 5, true, record),
      deriveEconomicSituationDesc({ tier: 'metropolis', tradeRouteAccess: 'road' }, 'metropolis', [], { ...ONE_PERCENT_SHORT_METROPOLIS, foodRecord: record }),
    ].join(' ');
    expect(words).not.toMatch(/surplus/i); // anchored: the record above is a one-percent-short metropolis
  });

  it('a small place that grows less than it eats is never given surplus words by its economy line', () => {
    const short = deriveFoodRecord({ dailyNeed: 100, dailyProduction: 80, importCoverage: 10, magicOffset: 0, deficitPct: 10, surplusPct: 0, stressFamine: false, storageMonths: 1.5, hasGranary: false });
    const fed = deriveFoodRecord({ dailyNeed: 100, dailyProduction: 115, importCoverage: 0, magicOffset: 0, deficitPct: 0, surplusPct: 15, stressFamine: false, storageMonths: 1.5, hasGranary: false });
    for (const [tier, exports, market] of [['thorp', 4, false], ['hamlet', 3, false], ['village', 5, false], ['village', 1, false]]) {
      expect(deriveEconomicComplexity(tier, 3, exports, market, short), `${tier} short`).not.toMatch(/surplus/i); // anchored: the short record grows 80% of need
    }
    expect(deriveEconomicComplexity('thorp', 3, 4, false, fed)).toBe('Subsistence with surplus');
  });

  it('the situation sentence names the gap the record holds, after imports, at the band\'s own cut', () => {
    const fsAt = (deficitPct) => ({ deficitPct, foodRecord: deriveFoodRecord({ dailyNeed: 100, dailyProduction: 50, importCoverage: 50 - deficitPct, magicOffset: 0, deficitPct, surplusPct: 0, stressFamine: false, storageMonths: 1, hasGranary: false }) });
    const cfg = { tier: 'town', tradeRouteAccess: 'road' };
    const at18 = deriveEconomicSituationDesc(cfg, 'town', [], fsAt(18));
    // RE-KEYED 2026-11-09 (STYLE-2 SW-7, STYLE-RULINGS-2 A2: the per-cent slot leaves the sentence; the record's
    // band speaks): Import-Dependent (over 15) reads "part of", Deficit (over 40) "much of"; "after imports" is
    // "even with what is brought in". Was /18% of daily need/ and /after imports/i.
    expect(at18).toMatch(/go short of part of the food they need each day/);
    expect(at18).toMatch(/even with what is brought in/i);
    expect(deriveEconomicSituationDesc(cfg, 'town', [], fsAt(45))).toMatch(/go short of much of the food/);
    expect(deriveEconomicSituationDesc(cfg, 'town', [], fsAt(FOOD_SECURITY_CUTS.importDependent))).not.toMatch(/the food they need each day/); // anchored: at the cut the band is Pressured
  });

  it('the prosperity modifier cuts the gap where the band does', () => {
    const base = { stressFamine: false, terrainStructural: false, magicMitigated: false, surplusPct: 0, activeChainsCount: 2, hasGranary: false };
    expect(foodProsperityModOf({ ...base, deficitPct: 7 })?.type, 'Pressured (over 5) costs a level').toBe('penalty');
    expect(foodProsperityModOf({ ...base, deficitPct: 18 })?.type, 'Import-Dependent (over 15) caps').toBe('cap');
    expect(foodProsperityModOf({ ...base, deficitPct: FOOD_SECURITY_CUTS.pressured }), 'at the cut the band is Secure').toBe(null);
  });
});
