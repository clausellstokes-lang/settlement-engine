/**
 * compendiumSearch.test.js — contract over P139 / CP-4 global search.
 *
 * Pins:
 *   • empty / whitespace query → no results
 *   • exact term match ranks first
 *   • prefix + word-boundary + substring + keyword matching all work
 *   • case-insensitivity
 *   • multi-word queries resolve (exact term + out-of-order tokens)
 *   • limit is honored
 *   • every result is a valid navigation target (known tab + anchor)
 *   • index integrity (unique ids, valid tabs)
 */

import { COMPENDIUM_SECTIONS } from '../../src/lib/compendiumSections.js';
import { describe, it, expect } from 'vitest';
import {
  searchCompendium,
  COMPENDIUM_INDEX,
  COMPENDIUM_TABS,
} from '../../src/domain/compendium/searchIndex.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';


describe('searchCompendium', () => {
  it('returns [] for empty or whitespace queries', () => {
    expect(searchCompendium('')).toEqual([]);
    expect(searchCompendium('   ')).toEqual([]);
    expect(searchCompendium(null)).toEqual([]);
    expect(searchCompendium(undefined)).toEqual([]);
  });

  it('ranks an exact term match first', () => {
    const res = searchCompendium('Theocracy');
    expect(res.length).toBeGreaterThan(0);
    expect(res[0].term).toBe('Theocracy');
    expect(res[0].tab).toBe('power');
  });

  it('is case-insensitive', () => {
    const lower = searchCompendium('theocracy');
    const upper = searchCompendium('THEOCRACY');
    expect(lower[0].term).toBe('Theocracy');
    expect(upper[0].term).toBe('Theocracy');
  });

  it('matches by prefix and ranks the shortest (most specific) term first', () => {
    const res = searchCompendium('theo');
    const terms = res.map(r => r.term);
    expect(terms).toContain('Theocracy');
    expect(terms).toContain('Theocratic Economy');
    // shortest term among equal-scoring prefix hits leads
    expect(res[0].term).toBe('Theocracy');
  });

  it('matches multi-word terms exactly', () => {
    const res = searchCompendium('mage city');
    expect(res[0].term).toBe('Mage City');
    expect(res[0].tab).toBe('power');
  });

  it('matches relationship types from the shared data', () => {
    const res = searchCompendium('cold war');
    expect(res[0].term).toBe('Cold War');
    expect(res[0].tab).toBe('neighbour');
  });

  it('matches tiers, routes and threats on the tiers tab', () => {
    expect(searchCompendium('metropolis')[0].term).toBe('Metropolis');
    expect(searchCompendium('port')[0].term).toBe('Port');
    // The threat vocabulary was corrected to the engine's real display names
    // (Safe Heartland / Active Frontier / Embattled Region); 'Frontier' alone was a
    // phantom-adjacent label. A search for 'frontier' still routes to the real arm.
    const frontier = searchCompendium('frontier').map(r => r.term);
    expect(frontier).toContain('Active Frontier');
  });

  it('matches on keyword text, not just the term', () => {
    // "siege" is the Siege stress term AND lives in Besieged Holdout's keywords
    const res = searchCompendium('siege');
    const terms = res.map(r => r.term);
    expect(res[0].term).toBe('Siege');
    expect(terms).toContain('Besieged Holdout');
  });

  it('honors the limit option', () => {
    const res = searchCompendium('a', { limit: 3 });
    expect(res.length).toBeLessThanOrEqual(3);
  });

  it('every result is a valid navigation target', () => {
    const res = searchCompendium('magic', { limit: 20 });
    expect(res.length).toBeGreaterThan(0);
    for (const r of res) {
      expect(COMPENDIUM_TABS).toContain(r.tab);
      expect(typeof r.anchor).toBe('string');
      expect(r.anchor.length).toBeGreaterThan(0);
      expect(typeof r.term).toBe('string');
      expect(typeof r.id).toBe('string');
    }
  });
});

describe('COMPENDIUM_INDEX integrity', () => {
  it('has unique entry ids', () => {
    const ids = COMPENDIUM_INDEX.map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('only references known tabs', () => {
    for (const e of COMPENDIUM_INDEX) {
      expect(COMPENDIUM_TABS).toContain(e.tab);
    }
  });

  it('includes all 30 archetypes', () => {
    const archetypes = COMPENDIUM_INDEX.filter(e => e.category === 'Archetype');
    expect(archetypes.length).toBe(30);
  });

  it('is frozen (immutable)', () => {
    expect(Object.isFrozen(COMPENDIUM_INDEX)).toBe(true);
    expect(Object.isFrozen(COMPENDIUM_INDEX[0])).toBe(true);
  });

  // Owner order 2026-09-16: the Map Lenses and Facets pages left the Compendium (neither
  // the settlement-map lenses nor building interiors ship). No destination tab, index
  // entry, or per-entry id may route a reader, a sitemap row, or a prerender to them.
  it('routes nothing to the removed Map Lenses and Facets pages', () => {
    expectAbsentWithAnchor(COMPENDIUM_TABS, 'lenses', 'calamity', 'COMPENDIUM_TABS');
    expectAbsentWithAnchor(COMPENDIUM_TABS, 'facets', 'calamity', 'COMPENDIUM_TABS');
    const tabs = COMPENDIUM_INDEX.map((e) => e.tab);
    expectAbsentWithAnchor(tabs, 'lenses', 'calamity', 'index entry tabs');
    expectAbsentWithAnchor(tabs, 'facets', 'calamity', 'index entry tabs');
    const categories = COMPENDIUM_INDEX.map((e) => e.category);
    expectAbsentWithAnchor(categories, 'Map Lens', 'Calamity', 'index entry categories');
    const idPrefixes = COMPENDIUM_INDEX.map((e) => e.id.split('-')[0]);
    expectAbsentWithAnchor(idPrefixes, 'lens', 'calamity', 'index entry id prefixes');
  });
});

// ── COMPENDIUM_TABS ⇔ the Compendium's sections (domain-region-dossier-guidance-5) ──
describe('COMPENDIUM_TABS stays in lockstep with the Compendium sections', () => {
  // The index's valid-destination set drifted from the panel (the Living World tab was
  // in the panel but absent here, so the global search could never route to it). This
  // pins the two together. The owner's word of 2026-11-10 replaced the panel's TABS
  // row with section pages, so the one list of sections is lib/compendiumSections.js
  // (a pure module, imported directly — no source scan of the panel is needed any more);
  // My Custom Content is per-reader and is not an index destination.
  it('the catalog sections and COMPENDIUM_TABS are the same set (both directions)', () => {
    const sections = COMPENDIUM_SECTIONS.map((s) => s.tab).filter((t) => t !== 'custom');
    expect(sections.length).toBe(11);
    expect([...COMPENDIUM_TABS].sort()).toEqual([...sections].sort());
  });

  it('the Living World tab is present and searchable (the drift the finding named)', () => {
    expect(COMPENDIUM_TABS).toContain('living');
    const living = COMPENDIUM_INDEX.filter((e) => e.tab === 'living');
    expect(living.length).toBeGreaterThan(0);
    // "war" resolves to a Living World destination among its results.
    const res = searchCompendium('living pantheon');
    expect(res.some((r) => r.tab === 'living')).toBe(true);
  });
});
