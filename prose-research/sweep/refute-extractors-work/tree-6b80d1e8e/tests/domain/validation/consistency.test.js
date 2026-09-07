import { describe, it, expect } from 'vitest';
import { validateDossier } from '../../../src/domain/validation/consistency.js';

const ids = (records) => records.map((r) => r.type);

describe('validateDossier — food math (§1c)', () => {
  it('flags a surplus with zero produced & needed as blocking', () => {
    const res = validateDossier({
      economicViability: { metrics: { foodBalance: { surplus: 84120, deficit: 0, dailyProduction: 0, dailyNeed: 0 } } },
    });
    expect(res.blocking.map((b) => b.type)).toContain('impossible_food_math');
    expect(res.blocking[0].severity).toBe('block');
  });

  it('passes a consistent food balance', () => {
    const res = validateDossier({
      economicViability: { metrics: { foodBalance: { surplus: 84120, deficit: 0, dailyProduction: 134520, dailyNeed: 50400 } } },
    });
    expect(res.blocking).toHaveLength(0);
  });

  it('does NOT fire impossible_food_math when produced/needed are known', () => {
    const res = validateDossier({
      economicViability: { metrics: { foodBalance: { dailyProduction: 800, dailyNeed: 1200, deficit: 400 } } },
    });
    expect(ids(res.blocking)).not.toContain('impossible_food_math');
  });
});

describe('validateDossier — exports (§1d)', () => {
  it('no longer flags legacy-empty vs primaryExports-populated (display reads primaryExports)', () => {
    const res = validateDossier({ economicState: { exports: [], primaryExports: ['Grain', 'Wool'] } });
    // The display model reads economicState.primaryExports everywhere, so an empty
    // legacy exports[] beside a populated primaryExports is the normal modern state.
    expect(ids(res.blocking)).not.toContain('export_status_contradiction');
    expect(ids(res.warnings)).not.toContain('export_status_contradiction');
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
  it('a "self-sufficient" verdict alongside a LARGE deficit is a WARNING, never a block', () => {
    const res = validateDossier({ economicViability: {
      summary: '✓ VIABLE: Settlement is economically self-sufficient and historically plausible.',
      metrics: { foodBalance: { deficit: 400, dailyProduction: 800, dailyNeed: 1200 } }, // ~33% unmet
    } });
    // Viability never gates publish — a settlement may be intentionally non-viable.
    expect(ids(res.blocking)).not.toContain('viability_contradicts_food');
    expect(ids(res.warnings)).toContain('viability_contradicts_food');
  });

  it('does NOT flag a small/normal residual deficit', () => {
    const res = validateDossier({ economicViability: {
      summary: '✓ VIABLE: Settlement is economically self-sufficient and historically plausible.',
      metrics: { foodBalance: { deficit: 50, dailyProduction: 1150, dailyNeed: 1200 } }, // ~4% unmet
    } });
    expect(ids(res.blocking)).not.toContain('viability_contradicts_food');
    expect(ids(res.warnings)).not.toContain('viability_contradicts_food');
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
    expect(validateDossier(null)).toEqual({ blocking: [], warnings: [] });
    expect(validateDossier({})).toEqual({ blocking: [], warnings: [] });
  });
});
