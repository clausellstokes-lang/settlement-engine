/**
 * Role catalogue tests — roles derive from the institution kind / faction
 * seats, and importance (+ influence) is pulled from the chosen role.
 */

import { describe, test, expect } from 'vitest';
import {
  rolesForInstitution, rolesForFaction, importanceForRole, influenceForImportance,
} from '../../src/domain/roles/roleCatalog.js';

describe('role catalogue', () => {
  test('rolesForInstitution derives roles from the institution kind', () => {
    expect(rolesForInstitution({ name: 'Temple of Mercy' }).some(r => /high priest/i.test(r.role))).toBe(true);
    expect(rolesForInstitution({ name: 'City Watch' }).some(r => /captain/i.test(r.role))).toBe(true);
    // Unknown kind falls back to a generic, non-empty set.
    expect(rolesForInstitution({ name: 'Curiosity Shop' }).length).toBeGreaterThan(0);
    expect(rolesForInstitution(null)).toEqual([]);
  });

  test('importanceForRole pulls the tier from the role list, with name fallback', () => {
    const roles = rolesForInstitution({ name: 'Temple of Mercy' });
    expect(importanceForRole('High Priest', roles)).toBe('pillar');
    expect(importanceForRole('Acolyte', roles)).toBe('notable');
    // A free-typed role not in the list still infers a tier by name pattern.
    expect(importanceForRole('Lord Mayor', [])).toBe('pillar');
    expect(importanceForRole('', roles)).toBeNull();
  });

  test('influenceForImportance maps tiers to a descending 0-100 influence', () => {
    expect(influenceForImportance('pillar')).toBeGreaterThan(influenceForImportance('key'));
    expect(influenceForImportance('key')).toBeGreaterThan(influenceForImportance('notable'));
    expect(influenceForImportance('notable')).toBeGreaterThan(influenceForImportance('minor'));
  });

  test('rolesForFaction returns seat-based roles', () => {
    expect(rolesForFaction({ name: 'Council' }).some(r => /leader/i.test(r.role))).toBe(true);
  });
});
