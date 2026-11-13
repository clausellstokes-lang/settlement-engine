/**
 * tests/data/stressNotesAnySize.test.js — R2-CODE-A-4, CENSUS-2's writers in this lane's files
 * (`narrativeData.js :: STRESS_NOTES`, the founding's crisis note): "Now newcomers crowd the streets" and "Its streets
 * and wells were never meant for this many people" in thorps of 7 to 24 and hamlets (kind c, a size word in a small
 * place), and "Now the army takes what the market used to sell" where the roster holds no market (kind a). The notes
 * are drawn draw-free with no roster or size condition, so each says what is true at every size.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { STRESS_NOTES } from '../../src/data/narrativeData.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

describe('the founding crisis notes say what is true at every size', () => {
  it('no migration note names streets; no war note names a market', () => {
    expect(STRESS_NOTES.mass_migration.filter((n) => /\bstreets?\b/.test(String(n)))).toEqual([]);
    expect(STRESS_NOTES.wartime.filter((n) => /\bmarket\b/.test(String(n)))).toEqual([]);
    expect(STRESS_NOTES.mass_migration).toContain('The founders built for a few families who knew each other. Now newcomers crowd in, and half the faces are strangers.');
  });
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('rww-hamlet-mass_migration-1: the hamlet\'s note names no streets', () => {
    const s = /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'hamlet', selectedStressesRandom: false, selectedStresses: ['mass_migration'], _randomizePriorities: true }), null, { seed: 'rww-hamlet-mass_migration-1', customContent: {} }));
    expect(STRESS_NOTES.mass_migration).toContain(s.history.founding.stressNote);
    expect(/\bstreets?\b/.test(s.history.founding.stressNote), s.history.founding.stressNote).toBe(false);
  });
});
