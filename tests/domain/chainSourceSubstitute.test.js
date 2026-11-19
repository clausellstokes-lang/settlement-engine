/**
 * chainSourceSubstitute.test.js — R2-CODE-B-13, the reader's M11 (REVIEW-R2-CODE-B-2026-11-14 §9; ruling (d), #804): a
 * chain whose catalogue ground is ABSENT names no ground (chainHouses.js :: chainSourceOf), and that took the "From"
 * off 891 chains of the 1,536 births that run on a SUBSTITUTE input the town HAS (r2r-hamlet-2: Livestock & Dairy on
 * alpine pastures; r2r-hamlet-16: fishing on river fisheries; r2r-thorp-3: foraging in an ancient grove). A count
 * falling is not a cure, and a line is in its pool unless the town makes it false. RULED (M11): a substitute chain
 * whose own input is present NAMES THAT INPUT, through the resource label leaf (the Resources tab's words).
 * COLLECTED over census towns (every absent-ground chain checked); KEEP-GUARD (an absent ground with no substitute
 * still names nothing; a worked ground keeps its own name); TAKEN-OFF GUARD (the corpus holds substitute chains).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { chainSourceOf } from '../../src/domain/display/chainHouses.js';
import { chainPrintName } from '../../src/domain/display/chainPrintName.js';
import { chainFlowFacts } from '../../src/components/new/SupplyChainsPanel.jsx';
import { resourceDisplayName } from '../../src/domain/display/resourceDisplayName.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
function cfgFor(seed) {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  throw new Error(seed);
}
/** The reader's three, and towns of the widest pairs (forage, beekeeping, leather, quarrying, coal, boats, timber, textiles, grain). */
const SEEDS = ['r2r-hamlet-2', 'r2r-hamlet-16', 'r2r-thorp-3', 'r2r-thorp-4', 'r2r-village-48', 'r2r-hamlet-5', 'r2r-town-1',
  'r2r-hamlet-15', 'r2r-village-2', 'r2r-hamlet-27', 'r2r-town-12', 'r2r-thorp-31', 'r2r-metropolis-0',
  // the keep-guard's towns: absent grounds with no substitute (entrepôt cities, an occupation, a famine)
  'r2r-city-41', 'r2s-occupied-city-2', 'r2s-famine-metropolis-2'];

/** @type {Array<{ seed: string, s: any, chains: any[] }>} */
const rows = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SEEDS) {
    const s = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
    rows.push({ seed, s, chains: [].concat(s.economicState?.activeChains || []) });
  }
}, 300000);

describe('M11: a substitute chain whose own input is present names that input', () => {
  test('COLLECTED: every absent-ground chain on a present substitute names it; KEEP: no substitute, no ground; a worked ground its own', () => {
    const wrong = [];
    let substitutes = 0;
    let bare = 0;
    let worked = 0;
    for (const { seed, s, chains } of rows) {
      for (const ch of chains) {
        const printed = chainPrintName(ch, s);
        if (printed && printed.resource !== ch.resource) continue; // a toll renamed by the town's access (its own test)
        const got = chainSourceOf(ch, printed);
        const card = chainFlowFacts(ch, [], printed).resource;
        if (ch.resourceCondition === 'absent' && ch.substituteActive && ch.resourceInputAvailable === true && ch.resourceInputCondition === 'available') {
          substitutes += 1;
          const want = resourceDisplayName(ch.resourceInputKey);
          if (got !== want || card !== want) wrong.push([seed, ch.chainId, 'substitute', want, got, card]);
        } else if (ch.resourceCondition === 'absent') {
          bare += 1;
          if (got !== null || card !== null) wrong.push([seed, ch.chainId, 'absent, no substitute', got, card]);
        } else if (ch.resourceCondition === 'available' && ch.resource) {
          worked += 1;
          if (got !== ch.resource) wrong.push([seed, ch.chainId, 'worked', ch.resource, got]);
        }
      }
    }
    expect(wrong).toEqual([]);
    expect(substitutes, 'TAKEN-OFF GUARD: the corpus holds substitute chains on a present input').toBeGreaterThanOrEqual(10);
    expect(bare, 'KEEP-GUARD: absent grounds with no substitute are in the corpus').toBeGreaterThanOrEqual(5);
    expect(worked, 'KEEP-GUARD: worked grounds are in the corpus').toBeGreaterThanOrEqual(10);
  });
});
