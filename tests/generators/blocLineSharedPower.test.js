/**
 * tests/generators/blocLineSharedPower.test.js — R2-CODE-A-14, THE CHAIR'S RULING (s1) of 2026-11-14: A LINE ABOUT A
 * BLOC NEEDS THE PAIR TO SHARE A POWER. "{A} and {B} share a council bloc and a list of enemies."
 * (`npcData.js :: STRESS_ECONOMIC_EFFECTS.wary_alliance.desc[3]`) printed for pairs that share no power: 488 of its
 * 1,102 prints on the reader's 3,048 births at 560d1687c. It declares `needs: ['shared power']` (the word granted,
 * `domain/facts/sharedPower.js`); the tie draw hands the pair as its context, and a refused index resolves within the
 * draw's own pool. No tie is re-drawn.
 *   B1 the draw: a pair that shares no power never draws the line; a pair that shares one does;
 *   B2 the collected towns (each printed the line for a pair sharing no power at the base: the reader's
 *      r2r-village-31, a siege, a famine, an occupation, a thorp, a metropolis): every print is a pair sharing a power;
 *   B3 the guard towns (a true print at the base): the line still prints, for a pair that shares a power.
 *
 * @enforced-by npx vitest run tests/generators/blocLineSharedPower.test.js
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { STRESS_ECONOMIC_EFFECTS } from '../../src/data/npcData.js';
import { createTieProseDraw } from '../../src/generators/power/relationshipArchetypes.js';
import { birthFactsOf } from '../../src/domain/facts/factsOf.js';
import { sharesPower } from '../../src/domain/facts/sharedPower.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const BLOC = 'share a council bloc';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The reader's births (`births.mjs :: cfgFor`), verbatim. @param {string} seed @returns {any} */
const born = (seed) => {
  const r2r = /^r2r-(\w+)-\d+$/.exec(seed);
  if (r2r) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: r2r[1] }), null, { seed, customContent: {} });
  const m = /** @type {RegExpExecArray} */ (/^rr3-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-\d+$/.exec(seed));
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
};
/** @param {any} s @returns {Array<{ seed?: string, share: boolean }>} every bloc print, judged on the final cards */
const blocPrints = (s) => {
  const byId = new Map((s.npcs || []).map((/** @type {any} */ n) => [String(n.id), n]));
  return (s.relationships || []).filter((/** @type {any} */ t) => String(t.description).includes(BLOC))
    .map((/** @type {any} */ t) => ({ share: sharesPower(byId.get(String(t.from)), byId.get(String(t.to))) }));
};

describe('a line about a bloc needs the pair to share a power (s1)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('B1: the draw refuses the line for a pair that shares no power, and keeps it for one that does', () => {
    const archetype = STRESS_ECONOMIC_EFFECTS.wary_alliance;
    const facts = () => birthFactsOf({ institutions: [], config: {}, tier: 'town', powerStructure: { government: 'Elder Council' } });
    const run = (/** @type {boolean} */ shared) => {
      const draw = createTieProseDraw(undefined, facts);
      return Array.from({ length: archetype.tension.size }, (_, k) => draw(archetype,
        { id: `a${k}`, name: `Aldo ${k}`, memberships: [{ power: 'Elder Council' }] },
        { id: `b${k}`, name: `Bera ${k}`, memberships: [{ power: shared ? 'Elder Council' : 'Merchant Guilds' }] }).description);
    };
    expect(run(false).filter((d) => d.includes(BLOC))).toEqual([]);
    expect(run(true).filter((d) => d.includes(BLOC))).toHaveLength(1);
  });

  it('B2: the collected towns print the line only for a pair that shares a power', () => {
    for (const seed of ['r2r-village-31', 'rr3-village-under_siege-rand-4', 'rr3-village-under_siege+famine-rand-3', 'rr3-town-occupied-rand-0', 'rr3-thorp-infiltrated-rand-4', 'rr3-metropolis-calm-rand-0']) {
      expect(blocPrints(born(seed)).filter((p) => !p.share), seed).toEqual([]);
    }
  }, 120000);

  it('B3 (keep): the guard towns still print it, for a pair that shares a power', () => {
    for (const seed of ['r2r-town-1', 'rr3-town-under_siege-port-0', 'rr3-hamlet-famine-port-0']) {
      const prints = blocPrints(born(seed));
      expect(prints.length, seed).toBeGreaterThan(0);
      expect(prints.every((p) => p.share), seed).toBe(true);
    }
  }, 120000);
});
