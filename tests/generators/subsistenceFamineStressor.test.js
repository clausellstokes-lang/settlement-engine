/**
 * tests/generators/subsistenceFamineStressor.test.js — the subsistence famine
 * is a REAL stressor, not a stressTypes ghost.
 *
 * isolationGenerator's applySubsistenceMode rolls a famine for isolated
 * thorps/hamlets. It used to push 'famine' ONLY into
 * effectiveConfig.stressTypes: full food mechanics (production ×0.35,
 * prosperity capped at Struggling) with no entry in the ctx.stress container,
 * so the famine never appeared on the stressor roster and was silently erased
 * whenever stressConfirmPass re-stamped the confirmed set from the container
 * it never joined. The fix returns a real stress entry that isolationPass
 * merges into the container.
 */

import { describe, expect, test } from 'vitest';
import { applySubsistenceMode } from '../../src/generators/isolationGenerator.js';
import { generateStress } from '../../src/generators/stressGenerator.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

describe('applySubsistenceMode emits the famine as a real stressor entry', () => {
  test('fired roll → an entry matching the stressGenerator famine shape, plus the stressTypes push', () => {
    const cfg = {};
    const entry = applySubsistenceMode([], 'thorp', 'isolated', cfg, () => true);

    // The food-math channel is preserved…
    expect(cfg.stressTypes).toEqual(['famine']);

    // …and the entry is indistinguishable from a resolveStress-emitted famine
    // (stressGenerator's buildStressEntry shape), so every container consumer
    // (stressConfirmPass, the roster, condition promotion) treats it normally.
    const reference = generateStress(
      { name: '', tier: 'thorp', institutions: [] }, { stressType: 'famine' }
    );
    expect(entry).toEqual(reference);
    expect(entry._summaryDraws).toEqual([]); // famine's template draws no rng
  });

  test('failed roll / famine already present / non-subsistence settings → null, no double push', () => {
    const missedCfg = {};
    expect(applySubsistenceMode([], 'hamlet', 'isolated', missedCfg, () => false)).toBeNull();
    expect(missedCfg.stressTypes).toBeUndefined();

    const dupCfg = { stressTypes: ['famine'] };
    expect(applySubsistenceMode([], 'thorp', 'isolated', dupCfg, () => true)).toBeNull();
    expect(dupCfg.stressTypes).toEqual(['famine']); // never double-applied

    expect(applySubsistenceMode([], 'village', 'isolated', {}, () => true)).toBeNull();
    expect(applySubsistenceMode([], 'thorp', 'road', {}, () => true)).toBeNull();
  });
});

describe('pipeline: a subsistence famine surfaces on the roster AND keeps its food math', () => {
  // Seeds where the subsistence roll fires for this config. Pre-fix these
  // produced GHOST famines: famine in config.stressTypes with the prosperity
  // cap applied, but no famine entry in stressors (75/77 had an EMPTY roster).
  const FAMINE_SEEDS = [2, 10, 75, 77];

  test.each(FAMINE_SEEDS)('seed %i: famine is a real stressor with the famine food effect', (seed) => {
    const s = generateSettlementPipeline(
      { settType: 'thorp', tradeRouteAccess: 'isolated' }, null, { seed, customContent: {} }
    );
    const stressors = Array.isArray(s.stressors) ? s.stressors : s.stressors ? [s.stressors] : [];
    const famine = stressors.find(e => e?.type === 'famine');

    // Real stressor on the roster…
    expect(s.config.stressTypes).toContain('famine');
    expect(famine).toBeTruthy();
    expect(famine.label).toBe('Famine');
    expect(famine.summary).toContain('failed harvest');
    expect(famine._summaryDraws).toBeUndefined(); // capture stripped at assembly

    // …exactly once (no double-apply)…
    expect(s.config.stressTypes.filter(t => t === 'famine')).toHaveLength(1);
    expect(stressors.filter(e => e?.type === 'famine')).toHaveLength(1);

    // …AND the food/prosperity math it always drove is retained.
    const mod = s.economicState?.foodSecurity?.prosperityMod;
    expect(mod).toMatchObject({ type: 'cap', value: 0 });
    expect(mod.reason).toMatch(/famine/i);
  });

  test('no ghost famines across a seed sweep: famine in the confirmed stressTypes iff famine on the roster', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const s = generateSettlementPipeline(
        { settType: 'thorp', tradeRouteAccess: 'isolated' }, null, { seed, customContent: {} }
      );
      const stressors = Array.isArray(s.stressors) ? s.stressors : s.stressors ? [s.stressors] : [];
      const inTypes = (s.config.stressTypes || []).includes('famine');
      const inRoster = stressors.some(e => e?.type === 'famine');
      expect(inRoster).toBe(inTypes);
    }
  });
});
