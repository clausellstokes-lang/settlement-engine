/**
 * tests/generators/reviewFixesWaveA.test.js
 *
 * Positive regression guards for the Wave-A generator correctness fixes. Each of
 * these was a "dead feature reading a field that never exists" defect — the code
 * ran but silently produced nothing — so the guard here is that the intended
 * output now actually appears. The golden master pins that they don't perturb the
 * pinned grid; these pin that they FIRE for the configs they were designed for.
 */
import { describe, it, expect } from 'vitest';
import { setActiveRng, clearActiveRng } from '../../src/generators/rngContext.js';
import { createPRNG } from '../../src/generators/prng.js';
import { generateNPCs } from '../../src/generators/npcGenerator.js';
import { generateResourceAnalysis } from '../../src/generators/resourceGenerator.js';
import { catalogIdForName } from '../../src/data/institutionalCatalog.js';

// ── #3 — strategic-vulnerability note (was dead: filtered g.rawResource, a field
// evaluateInstitutionChain never sets; the gap field is `chain`). ──────────────
describe('generateResourceAnalysis — military strategic-vulnerability note (Finding 3)', () => {
  it('fires for a war-focused settlement with an iron/timber/stone processing gap', () => {
    // A Blacksmiths' guild (processes iron ore) with no nearby iron ore leaves the
    // iron-ore chain unfulfilled → a high-severity gap { chain: 'iron ore' }.
    const analysis = generateResourceAnalysis(
      'plains',
      [],                              // no nearby iron ore
      [],
      [{ name: "Blacksmiths' guild" }],
      { priorityMilitary: 90 },        // very-high military priority
    );
    expect(analysis.gaps.some(g => g.chain === 'iron ore')).toBe(true);
    const notes = analysis.priorityNotes.join(' ');
    expect(notes).toMatch(/strategic vulnerability/i);
    expect(notes).toMatch(/iron ore processing is incomplete/);
  });

  it('stays silent when military priority is low even with the same gap', () => {
    const analysis = generateResourceAnalysis(
      'plains', [], [], [{ name: "Blacksmiths' guild" }], { priorityMilitary: 10 },
    );
    expect(analysis.priorityNotes.join(' ')).not.toMatch(/strategic vulnerability/i);
  });
});

// ── #6 — duplicate Guild Master (famine mandated one, filterByGuild minted a
// second unconditionally). ─────────────────────────────────────────────────────
describe('generateNPCs — no duplicate Guild Master on a stress+guild settlement (Finding 6)', () => {
  const settlement = {
    tier: 'city',
    institutions: [
      { name: 'Merchant guilds (3-8)', category: 'Economy', tags: ['guild', 'trade'], catalogId: catalogIdForName('Merchant guilds (3-8)') },
    ],
    powerStructure: { factions: [{ faction: 'The Merchant Council', category: 'economy', power: 40, isGoverning: true }] },
    economicState: { primaryExports: ['Iron goods'], prosperity: 'Prosperous' },
  };
  // famine mandates a 'Guild Master'; the commerce guild would previously mint a second.
  const config = { culture: 'germanic', stressTypes: ['famine'] };

  const npcsWithSeed = (seed) => {
    setActiveRng(createPRNG(seed));
    try { return generateNPCs(settlement, 'germanic', config); }
    finally { clearActiveRng(); }
  };

  const SEEDS = ['gm-1', 'gm-2', 'gm-3', 'gm-4', 'gm-5'];
  it.each(SEEDS)('never emits two Guild Masters (%s)', (seed) => {
    const guildMasters = npcsWithSeed(seed).filter(n => n.role === 'Guild Master');
    expect(guildMasters.length).toBeLessThanOrEqual(1);
  });

  it('still produces the (single) mandated Guild Master — the scenario is real', () => {
    const totalAcrossSeeds = SEEDS.reduce(
      (sum, s) => sum + npcsWithSeed(s).filter(n => n.role === 'Guild Master').length,
      0,
    );
    expect(totalAcrossSeeds).toBeGreaterThan(0);
  });
});
