/**
 * tests/generators/clerkHookSmallPlace.test.js — R2-CODE-A-2, the cold list REVIEW-W2A-3 MEDIUM #6: "A clerk in
 * their office has been copying letters at night…" on the headman of a thorp of twelve whose roster is that one
 * person: no office, no clerk. The government hook presumes an office with staff, which no thorp or hamlet keeps,
 * and so do four lines beside it (one of their staff; notes in their office about a colleague; a seal that fools
 * their own staff; their deputy): the first fix printed one of them in its place. All five declare the size they
 * need (`tier: ≥ village`), and the hook draw (`npcGenerator.js :: drawLoyalty`, through
 * `drawDeclared` with the birth's facts) resolves a refused pick draw-free to a fresh admitted line.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { NPC_FACTION_LOYALTY } from '../../src/data/npcData.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const CLERK = /^A clerk in their office has been copying letters at night|^One of their staff has started asking|^Someone has been leaving anonymous notes in their office|^Someone has forged their seal well enough to fool their own staff|^Their deputy has started answering/;
/** the advisor and the official story: an office too (the first resolution printed it in four thorps) */
const ADVISOR = /^Their most trusted advisor hasn't been seen/;
/** a district, a size error below the middling band (the chair's ruling (f)) */
const DISTRICT = /^They've been quietly buying up property in a district/;
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {string} seed */
function born(seed) {
  const r = seed.match(/^r2r-(\w+)-\d+$/);
  const c = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const w = seed.match(/^rw3-(\w+)-([a-z_+]+)-\d+$/);
  const cfg = r ? { ...DEFAULT_CONFIG, ...DIALS, settType: r[1] }
    : c ? { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [c[1]], selectedStressesRandom: false, settType: c[2] }
      : { ...DEFAULT_CONFIG, settType: w?.[1], selectedStressesRandom: false, selectedStresses: !w || w[2] === 'calm' ? [] : w[2].split('+'), _randomizePriorities: true };
  return /** @type {any} */ (generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} }));
}

describe('the clerk line needs a place large enough to keep an office', () => {
  it('the five office lines declare the size they presume', () => {
    const rows = /** @type {any[]} */ (NPC_FACTION_LOYALTY.government.filter((l) => CLERK.test(typeof l === 'string' ? l : l.text)));
    expect(rows).toHaveLength(5);
    for (const row of rows) expect(row?.needs, row?.text ?? row).toContain('tier: ≥ village');
    const gov = /** @type {any[]} */ (NPC_FACTION_LOYALTY.government);
    expect(gov.find((l) => ADVISOR.test(l?.text ?? l))?.needs).toContain('tier: ≥ village');
    expect(gov.find((l) => DISTRICT.test(l?.text ?? l))?.needs).toContain('population: ≥ middling');
  });
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it.each([['rw3-thorp-calm-1'], ['r2r-hamlet-34'], ['r2s-recently_betrayed-hamlet-2'], ['r2s-slave_revolt-thorp-0'], ['r2r-hamlet-45'], ['r2r-thorp-17'], ['r2s-insurgency-thorp-3']])('%s: no one in a thorp or a hamlet has an office with staff, and each keeps one hook', (seed) => {
    const s = born(seed);
    expect(['thorp', 'hamlet']).toContain(s.tier);
    for (const n of s.npcs) {
      expect((n.plotHooks || []).some((/** @type {string} */ h) => CLERK.test(h) || ADVISOR.test(h) || DISTRICT.test(h)), `${n.role}`).toBe(false);
      expect((n.plotHooks || []).length).toBe(1);
    }
  });
  it.each([['r2r-village-53'], ['r2r-village-59']])('%s: a village below the middling band buys up no property in a district', (seed) => {
    const s = born(seed);
    expect(s.tier).toBe('village');
    for (const n of s.npcs) expect((n.plotHooks || []).some((/** @type {string} */ h) => DISTRICT.test(h)), `${n.role}`).toBe(false);
  });
});
