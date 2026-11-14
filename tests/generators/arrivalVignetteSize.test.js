/**
 * tests/generators/arrivalVignetteSize.test.js — R2-CODE-A-4, CENSUS-2's writers in this lane's files
 * (`narrativeData.js :: STRESS_DESCS`, the arrival scene's crisis vignette, drawn by `arrivalScene.js :: drawAdmitted`):
 * kind c, a size word in a small place — "Some shops are shut and draped… Two processions are forming in different
 * quarters" in thorps of 11 to 26 (religious_conversion[2]); the bells "from a different quarter" in a hamlet of 56
 * ([3]); "looks prosperous in the merchant quarter" in a village of 214 (famine[0]); "bodies … through X's streets …
 * somewhere in the lower districts" in hamlets of 48 to 98 (slave_revolt[3]). Each is declared at the middling band
 * (the chair's ruling (f)). slave_revolt[4]'s "manacle-maker's shop", which the redraw exposed in more hamlets, names
 * no house the roster cannot hold (record 386 (3)/(4)).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { STRESS_DESCS } from '../../src/data/narrativeData.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: false, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** @param {any} row */ const needsOf = (row) => (row && typeof row === 'object' ? row.needs || [] : []);

describe('the crisis vignettes carry their size', () => {
  it('the rows that name quarters, shops, streets or districts need the middling band', () => {
    expect(needsOf(STRESS_DESCS.religious_conversion[2])).toContain('population: ≥ middling');
    expect(needsOf(STRESS_DESCS.religious_conversion[3])).toEqual(['institution: temple', 'population: ≥ middling']);
    expect(needsOf(STRESS_DESCS.famine[0])).toEqual(['market', 'population: ≥ middling']);
    expect(needsOf(STRESS_DESCS.slave_revolt[3])).toContain('population: ≥ middling');
    expect(STRESS_DESCS.slave_revolt.filter((r) => /manacle/.test(String(typeof r === 'function' ? r('X') : r.text('X'))))).toEqual([]);
  });
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('no quarters, streets or districts in a small place (every row)', () => {
    for (const [seed, crisis, settType] of [['r2s-religious_conversion-thorp-1', 'religious_conversion', 'thorp'], ['r2s-slave_revolt-hamlet-3', 'slave_revolt', 'hamlet']]) {
      const s = /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [crisis], settType }), null, { seed, customContent: {} }));
      expect(typeof s.arrivalScene, `${seed}: an arrival scene`).toBe('string');
      expect(/\bquarters?\b|\bdistricts?\b|\bstreets\b/.test(s.arrivalScene), `${seed}: ${s.arrivalScene}`).toBe(false);
    }
  });
});
