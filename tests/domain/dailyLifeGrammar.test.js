/**
 * R3-CODE-C (the chair's addition of 2026-11-13; the defence lane's fourth read, C-L4): the daily-life lines the AI
 * grounding and the causal views carry (`${label}: ${text}`) had three grammar faults, measured on the census's 720
 * births: a possessive formed by hand on a plural power ("Merchant Guilds's mark", 102 lines), the slot's label
 * repeated inside its text ("Recent changes: Recent changes: …", 684), and one warning said twice ("the road past
 * sundown; …; the road past sundown", 45). Writer: src/domain/dailyLife.js (deriveOutsiderImpressions,
 * deriveRecentChanges, deriveChildWarnings, deriveUnspokenTopics).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { summarizeDailyLife } from '../../src/domain/dailyLife.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

// the census's own random births (REVIEW-AGREE-2's corpus shape: every dial random)
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const born = (seed, settType) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType }), null, { seed, customContent: {} });

describe('the daily-life lines read as sentences (C-L4)', () => {
  /** @type {string[]} */ let lines = [];
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    lines = [born('r2r-village-0', 'village'), born('r2r-thorp-0', 'thorp'), born('r2r-thorp-19', 'thorp')].flatMap(summarizeDailyLife);
  }, 120000);

  // DAILY-3 B3 E3 (LINES-2 § 3): the possessive line is now one of the power pool's keyed picks, so the three births need
  // not print it; the meaning is kept on a record whose top power is plural (a nameless record takes the pool's index 0,
  // the possessive line), and no born line forms the possessive by hand.
  // D4C-1 (the chair's E133 (3)): the line puts no possessive on the name at all ("the mark of {power}"; a name may hold
  // one itself, "the Headman's Authority's mark"); the meaning kept: a plural power reads right, and no line forms it by hand.
  it('a plural power reads right in the mark line ("the mark of the Merchant Guilds"), no possessive formed on it', () => {
    const planted = summarizeDailyLife({ powerStructure: { factions: [
      { id: 'faction.merchants', name: 'Merchant Guilds', faction: 'Merchant Guilds', power: 60 },
      { id: 'faction.council', name: 'Town Council', faction: 'Town Council', power: 30 },
    ] } });
    expect(planted.some((l) => /the mark of the Merchant Guilds on every door/.test(l))).toBe(true);
    expect(planted.filter((l) => /Merchant Guilds'/.test(l))).toEqual([]);
    expect([...lines, ...planted].filter((l) => /(?:ies|[bcdfghjklmnpqrtvwxyz]s)'s mark/.test(l))).toEqual([]);
  });
  it('no slot repeats its label inside its text', () => {
    expect(lines.filter((l) => /^([^:]+): \1:/.test(l))).toEqual([]);
  });
  it('a warning, a topic or a change is said once', () => {
    const doubled = lines.filter((l) => { const parts = l.replace(/^[^:]+: /, '').replace(/^(?:Children are warned about|Locals will not openly discuss|Outsiders notice|Commoners resent) /, '').replace(/\.$/, '').split(/; (?:or |and )?/); return new Set(parts).size < parts.length; });
    expect(doubled).toEqual([]);
  });
});
