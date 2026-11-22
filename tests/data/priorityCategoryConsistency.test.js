/**
 * priorityCategory is a FACTION-ROLE axis on institutionalCatalog entries (which
 * power bloc the institution answers to) — deliberately distinct from `tags` (an
 * institution's functional domains). The two MAY differ by design: a customs/tax/
 * regulatory body legitimately carries 'trade' tags while sitting under
 * priorityCategory 'government'. So there is no tag→category mapping to enforce.
 *
 * The invariant that DOES hold: a single institution NAME must carry ONE
 * priorityCategory across every tier it appears in. A name that reads 'economy'
 * in one tier and 'government' in another is a data bug — the same institution
 * would match a different faction role purely by settlement tier.
 *
 * A batch of 4 economic PRODUCTION institutions was normalized to 'economy'
 * (they were mislabeled 'government' in the thorp/hamlet tier):
 *   Charcoal burner, Dairy farmer, Salt works, Stone quarry.
 *
 * The quarantine is now FULLY RESOLVED — all 6 cross-tier splits are normalized.
 * The two that were previously quarantined in KNOWN_INCONSISTENT are fixed:
 *   - "Hunter's lodge"          → 'economy' (economic PRODUCTION: hunting/pelts/
 *     game, same class as the 4 above; the 'government' instance was the error)
 *   - "Cartographer's workshop" → 'crafts'  (a skilled-artisan maker's workshop
 *     that crafts a product via skilled labor; the 'economy' instance was flipped)
 * With the quarantine empty, the assertion is now a TRUE-ZERO invariant: NO
 * institution name may carry >1 distinct priorityCategory across tiers.
 */
import { describe, it, expect } from 'vitest';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';

// Quarantine fully resolved: no institution name may split priorityCategory across tiers.
const KNOWN_INCONSISTENT = new Set();

function categoriesByName() {
  const byName = new Map();
  for (const tier of Object.values(institutionalCatalog)) {
    for (const category of Object.values(tier)) {
      for (const [name, def] of Object.entries(category)) {
        if (!def || typeof def !== 'object' || !('priorityCategory' in def)) continue;
        if (!byName.has(name)) byName.set(name, new Set());
        byName.get(name).add(def.priorityCategory);
      }
    }
  }
  return byName;
}

describe('priorityCategory cross-tier consistency', () => {
  const byName = categoriesByName();

  it('no institution NAME carries >1 distinct priorityCategory across tiers (true-zero invariant)', () => {
    const inconsistent = [];
    for (const [name, cats] of byName) {
      if (cats.size > 1) inconsistent.push(name);
    }
    // Quarantine is empty: exact match against KNOWN_INCONSISTENT now asserts
    // TRUE ZERO. A NEW split fails (drift caught); nothing is exempted.
    expect(inconsistent.sort()).toEqual([...KNOWN_INCONSISTENT].sort());
  });

  it('the 4 normalized production institutions are all priorityCategory "economy"', () => {
    for (const name of ['Charcoal burner', 'Dairy farmer', 'Salt works', 'Stone quarry']) {
      const cats = byName.get(name);
      expect(cats, `${name} must be defined in the catalog`).toBeDefined();
      expect([...cats], `${name} must be uniformly "economy"`).toEqual(['economy']);
    }
  });
});
