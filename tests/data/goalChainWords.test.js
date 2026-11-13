/**
 * goalChainWords.test.js — POWERS-9 (ROUND-3-CUT-INCREMENT, data/people/goalFamilies.js, 12 medium lines): NO SLOT PRINTS
 * A CATALOGUE OR A CHAIN LABEL, AND A GOAL THAT PRESUMES BUYING, HIRING, LAYING IN STORES OR TRADE BY ROAD IS NOT DEALT
 * UNDER A SIEGE, NOR UNDER A FAMINE WHERE ITS OWN WORDS FAIL (the chair's rulings). "Wants Get the most out of Grain &
 * Bread while it runs well" (ww#1254, a siege), "Keep Food Processing going at the butchers" (pf#203), "Bring in from
 * outside what Iron & Metalwork can no longer get close to home" (pf#640), "Take on more hands for Brewing & Malting ..."
 * under a famine (pf#80), "Lay in a season of grain at the city granaries while it can still be had" under a siege
 * (ww#654). The SUPPLY lines name the work through {house} (the house's own display noun); {chain} is struck; the lines
 * whose words fail under a siege or a famine declare it on their `excludes` side.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { SUPPLY_CHAIN_NEEDS } from '../../src/data/supplyChainData.js';
import { GOAL_FAMILY_LINES } from '../../src/data/people/goalFamilies.js';

/** @param {string} seed */
function born(seed) {
  const m = seed.match(/^(?:rpf|rww)-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-\d+$/);
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false,
    selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
}
/** Every chain label of the catalogue. */
const LABELS = [...new Set(JSON.stringify(SUPPLY_CHAIN_NEEDS).match(/"label":"[^"]+"/g).map((s) => s.slice(9, -1)))];
const SIEGE_WORDS = /new source of supply|Bring in from outside|whoever can still supply|second supplier|Lay in a season|at the market in bulk|Take on more hands|Win new business|one more pair of hands|Get the most out of/;
const FAMINE_WORDS = /Take on more hands|one more pair of hands|Get the most out of/;
const lineOf = (/** @type {any} */ l) => (typeof l === 'string' ? l : l.line);

describe('POWERS-9 · the goal lines name no chain', () => {
  it('no SUPPLY line holds the {chain} slot; every line of the siege and famine words declares its exclusion', () => {
    const all = Object.values(GOAL_FAMILY_LINES).flatMap((fam) => Object.values(fam).flatMap((sub) => [...(sub.short || []), ...(sub.long || [])]));
    expect(all.filter((l) => lineOf(l).includes('{chain}'))).toEqual([]);
    const supply = Object.values(GOAL_FAMILY_LINES.SUPPLY).flatMap((sub) => [...sub.short]);
    for (const l of supply.filter((x) => SIEGE_WORDS.test(lineOf(x)))) expect(l.excludes, lineOf(l)).toContain('crisis: siege');
    for (const l of supply.filter((x) => FAMINE_WORDS.test(lineOf(x)))) expect(l.excludes, lineOf(l)).toContain('crisis: famine');
  });
});

describe('POWERS-9 · the readers\' towns', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it.each(['rww-city-under_siege-1', 'rww-village-under_siege-1', 'rpf-village-succession_void+famine-13', 'rpf-city-politically_fractured-13',
    'rpf-town-succession_void-13', 'rpf-metropolis-occupied-13', 'rpf-metropolis-politically_fractured-13'])('%s: no goal prints a chain label; none presumes trade under a siege', (seed) => {
    const s = born(seed);
    const goals = s.npcs.flatMap((c) => [c.goal?.short, c.goal?.long].filter(Boolean).map((g) => ({ g, short: g === c.goal?.short })));
    expect(goals.filter(({ g }) => LABELS.some((x) => g.includes(x))).map(({ g }) => g)).toEqual([]);
    const types = (Array.isArray(s.stress) ? s.stress : [s.stress]).filter(Boolean).map((x) => x.type);
    if (types.includes('under_siege')) expect(goals.filter(({ g, short }) => short && SIEGE_WORDS.test(g)).map(({ g }) => g)).toEqual([]);
    if (types.includes('famine')) expect(goals.filter(({ g, short }) => short && FAMINE_WORDS.test(g)).map(({ g }) => g)).toEqual([]);
  }, 60_000);
  it('THE GUARD: the reworded lines still print where true (rpf-metropolis-politically_fractured-13 keeps a SUPPLY line through its house)', () => {
    const s = born('rpf-metropolis-politically_fractured-13');
    expect(s.npcs.some((c) => /the work at the |^Waste nothing at |^Ration what is left at |^Find whoever can still supply /.test(c.goal?.short || ''))).toBe(true);
  }, 60_000);
});
