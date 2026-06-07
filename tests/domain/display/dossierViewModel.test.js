import { describe, it, expect } from 'vitest';
import {
  deriveFoodBalance,
  deriveExportPosture,
  deriveViability,
  deriveDossierViewModel,
} from '../../../src/domain/display/dossierViewModel.js';

const withFood = (fb) => ({ economicViability: { metrics: { foodBalance: fb } } });
const withEco  = (economicState, extra = {}) => ({ economicState, ...extra });

describe('deriveFoodBalance (§1c)', () => {
  it('maps dailyProduction/dailyNeed into produced/needed', () => {
    const fb = deriveFoodBalance(withFood({ dailyProduction: 134520, dailyNeed: 50400, surplus: 84120, deficit: 0 }));
    expect(fb.produced).toBe(134520);
    expect(fb.needed).toBe(50400);
    expect(fb.display).toBe('Surplus +84,120');
    expect(fb.detail).toBe('Produced/Needed: 134,520 / 50,400 lb/day');
  });

  it('never shows produced=0 / needed=0 beside a non-zero surplus (the PDF bug)', () => {
    // surplus present but the raw daily fields absent — what the PDF saw when
    // it read .production / .need instead of dailyProduction / dailyNeed.
    const fb = deriveFoodBalance(withFood({ surplus: 84120, deficit: 0 }));
    expect(fb.display).toBe('Surplus +84,120');
    expect(fb.produced).toBeNull();
    expect(fb.needed).toBeNull();
    expect(fb.detail).toBe('Produced/Needed: Not calculated');
  });

  it('renders a deficit with the minus sign', () => {
    const fb = deriveFoodBalance(withFood({ dailyProduction: 13065, dailyNeed: 14280, surplus: 0, deficit: 1215 }));
    expect(fb.display).toBe('Deficit −1,215');
  });

  it('falls back cleanly when foodBalance is absent', () => {
    const fb = deriveFoodBalance({});
    expect(fb.available).toBe(false);
    expect(fb.detail).toBe('Produced/Needed: Not calculated');
  });
});

describe('deriveExportPosture (§1d)', () => {
  it('reads primaryExports, not the legacy exports field', () => {
    const ep = deriveExportPosture(withEco({ primaryExports: ['Grain', 'Wool', 'Iron'], exports: [] }));
    expect(ep.count).toBe(3);
    expect(ep.status).toBe('established');
  });

  it('classifies an entrepôt', () => {
    const ep = deriveExportPosture(withEco({ primaryExports: ['Silk (transit)'], isEntrepot: true }));
    expect(ep.status).toBe('entrepot');
  });

  it('classifies isolated trade routes as vulnerable', () => {
    const ep = deriveExportPosture(withEco({ primaryExports: ['Furs', 'Ore'] }, { config: { tradeRouteAccess: 'isolated' } }));
    expect(ep.status).toBe('vulnerable');
  });

  it('classifies a single export as limited', () => {
    const ep = deriveExportPosture(withEco({ primaryExports: ['Salt'] }, { config: { tradeRouteAccess: 'road' } }));
    expect(ep.status).toBe('limited');
  });

  it('reports none only when truly empty', () => {
    const ep = deriveExportPosture(withEco({ primaryExports: [], exports: [] }));
    expect(ep.status).toBe('none');
    expect(ep.label).toMatch(/No exports/);
  });

  it('falls back to the legacy exports field when primaryExports is absent', () => {
    const ep = deriveExportPosture(withEco({ exports: ['Grain', 'Wool'] }, { config: { tradeRouteAccess: 'road' } }));
    expect(ep.count).toBe(2);
    expect(ep.status).toBe('established');
  });
});

describe('deriveDossierViewModel', () => {
  it('is a pure single source: identical input yields identical output', () => {
    const s = {
      ...withFood({ dailyProduction: 100, dailyNeed: 80, surplus: 20, deficit: 0 }),
      economicState: { primaryExports: ['Grain'] },
      config: { tradeRouteAccess: 'road' },
    };
    expect(deriveDossierViewModel(s)).toEqual(deriveDossierViewModel(s));
    const vm = deriveDossierViewModel(s);
    expect(vm.foodBalance.display).toBe('Surplus +20');
    expect(vm.exportPosture.status).toBe('limited');
    expect(vm.viability).toBeTruthy();
  });
});

describe('deriveViability (§1f)', () => {
  it('downgrades "self-sufficient" to strained when there is a food deficit', () => {
    const r = deriveViability({ economicViability: {
      viable: true,
      summary: '✓ VIABLE: Settlement is economically self-sufficient and historically plausible.',
      metrics: { foodBalance: { deficit: 1215, dailyProduction: 13065, dailyNeed: 14280 } },
    } });
    expect(r.verdict).toBe('strained');
    expect(r.summary).toMatch(/STRAINED/);
  });

  it('reports critical dependencies when deps exist and food is fine', () => {
    const r = deriveViability({ economicViability: {
      viable: true, dependencies: [{}, {}],
      metrics: { foodBalance: { deficit: 0, surplus: 100, dailyProduction: 200, dailyNeed: 100 } },
    } });
    expect(r.verdict).toBe('dependent');
  });

  it('keeps self-sufficient only when there is no deficit and no dependencies', () => {
    const r = deriveViability({ economicViability: {
      viable: true, dependencies: [],
      metrics: { foodBalance: { deficit: 0, surplus: 100, dailyProduction: 200, dailyNeed: 100 } },
    } });
    expect(r.verdict).toBe('self_sufficient');
  });

  it('keeps a not-viable verdict', () => {
    const r = deriveViability({ economicViability: { viable: false, summary: '✗ NOT VIABLE: 2 critical issues prevent settlement survival.' } });
    expect(r.verdict).toBe('not_viable');
    expect(r.viable).toBe(false);
  });
});
