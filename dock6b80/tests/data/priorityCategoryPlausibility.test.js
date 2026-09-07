/**
 * priorityCategoryPlausibility.test.js — [data-tables-6].
 *
 * A copy-paste run left the metropolis Criminal entries (Thieves' guild, Black
 * market bazaar, Underground city, Assassins' guild) with faction-role
 * priorityCategory 'entertainment', and a village Crafts run (Midwife/Village
 * scribe/Wildfowler) with 'magic' — while live consumers key off these values
 * (historyGenerator hasCriminal = priorityCategory==='criminal'). Spot-fixed the
 * implausible runs; the deliberate dual-axis divergence elsewhere is untouched
 * (owner-settled). Plausibility guard so an assassins' guild can't read
 * 'entertainment' again.
 */

import { describe, test, expect } from 'vitest';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';

describe('[data-tables-6] priorityCategory spot-fixes', () => {
  const meta = institutionalCatalog.metropolis || {};

  test('the four metropolis Criminal entries are faction-role "criminal"', () => {
    for (const name of ["Thieves' guild (powerful)", 'Black market bazaar', 'Underground city', "Assassins' guild"]) {
      expect(meta.Criminal?.[name]?.priorityCategory, name).toBe('criminal');
    }
  });

  test('the village Crafts run is re-categorised off "magic"', () => {
    const crafts = institutionalCatalog.village?.Crafts || {};
    expect(crafts.Midwife?.priorityCategory).toBe('crafts');
    expect(crafts['Village scribe']?.priorityCategory).toBe('government');
    expect(crafts.Wildfowler?.priorityCategory).toBe('economy');
  });

  // Plausibility ratchet: an entry in a *Criminal* category that is itself
  // criminal-tagged must never carry the 'entertainment' faction role.
  test('RATCHET: no criminal-tagged Criminal-category entry reads as entertainment', () => {
    for (const [tier, cats] of Object.entries(institutionalCatalog)) {
      const criminal = cats.Criminal || {};
      for (const [name, def] of Object.entries(criminal)) {
        if ((def.tags || []).includes('criminal')) {
          expect({ tier, name, cat: def.priorityCategory }).not.toEqual({ tier, name, cat: 'entertainment' });
        }
      }
    }
  });
});
