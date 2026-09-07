/**
 * foundingSeeds.test.js — R-2 registry schema pins.
 *
 * The registry is well-formed: unique ids, real archetype keys, tier hints in range,
 * and every entry carries the editorial fields the Founding Worlds surface renders.
 */
import { describe, it, expect } from 'vitest';
import { FOUNDING_SEEDS, FOUNDING_SEED_IDS, foundingSeedById } from '../../src/data/foundingSeeds.js';
import { ARCHETYPES } from '../../src/components/generate/characterPresets.js';

const TIER_HINTS = new Set(['hamlet', 'village', 'town']);
const ARCH_KEYS = new Set(ARCHETYPES.map((a) => a.key));

describe('the founding-seed registry', () => {
  it('is frozen and non-empty', () => {
    expect(Object.isFrozen(FOUNDING_SEEDS)).toBe(true);
    expect(FOUNDING_SEEDS.length).toBeGreaterThanOrEqual(2);
  });

  it('every entry carries the editorial schema', () => {
    for (const s of FOUNDING_SEEDS) {
      expect(typeof s.id).toBe('string');
      expect(s.id.length).toBeGreaterThan(0);
      expect(typeof s.title).toBe('string');
      expect(s.title.length).toBeGreaterThan(0);
      expect(typeof s.seed).toBe('string');
      expect(s.seed.length).toBeGreaterThan(0);
      expect(TIER_HINTS.has(s.settType)).toBe(true);
      expect(ARCH_KEYS.has(s.archetype)).toBe(true);
      expect(typeof s.synopsis).toBe('string');
      expect(s.synopsis.length).toBeGreaterThan(40);
      expect(typeof s.firstDecade).toBe('string');
      expect(s.firstDecade.length).toBeGreaterThan(20);
      expect(Array.isArray(s.receipts)).toBe(true);
      expect(s.receipts.length).toBeGreaterThan(0);
    }
  });

  it('ids are unique and match FOUNDING_SEED_IDS', () => {
    const ids = FOUNDING_SEEDS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect([...FOUNDING_SEED_IDS]).toEqual(ids);
  });

  it('foundingSeedById resolves and misses safely', () => {
    expect(foundingSeedById(FOUNDING_SEEDS[0].id)).toBe(FOUNDING_SEEDS[0]);
    expect(foundingSeedById('nope')).toBe(null);
  });
});
