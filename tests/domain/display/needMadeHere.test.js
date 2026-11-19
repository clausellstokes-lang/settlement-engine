/**
 * needMadeHere.test.js — W2-C-LEAVES R2 (2026-11-13; the chair's ruling on REVIEW-R2-STAGES finding 2, HIGH, this
 * lane's origin): "Needed, and not brought in: …" named goods the town makes itself (174 of 1,649 needs in 149 towns
 * of the census's 720): "spices" beside an export of "Rare spices and exotic dyes", "iron ore" beside a working iron
 * mine, "desert salt" in a salt entrepôt.
 *
 * A need leaves the line where the town exports the good, produces it locally (as printed), or a working chain of
 * the record makes it (`tradeListDisplay.js :: importsAsPrinted`, its `needed`), matched as an import is (`needMetBy`).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { configOf } from '../../components/pageCensusWalk.shared.mjs';
import { importsAsPrinted, needMetBy } from '../../../src/domain/display/tradeListDisplay.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

/** The census's shape. @param {string} seed */
const birthCensus = (seed) => {
  const parts = seed.split('-');
  const size = parts.at(-2); const crisis = seed.startsWith('r2s-') ? parts.slice(1, -2).join('-') : null;
  return generateSettlementPipeline(configOf({ size, crisis }, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
};
/** @param {Record<string, unknown>} eco @param {string[]} critical */
const town = (eco, critical) => ({ name: 'Testford', tier: 'town', config: { nearbyResources: [] }, institutions: [],
  economicState: { primaryImports: [], primaryExports: [], localProduction: [], activeChains: [], ...eco },
  resourceAnalysis: { imports: { critical } } });

describe('a need the town makes is not printed as needed (R2)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('the unit: an export, a working chain\'s output or resource, and a made good meet the need; an idle chain does not', () => {
    expect(importsAsPrinted(town({ primaryExports: ['Rare spices and exotic dyes'] }, ['spices'])).needed).toEqual([]);
    expect(importsAsPrinted(town({ activeChains: [{ status: 'running', resource: 'Iron ore deposits', outputs: ['Pig iron'], label: 'Iron & Metalwork' }] }, ['iron ore'])).needed).toEqual([]);
    expect(importsAsPrinted(town({ activeChains: [{ status: 'impaired', resource: 'Iron ore deposits', outputs: ['Pig iron'], label: 'Iron & Metalwork' }] }, ['iron ore'])).needed).toEqual(['iron ore']);
    expect(importsAsPrinted(town({}, ['clay'])).needed).toEqual(['clay']);
    expect(needMetBy('Preserved provisions for winter', 'Preserved foods'), 'preserved food is a preserved provision').toBe(true);
  });

  test('the reader\'s towns: no need printed that the town exports, makes or works (REVIEW-R2-STAGES finding 2)', () => {
    const seeds = ['r2s-occupied-metropolis-1', 'r2r-metropolis-33', 'r2r-city-2', 'r2r-hamlet-18', 'r2s-plague_onset-city-3'];
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      const t = birthCensus(seed);
      const eco = t.economicState;
      const made = [...(eco.primaryExports || []), ...(eco.activeChains || [])
        .filter((/** @type {any} */ c) => ['running', 'operational', 'entrepot', 'vulnerable', 'magically_sustained'].includes(c.status))
        .flatMap((/** @type {any} */ c) => [c.resource, ...(c.outputs || []), c.label])].filter(Boolean).map(String);
      const needed = importsAsPrinted(t).needed;
      expect(needed.filter((n) => made.some((m) => needMetBy(n, m))), seed).toEqual([]);
    }), 'a need printed that the town makes');
  }, 240000);
});
