/**
 * tests/domain/schemaDrift.test.js - Sanity checks against schema drift.
 *
 * As new canonical fields, aliases, and tags get added, these checks
 * catch the most common forms of "someone added X but forgot Y" drift:
 *
 *   - Version stamps stay structurally valid (positive ints, semver).
 *   - Every alias group declares at least one alias (no empty maps).
 *   - Every TAG_GROUPS bundle is non-empty.
 *   - Every TAG_GROUPS entry references only canonical TAG values
 *     (catches typo'd group entries like ['secrurity']).
 *   - The TAG vocabulary has no accidental duplicates.
 *
 * These are cheap. The whole file runs in milliseconds. Every schema
 * change should pass through here, so future migrations get a free
 * trip-wire.
 */

import { describe, it, expect } from 'vitest';
import {
  SCHEMA_VERSION, SIMULATION_VERSION, GENERATOR_VERSION,
  FIELD_ALIASES,
} from '../../src/domain/settlement.schema.js';
import { TAG, TAG_GROUPS, isKnownTag } from '../../src/data/entityTags.js';

describe('settlement schema versions', () => {
  it('SCHEMA_VERSION is a positive integer', () => {
    expect(Number.isInteger(SCHEMA_VERSION)).toBe(true);
    expect(SCHEMA_VERSION).toBeGreaterThan(0);
  });

  it('SIMULATION_VERSION is a positive integer', () => {
    expect(Number.isInteger(SIMULATION_VERSION)).toBe(true);
    expect(SIMULATION_VERSION).toBeGreaterThan(0);
  });

  it('GENERATOR_VERSION is a semver-shaped string', () => {
    expect(typeof GENERATOR_VERSION).toBe('string');
    expect(GENERATOR_VERSION).toMatch(/^\d+\.\d+\.\d+(?:[-+].+)?$/);
  });
});

describe('FIELD_ALIASES', () => {
  it('every canonical key has at least one alias', () => {
    for (const [canonical, aliases] of Object.entries(FIELD_ALIASES)) {
      expect(Array.isArray(aliases)).toBe(true);
      expect(aliases.length).toBeGreaterThan(0);
      // Alias should never equal its own canonical name.
      expect(aliases).not.toContain(canonical);
    }
  });

  it('no canonical key appears as an alias for another canonical', () => {
    const canonicals = new Set(Object.keys(FIELD_ALIASES));
    for (const aliases of Object.values(FIELD_ALIASES)) {
      for (const a of aliases) {
        expect(canonicals.has(a)).toBe(false);
      }
    }
  });
});

describe('TAG vocabulary', () => {
  it('every TAG.* value is a non-empty string', () => {
    for (const v of Object.values(TAG)) {
      expect(typeof v).toBe('string');
      expect(v.length).toBeGreaterThan(0);
    }
  });

  it('has no duplicate string values', () => {
    const values = Object.values(TAG);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
  });

  it('isKnownTag returns true for every TAG.* constant', () => {
    for (const v of Object.values(TAG)) {
      expect(isKnownTag(v)).toBe(true);
    }
  });

  it('isKnownTag rejects unknown / nullish values', () => {
    expect(isKnownTag('totally_made_up')).toBe(false);
    expect(isKnownTag(null)).toBe(false);
    expect(isKnownTag(undefined)).toBe(false);
    expect(isKnownTag(42)).toBe(false);
  });
});

describe('TAG_GROUPS', () => {
  it('every group is a non-empty array', () => {
    for (const [name, group] of Object.entries(TAG_GROUPS)) {
      expect(Array.isArray(group), `${name} not array`).toBe(true);
      expect(group.length, `${name} empty`).toBeGreaterThan(0);
    }
  });

  it('every TAG_GROUPS entry references only canonical TAG values', () => {
    for (const [name, group] of Object.entries(TAG_GROUPS)) {
      for (const t of group) {
        expect(isKnownTag(t), `${name} references unknown tag "${t}"`).toBe(true);
      }
    }
  });

  it('no group contains duplicate tags', () => {
    for (const [name, group] of Object.entries(TAG_GROUPS)) {
      const unique = new Set(group);
      expect(unique.size, `${name} has duplicates`).toBe(group.length);
    }
  });
});
