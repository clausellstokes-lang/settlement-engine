/**
 * tests/generators/tailTies2Batch1.test.js — TAIL-TIES-2 batch 1 (the chair's rulings (T6) and (T7) of 2026-11-15 and
 * (T2) / (T3) of 2026-11-14, each vetoable by the owner), collected on births:
 *   (powerSiblings) a seat's own line claims no more than every town holding the seat bears: no "no lord stands over
 *     them" over an occupied hamlet's elders, no headman who "gives the orders" under an occupier.
 *   (T6) THE PAIR'S DIRECTION HAS ONE HOME: a second tie of one kind between the same two cards, drawn the other way
 *     round, is written in the first tie's order (the stored variant carries it: `npcData.js :: REVERSED_TIE`).
 *   (T6) A LINE ABOUT A VOTE NEEDS A RULING BODY: under one ruler the tie keeps its kind, its line resolves in its pool.
 *   (T3) the alliance "against a threat that has since passed" is not drawn while a threat or a war stands; nobody
 *     "from outside the settlement" is met under a siege or a plague.
 *   (T7) the representative cards' spare hook walk reads the crisis: no traveller and no cousin under a siege or plague.
 * NOT pairs: each printed at b8991a936 (the 720 census, by record); each names what prints instead.
 * KEEP pairs: a true print at the base that still prints.
 *
 * @enforced-by npx vitest run tests/generators/tailTies2Batch1.test.js
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { rulingBodyOf } from '../../src/domain/facts/rulingBody.js';
import { REVERSED_TIE, STRESS_ECONOMIC_EFFECTS, tieIndexOf } from '../../src/data/npcData.js';
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
const ties = (/** @type {any} */ s) => /** @type {any[]} */ (s.relationships || []);
const tieText = (/** @type {any} */ t) => `${t.description} ${t.tension}`;
const govDesc = (/** @type {any} */ s) => (s.powerStructure?.factions || []).find((/** @type {any} */ f) => f.isGoverning)?.desc;
const hooks = (/** @type {any} */ s) => (s.npcs || []).flatMap((/** @type {any} */ n) => n.plotHooks || []).map((/** @type {any} */ h) => (typeof h === 'string' ? h : h?.text ?? ''));

