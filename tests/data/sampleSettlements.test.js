/**
 * tests/data/sampleSettlements.test.js — Tier 8.2 sample fixtures contract.
 *
 * Pins the sample shape so a future drift can't silently empty the
 * dashboard or strip required fields. Three integrity checks:
 *   1. Every sample has the fields the UI reads (name, teaser, tags, config).
 *   2. Sample configs match the live generator's config shape.
 *   3. forkSeedFor produces stable, user-distinguished seeds.
 */

import { describe, it, expect } from 'vitest';
import { SAMPLE_SETTLEMENTS, forkSeedFor } from '../../src/data/sampleSettlements.js';

describe('SAMPLE_SETTLEMENTS shape contract', () => {
  it('ships three samples (matches Tier 8.2 spec)', () => {
    expect(SAMPLE_SETTLEMENTS).toHaveLength(3);
  });

  it('every sample has the fields the dashboard renders', () => {
    for (const sample of SAMPLE_SETTLEMENTS) {
      expect(sample.id).toMatch(/^sample-/);
      expect(typeof sample.name).toBe('string');
      expect(sample.name.length).toBeGreaterThan(0);
      expect(['hamlet', 'village', 'town', 'city', 'capital']).toContain(sample.tier);
      expect(typeof sample.terrain).toBe('string');
      expect(typeof sample.teaser).toBe('string');
      expect(sample.teaser.length).toBeGreaterThan(40); // not a stub
      expect(Array.isArray(sample.tags)).toBe(true);
      expect(sample.tags.length).toBeGreaterThanOrEqual(2);
      expect(sample.tags.length).toBeLessThanOrEqual(4);
    }
  });

  it('every sample config matches the generator config shape', () => {
    for (const sample of SAMPLE_SETTLEMENTS) {
      expect(sample.config).toBeDefined();
      expect(sample.config.settType).toBe(sample.tier);
      expect(sample.config.tradeRouteAccess).toBeDefined();
      expect(sample.config.nearbyTerrain).toBeDefined();
      expect(sample.config.monsterThreat).toBeDefined();
      expect(sample.config.sliders).toBeDefined();
      // Sliders are 0-100 ints; check each is in range so a typo
      // doesn't ship a 500% military weight.
      for (const v of Object.values(sample.config.sliders)) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(100);
      }
      expect(typeof sample.config.seed).toBe('string');
      expect(sample.config.seed.length).toBeGreaterThan(8);
    }
  });

  it('sample ids are unique', () => {
    const ids = SAMPLE_SETTLEMENTS.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('sample seeds are unique (two forks of different samples diverge)', () => {
    const seeds = SAMPLE_SETTLEMENTS.map(s => s.config.seed);
    expect(new Set(seeds).size).toBe(seeds.length);
  });
});

describe('forkSeedFor()', () => {
  const sample = SAMPLE_SETTLEMENTS[0];

  it('returns a seed string when given a valid sample', () => {
    const seed = forkSeedFor(sample, 'user-abc12345');
    expect(typeof seed).toBe('string');
    expect(seed).toContain(sample.config.seed);
  });

  it('appends the user id suffix so different users get different forks', () => {
    const a = forkSeedFor(sample, 'aaaaaaaa-1111');
    const b = forkSeedFor(sample, 'bbbbbbbb-2222');
    expect(a).not.toBe(b);
  });

  it('truncates the user-id suffix to keep seeds short and stable', () => {
    // forkSeedFor uses the first 8 chars of the user id, so two users
    // whose ids differ only after char 8 collide deliberately — same
    // session, same fork.
    const a = forkSeedFor(sample, 'aaaaaaaa-different-tail-1');
    const b = forkSeedFor(sample, 'aaaaaaaa-different-tail-2');
    expect(a).toBe(b);
  });

  it('handles anonymous (no user id) gracefully', () => {
    const seed = forkSeedFor(sample, null);
    expect(typeof seed).toBe('string');
    expect(seed).toContain('anon');
  });

  it('returns null for a malformed sample', () => {
    expect(forkSeedFor(null, 'x')).toBeNull();
    expect(forkSeedFor({}, 'x')).toBeNull();
    expect(forkSeedFor({ config: {} }, 'x')).toBeNull();
  });
});
