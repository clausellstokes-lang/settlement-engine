/**
 * journalChainStateIsTheCards.test.js — W2-C-LEAVES-7 item 9: THE JOURNAL'S CHAIN LINE PRINTS THE STATE THE TAB'S CARD
 * PRINTS, AND A CHAIN RUN ONLY THROUGH AN "ACCESS TO ..." ROW IS NOT RUN HERE.
 *
 * The Economics tab's card reads the crisis a town is under (`domain/display/chainStateShown.js`: a famine that failed
 * the chain's ground, a siege that stopped field work); its reader moved into that leaf (`chainAsShown`) and the Foundry
 * journal's "Supply chains" line reads it, one call site. The journal printed the record's calm state ("running" for a
 * grain chain whose card prints "impaired", r2r-hamlet-0). Record 375: a chain whose only house is reached through an
 * "Access to ..." row is not run here, siege or none: a River Mill card printed "✓ Running" where the only mill is
 * "Access to external mill" (r2r-hamlet-18); it prints no state, and the journal's line writes none.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { chainStateShown } from '../../src/domain/display/chainStateShown.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** The census's 720 in the app's own shape (SECOND-WAVE-CENSUS/births.mjs :: cfgFor, the r2r- arm). @param {string} seed */
const birth720 = (seed) => {
  const m = /** @type {RegExpMatchArray} */ (seed.match(/^r2r-(\w+)-\d+$/));
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, tradeRouteAccess: 'random_trade', culture: 'random_culture',
    monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
    magicExists: true, contentProfile: 'grounded', settType: m[1] }), null, { seed, customContent: {} });
};
/** The journal's "Supply chains" lines, in the record's order. @param {any} town @returns {string[]} */
const chainLines = (town) => {
  const lines = (buildJournalPages(buildViewModel({ settlement: town }), { settlement: town })
    .find((p) => p.name === 'Economics & Trade')?.markdown || '').split('\n');
  const at = lines.indexOf('## Supply chains');
  return at < 0 ? [] : lines.slice(at + 1).filter((l) => l.startsWith('- '));
};
/** @param {any} town @param {string} chainId */
const chainOf = (town, chainId) => {
  const i = town.economicState.activeChains.findIndex((/** @type {any} */ c) => c.chainId === chainId);
  return { i, chain: town.economicState.activeChains[i] };
};
const stateOf = (/** @type {string} */ line) => line.match(/^- \*\*.*?\*\*(?: \*\((.*?)\)\*)?/)?.[1] ?? '';

describe('the journal\'s chain line prints the card\'s state (W2-C-LEAVES-7 item 9)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  test('a River Mill whose only mill is "Access to external mill" is not run here: no state on the card or the journal (r2r-hamlet-18)', () => {
    const town = birth720('r2r-hamlet-18');
    const { i, chain } = chainOf(town, 'river_milling');
    expect(chain?.status, 'anchored: the record says running').toBe('running');
    expect(town.institutions.map((/** @type {any} */ x) => x.name).filter((n) => /mill/i.test(n)), 'anchored: the only mill').toEqual(['Access to external mill']);
    expect(chainStateShown(chain, town), 'the card prints no state').toBe('');
    expect(stateOf(chainLines(town)[i]), 'the journal writes no state').toBe('');
  }, 120000);

  test('a grain chain whose card prints "impaired" is impaired on the journal too (r2r-hamlet-0)', () => {
    const town = birth720('r2r-hamlet-0');
    const { i, chain } = chainOf(town, 'grain');
    expect(chainStateShown(chain, town), 'anchored: the card').toBe('impaired');
    expect(stateOf(chainLines(town)[i])).toBe('impaired');
  }, 120000);

  test('the guard town: a River Mill with a mill of its own keeps "running" on both (r2r-village-27)', () => {
    const town = birth720('r2r-village-27');
    const { i, chain } = chainOf(town, 'river_milling');
    expect(chainStateShown(chain, town)).toBe('running');
    expect(stateOf(chainLines(town)[i])).toBe('running');
  }, 120000);
});
