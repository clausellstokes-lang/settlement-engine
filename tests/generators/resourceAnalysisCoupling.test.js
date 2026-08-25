/**
 * tests/generators/resourceAnalysisCoupling.test.js — F32 behavior pins.
 *
 * Before F32, generateNarratives fed generateResourceAnalysis the whole terrain
 * slice (TERRAIN_DATA[terrain].allowedResources) as "nearby resources", so the
 * resource-analysis section was IDENTICAL for every settlement on a terrain —
 * decoupled from the resources that settlement actually rolled. resolveNearby
 * Commodities now maps the settlement's real config.nearbyResources through to
 * commodity/key tokens, and evaluateEconomicActivity reconciles those against
 * each chain's rawResource. These pins lock the coupling in:
 *   - same terrain + different nearby resources ⇒ different active-chain sets;
 *   - a depleted node contributes nothing;
 *   - the analysis is a pure function of (terrain, config, institutions).
 */
import { describe, it, expect } from 'vitest';
import {
  generateResourceAnalysis,
  resolveNearbyCommodities,
} from '../../src/generators/resourceGenerator.js';

const TERRAIN = 'mountain'; // allows stone_quarry, mountain_timber, iron_deposits, …

const activeKeys = (analysis) =>
  (analysis.resourceChains || []).map((c) => c.chainKey).sort();

const analyze = (config, institutions = []) =>
  generateResourceAnalysis(
    TERRAIN,
    resolveNearbyCommodities(config, TERRAIN),
    [],
    institutions,
    config,
  );

describe('F32 — resource analysis couples to the settlement, not just the terrain', () => {
  it('two settlements on the same terrain with different nearby resources get different active chains', () => {
    const stoneTown = analyze({ nearbyResources: ['stone_quarry'] });
    const timberTown = analyze({ nearbyResources: ['mountain_timber'] });

    const stoneChains = activeKeys(stoneTown);
    const timberChains = activeKeys(timberTown);

    // The tautology this kills: identical terrain used to force identical chains.
    expect(stoneChains).not.toEqual(timberChains);
    expect(stoneChains).toContain('stone');
    expect(stoneChains).not.toContain('timber');
    expect(timberChains).toContain('timber');
    expect(timberChains).not.toContain('stone');
  });

  it('a commodity reconciles with its chain rawResource across vocabularies (iron ← iron_deposits)', () => {
    // config key 'iron_deposits' → commodity 'iron' → chain rawResource 'iron ore'
    // (the normalized substring bridge). It only surfaces where terrain allows it;
    // stone_quarry's 'stone' commodity must NOT masquerade as iron.
    const commodities = resolveNearbyCommodities({ nearbyResources: ['iron_deposits'] }, TERRAIN);
    expect(commodities).toContain('iron');
    expect(commodities).toContain('iron_deposits');
    expect(commodities).not.toContain('stone');
  });
});

describe('F32 — depleted resources are excluded from the analysis', () => {
  it('a depleted node drops its chain while a live sibling keeps it (nearbyResourcesDepleted)', () => {
    const both = analyze({ nearbyResources: ['stone_quarry', 'mountain_timber'] });
    const stoneDepleted = analyze({
      nearbyResources: ['stone_quarry', 'mountain_timber'],
      nearbyResourcesDepleted: ['stone_quarry'],
    });

    expect(activeKeys(both)).toContain('stone');
    expect(activeKeys(both)).toContain('timber');
    // Worked-out quarry ⇒ no stone chain; the timber sibling is untouched.
    expect(activeKeys(stoneDepleted)).not.toContain('stone');
    expect(activeKeys(stoneDepleted)).toContain('timber');
  });

  it('the manual state map is honoured too (nearbyResourcesState: depleted)', () => {
    const depletedViaState = analyze({
      nearbyResources: ['stone_quarry', 'mountain_timber'],
      nearbyResourcesState: { stone_quarry: 'depleted' },
    });
    expect(activeKeys(depletedViaState)).not.toContain('stone');
    expect(activeKeys(depletedViaState)).toContain('timber');
  });

  it('falls back to the terrain default only when the roster is empty/unresolvable', () => {
    // No rolled roster → terrain allowedResources (old behavior preserved).
    const fallback = resolveNearbyCommodities({ nearbyResources: [] }, TERRAIN);
    expect(fallback.length).toBeGreaterThan(0);
    // An unknown key resolves to nothing → also falls back rather than crashing.
    const unknown = resolveNearbyCommodities({ nearbyResources: ['not_a_real_resource'] }, TERRAIN);
    expect(unknown.length).toBeGreaterThan(0);
  });
});

describe('F32 — analysis is deterministic (pure function of inputs)', () => {
  it('same config + institutions twice ⇒ byte-identical analysis', () => {
    const config = { nearbyResources: ['stone_quarry', 'mountain_timber', 'iron_deposits'] };
    const insts = [{ name: 'Blacksmith', tags: ['metalwork'] }, { name: 'Stone quarry', tags: ['trade'] }];
    const a = generateResourceAnalysis(TERRAIN, resolveNearbyCommodities(config, TERRAIN), [], insts, config);
    const b = generateResourceAnalysis(TERRAIN, resolveNearbyCommodities(config, TERRAIN), [], insts, config);
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b));
  });

  it('resolveNearbyCommodities is order-stable for a fixed config', () => {
    const config = { nearbyResources: ['iron_deposits', 'stone_quarry'] };
    expect(resolveNearbyCommodities(config, TERRAIN)).toEqual(resolveNearbyCommodities(config, TERRAIN));
  });
});
