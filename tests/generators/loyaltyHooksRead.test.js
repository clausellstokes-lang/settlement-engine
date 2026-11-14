/**
 * tests/generators/loyaltyHooksRead.test.js — R2-CODE-A-6 (`npcData.js :: NPC_FACTION_LOYALTY`, the people's hooks):
 * - the chair's row of 2026-11-14 00:20: "A merchant they spoke against has started praising them in public" in towns
 *   with no market (r2r-thorp-1) reads `market`; "Their master craftsman is talking to a rival" in a thorp
 *   (r2s-succession_void-thorp-1) takes its siblings' `tier: ≥ village` (every village and above that printed it holds a
 *   house of craft).
 * - the stage read's low 8: the three office twins ("Someone is collecting fees in their name…", "They promised the same
 *   post to two people…", "A ledger … an auditor…") carry the `tier: ≥ village` their six office siblings carry.
 * A declared hook refused resolves draw-free in the holder's own pool (npcGenerator.js :: generatePlotHook).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { NPC_FACTION_LOYALTY } from '../../src/data/npcData.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** @param {string} pool @param {RegExp} text */
const rowOf = (pool, text) => /** @type {any[]} */ (/** @type {any} */ (NPC_FACTION_LOYALTY)[pool]).find((l) => text.test(typeof l === 'string' ? l : l.text));
const MERCHANT = /^A merchant they spoke against /, CRAFTSMAN = /^Their master craftsman is talking/, FEES = /^Someone is collecting fees in their name/, POST = /^They promised the same post to two people/, AUDITOR = /an auditor is coming to read it\.$/;

describe('A1 the rows declare what they name', () => {
  it.each([['government', MERCHANT, ['market']], ['economy', CRAFTSMAN, ['tier: ≥ village']], ['government', FEES, ['tier: ≥ village']], ['government', POST, ['tier: ≥ village']], ['government', AUDITOR, ['tier: ≥ village']]])('%s %s needs %j', (pool, text, needs) => {
    expect(rowOf(pool, text)?.needs).toEqual(needs);
  });
});

describe('A2 the towns, born in the census shape', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  /** @param {string} seed */
  const born = (seed) => {
    let m = seed.match(/^r2r-(\w+)-\d+$/);
    const cfg = m ? { ...DEFAULT_CONFIG, ...dials, settType: m[1] } : (() => { m = /** @type {RegExpMatchArray} */ (seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/)); return { ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }; })();
    return /** @type {any} */ (generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} }));
  };
  /** @param {any} s */
  const hooks = (s) => (s.npcs || []).flatMap((/** @type {any} */ n) => n.plotHooks || []).map((/** @type {any} */ h) => (typeof h === 'string' ? h : h.text));
  it.each([
    ['r2r-thorp-17', MERCHANT], ['r2r-thorp-1', MERCHANT],
    ['r2s-succession_void-thorp-1', CRAFTSMAN],
    ['r2r-thorp-20', FEES], ['r2s-infiltrated-thorp-3', POST], ['r2r-thorp-28', AUDITOR],
  ])('guard town %s: the hook does not print', (seed, text) => {
    expect(hooks(born(seed)).some((h) => text.test(h))).toBe(false);
  });
  it('a town with a market keeps the merchant hook (r2r-town-1)', () => {
    expect(hooks(born('r2r-town-1')).some((h) => MERCHANT.test(h))).toBe(true);
  });
});
