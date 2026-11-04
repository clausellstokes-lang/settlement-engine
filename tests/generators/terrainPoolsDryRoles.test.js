/**
 * SHIPS AND FISHERS WHERE THERE IS WATER (chair ruling 4b, 2026-11-04). `waterAccessKind`
 * distinguishes the sea ('maritime') from a river ('river'); a river floats boats, so only
 * 'none' refuses: the fisher role (world law `allowsRole`), the timber chain's "ships" product,
 * an institution description that speaks of ships where its pool has a ship-free variant, and
 * the Fishmonger's "Fresh fish" row (its pool's own "Salted fish" inland).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { createGenerationWorldLaw } from '../../src/generators/generationContext.js';
import { getServicesForInstitution } from '../../src/generators/services/institutionServices.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

describe('the fisher (hand-built)', () => {
  it('no fisherman where there is no water; a river or the sea keeps him', () => {
    expect(createGenerationWorldLaw({ terrainType: 'plains', tradeRouteAccess: 'road' }).allowsRole({ role: 'Fisherman' })).toBe(false);
    expect(createGenerationWorldLaw({ terrainType: 'plains', tradeRouteAccess: 'river' }).allowsRole({ role: 'Fisherman' })).toBe(true);
    expect(createGenerationWorldLaw({ terrainType: 'coastal', tradeRouteAccess: 'road' }).allowsRole({ role: 'Fisherman' })).toBe(true);
  });
});

describe('the Fishmonger inland (hand-built)', () => {
  const names = (opts) => {
    const prev = setActiveRng(createPRNG('fishmonger-inland'));
    try { return getServicesForInstitution('Fishmonger', 'village', opts).map((s) => s.name); } finally { clearActiveRng(prev); }
  };
  it('sells salted fish, not today\'s catch, where there is no water', () => {
    const inland = names({ _waterAccess: 'none' });
    expect(inland).not.toContain('Fresh fish');
    expect(inland).toContain('Salted fish');
    expect(names({ _waterAccess: 'river' })).toContain('Fresh fish');
  });
});

describe('the soak seeds that printed ships or a fisherman inland', () => {
  beforeAll(async () => { await ensureLaws(); });
  const text = (s) => JSON.stringify([s.resourceAnalysis, s.institutions.map((i) => i.desc)]);
  it.each([156, 180, 300])('soak1k-%i: the timber chain ends before ships', (i) => {
    expect(text(birth(i).settlement)).not.toMatch(/"ships"/);
  });
  it.each([113, 341])('soak1k-%i: no institution description speaks of ships', (i) => {
    const s = birth(i).settlement;
    const shipDescs = s.institutions.filter((x) => /\bships?\b/i.test(x.desc || '') && !/Auction house/.test(x.name));
    expect(shipDescs.map((x) => x.name)).toEqual([]);
  });
  it.each([108, 192, 85])('soak1k-%i: no fisherman', (i) => {
    expect(birth(i).settlement.npcs.map((n) => n.role)).not.toContain('Fisherman');
  });
});
