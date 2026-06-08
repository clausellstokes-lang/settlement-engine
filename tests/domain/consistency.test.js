import { describe, expect, test } from 'vitest';

import { validateDossier } from '../../src/domain/validation/consistency.js';

const ids = (records) => records.map((r) => r.type);

describe('validateDossier', () => {
  test('null / empty settlement → no findings', () => {
    expect(validateDossier(null)).toEqual({ blocking: [], warnings: [] });
    expect(validateDossier({})).toEqual({ blocking: [], warnings: [] });
  });

  test('a clean settlement produces no blocking findings', () => {
    const clean = {
      economicViability: {
        summary: 'A self-sufficient farming village.',
        metrics: { foodBalance: { dailyProduction: 1200, dailyNeed: 900, surplus: 300, deficit: 0 } },
      },
      economicState: { exports: ['grain'], primaryExports: ['grain'] },
    };
    expect(validateDossier(clean).blocking).toEqual([]);
  });

  test('§1c impossible food math: surplus/deficit while produced & needed are zero', () => {
    const s = {
      economicViability: { metrics: { foodBalance: { dailyProduction: 0, dailyNeed: 0, surplus: 450 } } },
    };
    const { blocking } = validateDossier(s);
    expect(ids(blocking)).toContain('impossible_food_math');
    expect(blocking[0].severity).toBe('block');
  });

  test('§1c does NOT fire when produced/needed are known', () => {
    const s = {
      economicViability: { metrics: { foodBalance: { dailyProduction: 800, dailyNeed: 1200, deficit: 400 } } },
    };
    expect(ids(validateDossier(s).blocking)).not.toContain('impossible_food_math');
  });

  test('§1f viability "self-sufficient" contradicts a food deficit', () => {
    const s = {
      economicViability: {
        summary: 'Comfortable and self-sufficient.',
        metrics: { foodBalance: { dailyProduction: 800, dailyNeed: 1200, deficit: 400 } },
      },
    };
    expect(ids(validateDossier(s).blocking)).toContain('viability_contradicts_food');
  });

  test('§1d export contradiction: legacy exports empty but primaryExports listed', () => {
    const s = { economicState: { exports: [], primaryExports: ['fish', 'salt'] } };
    expect(ids(validateDossier(s).blocking)).toContain('export_status_contradiction');
  });

  test('§1d does NOT fire when both export lists agree', () => {
    const s = { economicState: { exports: ['fish'], primaryExports: ['fish', 'salt'] } };
    expect(ids(validateDossier(s).blocking)).not.toContain('export_status_contradiction');
  });
});
