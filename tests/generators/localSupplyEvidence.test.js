import { describe, expect, it } from 'vitest';
import { catalogIdForName } from '../../src/data/institutionalCatalog.js';
import {
  hasLocalAgriculturalSupply,
} from '../../src/generators/economy/localSupplyEvidence.js';

describe('local agricultural supply evidence', () => {
  it('recognizes renamed native producers by stable catalog identity', () => {
    const farmland = {
      name: "Mara's western strips",
      catalogId: catalogIdForName('Farmland'),
    };
    const pasture = {
      name: 'The Lower Common',
      catalogId: catalogIdForName('Common grazing land'),
    };

    expect(hasLocalAgriculturalSupply('Farmland', [farmland])).toBe(true);
    expect(hasLocalAgriculturalSupply('Grain fields', [farmland])).toBe(true);
    expect(hasLocalAgriculturalSupply('Grazing land', [pasture])).toBe(true);
  });

  it('retains the name fallback only for unstamped legacy records', () => {
    expect(hasLocalAgriculturalSupply(
      'Grain fields',
      [{ name: 'Common fields' }],
    )).toBe(true);
    expect(hasLocalAgriculturalSupply(
      'Grazing land',
      [{ name: 'Common grazing land' }],
    )).toBe(true);
  });

  it('does not grant native supply mechanics to custom presentation names', () => {
    const customFarmland = {
      name: 'Farmland',
      source: 'custom',
      isCustom: true,
    };
    const customPasture = {
      name: 'Common grazing land',
      customDefinitionId: 'custom-pasture',
    };

    expect(hasLocalAgriculturalSupply('Grain fields', [customFarmland])).toBe(false);
    expect(hasLocalAgriculturalSupply('Grazing land', [customPasture])).toBe(false);
  });

  it('does not treat a downstream processor as proof of local production', () => {
    expect(hasLocalAgriculturalSupply(
      'Grain fields',
      [{ name: 'Mill' }],
    )).toBe(false);
  });
});