describe('TAIL-TIES-2 batch 1', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('NOT (powerSiblings): the occupied hamlets\' seat lines claim no lord-free elders and no headman\'s orders; KEEP: a free hamlet\'s elders', () => {
    const elders = govDesc(town('r2s-occupied-hamlet-2'));
    // RE-KEYED BY IDENTITY (TAIL-CLOSE-TESTS-C): the powers' DECLARED MOVE a708f0cf (TAIL-POWERS-2 batch 1, P4: under an
    // occupation the seat does not govern; governingStressVignettes.js :: occupiedSeatLine) gives an occupied town's seat line
    // its twin, so both occupied hamlets print it; the NOT arms keep what must not print there
    expect(elders).toBe("The Free Elder Council keeps the seat, but under the occupation nothing it decides stands without the occupiers' approval."); // NAMES-1 (CN1): the article
    expect(elders).not.toMatch(/no lord stands over them/); // anchored: the line above asserts the same line's exact value
    const headman = govDesc(town('r2s-occupied-hamlet-1'));
    expect(headman).toBe("The Headman's Authority keeps the seat, but under the occupation nothing it decides stands without the occupiers' approval."); // NAMES-1 (CN1): the article
    expect(headman).not.toMatch(/gives the orders here/); // anchored: the line above asserts the same line's exact value
    expect(govDesc(town('r2r-hamlet-21'))).toBe('The elders of the hamlet decide things together, and none of them rules alone.');
  });

  it('NOT (T6): the reversed mentor ties no longer say the pair backwards; each second tie is written in the first tie\'s order', () => {
    const NOT = [
      ['r2r-thorp-24', 'Minucia Aquila named Fabia Varro as successor in front of witnesses.'],
      ['r2r-hamlet-8', "Bashir al-Malik still uses Jabir al-Malik's methods"],
      ['r2r-village-12', 'Junia Corvinus owes their place to Cassius Corvinus'],
    ];
    const failures = collectSeedFailures(NOT, ([seed, base]) => {
      const s = town(seed);
      expect(ties(s).filter((t) => tieText(t).includes(base)).map(tieText), seed).toEqual([]);
      const byId = new Map((s.npcs || []).map((/** @type {any} */ n) => [n.id, n]));
      const list = ties(s);
      let reversed = 0;
      list.forEach((second, j) => {
        const first = list.slice(0, j).find((t) => t.from === second.to && t.to === second.from && t.archetypeKey === second.archetypeKey);
        if (!first) return;
        reversed += 1;
        const kind = /** @type {any} */ (STRESS_ECONOMIC_EFFECTS)[second.archetypeKey];
        expect(second.proseVariant, `${seed}: the second tie stores its order`).toBeGreaterThanOrEqual(REVERSED_TIE);
        const i = tieIndexOf(second.proseVariant);
        // written as desc(first.from, first.to): the first tie's order
        expect(second.description, seed).toBe(kind.desc(byId.get(first.from), byId.get(first.to), i));
        expect(second.tension, seed).toBe(kind.tension(byId.get(first.from), byId.get(first.to), i));
      });
      expect(reversed, `${seed}: a reversed pair still stands (no tie re-drawn)`).toBeGreaterThan(0);
    });
    expectNoSeedFailures(failures, "every reversed mentor town writes its second tie in the first tie's order");
  });

  it('NOT (T6): under one ruler no tie line is about a vote; the tie keeps its kind; KEEP: a ruling body\'s town still prints it', () => {
    const NOT = [
      ['r2r-village-11', 'by a single vote', 'peer_rivalry'], ['r2r-village-3', 'by a single vote', 'peer_rivalry'],
      // RE-KEYED BY IDENTITY (TAIL-CLOSE-TESTS-C): r2r-hamlet-4 and r2r-village-16 left the case when the powers' declared move
      // d6880513 ("Headman's Authority" only where the roster holds a headman's house) made both an Elder Council's town, so a
      // ruling body stands there. The same tiers, still under one ruler, each holding a mutual_leverage tie (census r2r arm):
      ['r2r-hamlet-3', 'controls a vote', 'mutual_leverage'], ['r2r-village-21', 'comes up next week, and', 'mutual_leverage'],
      ['r2r-hamlet-56', 'has won every vote it needed', 'wary_alliance'], ['r2r-hamlet-33', 'has voted with', 'old_debt'],
      ['r2r-hamlet-15', 'for a vote against', 'old_debt'], ['r2r-village-5', 'for a vote against', 'old_debt'],
    ];
    const failures = collectSeedFailures(NOT, ([seed, frag, key]) => {
      const s = town(seed);
      expect(rulingBodyOf(s), seed).toBe(false);
      expect(ties(s).filter((t) => tieText(t).includes(frag)).map(tieText), `${seed}: ${frag}`).toEqual([]);
      expect(ties(s).some((t) => t.archetypeKey === key), `${seed}: a ${key} tie still stands`).toBe(true);
      expect(ties(s).filter((t) => /\bvot(?:e|es|ed)\b|\bmajority\b/.test(tieText(t))).map(tieText), seed).toEqual([]);
    });
    expectNoSeedFailures(failures, 'under one ruler no tie line is about a vote and the tie keeps its kind');
    // 2026-11-15 BAR3-PEOPLE-2: RE-KEYED BY IDENTITY: r2r-hamlet-10's "for a vote against" is cast by a card the roster seats in no
    // power (BAR3-PEOPLE batch 1, the chair's P5: a vote only from a seat; it takes its twin there); the same line, the same
    // ruling-body state, from a seated voter: r2r-hamlet-42.
    const kept = collectSeedFailures([['r2r-hamlet-9', 'by a single vote'], ['r2r-hamlet-42', 'for a vote against'], ['r2r-hamlet-21', 'has won every vote it needed']], ([seed, frag]) => {
      const s = town(seed);
      expect(rulingBodyOf(s), seed).toBe(true);
      expect(ties(s).some((t) => tieText(t).includes(frag)), `${seed}: ${frag}`).toBe(true);
    });
    expectNoSeedFailures(kept, "a ruling body's town still prints its vote line");
  });

  it('NOT (T3): no passed threat while one stands; nobody from outside under a siege; KEEP: the calm alliance', () => {
    const passed = collectSeedFailures(['r2r-thorp-40', 'r2r-city-47', 'r2r-hamlet-9', 'r2r-hamlet-36'], (seed) => {
      const s = town(seed);
      expect(ties(s).filter((t) => /threat that has since passed|The threat that brought .* is gone/.test(tieText(t))).map(tieText), seed).toEqual([]);
      expect(ties(s).some((t) => t.archetypeKey === 'wary_alliance'), `${seed}: the alliance still stands`).toBe(true);
    });
    expectNoSeedFailures(passed, 'no passed threat is drawn while one stands, and the alliance still stands');
    expect(ties(town('r2r-thorp-13')).some((t) => tieText(t).includes('joined against a threat that has since passed')), 'r2r-thorp-13').toBe(true);
    const outside = collectSeedFailures(['r2s-under_siege-city-0', 'r2s-under_siege-metropolis-0', 'r2s-plague_onset-city-0', 'r2r-thorp-45'], (seed) => {
      expect(hooks(town(seed)).filter((h) => h.includes('someone from outside the settlement') || h.includes('toward a visitor from outside')), seed).toEqual([]);
    });
    expectNoSeedFailures(outside, 'nobody from outside the settlement is met under a siege or a plague');
  });

  it('NOT (T7): the representative cards under a siege or a plague take no traveller and no cousin', () => {
    const failures = collectSeedFailures(['r2s-under_siege-metropolis-2', 'r2s-plague_onset-metropolis-3', 'r2s-under_siege-metropolis-0', 'r2s-under_siege-metropolis-3'], (seed) => {
      const h = hooks(town(seed));
      expect(h.filter((l) => /A traveller passed through asking|A cousin has arrived to stay|An outsider has offered to buy the best field/.test(l)), seed).toEqual([]);
      expect(h.length, `${seed}: every card still holds a hook`).toBeGreaterThan(0);
    });
    expectNoSeedFailures(failures, 'the representative cards under a siege or a plague take no traveller and no cousin');
  });
});
