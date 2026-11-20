/**
 * tests/generators/tailTiesBatch1.test.js — TAIL-TIES batch 1 (the chair's rulings (T1), (T2), (T5) of 2026-11-14,
 * vetoable by the owner), collected on births:
 *   (T1/T5) A LINE ABOUT THE COUNCIL NEEDS A BODY OF MORE THAN ONE: every STRESS_ECONOMIC_EFFECTS line that names the
 *     council declares `needs: ['ruling body']` (`domain/facts/rulingBody.js`); under a lone headman, a priest-king, a
 *     lord or a mayor the tie keeps its archetype and its index resolves within its own pool (no tie re-drawn).
 *   (T2) ONE STATE FOR THE PAIR: old_debt's desc[4] has the coin "repaid in small amounts ever since"; its tension
 *     (the one-index draw's second beat) said the repaying had only "started". The second beat is the sibling now.
 * NOT pairs: each printed at f663a2699 (the 720 census, by record); each names what prints instead.
 * KEEP pairs: a true print at the base that still prints.
 *
 * @enforced-by npx vitest run tests/generators/tailTiesBatch1.test.js
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { rulingBodyOf } from '../../src/domain/facts/rulingBody.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The reader's births (`births.mjs :: cfgFor`), verbatim. @param {string} seed @returns {any} */
const born = (seed) => {
  const r2r = /^r2r-(\w+)-\d+$/.exec(seed);
  if (r2r) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: r2r[1] }), null, { seed, customContent: {} });
  const r2s = /^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed); // the census's r2s arm (seedcfg.mjs), verbatim
  if (r2s) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [r2s[1]], selectedStressesRandom: false, settType: r2s[2] }), null, { seed, customContent: {} });
  const m = /** @type {RegExpExecArray} */ (/^rr3-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-\d+$/.exec(seed));
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
};

/** @param {any} s @returns {Array<any>} */
const ties = (s) => s.relationships || [];
const text = (/** @type {any} */ t) => `${t.description} ${t.tension}`;

/** (seed, the base line's fragment, the archetype that printed it) — a lone ruler, so the line must not print */
const COUNCIL_NOT = [
  ['r2r-hamlet-38', 'at the next council session', 'peer_rivalry'], ['r2r-hamlet-47', 'at the next council session', 'peer_rivalry'],
  ['r2r-town-39', 'at the next council session', 'peer_rivalry'], ['r2r-town-40', 'at the next council session', 'peer_rivalry'],
  ['r2r-town-40', 'to audit each other\'s accounts', 'genuine_respect'], ['r2r-town-5', 'to audit each other\'s accounts', 'genuine_respect'],
  ['r2s-famine-town-2', 'to audit each other\'s accounts', 'genuine_respect'],
];
/** a body rules: the line still prints */
const COUNCIL_KEEP = [
  ['r2r-town-14', 'at the next council session'], ['r2r-town-15', 'at the next council session'],
  ['r2r-city-0', 'to audit each other\'s accounts'], ['r2r-city-1', 'to audit each other\'s accounts'],
  // RE-KEYED BY IDENTITY (TAIL-TIES-7, 2026-11-15): r2r-village-50 was a NOT pair under "Headman's Authority". The declared
  // move d6880513 (TAIL-POWERS-2 DA, P7 + P8: "Headman's Authority" is said only where the roster holds a headman's house),
  // brought by the join (JOIN-6 · 8, 00e8ba474), makes its governing power the "Elder Council": a body rules, and the line prints.
  ['r2r-village-50', 'to audit each other\'s accounts'],
];
const DEBT_SEEDS = ['r2r-city-0', 'r2r-city-1', 'r2r-village-21'];

describe('TAIL-TIES batch 1: the council lines need a ruling body (T1/T5); one state for the debt (T2)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('NOT: under one ruler no tie names the council; the tie keeps its archetype with a line of its own pool', () => {
    const failures = collectSeedFailures(COUNCIL_NOT, ([seed, frag, key]) => {
      const s = born(seed);
      expect(rulingBodyOf(s), seed).toBe(false);
      expect(ties(s).filter((t) => text(t).includes(frag)).map(text), `${seed}: ${frag}`).toEqual([]);
      expect(ties(s).some((t) => t.archetypeKey === key), `${seed}: a ${key} tie still stands`).toBe(true);
      expect(ties(s).filter((t) => /\bcouncil/i.test(text(t))).map(text), seed).toEqual([]);
    });
    expectNoSeedFailures(failures, 'under one ruler no tie names the council, and the tie keeps its archetype');
  });

  it('KEEP: where a body rules, the council line still prints', () => {
    const failures = collectSeedFailures(COUNCIL_KEEP, ([seed, frag]) => {
      const s = born(seed);
      expect(rulingBodyOf(s), seed).toBe(true);
      expect(ties(s).some((t) => text(t).includes(frag)), `${seed}: ${frag}`).toBe(true);
    });
    expectNoSeedFailures(failures, 'where a body rules, the council line still prints');
  });

  it('NOT (T2): "repaid in small amounts ever since" never sits beside "has started repaying"; KEEP: the debt line prints with its sibling', () => {
    const failures = collectSeedFailures(DEBT_SEEDS, (seed) => {
      const debt = ties(born(seed)).filter((t) => /repaid in small amounts ever since/.test(t.description));
      expect(debt.length, `${seed}: the desc[4] debt tie still prints`).toBeGreaterThan(0);
      for (const t of debt) {
        expectAbsentWithAnchor(t.tension, 'has started repaying the debt in coin', 'has offered to clear what is left of the debt in one payment', seed);
        expect(t.tension, seed).toMatch(/has offered to clear what is left of the debt in one payment/);
      }
    });
    expectNoSeedFailures(failures, 'the desc[4] debt tie prints with its sibling second beat, never the started repaying');
  });
});
