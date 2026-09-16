/**
 * tests/domain/compendiumSearchDrift.test.js — Compendium-completion Wave H walker.
 *
 * The search index keywords are not shown to the reader, so the W6 prose-drift walker
 * never scanned them — and the phantom 'Affluent' prosperity rung + the pre-correction
 * tier populations survived there. This walker closes that surface:
 *   1. No index entry resurrects the retired 'Affluent' rung.
 *   2. Tier keywords carry the engine's CD.tiers populations, not the old stale bands.
 *   3. Every W6 band ladder is reachable through the search box (they were unindexed).
 */
import { describe, test, expect } from 'vitest';

import { COMPENDIUM_INDEX, searchCompendium } from '../../src/domain/compendium/searchIndex.js';
import { COMPENDIUM_DATA as CD } from '../../src/domain/compendium/generated/compendiumData.generated.js';

describe('compendium search — no retired vocabulary drift (Wave H)', () => {
  test('no index entry surfaces the retired "Affluent" prosperity rung', () => {
    for (const e of COMPENDIUM_INDEX) {
      const hay = `${e.term} ${e.keywords || ''}`.toLowerCase();
      expect(hay.includes('affluent'), `entry "${e.term}" resurrects the phantom 'affluent' rung`).toBe(false);
    }
  });

  test('tier keywords carry the engine populations, not the old stale bands', () => {
    const tierEntries = COMPENDIUM_INDEX.filter((e) => e.category === 'Tier');
    expect(tierEntries.length).toBe(CD.tiers.length);
    for (const t of CD.tiers) {
      const e = tierEntries.find((x) => x.term === t.label);
      expect(e, `tier "${t.label}" indexed`).toBeTruthy();
      expect(e.keywords.includes(`${t.min}-${t.max}`), `tier "${t.label}" keyword missing ${t.min}-${t.max}`).toBe(true);
    }
    const allKw = COMPENDIUM_INDEX.map((e) => e.keywords || '').join(' ');
    for (const stale of ['20-80', '900-4000', '4000-25000']) {
      expect(allKw.includes(stale), `stale tier band ${stale} still in the search index`).toBe(false);
    }
  });

  test('every W6 band ladder is reachable through search', () => {
    for (const l of CD.bandLadders) {
      const hit = searchCompendium(l.concept).some((r) => r.term === l.concept);
      expect(hit, `ladder "${l.concept}" is not searchable`).toBe(true);
    }
  });
});
