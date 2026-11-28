/**
 * stabilityReadsReadiness.test.js — POWERS-14 (the chair's ruling of 2026-11-14 09:49 UTC; the page census's row NEW1, "the
 * governance label against the Defense verdict"): ONE LADDER FOR ONE WORD. The governance text's stability label took its
 * defence word off a ladder of its own (governanceNarrative.js :: deriveBaselineStability, `militaryEffective` < 30 →
 * "Vulnerable (prosperous but underdefended)", > 68 → "Ordered (strong military presence)"), so it could contradict the
 * Defense verdict the Overview prints beside it, the record's own readiness label (defenseProfile.readiness.label):
 * "underdefended" over a Fortress (r2r-city-32, r2r-city-41) or a Defensible town (r2r-town-29), "strong military
 * presence" over a Lightly Defended (r2r-hamlet-18) or a Vulnerable one (r2s-infiltrated-hamlet-0). The label is in reach:
 * the power step is replayed after the defence profile with `defenseLabel` (steps/assembleSettlement.js →
 * economyReconciliation.js :: projectPower → rulingStructure.js `projection.defenseLabel`), and the defence word now
 * reads it: no "underdefended" over a Defensible, Well-Defended or Fortress label; no "strong military presence" over an
 * Undefended, Lightly Defended or Vulnerable one.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape @param {string} seed */
function born(seed) {
  const calm = seed.match(/^r2r-(\w+)-\d+$/);
  const forced = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const cfg = calm ? { ...DEFAULT_CONFIG, ...DIALS, settType: calm[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, settType: forced[2], selectedStresses: [forced[1]], selectedStressesRandom: false };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}
const STRONG = /^(Defensible|Well-Defended|Fortress)$/;
const WEAK = /^(Undefended|Lightly Defended|Vulnerable)$/;

describe('POWERS-14 · the stability label\'s defence word reads the record\'s readiness label', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('no town of the read prints a defence word its Defense verdict contradicts; the agreeing words are kept', () => {
    /** seed → the defence word the town must keep, or null (the contradicting word gone) */
    const expected = /** @type {Record<string, RegExp | null>} */ ({
      // contradicted before (the Overview's head against its Defense verdict)
      'r2r-city-32': null, 'r2r-city-41': null, 'r2r-town-29': null, 'r2r-hamlet-18': null, 'r2s-infiltrated-hamlet-0': null,
      // the guard towns: the word agrees with the label, kept
      'r2r-city-21': /strong military presence/, 'r2r-village-0': /underdefended/,
    });
    expectNoSeedFailures(collectSeedFailures(Object.keys(expected), (seed) => {
      const s = born(seed);
      const stability = String(s.powerStructure?.stability || '');
      const label = String(s.defenseProfile?.readiness?.label || '');
      expect(label, `${seed}: a readiness label`).not.toBe('');
      if (expected[seed]) expect(stability, `${seed} (${label})`).toMatch(expected[seed]);
      expect(/underdefended/.test(stability) && STRONG.test(label), `${seed}: "${stability}" beside ${label}`).toBe(false);
      expect(/strong military presence/.test(stability) && WEAK.test(label), `${seed}: "${stability}" beside ${label}`).toBe(false);
    }), 'no town of the read prints a defence word its Defense verdict contradicts');
  }, 300_000);
});
