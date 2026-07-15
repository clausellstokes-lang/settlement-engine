/**
 * @vitest-environment jsdom
 *
 * settlementMapHoverParity.test.jsx — THE PARITY PIN (SM-2 §4b).
 *
 * The map's building popover must show the SAME derived profile as the dossier's
 * InstitutionCard. buildingHoverModel resolves a building back to its institution
 * and re-derives deriveInstitutionProfile — so parity holds BY CONSTRUCTION. This
 * locks it, plus the two guarantees that make it honest:
 *   • the honesty gate (zero contributions → show:false, never an empty card);
 *   • config-independence (deriveInstitutionProfile reads no config /
 *     latentPantheon, so poisoning config can't move the profile).
 */

import { describe, test, expect } from 'vitest';
import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import {
  deriveInstitutionProfile, resolveInstitutionByName,
} from '../../src/domain/display/institutionProfile.js';
import { buildingHoverModel } from '../../src/components/townMap/hoverModel.js';

// A settlement whose military institution is BACKED by a matching faction (so it
// yields a contribution → show:true), and whose noble institution matches
// nothing (name tokens all ≤2 chars ⇒ no service/chain/gate/faction ⇒ zero
// contributions ⇒ show:false).
function makeSettlement() {
  return {
    _seed: 'parity-1',
    id: 'parity-1',
    name: 'Parity',
    tier: 'town',
    population: 2400,
    config: { terrainType: 'plains', tradeRouteAccess: 'road' },
    spatialLayout: {
      quarters: [
        { name: 'Garrison Quarter', location: 'north', desc: 'barracks and watch', landmarks: ['Barracks'] },
        { name: 'Market Row', location: 'center', desc: 'bazaar and exchange', landmarks: ['Grand Bazaar'] },
      ],
    },
    institutions: [
      { name: 'The Iron Legion Barracks', priorityCategory: 'military', catalogId: 'cat.parity.legion' },
      { name: 'Aa Bb', priorityCategory: 'noble', catalogId: 'cat.parity.nook' },
    ],
    defenseProfile: {},
    economicState: { prosperity: 'Modest' },
    powerStructure: { factions: [{ category: 'military', power: 80, faction: 'The Iron Legion' }] },
  };
}

describe('SettlementMapPane — hover-model parity', () => {
  test('a building`s hover profile deep-equals the dossier`s InstitutionCard derivation', () => {
    const settlement = makeSettlement();
    const model = buildTownMapModel(settlement);
    const building = model.buildings.find((b) => b.name === 'The Iron Legion Barracks');
    expect(building).toBeTruthy();

    const hm = buildingHoverModel(building, settlement);
    expect(hm.show).toBe(true);
    expect(hm.profile).toEqual(
      deriveInstitutionProfile(resolveInstitutionByName(building.name, settlement), settlement),
    );
    // Anti-vacuity: the derivation actually produced a contribution to show.
    expect(hm.profile.contributions.length).toBeGreaterThan(0);
  });

  test('honesty gate — an institution with zero contributions hovers to nothing (show:false)', () => {
    const settlement = makeSettlement();
    const model = buildTownMapModel(settlement);
    const building = model.buildings.find((b) => b.name === 'Aa Bb');
    expect(building).toBeTruthy();

    const hm = buildingHoverModel(building, settlement);
    expect(hm.show).toBe(false);
    expect(hm.profile.contributions.length).toBe(0);
  });

  test('the pane does NOT read config — a poisoned latentPantheon cannot move the profile', () => {
    const settlement = makeSettlement();
    const model = buildTownMapModel(settlement);
    const building = model.buildings.find((b) => b.name === 'The Iron Legion Barracks');

    const clean = buildingHoverModel(building, settlement).profile;
    const poisoned = buildingHoverModel(building, {
      ...settlement,
      config: { ...settlement.config, latentPantheon: { poison: true, primaryDeity: 'Nope' } },
    }).profile;

    expect(poisoned).toEqual(clean);
  });
});
