import { describe, it, expect } from 'vitest';
import { validateDossier } from '../../../src/domain/validation/consistency.js';

describe('validateDossier — food math (§1c)', () => {
  it('flags a surplus with zero produced & needed as blocking', () => {
    const res = validateDossier({
      economicViability: { metrics: { foodBalance: { surplus: 84120, deficit: 0, dailyProduction: 0, dailyNeed: 0 } } },
    });
    expect(res.blocking.map((b) => b.type)).toContain('impossible_food_math');
  });

  it('passes a consistent food balance', () => {
    const res = validateDossier({
      economicViability: { metrics: { foodBalance: { surplus: 84120, deficit: 0, dailyProduction: 134520, dailyNeed: 50400 } } },
    });
    expect(res.blocking).toHaveLength(0);
  });
});

describe('validateDossier — exports (§1d)', () => {
  it('flags legacy-empty vs primaryExports-populated as blocking', () => {
    const res = validateDossier({ economicState: { exports: [], primaryExports: ['Grain', 'Wool'] } });
    expect(res.blocking.map((b) => b.type)).toContain('export_status_contradiction');
  });

  it('passes when both sources agree exports exist', () => {
    const res = validateDossier({ economicState: { exports: ['Grain'], primaryExports: ['Grain'] } });
    expect(res.blocking).toHaveLength(0);
  });

  it('passes when there are genuinely no exports', () => {
    const res = validateDossier({ economicState: { exports: [], primaryExports: [] } });
    expect(res.blocking).toHaveLength(0);
  });
});

describe('validateDossier — viability (§1f)', () => {
  it('flags a "self-sufficient" verdict alongside a food deficit', () => {
    const res = validateDossier({ economicViability: {
      summary: '✓ VIABLE: Settlement is economically self-sufficient and historically plausible.',
      metrics: { foodBalance: { deficit: 1215, dailyProduction: 13065, dailyNeed: 14280 } },
    } });
    expect(res.blocking.map((b) => b.type)).toContain('viability_contradicts_food');
  });

  it('passes "self-sufficient" when there is no deficit', () => {
    const res = validateDossier({ economicViability: {
      summary: '✓ VIABLE: Settlement is economically self-sufficient and historically plausible.',
      metrics: { foodBalance: { deficit: 0, surplus: 500, dailyProduction: 600, dailyNeed: 100 } },
    } });
    expect(res.blocking).toHaveLength(0);
  });
});

describe('validateDossier — guards', () => {
  it('handles null / empty settlement', () => {
    expect(validateDossier(null).blocking).toHaveLength(0);
    expect(validateDossier({}).blocking).toHaveLength(0);
  });
});
