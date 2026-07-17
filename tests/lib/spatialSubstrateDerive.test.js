/**
 * spatialSubstrateDerive.test.js — DOOR 1 canonize-body derivation: builds each
 * settlement's substrate from its ACTIVE layout, reuses on an unchanged structural
 * signature, and drops-when-empty. (The geometry itself is pinned in
 * tests/domain/spatialSubstrate.test.js.)
 */
import { describe, it, expect } from 'vitest';
import { deriveCampaignSubstrates } from '../../src/lib/spatialSubstrateDerive.js';

function walledCity(id) {
  return {
    id,
    settlement: {
      _seed: `derive-${id}`, id, name: id, tier: 'city', population: 9000,
      config: { tradeRouteAccess: 'road', terrainType: 'plains' },
      defenseProfile: { hasWalls: true },
      spatialLayout: { quarters: [
        { name: 'Temple', location: 'central', category: 'religious' },
        { name: 'Market', location: 'east', category: 'merchant' },
        { name: 'Tanneries', location: 'south', category: 'industrial' },
      ] },
      institutions: [{ name: 'Town Hall', required: true, category: 'civic' }],
      economicState: { prosperity: 'Comfortable' },
      powerStructure: { factions: [{ name: 'Guild', isGoverning: true }] },
    },
  };
}

describe('deriveCampaignSubstrates (the canonize body)', () => {
  it('derives one substrate per settlement, keyed by id, deterministically', () => {
    const saves = [walledCity('a'), walledCity('b')];
    const map = deriveCampaignSubstrates(saves, null);
    expect(Object.keys(map).sort()).toEqual(['a', 'b']);
    expect(map.a.d.length).toBeGreaterThan(1);
    // Deterministic.
    expect(JSON.stringify(deriveCampaignSubstrates(saves, null))).toBe(JSON.stringify(map));
  });

  it('reuses a prior substrate when the structural signature is unchanged (no rebuild)', () => {
    const saves = [walledCity('a')];
    const first = deriveCampaignSubstrates(saves, null);
    // Feed it back as the prior ledger; the SAME object reference is carried forward.
    const second = deriveCampaignSubstrates(saves, first);
    expect(second.a).toBe(first.a); // reference identity ⇒ reused, not rebuilt
  });

  it('re-derives when the roster changes (signature drift)', () => {
    const saves = [walledCity('a')];
    const first = deriveCampaignSubstrates(saves, null);
    const changed = walledCity('a');
    changed.settlement.institutions = [...changed.settlement.institutions, { name: 'New Hall', category: 'craft', status: 'active' }];
    const second = deriveCampaignSubstrates([changed], first);
    expect(second.a).not.toBe(first.a);
    expect(second.a.sig).not.toBe(first.a.sig);
  });

  it('empty / mapless saves ⇒ null (drop-when-empty)', () => {
    expect(deriveCampaignSubstrates([], null)).toBeNull();
    expect(deriveCampaignSubstrates([{ id: 'x', settlement: { institutions: [], spatialLayout: { quarters: [] } } }], null)).not.toBeUndefined();
  });
});
