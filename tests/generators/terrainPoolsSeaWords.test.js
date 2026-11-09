/**
 * SEA WORDS INLAND (soak 1000 row 7, battery class A-11). Four lines spoke of a harbour or a catch
 * in settlements with no water: the Greek culture scope line, the Fish market's "Fresh fish
 * retail" row, the "Fish & Preserved Produce … landed" income row, and the arrival line "Racks of
 * drying fish". Each now reads the one water fact (`waterAccessKind`, the world law's `portKind`)
 * over `config.terrainType` and `config.tradeRouteAccess`.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { waterAccessKind } from '../../src/domain/tradeRouteSemantics.js';
import { createGenerationWorldLaw } from '../../src/generators/generationContext.js';
import { cultureScopeLine } from '../../src/domain/summary/settlementQuickGuide.js';
import { getServicesForInstitution } from '../../src/generators/services/institutionServices.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { createPRNG } from '../../src/kernel/prng.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';

const GREEK = { key: 'greek', label: 'Greek-inspired' };

describe('the water fact', () => {
  it('reads the sea, the river, or neither from terrain and route', () => {
    expect(waterAccessKind('coastal', 'road')).toBe('maritime');
    expect(waterAccessKind('hills', 'port')).toBe('maritime');
    expect(waterAccessKind('riverside', 'port')).toBe('river');
    expect(waterAccessKind('plains', 'river')).toBe('river');
    expect(waterAccessKind('riverside', 'road')).toBe('river');
    expect(waterAccessKind('plains', 'road')).toBe('none');
    expect(waterAccessKind('mountain', 'mountain_pass')).toBe('none');
    expect(waterAccessKind('forest', undefined)).toBe('none');
  });

  it('is the world law\'s own portKind', () => {
    for (const terrainType of ['coastal', 'riverside', 'plains', 'hills', 'forest', 'mountain', 'desert']) {
      for (const tradeRouteAccess of ['road', 'river', 'port', 'crossroads', 'isolated', 'mountain_pass']) {
        expect(createGenerationWorldLaw({ terrainType, tradeRouteAccess }).portKind)
          .toBe(waterAccessKind(terrainType, tradeRouteAccess));
      }
    }
  });
});

describe('the Greek culture line inland (hand-built)', () => {
  it('speaks of no harbour in a landlocked place', () => {
    const line = cultureScopeLine({ culturalIdentity: GREEK, config: { terrainType: 'plains', tradeRouteAccess: 'road' } });
    expect(line.length).toBeGreaterThan(0);
    expect(line).not.toMatch(/harbou?r/i); // anchored: the line above proves the scope line is live text
  });
  it('keeps the harbour on the coast; a river town has no harbour (STYLE-2 A·O2: the sea only)', () => {
    expect(cultureScopeLine({ culturalIdentity: GREEK, config: { terrainType: 'coastal', tradeRouteAccess: 'road' } })).toMatch(/harbour/);
    expect(cultureScopeLine({ culturalIdentity: GREEK, config: { terrainType: 'plains', tradeRouteAccess: 'river' } })).not.toMatch(/harbou?r/); // anchored: the coastal call above proves cultureScopeLine returns the live scope sentence
    // soak1k-10, Olympambelos: a road city on riverside ground printed "the agora and the harbour, on hillside ground"
    expect(cultureScopeLine({ culturalIdentity: GREEK, config: { terrainType: 'riverside', tradeRouteAccess: 'road' } }))
      .toBe('Greek-inspired, built around the agora, on riverside ground, and run by civic association.');
  });
  it('leaves a record with no config as it always read', () => {
    expect(cultureScopeLine({ culturalIdentity: GREEK })).toMatch(/harbour/);
  });
});

describe('the Fish market inland (hand-built)', () => {
  const names = (opts) => {
    const prev = setActiveRng(createPRNG('fish-market-inland'));
    try { return getServicesForInstitution('Fish market', 'town', opts).map((s) => s.name); } finally { clearActiveRng(prev); }
  };
  it('sells preserved fish, not the morning catch, where there is no water', () => {
    const inland = names({ _waterAccess: 'none' });
    expect(inland).not.toContain('Fresh fish retail'); // anchored: the next line pins Preserved fish in this same list
    expect(inland).toContain('Preserved fish');
  });
  it('keeps the morning catch where there is water', () => {
    expect(names({ _waterAccess: 'maritime' })).toContain('Fresh fish retail');
    expect(names({ _waterAccess: 'river' })).toContain('Fresh fish retail');
  });
});

describe('the soak seeds that printed a catch inland', () => {
  beforeAll(async () => { await ensureLaws(); });
  const inland = (s) => waterAccessKind(s.config.terrainType, s.config.tradeRouteAccess) === 'none';

  it.each([17, 33, 86])('soak1k-%i lands no catch', (i) => {
    const { settlement: s } = birth(i);
    expect(inland(s)).toBe(true);
    const sources = (s.economicState?.incomeSources || []).map((x) => (typeof x === 'string' ? x : x?.source));
    expect(sources.length).toBeGreaterThan(0);
    expect(sources.join(' | ')).not.toMatch(/\bFish\b/); // anchored: the line above proves the income sources are live
  });

  // 2026-11-04 (chair's ruling P1): SOAK-3 re-dealt the corpus (the de-aliased cellFor), so the old seed no longer carries this case's premise; re-pointed to the first seed of the new corpus that does (an inland place with a fish institution): was 7, then 90 (no fish institution). Re-picked 2026-11-04 after x46-1b and x46-3 composed (the budget moved the corpus again).
  it.each([11, 4])('soak1k-%i dries no fish on racks at the gate', (i) => {
    const { settlement: s } = birth(i);
    expect(inland(s)).toBe(true);
    expect(String(s.arrivalScene || '').length).toBeGreaterThan(0);
    expect(String(s.arrivalScene || '')).not.toMatch(/Racks of drying fish/); // anchored: the line above proves the arrival scene is live text
  });

  // 2026-11-04 (chair's ruling P1): SOAK-3 re-dealt the corpus (the de-aliased cellFor), so the old seed no longer carries this case's premise; re-pointed to the first seed of the new corpus that does (an inland place with a Fish market): was 93; 35 still carries it.
  it.each([4, 35])('soak1k-%i sells no morning catch', (i) => {
    const { settlement: s } = birth(i);
    expect(inland(s)).toBe(true);
    const all = Object.values(s.availableServices || {}).flat().map((x) => x?.name);
    expect(all.length).toBeGreaterThan(0);
    expect(all).not.toContain('Fresh fish retail'); // anchored: the line above proves the services are live
  });
});
