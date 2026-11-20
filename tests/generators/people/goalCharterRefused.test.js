/**
 * goalCharterRefused.test.js — POWERS-9 (ROUND-3-CUT-INCREMENT pf#51, pf#421): THE HOUSE'S RIGHTS FROM THOSE WHO GOVERN
 * ARE NO GOAL OF A CRIMINAL HOUSE, NOR OF THE HEAD OF THE GOVERNING POWER. "Wants Have those who govern confirm, in
 * writing, who may give orders at the smuggling network." (a veiled criminal house, rpf-city-calm-13); "Wants Win the
 * governor's office first call on any help those who govern can give this season." (the governor, who holds the seat,
 * rpf-metropolis-calm-13). The INSTITUTION charter lines stay in the draw marked refused, and a refused pick takes the
 * next admitted candidate, draw-free (generators/people/goals.js :: familyCandidates, drawVantage, admittedAfter).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { GOAL_FAMILY_LINES } from '../../../src/data/people/goalFamilies.js';
import { criminalHousesOf } from '../../../src/domain/people/allegiance.js';

/** @param {string} seed */
function born(seed) {
  const m = seed.match(/^rpf-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-\d+$/);
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false,
    selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
}
const CHARTER = [...GOAL_FAMILY_LINES.INSTITUTION.charter.short, ...GOAL_FAMILY_LINES.INSTITUTION.charter.long]
  .map((l) => new RegExp('^' + String(typeof l === 'string' ? l : l.line).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace('\\{house\\}', '.+') + '$'));
const isCharter = (/** @type {string} */ g) => CHARTER.some((re) => re.test(g));

describe('POWERS-9 · the charter goals', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('every seed: no criminal house and no head of the governing power holds one', () => {
    expectNoSeedFailures(collectSeedFailures(['rpf-city-calm-13', 'rpf-metropolis-calm-13', 'rpf-town-calm-13', 'rpf-hamlet-calm-13'], (seed) => {
    const s = born(seed);
    const crim = new Set(criminalHousesOf(s).map((h) => h.name));
    const gov = (s.powerStructure?.factions || []).find((f) => f.isGoverning)?.faction;
    const bad = s.npcs.filter((c) => [c.goal?.short, c.goal?.long].some((g) => g && isCharter(g))
      && (crim.has(c.institution?.key) || (c.memberships || []).some((m) => m.power === gov && m.rank === 1)));
    expect(bad.map((c) => `${c.name}, ${c.title}: ${c.goal?.short} / ${c.goal?.long}`)).toEqual([]);
  }), 'every seed: no criminal house and no head of the governing power holds one');
  }, 240_000);
  it('THE GUARD: a lawful house\'s card keeps its charter goal (rpf-city-calm-13, the tailor\'s guild)', () => {
    const s = born('rpf-city-calm-13');
    expect(s.npcs.some((c) => c.goal?.short === "Have those who govern confirm, in writing, who may give orders at the tailor's guild.")).toBe(true);
  }, 60_000);
});
