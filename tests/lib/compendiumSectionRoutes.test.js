/**
 * tests/lib/compendiumSectionRoutes.test.js — the Compendium's section pages are
 * their own routes (the owner, 2026-11-10: "when one clicks on it they are taken to a
 * different page"; the chair's ruling H2).
 *
 * Pins: every section slug resolves to `{ view: 'compendium', params: { section } }`
 * BEFORE the per-entry pattern; viewToPath round-trips it; the per-entry pages keep
 * resolving as entries; and NO compendium entry id may ever equal a reserved slug
 * (the entry page would become unreachable behind the section page).
 */
import { describe, it, expect } from 'vitest';
import { resolveLocation, viewToPath } from '../../src/lib/routes.js';
import { COMPENDIUM_SECTIONS, COMPENDIUM_SECTION_SLUGS } from '../../src/lib/compendiumSections.js';
import { COMPENDIUM_INDEX } from '../../src/domain/compendium/searchIndex.js';
import { compendiumSectionHead } from '../../src/lib/seoCompendium.js';

describe('Compendium section routes (H2)', () => {
  it('declares twelve sections, custom content last', () => {
    expect(COMPENDIUM_SECTIONS).toHaveLength(12);
    expect(COMPENDIUM_SECTIONS[11]).toEqual({ slug: 'custom', tab: 'custom' });
    expect(new Set(COMPENDIUM_SECTION_SLUGS).size).toBe(12);
  });

  it('each slug resolves to its section page and round-trips through viewToPath', () => {
    for (const slug of COMPENDIUM_SECTION_SLUGS) {
      expect(resolveLocation(`/compendium/${slug}`), slug).toEqual({ view: 'compendium', params: { section: slug } });
      expect(viewToPath('compendium', { section: slug })).toBe(`/compendium/${slug}`);
    }
  });

  it('the per-entry pages still resolve as entries', () => {
    expect(resolveLocation('/compendium/tier-thorp')).toEqual({ view: 'compendium', params: { entry: 'tier-thorp' } });
    expect(resolveLocation('/compendium')).toEqual({ view: 'compendium', params: {} });
  });

  it('no compendium entry id equals a reserved section slug', () => {
    const reserved = new Set(COMPENDIUM_SECTION_SLUGS);
    const collisions = COMPENDIUM_INDEX.map((e) => e.id).filter((id) => reserved.has(id));
    expect(collisions).toEqual([]);
    // Anchor: the index is the real one (a live entry id is present).
    expect(COMPENDIUM_INDEX.map((e) => e.id)).toContain('tier-thorp');
  });

  it('every section page has its own head with its own canonical', () => {
    for (const slug of COMPENDIUM_SECTION_SLUGS) {
      const h = compendiumSectionHead(slug);
      expect(h, slug).not.toBeNull();
      expect(h.canonical).toBe(`https://settlementforge.com/compendium/${slug}`);
      expect(h.title).toMatch(/SettlementForge Compendium$/);
    }
  });
});
