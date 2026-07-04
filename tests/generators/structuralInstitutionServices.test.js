/**
 * structuralInstitutionServices.test.js
 *
 * Locks the fidelity fix for infrastructure/structural institutions surfacing
 * UNRELATED services in the dossier.
 *
 * Before the fix, `generateAvailableServices` resolved services for EVERY
 * institution and `getServicesForInstitution` force-returned >= 1 service via a
 * low-confidence fuzzy token matcher. A Water-source-only thorp advertised
 * "Lodging"/"Meals and drink"; a "Sewage system" resolved to piped-water
 * services; "Farmland" resolved to a Mill's "Grain milling".
 *
 * Two layers now guard this:
 *   (a) `isPureStructuralInstitution` skips a purely physical structure (only
 *       housing/water/agriculture/sanitation tags, no dedicated service map)
 *       before resolution, and `generateAvailableServices` filters on it.
 *   (b) the fuzzy fallback is confidence-gated (score >= 2, i.e. at least one
 *       full shared token) so a lone prefix-overlap can no longer force a
 *       foreign service map.
 */

import { describe, test, expect } from 'vitest';
import {
  getServicesForInstitution,
  isPureStructuralInstitution,
} from '../../src/generators/services/serviceResolution.js';
import { generateAvailableServices } from '../../src/generators/servicesGenerator.js';

const inst = (name, tags) => ({ name, category: 'Infrastructure', tags });

describe('isPureStructuralInstitution', () => {
  test.each([
    ['Water source', ['essential', 'water']],
    ['Dwellings (4-16)', ['essential', 'housing']],
    ['Farmland', ['essential', 'agriculture']],
    ['Pasture', ['agriculture']],
    ['Sewage system', ['sanitation']],
  ])('%s is classed structural', (name, tags) => {
    expect(isPureStructuralInstitution(inst(name, tags))).toBe(true);
  });

  test('an institution with a dedicated service map is NOT structural', () => {
    // Aqueduct carries water tags but has an exact INSTITUTION_SERVICES entry.
    expect(isPureStructuralInstitution(inst('Aqueduct or water system', ['essential', 'water']))).toBe(false);
  });

  test('an institution with any service-bearing tag is NOT structural', () => {
    // Public bathhouse mixes a structural tag (sanitation) with a real one (trade).
    expect(isPureStructuralInstitution(inst('Public bathhouse', ['trade', 'sanitation']))).toBe(false);
  });

  test('an empty tag list is not enough to call an institution structural', () => {
    expect(isPureStructuralInstitution(inst('Town crier', []))).toBe(false);
  });
});

describe('fuzzy fallback confidence gate', () => {
  test('a lone prefix-overlap (score 1) no longer forces a foreign service map', () => {
    // "Fishing community" / "Caravanserai" used to force-map onto "Fish market"
    // / "Caravan masters' exchange" on a single prefix hit.
    expect(getServicesForInstitution('Fishing community', 'village', {})).toEqual([]);
    expect(getServicesForInstitution('Caravanserai', 'village', {})).toEqual([]);
  });

  test('a full shared-token match (score >= 2) still resolves', () => {
    // "Sawmill (commercial)" shares the whole token "sawmill" with "Sawmill".
    const svcs = getServicesForInstitution('Sawmill (commercial)', 'village', {}).map((s) => s.name);
    expect(svcs.length).toBeGreaterThan(0);
    expect(svcs).toContain('Lumber milling');
  });
});

describe('generateAvailableServices drops pure-structural institutions', () => {
  const cfg = { tier: 'thorp', priorityMagic: 50, magicExists: true };

  test('a water-source + dwellings only settlement surfaces NO lodging/food services', () => {
    const institutions = [
      inst('Water source', ['essential', 'water']),
      inst('Dwellings (4-16)', ['essential', 'housing']),
      inst('Farmland', ['essential', 'agriculture']),
    ];
    const services = generateAvailableServices('thorp', institutions, {}, cfg);
    expect(services.lodging).toEqual([]);
    expect(services.food).toEqual([]);
    // And nothing anywhere is attributed to a structural institution.
    const structuralNames = new Set(['Water source', 'Dwellings (4-16)', 'Farmland']);
    for (const bucket of Object.values(services)) {
      for (const entry of bucket) {
        expect(structuralNames.has(entry.institution)).toBe(false);
      }
    }
  });

  test('a real inn still surfaces lodging + food', () => {
    const institutions = [
      inst('Water source', ['essential', 'water']),
      { name: 'Inn/Tavern', category: 'Economy', tags: ['trade', 'lodging'] },
    ];
    const services = generateAvailableServices('village', institutions, {}, cfg);
    const lodgingFromInn = services.lodging.some((s) => s.institution === 'Inn/Tavern');
    expect(lodgingFromInn).toBe(true);
    expect(services.food.length).toBeGreaterThan(0);
  });
});
