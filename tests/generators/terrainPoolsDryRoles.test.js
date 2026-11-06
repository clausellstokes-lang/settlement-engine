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
    expect(inland).not.toContain('Fresh fish'); // anchored: the next line pins Salted fish in this same list
    expect(inland).toContain('Salted fish');
    expect(names({ _waterAccess: 'river' })).toContain('Fresh fish');
  });
});

describe('the soak seeds that printed ships or a fisherman inland', () => {
  beforeAll(async () => { await ensureLaws(); });
  const text = (s) => JSON.stringify([s.resourceAnalysis, s.institutions.map((i) => i.desc)]);
  it.each([156, 180, 300])('soak1k-%i: the timber chain ends before ships', (i) => {
    expect(birth(i).settlement.institutions.length).toBeGreaterThan(0);
    expect(text(birth(i).settlement)).not.toMatch(/"ships"/); // anchored: the line above proves the roster the texts are read from is live
  });
  // 2026-11-04 (chair's ruling P1): SOAK-3 re-dealt the corpus (the de-aliased cellFor), so the old seed no longer carries this case's premise; re-pointed to the first seed of the new corpus that does (an inland place whose description pool speaks of ships): was 341; 113 still carries it.
  it.each([113, 4])('soak1k-%i: no institution description speaks of ships', (i) => {
    const s = birth(i).settlement;
    const shipDescs = s.institutions.filter((x) => /\bships?\b/i.test(x.desc || '') && !/Auction house/.test(x.name));
    expect(shipDescs.map((x) => x.name)).toEqual([]);
  });
  // 2026-11-04 (chair's ruling P1): SOAK-3 re-dealt the corpus (the de-aliased cellFor), so the old seed no longer carries this case's premise; re-pointed to the first seed of the new corpus that does (an inland thorp): was 192, then 108 (it now has water); 85 still carries it. Re-picked 2026-11-04 after x46-1b and x46-3 composed (the budget moved the corpus again).
  it.each([18, 12, 85])('soak1k-%i: no fisherman', (i) => {
    expect(birth(i).settlement.npcs.length).toBeGreaterThan(0);
    expect(birth(i).settlement.npcs.map((n) => n.role)).not.toContain('Fisherman'); // anchored: the line above proves the roster is live
  });
  // Chair ruling, round 3, 3b: a row the cascade adds after the variant pick takes its ship-free text.
  // 2026-11-04 (chair's ruling P1): SOAK-3 re-dealt the corpus (the de-aliased cellFor), so the old seed no longer carries this case's premise; re-pointed to the first seed of the new corpus that does (an inland place with a cascade-added Ropemaker): was 573, 171. Re-picked 2026-11-04 after x46-1b and x46-3 composed (the budget moved the corpus again).
  // Re-picked 2026-11-06 (LANDING-7 lane D): 23 seats no Ropemaker at all since the compose of
  // lane/rung1b-f6-budget-floor (6d84aa834, bisected by first-parent stage; 7e28a6331 still
  // carries it); 28 is the first seed of the corpus that does (an inland city, water 'none').
  it.each([28, 118])('soak1k-%i: the cascade-added Ropemaker speaks of no ships', (i) => {
    const s = birth(i).settlement;
    const rope = s.institutions.find((x) => x.name === 'Ropemaker');
    expect(rope?.source).toBe('cascade');
    expect(rope.desc).not.toMatch(/\bships?\b/i); // anchored: the line above pins the cascade-added Ropemaker row live
  });
});

describe('the ship captain (hand-built; 2026-11-04, the same class as the fisher)', () => {
  it('no ship captain where there is no water; a river keeps one', () => {
    expect(createGenerationWorldLaw({ terrainType: 'desert', tradeRouteAccess: 'road' }).allowsRole({ role: 'Ship Captain' })).toBe(false);
    expect(createGenerationWorldLaw({ terrainType: 'plains', tradeRouteAccess: 'river' }).allowsRole({ role: 'Ship Captain' })).toBe(true);
  });
  it('soak1k-971 has no ship captain', async () => {
    await ensureLaws();
    expect(birth(971).settlement.npcs.length).toBeGreaterThan(0);
    expect(birth(971).settlement.npcs.map((n) => n.role)).not.toContain('Ship Captain'); // anchored: the line above proves the roster is live
  });
});
