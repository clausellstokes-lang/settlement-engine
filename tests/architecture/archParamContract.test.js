/**
 * archParamContract.test.js -- K-3 -> K-4: the FROZEN parameter contract (co-signed for K-2/K-4).
 *
 * Freezes the surface every grammar exposes so K-2 can author its ~16-18 rulesets ONCE against a
 * stable contract and K-4 can drive drift through it. Pins:
 *   - the conditionVector FIELD SET + RANGES (a field add/rename is a deliberate contractVersion bump);
 *   - the 1/64 DRIFT LATTICE quantization;
 *   - the SECURITY INVARIANT -- corruptionCovert is EXACTLY 0 (the map never leaks what the dossier
 *     hides); makeConditionVector + assertConditionVector both fail closed on a nonzero covert;
 *   - the style-token vocabularies + makeGrammarParams validation (footprint / heightClass / lodTier /
 *     seedId / anchorKey / styleTokens / conditionVector), the K-4 surface every ruleset accepts.
 *
 * E-A: flipping corruptionCovert's band to allow > 0 must red the security pin below.
 */
import { describe, it, expect } from 'vitest';
import {
  PARAM_CONTRACT_VERSION, DRIFT_LATTICE, CONDITION_VECTOR_FIELDS, CONDITION_VECTOR_KEYS,
  HEIGHT_CLASSES, SHAPE_FAMILIES, TRACERY_FAMILY_TOKENS, ORNAMENT_DENSITY,
  neutralConditionVector, makeConditionVector, assertConditionVector, assertStyleTokens, makeGrammarParams,
} from '../../src/domain/townMap/arch/params.js';

const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const VALID_STYLE = { shapeFamily: 'sacred', skinId: 'stoneAshlar', traceryFamily: 'geometric', ornamentDensity: 'rich' };

describe('the frozen conditionVector field set + version', () => {
  it('contract version is pinned (a field change bumps it)', () => expect(PARAM_CONTRACT_VERSION).toBe(1));
  it('the drift lattice is 1/64', () => expect(DRIFT_LATTICE).toBe(64));
  it('the field set is exactly the K-4 co-signed keys', () => {
    expect(CONDITION_VECTOR_KEYS).toEqual([
      'corruptionCovert', 'corruptionRevealed', 'historyMark', 'legitimacy', 'moral',
      'patronAlignGood', 'patronAlignLaw', 'patronEmblem', 'prosperity', 'terrain', 'warScar',
    ]);
  });
});

describe('the security invariant -- corruptionCovert is EXACTLY 0 (the map never leaks the dossier)', () => {
  it('the covert field band is [0,0]', () => {
    expect(CONDITION_VECTOR_FIELDS.corruptionCovert.lo).toBe(0);
    expect(CONDITION_VECTOR_FIELDS.corruptionCovert.hi).toBe(0);
  });
  it('makeConditionVector rejects a nonzero covert', () => {
    expect(() => makeConditionVector({ corruptionCovert: 0.5 })).toThrow(/covert/i);
  });
  it('assertConditionVector rejects a nonzero covert', () => {
    const v = { ...neutralConditionVector(), corruptionCovert: 0.1 };
    expect(() => assertConditionVector(v)).toThrow(/covert|0/i);
  });
  it('the neutral vector has covert 0 and validates', () => {
    const v = neutralConditionVector();
    expect(v.corruptionCovert).toBe(0);
    expect(() => assertConditionVector(v)).not.toThrow();
  });
});

describe('1/64 quantization + determinism', () => {
  it('makeConditionVector quantizes scalars to the 1/64 lattice', () => {
    const v = makeConditionVector({ moral: 0.333, prosperity: 0.51, warScar: 1.0, corruptionCovert: 0 });
    for (const k of ['moral', 'prosperity', 'warScar']) {
      const q = v[k] * DRIFT_LATTICE;
      expect(Math.abs(q - Math.round(q))).toBeLessThan(1e-9);
    }
  });
  it('the neutral vector is deterministic + fully field-covered', () => {
    expect(eq(neutralConditionVector(), neutralConditionVector())).toBe(true);
    expect(Object.keys(neutralConditionVector()).sort()).toEqual(CONDITION_VECTOR_KEYS);
  });
  it('an index field clamps + rounds', () => {
    const v = makeConditionVector({ patronEmblem: 99.7, historyMark: -3, corruptionCovert: 0 });
    expect(v.patronEmblem).toBe(47);
    expect(v.historyMark).toBe(0);
  });
});

describe('style tokens + the GrammarParams surface', () => {
  it('the token vocabularies are the frozen finite sets', () => {
    expect(HEIGHT_CLASSES).toContain('soaring');
    expect(SHAPE_FAMILIES).toContain('sacred');
    expect(TRACERY_FAMILY_TOKENS).toEqual(['plate', 'geometric', 'flamboyant', 'perpendicular']);
    expect(ORNAMENT_DENSITY).toContain('encrusted');
  });
  it('assertStyleTokens fails closed on a bad token', () => {
    expect(() => assertStyleTokens({ ...VALID_STYLE, shapeFamily: 'steampunk' })).toThrow(/shapeFamily/);
  });
  it('makeGrammarParams builds + validates the full surface', () => {
    const p = makeGrammarParams({ footprint: [200, 120], heightClass: 'tall', lodTier: 2, seedId: 'seed-1', anchorKey: 'anchor-9', styleTokens: VALID_STYLE });
    expect(p.footprint).toEqual([200, 120]);
    expect(p.contractVersion).toBe(1);
    expect(p.conditionVector.corruptionCovert).toBe(0);
    expect(p.conditionVector).toBeDefined();
  });
  it('makeGrammarParams fails closed on a bad footprint / heightClass / lodTier / seed / anchor', () => {
    expect(() => makeGrammarParams({ footprint: [1], heightClass: 'tall', lodTier: 2, seedId: 's', anchorKey: 'a', styleTokens: VALID_STYLE })).toThrow(/footprint/);
    expect(() => makeGrammarParams({ footprint: [1, 2], heightClass: 'huge', lodTier: 2, seedId: 's', anchorKey: 'a', styleTokens: VALID_STYLE })).toThrow(/heightClass/);
    expect(() => makeGrammarParams({ footprint: [1, 2], heightClass: 'tall', lodTier: 5, seedId: 's', anchorKey: 'a', styleTokens: VALID_STYLE })).toThrow(/lodTier/);
    expect(() => makeGrammarParams({ footprint: [1, 2], heightClass: 'tall', lodTier: 2, seedId: '', anchorKey: 'a', styleTokens: VALID_STYLE })).toThrow(/seedId/);
    expect(() => makeGrammarParams({ footprint: [1, 2], heightClass: 'tall', lodTier: 2, seedId: 's', anchorKey: '', styleTokens: VALID_STYLE })).toThrow(/anchorKey/);
  });
});
