/**
 * THE ARCANE ADVISORY LINES NAME PRACTITIONERS ONLY WHERE SOMEONE WORKS MAGIC (TAIL-CONTENT-CLOSE-1, 2026-11-15).
 *
 * "Magical practitioners are consulted but not formally empowered …" printed as a power's description in 9 of the
 * census's 720 births (20 of 245 in the presumed-things walker's corpus) where the magic reading's own reader
 * (magicReliance.js :: magicPractitioners) finds no one. The line is settled on the final record
 * (claimStanding.js :: settleArcaneToPractitioners): where no one works magic it takes its twin, said without them.
 * The anchors are the shipped pairs (ARCANE_WITHOUT_PRACTITIONERS), never a literal sentence.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';
import { ARCANE_WITHOUT_PRACTITIONERS } from '../../../src/generators/power/claimStanding.js';
import { magicPractitioners } from '../../../src/domain/magicReliance.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';

// the census's own dials (CENSUS-3 seedcfg.mjs, the r2r- arm): the births where the line was measured
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
  selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SEEDS = Array.from({ length: 30 }, (_, i) => `r2r-metropolis-${i + 1}`);

/** @param {string} seed */
const birth = (seed) => generateSettlementPipeline(
  birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: 'metropolis' }), null, { seed, customContent: {} });

describe('the arcane advisory lines read the town\'s practitioners', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('a town where no one works magic hears the twin; a town with practitioners hears them named', () => {
    const seen = { none: 0, some: 0 };
    // seed-loop: collected — every birth is judged, and a red names each seed that printed a false line
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const town = birth(seed);
      const text = (town.powerStructure?.factions || []).map((f) => String(f?.desc || '')).join('\n');
      const pair = ARCANE_WITHOUT_PRACTITIONERS.find(([said, twin]) => text.includes(said) || text.includes(twin));
      if (!pair) return;
      const [said, twin] = pair;
      if (magicPractitioners(town).length === 0) { seen.none++; expectAbsentWithAnchor(text, said, twin, `${seed}: no one works magic`); }
      else { seen.some++; expectAbsentWithAnchor(text, twin, said, `${seed}: practitioners stand`); }
    });
    expectNoSeedFailures(failures, 'the arcane advisory line reads the practitioners');
    // both arms live
    expect(seen.none, 'no town without practitioners printed the line').toBeGreaterThan(0);
    expect(seen.some, 'no town with practitioners printed the line').toBeGreaterThan(0);
  }, 120_000);
});
