/**
 * tests/generators/tailTies3Batch1.test.js — TAIL-TIES-3 batch 1 (the chair's ruling (T11) of 2026-11-15, vetoable by the
 * owner): `npcStructure.js :: reg`, a card's structural row claims no house and no rival the record does not give.
 *   (a) the trade's subordinate rows ("Runs a smaller house behind the leading one", "the bigger houses") need a power of the
 *       trade in the town: where none stands the card reads no row (it keeps its own goal and claims no position).
 *   (b) the 'contested' rows (public legitimacy in the contested band: many doubt the seat's right) claim no rival claimant.
 * NOT pairs: each printed at f00b248fe (the 720 census, by record); each names what prints instead.
 * KEEP pairs: a true print at the base that still prints.
 *
 * @enforced-by npx vitest run tests/generators/tailTies3Batch1.test.js
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** The census's births (`births.mjs :: cfgFor` and `seedcfg.mjs`'s r2s arm), as tailTiesBatch1 holds them. @param {string} seed @returns {any} */
const born = (seed) => {
  const r2r = /^r2r-(\w+)-\d+$/.exec(seed);
  if (r2r) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: r2r[1] }), null, { seed, customContent: {} });
  const r2s = /** @type {RegExpExecArray} */ (/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed));
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [r2s[1]], selectedStressesRandom: false, settType: r2s[2] }), null, { seed, customContent: {} });
};
/** @type {Map<string, any>} */
const cache = new Map();
const town = (/** @type {string} */ seed) => { if (!cache.has(seed)) cache.set(seed, born(seed)); return cache.get(seed); };
const card = (/** @type {string} */ seed, /** @type {string} */ name) => (town(seed).npcs || []).find((/** @type {any} */ n) => n.name === name);

describe('TAIL-TIES-3 batch 1', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('NOT (a): no "smaller house behind the leading one" where the town holds no house of the trade; the card claims no position', () => {
    // the rows as substrings (each was a plain-literal regex: exactly equivalent); the anchor is the seat-holder's own
    // structural row, which the same writer (`npcStructure.js :: reg`) prints on the same cards
    const NOT = [
      ['r2r-hamlet-57', 'Runs a smaller house behind the leading one in quiet times', 'Growing into the leading house'],
      ['r2r-hamlet-9', 'Runs a smaller house behind the leading one in the trade while the seat fails', 'disorder that lets the house get ahead'],
      ['r2r-hamlet-2', 'bigger houses take more of the trade', 'big houses leave alone'],
    ];
    const failures = collectSeedFailures(NOT, ([seed, position, constraint]) => {
      const s = town(/** @type {string} */ (seed));
      const printed = (s.npcs || []).map((/** @type {any} */ n) => `${n.structuralPosition ?? ''} ${n.activeConstraint ?? ''}`).join(' | ');
      expectAbsentWithAnchor(printed, position, 'Holds the seat', seed);
      expectAbsentWithAnchor(printed, constraint, 'Holds the seat', seed);
      expect((s.powerStructure?.factions || []).some((/** @type {any} */ f) => f.category === 'economy'), seed).toBe(false);
    });
    expectNoSeedFailures(failures, 'no trade-house row and no trade power where the town holds no house of the trade');
    // what prints instead: the card keeps its own goal and no structural position (the refusal's rule)
    const stableKeeper = (town('r2r-hamlet-57').npcs || []).find((/** @type {any} */ n) => n.title === 'the stable keeper');
    expect(stableKeeper.structuralPosition).toBeUndefined();
    expect(stableKeeper.goal?.short).toBeTruthy();
  });

  it('KEEP (a): a lesser trade house behind a leading one still reads its row', () => {
    const s = town('r2r-town-2');
    const guild = (s.npcs || []).find((/** @type {any} */ n) => n.title === 'the senior craft-guild master');
    expect(guild.structuralPosition).toBe('Runs a smaller house behind the leading one in quiet times.');
  });

  it('NOT (b): no rival claimant on a contested seat; each row says what the condition holds', () => {
    // the alternation's literals, one by one (exactly equivalent); the anchor is the contested rows' own words
    const NOT = ['a rival claims it', 'rivals fight over the seat', 'both sides in the fight for the seat', 'claimant'];
    const failures = collectSeedFailures(['r2s-plague_onset-thorp-3', 'r2r-village-48', 'r2r-hamlet-32', 'r2r-town-35'], (seed) => {
      const printed = (town(seed).npcs || []).map((/** @type {any} */ n) => `${n.structuralPosition ?? ''} ${n.activeConstraint ?? ''} ${n.goal?.short ?? ''}`).join(' | ');
      for (const word of NOT) expectAbsentWithAnchor(printed, word, 'many doubt', seed);
    });
    expectNoSeedFailures(failures, 'no contested seat names a rival claimant');
    expect(card('r2r-village-48', 'Santosh Dubey').structuralPosition).toBe("Leads the faith while many doubt the seat's right, and the seat wants its blessing.");
    expect(card('r2r-town-35', 'Roxane Angelos').structuralPosition).toBe("Heads the crew while many doubt the seat's right and those who keep order look elsewhere.");
  });

  it('INSTEAD (b): the contested seat-holder still holds the seat on the card, in the condition\'s words', () => {
    expect(card('r2r-thorp-30', 'Thecla Schulz').structuralPosition).toMatch(/^Holds the seat, but many doubt its right to it, and the doubt has not gone away\./);
  });
});
