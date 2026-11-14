/**
 * tests/generators/founderHamletNoMill.test.js — R2-CODE-A-3, the round-three cut's increment (lane ra), HIGH ww-53,
 * rww-hamlet-famine-1: "Founded by: a miller who built a mill and found customers before they found customers" —
 * garbled, in a hamlet whose roster holds no mill ("Access to external mill"). The founder
 * (`narrativeGenerator.js :: genArrivalDetail`, FOUNDERS_BY_TIER.hamlet) is picked with no roster in reach, so the
 * line names no house: "a household that settled first and found others following it in".
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

describe("the reader's famine hamlet, born as the app births it", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('Ulfset (ww-53): the founder is no miller who found customers before they found customers', () => {
    const s = /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'hamlet', selectedStressesRandom: false, selectedStresses: ['famine'], _randomizePriorities: true }), null, { seed: 'rww-hamlet-famine-1', customContent: {} }));
    expect(s.history.founding.foundedBy).not.toMatch(/found customers before they found customers|built a mill/);
    expect(s.history.founding.foundedBy).toBe('a household that settled first and found others following it in');
  });
});
